"use client";
import React, { useState } from "react";
import { NavbarProps } from "../../../type/type";
import { usePathname } from "next/navigation";
import Image from "next/image";
import icons from "../../../constant/icons";
import { LogOut, Menu, X } from "lucide-react";
import Link from "next/link";
import { allUserRoute, dashboardRoute, documentRoute, homeRoute, loginRoute } from "../../../constant/router";
import { ALL_USER, DASHBOARD, DOCUMENT, PROJECT } from "../../../constant/string";

const navLinks = [
  { label: PROJECT, href: homeRoute },
  { label: DASHBOARD, href: dashboardRoute },
  { label: DOCUMENT, href: documentRoute },
  { label: ALL_USER, href: allUserRoute },
];

const Layout = ({ children }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div>
      {/* Navbar Container */}
      <div className="flex items-center justify-between bg-blue-400 px-6 py-3 w-full">
        {/* Logo */}
        <Image
          src={icons.myadc_logo}
          className="w-[60px] h-[60px] object-contain md:w-[80px] md:h-[80px] invisible"
          alt="myadc_logo"
        />

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-x-10 items-center text-xl">
          {navLinks.map(({ label, href }) => (
            <NavLink key={href} href={href}>
              {label}
            </NavLink>
          ))}
          <NavLink href={loginRoute}>
            <LogOut />
          </NavLink>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu (Dropdown) */}
      {menuOpen && (
        <div className="md:hidden flex flex-col bg-white p-4 space-y-4 text-xl">
          {navLinks.map(({ label, href }) => (
            <NavLink key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </NavLink>
          ))}
          <NavLink href={loginRoute} onClick={() => setMenuOpen(false)}>
            <LogOut />
          </NavLink>
        </div>
      )}

      {children}
    </div>
  );
};

const NavLink = ({
  href,
  children,
  onClick,
}: {
  href: string;
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  const pathName = usePathname();
  const isActive = pathName === href || pathName.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`text-md px-5 py-2 rounded-lg transition duration-300 text-xl ${isActive
          ? "font-rubik-bold bg-gradient-to-r from-gray-50 to-gray-100 shadow-md text-blue-900"
          : "text-gray-700 hover:text-gray-900"
        }`}
    >
      {children}
    </Link>
  );
};

export default Layout;
