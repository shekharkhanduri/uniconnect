import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Box,
  Chip,
  Button,
  Link as MuiLink,
} from "@mui/material";
import {
  GitHub,
  LinkedIn,
  Language,
  School,
  Work,
} from "@mui/icons-material";

export function UserCard({ user, currentUserId, onConnect, connectionStatus }) {
  const navigate = useNavigate();
  
  if (!user) return null;

  const {
    _id,
    name,
    bio,
    profilePicture,
    education,
    skills,
    socialLinks,
  } = user;

  const isCurrentUser = _id === currentUserId;
  const shortBio = bio
  ? bio.split(" ").slice(0, 10).join(" ") + "..."
  : "";



  const handleCardClick = (e) => {
    // Don't navigate if clicking on buttons or links
    if (e.target.closest('button') || e.target.closest('a')) {
      return;
    }
    navigate(`/profile/${_id}`);
  };

  const getButtonText = () => {
    if (!connectionStatus) return "Connect";
    if (connectionStatus.status === "accepted") return "Connected";
    if (connectionStatus.status === "pending") {
      return connectionStatus.direction === "sent" ? "Pending" : "Accept";
    }
    return "Connect";
  };

  const handleConnectClick = (e) => {
    e.stopPropagation();
    if (onConnect) {
      onConnect(_id, connectionStatus);
    }
  };

  return (
    <Card
      onClick={handleCardClick}
      sx={{
        maxWidth: 400,
        minWidth: 400,
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: 3,
        transition: "transform 0.2s, box-shadow 0.2s",
        cursor: "pointer",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: 6,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1, pb: 1 }}>
        {/* Profile Header */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Avatar
            src={profilePicture}
            alt={name}
            sx={{
              width: 100,
              height: 100,
              mb: 1.5,
              border: "3px solid",
              borderColor: "success.main",
            }}
          >
            {name?.charAt(0)?.toUpperCase()}
          </Avatar>
          <Typography variant="h6" component="h3" fontWeight={600}>
            {name}
          </Typography>
        </Box>

        {/* Bio */}
        {bio && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 2, textAlign: "center", minHeight: 40 }}
          >
            {shortBio}
          </Typography>
        )}

        {/* Education */}
        {education && (education.university || education.course) && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <School sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }} />
              <Typography variant="body2" fontWeight={500}>
                Education
              </Typography>
            </Box>
            <Typography variant="body2" color="text.secondary" sx={{ ml: 2.5 }}>
              {education.course && `${education.course}`}
              {education.university && ` at ${education.university}`}
              {education.year && ` • ${education.year}`}
            </Typography>
          </Box>
        )}

        {/* Skills */}
        {skills && skills.length > 0 && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 0.5 }}>
              <Work sx={{ fontSize: 18, mr: 0.5, color: "text.secondary" }} />
              <Typography variant="body2" fontWeight={500}>
                Skills
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexWrap: "wrap",
                gap: 0.5,
                ml: 2.5,
              }}
            >
              {skills.slice(0, 5).map((skill, index) => (
                <Chip
                  key={index}
                  label={skill}
                  size="small"
                  color="success"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              ))}
              {skills.length > 5 && (
                <Chip
                  label={`+${skills.length - 5}`}
                  size="small"
                  variant="outlined"
                  sx={{ fontSize: "0.7rem" }}
                />
              )}
            </Box>
          </Box>
        )}

        {/* Social Links */}
        {socialLinks && (
          <Box sx={{ display: "flex", justifyContent: "center", gap: 1, mt: 1 }}>
            {socialLinks.github && (
              <MuiLink
                href={socialLinks.github}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "text.secondary", "&:hover": { color: "success.main" } }}
              >
                <GitHub fontSize="small" />
              </MuiLink>
            )}
            {socialLinks.linkedin && (
              <MuiLink
                href={socialLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "text.secondary", "&:hover": { color: "success.main" } }}
              >
                <LinkedIn fontSize="small" />
              </MuiLink>
            )}
            {socialLinks.portfolio && (
              <MuiLink
                href={socialLinks.portfolio}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ color: "text.secondary", "&:hover": { color: "success.main" } }}
              >
                <Language fontSize="small" />
              </MuiLink>
            )}
          </Box>
        )}
      </CardContent>

      <CardActions sx={{ justifyContent: "center", pb: 2 }} onClick={(e) => e.stopPropagation()}>
        {!isCurrentUser && onConnect && (
          <Button
            variant={
              connectionStatus?.status === "accepted" ? "outlined" : "contained"
            }
            color="success"
            size="small"
            onClick={handleConnectClick}
            disabled={connectionStatus?.status === "accepted" || (connectionStatus?.status === "pending" && connectionStatus?.direction === "sent")}
            sx={{ minWidth: 120 }}
          >
            {getButtonText()}
          </Button>
        )}
        {isCurrentUser && (
          <Button
            variant="outlined"
            color="success"
            size="small"
            disabled
            sx={{ minWidth: 120 }}
          >
            You
          </Button>
        )}
      </CardActions>
    </Card>
  );
}

