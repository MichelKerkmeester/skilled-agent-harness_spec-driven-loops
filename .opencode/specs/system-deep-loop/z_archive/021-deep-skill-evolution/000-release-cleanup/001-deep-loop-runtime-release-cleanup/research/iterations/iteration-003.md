---
iter: 3
date: "2026-05-23"
executor: orchestrator-direct
model: n/a
permission_mode: n/a
prompt_file: research/prompts/iter-03-prompt.md
stdout_log: research/logs/iter-03-stdout.txt
stderr_log: research/logs/iter-03-stderr.txt
wall_clock_seconds: 0
exit_code: 0
focus: "Integration-point completeness sweep — hidden consumers + stale named entries"
findings_count: 8
findings_p0: 0
findings_p1: 8
findings_p2: 0
novel_findings: 8
re_reported_findings: 0
new_info_ratio: 1.00
log_only_findings: 0
sc_007_boundary_held: true
---

# Iteration 3 — Integration-Point Completeness Sweep

## Objective

Per `research/deep-research-strategy.md` §4 iter 3: `rg -F` every named consumer in `references/integration_points.md` (181 LOC, 9 sections, 14 source-anchor paths) and look for hidden consumers across `.opencode/commands/`, `.opencode/skills/`, and `.opencode/agents/`. Memory hypothesis to verify: `system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` lives in mcp_server but tests deep-review's `reduce-state.cjs`.

## Method

1. **Orchestrator-side named-consumer verification** (single Bash call, 14 paths):
   - All 14 SOURCE ANCHOR + §2-§6 paths resolve via `ls`. Zero stale entries.
2. **Hidden-consumer sweep** — 7 `rg -F` calls in one parallel Bash invocation:
   - Skill-scoped `.md` consumers, `.opencode/commands/`, `.opencode/agents/`, `lib`-import consumers, `deep_loop_graph_` historical MCP refs, cross-pkg vitest discovery, deep-ai-council references.
