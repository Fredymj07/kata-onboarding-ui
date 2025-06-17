import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Container, Typography, Box, Button, TextField, MenuItem, Dialog,
  DialogTitle, DialogContent, DialogActions, Paper, Table, TableHead,
  TableRow, TableCell, TableBody
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import format from 'date-fns/format';
import { jwtDecode } from 'jwt-decode';
import config from '../config';

const userOnboardingUrl = config.API_URL + '/user-onboarding';
const userUrl = config.API_URL + '/user/list';
const onboardingUrl = config.API_URL + '/onboarding/list';

export default function AssignOnboarding() {
  const [userOnboardings, setUserOnboardings] = useState([]);
  const [users, setUsers] = useState([]);
  const [onboardings, setOnboardings] = useState([]);
  const [form, setForm] = useState({ userId: '', onboardingId: '', assignedDate: '' });
  const [open, setOpen] = useState(false);

  const token = localStorage.getItem('token');
  const user = jwtDecode(token);
  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    const [uoRes, usersRes, obRes] = await Promise.all([
      axios.post(`${userOnboardingUrl}/new`, { headers }),
      // axios.get(userUrl, { headers }),
      // axios.get(onboardingUrl, { headers })
    ]);
    setUserOnboardings(uoRes.data);
    setUsers(usersRes.data);
    setOnboardings(obRes.data);
  };

  const handleDateChange = (date) => {
    const formatted = date ? format(date, 'yyyy-MM-dd') : '';
    setForm({ ...form, assignedDate: formatted });
    setOpen(true);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    await axios.post(`${userOnboardingUrl}/new`, form, { headers });
    fetchData();
    setOpen(false);
    setForm({ userId: '', onboardingId: '', assignedDate: '' });
  };

  useEffect(() => {
    if (user.role === 'analystHHRR') {fetchData();}
  }, []);

  if (user.role !== 'analystHHRR') {
    return (
      <Container>
        <Typography variant="h6" color="error">Acceso denegado: solo RRHH puede asignar onboardings</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box mt={4} mb={2}>
        <Typography variant="h4">Asignación de Onboardings</Typography>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          label="Seleccionar Fecha para asignación"
          onChange={handleDateChange}
          renderInput={(params) => <TextField {...params} fullWidth margin="normal" />}
        />
      </LocalizationProvider>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Asignar Onboarding</DialogTitle>
        <DialogContent>
          <TextField
            select
            label="Empleado"
            name="userId"
            fullWidth
            margin="dense"
            value={form.userId}
            onChange={handleChange}
          >
            {users.map((u) => (
              <MenuItem key={u.id} value={u.id}>{u.name}</MenuItem>
            ))}
          </TextField>

          <TextField
            select
            label="Onboarding"
            name="onboardingId"
            fullWidth
            margin="dense"
            value={form.onboardingId}
            onChange={handleChange}
          >
            {onboardings.map((o) => (
              <MenuItem key={o.id} value={o.id}>{o.description}</MenuItem>
            ))}
          </TextField>

          <TextField
            label="Fecha asignada"
            value={form.assignedDate}
            fullWidth
            margin="dense"
            disabled
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button variant="contained" onClick={handleSubmit}>Guardar</Button>
        </DialogActions>
      </Dialog>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Empleado</TableCell>
              <TableCell>Onboarding</TableCell>
              <TableCell>Fecha Asignada</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {userOnboardings.map((uo, index) => (
              <TableRow key={index}>
                <TableCell>{uo.user?.name || uo.userId}</TableCell>
                <TableCell>{uo.onboarding?.description || uo.onboardingId}</TableCell>
                <TableCell>{uo.assignedDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Container>
  );
}
