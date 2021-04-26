import React, { useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
import clsx from "clsx";
import { lighten, makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Paper from "@material-ui/core/Paper";
import Checkbox from "@material-ui/core/Checkbox";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import MergeTypeIcon from "@material-ui/icons/MergeType";
import PrimaryDialog from "../components/PrimaryDialog";

function createData(id, key, summary) {
  return { id, key, summary };
}

const headCells = [
  {
    id: "key",
    numeric: false,
    align: "left",
    disablePadding: true,
    label: "Key",
  },
  {
    id: "summary",
    numeric: false,
    align: "center",
    disablePadding: false,
    label: "Summary",
  },
  {
    id: "environment",
    numeric: false,
    align: "center",
    disablePadding: false,
    label: "Environment",
  },
  {
    id: "merge",
    numeric: false,
    align: "right",
    disablePadding: false,
    label: "Merge",
  },
];

function EnhancedTableHead(props) {
  const { onSelectAllClick, numSelected, rowCount } = props;

  return (
    <TableHead>
      <TableRow>
        <TableCell padding="checkbox">
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={onSelectAllClick}
            inputProps={{ "aria-label": "select all tasks" }}
          />
        </TableCell>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align}
            padding={headCell.disablePadding ? "none" : "default"}
          >
            {headCell.label}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(["asc", "desc"]).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

const useToolbarStyles = makeStyles((theme) => ({
  root: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  highlight:
    theme.palette.type === "light"
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  title: {
    flex: "1 1 100%",
  },
}));

const EnhancedTableToolbar = (props) => {
  const classes = useToolbarStyles();
  const { numSelected } = props;

  return (
    <Toolbar
      className={clsx(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      {numSelected > 0 ? (
        <Typography
          className={classes.title}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          className={classes.title}
          variant="h6"
          id="tableTitle"
          component="div"
        >
          Tasks
        </Typography>
      )}

      <Tooltip title="Merge selected" disabled={numSelected <= 0}>
        <IconButton
          aria-label="merge-all"
          onClick={props.mergeSelectedTasks}
        >
          <MergeTypeIcon />
        </IconButton>
      </Tooltip>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

const useStyles = makeStyles((theme) => ({
  root: {
    width: "80%",
    position: "relative",
    top: "70px",
    left: "10%",
  },
  container: {
    maxHeight: 620,
  },
  paper: {
    width: "100%",
    marginBottom: theme.spacing(2),
  },
  table: {
    minWidth: 750,
  },
  visuallyHidden: {
    border: 0,
    clip: "rect(0 0 0 0)",
    height: 1,
    margin: -1,
    overflow: "hidden",
    padding: 0,
    position: "absolute",
    top: 20,
    width: 1,
  },
}));

let rows = [];

export default function TaskList() {
  const classes = useStyles();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedTasks, setSelectedTasks] = useState([]);
  const [mergeStatus, setMergeStatus] = useState("");
  const [order, setOrder] = React.useState("asc");
  const [orderBy, setOrderBy] = React.useState("");
  const [selected, setSelected] = React.useState([]);

  const updateTasks = (response) => {
    rows = [];
    if (response && response.Data) {
      response.Data.issues.forEach((task) => {
        rows.push(createData(task.id, task.key, task.fields.summary));
      });
    }
    setSelected([]);
  };

  const fetchTasks = () => {
    const location = window.location.pathname;
    const params = location.split("/");
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    setLoading(true);

    axios
      .get(
        `http://localhost:8000/get_issues/${params[2]}/${params[3]}/${timestamp}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then(({ data }) => {
        setLoading(false);
        updateTasks(data);
        setTasks(data);
        setMergeStatus("");
      })
      .then((error) => console.log(error));
  };

  useEffect(() => {
    setOpenModal(false);
    fetchTasks();
  }, []);

  const mergeTasks = () => {
    setLoading(true);
    axios
      .post(
        `http://localhost:8000/merge_by_issesId/${tasks.Project}/${tasks.Env}/${tasks.Time}`,
        selectedTasks,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        if (response.status === 200) {
          setLoading(false);
          setMergeStatus("success");
          setOpenModal(true);
        }
      })
      .then((error) => console.log(error));
  };

  const getTaskById = (id) => {
    const filteredTasks = tasks.Data.issues.filter((task) => task.id === id);
    return filteredTasks[0];
  };

  const mergeSelectedTasks = (selectedIds) => {
    let selectedTaskList = [];
    selectedIds.forEach((taskId) => {
      const { id, key } = getTaskById(taskId);
      selectedTaskList.push({ id, key });
    });
    setSelectedTasks(selectedTaskList);
    setOpenModal(true);
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = rows.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  return (
    <>
      {loading ? (
        <div style={{ marginTop: "25%", marginLeft: "50%" }}>
          <CircularProgress size={54} />
        </div>
      ) : (
        <>
          <PrimaryDialog
            openModal={openModal}
            setOpenModal={setOpenModal}
            mergeStatus={mergeStatus}
            mergeTasks={mergeTasks}
            fetchTasks={fetchTasks}
          />
          {mergeStatus !== "success" && (
            <div className={classes.root}>
              <Paper className={classes.paper}>
                <EnhancedTableToolbar
                  numSelected={selected.length}
                  mergeSelectedTasks={() => mergeSelectedTasks(selected)}
                />
                <TableContainer className={classes.container}>
                  <Table
                    stickyHeader
                    className={classes.table}
                    aria-labelledby="tableTitle"
                    size={"medium"}
                    aria-label="enhanced table"
                  >
                    <EnhancedTableHead
                      classes={classes}
                      numSelected={selected.length}
                      order={order}
                      orderBy={orderBy}
                      onSelectAllClick={handleSelectAllClick}
                      onRequestSort={handleRequestSort}
                      rowCount={rows.length}
                    />
                    <TableBody>
                      {rows.map((row, index) => {
                        const isItemSelected = isSelected(row.id);
                        const labelId = `enhanced-table-checkbox-${index}`;

                        return (
                          <TableRow
                            hover
                            onClick={(event) => handleClick(event, row.id)}
                            role="checkbox"
                            aria-checked={isItemSelected}
                            tabIndex={-1}
                            key={row.key}
                            selected={isItemSelected}
                          >
                            <TableCell padding="checkbox">
                              <Checkbox
                                checked={isItemSelected}
                                inputProps={{ "aria-labelledby": labelId }}
                              />
                            </TableCell>
                            <TableCell
                              component="th"
                              id={labelId}
                              scope="row"
                              padding="none"
                            >
                              {row.key}
                            </TableCell>
                            <TableCell align="center">{row.summary}</TableCell>
                            <TableCell align="center">{tasks.Env}</TableCell>
                            <TableCell align="right">
                              <Tooltip title="Merge">
                                <IconButton aria-label="merge">
                                  <MergeTypeIcon />
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                      {rows.length === 0 && (
                        <TableRow style={{ height: 53 * 5 }}>
                          <TableCell
                            style={{ fontSize: "20px", paddingLeft: "40%" }}
                            colSpan={6}
                          >
                            There are no active tasks
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </div>
          )}
        </>
      )}
    </>
  );
}
