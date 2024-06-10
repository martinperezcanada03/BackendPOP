import { Injectable, NestInterceptor, ExecutionContext, CallHandler, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { page, limit } = request.query;

    console.log('Parámetros de paginación recibidos:', page, limit);

    if ((page && isNaN(+page)) || (limit && isNaN(+limit))) {
      console.log('Parámetros de paginación inválidos:', page, limit);
      throw new BadRequestException('Los parámetros de paginación deben ser números.');
    }

    return next.handle().pipe(
      catchError(error => {
        if (error instanceof BadRequestException) {
          throw new BadRequestException('Parámetros de paginación inválidos.');
        }
        throw error;
      }),
    );
  }
}
