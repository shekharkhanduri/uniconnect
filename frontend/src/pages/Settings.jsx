import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  CircularProgress,
  Paper,
  TextField,
  Button,
  Grid,
  Divider,
  Alert,
  Avatar,
  IconButton,
} from "@mui/material";
import { CameraAlt } from "@mui/icons-material";
import { Sidebar } from "../components/Sidebar";
import { getCurrentUser, getUserById, updateUser } from "../services/userService";

export function Settings() {
  const [currentUser, setCurrentUser] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Form state
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [skillsInput, setSkillsInput] = useState("");
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const currentUserData = await getCurrentUser();
      setCurrentUser(currentUserData);

      const currentUserId = currentUserData.id || currentUserData._id;
      const fullUserData = await getUserById(currentUserId);
      setUser(fullUserData);

      // Populate form fields
      setName(fullUserData.name || "");
      setBio(fullUserData.bio || "");
      setUniversity(fullUserData.education?.university || "");
      setCourse(fullUserData.education?.course || "");
      setYear(fullUserData.education?.year || "");
      setGraduationYear(fullUserData.education?.graduationYear?.toString() || "");
      setSkillsInput(fullUserData.skills?.join(", ") || "");
      setGithub(fullUserData.socialLinks?.github || "");
      setLinkedin(fullUserData.socialLinks?.linkedin || "");
      setPortfolio(fullUserData.socialLinks?.portfolio || "");
      setProfilePreview(fullUserData.profilePicture || null);
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileFile(file);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    setSuccess("");

    try {
      const formData = new FormData();
      formData.append("name", name.trim());
      if (bio.trim()) formData.append("bio", bio.trim());

      const education = {};
      if (university.trim()) education.university = university.trim();
      if (course.trim()) education.course = course.trim();
      if (year.trim()) education.year = year.trim();
      if (graduationYear) education.graduationYear = Number(graduationYear);
      if (Object.keys(education).length) {
        formData.append("education", JSON.stringify(education));
      }

      const skillsArr = skillsInput
        ? skillsInput.split(",").map((s) => s.trim()).filter(Boolean)
        : [];
      if (skillsArr.length) {
        formData.append("skills", JSON.stringify(skillsArr));
      }

      const socialLinks = {};
      if (github.trim()) socialLinks.github = github.trim();
      if (linkedin.trim()) socialLinks.linkedin = linkedin.trim();
      if (portfolio.trim()) socialLinks.portfolio = portfolio.trim();
      if (Object.keys(socialLinks).length) {
        formData.append("socialLinks", JSON.stringify(socialLinks));
      }

      if (profileFile) {
        formData.append("profilePicture", profileFile);
      }

      const currentUserId = currentUser.id || currentUser._id;
      await updateUser(currentUserId, formData);
      setSuccess("Profile updated successfully!");
      
      // Refresh user data
      await fetchUserData();
    } catch (err) {
      setError(err.message || "Failed to update profile.");
    } finally {
      setSaving(false);
    }
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
        <Container maxWidth="md">
          <Typography variant="h4" fontWeight={600} gutterBottom sx={{ mb: 3 }}>
            Settings
          </Typography>

          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <form onSubmit={handleSubmit}>
              {/* Profile Picture */}
              <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 4 }}>
                <input
                  accept="image/*"
                  id="profile-upload"
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
                <label htmlFor="profile-upload">
                  <Box sx={{ position: "relative", cursor: "pointer" }}>
                    <Avatar
                      src={profilePreview}
                      alt={name}
                      sx={{
                        width: 120,
                        height: 120,
                        border: "4px solid",
                        borderColor: "success.main",
                      }}
                    >
                      {name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <IconButton
                      component="span"
                      sx={{
                        position: "absolute",
                        bottom: 0,
                        right: 0,
                        bgcolor: "success.main",
                        color: "white",
                        border: "3px solid white",
                        "&:hover": { bgcolor: "success.dark" },
                      }}
                    >
                      <CameraAlt />
                    </IconButton>
                  </Box>
                </label>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Click to change profile picture
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2 }}>
                  {error}
                </Alert>
              )}
              {success && (
                <Alert severity="success" sx={{ mb: 2 }}>
                  {success}
                </Alert>
              )}

              {/* Basic Information */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Basic Information
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    required
                    label="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Bio"
                    multiline
                    rows={3}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    helperText="Tell us about yourself"
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Education */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Education
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="University"
                    value={university}
                    onChange={(e) => setUniversity(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Course"
                    value={course}
                    onChange={(e) => setCourse(e.target.value)}
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Year"
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    placeholder="e.g., Final Year"
                  />
                </Grid>
                <Grid xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Graduation Year"
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                  />
                </Grid>
              </Grid>

              <Divider sx={{ my: 3 }} />

              {/* Skills */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Skills
              </Typography>
              <TextField
                fullWidth
                label="Skills (comma separated)"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                helperText="e.g. React, Node.js, SQL, Python"
                sx={{ mb: 3 }}
              />

              <Divider sx={{ my: 3 }} />

              {/* Social Links */}
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Social Links
              </Typography>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="GitHub URL"
                    value={github}
                    onChange={(e) => setGithub(e.target.value)}
                    placeholder="https://github.com/username"
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="LinkedIn URL"
                    value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                    placeholder="https://linkedin.com/in/username"
                  />
                </Grid>
                <Grid xs={12}>
                  <TextField
                    fullWidth
                    label="Portfolio URL"
                    value={portfolio}
                    onChange={(e) => setPortfolio(e.target.value)}
                    placeholder="https://yourportfolio.com"
                  />
                </Grid>
              </Grid>

              <Button
                type="submit"
                variant="contained"
                color="success"
                size="large"
                fullWidth
                disabled={saving}
                sx={{ mt: 2, py: 1.5 }}
              >
                {saving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
}

export default Settings;

