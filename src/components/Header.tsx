"use client";

import { useState, useRef } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { name: "Home", href: "/" },
  {
    name: "Residential",
    href: "/residential",
    dropdown: [
      { name: "Buy", href: "/residential" },
      { name: "Rent", href: "/residential" },
      { name: "For Woman", href: "/residential" },
      { name: "For Bachelor", href: "/residential" },
      { name: "For Family", href: "/residential" },
    ],
  },
  {
    name: "Commercial",
    href: "/commercial",
    dropdown: [
      { name: "Sell", href: "/commercial" },
      { name: "Buy", href: "/commercial" },
      { name: "Rent", href: "/commercial" },
      { name: "Furnished", href: "/commercial" },
      { name: "Non-Furnished", href: "/commercial" },
    ],
  },
  {
    name: "Services",
    href: "/services",
    dropdown: [
      { name: "Truck moving", href: "/book-a-truck" },
      { name: "Legal consultancy", href: "" },
      { name: "Property management", href: "" },
      { name: "Property valuation", href: "" },
      { name: "Real-estate blog", href: "/blog" },
    ],
  },
  { name: "About Us", href: "/about" },
];

const languageOptions = [
  { code: "en", label: "English", flag: "/flags/en.svg" },
  { code: "bn", label: "বাংলা", flag: "/flags/bd.svg" },
];

