import Snackbar from '@mui/material/Snackbar';
import { useState, useEffect } from 'react';

export interface SnackbarMessage {
  message: string;
  key: number;
}

interface SnackbarProps {
  snackMessage: string | null;
  setSnackMessage: (msg: string | null) => void;
}

export default function ConsecutiveSnackbars({ snackMessage, setSnackMessage }: SnackbarProps) {
  const [snackPack, setSnackPack] = useState<readonly SnackbarMessage[]>([]);
  const [open, setOpen] = useState(false);
  const [messageInfo, setMessageInfo] = useState<SnackbarMessage | undefined>(undefined);

  useEffect(() => {
    if (snackMessage) {
      setSnackPack((prev) => [...prev, { message: snackMessage, key: new Date().getTime() }]);
      setSnackMessage(null); 
    }
  }, [snackMessage, setSnackMessage]);

  useEffect(() => {
    if (snackPack.length && !messageInfo) {
      setMessageInfo({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && messageInfo && open) {
      setOpen(false);
    }
  }, [snackPack, messageInfo, open]);

  const handleExited = () => {
    setMessageInfo(undefined);
  };

  return (
    <Snackbar
      key={messageInfo ? messageInfo.key : undefined}
      open={open}
      autoHideDuration={3000}
      onClose={() => setOpen(false)}
      slotProps={{ transition: { onExited: handleExited } }}
      message={messageInfo ? messageInfo.message : undefined}
    />
  );
}
