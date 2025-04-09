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
    SignIn: "Sign In"
};

export const Cats={
 CateName:"category",
 CateAdd:" Add Category",
 CateResult:"result",
 CateClose:"close",
CateDelete:"delete",
CateImage:"category Image",
CateDescription:"Description",
CateNa:"Category Name",
CateShow:"Showing",
CateProcessing:" Processing...",
CatePrevious:"Previous",
CateNext:"Next",
CateEdit:"Edit"
};
