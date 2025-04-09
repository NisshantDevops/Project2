import axios from "axios";

import { 
  FetchProductRoute,
  AddProductRoute,
  DeleteProductRoute,
  UpdateProductRoute,
  ListProductRoute,
  ProductFileUploadRoute
} from "./ApiRoutes";
import ApiService from "./ApiService";

export const uploadProductFile = async (formData) => {
  return await ApiService.request(ProductFileUploadRoute, "POST", formData, {
    headers: { "Content-Type": "multipart/form-data" }
  });
};


export const addProduct = async (payload) => {
  return await ApiService.request(AddProductRoute, "POST", payload);
};

export const getProduct = async (id) => {
  return await ApiService.request(`${FetchProductRoute}/${id}`, "GET");
};

export const updateProduct = async (id, payload) => {
  return await ApiService.request(`${UpdateProductRoute}/${id}`, "PUT", payload);
};

export const listProducts = async (payload) => {
  return await ApiService.request(ListProductRoute, "POST", payload);
};

export const deleteProduct = async (id) => {
  return await ApiService.request(`${DeleteProductRoute}/${id}`, "DELETE");
};


export const ProductApi = {
  uploadProductFile,
  addProduct,
  getProduct,
  updateProduct,
  listProducts,
  deleteProduct
};


export default ProductApi;