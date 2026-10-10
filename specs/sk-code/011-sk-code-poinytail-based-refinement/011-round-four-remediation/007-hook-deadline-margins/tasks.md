---
title: "Tasks: Phase 7: hook-deadline-margins"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "hook deadline margins tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: hook-deadline-margins

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

Run every command from the repository root unless it starts with `cd`. `F` stands for `specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins`; a command that uses `$F` sets it first. Write each result into the task's Evidence as you go. Never run `git add`, `commit`, `stash`, `checkout`, `reset` or `rm -rf`. Do one task at a time, in order: each Phase 2 task is one edit or one command, and `scratch/dispatch-units.json` holds the same steps as units with the same task ids. If `scratch/proto/` exists, leave it alone: it is the planner's prototype and the orchestrator removes it.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Confirm the planner's pre-edit copy matches the live tree: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; find "$F/scratch/before" -type f | wc -l` prints `16`. Then `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; for f in $(cd "$F/scratch/before" && find . -type f); do cmp -s "$F/scratch/before/$f" "$f" || echo "DIFF $f"; done; echo done` prints only `done`. A `DIFF` line means the live file changed after planning: stop and report, because the find texts may no longer match. (`scratch/before/`) Evidence: find scratch/before | wc -l; cmp loop -> 16, then only `done` (no DIFF lines)
- [x] T002 [P] Save the scope snapshot: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; git status --porcelain -- .skilled/skills/system-spec-kit/runtime/hooks .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/changelog > "$F/scratch/status-before.txt"; wc -l < "$F/scratch/status-before.txt"`. Expected at planning time: `0`. Record whatever it prints. (`scratch/status-before.txt`) Evidence: git status --porcelain -- hooks/SKILL.md/changelog > scratch/status-before.txt; wc -l -> 0
- [x] T003 [P] Prove every Phase 2 find text occurs exactly once, in order: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; python3 -I "$F/scratch/build-units.py" check . | tail -1` prints `edit units=28 bad=0`. Then `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; node "$F/scratch/compare-fail-open.mjs"; echo "exit=$?"` prints `cases=66 mismatches=0` and `exit=0` (about 3 seconds), which proves the planner's recorded answers in `scratch/baseline/fail-open-before.json` match this tree. (`.skilled/skills/system-spec-kit/runtime/hooks`) Evidence: build-units.py check . | tail -1 -> `edit units=28 bad=0`; compare-fail-open.mjs -> `cases=66 mismatches=0`, `exit=0`
- [x] T004 Record the open-stdin margin before the fix (about 90 seconds, because the shim is killed at 12 seconds in each of three runs): `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; node "$F/scratch/measure-open-stdin.mjs" > "$F/scratch/open-stdin-before.txt"; echo "exit=$?"; cat "$F/scratch/open-stdin-before.txt"`. Expected: `exit=1`, a `LATE claude/user-prompt-submit.js` line with `signal=SIGKILL`, `LATE` lines for both `spec-gate-classify.mjs` entries and both Codex entries with a median of at least 3000 ms, and a last line `entries=7 late=` followed by 5 or 6. (`scratch/open-stdin-before.txt`) Evidence: measure-open-stdin.mjs > scratch/open-stdin-before.txt -> exit=1; LATE claude/user-prompt-submit.js signal=SIGKILL median=12003ms; LATE claude/spec-gate-classify.mjs 3043ms, codex/spec-gate-classify.mjs 3047ms, codex/session-start.js 3140ms, codex/user-prompt-submit.js 3233ms; last line `entries=7 late=5 margin_ms=1000 runs=3`
- [x] T005 [P] Record the existing deadline test: `node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs 2>&1 | grep -E '^ℹ (tests|pass|fail) '`. Expected: `ℹ tests 37`, `ℹ pass 37`, `ℹ fail 0`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`) Evidence: node --test hook-stdin-deadline.test.mjs -> ℹ tests 37, ℹ pass 37, ℹ fail 0
- [x] T006 [P] Record the vitest hook baseline (about 25 seconds): `cd .skilled/skills/system-spec-kit/runtime && npx --no-install vitest run tests/hook-*.vitest.ts tests/hooks-*.vitest.ts tests/user-prompt-submit-shim.vitest.ts tests/directive-lifecycle-*.vitest.ts tests/edge-cases.vitest.ts tests/completion-evidence-sentinel.vitest.ts 2>&1 | grep -E "Test Files|Tests "`. Expected: `Test Files  16 passed (16)` and `Tests  290 passed (290)`. (`.skilled/skills/system-spec-kit/runtime/tests/`) Evidence: vitest run (hook set) -> `Test Files  16 passed (16)`, `Tests  290 passed (290)`
- [x] T007 [P] Record the node:test hook baseline: `cd .skilled/skills/system-spec-kit/runtime && node --test tests/hooks/*.test.mjs 2>&1 | grep -E "^ℹ (tests|pass|fail|skipped) "`. Expected: `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3`. (`.skilled/skills/system-spec-kit/runtime/tests/hooks/`) Evidence: node --test tests/hooks/*.test.mjs -> ℹ tests 184, ℹ pass 181, ℹ fail 0, ℹ skipped 3
- [x] T008 [P] Record the type and lint baseline: `cd .skilled/skills/system-spec-kit/runtime && npm run typecheck > /dev/null 2>&1; echo "typecheck=$?"; ../node_modules/.bin/eslint hooks/claude/user-prompt-submit.ts hooks/shared-stdin.ts hooks/claude/shared.ts hooks/codex/shared.ts hooks/claude/compact-inject.ts hooks/codex/session-start.ts hooks/codex/user-prompt-submit.ts hooks/claude/session-prime.ts; echo "eslint=$?"`. Expected: `typecheck=0`, then five `no-unused-vars` errors, four in `user-prompt-submit.ts` (`readFileSync`, `writeFileSync`, `tmpdir`, `createHash`) and one in `session-prime.ts` (`HookInput`), `✖ 5 problems (5 errors, 0 warnings)` and `eslint=1`. (`.skilled/skills/system-spec-kit/runtime/`) Evidence: npm run typecheck; eslint -> typecheck=0; 5 no-unused-vars errors (user-prompt-submit.ts readFileSync/writeFileSync/tmpdir/createHash, session-prime.ts HookInput), `✖ 5 problems (5 errors, 0 warnings)`, eslint=1
- [x] T009 [P] Record the build and alignment baseline: `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all` prints `All watched dist outputs are fresh.`, and `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .skilled/skills/system-spec-kit/runtime/hooks; echo "exit=$?"` prints `[alignment-drift] PASS`, `Findings: 0`, `Errors: 0` and `exit=0`. If `dist/` is not fresh, run `cd .skilled/skills/system-spec-kit/runtime && npm run build` first and record that you did. (`.skilled/skills/system-spec-kit/runtime/dist/`) Evidence: dist-freshness.cjs check-all -> `All watched dist outputs are fresh.` (exit=0, no build run); verify_alignment_drift.py -> `[alignment-drift] PASS`, Findings: 0, Errors: 0, exit=0
- [x] T010 [P] Record the document validator baseline: `for f in .skilled/skills/system-spec-kit/runtime/hooks/README.md .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md .skilled/skills/system-spec-kit/runtime/hooks/claude/README.md .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md; do python3 -I .skilled/skills/sk-doc/scripts/validate_document.py "$f" | grep -E 'VALID|Total issues'; done`. Expected: `VALID` and `Total issues: 0` for each of the four. (`.skilled/skills/system-spec-kit/runtime/hooks/`) Evidence: validate_document.py x4 (hooks/README.md, lib/README.md, claude/README.md, changelog/v2.7.1.0.md) -> `VALID` and `Total issues: 0` for each
- [x] T011 [P] Record the Hermes mirror baseline, check form only: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check; echo "exit=$?"`. Record every `DRIFT` line it prints. At planning time it printed `PASS: 70 Hermes skill copies in sync` and `exit=0`. Sibling children built at the same time may add `DRIFT` lines for their own skills. Never run it without `--check`. (`.hermes/skills/`) Evidence: sync-skills-hermes.cjs --check -> DRIFT sk-code, DRIFT sk-code-opencode, DRIFT sk-code-quality, DRIFT sk-code-review; `FAIL: 4 drifted, 0 stale`; exit=1. NOT the planning-time PASS: the four DRIFT lines come from sibling sk-code edits in this worktree, not from this child (verifier note: PENDING-ORCHESTRATOR, the generator runs once after every build)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T012 Read the authoring contracts before the first edit of each kind, and write one line in the goal log naming each file read. Code (T014 to T040): `.skilled/skills/sk-code/SKILL.md`, whose router bundles the OpenCode surface for work under `.skilled/`, then `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`. READMEs (T041 to T043): `.skilled/skills/sk-doc/SKILL.md`. Version and changelog (T044 and T045): `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`. The edits below already follow these contracts. If one seems to break a rule, stop and report instead of changing the edit. (`.skilled/skills/sk-code/SKILL.md`) Evidence: Read sk-code/SKILL.md, sk-code-opencode/SKILL.md (router and surface standards), sk-code-opencode references/shared/universal-patterns/naming-and-commenting.md, sk-doc/SKILL.md and sk-doc/sk-create-changelog/SKILL.md sections 1-4 (verifier read; the diff follows them: no spec ids in comments, no em dash in new prose, compact changelog with four-part patch version)
- [x] T013 Read the planned test change before copying it: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; diff "$F/scratch/before/.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs" "$F/scratch/units/hook-stdin-deadline.test.mjs" | grep -c '^>'` prints `70`. Nothing is edited in this task. (`scratch/units/hook-stdin-deadline.test.mjs`) Evidence: diff scratch/before/.../hook-stdin-deadline.test.mjs scratch/units/hook-stdin-deadline.test.mjs | grep -c "^>" -> 70

- [x] T014 Replace the deadline test with the planner's copy, byte for byte. Do not retype it. Run `cp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/units/hook-stdin-deadline.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`. Proof: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/units/hook-stdin-deadline.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs && echo same` prints `same`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`) Evidence: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/units/hook-stdin-deadline.test.mjs .skille` -> same (DeepSeek unit)

- [x] T015 Run the new test before any source edit, to see it fail for the right reason (about 30 seconds). The full output lands in `scratch/baseline/new-test-before-fix.txt`. Expected lines: `ℹ tests 39`, `ℹ pass 32`, `ℹ fail 7`. The seven failures are the `hooks/claude/spec-gate-classify.mjs`, `hooks/codex/spec-gate-classify.mjs`, `dist/hooks/claude/user-prompt-submit.js`, `dist/hooks/codex/session-start.js` and `dist/hooks/codex/user-prompt-submit.js` subtests, their parent test and the held-open payload test. If the counts differ, stop and report. Run `mkdir -p specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/baseline && node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs > specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/baseline/new-test-before-fix.txt 2>&1; grep -E '^ℹ (tests|pass|fail) ' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/baseline/new-test-before-fix.txt`. Proof: `grep -c '^ℹ fail 7$' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/baseline/new-test-before-fix.txt` prints `1`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/baseline/new-test-before-fix.txt`) Evidence: `grep -c '^ℹ fail 7$' specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/baseline/new-test-before-` -> 1 (DeepSeek unit)

- [x] T016 Add the short-host deadline constant to the compiled reader, after `HOOK_STDIN_TIMEOUT_MS` (line 15). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;$' .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts`) Evidence: `grep -c '^export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;$' .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts` -> 1 (DeepSeek unit)

T016 FIND (exact text, every line ends with a line break):

````text
/** Default stdin deadline, the same value lib/hook-adapter-shared.mjs uses. */
export const HOOK_STDIN_TIMEOUT_MS = 3000;
````

