import React, { memo } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const EditModalForm = ({
  handleModalFormToggle,
  handleNodeNameChange,
  open,
  handleNodeEdit,
  node,
  error,
}) => {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        fullWidth
        onClose={handleModalFormToggle}
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            const formData = new FormData(event.currentTarget);
            const formJson = Object.fromEntries(formData.entries());
            const name = formJson.name;
            handleNodeEdit({ name, node });
            handleModalFormToggle();
          },
        }}
      >
        <DialogTitle>Rename</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="New node name"
            type="text"
            fullWidth
            variant="standard"
            onChange={handleNodeNameChange}
            error={error?.length > 0}
            helperText={error}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalFormToggle}>Cancel</Button>
          <Button
            type="submit"
            disabled={error?.length > 0}
            variant="contained"
            color="primary"
          >
            Rename
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default memo(EditModalForm);
