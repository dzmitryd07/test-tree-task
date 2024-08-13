import React, { memo } from "react";
import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";

const ModalForm = ({
  type,
  handleModalFormToggle,
  handleNodeNameChange,
  open,
  handleNodeCreate,
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
            handleNodeCreate({ name, node });
            handleModalFormToggle();
          },
        }}
      >
        <DialogTitle>Add</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="name"
            label="Node name"
            type="text"
            fullWidth
            variant="standard"
            error={error?.length > 0}
            helperText={error}
            onChange={handleNodeNameChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleModalFormToggle}>Cancel</Button>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            disabled={error?.length > 0}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default memo(ModalForm);
