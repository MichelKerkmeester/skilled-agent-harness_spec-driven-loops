# Iteration 7 — Traceability (Opus second-opinion deep review)

## STATE

- Review target: two-lane deep-agent-improvement program (phases 008-013), post-015-remediation.
- Iteration 7 of 10. Dimension focus: **traceability** (`spec_code` core protocol, plus skill_agent / feature_catalog_code overlays).
- Prior iterations reported 1 P0-equivalent cluster already remediated by 015 plus 12 carried findings (4× P1, 8× P2). This pass is feed-forward: no repeats.
- Scope read this round: SKILL.md, both command docs (`start-model-benchmark-loop.md`, `start-agent-improvement-loop.md`), the auto YAML, `run-benchmark.cjs`, `loop-host.cjs`, `promote-candidate.cjs`, `dispatch-model.cjs`, `reduce-state.cjs` (mode-routing slices), `explicit.ts`, `projection.ts`, `aliases.ts`.

## Files Reviewed

- `.opencode/skills/deep-agent-improvement/SKILL.md:278,496` (mode-aware promotion claim)
- `.opencode/commands/deep/start-model-benchmark-loop.md:409-415,496` (Step 6 promotion + Notes)
- `.opencode/commands/deep/assets/deep_start-model-benchmark-loop_auto.yaml:174-176` (step_promote_candidate)
- `.opencode/skills/deep-agent-improvement/scripts/shared/promote-candidate.cjs:141-302` (no mode awareness)
- `.opencode/skills/deep-agent-improvement/scripts/shared/reduce-state.cjs:620,802` (records ARE mode-routed)
- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/dispatch-model.cjs:88-89` (target_model thread)
- `.opencode/skills/deep-agent-improvement/scripts/model-benchmark/run-benchmark.cjs:465,517` (scoringMethod persistence)
- `.opencode/skills/system-skill-advisor/mcp_server/lib/scorer/{explicit.ts,projection.ts,aliases.ts}` (deep-model-benchmark node existence)

## Findings by Severity

### P1

**traceability-7-1** — "Mode-aware promotion" is an untraceable normative claim; `promote-candidate.cjs` has zero mode branching and is structurally an agent-only promoter.

- SKILL.md:278 ("apply mode-aware promotion") and :496 ("`promote-candidate.cjs` is mode-aware"), plus start-model-benchmark-loop.md:409 ("### Step 6: Promotion (mode-aware, optional)"), :411 ("Promotion is guarded and mode-aware"), and :496 ("`promote-candidate.cjs` is mode-aware") all assert the promoter is mode-aware.
- Source contradicts it: `promote-candidate.cjs` (read in full) contains no `mode`, `model-benchmark`, or `scoringMethod` token except the unrelated proposal-only error string at line 174. It hard-requires a manifest with exactly one `classification:"canonical"` agent target (line 130), runs 4-runtime agent mirror-sync via `isAgentDefinitionTarget` (line 256), and copies `candidate` over `target` (line 302). No code path varies behavior by lane/mode.
- Neither the doc invocation (start-model-benchmark-loop.md:413) nor the YAML step (auto YAML:176) passes any `--mode` flag, so even a future branch could not be reached on the documented call.
- Contrast: "mode-aware **records**" IS real — `reduce-state.cjs:620` routes on `record.mode === 'model-benchmark'` and `run-benchmark.cjs:465,517` persist `scoringMethod`. The docs conflate true record/reducer mode-awareness with non-existent promoter mode-awareness, misrepresenting `promote-candidate.cjs` as model-benchmark-capable.
- Distinct from prior `correctness-5-1` (which was the `--score` executability gap). This finding is the false "mode-aware" attribution: a `spec_code` normative-claim-vs-shipped-behavior mismatch.

## Traceability Checks

| Protocol | Status | Note |
|----------|--------|------|
| spec_code (mode-aware promotion) | fail | SKILL.md:278/496 + cmd:409/411/496 claim promoter mode-awareness with no backing code (traceability-7-1) |
| spec_code (mode-aware records) | pass | reduce-state.cjs:620 + run-benchmark.cjs:465,517 back the records claim |
| spec_code (target_model threading) | pass | dispatch-model.cjs:88-89 reads `CONFIG.modelBenchmarkConfig.target_model`; SKILL.md/cmd claim holds |
| spec_code (scoringMethod on benchmark_run) | pass | run-benchmark.cjs:517 emits `scoringMethod` on the ledger row as docs assert |
| skill_agent (deep-model-benchmark routing node) | pass | projection.ts:122 + aliases.ts:33 register the node; explicit.ts boosts (lines 98,130-138) resolve, not inert |
| spec_code (Mode 4 dangling ref) | n/a | already reported as traceability-3-1 across cmd:370/497 + agent-cmd:514; not re-reported |

## Verdict

CONDITIONAL — one NEW P1 traceability defect (false "mode-aware promotion" attribution) on top of the carried backlog. Multiple 015-era traceability claims re-confirmed sound.

## Next Dimension

Maintainability (iteration 8 default order), unless orchestrator re-routes.
