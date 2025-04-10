import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { Card, Spinner, Row, Col, Form as BForm } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useFormik } from 'formik';
import { ProductApi } from '../../Api/ProductApi';

import { Tender } from '../../Components/Constants/Common';
import {
  AddProducts,
  StatusMessage,
  CategoryOptions,
  handleApiError,
  productValidationSchema,
} from '../../Components/Constants/Common';

import BaseButton from '../../Components/Base/Button';
import BaseInput from '../../Components/Base/Input';

const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const productDataFromState = location.state?.productData || null;
  const isEditMode = Boolean(id);

  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

 

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      name: data?.name || '',
      image: null,
      category_id: data?.category_id ? String(data.category_id) : '',
      product_variants: [
        {
          price: data?.product_variants?.[0]?.price || '',
          quantity: data?.product_variants?.[0]?.quantity || '',
          description: data?.product_variants?.[0]?.description || '',
          color: data?.product_variants?.[0]?.color || '',
          size: data?.product_variants?.[0]?.size || '',
          variant_image: {
            image_path: data?.product_variants?.[0]?.variant_image?.image_path || '',
          },
        },
      ],
    },
    validationSchema: productValidationSchema(),
    onSubmit: async (values) => {
      try {
        setLoading(true);
        const payload = {
          name: values.name,
          category_id: Number(values.category_id),
          product_variants: [
            {
              ...values.product_variants[0],
              price: Number(values.product_variants[0].price),
              quantity: Number(values.product_variants[0].quantity),
              product_title_name: values.name,
              variant_image: {
                image_path:
                  values.image?.name ||
                  values.product_variants[0].variant_image?.image_path ||
                  'xyz.png',
              },
            },
          ],
        };
    
        if (isEditMode) {
          await ProductApi.updateProduct(id, payload);
          toast.success(StatusMessage.response);
        } else {
          await ProductApi.addProduct(payload);
          toast.success(StatusMessage.response);
        }
    
        navigate('/products');
      } catch (error) {
        console.error('Product save failed:', error.response?.data || error.message);
        toast.error(error.response?.data?.message?.[0] );
      } finally {
        setLoading(false);
      }
    }
,    
  });
  useEffect(() => {
    const fetchData = async () => {
      if (!isEditMode) return;

      setLoading(true);
      try {
        let fetchedData = productDataFromState;

        if (!fetchedData && id) {
          const response = await ProductApi.getProduct(id);
          fetchedData = response.data || response;
        }

        if (fetchedData) {
          setData(fetchedData);
          const variant = fetchedData.product_variants?.[0] || {};
          if (variant?.variant_image?.image_path) {
            setImagePreview(
              `${process.env.REACT_APP_BASE_URL}${variant.variant_image.image_path}`
            );
          }
        } else {
          toast.error(StatusMessage.response);
        }
      } catch (err) {
        toast.error(StatusMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, productDataFromState]);

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
            {loading && !formik.values.name ? (
              <div className="text-center">
                <Spinner animation="border" />
              </div>
            ) : (
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

                <Row>
                  <Col md={6}>
                    <BForm.Group className="mb-3">
                      <BaseInput
                        label={AddProducts.Color}
                        type="text"
                        name="color"
                        value={formik.values.color}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </BForm.Group>
                  </Col>
                  <Col md={6}>
                    <BForm.Group className="mb-3">
                      <BaseInput
                        label={AddProducts.Size}
                        type="text"
                        name="size"
                        value={formik.values.size}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                      />
                    </BForm.Group>
                  </Col>
                </Row>

                <Row>
                 
                  <Col md={6}>
                    <BForm.Group className="mb-3">
                      <BaseInput
                        label={Tender.Category}
                        type="select"
                        name="category_id"
                        value={formik.values.category_id}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        error={formik.touched.category_id && formik.errors.category_id}
                        options={CategoryOptions}
                      />
                    </BForm.Group>
                  </Col>
                </Row>

                <BForm.Group className="mb-3">
                  <BaseInput
                    label={Tender.Description}
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
                    label={AddProducts.ProductImage}
                    type="file"
                    name="image"
                    accept="image/*"
                    onChange={handleImageChange}
                    onBlur={formik.handleBlur}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxHeight: '150px', maxWidth: '100%' }}
                      />
                    </div>
                  )}
                </BForm.Group>

                <div className="d-flex justify-content-end gap-2">
                  <BaseButton
                    variant="secondary"
                    onClick={() => navigate('/products')}
                    disabled={loading}
                  >
                    {AddProducts.Cancel}
                  </BaseButton>
                  <BaseButton
                    variant="primary"
                    type="submit"
                    loading={loading}
                    disabled={loading || !formik.dirty}
                  >
                    {isEditMode ? Tender.UpdateProdcuts : Tender.AddProduct}
                  </BaseButton>
                </div>
              </BForm>
            )}
          </Card.Body>
        </Card>
      </div>
    </div>
  );
};

export default ProductForm;