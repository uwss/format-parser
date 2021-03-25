class FormatError extends Error {
  constructor(message) {
    super(message);

    this.name = this.constructor.name;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

class UnrecognizedError extends FormatError {
  constructor(data) {
    super(`unrecognized format token: %${data.options}${data.flag}`);

    this.data = data;
  }
}

module.exports = {
  FormatError,
  UnrecognizedError
};

