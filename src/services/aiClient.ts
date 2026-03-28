export interface ChatMessage {
  role: 'user' | 'assistant' | 'system'
  text: string
}

export interface InputMessage {
  role: 'user' | 'assistant' | 'system'
  content: Array<{type: string, text: string}>
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
      
      const systemMessage: InputMessage = {
          role: 'system',
          content: [{
              type: 'input_text',
              text: '你是一个小学生作文写作老师。你能一步一步引导学生完成作文写作。你会根据学生的输入，提供苏格拉底式的提问，要求学生思考并且自己输出。请遵守以下规则：1.只包含必要的提问和解释，简洁明了。2.字数在140字以内。3.每次提问都要引导学生思考，不要直接给出答案。4.如果学生的输入不清楚或者不完整，你需要提出澄清性问题，帮助学生完善输入。5.多鼓励学生，激发他们创作兴趣。'
          }]
      }
        

    const response = await fetch('https://ark.cn-beijing.volces.com/api/v3/responses', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        // stream: true,
        tools: [{
            type: 'web_search',
            max_keyword: 3
          }],
        input:[systemMessage, ...messages.map(msg => ({
          role: msg.role,
            content: [{
                type: 'input_text',
                text: msg.text
          }]
        }))]
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`OpenAI error: ${response.status} ${errorText}`)
    }

    const data = await response.json()
    return data.output[0].content[0].text ?? 'AI 未返回内容。'
  }
}
