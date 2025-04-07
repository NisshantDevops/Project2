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
    FormData:"Formdata",
    AddCategory:"Add category",
    UpdateCategory:"Update category",
    Update:"Update",
    Add:"Add"
};

export const Ten={
    Dashboard:"Dashboard",
    Apps:"Apps",
    Category:"Category",
    Reports:"Reports",
    Products:"Products",
    Search:"Search...",
    Type:"text",
    Id:"categoryName",
    ClassName:"form-control",
    Placeholder:"Enter Category Name",
    AM:"name",
    Tex:"textarea",
    Idd:"categoryDescription",
    Paceholder:"Enter Description",
    Bdd:"description",
    Zee:"file",
    Yo:"categoryImage",
    Ye:"description",
    Ent:"div",
    Nam:"Name"
};
export const MESSAGE = "Are you Sure You want to Remove this Record?";
 export const PAGE_TITLE = "Category";


