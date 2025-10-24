'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Sparkles } from 'lucide-react';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-white font-bold text-xl">
            <Sparkles className="w-6 h-6 text-yellow-400" />
            MarketForge
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4">
            <Link
              href="/pricing"
              className="text-white hover:text-purple-200 font-medium transition-colors"
            >
              Preços
            </Link>
            <Link
              href="/auth/login"
              className="text-white/90 hover:text-white font-medium px-4 py-2 rounded-lg hover:bg-white/10 transition-all"
            >
              Entrar
            </Link>
            <Link
              href="/auth/signup"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg"
            >
              Criar Conta
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-white/10">
            <div className="flex flex-col gap-3">
              <Link
                href="/pricing"
                className="text-white hover:text-purple-200 font-medium px-4 py-3 text-center transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                Preços
              </Link>
              <Link
                href="/auth/login"
                className="text-white/90 hover:text-white font-medium px-4 py-3 rounded-lg hover:bg-white/10 transition-all text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Entrar
              </Link>
              <Link
                href="/auth/signup"
                className="bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg text-center"
                onClick={() => setMobileMenuOpen(false)}
              >
                Criar Conta
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}