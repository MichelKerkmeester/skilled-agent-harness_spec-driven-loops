// Feeds the review's v2 session events through the bridge and prints what a v1 event hook receives.
const root = process.argv[2];
const { dualPlugin } = await import(`${root}/.opencode/plugins/lib/v2-bridge.js`);
const seen = [];
const plugin = dualPlugin('probe', async () => ({ event: async ({ event }) => { seen.push(event); } }));
const events = [
  { type: 'session.created', data: { sessionID: 'ses_A', version: '2.0.32' } },
  { type: 'session.deleted', data: { sessionID: 'ses_A' } },
  { type: 'session.updated', data: { sessionID: 'ses_B', info: { id: 'ses_B', title: 't' } } },
  { type: 'message.updated', data: { sessionID: 'ses_A', info: { id: 'msg_1' } } },
];
let release;
const stream = { async *[Symbol.asyncIterator]() { for (const e of events) yield e; await new Promise((r) => { release = r; }); } };
const ctx = { location: { directory: root }, event: { subscribe: () => stream }, tool: { hook: async () => ({ dispose: async () => {} }) }, session: { hook: async () => ({ dispose: async () => {} }) } };
const cleanup = await plugin.setup(ctx);
await new Promise((r) => setTimeout(r, 50));
for (const e of seen) console.log(e.type.padEnd(16), 'properties.info.id =', e.properties?.info?.id ?? '(none)');
release?.(); await cleanup().catch(() => {});
