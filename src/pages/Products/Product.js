import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Container, Row, Col, Card, CardHeader, CardBody } from "reactstrap";
import Layout from "../../Layouts/index";
import { toast, ToastContainer } from "react-toastify";
import {
  listProducts,
  deleteProduct
} from "../../Api/ProductApi";
import CommonDeleteModal from "../../Components/Common/CommonDeleteModal";
import Spinner from "../../Components/Common/Spinner";
import "react-toastify/dist/ReactToastify.css";
import "../../App.css";
import ImageError from "../../../src/assets/images/auth-one-bg.jpg";
import {
  Timetable,
  StatusMessage,
  IsResponseOk,
  handleApiError
} from "../../Components/Constants/Common";
import BaseButton from "../../Components/Base/Button";
import BaseTable from "../Table/BaseTable";
import {ProductContant} from "./productConstants"
import { Tender } from "../../Components/Constants/Common";
import { AddProducts } from "../../Components/Constants/Common";


const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [modalDelete, setModalDelete] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();

  document.title = AddProducts.ProdcutList;

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
        const updatedProducts = productsArray.map((product, index) => ({
          ...product,
          product_id: product.product_id ,
        }));
        setProducts(updatedProducts);
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

  const handleDeleteClick = (product) => {
    setProductToDelete(product);
    setModalDelete(true);
  };

  const confirmDelete = async () => {
    if (!productToDelete) return;

    try {
      const response = await deleteProduct(productToDelete.product_id);
      if (IsResponseOk(response)) {
        toast.success(response?.Message||StatusMessage);
        setProducts((prev) =>
          prev.filter((item) => item.product_id !== productToDelete.product_id)
        );
      } else {
        toast.error(response?.message || StatusMessage);
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setModalDelete(false);
      setProductToDelete(null);
    }
  };

  const handleSort = (columnKey, direction) => {
    const sorted = [...products].sort((a, b) => {
      let valA = a[columnKey];
      let valB = b[columnKey];

      if (columnKey === "description") {
        valA = a.product_variants?.[0]?.description || "";
        valB = b.product_variants?.[0]?.description || "";
      }

      if (columnKey === "price") {
        valA = a.product_variants?.[0]?.price || 0;
        valB = b.product_variants?.[0]?.price || 0;
      }

      if (typeof valA === "string") valA = valA.toLowerCase();
      if (typeof valB === "string") valB = valB.toLowerCase();

      if (valA < valB) return direction === "asc" ? -1 : 1;
      if (valA > valB) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setProducts(sorted);
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
      key: ProductContant.Descrptions,
      title: ProductContant. TitleDescrptions,
      sortable: true,
      onClick: () => handleSort(ProductContant. Descrptions),
    }
    ,
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
   <Layout>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{Timetable.ProductModel}</h5>
                  <BaseButton color="success" onClick={() => navigate("/AddProduct")}>
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
          isOpen={modalDelete}
          toggle={() => setModalDelete(!modalDelete)}
          message={Timetable.Message}
          confirmDelete={confirmDelete}
        />
        <ToastContainer />
      </div>
      </Layout>           
  );
};

export default Product;
