import ToolRouter from '@/class/tool-router';
import logger from '@/utils/logger';

const router = new ToolRouter();

router.register({
  name: 'git-commit',
  description: 'Commit changes to git repository',
  parameters: {
    type: 'object',
    properties: {
      type: {
        type: 'string',
        description: 'commit type',
        enum: ['test', 'style', 'chore', 'docs', 'ci', 'build', 'refactor', 'fix', 'feat', 'perf'],
      },
      module: {
        type: 'string',
        description: 'the module name can be empty,but not recommended.(for convention commit)',
      },
      message: {
        description: 'commit message',
        type: 'string',
      },
    },
    required: ['type', 'message'],
  },
  async cb(args) {
    const { type, message } = args;
    logger.info(type, message);
    return args;
  },
});

export default router;
