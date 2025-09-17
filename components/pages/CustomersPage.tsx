

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../../sdk';
import type { Customer, CustomerFormData, Tier } from '../../types';
import { Button } from '../ui/Button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/Table';
import Modal from '../ui/Modal';
import CustomerForm from '../customers/CustomerForm';
import AIInsightModal from '../customers/AIInsightModal';
import { useToasts } from '../../context/ToastContext';
import TableSkeleton from '../skeletons/TableSkeleton';
import { PencilIcon, TrashIcon, SearchIcon, SparkleIcon } from '../shared/icons';
import ConfirmationModal from '../ui/ConfirmationModal';
import { Input } from '../ui/Input';

const ITEMS_PER_PAGE = 10;

const CustomersPage: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const { addToast } = useToasts();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [customerToDelete, setCustomerToDelete] = useState<Customer | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<Tier | 'All'>('All');
  const [currentPage, setCurrentPage] = useState(1);
  
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);


  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.customers.list();
      setCustomers(data);
    } catch (error) {
      addToast('Failed to fetch customers.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchCustomers();
  }, [fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    return customers
      .filter(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                              (customer.phone && customer.phone.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesTier = tierFilter === 'All' || customer.tier === tierFilter;
        return matchesSearch && matchesTier;
      });
  }, [customers, searchQuery, tierFilter]);
  
  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);

  const paginatedCustomers = useMemo(() => {
      const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
      return filteredCustomers.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredCustomers, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, tierFilter]);


  const handleOpenModal = (customer: Customer | null = null) => {
    setSelectedCustomer(customer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCustomer(null);
  };

  const handleSaveCustomer = async (formData: CustomerFormData) => {
    setIsSaving(true);
    try {
      if (selectedCustomer) {
        await api.customers.update(selectedCustomer.id, formData);
        addToast('Customer updated successfully!', 'success');
      } else {
        await api.customers.create(formData);
        addToast('Customer created successfully!', 'success');
      }
      handleCloseModal();
      fetchCustomers();
    } catch (error) {
      addToast(`Failed to save customer.`, 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteConfirmation = (customer: Customer) => {
      setCustomerToDelete(customer);
      setIsConfirmModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
      setCustomerToDelete(null);
      setIsConfirmModalOpen(false);
  };

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    setIsDeleting(true);
    try {
      await api.customers.deleteById(customerToDelete.id);
      addToast('Customer deleted successfully!', 'success');
      fetchCustomers();
      closeDeleteConfirmation();
    } catch (error) {
      addToast('Failed to delete customer.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const tierColorMap = {
    Platinum: 'bg-accent-100 text-accent-800',
    Gold: 'bg-primary-100 text-primary-800',
    Silver: 'bg-slate-200 text-slate-800',
    Discovery: 'bg-slate-100 text-slate-700',
  };

  const renderContent = () => {
      if (loading) {
          return <TableSkeleton rows={10} columns={6} />;
      }

      if (customers.length === 0 && !loading) {
          return (
              <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-slate-800">No Customers Yet</h3>
                  <p className="text-sm text-slate-500 mt-1">Get started by adding your first customer.</p>
                  <Button variant="primary" onClick={() => handleOpenModal()} className="mt-4">
                    Add Customer
                  </Button>
              </div>
          )
      }
      
      if (paginatedCustomers.length === 0 && !loading) {
          return (
              <div className="text-center py-12">
                  <h3 className="text-lg font-medium text-slate-800">No Customers Found</h3>
                  <p className="text-sm text-slate-500 mt-1">Try adjusting your search or filter criteria.</p>
              </div>
          )
      }

      return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Contact Info</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead>Tier</TableHead>
                <TableHead>Last Seen</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedCustomers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell className="font-medium text-slate-900">{customer.name}</TableCell>
                  <TableCell>
                      <div className="text-sm font-medium text-slate-900">{customer.email}</div>
                      <div className="text-sm text-slate-500">{customer.phone}</div>
                  </TableCell>
                  <TableCell className="text-slate-500">{customer.dob}</TableCell>
                  <TableCell>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${tierColorMap[customer.tier]}`}>
                      {customer.tier}
                    </span>
                  </TableCell>
                  <TableCell className="text-slate-500">{customer.lastSeen}</TableCell>
                  <TableCell>
                    <div className="flex justify-end space-x-2">
                      <button onClick={() => handleOpenModal(customer)} className="p-1 text-slate-500 hover:text-slate-700" aria-label="Edit customer">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button onClick={() => openDeleteConfirmation(customer)} className="p-1 text-slate-500 hover:text-red-600" aria-label="Delete customer">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
      );
  }

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-slate-800">Customers</h1>
          <div className="flex items-center space-x-2">
              <Button onClick={() => setIsAiModalOpen(true)} disabled={customers.length === 0}>
                  <SparkleIcon className="h-4 w-4 mr-2"/>
                  AI Insights
              </Button>
              <Button variant="primary" onClick={() => handleOpenModal()}>
                Add Customer
              </Button>
          </div>
        </div>

        {customers.length > 0 && (
          <div className="mb-4 flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
              <div className="relative flex-1">
                  <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
                  <Input 
                      type="text"
                      placeholder="Search by name, email, or phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                  />
              </div>
              <select
                  value={tierFilter}
                  onChange={(e) => setTierFilter(e.target.value as Tier | 'All')}
                  className="w-full md:w-auto pl-3 pr-10 py-2 text-base border-slate-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-lg"
              >
                  <option value="All">All Tiers</option>
                  <option value="Discovery">Discovery</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
              </select>
          </div>
        )}

        <div className="bg-white rounded-xl shadow-md min-h-[400px]">
          {renderContent()}
        </div>

        {totalPages > 1 && (
            <div className="flex justify-between items-center mt-4 text-sm">
                <Button 
                    onClick={() => setCurrentPage(p => p - 1)} 
                    disabled={currentPage === 1}
                >
                    Previous
                </Button>
                <span>Page {currentPage} of {totalPages}</span>
                <Button 
                    onClick={() => setCurrentPage(p => p + 1)}
                    disabled={currentPage === totalPages}
                >
                    Next
                </Button>
            </div>
        )}

      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedCustomer ? 'Edit Customer' : 'Add Customer'}
      >
        <CustomerForm
          customer={selectedCustomer}
          onSubmit={handleSaveCustomer}
          onCancel={handleCloseModal}
          isSaving={isSaving}
        />
      </Modal>

      <ConfirmationModal 
        isOpen={isConfirmModalOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleDeleteCustomer}
        title="Confirm Deletion"
        message={`Are you sure you want to delete ${customerToDelete?.name}? This action cannot be undone.`}
        confirmButtonText="Delete"
        isConfirming={isDeleting}
      />
      
      <AIInsightModal 
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        customers={customers}
      />
    </main>
  );
};

export default CustomersPage;