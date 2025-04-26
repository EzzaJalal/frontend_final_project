import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { MenuItem, Stack } from "@mui/material";
import dayjs from "dayjs";
import { Customer } from "../types";

interface EditTrainingProps {
  training: {
    id: number;
    date: string;
    duration: number;
    activity: string;
    customer: Customer | string;
    _links: {
      customer: { href: string };
      training: { href: string };
    };
  };
  saveTraining: (training: { date: string; duration: number; activity: string; customer: string }, isEdit?: boolean) => Promise<void>;
  children?: React.ReactNode;
}

export default function EditTraining(props: EditTrainingProps) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [training, setTraining] = useState({
    date: props.training.date,
    duration: props.training.duration,
    activity: props.training.activity,
    customer: typeof props.training.customer === "string" ? props.training.customer : "",
  });

  const fetchData = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/customers`
      );
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.statusText}`);
      }
      const data = await response.json();
      setCustomers(data._embedded?.customers || []);
    } catch (error) {
      console.error("Error fetching customers list:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getCustomerLink = async (link: string) => {
    if (!link) {
      return "";
    }
    try {
      const response = await fetch(link);
      if (!response.ok) {
        throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
      }
      const data = await response.json();
      return data._links?.self?.href || "";
    } catch (error) {
      console.error("Error fetching customer:", error);
      return "";
    }
  };

  const handleClickOpen = async () => {
    const customerLink = await getCustomerLink(props.training._links.customer.href);
    setTraining({
      date: props.training.date,
      duration: props.training.duration,
      activity: props.training.activity,
      customer: customerLink || (typeof props.training.customer === "string" ? props.training.customer : ""),
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTraining((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (event: SelectChangeEvent<string>) => {
    const { name, value } = event.target;
    setTraining((prev) => ({ ...prev, [name]: value }));
  };

  const setDateTime = (date: dayjs.Dayjs | null) => {
    if (date) {
      setTraining((prev) => ({ ...prev, date: date.toISOString() }));
    }
  };

  const editTraining = async () => {
    if (!training.date || !training.duration || !training.activity || !training.customer) {
      alert("Please fill in all the fields.");
      return;
    }
    const customerId = training.customer.split("/").pop() || "";
    if (!customerId) {
      alert("Invalid customer selected.");
      return;
    }
    try {
      // Delete the existing training session
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/trainings/${props.training.id}`,
        { method: "DELETE" }
      );
      if (!response.ok) {
        throw new Error("Failed to delete existing training");
      }
    } catch (error) {
      console.error("Error deleting training:", error);
      alert("Failed to update training. Please try again.");
      return;
    }
    await props.saveTraining({
      date: training.date,
      duration: training.duration,
      activity: training.activity,
      customer: customerId,
    }, true); // Pass isEdit: true for edit operation
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <IconButton onClick={handleClickOpen} color="primary">
        {props.children ? props.children : <EditIcon />}
      </IconButton>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="edit-training-dialog-title"
        disableAutoFocus
        disableRestoreFocus
      >
        <DialogTitle id="edit-training-dialog-title">Edit Training</DialogTitle>
        <DialogContent>
          <FormControl fullWidth variant="standard" margin="dense">
            <InputLabel id="customer-select-label">Customer</InputLabel>
            <Select
              labelId="customer-select-label"
              id="customer-select"
              name="customer"
              value={training.customer || ""}
              onChange={handleSelectChange}
              sx={{ maxHeight: "250px" }}
            >
              {customers.map((customer, index) => (
                <MenuItem key={customer.id || index} value={customer._links?.self.href}>
                  {customer.firstname + " " + customer.lastname}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth variant="standard" margin="dense">
            <TextField
              id="activity-input"
              name="activity"
              type="text"
              label="Activity"
              value={training.activity}
              onChange={handleInputChange}
              variant="standard"
              fullWidth
            />
          </FormControl>
          <Stack direction="row" spacing={2} mt={2} alignItems="center">
            <FormControl fullWidth variant="standard">
              <DateTimePicker
                label="Date and Time"
                value={training.date ? dayjs(training.date) : null}
                onChange={setDateTime}
                slotProps={{
                  textField: {
                    id: "datetime-picker",
                    variant: "standard",
                    fullWidth: true,
                  },
                }}
              />
            </FormControl>
            <FormControl fullWidth variant="standard" margin="dense">
              <TextField
                id="duration-input"
                name="duration"
                type="number"
                label="Duration"
                inputProps={{ min: 1 }}
                value={training.duration}
                onChange={handleInputChange}
                variant="standard"
                fullWidth
              />
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <IconButton onClick={handleClose} color="inherit">
            Cancel
          </IconButton>
          <IconButton onClick={editTraining} color="primary">
            Save
          </IconButton>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}