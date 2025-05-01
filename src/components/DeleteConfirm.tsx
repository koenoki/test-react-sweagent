import React from 'react';

interface DeleteConfirmProps {
    show: boolean;
    position: { x: number; y: number };
    onConfirm: () => void;
    onCancel: () => void;
}

const DeleteConfirm: React.FC<DeleteConfirmProps> = ({
    show,
    position,
    onConfirm,
    onCancel
}) => {
    if (!show) return null;

    return (
        <div
            className="position-absolute bg-white border rounded shadow-sm p-2"
            style={{
                left: position.x,
                top: position.y,
                transform: 'translate(-50%, -100%)',
                zIndex: 1000
            }}
        >
            <div className="d-flex gap-2">
                <button
                    className="btn btn-sm btn-danger"
                    onClick={onConfirm}
                >
                    Delete
                </button>
                <button
                    className="btn btn-sm btn-secondary"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default DeleteConfirm;