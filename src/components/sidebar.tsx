"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  PlusIcon,
  BookOpenIcon,
  UserPlusIcon,
  XMarkIcon,
  Bars3Icon,
  HomeIcon,
} from "@heroicons/react/24/outline";

export default function SidebarAdmin() {
  const [expanded, setExpanded] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function handleResize() {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setMobileMenuOpen(false);
      }
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    {
      href: "/admin",
      icon: <HomeIcon className="w-6 h-6 text-gray-700" />,
      label: "Home",
    },
    {
      href: "/admin/books/add",
      icon: <PlusIcon className="w-6 h-6 text-gray-700" />,
      label: "Tambah Buku",
    },
    {
      href: "/admin/categories",
      icon: <BookOpenIcon className="w-6 h-6 text-gray-700" />,
      label: "Tambah Kategori",
    },
    {
      href: "/admin/authors",
      icon: <UserPlusIcon className="w-6 h-6 text-gray-700" />,
      label: "Tambah Author",
    },
  ];

  // Sidebar desktop
  const sidebarContent = (
    <aside
      className={`bg-gray-100 text-gray-800 h-screen-full border-r border-gray-200 flex flex-col transition-all duration-300 ${
        expanded ? "w-48" : "w-16"
      } min-w-[64px]`}
      style={{ paddingTop: "80px" }} // jarak atas supaya tidak tertutup header fixed
    >
      {/* Header sidebar dengan tombol toggle */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 fixed top-0 left-0 right-0 bg-gray-100 z-40">
        <button
          onClick={() => setExpanded((prev) => !prev)}
          className="focus:outline-none"
          aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
          disabled={isMobile} // disable toggle di mobile, karena mobile pakai overlay
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
      </div>

      <nav className="flex-1 space-y-2 mt-4 overflow-auto">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center px-4 py-3 hover:bg-gray-100 transition-colors"
          >
            {item.icon}
            {expanded && !isMobile && (
              <span className="ml-3 text-sm font-medium text-gray-700">
                {item.label}
              </span>
            )}
          </Link>
        ))}
      </nav>
    </aside>
  );

  return (
    <>
      {/* Mobile Hamburger */}
      {isMobile && (
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="fixed top-20 left-4 z-50 p-2 bg-gray-100 rounded-md shadow-md focus:outline-none"
          aria-label="Open sidebar menu"
        >
          <Bars3Icon className="w-6 h-6 text-gray-700" />
        </button>
      )}

      {/* Desktop sidebar */}
      {!isMobile && sidebarContent}

      {/* Mobile sidebar overlay */}
      {isMobile && mobileMenuOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-transparent bg-opacity-40 z-40"
            onClick={() => setMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar panel */}
          <aside
            className="fixed left-0 z-50 w-48 bg-gray-100 border-r border-gray-200 flex flex-col shadow-lg overflow-auto"
            style={{ top: "80px", bottom: 0 }} // top disesuaikan header tinggi 80px
          >
            <div className="flex items-center justify-between h-16 border-b border-gray-200 px-4">
              <span className="text-gray-700 font-semibold">Menu</span>
              <button
                onClick={() => setMobileMenuOpen(false)}
                className="focus:outline-none"
                aria-label="Close sidebar menu"
              >
                <XMarkIcon className="w-6 h-6 text-gray-700" />
              </button>
            </div>

            <nav className="flex-1 space-y-2 mt-4">
              {menuItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center px-4 py-3 hover:bg-gray-200 transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.icon}
                  <span className="ml-3 text-sm font-medium text-gray-700">
                    {item.label}
                  </span>
                </Link>
              ))}
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
