import React, { useState, useEffect } from "react";
import axios from "axios";
import { makeStyles } from "@material-ui/core/styles";
import CircularProgress from "@material-ui/core/CircularProgress";
import ProjectCard from "../components/ProjectCard";
import Grid from "@material-ui/core/Grid";

const useStyles = makeStyles((theme) => ({
  root: {
    margin: "90px",
    marginLeft: "12%",
    flexGrow: 1,
  },
}));

export default function ProjectsList() {
  const classes = useStyles();
  const [ projects, setProjects ] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = () => {
    axios
      .get("http://localhost:8000/get_jira_projects", {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then(({ data }) => {
        setLoading(false);
        setProjects(data);
      });
  };

  useEffect(() => {
    fetchProjects();
  }, [])

  return (
    <>
    {loading ? (
      <div style={{ marginTop: "25%", marginLeft: "50%" }}>
        <CircularProgress size={54} />
      </div>
    ) :
    <div className={classes.root}>
      <Grid container spacing={1}>
        <Grid container item xs={12} spacing={3}>
          {projects.map((project) => {
            return (
              <Grid item xs={4} key={project.id}>
                <ProjectCard
                  project={project}
                />
              </Grid>
            );
          })}
        </Grid>
      </Grid>
    </div>}
    </>
  );
}
