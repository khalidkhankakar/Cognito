"use client"
import { ChatMessages } from './chat-messages'
import { ChatEmptyState } from './chat-empty-state'
import { useChat } from '@ai-sdk/react'
import { ChatTextarea } from './chat-textarea'

export const ChatPage = () => {
    const { messages, sendMessage, status } = useChat();

    const isEmpty = messages.length <= 0
    console.log(isEmpty, messages.length)

    return (
        <div className="h-full w-full flex items-center justify-center">
            {isEmpty ?
                <ChatEmptyState sendMessage={sendMessage} status={status} /> :

                <div className="h-full w-full  flex flex-col items-center max-w-3xl mx-auto">
                    {/* Messages Container - Scrollable */}
                    <div className="flex-1 hide-scrollbar w-full overflow-y-auto px-4 py-6">
                            {/* loop of user and model messages */}
                            <ChatMessages messages={messages} />
                    </div>

                    {/* Input Area - Sticky at Bottom */}
                    <div className="sticky bottom-0 w-full bg-linear-to-t from-white via-white to-transparent pt-6 pb-4 px-4">
                        <ChatTextarea sendMessage={sendMessage} status={status} />
                    </div>
                </div>


            }
        </div>
    )
}


