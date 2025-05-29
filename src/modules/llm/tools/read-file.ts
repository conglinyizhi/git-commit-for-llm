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
    try {
      const content = await fs.readFile(path, 'utf-8');
      return { content };
    } catch (error) {
      logger.warn(error);
      return { content: '' };
    }
  },
});

export default router;
