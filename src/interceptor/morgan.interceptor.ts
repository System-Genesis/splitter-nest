import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Response } from 'express';
import { Observable, tap, catchError, throwError } from 'rxjs';

@Injectable()
export class MorganInterceptor implements NestInterceptor {
  private readonly logger = new Logger(MorganInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    const { method, originalUrl: url } = request;

    const now = Date.now();
    return next.handle().pipe(
      tap((res: Response) => {
        const response = context.switchToHttp().getResponse();

        const { statusCode } = response;
        const contentLength = response.get('content-length');

        // method in blue color
        const coloredMethod = `\x1b[34m${method}\x1b[0m`;

        const objectsNum = Array.isArray(res) ? res.length : 1;

        const toLog = {
          coloredMethod,
          url,
          statusCode,
          objectsNum: `${objectsNum} objects`,
          contentLength,
          time: `${Date.now() - now}ms`,
        };

        this.logger.log(
          `${Object.values(toLog)
            .filter((v) => v)
            .join(' ')}`,
        );
      }),
      catchError((err) => {
        this.logger.error(`${method} ${url} - ${err}`);
        return throwError(() => err);
      }),
    );
  }
}
