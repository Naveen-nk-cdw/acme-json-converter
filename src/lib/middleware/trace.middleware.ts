import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid4 } from 'uuid';
import { traceStorage } from '../observability/logger.config';

@Injectable()
export class TraceMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const traceId = uuid4();
    res.setHeader('x-trace-id', traceId);
    const store = new Map();
    store.set('traceId', traceId);
    traceStorage.run(store, () => {
      next();
    });
  }
}
