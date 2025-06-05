import logger from './utils/logger';

// 创建计时代理函数
export const createTimedProxy = (fn: Function) => {
  return new Proxy(fn, {
    apply(target, thisArg, args) {
      // 1. 执行前记录开始时间
      const start = performance.now();
      // 2. 执行原函数
      const result = Reflect.apply(target, thisArg, args);
      // 检测返回的是否是 Promise
      if (result instanceof Promise) {
        return result.finally(() => {
          const end = performance.now();
          logger.log(`访问 LLM API 耗时：${(end - start).toFixed(2)}ms`);
        });
      } else {
        const end = performance.now();
        logger.log(`访问 LLM API 耗时：${(end - start).toFixed(2)}ms`);
      }
      return result;
    },
  });
};
