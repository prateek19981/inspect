export const initialState = null;
export const userReducer = (state, action) => {
  if (action.type === "USERLOGIN") {
    return action.user;
  }
  if (action.type === "USERLOGOUT") {
    return null;
  }
  if (action.type === "USERFOLLOW") {
    return action.user;
  }
  if (action.type === "UPDATEPIC") {
    return {
      ...state,
      profilepic: action.profilepic,
    };
  }

  return state;
};
