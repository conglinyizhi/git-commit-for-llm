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

const startSearchDir = path.resolve(__dirname);

const gitRoot = await findGitRoot(startSearchDir);
const { diff, mode } = await getDiff(gitRoot);

const systemPrompt = getSystemPrompt();
aiChatList.initMessageArray(systemPrompt);
aiChatList.pushUserMessage(diff);

const response = await callLLM(aiChatList);
const { tool_calls } = response.data.choices[0].message;

const toolCallResult = await router.handleResponse({ tool_calls });

if (toolCallResult['git-commit']) {
  const { type, message } = toolCallResult['git-commit'];
  await commit({ gitRoot, message: `${type}: ${message}`, needAdd: mode !== 'staged' });
}
