// each function gives back an object of errors. empty object means everything is fine.

export function checkSignup(values) {
  const errors = {};

  if (!values.username.trim()) {
    errors.username = "Please enter a username";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email";
  } else if (!values.email.includes("@") || !values.email.includes(".")) {
    errors.email = "That email does not look right";
  }

  if (values.password.length < 8) {
    errors.password = "Password must be at least 8 characters";
  }

  if (values.confirm !== values.password) {
    errors.confirm = "Passwords do not match";
  }

  return errors;
}
