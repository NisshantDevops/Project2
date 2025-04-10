import React, { useRef } from 'react';
import { Form } from "reactstrap";
import { Formik, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
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
import { StatusMessage, Tender,getCategorySchema } from "../../Components/Constants/Common";
import {handleApiError} from "../../Components/Constants/Common"
import { MESSAGE } from "../../Components/Constants/Common";
import ApiService from "../../Api/ApiService";
import { PAGE_TITLE } from "../../Components/Constants/Common";
import { Ten } from "../../Components/Constants/Common";
import { Texts } from "../../Components/Constants/Common";
import BaseInput from "../../Components/Base/Input";
import BaseButton from "../../Components/Base/Button";
import {ValidationMessages} from "../../Components/Constants/Common";


const Category = () => {

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [modallist, setmodallist] = useState(false);
  const [modaldelete, setmodaldelete] = useState(false);
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
  const formikRef = useRef(null);


 
 const categoryValidationSchema = Yup.object().shape({
    name: Yup.string().trim().required(ValidationMessages.requiredCategoryName),
    description: Yup.string().trim().optional(),
  });
 const isResponseSuccess = (response) => {
    return response?.status === response?.StatusMessage || response?.success === true;
  };

  document.title = PAGE_TITLE;
  const loadCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listCategory();
      const data = response.data || response;
      const categoriesArray = data.categories || data;

      if (Array.isArray(categoriesArray)) {
        setCategories(categoriesArray);
      } else {
        toast.error(StatusMessage);
      }
    } catch (error) {

      toast.error(StatusMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = "/assets/images/default-image.jpg";
  };



  const tog_list = () => {
    setmodallist(!modallist);
    if (!modallist) {
      setIsEditMode(false);
      setCategory({ id: "", name: "", description: "", image: null });
      setPreview(null);
      setErrors({});
    }
  };

  const tog_delete = () => {
    setmodaldelete(!modaldelete);
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
        toast.success(StatusMessage);
      }
    } catch (err) {
      toast.error(err.response?.data?.message);
      setErrors(prev => ({ ...prev, image: "Failed to upload image" }));
    } finally {
      setLoading(false);
    }
  };
  const handleImagePreview = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleCancelImage = () => {
    setCategory({ ...category, image: null });
    setPreview(null);
  };

  const resetForm = () => {
    setCategory({
      id: null,
      name: '',
      description: '',
      image: null
    });
    setCategoryImage(null);
    setPreview(null);
    setIsEditMode(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationSchema={categoryValidationSchema}
  
    setLoading(true);
  
    const payload = {
      category_name: category.name.trim(),
      description: category.description?.trim() || "",
      category_image: category.image ,
    };
  
    try {
      const response = isEditMode
        ? await updateCategory(category.id, payload)
        : await addCategory(payload);
  
       if(isResponseSuccess(response)){
        toast.success(response.message);
        setCategory({ id: "", name: "", description: "", image: null });
        setPreview(null);
        tog_list();
        await loadCategories();
      } else {
        handleApiError();
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading(false);
    }
  };
  
  



  const handleEditClick = (categories) => {
    if (!categories) {
      console.error("No category data passed to handleEditClick.");
      return;
    }
    const categoryData = {
      id: categories.id,
      name: categories.category_name || categories.name || "",
      description: categories.description || "",
      image: categories.category_image || categories.image || "",
    };
  
    setCategory(categoryData);
    setIsEditMode(true);
  
    const imgSrc = categoryData.image;
  
    if (imgSrc) {
      const isString = typeof imgSrc === "string";
  
      const previewURL = isString ? imgSrc : URL.createObjectURL(imgSrc);
      setPreview(previewURL);
      setCategoryImage(imgSrc);
    }
  
    setmodallist(true); 
  };
  

  const handleDeleteClick = (category) => {
    if (!category?.id) {
      console.error("Category ID is missing in:", category);
      toast.error(StatusMessage);
      return;
    }
    setCategoryToDelete(category);
    setmodaldelete(true);
  };



  const confirmDelete = async () => {
    if (!categoryToDelete?.id) {
      toast.error(StatusMessage);
      setmodaldelete(false);
      setCategoryToDelete(null);
      return;
    }
    try {
      setLoading(true);
      setCategories(prev => prev.filter(cat => cat.id !== categoryToDelete.id));

      const response = await deleteCategory(categoryToDelete.id);
      const isSuccess = StatusMessage(response?.statusCode);

      if (isSuccess) {
        toast.success(response?.message);
        if (response.data?.deletedId === categoryToDelete.id) {
          await loadCategories();
        }
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
      setmodaldelete(false);
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
                          <BaseButton
                            color="success"
                            className="add-btn me-1"
                            onClick={tog_list}
                            id="create-btn"
                          >
                            <i className="ri-add-line align-bottom me-1"></i>
                            {Cats.CateAdd}
                          </BaseButton>
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
                                <BaseInput
                                  type="text"
                                  className="form-control search"
                                  placeholder={Tender.Search}
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
          isOpen={modallist}
          toggle={tog_list}
          title={category?.id ? Texts.UpdateCategory : Texts.AddCategory}
          footerButtons={
            <>
              <BaseButton color="light" onClick={tog_list}>
                {Cats.CateResult}
              </BaseButton>
              <BaseButton
                color="success"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-1"></span>
                    {Cats.CateProcessing}
                  </>
                ) : category?.id ? Texts.Update : Texts.Add}
              </BaseButton>
            </>
          }
        >
          <Formik
            innerRef={(ref) => {
              formikRef.current = ref;
            }}
            initialValues={{
              name: category?.name || "",
              description: category?.description || "",
              image: null,
            }}
            validationSchema={getCategorySchema(isEditMode)}
            onSubmit={(values) => handleSubmit(values)}
          >
            {({ setFieldValue, values, errors, touched }) => (
              <Form className="tablelist-form">

                <div className="mb-3">
                  <Label htmlFor="name" className="form-label text-start w-100">
                    {Cats.CateNa} <span className="text-danger">*</span>
                  </Label>
                  <Field
                    as={BaseInput}
                    type={Tender.Type}
                    id={Tender.Id}
                    className={Tender.ClassName}
                    placeholder={Tender.Placeholder}
                    name="name"
                    invalid={touched.name && !!errors.name}
                  />
                  <ErrorMessage
                    name={Tender.Nam}
                    component={Tender.Ent}
                    className="text-danger small"
                  />
                </div>



                <div className="mb-3">
                  <BaseInput
                    type="textarea"
                    id="description"
                    label={`${Cats.CateDescription} *`}
                    className="form-control"
                    placeholder="Enter description"
                    name="description"
                    invalid={touched.description && !!errors.description}
                    value={values.description}
                    onChange={(e) => setFieldValue("description", e.target.value)}

                  />
                  {touched.description && errors.description && (
                    <div className="text-danger small">{errors.description}</div>
                  )}
                </div>

                <div className="mb-3">
                  <BaseInput
                    type="file"
                    id="image"
                    label={`${Cats.CateImage} *`}
                    className="mb-2"
                    accept="image/*"
                    onChange={(event) => {
                      setFieldValue("image", event.currentTarget.files[0]);
                      handleImagePreview(event);
                    }}
                  />
                  {touched.image && errors.image && (
                    <div className="text-danger small">{errors.image}</div>
                  )}
                  {preview && (
                    <div className="img-preview">
                      <img src={preview} alt="Preview" className="preview-img" />
                      <div style={{ marginTop: "5px" }}>
                        <BaseButton
                          color="danger"
                          size="sm"
                          onClick={() => {
                            setFieldValue("image", null);
                            handleCancelImage();
                          }}
                        >
                          {Cats.CateDelete}
                        </BaseButton>
                      </div>
                    </div>
                  )}
                </div>
              </Form>
            )}
          </Formik>
        </CommonModal>

        <CommonDeleteModal
          isOpen={modaldelete}
          toggle={tog_delete}
          message={MESSAGE}
          confirmDelete={confirmDelete}
        />
      </Layout>
    </React.Fragment>
  );
};

export default Category;