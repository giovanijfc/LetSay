import { Chat } from '~/models/chat';
import {
  GET_ALL_CHATS_BY_ID_USER,
  GET_ALL_CHATS_BY_ID_USER_FAIL,
  GET_ALL_CHATS_BY_ID_USER_SUCCESS
} from '.';

interface getAllChatsByIdUser {
  type: typeof GET_ALL_CHATS_BY_ID_USER;
}

interface getAllChatsByIdUserSuccess {
  type: typeof GET_ALL_CHATS_BY_ID_USER_SUCCESS;
  chats: Chat[];
}

interface getAllChatsByIdUserFail {
  type: typeof GET_ALL_CHATS_BY_ID_USER_FAIL;
  fail: string;
}

export interface ChatsState {
  getAllChatsByIdUser: {
    success?: Chat[] | [];
    fail?: string | null;
    isLoading?: boolean | false;
  };
}

export type ChatsActionTypes =
  | getAllChatsByIdUser
  | getAllChatsByIdUserFail
  | getAllChatsByIdUserSuccess;