T016 REPLACE (exact text, every line ends with a line break):

````text
/** Default stdin deadline, the same value lib/hook-adapter-shared.mjs uses. */
export const HOOK_STDIN_TIMEOUT_MS = 3000;

/**
 * Stdin deadline for entries whose host kills them after 3 seconds. The read
 * has to end early enough that the work after it still finishes inside the
 * host timeout. lib/hook-adapter-shared.mjs and claude/user-prompt-submit.ts
 * carry the same value.
 */
export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;
````

- [x] T017 Import the default deadline into the Claude shared helpers (line 7). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { HOOK_STDIN_TIMEOUT_MS, readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts`) Evidence: `grep -c "^import { HOOK_STDIN_TIMEOUT_MS, readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` -> 1 (DeepSeek unit)

T017 FIND (exact text, every line ends with a line break):

````text
import { readHookStdin } from '../shared-stdin.js';
````

T017 REPLACE (exact text, every line ends with a line break):

````text
import { HOOK_STDIN_TIMEOUT_MS, readHookStdin } from '../shared-stdin.js';
````

- [x] T018 Give `parseHookStdin` an optional deadline that defaults to 3000 ms (lines 52-55). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'readHookStdin({ timeoutMs, maxBytes: MAX_HOOK_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts`) Evidence: `grep -c 'readHookStdin({ timeoutMs, maxBytes: MAX_HOOK_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` -> 1 (DeepSeek unit)

T018 FIND (exact text, every line ends with a line break):

````text
/** Read and parse JSON from stdin. Returns null on failure. */
export async function parseHookStdin(): Promise<HookInput | null> {
  try {
    const text = await readHookStdin({ maxBytes: MAX_HOOK_STDIN_BYTES });
````

T018 REPLACE (exact text, every line ends with a line break):

````text
/**
 * Read and parse JSON from stdin. Returns null on failure. Entries whose host
 * allows them only a short time pass a shorter stdin deadline.
 */
export async function parseHookStdin(timeoutMs = HOOK_STDIN_TIMEOUT_MS): Promise<HookInput | null> {
  try {
    const text = await readHookStdin({ timeoutMs, maxBytes: MAX_HOOK_STDIN_BYTES });
````

- [x] T019 Import the short deadline into Claude SessionStart, after the `isMainModule` import (line 26). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`) Evidence: `grep -c "^import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` -> 1 (DeepSeek unit)

T019 FIND (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
````

T019 REPLACE (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';
````

- [x] T020 Pass the short deadline in Claude SessionStart (line 213). The 1800 ms `withTimeout` stays. Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), HOOK_TIMEOUT_MS, null' .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts`) Evidence: `grep -c 'parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), HOOK_TIMEOUT_MS, null' .skilled/skills/system-spec-kit/runtime/hooks/claude/session-prime.ts` -> 1 (DeepSeek unit)

T020 FIND (exact text, every line ends with a line break):

````text
  const input = await withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null);
````

T020 REPLACE (exact text, every line ends with a line break):

````text
  // Claude kills SessionStart hooks after 3 seconds, so the read ends early
  // enough to leave that budget to the work after it.
  const input = await withTimeout(parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), HOOK_TIMEOUT_MS, null);
