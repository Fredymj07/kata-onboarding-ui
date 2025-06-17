import { useState } from 'react';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts';
import AutoStoriesIcon from '@mui/icons-material/AutoStories';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import LogoutIcon from '@mui/icons-material/Logout';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [anchorElBooks, setAnchorElBooks] = useState(null);
  const [anchorElAuthors, setAnchorElAuthors] = useState(null);

  const handleMenuOpen = (event, setter) => setter(event.currentTarget);
  const handleMenuClose = (setter) => setter(null);
  const handleLogout = () => {
    console.log('Sesión finalizada');
  };

  return (
    <AppBar position='static'>
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
					Gestión de Onboardings
        </Typography>

        <Box>
          <Button
            component={Link}
            to="/users"
            color="inherit"
            startIcon={<ManageAccountsIcon />}
            onClick={(e) => handleMenuOpen(e, setAnchorElBooks)}>
						Empleados
          </Button>
        </Box>

        <Box>
          <Button
            color="inherit"
            startIcon={<AutoStoriesIcon />}
            onClick={(e) => handleMenuOpen(e, setAnchorElAuthors)}>
            Onboardings
          </Button>
          <Menu
            anchorEl={anchorElAuthors}
            open={Boolean(anchorElAuthors)}
            onClose={() => handleMenuClose(setAnchorElAuthors)}
          >
            <MenuItem component={Link} to="/onboarding" onClick={() => handleMenuClose(setAnchorElAuthors)}>
              Ver Onboardings
            </MenuItem>
            <MenuItem component={Link} to="/assign-onboarding" onClick={() => handleMenuClose(setAnchorElAuthors)}>
              Asignar Onboarding
            </MenuItem>
          </Menu>
        </Box>

        <Button
          component={Link}
          to="/login"
          color="inherit"
          startIcon={<LogoutIcon />}
          onClick={(e) => handleLogout(e.Link, localStorage.clear())}>
					Cerrar sesión
        </Button>
      </Toolbar>
    </AppBar>
  );
}
