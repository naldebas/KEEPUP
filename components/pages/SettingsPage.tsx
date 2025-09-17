import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToasts } from '../../context/ToastContext';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Badge } from '../ui/Badge';
import ConfirmationModal from '../ui/ConfirmationModal';
import UserManagement from '../settings/UserManagement';

const SettingsPage: React.FC = () => {
    const { user, logout } = useAuth();
    const { addToast } = useToasts();

    const [name, setName] = useState(user?.name || '');
    const [email, setEmail] = useState(user?.email || '');
    const [isSaving, setIsSaving] = useState(false);
    
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (user) {
            setName(user.name);
            setEmail(user.email);
        }
    }, [user]);
    
    const handleProfileUpdate = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        // In a real app, you would call an API here.
        setTimeout(() => {
            addToast('Profile updated successfully!', 'success');
            // In a real app, you might want to update the user in AuthContext as well
            setIsSaving(false);
        }, 500);
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        // In a real app, this would be an API call to delete the entire company account.
        // For now, we just log out.
        await logout();
        addToast('Organization deleted successfully.', 'info');
        setIsConfirmModalOpen(false);
        setIsDeleting(false);
    };

    if (!user) {
        // Render a loading state or redirect if user is not available
        return null;
    }

    return (
        <main className="flex-1 p-6">
            <div className="max-w-4xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
                    <p className="text-sm text-slate-500 mt-1">Manage your account and organization settings.</p>
                </div>

                {/* Profile Settings - All users */}
                <Card>
                    <CardHeader>
                        <CardTitle>My Profile</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleProfileUpdate} className="space-y-4 max-w-lg">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    className="mt-1"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Address</label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    readOnly
                                    className="mt-1 bg-slate-100 cursor-not-allowed"
                                />
                            </div>
                             <div className="flex justify-end pt-2">
                                <Button type="submit" variant="primary" disabled={isSaving}>
                                    {isSaving ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>

                {/* User Management - Admin & Manager */}
                {(user.role === 'Admin' || user.role === 'Branch Manager') && (
                    <Card>
                        <CardHeader>
                            <CardTitle>User Management</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <UserManagement />
                        </CardContent>
                    </Card>
                )}

                {/* Plan & Billing - Admin only */}
                {user.role === 'Admin' && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Plan & Billing</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div>
                                <p className="text-sm text-slate-600">You are currently on the <Badge>{user.plan}</Badge> plan.</p>
                            </div>
                            <Button disabled>Manage Subscription</Button>
                        </CardContent>
                    </Card>
                )}

                {/* Danger Zone - Admin only */}
                {user.role === 'Admin' && (
                    <Card className="border-red-500/50">
                         <CardHeader>
                            <CardTitle className="text-red-700">Danger Zone</CardTitle>
                        </CardHeader>
                        <CardContent className="flex justify-between items-center">
                            <div>
                                <h4 className="font-semibold text-slate-800">Delete Organization</h4>
                                <p className="text-sm text-slate-600 max-w-md mt-1">Once you delete your organization, there is no going back. All data will be permanently removed.</p>
                            </div>
                            <Button variant="primary" className="bg-red-600 hover:bg-red-700" onClick={() => setIsConfirmModalOpen(true)}>
                                Delete Organization
                            </Button>
                        </CardContent>
                    </Card>
                )}
            </div>

            <ConfirmationModal 
                isOpen={isConfirmModalOpen}
                onClose={() => setIsConfirmModalOpen(false)}
                onConfirm={handleDeleteAccount}
                title="Confirm Organization Deletion"
                message="Are you absolutely sure you want to delete your organization? This action is irreversible and will permanently remove all associated data."
                confirmButtonText="Yes, Delete Organization"
                isConfirming={isDeleting}
            />
        </main>
    );
};

export default SettingsPage;
