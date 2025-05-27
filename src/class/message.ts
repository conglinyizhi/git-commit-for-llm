import type { LLMMessage as MesssageList, Role } from '@/types';

export default class Message {
  messages: MesssageList[] = [];
  /**
   * 添加消息
   * @param message 消息
   */
  pushMessage(message: MesssageList) {
    this.messages.push(message);
  }
  /**
   * 添加用户消息
   * @param content 内容
   */
  pushUserMessage(content: string) {
    this.pushMessage({ role: 'user', content });
  }
  /**
   * 添加 AI 消息
   * @param content 内容
   */
  pushAIMessage(content: string) {
    this.pushMessage({ role: 'assistant', content });
  }
  /**
   * 获取消息数组
   * @returns 消息数组
   */
  getMessages(): MesssageList[] {
    return this.messages;
  }

  /**
   * 获取规范化后的消息列表，确保消息内容不为 null 或 undefined
   * @returns 规范化后的消息数组
   */
  getNormalizedMessages(): MesssageList[] {
    return this.messages.map((msg) => ({
      ...msg,
      content: msg.content || '',
    }));
  }
  /**
   * 初始化消息数组
   * @param system 系统消息
   * @returns 消息数组
   */
  initMessageArray(system: string): Message {
    const $msg = Message.buildMessage('system', system);
    this.pushMessage($msg);
    return this;
  }
  /**
   * 构建消息
   * @param role 角色
   * @param content 内容
   * @returns 消息
   */
  static buildMessage(role: Role, content: string): MesssageList {
    return {
      role,
      content,
    };
  }
  /**
   * 构造函数
   */
  constructor() {
    return this;
  }
}
