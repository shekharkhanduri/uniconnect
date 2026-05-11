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
  Divider,
  Link as MuiLink,
  Alert,
  Button,
} from "@mui/material";
import {
  GitHub,
  LinkedIn,
  Language,
  School,
  Work,
  Email,
  CheckCircle,
  PersonAdd,
  HourglassEmpty,
} from "@mui/icons-material";
import { toast } from "react-hot-toast";
import { Sidebar } from "../components/Sidebar";
import { getCurrentUser, getUserById } from "../services/userService";
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  getConnectionStatus,
  removeConnection,
} from "../services/connectionService";
import { useParams } from "react-router-dom";

export function Profile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [connectionStatus, setConnectionStatus] = useState(null);
  const [processingConnection, setProcessingConnection] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, [userId]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");

      // Get current user for sidebar
      const currentUserData = await getCurrentUser();
      setCurrentUser(currentUserData);

      // Get profile user (if userId provided, else show current user)
      const currentUserId = currentUserData.id || currentUserData._id;
      if (userId && userId !== currentUserId) {
        const [userData, statusData] = await Promise.all([
          getUserById(userId),
          getConnectionStatus(userId),
        ]);
        setUser(userData);
        setConnectionStatus(statusData);
      } else {
        // Fetch full current user data
        const fullUserData = await getUserById(currentUserId);
        setUser(fullUserData);
        setConnectionStatus({ status: "self" });
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError("Failed to load profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnectionAction = async () => {
    if (processingConnection || !userId) return;

    try {
      setProcessingConnection(true);

      // If there's a pending request received, accept it
      if (connectionStatus?.status === "pending" && connectionStatus?.direction === "received") {
        await acceptConnectionRequest(connectionStatus.connectionId);
        toast.success("Connection request accepted!");
        setConnectionStatus({ status: "accepted" });
      } else if (connectionStatus?.status === "accepted") {
        // Remove connection
        await removeConnection(userId);
        toast.success("Connection removed");
        setConnectionStatus({ status: "none" });
      } else if (!connectionStatus || connectionStatus.status === "none") {
        // Send new connection request
        await sendConnectionRequest(userId);
        toast.success("Connection request sent!");
        setConnectionStatus({ status: "pending", direction: "sent" });
      }
    } catch (err) {
      console.error("Error handling connection:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to process connection";
      toast.error(errorMessage);
    } finally {
      setProcessingConnection(false);
    }
  };

  const getConnectionButton = () => {
    const currentUserId = currentUser?.id || currentUser?._id;
    const isOwnProfile = !userId || userId === currentUserId;
    if (isOwnProfile) return null;

    let buttonText = "Connect";
    let buttonIcon = <PersonAdd />;
    let buttonVariant = "contained";
    let buttonColor = "success";

    if (connectionStatus?.status === "accepted") {
      buttonText = "Connected";
      buttonIcon = <CheckCircle />;
      buttonVariant = "outlined";
    } else if (connectionStatus?.status === "pending") {
      if (connectionStatus?.direction === "sent") {
        buttonText = "Pending";
        buttonIcon = <HourglassEmpty />;
        buttonVariant = "outlined";
      } else {
        buttonText = "Accept Request";
        buttonIcon = <CheckCircle />;
      }
    }

    return (
      <Button
        variant={buttonVariant}
        color={buttonColor}
        startIcon={buttonIcon}
        onClick={handleConnectionAction}
        disabled={processingConnection || (connectionStatus?.status === "pending" && connectionStatus?.direction === "sent")}
        size="large"
        sx={{ mt: 2 }}
      >
        {processingConnection ? "Processing..." : buttonText}
      </Button>
    );
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

  if (error || !user) {
    return (
      <Box sx={{ display: "flex", minHeight: "100vh" }}>
        <Sidebar currentUser={currentUser} />
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Alert severity="error">{error || "User not found"}</Alert>
        </Box>
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
        <Container maxWidth="md">
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            {/* Profile Header */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                mb: 4,
              }}
            >
              <Avatar
                src={user.profilePicture}
                alt={user.name}
                sx={{
                  width: 150,
                  height: 150,
                  mb: 2,
                  border: "4px solid",
                  borderColor: "success.main",
                }}
              >
                {user.name?.charAt(0)?.toUpperCase()}
              </Avatar>
              <Typography variant="h4" fontWeight={600} gutterBottom>
                {user.name}
              </Typography>
              {user.email && (
                <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                  <Email sx={{ mr: 1, fontSize: 18, color: "text.secondary" }} />
                  <Typography variant="body1" color="text.secondary">
                    {user.email}
                  </Typography>
                </Box>
              )}
              {getConnectionButton()}
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Bio */}
            {user.bio && (
              <Box sx={{ mb: 3 }}>
                <Typography variant="h6" gutterBottom fontWeight={600}>
                  About
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {user.bio}
                </Typography>
              </Box>
            )}

            {/* Education */}
            {user.education && (
              (user.education.university || user.education.course) && (
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                    <School sx={{ mr: 1, color: "success.main" }} />
                    <Typography variant="h6" fontWeight={600}>
                      Education
                    </Typography>
                  </Box>
                  <Grid container spacing={2} sx={{ mt: 1 }}>
                    {user.education.university && (
                      <Grid size={{xs:12, sm:6}}>
                        <Typography variant="body2" color="text.secondary">
                          University
                        </Typography>
                        <Typography variant="body1">
                          {user.education.university}
                        </Typography>
                      </Grid>
                    )}
                    {user.education.course && (
                      <Grid size={{xs:12, sm:6}}>
                        <Typography variant="body2" color="text.secondary">
                          Course
                        </Typography>
                        <Typography variant="body1">
                          {user.education.course}
                        </Typography>
                      </Grid>
                    )}
                    {user.education.year && (
                      <Grid size={{xs:12, sm:6}}>
                        <Typography variant="body2" color="text.secondary">
                          Year
                        </Typography>
                        <Typography variant="body1">
                          {user.education.year}
                        </Typography>
                      </Grid>
                    )}
                    {user.education.graduationYear && (
                      <Grid size={{xs:12, sm:6}}>
                        <Typography variant="body2" color="text.secondary">
                          Graduation Year
                        </Typography>
                        <Typography variant="body1">
                          {user.education.graduationYear}
                        </Typography>
                      </Grid>
                    )}
                  </Grid>
                </Box>
              )
            )}

            {/* Skills */}
            {user.skills && user.skills.length > 0 && (
              <Box sx={{ mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
                  <Work sx={{ mr: 1, color: "success.main" }} />
                  <Typography variant="h6" fontWeight={600}>
                    Skills
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                  {user.skills.map((skill, index) => (
                    <Chip
                      key={index}
                      label={skill}
                      color="success"
                      variant="outlined"
                    />
                  ))}
                </Box>
              </Box>
            )}

            {/* Social Links */}
            {user.socialLinks && (
              (user.socialLinks.github || user.socialLinks.linkedin || user.socialLinks.portfolio) && (
                <Box>
                  <Typography variant="h6" gutterBottom fontWeight={600}>
                    Social Links
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                    {user.socialLinks.github && (
                      <MuiLink
                        href={user.socialLinks.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": { color: "success.main" },
                        }}
                      >
                        <GitHub sx={{ mr: 1 }} />
                        GitHub
                      </MuiLink>
                    )}
                    {user.socialLinks.linkedin && (
                      <MuiLink
                        href={user.socialLinks.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": { color: "success.main" },
                        }}
                      >
                        <LinkedIn sx={{ mr: 1 }} />
                        LinkedIn
                      </MuiLink>
                    )}
                    {user.socialLinks.portfolio && (
                      <MuiLink
                        href={user.socialLinks.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          color: "text.primary",
                          textDecoration: "none",
                          "&:hover": { color: "success.main" },
                        }}
                      >
                        <Language sx={{ mr: 1 }} />
                        Portfolio
                      </MuiLink>
                    )}
                  </Box>
                </Box>
              )
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default Profile;

