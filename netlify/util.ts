export class HTTPError extends Error {
  response: {
    statusCode: number;
    body: string;
  };

  constructor(statusCode: number, message: string) {
    super(message);
    this.response = {
      statusCode,
      body: JSON.stringify({ message }),
    };
  }
}
