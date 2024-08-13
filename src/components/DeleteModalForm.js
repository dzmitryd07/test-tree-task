import React, { memo } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const DeleteModalForm = ({
  handleModalFormToggle,
  open,
  handleNodeRemove,
  node,
  error,
}) => {
  return (
    <React.Fragment>
      <Dialog
        open={open}
        onClose={handleModalFormToggle}
        fullWidth
        PaperProps={{
          component: "form",
          onSubmit: (event) => {
            event.preventDefault();
            handleNodeRemove({ node });
            handleModalFormToggle();
          },
        }}
      >
        <DialogTitle>Delete</DialogTitle>
        <DialogContentText p={3}>
          {`Do you want to delete ${node.name}?`}
        </DialogContentText>

        <DialogActions>
          <Button onClick={handleModalFormToggle}>Cancel</Button>
          <Button type="submit" variant="contained" color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
};

export default memo(DeleteModalForm);
