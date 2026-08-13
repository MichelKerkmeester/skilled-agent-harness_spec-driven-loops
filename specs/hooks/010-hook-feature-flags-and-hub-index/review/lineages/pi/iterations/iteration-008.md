# Iteration 8: D2 Security (broaden) — Plugin registration path + master-switch silencing replay

## Focus
- Dimension: security
- Files: `.opencode/plugins/mk-*.js` (14 plugins), `.opencode/plugins/mk-codex-hooks-watchdog.js:64`, `.opencode/plugins/mk-dist-freshness-guard.js:132`, `.opencode/plugins/mk-spec-memory.js:105`, `.opencode/plugins/mk-skill-advisor.js:361`

## Scorecard
- Dimensions covered: security
- Files reviewed: 14
- New findings: P0=0 P1=0 P2=0
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.00

## Findings
None new. Security replay clean:

- All 14 `mk-*.js` plugins carry `isHookEnabled` guard hits (2-4 each; `mk-post-edit-quality` and `mk-spec-gate` have 4 for their multi-entry surfaces).
- Factory-entry guards verified: `mk-codex-hooks-watchdog.js:64` and `mk-dist-freshness-guard.js:132` short-circuit inside the default-export factory before any `event()` work or log write — so master-off/concern-off yields a no-op plugin with zero side effects.
- `mk-spec-memory.js:105` gates registration via `options.enabled !== false && isHookEnabled('spec-memory')` — the master switch reaches it.
- `mk-skill-advisor.js:361` uses the same pattern for the advisor plugin.
- No plugin was found that registers an event handler or performs I/O before its guard.

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|-------|------|----------|-------|
| spec_code | partial | hard | plugin guards | Security replay clean |
| checklist_evidence | pass | hard | — | unchanged |

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: security
- Novelty justification: Replayed the master-switch silencing claim at the OpenCode plugin layer: every one of the 14 plugins guards at factory entry. This closes the last unexamined security surface from iteration 2 (codex-watchdog, dist-freshness, spec-memory, skill-advisor registration paths).

## Ruled Out
- Plugin-side master-switch bypass: all 14 plugins gate at factory entry before handler registration or I/O. Ruled out.
- Codex-watchdog/dist-freshness silent-operation-under-master: guards at `:64`/`:132` return `{}` before any work. Ruled out.

## Dead Ends
- None.

## Recommended Next Focus
D3 Traceability (broaden) — feature_catalog_code + playbook_capability overlay protocols: verify `system-spec-kit/feature-catalog/ux-hooks/` and manual-testing-playbook claims against the shipped hub.

Review verdict: PASS
