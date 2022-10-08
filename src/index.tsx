import React from "react";
import { createRoot } from "react-dom/client";

import App from "./app/App";
import "./index.css";

const el = document.getElementById("root");
if (el === null) throw new Error("Root container missing in index.html");

const root = createRoot(el);
root.render(<App />);
