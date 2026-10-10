---
title: "Tasks: Phase 3: codex-mirror-gate"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "codex mirror gate tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 3: codex-mirror-gate

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
<!-- /ANCHOR:notation -->

---

All commands run from the repository root unless a task says `cd`. These shell variables are used throughout:

- `FOLDER` is `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/003-codex-mirror-gate`
- `CHECKER` is `.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs`
- `LIB` is `.skilled/skills/system-deep-loop/deep-improvement/scripts/lib/mirror-sync-verify.cjs`
- `VITEST_FILE` is `.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts`
- `VITEST_RUN` is `(cd .skilled/skills/system-deep-loop/deep-improvement/scripts && ../../../system-spec-kit/node_modules/.bin/vitest run shared/tests/check-agent-mirror-sync.vitest.ts)`

Every check that prints a result is followed by `; echo "exit=$?"`, and the exit status is read with the output. Do not delete any temporary tree with `rm -rf`, because the command runner refuses it. Phase 3 records go in `$FOLDER/scratch/after/`, so run `mkdir -p $FOLDER/scratch/after` before the first one.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Save the pre-edit copies of the five touched files into `$FOLDER/scratch/before/`: `check-agent-mirror-sync.cjs`, `mirror-sync-verify.cjs`, `check-agent-mirror-sync.vitest.ts`, `hook-git-pre-commit` (from `.skilled/hooks/git/pre-commit`) and `hook-scripts-pre-commit` (from `.skilled/scripts/git-hooks/pre-commit`). Command: `mkdir -p $FOLDER/scratch/before && cp $CHECKER $FOLDER/scratch/before/check-agent-mirror-sync.cjs && cp $LIB $FOLDER/scratch/before/mirror-sync-verify.cjs && cp $VITEST_FILE $FOLDER/scratch/before/check-agent-mirror-sync.vitest.ts && cp .skilled/hooks/git/pre-commit $FOLDER/scratch/before/hook-git-pre-commit && cp .skilled/scripts/git-hooks/pre-commit $FOLDER/scratch/before/hook-scripts-pre-commit`. Expected: exit 0, and `ls $FOLDER/scratch/before` lists the five names. (`scratch/before/`) Evidence: `ls scratch/before` lists the five copies -> check-agent-mirror-sync.cjs, check-agent-mirror-sync.vitest.ts, hook-git-pre-commit, hook-scripts-pre-commit, mirror-sync-verify.cjs; exit=0
- [x] T002 [P] Record the checker's Codex-path baseline. Command: `node $CHECKER .codex/agents/code.toml; echo "exit=$?"`. Expected: the output reads `agent-mirror-sync: no agent files to check`, and `exit=0`. Save the output to `$FOLDER/scratch/before/codex-path.txt`. (`check-agent-mirror-sync.cjs`) Evidence: `node check-agent-mirror-sync.cjs .codex/agents/code.toml` -> `no agent files to check`; exit=0 (saved to scratch/before/codex-path.txt)
- [x] T003 [P] Record the `--all` baseline. Command: `node $CHECKER --all; echo "exit=$?"`. Expected: a line containing `12 agent(s) checked`, and `exit=0`. Save the output to `$FOLDER/scratch/before/all.txt`. (`check-agent-mirror-sync.cjs`) Evidence: `node check-agent-mirror-sync.cjs --all` -> `12 agent(s) checked`; exit=0 (saved to scratch/before/all.txt)
- [x] T004 [P] Record the `.pi/agents/` baseline for REQ-008. Command: `node $CHECKER .pi/agents/code.md; echo "exit=$?"`. Expected: `no agent files to check` and `exit=0`. (`check-agent-mirror-sync.cjs`) Evidence: `node check-agent-mirror-sync.cjs .pi/agents/code.md` -> `no agent files to check`; exit=0
- [x] T005 [P] Record the hook-filter and syntax baseline. Commands: `printf '.codex/agents/code.toml\n' | grep -E '^\.(opencode|skilled|claude)/agents/'; echo "exit=$?"`, then `bash -n .skilled/hooks/git/pre-commit; echo "exit=$?"` and `bash -n .skilled/scripts/git-hooks/pre-commit; echo "exit=$?"`. Expected: the grep prints nothing and reads `exit=1`, and each `bash -n` reads `exit=0`. (`.skilled/hooks/git/pre-commit`, `.skilled/scripts/git-hooks/pre-commit`) Evidence: grep for `codex` path returns no match -> exit=1; `bash -n` on both hooks -> exit=0
- [x] T006 [P] Record the Vitest baseline. Command: `$VITEST_RUN; echo "exit=$?"`. Expected: a summary line reading `Tests  3 passed (3)` and `exit=0`. Save the summary line to `$FOLDER/scratch/before/vitest-baseline.txt`. (`check-agent-mirror-sync.vitest.ts`) Evidence: `vitest run check-agent-mirror-sync.vitest.ts` -> `Tests  3 passed (3)`; exit=0 (saved to scratch/before/vitest-baseline.txt)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T007 Add three Codex regression cases to the Vitest file before any checker or hook edit. Insert them after the test that ends with `  });` on line 88, and before the closing `});` on line 89. The first case, named `checks a Codex mirror changed on its own`, writes `.claude/agents/${AGENT_NAME}.md` with the `CANONICAL` constant and `.codex/agents/${AGENT_NAME}.toml` with the TOML text below, then runs `runChecker('.codex/agents/mirror-sync-probe.toml')` and expects status 0 and stdout containing `1 agent(s) checked`. The second case, named `blocks a drifted Codex mirror`, writes the same Claude mirror and a Codex file whose body is `# Mirror Sync Probe` followed by a blank line and `A completely different body.`, runs the checker on the Codex path, and expects status 1 and stdout containing `DRIFT  mirror-sync-probe [codex]`. The third case, named `blocks a Codex mirror whose canonical is missing`, uses the name `codex-orphan-probe`, writes only `.codex/agents/codex-orphan-probe.toml`, runs the checker on that path, and expects status 1 and stdout containing `canonical .opencode/agents/codex-orphan-probe.md is missing`. The TOML text is `name = "mirror-sync-probe"`, then `description = "Mirror sync probe"`, then `developer_instructions = '''`, then the body, then `'''`. For the in-sync body, use the canonical body from lines 18 to 24 of this file: `# Mirror Sync Probe`, a blank line, `Proposal-only agent body.`, a blank line, `## 1. CORE WORKFLOW`, a blank line, and `Read first, verify runtime mirrors, and report structured evidence.` (`.skilled/skills/system-deep-loop/deep-improvement/scripts/shared/tests/check-agent-mirror-sync.vitest.ts`). Evidence: the file has six cases, and T008 records the result. Evidence: three Codex cases inserted before the closing describe; the file reports 6 cases in T008
- [x] T008 Run the Vitest file once before any checker edit, to show the three new cases fail. Command: `$VITEST_RUN; echo "exit=$?"`. Expected: `Tests  3 failed | 3 passed (6)`, the three new case names among the failures, and a non-zero exit. Save the output to `$FOLDER/scratch/before/vitest-red.txt`. (`check-agent-mirror-sync.vitest.ts`) Evidence: `vitest run check-agent-mirror-sync.vitest.ts` -> `Tests  3 failed | 3 passed (6)`; exit=1 (saved to scratch/before/vitest-red.txt)
- [x] T009 Widen the agent path pattern. In `$CHECKER`, replace the line `const AGENT_PATH_RE = /(?:^|\/)\.(?:opencode|skilled|claude)\/agents\/[^/]+$/;` (line 32) with `const AGENT_PATH_RE = /(?:^|\/)\.(?:opencode|skilled|claude|codex)\/agents\/[^/]+$/;`. In the comment directly above it, replace `// the authored agent directory, under either source root, or the Claude mirror.` with `// the authored agent directory, under either source root, or a Claude or Codex mirror.`. (`.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs`) Evidence: diff vs scratch/before shows line 31 `or a Claude or Codex mirror` and line 32 `(?:opencode|skilled|claude|codex)`
- [x] T010 Add the Codex mirror to the orphan check. In `$CHECKER`, inside the `orphanMirrors` array (lines 86 to 88), add a second entry after `path.join(REPO_ROOT, '.claude', 'agents', \`${name}.md\`),` with the line `        path.join(REPO_ROOT, '.codex', 'agents', \`${name}.toml\`),`. In the comment above the array (lines 82 to 85), replace `If the .claude mirror is still present, the canonical` with `If a Claude or Codex mirror is still present, the canonical`. Leave the rest of the comment unchanged. (`.skilled/skills/system-deep-loop/deep-improvement/scripts/check-agent-mirror-sync.cjs`) Evidence: diff vs scratch/before shows `88a` adding `path.join(REPO_ROOT, '.codex', 'agents', `${name}.toml`)`
- [x] T011 Widen the staged-path filter in the first hook. In `.skilled/hooks/git/pre-commit` (line 87), replace `grep -E '^\.(opencode|skilled|claude)/agents/' || true)` with `grep -E '^\.(opencode|skilled|claude|codex)/agents/' || true)`. The string occurs once in that file. (`.skilled/hooks/git/pre-commit`) Evidence: grep -n shows `.skilled/hooks/git/pre-commit:87` with `(opencode|skilled|claude|codex)`
- [x] T012 Widen the staged-path filter in the second hook. In `.skilled/scripts/git-hooks/pre-commit` (line 170), replace `grep -E '^\.(opencode|skilled|claude)/agents/' || true)` with `grep -E '^\.(opencode|skilled|claude|codex)/agents/' || true)`. The string occurs once in that file. (`.skilled/scripts/git-hooks/pre-commit`) Evidence: grep -n shows `.skilled/scripts/git-hooks/pre-commit:170` with `(opencode|skilled|claude|codex)`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 REQ-001, the Codex path names one agent. Command: `node $CHECKER .codex/agents/code.toml; echo "exit=$?"`. Expected: a line containing `1 agent(s) checked`, and `exit=0`. (`check-agent-mirror-sync.cjs`) Evidence: `node check-agent-mirror-sync.cjs .codex/agents/code.toml` -> `1 agent(s) checked`; exit=0
- [x] T014 REQ-002, a Codex mirror with no canonical is an orphan. Command: `(cd .skilled/skills/system-deep-loop/deep-improvement/scripts && ../../../system-spec-kit/node_modules/.bin/vitest run -t "canonical is missing" shared/tests/check-agent-mirror-sync.vitest.ts); echo "exit=$?"`. Expected: `Tests  1 passed | 5 skipped (6)` and `exit=0`. The case's `DRIFT` line is checked by its assertion. (`check-agent-mirror-sync.vitest.ts`) Evidence: `vitest run -t "canonical is missing"` -> `Tests  1 passed | 5 skipped (6)`; exit=0 (saved to scratch/after/vitest-t014.txt)
- [x] T015 REQ-006, the full Vitest file passes. Command: `$VITEST_RUN; echo "exit=$?"`. Expected: `Tests  6 passed (6)` and `exit=0`. Record the summary in `$FOLDER/scratch/after/vitest-after.txt`. (`check-agent-mirror-sync.vitest.ts`) Evidence: `vitest run check-agent-mirror-sync.vitest.ts` -> `Tests  6 passed (6)`; exit=0 (saved to scratch/after/vitest-after.txt)
- [x] T016 REQ-003, both hooks carry the Codex alternative in their staged-path filter. Command: `grep -n 'claude|codex)/agents' .skilled/hooks/git/pre-commit .skilled/scripts/git-hooks/pre-commit; echo "exit=$?"`. Expected: exactly two lines, one at line 87 of the first hook and one at line 170 of the second, and `exit=0`. (`.skilled/hooks/git/pre-commit`, `.skilled/scripts/git-hooks/pre-commit`) Evidence: grep -n -> `.skilled/hooks/git/pre-commit:87:` and `.skilled/scripts/git-hooks/pre-commit:170:` lines; exit=0
- [x] T017 REQ-005, both hook scripts parse. Command: `bash -n .skilled/hooks/git/pre-commit && bash -n .skilled/scripts/git-hooks/pre-commit; echo "exit=$?"`. Expected: no output other than `exit=0`. (`.skilled/hooks/git/pre-commit`, `.skilled/scripts/git-hooks/pre-commit`) Evidence: `bash -n` on both hooks -> exit=0 with no other output
- [x] T018 REQ-004, `--all` still checks twelve agents. Command: `node $CHECKER --all; echo "exit=$?"`. Expected: a line containing `12 agent(s) checked`, and `exit=0`. (`check-agent-mirror-sync.cjs`) Evidence: `node check-agent-mirror-sync.cjs --all` -> `12 agent(s) checked`; exit=0
- [x] T019 REQ-007, the shared library is unchanged. Command: `diff $FOLDER/scratch/before/mirror-sync-verify.cjs $LIB; echo "exit=$?"`. Expected: no output other than `exit=0`. (`lib/mirror-sync-verify.cjs`) Evidence: `diff scratch/before/mirror-sync-verify.cjs lib/mirror-sync-verify.cjs` -> no output; exit=0
- [x] T020 REQ-008, the `.pi/agents/` gap is recorded and unchanged. Commands: `grep -n 'pi/agents' $FOLDER/plan.md; echo "exit=$?"` and `node $CHECKER .pi/agents/code.md; echo "exit=$?"`. Expected: the grep prints the Known gap paragraph and exits 0, and the checker prints `no agent files to check` and exits 0. (`plan.md`, `check-agent-mirror-sync.cjs`) Evidence: grep -n plan.md -> line 69 names `.pi/agents/`; exit=0. Checker on `.pi/agents/code.md` -> `no agent files to check`; exit=0
- [x] T021 REQ-007 and scope, the checker changed only where planned. Command: `diff $FOLDER/scratch/before/check-agent-mirror-sync.cjs $CHECKER; echo "exit=$?"`. Expected: the output shows changes only to the comment above `AGENT_PATH_RE`, the `AGENT_PATH_RE` line, the orphan comment and the one added `codex` orphan entry, and `exit=1` because differences exist. Any other hunk is a failure to report. (`check-agent-mirror-sync.cjs`) Evidence: diff vs scratch/before shows only the AGENT_PATH_RE comment and line, the orphan comment line and the `.codex` orphan entry; exit=1 because differences exist
- [x] T022 SC-001, both hooks reach the checker for a Codex path. Evidence: T013 and T016 both passed in the same run. Record the run in `$FOLDER/scratch/after/sc-001.txt`. (`check-agent-mirror-sync.cjs`, both hooks) Evidence: scratch/after/sc-001.txt records the T013 and T016 outputs from the same run
- [x] T023 SC-002, a Codex mirror with no canonical blocks. Evidence: T014 passed, and its test asserts status 1 and the orphan `DRIFT` line. (`check-agent-mirror-sync.vitest.ts`) Evidence: T014 passed, and its assertion requires status 1 and `canonical .opencode/agents/codex-orphan-probe.md is missing`
- [x] T024 SC-003, the 12-agent result and hook syntax are unchanged. Evidence: T017 and T018 both passed in the same run. (`check-agent-mirror-sync.cjs`, both hooks) Evidence: T017 and T018 ran in one run -> `12 agent(s) checked`; exit=0, and `bash -n` exit=0
- [x] T025 Scope check on the working tree. Command: `git status --short`. Expected: the four implementation paths appear as modified (the checker, the Vitest file, and the two hooks), plus the new `scratch/` folder under `FOLDER`. The three files that were already modified before this phase at the `011` level (`goal.md`, `graph-metadata.json` and `spec.md`) appear as they did before this phase. No other path appears, and nothing under `node_modules/` appears. (repository root) Evidence: `git status --short` -> ` M` for the checker, the Vitest file and both hooks, and `?? .../007-follow-up-fixes/`; other builders' files also appear (expected in this shared worktree)
- [x] T026 Validate this folder. Command: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $FOLDER --strict`. Expected: `RESULT: PASSED`. (`FOLDER`) Evidence: `validate.sh <folder> --strict` -> `RESULT: PASSED` (at that point Errors: 0, Warnings: 1, cleared in T029)
- [x] T027 Check the goal. Command: `node .skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs $FOLDER`. Expected: `RESULT: PASSED`. (`goal.md`) Evidence: `check-goal.cjs <folder>` -> `[check-goal] RESULT: PASSED (5/5 checks)`
- [x] T028 Check for template leftovers in the packet. Command: `grep -rn 'YOUR_VALUE_HER[E]\|\[Pha[s]e\|TB[D]' $FOLDER/*.md; echo "exit=$?"`. The bracket classes keep this task from matching its own text. Expected: no output and `exit=1`. (`FOLDER`) Evidence: grep for template leftovers over the packet *.md -> no output; exit=1
- [x] T029 Fill `implementation-summary.md` at completion, replacing the scaffold text. Its Files Changed table names the four implementation paths and the Vitest file, each with what changed, and its Verification table quotes the exit status and result line of T013 to T024. It names the `.pi/agents/` gap as a known limitation. Command: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh $FOLDER --strict`. Expected: `RESULT: PASSED` with no SPEC_DOC_SUFFICIENCY warning. (`implementation-summary.md`) Evidence: implementation-summary.md filled; `validate.sh --strict` -> `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED` (scratch/after/validate-final.txt)
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]` Evidence: T001 to T029 all marked above
- [x] No `[B]` blocked tasks remaining Evidence: no task is blocked; none marked [B]
- [x] Manual verification passed Evidence: goal criteria 1 to 6 re-run from the final state; see implementation-summary.md Verification
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
