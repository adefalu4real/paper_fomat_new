// src/utils/errorHandlers.ts

type ErrorResponse = {
  data?: {
    message?: string;
    errors?: Record<string, string>[];
  };
  originalStatus?: number;
  status?: number;
  response?: {
    data?: {
      message?: string;
    } | string;
  };
  message?: string;
  toString?: () => string;
};

const dev = process.env.REACT_APP_NODE_ENV !== "production";

export const loginErrorHandler = (err: ErrorResponse): string => {
  if (dev) console.log(err);

  if (err?.data?.message) return err.data.message;

  if (!err?.originalStatus) return "No Server Response";
  if (err.originalStatus === 400) return "Missing Username or Password";
  if (err.originalStatus === 401) return "Unauthorized";

  return "Login Failed";
};

export const errorHandler = (err: ErrorResponse): string => {
  if (dev) console.log(err);

  if (err?.data?.message) return err.data.message;

  if (!err?.originalStatus) return "No Server Response";
  if (err.originalStatus === 400) return "Missing Username or Password";
  if (err.originalStatus === 401) return "Unauthorized";

  return "OpsSomething went wrong!!!";
};

export const signupErrorHandler = (err: ErrorResponse): string => {
  if (dev) console.log(err);

  if (err?.data?.message) return err.data.message;

  if (err.status === 403 || err.status === 409)
    return "User with the same email or phone number exists";
  if (err.originalStatus === 401) return "Unauthorized";

  return "OpsSomething went wrong!!!";
};

export const responseErrorHandler = (error: ErrorResponse): string => {
  if (dev) console.log(error);

  if (error?.status === 422 && error?.data?.errors) {
    const errorMessages = error.data.errors.map(
      (item) => `${Object.keys(item)[0]}: ${Object.values(item)[0]}`
    );
    return errorMessages.join("\n");
  }

  let resMessage =
    error?.response?.data && typeof error.response.data === "object"
      ? error.response.data.message
      : error?.response?.data || error?.message || error.toString?.();

  switch (error.originalStatus) {
    case 404:
      resMessage = "The requested resource was not found";
      break;
    case 401:
      resMessage = "Unauthorize";
      break;
    case 409:
      resMessage = "Duplicate Entry";
      break;
    case 500:
      resMessage = "Oops Something went wrong Please try again later!!!";
      break;
  }

  if (resMessage === "Request failed with status code 500") {
    resMessage = "Oops Something went wrong Please try again later!!!";
  }

  if (resMessage === "Network Error") {
    resMessage = "Oops, it seems you do not have internet access!!";
  }

  if (resMessage === "invalid signature") {
    resMessage = "Oops Seems the link has expired";
  }

  if (dev) console.log("Error Message: ", resMessage);

  return typeof resMessage === "object"
    ? JSON.stringify(resMessage)
    : resMessage ?? "An unexpected error occurred";
};
