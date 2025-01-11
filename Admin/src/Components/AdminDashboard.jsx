import React, { useState, useEffect } from 'react';
import './AdminDashboard.css';
import { Box, AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemIcon, ListItemText, Container } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CancelIcon from '@mui/icons-material/Cancel';
import PeopleIcon from '@mui/icons-material/People';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import SettingsIcon from '@mui/icons-material/Settings';
import UserStatistics from './UserStatistics';
import { ECommerceRevenue } from './ECommerceRevenue';
import { LoginManagement } from './LoginManagement';
import AdminSettings from './AdminSettings';
import CancellationRequests from './CancellationRequests';
import { collection, getDocs } from 'firebase/firestore';
import { db} from '../firebase'; // Ensure 'auth' is imported for authentication

const drawerWidth = 240;

const AdminDashboard = () => {
  const [userEmail, setUserEmail] = useState( 'pratik.biyani.tv@gmail.com');
  const [bookingId, setBookingId] = useState(null);
  const [ticketId, setTicketId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState('dashboard');



  // Fetch bookingId and ticketId after userEmail is available
  useEffect(() => {
    const fetchBookingAndTicket = async () => {
      if (!userEmail) return;

      try {
        // Fetch bookingId from 'bookings' collection
        const bookingsRef = collection(db, `users/${userEmail}/bookings`);
        const bookingsSnapshot = await getDocs(bookingsRef);
        const fetchedBookingId = bookingsSnapshot.docs[0]?.id; // Assuming you want the first booking
        setBookingId(fetchedBookingId);

        // Fetch ticketId from 'tickets' collection inside the booking
        if (fetchedBookingId) {
          const ticketsRef = collection(db, `users/${userEmail}/bookings/${fetchedBookingId}/tickets`);
          const ticketsSnapshot = await getDocs(ticketsRef);
          const fetchedTicketId = ticketsSnapshot.docs[0]?.id; // Assuming you want the first ticket
          setTicketId(fetchedTicketId);
        }

        setLoading(false);
      } catch (error) {
        console.error('Error fetching booking and ticket data:', error);
        setError('Failed to fetch booking and ticket data.');
        setLoading(false);
      }
    };

    fetchBookingAndTicket();
  }, [userEmail]);

  

  if (error) {
    return <p>{error}</p>;
  }

  const handleDrawerItemClick = (section) => {
    setActiveSection(section);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Admin Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <List>
          <ListItem button onClick={() => handleDrawerItemClick('dashboard')}>
            <ListItemIcon><DashboardIcon /></ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
          <ListItem button onClick={() => handleDrawerItemClick('cancellationRequests')}>
            <ListItemIcon><CancelIcon /></ListItemIcon>
            <ListItemText primary="Ticket Cancellations" />
          </ListItem>
          <ListItem button onClick={() => handleDrawerItemClick('userStatistics')}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="User Statistics" />
          </ListItem>
          <ListItem button onClick={() => handleDrawerItemClick('eCommerce')}>
            <ListItemIcon><ShoppingCartIcon /></ListItemIcon>
            <ListItemText primary="E-commerce Revenue" />
          </ListItem>
          <ListItem button onClick={() => handleDrawerItemClick('loginManagement')}>
            <ListItemIcon><PeopleIcon /></ListItemIcon>
            <ListItemText primary="Login Management" />
          </ListItem>
          <ListItem button onClick={() => handleDrawerItemClick('adminSettings')}>
            <ListItemIcon><SettingsIcon /></ListItemIcon>
            <ListItemText primary="Admin Settings" />
          </ListItem>
        </List>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          bgcolor: 'background.default',
          p: 3,
          width: `calc(100% - ${drawerWidth}px)`,
          marginTop: '64px'
        }}
      >
        <Container>
          {activeSection === 'dashboard' && (
            <div className="dashboard-overview">
              <div className="dashboard-card">
                <Typography variant="h5">Total Users</Typography>
                <Typography variant="body1">12345</Typography>
              </div>
              <div className="dashboard-card">
                <Typography variant="h5">Monthly Revenue</Typography>
                <Typography variant="body1">$50,000</Typography>
              </div>
            </div>
          )}
          {activeSection === 'cancellationRequests' && <CancellationRequests userEmail={userEmail} bookingId={bookingId} ticketId={ticketId} />}
          {activeSection === 'userStatistics' && <UserStatistics />}
          {activeSection === 'eCommerce' && <ECommerceRevenue />}
          {activeSection === 'loginManagement' && <LoginManagement />}
          {activeSection === 'adminSettings' && <AdminSettings />}
        </Container>
      </Box>
    </Box>
  );
};

export default AdminDashboard;
