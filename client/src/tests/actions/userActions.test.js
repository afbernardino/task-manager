import configureMockStore from "redux-mock-store";
import thunk from "redux-thunk";
import MockAdapter from "axios-mock-adapter";
import usersAPI from "../../apis/users";
import users from "../fixtures/users";
import { attemptToRegister } from "../../actions/usersActions";
import {
  REGISTER_USER_ATTEMPT,
  REGISTER_USER_SUCCEEDED,
  REGISTER_USER_FAILED
} from "../../actions/users_constants";

// mock redux store
const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

// mock axios user endpoint
const usersMock = new MockAdapter(usersAPI);

// before each test reset axios mock
beforeEach(() => usersMock.reset());

test("Should create success actions for user register", async () => {
  // mock on post request
  usersMock.onPost("/", users[0]).reply(200, {
    token: "sometoken"
  });

  const expectedActions = [
    { type: REGISTER_USER_ATTEMPT },
    { type: REGISTER_USER_SUCCEEDED, payload: { token: "sometoken" } }
  ];

  const store = mockStore({ authToken: null });

  await store.dispatch(attemptToRegister(users[0]));

  expect(store.getActions()).toEqual(expectedActions);
});

test("Should create failed actions for existing user register", async () => {
  // mock on post request
  usersMock.onPost("/", users[0]).reply(400, {
    error: "some error"
  });

  const expectedActions = [
    { type: REGISTER_USER_ATTEMPT },
    { type: REGISTER_USER_FAILED, payload: { error: "some error" } }
  ];

  const store = mockStore({ error: null });

  await store.dispatch(attemptToRegister(users[0]));

  expect(store.getActions()).toEqual(expectedActions);
});
