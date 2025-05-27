import gitCommit from './git-commit';
import ToolRouter from '@/class/tool-router';

let router: ToolRouter | null = null;

function initGlobalRouter() {
  router = new ToolRouter();
  router.registerRouter(gitCommit);
  return router;
}

export default function getStaticRouter(): ToolRouter {
  if (!router) {
    return initGlobalRouter();
  }
  return router;
}
