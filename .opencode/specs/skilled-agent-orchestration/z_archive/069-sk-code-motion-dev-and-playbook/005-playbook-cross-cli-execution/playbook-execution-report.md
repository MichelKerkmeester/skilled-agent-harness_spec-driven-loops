# Playbook Execution Report — Cross-CLI Smart-Routing Audit (Packet 069/005)

## VERDICT
**Overall**: CONDITIONAL
**Date**: 2026-05-05
**Scenarios**: 24 (across 7 categories)
**CLIs**: 4 (codex, copilot, gemini, opencode)
**Total dispatches**: 52 (24 codex + 9×3 representatives + 1 smoke)
**Coverage**: full (all 24 codex; 9 representatives × 4 CLIs)

## EXECUTIVE SUMMARY
Smart routing works for the majority path, but it is not green across the matrix. Excluding the harness smoke row, the audit produced 35 PASS, 12 PARTIAL, 4 FAIL, and 0 SKIP verdicts. Codex covered all 24 scenarios with 83.3% pass accuracy; Copilot was perfect on the 9 representative scenarios; Gemini and OpenCode were useful but less path-precise.

The cross-stack Motion.dev architecture is directionally validated. 29/29 cross-stack dispatches loaded some Motion reference, 28/29 loaded canonical `references/motion_dev/*` paths, and 12/14 Webflow-owned cross-stack dispatches loaded Motion.dev as a peer alongside Webflow guidance. The main break is not Motion omission; it is surface overreach on explicit non-Webflow vanilla prompts.

The most serious failures are two critical-path routing classes: RD-002 doc-only edits still routed to `sk-code` in Codex/OpenCode, and CS-002 generic non-Webflow Motion.dev work was misclassified as WEBFLOW by Gemini/OpenCode. That makes the overall verdict CONDITIONAL rather than PASS_WITH_NOTES.

## VERDICT MATRIX

| Scenario | codex | copilot | gemini | opencode |
|---|---|---|---|---|
| SD-001 | PASS | PASS | PARTIAL | PARTIAL |
| SD-002 | PASS | N-T | N-T | N-T |
| SD-003 | PASS | N-T | N-T | N-T |
| LS-001 | PARTIAL | PASS | PASS | PASS |
| LS-002 | PASS | N-T | N-T | N-T |
| LS-003 | PASS | N-T | N-T | N-T |
| LS-004 | PASS | N-T | N-T | N-T |
| RD-001 | PASS | N-T | N-T | N-T |
| RD-002 | FAIL | PASS | PASS | FAIL |
| SA-001 | PASS | PASS | PARTIAL | PARTIAL |
| MR-001 | PASS | PASS | PASS | PARTIAL |
| MR-002 | PASS | N-T | N-T | N-T |
| MR-003 | PASS | N-T | N-T | N-T |
| MR-004 | PASS | N-T | N-T | N-T |
| CB-001 | PASS | N-T | N-T | N-T |
| CB-002 | PASS | PASS | PARTIAL | PARTIAL |
| CB-003 | PASS | N-T | N-T | N-T |
| CS-001 | PASS | PASS | PARTIAL | PASS |
| CS-002 | PASS | PASS | FAIL | FAIL |
| CS-003 | PASS | PASS | PARTIAL | PASS |
| CS-004 | PARTIAL | N-T | N-T | N-T |
| CS-005 | PARTIAL | N-T | N-T | N-T |
| CS-006 | PASS | N-T | N-T | N-T |
| CS-007 | PASS | N-T | N-T | N-T |

## CROSS-AI ACCURACY RANKING

| Rank | CLI | PASS count | PARTIAL | FAIL | Accuracy % |
|---|---|---|---|---|---|
| 1 | copilot | 9/9 | 0 | 0 | 100.0% |
| 2 | codex | 20/24 | 3 | 1 | 83.3% |
| 3 | gemini | 3/9 | 5 | 1 | 33.3% |
| 4 | opencode | 3/9 | 4 | 2 | 33.3% |

