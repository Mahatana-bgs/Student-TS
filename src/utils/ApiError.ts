export class ApiError extends Error {
  statusCode: number;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.name = 'ApiError';
    Object.setPrototypeOf(this, ApiError.prototype);
  }

  toJSON() {
    return {
      success: false,
      message: this.message,
      statusCode: this.statusCode,
    };
  }
}
