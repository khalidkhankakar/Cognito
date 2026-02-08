import { type UIMessage, } from 'ai'
import { MarkdownRenderer } from '../markdown/markdown-renderer'

interface ChatMessagesProps {
    messages: UIMessage[]
}


export const ChatMessages = ({ messages }: ChatMessagesProps) => {
    return (
        <div className="flex flex-col gap-4">
            {messages.map(message => (
                <div key={message.id}>
                    {message.role === 'user' ? 'User: ' : 'AI: '}
                    {message.parts.map((part, index) =>
                        part.type === 'text' ?  <MarkdownRenderer key={index} content={part.text} /> : null,
                    )}
                </div>
            ))}
        </div>
    )
}