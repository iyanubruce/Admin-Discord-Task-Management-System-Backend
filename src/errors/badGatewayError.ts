import HttpStatus from 'http-status-codes';

import ErrorHandler from './errorHandler';

export default class BadGatewayError extends ErrorHandler {
  protected error_name = 'bad_gateway';

  protected httpCode = HttpStatus.BAD_GATEWAY;

  public constructor(message: string = 'Bad gateway', error: Error | undefined = undefined, data: any = null) {
    super(message, error, data);
    Error.captureStackTrace(this, this.constructor);
  }
}
