import request from '../request'

export async function chat(params: Chat.ChatParam) {
  return request.post<string>('/chat/stream', params)
}
