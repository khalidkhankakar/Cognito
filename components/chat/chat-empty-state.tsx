import React from 'react'
import { ChatTextarea } from './chat-textarea'
import {  Bluetooth, Code, CupSoda, Pencil,  } from "lucide-react";
import { type ChatStatus, type FileUIPart } from 'ai';

interface ChatEmptyStateProps {
    status: ChatStatus
    sendMessage:(message?: { text: string; files?: FileList | FileUIPart[];  messageId?: string }) => Promise<void>
}


export const ChatEmptyState = ({status, sendMessage}: ChatEmptyStateProps) => {
        const data = [
        {
            icon: Code,
            title: "Code"
        },
        {
            icon: Pencil,
            title: "Write"
        },
        {
            icon: CupSoda,
            title: "Life Style"
        },
        {
            icon: Bluetooth,
            title: "Ideas"
        }
    ]
    return (
        <div className="w-full flex flex-col items-center max-w-3xl rounded-2xl gap-6 p-4">
            <h1 className="text-2xl md:text-4xl  font-semibold">Khalid returns!</h1>

                <ChatTextarea sendMessage={sendMessage} status={status} />


            <div className="flex items-center justify-center flex-wrap  gap-3">
                {data.map((item, index) => (
                    <div key={index} className="flex border items-center gap-2 px-3 py-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors cursor-pointer">
                        <item.icon className="w-4 h-4" />
                        <span className="text-sm font-semibold">{item.title}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

