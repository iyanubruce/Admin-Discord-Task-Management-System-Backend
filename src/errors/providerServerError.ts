import HttpStatus from 'http-status-codes';

import ErrorHandler from './errorHandler';

export default class ProviderServerError extends ErrorHandler {
  protected error_name = 'provider_server_error';

  protected httpCode = HttpStatus.BAD_GATEWAY;

  public constructor(message: string = 'Provider server error', error: Error | undefined = undefined, data: any = null) {
    super(message, error, data);
    Error.captureStackTrace(this, this.constructor);
  }
}
