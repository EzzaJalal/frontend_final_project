import React from "react";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContentText from "@mui/material/DialogContentText";

interface DeleteCustomerProps {
  deleteCustomer: (url: string) => void;
  customer: {
    _links: {
      customer: {
        href: string;
      };
    };
  };
}

export default function DeleteCustomer(props: DeleteCustomerProps) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const deleteCustomer = () => {
    props.deleteCustomer(props.customer._links.customer.href);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClickOpen} color="error">
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        disableAutoFocus
        disableRestoreFocus
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Delete Customer"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this customer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} color="inherit">
            Cancel
          </IconButton>
          <IconButton onClick={deleteCustomer} color="error">
            Delete
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
