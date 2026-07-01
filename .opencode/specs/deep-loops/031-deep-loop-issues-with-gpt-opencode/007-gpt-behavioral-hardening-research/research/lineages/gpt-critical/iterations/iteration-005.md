# Iteration 5: Plugin Guard Mechanism and Limits

## Focus

Check whether the route-enforcement plugin can be concrete and what it cannot guarantee.

## Findings

1. Local OpenCode auto-loads `.opencode/plugins/*.js`, with current entrypoints including `mk-skill-advisor`, `mk-code-graph`, `mk-spec-memory`, `mk-goal`, and `session-cleanup`. [SOURCE: .opencode/plugins/README.md:24-50]
2. The installed plugin type exposes `command.execute.before`, `tool.execute.before`, `experimental.chat.system.transform`, and `experimental.chat.messages.transform`. `tool.execute.before` receives `tool`, `sessionID`, `callID` and mutable `output.args`. [SOURCE: .opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:225-241]
3. Existing code already uses system/messages transforms to inject compact context. [SOURCE: .opencode/plugins/mk-code-graph.js:442-518]
4. Concrete plugin shape: for Task calls or command execution involving `/deep:*` / deep leaves, inject or mutate a compact route contract generated from `mode-registry.json`; assert that prompt fields do not contradict canonical `workflowMode`, `agent`, and artifact root; emit diagnostics if raw slash text is used where `--command` is required.
5. Limit: the type surface proves mutation/injection, not direct rejection. Whether `tool.execute.before` can fail-closed by throwing or setting denial state needs a smoke test. It also cannot prove semantic correctness after a schema-valid artifact is written.

## Sources Consulted

- `.opencode/plugins/README.md:24-50`
- `.opencode/node_modules/@opencode-ai/plugin/dist/index.d.ts:225-241,259-270`
- `.opencode/plugins/mk-code-graph.js:442-518`
- `.opencode/skills/deep-loop-workflows/mode-registry.json:18-80`

## Assessment

- newInfoRatio: 0.62
- Novelty justification: It replaces analogical plugin feasibility with the actual installed hook surface and a named open question.
- Confidence: 0.78

## Reflection

- What worked: Reading plugin types instead of only existing plugin examples.
- What failed: Prior "enforcement" wording was too strong if fail-closed rejection is untested.
- Ruled out: Plugin guard as hard custom-agent identity.

## Recommended Next Focus

Redesign the benchmark around mechanism measurement, not symptom existence.
