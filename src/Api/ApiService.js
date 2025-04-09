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
 
};


export default ApiService;
