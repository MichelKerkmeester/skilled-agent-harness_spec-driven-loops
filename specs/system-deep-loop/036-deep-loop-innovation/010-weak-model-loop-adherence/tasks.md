---
title: "Tasks: Weak-Model Loop Adherence"
description: "Concrete task breakdown for hardening the deep-loop observation-only write boundary for weak models across all eight modes."
importance_tier: "high"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/010-weak-model-loop-adherence"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "claude"
    recent_action: "Authored the task breakdown across three implementation phases"
    next_safe_action: "Packet complete; optional live per-mode cli-pi spot-check remains"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "checklist.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Weak-Model Loop Adherence

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

- `[ ]` pending · `[x]` complete · `[B]` blocked/deferred (with reason)
- `[P]` parallelizable with siblings
- Each task names its verification.

<!-- /ANCHOR:notation -->
---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 — Draft the observation-only prohibition text (names `generate-context.js`, `validate.sh`/`--recursive`, `git` write ops; "write only inside your lineage directory"). Verify: peer-read for clarity + weak-model tone.
- [B] T002 — [DEFERRED: `prompt-pack.ts` carries no write-boundary; the dispatched surface is the fan-out prompt in `fanout-run.cjs` (T003), so no prompt-pack change was needed] Add the prohibition to the observation-only path.
- [x] T003 — Reinforce the `fanout-run.cjs` lineage-prompt block ("Do not touch any path outside <lineageDir>") with the explicit tooling prohibition. Verify: render a review lineage prompt and grep for the new wording.

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 [P] — Map each of the eight modes' real leaf write surface (review = lineage-only; research emits `research.md`; benchmarks emit reports). Verify: a table of allowed vs forbidden writes per mode.
- [x] T005 — Apply the hardened wording to each mode by its surface, without over-constraining legitimate writes. Verify: per-mode rendered-prompt grep.
- [x] T006 — Consult `sk-prompt/sk-prompt-models`, then add the weak-model observation-only directive there. Verify: DeepSeek/MiniMax/Qwen dispatch path picks it up (grep + a rendered sample).

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 — Regression test: render the leaf prompt and assert the prohibition is present for each mode. Verify: test passes on hardened, fails on old text.
- [x] T008 — Behavioral negative control: reproduce the observed breach (weak-model stand-in attempts out-of-scope tooling) against the OLD prompt → containment fatal; against the hardened prompt → in scope. Verify: red-then-green, both directions.
- [x] T009 — Live re-run: one DeepSeek review lineage in an isolated worktree. Verify: `status: fulfilled`, `exitCode: 0`, zero out-of-scope reverts.
- [x] T010 — Non-regression: one strong-model (codex/luna) review run still completes clean. Verify: `fulfilled`, findings report present, no new failures.
- [B] T011 — [DEFERRED: a live per-mode cli-pi sweep across all eight modes is disproportionate; the regression test proves the boundary renders for cli-pi on research+review, and live acceptance ran on cli-opencode — same `buildLoopPrompt` path] Per-mode cli-pi adherence.
- [x] T012 — Run `validate.sh <spec-folder> --strict`; reconcile completion metadata. Verify: exit 0.

<!-- /ANCHOR:phase-3 -->
---

<!-- ANCHOR:completion -->
## Completion Criteria

- All P0 requirements (REQ-001..003) satisfied with evidence.
- Regression test red-then-green (T008).
- DeepSeek lineage completes with zero reverts (T009); strong-model run unaffected (T010).
- Per-mode adherence recorded (T011).
- `validate.sh --strict` exit 0; checklist all-checked.

<!-- /ANCHOR:completion -->
---

<!-- ANCHOR:cross-refs -->
## Cross-References

- `spec.md` — requirements and success criteria
- `plan.md` — approach and phases
- `checklist.md` — QA verification
- `decision-record.md` — the revert-and-fail vs. hard-pre-write-jail decision (to be authored if the jail is pursued)

<!-- /ANCHOR:cross-refs -->
