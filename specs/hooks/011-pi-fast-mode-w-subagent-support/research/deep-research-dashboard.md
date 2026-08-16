---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Fork pi-openai-fast-mode into pi-fast-mode-w-subagent-support with subagent handoff — everything needed to implement properly: pi extension API surface, env-inheritance handoff mechanics, config compat, packaging, tests, indicator UX under custom footers, licensing.
- Started: 2026-08-16T07:40:22.286Z
- Status: COMPLETE
- Iteration: 10 of 10
- Session ID: rsr-2026-08-16T07-38-38Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | pi Extension API surface for the fork: before_provider_request payload mutation semantics; session_start/model_select/session_shutdown ordering; registerCommand/registerFlag; hasUI gating; ui.setWidget vs ui.setStatus rendering rules | extension-api | 1.00 | 8 | complete |
| 2 | Subagent handoff mechanics: pi-subagents child pi spawn; process.env propagation; official env surface; PI_GPT_FAST_MODE behavior; toggle/session_start semantics | subagent-handoff | 1.00 | 6 | complete |
| 3 | Env-var namespace hygiene: collision scan of PI_* vars across installed packages, git sources, and Public .pi; naming conventions; PI_FAST_MODE_W_SUBAGENT_SUPPORT fit | env-namespace | 0.83 | 6 | complete |
| 4 | Config compatibility & migration: pi-openai-fast-mode schema and self-upgrade; pi-gpt-fast-mode models list; migration path; both-configs-read question | config-compat | 1.00 | 7 | complete |
| 5 | /fast command collision: duplicate command/flag registration behavior; safe install/remove ordering; verification method | command-collision | 0.92 | 6 | complete |
| 6 | Packaging & install mechanics: pi install local/git/npm; package.json pi.extensions; raw TypeScript; tsconfig; pi.dev/npm indexing; publish checklist | packaging-install | 1.00 | 8 | complete |
| 7 | Testing patterns: upstream ExtensionAPI mocks; vitest setup for raw TypeScript; env-inheritance child-process tests; coverage expectations | testing | 1.00 | 7 | complete |
| 8 | Indicator UX under custom footers: pi-statusline setFooter replacement vs widget placement; custom footer behavior; status fallback; recommendation | indicator-ux | 0.93 | 7 | complete |
| 9 | TheBinaryGuy pi-fast-mode edge cases worth adopting: footer-composition wrapper; atomic state writes; service_tier guard; payload.model guard; supportsFastMode regex; adopt vs reject | tbg-edge-cases | 0.93 | 7 | complete |
| 10 | Licensing, notices, docs, maintenance: MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key | licensing-docs-maintenance | 0.94 | 8 | complete |

