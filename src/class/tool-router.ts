import logger from '@/utils/logger';

/**
 * 定义 JSON Schema 的类型结构
 * 这是 LLM 工具参数的标准描述格式
 */
type JSONSchema = {
  type: 'object';
  properties: {
    [key: string]: {
      type: string;
      description: string;
      enum?: string[];
    };
  };
  required: string[];
};

/**
 * 定义工具配置的类型
 * @template T - 泛型参数，约束为 JSONSchema 类型
 */
type Tool<T extends JSONSchema> = {
  /** 工具名称 - 全局唯一*/
  name: string;
  /** 工具描述 - LLM 需要理解这个功能 */
  description: string;
  /** 工具参数 - LLM 生成的参数 */
  parameters: T;
  /** 工具回调函数 - LLM 调用这个工具时会执行这个函数 */
  cb: (args: InferParams<T>) => Promise<ToolCallReturn>;
};

/**
 * 将 JSON Schema 转换为具体的参数类型
 * @template T - 继承自 JSONSchema 的泛型
 */
type InferParams<T extends JSONSchema> = {
  [K in keyof T['properties']]: T['properties'][K]['type'] extends 'string'
    ? string
    : T['properties'][K]['type'] extends 'number'
    ? number
    : T['properties'][K]['type'] extends 'boolean'
    ? boolean
    : any;
};

/**
 * 大模型返回的工具调用响应
 */
type ToolCallResponse = {
  tool_calls: Array<{
    function: {
      name: string;
      arguments: string;
    };
  }>;
};

/**
 * 工具调用返回值
 */
type ToolCallReturn = { [key: string]: any };

/**
 * 工具路由器的核心类
 */
export default class ToolRouter {
  private tools: Map<string, Tool<any>> = new Map();
  /**
   * 注册工具方法
   * @param config - 工具配置对象
   */
  register<T extends JSONSchema>(config: Tool<T>): this {
    this.tools.set(config.name, config);
    return this;
  }

  registerRouter($router: ToolRouter) {
    $router.tools.forEach((value, key) => {
      if (this.tools.has(key)) {
        logger.warn(`工具名称 ${key} 已存在，重复挂载会导致覆盖`);
      } else {
        logger.debug(`注册工具 ${key}`);
      }
      this.tools.set(key, value);
    });
    return this;
  }

  /**
   * 生成符合 LLM 要求的工具规范列表
   * 这个数据可以直接发送给 OpenAI 等大模型
   */
  generateToolsSpec(): any[] {
    return Array.from(this.tools.values()).map((tool) => ({
      type: 'function',
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }

  /**
   * 处理 LLM 的响应，自动执行对应的工具回调
   * @param resp - 大模型返回的响应对象
   */
  async handleResponse(resp: ToolCallResponse): Promise<ToolCallReturn> {
    const reulst: ToolCallReturn = {};
    // 并行处理所有工具调用
    await Promise.all(
      resp.tool_calls.map(async (call) => {
        const tool = this.tools.get(call.function.name);
        if (!tool) {
          logger.warn(`未注册的工具: ${call.function.name}`);
        } else {
          const args = this.buildJSON(call);
          const result = await tool.cb(args);
          reulst[tool.name] = result;
        }
      })
    );

    return reulst;
  }

  private buildJSON(call: { function: { arguments: string } }) {
    return JSON.parse(call.function.arguments);
  }
}
