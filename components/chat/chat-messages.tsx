import { MarkdownRenderer } from '../markdown/markdown-renderer'
import { MyUIMessage } from '@/app/api/chat/route'
import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'

interface ChatMessagesProps {
    messages: MyUIMessage[]
}

// part.type === 'text' ?  <MarkdownRenderer key={index} content={part.text} /> : null,

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
    return (
        <div className="flex flex-col gap-4">
            {messages.map(message => (
                <div key={message.id}>
                    {message.role === 'user' ? 'User: ' : 'AI: '}
                    {message.parts.map((part, index) =>{

                        switch(part.type){
                            case 'text':
                                return <MarkdownRenderer key={index} content={part.text} />
                            case 'tool-weather':
                                return <Card >
                                        <CardHeader>The weather of {part.input?.location}</CardHeader>
                                        <CardContent>
                                            <pre>{part.output}</pre>
                                        </CardContent>
                                        <CardFooter>
                                            {part.state}, {part.type}
                                        </CardFooter>
                                    </Card>
                        }

                    })}
                </div>
            ))}
        </div>
    )
}