import React from "react";
import Navbar from "./navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
};

export default Layout;
