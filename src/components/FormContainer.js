import React, { useCallback } from "react";
import CreateModalForm from "./CreateModalForm";
import EditModalForm from "./EditModalForm";
import DeleteModalForm from "./DeleteModalForm";

const FormContainer = ({
  type,
  handleModalFormToggle,
  open,
  handleNodeEdit,
  handleNodeCreate,
  handleNodeRemove,
  handleNodeNameChange,
  node,
  error,
}) => {
  const form = useCallback(() => {
    if (type === "edit") {
      return (
        <EditModalForm
          open={open}
          handleModalFormToggle={handleModalFormToggle}
          handleNodeEdit={handleNodeEdit}
          handleNodeNameChange={handleNodeNameChange}
          node={node}
          error={error}
        />
      );
    } else if (type === "delete") {
      return (
        <DeleteModalForm
          open={open}
          handleModalFormToggle={handleModalFormToggle}
          handleNodeRemove={handleNodeRemove}
          node={node}
          error={error}
        />
      );
    }

    return (
      <CreateModalForm
        open={open}
        handleModalFormToggle={handleModalFormToggle}
        handleNodeCreate={handleNodeCreate}
        handleNodeNameChange={handleNodeNameChange}
        node={node}
        error={error}
      />
    );
  }, [
    handleModalFormToggle,
    handleNodeNameChange,
    handleNodeCreate,
    handleNodeEdit,
    open,
    type,
    node,
    handleNodeRemove,
    error,
  ]);

  return form();
};

export default FormContainer;