Accuracy is PASS-only over tested non-smoke dispatches; PARTIAL is not counted as accurate.

## TOKEN-EFFICIENCY (per CLI, avg duration_s as proxy if tokens_in/out null)

| CLI | Avg duration (s) | Avg refs loaded | Notes |
|---|---|---|---|
| codex | 38.3 | 8.2 | Fastest broad full-coverage runner. |
| copilot | 73.6 | 10.2 | Most accurate representative subset but slowest average. |
| gemini | 76.2 | 5.4 | Slow and sparse refs; often broad or alternate advisor top-1. |
| opencode | 44.8 | 7.3 | Second-fastest representative subset; several broad/non-canonical refs. |

## CROSS-STACK HYPOTHESIS VERDICT

The headline question: **"When an AI is routed to WEBFLOW for animation work, does it load motion_dev/* as a peer cross-stack reference?"**

Evidence from CS-001/CS-002/CS-003/CS-004/CS-005/CS-006/CS-007 and MR-* and CB-* results:
- Codex loaded canonical Motion.dev refs in 14/14 cross-stack dispatches and paired them with Webflow refs in all 5 Webflow-owned cross-stack Codex dispatches.
- Copilot loaded canonical Motion.dev refs in 5/5 representative cross-stack dispatches and paired Webflow/Motion correctly where expected.
- Gemini loaded Motion.dev refs in 5/5, but advisor top-1 and path precision drifted on CS-001, CS-002, CS-003, and CB-002.
- OpenCode loaded canonical Motion.dev refs in 4/5; MR-001 used a non-canonical `references/motion/` path and CS-002 misdetected surface as WEBFLOW.
- 28/29 cross-stack dispatches loaded canonical `motion_dev/` paths; 12/14 Webflow-owned cross-stack dispatches loaded Webflow and Motion.dev together.
- **Verdict**: PARTIALLY_PROVEN — the cross-stack peer architecture works in practice for Codex/Copilot and for most Webflow-owned cases, but generic non-Webflow safeguards and path precision need tuning.

## FINDINGS LEDGER

### P0 (Blockers — any AI mis-routes a critical-path scenario)
- [F-001] Severity: P0 | Scenario: RD-002 | CLI: codex, opencode | Issue: Doc-only SKILL.md headline edits routed to `sk-code` instead of `sk-doc`. | Recommendation: Tune advisor weights so markdown/headline/SKILL.md documentation edits favor `sk-doc` and add anti-signals to `sk-code`.
- [F-002] Severity: P0 | Scenario: CS-002 | CLI: gemini, opencode | Issue: Explicit non-Webflow vanilla Motion.dev work was classified as WEBFLOW. | Recommendation: Strengthen the generic-node guard and add a negative marker for explicit "not Webflow" prompts before WEBFLOW fallback logic.

### P1 (Required — partial routing on important scenarios)
- [F-003] Severity: P1 | Scenario: CS-001 | CLI: gemini | Issue: WEBFLOW was correct, but required Motion quick-start and in-view snippet assets were incomplete and advisor top-1 was `mcp-coco-index`. | Recommendation: Require exact Motion.dev asset paths in cross-stack output checks.
- [F-004] Severity: P1 | Scenario: CS-003 | CLI: gemini | Issue: OPENCODE precedence was correct, but refs were coarse directory placeholders. | Recommendation: Teach result emitters to name exact files, not directories.
- [F-005] Severity: P1 | Scenario: SD-001 | CLI: gemini, opencode | Issue: Surface was correct, but Webflow implementation refs were below the contract threshold. | Recommendation: Ensure WEBFLOW detection loads the implementation trio consistently.
- [F-006] Severity: P1 | Scenario: CB-002, SA-001 | CLI: gemini, opencode | Issue: Performance/decision refs were relevant but incomplete or broad. | Recommendation: Normalize performance and decision-matrix resource names in `references/router/resource_loading.md`.
- [F-007] Severity: P1 | Scenario: LS-001 | CLI: codex | Issue: TypeScript refs were right, but advisor top-1 was `system-spec-kit` instead of `sk-code`. | Recommendation: Lower system-spec-kit weight for direct executable-code edits under `.opencode/`.
- [F-008] Severity: P1 | Scenario: CS-004, CS-005 | CLI: codex | Issue: Decision/snippet routes were useful but missed contract details: UNKNOWN/N/A surface for CS-004, and in-view snippet plus snake_case caveat for CS-005. | Recommendation: Add contract-specific regression examples to Motion.dev routing docs.