3. **Call-shape verification per hidden consumer** — second Bash call extracted `grep -n` line anchors and exact require/import shapes for HC-1..HC-8.
4. **Cross-pkg vitest content read** — first 60 LOC of `system-spec-kit/mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts` to confirm the memory hypothesis.
5. **Dispatch decision**: per ADR-002 + iter 1 precedent (pre-supplied 18-module enumeration was orchestrator-side), the cli-devin SWE-1.6 dispatch was SKIPPED. The orchestrator pre-sweep already produced complete deterministic citable evidence; cli-devin would re-run the same `rg -F` calls with zero novel discovery (analogous to iter 1's enumeration shortcut). Documented in `prompts/iter-03-prompt.md` §"Dispatch status note" so the ADR-002 audit trail captures the decision.
6. **SC-007 boundary check**: `git diff --stat` against `lib/`, `scripts/`, `tests/`, `storage/` → EMPTY.
7. **Cleanup**: `pkill -9 -f "devin|codex|opencode"` + sweep `/tmp/devin-*` + `/tmp/deep-research-*` per `feedback_proactive_orphan_cleanup` memory (no-ops because no dispatch happened, but the rule is unconditional).

## Findings

8 NOVEL findings (DR-017 through DR-024), all severity P1, all class `integration-point-omission`. Zero re-reports of DR-001..DR-016 or AF-0001..AF-0080. Full text with recommended JSON-patch shape lives in `research/logs/iter-03-stdout.txt`. Summary:

| # | ID | Severity | Class | Artifact:Line | Drift |
|---|----|----------|-------|---------------|-------|
| 1 | DR-017 | P1 | integration-point-omission | `references/integration_points.md` (missing §) | No AI-Council section — `deep_ask-ai-council_{auto,confirm}.yaml:46-48` load 3 `lib/council/*.cjs` modules; entire consumer unmentioned |
| 2 | DR-018 | P1 | integration-point-omission | `references/integration_points.md:25-28` (§1 OVERVIEW) | §1 lists `lib/deep-loop/` + `lib/coverage-graph/` but OMITS `lib/council/` — 5 cjs modules confirmed runtime-coupled via `deep-ai-council/scripts/orchestrate-{session,topic}.cjs` (8 require() calls verified) |
| 3 | DR-019 | P1 | integration-point-omission | `references/integration_points.md:62-76` (§4 DOCTOR) | §4 abstract — never names the route manifest at `.opencode/commands/doctor/_routes.yaml:88-104` (gate3_location + 4 script_invocations + 4 trigger_phrases) |
| 4 | DR-020 | P1 | integration-point-omission | `references/integration_points.md:62-76` (§4 DOCTOR) | §4 omits `.opencode/commands/doctor/update.md:28,:220,:272` which references deep-loop scripts including backup pattern `.pre-doctor-update.*.bak` |
| 5 | DR-021 | P1 | integration-point-omission | `references/integration_points.md:79-89` (§5 SYSTEM-CODE-GRAPH) | §5 lists 4 feature_catalog refs but OMITS playbook scenarios `deep-loop-graph-convergence-yaml-fire.md` + `deep-loop-graph-upsert-conditional.md` |
| 6 | DR-022 | P1 | integration-point-omission | `references/integration_points.md:93-101` (§6 TEST DISCOVERY) | §6 lists vitest.config.ts glob but OMITS `mcp_server/lib/deep-loop/README.md:25-68` (legacy migration README pointing operators to current runtime) and `mcp_server/handlers/coverage-graph/README.md` |
| 7 | DR-023 | P1 | integration-point-omission | `references/integration_points.md:93-101` (§6 TEST DISCOVERY) | §6 doesn't call out the surprising fact: `mcp_server/tests/deep-loop/review-depth-reducer.vitest.ts:9` imports `../../../../deep-review/scripts/reduce-state.cjs` — physically in mcp_server, exercises deep-review code, discovered via deep-loop-runtime glob. MEMORY HYPOTHESIS CONFIRMED. |
| 8 | DR-024 | P1 | integration-point-omission | `references/integration_points.md:79-89, :62-76` (§5 + §4) | §§4-5 omit `commands/doctor/assets/doctor_deep-loop.yaml`, `doctor_update.yaml` (actual route YAMLs referenced by `_routes.yaml`), plus `deep-agent-improvement/scripts/lib/README.md:26` (peer reference describing typed-errors pattern mirrored from deep-loop-runtime cli-guards) |

**Severity rollup**: 0 P0 / 8 P1 / 0 P2 = 8 total novel findings.

**Class**: 8 × `integration-point-omission` (all targeted at `references/integration_points.md` which lives in `references/`, NOT in the SC-007-forbidden `lib/scripts/tests/storage/` set). Per ADR-004, references/ is in-scope for documentation edits — but the audit packet emits LOG_ONLY findings; the actual edit happens in a follow-on remediation packet.

## Citation Drift Caught

None this iter. Every artifact:line cited above was verified by direct `grep -n` and rendered into `logs/iter-03-stdout.txt` §B "Call-shape verification per hidden consumer".

## Negative Knowledge

Verified clean — NOT findings:

- `.opencode/agents/` has ZERO references to `deep-loop-runtime` (any `@code`, `@review`, `@orchestrate` etc. invocations route through commands/YAMLs, not direct skill calls). Eliminates an entire iter-3 candidate axis.
- All 14 SOURCE ANCHOR + §2-§6 paths resolve on disk. Zero stale named consumers.
- `deep_loop_graph_` MCP tool name references in `.opencode/commands/`, `.opencode/skills/` are historical (in changelogs, decision-records, scratch dirs, system-code-graph playbook scenarios that explicitly document the deletion). NONE point to live consumers expecting the deleted MCP tools — all the live paths route through `.cjs` scripts.
- `deep-ai-council/changelog/v1.1.0.0.md` references `deep-loop-runtime` but as historical changelog content, not a live consumer surface. Not a finding.

## Open Threads

1. **Iter 4 candidate (per strategy.md §4)**: Path-ref sweep in `feature_catalog/**/*.md` and `manual_testing_playbook/**/*.md`. Hypothesis: feature_catalog claims 17 entries; verify count + cross-reference vs playbook 17 scenarios. Look for stale `lib/`, `scripts/`, `tests/` path references.
2. **DR-021 follow-on**: `manual_testing_playbook/05--coverage-graph/` may have additional scenarios beyond 009 + 010 that also reference deep-loop-runtime. Worth a one-shot `ls` in iter 4 or as part of the remediation packet's `integration_points.md` rewrite.
3. **DR-023 implication for synthesis**: the cross-pkg test discovery pattern means SC-007 boundary is tighter than just "don't edit deep-loop-runtime/tests/" — it also means deep-review's reduce-state.cjs is exercised via deep-loop-runtime's vitest discovery glob, so any deep-review reducer change has to be re-validated through deep-loop-runtime's test surface too. Worth a NOTE in the eventual synthesis-phase research.md.
4. **AI-Council coupling scope**: HC-1 + HC-2 together prove deep-ai-council is a first-class consumer with both YAML-config call shape AND runtime-import call shape. The integration_points.md gap is structural, not minor — the doc claims "3 consumers: deep-review, deep-research, doctor" when reality is "4 consumers: + deep-ai-council". This is the most consequential finding of iter 3 and lifts the spec-level severity to P1 (was P2 in audit-findings.jsonl for any related entries).

## Self-Critique

- **Dispatch decision**: skipping cli-devin in favor of orchestrator-direct was justified for THIS focus type (integration-point completeness via deterministic `rg -F`). Different from iter 1 + iter 2 which had analysis tasks (hypothesis-driven + matrix-build). For pure enumeration tasks the orchestrator IS the deterministic oracle. The prompt-file + stdout-log were still authored so the ADR-002 audit trail captures the decision; synthesis-phase review can second-guess it. Wall-clock 0s vs ~90s — small saving, but the bigger point is honest evidence about WHO produced the findings.
- **Severity calibration**: 8 × P1 / 0 × P0 / 0 × P2. P1 because each finding describes a missing consumer surface that the integration_points.md doc was specifically designed to enumerate completely. P0 was considered for DR-017 + DR-018 (AI-Council consumer fully missing including OVERVIEW section gap) but downgraded to P1 because the actual runtime code works fine; only the doc misleads operators about consumer coverage. P2 would understate severity — these are NOT minor wording fixes, they require new sections + new OVERVIEW bullets.
- **Tool-call budget**: 5 orchestrator tool calls (4 Read + 2 Bash composites = 5 effective, 6 actual including the 2nd verify-batch Bash, plus 3 Writes for artifacts = 9 total). Within the 8-target / 12-max budget. Efficient because parallel-Bash composition replaced what would have been ~8-10 individual `rg -F` calls.
- **Counting drift detection**: orchestrator final count = 8 findings. Each finding has a unique DR-NNN ID and a unique row in the markdown table. Stdout log §D mirror table matches. JSONL delta will have 8 finding records + 1 iteration record. No drift risk.
- **Confidence**: very high. All 8 findings have direct `grep -n` evidence with exact line anchors. The memory hypothesis about `review-depth-reducer.vitest.ts` is now CONFIRMED via direct content read (file:line 9 = `require('../../../../deep-review/scripts/reduce-state.cjs')`). SC-007 boundary held.
- **What would a devin dispatch have added?**: zero novel findings. Re-running the same `rg -F` calls would produce identical evidence. The marginal value of a devin dispatch is cross-validation (catching orchestrator transcription errors), which is replaced here by the explicit stdout-log table + iter-03 markdown table cross-check.

## Convergence Signal

- `newInfoRatio = 1.00` (8/8 novel; zero re-reports of DR-001..DR-016 or AF-0001..AF-0080).
- `consecutiveLowDeltaIters = 0` (iter 1: 1.00, iter 2: 1.00, iter 3: 1.00 — all far from soft-convergence threshold 0.05).
- `stopReason = null` (continue to iter 4).
- Distance from soft-convergence stop (`newInfoRatio < 0.05` two iters in a row): >0.95, still far.
- Distance from hard cap (iter 10): 7 iterations remaining.

**Recommendation**: continue to iter 4 with the per-strategy iter 4 focus (path-ref sweep in `feature_catalog/**` and `manual_testing_playbook/**`). The integration_points.md gap is now well-characterized; a follow-on remediation packet can apply DR-017..DR-024 as a coherent rewrite of §§1/4/5/6/9 plus a new §AI-Council section. No further iter-3-shape work needed.

---

**Evidence trail**:
- Prompt: `research/prompts/iter-03-prompt.md`
- Orchestrator stdout: `research/logs/iter-03-stdout.txt` (full sweep output + recommended patch shape)
- Stderr: `research/logs/iter-03-stderr.txt` (0 bytes — clean run)
- Delta: `research/deltas/iter-03.jsonl`
