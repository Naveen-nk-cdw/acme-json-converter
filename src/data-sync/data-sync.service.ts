import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import path from 'node:path';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';

/**
 * Handles data sync between devices using Docker.
 * It provides methods to backup and restore data through file syncing.
 * Stores data inside /app/src/lib/data inside docker container.
 * Stores data inside src/lib/data inside the project on the host machine.
 */
@Injectable()
export class DataSyncService {
    private readonly backupDir: string = '/app/src/lib/data/postgres';
    private readonly backupFile: string = 'seed.sql';
    private readonly fullPath: string = path.join(this.backupDir, this.backupFile);

    /**
     * @decr utility method to run a command in a child process and handle errors.
     * @param command -> root command.
     * @param args -> array of arguments and flags for the command.
     * @param errorMessage Custom error message for failure context.
     * @returns Promise<void>
     */
    private async runCommand(command: string, args: string[], errorMessage: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const child = spawn(command, args, {
                env: {
                    ...process.env,
                    PGPASSWORD: process.env.POSTGRES_PASSWORD,
                },
            });

            let stderr: string = '';

            child.stderr.on('data', (data) => {
                stderr += data.toString();
            });

            child.on('error', (error) => {
                reject(new InternalServerErrorException(`${errorMessage}: ${error.message}`));
            });

            child.on('close', (exitCode) => {
                if (exitCode !== 0) {
                    reject(
                        new InternalServerErrorException(
                            `${errorMessage}: ${stderr || `Exited with ${exitCode}`}`,
                        ),
                    );
                } else {
                    resolve();
                }
            });
        });
    }

    /**
     * @decr Creates a PostgreSQL database backup using pg_dump.
     * @decr The backup file is stored in the specified backup directory.
     * @throws InternalServerErrorException if env vars are missing or backup fails.
     * @returns Promise<void>
     */
    async backup(): Promise<void> {
        fs.mkdirSync(this.backupDir, { recursive: true });

        const pgUser = process.env.POSTGRES_USER;
        const pgDb = process.env.POSTGRES_DB;

        if (!pgUser || !pgDb) {
            throw new InternalServerErrorException('Missing DB config env vars.');
        }

        await this.runCommand(
            'pg_dump',
            ['-U', pgUser, '-h', 'postgres', '-p', '5432', '-d', pgDb, '-f', this.fullPath],
            'Failed to backup DB data',
        );
    }

    /**
     * @decr Restores the PostgreSQL database from a backup file using psql.
     * @throws NotFoundException if the backup file does not exist
     * @throws InternalServerErrorException if the restore process fails.
     * @returns Promise<void>
     */
    async restore(): Promise<void> {
        if (!fs.existsSync(this.fullPath)) {
            throw new NotFoundException('DB data backup file not found.');
        }

        const pgUser = process.env.POSTGRES_USER;
        const pgDb = process.env.POSTGRES_DB;

        if (!pgUser || !pgDb) {
            throw new InternalServerErrorException('Missing DB config env vars.');
        }

        await this.runCommand(
            'psql',
            ['-U', pgUser, '-h', 'postgres', '-p', '5432', '-d', pgDb, '-f', this.fullPath],
            'Failed to restore DB data',
        );
    }
}
