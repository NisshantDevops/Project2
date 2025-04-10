import { StatusCodes } from "http-status-codes";
import { toast } from 'react-toastify';
import * as Yup from 'yup';

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

export const Tender={
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
    Deep:"description",
    Ent:"div",
    Nam:"Name",
    EditProduct:"Edit Product",
    AddProduct:"Add Product",
    UpdateProdcut:"Update Product",
    Edit:"Edit",
    Remove:"Remove"
    
};
export const AddProducts={
    ProductName:"Product Name",
    Price:"Price",
    ProductIamge:"Product Image",
    Electronics:"Electronics",
    Clothing:"clothing",
    SelectimageCat:"Select Category",
    Cancel:"Cancel",
    Sc:"No image selected (current image will be kept)",
    Nia:"No image available",
    IdValue:"category_id"
}
;
export const MESSAGE = "Are you Sure You want to Remove this Record?";
 export const PAGE_TITLE = "Category";


 export const Timetable={
    Message:"Message",
    ProductModel:"Products",
    Add:"Add",
    Item1:"ID",
    Item2:"Name",
    Item3:"Desrption",
    Item4:"Image",
    Item5:"Action"
};

export const CategoryOptions = [
    { value: "1", label: "Electronics" },
    { value: "2", label: "Clothing" },
  ];
  export const ProductTitle={
    ProductHeader:"Product"
  };
  export const handleApiError = (error) => {
    const messages = error?.response?.data?.message;
  
    if (Array.isArray(messages)) {
      messages.forEach(msg => {
        toast.error(msg);
      });
    } else if (typeof messages === 'string') {
      toast.error(messages);
    } else {
      toast.error(error?.message );
    }
  
    console.error('API Error:', error);
  };
  export const IsResponseOk = (response, expectedStatus) => {
    return response && response.status === expectedStatus;
  };
  export const Title={
       ProductValue :"PRODUCT_COLUMNS"
  };
  export const productValidationSchema = () =>
    Yup.object({
      name: Yup.string()
        .trim()
        .required("Product name is required"),
  
      price: Yup.number()
        .typeError('Price must be a number')
        .required('Price is required')
        .moreThan(0, 'Price must be greater than 0'),
  
      description: Yup.string()
        .trim()
        .max(1000, 'Description should not exceed 1000 characters'),
  
      category_id: Yup.string()
        .required('Category is required'),
    });
   export const ReportModule = {
      ReportTitle: "Report",
      ReportPurchase: "purchase",
      ReportSales: "sales",
      StatusTrue: "true",
      OrderAsc: "asc",
      OrderDesc: "desc",
      StringValue: "string",
      True: "true",
      False: "false",
      EndDateErrorMessage: "End date cannot be a future date.",
    };
    export const StatusOptions = [
      { value: "", label: "All Status" },
      { value: "true", label: "True" },
      { value: "false", label: "False" },
    ];
    export const Data={
      Datavalue:"https://e-commerce-gg46.onrender.com/api/order/users-report"
    };
    export const Values={
      Valuesnumber:"No data available for the selected criteria.",
      Showing:"showing",
      Entries:"Entries"
    };
    export const SelectReport = [
      { value: "", label: "Select Report" },
      { value: "sales", label: "Sales Report" },
      { value: "purchase", label: "Purchase Report" },
    ];
    export const Labels={
      Status:"Status",
      EndDate:"End Date",
      StartDate:"Start Date",
      Select:"Select Report Type"
    };