### P2 (Polish observations)
- [F-009] Severity: P2 | Scenario: multiple | CLI: gemini, opencode | Issue: Several results used broad directory refs or empty normalized excerpts. | Recommendation: Harden YAML extraction to preserve `assets_loaded` and response excerpts, and reject directory placeholders when exact paths are expected.

## CRITICAL-PATH SCENARIOS (gating)

| Scenario | Required for green | Per-CLI verdict | Headline blocker? |
|---|---|---|---|
| SD-001, SD-002, SD-003 | surface detection | SD-001: codex PASS, copilot PASS, gemini PARTIAL, opencode PARTIAL; SD-002: codex PASS; SD-003: codex PASS | No hard blocker; SD-001 has partial ref coverage. |
| RD-002 | sk-code vs sk-doc | codex FAIL, copilot PASS, gemini PASS, opencode FAIL | Yes — Codex/OpenCode route doc edit to sk-code. |
| SA-001 | advisor probe | codex PASS, copilot PASS, gemini PARTIAL, opencode PARTIAL | No hard blocker; ref coverage needs tightening. |
| CS-001 | Webflow + motion.dev | codex PASS, copilot PASS, gemini PARTIAL, opencode PASS | No hard blocker; Gemini is partial. |
| CS-002 | non-Webflow + motion.dev | codex PASS, copilot PASS, gemini FAIL, opencode FAIL | Yes — generic non-Webflow guard fails in Gemini/OpenCode. |
| CS-003 | OPENCODE + motion.dev | codex PASS, copilot PASS, gemini PARTIAL, opencode PASS | No hard blocker; Gemini path precision is partial. |

## RECOMMENDATIONS

1. **Smart-router fixes**: update `references/router/code_surface_detection.md` and `references/router/resource_loading.md` so explicit non-Webflow vanilla prompts remain UNKNOWN/N/A while still loading `motion_dev/*`.
2. **Skill-advisor weights**: tune `skill-graph.json` so RD-002-style markdown/headline updates select `sk-doc`; add negative keywords to `sk-code` for doc-only edit language.
3. **Documentation gaps**: clarify that cross-stack Motion.dev results must name exact `references/motion_dev/*` files and exact snippet assets, not directory placeholders.
4. **CLI-specific notes**: keep Copilot as the highest-accuracy representative runner, use Codex as the full-coverage baseline, and treat Gemini/OpenCode as secondary until path precision and CS-002 routing improve.

## POSITIVE OBSERVATIONS

- Codex passed 20/24 full-coverage scenarios and caught the intended Motion.dev peer-loading pattern in every cross-stack Codex dispatch.
- Copilot passed all 9 representative scenarios, including CS-001, CS-002, CS-003, RD-002, and CB-002.
- OPENCODE precedence is broadly stable: CS-003 passed for Codex, Copilot, and OpenCode, with Gemini still identifying OPENCODE despite weaker refs.
- Motion.dev peer refs were almost always loaded; the architecture failure mode is mostly surface/advisor precision, not absence of Motion.dev context.

## METHODOLOGY NOTES

- Read-only sandbox per dispatch (no file writes during routing analysis)
- Concurrency cap 5 per playbook standard
- Universal YAML test prompt template ensured cross-CLI comparability
- 19/52 results from initial run + 33/52 from resume run after a runner-script `wait -n` portability fix

## ITERATION INDEX

- Phase A: 7 CS-* scenarios authored
- Phase B: harness + scripts + universal test prompt
- Phase C: 52 dispatches across 4 CLIs
- Phase D: this report
- Phase E: commit + memory:save (next)
