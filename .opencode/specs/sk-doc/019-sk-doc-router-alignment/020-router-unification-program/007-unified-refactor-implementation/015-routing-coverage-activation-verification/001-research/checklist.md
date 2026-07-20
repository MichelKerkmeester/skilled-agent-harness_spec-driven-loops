---
title: "Checklist: Routing Coverage — Deep Research"
description: "QA gate for the 25-iteration deep-research loop, the fresh-Opus synthesis, the Sonnet adversarial verification, and the orchestrator reconciliation."
trigger_phrases:
  - "routing coverage research checklist"
  - "deep research loop QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: Routing Coverage — Deep Research

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|----------------------|
| **[P0]** | HARD BLOCKER | Cannot claim the research authoring brief complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] All four models were authenticated and smoke-tested before the run.
  - **Evidence**: The MiniMax Token-Plan-vs-Direct-API slug mismatch was caught by the smoke test and corrected to `minimax/MiniMax-M3` before launch (`spec.md` L2 Edge Cases); `deep-research-state.jsonl` shows the corrected slug throughout.
- [x] CHK-002 [P0] The 25-iteration model/effort/focus schedule was fixed before the run, not improvised mid-loop.
  - **Evidence**: `deep-research-state.jsonl` shows a coherent, non-overlapping per-iteration `focus` assignment (catalogs, benchmark, playbooks, archiving, activation, sk-code-align, sk-doc-templates) rotating across all 25 iterations.
- [x] CHK-003 [P1] The four named coverage gaps plus an explicit unnamed-gaps mandate were the iteration brief.
  - **Evidence**: `synthesis-v1.md` §3 "UNNAMED GAPS — new risks beyond the 4 named coverage gaps" directly answers this mandate with 14 ranked items.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The research state machine used canonical, in-tree artifacts, not manual `/tmp` state.
  - **Evidence**: `research/deep-research-state.jsonl`, `research/iterations/*.md`, `research/findings-registry.json`, and `research/progress.log` all live under `001-research/research/`, in-tree.
- [x] CHK-011 [P0] `deep-research-state.jsonl` and `findings-registry.json` are valid, parseable JSON/JSONL.
  - **Evidence**: `deep-research-state.jsonl` parses as 25 well-formed JSON lines; `findings-registry.json` (112,614 bytes) parses as valid JSON.
- [x] CHK-012 [P1] No per-iteration record was hand-edited after the fact.
  - **Evidence**: `progress.log` timestamps and `deep-research-state.jsonl` timestamps are internally consistent and monotonically increasing across the run (19:21:43Z → 20:45:56Z).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All 25 iterations completed with `exit_code=0`.
  - **Evidence**: `progress.log` shows 25 DONE entries, every one `code=0`.
- [x] CHK-021 [P0] No early-convergence stop occurred; the full schedule ran.
  - **Evidence**: `deep-research-state.jsonl` shows `"converged":false` on every one of the 25 entries; `progress.log` ends with `=== harness COMPLETE ===` only after iteration 25.
- [x] CHK-022 [P0] Findings accumulated monotonically with zero weak/0-finding iterations.
  - **Evidence**: `progress.log` running totals: 5 (iter 2) → ... → 143 (iter 25), every iteration contributing at least 3 findings (iterations 17 and 23 are the smallest, at `findings=3`).
- [x] CHK-023 [P0] The adversarial verification re-checked citations against live source, not the synthesis's own claims.
  - **Evidence**: `verification-v1.md` header states "Fresh Sonnet 5 agent, no prior context... using `sed -n`/`Read` with exact line ranges (not `grep`-only)... Default posture: skeptical."
