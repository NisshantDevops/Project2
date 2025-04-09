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
import { Timetable } from "../../Components/Constants/Common";
import { ADDP, AddProducts, handleApiError, ProductTitle, StatusMessage } from "../../Components/Constants/Common";
import BaseButton from "../../Components/Base/Button";
import BaseInput from "../../Components/Base/Input";
import { Cats } from "../../Components/Constant/Common";
import { useParams } from 'react-router-dom';
import { IsResponseOk } from "../../Components/Constants/Common";
import BaseTable from "../Table/BaseTable";
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
      if (IsResponseOk(response, StatusMessage)){
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



  return (
    
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{Timetable.ProdcutModel}</h5>
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
                      <BaseTable className="table table-bordered table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>{Timetable.Item1}</th>
                            <th>{Timetable.Item2}</th>
                            <th>{Timetable.Item3}</th>
                            <th>{Timetable.Item4}</th>
                            <th>{Timetable.Item5}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map((product) => (
                            <tr key={product.id}>
                              <td>{product.id}</td>
                              <td>{product.name}</td>
                              <td>{product.description}</td>
                              <td>
                                {product.image ? (
                                  <img
                                    src={product.image ? product.image : ImageError}
                                    alt={product.name || "Product"}
                                    className="product-img"
                                    onError={handleImageError}
                                  />

                                ) : (
                                  AddProducts.Nia
                                )}
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <BaseButton
                                    color="primary"
                                    size="sm"
                                    onClick={() => navigate(`/addProduct`, { state: { productData: product, isEditMode: true } })}
                                  >
                                    {Cats.CateEdit}
                                  </BaseButton>
                                  <BaseButton
                                    color="danger"
                                    size="sm"
                                    onClick={() => handleDeleteClick(product)}
                                  >
                                    {Cats.CateDelete}
                                  </BaseButton>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </BaseTable>
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