"use client";
import React, { createContext, useState } from "react";

export const EditorContext = createContext({
  EditorMode: false,
  setEditorMode: () => {},
  MyTasks: [],
  TV: 1,
  UpdateMode: -1,
});

export default function EditorContextProvider({ children }) {
  const [EditorMode, setEditorMode] = useState(false);
  const [UpdateMode, setUpdateMode] = useState(-1);
  const [MyTasks, setMyTasks] = useState([]);
  const [TV, setTV] = useState(1);
  return (
    <EditorContext.Provider
      value={{
        EditorMode,
        setEditorMode,
        MyTasks,
        setMyTasks,
        TV,
        setTV,
        UpdateMode,
        setUpdateMode,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}
