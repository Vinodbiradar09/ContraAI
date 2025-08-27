"use client";

import React, { Fragment } from "react";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown, LogOut, Home } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";

export default function Navbar() {
  const router = useRouter();

  function handleNavigate(route: string) {
    router.push(route);
  }
  function handleLogout() {
    signOut();
  }

  const buttonHover = { scale: 1.05 };
  const buttonTap = { scale: 0.95 };

  return (
    <nav className="flex flex-wrap items-center justify-between bg-black/90 backdrop-blur-md px-4 py-3 border-b border-gray-800 sticky top-0 z-50">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Home Button */}
        <motion.button
          onClick={() => router.push("/dashboard")}
          aria-label="Home"
          className="text-gray-300 hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md transition"
          whileHover={buttonHover}
          whileTap={buttonTap}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        >
          <Home size={22} />
        </motion.button>

        {/* Logo Text */}
        <h1
          onClick={() => router.push("/dashboard")}
          className="text-xl sm:text-2xl font-extrabold select-none tracking-tight bg-clip-text text-transparent 
                     bg-gradient-to-r from-gray-200 via-white to-gray-400 cursor-pointer"
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard")}
        >
          ContraAI
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 sm:gap-3 md:gap-4 mt-2 sm:mt-0">
        {/* Modes Dropdown */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button
            as={motion.button}
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="inline-flex justify-center items-center rounded-md bg-[#111] px-3 py-2 text-sm font-medium text-gray-200 hover:bg-[#222] hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          >
            Modes
            <ChevronDown className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-black border border-gray-700 shadow-[0_0_15px_rgba(255,255,255,0.08)] focus:outline-none z-50">
              <div className="py-1">
                {[
                  { name: "Humanize", route: "/humanizeclient" },
                  { name: "Refine", route: "/refineclient" },
                  { name: "Concise", route: "/conciseclient" },
                  { name: "Academics", route: "/academicsclient" },
                ].map(({ name, route }) => (
                  <Menu.Item key={name}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => handleNavigate(route)}
                        className={`${
                          active
                            ? "bg-white/10 text-white"
                            : "text-gray-400 hover:text-white"
                        } group flex w-full items-center px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-150`}
                      >
                        {name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Histories Dropdown */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button
            as={motion.button}
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="inline-flex justify-center items-center rounded-md bg-[#111] px-3 py-2 text-sm font-medium text-gray-200 hover:bg-[#222] hover:text-white focus:outline-none focus:ring-2 focus:ring-gray-400 transition"
          >
            Histories
            <ChevronDown className="ml-2 -mr-1 h-5 w-5" aria-hidden="true" />
          </Menu.Button>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-150"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-100"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-black border border-gray-700 shadow-[0_0_15px_rgba(255,255,255,0.08)] focus:outline-none z-50">
              <div className="py-1">
                {[
                  { name: "Humanized History", route: "/humanizedhistory" },
                  { name: "Refined History", route: "/refinedhistory" },
                  { name: "Concise History", route: "/conciseHistory" },
                  { name: "Academics History", route: "/academicshistory" },
                ].map(({ name, route }) => (
                  <Menu.Item key={name}>
                    {({ active }) => (
                      <button
                        type="button"
                        onClick={() => handleNavigate(route)}
                        className={`${
                          active
                            ? "bg-white/10 text-white"
                            : "text-gray-400 hover:text-white"
                        } group flex w-full items-center px-4 py-2 text-sm font-medium cursor-pointer transition-colors duration-150`}
                      >
                        {name}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Transition>
        </Menu>

        {/* Logout */}
        <motion.button
          onClick={handleLogout}
          aria-label="Logout"
          whileHover={{ scale: 1.05, backgroundColor: "#b91c1c", color: "#fff" }}
          whileTap={buttonTap}
          className="flex items-center gap-1.5 px-3 py-2 border border-red-700 rounded-md text-red-500 hover:shadow-[0_0_15px_rgba(255,0,0,0.4)] transition cursor-pointer"
        >
          <LogOut size={18} />
          <span className="hidden sm:inline">Logout</span>
        </motion.button>
      </div>
    </nav>
  );
}
