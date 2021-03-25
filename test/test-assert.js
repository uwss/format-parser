class AssertError extends Error {
  constructor(value1, value2, condition) {
    super(JSON.stringify(value1) + " is not " + condition + " " + JSON.stringify(value2));

    this.name = this.constructor.name;

    Error.captureStackTrace(this, this.constructor);
  }

  explain() {
    return this.message;
  }
}

class AssertValue {
  constructor(value) {
    this.value = value;
  }

  EqualTo(other) {
    if(this.value == other) {
      return true;
    }

    throw new AssertError(this.value, other, "equal to");
  }

  EqualToStrict(other) {
    if(this.value === other) {
      return true;
    }

    throw new AssertError(this.value, other, "equal to");
  }

  GreaterThan(other) {
    if(this.value > other) {
      return true;
    }

    throw new AssertError(this.value, other, "greater than");
  }

  GreaterThanOrEqualTo(other) {
    if(this.value >= other) {
      return true;
    }

    throw new AssertError(this.value, other, "greater than or equal to");
  }

  LessThan(other) {
    if(this.value < other) {
      return true;
    }

    throw new AssertError(this.value, other, "less than");
  }

  LessThanOrEqualTo(other) {
    if(this.value <= other) {
      return true;
    }

    throw new AssertError(this.value, other, "less than or equal to");
  }

  NotEqualTo(other) {
    if(this.value != other) {
      return true;
    }

    throw new AssertError(this.value, other, "not equal to");
  }

  NotEqualToStrict(other) {
    if(this.value !== other) {
      return true;
    }

    throw new AssertError(this.value, other, "not equal to");
  }
}

function AssertThat(value) {
  return { Is: new AssertValue(value) };

  // AssertThat(x).Is.EqualTo(y)
}

AssertThat.AssertValue = AssertValue;
AssertThat.AssertError = AssertError;

module.exports = AssertThat;

