import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import consola from '@/utils/logger';
import type { ExecConfig } from '../../types';

const execFileAsync = promisify(execFile);

/**
 * 执行 git 命令
 * @param args git 命令参数数组
 * @param config 执行配置
 * @returns 返回命令输出
 */
async function runGitCommand(args: string[], config: ExecConfig): Promise<string> {
  try {
    const { stdout } = await execFileAsync('git', args, config);
    consola.success(`==git ${args[0]} 执行成功==`);
    consola.log(stdout);
    return stdout;
  } catch (error) {
    if (error instanceof Error) {
      consola.error(`==git ${args[0]} 执行失败==`);
      consola.log(error.message);
      throw error;
    }
    throw error;
  }
}

/**
 * 包装 git 提交工具
 * @param options 提交选项
 */
export default async function commitTool(
  toolCallResult: Record<string, any>,
  options: {
    gitRoot: string;
    mode: string;
  }
): Promise<boolean> {
  if (!toolCallResult['git-commit']) return false;
  const data = toolCallResult['git-commit'];
  await commit({
    gitRoot: options.gitRoot,
    message: buildCommitMessage(data),
    isUnstaged: options.mode === 'unstaged',
  });
  return true;
}

function buildCommitMessage($data: Record<string, any>) {
  if ($data.module) {
    return `${$data.type}(${$data.module}): ${$data.message}`;
  } else {
    return `${$data.type}: ${$data.message}`;
  }
}

/** 执行 git 提交 */
async function commit(options: {
  message: string;
  gitRoot: string;
  isUnstaged: boolean;
}): Promise<void> {
  const { message, gitRoot, isUnstaged: needAdd } = options;
  const execConfig = { cwd: gitRoot };
  consola.info(`提交信息：${message}`);
  const runCommit = await consola.prompt('需要执行 git commit 吗？', {
    type: 'confirm',
  });

  if (!runCommit) return;

  const runAddCommand =
    needAdd &&
    (await consola.prompt('暂存区有东西，需要先执行 git add 吗？', {
      type: 'confirm',
    }));

  if (needAdd && runAddCommand) {
    consola.info(`执行 git add....`);
    await runGitCommand(['add', '.'], execConfig);
  }

  consola.info(`执行 git commit -m ....`);
  await runGitCommand(['commit', '-m', message], execConfig);
}
