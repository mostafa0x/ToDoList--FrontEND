"use client";
import React, { useContext, useState } from "react";
import { UserContext } from "../_Context/UserContext";
import { EditorContext } from "../_Context/EditorContext";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function Navbar() {
  const { UserToken, setUserToken } = useContext(UserContext);
  const { EditorMode, setEditorMode, UpdateMode, setUpdateMode, setMyTasks } =
    useContext(EditorContext);
  const [MenuIsOpen, setMenuIsOpen] = useState(false);
  const Router = useRouter();
  const Query = useQueryClient();

  function handleMenu() {
    setMenuIsOpen(true);
    setTimeout(() => {
      setMenuIsOpen(false);
    }, 500);
  }
  function LogOut() {
    Query.clear();
    setMenuIsOpen(true);
    setTimeout(() => {
      setMenuIsOpen(false);
    }, 500);
    localStorage.removeItem("UserToken");
    setUserToken(null);
    setMyTasks([]);
    toast.success("Logout -Ok");
    Router.replace("/Login");
  }

  function ChangeMode() {
    if (EditorMode === false) {
      setEditorMode(true);
    } else {
      setEditorMode(false);
      setUpdateMode(-1);
    }
  }

  return (
    <div className="navbar bg-base-100 shadow-sm top-0 fixed z-[1]">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">Task app</a>
      </div>
      <div className="flex gap-2 mx-5">
        {UserToken == null ? null : (
          <i
            onClick={() => ChangeMode()}
            className={
              EditorMode == true
                ? "fa-solid fa-list-check btn btn-ghost text-center items-center text-4xl"
                : "fa-solid fa-pen-fancy btn btn-ghost text-center items-center text-4xl"
            }
          ></i>
        )}
        <div className="dropdown dropdown-end">
          <div
            tabIndex={0}
            role="button"
            className="btn btn-ghost btn-circle avatar"
          >
            <div className="w-10 rounded-full">
              <i className="fa-solid fa-user text-4xl"></i>
            </div>
          </div>
          {!MenuIsOpen ? (
            <ul
              tabIndex={0}
              className=" menu menu-sm dropdown-content bg-amber-200 rounded-box z-1 mt-3 w-52 p-2 shadow "
            >
              {UserToken !== null ? (
                <li>
                  {" "}
                  <i onClick={() => LogOut()} className="textmenu">
                    Logout
                  </i>
                </li>
              ) : (
                <>
                  <Link onClick={() => handleMenu()} href={"/Login"}>
                    {" "}
                    <li>
                      {" "}
                      <i className="textmenu">Login </i>
                    </li>
                  </Link>
                  <Link onClick={() => handleMenu()} href={"/Signin"}>
                    <li>
                      <i className="textmenu">Sign in</i>
                    </li>
                  </Link>
                </>
              )}
            </ul>
          ) : null}
        </div>
      </div>
    </div>
  );
}
