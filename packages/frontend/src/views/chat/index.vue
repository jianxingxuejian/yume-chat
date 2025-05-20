<template>
  <n-layout has-sider position="absolute" class="h-screen w-screen">
    <n-layout-sider
      collapse-mode="width"
      :collapsed-width="100"
      :width="260"
      show-trigger="arrow-circle"
      content-style="padding: 24px;"
      bordered
      class="relative"
    >
      <div class="absolute bottom-4 left-4">
        <n-button text @click="showSettingsModal = true">
          <template #icon>
            <icon-mdi:cog />
          </template>
          设置
        </n-button>
      </div>
    </n-layout-sider>

    <n-layout-content class="h-full flex flex-col">
      <span class="my-6 md:my-8 text-2xl md:text-3xl font-bold flex justify-center items-center"
        >yume-chat</span
      >

      <div ref="chatHistoryRef" class="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
        <div
          v-if="messages.length === 0 && !isLoading"
          class="flex flex-col items-center justify-center h-full text-gray-400"
        >
          <icon-mdi:chat-question-outline class="text-6xl mb-4" />
          <span>还没有消息，开始对话吧！</span>
        </div>
        <div
          v-for="message in messages"
          :key="message.id"
          class="flex"
          :class="message.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <div
            class="max-w-[80%] md:max-w-[70%] p-3 rounded-lg shadow-md text-sm md:text-base"
            :class="
              message.role === 'user' ?
                'bg-blue-500 text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            "
          >
            <div
              v-html="renderMarkdown(message.content)"
              class="prose prose-sm dark:prose-invert max-w-none"
            ></div>
          </div>
        </div>
        <div
          v-if="isLoading && messages.length > 0 && messages[messages.length - 1].role === 'user'"
          class="flex justify-start"
        >
          <div
            class="max-w-[70%] p-3 rounded-lg shadow-md bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 flex items-center"
          >
            <n-spin size="small" />
            <span class="ml-2 text-sm">思考中...</span>
          </div>
        </div>
      </div>

      <div
        class="sticky bottom-0 px-4 py-3 bg-white dark:bg-neutral-800 border-t border-gray-200 dark:border-gray-700"
      >
        <form @submit.prevent="handleChatSubmit">
          <n-input
            v-model:value="input"
            type="textarea"
            show-count
            :autosize="{ minRows: 1, maxRows: 10 }"
            placeholder="输入您的问题..."
            class="rounded-lg text-sm md:text-base"
            :disabled="isLoading"
            @keypress.enter.prevent="handleEnterPress"
          >
            <template #suffix>
              <n-button
                text
                size="large"
                class="mr-1 text-lg md:text-xl"
                :disabled="isLoading || !input.trim()"
                :loading="isLoading"
              >
                <template #icon>
                  <icon-bi:send />
                </template>
              </n-button>
            </template>
          </n-input>
        </form>
      </div>
    </n-layout-content>

    <n-modal v-model:show="showSettingsModal" title="设置" preset="dialog">
      <n-form label-placement="left" label-width="auto" class="w-full md:w-96">
        <n-form-item label="模型 (Model)">
          <n-select
            v-model:value="selectedModel"
            :options="modelOptions"
            placeholder="请选择模型"
          />
        </n-form-item>
        <n-form-item label="API Key">
          <n-input
            v-model:value="apiKey"
            type="password"
            show-password-on="click"
            placeholder="请输入 API Key"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" block @click="saveSettings">保存设置</n-button>
        </n-form-item>
      </n-form>
    </n-modal>
  </n-layout>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted, watch } from 'vue'
import { useMessage as useNaiveMessage } from 'naive-ui'
import { useChat } from '@ai-sdk/vue'
import MarkdownIt from 'markdown-it'
import { getChat } from '@/api'

const props = defineProps<{
  id: string
}>()

const naiveMessage = useNaiveMessage()

const showSettingsModal = ref(false)
const selectedModel = ref<Model>('gpt-3.5-turbo')
const apiKey = ref('')

