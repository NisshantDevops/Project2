import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Container, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import Layout from "../../Layouts/index";
import { toast, ToastContainer } from "react-toastify";
import { listProducts as fetchProducts, deleteProduct, listProducts, addProduct } from "../../Api/ProductApi";
import CommonDeleteModal from "../../Components/Common/CommonDeleteModal";
import Spinner from "../../Components/Common/Spinner";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import ImageError from "../../../src/assets/images/auth-one-bg.jpg";
import { Tender, Timetable } from "../../Components/Constants/Common";
import { ADDP, AddProducts, handleApiError, ProductTitle, StatusMessage } from "../../Components/Constants/Common";
import BaseButton from "../../Components/Base/Button";
import BaseInput from "../../Components/Base/Input";
import { Cats } from "../../Components/Constant/Common";
import { useParams } from 'react-router-dom';
import { IsResponseOk } from "../../Components/Constants/Common";
import BaseTable from "../Table/BaseTable";
import { ProductContant } from "./productConstants";
const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [modaldelete, setmodaldelete] = useState(false);
  const navigate = useNavigate();

  document.title = ProductTitle.ProductHeader;


  const handleImageError = (event) => {
    event.target.onerror = null;
    event.target.src = ImageError;
  };


  const loadProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await listProducts();
      const data = response.data || response;
      const productsArray = data.products || data;

      if (Array.isArray(productsArray)) {
        setProducts(productsArray);
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
    loadProducts();
  }, [loadProducts]);

  const { id } = useParams();
  const isEditMode = !!id;


  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setmodaldelete(true);
  };
  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await deleteProduct(productToDelete.id);
      if (IsResponseOk(response, StatusMessage)) {
        toast.success(StatusMessage);
        setProducts(prev => prev.filter(({ id }) => id !== productToDelete.id));
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      handleApiError(Error);
    } finally {
      setmodaldelete(false);
      setProductToDelete(null);
    }
  };
  const handleSort = (columnKey, direction) => {

    console.log(`Sort by ${columnKey} in ${direction} order`);
    
  };
  
   const ProductColums = (handleSort, navigate, handleDeleteClick) => [
    {
      key: ProductContant.Id,
      title: ProductContant.Tilte,
      sortable: true,
      onClick: () => handleSort(ProductContant.Id),
    },
    {
      key: ProductContant.Name,
      title: ProductContant.TitleName,
      sortable: true,
      onClick: () => handleSort(ProductContant.Name),
    },
    {
      key: ProductContant.Descrption,
      title: ProductContant.TitleDescrption,
      sortable: true,
      onClick: () => handleSort(ProductContant.Descrption),
    },
    { 
      key: ProductContant.Price, 
      title: ProductContant.TitlePrice,
      render: (price) => `$${price?.toFixed(2) || '0.00'}`
    },
    {
      key: ProductContant.Image,
      title: ProductContant.TitleIamge,
      render: (image) => (
        <img
          src={image || ImageError}
          alt="product"
          className="img-thumbnail onerror-img-pro"
          onError={(e) => (e.target.src = ImageError)}
        />
      ),
    },
    {
      key: ProductContant.Action,
      title: ProductContant.TitleAction,
      render: (_, row) => (
        <div className="d-flex gap-2">
          <BaseButton
            className="btn btn-sm btn-success edit-item-btn"
            onClick={() => navigate(`/products/edit/${row.product_id}`)}
          >
            <i className="ri-edit-line align-bottom me-1"></i> {Tender.Edit}
          </BaseButton>
          <BaseButton
            className="btn btn-sm btn-danger remove-item-btn"
            onClick={() => handleDeleteClick(row)}
          >
            <i className="ri-delete-bin-line align-bottom me-1"></i> {Tender.Remove}
          </BaseButton>
        </div>
      ),
    },
  ];



  return (

    <div className="page-content">
      <Container fluid>
        <Row>
          <Col lg={12}>
            <Card>
              <CardHeader className="d-flex justify-content-between align-items-center">
                <h5 className="card-title mb-0">{Timetable.ProductModel}</h5>
                <BaseButton
                  color="success"
                  onClick={() => navigate("/AddProduct")}
                >
                  <i className="ri-add-line align-bottom me-1"></i> {Timetable.Add}
                </BaseButton>
              </CardHeader>

              <CardBody>
                {loading ? (
                  <Spinner />
                ) : (
                  <div className="table-responsive">
                    <BaseTable
                      className="table table-bordered table-hover"
                      columns={ProductColums(handleSort, navigate, handleDeleteClick)}
                      data={products}
                      actions={["edit", "delete"]}
                    />
                  </div>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Container>

      <CommonDeleteModal
        isOpen={modaldelete}
        toggle={() => setmodaldelete(!modaldelete)}
        message={Timetable.Message}
        confirmDelete={confirmDelete}
      />
      <ToastContainer />
    </div>

  );
};

export default Product;