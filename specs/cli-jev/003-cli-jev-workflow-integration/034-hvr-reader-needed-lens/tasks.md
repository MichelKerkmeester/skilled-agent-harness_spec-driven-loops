---
title: "Tasks: Phase 34: hvr-reader-needed-lens"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hvr reader lens tasks"
  - "reader lens sibling script tasks"
  - "reader-needed lens verification"
  - "reader-needed lens label tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 34: hvr-reader-needed-lens

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

`S` is `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr_reader_lens.py`, `T` is `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` and `L` is `.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/hvr-reader-lens-labels.jsonl`, all proposed. Nothing is built. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the owner's contracts before writing: the packet's `SKILL.md`, `README.md` and `scripts/README.md`, `hvr_scan.py`, `test_hvr_scan.py`, `references/hvr-rules.md`, `shared/scripts/validation_switch.py`, `cli-classifier/cli-deem/SKILL.md` and `cli-classifier/cli-usage/SKILL.md`. Route the code write through sk-code (`.skilled/skills/sk-doc/sk-create-with-human-voice/`)
- [ ] T002 Record the baseline: `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_scan.py`, its PASS count, `ALL PASS` line and exit code saved before any change. 11 PASS on 2026-09-29 (`.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/`)
- [ ] T003 [P] Build the test fixtures inside `T`: a temp git repository with two commits, skill folders holding flagged and unflagged sections, a heading inside a fence, a listed significance phrase, a false range and a genuine range, an untracked doc and a `.env` path, plus stub `jev` and `cli-deem` binaries that log one line per call (`T`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Frame walker and scanner bridge: the In Scope path rule over `git ls-files`, batched `hvr_scan.py --json`, `.env` refused, a skipped scan stopping the run and a scanner exit 2 stopping it with exit 2 (`S`). Spec REQ-002, REQ-003
- [ ] T005 Section splitter and census output: ATX headings outside fences, flagged sections, the 5 to 80 line band, candidates per comparator and the HEAD commit, zero calls and no text (`S`). Spec REQ-001, REQ-002
- [ ] T006 Comparators: the eight significance phrases parsed from the standard at run time and the false-range pattern (`S`). Spec REQ-005
- [ ] T007 `--draw --seed <n>`: 150 rows, 50 per category, candidate halves, the per-skill cap, hashes with no text and refusal to overwrite a label (`S`, `L`). Spec REQ-004
- [ ] T008 Baselines and label gate: both accuracies and the `yes` share per category, `stop: fewer than 150 labeled rows`, `margin: 0.10`, the `keep rule:` line, the headroom and power lines and `stop: fewer than 2 categories can pass` (`S`). Spec REQ-005, REQ-006
- [ ] T009 Deem gate and arm: `cli-deem health` within 2,000 ms, the four skip lines, the payload notice, one `noul` per row with its category's fixed `-q`, exits and records with the commit pair (`S`). Spec REQ-007, REQ-011, REQ-012
- [ ] T010 Jev gate and arm: the identity line, three checks and three skip lines, one `jev auth test --provider P`, the payload notice without a dollar figure, three calls per row with no cache, the 90 s cap, exits and records with version, provider and model (`S`). Spec REQ-008, REQ-011, REQ-012
- [ ] T011 Verdict per column on stdout and in `report.json`: the order of spec REQ-006, integer counts, an exact p, the Brier score printed beside it, three category lines and both `requalify` lines (`S`). Spec REQ-006, REQ-013
- [ ] T012 [P] README rows for the script, the test and the labels file (`.skilled/skills/sk-doc/sk-create-with-human-voice/scripts/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 `python3 .skilled/skills/sk-doc/sk-create-with-human-voice/scripts/tests/test_hvr_reader_lens.py` exits 0 and prints `ALL PASS` with at least 18 checks, one happy path and one edge case per surface listed in spec REQ-014, and `test_hvr_scan.py` still prints T002's 11 PASS (`T`)
- [ ] T014 One zero-call run on the real tree with stub binaries first on `PATH`: record the census and the stop line in `goal.md`'s log, and confirm both stub logs are empty and `git status --porcelain` is unchanged (`S`)
- [ ] T015 Run `--draw --seed <n>` on the real tree, record the seed and the candidate rows per category, and commit the drawn file through the parent session (`L`)
- [ ] T016 [B] The operator labels all 150 rows `yes` or `no` for each row's category. No model writes a label. Blocked on the operator (`L`)
- [ ] T017 After T016, one zero-call run. Unless it prints `stop: fewer than 2 categories can pass`, one `--jev --out <dir>` run when the Jev gate passes, then one `--deem --out <dir>` run when the Deem gate passes. Record each verdict line and category line, or skip line, with p50, p95 and what it was measured on in `goal.md`'s log (`S`)
- [ ] T018 After T017, the packet's `SKILL.md`, `README.md`, the next changelog file, one sk-doc hub catalog entry in `document-validation` with its index row and one playbook scenario in `tell-detection` with its index row, each through its sk-doc mode, then regenerate `.hermes/skills/sk-create-with-human-voice/SKILL.md` with `sync-skills-hermes.cjs` (`.skilled/skills/sk-doc/`)
- [ ] T019 `validate_document.py` exits 0 on every doc T012 and T018 changed, the key grep of spec REQ-009 returns no match, `git diff --stat` on `hvr_scan.py` is empty and `git status --porcelain` lists only the Files to Change paths, this folder and the report directory (`S`)
- [ ] T020 A cross-family review of `S` and `T` leaves no open P0 or P1 finding. Then the parent session commits with path-scoped commits (parent goal D5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining: T016 waits on the operator's labels
- [ ] Each backend whose gate passed printed a verdict line, or the zero-call run printed `stop: fewer than 2 categories can pass`, and the line is in `goal.md`'s log
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: `../004-deep-research-expansion/research/research.md:711-729` (R22) and `../007-classifier-deep-research/research/research.md:97` (C13), `:429` and `:927`
<!-- /ANCHOR:cross-refs -->

---
