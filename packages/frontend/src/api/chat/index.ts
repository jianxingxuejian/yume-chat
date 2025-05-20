import request from '../request'

export async function chat(params: Chat.ChatParam) {
  return request.post<string>('/chat/stream', params)
}

export async function getChat(id: string) {
  return request.get<Chat.ChatResult>(`/chat/${id}`)
}
