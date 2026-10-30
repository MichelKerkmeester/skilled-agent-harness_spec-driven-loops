---
title: "Tasks: embed engine"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "agents md embed tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: embed engine

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

**Variables.** `E` is `.skilled/commands/doctor/scripts/agents-md-embed.cjs`. `T` is `.skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs`. `F` is `.skilled/commands/doctor/scripts/tests/fixtures/agents-md`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Record the six baseline commands into `scratch/baseline.txt` (`scratch/`). Verify: `rg -c 'check-repo-rules' scratch/baseline.txt` prints at least `1`. Done: `rg -c` printed `1`; the six commands are recorded with their output and exit codes at `d66b108cc1`, `run-all.sh` included (`7 suite(s) passed, 0 failed`).
- [x] T002 Confirm the update engine's classifier is exported and importable (`release-update.cjs`). Verify: `node -e "console.log(typeof require('./.skilled/commands/doctor/scripts/release-update.cjs').classifyFile)"` prints `function`. Done: printed `function`.
- [x] T003 Write the failing suite first, over temporary copies only (`T`). Verify: `node --test T` exits non-zero on `Cannot find module`. Done: exit 1 with `Error: Cannot find module '../agents-md-embed.cjs'`, recorded in `scratch/failing-first.log`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Implement the composer for the shipped sections plus the block (`E`). Verify: `node --test T` reports the composition case passing on the `foreign` fixture. Done: `the foreign shape keeps its whole original document inside the block` passes; `preservation: kept 5, carried 0, shipped-replaced 44, dropped 0`.
- [x] T005 Implement the four carry groups, in order (`E`). Verify: `node --test T` reports the carry-order case passing. Done: `the forked shape carries its unmarked section before its edited section` passes, and `a released body is replaced with no carry` covers the `stale-known` group.
- [x] T006 Implement the preservation function as a pure export (`E`). Verify: `node --test T` reports the four invariant cases passing. Done: `preservationCheck reports each part of the invariant` passes for parts 1, 2, 3 and 4.
- [x] T007 Implement `plan` with the diff, the ledger, the budget and the digest (`E`). Verify: `node E plan` on this repository prints `NOTHING TO DO` and exits 0. Done: prints `[agents-md-embed] plan for <root> (state: pure)` then `NOTHING TO DO`, exit 0.
- [x] T008 Implement `apply --plan-digest`, with the recompose and the refusal (`E`). Verify: `node --test T` reports the digest-mismatch case exiting 2 with no write. Done: `apply without a plan digest exits 2 and writes nothing` and `apply refuses a digest that the tree no longer produces` both pass with the tree digest unchanged.
- [x] T009 Implement backups and the ignored-directory fallback (`E`). Verify: `node --test T` reports the temp-directory fallback case passing. Done: `an ignored output path holds the backup and a non-ignored one falls back` passes: the base resolves to `.skilled/output/doctor-agents-md` here and `$TMPDIR/doctor-agents-md` elsewhere, and the plan directory under it is named by the plan digest.
- [x] T010 Implement the post-write proof and the automatic restore (`E`). Verify: `node --test T` reports the planted-drop case ending `STATUS=FAIL` after a restore. Done: `a planted drop restores the backup and ends STATUS=FAIL` passes, printing the dropped line and `restored: N file(s)`, with the file byte-identical to its pre-run bytes.
- [x] T011 Implement `restore --run=<dir>` (`E`). Verify: `node --test T` reports byte equality after restore. Done: `restore puts every recorded file back byte for byte`, `restore recreates a removed file and deletes a file the run created` and `restore cancels without a yes` pass.
- [x] T012 Add the allowlist check before every write (`E`). Verify: `node --test T` reports the allowlist case passing. Done: `every written path is inside the allowlist and a path outside it is refused` passes; `.skilled/...` is refused by name and `../...` by containment.
- [x] T013 Add the `CLAUDE.md` and `.codex/AGENTS.md` paths, including `--keep-claude-md` (`E`). Verify: `node --test T` reports the `claude-only` case and its keep-flag case passing. Done: `claude-only creates the root document and removes the copy`, `--keep-claude-md keeps the copy it folded` and `.codex/AGENTS.md is folded into the block and then removed` pass.
- [x] T014 Add the router rows and the cursor mirror, reusing the existing generators (`E`). Verify: `node --test T` reports the rows case and the mirror-exists-when-block-non-empty case passing. Done: `a router missing shipped rows gains exactly those rows` and `.cursor/rules/repo-local.md exists exactly when the block carries content` pass; the pointer block is written by `sync-gate1-pointers.cjs` and the router verdict read from `check-repo-rules.cjs`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Prove idempotence (`E`). Verify: a second `node E plan` on the applied copy prints `NOTHING TO DO`. Done: `a second run prints NOTHING TO DO` passes for both `plan` and `apply`, and the tree digest is unchanged. The same holds on this repository, whose plan prints `NOTHING TO DO`.
- [x] T016 Prove the repo-rules rows are minimal (`E`). Verify: `node .skilled/skills/sk-doc/sk-create-repo-rule/scripts/check-repo-rules.cjs --root <tmp>` prints `RESULT: PASSED (11/11 checks)`. Done: both router cases pass the checker on a temporary root: `RESULT: PASSED (11/11 checks)`, exit 0.
- [x] T017 Run the child gate (`specs/agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine/`). Verify: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine --strict` prints `RESULT: PASSED`. Done: `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`, exit 0.
- [x] T018 Confirm no tracked file was touched by the suite (`git status --porcelain`). Verify: the list names only the two files in `spec.md` section 3. Done: `git status --porcelain` lists the two engine files plus this packet's own documents, and `git diff --quiet AGENTS.md` exits 0.
- [x] T019 Carry the three document shapes the review found, tests first (`E`, `T`). Verify: `node --test T` reports `tests 26`, `pass 26`, `fail 0`. Done: three new cases failed first (`fail 3`, saved under the review's scratch folder) and pass after the repair; a block written between shipped sections, a line below the end marker and the text above the first heading each move into the one block at the end exactly once, and `preservationCheck` reports `dropped 0`, `foreign 0` on each.
- [x] T020 Carry the seven findings of the fresh review, tests first (`E`, `T`). Verify: `node --test T` reports `tests 33`, `pass 33`, `fail 0`. Done: seven new cases failed first (`fail 8` in the same run, the eighth being the case whose helper renamed) and pass after the repair — the marker line rule with the raw-line proof, the duplicated-block refusal, `--dry-run`, the digest-named backup directory, verbatim carry and the two shape cases.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] The measured plan runtime is recorded in `implementation-summary.md`
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Acceptance criteria**: See `acceptance-criteria.md`
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

- [x] CHK-001 [P0] `/doctor:sk-skill` is on the start branch. Verify: `git -c core.fsmonitor=false log --oneline -1 -- .skilled/commands/doctor/sk-skill.md` prints a commit. Evidence: `0a8bd93611 docs(sk-doc): describe the later /doctor:sk-skill fixes in its docs and changelogs`, and the router is present at `.skilled/commands/doctor/sk-skill.md`.
- [x] CHK-002 [P0] Child 002's engine exists and reports on this repository. Verify: `node .skilled/commands/doctor/scripts/agents-md-check.cjs` exits 0. Evidence: exit 0, `STATUS=OK rows=12 findings=0 unknown=0`, `A1 install state: pure`.
- [x] CHK-003 [P1] The classifier is exported by the update engine. Verify: `node -e "console.log(typeof require('./.skilled/commands/doctor/scripts/release-update.cjs').classifyFile)"` prints `function`. Evidence: printed `function`.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The engine parses. Verify: `node --check .skilled/commands/doctor/scripts/agents-md-embed.cjs` exits 0. Evidence: exit 0.
- [x] CHK-011 [P0] Every write passes the allowlist. Verify: the allowlist case passes and `rg -n 'ALLOWLIST' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints the check site. Evidence: `assertWritable` is called for every target before the first byte, and the suite's allowlist case passes.
- [x] CHK-012 [P1] No code comment carries a packet, phase or task id. Verify: `rg -n 'AC-[0-9]{3}|REQ-[0-9]{3}|specs/' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints nothing. Evidence: no match.
- [x] CHK-013 [P1] The engine never stages or commits. Verify: `rg -n 'git add|git commit|git stash' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints nothing. Evidence: no match; the only git call is a read-only `check-ignore`, and the suite asserts it.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every acceptance criterion is met. Verify: the rows in `acceptance-criteria.md` read `Met`. Evidence: AC-001 through AC-018 all read `Met`, each naming the case or command that proves it.
- [x] CHK-021 [P0] The suite passes. Verify: `node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` reports `fail 0`. Evidence: `tests 33`, `pass 33`, `fail 0`, exit 0; `tests 26` before the fresh review's repair added seven cases.
- [x] CHK-022 [P1] The planted-drop case restores automatically. Verify: the case names the restore and the dropped lines. Evidence: the case asserts `STATUS=FAIL`, the dropped line text, `restored: N file(s)`, and the file byte-identical to its pre-run bytes.
- [x] CHK-023 [P1] The suite uses temporary copies. Verify: `rg -c 'mkdtempSync' .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` prints at least `1`. Evidence: printed `2`; every tree is composed into a `mkdtempSync` folder and removed with the case.
- [x] CHK-024 [P1] Every review finding in this engine is repaired and held by a case. Verify: `node --test T` names the three new cases and they pass. Evidence: `a block placed between shipped sections is carried into the block at the end`, `a line after the end marker is carried into the block` and `text before the first heading is carried into the block` all pass, and the preservation check counts the text above the first heading as part of part one.
- [x] CHK-025 [P0] Every finding of the fresh review is repaired and held by a case. Verify: `node --test T` names the seven new cases and they pass. Evidence: `a sentence quoting both markers is repository content, not the block`, `the preservation proof requires the raw lines of the old document`, `a marker literal after text is content, and a lone marker line is refused`, `a document carrying two blocks is refused by name, not as dropped lines`, `a carried line keeps its leading whitespace`, `apply --dry-run prints the plan and writes nothing` and `the plan names the backup apply uses, and a taken directory is re-planned` all pass, and the reviewer's F1, F2 and F3 probes end `PROBE OK` and with no finding about the backup directory or the dry run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secret. Verify: `rg -ni 'api[_-]?key|token|secret|password' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints nothing. Evidence: no match.
- [x] CHK-031 [P0] No write outside the allowlist. Verify: the allowlist case passes with a refused path named. Evidence: `.skilled/repo-rules/scope-discipline.md` and `.cursorrules` are refused by name, `../outside-the-root.md` by containment.
- [x] CHK-032 [P1] No consumer path reaches a tracked file. Verify: `rg -n 'Users/|/home/' .skilled/commands/doctor/scripts/agents-md-embed.cjs` prints nothing. Evidence: no match; a root is printed only at run time.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec and plan agree on the four parts of the invariant. Verify: `rg -c 'preservation' spec.md plan.md` reports a count in each. Evidence: a count in both files; the code implements the four numbered parts as one function.
- [x] CHK-041 [P1] The allowlist in `spec.md` matches the one in code. Verify: the six paths appear in both. Evidence: `AGENTS.md`, `CLAUDE.md`, `.codex/AGENTS.md`, `.cursor/rules/repo-local.md`, `.cursor/rules/skill-routing.md`, `REPO RULES.md`, in `ALLOWLIST` and in section 3.
- [x] CHK-042 [P2] The plan runtime is recorded. Verify: `rg -n 'seconds' implementation-summary.md` prints the measured figure. Evidence: 0.13-0.17 s over a 43,769-byte input, and 0.30 s for the apply.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temporary copies live under the OS temp directory, created by `mkdtempSync`, and are removed. Verify: `git status --porcelain` lists no temporary path. Evidence: no temporary path appears; every case removes its own folder.
- [x] CHK-051 [P1] No backup directory is created inside the repository during a test run. Verify: `ls .skilled/output 2>/dev/null` prints nothing new or fails. Evidence: no `.skilled/output` under this worktree; a plan on this repository reports `NOTHING TO DO` and creates no backup at all.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-30
<!-- /ANCHOR:summary -->

---
