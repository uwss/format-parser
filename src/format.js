const terminate = "abcdefghijklmnopqrstuvwxyz";

const errors = require("./errors");

module.exports = function format(str, callback) {
  let result = "";

  for(let i = 0; i < str.length; ++i) {
    if(str[i] !== "%") {
      result += str[i];
    } else {
      let d = "";

      let ignore = false;

      while(true) {
        ++i;

        if(d === "" && str[i] === "%") {
          result += "%";
          ignore = true;
          break;
        }

        if(str[i] === undefined) {
          throw new errors.FormatError("end of string reached before token finished");
        }

        d += str[i];

        if(terminate.includes(str[i].toLowerCase())) {
          break;
        }
      }
      
      if(!ignore) {
        result += callback({
          options: d.substring(0, d.length-1),
          flag: d.substring(d.length-1)
        }).toString();
      }
    }
  }

  return result;
};

