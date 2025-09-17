

import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../../sdk';
import type { CampaignTemplate } from '../../types';
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
import TemplateForm from '../campaigns/TemplateForm';
import { useToasts } from '../../context/ToastContext';
import { Badge } from '../ui/Badge';
import TableSkeleton from '../skeletons/TableSkeleton';
import { PencilIcon, TrashIcon } from '../shared/icons';
import ConfirmationModal from '../ui/ConfirmationModal';

const CampaignsPage: React.FC = () => {
  const [templates, setTemplates] = useState<CampaignTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CampaignTemplate | null>(null);
  const { addToast } = useToasts();
  
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<CampaignTemplate | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchTemplates = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.comms.listTemplates();
      setTemplates(data);
    } catch (error) {
      addToast('Failed to fetch templates.', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchTemplates();
  }, [fetchTemplates]);

  const handleOpenModal = (template: CampaignTemplate | null = null) => {
    setSelectedTemplate(template);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedTemplate(null);
  };

  const handleSaveTemplate = async (formData: Omit<CampaignTemplate, 'id' | 'createdAt'>) => {
    setIsSaving(true);
    try {
      if (selectedTemplate) {
        await api.comms.updateTemplate(selectedTemplate.id, formData);
        addToast('Template updated successfully!', 'success');
      } else {
        await api.comms.createTemplate(formData);
        addToast('Template created successfully!', 'success');
      }
      handleCloseModal();
      fetchTemplates();
    } catch (error) {
      addToast('Failed to save template.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const openDeleteConfirmation = (template: CampaignTemplate) => {
    setTemplateToDelete(template);
    setIsConfirmModalOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setTemplateToDelete(null);
    setIsConfirmModalOpen(false);
  };

  const handleDeleteTemplate = async () => {
    if (!templateToDelete) return;
    setIsDeleting(true);
    try {
      await api.comms.deleteTemplate(templateToDelete.id);
      addToast('Template deleted successfully!', 'success');
      fetchTemplates();
      closeDeleteConfirmation();
    } catch (error) {
      addToast('Failed to delete template.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-800">Campaign Templates</h1>
          <Button variant="primary" onClick={() => handleOpenModal()}>
            Create Template
          </Button>
        </div>

        <div className="bg-white rounded-lg border">
          {loading ? (
            <div className="p-4">
              <TableSkeleton rows={5} columns={5} />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Template Name</TableHead>
                  <TableHead>Channel</TableHead>
                  <TableHead>Occasion</TableHead>
                  <TableHead>Created At</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {templates.map((template) => (
                  <TableRow key={template.id}>
                    <TableCell className="font-medium text-gray-900">{template.name}</TableCell>
                    <TableCell>
                        <Badge variant={template.channel === 'Email' ? 'default' : 'success'}>
                            {template.channel}
                        </Badge>
                    </TableCell>
                    <TableCell className="text-gray-700">
                        {template.occasionDate ? (
                            <div>
                                <div className="font-medium text-gray-800">{template.occasionName}</div>
                                <div className="text-xs text-gray-500">{new Date(template.occasionDate).toLocaleDateString(undefined, { timeZone: 'UTC' })}</div>
                            </div>
                        ) : (
                            '-'
                        )}
                    </TableCell>
                    <TableCell className="text-gray-700">{new Date(template.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <button onClick={() => handleOpenModal(template)} className="p-1 text-gray-500 hover:text-gray-700" aria-label="Edit template">
                          <PencilIcon className="h-4 w-4" />
                        </button>
                        <button onClick={() => openDeleteConfirmation(template)} className="p-1 text-gray-500 hover:text-red-600" aria-label="Delete template">
                           <TrashIcon className="h-4 w-4" />
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedTemplate ? 'Edit Template' : 'Create Template'}
        size="lg"
      >
        <TemplateForm
          template={selectedTemplate}
          onSubmit={handleSaveTemplate}
          onCancel={handleCloseModal}
          isSaving={isSaving}
        />
      </Modal>

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={closeDeleteConfirmation}
        onConfirm={handleDeleteTemplate}
        title="Confirm Deletion"
        message={`Are you sure you want to delete the template "${templateToDelete?.name}"?`}
        isConfirming={isDeleting}
      />
    </main>
  );
};

export default CampaignsPage;