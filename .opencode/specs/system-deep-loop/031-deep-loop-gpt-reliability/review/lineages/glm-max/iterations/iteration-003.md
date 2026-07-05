# Iteration 3: D2 Security — mk-deep-loop-guard plugin trust boundaries

## Focus
Dimension: D2 Security. Audit `.opencode/plugins/mk-deep-loop-guard.js` (the packet's central enforcement artifact) for trust-boundary correctness, fail-closed/fail-open semantics, env-var exposure, loop-repeat detection integrity, and registry coupling. Verify the plugin's claimed hard limits hold and no silent bypass exists.

## Scorecard
- Dimensions covered: security
- Files reviewed: 2 (mk-deep-loop-guard.js, mode-registry.json structure)
- New findings: P0=0 P1=0 P2=2
- Refined findings: P0=0 P1=0 P2=0
- New findings ratio: 0.18

## Findings

### P1, Required
(none — no exploitable security vulnerability found)

### P2, Suggestion

- **F007**: Loop-guard state files accumulate unbounded with no expiry/cleanup, `mk-deep-loop-guard.js:131-146`
  - `writeLoopStateAtomic` writes one JSON file per session to `.opencode/skills/.loop-guard-state/{hex(sessionID)}.json` and is never deleted by the plugin. Across many sessions this directory grows without bound. There is no TTL, max-file, or sweep mechanism. On a heavily-used workspace this becomes unbounded on-disk state.
  - Severity P2: affects disk hygiene, not dispatch correctness or security boundary. Local dev tool, low blast radius.
  - [SOURCE: mk-deep-loop-guard.js:117-146 (loopStatePath + writeLoopStateAtomic, no unlink on session end)]

- **F008**: Guard's blocking (throw) is opt-in via env vars; default path only warns, `mk-deep-loop-guard.js:233,246-250`
  - Both checks (mode mismatch line 233, loop repeat lines 246-248) only `throw` when `MK_DEEP_LOOP_GUARD_REJECT` / `MK_DEEP_LOOP_GUARD_REJECT_LOOP` == `'1'`; otherwise they emit `console.error` warnings. An operator relying on the guard to *block* without setting these env vars gets passive warnings only. spec.md phase 011 documents this as a "configurable toggle", so it is intended — but the fail-closed guarantee the packet headlines ("throw genuinely blocks dispatch") holds only under the non-default env setting.
  - Severity P2: documented/intended behavior; flagged as an advisory footgun for operators who assume enforcement is on by default.
  - [SOURCE: mk-deep-loop-guard.js:233,246-250; spec.md:88]

## Cross-Reference Results
| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| feature_catalog_code | partial | advisory | mk-deep-loop-guard.js:225-251 | Plugin's two-check design (mode mismatch + loop repeat) matches phase 017/catalog F050 claims; `resolveTargetIdentity` correctly fixes the documented `subagent_type="general"` no-op. Registry coupling verified: `mode.agent` (map key) and `mode.workflowMode` (comparison field) both exist in mode-registry.json. |

## Assessment
- New findings ratio: 0.18 (2 advisory P2 findings; the security surface is essentially clean)
- Dimensions addressed: security
- Novelty justification: The plugin is correctly fail-open by design (lines 202-205, 252-255) and its hard limits (no hard identity, semantic blindness, session-scoped loop detection) are explicitly documented and hold. The two findings are advisory (disk hygiene, opt-in enforcement), not vulnerabilities. This rules out the highest-risk security concern (a silent dispatch bypass or an unguarded throw).

## Ruled Out
- Silent dispatch bypass: ruled out — every code path either warns, throws (under env), or returns; the outer catch only swallows non-guard errors and re-throws the guard's own `mk-deep-loop-guard:`-prefixed throws (lines 252-253). (iteration 3, evidence: mk-deep-loop-guard.js:215-256)
- Registry-coupling mismatch: ruled out — loadRegistryAgents keys by `mode.agent`, comparison reads `entry.workflowMode`; both fields present in mode-registry.json (verified via node introspection). (iteration 3, evidence: mode-registry.json first mode object)

## Dead Ends
- Checked `declaredModeFromPrompt` case sensitivity (`/mode=([a-z0-9-]+)/i` captures original case while matching case-insensitively): a prompt declaring `mode=Context` would capture "Context" and false-positive-warn against registry "context". Rejected as a finding — deep-mode prompts consistently emit lowercase `mode=` values, so this is a theoretical edge case, not an observed defect.

## Recommended Next Focus
- Dimension: D4 Maintainability — cross-doc consistency: mirror parity (.opencode vs .claude), checklist evidence in implemented phases, before-vs-after.md / timeline alignment, and the remaining phase implementation-summaries for documentation drift.

Review verdict: PASS
