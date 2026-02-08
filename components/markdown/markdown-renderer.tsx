import React, { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeRaw from 'rehype-raw';
import { CodeBlock } from './code-block';
import { AlertTriangle, Info, Lightbulb, CheckCircle2, AlertOctagon, Link2 } from 'lucide-react';
import type { Components } from 'react-markdown';
import { MarkdownRendererProps } from './types';

// Detect YouTube URLs for embedding
const getYoutubeId = (url: string) => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
};

// Custom Callout / Admonition Component logic
const getCalloutStyles = (text: string) => {
  const lower = text.toLowerCase();
  if (lower.includes('warning') || lower.includes('caution')) {
    return {
      classes: 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 mt-0.5 flex-shrink-0" />,
      title: 'Warning'
    };
  }
  if (lower.includes('note') || lower.includes('info')) {
    return {
      classes: 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200',
      icon: <Info className="w-5 h-5 text-blue-600 dark:text-blue-500 mt-0.5 flex-shrink-0" />,
      title: 'Note'
    };
  }
  if (lower.includes('tip') || lower.includes('success')) {
    return {
      classes: 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-200',
      icon: <Lightbulb className="w-5 h-5 text-green-600 dark:text-green-500 mt-0.5 flex-shrink-0" />,
      title: 'Tip'
    };
  }
  if (lower.includes('danger') || lower.includes('error')) {
    return {
      classes: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950/30 dark:border-red-800 dark:text-red-200',
      icon: <AlertOctagon className="w-5 h-5 text-red-600 dark:text-red-500 mt-0.5 flex-shrink-0" />,
      title: 'Danger'
    };
  }
  
  // Default Generic Blockquote (handled separately if no match)
  return null;
};

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = '', isDarkMode = false }) => {
  
  // Custom Renderers for ReactMarkdown
  const components: Components = useMemo(() => ({
    // 1. Code Blocks & Inline Code
    code: ({ node, inline, className, children, ...props }: any) => {
      const match = /language-(\w+)/.exec(className || '');
      const codeString = String(children).replace(/\n$/, '');
      
      if (!inline && match) {
        return (
          <CodeBlock language={match[1]} className="not-prose" isDarkMode={isDarkMode}>
            {codeString}
          </CodeBlock>
        );
      }
      
      // Fallback for code blocks without language specified
      if (!inline) {
         return (
          <CodeBlock language="text" className="not-prose" isDarkMode={isDarkMode}>
            {codeString}
          </CodeBlock>
         );
      }

      // Inline code
      return (
        <code className="px-1.5 py-0.5 rounded-md bg-slate-100 text-pink-600 dark:bg-slate-800 dark:text-pink-400 font-mono text-[0.9em] border border-slate-200 dark:border-slate-700" {...props}>
          {children}
        </code>
      );
    },

    // 2. Headings with Anchors
    h1: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return <h1 id={id} className="scroll-mt-20 text-3xl font-bold tracking-tight mb-6 mt-10 pb-2 border-b border-slate-200 dark:border-slate-700 dark:text-slate-100" {...props}>{children}</h1>;
    },
    h2: ({ children, ...props }) => {
      const id = String(children).toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
      return <h2 id={id} className="scroll-mt-20 text-2xl font-semibold tracking-tight mb-4 mt-8 dark:text-slate-100" {...props}>{children}</h2>;
    },
    h3: ({ children, ...props }) => <h3 className="text-xl font-semibold mb-3 mt-6 dark:text-slate-200" {...props}>{children}</h3>,
    h4: ({ children, ...props }) => <h4 className="text-lg font-semibold mb-2 mt-4 dark:text-slate-200" {...props}>{children}</h4>,
    p: ({ children, ...props }) => <div className="mb-4 leading-7 text-slate-700 dark:text-slate-300" {...props}>{children}</div>,
    
    // 3. Links & YouTube Embeds
    a: ({ href, children, ...props }) => {
      if (!href) return <span>{children}</span>;

      // Check for YouTube
      const youtubeId = getYoutubeId(href);
      if (youtubeId && href === children) { 
        return (
          <div className="my-6 relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-slate-200 dark:border-slate-700">
            <iframe
              src={`https://www.youtube.com/embed/${youtubeId}`}
              title="YouTube video player"
              className="absolute top-0 left-0 w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }

      return (
        <a 
          href={href} 
          target={href.startsWith('http') ? '_blank' : undefined} 
          rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
          className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 underline decoration-blue-300 dark:decoration-blue-500/50 underline-offset-2 transition-colors font-medium inline-flex items-center gap-0.5"
          {...props}
        >
          {children}
          {href.startsWith('http') && <Link2 className="w-3 h-3 opacity-50" />}
        </a>
      );
    },

    // 4. Blockquotes & Callouts
    blockquote: ({ children, ...props }) => {
      let contentText = '';
      React.Children.forEach(children, (child) => {
        if (typeof child === 'string') contentText += child;
        if (React.isValidElement(child)) {
             // Safe cast to access props.children
             const props = child.props as { children?: React.ReactNode };
             if (props.children) {
                 if (Array.isArray(props.children)) {
                     props.children.forEach((c: any) => {
                        if (typeof c === 'string') contentText += c;
                     });
                 } else if (typeof props.children === 'string') {
                     contentText += props.children;
                 }
             }
        }
      });

      const calloutStyle = getCalloutStyles(contentText);

      if (calloutStyle) {
        return (
          <div className={`my-6 p-4 rounded-lg border-l-4 ${calloutStyle.classes} flex items-start gap-3 not-prose shadow-sm`}>
             {calloutStyle.icon}
             <div className="flex-1 text-sm leading-6">
                <strong className="block font-semibold mb-1 opacity-90">{calloutStyle.title}</strong>
                {children}
             </div>
          </div>
        );
      }

      // Default generic blockquote
      return (
        <blockquote className="my-6 pl-4 border-l-4 border-slate-300 dark:border-slate-600 italic text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 py-2 rounded-r-lg" {...props}>
          {children}
        </blockquote>
      );
    },

    // 5. Tables
    table: ({ children, ...props }) => (
      <div className="my-8 w-full overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700" {...props}>
            {children}
          </table>
        </div>
      </div>
    ),
    thead: ({ children, ...props }) => (
      <thead className="bg-slate-50 dark:bg-slate-800/50" {...props}>{children}</thead>
    ),
    th: ({ children, ...props }) => (
      <th className="px-6 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider" {...props}>
        {children}
      </th>
    ),
    tbody: ({ children, ...props }) => (
      <tbody className="bg-white dark:bg-slate-900 divide-y divide-slate-200 dark:divide-slate-700" {...props}>{children}</tbody>
    ),
    tr: ({ children, ...props }) => (
      <tr className="even:bg-slate-50 dark:even:bg-slate-800/30 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors" {...props}>{children}</tr>
    ),
    td: ({ children, ...props }) => (
      <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap" {...props}>{children}</td>
    ),

    // 6. Lists
    ul: ({ children, ...props }) => {
      const isTaskList = Array.isArray(children) && (children[0] as any)?.props?.className === 'task-list-item';
      return <ul className={`my-4 ${isTaskList ? 'list-none pl-0' : 'list-disc pl-6 space-y-2 marker:text-slate-400 dark:marker:text-slate-500 text-slate-700 dark:text-slate-300'}`} {...props}>{children}</ul>;
    },
    ol: ({ children, ...props }) => (
      <ol className="my-4 list-decimal pl-6 space-y-2 marker:text-slate-500 dark:marker:text-slate-400 marker:font-medium text-slate-700 dark:text-slate-300" {...props}>{children}</ol>
    ),
    li: ({ children, className, ...props }) => {
        if (className === 'task-list-item') {
            return (
                <li className="flex items-start gap-3 my-2 text-slate-700 dark:text-slate-300" {...props}>
                    {children}
                </li>
            )
        }
        return <li className={className} {...props}>{children}</li>;
    },
    input: ({ type, checked, ...props }) => {
        if (type === 'checkbox') {
            return (
                <div className={`mt-1 w-4 h-4 rounded border flex items-center justify-center transition-all duration-200 flex-shrink-0 
                  ${checked 
                    ? 'bg-blue-600 border-blue-600 dark:bg-blue-500 dark:border-blue-500' 
                    : 'bg-white border-slate-300 dark:bg-slate-800 dark:border-slate-600'
                  }`}>
                    {checked && <CheckCircle2 className="w-3 h-3 text-white" />}
                </div>
            )
        }
        return <input type={type} {...props} />;
    },

    // 7. Images
    img: ({ src, alt, ...props }) => (
      <span className="block my-8">
        <img 
            src={src} 
            alt={alt} 
            className="rounded-lg shadow-md border border-slate-100 dark:border-slate-800 w-auto max-h-[500px] object-cover mx-auto hover:scale-[1.01] transition-transform duration-300 bg-slate-50 dark:bg-slate-800"
            loading="lazy"
            {...props} 
        />
        {alt && <span className="block text-center text-sm text-slate-500 dark:text-slate-400 mt-2 italic">{alt}</span>}
      </span>
    ),

    // 8. Horizontal Rule
    hr: () => <hr className="my-10 border-t-2 border-slate-100 dark:border-slate-800" />,

  }), [isDarkMode]);

  return (
    <article className={`prose prose-slate dark:prose-invert max-w-none ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkMath]}
        rehypePlugins={[rehypeKatex, rehypeRaw]}
        components={components}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
};