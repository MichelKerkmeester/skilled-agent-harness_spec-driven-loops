const D = process.argv[2];
const hook = await import(`${D}/hooks/claude/user-prompt-submit.js`);
const { InMemoryDirectiveLifecycleStore } = await import(`${D}/hooks/lib/directive-lifecycle.js`);
const pp = await import(`${D}/runtime/lib/policy-plan.js`);
const live = { status: 'ok', freshness: 'live', brief: null, recommendations: [], diagnostics: null, metrics: { durationMs: 0, cacheHit: false, degraded: false }, sharedPayload: null };
const thrower = () => { throw new Error('render failed'); };
const head = (o) => ('hookSpecificOutput' in o ? o.hookSpecificOutput.additionalContext.split('\n')[0] : JSON.stringify(o));
const base = { buildCliBrief: async () => live, renderBrief: thrower, writeDiagnostic: () => {} };
const inp = (prompt, extra = {}) => ({ hook_event_name: 'UserPromptSubmit', prompt, cwd: process.cwd(), ...extra });
// (a) setup wording on a crash
console.log('(a)', head(await hook.handleClaudeUserPromptSubmit(inp('set up the hooks and install the toolchain', { session_id: 'a1' }), { ...base, directiveLifecycleStore: new InMemoryDirectiveLifecycleStore() })));
// (b) skipped prompt on a crash
console.log('(b)', head(await hook.handleClaudeUserPromptSubmit(inp('/help', { session_id: 'b1' }), { ...base, directiveLifecycleStore: new InMemoryDirectiveLifecycleStore() })));
// (c) two crashing turns, one known session, one store
const store = new InMemoryDirectiveLifecycleStore();
const fs = await import('node:fs'); const t = `${process.env.TMPDIR}/p009-transcript.jsonl`; fs.writeFileSync(t, 'x');
for (const n of [1, 2]) { fs.appendFileSync(t, 'x'); const o = await hook.handleClaudeUserPromptSubmit(inp(`implement a TypeScript hook ${n}`, { session_id: 'c1', transcript_path: t }), { ...base, directiveLifecycleStore: store }); console.log(`(c) turn ${n} directives=${o.hookSpecificOutput.additionalContext.includes('Directives:')}`); }
fs.rmSync(t);
// (d) policy observation on a crash with runtime pi and a startup event
pp.clearPolicyObservationSink();
await hook.handleClaudeUserPromptSubmit(inp('implement a TypeScript hook', { session_id: 'd1', lifecycle_event: 'startup' }), { ...base, runtime: 'pi', directiveLifecycleStore: new InMemoryDirectiveLifecycleStore() });
console.log('(d) crash records=', pp.getPolicyObservationRecords().length);
pp.clearPolicyObservationSink();
await hook.handleClaudeUserPromptSubmit(inp('implement a TypeScript hook', { session_id: 'd2', lifecycle_event: 'startup' }), { buildCliBrief: async () => ({ ...live, status: 'fail_open', freshness: 'unavailable' }), writeDiagnostic: () => {}, runtime: 'pi', directiveLifecycleStore: new InMemoryDirectiveLifecycleStore() });
console.log('(d) timeout-path records=', pp.getPolicyObservationRecords().length, 'runtimes=', [...new Set(pp.getPolicyObservationRecords().map((r) => r.binding.runtime))].join(','));
// (e) throwing clock
try { const o = await hook.handleClaudeUserPromptSubmit(inp('implement a TypeScript hook'), { ...base, renderBrief: undefined, now: () => { throw new Error('clock'); } }); console.log('(e) resolved', head(o)); } catch (e) { console.log('(e) rejected:', e.message); }
