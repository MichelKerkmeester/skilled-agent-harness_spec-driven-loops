---
title: "Tasks: evilcharts reference research for sk-create-chart"
description: "The ordered work of vendoring the reference, running the two-lineage fan-out, synthesising the result and verifying the phase."
trigger_phrases:
  - "evilcharts tasks"
  - "fan-out task list"
  - "chart research tasks"
importance_tier: "important"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: evilcharts reference research for sk-create-chart

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:setup -->
## 1. SETUP

- [x] **T-001** Allocate a worktree through the sk-git allocator, from `skilled/v4.0.0.0`.
  *Evidence*: `worktrees/043-evilcharts-reference-research` at `~/worktrees/public/043-evilcharts-reference-research`.
- [x] **T-002** Symlink the gitignored dependency and build trees the deep-loop runtime needs.
  *Evidence*: eight links recorded in `implementation-summary.md`.
- [x] **T-003** Create the phase folder and its documents.
  *Evidence*: this file, plus `spec.md`, `plan.md`, `goal.md`, `acceptance-criteria.md`.
- [x] **T-004** Clone evilcharts at depth one, drop its `.git`, keep `LICENSE` at the top of the
  tree, and write the provenance note.
  *Evidence*: `context/README.md` names commit `500ecd44c1fdcf319ba83ea68f3771bc76125974`.
<!-- /ANCHOR:setup -->

---

<!-- ANCHOR:implementation -->
## 2. IMPLEMENTATION

- [x] **T-005** Compose the research brief: reverse-engineer the vendored library, then map every
  finding onto `sk-create-chart` with a verdict and a ranked list of concrete template changes.
  Evidence: the brief is recorded in each lineage's `deep-research-strategy.md`, and both
  syntheses answer it with a ranked list plus a rejection table.
- [x] **T-006** Run the fan-out with both executors in one config, concurrency two, five iterations
  each, convergence disabled through `--stop-policy max-iterations`. Evidence: nine of the ten
  iterations completed, five on DeepSeek and four on GLM. The run also exposed a runtime defect:
  the fan-out script pinned every Flash model to the top effort tier named `max`, which the GLM
  model rejects on every route, while the TypeScript source it mirrors already carried the
  carve-out. The script was repaired before the dispatch, and the recorded effective config
  confirms the model ran at its own top tier.
- [x] **T-007** Confirm each lineage is progressing after its first iteration, and read the lineage
  logs rather than guessing if one goes quiet for more than ten minutes. Evidence: both state
  logs were read directly. The GLM lineage was classified a salvage miss by the runtime because
  it stopped before writing its own synthesis. That synthesis was completed afterwards from the
  four iteration records it had already written.
- [x] **T-008** Merge the two lineages into one ranked synthesis at `research/research.md`, every
  row carrying an evilcharts `file:line` and a verdict. Evidence: nine agreements, four
  contradictions each resolved with the losing argument kept, and the unique contributions of
  each lineage. Four citations were opened at the exact line to confirm the pair is verifiable.
<!-- /ANCHOR:implementation -->

---

<!-- ANCHOR:verification -->
## 3. VERIFICATION

- [ ] **T-009** `NODE_PRESERVE_SYMLINKS=1 bash "$(realpath .opencode)/skills/system-spec-kit/scripts/spec/validate.sh" specs/sk-doc/051-sk-create-chart/008-evilcharts-reference-research --strict` prints `RESULT: PASSED` with rule lines present.
- [ ] **T-010** Generate this folder's description and backfill its graph metadata.
- [ ] **T-011** Add row 8 to the parent phase map and this phase's goal to the parent BINDING table.
- [ ] **T-012** Commit in the worktree, by explicit path, and only the paths this phase owns.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:notes -->
## 4. NOTES

The order of T-003 and T-004 before T-006 is not a preference. A live fan-out lineage restores
tracked files from `HEAD`, so anything authored while one is running can be erased. Every document
in this folder is written before the run starts.
<!-- /ANCHOR:notes -->
