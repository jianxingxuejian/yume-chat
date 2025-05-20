declare namespace Chat {
  interface ChatParam {
    prompt: string
    model: string
    apiKey: string
  }
  interface ChatMessage {
    role: 'user' | 'assistant'
    content: string
  }
  interface ChatResult {
    id: string
    model: string
    messages: ChatMessage[]
  }
}
