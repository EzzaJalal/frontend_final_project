import React from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import { Customer } from "../types";

interface EditCustomerProps {
  customer: Customer;
  updateCustomer: (customer: Customer, url: string) => void;
}

export default function EditCustomer(props: EditCustomerProps) {
  const [open, setOpen] = React.useState(false);
  const [editedCustomer, setEditedCustomer] = React.useState<Customer>({
    id:
      typeof props.customer.id === "number"
        ? props.customer.id
        : parseInt(props.customer.id as string, 10) || 0,
    firstname: props.customer.firstname || "",
    lastname: props.customer.lastname || "",
    email: props.customer.email || "",
    phone: props.customer.phone || "",
    streetaddress: props.customer.streetaddress || "",
    postcode: props.customer.postcode || "",
    city: props.customer.city || "",
    _links:
      props.customer._links ||
      {
        self: { href: "" },
        trainings: { href: "" },
        customer: { href: "" },
      },
  });

  const handleClickOpen = () => {
    setEditedCustomer({
      ...props.customer,
      id:
        typeof props.customer.id === "number"
          ? props.customer.id
          : parseInt(props.customer.id as string, 10) || 0,
      _links:
        props.customer._links ||
        { self: { href: "" }, trainings: { href: "" }, customer: { href: "" } },
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const editCustomer = () => {
    const customerHref = editedCustomer._links?.customer?.href || "";
    props.updateCustomer(editedCustomer, customerHref);
    handleClose();
  };

  return (
    <>
      <IconButton onClick={handleClickOpen} color="primary">
        <EditIcon />
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        disableAutoFocus
        disableRestoreFocus
      >
        <DialogTitle>Edit Customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="firstname"
            label="First Name"
            type="text"
            value={editedCustomer.firstname}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="lastname"
            label="Last Name"
            type="text"
            value={editedCustomer.lastname}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="streetaddress"
            label="Street Address"
            type="text"
            value={editedCustomer.streetaddress}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="postcode"
            label="Postcode"
            type="text"
            value={editedCustomer.postcode}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            value={editedCustomer.city}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            value={editedCustomer.email}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            value={editedCustomer.phone}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} color="inherit">
            Cancel
          </IconButton>
          <IconButton onClick={editCustomer} color="primary">
            Save
          </IconButton>
        </DialogActions>
      </Dialog>
    </>
  );
}
