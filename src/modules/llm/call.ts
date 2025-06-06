import Message from '@/class/message';
import axios from 'axios';
import router from './tools/router';
import logger from '@/utils/logger';

export default async function callLLM(msg: Message) {
  // 调用 DeepSeek API
  const response = axios
    .post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: 'deepseek-chat',
        messages: msg.getNormalizedMessages(),
        max_tokens: 100,
        temperature: 0.1,
        top_p: 0.3,
        frequency_penalty: 0.5,
        presence_penalty: 0.3,
        stream: false,
        tools: router().generateToolsSpec(),
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.LLM_TOKEN}`,
        },
        onUploadProgress(progressEvent) {
          logger.info(`上传数据：${progressEvent.bytes} bytes`);
        },
        onDownloadProgress(progressEvent) {
          logger.info(`下载数据：${progressEvent.bytes} bytes`);
        },
      }
    )
    .then((res) => res.data)
    .catch((err) => {
      console.error(err.response.data);
      throw err;
    });
  return response;
}
