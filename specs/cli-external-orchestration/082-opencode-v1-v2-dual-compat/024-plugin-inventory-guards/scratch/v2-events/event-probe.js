import { appendFileSync } from 'node:fs';
const LOG = '<scratch>/events.log';
export default {
  id: 'event-probe',
  async setup(ctx) {
    const controller = new AbortController();
    appendFileSync(LOG, 'setup\n');
    (async () => {
      try {
        for await (const event of ctx.event.subscribe({ signal: controller.signal })) {
          appendFileSync(LOG, event.type + '\n');
        }
      } catch (error) { appendFileSync(LOG, 'stream-error ' + (error?.name || error) + '\n'); }
    })();
    return async () => { appendFileSync(LOG, 'cleanup\n'); controller.abort(); };
  },
};
