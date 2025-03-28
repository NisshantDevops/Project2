import { changePassword } from "./ApiRoutes";
import ApiService from "./ApiService";

export const changePasswordApi = async (payload) => {
    return await ApiService.request(changePassword, "PUT", payload);
};