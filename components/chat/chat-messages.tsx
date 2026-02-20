'use client';
import { MarkdownRenderer } from '../markdown/markdown-renderer'
import { MyUIMessage } from '@/app/api/chat/route'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Spinner } from '../ui/spinner'
import { AlertCircle, CheckCircle2, Clock, ChevronDown } from 'lucide-react'
import { useState } from 'react'

interface ChatMessagesProps {
    messages: MyUIMessage[]
}

const getStateConfig = (state: string) => {
    switch (state) {
        case 'input-streaming':
            return {
                label: 'Preparing',
                icon: Clock,
                color: 'bg-blue-500',
                badge: 'bg-blue-100 text-blue-800',
                variant: 'outline'
            };
        case 'input-available':
            return {
                label: 'Pending',
                icon: Clock,
                color: 'bg-yellow-500',
                badge: 'bg-yellow-100 text-yellow-800',
                variant: 'outline'
            };
        case 'output-available':
            return {
                label: 'Completed',
                icon: CheckCircle2,
                color: 'bg-green-500',
                badge: 'bg-green-100 text-green-800',
                variant: 'default'
            };
        case 'output-error':
            return {
                label: 'Error',
                icon: AlertCircle,
                color: 'bg-red-500',
                badge: 'bg-red-100 text-red-800',
                variant: 'destructive'
            };
        default:
            return {
                label: 'Unknown',
                icon: Clock,
                color: 'bg-gray-500',
                badge: 'bg-gray-100 text-gray-800',
                variant: 'outline'
            };
    }
};

const renderToolCard = (part: any, index: number) => {
    return <ToolCard part={part} index={index} />
};

interface ToolCardProps {
    part: any;
    index: number;
}

const ToolCard = ({ part, index }: ToolCardProps) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const stateConfig = getStateConfig(part.state);
    const IconComponent = stateConfig.icon;
    const toolName = part.type.replace('tool-', '');

    return (
        <Card key={index} className="w-full border-l-4 border-l-blue-500 cursor-pointer hover:shadow-md transition-shadow">
            <CardHeader 
                className="pb-3"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 flex-1">
                        <div className="flex items-center gap-2">
                            {part.state === 'input-streaming' || part.state === 'input-available' ? (
                                <Spinner className="h-5 w-5" />
                            ) : (
                                <IconComponent className={`h-5 w-5 ${part.state === 'output-error' ? 'text-red-500' : 'text-green-500'}`} />
                            )}
                        </div>
                        <div>
                            <CardTitle className="text-sm font-semibold capitalize">
                                {toolName}
                            </CardTitle>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Badge className={stateConfig.badge}>
                            {stateConfig.label}
                        </Badge>
                        <ChevronDown 
                            className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                        />
                    </div>
                </div>
            </CardHeader>

            {isExpanded && (
                <CardContent className="space-y-4">
                    {/* Input Section */}
                    {part.input && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Input</h4>
                            <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-3 border border-gray-200 dark:border-gray-700">
                                <pre className="text-xs overflow-x-auto">
                                    <code>{JSON.stringify(part.input, null, 2)}</code>
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Output Section */}
                    {part.state === 'output-available' && part.output && (
                        <div>
                            <h4 className="text-xs font-semibold text-gray-600 mb-2 uppercase">Output</h4>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-3 border border-green-200 dark:border-green-700/30">
                                <pre className="text-xs overflow-x-auto text-green-900 dark:text-green-100">
                                    <code>{JSON.stringify(part.output, null, 2)}</code>
                                </pre>
                            </div>
                        </div>
                    )}

                    {/* Error Section */}
                    {part.state === 'output-error' && part.errorText && (
                        <div>
                            <h4 className="text-xs font-semibold text-red-600 mb-2 uppercase">Error</h4>
                            <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 border border-red-200 dark:border-red-700/30">
                                <p className="text-xs text-red-700 dark:text-red-200">{part.errorText}</p>
                            </div>
                        </div>
                    )}
                </CardContent>
            )}
        </Card>
    );
};

export const ChatMessages = ({ messages }: ChatMessagesProps) => {
    return (
        <div className="flex flex-col gap-4">
            {messages.map(message => (
                <div key={message.id}>
                    {message.role === 'user' ? (
                        <div className="text-sm font-medium text-gray-600 mb-2">👤 User</div>
                    ) : (
                        <div className="text-sm font-medium text-gray-600 mb-2">🤖 AI</div>
                    )}
                    <div className="flex flex-col gap-3">
                        {message.parts.map((part, index) => {
                            switch (part.type) {
                                case 'text':
                                    return <MarkdownRenderer key={index} content={part.text} />
                                case 'tool-weather':
                                    return renderToolCard(part, index);
                                default:
                                    // Handle other tool types dynamically
                                    if (part.type.startsWith('tool-')) {
                                        return renderToolCard(part, index);
                                    }
                                    return null;
                            }
                        })}
                    </div>
                </div>
            ))}
        </div>
    )
}