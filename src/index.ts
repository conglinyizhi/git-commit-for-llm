import getDiff from './modules/git/diff';
import findGitRoot from './modules/git/find-root';
import path from 'node:path';
import MessageList from './class/message';
import getSystemPrompt from './modules/llm/prompt';
import callLLM from './modules/llm/call';
import logger from './utils/logger';
import router from './modules/llm/tools';
import commit from './modules/git/commit';

const aiChatList = new MessageList();

const startSearchDir = path.resolve(process.cwd());

const gitRoot = await findGitRoot(startSearchDir);
logger.success(`找到git仓库根目录: ${gitRoot}`);
const { diff, mode } = await getDiff(gitRoot);
logger.debug(`差异获取完成，模式: ${mode}`);
const systemPrompt = getSystemPrompt();
logger.debug(`系统提示信息长度: ${systemPrompt.length}`);

aiChatList.initMessageArray(systemPrompt);
aiChatList.pushUserMessage(diff);

logger.debug(`用户消息长度: ${diff.length}`);
logger.info(`开始调用大模型....`);
const response = await callLLM(aiChatList);
const { tool_calls } = response.data.choices[0].message;
logger.success(`大模型调用完成，后处理中……`);
logger.debug(`AI响应长度: ${tool_calls.length}`);

const toolCallResult = await router.handleResponse({ tool_calls });
logger.success(`后处理完成，开始执行git提交`);
if (toolCallResult['git-commit']) {
  const { type, message } = toolCallResult['git-commit'];
  // 执行git提交，如果是暂存区模式则自动添加更改
  await commit({
    gitRoot,
    message: `${type}: ${message}`, // 组合提交信息格式：type: message
    needAdd: mode === 'unstaged',
  });
}
