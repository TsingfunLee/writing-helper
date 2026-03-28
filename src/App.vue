<template>
  <div class="page-shell">
    <section class="hero-panel">
      <div class="animation-area">

     
 <animation />
    
      </div>
    </section>

    <section class="chat-panel">
      <div class="chat-card">
               <!-- <div class="chat-body">
          <div v-for="(message, index) in messages" :key="index" :class="['chat-message', message.role]">
            <div class="message-label">{{ message.role === 'user' ? '我' : 'AI' }}</div>
            <div class="message-text">{{ message.content }}</div>
          </div>
      </div> -->

      
        <div class="chat-input-area">
          <input
            v-model="userInput"
            @keydown.enter="sendMessage"
placeholder="嗨~今天有什么灵感？"
          
            :disabled="isLoading"
          />
          <button @click="sendMessage" :disabled="isLoading || !userInput.trim()">
            {{ isLoading ? '发送中...' : '发送' }}
          </button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { AIClient, ChatMessage } from './services/aiClient'
import animation from './components/animation.vue'

const userInput = ref('')
const messages = ref<ChatMessage[]>([
    //   { role: 'assistant', content: '你好！欢迎使用 AI 对话演示。请在下方输入你的问题。' },
])
const isLoading = ref(false)

const apiKey = import.meta.env.VITE_OPENAI_API_KEY as string
const model = (import.meta.env.VITE_OPENAI_MODEL as string) || 'gpt-4o-mini'
const aiClient = new AIClient(apiKey, model)

async function sendMessage() {
  const content = userInput.value.trim()
  if (!content || isLoading.value) {
    return
  }

  messages.value.push({ role: 'user', content })
  userInput.value = ''
  isLoading.value = true

  try {
    const assistantText = await aiClient.sendMessage(messages.value)
    messages.value.push({ role: 'assistant', content: assistantText })
  } catch (error) {
    console.error(error)
    messages.value.push({
      role: 'assistant',
      content: '请求失败，请检查 .env 中的 VITE_OPENAI_API_KEY 或网络连接。',
    })
  } finally {
    isLoading.value = false
  }
}
</script>
