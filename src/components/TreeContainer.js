import React, { useState, useCallback, useEffect, useMemo } from "react";
import PropTypes from "prop-types";

import { Container, IconButton, Snackbar, Alert, Box } from "@mui/material";

import TreeNode from "./TreeNode";
import FormContainer from "./FormContainer";

import {
  EditOutlined,
  AddCircleOutlineOutlined,
  DeleteOutlineOutlined,
} from "@mui/icons-material";

const TreeContainer = () => {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [selectedNode, setSelectedNode] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState("add");
  const [parentNode, setParentNode] = useState();
  const [error, setError] = useState("");
  const [isSnackbarOpen, setIsSnackBarOpen] = useState(false);
  const [warningAlert, setWarningAlert] = useState("");
  const [successAlert, setSuccessAlert] = useState("");

  const {
    REACT_APP_TEST_NODE_NAME,
    REACT_APP_HOST,
    REACT_APP_NODE_LIST_ENDPOINT,
    REACT_APP_NODE_CREATE_ENDPOINT,
    REACT_APP_NODE_RENAME_ENDPOINT,
    REACT_APP_NODE_REMOVE_ENDPOINT,
  } = process.env;

  const REACT_APP_URL_LIST = `${REACT_APP_HOST}${REACT_APP_NODE_LIST_ENDPOINT}${REACT_APP_TEST_NODE_NAME}`;
  const REACT_APP_URL_CREATE = `${REACT_APP_HOST}${REACT_APP_NODE_CREATE_ENDPOINT}`;
  const REACT_APP_URL_RENAME = `${REACT_APP_HOST}${REACT_APP_NODE_RENAME_ENDPOINT}`;
  const REACT_APP_URL_DELETE = `${REACT_APP_HOST}${REACT_APP_NODE_REMOVE_ENDPOINT}`;

  const fetchRequest = ({ url, params }) => {
    fetch(`${url}?${params}`, { method: "POST" })
      .then(async (response) => {
        if (response && response.status === 200) {
          fetchData();
        }
      })
      .catch((error) => {
        console.log(error.data.message);
      });
  };

  const isNodeNameExist = useCallback(({ name, currentNode }) => {
    if (name === currentNode.name) {
      return true;
    } else {
      return !!currentNode.children?.find((node) =>
        isNodeNameExist({ name, currentNode: node })
      );
    }
  }, []);

  const handleNodeCreate = async ({ name, node }) => {
    const params = new URLSearchParams({
      treeName: REACT_APP_TEST_NODE_NAME,
      parentNodeId: node.id,
      nodeName: name,
    });

    if (!isNodeNameExist({ name, currentNode: parentNode })) {
      fetchRequest({ url: REACT_APP_URL_CREATE, params });
      setSuccessAlert("Node successfully created");
      setIsSnackBarOpen(true);
    } else {
      setError("Node name must be unique");
    }
  };

  const handleNodeNameChange = useCallback(
    (event) => {
      const { value } = event.target;
      if (isNodeNameExist({ name: value, currentNode: parentNode })) {
        setError("Node name must be unique");
      } else {
        setError("");
      }
    },
    [parentNode, isNodeNameExist]
  );

  const handleNodeEdit = async ({ name, node }) => {
    const params = new URLSearchParams({
      treeName: REACT_APP_TEST_NODE_NAME,
      nodeId: node.id,
      newNodeName: name,
    });

    if (!isNodeNameExist({ name, currentNode: parentNode })) {
      fetchRequest({ url: REACT_APP_URL_RENAME, params });
      setSuccessAlert(`Node (id: ${node.id}) successfully renamed`);
      setIsSnackBarOpen(true);
    } else {
      setError("Node name must be unique");
    }
  };

  const handleNodeRemove = async ({ node }) => {
    const params = new URLSearchParams({
      treeName: REACT_APP_TEST_NODE_NAME,
      nodeId: node.id,
    });

    if (node.children.length > 0) {
      setWarningAlert("You have to delete all children nodes first");
      setIsSnackBarOpen(true);
    } else {
      fetchRequest({ url: REACT_APP_URL_DELETE, params });
      setSuccessAlert(
        `Node ${node.name} (id: ${node.id}) successfully removed`
      );
      setIsSnackBarOpen(true);
    }
  };

  const fetchData = useCallback(() => {
    fetch(REACT_APP_URL_LIST, { method: "POST" })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          const error = (data && data.message) || response.status;
          return Promise.reject(error);
        }
        setParentNode(data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [REACT_APP_URL_LIST]);

  useEffect(() => {
    fetchData();
  }, [REACT_APP_URL_LIST, fetchData]);

  const handleButtonPanelToggle = (node) => {
    if (selectedNodeId !== node.id) {
      setSelectedNodeId((prevSelected) =>
        prevSelected === node.id ? null : node.id
      );
      setSelectedNode(node);
    }
  };

  const handleModalFormToggle = useCallback(() => {
    setIsModalOpen(!isModalOpen);
  }, [isModalOpen]);

  const handleEditButtonClick = useCallback(
    (event) => {
      event.stopPropagation();
      handleModalFormToggle(true);
      setModalType("edit");
    },
    [handleModalFormToggle]
  );

  const handleAddButtonClick = useCallback(
    (event) => {
      event.stopPropagation();
      handleModalFormToggle(true);
      setModalType("add");
    },
    [handleModalFormToggle]
  );

  const handleRemoveButtonClick = useCallback(
    (event) => {
      event.stopPropagation();
      handleModalFormToggle(true);
      setModalType("delete");
    },
    [handleModalFormToggle]
  );

  const buttonPanelBox = useMemo(
    () => (
      <Box>
        <IconButton onClick={handleAddButtonClick}>
          <AddCircleOutlineOutlined />
        </IconButton>
        <IconButton onClick={handleEditButtonClick}>
          <EditOutlined />
        </IconButton>
        <IconButton onClick={handleRemoveButtonClick}>
          <DeleteOutlineOutlined />
        </IconButton>
      </Box>
    ),
    [handleAddButtonClick, handleEditButtonClick, handleRemoveButtonClick]
  );

  const alertBox = useMemo(() => {
    if (warningAlert.length > 0) {
      return (
        <Alert
          onClose={() => setIsSnackBarOpen(!isSnackbarOpen)}
          severity="warning"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {warningAlert}
        </Alert>
      );
    }

    return (
      <Alert
        onClose={() => setIsSnackBarOpen(!isSnackbarOpen)}
        severity="success"
        variant="filled"
        sx={{ width: "100%" }}
      >
        {successAlert}
      </Alert>
    );
  }, [isSnackbarOpen, warningAlert, successAlert]);

  return (
    <Container maxWidth="md">
      <Snackbar
        open={isSnackbarOpen}
        autoHideDuration={6000}
        onClose={() => setIsSnackBarOpen(!isSnackbarOpen)}
      >
        {alertBox}
      </Snackbar>

      {parentNode && (
        <TreeNode
          key={parentNode.id}
          selectedNodeId={selectedNodeId}
          selectedNode={selectedNode}
          buttonPanelBox={buttonPanelBox}
          node={parentNode}
          handleNodeCreate={handleNodeCreate}
          handleNodeEdit={handleNodeEdit}
          handleNodeRemove={handleNodeRemove}
          handleButtonPanelToggle={handleButtonPanelToggle}
          handleModalFormToggle={handleModalFormToggle}
        />
      )}

      {isModalOpen && (
        <FormContainer
          type={modalType}
          open={isModalOpen}
          handleNodeCreate={handleNodeCreate}
          handleNodeEdit={handleNodeEdit}
          handleNodeRemove={handleNodeRemove}
          handleModalFormToggle={handleModalFormToggle}
          handleNodeNameChange={handleNodeNameChange}
          node={selectedNode}
          error={error}
        />
      )}
    </Container>
  );
};

TreeContainer.propTypes = {
  id: PropTypes.number,
  name: PropTypes.string,
  children: PropTypes.array,
};

export default TreeContainer;
