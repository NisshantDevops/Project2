import Category from "../pages/Category/Category";
import axios from "axios";
import { 
  FetchCategoryRoute, 
  AddCategoryRoute, 
  DeleteCategoryRoute, 
  UpdateCategoryRoute,
  ListCategoryRoute,
  FileUploadRoute
} from "./ApiRoutes";
import ApiService from "./ApiService";

export const FileUpload = async (formData) => {
   return await ApiService.request(FileUploadRoute,"POST",formData)
  };
export const addCategory = async (payload) => {
  console.log('res res', payload);
  const res = await ApiService.request(AddCategoryRoute, "POST", payload);
  return res;
};
export const fetchCategories = async (id = "") => {
  console.log("enter id:", Category.id);
  return await ApiService.request(`${FetchCategoryRoute}/${id}`, "GET");
 };
export const updateCategory = async (id, payload) => {
  return await ApiService.request(`${UpdateCategoryRoute}/${id}`, "PUT", payload);
};
export const listCategory = async (payload = {}) => {
  return await ApiService.request(ListCategoryRoute, "POST", payload);
};
export const deleteCategory = async (id) => {
  return await ApiService.request(`${DeleteCategoryRoute}/${id}`, "DELETE");
};
 

export default FileUpload;