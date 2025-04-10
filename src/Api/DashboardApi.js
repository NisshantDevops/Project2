import ApiService from "./ApiService";
import { DashboardPurchaseOrder, DashboardSalesOrder, FetchProductRoute } from "./ApiRoutes";


export const getProduct = async (id) => {
  return await ApiService.request(`${FetchProductRoute}/${id}`, "GET");
};

export const getDashboardPurchaseOrders = async () => {
  return await ApiService.request(DashboardPurchaseOrder, "GET");
};


export const getDashboardSalesOrders = async () => {
  return await ApiService.request(DashboardSalesOrder, "GET");
};
