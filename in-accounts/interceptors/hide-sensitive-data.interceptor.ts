import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { InAccountDocument } from '../schemas/in-account.schema';

@Injectable()
export class HideSensitiveDataInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    // Outgoing Response
    return next.handle().pipe(
      map((data?: InAccountDocument | InAccountDocument[]) => {
        if (!data || typeof data === 'string') {
          return data;
        }

        if (Array.isArray(data)) {
          const filiteredInAccountDocuments = data.map(
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            (inAccountDocument) => {
              (inAccountDocument as any).teamId = undefined;
              (inAccountDocument as any).password = undefined;
              inAccountDocument.encryptedPassword = undefined;
              inAccountDocument.cookies = undefined;

              return JSON.parse(JSON.stringify(inAccountDocument));
            },
          );

          return filiteredInAccountDocuments;
        } else {
          (data as any).teamId = undefined;
          (data as any).password = undefined;
          data.encryptedPassword = undefined;
          data.cookies = undefined;

          return JSON.parse(JSON.stringify(data));
        }
      }),
    );
  }
}