- iterationsCompleted: 10
- keyFindings: 74
- openQuestions: 11
- resolvedQuestions: 9

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 9/20
- [x] pi Extension API surface for the fork: before_provider_request payload mutation semantics; session_start/model_select/session_shutdown ordering; registerCommand/registerFlag; hasUI gating; ui.setWidget vs ui.setStatus rendering rules
- [x] Env-var namespace hygiene: collision scan of PI_* vars across installed packages, git sources, and Public .pi; naming conventions; PI_FAST_MODE_W_SUBAGENT_SUPPORT fit
- [x] Config compatibility & migration: pi-openai-fast-mode schema and self-upgrade; pi-gpt-fast-mode models list; migration path; both-configs-read question
- [x] /fast command collision: duplicate command/flag registration behavior; safe install/remove ordering; verification method
- [x] Packaging & install mechanics: pi install local/git/npm; package.json pi.extensions; raw TypeScript; tsconfig; pi.dev/npm indexing; publish checklist
- [x] Testing patterns: upstream ExtensionAPI mocks; vitest setup for raw TypeScript; env-inheritance child-process tests; coverage expectations
- [x] Indicator UX under custom footers: pi-statusline setFooter replacement vs widget placement; custom footer behavior; status fallback; recommendation
- [x] TheBinaryGuy pi-fast-mode edge cases worth adopting: footer-composition wrapper; atomic state writes; service_tier guard; payload.model guard; supportsFastMode regex; adopt vs reject
- [x] Licensing, notices, docs, maintenance: MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key
- [ ] Subagent handoff mechanics: how pi-subagents spawns child pi processes; process.env propagation; official env surface; PI_GPT_FAST_MODE behavior; toggle/session_start semantics [operator]
- [ ] 1. pi Extension API surface for the fork: before_provider_request payload mutation semantics; session_start/model_select/session_shutdown ordering; registerCommand/registerFlag; hasUI gating; ui.setWidget vs ui.setStatus rendering rules [legacy-import]
- [ ] 2. Subagent handoff mechanics: how pi-subagents spawns child pi processes; process.env propagation; official env surface; PI_GPT_FAST_MODE behavior; toggle/session_start semantics [legacy-import]
- [ ] 3. Env-var namespace hygiene: collision scan of PI_* vars across installed packages, git sources, and Public .pi; naming conventions; PI_FAST_MODE_W_SUBAGENT_SUPPORT fit [legacy-import]
- [ ] 4. Config compatibility & migration: pi-openai-fast-mode schema and self-upgrade; pi-gpt-fast-mode models list; migration path; both-configs-read question [legacy-import]
- [ ] 5. /fast command collision: duplicate command/flag registration behavior; safe install/remove ordering; verification method [legacy-import]
- [ ] 6. Packaging & install mechanics: pi install local/git/npm; package.json pi.extensions; raw TypeScript; tsconfig; pi.dev/npm indexing; publish checklist [legacy-import]
- [ ] 7. Testing patterns: upstream ExtensionAPI mocks; vitest setup for raw TypeScript; env-inheritance child-process tests; coverage expectations [legacy-import]
- [ ] 8. Indicator UX under custom footers: pi-statusline setFooter replacement vs widget placement; custom footer behavior; status fallback; recommendation [legacy-import]
- [ ] 9. TheBinaryGuy pi-fast-mode edge cases worth adopting: footer-composition wrapper; atomic state writes; service_tier guard; payload.model guard; supportsFastMode regex; adopt vs reject [legacy-import]
- [ ] 10. Licensing, notices, docs, maintenance: MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 11
- [ ] Subagent handoff mechanics: how pi-subagents spawns child pi processes; process.env propagation; official env surface; PI_GPT_FAST_MODE behavior; toggle/session_start semantics
- [ ] 1. pi Extension API surface for the fork: before_provider_request payload mutation semantics; session_start/model_select/session_shutdown ordering; registerCommand/registerFlag; hasUI gating; ui.setWidget vs ui.setStatus rendering rules
- [ ] 2. Subagent handoff mechanics: how pi-subagents spawns child pi processes; process.env propagation; official env surface; PI_GPT_FAST_MODE behavior; toggle/session_start semantics
- [ ] 3. Env-var namespace hygiene: collision scan of PI_* vars across installed packages, git sources, and Public .pi; naming conventions; PI_FAST_MODE_W_SUBAGENT_SUPPORT fit
- [ ] 4. Config compatibility & migration: pi-openai-fast-mode schema and self-upgrade; pi-gpt-fast-mode models list; migration path; both-configs-read question
- [ ] 5. /fast command collision: duplicate command/flag registration behavior; safe install/remove ordering; verification method
- [ ] 6. Packaging & install mechanics: pi install local/git/npm; package.json pi.extensions; raw TypeScript; tsconfig; pi.dev/npm indexing; publish checklist
- [ ] 7. Testing patterns: upstream ExtensionAPI mocks; vitest setup for raw TypeScript; env-inheritance child-process tests; coverage expectations
- [ ] 8. Indicator UX under custom footers: pi-statusline setFooter replacement vs widget placement; custom footer behavior; status fallback; recommendation
- [ ] 9. TheBinaryGuy pi-fast-mode edge cases worth adopting: footer-composition wrapper; atomic state writes; service_tier guard; payload.model guard; supportsFastMode regex; adopt vs reject
- [ ] 10. Licensing, notices, docs, maintenance: MIT compliance; THIRD_PARTY_NOTICES; README provenance; PLUGINS.md and sync-manifest; npm keywords and pi key

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███▅▂▄▇▇▅▆▇███▆▅▅▅▅▆
- score sparkline: ███▅▂▄▇▇▅▆▇███▆▅▅▅▅▆
- Last 3 ratios: 0.93 -> 0.93 -> 0.94
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.94
- coverageBySources: {"code":87,"other":41}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None this iteration. No exhausted-approach category applies to lane 2 yet. (iteration 2)
- Reading `dist/` bundles instead of `src/` of pi-subagents (src is present and authoritative; dist would add noise). (iteration 2)
- Searching npm registry metadata for pi-subagents spawn internals (installed source is the ground truth). (iteration 2)
- pi-fast-mode (TheBinaryGuy) as a config-migration source: no config schema exists to migrate (finding 5). Candidate for reducer "Exhausted Approaches" only for config-lane purposes, not for its other lanes (footer/guards remain open in Q9). (iteration 4)
- Searching for a dual-read config pattern in the three implementations: none exists; single-path resolution is universal (finding 6). (iteration 4)
- Treating pi-gpt-fast-mode's `models` array as directly reusable for the fork: schema (`persist/desired/tier/models/indicator`) is semantically different from pi-openai-fast-mode's `enabled/targets`; the fork's models list must be decided on its own (finding 4). (iteration 4)
- None definitively eliminated this iteration. The suffix-renumbering-on-remove behavior is an inference, not an observation; it is a candidate verification step for the testing lane (Q7), not a dead end. (iteration 5)
- None this iteration. No BLOCKED exhausted-approach category applies to lane 5; prior exhausted entries (reading dist bundles over src, npm-registry spawn hunting) were respected and not retried. (iteration 5)
- None definitively eliminated this iteration. Candidate verification steps for Q7 (testing lane): empirical `pi install ./local` + `pi -e` smoke runs, and confirming jiti version pinning in the installed pi build. (iteration 6)
- Reading npm-registry metadata to validate `pi.extensions`/keywords (respects iteration-2 exhausted entry; installed docs + dist + shipped manifests are the ground truth and were sufficient). (iteration 6)
- Treating any of the three upstream `files`/keyword sets as mandatory verbatim — they are exemplars, not a spec; the fork's `pi.extensions` entry path is its own decision (finding 3/7). (iteration 6)
- Reusing pi-gpt-fast-mode's `node --test` runner for the fork: phase-003 plan.md explicitly mandates Vitest for both unit and integration suites; node:test is evidence of a viable zero-dep alternative but not the fork's chosen lane. [SOURCE: 003-integration-and-tests/plan.md:142-143] (iteration 7)
- Searching for vitest coverage thresholds upstream: none configured anywhere (finding 6). (iteration 7)
- Searching installed pi-subagents for a test suite to port: none exists (finding 7). Not a blocker for the fork — handoff tests are net-new authoring. (iteration 7)
- Testing the fork's extension by mocking the `@earendil-works/pi-coding-agent` module wholesale: no upstream does this; structural fakes (openai) or type-only imports (TBG) are the shipped precedents. (iteration 7)
- **pi-statusline's `placement: "widget"` as the initial fork indicator** — viable but not needed; deferred to a later config knob (finding 7). Not eliminated. (iteration 8)
- **setFooter as the fork's indicator** — eliminated on two independent grounds: RPC no-op (finding 5) and footer exclusivity/status displacement (finding 4). Recorded as a candidate for reducer "Exhausted Approaches" (lane-8 scope). (iteration 8)
- None. Both candidate UX models (setFooter replacement, widget placement) were confirmed live in the shipped pi-statusline source; no approach in this lane failed. (iteration 8)
- Adopting TBG's gpt-5.6 `supportsFastMode` regex as the fork's model gate as-is — model family mismatch; the fork's gate is config-driven (iteration-4 finding 27). The pure-gate PATTERN is adopted, not the regex. (iteration 9)
- Footer-composition wrapper as the fork's DEFAULT indicator — single-slot footer displaces other compositors; setStatus remains primary (iteration-8 finding 55). (iteration 9)
- None definitively eliminated this iteration. Candidate for later verification: whether TBG's wrapper actually renders in a live TUI (its own suite mocks `ui.setFooter`, so real-runtime rendering is unproven by its tests). (iteration 9)
- None this iteration. No BLOCKED exhausted category applies to lane 10; prior exhausted entries (dist over src, npm-registry spawn hunting) were respected. (iteration 10)
- npm-registry metadata validation of keywords/pi key — respects iteration-6 exhausted entry; shipped manifests + installed docs are ground truth. (iteration 10)
- Separate THIRD_PARTY_NOTICES file as a fork deliverable — none of the three upstreams ships one and CHK-012 defines retained LICENSE attribution as the notice mechanism. Recorded for reducer "Exhausted Approaches" if desired. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
None. All 10 approved lanes answered.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.40
- graphDecision: MAX_ITERATIONS_REACHED
- Blocker: source_diversity_guard
- Blocker: evidence_depth_guard

<!-- /ANCHOR:graph-convergence -->
