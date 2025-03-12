"use client";
import axios from "axios";
import { useFormik } from "formik";
import React, { useContext, useEffect, useRef, useState } from "react";
import { UserContext } from "../_Context/UserContext";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { EditorContext } from "../_Context/EditorContext";
import useTask from "../_Hooks/useTask";

export default function Editor() {
  const [BtnLoading, setBtnLoading] = useState(false);
  const [SelectColorBG, setSelectColorBG] = useState("Tomato");
  const { headers, UserToken, setUserToken } = useContext(UserContext);
  const {
    EditorMode,
    setEditorMode,
    UpdateMode,
    setUpdateMode,
    MyTasks,
    TV,
    setTV,
  } = useContext(EditorContext);
  const { data, isLoading, error, isError, refetch } = useTask();
  const [Error, setError] = useState("");

  let ValidYup = Yup.object({
    title: Yup.string().min(4).required("Enter title"),
    info: Yup.string().min(4).required("Enter info"),
    colorbg: Yup.string().required("Select color"),
  });
  const ColorBG = {
    Tomato: "#FF6347",
    Sage: "#8A9A5B",
    Banana: "#FFFF7E",
    Basil: "#59910F",
  };
  const MenuColor = useRef();

  function handle_Add_Update_Task(Formvalues) {
    if (TV === 1) {
      setTV(0);
      setError("");
      setBtnLoading(true);
      if (UpdateMode === -1) {
        axios
          .post("https://todolist-two-lac.vercel.app/task/add", Formvalues, {
            headers,
          })
          .then((x) => {
            if (x.status == "201") {
              refetch();
              toast.success("Task Add -Ok");
              setEditorMode(false);
            }
            console.log(x);
            setBtnLoading(false);
            setTV(1);
          })
          .catch((err) => {
            setTV(1);
            setError(err?.response?.data.message);
            console.log(err);
            setBtnLoading(false);
          });
      } else {
        axios
          .put(
            `https://todolist-two-lac.vercel.app/task/${MyTasks[UpdateMode]._id}`,
            Formvalues,
            { headers }
          )
          .then((data) => {
            console.log(data);
            if (data.status === 200) {
              refetch();
              toast.success("Task Update -Ok");
              setUpdateMode(-1);
              setEditorMode(false);
              setTV(1);
            }
          })
          .catch((err) => {
            setError(err?.response?.data.message);
            console.log(err);
            setBtnLoading(false);
            setTV(1);
          });
      }
    } else {
      toast.error("Wait Your Order Loading !");
    }
  }

  let Formik = useFormik({
    initialValues: {
      title: "",
      info: "",
      colorbg: "",
    },
    validationSchema: ValidYup,
    onSubmit: handle_Add_Update_Task,
  });

  function handleBGColors(Color) {
    closeAllDetails();
    Formik.values.colorbg = Color;
    setSelectColorBG(Color);
  }
  function closeAllDetails() {
    MenuColor.current.removeAttribute("open");
  }

  useEffect(() => {
    if (UpdateMode !== -1) {
      if (MyTasks[UpdateMode]?.title !== undefined) {
        Formik.setValues({
          title: MyTasks[UpdateMode]?.title || "",
          info: MyTasks[UpdateMode]?.info || "",
          colorbg: MyTasks[UpdateMode]?.colorbg || "",
        });
        handleBGColors(MyTasks[UpdateMode]?.colorbg);
      }
    }
  }, [UpdateMode, MyTasks]);

  useEffect(() => {
    if (
      (isError && error?.message === "Request failed with status code 401") ||
      error?.message === "Request failed with status code 403"
    ) {
      localStorage.removeItem("UserToken");
      setUserToken(null);
      toast.error("Login Frist");
      Router.replace("/Login");
    }
  }, [isError, error]);

  useEffect(() => {
    handleBGColors("Tomato");
  }, []);

  return (
    <form onSubmit={Formik.handleSubmit}>
      <div className="mt-9 relative">
        <div className="mt-12 flex justify-center  items-center w-full absolute  flex-col">
          {UpdateMode === -1 ? (
            <h1 className="pb-5  text-3xl">Add Task</h1>
          ) : (
            <h1 className="pb-5  text-3xl">Update Task</h1>
          )}
          <div
            className=" flex  flex-col text-center gap-4 p-8"
            style={{ backgroundColor: "#e2d5de" }}
          >
            <label
              className=" font-bold text-2xl bg-gray-500 rounded-3xl"
              htmlFor="title"
            >
              Title Task
            </label>
            <input
              className="bg-yellow-100 border-b-blue-950  border-2"
              value={Formik.values.title}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              name="title"
              id="title"
              type="text"
              placeholder="Enter Title"
            />
            {Formik.errors.title && Formik.touched.title ? (
              <div
                className=" text-sm text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                {Formik.errors.title}
              </div>
            ) : null}
            <label
              className=" font-bold text-2xl bg-gray-500 rounded-3xl"
              htmlFor="info"
            >
              info Task
            </label>
            <textarea
              value={Formik.values.info}
              onChange={Formik.handleChange}
              onBlur={Formik.handleBlur}
              className="bg-yellow-100 border-b-blue-950  border-2"
              name="info"
              id="info"
              type="text"
              placeholder="Enter info"
            />
            {Formik.errors.info && Formik.touched.info ? (
              <div
                className=" text-sm text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                {Formik.errors.info}
              </div>
            ) : null}
            <h1 className=" font-bold text-2xl bg-gray-500 rounded-3xl p-2">
              Color task background{" "}
            </h1>
            <div>
              <ul className="menu  rounded-box w-56">
                <li>
                  <details ref={MenuColor}>
                    <summary
                      style={{ backgroundColor: ColorBG[SelectColorBG] }}
                    >
                      {SelectColorBG}
                    </summary>
                    <ul>
                      <li
                        onClick={() => handleBGColors("Tomato")}
                        style={{ backgroundColor: ColorBG.Tomato }}
                      >
                        <a>Tomato</a>
                      </li>
                      <li
                        onClick={() => handleBGColors("Sage")}
                        style={{ backgroundColor: ColorBG.Sage }}
                      >
                        <a>Sage</a>
                      </li>
                      <li
                        onClick={() => handleBGColors("Basil")}
                        style={{ backgroundColor: ColorBG.Basil }}
                      >
                        <a>Basil</a>
                      </li>
                      <li
                        onClick={() => handleBGColors("Banana")}
                        style={{ backgroundColor: ColorBG.Banana }}
                      >
                        <a>Banana</a>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
              {Formik.errors.colorbg && Formik.touched.colorbg ? (
                <div
                  className=" text-sm text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  {Formik.errors.colorbg}
                </div>
              ) : null}
              <button type="submit" className="btn btn-ghost bg-green-600">
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
                    <span className="pl-2 items-center text-center">
                      Loading...
                    </span>
                  </div>
                ) : UpdateMode === -1 ? (
                  "Add Task"
                ) : (
                  "Update Task"
                )}
              </button>
              {Error !== "" ? (
                <div
                  className=" text-sm text-red-800 rounded-lg  dark:bg-gray-800 dark:text-red-400"
                  role="alert"
                >
                  {Error}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
