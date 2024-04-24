import React from "react";

const Nav = () => {
  return (
    <nav className="sticky top-0 p-4 w-full border-b-[.5px] border-b-slate-500 flex items-center bg-white opacity-90 backdrop-blur-lg z-10">
      <div className="flex items-center gap-x-2">
        <div className="w-8 h-8 rounded-full bg-slate-500" />
        <h2>SOAC</h2>
      </div>
    </nav>
  );
};

export default Nav;
