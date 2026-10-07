---
title: "Tasks: Phase 006 — Command surface + docs + final parity"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "command surface docs parity tasks"
  - "fanout command flags parity tasks"
importance_tier: "important"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Tasks: Phase 006 — Command surface + docs + final parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Command surface

- [ ] T001 Add repeatable `--executor` (grouping the trailing model/effort/timeout/iters/label/count options), `--executors <json>` and `--concurrency N` to `start-research-loop.md` and `start-review-loop.md` §0 (`.opencode/commands/deep/`)
- [ ] T002 Add the Default Resolution Table entries, PRE-BOUND SETUP ANSWERS additions and fan-out EXAMPLES to both command docs
- [ ] T003 Apply the default policy: 0-1 executor without `--executors` keeps `config.executor`; 2+ executors, `--executors` or `count>1` selects `config.fanout`
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Docs

- [ ] T004 Add the command-driven fan-out carve-out to `deep-research/SKILL.md` and `deep-review/SKILL.md` (ad-hoc shell and intra-lineage wave stay forbidden/deferred)
- [ ] T005 Document "Fan-Out Convergence" in both `references/convergence/convergence.md` files
- [ ] T006 Add `fanout-pool.cjs` and `fanout-merge.cjs` to the script table in `deep-loop-runtime/SKILL.md`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T007 Run the final parity gate: a single-executor run byte-identical to pre-change `main` (config, state.jsonl modulo timestamps, iteration md, research.md/review-report.md)
- [ ] T008 Run the full vitest suite plus `validate.sh --strict` for the parent and children
- [ ] T009 Run `validate.sh` for this folder
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
