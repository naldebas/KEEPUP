import React from 'react';
import Modal from './Modal';
import { Button } from './Button';

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmButtonText?: string;
  isConfirming?: boolean;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmButtonText = 'Confirm',
  isConfirming = false,
}) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="space-y-6">
        <p className="text-sm text-gray-600">{message}</p>
        <div className="flex justify-end space-x-2 pt-4">
          <Button onClick={onClose} disabled={isConfirming}>
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            disabled={isConfirming}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            {isConfirming ? 'Deleting...' : confirmButtonText}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmationModal;
