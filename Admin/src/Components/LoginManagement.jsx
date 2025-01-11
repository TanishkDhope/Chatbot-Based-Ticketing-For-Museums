import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableRow, Button } from '@mui/material';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // Import Firebase config

export const LoginManagement = () => {
  const [users, setUsers] = useState([]);

  // Fetch users from Firestore
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users'); // Assuming you have a 'users' collection
        const userSnapshot = await getDocs(usersCollection);
        const userList = userSnapshot.docs.map((doc) => {
          const data = doc.data();
          console.log(data); // Log the document data to inspect its structure
          return { id: doc.id, ...data };
        });
        setUsers(userList);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  // Delete user account from Firestore
  const handleDelete = async (userId) => {
    try {
      await deleteDoc(doc(db, 'users', userId)); // Delete the document by user ID
      setUsers(users.filter(user => user.id !== userId)); // Update state after deletion
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  return (
    <div>
      <h2>Login Management</h2>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Email</TableCell>
            <TableCell>Last Login</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {users.map((row) => (
            <TableRow key={row.id}>
              <TableCell>{row.email || 'No email available'}</TableCell> {/* Display fallback if email is missing */}
              <TableCell>{row.lastLogin || 'No last login data'}</TableCell> {/* Display fallback if lastLogin is missing */}
              <TableCell>
                <Button 
                  variant="contained" 
                  color="error" 
                  onClick={() => handleDelete(row.id)}
                >
                  Delete Account
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
