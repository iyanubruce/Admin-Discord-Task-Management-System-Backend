import HttpStatus from 'http-status-codes';

import ErrorHandler from './errorHandler';

export default class NotSupportedError extends ErrorHandler {
  protected error_name = 'not supported';

  protected httpCode = HttpStatus.NOT_IMPLEMENTED;

  public constructor(message: string = 'Operation not supported', error: Error | undefined = undefined, data: any = null) {
    super(message, error, data);
    Error.captureStackTrace(this, this.constructor);
  }
}
