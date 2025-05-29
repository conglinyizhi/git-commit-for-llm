import ToolRouter from '@/class/tool-router';
import logger from '@/utils/logger';

import fs from 'node:fs/promises';

const router = new ToolRouter();

router.register({
  name: 'read-file',
  description: 'Read file content(Full), if not allowed, return empty file(not error)',
  parameters: {
    type: 'object',
    properties: {
      path: {
        type: 'string',
        description: 'file path',
      },
    },
    required: ['path'],
  },
  async cb(args) {
    const { path } = args;
    logger.debug(`tool:read-file:${path}`);
    // 添加 consola.prompt 确定用户是否允许读取文件
    const allow = await logger.prompt(`Do you want to read file: ${path}`, {
      type: 'select',
      options: [
        { value: 'yes', label: '同意' },
        { value: 'no', label: '拒绝' },
        { value: 'exit', label: '终止运行' },
      ],
    });
    if (allow === 'no') return { content: '', success: false, error: 'User denied' };
    if (allow === 'exit') process.exit(0);
    try {
      const content = await fs.readFile(path, 'utf-8');
      return {
        content,
        success: true,
      };
    } catch (error) {
      logger.warn(error);
      return {
        content: '',
        success: false,
        error: error instanceof Error ? error.message : String(error),
      };
    }
  },
});

export default router;
