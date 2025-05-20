import { Injectable } from '@nestjs/common'

@Injectable()
export class ChatService {
  async getChatSession(id: string) {
    return id
  }
}
