import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  Avatar,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Divider,
  Alert,
} from "@mui/material";
import {
  CheckCircle,
  Cancel,
  MoreVert,
  PersonRemove,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import { getCurrentUser } from "../services/userService";
import {
  getMyConnections,
  getPendingRequests,
  getSentRequests,
  acceptConnectionRequest,
  rejectConnectionRequest,
  removeConnection,
} from "../services/connectionService";

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Connections() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tabValue, setTabValue] = useState(0);

  // Data states
  const [connections, setConnections] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [sentRequests, setSentRequests] = useState([]);

  // Menu anchor for actions
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUserId, setSelectedUserId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      const currentUserData = await getCurrentUser();
      setCurrentUser(currentUserData);

      // Fetch all connection data in parallel
      const [connectionsData, pendingData, sentData] = await Promise.all([
        getMyConnections(),
        getPendingRequests(),
        getSentRequests(),
      ]);

      setConnections(connectionsData.connections || []);
      setPendingRequests(pendingData.requests || []);
      setSentRequests(sentData.requests || []);
    } catch (err) {
      console.error("Error fetching connections:", err);
      setError("Failed to load connections. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (connectionId) => {
    try {
      await acceptConnectionRequest(connectionId);
      toast.success("Connection request accepted!");
      await fetchData(); // Refresh data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to accept request";
      toast.error(errorMessage);
    }
  };

  const handleReject = async (connectionId) => {
    try {
      await rejectConnectionRequest(connectionId);
      toast.success("Connection request rejected");
      await fetchData(); // Refresh data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to reject request";
      toast.error(errorMessage);
    }
  };

  const handleRemove = async (userId) => {
    try {
      await removeConnection(userId);
      toast.success("Connection removed");
      setAnchorEl(null);
      await fetchData(); // Refresh data
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || "Failed to remove connection";
      toast.error(errorMessage);
    }
  };

  const handleMenuOpen = (event, userId) => {
    setAnchorEl(event.currentTarget);
    setSelectedUserId(userId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedUserId(null);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar currentUser={currentUser} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          overflow: "auto",
        }}
      >
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Connections
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Paper elevation={3} sx={{ borderRadius: 2 }}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab
                  label={
                    <Badge badgeContent={connections.length} color="success">
                      Connections
                    </Badge>
                  }
                />
                <Tab
                  label={
                    <Badge badgeContent={pendingRequests.length} color="error">
                      Pending Requests
                    </Badge>
                  }
                />
                <Tab
                  label={
                    <Badge badgeContent={sentRequests.length} color="warning">
                      Sent Requests
                    </Badge>
                  }
                />
              </Tabs>
            </Box>

            {/* Connections Tab */}
            <TabPanel value={tabValue} index={0}>
              {connections.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                  <Typography variant="h6">No connections yet</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Start connecting with other users from the Dashboard
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ mt: 2 }}>
                  {connections.map((conn) => (
                    <Box
                      key={conn.connectionId}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        py: 1.5,
                        px: 1,
                        "&:hover": {
                          backgroundColor: "action.hover",
                          borderRadius: 1,
                        },
                      }}
                    >
                      <Avatar
                        src={conn.user?.profilePicture}
                        alt={conn.user?.name}
                        sx={{
                          width: 48,
                          height: 48,
                          cursor: "pointer",
                        }}
                        onClick={() => navigate(`/profile/${conn.user._id}`)}
                      >
                        {conn.user?.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      
                      <Typography
                        variant="body1"
                        fontWeight={500}
                        sx={{ 
                          cursor: "pointer",
                          "&:hover": { textDecoration: "underline" }
                        }}
                        onClick={() => navigate(`/profile/${conn.user._id}`)}
                      >
                        {conn.user?.name}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </TabPanel>

            {/* Pending Requests Tab */}
            <TabPanel value={tabValue} index={1}>
              {pendingRequests.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                  <Typography variant="h6">No pending requests</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    You don't have any pending connection requests
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {pendingRequests.map((request) => (
                    <Grid size={{xs:12, sm:6, md:4}} key={request._id}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          "&:hover": {
                            boxShadow: 4,
                          },
                        }}
                      >
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                          <Avatar
                            src={request.sender?.profilePicture}
                            alt={request.sender?.name}
                            sx={{
                              width: 60,
                              height: 60,
                              cursor: "pointer",
                            }}
                            onClick={() => navigate(`/profile/${request.sender._id}`)}
                          >
                            {request.sender?.name?.charAt(0)?.toUpperCase()}
                          </Avatar>
                          <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle1"
                              fontWeight={600}
                              noWrap
                              sx={{ cursor: "pointer" }}
                              onClick={() => navigate(`/profile/${request.sender._id}`)}
                            >
                              {request.sender?.name}
                            </Typography>
                            {request.sender?.education?.course && (
                              <Typography variant="body2" color="text.secondary" noWrap>
                                {request.sender.education.course}
                              </Typography>
                            )}
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="contained"
                            color="success"
                            size="small"
                            startIcon={<CheckCircle />}
                            onClick={() => handleAccept(request._id)}
                            sx={{ flex: 1 }}
                          >
                            Accept
                          </Button>
                          <Button
                            variant="outlined"
                            color="error"
                            size="small"
                            startIcon={<Cancel />}
                            onClick={() => handleReject(request._id)}
                            sx={{ flex: 1 }}
                          >
                            Reject
                          </Button>
                        </Box>
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>

            {/* Sent Requests Tab */}
            <TabPanel value={tabValue} index={2}>
              {sentRequests.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 8, color: "text.secondary" }}>
                  <Typography variant="h6">No sent requests</Typography>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    You haven't sent any connection requests yet
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {sentRequests.map((request) => (
                    <Grid xs={12} sm={6} md={4} key={request._id}>
                      <Paper
                        elevation={2}
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          display: "flex",
                          alignItems: "center",
                          gap: 2,
                          "&:hover": {
                            boxShadow: 4,
                          },
                        }}
                      >
                        <Avatar
                          src={request.receiver?.profilePicture}
                          alt={request.receiver?.name}
                          sx={{
                            width: 60,
                            height: 60,
                            cursor: "pointer",
                          }}
                          onClick={() => navigate(`/profile/${request.receiver._id}`)}
                        >
                          {request.receiver?.name?.charAt(0)?.toUpperCase()}
                        </Avatar>
                        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={600}
                            noWrap
                            sx={{ cursor: "pointer" }}
                            onClick={() => navigate(`/profile/${request.receiver._id}`)}
                          >
                            {request.receiver?.name}
                          </Typography>
                          {request.receiver?.education?.course && (
                            <Typography variant="body2" color="text.secondary" noWrap>
                              {request.receiver.education.course}
                            </Typography>
                          )}
                        </Box>
                        <Chip label="Pending" color="warning" size="small" />
                      </Paper>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
          </Paper>

          {/* Menu for connection actions */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem
              onClick={() => {
                if (selectedUserId) {
                  handleRemove(selectedUserId);
                }
              }}
              sx={{ color: "error.main" }}
            >
              <PersonRemove sx={{ mr: 1 }} />
              Remove Connection
            </MenuItem>
          </Menu>
        </Container>
      </Box>
    </Box>
  );
}

