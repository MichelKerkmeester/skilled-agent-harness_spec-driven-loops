import { appendFileSync } from 'node:fs';
const LOG = '/private/tmp/claude-501/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/0b9dc60c-478f-4659-8191-2da52f1cd765/scratchpad/probe-003/events.jsonl';
const log = (o) => appendFileSync(LOG, JSON.stringify({ t: Date.now(), ...o }) + '\n');
export default {
  id: 'event-probe',
  async setup(ctx) {
    log({ evt: 'setup' });
    const ac = new AbortController();
    (async () => {
      try {
        for await (const e of ctx.event.subscribe({ signal: ac.signal })) {
          log({ evt: 'event', type: e.type, dataKeys: Object.keys(e.data || {}) });
        }
      } catch (err) { log({ evt: 'event-loop-end', error: String(err && err.message || err) }); }
    })();
    const regs = [];
    regs.push(await ctx.session.hook('prompt', async (ev) => { log({ evt: 'hook', name: 'session.prompt', keys: Object.keys(ev || {}) }); }));
    regs.push(await ctx.session.hook('context', async (ev) => { log({ evt: 'hook', name: 'session.context', keys: Object.keys(ev || {}), systemLen: Array.isArray(ev?.system) ? ev.system.length : null }); }));
    regs.push(await ctx.tool.hook('execute.before', async (ev) => { log({ evt: 'hook', name: 'tool.execute.before', tool: ev?.tool }); }));
    return async () => { ac.abort(); for (const r of regs) await r?.dispose?.(); };
  },
};
