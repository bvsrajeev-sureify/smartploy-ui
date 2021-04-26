import React from "react";
import { useHistory } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function PrimaryDialog({ mergeStatus, mergeTasks, openModal, setOpenModal, fetchTasks }) {
  const history = useHistory();

  const handleConfirm = () => {
    if(mergeStatus === 'success') {
       history.push('/projects');
    } else {
       mergeTasks();
    }
  };

  const handleClose = (mergeStatus) => {
    setOpenModal(false)
    if(mergeStatus === 'success') {
      fetchTasks()
    }
  };

  return (
    <div>
      <Dialog
        open={openModal}
        fullWidth
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {mergeStatus === "success"
            ? "Selected tasks have been merged. Go back to projects page?"
            : "Merge Selected Tasks"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {mergeStatus === "success"
              ? "Please confirm"
              : "Are you sure you want to continue?"}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleConfirm();
              handleClose();
            }}
            color="primary"
          >
            Confirm
          </Button>
            <Button onClick={() => handleClose(mergeStatus)} color="primary" autoFocus>
              Cancel
            </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
