import React from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import Typography from "@material-ui/core/Typography";
import logo192 from "../assets/images/Sureify-1.png";

const useStyles = makeStyles({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 140,
  },
});

export default function ProjectCard({ project }) {
  const classes = useStyles();
  const history = useHistory();
  const [env, setEnv] = React.useState("DEV");

  const handleChange = (event) => {
    setEnv(event.target.value);
  };

  const renderTasks = () => {
    history.push(`/tasks/${project.key}/${env}`);
  };

  return (
    <Card className={classes.root}>
      <CardActionArea onClick={renderTasks}>
        <CardMedia
          className={classes.media}
          image={logo192}
          title={project.key}
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {project.key}
          </Typography>
          <Typography variant="body2" color="textSecondary" component="p">
            {project.name}
          </Typography>
        </CardContent>
      </CardActionArea>
      <CardActions>
        <Button size="small" color="primary">
          Select Environment
        </Button>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={env}
          onChange={handleChange}
        >
          <MenuItem value={"DEV"}>DEV</MenuItem>
          <MenuItem value={"STG"}>STG</MenuItem>
          <MenuItem value={"UAT"}>UAT</MenuItem>
          <MenuItem value={"PROD"}>PROD</MenuItem>
        </Select>
      </CardActions>
    </Card>
  );
}
