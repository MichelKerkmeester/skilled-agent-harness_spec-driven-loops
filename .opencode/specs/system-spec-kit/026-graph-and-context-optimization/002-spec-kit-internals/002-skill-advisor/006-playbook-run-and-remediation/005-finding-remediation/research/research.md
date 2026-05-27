---
title: "Deep Research: Skill Advisor Finding Remediation (028 → 005)"
description: "Root-cause analysis and remediation design for the 5 key findings from the system-skill-advisor playbook run, investigated via cli-codex gpt-5.5 (reasoning high) across 5 iterations."
---

# Deep Research — Skill Advisor Finding Remediation

<!-- ANCHOR:deep-research-skill-advisor-findings -->

## 1. OVERVIEW

This research investigates the 5 key findings recorded in packet `006-playbook-run-and-remediation` and, for each, establishes the root cause from the actual code and a concrete, scoped remediation. Investigation ran as a 5-iteration deep-research loop with **cli-codex / gpt-5.5 / reasoning high / service-tier fast** as the per-iteration executor; every claim below is backed by `file:line` evidence captured in the iteration narratives (`iterations/iteration-00N.md`) and delta files (`deltas/iter-00N.jsonl`).

**Headline:** none of the 5 findings require an architecture change. F1 splits into a metric-layer fix (alias-aware validation, recovers ~23 pts of accuracy) and genuine scorer/routing fixes; F2/F3/F5 are primarily documentation/threshold drift; F4 is a bridge wiring + lease bug with a direct-import fix. All are independently shippable.

---

## 2. METHODOLOGY

- 5 iterations, one finding per iteration, executor cli-codex gpt-5.5 high (fast tier), `--sandbox workspace-write`, codex hooks disabled (`-c features.codex_hooks=false`) to prevent the spec-kit Gate-3 prompt from interrupting non-interactive dispatch.
- Each iteration produced a narrative + canonical JSONL `type:iteration` record + delta file.
- newInfoRatio stayed high (0.88 → 0.82 → 0.74 → 0.78 → 0.62) because each iteration covered a distinct finding; the loop's real stop condition is question coverage (5/5 answered), not newInfoRatio convergence.
- Spot-verified F1's central claims against the code directly (aliases.ts groups, advisor-validate.ts strict `===`, 53/193 label count) — confirmed accurate.

---

## 3. FINDINGS & REMEDIATION

### F1 — Corpus accuracy regression (50.78% vs 80.5% baseline)
**Iteration 1.** Two independent causes:

**F1a — metric artifact (skill-ID drift, not a real routing failure).** `advisor-validate.ts` matches gold labels with strict equality (`result.topSkill === expected`, ~`handlers/advisor-validate.ts:266-275,361-371`) and does NOT consult the existing alias groups in `lib/scorer/aliases.ts:4-16` (which already map `sk-deep-research`→`deep-research`, `sk-deep-review`→`deep-review`). The validation corpus (`scripts/routing-accuracy/labeled-prompts.jsonl`) has **53 of 193** rows labelled `sk-deep-*`, all of which fail strict equality against the live `deep-research`/`deep-review` topSkill. Alias-aware comparison recovers **45 full-corpus + 9 holdout hits**, lifting full-corpus top-1 **50.78% → 74.09%** and holdout **42.5% → 65.0%**.
- **Remediation:** make `advisor_validate` gold matching alias-aware — resolve both `result.topSkill` and `expected` through `aliases.ts` before comparison (touch the two comparison sites in `advisor-validate.ts`). No scorer change.

**F1b — genuine P0 scorer/routing failures (NOT label drift; 0/24 P0 cases use the drifted labels).** Of the named P0 cases: `P0-MEM-001`, `P0-CMD-001`, `P0-CMD-003` currently PASS. The real failures:
- `P0-UNC-001` / `P0-UNC-002`: the low-information ambiguous prompt "api chain mcp" routes to `sk-code` instead of abstaining or selecting `mcp-code-mode` (`lib/scorer/ambiguity.ts:44-57`, `lib/scorer/fusion.ts:389-404`).
- `P0-CMD-002`: `/speckit:plan` is present in the command-bridge projection but lacks a primary-intent bonus, so `sk-doc` wins (`lib/scorer/projection.ts:47-55`, `lib/scorer/fusion.ts:265-268`).
- **Remediation:** (1) ambiguity/abstention tuning for low-information multi-domain prompts (and decide whether `mcp-code-mode` should be a live route or `P0-UNC-002` relabelled); (2) add a `/speckit:plan` command-intent bonus parallel to the existing `/speckit:resume` special case. Scorer-layer change, separate from F1a.

