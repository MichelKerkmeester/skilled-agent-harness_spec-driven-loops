---
title: "Tasks: domain-tuned reranker fine-tune [template:level_1/tasks.md]"
description: "T001-T030 covering scripts skeleton, template-strip, triple gen, training, eval, publish."
trigger_phrases:
  - "011/003 tasks"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc/011-spec-memory-rerank-decision-arc/003-domain-tuned-finetune"
    last_updated_at: "2026-05-21T13:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Tasks scaffolded"
    next_safe_action: "Hold until Phase 2 HOLD verdict"
    blockers:
      - "Phase 1 + Phase 2 must complete"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: domain-tuned reranker fine-tune

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:notation -->
## Task Notation

`[x]` complete, `[ ]` open, `[!]` blocked. P-tag: P0 / P1.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

> _Maps to Phase A in plan.md (scripts skeleton)._

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T001 | P0 | Decide scripts location (sidecar/finetune/ vs new skill) | `[ ]` | impl-summary §Phase A decision |
| T002 | P0 | Create directory + skeleton .py files | `[ ]` | ls output |
| T003 | P0 | Wire pyproject/setup integration | `[ ]` | sidecar/.venv/bin/python -m scripts.finetune.<x> --help works |
| T004 | P1 | README.md for finetune/ describing each script | `[ ]` | README path |
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Plan Phase B — template-strip

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T005 | P0 | Implement strip_templates() per plan §Architecture | `[ ]` | code citation |
| T006 | P0 | Pytest cases for each removal type | `[ ]` | pytest exit 0 |
| T007 | P0 | Edge case tests (nested anchors, unterminated fences, multi-line frontmatter) | `[ ]` | pytest exit 0 |
| T008 | P1 | Manual sample inspection on 20 random docs | `[ ]` | impl-summary §Sample Inspection |

### Plan Phase C — triple generation

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T009 | P0 | Implement query-generation via LLM | `[ ]` | code citation |
| T010 | P0 | Walk corpus, build positives + hard negatives | `[ ]` | triple count milestone logs |
| T011 | P0 | Apply template-strip to all positives + negatives | `[ ]` | sample inspection |
| T012 | P0 | Split by packet_id (80/20) | `[ ]` | train.jsonl + test.jsonl line counts |
| T013 | P0 | verify_split.py confirms no leakage | `[ ]` | script exit 0 |
| T014 | P1 | Sample inspection at 100, 500, 1k triples | `[ ]` | impl-summary §Quality Milestones |
| T015 | P0 | Triple count >= 5000 | `[ ]` | wc -l outputs |

### Plan Phase D — training

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T016 | P0 | Base model decision (ms-marco-MiniLM or bge-base) | `[ ]` | impl-summary §Base Model |
| T017 | P0 | Configure hyperparams (epochs, batch, LR, loss) | `[ ]` | config snapshot |
| T018 | P0 | Train 1-3 epochs without crash | `[ ]` | training logs |
| T019 | P0 | Save checkpoints + pick best by test NDCG | `[ ]` | checkpoint paths + NDCG values |
| T020 | P0 | Reproducibility log (seed, hyperparams, SHAs) | `[ ]` | impl-summary §Training Config |
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

> _Maps to Plan Phases E + F (eval + publish + flip)._

| Task | P | Description | Status | Evidence |
|------|---|-------------|--------|----------|
| T021 | P0 | Run anti-overfit-to-template gate against structural-neighbor pairs | `[ ]` | impl-summary §Anti-Overfit Gate |
| T022 | P0 | Eval on 50-probe fixture | `[ ]` | evidence/finetune-bench-<date>.json |
| T023 | P0 | Compare vs OFF (Phase 1) + bge-v2-m3 (Phase 2) | `[ ]` | impl-summary §Eval Results table |
| T024 | P0 | Apply verdict gate (hit-rate ≥ OFF + 3 AND ≥ bge-v2-m3 + 1 AND p95 < +500ms) | `[ ]` | impl-summary §Verdict |
| T025 | P0 | (PROMOTE only) Pin revision SHA in sidecar allowlist | `[ ]` | env diff |
| T026 | P0 | (PROMOTE only) Patch cross-encoder.ts:54 to fine-tuned model | `[ ]` | git diff |
| T027 | P0 | (PROMOTE only) Live-validation gate: 5 memory_search calls capture | `[ ]` | impl-summary §Live Verification |
| T028 | P0 | Strict-validate this packet + arc parent | `[ ]` | both exit 0 |
| T029 | P0 | Decision-record.md ADR entry (PROMOTE only) | `[ ]` | ADR path |
| T030 | P0 | Commit handoff: exact paths | `[ ]` | impl-summary §Commit Handoff |
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

T001-T030 with evidence (PROMOTE) OR T001-T024 + T028 + T030 (HOLD). HOLD verdict closes the arc with "rerank is intrinsically hard for this corpus; recommend OFF baseline as production state" as the final recommendation.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- spec.md §3 §In Scope is the source for T005-T020 mapping
- spec.md §6 risks cover all failure modes from training crashes to overfit-to-template
- Supersedes `008-rerank-sidecar-arc/010-domain-tuned-reranker-finetune/`; the prior packet's framing is folded in here with the template-stripping refinement
- Phase 2 (002-bge-v2-m3-trial) provides the "must beat by ≥1" baseline number
- Phase 1 (001-off-baseline-audit) provides the "must beat by ≥3" baseline number
<!-- /ANCHOR:cross-refs -->
