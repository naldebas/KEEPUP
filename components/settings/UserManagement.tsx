
import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../sdk';
import type { User, UserRole, UserFormData } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { useToasts } from '../../context/ToastContext';
import { Button } from '../ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';
import { Badge } from '../ui/Badge';
import { PencilIcon, TrashIcon } from '../shared/icons';
import TableSkeleton from '../skeletons/TableSkeleton';
import Modal from '../ui/Modal';
import UserForm from './UserForm';
import ConfirmationModal from '../ui/ConfirmationModal';


const UserManagement: React.FC = () => {
    const { user: currentUser } = useAuth();
    const { addToast } = useToasts();
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [userToDelete, setUserToDelete] = useState<User | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchUsers = useCallback(async () => {
        setLoading(true);
        try {
            const data = await api.users.list();
            setUsers(data);
        } catch (error) {
            addToast('Failed to fetch users.', 'error');
        } finally {
            setLoading(false);
        }
    }, [addToast]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleOpenModal = (user: User | null = null) => {
        setSelectedUser(user);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedUser(null);
    };

    const handleSaveUser = async (formData: UserFormData) => {
        if (!currentUser) return;
        setIsSaving(true);
        try {
            if (selectedUser) {
                await api.users.update(selectedUser.id, formData);
                addToast('User updated successfully!', 'success');
            } else {
                await api.users.create(formData, currentUser);
                addToast('User created successfully!', 'success');
            }
            handleCloseModal();
            fetchUsers();
        } catch (error: any) {
            addToast(error.message || `Failed to save user.`, 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    const openDeleteConfirmation = (user: User) => {
        setUserToDelete(user);
        setIsConfirmModalOpen(true);
    };

    const handleDeleteUser = async () => {
        if (!userToDelete) return;
        setIsDeleting(true);
        try {
            await api.users.deleteById(userToDelete.id);
            addToast('User deleted successfully!', 'success');
            fetchUsers();
            setIsConfirmModalOpen(false);
        } catch (error) {
            addToast('Failed to delete user.', 'error');
        } finally {
            setIsDeleting(false);
        }
    };

    const canEditOrDelete = (targetUser: User): boolean => {
        if (!currentUser) return false;
        if (targetUser.id === currentUser.id) return false; // Cannot edit/delete self
        if (currentUser.role === 'Admin') return true;
        if (currentUser.role === 'Branch Manager' && targetUser.role === 'Staff') return true;
        return false;
    }
    
    if (loading) {
        return <TableSkeleton rows={5} columns={4} />;
    }

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button variant="primary" onClick={() => handleOpenModal()}>Add User</Button>
            </div>
            <div className="border rounded-lg overflow-hidden">
                <Table>
                    <TableHeader className="bg-slate-50">
                        <TableRow>
                            <TableHead>Name</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Role</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium text-slate-900">{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell><Badge>{user.role}</Badge></TableCell>
                                <TableCell className="text-right">
                                    {canEditOrDelete(user) ? (
                                        <div className="flex justify-end space-x-2">
                                            <button onClick={() => handleOpenModal(user)} className="p-1 text-slate-500 hover:text-slate-700" aria-label="Edit user">
                                                <PencilIcon className="h-4 w-4" />
                                            </button>
                                            <button onClick={() => openDeleteConfirmation(user)} className="p-1 text-slate-500 hover:text-red-600" aria-label="Delete user">
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    ) : (
                                        user.id === currentUser?.id ? <span className="text-xs text-slate-400 italic">This is you</span> : null
                                    )}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={selectedUser ? 'Edit User' : 'Add User'}>
                <UserForm 
                    user={selectedUser} 
                    onSubmit={handleSaveUser} 
                    onCancel={handleCloseModal} 
                    isSaving={isSaving}
                    currentUserRole={currentUser!.role}
                />
            </Modal>
            
            <ConfirmationModal 
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDeleteUser}
                title="Confirm Deletion"
                message={`Are you sure you want to delete the user ${userToDelete?.name}?`}
                confirmButtonText="Delete"
                isConfirming={isDeleting}
            />
        </div>
    );
};

export default UserManagement;
