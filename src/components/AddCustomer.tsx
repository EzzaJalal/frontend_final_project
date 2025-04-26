// AddCustomer.tsx
import React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import AddIcon from "@mui/icons-material/Add";

interface AddCustomerProps {
  saveCustomer: (customer: {
    firstname: string;
    lastname: string;
    streetaddress: string;
    postcode: string;
    city: string;
    email: string;
    phone: string;
  }) => void;
}

export default function AddCustomer(props: AddCustomerProps) {
  const [open, setOpen] = React.useState(false);
  const [customer, setCustomer] = React.useState({
    firstname: "",
    lastname: "",
    streetaddress: "",
    postcode: "",
    city: "",
    email: "",
    phone: "",
  });

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomer((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const addCustomer = () => {
    props.saveCustomer(customer);
    handleClose();
    setCustomer({
      firstname: "",
      lastname: "",
      streetaddress: "",
      postcode: "",
      city: "",
      email: "",
      phone: "",
    });
  };

  return (
    <>
      <Button onClick={handleClickOpen} startIcon={<AddIcon />} disableRipple>
        Add Customer
      </Button>
      <Dialog open={open} onClose={handleClose} disableAutoFocus disableRestoreFocus>
        <DialogTitle>Add New Customer</DialogTitle>
        <DialogContent>
          <TextField
            margin="dense"
            name="firstname"
            label="First Name"
            type="text"
            value={customer.firstname}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="lastname"
            label="Last Name"
            type="text"
            value={customer.lastname}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="streetaddress"
            label="Street Address"
            type="text"
            value={customer.streetaddress}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="postcode"
            label="Postcode"
            type="text"
            value={customer.postcode}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="city"
            label="City"
            type="text"
            value={customer.city}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="email"
            label="Email"
            type="email"
            value={customer.email}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
          <TextField
            margin="dense"
            name="phone"
            label="Phone"
            type="text"
            value={customer.phone}
            onChange={handleInputChange}
            fullWidth
            variant="standard"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disableRipple>
            Cancel
          </Button>
          <Button onClick={addCustomer} disableRipple>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
