import React, { Fragment, useEffect } from "react";
import { makeStyles } from "@material-ui/core/styles";
import {createClient, Provider, useQuery} from "urql";
import { useDispatch, useSelector } from "react-redux";
import * as actions from '../../store/actions';
import MeasurementChart from './MeasurementChart';
import LastKnownMeasurement from './LastKnownMeasurement';
import SearchBar from "./SearchBar";

const useStyles = makeStyles({
  cardRow: {
    display: "flex",
    flexWrap: "wrap"
  }
});

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});
const query = `
query heartBeat {
  heartBeat
}
`;

const getDataNames = state => {
  const { metricNames } = state.metricNames;
  return {
    metricNames
  };
};



export default () => {
  return (
    <Provider value={client}>
      <MeasurementCard />
    </Provider>
  );
};

const MeasurementCard = () => {
  const classes = useStyles();
const { metricNames } = useSelector(getDataNames);
  const dispatch = useDispatch();
  const [heartBeat, setHeartBeat] = React.useState();
  const [result] = useQuery({
    query
  });

  const { data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data) return;
    setHeartBeat(data.heartBeat);
    dispatch({ type: actions.HEARTBEAT_UPDATED, heartBeat })

  }, [dispatch, data, heartBeat, error]);

  return (
    <Fragment>
      <SearchBar />
      <div className={classes.cardRow}>
        {metricNames
          ? metricNames.map((item, index) => <LastKnownMeasurement metricName={item.metricName} key={index}/>)
          : null}
      </div>
      {metricNames ? <MeasurementChart /> : null}
    </Fragment>
  );
};
