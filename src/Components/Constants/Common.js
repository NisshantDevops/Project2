import { StatusCodes } from "http-status-codes";
export const token = localStorage.getItem("token");


export const StatusMessage = (data) =>{

    return ([StatusCodes.ACCEPTED, StatusCodes.OK, StatusCodes.CREATED].includes(data))
}

export const Texts = {
    WelcomeBack: "Welcome Back!",
    LoginMessage: "Sign in to continue to Velzon.",
    SignupRedirect: "Don't have an account?",
    SignupLink: "Signup",
    SignIn: "Sign In",
    ForgotPassWord: "Forgot Password?",
    EnterEmail: "Enter your email to receive reset instructions.",
    ResetPassword: "Reset Password",
    ChangePassword: "Change Password",
    EnterPasswordDetails: "Enter Password Details",
    Edit:"Edit",
    Remove:"Remove",
};