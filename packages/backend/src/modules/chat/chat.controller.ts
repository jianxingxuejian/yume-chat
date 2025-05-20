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
import { PrismaService } from '../prisma/prisma.service'

@Controller('chat')
export class ChatController implements OnModuleInit {
  private dispatcher: Dispatcher | undefined

  constructor(
    private readonly chatService: ChatService,
    private readonly configService: ConfigService,
    private readonly prismaService: PrismaService,
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
      data: { model: Model; apiKey: string; conversationId?: string }
    },
    @Res() res: Response,
  ) {
    const { model, apiKey } = body.data
    const prompt = body.messages.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }))

    const conversationId = body.data.conversationId || uuidv4()
    if (!body.data.conversationId) {
      await this.prismaService.conversation.create({
        data: {
          id: conversationId,
          model,
          title: prompt[0].content,
          data: JSON.stringify(prompt),
        },
      })
      res.setHeader('X-Conversation-ID', conversationId)
    }

    let result

    if (model.startsWith('gpt')) {
      const openai = createOpenAI({
        apiKey,
        fetch: proxyFetch(this.dispatcher),
      })
      result = streamText({
        model: openai.chat(model),
        messages: prompt,
        onFinish: async (response) => {
          if (!response.request.body) return
          const body: {
            contents: {
              role: string
              parts: { [type: string]: string }[]
            }[]
          } = JSON.parse(response.request.body)
          const data = body.contents
            .map((msg) => ({
              role: msg.role,
              content: msg.parts[0]['text'],
            }))
            .concat({
              role: 'assistant',
              content: response.text,
            })
          await this.prismaService.conversation.update({
            where: { id: conversationId },
            data: {
              data: JSON.stringify(data),
            },
          })
        },
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
          onFinish: async (response) => {
            if (!response.request.body) return
            const body: {
              contents: {
                role: string
                parts: { [type: string]: string }[]
              }[]
            } = JSON.parse(response.request.body)
            const data = body.contents
              .map((msg) => ({
                role: msg.role,
                content: msg.parts[0]['text'],
              }))
              .concat({
                role: 'assistant',
                content: response.text,
              })
            await this.prismaService.conversation.update({
              where: { id: conversationId },
              data: {
                data: JSON.stringify(data),
              },
            })
          },
          onError: (response) => {
            console.log(response)
          },
        })
      } catch (error) {
        console.log(error)
      }
    }
    result?.pipeDataStreamToResponse(res)
  }

  @Get(':id')
  async getChat(@Param('id') id: string): Promise<ApiResult<Chat.ChatResult>> {
    const conversation = await this.prismaService.conversation.findUnique({
      where: { id },
    })
    if (!conversation) {
      throw new Error(`Conversation with ID "${id}" not found`)
    }

    return {
      code: 200,
      msg: 'ok',
      data: {
        id: uuidv4(),
        model: conversation.model,
        messages: JSON.parse(conversation.data),
      },
    }
  }
}
