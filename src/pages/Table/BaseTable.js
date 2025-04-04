import React from "react";
import PropTypes from "prop-types";
import { Table } from "reactstrap";
import { FaEdit, FaTrash } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";


const BaseTable = ({ 
  columns, 
  data, 
  onEdit, 
  onDelete, 
  actions,
  sortConfig,
  onSort
}) => {
  const handleSort = (key) => {
    if (onSort) {
      onSort(key);
    }
  };

  return (
    <div className="table-responsive">
      <Table className="base-table align-middle table-striped table-hover">
        <thead className="table-light">
          <tr>
            {columns.map((col) => (
              <th 
                key={col.key}
                onClick={() => col.sortable && handleSort(col.key)}
                className={col.sortable ? "sortable-column" : ""}
              >
                {col.title}
                {sortConfig?.key === col.key && (
                  <span className="sort-icon">
                    {sortConfig.direction === 'asc' ? ' ↑' : ' ↓'}
                  </span>
                )}
              </th>
            ))}
            {actions && actions.length > 0 && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)} className="text-center text-muted py-4">
                No records found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id || row._id}>
                {columns.map((col) => (
                  <td key={`${row.id}-${col.key}`}>
                    {col.render ? 
                      col.render(row[col.key], row) : 
                      (row[col.key] ? row[col.key] : "--")
                    }
                  </td>
                ))}
                {actions && actions.length > 0 && (
                  <td className="actions-cell">
                    <div className="d-flex gap-2">
                      {actions.includes("edit") && (
                        <button 
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => onEdit(row)}
                          aria-label="Edit"
                        >
                          <FaEdit />
                        </button>
                      )}
                      {actions.includes("delete") && (
                        <button 
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => onDelete(row)}
                          aria-label="Delete"
                        >
                          <FaTrash />
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </Table>
    </div>
  );
};

BaseTable.propTypes = {
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      sortable: PropTypes.bool,
      render: PropTypes.func,
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  actions: PropTypes.arrayOf(PropTypes.string),
  sortConfig: PropTypes.shape({
    key: PropTypes.string,
    direction: PropTypes.oneOf(['asc', 'desc']),
  }),
  onSort: PropTypes.func,
};

BaseTable.defaultProps = {
  actions: ["edit", "delete"],
  sortConfig: null,
  onSort: null,
};

export default BaseTable;