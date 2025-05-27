import React from "react";
import { useLanguageSelector } from "./hooks/useLanguageSelector";

export default function App() {
  useLanguageSelector();
  return <div>Hello from Git-it Renderer!<br /><select id="lang-select"><option value="en-US">English</option></select></div>;
}