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
import { StatusMessage, Tet } from "../../Components/Constants/Common";
import BaseButton from "../../Components/Base/Button";
import BaseInput from "../../Components/Base/Input";
import { Cats } from "../../Components/Constant/Common";
import { useParams } from 'react-router-dom';






const Product = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState(null);
  const [modaldelete, setmodaldelete] = useState(false);
  const navigate = useNavigate();

  document.title = "Product";


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


      if (response && response.status === StatusMessage) {
        toast.success(StatusMessage);
        setProducts(prev => prev.filter(({ id }) => id !== productToDelete.id));
      } else {
        toast.error(response?.message);
      }
    } catch (err) {
      console.error('Delete error:', err);
      const errorMessage = err.response?.data?.message
        || err.response?.data?.error
        || err.message
        ;
      toast.error(errorMessage);
    } finally {
      setmodaldelete(false);
      setProductToDelete(null);
    }
  };



  return (
    <Layout>
      <div className="page-content">
        <Container fluid>
          <Row>
            <Col lg={12}>
              <Card>
                <CardHeader className="d-flex justify-content-between align-items-center">
                  <h5 className="card-title mb-0">{Tet.Pm}</h5>
                  <BaseButton
                    color="success"
                    onClick={() => navigate("/AddProduct")}
                  >
                    <i className="ri-add-line align-bottom me-1"></i> {Tet.Ad}
                  </BaseButton>
                </CardHeader>

                <CardBody>
                  {loading ? (
                    <Spinner />
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-bordered table-hover">
                        <thead className="table-light">
                          <tr>
                            <th>{Tet.I1}</th>
                            <th>{Tet.I2}</th>
                            <th>{Tet.I3}</th>
                            <th>{Tet.I4}</th>
                            <th>{Tet.I5}</th>
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
                                  "No image available"
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
                      </table>
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
          message={Tet.Message}
          confirmDelete={confirmDelete}
        />
        <ToastContainer />
      </div>
    </Layout>
  );
};

export default Product;