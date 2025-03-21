"use client";
import Link from "next/link";
import React, { useContext, useEffect, useState } from "react";
import { useFormik } from "formik";
import axios from "axios";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { UserContext } from "../_Context/UserContext";
import { EditorContext } from "../_Context/EditorContext";

export default function Login() {
  let VaYup = Yup.object({
    email: Yup.string()
      .email("Please enter a valid email")
      .required("Please enter a email"),

    password: Yup.string()
      .min(8, "Password must be at least 8 characters")
      .required("Please enter a Password"),
  });
  const [Errors, setErrors] = useState("");
  const [BtnLoading, setBtnLoading] = useState(false);
  const Router = useRouter();
  const { setUserToken, headers, setheaders } = useContext(UserContext);
  const { TV, setTV } = useContext(EditorContext);

  function handleLogin(formvalues) {
    setErrors("");
    setBtnLoading(true);

    if (TV === 1) {
      toast.loading("Waiting is Loging...");
      setTV(0);
      axios
        .post("https://todolist-two-lac.vercel.app/login", formvalues)
        .then((data) => {
          toast.dismiss();
          if (data.status === 200) {
            localStorage.setItem("UserToken", data?.data?.token);
            setheaders({
              Authorization: data?.data?.token,
            });
            setUserToken(data?.data?.token);
            toast.success("Logined");

            Router.replace("/");
          } else {
            toast.error("Something Error !!");
            setBtnLoading(false);
            setTV(1);
          }
        })
        .catch((error) => {
          toast.dismiss();
          setErrors(error?.response?.data?.message);
          setBtnLoading(false);
          setTV(1);
          toast.error(error?.response?.data?.message);
        });
    } else {
      toast.error("Waiting your order is loading");
    }
  }
  const Formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: VaYup,
    onSubmit: handleLogin,
  });
  return (
    <div className="m-15 flex justify-center flex-col text-center">
      <h1 className="pb-10 text-4xl font-semibold">Login</h1>
      <form onSubmit={Formik.handleSubmit} className="max-w-sm mx-auto">
        <div className="mb-5">
          <label
            htmlFor="email"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your email
          </label>
          <input
            autoComplete="username"
            name="email"
            type="email"
            id="email"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            placeholder="Enter your Email"
            value={Formik.values.email}
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            required
          />
          {Formik.errors.email && Formik.touched.email ? (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              {Formik.errors.email}
            </div>
          ) : null}
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Your password
          </label>
          <input
            autoComplete="new-password"
            name="password"
            type="password"
            id="password"
            className="shadow-xs bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 dark:shadow-xs-light"
            value={Formik.values.password}
            onChange={Formik.handleChange}
            onBlur={Formik.handleBlur}
            placeholder="Enter your password"
            required
          />
          {Formik.errors.password && Formik.touched.password ? (
            <div
              className="p-4 mb-4 text-sm text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
              role="alert"
            >
              {Formik.errors.password}
            </div>
          ) : null}
        </div>

        <button
          type="submit"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          {BtnLoading ? (
            <div className="flex justify-between" role="status">
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="pl-2 items-center text-center">Loading...</span>
            </div>
          ) : (
            "Login"
          )}
        </button>
        {Errors ? (
          <div
            className="p-4 mb-4 text-sm text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
            role="alert"
          >
            {Errors}
          </div>
        ) : null}

        <div className="flex justify-center flex-row pt-5  ">
          <span>I don't have an account </span>
          <Link href={"/Signin"}>
            {" "}
            <i className="underline underline-offset-2 font-semibold">
              {" "}
              Sign in
            </i>
          </Link>
        </div>
      </form>
    </div>
  );
}
