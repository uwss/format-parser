let format = require("./format");
let timestamp = require("./timestamp");

const {
  FormatError,
  UnrecognizedError
} = require("./errors");

format.timestamp = timestamp;

format.FormatError = FormatError;
format.UnrecognizedError = UnrecognizedError;

module.exports = format;

