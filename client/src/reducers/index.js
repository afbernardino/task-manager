import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import userReducer from "./usersReducer";

export default combineReducers({
  user: userReducer,
  form: formReducer
});
