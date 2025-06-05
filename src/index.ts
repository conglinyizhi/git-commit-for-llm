import getDiff from './modules/git/diff';
import findGitRoot from './modules/git/find-root';
import path from 'node:path';
import MessageList from './class/message';
import getGenCommitSystemPrompt from './modules/llm/prompt-fun/gen-commit';
import callLLM from './modules/llm/call';
import logger from './utils/logger';
import router from './modules/llm/tools';
import commitCall from './modules/git/commit';
import * as env from './utils/env-utils';
import { createTimedProxy } from './proxy';

if (env.IS_DEV) {
  logger.debug('开发模式');
  logger.info('常量文件内容如下：');
  logger.info(JSON.stringify(env, null, 2));
}

async function main() {
  const callLLMTimerProxy = createTimedProxy(callLLM);
  const aiChatList = new MessageList();

  const startSearchDir = path.resolve(process.cwd());

  const gitRoot = await findGitRoot(startSearchDir);
  logger.success(`找到 git 仓库根目录：${gitRoot}`);
  const { diff, mode } = await getDiff(gitRoot);
  logger.debug(`差异获取完成，模式：${mode}`);

  // TODO 确定提交规范和提交语言（根据 git 历史）

  const sysPrompt = getGenCommitSystemPrompt();
  logger.debug(`系统提示信息长度：${sysPrompt.length}`);
  logger.debug(sysPrompt);
  aiChatList.initMessageArray(sysPrompt);
  aiChatList.pushUserMessage(diff);
  logger.debug(`Diff(from git) length: ${diff.length}`);

  while (aiChatList.getMessages().length < 5) {
    logger.info(`开始调用大模型....`);

    const response = await callLLMTimerProxy(aiChatList);
    const { tool_calls, content } = response.choices[0].message;

    if (exitWithLLMReturnContent(content)) break;

    logger.success(`大模型调用完成，后处理中...`);
    const toolCallResult = await router.handleResponse({ tool_calls });
    logger.debug(`调用工具：${JSON.stringify(toolCallResult)}`);

    if (await commitCall(toolCallResult, { gitRoot, mode })) break;

    logger.debug(`AI 响应：${JSON.stringify(tool_calls)}`);
    aiChatList.pushMessage({
      role: 'assistant',
      content: null,
      tool_calls,
    });
    if (toolCallResult['read-file']) {
      const { content } = toolCallResult['read-file'];
      aiChatList.pushToolMessage(tool_calls[0].id, content);
    }
  }
}

/** 退出时打印大模型返回的内容，并警告用户：在设计中，大模型不会进行发言 */
function exitWithLLMReturnContent(content: string): boolean {
  if (!content || !content.trim()) return false;
  logger.warn(`大模型说：${content}`);
  logger.info('在设计中，理论上大模型不会进行发言，应该是哪儿出现了问题');
  return true;
}

try {
  main();
} catch (error) {
  logger.error(error);
  process.exit(1);
}
