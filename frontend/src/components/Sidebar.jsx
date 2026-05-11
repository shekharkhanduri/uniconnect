import React, { useState } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Box,
  Avatar,
  Typography,
  IconButton,
  Tooltip,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Person as PersonIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  People as PeopleIcon,
  ChevronLeft as ChevronLeftIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";

const drawerWidth = 260;
const drawerWidthCollapsed = 70;

export function Sidebar({ currentUser, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "My Profile", icon: <PersonIcon />, path: "/profile" },
    { text: "Connections", icon: <PeopleIcon />, path: "/connections" },
    { text: "Settings", icon: <SettingsIcon />, path: "/settings" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) {
      onLogout();
    }
    navigate("/login");
  };

  const toggleSidebar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: isCollapsed ? drawerWidthCollapsed : drawerWidth,
        flexShrink: 0,
        transition: "width 0.3s ease",
        "& .MuiDrawer-paper": {
          width: isCollapsed ? drawerWidthCollapsed : drawerWidth,
          boxSizing: "border-box",
          borderRight: "1px solid",
          borderColor: "divider",
          bgcolor: "background.paper",
          transition: "width 0.3s ease",
          overflowX: "hidden",
        },
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: isCollapsed ? "center" : "flex-end",
          p: 1,
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Tooltip title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"} placement="right">
          <IconButton onClick={toggleSidebar} size="small">
            {isCollapsed ? <MenuIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Tooltip>
      </Box>
      <Box
        sx={{
          p: 2,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          borderBottom: "1px solid",
          borderColor: "divider",
          minHeight: isCollapsed ? "auto" : "160px",
        }}
      >
        {!isCollapsed && (
          <>
            <Avatar
              src={currentUser?.profilePicture}
              alt={currentUser?.name}
              sx={{
                width: 80,
                height: 80,
                mb: 1,
                border: "3px solid",
                borderColor: "success.main",
              }}
            > 
              {currentUser?.name?.charAt(0)?.toUpperCase()}
            </Avatar>
            <Typography variant="h6" fontWeight={600} noWrap sx={{ maxWidth: "100%" }}>
              {currentUser?.name || "User"}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap sx={{ maxWidth: "100%" }}>
              {currentUser?.email || ""}
            </Typography>
          </>
        )}
        {isCollapsed && (
          <Avatar
            src={currentUser?.profilePicture}
            alt={currentUser?.name}
            sx={{
              width: 40,
              height: 40,
              border: "2px solid",
              borderColor: "success.main",
            }}
          >
            {currentUser?.name?.charAt(0)?.toUpperCase()}
          </Avatar>
        )}
      </Box>



      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
            <Tooltip title={isCollapsed ? item.text : ""} placement="right">
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
                sx={{
                  mx: 1,
                  borderRadius: 2,
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  "&.Mui-selected": {
                    bgcolor: "success.main",
                    color: "white",
                    "&:hover": {
                      bgcolor: "success.dark",
                    },
                    "& .MuiListItemIcon-root": {
                      color: "white",
                    },
                  },
                  "&:hover": {
                    bgcolor: "action.hover",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? "white" : "inherit",
                    minWidth: isCollapsed ? 0 : 40,
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!isCollapsed && <ListItemText primary={item.text} />}
              </ListItemButton>
            </Tooltip>
          </ListItem>
        ))}
      </List>

      <Divider />
      <List>
        <ListItem disablePadding>
          <Tooltip title={isCollapsed ? "Logout" : ""} placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                mx: 1,
                mb: 1,
                borderRadius: 2,
                color: "error.main",
                justifyContent: isCollapsed ? "center" : "flex-start",
                "&:hover": {
                  bgcolor: "error.light",
                  color: "white",
                },
              }}
            >
              <ListItemIcon
                sx={{
                  color: "inherit",
                  minWidth: isCollapsed ? 0 : 40,
                  justifyContent: "center",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {!isCollapsed && <ListItemText primary="Logout" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Drawer>
  );
}

export default Sidebar;