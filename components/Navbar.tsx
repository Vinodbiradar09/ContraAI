"use client";

import React, { Fragment } from "react";
import { useRouter } from "next/navigation";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDown, LogOut, Home } from "lucide-react";

export default function Navbar() {
  const router = useRouter();

  function handleNavigate(route: string) {
    router.push(route);
  }
  function handleLogout() {
    // TODO: Add actual logout logic
    router.push("/login");
  }

  return (
    <nav className="flex items-center justify-between bg-[#111] p-4 border-b border-gray-900">
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.push("/dashboard")}
          aria-label="Home"
          className="text-white hover:text-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
        >
          <Home size={24} />
        </button>
        <h1 className="text-2xl font-extrabold select-none tracking-tight text-neutral-400">
          ContraAI
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <Menu as="div" className="relative inline-block text-left">
          <Menu.Button className="inline-flex justify-center items-center rounded-md bg-[#222] px-3 py-2 text-sm font-medium text-white hover:bg-[#333] focus:outline-none focus:ring-2 focus:ring-blue-500">
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
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-[#111] border border-gray-900 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
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
                        onClick={() => handleNavigate(route)}
                        className={`${
                          active ? "bg-blue-600 text-white" : "text-gray-300"
                        } group flex w-full items-center px-4 py-2 text-sm`}
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

        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="flex items-center gap-2 px-3 py-2 border border-red-700 rounded-md text-red-500 hover:bg-red-700 hover:text-white transition"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>
    </nav>
  );
}
