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
  const menuEnter = {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.15, ease: "easeOut" },
  };
  const menuLeave = {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.1, ease: "easeIn" },
  };

  return (
    <nav className="flex flex-wrap items-center justify-between bg-[#111] p-4 border-b border-gray-900 sticky top-0 z-50">
      <div className="flex items-center gap-4 flex-shrink-0">
        <motion.button
          onClick={() => router.push("/dashboard")}
          aria-label="Home"
          className="text-white hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
          whileHover={buttonHover}
          whileTap={buttonTap}
          transition={{ type: "spring", stiffness: 250, damping: 20 }}
        >
          <Home size={24} />
        </motion.button>
        <h1
          className="text-2xl font-extrabold select-none tracking-tight text-neutral-400 cursor-pointer truncate max-w-xs"
          onClick={() => router.push("/dashboard")}
          tabIndex={0}
          onKeyDown={(e) => e.key === "Enter" && router.push("/dashboard")}
        >
          ContraAI
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        {/* Modes Dropdown */}
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button
            as={motion.button}
            whileHover={buttonHover}
            whileTap={buttonTap}
            className="inline-flex justify-center items-center rounded-md bg-[#222] px-3 py-2 text-sm font-medium text-white hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-none"
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
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-[#1a1a1a] border border-gray-800 shadow-xl ring-1 ring-black ring-opacity-20 focus:outline-none z-50">
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
                          active ? "bg-blue-700 text-white" : "text-gray-300"
                        } group flex w-full items-center px-4 py-2 text-sm font-medium cursor-pointer select-none transition-colors duration-150`}
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
            className="inline-flex justify-center items-center rounded-md bg-[#222] px-3 py-2 text-sm font-medium text-white hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer select-none"
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
            <Menu.Items className="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-[#1a1a1a] border border-gray-800 shadow-xl ring-1 ring-black ring-opacity-20 focus:outline-none z-50">
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
                          active ? "bg-blue-700 text-white" : "text-gray-300"
                        } group flex w-full items-center px-4 py-2 text-sm font-medium cursor-pointer select-none transition-colors duration-150`}
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

        <motion.button
          onClick={handleLogout}
          aria-label="Logout"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="flex items-center gap-2 px-3 py-2 border border-red-700 rounded-md text-red-500 hover:bg-red-700 hover:text-white transition cursor-pointer select-none"
        >
          <LogOut size={18} />
          Logout
        </motion.button>
      </div>
    </nav>
  );
}
