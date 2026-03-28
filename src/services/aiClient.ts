export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  content: string
}

export class AIClient {
  private apiKey: string
  private model: string

  constructor(apiKey: string, model = 'deepseek-v3-2-251201') {
    this.apiKey = apiKey
    this.model = model

    if (!this.apiKey) {
      console.warn('VITE_OPENAI_API_KEY is not configured. 请在 .env 文件中添加 API key。')
    }
  }

  async sendMessage(messages: ChatMessage[]): Promise<string> {
    if (!this.apiKey) {
      throw new Error('Missing OpenAI API key')
    }

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        stream: true,
        tools: [{
            type: 'web_search',
            max_keyword: 3
          }],
        input: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }))
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content?.trim() ?? 'AI 未返回内容。'
  }
}
