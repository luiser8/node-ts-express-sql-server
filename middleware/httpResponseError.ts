export class httpResponseError extends Error {
    statusCode: number;
    constructor(message = "Internal server error", statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
    }
  }