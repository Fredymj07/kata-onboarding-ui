import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  IconButton
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { jwtDecode } from 'jwt-decode';
import config from '../config.js';

const onboardingUrl = config.API_URL + '/onboarding';

export default function OnboardingCRUD() {
  const [onboardings, setOnboardings] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    type: 'technician',
    workArea: '',
    description: '',
    activities: []
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const isAnalyst = () => {
    if (!token) {return false;}
    const decoded = jwtDecode(token);
    return decoded.role === 'analystHHRR';
  };

  const fetchOnboardings = async () => {
    const res = await axios.get(`${onboardingUrl}/list`, {headers});
    setOnboardings(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleActivityChange = (index, field, value) => {
    const newActivities = [...form.activities];
    newActivities[index][field] = value;
    setForm({ ...form, activities: newActivities });
  };

  const addActivity = () => {
    setForm({
      ...form,
      activities: [...form.activities, { step: '', title: '', description: '', duration: '' }]
    });
  };

  const removeActivity = (index) => {
    const newActivities = form.activities.filter((_, i) => i !== index);
    setForm({ ...form, activities: newActivities });
  };

  const handleSubmit = async () => {
    await axios.post(`${onboardingUrl}/new`, form, {headers});
    fetchOnboardings();
    setOpen(false);
    setForm({ type: 'technician', workArea: '', description: '', activities: [] });
  };

  useEffect(() => {
    if (isAnalyst()) {fetchOnboardings();}
  }, []);

  if (!isAnalyst()) {
    return <Typography variant="h6" color="error" align="center" mt={4}>Acceso denegado</Typography>;
  }

  return (
    <Container>
      <Box mt={4} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Gestión de Onboardings</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Nuevo Onboarding</Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Tipo</TableCell>
              <TableCell>Área</TableCell>
              <TableCell>Descripción</TableCell>
              <TableCell>Actividades</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {onboardings.map((ob, idx) => (
              <TableRow key={idx}>
                <TableCell>{ob.type}</TableCell>
                <TableCell>{ob.workArea}</TableCell>
                <TableCell>{ob.description}</TableCell>
                <TableCell>
                  {ob.activities.map((a, i) => (
                    <div key={i}>{a.step}. {a.title} ({a.duration})</div>
                  ))}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Nuevo Onboarding</DialogTitle>
        <DialogContent>
          <TextField
            name="type"
            label="Tipo"
            select
            fullWidth
            margin="dense"
            value={form.type}
            onChange={handleChange}
          >
            <MenuItem value="welcome">Bienvenida</MenuItem>
            <MenuItem value="technician">Técnico</MenuItem>
          </TextField>
          <TextField
            name="workArea"
            label="Área de Trabajo"
            fullWidth
            margin="dense"
            value={form.workArea}
            onChange={handleChange}
          />
          <TextField
            name="description"
            label="Descripción"
            fullWidth
            margin="dense"
            value={form.description}
            onChange={handleChange}
          />
          <Typography variant="h6" mt={2}>Actividades</Typography>
          {form.activities.map((activity, index) => (
            <Box key={index} display="flex" gap={1} alignItems="center" mb={1}>
              <TextField
                label="Paso"
                type="number"
                value={activity.step}
                onChange={(e) => handleActivityChange(index, 'step', e.target.value)}
              />
              <TextField
                label="Título"
                value={activity.title}
                onChange={(e) => handleActivityChange(index, 'title', e.target.value)}
              />
              <TextField
                label="Descripción"
                value={activity.description}
                onChange={(e) => handleActivityChange(index, 'description', e.target.value)}
              />
              <TextField
                label="Duración"
                value={activity.duration}
                onChange={(e) => handleActivityChange(index, 'duration', e.target.value)}
              />
              <IconButton onClick={() => removeActivity(index)}><Delete /></IconButton>
            </Box>
          ))}
          <Button startIcon={<Add />} onClick={addActivity}>Agregar Actividad</Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
