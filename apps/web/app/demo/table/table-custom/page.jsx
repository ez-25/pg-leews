'use client';

import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Checkbox,
  IconButton,
  Tooltip,
  Button,
  Collapse,
  Grid,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import DownloadIcon from '@mui/icons-material/Download';
import BusinessIcon from '@mui/icons-material/Business';
import PhoneIcon from '@mui/icons-material/Phone';
import { usePattern } from './hooks/usePattern';
import { API_ENDPOINTS } from './constants';

function Row({ user, isSelected, onSelect, onEdit, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <TableRow
        sx={{
          '&:last-child td, &:last-child th': { border: 0 },
          '&:hover': { backgroundColor: '#fafafa' },
          backgroundColor: isSelected ? '#f0f7ff' : 'inherit',
        }}
      >
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={(event) => onSelect(event, user._id)}
          />
        </TableCell>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell component="th" scope="row">{user.name}</TableCell>
        <TableCell>{user.username}</TableCell>
        <TableCell>{user.email}</TableCell>
        <TableCell>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PhoneIcon fontSize="small" />
            {user.phone}
          </Box>
        </TableCell>
        <TableCell>
          <Tooltip title={`${user.company?.catchPhrase}\n${user.company?.bs}`}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BusinessIcon fontSize="small" />
              {user.company?.name}
            </Box>
          </Tooltip>
        </TableCell>
        <TableCell>{user.website}</TableCell>
        <TableCell>
          <Tooltip title="Edit">
            <IconButton onClick={() => onEdit(user._id)} size="small">
              <EditIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(user._id)} size="small" color="error">
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={9}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 2 }}>
              <Typography variant="h6" gutterBottom component="div">
                Address Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Street:</Typography>
                  <Typography>{user.address?.street}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Suite:</Typography>
                  <Typography>{user.address?.suite}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">City:</Typography>
                  <Typography>{user.address?.city}</Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2">Zipcode:</Typography>
                  <Typography>{user.address?.zipcode}</Typography>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2">Location:</Typography>
                  <Typography>
                    Lat: {user.address?.geo?.lat}, Lng: {user.address?.geo?.lng}
                  </Typography>
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

function CustomTable({ data, loading }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState([]);

  // Handle selection
  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelected(filteredData.map(user => user._id));
    } else {
      setSelected([]);
    }
  };

  const handleSelectOne = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const isSelected = (id) => selected.indexOf(id) !== -1;

  // Filter data based on search term
  const filteredData = data.filter(user =>
    Object.values({
      name: user.name,
      username: user.username,
      email: user.email,
      phone: user.phone,
      company: user.company?.name,
      website: user.website,
      address: `${user.address?.street} ${user.address?.city}`,
    }).some(value => 
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  // Actions
  const handleEdit = (id) => {
    console.log('Edit user:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete user:', id);
  };

  // Export to CSV
  const handleExport = () => {
    const headers = ['Name', 'Username', 'Email', 'Phone', 'Company', 'Website', 'Address'];
    const csvData = filteredData.map(user => [
      user.name,
      user.username,
      user.email,
      user.phone,
      user.company?.name,
      user.website,
      `${user.address?.street}, ${user.address?.suite}, ${user.address?.city}, ${user.address?.zipcode}`
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
        <TextField
          sx={{ width: '50%' }}
          variant="outlined"
          size="small"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={handleExport}
          >
            Export CSV
          </Button>
          {selected.length > 0 && (
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => console.log('Delete selected:', selected)}
            >
              Delete Selected ({selected.length})
            </Button>
          )}
        </Box>
      </Box>
      <TableContainer component={Paper} sx={{ mb: 2, boxShadow: 2, maxHeight: 600 }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="custom table">
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox" sx={{ backgroundColor: '#f5f5f5' }}>
                <Checkbox
                  indeterminate={selected.length > 0 && selected.length < filteredData.length}
                  checked={selected.length === filteredData.length}
                  onChange={handleSelectAll}
                />
              </TableCell>
              <TableCell sx={{ backgroundColor: '#f5f5f5', width: 50 }} />
              {['Name', 'Username', 'Email', 'Phone', 'Company', 'Website'].map((column) => (
                <TableCell 
                  key={column}
                  sx={{ 
                    fontWeight: 'bold',
                    backgroundColor: '#f5f5f5'
                  }}
                >
                  {column}
                </TableCell>
              ))}
              <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#f5f5f5' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((user) => (
              <Row
                key={user._id}
                user={user}
                isSelected={isSelected(user._id)}
                onSelect={handleSelectOne}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

export default function TableDemo() {
  const { data: users, loading, error } = usePattern(API_ENDPOINTS.USERS);

  if (error) {
    return (
      <Box p={3}>
        <Typography color="error" variant="h6">
          Error: {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      <Typography variant="h4" gutterBottom>
        User Management
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        A custom table displaying user data with search and selection features
      </Typography>
      <CustomTable data={users} loading={loading} />
    </Box>
  );
}
