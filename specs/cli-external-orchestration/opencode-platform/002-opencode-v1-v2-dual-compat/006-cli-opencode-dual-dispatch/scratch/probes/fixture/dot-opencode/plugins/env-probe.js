import { appendFileSync } from 'node:fs';
const LOG = process.env.PROBE_LOG;
const log = (o) => { if (LOG) appendFileSync(LOG, JSON.stringify({ t: Date.now(), ...o }) + '\n'); };
export default {
  id: 'env-probe',
  async setup(ctx) {
    log({ evt: 'setup', cwd: process.cwd(), pwd: process.env.PWD || null, AI_SESSION_CHILD: process.env.AI_SESSION_CHILD ?? null, ctxKeys: Object.keys(ctx || {}) });
    const reg = await ctx.session.hook('prompt', async (ev) => {
      log({ evt: 'session.prompt', cwd: process.cwd(), AI_SESSION_CHILD: process.env.AI_SESSION_CHILD ?? null, ev: JSON.stringify(ev).slice(0, 1500) });
    });
    return async () => { await reg?.dispose?.(); };
  },
};
