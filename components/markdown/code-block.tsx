import React, { useState } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Check, Copy, Terminal } from 'lucide-react';

interface CodeBlockProps {
  language: string;
  children: string;
  className?: string;
  isDarkMode?: boolean;
}

export const CodeBlock: React.FC<CodeBlockProps> = ({ language, children, className, isDarkMode = false }) => {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(children);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  // Clean up the language string (remove "language-" prefix if present)
  const lang = language?.replace('language-', '') || 'text';

  return (
    <div className={`relative group rounded-lg overflow-hidden my-6 border shadow-sm transition-colors duration-200 
      ${isDarkMode 
        ? 'border-slate-700 bg-[#1e1e1e]' 
        : 'border-slate-200 bg-white'
      } ${className}`}>
      
      {/* Header Bar */}
      <div className={`flex items-center justify-between px-4 py-2 border-b transition-colors duration-200 
        ${isDarkMode 
          ? 'bg-[#2d2d2d] border-[#404040]' 
          : 'bg-slate-50 border-slate-200'
        }`}>
        
        <div className="flex items-center gap-2">
          <Terminal className={`w-4 h-4 ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`} />
          <span className={`text-xs font-medium font-mono uppercase ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
            {lang}
          </span>
        </div>
        
        <button
          onClick={handleCopy}
          className={`flex items-center gap-1.5 px-2 py-1 rounded transition-colors duration-200 
            ${isDarkMode 
              ? 'hover:bg-[#404040] text-slate-400 hover:text-white' 
              : 'hover:bg-slate-200 text-slate-500 hover:text-slate-800'
            }`}
          aria-label="Copy code"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs text-green-500 font-medium">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span className="text-xs font-medium">Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Content */}
      <div className="relative custom-scrollbar overflow-x-auto">
        <SyntaxHighlighter
          language={lang}
          style={isDarkMode ? vscDarkPlus : vs}
          customStyle={{
            margin: 0,
            padding: '1.5rem',
            background: 'transparent',
            fontSize: '0.9rem',
            lineHeight: '1.5',
            fontFamily: '"JetBrains Mono", monospace',
          }}
          wrapLongLines={false}
        >
          {children}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};