- [x] CHK-024 [P1] The verification pass covered more than just the headline claims.
  - **Evidence**: `verification-v1.md` §1 covers the 8 must-verify spine claims and §2 covers 12 more top recommendations — 20 independently re-checked citations total, plus a full read of `iteration-025.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] All 8 must-verify spine claims are CONFIRMED, not merely re-asserted.
  - **Evidence**: `verification-v1.md` §1 table shows all 8 claims individually marked CONFIRMED, two (claims 6 and 8) upgraded from the synthesis's own INFERRED/partial status.
- [x] CHK-031 [P0] The findings-count error was caught and corrected.
  - **Evidence**: `review-v1.md` §2 states "Count: ~47 consolidated findings (44 CF-IDs + 3 standalone), not 48," correcting `synthesis-v1.md`'s own header claim of "48 consolidated findings."
- [x] CHK-032 [P0] The confirmed 002-011 child-spec breakdown is complete and non-overlapping.
  - **Evidence**: `verification-v1.md` §2 explicitly checks this: "Coherent, non-overlapping, complete... Dependency graph is a valid DAG"; `review-v1.md` §4 lists all 10 children with scope, level, and dependencies.
- [x] CHK-033 [P1] Omitted requirements surfaced by verification were folded back into the authoring brief.
  - **Evidence**: `review-v1.md` §3 adds 3 omissions as explicit requirements (F-15-3→004, F-16-4→002, F-25-8→004/010).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No live routing, router, engine, manifest, or scorer file was modified during research.
  - **Evidence**: Every finding is framed as a "concrete change" recommendation for a downstream child, not an edit made during research; `git status` on this packet shows only new files under `001-research/`.
- [x] CHK-041 [P0] No recommendation proposes editing the frozen scorer or changing a routing decision.
  - **Evidence**: `synthesis-v1.md` §4 states explicitly: "No finding proposes editing the frozen scorer or changing a routing decision. All 'parity'/'activation' work stays additive, byte-identical, and reversible by construction."
- [x] CHK-042 [P1] No research artifact embeds a credential, token, or environment secret.
  - **Evidence**: Fixture inspection of `findings-registry.json` and the iteration Markdown files shows only code citations and prose findings, no secret material.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary agree on the research completion state.
  - **Evidence**: All 5 docs report Status: Complete, 25/25 iterations, verdict SPEC-READY-WITH-CORRECTIONS, and the confirmed 002-011 breakdown.
- [x] CHK-051 [P1] Citation precision is honestly labeled — CONFIRMED vs. INFERRED, not blanket-asserted.
  - **Evidence**: `synthesis-v1.md`'s own provenance note distinguishes CONFIRMED (re-verified this session) from INFERRED (agent-reported, not re-verified) throughout; `verification-v1.md` §3.4 separately logs "minor citation-precision drift (does not change any conclusion)."
- [x] CHK-052 [P0] Strict Level-2 packet validation passes on this phase folder.
  - **Evidence**: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <this-folder> --strict` reports `Errors: 0` (see `implementation-summary.md` for the exact run).
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] All research state and consolidation documents are phase-local under `001-research/`.
  - **Evidence**: `research/` (state, iterations, findings-registry, progress log, logs) and `synthesis-v1.md`/`verification-v1.md`/`review-v1.md`/`spec.md` all live beneath this phase root.
- [x] CHK-061 [P1] Raw iteration output was never rewritten by a later consolidation pass.
  - **Evidence**: `research/iterations/iteration-NNN.md` files are the fresh-agent output as originally produced; corrections live only in `verification-v1.md`/`review-v1.md`, which reference rather than edit the raw iterations.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-20
**Verification Scope**: The full 25-iteration deep-research loop across 4 models and 2 dispatch queues, the fresh-Opus synthesis, the fresh Sonnet 5 adversarial verification against live source, and the orchestrator reconciliation into the confirmed 002-011 authoring brief.
**Completion Boundary**: Research and consolidation are complete (spec.md Status: Complete). Implementation of the 002-011 children is separate, forward work — this packet's completion covers only the research/synthesis/verification/review chain, not the downstream build.
<!-- /ANCHOR:summary -->
