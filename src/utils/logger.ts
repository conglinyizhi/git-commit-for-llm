import { createConsola } from 'consola';
import { IS_DEV } from './env-utils';

const logger = createConsola({
  level: IS_DEV ? 5 : 3,
});
logger.debug('Logger init');

export default logger;
