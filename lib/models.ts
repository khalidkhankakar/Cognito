'use server';
import { cookies } from 'next/headers'
import { MODELS } from './constant';



 export const getModelCookie = async (): Promise<string> => {
    const cookieStore = await cookies()

    const model = cookieStore.get('model')

    if (model) {
      return model.value
    }
    return MODELS[0].id
  }

  // set the cookie to keep the model state
  export const setModelCookie = async (model: string) => {
    const cookieStore = await cookies()
    cookieStore.set('model', model)
    
  }
