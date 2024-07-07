import { HttpStatusCode } from "axios";
export class NotFoundException extends Error {
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "NotFoundException";
    this.statusCode = HttpStatusCode.NotFound;
  }
}

export class InternalServerError extends Error {
  public readonly statusCode: number;

  constructor(message?: string) {
    super(message || "INTERNAL SERVER ERROR");
    this.name = "InternalServerException";
    this.statusCode = HttpStatusCode.InternalServerError;
  }
}

export class BadRequestException extends Error {
  public readonly statusCode: number;

  constructor(message: string) {
    super(message);
    this.name = "BadRequestException";
    this.statusCode = HttpStatusCode.BadRequest;
  }
}

export class UnauthoriseException extends Error {
  public readonly statusCode: number;

  constructor(message?: string) {
    super(message || "UNAUTHORISED USER");
    this.name = "UnauthoriseException";
    this.statusCode = HttpStatusCode.Unauthorized;
  }
}

export class TooManyRequestsException extends Error {
  public readonly statusCode: number;

  constructor(message?: string) {
    super(
      message ||
        "You have reached the limit of requests. Please try again later"
    );
    this.name = "UnauthoriseException";
    this.statusCode = HttpStatusCode.TooManyRequests;
  }
}

export class InValidBodyException extends Error {
  public readonly statusCode: number;
  error: string[];

  constructor(error: string[]) {
    super("Invalid Body. Please check your request body and try again");
    this.name = "UnauthoriseException";
    this.statusCode = HttpStatusCode.TooManyRequests;
    this.error = error;
  }
}
