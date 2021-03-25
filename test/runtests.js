const tests = require("./test-list");

const assert = require("./test-assert");
const format = require("../src/format-parser");

let test_list = [];
let test_count = 0;

for(let unit_name in tests) {
  let file = tests[unit_name].file;

  const test_unit = require("./" + file);

  for(let test_name in test_unit) {
    test_list.push({
      name: (unit_name + "." + test_name),
      callback: test_unit[test_name]
    });

    ++test_count;
  }
}

console.error("\x1b[34;1mLoaded " + test_count + " tests\x1b[0m\n");

let success_count = 0;
let fail_count = 0;
let error_count = 0;

let unit = "";
let unit_i = 0;

let unit_time = 0n;
let unit_count = 0n;

for(let i = 0; i < test_list.length; ++i) {
  if(test_list[i].name.split(".")[0] !== unit) {
    if(unit_i !== 0) {
      console.error("\x1b[34;1mtotal: " + (unit_time/1000n) + "us\navg  : " + ((unit_time/1000n)/unit_count) + "us (" + unit_count + " tests)\x1b[0m");
    }
    
    ++unit_i;
    unit_count = 0n;
    unit_time = 0n;
    unit = test_list[i].name.split(".")[0];
    console.error("\x1b[34;1mUNIT " + unit_i + " - " + unit + "\x1b[0m\n");
  }
  
  console.error("\x1b[34;1mTest " + (i+1) + "/" + test_count + " - " + test_list[i].name + "\x1b[0m");

  try {
    let time_taken = test_list[i].callback();
    unit_time += time_taken;
    // Since we can't get benchmark info when we error out, we only want to count a test when it succeeds
    ++unit_count;

    console.error("\x1b[32;1mTEST SUCCESS\x1b[0m");
    ++success_count;
  } catch(e) {
    if(e instanceof assert.AssertError) {
      console.error("\x1b[31;1mTEST FAIL: " + e.explain() + "\x1b[0m")
      ++fail_count;
    } else {
      console.error("\x1b[31;1mINTERNAL TEST ERROR: " + e.stack + "\x1b[0m");
      ++error_count;
    }
  }

  console.error();
}

console.error("\x1b[34;1mtotal: " + (unit_time/1000n) + "us\navg  : " + ((unit_time/1000n)/unit_count) + "us (" + unit_count + " tests)\x1b[0m");

if(fail_count | error_count) {
  console.error("\x1b[31;1mformat-parser DID NOT pass: " + success_count + " success, " + fail_count + " failure, " + error_count + " errored, " + test_count + " total\x1b[0m");
  process.exit(1);
} else {
  console.error("\x1b[32;1mformat-parser DID pass: " + success_count + " success, " + fail_count + " failure, " + error_count + " errored, " + test_count + " total\x1b[0m");
}

