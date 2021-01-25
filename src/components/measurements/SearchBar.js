import React, {useEffect} from "react";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Chip from "@material-ui/core/Chip";
import { useDispatch } from "react-redux";
import * as actions from '../../store/actions';
import {createClient, Provider, useQuery} from "urql";

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
  },
  formControl: {
    margin: theme.spacing(1),
    minWidth: 300,
    maxWidth: 400
  },
  chips: {
    display: "flex",
    flexWrap: "wrap"
  },
  chip: {
    margin: 2,
    backgroundColor: "white"
  },
  noLabel: {
    marginTop: theme.spacing(3)
  }
}));

const MenuProps = {
  PaperProps: {
    style: {
      width: 300
    }
  }
};

const client = createClient({
  url: "https://react.eogresources.com/graphql"
});
const query = `
query getMetrics {
  getMetrics
}
`;

function getStyles(name, metricNames, theme) {
  return {
    fontWeight:
      metricNames.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium
  };
}

export default () => {
  return (
      <Provider value={client}>
        <SearchBar />
      </Provider>
  );
};

const SearchBar = () => {
  const classes = useStyles();
  const theme = useTheme();
  const [metricNames, setMetricName] = React.useState([]);

  function handleChange(event) {
    setMetricName(event.target.value);
  }
  const dispatch = useDispatch();
  const [result] = useQuery({
    query
  });
  const [metrics, setMetricNames] = React.useState([]);

  const { data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch({ type: actions.API_ERROR, error: error.message });
      return;
    }
    if (!data) return;
    console.log(data);
    setMetricNames(data.getMetrics);
  }, [dispatch, data, error]);

  useEffect(() => {
    dispatch({ type: actions.DATA_NAME_ADDED, metricNames })
  }, [dispatch, metricNames]);

  return (
    <div className={classes.root}>
      <FormControl className={classes.formControl}>
      <InputLabel htmlor="metric-select">Choose Metric</InputLabel>
        <Select
          multiple
          value={metricNames}
          onChange={handleChange}
          input={<Input id="select-multiple-chip" />}
          renderValue={selected => (
            <div className={classes.chips}>
              {selected.map(value => (
                <Chip key={value} label={value} className={classes.chip} />
              ))}
            </div>
          )}
          MenuProps={MenuProps}
        >
          {metrics.map(name => (
            <MenuItem
              key={name}
              value={name}
              style={getStyles(name, metrics, theme)}
            >
              {name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
}
