import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../lib/common/generated/prisma/client';

@Injectable()
export class PrismaService extends PrismaClient {
    constructor() {
        const POSTGRES_USER = process.env.POSTGRES_USER;
        const POSTGRES_PASSWORD = process.env.POSTGRES_PASSWORD;
        const POSTGRES_DB = process.env.POSTGRES_DB;
        const POSTGRES_PORT = process.env.POSTGRES_PORT;
        const DB_URL = `postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT}/${POSTGRES_DB}`;

        if (!DB_URL) {
            throw new InternalServerErrorException(
                'DB URL cannot be created with existing env variables.',
            );
        }

        const adapter = new PrismaPg({ connectionString: DB_URL });
        super({
            adapter,
        });
    }
}
