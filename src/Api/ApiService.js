import axios from "axios";
import { token } from "../Components/Constants/Common";
import { FileUpload } from "./ApiRoutes";
import { 
  AddProductRoute,
  FetchProductRoutes,
  UpdateProductRoute,
  ListProductRoute,
  DeleteProductRoute,
  ProductFileUploadRoute
} from "./ApiRoutes";
import { editProduct } from "./ProductApi";
export const API_BASE_URL = process.env.REACT_APP_BASE_URL;
const ApiService = {
  async request(endpoint, method, body = null) {
    try {
      const token = localStorage.getItem("token");
      const headers = {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const options = {
        method,
        headers,
        ...(body && { body: JSON.stringify(body) })
      };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      return data;
    } catch (error) {
      console.error(`API Error (${method} ${endpoint}):`, error);
      throw new Error(error.message);
    }
  },

  async FileUpload(formData) {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${API_BASE_URL}/fileUpload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            ...(token && { Authorization: `Bearer ${token}` })
          }
        }
      );
      return response.data;
    } catch (error) {
      console.error("File upload error:", error);
      throw new Error(error.response?.data?.message);
    }
  },
  async getCategoryById(categoryId) {
    return this.request(`/categories/${categoryId}`, "GET");
  },

  async addCategory(categoryData) {
    return this.request("/categories", "POST", categoryData);
  },

  async updateCategory(categoryId, categoryData) {
    return this.request(`/categories/${categoryId}`, "PUT", categoryData);
  },

  async deleteCategory(categoryId) {
    return this.request(`/categories/${categoryId}`, "DELETE");
  },
  async addProduct(productData) {
    return this.request(AddProductRoute, "POST", productData);
  },
  
  async getProduct(productId) {
    return this.request(`${FetchProductRoutes}/${productId}`, "GET");
  },
  
  async editProduct(productId, productData) {
    return this.request(`${UpdateProductRoute}/${productId}`, "PUT", productData);
  },
  
  async listProducts(filters = {}) {
    return this.request(ListProductRoute, "POST", filters);
  },
  
  async deleteProduct(productId) {
    return this.request(`${DeleteProductRoute}/${productId}`, "DELETE");
  },
  
  
  async searchProducts(queryParams) {
    return this.request(`${FetchProductRoutes}/search?${new URLSearchParams(queryParams)}`, "GET");
  },
  
  async getFeaturedProducts() {
    return this.request(`${FetchProductRoutes}/featured`, "GET");
  }
  
};


export default ApiService;