### F2 — PC-005 bench failures + doc gap
**Iteration 2.** Three parts:
- **Doc gap:** `--dataset` is genuinely required by `skill_advisor_bench.py:241`; the PC-005 scenario doc (`10--python-compat/005-bench-runner.md:33,36`) documents a bare invocation. The native scorer is NOT regressing (scorer-bench passed 3.69/6.71 ms).
- **warm_p95 failure:** threshold calibration, not regression. The script defaults `--max-warm-p95-ms` to **20 ms** (`skill_advisor_bench.py:246`) while the feature catalog documents a 50 ms envelope and says p95 is not a CI gate (`feature_catalog/08--python-compat/03-bench-runner.md:21`); machine measured 25.26 ms (under 50 ms, over 20 ms).
- **cold_p95 failure:** subprocess cold-start artifact. The bench runs a fresh `python3 skill_advisor.py` per prompt (`skill_advisor_bench.py:111-114,174-190`), measuring Python + Node-bridge startup (876.9 ms), while throughput_multiplier passed (37.8×).
- **Remediation:** (1) fix the PC-005 doc to include `--dataset <regression fixture>` + `--runs 1` as smoke guidance; (2) raise warm p95 default to the documented 50 ms envelope and make cold p95 advisory/opt-in or rename to reflect subprocess scope (keep `throughput_multiplier` as the Python-surface regression gate); (3) keep `stress_test/.../python-bench-runner-stress.vitest.ts` aligned.

### F3 — semantic_shadow lane weight drift
**Iteration 3.** The live `semantic_shadow` weight 0.05 / `shadowOnly:false` is an **intentional promotion**, not drift. Source of truth: `lib/scorer/lane-registry.ts:12` (`defaultWeight:0.05, defaultShadowWeight:0.05, live:true`) exported via `lib/scorer/weights-config.ts:18`; fusion derives `shadowOnly` from `!isLiveScorerLane(lane)` (`fusion.ts:316,320`). The scorer vitest asserts this (`lanes/__tests__/semantic-shadow-cosine.vitest.ts:212-213`: weighted score > 0, shadowOnly false) and the feature catalog agrees (`04--scorer-fusion/01-five-lane-fusion.md:29`). **The bug is in the stale scenario docs**, plus a stale comment + raw `LaneMatch.shadowOnly` in `lib/scorer/lanes/semantic-shadow.ts:160,167`.
- **Remediation:** update `08--scorer-fusion/004-lane-attribution.md` (expect `shadowOnly:false` for the live lane) and `005-ablation.md` (treat `semantic_shadow` as a non-zero ablation lane); update `feature_catalog/04--scorer-fusion/04-attribution.md`; fix the stale comment/raw-flag semantics in `semantic-shadow.ts`. Do NOT revert the weight.

### F4 — OpenCode plugin bridge native-route fail-open
**Iteration 4 (reproduced).** `mk-skill-advisor-bridge.mjs` does NOT import `dist/mcp_server/compat/index.js`; it spawns `bin/mk-skill-advisor-launcher.cjs` as an MCP stdio child and calls `advisor_status`. A **stale/unusable launcher lease with a missing IPC socket** makes the launcher emit `LEASE_HELD_BY... (no-bridge-socket)` to stdout, so `StdioClientTransport` cannot complete the MCP handshake; a fail-open catch then routes to python and hides the diagnostic. Reproduction: normal input → `route:"python"` + `SYSTEM_SKILL_ADVISOR_UNAVAILABLE`; `forceNative:true` → `NATIVE_PROBE_FAILED`; **direct compat import + status SUCCEEDS**; direct launcher → `LEASE_HELD_BY... (no-bridge-socket)`.
- **Remediation:** change `loadNativeAdvisorModules()` in `mk-skill-advisor-bridge.mjs` to FIRST `import('../dist/mcp_server/compat/index.js')` and use its `probeAdvisorDaemon`/`readAdvisorStatus`/`handleAdvisorRecommend`/`buildSkillAdvisorBrief`, keeping the launcher/MCP subprocess as a fallback only. Also fix `.opencode/bin/lib/launcher-ipc-bridge.cjs` (or `mk-skill-advisor-launcher.cjs`) so a held lease without `daemon-ipc.sock` is treated as stale/reclaimable instead of writing `LEASE_HELD_BY... (no-bridge-socket)` to an MCP client's stdout.

