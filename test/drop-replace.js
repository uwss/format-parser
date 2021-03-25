const format = require("../src/format-parser");

const AssertThat = require("./test-assert");

module.exports = {
  "helloworld": function() {
    let t0 = process.hrtime.bigint();

    let res = format("%a, %b", function(data) {
      let options = data.options;
      let flag = data.flag;

      if(flag === "a") {
        return "Hello";
      }

      if(flag === "b") {
        return "world!";
      }

      throw new format.UnrecognizedError(data);
    });
    
    let tf = process.hrtime.bigint();

    AssertThat(res).Is.EqualTo("Hello, world!");

    return tf - t0;
  },
  "httpexample": function() {
    let body_size = 789;
    let meta_size = 213;
    
    let t0 = process.hrtime.bigint();

    let res = format("%s is the size of the body, %>s is the size of the entire message", function(data) {
      let options = data.options;
      let flag = data.flag;

      if(flag === "s") {
        if(options === "") {
          return body_size;
        }

        if(options === ">") {
          return meta_size + body_size;
        }
      }

      throw new format.UnrecognizedError(data);
    });

    let tf = process.hrtime.bigint();

    AssertThat(res).Is.EqualTo("789 is the size of the body, 1002 is the size of the entire message");

    return tf - t0;
  },
  "percent-escape": function() {
    let num = Math.floor(Math.random()*100);
    
    let t0 = process.hrtime.bigint();
    
    let res = format("The percentage is %i%%", function(data) {
      let options = data.options;
      let flag = data.flag;

      if(flag === "i") {
        return num;
      }

      throw new format.UnrecognizedError(data);
    });

    let tf = process.hrtime.bigint();

    AssertThat(res).Is.EqualTo("The percentage is " + num + "%");

    return tf - t0;
  }
};

