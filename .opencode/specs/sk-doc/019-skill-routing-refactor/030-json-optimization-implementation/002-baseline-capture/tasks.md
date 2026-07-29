---
title: "Baseline Capture Tasks: Routing Baseline Capture"
description: "Tasks for pinning the routing-accuracy corpus hash, capturing top-1/top-3 numbers, and validating all skill roots before any gate/delete/migration/rewire phase in the JSON optimization implementation program."
trigger_phrases:
  - "routing baseline capture tasks"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/030-json-optimization-implementation/002-baseline-capture"
    last_updated_at: "2026-07-29T09:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored planned phase spec"
    next_safe_action: "Begin implementation per plan.md"
    blockers: []
    key_files:
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "002-baseline-capture"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Baseline Capture Tasks: Routing Baseline Capture

---

<!-- ANCHOR:notation -->
## Task Notation

`[ ]` pending, `[x]` complete with evidence; `T-nn` execution order.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T-01 Enumerate current skill roots using the same rule `discover_graph_metadata()` uses (top-level `.opencode/skills/*/graph-metadata.json`, skip `scripts/`) and record the roster
- [ ] T-02 Verify `dist/mcp-server` is rebuilt/current so `capture-scorer-eval-baseline.mjs`'s dynamic imports reflect live scorer code
- [ ] T-03 Compute independent `wc -l` and `shasum -a 256` readings for `labeled-prompts.jsonl`, `holdout-prompts.jsonl`, `ambiguity-prompts.jsonl` as the capture-time ground truth
- [ ] T-04 Read `score-routing-corpus.py`, `capture-scorer-eval-baseline.mjs`, and `skill_graph_compiler.py --validate-only` CLI usage before invoking them
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T-05 Run `score-routing-corpus.py --dataset labeled-prompts.jsonl` and capture the full JSON report (gate3 precision/recall/F1, advisor top-1 accuracy, joint TT/TF/FT/FF) verbatim
- [ ] T-06 Run `capture-scorer-eval-baseline.mjs` without `--write` and capture full_corpus_top1/holdout_top1/ambiguity_top1/bucket metrics verbatim
- [ ] T-07 Write the phase-scoped top-3 capture script (lives only under `002-baseline-capture/scripts/`, never under `mcp-server/scripts/`) reading the scorer's ranked recommendation list, and run it against the full corpus and holdout to record correct/total/accuracy for "gold label in top 3"
- [ ] T-08 Run `skill_graph_compiler.py --validate-only` from the repo root and capture stdout (discovered-file count, VALIDATION PASSED/FAILED, per-root errors) verbatim, exercising the `key_files`/`source_docs` path-existence checks for every root
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T-09 Assemble one baseline artifact under `002-baseline-capture/baseline/` combining T-03/T-05/T-06/T-07/T-08 output with the pinned hashes, git HEAD short SHA, and capture timestamp
- [ ] T-10 Cross-check recorded hashes/row-counts against a second independent `shasum -a 256`/`wc -l` pass; diff the freshly captured numbers against `scorer-eval-baseline.json` (stale, capturedAt 2026-07-17) and `validation-baselines.md:49-50` (80.5%/77.5%, citing nonexistent `corpus.vitest.ts`/`holdout.vitest.ts`) and record both deltas explicitly
- [ ] T-11 Confirm via `git status` that zero files outside `002-baseline-capture/` were modified, and confirm the compiler pass was 11/11 clean including `key_files`/`source_docs` path existence
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

One hash-pinned baseline artifact recorded under `002-baseline-capture/baseline/` with independently cross-checked hashes/row-counts, verbatim top-1 output from both existing scorers, a freshly computed top-3 metric, an 11/11-clean compiler validate-only pass including path-existence checks, and an explicit record of the discrepancy against both stale checked-in sources. No file outside this phase folder modified.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

Spec `spec.md` · Plan `plan.md` · QA `checklist.md` · Research evidence `../../029-skill-json-optimization-research/research/research.md`
<!-- /ANCHOR:cross-refs -->
