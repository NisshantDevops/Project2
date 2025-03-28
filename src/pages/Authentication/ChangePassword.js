import React, { useState } from "react";
import { Card, CardBody, Col, Container, Row, Form, Alert } from "reactstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom"; 
import BaseButton from "../../Components/Base/Button";
import BaseInput from "../../Components/Base/Input";
import { StatusMessage, Texts } from "../../Components/Constants/Common";
import { Check, Placeholder } from "../../Components/Constants/Validation";
import { OldPassword, NewPassword, ConfirmPassword, Password } from "../../Components/Constants/LoginConstant";
import { changePasswordApi } from "../../Api/ChangePasswordApi"; 

const ChangePassword = () => {
    const [loading, setLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");
    const [successMsg, setSuccessMsg] = useState("");

    const navigate = useNavigate(); 

    const validation = useFormik({
        initialValues: {
            oldPassword: "",
            newPassword: "",
            confirmPassword: "",
        },
        validationSchema: Yup.object({
            oldPassword: Yup.string().required(Check.require(OldPassword)),
            newPassword: Yup.string()
                .min(6, Check.CheckPassword(NewPassword, 6))
                .required(Check.require(NewPassword)),
            confirmPassword: Yup.string()
                .oneOf([Yup.ref("newPassword")], Check.match(Password))
                .required(Check.require(ConfirmPassword)),
        }),
        onSubmit: async (values) => {
            setLoading(true);
            setErrorMsg("");
            setSuccessMsg("");

            try {
                const payload = {
                    currentPassword: values.oldPassword,
                    newPassword: values.newPassword,
                    confirmPassword: values.confirmPassword,
                };
                const response = await changePasswordApi(payload);

                if (StatusMessage(response?.statusCode)) {
                    toast.success(Check.update(Password));
                    setSuccessMsg(Check.reset(Password));
                    validation.resetForm();
                    
                    localStorage.removeItem("token"); 

                    setTimeout(() => {
                        navigate("/login"); 
                    }, 2000); 
                } else {
                    toast.error(response?.message);
                }
            } catch (error) {
                setErrorMsg(error.message);
                toast.error(error.message);
            }

            setLoading(false);
        },
    });

    return (
        <div className="auth-page-content mt-lg-5">
            <Container className="mt-2">
                <Row className="justify-content-center">
                    <Col md={8} lg={6} xl={5}>
                        <Card className="mt-2">
                            <CardBody className="fix-margin p-4 mt-4">
                                <div className="text-center mt-2">
                                    <h5 className="text-primary">{Texts.Change_Password}</h5>
                                </div>

                                <div className="p-2 mt-2">
                                    <Form onSubmit={validation.handleSubmit} noValidate>
                                        <BaseInput
                                            label={OldPassword}
                                            type={Password}
                                            name="oldPassword"
                                            placeholder={Placeholder(OldPassword)}
                                            value={validation.values.oldPassword}
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            error={validation.touched.oldPassword && validation.errors.oldPassword}
                                            required
                                            passwordToggle
                                        />

                                        <BaseInput
                                            label={NewPassword}
                                            type={Password}
                                            name="newPassword"
                                            placeholder={Placeholder(NewPassword)}
                                            value={validation.values.newPassword}
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            error={validation.touched.newPassword && validation.errors.newPassword}
                                            required
                                            passwordToggle
                                        />

                                        <BaseInput
                                            label={ConfirmPassword}
                                            type={Password}
                                            name="confirmPassword"
                                            placeholder={Placeholder(ConfirmPassword)}
                                            value={validation.values.confirmPassword}
                                            onChange={validation.handleChange}
                                            onBlur={validation.handleBlur}
                                            error={validation.touched.confirmPassword && validation.errors.confirmPassword}
                                            required
                                            passwordToggle
                                        />

                                        <div className="mt-4">
                                            <BaseButton
                                                color="success"
                                                className="w-100"
                                                type="submit"
                                                disabled={loading}
                                                loader={loading}
                                            >
                                                {Texts.Change_Password}
                                            </BaseButton>
                                        </div>
                                    </Form>
                                </div>
                            </CardBody>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default ChangePassword;