````

- [x] T021 Import the short deadline into Claude PreCompact (line 34). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readHookStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`) Evidence: `grep -c "^import { readHookStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject` -> 1 (DeepSeek unit)

T021 FIND (exact text, every line ends with a line break):

````text
import { readHookStdin } from '../shared-stdin.js';
````

T021 REPLACE (exact text, every line ends with a line break):

````text
import { readHookStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';
````

- [x] T022 Pass the short deadline in Claude PreCompact `main` (line 498). The snapshot worker's `readHookStdin()` call at line 429 stays as it is. Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), remainingMs(deadline), null' .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`) Evidence: `grep -c 'parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), remainingMs(deadline), null' .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` -> 1 (DeepSeek unit)

T022 FIND (exact text, every line ends with a line break):

````text
  const input = await withTimeout(parseHookStdin(), remainingMs(deadline), null);
````

T022 REPLACE (exact text, every line ends with a line break):

````text
  // Claude kills PreCompact hooks after 3 seconds, so the read ends early
  // enough to leave the merge and the snapshot most of the budget.
  const input = await withTimeout(parseHookStdin(SHORT_HOST_STDIN_TIMEOUT_MS), remainingMs(deadline), null);
````

- [x] T023 Import the default deadline into the Codex shared helpers (line 10). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { HOOK_STDIN_TIMEOUT_MS, readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts`) Evidence: `grep -c "^import { HOOK_STDIN_TIMEOUT_MS, readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` -> 1 (DeepSeek unit)

T023 FIND (exact text, every line ends with a line break):

````text
import { readHookStdin } from '../shared-stdin.js';
````

T023 REPLACE (exact text, every line ends with a line break):

````text
import { HOOK_STDIN_TIMEOUT_MS, readHookStdin } from '../shared-stdin.js';
````

