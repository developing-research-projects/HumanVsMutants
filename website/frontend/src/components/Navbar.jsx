// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
import Logo from '../assets/Logo.png'

const Navbar = () => {
  // const navigate = useNavigate();

  return (
    <div className="flex flex-row static">
      <header className="absolute inset-x-0 top-0 z-50 bg-gradient-to-r from-gray-900 to-gray-950">
        <nav
          className="flex items-center justify-between p-2 mb-1 lg:px-8 h-20"
          aria-label="Global"
        >
          <div className="flex lg:flex-1">
                <img src={Logo} alt="Logo" className=" h-14 lg:h-16 min-w-28 rounded-md m-2 p-2 bg-white" />
          </div>

          <div className="justify-end z-10">
            <a
              href="#help"
              target="_blank"
              rel="noopener noreferrer"
              className="text-lg md:text-md font-bold font-sans leading-6 text-gray-800 bg-white rounded-lg px-4 py-3 focus:bg-gray-200"
              style={{
                boxShadow: "0 0 5px rgba(108, 103, 249, 0.88)",
              }}
            >
              Help
            </a>
          </div>
          
        </nav>
      </header>
    </div>
  );
};

export default Navbar;
