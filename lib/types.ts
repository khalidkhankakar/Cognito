import { UIMessage, } from 'ai';
import {  MyUITools } from './tools';

export type MyUIMessage = UIMessage<
    never,
    never,
    MyUITools
>;
