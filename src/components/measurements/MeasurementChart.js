import React, { Fragment, useEffect } from "react";
import { createClient, Provider, useQuery } from "urql";
import { useDispatch, useSelector } from "react-redux";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Legend, Label
} from "recharts";
import moment from "moment";
import * as actions from '../../store/actions';

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});
const query = `
query($input: [MeasurementQuery]) {
  getMultipleMeasurements(input: $input) {
    metric
    measurements {
      metric
      at
      value
      unit
    }
  }
}
`;

const getMetricNames = state => {
  const { metricNames } = state.metricNames;
  return {
    metricNames
  };
};
const getHeartBeat = state => {
  const { heartBeat } = state.heartBeat;
  return {
    heartBeat
  };
};

export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};

const Chart = () => {
  const { metricNames } = useSelector(getMetricNames);
  const { heartBeat } = useSelector(getHeartBeat);
  const dispatch = useDispatch();
  const [newData, setNewData] = React.useState([]);
  const [merged, setMerged] = React.useState([]);
  const updatedMetricNames = metricNames
    ? metricNames.map(item => {
        item.after = heartBeat - 1800000;
        return item;
      })
    : null;
  const [result, executeQuery] = useQuery({
    query,
    skip: !updatedMetricNames,
    variables: {
      input: updatedMetricNames ? updatedMetricNames : metricNames
    }
  });

  const { data, error } = result;
  useEffect(() => {
    setNewData([]);
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data) return;
    // TODO put initial chart data
    data.getMultipleMeasurements.map(item => {
      return newData.push(item.measurements);
    });
    let merged = [].concat.apply([], newData);
    merged.map(item => {
      item[item.metric] = item.value;
    });
    setMerged(merged);
  }, [dispatch, data, error, executeQuery]);
  let xAxisTickFormatter = date => {
    return moment.unix(date).format("hh:mm");
  };
  return (
    <Fragment>
      <ResponsiveContainer width="100%" maxHeight={500}>
        <LineChart
          height={600}
          data={merged}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="at"
            type={"date"}
            tickFormatter={xAxisTickFormatter}
          />
          <YAxis yAxisId="F">
            <Label
              value="F"
              offset={15}
              position="bottom"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <YAxis yAxisId="PSI" orientation="left">
            <Label
              value="PSI"
              offset={15}
              position="bottom"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          <YAxis yAxisId="%" orientation="left">
            <Label
              value="%"
              offset={15}
              position="bottom"
              style={{ textAnchor: "middle" }}
            />
          </YAxis>
          {/*<Tooltip />*/}
          <Legend />
          {metricNames
            ? metricNames.map((metricName, index) => {
                let yID;
                if (
                  metricName.metricName === "tubingPressure" ||
                  metricName.metricName === "casingPressure"
                ) {
                  yID = "PSI";
                  return (
                    <Line
                      key={index}
                      yAxisId={yID}
                      type="linear"
                      xAxisID="at"
                      name={metricName.metricName}
                      dataKey={metricName.metricName}
                      stroke={
                        "#" + (((1 << 24) * Math.random()) | 0).toString(16)
                      }
                      activeDot={{ r: 5 }}
                      dot={false}
                    />
                  );
                } else if (
                  metricName.metricName === "oilTemp" ||
                  metricName.metricName === "flareTemp" ||
                  metricName.metricName === "waterTemp"
                ) {
                  yID = "F";
                  return (
                    <Line
                      key={index}
                      yAxisId={yID}
                      type="linear"
                      xAxisID="at"
                      name={metricName.metricName}
                      dataKey={metricName.metricName}
                      stroke={
                        "#" + (((1 << 24) * Math.random()) | 0).toString(16)
                      }
                      activeDot={{ r: 5 }}
                      dot={false}
                    />
                  );
                } else if (metricName.metricName === "injValveOpen") {
                  yID = "%";
                  return (
                    <Line
                      key={index}
                      yAxisId={yID}
                      type="linear"
                      xAxisID="at"
                      name={metricName.metricName}
                      dataKey={metricName.metricName}
                      stroke={
                        "#" + (((1 << 24) * Math.random()) | 0).toString(16)
                      }
                      activeDot={{ r: 5 }}
                      dot={false}
                    />
                  );
                }
              })
            : null}
        </LineChart>
      </ResponsiveContainer>
    </Fragment>
  );
};

