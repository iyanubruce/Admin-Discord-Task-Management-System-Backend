import HttpStatus from 'http-status-codes';

import ErrorHandler from './errorHandler';

export default class MissingInputError extends ErrorHandler {
  protected error_name = 'missing input';

  protected httpCode = HttpStatus.BAD_REQUEST;

  public constructor(message: string = 'Required input is missing', error: Error | undefined = undefined, data: any = null) {
    super(message, error, data);
    Error.captureStackTrace(this, this.constructor);
  }
}
