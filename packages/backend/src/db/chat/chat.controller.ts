import { Body, Controller, Get, OnModuleInit, Param, Post, Res } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { streamText } from 'ai'
import { createOpenAI } from '@ai-sdk/openai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'
import { Response } from 'express'
import { type Dispatcher, ProxyAgent } from 'undici'
import { v4 as uuidv4 } from 'uuid'
import { ChatService } from './chat.service'
import { proxyFetch } from '@/utils'

@Controller('chat')
export class ChatController implements OnModuleInit {
  private dispatcher: Dispatcher | undefined

  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
  ) {}

  onModuleInit() {
    const proxyUrl = this.configService.get<string>('HTTP_PROXY_URL')
    if (proxyUrl) {
      console.log(`Using proxy: ${proxyUrl}`)
      this.dispatcher = new ProxyAgent(proxyUrl)
    }
  }

  @Post('stream')
  async chat(
    @Body()
    body: {
      messages: {
        role: 'user' | 'assistant' | 'system'
        content: string
        parts: { type: string; text: string }[]
      }[]
      data: { model: Model; apiKey: string }
    },
    @Res() res: Response,
  ) {
    const { model, apiKey } = body.data
    const prompt = body.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const conversationId = uuidv4()
    res.setHeader('X-Conversation-ID', conversationId)

    let result

    if (model.startsWith('gpt')) {
      const openai = createOpenAI({
        apiKey,
        fetch: proxyFetch(this.dispatcher),
      })
      result = streamText({
        model: openai.chat(model),
        messages: prompt,
        onError: (response) => {
          console.log(response)
        },
      })
    } else if (model.startsWith('gemini')) {
      const google = createGoogleGenerativeAI({
        apiKey,
        fetch: proxyFetch(this.dispatcher),
      })
      try {
        result = streamText({
          model: google.chat(model),
          messages: prompt,
        })
      } catch (error) {
        console.log(error)
      }
    }
    result?.pipeDataStreamToResponse(res)
  }

  @Get(':id')
  async getChat(@Param('id') id: string) {
    return this.chatService.getChatSession(id)
  }
}
