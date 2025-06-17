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
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import format from 'date-fns/format';
import { Edit } from '@mui/icons-material';

import config from '../config.js';

const userUrl = config.API_URL + '/user';

export default function UserCRUD() {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'employee',
    dateEntry: null,
  });

  const token = localStorage.getItem('token');
  const headers = { Authorization: `Bearer ${token}` };

  const fetchUsers = async () => {
    const res = await axios.get(`${userUrl}/list`, { headers });
    setUsers(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleDateChange = (date) => {
    const formattedDate = date ? format(date, 'yyyy-MM-dd') : null;
    setForm({ ...form, dateEntry: formattedDate });
  };

  const handleSubmit = async () => {
    await axios.post(`${userUrl}/new`, form, {headers});
    fetchUsers();
    setOpen(false);
    setForm({ name: '', email: '', password: '', role: 'employee', dateEntry: null });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      <Box mt={4} mb={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4">Gestión de Usuarios</Typography>
        <Button variant="contained" onClick={() => setOpen(true)}>Nuevo Usuario</Button>
      </Box>

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Rol</TableCell>
              <TableCell>Fecha Ingreso</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.email}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>{user.dateEntry}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Nuevo Usuario</DialogTitle>
        <DialogContent>
          <TextField
            name="name"
            label="Nombre"
            fullWidth
            margin="dense"
            value={form.name}
            onChange={handleChange}
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            margin="dense"
            value={form.email}
            onChange={handleChange}
          />
          <TextField
            name="password"
            label="Contraseña"
            type="password"
            fullWidth
            margin="dense"
            value={form.password}
            onChange={handleChange}
          />
          <TextField
            name="role"
            label="Rol"
            select
            fullWidth
            margin="dense"
            value={form.role}
            onChange={handleChange}
          >
            <MenuItem value="employee">Empleado</MenuItem>
            <MenuItem value="analystHHRR">Analista RRHH</MenuItem>
          </TextField>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Fecha de Ingreso"
              value={form.dateEntry ? new Date(form.dateEntry) : null}
              onChange={handleDateChange}
              renderInput={(params) => <TextField {...params} fullWidth margin="dense" />}
            />
          </LocalizationProvider>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} variant="contained">Guardar</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
