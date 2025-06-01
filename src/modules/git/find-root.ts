import path from 'node:path';
import fs from 'node:fs/promises';

/**
 * 检查指定目录是否存在
 * @param path 要检查的目录路径
 * @returns 如果目录存在返回 true，否则返回 false
 */
async function checkDirExists(path: string): Promise<boolean> {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

/**
 * 从指定路径开始向上查找 Git 根目录
 * @param startPath 起始查找路径
 * @returns 返回找到的 Git 根目录路径
 */
export default async function findGitRoot(startPath: string): Promise<string> {
  let currentPath = startPath;
  const root = path.parse(startPath).root;

  while (currentPath !== root) {
    const gitPath = path.join(currentPath, '.git');
    if (await checkDirExists(gitPath)) {
      return currentPath;
    }
    currentPath = path.dirname(currentPath);
  }

  throw new Error('未找到 Git 根目录');
}
