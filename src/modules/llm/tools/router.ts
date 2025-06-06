import gitCommit from './modules/git-commit';
import readFile from './modules/read-file';
import ToolRouter from '@/class/tool-router';

let router: ToolRouter | null = null;

function initGlobalRouter() {
  router = new ToolRouter();
  router.registerRouter(gitCommit);
  router.registerRouter(readFile);
  return router;
}

export default function getStaticRouter(): ToolRouter {
  if (!router) {
    return initGlobalRouter();
  }
  return router;
}
