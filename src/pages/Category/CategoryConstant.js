import ImageError from "../../assets/images/auth-one-bg.jpg";
import "./Category.css";

export const CATEGORY_COLUMNS = (handleSort, handleEditClick, handleDeleteClick) => [
  {
    key: "id",
    title: "ID",
    sortable: true,
    onClick: () => handleSort?.("id"), 
  },
  {
    key: "category_name",
    title: "Name",
    sortable: true,
    onClick: () => handleSort?.("category_name"),
  },
  {
    key: "description",
    title: "Description",
    sortable: true,
    onClick: () => handleSort?.("description"),
  },
  {
    key: "category_image",
    title: "Image",
    render: (image) => (
      <img
        src={image || ImageError}
        alt="category"
        className="img-thumbnail onerror-img"
        onError={(e) => {
          if (e.target.src !== ImageError) {
            e.target.src = ImageError; // Avoid infinite loop if ImageError fails
          }
        }}
      />
    ),
  },
  {
    key: "actions",
    title: "Action",
    render: (_, row) => (
      <div className="d-flex gap-2">
        <button
          className="btn btn-sm btn-success edit-item-btn"
          onClick={() => handleEditClick?.(row)}
          aria-label="Edit category"
        >
          Edit
        </button>
        <button
          className="btn btn-sm btn-danger remove-item-btn"
          onClick={() => handleDeleteClick?.(row)}
          aria-label="Remove category"
        >
          Remove
        </button>
      </div>
    ),
  },
];
