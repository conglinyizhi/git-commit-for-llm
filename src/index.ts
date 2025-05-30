import getDiff from './modules/git/diff';
import findGitRoot from './modules/git/find-root';
import path from 'node:path';
import MessageList from './class/message';
import getGenCommitSystemPrompt from './modules/llm/prompt-fun/gen-commit';
import callLLM from './modules/llm/call';
import logger from './utils/logger';
import router from './modules/llm/tools';
import commitCall from './modules/git/commit';

const aiChatList = new MessageList();

const startSearchDir = path.resolve(process.cwd());

// TODO 确定提交规范和提交语言（根据 git 历史）

const gitRoot = await findGitRoot(startSearchDir);
logger.success(`找到git仓库根目录: ${gitRoot}`);
const { diff, mode } = await getDiff(gitRoot);
logger.debug(`差异获取完成，模式: ${mode}`);
const sysPrompt = getGenCommitSystemPrompt();
logger.debug(`系统提示信息长度: ${sysPrompt.length}`);

aiChatList.initMessageArray(sysPrompt);
aiChatList.pushUserMessage(diff);
logger.debug(`Diff(from git) length: ${diff.length}`);

while (aiChatList.getMessages().length < 5) {
  logger.info(`开始调用大模型....`);
  const response = await callLLM(aiChatList);

  const { tool_calls, content } = response.data.choices[0].message;
  if (content) {
    logger.warn(`大模型说: ${content}`);
    logger.info('在设计中，理论上大模型不会进行发言，应该是哪儿出现了问题');
    break;
  }
  logger.success(`大模型调用完成，后处理中...`);
  const toolCallResult = await router.handleResponse({ tool_calls });
  logger.debug(`调用工具：${JSON.stringify(toolCallResult)}`);

  if (await commitCall(toolCallResult, { gitRoot, mode })) break;

  logger.debug(`AI响应: ${JSON.stringify(tool_calls)}`);
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
