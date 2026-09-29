---
title: "Tasks: Phase 35: fetched-text-injection-screen"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "injection screen tasks"
  - "score-injection-screen tasks"
  - "injection screen verification"
  - "injection screen label tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 35: fetched-text-injection-screen

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

`D` is `.skilled/skills/cli-classifier/benchmark/injection-screen/`, `S` is `D/score-injection-screen.mjs`, `T` is `D/tests/score-injection-screen.test.mjs`, `L` is `D/labels.jsonl` and `P` is `D/planted.jsonl`, all proposed. Nothing is built. The phase was released on 2026-09-29, when the operator's "Bind and release" amended parent goal D3. Builds run in number order, and disjoint builds may run in parallel.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Read the owner's contracts before writing: the hub's `SKILL.md`, `README.md` and `benchmark/README.md`, `cli-deem/SKILL.md`, `cli-usage/SKILL.md`, `cli-deem.test.mjs` and the vendored `screen.ts` and `docs/screen.md`. Confirm the proposed placement with the operator. Route the code write through sk-code's OpenCode route (`.skilled/skills/cli-classifier/`)
- [ ] T002 Record the baseline: `node --test .skilled/skills/cli-classifier/cli-deem/scripts/tests/cli-deem.test.mjs`, its counts and exit code saved before any change. 34 of 34 passed on 2026-09-29 (`.skilled/skills/cli-classifier/cli-deem/scripts/tests/`)
- [ ] T003 [P] Build the test fixtures inside `T`: a temp git repository with two commits, state logs with and without `toolsUsed`, agent files, a small vendored corpus with a notes file, a section quoting an example directive, a heading inside a fence and a `.env` path, plus stub `jev` and `cli-deem` binaries that log one line per call (`T`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Fetch census: tracked state logs and agent `tools:` lines, tool names only (`S`). Spec REQ-002
- [ ] T005 Corpus walker, section splitter and lexical screen: tracked vendored `.md`, the notes file excluded, `.env` refused, the 5 to 60 line band and the four patterns printed with their SHA-256 (`S`). Spec REQ-002, REQ-003
- [ ] T006 Census output: both censuses and the HEAD commit, zero calls and no text (`S`). Spec REQ-001, REQ-002
- [ ] T007 `--draw --seed <n>`: 60 natural and 30 planted rows, the per-source cap, seeded insert lines, hashes with no text and refusal to overwrite a label (`S`, `L`, `P`). Spec REQ-004
- [ ] T008 Baseline and label gate: both accuracies and the `instructs` share, `stop: fewer than 90 labeled rows` including a missing sentence, `margin: 0.10`, the `keep rule:` line and the `no headroom` and `underpowered` lines (`S`). Spec REQ-005, REQ-006
- [ ] T009 Deem gate and arm: `cli-deem health` within 2,000 ms, the four skip lines, the payload notice, one `noul` per row with the fixed `-q`, exits and records with the commit pair (`S`). Spec REQ-007, REQ-011, REQ-012
- [ ] T010 Jev gate and arm: the identity line, three checks and three skip lines, one `jev auth test --provider P`, the payload notice without a dollar figure, three calls per row with no cache, the 90 s cap, a missing answer `unmeasured`, exits and records with version, provider and model (`S`). Spec REQ-008, REQ-011, REQ-012
- [ ] T011 Verdict per column on stdout and in `report.json`: the five conditions in order, integer counts, an exact p, the Brier score and the 0.25 and 0.75 flag counts printed beside it and both `requalify` lines (`S`). Spec REQ-006, REQ-013
- [ ] T012 [P] The layout row in the benchmark README (`.skilled/skills/cli-classifier/benchmark/README.md`)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 `node --test .skilled/skills/cli-classifier/benchmark/injection-screen/tests/score-injection-screen.test.mjs` exits 0 with at least 18 passed and 0 failed, one happy path and one edge case per surface listed in spec REQ-014 (`T`)
- [ ] T014 One zero-call run on the real tree with stub binaries first on `PATH`: record both censuses and the stop line in `goal.md`'s log, and confirm both stub logs are empty and `git status --porcelain` is unchanged (`S`)
- [ ] T015 Run `--draw --seed <n>` on the real tree, record the seed and the rows per source group, and commit the drawn file through the parent session (`L`)
- [ ] T016 [B] The operator labels the 60 natural rows `instructs` or `clean` and writes the 30 planted sentences. No model writes a label or a sentence. Blocked on the operator (`L`, `P`)
- [ ] T017 After T016, one zero-call run. Unless it prints `no headroom` or `underpowered`, one `--jev --out <dir>` run when the Jev gate passes, then one `--deem --out <dir>` run when the Deem gate passes. Record each verdict line, or skip line, with p50, p95 and what it was measured on in `goal.md`'s log (`S`)
- [ ] T018 After T017, the hub's `SKILL.md`, `README.md`, the next changelog file, one catalog entry where `sk-create-feature-catalog`'s contract places a hub-level measurement and one playbook scenario with its index row, each through its sk-doc mode, then regenerate `.hermes/skills/cli-classifier/SKILL.md` with `sync-skills-hermes.cjs` (`.skilled/skills/cli-classifier/`)
- [ ] T019 `validate_document.py` exits 0 on every doc T012 and T018 changed, the key grep of spec REQ-009 returns no match, `git diff --stat .claude/settings.json .skilled/hooks` is empty and `git status --porcelain` lists only the Files to Change paths, this folder and the report directory (`S`)
- [ ] T020 A cross-family review of `S` and `T` leaves no open P0 or P1 finding, and `cli-deem.test.mjs` fails nothing beyond T002's baseline. Then the parent session commits with path-scoped commits (parent goal D5)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining: T016 waits on the operator's labels and sentences
- [ ] Each backend whose gate passed printed a verdict line, or the zero-call run printed `no headroom` or `underpowered`, and the line is in `goal.md`'s log with the seam still recorded as open
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research record**: `../001-deep-research/research/research.md:915-932` (R16), `../004-deep-research-expansion/research/research.md:748` and `../007-classifier-deep-research/research/research.md:426` and `:924`
<!-- /ANCHOR:cross-refs -->

---
