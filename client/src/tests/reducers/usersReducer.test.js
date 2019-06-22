import usersReducer from "../../reducers/usersReducer";
import {
  REGISTER_USER_ATTEMPT,
  REGISTER_USER_SUCCEEDED,
  REGISTER_USER_FAILED
} from "../../actions/users_constants";

const INITIAL_STATE = {
  authToken: null,
  isRegistering: null,
  error: null
};

test("Should set default state", () => {
  const state = usersReducer(undefined, { type: "@@INIT" });
  expect(state).toEqual(INITIAL_STATE);
});

test("Should have a state of a user registration attempt", () => {
  const state = usersReducer(undefined, { type: REGISTER_USER_ATTEMPT });
  expect(state).toMatchObject({ isRegistering: true });
});

test("Should have a state of a successful user registration", () => {
  const state = usersReducer(undefined, {
    type: REGISTER_USER_SUCCEEDED,
    payload: { token: "sometoken" }
  });

  expect(state).toMatchObject({
    isRegistering: false,
    authToken: "sometoken",
    error: null
  });
});

test("Should have a state of a failed user registration", () => {
  const state = usersReducer(undefined, {
    type: REGISTER_USER_FAILED,
    payload: { error: "some error" }
  });

  expect(state).toMatchObject({
    isRegistering: false,
    authToken: null,
    error: "some error"
  });
});
