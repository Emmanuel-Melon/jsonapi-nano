import {
  Injectable,
  type NestInterceptor,
  type ExecutionContext,
  type CallHandler,
} from "@nestjs/common";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import type { Response } from "express";

@Injectable()
export class JsonApiInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Set the mandatory JSON:API specification header
    response.setHeader("Content-Type", "application/vnd.api+json");

    return next.handle().pipe(map((data) => data));
  }
}
