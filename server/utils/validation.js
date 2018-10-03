const isEmpty = value => value === undefined || value === null || value === '';
const join = rules => (value, data, params) => rules.map(rule => rule(value, data, params)).filter(error => !!error)[0];

//  ^             >>>  asserts position at start of a line
//  ------------------------------------------------------------------
//  [A-Z0-9._%+-] >>>  Match a single character present in the list
//  ------------------------------------------------------------------
//  @             >>> matches the character '@' literally (case sensitive)
//  ------------------------------------------------------------------
// [A-Z0-9.-]     >>> Match a single character present in the list
//  ------------------------------------------------------------------
//  \.            >>> matches the character '.' literally (case sensitive) ('\' escape character '.')
//  ------------------------------------------------------------------
// [A-Z]{2,4}     >>> Match a single character present in the list
//  ------------------------------------------------------------------
//  $             >>> asserts position at the end of a line

// emailPattern = /^\S+@\S+\.\S+/
// passwordPattern = /^\S{4,}$/
// usernamePattern = /^[A-Za-z0-9_]{4,21}$/
// basicTextMaxLengthPattern = /^(?=\s*\S)(.{1,35})$/
// basicTextPattern = /^(?=\s*\S)(.{1,})$/;
// textSpaceMaxLengthOnlyPattern = /^[a-zA-Z ]{1,35}$/

// Username pattern="\\s*^[A-Za-z0-9_]{4,21}$\\s*"
// Username must be 4-21 characters long. Letters, numbers, underscores only, no whitespace

// Password pattern="\\S{4,}"
// Password must be at least 4 characters long. No whitespace allowed

// Name pattern="\\s*^(?=\\s*\\S)(.{1,35})$\\s*"
// Please type a valid Name. Maximum 35 characters

export function username(value) {
  if (!isEmpty(value) && !/^[A-Za-z0-9_]{4,21}$/i.test(value)) {
    return 'Invalid username';
  }
}

export function email(value) {
  // Let's not start a debate on email regex. This is just for an example app!
  if (!isEmpty(value) && !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(value)) {
    return 'Invalid email address';
  }
}

export function required(value) {
  if (isEmpty(value)) {
    return 'Required';
  }
}

export function minLength(min) {
  return value => {
    if (!isEmpty(value) && value.length < min) {
      return `Must be at least ${min} characters`;
    }
  };
}

export function maxLength(max) {
  return value => {
    if (!isEmpty(value) && value.length > max) {
      return `Must be no more than ${max} characters`;
    }
  };
}

export function integer(value) {
  if (!isEmpty(value) && !Number.isInteger(Number(value))) {
    return 'Must be an integer';
  }
}

export function oneOf(enumeration) {
  return value => {
    if (!enumeration.includes(value)) {
      return `Must be one of: ${enumeration.join(', ')}`;
    }
  };
}

export function match(field) {
  return (value, data) => {
    if (data) {
      if (value !== data[field]) {
        return 'Do not match';
      }
    }
  };
}

export function createValidator(rules, params) {
  return (data = {}) => {
    const errors = {};
    Object.keys(rules).forEach(key => {
      const rule = join([].concat(rules[key])); // concat enables both functions and arrays of functions
      const error = rule(data[key], data, { key, ...params });
      if (error) {
        errors[key] = error;
      }
    });
    return errors;
  };
}
