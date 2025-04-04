import React from "react";
import { Form } from "reactstrap";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Col,
  Container,
  Row,
  Card,
  CardHeader,
  CardBody,
  Label,
  Input,
} from "reactstrap";
import Layout from "../../Layouts/index";
import { addCategory, updateCategory, deleteCategory, listCategory, FileUpload } from "../../Api/CategoryApi";
import { toast } from "react-toastify";
import Pagination from "../../Components/Common/Pagination";
import RowsPerPage from "../../Components/Common/RowsPerPage";
import BaseTable from "../Table/BaseTable";
import CommonModal from "../../Components/Common/CommonModal";
import CommonDeleteModal from "../../Components/Common/CommonDeleteModal";
import Spinner from "../../Components/Common/Spinner";
import { CATEGORY_COLUMNS } from "./CategoryConstant";
import { Cats } from "../../Components/Constant/Common";
import moment from "moment";
import { StatusCodes } from "http-status-codes";
import { StatusMessage } from "../../Components/Constants/Common";

const MESSAGE = "Are you Sure You want to Remove this Record?";

const Category = () => {

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [modal_list, setmodal_list] = useState(false);
  const [modal_delete, setmodal_delete] = useState(false);
  const [category, setCategory] = useState({
    id: "",
    name: "",
    description: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [sortColumn, setSortColumn] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");
  const [categoryImage, setCategoryImage] = useState("");


  useEffect(() => {
    document.title = "Category";
  }, []);


  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listCategory();
      console.log("Full API response:", response);

      const data = response.data || response;
      const categoriesArray = data.categories || data;

      if (Array.isArray(categoriesArray)) {
        setCategories(categoriesArray);
      } else {
        toast.error("Invalid categories data format");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);


  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = "default-image-path.jpg";
  };

  const validateFields = () => {
    let newErrors = {};
    if (!category.name) newErrors.name = "Name is required.";
    if (!category.description) newErrors.description = "Description is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const tog_list = () => {
    setmodal_list(!modal_list);
    if (!modal_list) {
      setIsEditMode(false);
      setCategory({ id: "", name: "", description: "", image: null });
      setPreview(null);
      setErrors({});
    }
  };

  const tog_delete = () => {
    setmodal_delete(!modal_delete);
  };


  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('files', file);
      setLoading(true);

      const uploadResponse = await FileUpload(formData);
      setCategoryImage(uploadResponse.data[0]);

      if (uploadResponse?.success) {
        setCategory(prev => ({
          ...prev,
          image: uploadResponse.data[0]
        }));
        setPreview(URL.createObjectURL(file));
        setErrors(prev => ({ ...prev, image: '' }));
        toast.success("Image uploaded successfully");
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message);
      setErrors(prev => ({ ...prev, image: "Failed to upload image" }));
    } finally {
      setLoading(false);
    }
  };

  const handleCancelImage = () => {
    setCategory({ ...category, image: null });
    setPreview(null);
  };

  const resetForm = () => {
    setCategory({
      id: "",
      name: "",
      description: "",
      image: null,
    });
    setPreview(null);
    setCategoryImage(null);
    setErrors({});
    setIsEditMode(false);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      setLoading(true);
      const payload = {
        category_name: category.name || category.category_name,
        description: category.description,
      };
      if (isEditMode) {
        if (categoryImage) {
          payload.category_image = categoryImage;
        }
      } else {
        payload.category_image = categoryImage;
      }
      console.log("Final Payload:", payload);
      const response = isEditMode
        ? await updateCategory(category.id, payload)
        : await addCategory(payload);

      console.log("API Response:", response);
      if (response?.success || StatusMessage(response?.statusCode)) {
        toast.success(
          isEditMode ? "Category updated successfully!" : "Category added successfully!"
        );
        tog_list();
        await loadCategories();
        resetForm();
      } else {
        throw new Error(response?.message);
      }
    } catch (err) {
      console.error("Detailed Error:", {
        message: err.message,
        response: err.response?.data,
      });
      toast.error(
        err.response?.data?.message || err.message
      );
    } finally {
      setLoading(false);
    }
  };



  const handleEditClick = (categories) => {
    console.log("Original category data:", categories);
    setCategory({
      id: categories.id,
      name: categories.category_name || categories.name,
      description: categories.description,
      image: categories.category_image || categories.image
    });
    setIsEditMode(true);
    if (categories.category_image || categories.image) {
      const imgSrc = categories.category_image || categories.image;
      setPreview(typeof imgSrc === 'string' ? imgSrc : URL.createObjectURL(imgSrc));
      setCategoryImage(imgSrc);
    }

    setmodal_list(true);
  };


  const handleDeleteClick = (category) => {
    console.log("Category object received:", category);
    if (!category?.id) {
      console.error("Category ID is missing in:", category);
      toast.error("Cannot delete - missing category ID");
      return;
    }
    setCategoryToDelete(category);
    setmodal_delete(true);
  };



  const confirmDelete = async () => {
    if (!categoryToDelete?.id) {
      toast.error("No valid category selected for deletion");
      setmodal_delete(false);
      setCategoryToDelete(null);
      return;
    }
    try {
      setLoading(true);
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));

      const response = await deleteCategory(categoryToDelete.id);
      const isSuccess = StatusMessage(response?.statusCode);
      console.log("if:", response);
      if (isSuccess) {
        toast.success(response?.message);
        await loadCategories();
      }
    } catch (err) {
      console.error("Delete error:", err.response?.data || err);
      toast.error(
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message
      );
    } finally {
      setLoading(false);
      setmodal_delete(false);
      setCategoryToDelete(null);
    }
  };



  const handleSort = (key) => {
    const direction = sortColumn === key && sortDirection === "asc" ? "desc" : "asc";
    setSortColumn(key);
    setSortDirection(direction);
  };

  const filteredCategories = categories.filter((item) => {
    const name = item.category_name || item.name || "";
    const description = item.description || "";
    const search = searchTerm.toLowerCase();
    return (
      name.toLowerCase().includes(search) ||
      description.toLowerCase().includes(search)
    );
  });
  const sortedCategories = [...filteredCategories].sort((a, b) => {
    if (!sortColumn) return 0;

    const aValue = a[sortColumn] ?? "";
    const bValue = b[sortColumn] ?? "";

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });


  const totalRows = sortedCategories.length;
  const totalPages = Math.ceil(totalRows / rowsPerPage);
  const currentRows = sortedCategories.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );
  const startRow = (currentPage - 1) * rowsPerPage + 1;
  const endRow = Math.min(currentPage * rowsPerPage, totalRows);


  return (
    <React.Fragment>
      <Layout>
        {loading ? (
          <Spinner />
        ) : (
          <div className="page-content">
            <Container fluid className="px-4 mb-4">
              <Row>
                <Col xl={12} md={12} lg={12}>
                  <Card>
                    <CardHeader>
                      <Row className="g-4">
                        <Col className="col-sm-auto">
                          <h5 className="card-title mb-0 fs-3">{Cats.CateName}</h5>
                        </Col>
                        <Col className="d-flex justify-content-sm-end">
                          <Button
                            color="success"
                            className="add-btn me-1"
                            onClick={tog_list}
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            {Cats.CateAdd}
                          </Button>
                        </Col>
                      </Row>
                    </CardHeader>
                    <CardBody>
                      <div className="listjs-table" id="customerList">
                        <Row className="g-4 mb-3">
                          <Col className="col-sm-auto">
                            <RowsPerPage
                              rowsPerPage={rowsPerPage}
                              handleRowsPerPageChange={handleRowsPerPageChange}
                            />
                          </Col>
                          <Col className="col-sm">
                            <div className="d-flex justify-content-sm-end">
                              <div className="search-box ms-2">
                                <input
                                  type="text"
                                  className="form-control search"
                                  placeholder="Search..."
                                  value={searchTerm}
                                  onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <i className="ri-search-line search-icon"></i>
                              </div>
                            </div>
                          </Col>
                        </Row>

                        <BaseTable
                          columns={CATEGORY_COLUMNS(handleSort, handleEditClick, handleDeleteClick)}
                          data={currentRows}
                          onEdit={handleEditClick}
                          onDelete={handleDeleteClick}
                          actions={["edit", "delete"]}
                        />

                        <div className="d-flex justify-content-between align-items-center">
                          <div className="text-muted">
                            {Cats.CateShow}<strong>{startRow}</strong> to{" "}
                            <strong>{endRow}</strong> of{" "}
                            <strong>{totalRows}</strong> {Cats.CateResult}
                          </div>
                          <div className="d-flex justify-content-sm-end">
                            <Pagination
                              totalPages={totalPages}
                              currentPage={currentPage}
                              setCurrentPage={setCurrentPage}
                            />
                          </div>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Container>
          </div>
        )}

        <CommonModal
          isOpen={modal_list}
          toggle={tog_list}
          title={category?.id ? "Edit Category" : "Add Category"}
          footerButtons={
            <>
              <Button color="light" onClick={tog_list}>
                {Cats.CateResult}
              </Button>
              <Button
                color="success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    {Cats.CateProcessing}
                  </>
                ) : category?.id ? "Update" : "Add"}
              </Button>
            </>
          }
        >
          <Form className="tablelist-form" onSubmit={handleSubmit}>
            <div className="mb-3">
              <Label htmlFor="categoryName" className="form-label text-start w-100">
                {Cats.CateNa} <span className="text-danger">*</span>
              </Label>
              <Input
                type="text"
                id="categoryName"
                className="form-control"
                placeholder="Enter Category Name"
                name="name"
                value={category.name}
                onChange={handleChange}
                invalid={!!errors.name}
              />
              {errors.name && (
                <div className="text-danger small">{errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <Label htmlFor="categoryDescription" className="form-label text-start w-100">
                {Cats.CateDescription} <span className="text-danger">*</span>
              </Label>
              <Input
                type="textarea"
                id="categoryDescription"
                className="form-control"
                placeholder="Enter Description"
                name="description"
                value={category.description}
                onChange={handleChange}
                invalid={!!errors.description}
              />
              {errors.description && (
                <div className="text-danger small">{errors.description}</div>
              )}
            </div>

            <div className="mb-3">
              <Label htmlFor="categoryImage" className="form-label text-start w-100">
                {Cats.CateImage} <span className="text-danger">*</span>
              </Label>
              <Input
                type="file"
                id="categoryImage"
                className="mb-2"
                accept="image/*"
                onChange={handleImageChange}
              />
              {errors.image && (
                <div className="text-danger small">{errors.image}</div>
              )}
              {preview && (
                <div className="img-preview">
                  <img src={preview} alt="Preview" className="preview-img" />
                  <div style={{ marginTop: "5px" }}>
                    <Button
                      color="danger"
                      size="sm"
                      onClick={handleCancelImage}
                    >
                      {Cats.CateDelete}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Form>
        </CommonModal>

        <CommonDeleteModal
          isOpen={modal_delete}
          toggle={tog_delete}
          message={MESSAGE}
          confirmDelete={confirmDelete}
        />
      </Layout>
    </React.Fragment>
  );
};

export default Category;