import ImageError from "../../assets/images/auth-one-bg.jpg";
import "../../App.css";
import { Ten, Title } from "../../Components/Constants/Common";
import BaseButton from "../../Components/Base/Button";

Title.ProductValue = (handleSort, navigate, handleDeleteClick) => [
  {
    key: "product_id",
    title: "Product ID",
    sortable: true,
    onClick: () => handleSort("product_id"),
  },
  {
    key: "name",
    title: "Name",
    sortable: true,
    onClick: () => handleSort("name"),
  },
  {
    key: "description",
    title: "Description",
    sortable: true,
    onClick: () => handleSort("description"),
  },
  { 
    key: "price", 
    title: "Price",
    render: (price) => `$${price?.toFixed(2) || '0.00'}`
  },
  {
    key: "image",
    title: "Image",
    render: (image) => (
      <img
        src={image || ImageError}
        alt="product"
        className="img-thumbnail onerror-img-pro"
        style={{ width: '80px', height: '80px', objectFit: 'cover' }}
        onError={(e) => (e.target.src = ImageError)}
      />
    ),
  },
  {
    key: "actions",
    title: "Action",
    render: (_, row) => (
      <div className="d-flex gap-2">
        <BaseButton
          className="btn btn-sm btn-success edit-item-btn"
          onClick={() => navigate(`/products/edit/${row.product_id}`)}
        >
          <i className="ri-edit-line align-bottom me-1"></i> {Ten.Edit}
        </BaseButton>
        <BaseButton
          className="btn btn-sm btn-danger remove-item-btn"
          onClick={() => handleDeleteClick(row)}
        >
          <i className="ri-delete-bin-line align-bottom me-1"></i> {Ten.Remove}
        </BaseButton>
      </div>
    ),
  },
];