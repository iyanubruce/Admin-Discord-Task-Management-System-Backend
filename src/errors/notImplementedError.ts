import HttpStatus from 'http-status-codes';

import ErrorHandler from './errorHandler';

export default class NotImplementedError extends ErrorHandler {
  protected error_name = 'not implemented';

  protected httpCode = HttpStatus.NOT_IMPLEMENTED;

  public constructor(
    message: string = 'This feature is not implemented',
    error: Error | undefined = undefined,
    data: any = null
  ) {
    super(message, error, data);
    Error.captureStackTrace(this, this.constructor);
  }
}
