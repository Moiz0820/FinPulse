import React from 'react';

export default function Footer() {
  return (
    <footer className="border-t border-[#dfd6c6] bg-[#ede7dc]/90 py-8 px-4 text-xs font-mono text-stone-600 relative z-20">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="text-stone-900 font-bold mb-1">
            FINPULSE TERMINAL • INSTITUTIONAL EDITION
          </div>
          <p className="text-[11px] text-stone-500">
            Engineered by Moiz Anwar • Foreign exchange intelligence powered by European Central Bank reference feeds via Frankfurter API.
          </p>
        </div>

        <div className="flex items-center gap-4 text-stone-600 font-mono">
          <a
            href="https://github.com/Moiz0820"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-stone-900 transition-colors"
          >
            GitHub: Moiz0820
          </a>
          <span>•</span>
          <a
            href="https://api.frankfurter.dev/v1/latest"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-emerald-800 transition-colors"
          >
            ECB Data Stream
          </a>
        </div>
      </div>
    </footer>
  );
}
