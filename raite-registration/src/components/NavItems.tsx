"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavItems() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About Us", href: "/about" },
    { name: "Competitions", href: "/competitions" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="hidden md:flex items-center gap-8">
      {navLinks.map((link) => {
        const isActive = pathname === link.href;
        return (
          <Link 
            key={link.name} 
            href={link.href} 
            className={`text-xs font-bold uppercase tracking-widest transition-colors ${
              isActive 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
            }`}
          >
            {link.name}
          </Link>
        );
      })}
    </div>
  );
}
