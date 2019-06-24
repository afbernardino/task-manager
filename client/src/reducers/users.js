import {
  REGISTER_USER_ATTEMPT,
  REGISTER_USER_SUCCEEDED,
  REGISTER_USER_FAILED
} from "../actions/users_constants";

const INITIAL_STATE = {
  authToken: null,
  isRegistering: null,
  error: null
};

const getRegisterUserAttempt = state => {
  return { ...state, isRegistering: true };
};

const getSucceededUserRegister = (state, action) => {
  return {
    ...state,
    authToken: action.payload.token,
    isRegistering: false,
    error: null
  };
};

const getFailedUserRegister = (state, action) => {
  return { ...state, isRegistering: false, error: action.payload.error };
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case REGISTER_USER_ATTEMPT:
      return getRegisterUserAttempt(state, action);
    case REGISTER_USER_SUCCEEDED:
      return getSucceededUserRegister(state, action);
    case REGISTER_USER_FAILED:
      return getFailedUserRegister(state, action);
    default:
      return state;
  }
};
