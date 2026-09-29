---
title: "Implementation Summary: Phase 24: hallucination-grader (Planned)"
description: "Nothing is built yet. This phase is Planned: its spec, plan, tasks and goal describe a startup check for an unknown model-benchmark grader kind and one read-only script that measures whether a Jev or Deem hallucination judgment agrees with the operator's labels better than the deterministic check. It was released on 2026-09-29 and waits on the operator's labels."
trigger_phrases:
  - "hallucination grader summary"
  - "hallucination grader status"
  - "score-d4-agreement planned"
  - "d4 grader results"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader"
    last_updated_at: "2026-09-29T16:00:00Z"
    last_updated_by: "authoring-leaf"
    recent_action: "Authored the Planned phase documents from research item R7"
    next_safe_action: "Released 2026-09-29 (parent goal D3): run T001, then T002"
    blockers:
      - "Label gate: no benchmark output and no label exist"
    key_files:
      - "specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/spec.md"
      - "specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-cli-jev-003-024-hallucination-grader"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should fixtures carry an allowlist that scoreFixture5dim passes"
      - "Who reads a D4 grade, and what would a keep change"
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary: Phase 24: hallucination-grader (Planned)

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 024-hallucination-grader |
| **Status** | Planned |
| **Completed** | Not completed. The phase is Planned |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing yet. This phase is Planned, and no code, test, run or commit exists for it.

### Phase 24: hallucination-grader

The plan first stops `.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/run-benchmark.cjs` and `buildGraderFn` from turning an unknown grader kind into the `mock` stub. It then adds `score-d4-agreement.cjs` (proposed) beside `score-model-variant.cjs`. Its default run maps benchmark outputs to fixtures, scores the deterministic `hallucination-flag` check and prints a label gate of 30 labeled outputs, with zero model calls. Past the gate, a Deem arm and a Jev arm, each behind its own switch and checks, ask one `noul` per output and print one verdict per column under the Keep Rule in `spec.md` section 4. See `spec.md` for the requirements and `plan.md` for the order of work.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `spec.md`, `plan.md`, `tasks.md`, `goal.md`, `implementation-summary.md` | Authored | Planning documents for this phase. No code or skill file has changed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The planning documents were written on 2026-09-29 from R7 in `../001-deep-research/research/research.md` section 11, its round-2 row and the carried table in `../007-classifier-deep-research/research/research.md` section 12. Every cited line in the runner, the scorer and the grader harness was reopened at the worktree HEAD, and the fixtures were counted: 21 files, none with an `allowlist`. The operator's "Bind and release" amended parent goal D3 on 2026-09-29 and released the phase, which builds in number order. The build waits on benchmark outputs and on 30 labels.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| An unknown grader kind exits 2 | A grader silently swapped for a stub changes the scores a reader trusts, and the research names this fix as R7's first step |
| The measurement lives in its own script | The runner stays byte-identical for every known grader kind, and no classifier answer can reach D4 |
| The baseline method includes the majority class | The deterministic check reads an empty allowlist today, so a fair baseline takes the better of the two |
| A Deem `noul` holds by its commit pair | A `noul` has no options to rotate, and the served model is deterministic (research C4) |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Build, tests and runs | Not run. Nothing is built |
| Planning documents | `validate.sh --strict` and `check-goal.cjs` run on this folder after authoring. Their output is reported by the authoring session, not recorded here as a build result |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The phase may close at its label gate.** No benchmark output exists in the tree and no model writes a label.
2. **The baseline is weak today.** With no fixture allowlist, the deterministic check flags every claimed flag or function name outside its built-in common-name list (`hallucination-flag.cjs` header), so a win over it says little until the owner adds allowlists.
3. **Counts can drift.** The 21 fixtures and 32 cached grader records are from 2026-09-29. The build recounts them at its own HEAD.
<!-- /ANCHOR:limitations -->

---
