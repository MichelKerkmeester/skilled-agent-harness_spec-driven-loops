const D = process.argv[2];
const hook = await import(`${D}/hooks/claude/user-prompt-submit.js`);
const { InMemoryDirectiveLifecycleStore } = await import(`${D}/hooks/lib/directive-lifecycle.js`);
const fo = { status: 'fail_open', freshness: 'unavailable', brief: null, recommendations: [], diagnostics: null, metrics: { durationMs: 0, cacheHit: false, degraded: false }, sharedPayload: null };
const head = (o) => ('hookSpecificOutput' in o ? o.hookSpecificOutput.additionalContext.split('\n')[0] : JSON.stringify(o));
for (const p of ['set up the hooks and install the toolchain', '/help']) {
  const o = await hook.handleClaudeUserPromptSubmit({ hook_event_name: 'UserPromptSubmit', prompt: p, cwd: process.cwd(), session_id: 'x' }, { buildCliBrief: async () => fo, writeDiagnostic: () => {}, directiveLifecycleStore: new InMemoryDirectiveLifecycleStore() });
  console.log(`timeout path [${p}]`, head(o));
}
