import React from 'react';
import PropTypes from 'prop-types';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button
} from 'reactstrap';

const CommonModal = ({
  isOpen,
  toggle,
  title,
  children,
  footerButtons,
  size,
  centered = true,
  fade = true,
  backdrop = true,
  keyboard = true,
  zIndex = 1050,
  className = '',
  contentClassName = 'border-0',
  modalHeaderClassName = 'bg-light p-3 border-0',
  modalBodyClassName = 'p-3',
  modalFooterClassName = 'border-0 p-3'
}) => {
  return (
    <Modal
      isOpen={isOpen}
      toggle={toggle}
      size={size}
      centered={centered}
      fade={fade}
      backdrop={backdrop}
      keyboard={keyboard}
      zIndex={zIndex}
      className={className}
      contentClassName={contentClassName}
    >
      <ModalHeader className={modalHeaderClassName} toggle={toggle}>
        <h5 className="modal-title">{title}</h5>
      </ModalHeader>
      <ModalBody className={modalBodyClassName}>
        {children}
      </ModalBody>
      <ModalFooter className={modalFooterClassName}>
        <div className="hstack gap-2 justify-content-end">
          {footerButtons}
        </div>
      </ModalFooter>
    </Modal>
  );
};

CommonModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  toggle: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  footerButtons: PropTypes.node.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg', 'xl']),
  centered: PropTypes.bool,
  fade: PropTypes.bool,
  backdrop: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
  keyboard: PropTypes.bool,
  zIndex: PropTypes.number,
  className: PropTypes.string,
  contentClassName: PropTypes.string,
  modalHeaderClassName: PropTypes.string,
  modalBodyClassName: PropTypes.string,
  modalFooterClassName: PropTypes.string
};

export default CommonModal;