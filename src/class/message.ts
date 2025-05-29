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

  /**
   * 添加工具函数消息
   * @param toolCallId 工具调用ID - 用于关联工具调用和响应
   * @param content 工具执行结果内容 - 通常是JSON字符串格式的工具输出
   * @example
   * // 添加一个天气查询工具的结果
   * message.pushToolMessage('call_123', JSON.stringify({temperature: 25}))
   */
  pushToolMessage(toolCallId: string, content: string) {
    this.pushMessage({
      role: 'tool',
      content,
      tool_call_id: toolCallId,
    });
  }
}
