---
title: "Tasks: Phase 32: citation-drift-scan"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "citation drift tasks"
  - "cite-drift-scan tasks"
  - "citation drift verification"
  - "citation drift label tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 32: citation-drift-scan

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

`S` is `.skilled/skills/sk-doc/shared/scripts/cite-drift-scan.mjs`, `T` is `.skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` and `L` is `.skilled/skills/sk-doc/shared/scripts/cite-drift-labels.jsonl`, all proposed. Nothing is built. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the owner's contracts before writing: `shared/scripts/README.md`, `frontmatter-version.mjs`, `scripts/tests/test-frontmatter-version.mjs`, `scripts/tests/run-script-tests.sh`, `cli-classifier/cli-deem/SKILL.md` and `cli-classifier/cli-usage/SKILL.md`. Route the code write through sk-code's OpenCode route (`.skilled/skills/sk-doc/shared/scripts/`)
- [ ] T002 Record the baseline: `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` and `node .skilled/skills/sk-doc/scripts/tests/test-frontmatter-version.mjs`, output and exit code saved before any change (`.skilled/skills/sk-doc/scripts/tests/`)
- [ ] T003 [P] Build the test fixtures inside `T`: a temp git repository with two skill folders, docs holding in-range, past-end, ambiguous, fenced and `.env` citations, and stub `jev` and `cli-deem` binaries that log one line per call (`T`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Extractor and resolver: the citation pattern outside fenced code, the synthesis's resolution order against `git ls-files` only, `.env` basenames refused (`S`). Spec REQ-002, REQ-003
- [ ] T005 Census and dead check: per-skill counts with the HEAD commit, one `cite dead:` line per dead citation, zero calls (`S`). Spec REQ-001, REQ-003
- [ ] T006 `--draw --seed <n>`: 40 rows at the HEAD commit, 20 live and 20 constructed by the 60-line wrapping offset, hashes and no text, refusal to overwrite an operator label (`S`, `L`). Spec REQ-004
- [ ] T007 Comparators and label gate: flag-nothing and identifier overlap on identical rows, the baseline method with flag-nothing winning a tie, `stop: fewer than 40 labeled rows`, `margin: 0.10`, the `keep rule:` line and the `no headroom` and `underpowered` lines (`S`). Spec REQ-005, REQ-006
- [ ] T008 Deem gate and arm: `cli-deem health` within 2,000 ms, the four skip lines, the payload notice, one `noul` per row with the fixed `-q`, exits and records with the commit pair (`S`). Spec REQ-007, REQ-011, REQ-012
- [ ] T009 Jev gate and arm: the identity line, three checks and three skip lines, one `jev auth test --provider P`, the payload notice without a dollar figure, three calls per row with no cache, the 90 s cap, exits and records with version, provider and model (`S`). Spec REQ-008, REQ-011, REQ-012
- [ ] T010 Verdict per column on stdout and in `report.json`: the five conditions in order, integer counts, an exact p, the Brier score printed beside it and both `requalify` lines (`S`). Spec REQ-006, REQ-013
- [ ] T011 [P] README rows for the script, the labels file and the test (`.skilled/skills/sk-doc/shared/scripts/README.md`, `.skilled/skills/sk-doc/scripts/tests/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T012 `node --test .skilled/skills/sk-doc/scripts/tests/test-cite-drift-scan.mjs` exits 0 with at least 18 passed and 0 failed, one happy path and one edge case per surface listed in spec REQ-014 (`T`)
- [ ] T013 One zero-call run on the real tree with stub binaries first on `PATH`: record the census, the dead count and the stop line in `goal.md`'s log, and confirm both stub logs are empty and `git status --porcelain` is unchanged (`S`)
- [ ] T014 Run `--draw --seed <n>` on the real tree, record the seed and commit, and commit the drawn file through the parent session (`L`)
- [ ] T015 [B] The operator labels the 20 live rows `supports`, `partial` or `contradicts` and may relabel any constructed row. No model writes a label. Blocked on the operator (`L`)
- [ ] T016 After T015, one zero-call run. Unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes, then one `--deem --out <dir>` run when the Deem gate passes. Record each verdict line, or skip line, with p50, p95 and what it was measured on in `goal.md`'s log (`S`)
- [ ] T017 After T016, sk-doc's `SKILL.md`, `README.md`, the next changelog file, one catalog entry in `document-validation` with its index row and one playbook scenario with its index row, each through its sk-doc mode, then regenerate `.hermes/skills/sk-doc/SKILL.md` with `sync-skills-hermes.cjs` (`.skilled/skills/sk-doc/`)
- [ ] T018 `validate_document.py` exits 0 on every doc T011 and T017 changed, the key grep of spec REQ-009 returns no match and `git status --porcelain` lists only the Files to Change paths, this folder and the report directory (`S`)
- [ ] T019 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and the sk-doc suite fails nothing beyond T002's baseline. Then the parent session commits with path-scoped commits (parent goal D5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining: T015 waits on the operator's labels
- [ ] Each backend whose gate passed printed a verdict line, or the zero-call run printed `no headroom` or `underpowered`, and the line is in `goal.md`'s log
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: `../007-classifier-deep-research/research/research.md:844-863` (R24) and `:460-480` (validators)
<!-- /ANCHOR:cross-refs -->

---
