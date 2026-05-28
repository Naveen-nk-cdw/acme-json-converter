import { spawn } from 'node:child_process';
import * as fs from 'node:fs';
import { afterEach } from 'node:test';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { DataSyncService } from './data-sync.service';

jest.mock('node:child_process', () => ({
    spawn: jest.fn(),
}));

jest.mock('node:fs', () => ({
    mkdirSync: jest.fn(),
    existsSync: jest.fn(),
}));

describe('DataSyncService', () => {
    let service: DataSyncService;

    const mockSpawn = spawn as jest.Mock;
    const mockExistsSync = fs.existsSync as jest.Mock;
    const mockMkdirSync = fs.mkdirSync as jest.Mock;

    beforeEach(async () => {
        jest.clearAllMocks();

        process.env.POSTGRES_PASSWORD = 'pgTestPassword';
        process.env.POSTGRES_USER = 'pgTestUser';
        process.env.POSTGRES_DB = 'pgTestDb';

        const module: TestingModule = await Test.createTestingModule({
            providers: [DataSyncService],
        }).compile();

        service = module.get<DataSyncService>(DataSyncService);
    });

    afterEach(() => {
        delete process.env.POSTGRES_PASSWORD;
        delete process.env.POSTGRES_USER;
        delete process.env.POSTGRES_DB;
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('backup', () => {
        it('should create backup successfully', async () => {
            const mockProcess = {
                stderr: {
                    on: jest.fn(),
                },
                on: jest.fn((event, callback) => {
                    if (event === 'close') {
                        callback(0);
                    }
                }),
            };

            mockSpawn.mockReturnValue(mockProcess);

            await service.backup();

            expect(mockMkdirSync).toHaveBeenCalled();

            expect(mockSpawn).toHaveBeenCalledWith(
                'pg_dump',
                expect.arrayContaining([
                    '-U',
                    'pgTestUser',
                    '-h',
                    'postgres',
                    '-p',
                    '5432',
                    '-d',
                    'pgTestDb',
                ]),

                expect.objectContaining({
                    env: expect.objectContaining({
                        PGPASSWORD: 'pgTestPassword',
                    }),
                }),
            );
        });

        it('should throw if env vars are missing', async () => {
            delete process.env.POSTGRES_USER;

            await expect(service.backup()).rejects.toThrow(InternalServerErrorException);

            await expect(service.backup()).rejects.toThrow('Missing DB config env vars.');
        });

        it('should throw if pg_dump fails', async () => {
            const mockProcess = {
                stderr: {
                    on: jest.fn((_, callback) => {
                        callback(Buffer.from('pg_dump failed!'));
                    }),
                },
                on: jest.fn((event, callback) => {
                    if (event === 'close') {
                        callback(1);
                    }
                }),
            };

            mockSpawn.mockReturnValue(mockProcess);

            await expect(service.backup()).rejects.toThrow(InternalServerErrorException);

            await expect(service.backup()).rejects.toThrow('Failed to backup DB data');
        });

        it('should throw if spawn emits error', async () => {
            const mockProcess = {
                stderr: {
                    on: jest.fn(),
                },
                on: jest.fn((event, callback) => {
                    if (event === 'error') {
                        callback(new Error('pg_dump failed!'));
                    }
                }),
            };

            mockSpawn.mockReturnValue(mockProcess);

            await expect(service.backup()).rejects.toThrow(InternalServerErrorException);

            await expect(service.backup()).rejects.toThrow('Failed to backup DB data');
        });
    });

    describe('restore', () => {
        it('should restore backup successfully', async () => {
            mockExistsSync.mockReturnValue(true);

            const mockProcess = {
                stderr: {
                    on: jest.fn(),
                },
                on: jest.fn((event, callback) => {
                    if (event === 'close') {
                        callback(0);
                    }
                }),
            };

            mockSpawn.mockReturnValue(mockProcess);

            await service.restore();

            expect(mockExistsSync).toHaveBeenCalled();

            expect(mockSpawn).toHaveBeenCalledWith(
                'psql',
                expect.arrayContaining([
                    '-U',
                    'pgTestUser',
                    '-h',
                    'postgres',
                    '-p',
                    '5432',
                    '-d',
                    'pgTestDb',
                ]),
                expect.any(Object),
            );
        });

        it('should throw if env missing', async () => {
            delete process.env.POSTGRES_USER;

            await expect(service.restore()).rejects.toThrow(InternalServerErrorException);

            await expect(service.restore()).rejects.toThrow('Missing DB config env vars.');
        });

        it('should throw if backup file does not exist', async () => {
            mockExistsSync.mockReturnValue(false);

            await expect(service.restore()).rejects.toThrow(NotFoundException);

            await expect(service.restore()).rejects.toThrow('DB data backup file not found.');
        });

        it('should throw if psql fails', async () => {
            mockExistsSync.mockReturnValue(true);

            const mockProcess = {
                stderr: {
                    on: jest.fn((_, callback) => {
                        callback(Buffer.from('psql restore failed!'));
                    }),
                },
                on: jest.fn((event, callback) => {
                    if (event === 'close') {
                        callback(1);
                    }
                }),
            };

            mockSpawn.mockReturnValue(mockProcess);

            await expect(service.restore()).rejects.toThrow(InternalServerErrorException);

            await expect(service.restore()).rejects.toThrow(
                'Failed to restore DB data: psql restore failed!',
            );
        });

        it('should throw if spawn emits error', async () => {
            mockExistsSync.mockReturnValue(true);

            const mockProcess = {
                stderr: {
                    on: jest.fn(),
                },
                on: jest.fn((event, callback) => {
                    if (event === 'error') {
                        callback(new Error('psql restore failed!'));
                    }
                }),
            };

            mockSpawn.mockReturnValue(mockProcess);

            await expect(service.restore()).rejects.toThrow(InternalServerErrorException);

            await expect(service.restore()).rejects.toThrow(
                'Failed to restore DB data: psql restore failed!',
            );
        });
    });
});
