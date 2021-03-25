const format = require("./format-parser.js");

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday"
];

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December"
];

function time_unit(time, utc, data, flip_utc) {
  let options = data.options;
  let flag = data.flag;

  if(flag === "a") {
    if(options === "") {
      if(!utc) return weekdays[time.getDay()].substring(0, 3);
      return weekdays[time.getUTCDay()].substring(0, 3);
    }
  } else if(flag === "A") {
    if(options === "") {
      if(!utc) return weekdays[time.getDay()];
      return weekdays[time.getUTCDay()];
    }
  } else if(flag === "b") {
    if(options === "") {
      if(!utc) return months[time.getMonth()].substring(0, 3);
      return months[time.getUTCMonth()].substring(0, 3);
    }
  } else if(flag === "B") {
    if(options === "") {
      if(!utc) return months[time.getMonth()];
      return months[time.getUTCMonth()];
    }
  } else if(flag === "c") {
    if(options === "") {
      if(!utc) return module.exports(time, "%Y-%m-%dT%H:%M:%SZ%z");
      return module.exports(time, "%u%Y-%m-%dT%H:%M:%SZ%z");
    }
  } else if(flag === "d") {
    if(options === "") {
      if(!utc) return time.getDate().toString().padStart(2, "0");
      return time.getUTCDate().toString().padStart(2, "0");
    } else if(options === "-") {
      if(!utc) return time.getDate().toString();
      return time.getUTCDate().toString();
    }
  } else if(flag === "f") {
    if(options === "") {
      if(!utc) return time.getMilliseconds().toString().padStart(3, "0");
      return time.getUTCMilliseconds().toString().padStart(3, "0");
      // Yes, I know adding a check for UTC is stupid, but humans are some pretty
      // weird creatures, and there is probably a time zone out there that has a
      // couple of milliseconds offset.
    }
  } else if(flag === "h") {
    let hours;
    if(!utc) hours = (time.getHours()%12);
    else hours = (time.getUTCHours()%12);
    if(hours === 0) hours = 12;

    if(options === "") {
      return hours.toString().padStart(2, "0");
    } else if(options === "-") {
      return hours.toString();
    }
  } else if(flag === "H") {
    if(options === "") {
      if(!utc) return time.getHours().toString().padStart(2, "0");
      return time.getUTCHours().toString().padStart(2, "0");
    } else if(options === "-") {
      if(!utc) return time.getHours().toString();
      return time.getHours().toString();
    }
  } else if(flag === "m") {
    if(options === "") {
      if(!utc) return (time.getMonth()+1).toString().padStart(2, "0");
      return (time.getUTCMonth()+1).toString().padStart(2, "0");
    } else if(options === "-") {
      if(!utc) return (time.getMonth()+1).toString();
      return (time.getUTCMonth()+1).toString();
    }
  } else if(flag === "M") {
    if(options === "") {
      if(!utc) return time.getMinutes().toString().padStart(2, "0");
      return time.getUTCMinutes().toString().padStart(2, "0");
    } else if(options === "-") {
      if(!utc) return time.getMinutes().toString();
      return time.getUTCMinutes().toString();
    }
  } else if(flag === "p") {
    if(options === "" || options === "-") {
      if((utc?time.getUTCHours():time.getHours()) >= 12) {
        return "p" + (options === ""?"m":"");
      } else {
        return "a" + (options === ""?"m":"");
      }
    }
  } else if(flag === "P") {
    if(options === "" || options === "-") {
      if((utc?time.getUTCHours():time.getHours()) >= 12) {
        return "P" + (options === ""?"M":"");
      } else {
        return "A" + (options === ""?"M":"");
      }
    }
  } else if(flag === "S") {
    if(options === "") {
      if(!utc) return time.getSeconds().toString().padStart(2, "0");
      return time.getUTCSeconds().toString().padStart(2, "0");
    } else if(options === "-") {
      if(!utc) return time.getSeconds().toString();
      return time.getUTCSeconds().toString();
    }
  } else if(flag === "u") {
    if(options === "") {
      flip_utc();
      return "";
    }
  } else if(flag === "W") {
    if(options === "") {
			let target = new Date(time);
    	let day = (target.getDay() + 6) % 7;
    	target.setDate(target.getDate() - day + 3);
    	
			let first_thursday = target.valueOf();
    	target.setMonth(0, 1);
    	
			if(target.getDay() !== 4) {
      	target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    	}

    	let res = 1 + Math.ceil((first_thursday - target) / 604800000);

      return res.toString().padStart(2, "0");
    } else if(options === "-") {
			let target = new Date(time);
    	let day = (target.getDay() + 6) % 7;
    	target.setDate(target.getDate() - day + 3);
    	
			let first_thursday = target.valueOf();
    	target.setMonth(0, 1);
    	
			if(target.getDay() !== 4) {
      	target.setMonth(0, 1 + ((4 - target.getDay()) + 7) % 7);
    	}

    	let res = 1 + Math.ceil((first_thursday - target) / 604800000);

      return res.toString();
    }
  } else if(flag === "y") {
    if(options.startsWith("|")) {
      let positions = parseInt(options.substring(1));
      let year;
      if(!utc) year = time.getFullYear().toString();
      else year = time.getUTCFullYear().toString();

      return year.substring(Math.max(year.length-positions, 0)).replace(/^0+/, "");
    } else if(options.match(/^.[0-9]+$/)) {
      let padChar = options[0];
      let positions = parseInt(options.substring(1));
      let year;
      if(!utc) year = time.getFullYear().toString();
      else year = time.getUTCFullYear().toString();

      return year.substring(Math.max(year.length-positions, 0)).replace(/^0+/, "").padStart(positions, padChar);
    } else if(options.match(/^[0-9]+$/)) {
      let positions = parseInt(options);
      let year;
      if(!utc) year = time.getFullYear().toString();
      else year = time.getUTCFullYear().toString();

      return year.substring(Math.max(year.length-positions, 0)).padStart(positions, "0");
    } else {
      if(!utc) return time.getFullYear().toString().substring(Math.max(time.getFullYear().toString().length-2, 0)).padStart(2, "0");
      return time.getUTCFullYear().toString().substring(Math.max(time.getUTCFullYear().toString().length-2, 0)).padStart(2, "0");
    }
  } else if(flag === "Y") {
    if(options === "") {
      if(!utc) return time.getFullYear().toString()
      return time.getUTCFullYear().toString()
    }
  } else if(flag === "z") {
    if(options === "") {
      if(!utc) {
        let res = (time.getTimezoneOffset()>=0?"-":"+") + Math.abs(time.getTimezoneOffset()/60).toString().padStart(2, "0");
        res += (Math.abs(time.getTimezoneOffset())%60).toString().padStart(2, "0");
        return res;
      }

      return "+0000";
    } else if(options === "-") {
      if(!utc) {
        let res = (time.getTimezoneOffset()>=0?"-":"+") + Math.abs(time.getTimezoneOffset()/60).toString();
        res += (Math.abs(time.getTimezoneOffset())%60).toString().padStart(2, "0");
        return res;
      }

      return "+000";
    }
  } else if(flag === "Z") {
    if(options === "") {
      if(!utc) {
        let res = (time.getTimezoneOffset()>=0?"-":"+") + Math.abs(time.getTimezoneOffset()/60).toString().padStart(2, "0");
        res += ":";
        res += (Math.abs(time.getTimezoneOffset())%60).toString().padStart(2, "0");
        return res;
      }

      return "+00:00";
    } else if(options === "-") {
      if(!utc) {
        let res = (time.getTimezoneOffset()>=0?"-":"+") + Math.abs(time.getTimezoneOffset()/60).toString();
        res += ":";
        res += (Math.abs(time.getTimezoneOffset())%60).toString().padStart(2, "0");
        return res;
      }

      return "+0:00";
    }
  }

  throw new format.UnrecognizedError(data);
}

