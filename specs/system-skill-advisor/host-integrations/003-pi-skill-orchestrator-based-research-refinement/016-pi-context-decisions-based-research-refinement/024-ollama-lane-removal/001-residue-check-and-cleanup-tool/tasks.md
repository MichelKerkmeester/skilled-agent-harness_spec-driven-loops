---
title: "Tasks: Phase 1: residue-check-and-cleanup-tool"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "residue check and cleanup tool tasks"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 1: residue-check-and-cleanup-tool

<!-- SPECKIT_LEVEL: 3 -->

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

`S/` is `.skilled/skills/system-spec-kit/runtime/cli/`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the sweeper, the dotenv CLI and the advisor database resolver (`S/retrieval/sweep-memory-residue.mjs`, `.skilled/hooks/env-secret-guard/cli/env-secret.cjs`, `.skilled/skills/system-skill-advisor/runtime/lib/skill-graph/skill-graph-db.ts`). Verify: `rg -n 'EXIT_LIVE_HITS = 1' S/retrieval/sweep-memory-residue.mjs` prints line 59. Evidence: read all three; `EXIT_LIVE_HITS = 1` is at line 59 of the memory sweeper.
- [x] T002 [P] Run every gate in research section 5.1 and record each command, exit status and pass count (`implementation-summary.md`). Verify: `rg -c '^\| ' implementation-summary.md` counts at least 12 gate rows. Evidence: 16 gate rows in `implementation-summary.md` Gate Baselines; advisor 2570 passed after the worktree database was built.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Write repo mode: both vocabularies through `git grep -l -i -E` with `:!specs`, path words over `git ls-files`, dependency rows and the embeddings symlink (`S/retrieval/sweep-lane-residue.mjs`). Verify: `node S/retrieval/sweep-lane-residue.mjs repo; echo $?` prints a file list and `1`. Evidence: `repo` exit 1, 333 files (identifier 279, prose 163, path 40, symlink 1), live 309, allowlisted 24; 8.6s.
- [x] T004 Write the exact-path allowlist loader and its first rows, the script, allowlist and test themselves, the sweeper with the `ollama-preserve` guard, and each research F14 survivor confirmed by reading it (`S/retrieval/fixtures/lane-residue-allowlist.json`). Verify: `node S/retrieval/sweep-lane-residue.mjs repo --json | node -e "process.stdin.on('data',d=>0)"` exits 0 and the allowlisted count in the summary equals the row count that matched. Evidence: piped `--json` command exit 0; 27 rows, 24 matched, allowlisted 24; the 3 own-file rows are unused while untracked. Deviation: no orphan-sweeper row, because lines 216, 462 and 504 are still advisor-lane lines and a whole-file row would hide them; it lands with the edit that removes them.
- [x] T005 Write machine mode, checks M1 to M8 from research section 5.5, each reporting found, absent or not checked (`S/retrieval/sweep-lane-residue.mjs`). Verify: `node S/retrieval/sweep-lane-residue.mjs machine; echo $?` lists the compiled lane output this worktree holds and prints `1`. Evidence: `machine` exit 1; M1 found (semantic-shadow.js, .js.map, lib/embedders, shared/dist/embeddings plus 15 compiled files), M2 found, M3 found, M6 found (manifest), M8 found across 25 worktrees; M4, M5, M7 absent.
- [x] T006 Write apply mode: delete the no-ask items, ask on a terminal for the HuggingFace folder and the Ollama model, report `ollama serve` and dotenv keys, then re-run machine mode (`S/retrieval/sweep-lane-residue.mjs`). Verify: `node S/retrieval/sweep-lane-residue.mjs apply --db-dir <fixture> </dev/null` deletes the fixture database and leaves the model fixture. Evidence: literal command not run, it defaults --root to this worktree and would delete real dist files. Fixture-only run (`--root`, `--db-dir`, `--hf-home`, `--socket-dir`, HOME, OLLAMA_MODELS all scratch, stdin /dev/null) exit 1: deleted skill-graph.sqlite, -wal, -shm and .bak, kept notes.txt, the HF folder and the model manifest. A socket folder holding an unrelated file loses only hf-embed.sock and is kept. Vitest apply cases pass.
- [x] T007 Exit 2 on an unknown flag, a missing value, a malformed allowlist, or git missing (`S/retrieval/sweep-lane-residue.mjs`). Verify: `node S/retrieval/sweep-lane-residue.mjs --nope; echo $?` prints `2`. Evidence: `--nope` prints `unknown argument: --nope` and exit 2; vitest exit-2 cases for missing value, malformed allowlist and git missing pass.
- [x] T008 Write the test suite: planted term exits 1, removal exits 0, exact-path allowlist exits 0, glob or trailing-slash row refused, machine mode on fixtures, apply without a terminal keeps the ask-first fixtures, apply deletes database siblings and leaves an unrelated file (`S/tests/sweep-lane-residue.vitest.ts`). Verify: `npx vitest run --config ../../vitest.config.ts --project cli tests/sweep-lane-residue.vitest.ts` in `S` prints all tests passed. Evidence: 1 file, 51 tests passed, vitest exit 0.
- [x] T009 [P] Add the script's row (`S/retrieval/README.md`). Verify: `rg -n 'sweep-lane-residue' S/retrieval/README.md` prints at least one line. Evidence: `rg` prints lines 25, 71 and 99.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T010 Run repo mode on the phase commit and compare its count with the measured 332 plus the embeddings symlink and the check's three files (`implementation-summary.md`). Verify: the recorded live count plus the allowlisted count equals 336. Evidence: before the commit, live 309 plus allowlisted 24 equals 333; the third review staged the three own files in a scratch index and got live 309 plus allowlisted 27 equals 336.
- [x] T011 Confirm nothing is wired yet (`.github/`, `.skilled/commands/`). Verify: `git grep -l sweep-lane-residue -- .github .skilled/commands` prints nothing. Evidence: `git grep -l` printed nothing, exit 1.
- [x] T012 Validate this phase (`spec.md`). Verify: `validate.sh <this folder> --strict` prints `RESULT: PASSED`. Evidence: `validate.sh --strict` printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed: repo mode lists the baseline and the test passes
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Design source**: See `../../023-ollama-deprecation-research/research/research.md` sections 5.4 and 5.5
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

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: `spec.md:118` section 4 holds REQ-001 to REQ-008 at `spec.md:126` to `:138`.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: `plan.md:51` section 3 ARCHITECTURE names the pattern and the key components.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: git, node:sqlite and env-secret.cjs present.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node --check` passes on the script Evidence: `node --check` exit 0.
- [x] CHK-011 [P0] The test run prints no warnings from the script Evidence: the only warning is the shared Vite config notice.
- [x] CHK-012 [P1] Every failure path exits 2 with a message Evidence: exit-2 cases pass.
- [x] CHK-013 [P1] The script follows the sweeper's header, section and export pattern Evidence: numbered sections, exports, isMainModule guard.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: `acceptance-criteria.md` all Met.
- [x] CHK-021 [P0] Repo mode run by hand on this worktree Evidence: repo exit 1, 333/24/309.
- [x] CHK-022 [P1] Empty repository and allowlisted file cases tested Evidence: `sweep-lane-residue.vitest.ts:514` (`exits 0 for a repository with no tracked files`) and `:497` (`exits 0 when the only hit is allowlisted by its exact path`), line numbers at `bf3bca7a8b1`; both pass in the file's 98-test run.
- [x] CHK-023 [P1] Missing git and malformed allowlist cases tested Evidence: `sweep-lane-residue.vitest.ts:529` (`exits 2 when git cannot be found`) and `:404` (the `refuses %s` table over malformed allowlists), line numbers at `bf3bca7a8b1`; both pass in the file's 98-test run.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Finding class: `matrix/evidence`; the script is the evidence tool for the whole removal. Evidence: `plan.md:70` FIX ADDENDUM lists the surfaces the evidence tool reads, and `plan.md:83` names its matrix axes.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: the memory sweeper is the only sibling and stays unchanged. Evidence: `git diff --stat` shows no change to the memory sweeper.
- [x] CHK-FIX-003 [P0] Consumer inventory: no consumer exists until phase 008. Evidence: T011.
- [x] CHK-FIX-004 [P0] Path tests cover outside-root, symlink and unrelated-sibling cases for apply mode. Evidence: symlink, outside-root and unrelated-sibling cases pass.
- [x] CHK-FIX-005 [P1] Matrix: 3 modes x 3 states x 2 terminal states, listed in the test file header. Evidence: matrix in the test header.
- [x] CHK-FIX-006 [P1] Tests scrub `HOME`, `HF_HOME`, `OLLAMA_HOST`, `OLLAMA_MODELS` and `SYSTEM_SKILL_ADVISOR_DB_DIR`, pass fixture directories and a fixture process list, so no test reads process-wide machine state. Evidence: test header and env scrub list.
- [x] CHK-FIX-007 [P1] Evidence is pinned to the phase commit SHA. Evidence: pinned in the phase commit message.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No dotenv value is read or printed Evidence: dotenv read only via env-secret.cjs keys; a test asserts no value prints.
- [x] CHK-031 [P0] Apply mode deletes only names built from resolved roots Evidence: third review confirmed every delete is a resolved root plus a fixed name.
- [x] CHK-032 [P1] Ask-first items need a yes on a terminal Evidence: no-terminal apply keeps the HF folder and sends no DELETE.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized Evidence: `spec.md:105` Files to Change, `plan.md:172` to `:174` and tasks T003 to T009 name the same script, allowlist, test and README; strict validation of 024 with `--recursive` covers this folder.
- [x] CHK-041 [P1] The script header states the exit codes and the three modes Evidence: header lines 5 to 42.
- [x] CHK-042 [P2] Retrieval README row added Evidence: T009.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: scratch holds only .gitkeep.
- [x] CHK-051 [P1] scratch/ cleaned before completion Evidence: `ls -A scratch` prints only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 19 | 19/19 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-20
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: Architecture Verification

- [x] CHK-100 [P0] Architecture decisions documented in `plan.md`'s ARCHITECTURE DECISION RECORD section Evidence: `plan.md:207` opens the ARCHITECTURE DECISION RECORD section, with ADR-001 at `plan.md:209`.
- [x] CHK-101 [P1] All ADRs have status (Proposed/Accepted) Evidence: `rg -c '^### ADR' plan.md` prints 1, and that ADR's status is Accepted at `plan.md:211`.
- [x] CHK-102 [P1] Alternatives documented with rejection rationale Evidence: `plan.md:221` lists ADR-001's rejected alternatives with a reason each.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [x] CHK-110 [P1] Repo mode finishes in under 10 seconds on this repository (NFR-P01) Evidence: 8.5 to 8.6 seconds.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [x] CHK-120 [P0] Rollback procedure documented: revert the phase commit Evidence: `plan.md:123` section 7 ROLLBACK PLAN; its procedure at `plan.md:126` is `git revert` of the phase commit.
- [x] CHK-121 [P1] Nothing calls the script yet, so landing it changes no workflow Evidence: T011.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P1] No new dependency is added Evidence: no package.json change.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] `spec.md` scope, `plan.md` components and `tasks.md` tasks name the same four files Evidence: `spec.md:105` to `:112` list the four files; `plan.md:61`, `:77` and `:172` to `:174` name the same four; tasks T003 to T009 build them.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Merges the branch | [ ] Approved | |
<!-- /ANCHOR:sign-off -->
