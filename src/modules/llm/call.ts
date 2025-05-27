import Message from '@/class/message';
import axios from 'axios';
import router from './tools/router';

export default async function callLLM(msg: Message) {
  // 调用 DeepSeek API
  const response = await axios.post(
    'https://api.deepseek.com/v1/chat/completions',
    {
      model: 'deepseek-chat',
      messages: msg.getNormalizedMessages(),
      max_tokens: 100,
      temperature: 0,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
      stream: false,
      tools: router().generateToolsSpec(),
    },
    {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.LLM_TOKEN}`,
      },
    }
  );

  return response;
}
