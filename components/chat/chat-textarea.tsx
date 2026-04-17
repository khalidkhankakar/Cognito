'use client'

import React, { useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import {
  ArrowUp,
  File,
  FilesIcon,
  Pause,
  X,
} from 'lucide-react'
import { ModelSwitcher } from '@/components/team-switcher'
import { type FileUIPart, type ChatStatus } from 'ai'
import { Input } from '../ui/input'
import Image from 'next/image'
import { convertFilesToDataURLs } from '@/lib/utils'



interface ChatTextareaProps {
  status: ChatStatus
  sendMessage: (message?: { text: string; files?: FileList | FileUIPart[]; messageId?: string }) => Promise<void>
}

export const ChatTextarea = ({ sendMessage, status }: ChatTextareaProps) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const [value, setValue] = useState('')
  const [files, setFiles] = useState<File[] | null>(null)
  const inputRef = useRef<HTMLInputElement | null>(null)

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value)

    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height =
        Math.min(textareaRef.current.scrollHeight, 200) + 'px'
    }
  }

  const filePreviews = React.useMemo(() => {
    if (!files) return [];
    return files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
    }));
  }, [files]);

  // Clean up object URLs when previews change or component unmounts
  React.useEffect(() => {
    return () => {
      filePreviews.forEach((preview) => URL.revokeObjectURL(preview.url));
    };
  }, [filePreviews]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const trimmedValue = value.trim();
    if (!trimmedValue && (!files || files.length === 0)) return;

    if (files && files.length > 0) {
      const dataURLs = await convertFilesToDataURLs(files);
      await sendMessage({
        parts: [
          ...(trimmedValue ? [{ type: 'text' as const, text: trimmedValue }] : []),
          ...dataURLs,
        ],
      });
    } else if (trimmedValue) {
      await sendMessage({ text: trimmedValue });
    }

    setValue('');
    setFiles(null);
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  function handleSelectFiles() {
    if (inputRef.current) {
      inputRef.current.click()
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setFiles(Array.from(e.target.files))
    }
  }

  function removeFile(file: File) {
    if (files) {
      const newFiles = files.filter((f) => f.name !== file.name)
      setFiles(newFiles.length > 0 ? newFiles : null)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-2 border-2 shadow-[0_0_40px_rgba(0,0,0,0.1)] p-2 flex-1 max-w-3xl rounded-2xl">
      <div className='flex gap-1.5 flex-wrap'>
        {/* files all  */}
        {filePreviews.length > 0 && filePreviews.map((preview, index) => (
          <div key={index} className="flex justify-center size-12 group relative bg-primary  rounded-lg gap-1.5 items-center">
            {/* show cross icon to remove */}
            <div onClick={() => removeFile(preview.file)} className='top-1 right-1 opacity-0 group-hover:opacity-100 absolute rounded-2xl bg-white/80 z-10'>
              <X className=" size-4  cursor-pointer " />
            </div>

            {preview.file.type.startsWith('image/') ? (
              <Image src={preview.url} alt={preview.file.name} className="size-full  rounded-lg object-cover" width={50} height={50} />
            ) : (

              <File className=" text-gray-200 rounded-lg" />
            )}
          </div>
        ))}

      </div>
      <Textarea
        ref={textareaRef}
        value={value}
        onChange={handleInput}
        placeholder="How can I help you today?"
        className="
          resize-none
          overflow-y-auto
          max-h-50
          min-h-12
          md:text-lg
          border-none
          shadow-none
          focus-visible:ring-0
        "
        disabled={status !== 'ready'}
      />

      <div className="flex justify-between">
        <Button onClick={handleSelectFiles} type='button' variant="secondary">
          <FilesIcon />
        </Button>
        <Input ref={inputRef} className='hidden' type="file" multiple onChange={handleFileChange} />

        <div className="flex gap-4">
          <ModelSwitcher />
          <Button disabled={status !== 'ready'} type='submit'>
            {status !== 'ready' ? <Pause /> : <ArrowUp />}
          </Button>
        </div>
      </div>
    </form>
  )
}
