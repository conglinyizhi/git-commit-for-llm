import ToolRouter from '@/class/tool-router';
import logger from '@/utils/logger';

const router = new ToolRouter();

router.register({
  name: 'example',
  // 示例工具，不实现任何功能
  description: 'This is an example tool, it does nothing',
  parameters: {
    type: 'object',
    properties: {
      data: {
        type: 'string',
        // 在这里说明为什么需要这个参数（翻译为英文写进去）
        description: 'why do you need this parameter',
      },
    },
    required: ['data'],
  },
  async cb(args) {
    const { data } = args;
    logger.debug(`call example tool: ${data}`);
    return args;
  },
});

export default router;