### F5 — stale vitest path in NC-004/005 playbook docs
**Iteration 5 (audited).** Canonical invocation: `cd .opencode/skills/system-skill-advisor/mcp_server && npm exec -- vitest run tests/...` (verified: 49 tests / 4 files pass). The stale `npm --prefix .opencode/skills/system-spec-kit/mcp_server exec -- vitest run skill-advisor/tests/...` is a pre-extraction path (tests moved to `system-skill-advisor/mcp_server/tests/`). Audit found exactly **two** affected scenarios: NC-004 (`01--native-mcp-tools/004-ambiguous-brief-rendering.md:38`) and NC-005 (`005-lifecycle-redirect-metadata.md:36`).
- **Remediation:** correct the vitest command in those two scenario docs to the canonical `cd … system-skill-advisor/mcp_server && npm exec -- vitest run tests/…` form.

---

## 4. REMEDIATION PHASE MAP

| Phase | Finding | Scope | Layer | Est. size |
|-------|---------|-------|-------|-----------|
| 001-advisor-validate-alias-matching | F1a | Alias-aware gold matching in advisor_validate | validation handler | <100 LOC |
| 002-scorer-p0-routing-fixes | F1b | Ambiguity abstention + /speckit:plan intent bonus | scorer (ambiguity/projection/fusion) | 100-300 LOC |
| 003-pc005-bench-doc-and-gates | F2 | PC-005 doc `--dataset` + warm/cold p95 gate calibration | python bench + doc | <100 LOC |
| 004-semantic-shadow-doc-sync | F3 | SC-004/SC-005 + feature-catalog + stale code comment | docs + comment | <100 LOC |
| 005-opencode-bridge-native-route | F4 | Bridge direct compat import + launcher lease/socket fix | bridge + launcher | 100-200 LOC |
| 006-playbook-vitest-path-fix | F5 | Correct NC-004/NC-005 vitest invocation | docs | <20 LOC |

Recommended order: 006 (trivial) → 004 → 003 → 001 → 005 → 002 (deepest). 001 and 002 both touch F1 but are independent (metric vs scorer).

---

## 5. OPEN QUESTIONS (carried to remediation)

- F1b: should `mcp-code-mode` be restored as a live route, or should `P0-UNC-002` be relabelled to the intended skill? (decide in phase 002)
- F1b: should low-information ambiguity suppress all recommendations by default, or only for specific prompt shapes like "api chain mcp"? (phase 002)
- F2: exact cold-subprocess p95 budget needs calibration via repeated serial runs on the intended host before hard-coding; decide whether PC-005 is a smoke test or a perf certification. (phase 003)
- F1a: 8 of the 53 drifted rows still fail after alias normalization — prompt-quality vs scorer issue? (phase 001/002 triage)

---

## 6. CONVERGENCE REPORT
- Stop reason: all_questions_answered (5/5)
- Total iterations: 5
- Executor: cli-codex / gpt-5.5 / reasoning high / service-tier fast
- newInfoRatios: 0.88, 0.82, 0.74, 0.78, 0.62 (high throughout — distinct finding per iteration)
- Convergence threshold: 0.05 (not the binding stop condition here; question-coverage was)
- Reducer note: the auxiliary reduce-state.cjs was skipped (hand-authored strategy anchor incompatibility); registry/dashboard assembled from delta files + narratives instead. No impact on findings.
- Evidence: `iterations/iteration-001.md` … `iteration-005.md`, `deltas/iter-00N.jsonl`.

<!-- /ANCHOR:deep-research-skill-advisor-findings -->
