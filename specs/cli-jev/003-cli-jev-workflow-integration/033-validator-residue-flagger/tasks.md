---
title: "Tasks: Phase 33: validator-residue-flagger"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "residue flagger tasks"
  - "score-residue-flagger tasks"
  - "residue flagger verification"
  - "residue flagger label tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 33: validator-residue-flagger

<!-- SPECKIT_LEVEL: 1 -->

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

`S` is `.skilled/skills/system-deep-loop/deep-review/scripts/score-residue-flagger.cjs`, `T` is `.skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` and `L` is `.skilled/skills/system-deep-loop/deep-review/scripts/residue-flagger-labels.jsonl`, all proposed. Nothing is built. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the owner's contracts before writing: `deep-review/SKILL.md`, `scripts/README.md`, `scripts/tests/README.md`, `assets/prompt-pack-iteration.md.tmpl`, `references/state/state-outputs.md`, `cli-classifier/cli-deem/SKILL.md` and `cli-classifier/cli-usage/SKILL.md`. Route the code write through sk-code's OpenCode route (`.skilled/skills/system-deep-loop/deep-review/`)
- [ ] T002 Record the baseline: `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/`, output and exit code saved before any change (`.skilled/skills/system-deep-loop/deep-review/scripts/tests/`)
- [ ] T003 [P] Build the test fixtures inside `T`: a temp git repository with two commits, review folders holding three finding-table header shapes and one unrecognized shape, cited documents, an untracked review file and a `.env` location, plus stub `jev` and `cli-deem` binaries that log one line per call (`T`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Corpus walker and table parser: the In Scope path rule over `git ls-files`, header-driven reading of severity, dimension and location, skipped tables counted per header shape (`S`). Spec REQ-002
- [ ] T005 Commit and location resolver: the first parent of the commit that added the review file, a tracked `.md` line at that commit, `.env` refused, unresolvable rows counted and dropped (`S`). Spec REQ-003
- [ ] T006 Census output: rows per severity, per dimension and per header shape, the skipped tables, the resolvable correctness and traceability rows and the HEAD commit, zero calls and no text (`S`). Spec REQ-001, REQ-002
- [ ] T007 `--draw --seed <n>`: 100 rows, 50 positives and 50 negatives, 25 per category each, 20-line spacing, hashes and no text, the category shortfall exit and refusal to overwrite a label (`S`, `L`). Spec REQ-004
- [ ] T008 Baseline and label gate: flag-nothing's accuracy and the `defect` share, `stop: fewer than 100 labeled rows`, `margin: 0.10`, the `keep rule:` line and the `no headroom` and `underpowered` lines (`S`). Spec REQ-005, REQ-006
- [ ] T009 Deem gate and arm: `cli-deem health` within 2,000 ms, the four skip lines, the payload notice, one `noul` per row with its category's fixed `-q`, exits and records with the commit pair (`S`). Spec REQ-007, REQ-011, REQ-012
- [ ] T010 Jev gate and arm: the identity line, three checks and three skip lines, one `jev auth test --provider P`, the payload notice without a dollar figure, three calls per row with no cache, the 90 s cap, exits and records with version, provider and model (`S`). Spec REQ-008, REQ-011, REQ-012
- [ ] T011 Verdict per column on stdout and in `report.json`: the five conditions in order, integer counts, an exact p, the Brier score printed beside it and both `requalify` lines (`S`). Spec REQ-006, REQ-013
- [ ] T012 [P] README rows for the script, the labels file and the test (`.skilled/skills/system-deep-loop/deep-review/scripts/README.md`, `scripts/tests/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 `node --test .skilled/skills/system-deep-loop/deep-review/scripts/tests/score-residue-flagger.test.cjs` exits 0 with at least 18 passed and 0 failed, one happy path and one edge case per surface listed in spec REQ-014 (`T`)
- [ ] T014 One zero-call run on the real tree with stub binaries first on `PATH`: record the census and the stop line in `goal.md`'s log, and confirm both stub logs are empty and `git status --porcelain` is unchanged (`S`)
- [ ] T015 Run `--draw --seed <n>` on the real tree, record the seed and the counts per category, and commit the drawn file through the parent session. A category shortfall goes to the operator before any label (`L`)
- [ ] T016 [B] The operator labels all 100 rows `defect` or `clean` for each row's category. No model writes a label. Blocked on the operator (`L`)
- [ ] T017 After T016, one zero-call run. Unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes, then one `--deem --out <dir>` run when the Deem gate passes. Record each verdict line, or skip line, with p50, p95 and what it was measured on in `goal.md`'s log (`S`)
- [ ] T018 After T017, deep-review's `SKILL.md`, `README.md`, the next changelog file, one catalog entry in `review-dimensions` with its index row and one playbook scenario with its index row, each through its sk-doc mode, then regenerate `.hermes/skills/deep-review/SKILL.md` with `sync-skills-hermes.cjs` (`.skilled/skills/system-deep-loop/deep-review/`)
- [ ] T019 `validate_document.py` exits 0 on every doc T012 and T018 changed, the key grep of spec REQ-009 returns no match and `git status --porcelain` lists only the Files to Change paths, this folder and the report directory (`S`)
- [ ] T020 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and the deep-review tests fail nothing beyond T002's baseline. Then the parent session commits with path-scoped commits (parent goal D5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining: T016 waits on the operator's labels
- [ ] Each backend whose gate passed printed a verdict line, or the zero-call run printed `no headroom` or `underpowered`, and the line is in `goal.md`'s log
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: `../007-classifier-deep-research/research/research.md:886-905` (R26), `:460-480` (validators) and `:113` (K9)
<!-- /ANCHOR:cross-refs -->

---
