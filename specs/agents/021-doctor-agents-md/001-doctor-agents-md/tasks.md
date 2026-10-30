---
title: "Tasks: /doctor:agents-md"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md phase tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: /doctor:agents-md

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

**Scope.** This list is the cross-child sequencing and the aggregate gate. Each child's own `tasks.md` owns its file-level work; nothing here repeats it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm `/doctor:sk-skill` is on the start branch (`.skilled/commands/doctor/sk-skill.md`). Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit. Evidence: prints `afb71aa136`, and both of its routes validate in the family manifest.
- [x] T002 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'routes validated' scratch/baseline.txt` prints at least `1`. Evidence: the file holds all six commands with their exit codes, and `rg -c 'routes validated' scratch/baseline.txt` prints 1.
- [x] T003 Confirm all five child folders carry spec, plan, tasks and criteria (`001-manifest-and-template-block` to `005-verification-and-docs`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md --recursive --strict` exits 0. Evidence: exits 0 with `RESULT: PASSED` and `Errors: 0  Warnings: 0`, and each child validates on its own as well.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Close child 001 (`001-manifest-and-template-block/`). Verify: `node .skilled/commands/doctor/scripts/agents-md-manifest.cjs --check` exits 0. Evidence: prints `PASS: 44 sections, 30 pins, derived matches AGENTS.md`, exit 0. The child's 42 tasks are `[x]` and its 15 criteria read `Met`.
- [x] T005 Close child 002 (`002-check-engine/`). Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0 with `STATUS=OK`. Evidence: prints `STATUS=OK rows=12 findings=0 unknown=0` with `A1 install state: pure`, exit 0. The child's 42 tasks are `[x]` and its 17 criteria read `Met`.
- [x] T006 Close child 003 (`003-embed-engine/`). Verify: `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` prints `NOTHING TO DO`. Evidence: prints `[agents-md-embed] plan for <this repository> (state: pure)` then `NOTHING TO DO`, exit 0. The child's 45 tasks are `[x]` and its 18 criteria read `Met`.
- [x] T007 Close child 004 (`004-command-plumbing/`). Verify: `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 with the three routes. Evidence: prints `OK: route-validate — 24 routes validated, 5 warnings`, exit 0, with `check`, `embed` and `restore` in the manifest. The child's 41 tasks are `[x]` and its 15 criteria read `Met`.
- [x] T008 Close child 005 (`005-verification-and-docs/`). Verify: the nine transcripts exist and the two manual rows carry an answer or a recorded unknown. Evidence: `scratch/e2e/` in the child holds nine transcripts, and DOC-396 and DOC-397 each record `UNKNOWN` with its reason. The child's 14 tasks are `[x]` and its 11 criteria read `Met`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun every baseline command from the final tree (`scratch/baseline.txt`). Verify: each prints its pre-work pass line. Evidence: the canary prints `OK: all rule invariants present`, the gate 1 pointer sync prints `PASS: 1 instruction files carry the root Gate 1 lookup.`, the repo-rules checker prints `RESULT: PASSED (11/11 checks)`, `route-validate.sh` prints `OK: route-validate — 24 routes validated, 5 warnings`, the runner ends `7 suite(s) passed, 0 failed`, and the root file is 27888 bytes.
- [x] T010 Run the recursive phase gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md --recursive --strict` prints `RESULT: PASSED`. Evidence: exits 0 and prints `RESULT: PASSED` with `Errors: 0  Warnings: 0`.
- [x] T011 Confirm the change list (`git status --porcelain`). Verify: the list names only the files the five children name. Evidence: every path is named by a child's own list or by a close-out document, and the three deviations (the regenerated retrieval corpus, the re-minted sk-doc activation manifest, the regenerated Hermes copies) are recorded in the last child's implementation summary.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: every baseline command reruns green, the five child gates pass and the aggregate gate passes
- [x] Every child's acceptance criteria read `Met`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
- **Children**: See the five child folders named by the Phase Documentation Map in `spec.md`
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The doctor sk-skill command is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit. Evidence: prints `afb71aa136`.
- [x] CHK-002 [P0] The baseline is recorded. Verify: `rg -c 'check-rule-copies' scratch/baseline.txt` prints at least `1`. Evidence: prints 1.
- [x] CHK-003 [P1] The five children validate. Verify: the recursive gate prints `RESULT: PASSED`. Evidence: every child validates inside the parent's recursive run and on its own.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every child suite passes. Verify: `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`. Evidence: ends `7 suite(s) passed, 0 failed`, with `PASS: node:test (41 files)`.
- [x] CHK-011 [P0] No code comment carries a packet, phase or task id. Verify: `rg -n 'AC-[0-9]{3}|REQ-[0-9]{3}|specs/' .skilled/commands/doctor/scripts/agents-md-*.cjs` prints nothing. Evidence: prints nothing, exit 1, and the shared segmenter is clean too.
- [x] CHK-012 [P1] Every new file name is lowercase kebab. Verify: `git status --porcelain` lists no path with an uppercase letter in a new file's own name. Evidence: the only uppercase names are the existing `SKILL.md` and `README.md` conventions. The new files are `doctor-agents-md-block-devin-quote.md`, `doctor-agents-md-cursor-mirror-load.md`, `v4.0.1.4.md`, `v2.12.27.0.md`, `v0.17.28.0.md`, `v2.3.34.0.md` and `run-e2e.sh`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`. Evidence: AC-001 to AC-010 each read `Met`.
- [x] CHK-021 [P0] The four suites pass. Verify: every `node --test` command named in `plan.md` reports `fail 0`. Evidence: the family runner reports `PASS: node:test (41 files)` with no failure, and the three engine suites plus the command contract suite run inside it.
- [x] CHK-022 [P1] The pair agrees on every fixture. Verify: each of the nine transcripts pairs a state with the matching embed outcome. Evidence: the child's table records `pure` → `NOTHING TO DO`, a digest for the seven planable states, a named refusal for `over-budget`, and `NOTHING TO DO` on every reconfigured tree.
- [x] CHK-023 [P1] The canary still passes. Verify: `node .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js` exits 0. Evidence: prints `OK: all rule invariants present (8 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 6 extension floor(s) + 2 example output(s)).`, exit 0.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No write leaves the allowlist. Verify: the embed suite's allowlist case passes with a refused path named. Evidence: `every written path is inside the allowlist and a path outside it is refused` passes in `agents-md-embed.test.cjs`, naming `.skilled/repo-rules/scope-discipline.md` and `.cursorrules`.
- [x] CHK-031 [P0] No credential reaches a tracked file. Verify: `rg -ni 'api[_-]?key|token|secret|password' .skilled/commands/doctor/assets/agents-md-manifest.json` prints nothing. Evidence: prints one line, the shipped template's own `Exact text, token or symbol` table row inside a derived body. It is prose the template ships, not a credential, and it predates this phase.
- [x] CHK-032 [P1] No consumer path reaches a tracked file. Verify: `rg -n 'Users/|/home/' .skilled/commands/doctor/scripts .skilled/commands/doctor/assets` prints nothing. Evidence: the only matches are three pre-existing placeholder paths under `scripts/tests/fixtures/sk-skill-convert/source/`, none of which this phase touched. No `agents-md`-owned file carries one.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] The phase spec and this list agree on the five children. Verify: `rg -c 'manifest-and-template-block' spec.md tasks.md` reports a count in each. Evidence: `rg -c` prints 4 in `spec.md` and 3 in `tasks.md`.
- [x] CHK-041 [P1] The script README names the three scripts. Verify: `rg -c 'agents-md' .skilled/commands/doctor/scripts/README.markdown` prints at least `1`. Evidence: prints 16.
- [x] CHK-042 [P2] The changelog entry exists. Verify: the file the sk-doc router resolved exists and names the command. Evidence: `.skilled/changelog/skilled/v4.0.1.4.md` exists, names the command, its three targets and the inactive bridge, and validates with 0 issues.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Transcripts and baselines live under `scratch/`. Verify: `find scratch -type f | wc -l` prints a non-zero count. Evidence: the parent's `scratch/baseline.txt` and the child's `scratch/` tree hold the baselines, the runner and the nine transcripts.
- [x] CHK-051 [P1] No temporary fixture copy survives in the tree. Verify: `git status --porcelain` lists no temporary path. Evidence: every composed fixture copy lives under a throwaway run root outside the checkout.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 9 | 9/9 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
