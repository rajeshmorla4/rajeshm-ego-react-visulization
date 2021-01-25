import * as actions from "../actions";

const initialState = {
  metricNames: []
};

const dataNameReceived = (state, action) => {
  const { getDataNamesSelected } = action;
  const { metricNames } = getDataNamesSelected;

  return {
    metricNames
  };
};

const dataNameAdded = (state, action) => {
  if (action.metricNames.length > 0) {
    let metricNames = [];
    action.metricNames.forEach(item => {
      metricNames.push({ metricName: item });
    });
    console.log(metricNames);
    return {
      metricNames
    };
  }
  return {
    state
  };
};

const handlers = {
  [actions.DATA_NAME_RECEIVED]: dataNameReceived,
  [actions.DATA_NAME_ADDED]: dataNameAdded
};

export default (state = initialState, action) => {
  const handler = handlers[action.type];
  if (typeof handler === "undefined") return state;
  return handler(state, action);
};