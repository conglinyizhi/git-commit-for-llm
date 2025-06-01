import { promisify } from 'node:util';
import consola from '@/utils/logger';
import { exec } from 'node:child_process';
import { getDiffReturnType } from '@/types';

const execAsync = promisify(exec);

/**
 * 执行 git diff 命令获取所有未暂存的变更
 * @param gitRoot Git 仓库根目录
 * @returns 返回变更内容字符串
 */
export async function getUnstagedChanges(gitRoot: string): Promise<string> {
  return executeGitDiff(gitRoot, '', '读取所有变动...');
}

/**
 * 执行 git diff --staged 命令获取已暂存的变更
 * @param gitRoot Git 仓库根目录
 * @returns 返回已暂存变更内容字符串
 */
export async function getStagedChanges(gitRoot: string): Promise<string> {
  const command = process.env.SAVE_TOKEN_MODE ? '--staged' : '--staged -U20';
  return executeGitDiff(gitRoot, command, '读取暂存变动...');
}

/**
 * 执行 git diff 命令并返回结果
 * @param gitRoot Git 仓库根目录
 * @param command git diff 命令参数
 * @param message 执行前的提示信息
 * @returns 返回 diff 结果字符串
 */
async function executeGitDiff(gitRoot: string, command: string, message: string): Promise<string> {
  consola.info(message);
  const { stdout } = await execAsync(`git diff ${command}`, { cwd: gitRoot });
  return stdout
    .split('\n')
    .filter((line) => line.trim() !== '')
    .join('\n');
}

/**
 * 获取 git 变更内容
 * @param gitRoot git 仓库根目录
 * @returns git 变更内容字符串
 * @throws 如果没有找到任何变更内容，会抛出错误
 */
export default async function getDiff(gitRoot: string): Promise<getDiffReturnType> {
  const diffOutput = await getStagedChanges(gitRoot);
  if (diffOutput.length > 3) return { diff: diffOutput, mode: 'staged' };

  const unstagedDiffOutput = await getUnstagedChanges(gitRoot);
  if (unstagedDiffOutput.length > 3) {
    return { diff: unstagedDiffOutput, mode: 'unstaged' };
  }

  throw new Error('git 两种检测方案都没有得到内容，请尝试将代码暂存后再试一次');
}