const modelOptions: { label: string; value: Model }[] = [
  { label: 'GPT-4o', value: 'gpt-4o' },
  { label: 'GPT-3.5 Turbo', value: 'gpt-3.5-turbo' },
  { label: 'Gemini 2.0 Flash', value: 'gemini-2.0-flash' },
  { label: 'Gemini 2.5 Flash Preview', value: 'gemini-2.5-flash-preview-04-17' },
]

const chatHistoryRef = ref<HTMLElement | null>(null)
const md = new MarkdownIt()

const renderMarkdown = (text: string) => {
  return md.render(text)
}

const router = useRouter()

const { messages, input, handleSubmit, isLoading, error, stop } = useChat({
  api: '/api/chat/stream',
  onResponse: (response: Response) => {
    // 当这是一个新对话且没有conversationId时，尝试从header获取
    if (!props.id && response.ok) {
      const newConvId = response.headers.get('X-Conversation-ID')
      if (newConvId) {
        router.push({ name: 'chat', params: { id: newConvId } })
      }
    }
  },
  onError: (err) => {
    naiveMessage.error(`请求失败: ${err.message || '未知错误'}`)
    const lastUserMessageIndex = messages.value.findLastIndex((m) => m.role === 'user')
    if (lastUserMessageIndex !== -1 && messages.value.length > lastUserMessageIndex + 1) {
      if (messages.value[lastUserMessageIndex + 1].role === 'assistant') {
        messages.value.splice(lastUserMessageIndex + 1, 1)
      }
    }
    messages.value.push({
      id: `error-${Date.now()}`,
      role: 'assistant',
      content: `抱歉，处理您的请求时发生错误。(${err.message || '请检查API Key或网络连接'})`,
      parts: [],
    })
  },
})

if (props.id) {
  getChat(props.id).then((res) => {
    const msgs = res?.data.messages
    if (!msgs) return
    msgs.forEach((msg) => {
      messages.value.push({
        id: `msg-${Date.now()}`,
        role: msg.role,
        content: msg.content,
        parts: [],
      })
    })
  })
}

onMounted(() => {
  const storedApiKey = localStorage.getItem('yume-chat-apiKey')
  const storedModel = localStorage.getItem('yume-chat-model')
  if (storedApiKey) {
    apiKey.value = storedApiKey
  }
  if (storedModel) {
    selectedModel.value = storedModel as Model
  }
})

const saveSettings = () => {
  if (!apiKey.value.trim()) {
    naiveMessage.warning('API Key 不能为空')
    return
  }
  localStorage.setItem('yume-chat-apiKey', apiKey.value)
  localStorage.setItem('yume-chat-model', selectedModel.value)
  showSettingsModal.value = false
  naiveMessage.success('设置已保存！')
}

const scrollToBottom = async () => {
  await nextTick()
  if (chatHistoryRef.value) {
    chatHistoryRef.value.scrollTop = chatHistoryRef.value.scrollHeight
  }
}

const handleChatSubmit = async (event?: Event) => {
  if (event) event.preventDefault()
  const currentInput = input.value.trim()
  if (!currentInput || isLoading.value) return

  if (!apiKey.value) {
    naiveMessage.error('请先在设置中配置 API Key。')
    showSettingsModal.value = true
    return
  }

  handleSubmit(event, {
    body: {
      data: {
        model: selectedModel.value,
        apiKey: apiKey.value,
        conversationId: props.id,
      },
    },
  })
}

const handleEnterPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter' && !e.shiftKey && !e.isComposing) {
    e.preventDefault()
    handleChatSubmit()
  }
}

watch(
  messages,
  () => {
    scrollToBottom()
  },
  { deep: true },
)

watch(error, (newError) => {
  if (newError) {
    console.error('Chat error:', newError)
    // Error handling is also done in useChat's onError, this is for additional logging if needed
  }
})
</script>

<style scoped>
.prose :where(code):not(:where([class~='not-prose'] *))::before {
  content: '';
}
.prose :where(code):not(:where([class~='not-prose'] *))::after {
  content: '';
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}
.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}
.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
  border-radius: 20px;
  border: transparent;
}
.dark .overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(75, 85, 99, 0.5);
}
</style>
