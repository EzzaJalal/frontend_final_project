// DeleteTraining.tsx
import React, { useState } from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";
import CircularProgress from "@mui/material/CircularProgress";

interface DeleteTrainingProps {
  training: {
    id: number;
    date: string;
    duration: number;
    activity: string;
    customer: string | { id: number; firstname: string; lastname: string };
    _links?: {
      training?: { href: string };
    };
  };
  deleteTraining: () => void;
  children?: React.ReactNode;
}

export default function DeleteTraining(props: DeleteTrainingProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await props.deleteTraining();
      handleClose();
    } catch (error) {
      console.error("Error deleting training:", error);
      setLoading(false);
    }
  };

  return (
    <>
      <IconButton onClick={handleClickOpen} color="error" disabled={loading}>
        {props.children ? props.children : <DeleteIcon />}
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-training-dialog-title"
        aria-describedby="delete-training-dialog-description"
        disableAutoFocus
        disableRestoreFocus
      >
        <DialogTitle id="delete-training-dialog-title">Delete Training</DialogTitle>
        <DialogContent>
          <DialogContentText id="delete-training-dialog-description">
            Are you sure you want to delete this training?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} disabled={loading} color="inherit">
            Cancel
          </IconButton>
          <IconButton onClick={handleDelete} disabled={loading} color="error">
            {loading ? <CircularProgress size={20} /> : "Delete"}
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
