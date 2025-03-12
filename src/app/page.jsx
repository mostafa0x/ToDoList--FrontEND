"use client";
import React, { useContext, useEffect, useRef, useState } from "react";
import { EditorContext } from "./_Context/EditorContext";
import Editor from "./_Comopnets/Editor";
import useTask from "./_Hooks/useTask";
import { UserContext } from "./_Context/UserContext";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import axios from "axios";

export default function Home() {
  const {
    EditorMode,
    setEditorMode,
    UpdateMode,
    setUpdateMode,
    MyTasks,
    setMyTasks,
    TV,
    setTV,
  } = useContext(EditorContext);
  const { setUserToken, headers } = useContext(UserContext);
  const { data, isLoading, error, isError, refetch } = useTask();
  const Router = useRouter();
  const ColorBG = {
    Tomato: "#FF6347",
    Sage: "#8A9A5B",
    Banana: "#FFFF7E",
    Basil: "#59910F",
  };
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
    console.log(data?.data?.MyTasks);
    if (Array.isArray(data?.data?.MyTasks)) {
      setMyTasks(data?.data?.MyTasks);
    }
  }, [data]);

  useEffect(() => {
    setTV(1);
  }, []);

  async function DeleteTask(TaskId) {
    if (TV === 1) {
      setTV(0);
      const toastLoadingID = toast.loading("Waiting...");
      const TaskWillDeleted = await axios
        .delete(`https://todolist-two-lac.vercel.app/task/${TaskId}`, {
          headers,
        })
        .then((data) => {
          console.log(data);
          toast.remove(toastLoadingID);
          if (data.status == 200) {
            toast.success("Task Deleted");
            refetch();
            setTV(1);
          }
        })
        .catch((err) => {
          toast.remove(toastLoadingID);
          console.log(err);
          toast.error(err?.response?.data.message);
          setTV(1);
        });
    } else {
      toast.error("Waiting your Order is Loading !");
    }
  }

  async function ChangeUpdateMode(TaskId, TaskIndex) {
    console.log(MyTasks[TaskIndex]);
    setUpdateMode(TaskIndex);
    setEditorMode(true);
  }

  if (EditorMode === true) {
    return <Editor />;
  }
  if (isLoading) {
    return (
      <div className=" flex justify-center p-52 " role="status">
        <svg
          aria-hidden="true"
          className="w-28 h-28 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
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
        <span className="sr-only">Loading...</span>
      </div>
    );
  }

  if (isError) {
    console.log(error);

    return (
      <div className=" text-4xl flex justify-center p-52">
        {error.response.data.message}
      </div>
    );
  }
  return (
    <div className="mt-9 relative ">
      <div className="pl-48 pt-10 absolute  flex  justify-center w-300 flex-col ">
        <h1 className="p-4 pb-2 text-lg opacity-60 tracking-wide ">My Tasks</h1>
        {MyTasks.length > 0 ? (
          <ul className="list  rounded-box shadow-md gap-3">
            {MyTasks.map((task, index) => {
              return (
                <li
                  key={index}
                  className="list-row "
                  style={{ backgroundColor: ColorBG[task.colorbg] }}
                >
                  <div>
                    <h1 className=" text-4xl">{index + 1}</h1>
                  </div>
                  <div>
                    <div className=" font-semibold text-3xl">{task.title}</div>
                  </div>
                  <p className="list-col-wrap text-xs">{task.info}</p>
                  <button
                    onClick={() => ChangeUpdateMode(task._id, index)}
                    className="btn btn-square btn-ghost"
                  >
                    <i className="fa-solid fa-pen"></i>
                  </button>

                  <button
                    onClick={() => DeleteTask(task._id)}
                    className="btn btn-square btn-ghost"
                  >
                    <i className="fa-solid fa-trash text-center"></i>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="pl-5 pt-5 ">
            <h1 className=" opacity-40">Empty </h1>
          </div>
        )}
      </div>
    </div>
  );
}