/**
 * @param time   An instance of Date to use to format the string.
 * @param fmt    The format string to use
 *
 * Formats:
 *   %%   -  A literal percent (%)
 *   %a   -  Abbreviated weekday name
 *   %A   -  Full weekday name
 *   %b   -  Abbreviated month name
 *   %B   -  Full month name
 *   %c   -  ISO 8601 Date and time stamp (according to current UTC mode)
 *   %d   -  Zero-padded date number
 *   %-d  -  Date number (not padded)
 *   %f   -  Zero-padded fractional (millisecond) time
 *   %h   -  12-Hour Number (zero-padded)
 *   %-h  -  12-Hour Number (not padded)
 *   %H   -  24-Hour Number (zero-padded)
 *   %-H  -  24-Hour Number (not padded)
 *   %m   -  Zero-padded month number
 *   %-m  -  Month number (not padded)
 *   %M   -  Zero-padded minute number
 *   %-M  -  Minute number (not padded)
 *   %p   -  "am" or "pm"
 *   %-p  -  "a" or "p"
 *   %P   -  "AM" or "PM"
 *   %-P  -  "A" or "P"
 *   %S   -  Zero-padded seconds number
 *   %-S  -  Seconds number (not padded)
 *   %u   -  A switch to enable use of UTC time instead of local time. (Default: local, doesn't output anything)
 *   %W   -  Zero-padded ISO 8601 week number
 *   %-W  -  ISO 8601 week number (not padded)
 *   %y   -  Abbreviated year number (zero-padded, 2-digits)
 *   %#y  -  Abbreviated year number (zero-padded) (ex. "%3y": 3-digit year)
 *   %*#y -  Abbreviated year number (padded with specified character) (ex. "% 3y" in 2021 gives " 21")
 *   %|#y -  Abbreviated year number (straight, no padding) (see above example (%#y))
 *   %Y   -  Full year number
 *   %z   -  Timezone offset in format ("+" | "-") 4*digit (Using in UTC mode just returns constant "+0000")
 *   %-z  -  Timezone offset in format ("+" | "-") (3-4)*digit (Unpadded hour) (Using in UTC mode just returns constant "+000")
 *   %Z   -  Timezone offset in format ("+" | "-") 2*digit ":" 2*digit (Using in UTC mode just returns constant "+00:00")
 *   %-Z  -  Timezone offset in format ("+" | "-") (1-2)*digit ":" 2*digit (Unpadded hour) (Using in UTC mode just returns constant "+0:00")
 */
module.exports = function timestamp(time, fmt) {
  let utc = false;

  return format(fmt, function(data) {
    return time_unit(time, utc, data, function() {
      utc = !utc;
    });
  });
};

