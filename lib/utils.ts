import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const convertFilesToDataURLs = async (files: File[]) => {
  const dataURLs: {type:'file', url: string, mediaType: string}[] = []
  for (const file of files) {
    const dataURL = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = (error) => reject(error)
      reader.readAsDataURL(file)
    })
    dataURLs.push({type:'file', url: dataURL, mediaType:file.type})
  }
  return dataURLs
}