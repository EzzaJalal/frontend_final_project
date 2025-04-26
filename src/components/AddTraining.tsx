// AddTraining.tsx
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add"; // Added import for AddIcon

import dayjs from "dayjs";
import {
  DateTimePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

import { Customer } from "../types";

interface AddTrainingProps {
  saveTraining: (training: {
    date: string;
    duration: number;
    activity: string;
    customer: string;
  }) => void;
}

export default function AddTraining(props: AddTrainingProps) {
  const [open, setOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [training, setTraining] = useState({
    date: "",
    duration: 0,
    activity: "",
    customer: "",
  });

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        (`${import.meta.env.VITE_API_URL}/customers`)
      );
      if (!res.ok) throw new Error(res.statusText);
      const data = await res.json();
      setCustomers(data._embedded?.customers || []);
    } catch (e) {
      console.error(e);
      setError("Failed to load customers. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setTraining({ date: "", duration: 0, activity: "", customer: "" });
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setTraining((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setTraining((prev) => ({ ...prev, [name]: value }));
  };

  const setDateTime = (date: dayjs.Dayjs | null) => {
    if (date) {
      setTraining((prev) => ({ ...prev, date: date.toISOString() }));
    }
  };

  const addTraining = () => {
    if (
      !training.date ||
      !training.duration ||
      !training.activity ||
      !training.customer
    ) {
      alert("Please fill in all the fields.");
      return;
    }
    const customerId = training.customer.split("/").pop() || "";
    if (!customerId) {
      alert("Invalid customer selected.");
      return;
    }
    props.saveTraining({
      date: training.date,
      duration: training.duration,
      activity: training.activity,
      customer: customerId,
    });
    handleClose();
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Button
        onClick={handleClickOpen}
        disabled={loading}
        startIcon={<AddIcon />}
        disableRipple
      >
        Add New Training
      </Button>

      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="add-training-dialog-title"
        disableAutoFocus
        disableRestoreFocus
      >
        <DialogTitle id="add-training-dialog-title">
          Add New Training
        </DialogTitle>
        <DialogContent>
          {loading ? (
            <Stack
              alignItems="center"
              justifyContent="center"
              minHeight="200px"
            >
              <CircularProgress />
            </Stack>
          ) : error ? (
            <div style={{ color: "red", textAlign: "center" }}>
              {error}
            </div>
          ) : (
            <>
              {/* Customer select */}
              <FormControl
                fullWidth
                variant="outlined"
                margin="dense"
              >
                <InputLabel shrink id="customer-select-label">
                  Customer
                </InputLabel>
                <Select
                  labelId="customer-select-label"
                  id="customer-select"
                  name="customer"
                  label="Customer"
                  value={training.customer}
                  onChange={handleSelectChange}
                  sx={{ maxHeight: "250px" }}
                >
                  {customers.map((c, i) => (
                    <MenuItem
                      key={c.id ?? i}
                      value={c._links?.self.href ?? ""}
                    >
                      {c.firstname + " " + c.lastname}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {/* Activity */}
              <TextField
                margin="dense"
                fullWidth
                variant="outlined"
                label="Activity"
                name="activity"
                value={training.activity}
                onChange={handleInputChange}
                InputLabelProps={{ shrink: true }}
              />

              {/* Date & Duration row */}
              <Stack
                direction="row"
                spacing={2}
                mt={2}
                alignItems="center"
              >
                <DateTimePicker
                  label="Date and Time"
                  value={
                    training.date
                      ? dayjs(training.date)
                      : null
                  }
                  onChange={setDateTime}
                  slotProps={{
                    textField: {
                      id: "datetime-picker",
                      variant: "outlined",
                      margin: "dense",
                      fullWidth: true,
                      InputLabelProps: { shrink: true },
                    },
                  }}
                />

                <TextField
                  margin="dense"
                  fullWidth
                  variant="outlined"
                  label="Duration"
                  name="duration"
                  type="number"
                  inputProps={{ min: 1 }}
                  value={training.duration}
                  onChange={handleInputChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Stack>
            </>
          )}
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            onClick={addTraining}
            disabled={loading || !!error}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
}