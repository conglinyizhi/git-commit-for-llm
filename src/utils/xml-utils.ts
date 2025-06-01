/**
 * 生成 XML 元素
 * @param target 目标字符串
 * @param content 内容
 * @param tag 标签名
 * @returns 添加了 XML 标签的新字符串
 */
export function createXMLElement(content: any, tag: string): string {
  return `<${tag}>${content || 'No content'}</${tag}>\n\n`;
}
