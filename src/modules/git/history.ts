import { consola } from 'consola';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

/**
 * 获取 git 提交历史
 * @param gitRoot Git 仓库根目录
 * @returns 返回提交历史字符串
 */
export default async function getHistory(gitRoot: string): Promise<string> {
  const argsArray = ['log', '--oneline', '-n', '5'];
  try {
    const { stdout } = await execFileAsync('git', argsArray, {
      cwd: gitRoot,
    });
    return stdout;
  } catch (error) {
    if (error instanceof Error) {
      consola.error(`==git log 执行失败==`);
      consola.log(error.message);
    }
    throw error;
  }
}
