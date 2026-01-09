import HttpStatus from 'http-status-codes';

import ErrorHandler from './errorHandler';

export default class UnassignedFunctionRoutingError extends ErrorHandler {
  protected error_name = 'unassigned function routing';

  protected httpCode = HttpStatus.INTERNAL_SERVER_ERROR;

  public constructor(
    message: string = 'Function routing for the requested feature is not assigned',
    error: Error | undefined = undefined,
    data: any = null
  ) {
    super(message, error, data);
    Error.captureStackTrace(this, this.constructor);
  }
}
