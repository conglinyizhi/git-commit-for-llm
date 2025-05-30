import { createConsola } from 'consola';
import { IS_DEV } from './env-utils';

export default createConsola({
  level: IS_DEV ? 5 : 4,
});