const Header = () => {
  const pathname = usePathname();
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLang, setShowLang] = useState(false);
  const [selectedLang, setSelectedLang] = useState(languageOptions[0]);
  const hideTimeout = useRef<NodeJS.Timeout | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <nav
        className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8"
        aria-label="Main navigation"
      >
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 text-xl font-medium text-gray-900 hover:text-blue-600 transition-colors"
            >
              <img src="/Logo.svg" alt="Arambo Logo" className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navigation.map((item) => {
              const isActive =
                pathname === item.href || pathname.startsWith(item.href + "/");
              const hasDropdown = item.dropdown && item.dropdown.length > 0;

              return (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => {
                    if (hasDropdown) {
                      if (hideTimeout.current)
                        clearTimeout(hideTimeout.current);
                      setActiveDropdown(item.name);
                    }
                  }}
                  onMouseLeave={() => {
                    if (hasDropdown) {
                      hideTimeout.current = setTimeout(() => {
                        setActiveDropdown(null);
                      }, 200);
                    }
                  }}
                >
                  <Link
                    href={item.href}
                    className={`flex items-center space-x-1 px-4 py-2 text-sm font-medium transition-colors rounded-md ${
                      isActive
                        ? "body-base text-Arambo-Accent"
                        : "body-base text-Arambo-Text"
                    }`}
                  >
                    <span>{item.name}</span>
                  </Link>

                  {hasDropdown && (
                    <div
                      className={`fixed right-0 left-0 top-[80px] w-screen bg-Arambo-White rounded-lg shadow-lg border border-gray-200 py-8 z-50 transition-all duration-500 ease-in-out
                        ${
                          activeDropdown === item.name
                            ? "opacity-100 translate-y-0 pointer-events-auto"
                            : "opacity-0 -translate-y-2 pointer-events-none"
                        }`}
                      onMouseEnter={() => {
                        if (hideTimeout.current)
                          clearTimeout(hideTimeout.current);
                        setActiveDropdown(item.name);
                      }}
                      onMouseLeave={() => {
                        hideTimeout.current = setTimeout(() => {
                          setActiveDropdown(null);
                        }, 200);
                      }}
                    >
                      <div className="max-w-[1200px] mx-auto grid grid-cols-3 gap-8 px-8">
                        <div className="col-span-1 grid grid-rows-4 grid-cols-2 gap-2">
                          {item.dropdown && item.dropdown.length > 0 && (
                            <>
                              <div className="row-span-1 col-span-1 flex items-center body-base text-Arambo-Text">
                                <Link href={item.dropdown[0].href}>
                                  {item.dropdown[0].name}
                                </Link>
                              </div>
                              <div className="row-span-1 col-span-1"></div>
                              <div className="row-span-1 col-span-1 flex items-center body-base text-Arambo-Text">
                                <Link href={item.dropdown[1].href}>
                                  {item.dropdown[1].name}
                                </Link>
                              </div>
                              <div className="row-span-1 col-span-1 flex items-center body-base text-Arambo-Text">
                                <Link href={item.dropdown[2].href}>
                                  {item.dropdown[2].name}
                                </Link>
                              </div>
                              <div className="row-span-1 col-span-1 flex items-center body-base text-Arambo-Text">
                                <Link href={item.dropdown[3].href}>
                                  {item.dropdown[3].name}
                                </Link>
                              </div>
                              <div className="row-span-1 col-span-1 flex items-center body-base text-Arambo-Text">
                                <Link href={item.dropdown[4].href}>
                                  {item.dropdown[4].name}
                                </Link>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="col-span-1"></div>
                        <div className="col-span-1 flex items-center justify-end">
                          <img
                            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=160&fit=crop&crop=center"
                            alt="Placeholder"
                            className="w-80 h-32 object-cover rounded-lg border border-gray-100"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex items-center md:hidden">
            <button
              className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              {mobileOpen ? (
                <X className="w-7 h-7" />
              ) : (
                <Menu className="w-7 h-7" />
              )}
            </button>
          </div>
          <div className="hidden md:flex items-center gap-2">
            {/* Language Dropdown beside List Property */}
            <div className="relative">
              <button
                className="flex items-center px-3 py-2 text-sm font-medium body-base text-Arambo-Text hover:text-Arambo-Accent focus:outline-none bg-white min-w-[120px] justify-center"
                onClick={() => setShowLang((v) => !v)}
                onBlur={() => setTimeout(() => setShowLang(false), 200)}
              >
                <img
                  src={selectedLang.flag}
                  alt={selectedLang.label}
                  className="w-5 h-5 mr-2 rounded-full object-cover"
                />
                <span className="truncate text-center block w-full">
                  {selectedLang.label}
                </span>
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showLang && (
                <div className="absolute right-0 mt-2 w-60 px-6 py-8 bg-white rounded-2xl inline-flex flex-col justify-start items-start gap-6 overflow-hidden shadow-lg z-50">
                  <div className="self-stretch flex flex-col justify-start items-start gap-8">
                    <div className="self-stretch justify-start text-Arambo-Black label-16 leading-relaxed">
                      Select your language
                    </div>
                    <div className="self-stretch pb-3 flex flex-col justify-start items-start gap-6">
                      {languageOptions.map((lang) => (
                        <button
                          key={lang.code}
                          className={`self-stretch p-3 bg-neutral-100 rounded-xl outline-1 outline-offset-[-0.5px] outline-gray-200 inline-flex justify-start items-center gap-2.5 transition-all ${
                            selectedLang.code === lang.code
                              ? "ring-2 ring-blue-800"
                              : ""
                          }`}
                          onClick={() => {
                            setSelectedLang(lang);
                            setShowLang(false);
                          }}
                        >
                          <img
                            className="w-5 h-5 relative rounded-[99px]"
                            src={lang.flag}
                            alt={lang.label}
                          />
                          <div className="flex-1 justify-start text-Arambo-Black label-16">
                            {lang.label}
                          </div>
                          {selectedLang.code === lang.code && (
                            <div className="w-5 h-5 relative overflow-hidden flex items-center justify-center">
                              <div className="w-4 h-4 bg-blue-800 rounded-full" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div className="self-stretch h-0 outline-1 outline-offset-[-0.5px] outline-gray-200" />
                </div>
              )}
            </div>
            <Link href="/list-property">
              <button className="flex items-center justify-center gap-2 w-36 h-12 text-Arambo-White bg-Arambo-Accent text-sm leading-[150%] border-[2px] rounded-[6px] flex-none order-1 grow-0 span-14-1-4">
                List Property
              </button>
            </Link>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`fixed left-0 top-0 w-screen z-50 bg-white shadow-lg transition-transform duration-300 ease-in-out md:hidden ${
            mobileOpen
              ? "translate-y-0"
              : "-translate-y-full pointer-events-none"
          }`}
          style={{ willChange: "transform" }}
        >
          <div className="p-6 flex flex-col gap-4">
            <div className="flex items-center justify-between mb-6">
              <img src="/Logo.svg" alt="Arambo Logo" className="h-8 w-auto" />
              <button
                className="p-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="Close menu"
                onClick={() => setMobileOpen(false)}
              >
                <X className="w-7 h-7" />
              </button>
            </div>
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  onClick={() => setMobileOpen(false)}
                >
                  {item.name}
                </Link>
              );
            })}
            <Link
              href="/list-property"
              className="mt-6"
              onClick={() => setMobileOpen(false)}
            >
              <button className="w-full flex items-center justify-center gap-2 h-12 text-Arambo-White bg-Arambo-Accent text-sm leading-[150%] border-[2px] rounded-[6px]">
                List Property
              </button>
            </Link>
            {/* Language Dropdown for mobile */}
            <div className="relative mt-4">
              <button
                className="flex items-center px-3 py-2 w-full text-sm font-medium body-base text-Arambo-Text hover:text-Arambo-Accent focus:outline-none border border-gray-200 rounded-md bg-white"
                onClick={() => setShowLang((v) => !v)}
                onBlur={() => setTimeout(() => setShowLang(false), 200)}
              >
                <img
                  src={selectedLang.flag}
                  alt={selectedLang.label}
                  className="w-5 h-5 mr-2 rounded-full object-cover"
                />
                {selectedLang.label}
                <svg
                  className="ml-1 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
              {showLang && (
                <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                  {languageOptions.map((lang) => (
                    <button
                      key={lang.code}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        setSelectedLang(lang);
                        setShowLang(false);
                      }}
                    >
                      <img
                        src={lang.flag}
                        alt={lang.label}
                        className="w-5 h-5 mr-2 rounded-full object-cover"
                      />
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
