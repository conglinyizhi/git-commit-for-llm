import envPaths from 'env-paths';

export const IS_DEV = process.env.NODE_ENV === 'development';

/** 环境变量 LANG，用于国际化 */
export const Locale = process.env.LANG;

/** 环境变量，用于配置保存路径 */
export const paths = envPaths('git-commit-for-llm');
