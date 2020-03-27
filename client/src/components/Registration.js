import React from "react";
import { withFormik, Field, Form } from "formik";
import { withRouter, NavLink } from "react-router-dom";
import * as Yup from "yup";

import { axiosWithAuth } from "../utils/axiosWithAuth";

const Registration = ({ touched, errors }) => {
  return (
    <div className="form-container">
      <h3>Sign Up</h3>
      <Form className="register-form">
        <Field name="username" type="text" placeholder="username" />
        {touched.username && errors.username && (
          <p className="errors"> {errors.username} </p>
        )}
        <Field name="password" type="password" placeholder="password" />
        {touched.password && errors.password && (
          <p className="errors"> {errors.password} </p>
        )}

        <button type="submit">Sign Up</button>
        <h6>Already a member?</h6>
        <NavLink to="/signin">Sign in</NavLink>
      </Form>
    </div>
  );
};

const FormikForm = withRouter(
  withFormik({
    mapPropsToValues({ username, password }) {
      return {
        username: username || "",
        password: password || ""
      };
    },
    validationSchema: Yup.object().shape({
      username: Yup.string().required("A username is required"),
      password: Yup.string().required("A password is required")
    }),
    handleSubmit(values, { props }) {
      axiosWithAuth()
        .post("auth/register", values)
        .then((res) => {
          console.log("registration success", res);
          window.localStorage.setItem("token", res.data.token);
          props.history.push(`/signin`);
        })
        .catch((err) => console.log(err));
    }
  })(Registration)
);

export default FormikForm;
