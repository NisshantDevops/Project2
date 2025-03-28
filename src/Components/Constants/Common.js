import { StatusCodes } from "http-status-codes";
export const token = localStorage.getItem("token");


export const StatusMessage = (data) =>{

    return ([StatusCodes.ACCEPTED, StatusCodes.OK, StatusCodes.CREATED].includes(data))
}

export const Texts = {
    Welcome_Back: "Welcome Back!",
    Login_Message: "Sign in to continue to Velzon.",
    Signup_Redirect: "Don't have an account?",
    Signup_Link: "Signup",
    SignIn: "Sign In",
    Forgot_PassWord: "Forgot Password?",
    EnterEmail: "Enter your email to receive reset instructions.",
    ResetPassword: "Reset Password",
    Change_Password: "Change Password",
    EnterPasswordDetails: "Enter Password Details",
};