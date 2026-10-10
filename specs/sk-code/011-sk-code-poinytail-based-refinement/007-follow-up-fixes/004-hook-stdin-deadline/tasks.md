---
title: "Tasks: Phase 4: hook-stdin-deadline"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook stdin deadline tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 4: hook-stdin-deadline

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

All commands run from the repository root, which is the worktree root. Every command must print what its task says; exit status alone is not evidence. Do not run `git add`, `git commit`, `git stash`, `git checkout`, `git reset`, or `rm -rf`. Use `git status --short` and `diff` against the copies in `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/scratch/before/` instead.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the before snapshot holds six files: `find specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/scratch/before -type f | sort | wc -l` prints `6`. The planner created them with `cp`, keeping relative paths; recreate them with `cp` if any are missing. Files: `.skilled/hooks/shared/hook-adapter-shared.cjs`, `.skilled/hooks/shared/README.md`, `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs`, `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` (`specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/scratch/before/`) Evidence: find scratch/before -type f | sort | wc -l -> 6
- [x] T002 [P] Record the hook-suite baseline: `node --test .skilled/hooks/post-edit-quality/devin/post-edit-quality.test.cjs .skilled/hooks/mcp-route-guard/lib/mcp-route-guard.test.cjs .skilled/hooks/shared/hook-flags.test.cjs .skilled/plugins/tests/sk-code-post-edit-quality.test.cjs`. Expected: `ℹ tests 66`, `ℹ pass 66`, `ℹ fail 0`, exit 0. The planner's run is in `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/scratch/baseline/combined.txt`. (`.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs`) Evidence: node --test four hook suites (before edits) -> info tests 66, info pass 66, info fail 0, exit 0
- [x] T003 [P] Record the shell parse baseline: `bash .skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh; echo "exit=$?"`. Expected: `Post-edit adapter parse regression fixture passed` then `exit=0`. (`.skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh`) Evidence: bash claude-posttooluse.test.sh; echo exit=$? (before edits) -> Post-edit adapter parse regression fixture passed, exit=0
- [x] T004 [P] Reproduce the hang on the unchanged helper: `node -e "const t=Date.now();require('$PWD/.skilled/hooks/shared/hook-adapter-shared.cjs').readStdin().then((s)=>console.log(JSON.stringify({s,ms:Date.now()-t})))" < <(printf '{"tool_name":"Write"'; sleep 8)`. Expected: `s` holds `{"tool_name":"Write"` and `ms` is close to 8000. The planner measured 7980. (`.skilled/hooks/shared/hook-adapter-shared.cjs`) Evidence: node -e readStdin with held pipe on unchanged helper -> partial payload returned, ms 7984
- [x] T005 [P] Record the validator baseline: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline --strict`. Expected: `Summary: Errors: 0  Warnings: 1` and `RESULT: PASSED`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/spec.md`) Evidence: validate.sh --strict (before edits) -> Summary: Errors: 0  Warnings: 1; RESULT: PASSED
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Replace the helper's reader. In `.skilled/hooks/shared/hook-adapter-shared.cjs`, find the five lines that start `async function readStdin() {` (line 14) and end with the `}` on line 18, and replace them with the block under "Proposed helper code" in `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/plan.md` section 3, comment included. Expected: `grep -n "function readStdin" .skilled/hooks/shared/hook-adapter-shared.cjs` prints `function readStdin({ timeoutMs = 3000 } = {}) {`. (`.skilled/hooks/shared/hook-adapter-shared.cjs`) Evidence: grep -n 'function readStdin' hook-adapter-shared.cjs -> 17:function readStdin({ timeoutMs = 3000 } = {}) {
- [x] T007 Create the test file `.skilled/hooks/shared/hook-adapter-shared.test.cjs` with the two cases described in `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/plan.md` section 5. Case A's test name contains `never-closed`. Case B's test name contains `comes back whole`. Use no temporary directories. Expected: `node --check .skilled/hooks/shared/hook-adapter-shared.test.cjs; echo "exit=$?"` prints `exit=0`. (`.skilled/hooks/shared/hook-adapter-shared.test.cjs`) Evidence: node --check hook-adapter-shared.test.cjs; echo exit=$? -> exit=0
- [x] T008 In `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, add `const { readStdin } = require('../../shared/hook-adapter-shared.cjs');` on the line directly after `const { isHookEnabled } = require('../../shared/hook-flags.cjs');` (line 33). Expected: `grep -n "hook-adapter-shared" <file>` prints one line that begins `34:`. (`.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`) Evidence: grep -n 'hook-adapter-shared' claude-posttooluse.cjs -> 34:const { readStdin } = require('../../shared/hook-adapter-shared.cjs');
- [x] T009 In the same file, delete the local copy: the block from `async function readStdin() {` (line 43) through its closing `}` (line 47), plus the blank line after it. Keep `remainingMs` and every other line. Expected: `grep -n "async function readStdin" <file>` prints nothing and exits 1. (`.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`) Evidence: grep -n 'async function readStdin' claude-posttooluse.cjs; echo exit=$? -> no lines, exit=1
- [x] T010 [P] In `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs`, add `const { readStdin } = require('../../shared/hook-adapter-shared.cjs');` on the line directly after `const { isHookEnabled } = require('../../shared/hook-flags.cjs');` (line 22). (`.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs`) Evidence: grep -n 'hook-adapter-shared' codex/post-edit-quality.cjs -> 23:const { readStdin } = require('../../shared/hook-adapter-shared.cjs');
- [x] T011 [P] In the same Codex file, delete the local copy: the block from `async function readStdin() {` (line 35) through its closing `}` (line 39), plus the blank line after it. Expected: `grep -n "async function readStdin" <file>` prints nothing and exits 1. (`.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs`) Evidence: grep -n 'async function readStdin' codex/post-edit-quality.cjs; echo exit=$? -> no lines, exit=1
- [x] T012 [P] In `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs`, add `const { readStdin } = require('../../shared/hook-adapter-shared.cjs');` on the line directly after `const { isHookEnabled } = require('../../shared/hook-flags.cjs');` (line 23). (`.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs`) Evidence: grep -n 'hook-adapter-shared' devin/post-edit-quality.cjs -> 24:const { readStdin } = require('../../shared/hook-adapter-shared.cjs');
- [x] T013 [P] In the same Devin file, delete the local copy: the block from `async function readStdin() {` (line 36) through its closing `}` (line 40), plus the blank line after it. Expected: `grep -n "async function readStdin" <file>` prints nothing and exits 1. (`.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs`) Evidence: grep -n 'async function readStdin' devin/post-edit-quality.cjs; echo exit=$? -> no lines, exit=1
- [x] T014 In `.skilled/hooks/shared/README.md` line 29, edit the "Adapter plumbing" sentence in two places. Change the words "bounded stdin collection via async iterator" so they say the reader resolves at a 3000 ms deadline with the bytes read so far, and change the signature shown for the reader to `readStdin({ timeoutMs })`. Then delete the words "Twenty-eight lines," so the sentence ends "Byte-identical behavior for every consumer." Expected: `grep -c "Twenty-eight" .skilled/hooks/shared/README.md` prints `0`. (`.skilled/hooks/shared/README.md`) Evidence: grep -c 'Twenty-eight' shared/README.md -> 0
- [x] T015 In `.skilled/hooks/shared/README.md`, the table row at line 74 is the `hook-adapter-shared.cjs` row. In its description cell, keep the byte-identical clause and add two facts: the reader resolves at a 3000 ms deadline, and the JSON parser returns null on bad JSON. Expected: `grep -n "3000 ms" .skilled/hooks/shared/README.md` prints the row. (`.skilled/hooks/shared/README.md`) Evidence: grep -n '3000 ms' shared/README.md -> 74:| `hook-adapter-shared.cjs` row now names the 3000 ms deadline
- [x] T016 In `.skilled/hooks/shared/README.md`, insert one row directly after the `hook-flags.test.cjs` table row: ``| `hook-adapter-shared.test.cjs` | `node --test` suite: a never-closed stdin resolves at the deadline and its process exits; complete input comes back whole. |``. Expected: `grep -n "hook-adapter-shared.test.cjs" .skilled/hooks/shared/README.md` prints one line. (`.skilled/hooks/shared/README.md`) Evidence: grep -n 'hook-adapter-shared.test.cjs' shared/README.md -> 76:| `hook-adapter-shared.test.cjs` | node --test suite row
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T017 [P] Syntax check every touched JavaScript file: `for f in .skilled/hooks/shared/hook-adapter-shared.cjs .skilled/hooks/shared/hook-adapter-shared.test.cjs .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs .skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs; do node --check "$f" || exit 1; done; echo "syntax ok"`. Expected: `syntax ok`, exit 0. (all five files) Evidence: node --check on all five touched .cjs files -> syntax ok, exit=0
- [x] T018 REQ-001, deadline resolves with the bytes written so far: `node --test --test-name-pattern='never-closed' .skilled/hooks/shared/hook-adapter-shared.test.cjs`. Expected: `ℹ pass 1`, `ℹ fail 0`, exit 0. The case asserts the text and an `elapsedMs` between 2950 and 4500. (`.skilled/hooks/shared/hook-adapter-shared.test.cjs`) Evidence: node --test --test-name-pattern='never-closed' hook-adapter-shared.test.cjs -> info pass 1, info fail 0, exit 0
- [x] T019 REQ-002, complete input comes back whole: `node --test --test-name-pattern='comes back whole' .skilled/hooks/shared/hook-adapter-shared.test.cjs`. Expected: `ℹ pass 1`, `ℹ fail 0`, exit 0. (`.skilled/hooks/shared/hook-adapter-shared.test.cjs`) Evidence: node --test --test-name-pattern='comes back whole' hook-adapter-shared.test.cjs -> info pass 1, info fail 0, exit 0
- [x] T020 REQ-001, observed by hand: rerun the T004 command. Expected: `s` holds `{"tool_name":"Write"` and `ms` is between 2950 and 4500. The baseline was about 8000. (`.skilled/hooks/shared/hook-adapter-shared.cjs`) Evidence: T004 command rerun on changed helper -> partial payload returned, ms 3003, exit=0
- [x] T021 REQ-003 and SC-001, the process exits on its own at the adapter level: run `node -e "const {spawn}=require('node:child_process');const t=Date.now();const c=spawn(process.execPath,['$PWD/.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs'],{stdio:['pipe','ignore','ignore']});c.stdin.write('{\"tool_name\":\"Read\"}');const k=setTimeout(()=>{c.kill('SIGKILL');console.log('HUNG')},10000);c.on('close',(code,sig)=>{clearTimeout(k);console.log('code='+code+' signal='+sig+' ms='+(Date.now()-t))})"`. Expected: one line `code=0 signal=null ms=` followed by a number between 2950 and 4500, and no `HUNG` line. (`.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs`) Evidence: node -e spawn devin post-edit-quality.cjs with held pipe -> code=0 signal=null ms=3028, no HUNG line
- [x] T022 REQ-004, the three adapters no longer define a reader: `grep -n "async function readStdin" .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs .skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs; echo "exit=$?"`. Expected: no lines and `exit=1`. (the three adapter files) Evidence: grep -n 'async function readStdin' three post-edit adapters; echo exit=$? -> no lines, exit=1
- [x] T023 REQ-004, the three adapters require the shared helper: `grep -n "require('../../shared/hook-adapter-shared.cjs')" .skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs .skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs .skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs`. Expected: exactly three lines, one per file, each with `readStdin`. (the three adapter files) Evidence: grep -n require('../../shared/hook-adapter-shared.cjs') three adapters -> three lines (claude 34, codex 23, devin 24), each with readStdin
- [x] T024 REQ-005, the helper has no dependency: `grep -n "require(" .skilled/hooks/shared/hook-adapter-shared.cjs; echo "exit=$?"`. Expected: no lines and `exit=1`. (`.skilled/hooks/shared/hook-adapter-shared.cjs`) Evidence: grep -n 'require(' hook-adapter-shared.cjs; echo exit=$? -> no lines, exit=1
- [x] T025 REQ-006, existing hook suites still pass: rerun the T002 command. Expected: `ℹ tests 66`, `ℹ pass 66`, `ℹ fail 0`, exit 0. (`.skilled/plugins/tests/sk-code-post-edit-quality.test.cjs`) Evidence: rerun T002 command after edits -> info tests 66, info pass 66, info fail 0, exit 0
- [x] T026 REQ-006, shell parse test still passes: rerun the T003 command. Expected: `Post-edit adapter parse regression fixture passed` then `exit=0`. (`.skilled/skills/sk-code/sk-code-quality/scripts/hooks/claude-posttooluse.test.sh`) Evidence: rerun T003 command after edits -> Post-edit adapter parse regression fixture passed, exit=0
- [x] T027 REQ-007, a stream error still rejects: `grep -n "reject(error)" .skilled/hooks/shared/hook-adapter-shared.cjs; echo "exit=$?"`. Expected: one line that contains `reject(error);` and `exit=0`. (`.skilled/hooks/shared/hook-adapter-shared.cjs`) Evidence: grep -n 'reject(error)' hook-adapter-shared.cjs; echo exit=$? -> 34:      reject(error);, exit=0
- [x] T028 REQ-008, the README describes the deadline: `grep -c "3000" .skilled/hooks/shared/README.md`. Expected: a count of `2` or more. (`.skilled/hooks/shared/README.md`) Evidence: grep -c '3000' shared/README.md -> 2
- [x] T029 REQ-009, the ESM sibling is unchanged: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/scratch/before/.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs; echo "exit=$?"`. Expected: no output and `exit=0`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs`) Evidence: cmp scratch/before ESM copy against live hook-adapter-shared.mjs; echo exit=$? -> no output, exit=0
- [x] T030 SC-002, every CommonJS consumer uses the one reader: `grep -rl 'hook-adapter-shared.cjs' .skilled/hooks --include='*.cjs' | sort`. Expected: nine paths: `mcp-route-guard/{claude,codex,devin}/mcp-route-guard.cjs`, `task-dispatch/{claude,devin}/task-dispatch-guard.cjs`, `post-edit-quality/{claude/claude-posttooluse.cjs,codex/post-edit-quality.cjs,devin/post-edit-quality.cjs}`, and `shared/hook-adapter-shared.test.cjs`. (`.skilled/hooks/`) Evidence: grep -rl 'hook-adapter-shared.cjs' .skilled/hooks --include='*.cjs' | sort -> nine paths, the expected set
- [x] T031 Scope check: `git status --short .skilled/hooks .skilled/skills/system-spec-kit .skilled/plugins`. Expected: exactly ` M` for `.skilled/hooks/shared/hook-adapter-shared.cjs`, `.skilled/hooks/shared/README.md`, `.skilled/hooks/post-edit-quality/claude/claude-posttooluse.cjs`, `.skilled/hooks/post-edit-quality/codex/post-edit-quality.cjs` and `.skilled/hooks/post-edit-quality/devin/post-edit-quality.cjs`, and `??` for `.skilled/hooks/shared/hook-adapter-shared.test.cjs`. Nothing under `system-spec-kit` or `plugins`. (`.skilled/hooks/`) Evidence: git status --short on hooks, system-spec-kit, plugins -> the five adapter/helper/README files as M and the test file as ??; .skilled/hooks/git/pre-commit also shows as M, a change by another builder that this phase did not touch
- [x] T032 Fill `implementation-summary.md` with what changed, the command outputs above, the residual slow-host risk from `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/spec.md` section 6, and the follow-up list from `specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/plan.md` section 6. Expected: `grep -n "Replace template defaults\|\[path\]\|\[Opening hook" specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/implementation-summary.md; echo "exit=$?"` prints nothing and `exit=1`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/implementation-summary.md`) Evidence: grep placeholder patterns in implementation-summary.md; echo exit=$? -> no lines, exit=1
- [x] T033 Validate the folder: `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline --strict`. Expected: `RESULT: PASSED`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/007-follow-up-fixes/004-hook-stdin-deadline/spec.md`) Evidence: validate.sh --strict after repair-derived.cjs --apply -> Summary: Errors: 0  Warnings: 0; RESULT: PASSED, exit=0
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
