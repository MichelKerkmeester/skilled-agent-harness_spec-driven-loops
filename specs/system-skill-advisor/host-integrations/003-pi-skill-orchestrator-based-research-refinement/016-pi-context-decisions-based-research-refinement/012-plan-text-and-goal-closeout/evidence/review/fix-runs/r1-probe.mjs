// Three-turn replay against the built hook: a confident docs turn, a floored
// non-weak topic change, then a weak follow-up that floors to the new topic.
const dist = process.argv[2];
const { handleClaudeUserPromptSubmit } = await import(`${dist}/hooks/claude/user-prompt-submit.js`);
const { InMemoryRouteReceiptStore } = await import(`${dist}/hooks/lib/route-receipt.js`);
const { InMemoryDirectiveLifecycleStore } = await import(`${dist}/hooks/lib/directive-lifecycle.js`);
const { renderAdvisorBrief } = await import(`${dist}/runtime/lib/render.js`);

const base = {
  status: 'ok',
  freshness: 'live',
  brief: null,
  recommendations: [],
  diagnostics: null,
  metrics: { durationMs: 1, cacheHit: false, subprocessInvoked: true, retriesAttempted: 0, recommendationCount: 1, tokenCap: 80 },
  generatedAt: new Date().toISOString(),
  sharedPayload: null,
};
const routed = (skill, confidence, floored) => ({
  ...base,
  recommendations: [{ skill, confidence, uncertainty: 0.2, passes_threshold: true, ...(floored ? { confidenceFloored: true } : {}) }],
});
const stores = { lifecycle: new InMemoryDirectiveLifecycleStore(), receipts: new InMemoryRouteReceiptStore() };
async function turn(prompt, result) {
  const out = await handleClaudeUserPromptSubmit(
    { hook_event_name: 'UserPromptSubmit', cwd: process.cwd(), prompt, session_id: 'r1-probe' },
    { buildCliBrief: async () => result, renderBrief: renderAdvisorBrief, writeDiagnostic: () => {}, directiveLifecycleStore: stores.lifecycle, routeReceiptStore: stores.receipts },
  );
  const text = out.hookSpecificOutput?.additionalContext ?? '';
  return text.split('\n', 1)[0];
}
console.log('turn1', await turn('Update the advisor README to document the new corpus file layout', routed('sk-doc', 0.9373, false)));
console.log('turn2', await turn('Refactor the session store module to remove duplicated locking code', routed('sk-code', 0.82, true)));
console.log('receipt after turn2', stores.receipts.read('r1-probe')?.skill ?? null);
console.log('turn3', await turn('add tests for it as well', routed('sk-code', 0.82, true)));
