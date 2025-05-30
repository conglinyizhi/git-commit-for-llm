import fs from 'node:fs/promises';
import path from 'node:path';

/**
 * 读取项目贡献者文档
 * @param gitRoot 项目根目录路径
 * @returns 包含所有找到文件内容的 Map 对象
 */
export default async function contrlibReader(gitRoot: string): Promise<Map<string, string>> {
  // 支持的文件名列表
  const possibleFiles = ['CONTRIBUTING.md', 'CODE_OF_CONDUCT.md'];
  const resultMap = new Map<string, string>();

  // 尝试读取所有可能的文件
  for (const filename of possibleFiles) {
    try {
      const filePath = path.join(gitRoot, filename);
      const content = await fs.readFile(filePath, 'utf-8');
      resultMap.set(filename, content);
    } catch (error) {
      // 文件不存在则忽略
      if (error.code === 'ENOENT') continue;

      // 其他错误直接抛出
      throw new Error(`无法读取文件 ${filename}: ${error.message}`);
    }
  }

  // 如果没有找到任何文件
  if (resultMap.size === 0) {
    throw new Error('项目根目录下未找到CONTRIBUTING.md或CODE_OF_CONDUCT.md文件');
  }

  return resultMap;
}
