export interface MarkdownRendererProps {
  content: string;
  className?: string;
  isDarkMode?: boolean;
}

export type CalloutType = 'note' | 'warning' | 'tip' | 'info' | 'danger';

export interface CodeBlockProps {
  language?: string;
  value: string;
  filename?: string;
}