- [x] T024 Give `readCodexHookInput` an optional deadline that defaults to 3000 ms (lines 52-58). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'readHookStdin({ timeoutMs, maxBytes: MAX_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts`) Evidence: `grep -c 'readHookStdin({ timeoutMs, maxBytes: MAX_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` -> 1 (DeepSeek unit)

T024 FIND (exact text, every line ends with a line break):

````text
/** Parse and validate one bounded Codex hook payload from stdin. */
export async function readCodexHookInput(
  event: CodexHookEvent,
  requiredFields: readonly string[],
): Promise<CodexHookInput | null> {
  try {
    const text = await readHookStdin({ maxBytes: MAX_STDIN_BYTES });
````

T024 REPLACE (exact text, every line ends with a line break):

````text
/**
 * Parse and validate one bounded Codex hook payload from stdin. Entries whose
 * host allows them only a short time pass a shorter stdin deadline.
 */
export async function readCodexHookInput(
  event: CodexHookEvent,
  requiredFields: readonly string[],
  timeoutMs = HOOK_STDIN_TIMEOUT_MS,
): Promise<CodexHookInput | null> {
  try {
    const text = await readHookStdin({ timeoutMs, maxBytes: MAX_STDIN_BYTES });
````

- [x] T025 Import the short deadline into Codex SessionStart (line 16). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts`) Evidence: `grep -c "^import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts` -> 1 (DeepSeek unit)

T025 FIND (exact text, every line ends with a line break):

````text
import { notifyDirectiveLifecycleBoundary } from '../claude/directive-lifecycle-boundary.js';
````

T025 REPLACE (exact text, every line ends with a line break):

````text
import { notifyDirectiveLifecycleBoundary } from '../claude/directive-lifecycle-boundary.js';
import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';
````

- [x] T026 Pass the short deadline in Codex SessionStart (line 33). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "readCodexHookInput('SessionStart', \['session_id'\], SHORT_HOST_STDIN_TIMEOUT_MS)" .skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts`) Evidence: `grep -c "readCodexHookInput('SessionStart', \['session_id'\], SHORT_HOST_STDIN_TIMEOUT_MS)" .skilled/skills/system-spec-kit/runtime/hooks/codex/session-start.ts` -> 1 (DeepSeek unit)

T026 FIND (exact text, every line ends with a line break):

````text
  const input = await readCodexHookInput('SessionStart', ['session_id']);
````

T026 REPLACE (exact text, every line ends with a line break):

````text
  // Codex kills SessionStart hooks after 3 seconds, so the read ends early
  // enough to leave that budget to the session-prime call after it.
  const input = await readCodexHookInput('SessionStart', ['session_id'], SHORT_HOST_STDIN_TIMEOUT_MS);
````

- [x] T027 Import the short deadline into Codex UserPromptSubmit, after the `./shared.js` import (line 13). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts`) Evidence: `grep -c "^import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts` -> 1 (DeepSeek unit)

T027 FIND (exact text, every line ends with a line break):

````text
} from './shared.js';
````

T027 REPLACE (exact text, every line ends with a line break):

````text
} from './shared.js';
import { SHORT_HOST_STDIN_TIMEOUT_MS } from '../shared-stdin.js';
````

- [x] T028 Pass the short deadline in Codex UserPromptSubmit (line 16). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "readCodexHookInput('UserPromptSubmit', \['prompt'\], SHORT_HOST_STDIN_TIMEOUT_MS)" .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-submit.ts`) Evidence: `grep -c "readCodexHookInput('UserPromptSubmit', \['prompt'\], SHORT_HOST_STDIN_TIMEOUT_MS)" .skilled/skills/system-spec-kit/runtime/hooks/codex/user-prompt-subm` -> 1 (DeepSeek unit)

T028 FIND (exact text, every line ends with a line break):

````text
  const input = await readCodexHookInput('UserPromptSubmit', ['prompt']);
````

T028 REPLACE (exact text, every line ends with a line break):

````text
  // Codex kills UserPromptSubmit hooks after 3 seconds, so the read ends early
  // enough to leave that budget to the advisor call after it.
  const input = await readCodexHookInput('UserPromptSubmit', ['prompt'], SHORT_HOST_STDIN_TIMEOUT_MS);
````

- [x] T029 Add the same constant to the plain reader, before `readStdin` (lines 13-16). `readStdin` itself does not change. Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;$' .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs`) Evidence: `grep -c '^export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;$' .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` -> 1 (DeepSeek unit)

T029 FIND (exact text, every line ends with a line break):

