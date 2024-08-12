import React, { useState, memo } from "react";

import { Collapse, List, Box, ListItem, ListItemText } from "@mui/material";

import { ExpandLess, ExpandMore } from "@mui/icons-material";

const TreeNode = ({
  node,
  selectedNodeId,
  selectedNode,
  handleButtonPanelToggle,
  handleModalFormToggle,
  buttonPanelBox,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleNodeToggle = (node) => {
    setIsOpen(!isOpen);
    handleButtonPanelToggle(node);
  };

  return (
    <List component="div" disablePadding>
      <ListItem
        sx={{
          ...(selectedNodeId === node.id && {
            background: "#eeeff8",
          }),
          padding: "0 16px",
          height: "32px",
          gap: "10px",
        }}
        component="div"
        onClick={() => handleNodeToggle(node)}
      >
        {node?.children?.length ? (
          <>
            {isOpen ? (
              <ExpandLess sx={{ transform: "rotate(90deg)" }} />
            ) : (
              <ExpandMore />
            )}
          </>
        ) : (
          <></>
        )}
        <ListItemText
          component="div"
          primary={node?.name}
          sx={{ flex: "none" }}
        />
        {selectedNodeId === node.id && buttonPanelBox}
      </ListItem>

      {node.children?.map((childNode) => {
        return (
          <Box ml={4} key={`${childNode.id}-${childNode.name}`}>
            <Collapse
              key={childNode.id}
              in={isOpen}
              timeout="auto"
              unmountOnExit
            >
              <TreeNode
                key={childNode.id}
                node={childNode}
                selectedNodeId={selectedNodeId}
                selectedNode={selectedNode}
                handleButtonPanelToggle={handleButtonPanelToggle}
                buttonPanelBox={buttonPanelBox}
              />
            </Collapse>
          </Box>
        );
      })}
    </List>
  );
};

export default memo(TreeNode);
