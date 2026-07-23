---
title: "Implementation Summary: Routing Coverage — Deep Research"
description: "25-iteration deep-research loop across 4 models, consolidated by a fresh-Opus synthesis, adversarially re-verified by a fresh Sonnet 5 agent against live source, and reconciled by an orchestrator review into the confirmed 002-011 authoring brief for the routing-coverage-activation-verification packet."
trigger_phrases:
  - "routing coverage research implementation summary"
  - "deep research loop complete 25 iterations"
  - "synthesis verification review authoring brief"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Routing Coverage — Deep Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Complete — 25/25 iterations, 143 raw findings, fresh-Opus synthesis + Sonnet adversarial verification + orchestrator review all authored; verdict SPEC-READY-WITH-CORRECTIONS |
| **Date** | 2026-07-20 |
| **Level** | 2 |
| **Findings** | 143 raw → 47 consolidated (corrected from the synthesis's own 48-count) across 7 workstreams + unnamed risks |
| **Strict validation** | `validate.sh --strict` — see Verification below |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A complete, verified research base for the `015-routing-coverage-activation-verification` program: 25 deep-research iterations across four models and two dispatch queues investigated how to fully integrate, enable-by-default, and verify the compiled skill-router, and dug for gaps beyond the four originally-named coverage gaps. The loop reframed the entire program — default-on is a structural no-op end-to-end (the OpenCode bridge and the CLI `subprocess.ts` interface both drop the compiled decision before any agent sees it, and the flag is stripped from both daemon child-env allowlists), so the load-bearing work is a P0 activation foundation, and the four named coverage gaps (catalogs, benchmark, playbooks, durable archiving) are a downstream P3 join gate, not parallel busywork.

A fresh-Opus synthesis consolidated the 143 raw findings into ranked, deduplicated findings across seven workstreams plus 14 ranked unnamed risks, a P0→P4 enable-by-default safety dependency graph, and a confirmed 002-011 child-spec breakdown. A fresh Sonnet 5 agent with no prior context then adversarially re-verified the load-bearing spine — all 8 must-verify claims plus 12 more top recommendations — against live source with exact line ranges, confirming everything and upgrading two claims from the synthesis's own INFERRED/partial status to fully CONFIRMED. An orchestrator review reconciled both into the authoring brief this program's children (`002`-`011`, including the sibling `006-feature-catalogs` and `007-durable-archiving-and-serving-snapshot` packets authored alongside this summary) are built from.

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Research state | `research/deep-research-state.jsonl`, `research/iterations/iteration-001.md`..`iteration-025.md`, `research/findings-registry.json`, `research/progress.log`, `research/logs/*.err` | Canonical, in-tree deep-research state (no manual `/tmp` state) |
| Consolidation | `synthesis-v1.md` | Fresh-Opus consolidation of 143 raw findings into 47 (ranked, deduplicated) |
| Verification | `verification-v1.md` | Fresh Sonnet 5 adversarial re-verification against live source |
| Reconciliation | `review-v1.md` | Orchestrator reconciliation — verified spine, corrections, omissions, confirmed 002-011 breakdown, authoring directives |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Status, evidence, verification, and the completion record |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two independent dispatch queues ran in parallel: `cli-codex` executed 18 iterations (10 `gpt-5.6-sol` high, 3 `gpt-5.6-sol` ultra, 5 `gpt-5.6-terra` xhigh) and `cli-opencode` executed 7 (5 `minimax/MiniMax-M3`, 2 `zai-coding-plan/glm-5.2`), confirmed by `deep-research-state.jsonl`'s per-iteration `model`/`effort` fields and `progress.log`'s `opencode queue drained` (iteration 14, 20:06:46Z) and `codex queue drained` (iteration 25, 20:45:56Z) markers. All 25 iterations ran with no early-convergence stop (`"converged":false` on every entry) and zero weak/0-finding iterations; a single `cli-opencode` transient failure was retried once per the run's own recovery policy. Findings accumulated monotonically from 5 (iteration 2) to 143 (iteration 25) in `findings-registry.json`.

A fresh-Opus agent then synthesized the 143 raw findings — with no ability to re-run the research itself — into `synthesis-v1.md`: 7 per-workstream tables (`CF-ACT-*` activation, `CF-BM-*` benchmark, `CF-PB-*` playbooks, `CF-CAT-*` catalogs, `CF-ARC-*` archiving, `CF-SC-*` sk-code alignment, `CF-TPL-*` sk-doc templates), a 14-item unnamed-gaps ranking, 7 contradictions/uncertainties flagged for the verifier, a P0→P4 safety dependency graph, a confirmed 002-011 child-spec breakdown, and an ordered, reversible 7-step build sequence.

A separate fresh Sonnet 5 agent, given no prior context and instructed to a default-skeptical posture, then re-opened every file cited by the synthesis's 8 must-verify spine claims plus 12 more top recommendations using exact `sed -n`/Read line ranges rather than `grep`-only, cross-checked all 143 raw findings programmatically against the synthesis's own workstream tables, and read the run's own completeness-critic iteration (`iteration-025.md`) in full. This produced `verification-v1.md`: verdict SPEC-READY-WITH-CORRECTIONS, all 8 must-verify claims CONFIRMED (two upgraded from the synthesis's own INFERRED/partial status — most notably, all 7 activation manifests independently confirmed `servingAuthority: compiled`, not just `sk-code`), plus a findings-count correction, a mischaracterized-finding correction, and a load-bearing wording-ambiguity flag (`CF-BM-4`'s fix-site) that would have risked a frozen-file edit if the synthesis's own wording were read literally.

Finally, an orchestrator reconciled `synthesis-v1.md` and `verification-v1.md` into `review-v1.md`: the verified 7-point spine to build the spec on, the corrections to fold in (the `CF-BM-4` fix-site safety note, the corrected ~47 finding count, the 009 Phase Map mischaracterization, line-drift tolerance guidance), 3 omitted requirements promoted to explicit requirements, the confirmed 10-child `002`-`011` breakdown, and the authoring directives every 015 child (including this program's `006-feature-catalogs` and `007-durable-archiving-and-serving-snapshot` packets) must follow.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Run 25 iterations with no early-convergence stop | Guards against a false-convergence signal masking unexplored workstreams; the run's own completeness-critic iteration (25) was still producing new findings (8, the run's second-highest single-iteration count). |
| Split dispatch across two independent queues (`cli-codex`, `cli-opencode`) | Model diversity across 4 distinct models reduces single-model blind spots; independent queues let both run concurrently rather than serially. |
| Use a fresh agent with no prior context for adversarial verification | A verifier that shares the synthesizer's reasoning trace cannot catch the synthesizer's own blind spots; a fresh, skeptical read against live source is a genuine second opinion. |
| Re-derive citations with exact line ranges, not grep-only | `grep`-only verification would have missed the ±2-10 line drift the synthesis itself flagged as a known risk; exact-range reads either confirm or refute precisely. |
| Route corrections through a third reconciliation document rather than editing the synthesis in place | Preserves the audit trail — what the synthesis originally claimed, what verification found, and what the authoring brief ultimately directs are each independently inspectable. |
| Treat every finding as a recommendation for a downstream child, never an in-research edit | Research stays strictly read-only; no live routing, router, manifest, or scorer file was touched during this phase. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

25/25 iterations completed (`research/progress.log`: 25 DONE entries, `exit_code=0` on every one, running total reaching 143 at iteration 25, both queues explicitly drained, `=== harness COMPLETE ===`):

| Model | Executor | Effort | Iterations | Count |
|-------|----------|--------|-------------|------:|
| `gpt-5.6-sol` | `cli-codex` | high | 1,3,5,9,13,16,19,21,24,25 | 10 |
| `gpt-5.6-sol` | `cli-codex` | ultra | 15,18,22 | 3 |
| `gpt-5.6-terra` | `cli-codex` | xhigh | 7,11,17,20,23 | 5 |
| `minimax/MiniMax-M3` | `cli-opencode` | — | 4,6,8,10,12 | 5 |
| `zai-coding-plan/glm-5.2` | `cli-opencode` | max | 2,14 | 2 |

`verification-v1.md` VERDICT: "SPEC-READY-WITH-CORRECTIONS. All 8 must-verify claims are CONFIRMED — several with higher confidence than the synthesis claimed for itself... No recommendation edits a frozen scorer file, and no recommendation flips the default before P4." Of roughly 50 independently re-opened `file:line` citations, the large majority landed on the exact cited line.

Strict Level-2 packet validation:

```
bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh \
  .opencode/specs/sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/001-research \
  --strict
```
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **This packet documents research, not implementation.** No line of the 002-011 children's runtime, benchmark, catalog, or archiving code was written during this phase; `spec.md`'s own Status field is scoped to "25/25 iterations, 143 findings; synthesis + adversarial verification + orchestrator review authored," not to the downstream build.
2. **Several load-bearing citations remain INFERRED, not re-verified this session.** `verification-v1.md` re-checked the 8 must-verify claims plus 12 more; findings outside that set (e.g., most of `CF-ACT-10`, `CF-PB-4`, `CF-PB-5`, `CF-TPL-2..5`) carry the synthesis's own CONFIRMED/INFERRED labeling and were not independently re-opened by the adversarial pass. Each downstream child is directed to re-verify its own load-bearing citations at build time (`review-v1.md` §5).
3. **The 47-consolidated-findings count is itself a correction, not the synthesis's original claim.** `synthesis-v1.md`'s own header states "48 consolidated findings"; `review-v1.md` §2 identifies this as a counting error and corrects it to "~47 (44 CF-IDs + 3 standalone)" — a self-correcting research chain, not a first-pass-perfect one.
4. **Line-number citations carry an acknowledged ±2-10 line drift.** `synthesis-v1.md` §4 item 7 and `review-v1.md` §2 both instruct downstream children to re-anchor on the cited symbol, not the raw line number, at build time.
<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: complete
    current_focus: "25-iteration deep-research loop complete (143 findings), fresh-Opus synthesis + Sonnet adversarial verification (all 8 must-verify spine claims CONFIRMED) + orchestrator review all authored; verdict SPEC-READY-WITH-CORRECTIONS; confirmed 002-011 child-spec breakdown is the authoring brief for the rest of the 015 packet"
    next_steps:
      - "Sibling packets 006-feature-catalogs and 007-durable-archiving-and-serving-snapshot authored alongside this summary, consuming CF-CAT-1..5 and CF-ARC-1..5 respectively"
      - "Remaining 015 children (002, 003, 004, 005, 008, 009, 010, 011) still need Level-appropriate spec doc sets authored from this packet's synthesis/verification/review chain"
    blockers: []
-->
