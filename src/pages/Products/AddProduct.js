import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, Spinner, Row, Col, Form as BForm, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { ProductApi } from '../../Api/ProductApi';
import { addCategory } from '../../Api/CategoryApi';
import Layout from '../../Layouts/index';
import { Tender } from '../../Components/Constants/Common';
import { AddProducts, StatusMessage, Validation, CategoryOptions, handleApiError } from '../../Components/Constants/Common';
import BaseButton from "../../Components/Base/Button"
import BaseInput from '../../Components/Base/Input';
import BaseSelect from "../../Components/Base/Input"
import { productValidationSchema } from '../../Components/Constants/Common';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();


  const isEditMode = !!id || location.state?.isEditMode;
  const productData = location.state?.productData || null;

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [data, setData] = useState(null);


  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: '',
      price: '',
      description: '',
      color: '',
      size: '',
      quantity: '',
      image: null,
      category_id: isEditMode ? String(data?.category_id || '') : '',
    },
    validationSchema: productValidationSchema(),


    onSubmit: async (values) => {
      try {
        setLoading(true);

        if (!values.name?.trim()) {
          toast.error(StatusMessage);
          return;
        }

        if (!values.category_id || isNaN(values.category_id)) {
          toast.error(StatusMessage);
          return;
        }

        const payload = {
          name: values.name.trim(),
          category_id: Number(values.category_id),
          product_variants: [
            {
              product_title_name: values.name.trim(),
              description: values.description || '',
              color: values.color,
              size: values.size,
              price: Number(values.price || 0),
              quantity: Number(values.quantity || 1),
              variant_image: {
                image_path: values.image?.name,
              },
            },
          ],
        };



        let response;
        if (isEditMode) {
          const productId = id || productData?.id;
          response = await ProductApi.updateProduct(productId, payload);
          toast.success(response.data?.statusMessage);
        } else {
          response = await ProductApi.addProduct(payload);
          toast.success(response.data?.statusMessage);
        }

        navigate('/products');
      } catch (error) {
        handleApiError(error);
      } finally {
        setLoading(false);
      }
    },



  });

  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        setLoading(true);
        try {
          let data;
          if (id) {

            data = await ProductApi.getProduct(id);
          } else if (productData) {

            data = productData;
          }

          if (data) {
            const variant = data.product_variants?.[0] || {};
            if (variant?.variant_image?.image_path) {
              setImagePreview(`${process.env.REACT_APP_BASE_URL}${variant.variant_image.image_path}`);
            }
          }
        } catch (err) {
          toast.error(StatusMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [id, isEditMode]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      formik.setFieldValue('image', file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (

    <div className="page-content">
      <div className="container-fluid">
        <Card>
          <Card.Header>
            <h5>{isEditMode ? Tender.EditProduct : Tender.AddProduct}</h5>
          </Card.Header>
          <Card.Body>
            <BForm onSubmit={formik.handleSubmit} encType="multipart/form-data">
              <Row>
                <Col md={6}>
                  <BForm.Group className="mb-3">
                   
                    <BaseInput
                      label={AddProducts.ProductName}
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}

                    />
                  </BForm.Group>
                </Col>
                <Col md={6}>
                  <BForm.Group className="mb-3">
                    
                    <BaseInput
                      label={AddProducts.Price}
                      type="number"
                      name="price"
                      value={formik.values.price}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}

                    />
                  </BForm.Group>
                </Col>
              </Row>

              <BForm.Group className="mb-3">
                
                <BaseInput
                  label={Tender.Deep}
                  type="textarea"
                  name="description"
                  value={formik.values.description}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}

                  rows={3}
                />
              </BForm.Group>

              <BForm.Group className="mb-3">
               
                <BaseInput
                label={AddProducts.ProductIamge}
                  type="file"
                  name="image"
                  accept="image/jpeg, image/png"
                  onChange={handleImageChange}
                  onBlur={formik.handleBlur}

                />
                {imagePreview && (
                  <div className="mt-2">
                    <img src={imagePreview} alt="Preview" />
                  </div>
                )}
                {isEditMode && !imagePreview && (
                  <div className="text-muted mt-2">{AddProducts.SelectimageCat}</div>
                )}
              </BForm.Group>

              <BForm.Group className="mb-3">
               
                <BaseSelect
                 label={Tender.Category}
                  name={AddProducts.IdValue}
                  options={CategoryOptions}
                  value={formik.values.category_id}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                 
                />

              </BForm.Group>

              <div className="d-flex justify-content-end gap-2">
                <BaseButton variant="secondary" onClick={() => navigate('/products')}>
                  {AddProducts.Cancel}
                </BaseButton>
                <BaseButton variant="primary" type="submit" loading={loading} disabled={loading}>
                  {isEditMode ? Tender.UpdateProdcut : Tender.AddProduct}
                </BaseButton>

              </div>
            </BForm>
          </Card.Body>
        </Card>
      </div>
    </div>

  );
};

export default ProductForm;