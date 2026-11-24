import { registerHooks } from 'node:module';
registerHooks({
  resolve(specifier, context, next) {
    try { return next(specifier, context); }
    catch (e) {
      if (specifier.endsWith('.js')) return next(specifier.slice(0, -3) + '.ts', context);
      throw e;
    }
  },
});
