import { ChangePassword } from "./ApiRoutes";
import ApiService from "./ApiService";

export const changePasswordApi = async (payload) => {
    return await ApiService.request(ChangePassword, "PUT", payload);
};