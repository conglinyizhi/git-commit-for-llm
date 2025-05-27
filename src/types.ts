/**
 * Git提交类型
 */
export type TargetType =
  | 'test'
  | 'style'
  | 'chore'
  | 'docs'
  | 'ci'
  | 'build'
  | 'refactor'
  | 'fix'
  | 'feat'
  | 'perf'
  | '';

/**
 * 提交选项
 */
export interface CommitOptions {
  returnText: string;
  gitRoot: string;
}

/**
 * 执行命令的配置
 */
export interface ExecConfig {
  cwd: string;
}

/**
 * 发送给大模型的消息格式
 */
export interface LLMMessage {
  role: Role;
  content: string;
}

export type Role = 'user' | 'assistant' | 'system' | 'function' | 'tool';

/**
 * 提交消息类型
 */
export interface CommitMessage {
  type: string;
  message: string;
}

export interface ToolCall {
  id: string;
  type: string;
  function: {
    name: string;
    arguments: string;
  };
}

export interface Message {
  role: Role;
  content: string | null;
  name?: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
  function_call?: {
    name: string;
    arguments: string;
  };
}

export type UsageInfo = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
  prompt_cache_hit_tokens: number;
  prompt_cache_miss_tokens: number;
};

export type getDiffReturnType = {
  mode: 'staged' | 'unstaged';
  diff: string;
};