````text
// A host that never closes stdin would otherwise hold the hook until the host's
// own timeout kills it, so the read settles on whichever comes first: the end of
// the stream, or the deadline with whatever has arrived by then.
export function readStdin({ timeoutMs = 3000 } = {}) {
````

T029 REPLACE (exact text, every line ends with a line break):

````text
// Stdin deadline for adapters whose host kills them after 3 seconds. The read
// has to end early enough that the work after it still finishes inside the
// host timeout. ../shared-stdin.ts carries the same value for the compiled
// adapters.
export const SHORT_HOST_STDIN_TIMEOUT_MS = 500;

// A host that never closes stdin would otherwise hold the hook until the host's
// own timeout kills it, so the read settles on whichever comes first: the end of
// the stream, or the deadline with whatever has arrived by then.
export function readStdin({ timeoutMs = 3000 } = {}) {
````

- [x] T030 Import the short deadline into the Claude prompt classifier (line 6). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { parseJsonFailOpen, readStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs`) Evidence: `grep -c "^import { parseJsonFailOpen, readStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/` -> 1 (DeepSeek unit)

T030 FIND (exact text, every line ends with a line break):

````text
import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';
````

T030 REPLACE (exact text, every line ends with a line break):

````text
import { parseJsonFailOpen, readStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../lib/hook-adapter-shared.mjs';
````

- [x] T031 Pass the short deadline in the Claude prompt classifier (line 13). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'readStdin({ timeoutMs: SHORT_HOST_STDIN_TIMEOUT_MS })' .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs`) Evidence: `grep -c 'readStdin({ timeoutMs: SHORT_HOST_STDIN_TIMEOUT_MS })' .skilled/skills/system-spec-kit/runtime/hooks/claude/spec-gate-classify.mjs` -> 1 (DeepSeek unit)

T031 FIND (exact text, every line ends with a line break):

````text
  const payload = parseJsonFailOpen(await readStdin());
````

T031 REPLACE (exact text, every line ends with a line break):

````text
  // The host kills UserPromptSubmit hooks after 3 seconds, so the read ends
  // early enough to leave that budget to the gate after it.
  const payload = parseJsonFailOpen(await readStdin({ timeoutMs: SHORT_HOST_STDIN_TIMEOUT_MS }));
````

- [x] T032 Import the short deadline into the Codex prompt classifier (line 6). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { parseJsonFailOpen, readStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs`) Evidence: `grep -c "^import { parseJsonFailOpen, readStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/` -> 1 (DeepSeek unit)

T032 FIND (exact text, every line ends with a line break):

````text
import { parseJsonFailOpen, readStdin } from '../lib/hook-adapter-shared.mjs';
````

T032 REPLACE (exact text, every line ends with a line break):

````text
import { parseJsonFailOpen, readStdin, SHORT_HOST_STDIN_TIMEOUT_MS } from '../lib/hook-adapter-shared.mjs';
````

- [x] T033 Pass the short deadline in the Codex prompt classifier (line 13). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'readStdin({ timeoutMs: SHORT_HOST_STDIN_TIMEOUT_MS })' .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs`) Evidence: `grep -c 'readStdin({ timeoutMs: SHORT_HOST_STDIN_TIMEOUT_MS })' .skilled/skills/system-spec-kit/runtime/hooks/codex/spec-gate-classify.mjs` -> 1 (DeepSeek unit)

T033 FIND (exact text, every line ends with a line break):

````text
  const payload = parseJsonFailOpen(await readStdin());
````

T033 REPLACE (exact text, every line ends with a line break):

````text
  // The host kills UserPromptSubmit hooks after 3 seconds, so the read ends
  // early enough to leave that budget to the gate after it.
  const payload = parseJsonFailOpen(await readStdin({ timeoutMs: SHORT_HOST_STDIN_TIMEOUT_MS }));
````

- [x] T034 Shim: drop `readSync` and the four unused imports (lines 8-13). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { existsSync, statSync } from 'node:fs';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`) Evidence: `grep -c "^import { existsSync, statSync } from 'node:fs';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` -> 1 (DeepSeek unit)

T034 FIND (exact text, every line ends with a line break):

````text
import { readSync, existsSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
````

T034 REPLACE (exact text, every line ends with a line break):

````text
import { existsSync, statSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { dirname, isAbsolute, join } from 'node:path';
````

- [x] T035 Shim: replace the chunk-size constant, which nothing will use, with the deadline constant (line 25). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^const STDIN_DEADLINE_MS = 500;$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`) Evidence: `grep -c '^const STDIN_DEADLINE_MS = 500;$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` -> 1 (DeepSeek unit)

T035 FIND (exact text, every line ends with a line break):

````text
const READ_CHUNK_BYTES = 64 * 1024;
````

T035 REPLACE (exact text, every line ends with a line break):

````text
// The host kills this hook after 3 seconds and the advisor child needs most of
// that, so a host that never closes stdin must not hold the read for long. The
// value matches SHORT_HOST_STDIN_TIMEOUT_MS in ../shared-stdin.ts, which this
// file cannot import because its tests run the source directly.
const STDIN_DEADLINE_MS = 500;
````

- [x] T036 Shim: replace the blocking `readSync` loop with the deadline read (lines 81-95). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^function readBoundedStdin(): Promise<Buffer> {$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`) Evidence: `grep -c '^function readBoundedStdin(): Promise<Buffer> {$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` -> 1 (DeepSeek unit)

T036 FIND (exact text, every line ends with a line break):

````text
function readBoundedStdin(): Buffer {
  const chunks: Buffer[] = [];
  let totalBytes = 0;
  while (true) {
    const buffer = Buffer.alloc(Math.min(READ_CHUNK_BYTES, MAX_STDIN_BYTES + 1 - totalBytes));
    const bytesRead = readSync(0, buffer, 0, buffer.length, null);
    if (bytesRead === 0) break;
    totalBytes += bytesRead;
    if (totalBytes > MAX_STDIN_BYTES) {
      throw new Error('INPUT_OVERFLOW');
    }
    chunks.push(buffer.subarray(0, bytesRead));
  }
  return Buffer.concat(chunks, totalBytes);
}
````

T036 REPLACE (exact text, every line ends with a line break):

````text
// Collect stdin until it ends or the deadline passes, then release it so the
// process can exit. More than MAX_STDIN_BYTES rejects with INPUT_OVERFLOW and
// destroys stdin, so a runaway payload is never buffered whole.
function readBoundedStdin(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const stdin = process.stdin;
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    let settled = false;

    const release = (): void => {
      clearTimeout(timer);
      stdin.removeListener('data', onData);
      stdin.removeListener('end', onEnd);
      stdin.removeListener('error', onError);
      stdin.pause();
    };

    function onEnd(): void {
      if (settled) return;
      settled = true;
      release();
      resolve(Buffer.concat(chunks, totalBytes));
    }

    function onError(error: Error): void {
      if (settled) return;
      settled = true;
      release();
      reject(error);
    }

    function onData(chunk: Buffer | string): void {
      if (settled) return;
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > MAX_STDIN_BYTES) {
        settled = true;
        release();
        stdin.destroy();
        reject(new Error('INPUT_OVERFLOW'));
        return;
      }
      chunks.push(buffer);
    }

    // Listeners go on before the timer, so a stdin that cannot take listeners
    // rejects at once and leaves no timer behind.
    stdin.on('data', onData);
    stdin.on('end', onEnd);
    stdin.on('error', onError);
    const timer = setTimeout(onEnd, STDIN_DEADLINE_MS);
  });
}
````

- [x] T037 Shim: make `runShim` async (line 97). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^async function runShim(): Promise<string> {$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`) Evidence: `grep -c '^async function runShim(): Promise<string> {$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` -> 1 (DeepSeek unit)

T037 FIND (exact text, every line ends with a line break):

````text
function runShim(): string {
````

T037 REPLACE (exact text, every line ends with a line break):

````text
async function runShim(): Promise<string> {
````

- [x] T038 Shim: read stdin before the spawn, inside the same `try` (lines 113-115). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^    const input = await readBoundedStdin();$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`) Evidence: `grep -c '^    const input = await readBoundedStdin();$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` -> 1 (DeepSeek unit)

T038 FIND (exact text, every line ends with a line break):

````text
    const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], {
      cwd: process.cwd(),
      input: readBoundedStdin(),
````

T038 REPLACE (exact text, every line ends with a line break):

````text
    const input = await readBoundedStdin();
    const result = spawnSync(process.execPath, [target, ...process.argv.slice(2)], {
      cwd: process.cwd(),
      input,
````

- [x] T039 Shim: await `runShim` in `main` (line 157). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^  const advisorJson = await runShim();$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`) Evidence: `grep -c '^  const advisorJson = await runShim();$' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts` -> 1 (DeepSeek unit)

T039 FIND (exact text, every line ends with a line break):

````text
  const advisorJson = runShim();
````

T039 REPLACE (exact text, every line ends with a line break):

````text
  const advisorJson = await runShim();
````

- [x] T040 Rebuild `dist/` with the skill's own build command (about a minute). Expected: exit 0. `dist/` is git-ignored, so the build adds nothing to `git status`. Run `cd .skilled/skills/system-spec-kit/runtime && npm run build`. Proof: `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all` prints `All watched dist outputs are fresh.`. (`.skilled/skills/system-spec-kit/runtime/dist/hooks`) Evidence: `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all` -> All watched dist outputs are fresh. (DeepSeek unit)

- [x] T041 Describe the short deadline in the hooks README key-files row for `shared-stdin.ts` (line 88). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, for the entries whose host kills them after 3 seconds' .skilled/skills/system-spec-kit/runtime/hooks/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`) Evidence: `grep -c 'SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, for the entries whose host kills them after 3 seconds' .skilled/skills/system-spec-kit/runtime/hooks/README.md` -> 1 (DeepSeek unit)

T041 FIND (exact text, every line ends with a line break):

````text
| `shared-stdin.ts` | `readHookStdin()` reads a compiled adapter's stdin until the stream ends or 3000 ms pass, and returns `null` when the payload passes the caller's byte cap. Consumed by the four `shared.ts` readers, `claude/compact-inject.ts` and `claude/directive-lifecycle-boundary.ts`. |
````

T041 REPLACE (exact text, every line ends with a line break):

````text
| `shared-stdin.ts` | `readHookStdin()` reads a compiled adapter's stdin until the stream ends or the deadline passes, and returns `null` when the payload passes the caller's byte cap. The deadline is 3000 ms by default and `SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, for the entries whose host kills them after 3 seconds. Consumed by the four `shared.ts` readers, `claude/compact-inject.ts` and `claude/directive-lifecycle-boundary.ts`. |
````

- [x] T042 Describe the classifiers' short deadline in the lib README overview (line 23). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'pass `SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, instead.' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md`) Evidence: `grep -c 'pass `SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, instead.' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` -> 1 (DeepSeek unit)

T042 FIND (exact text, every line ends with a line break):

````text
The compiled TypeScript adapters use `../shared-stdin.ts`, which keeps the same deadline.
````

T042 REPLACE (exact text, every line ends with a line break):

````text
The compiled TypeScript adapters use `../shared-stdin.ts`, which keeps the same deadline. The Claude and Codex `spec-gate-classify.mjs` adapters, whose host kills them after 3 seconds, pass `SHORT_HOST_STDIN_TIMEOUT_MS`, 500 ms, instead.
````

- [x] T043 Describe the shim's own deadline at the end of its row in the Claude hooks README (line 21). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'The shim reads stdin with its own 500 ms deadline' .skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md`) Evidence: `grep -c 'The shim reads stdin with its own 500 ms deadline' .skilled/skills/system-spec-kit/runtime/hooks/claude/README.md` -> 1 (DeepSeek unit)

T043 FIND (exact text, every line ends with a line break):

````text
so the hook can print its fallback first. |
````

T043 REPLACE (exact text, every line ends with a line break):

````text
so the hook can print its fallback first. The shim reads stdin with its own 500 ms deadline, because its tests run the source directly and cannot import the shared reader. |
````

- [x] T044 Bump the system-spec-kit version for the patch release (line 5). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^version: 2.7.2.0$' .skilled/skills/system-spec-kit/SKILL.md` prints `1`. (`.skilled/skills/system-spec-kit/SKILL.md`) Evidence: `grep -c '^version: 2.7.2.0$' .skilled/skills/system-spec-kit/SKILL.md` -> 1 (DeepSeek unit)

T044 FIND (exact text, every line ends with a line break):

````text
version: 2.7.1.0
````

T044 REPLACE (exact text, every line ends with a line break):

````text
version: 2.7.2.0
````

- [x] T045 Create the changelog entry with the planner's copy, byte for byte. Do not retype it. Run `cp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/units/v2.7.2.0.md .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md`. Proof: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/units/v2.7.2.0.md .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md && echo same` prints `same`. (`.skilled/skills/system-spec-kit/changelog/v2.7.2.0.md`) Evidence: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins/scratch/units/v2.7.2.0.md .skilled/skills/system-s` -> same (DeepSeek unit)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T046 REQ-004 and SC-001, every entry gives up on its own and the test covers all sixteen readers (about 5 seconds): `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs > "$F/scratch/new-test-after.txt" 2>&1; echo "exit=$?"; grep -E "^ℹ (tests|pass|fail) " "$F/scratch/new-test-after.txt"; grep -c '^  ✔ ' "$F/scratch/new-test-after.txt"`. Expected: `exit=0`, `ℹ tests 39`, `ℹ pass 39`, `ℹ fail 0` and `33`, one passing subtest per entry. A failing subtest is named by its entry path: recheck that file's Phase 2 tasks and T040, then rerun. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`) Evidence: node --test hook-stdin-deadline.test.mjs -> exit=0, ℹ tests 39, ℹ pass 39, ℹ fail 0; grep -c "^  ✔ " -> 33
- [x] T047 REQ-001, the shim's read is bounded: `grep -n 'readSync' .skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts; echo "exit=$?"` prints only `exit=1`. Then `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; grep -c '^  ✔ dist/hooks/claude/user-prompt-submit.js' "$F/scratch/new-test-after.txt"` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/user-prompt-submit.ts`) Evidence: grep -n readSync user-prompt-submit.ts -> no output, exit=1; grep -c "^  ✔ dist/hooks/claude/user-prompt-submit.js" new-test-after.txt -> 1
- [x] T048 REQ-002, the shim keeps its answers and its suite: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; node "$F/scratch/compare-fail-open.mjs"; echo "exit=$?"` prints `cases=66 mismatches=0` and `exit=0`. A `DIFF` line names the entry and input that changed. Then `cd .skilled/skills/system-spec-kit/runtime && npx --no-install vitest run tests/user-prompt-submit-shim.vitest.ts 2>&1 | grep -E "Tests "` prints `Tests  8 passed (8)`. (`.skilled/skills/system-spec-kit/runtime/tests/user-prompt-submit-shim.vitest.ts`) Evidence: compare-fail-open.mjs -> cases=66 mismatches=0, exit=0; vitest run tests/user-prompt-submit-shim.vitest.ts -> Tests  8 passed (8)
- [x] T049 REQ-005, the existing suites keep their counts: rerun the T006 command, expected `Test Files  16 passed (16)` and `Tests  290 passed (290)`, then rerun the T007 command, expected `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3`. Both must equal the Phase 1 records. (`.skilled/skills/system-spec-kit/runtime/tests/`) Evidence: vitest hook set -> Test Files  16 passed (16), Tests  290 passed (290); node --test tests/hooks/*.test.mjs -> ℹ tests 184, ℹ pass 181, ℹ fail 0, ℹ skipped 3 (equal to T006, T007)
- [x] T050 REQ-003 and SC-002, every 3 second entry leaves at least 1000 ms (about 15 seconds): `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; node "$F/scratch/measure-open-stdin.mjs" > "$F/scratch/open-stdin-after.txt"; echo "exit=$?"; cat "$F/scratch/open-stdin-after.txt"`. Expected: `exit=0`, seven lines that start with `OK`, every one with `signal=null`, and a last line `entries=7 late=0 margin_ms=1000 runs=3`. The planner's edited copy showed medians from 542 ms to 641 ms. (`scratch/open-stdin-after.txt`) Evidence: measure-open-stdin.mjs -> exit=0, seven OK lines all signal=null (medians 538 to 765 ms, max 920 ms), entries=7 late=0 margin_ms=1000 runs=3
- [x] T051 SC-003, the short-deadline entries still act on a held-open payload: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; grep -c '^✔ the short-deadline entries still act on a payload their host writes but never closes' "$F/scratch/new-test-after.txt"` prints `1`. That test asserts the shim forwarded the payload to its advisor, Claude `SessionStart` printed `## Session Context`, Claude `PreCompact` logged `PreCompact triggered for session` and Codex `SessionStart` answered, each in under 2500 ms. (`scratch/new-test-after.txt`) Evidence: grep -c "^✔ the short-deadline entries still act on a payload their host writes but never closes" scratch/new-test-after.txt -> 1
- [x] T052 REQ-006, the longer host timeouts keep 3000 ms and the 1800 ms budget stays: `H=.skilled/skills/system-spec-kit/runtime/hooks; grep -c '^export const HOOK_STDIN_TIMEOUT_MS = 3000;$' $H/shared-stdin.ts; grep -c '^export function readStdin({ timeoutMs = 3000 } = {}) {$' $H/lib/hook-adapter-shared.mjs; grep -c '^export const HOOK_TIMEOUT_MS = 1800;$' $H/claude/shared.ts; grep -c 'withTimeout(parseHookStdin(), HOOK_TIMEOUT_MS, null)' $H/claude/session-stop.ts; grep -c "readCodexHookInput('Stop', \['session_id'\]);" $H/codex/session-stop.ts`. Expected: five lines, each `1`. (`.skilled/skills/system-spec-kit/runtime/hooks`) Evidence: five greps (shared-stdin.ts 3000, hook-adapter-shared.mjs readStdin 3000, claude/shared.ts HOOK_TIMEOUT_MS 1800, claude/session-stop.ts, codex/session-stop.ts) -> 1, 1, 1, 1, 1
- [x] T053 REQ-007, the edited code type-checks, lints and builds: `cd .skilled/skills/system-spec-kit/runtime && npm run typecheck > /dev/null 2>&1; echo "typecheck=$?"; ../node_modules/.bin/eslint hooks/claude/user-prompt-submit.ts hooks/shared-stdin.ts hooks/claude/shared.ts hooks/codex/shared.ts hooks/claude/compact-inject.ts hooks/codex/session-start.ts hooks/codex/user-prompt-submit.ts; echo "eslint=$?"; ../node_modules/.bin/eslint hooks/claude/session-prime.ts 2>&1 | grep -c 'error'; for f in hooks/lib/hook-adapter-shared.mjs hooks/claude/spec-gate-classify.mjs hooks/codex/spec-gate-classify.mjs hooks/lib/hook-stdin-deadline.test.mjs; do node --check "$f" || echo "FAIL $f"; done; node cli/lib/dist-freshness.cjs check-all`. Expected: `typecheck=0`, `eslint=0` with no findings, then `2` (the pre-existing `HookInput` error line and the `✖ 1 problem (1 error, 0 warnings)` summary), no `FAIL` line, and `All watched dist outputs are fresh.` (`.skilled/skills/system-spec-kit/runtime/`) Evidence: npm run typecheck -> typecheck=0; eslint on seven files -> eslint=0 no findings; eslint session-prime.ts | grep -c error -> 2; node --check on four .mjs -> no FAIL; dist-freshness.cjs check-all -> All watched dist outputs are fresh.
- [x] T054 REQ-008, the release is versioned: `grep -c '^version: 2.7.2.0$' .skilled/skills/system-spec-kit/SKILL.md` prints `1`. `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-spec-kit/changelog/v2.7.2.0.md` prints `VALID`, `Document type: changelog` and `Total issues: 0`. `git status --porcelain -- .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md` prints nothing. (`.skilled/skills/system-spec-kit/changelog/v2.7.2.0.md`) Evidence: grep -c "^version: 2.7.2.0$" SKILL.md -> 1; validate_document.py v2.7.2.0.md -> VALID, Document type: changelog, Total issues: 0; git status --porcelain v2.7.1.0.md -> empty
- [x] T055 REQ-009, the READMEs describe the short deadline and still validate: rerun the T010 loop with `.skilled/skills/system-spec-kit/changelog/v2.7.2.0.md` in place of `v2.7.1.0.md`, expected `VALID` and `Total issues: 0` for each of the four. Then rerun the alignment command of T009, expected `[alignment-drift] PASS`, `Findings: 0` and `exit=0`. It reads tracked files only, so the new changelog is scanned only once staged. (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md`, `.skilled/skills/system-spec-kit/runtime/hooks/claude/README.md`) Evidence: validate_document.py on three READMEs and v2.7.2.0.md -> VALID and Total issues: 0 each; verify_alignment_drift.py -> [alignment-drift] PASS, Findings: 0, Errors: 0
- [x] T056 REQ-010, only the planned edits landed: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; python3 -I "$F/scratch/build-units.py" verify "$F/scratch/before" | tail -1` prints `files=17 mismatches=0`. Without the `tail`, a `BAD` line names any file that differs. Then `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; git status --porcelain -- .skilled/skills/system-spec-kit/runtime/hooks .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/changelog > "$F/scratch/status-after.txt"; diff "$F/scratch/status-before.txt" "$F/scratch/status-after.txt" > "$F/scratch/status-delta.txt"; grep -c '^>  M ' "$F/scratch/status-delta.txt"; grep -c '^> ?? ' "$F/scratch/status-delta.txt"; grep -c '^<' "$F/scratch/status-delta.txt"`. Expected: `16`, `1` and `0`. The one `??` line must be `.skilled/skills/system-spec-kit/changelog/v2.7.2.0.md`. Any other line means a file outside this plan changed: report it, do not revert another builder's work. (`scratch/status-after.txt`) Evidence: build-units.py verify scratch/before | tail -1 -> files=17 mismatches=0; status delta -> 16 modified, 1 untracked (changelog/v2.7.2.0.md), 0 removed
- [x] T057 Hermes mirror, check form only: rerun the T011 command. Expected: the T011 lines plus `DRIFT system-spec-kit`, because `SKILL.md` changed in T044. Do not regenerate: T059 is the orchestrator's. (`.hermes/skills/`) Evidence: sync-skills-hermes.cjs --check -> DRIFT sk-code, sk-code-opencode, sk-code-quality, sk-code-review, sk-code-webflow, system-spec-kit; FAIL: 6 drifted, 0 stale; exit=1. DRIFT system-spec-kit is the expected line; the other five are sibling sk-code edits. Orchestrator regenerates (PENDING-ORCHESTRATOR)
- [x] T058 Validate this folder: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/007-hook-deadline-margins; node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder "$F" --apply; bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$F" --strict`. Expected: `RESULT: PASSED`. (`spec.md`) Evidence: repair-derived.cjs --apply; validate.sh <folder> --strict -> Errors: 0  Warnings: 0, RESULT: PASSED
- [x] T059 Orchestrator only, after every child is built; the builder skips this task: run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` once, then `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` must print no `DRIFT system-spec-kit` line. Rebuild the trigger index with `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs` and the retrieval fixtures that list changelog files, then `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` must exit 0. Remove the planner's prototype `scratch/proto/` if it is still present. (`.hermes/skills/`) Evidence (orchestrator): the generator wrote 6 of 70 copies and `--check` prints `PASS: 70 Hermes skill copies in sync`, with no `DRIFT system-spec-kit` line. The trigger index and its retrieval fixtures were rebuilt and `generate-trigger-index.mjs --check` exits 0. `scratch/proto/` is absent
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks marked `[x]`
- [ ] No `[B]` blocked tasks remaining
- [ ] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->

---
