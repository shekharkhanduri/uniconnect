import * as React from 'react';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CameraAltIcon from '@mui/icons-material/CameraAlt';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { register } from "../services/auth";
import IconButton from '@mui/material/IconButton';
import Divider from '@mui/material/Divider';
import bgImage from "../assets/gehuHome.jpg";

const defaultTheme = createTheme();

export default function RegisterPage() {
  const navigate = useNavigate();
  // Match userModel.js fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");

  // education fields
  const [university, setUniversity] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState(""); // e.g., "2nd Year"
  const [graduationYear, setGraduationYear] = useState(""); // numeric

  // skills as comma-separated input; will convert to array
  const [skillsInput, setSkillsInput] = useState("");

  // social links
  const [github, setGithub] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [portfolio, setPortfolio] = useState("");

  // new: profile picture file
  const [profileFile, setProfileFile] = useState(null);
  const [profilePreview, setProfilePreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState("");

  const validateRequired = () => {
    if (!name.trim()) {
      setErrorMessage("Please enter your full name.");
      return false;
    }
    if (!email.trim()) {
      setErrorMessage("Please enter your email address.");
      return false;
    }
    if (!password) {
      setErrorMessage("Please enter a password.");
      return false;
    }
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMessage("Please enter a valid email address.");
      return false;
    }
    return true;
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setProfileFile(file);
    
    // Create preview URL
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setProfilePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccess("");

    if (!validateRequired()) return;

    setLoading(true);
    try {
      // Build FormData to allow file upload
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('email', email.trim().toLowerCase());
      formData.append('password', password);
      if (bio.trim()) formData.append('bio', bio.trim());

      // Education as JSON string (backend should parse this if expecting nested object)
      const education = {};
      if (university.trim()) education.university = university.trim();
      if (course.trim()) education.course = course.trim();
      if (year.trim()) education.year = year.trim();
      if (graduationYear) education.graduationYear = Number(graduationYear);
      if (Object.keys(education).length) formData.append('education', JSON.stringify(education));

      // Skills array as JSON string
      const skillsArr = skillsInput ? skillsInput.split(',').map(s => s.trim()).filter(Boolean) : [];
      if (skillsArr.length) formData.append('skills', JSON.stringify(skillsArr));

      // Social links as JSON string
      const socialLinks = {};
      if (github.trim()) socialLinks.github = github.trim();
      if (linkedin.trim()) socialLinks.linkedin = linkedin.trim();
      if (portfolio.trim()) socialLinks.portfolio = portfolio.trim();
      if (Object.keys(socialLinks).length) formData.append('socialLinks', JSON.stringify(socialLinks));

      // File upload: append if selected. Backend should handle storage and set profilePicture field.
      if (profileFile) {
        // TODO: if backend expects a different field name, change 'profilePicture' accordingly.
        formData.append('profilePicture', profileFile);
      }

      // send FormData to register service
      const res = await register(formData);
      setSuccess("Registration successful!");
      // Navigate to dashboard after successful registration
      setTimeout(() => {
        navigate("/dashboard");
      }, 1500);
    } catch (err) {
      // Display user-friendly error message from backend
      const errorMsg = err.message || "Registration failed. Please try again.";
      setErrorMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 2,
          backgroundImage: `url(${bgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat'
        }}
      >
        <Paper
          elevation={8}
          sx={{
            width: '100%',
            maxWidth: 640,
            p: 4,
            borderRadius: 2,
            bgcolor: 'rgba(255,255,255,0.96)'
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Profile Picture Upload - At the Top */}
            <Box sx={{ position: 'relative', mb: 2 }}>
              <input
                accept="image/*"
                id="profile-upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="profile-upload">
                <Avatar
                  sx={{
                    width: 120,
                    height: 120,
                    bgcolor: 'success.main',
                    cursor: 'pointer',
                    border: '4px solid',
                    borderColor: 'success.light',
                    '&:hover': {
                      opacity: 0.9,
                      borderColor: 'success.main',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  src={profilePreview}
                  alt="Profile Preview"
                >
                  {!profilePreview && <PersonAddIcon sx={{ fontSize: 60 }} />}
                </Avatar>
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'success.main',
                    color: 'white',
                    border: '3px solid white',
                    width: 40,
                    height: 40,
                    '&:hover': {
                      bgcolor: 'success.dark',
                    },
                  }}
                >
                  <CameraAltIcon fontSize="small" />
                </IconButton>
              </label>
            </Box>

            <Typography component="h1" variant="h5" sx={{ mb: 1 }}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              Upload your profile picture to get started
            </Typography>

            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ width: '100%' }}>
              {/* Basic Information Section */}
              <Typography variant="h6" sx={{ mt: 2, mb: 1, fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
                Basic Information
              </Typography>
              
              <TextField
                margin="normal"
                required
                fullWidth
                id="name"
                label="Full Name"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
                error={!!errorMessage}
                sx={{ mb: 1 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!errorMessage}
                sx={{ mb: 1 }}
              />

              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!errorMessage}
                sx={{ mb: 1 }}
              />

              <TextField
                margin="normal"
                fullWidth
                id="bio"
                label="Short Bio (optional)"
                name="bio"
                multiline
                rows={3}
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                helperText="Tell us a bit about yourself"
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              {/* Education Section */}
              <Typography variant="h6" sx={{ mt: 1, mb: 1, fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
                Education (optional)
              </Typography>
              
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 1 }}>
                <TextField
                  margin="normal"
                  sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
                  id="university"
                  label="University"
                  name="university"
                  value={university}
                  onChange={(e) => setUniversity(e.target.value)}
                />
                <TextField
                  margin="normal"
                  sx={{ flex: 1, minWidth: { xs: '100%', sm: 200 } }}
                  id="course"
                  label="Course"
                  name="course"
                  value={course}
                  onChange={(e) => setCourse(e.target.value)}
                />
              </Box>
              
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', mb: 2 }}>
                <TextField
                  margin="normal"
                  sx={{ flex: 1, minWidth: { xs: '100%', sm: 180 } }}
                  id="year"
                  label="Year (e.g., Final Year)"
                  name="year"
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                />
                <TextField
                  margin="normal"
                  sx={{ flex: 1, minWidth: { xs: '100%', sm: 160 } }}
                  id="graduationYear"
                  label="Graduation Year"
                  name="graduationYear"
                  type="number"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                />
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Skills Section */}
              <Typography variant="h6" sx={{ mt: 1, mb: 1, fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
                Skills (optional)
              </Typography>
              
              <TextField
                margin="normal"
                fullWidth
                id="skills"
                label="Skills (comma separated)"
                name="skills"
                value={skillsInput}
                onChange={(e) => setSkillsInput(e.target.value)}
                helperText="e.g. React, Node.js, SQL, Python"
                sx={{ mb: 2 }}
              />

              <Divider sx={{ my: 2 }} />

              {/* Social Links Section */}
              <Typography variant="h6" sx={{ mt: 1, mb: 1, fontSize: '1rem', fontWeight: 600, color: 'text.primary' }}>
                Social Links (optional)
              </Typography>
              
              <TextField
                margin="normal"
                fullWidth
                id="github"
                label="GitHub URL"
                name="github"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="https://github.com/username"
                sx={{ mb: 1 }}
              />
              
              <TextField
                margin="normal"
                fullWidth
                id="linkedin"
                label="LinkedIn URL"
                name="linkedin"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                placeholder="https://linkedin.com/in/username"
                sx={{ mb: 1 }}
              />
              
              <TextField
                margin="normal"
                fullWidth
                id="portfolio"
                label="Portfolio URL"
                name="portfolio"
                value={portfolio}
                onChange={(e) => setPortfolio(e.target.value)}
                placeholder="https://yourportfolio.com"
                sx={{ mb: 2 }}
              />

              {errorMessage && (
                <Typography color="error" variant="body2" sx={{ mt: 2, mb: 1 }}>
                  {errorMessage}
                </Typography>
              )}
              {success && (
                <Typography color="success" variant="body2" sx={{ mt: 2, mb: 1 }}>
                  {success}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
                disabled={loading}
                color="success"
                size="large"
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              <Box sx={{ textAlign: 'center', mt: 2 }}>
                <Link component="button" variant="body2" onClick={() => navigate("/login")}>
                  Already have an account? Sign in
                </Link>
              </Box>
            </Box>
          </Box>
        </Paper>
      </Box>
    </ThemeProvider>
  );
}
