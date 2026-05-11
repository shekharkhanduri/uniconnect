import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Grid,
  TextField,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { UserCard } from "../components/UserCard";
import { getAllUsers, getCurrentUser } from "../services/userService";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  getConnectionStatus,
} from "../services/connectionService";
import { Sidebar } from "../components/Sidebar";

export function Dashboard() {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [connectionStatuses, setConnectionStatuses] = useState({});
  const [processingConnections, setProcessingConnections] = useState(new Set());

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch current user and all users in parallel
      const [currentUserData, usersData] = await Promise.all([
        getCurrentUser(),
        getAllUsers(),
      ]);

      setCurrentUser(currentUserData);
      
      // Filter out current user from the list
      const currentUserId = currentUserData.id || currentUserData._id;
      const filteredUsers = usersData.filter(
        (user) => user._id !== currentUserId
      );
      setUsers(filteredUsers);

      // Fetch connection statuses for all users
      const statusPromises = filteredUsers.map(async (user) => {
        try {
          const status = await getConnectionStatus(user._id);
          return { userId: user._id, status };
        } catch (err) {
          console.error(`Error fetching status for user ${user._id}:`, err);
          return { userId: user._id, status: null };
        }
      });

      const statuses = await Promise.all(statusPromises);
      const statusMap = {};
      statuses.forEach(({ userId, status }) => {
        statusMap[userId] = status;
      });
      setConnectionStatuses(statusMap);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (userId, connectionStatus) => {
    if (processingConnections.has(userId)) return;

    try {
      setProcessingConnections((prev) => new Set(prev).add(userId));

      // If there's a pending request received, accept it
      if (connectionStatus?.status === "pending" && connectionStatus?.direction === "received") {
        const result = await acceptConnectionRequest(connectionStatus.connectionId);
        toast.success("Connection request accepted!");
        
        // Update connection status
        setConnectionStatuses((prev) => ({
          ...prev,
          [userId]: { status: "accepted" },
        }));
      } else if (!connectionStatus || connectionStatus.status === "none") {
        // Send new connection request
        await sendConnectionRequest(userId);
        toast.success("Connection request sent!");
        
        // Update connection status
        setConnectionStatuses((prev) => ({
          ...prev,
          [userId]: { status: "pending", direction: "sent" },
        }));
      }
    } catch (err) {
      console.error("Error handling connection:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to process connection request";
      toast.error(errorMessage);
    } finally {
      setProcessingConnections((prev) => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.bio?.toLowerCase().includes(query) ||
      user.education?.university?.toLowerCase().includes(query) ||
      user.education?.course?.toLowerCase().includes(query) ||
      user.skills?.some((skill) => skill.toLowerCase().includes(query))
    );
  });

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
      <Sidebar currentUser = {currentUser} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: "background.default",
          p: 3,
          overflow: "auto",
        }}
      >
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Discover Users
          </Typography>

          {/* Search Bar */}
          <TextField
            fullWidth
            placeholder="Search by name, skills, university, or course..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3, maxWidth: 600 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          {/* Users Grid */}
          {filteredUsers.length === 0 ? (
            <Box
              sx={{
                textAlign: "center",
                py: 8,
                color: "text.secondary",
              }}
            >
              <Typography variant="h6">
                {searchQuery ? "No users found matching your search." : "No users available."}
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {filteredUsers.map((user) => (
                <Grid  key={user._id}>
                  <UserCard
                    user={user}
                    currentUserId={currentUser?.id || currentUser?._id}
                    onConnect={handleConnect}
                    connectionStatus={connectionStatuses[user._id]}
                  />
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </Box>
  );
}

export default Dashboard;

