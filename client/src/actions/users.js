import users from "../apis/users";
import {
  REGISTER_USER_ATTEMPT,
  REGISTER_USER_SUCCEEDED,
  REGISTER_USER_FAILED
} from "./users_constants";

export const attemptToRegister = formValues => {
  const attempt = () => {
    return { type: REGISTER_USER_ATTEMPT };
  };

  const success = ({ data }) => {
    return { type: REGISTER_USER_SUCCEEDED, payload: data };
  };

  const failure = ({ data }) => {
    return { type: REGISTER_USER_FAILED, payload: data };
  };

  return async dispatch => {
    dispatch(attempt());
    try {
      const response = await users.post("/", formValues);
      dispatch(success(response));
    } catch (error) {
      const response = error.response
        ? error.response
        : {
            data: {
              error: "Internal error. Please contact the support."
            }
          };
      dispatch(failure(response));
    }
  };
};
