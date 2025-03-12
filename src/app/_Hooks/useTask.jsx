"use client";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React, { useContext } from "react";
import { UserContext } from "../_Context/UserContext";

export default function useTask() {
  const { headers } = useContext(UserContext);
  async function GetAllTasks() {
    return await axios.get("https://todolist-two-lac.vercel.app/tasks", {
      headers,
    });
  }
  const ResObj = useQuery({ queryKey: ["AllTasks"], queryFn: GetAllTasks });
  return ResObj;
}
