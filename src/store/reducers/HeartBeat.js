import * as actions from "../actions";

const initialState = {
  heartBeat: null
};

const heartBeatUpdated = (state, action) => {
  console.log(action.heartBeat)
  return {
    heartBeat: action.heartBeat
  };
};

const handlers = {
  [actions.HEARTBEAT_UPDATED]: heartBeatUpdated,
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};
