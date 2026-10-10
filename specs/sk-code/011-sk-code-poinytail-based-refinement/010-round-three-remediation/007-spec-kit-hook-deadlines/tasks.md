---
title: "Tasks: Phase 7: spec-kit-hook-deadlines"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "spec kit hook deadlines tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Phase 7: spec-kit-hook-deadlines

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

Run every command from the repository root unless it starts with `cd`. `F` stands for `specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines`; a command that uses `$F` sets it first. Write each result into the task's Evidence as you go. Never run `git add`, `commit`, `stash`, `checkout`, `reset` or `rm -rf`. Do one task at a time, in order: each Phase 2 task is one edit, and `scratch/dispatch-units.json` holds the same edits as units with the same task ids.

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 [P] Confirm the planner's pre-edit copy: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; find "$F/scratch/before" -type f | wc -l` prints `64`, and `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; rg -l "for await \(const chunk of process\.stdin\)|readFileSync\(0" "$F/scratch/before/.skilled/skills/system-spec-kit/runtime/hooks" | wc -l` prints `15`. If the copy is missing and no file under `.skilled/skills/system-spec-kit/runtime/hooks` has been edited yet, recreate it with `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; mkdir -p "$F/scratch/before/.skilled/skills/system-spec-kit/runtime" && cp -R .skilled/skills/system-spec-kit/runtime/hooks "$F/scratch/before/.skilled/skills/system-spec-kit/runtime/hooks" && cp .skilled/skills/system-spec-kit/SKILL.md "$F/scratch/before/.skilled/skills/system-spec-kit/SKILL.md"`. (`scratch/before/`) Evidence: `find scratch/before -type f | wc -l` -> 64; `rg -l ... scratch/before/.../hooks | wc -l` -> 15 (verifier)
- [x] T002 [P] Save the scope snapshot: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; git status --porcelain -- .skilled/skills/system-spec-kit/runtime/hooks .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/changelog > "$F/scratch/status-before.txt"; wc -l < "$F/scratch/status-before.txt"`. Expected at planning time: `0`. Record whatever it prints. (`scratch/status-before.txt`) Evidence: before state not captured (builder edits predate the check); planner recorded 0 at planning time and `scratch/status-before.txt` was created empty to match; `git status --porcelain` now lists 18 modified and 3 untracked (verifier)
- [x] T003 [P] Record the reader baseline and the answers on the unedited tree: `rg -n "for await \(const chunk of process\.stdin\)|readFileSync\(0" .skilled/skills/system-spec-kit/runtime/hooks --glob '!**/dist/**' --glob '!**/node_modules/**' | wc -l` prints `15`. Then `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; python3 -I "$F/scratch/build-units.py" check . | tail -1` prints `edit units=35 bad=0`, which proves every Phase 2 find text occurs exactly once. Then `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; node "$F/scratch/compare-fail-open.mjs"` prints `cases=64 mismatches=0` (about 2 seconds), which proves the planner's recorded answers in `scratch/baseline/fail-open-before.json` match this tree. (`.skilled/skills/system-spec-kit/runtime/hooks`) Evidence: before state read from `scratch/before`: `rg ... | wc -l` -> 15 there (0 on the live tree); `build-units.py check scratch/before | tail -1` -> `edit units=35 bad=0`; `node scratch/compare-fail-open.mjs` -> `cases=64 mismatches=0` (verifier)
- [x] T004 [P] Record the vitest hook baseline (about 25 seconds): `cd .skilled/skills/system-spec-kit/runtime && npx --no-install vitest run tests/hook-*.vitest.ts tests/hooks-*.vitest.ts tests/user-prompt-submit-shim.vitest.ts tests/directive-lifecycle-*.vitest.ts tests/edge-cases.vitest.ts tests/completion-evidence-sentinel.vitest.ts 2>&1 | grep -E "Test Files|Tests "`. Expected: `Test Files  16 passed (16)` and `Tests  290 passed (290)`. (`.skilled/skills/system-spec-kit/runtime/tests/`) Evidence: before state not captured by verifier (edits already applied); after-state rerun `npx --no-install vitest run ...` -> `Test Files  16 passed (16)`, `Tests  290 passed (290)`, equal to the planner's recorded baseline (verifier)
- [x] T005 [P] Record the node:test hook baseline: `cd .skilled/skills/system-spec-kit/runtime && node --test tests/hooks/*.test.mjs > ../../../../specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/hooks-node-test.txt 2>&1; echo "exit=$?"; grep -E "^ℹ (tests|pass|fail|skipped) " ../../../../specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/hooks-node-test.txt`. Expected: `exit=0`, `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3`. (`.skilled/skills/system-spec-kit/runtime/tests/hooks/`) Evidence: before state not captured by verifier; after-state rerun `node --test tests/hooks/*.test.mjs` -> exit=0, `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3`, equal to the planner's baseline (verifier)
- [x] T006 [P] Record the type and lint baseline: `cd .skilled/skills/system-spec-kit/runtime && npm run typecheck > /dev/null 2>&1; echo "typecheck=$?"; ../node_modules/.bin/eslint hooks/claude/shared.ts hooks/codex/shared.ts hooks/cursor/shared.ts hooks/devin/shared.ts hooks/claude/directive-lifecycle-boundary.ts hooks/claude/compact-inject.ts; echo "eslint=$?"`. Expected: `typecheck=0` and `eslint=0` with no findings. (`.skilled/skills/system-spec-kit/runtime/`) Evidence: before state not captured by verifier; after-state `npm run typecheck` -> exit 0 and `eslint hooks/claude/shared.ts ... compact-inject.ts` -> exit 0 with no findings (verifier)
- [x] T007 [P] Record the build and alignment baseline: `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all` prints `All watched dist outputs are fresh.`, and `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .skilled/skills/system-spec-kit/runtime/hooks; echo "exit=$?"` prints `[alignment-drift] PASS`, `Findings: 0`, `Errors: 0` and `exit=0`. If `dist/` is not fresh, run `cd .skilled/skills/system-spec-kit/runtime && npm run build` first and record that you did. (`.skilled/skills/system-spec-kit/runtime/dist/`) Evidence: `node cli/lib/dist-freshness.cjs check-all` -> `All watched dist outputs are fresh.`; `verify_alignment_drift.py --root .../hooks` -> `[alignment-drift] PASS`, `Findings: 0`, `Errors: 0`, exit=0 (verifier, after-state)
- [x] T008 [P] Record the document validator baseline: `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-spec-kit/runtime/hooks/README.md`, the same on `.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md`, and the same on `.skilled/skills/system-spec-kit/changelog/v2.7.0.0.md`. Expected: `VALID` and `Total issues: 0` for each, with `Document type: readme` twice and `Document type: changelog` once. (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md`) Evidence: `validate_document.py` on hooks/README.md, hooks/lib/README.md, changelog/v2.7.0.0.md -> `VALID`, `Total issues: 0`, types readme, readme, changelog (verifier, after-state; README baselines not captured pre-edit)
- [x] T009 [P] Record the Hermes mirror baseline, check form only: `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check; echo "exit=$?"`. Record every `DRIFT` line it prints. At planning time it printed `DRIFT sk-code-quality`, `DRIFT sk-code-review` and `exit=1`, both from other work; none named `system-spec-kit`. Never run it without `--check`. (`.hermes/skills/`) Evidence: before state not captured (SKILL.md already bumped). Current `sync-skills-hermes.cjs --check` -> DRIFT cli-pi, sk-code-obsidian, sk-code-quality, sk-code-review, sk-code-webflow, deep-review, system-spec-kit, exit=1: sibling children plus this child's version bump; all PENDING-ORCHESTRATOR (verifier)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Read the authoring contracts before the first edit of each kind, and write one line in the goal log naming each file read. Code (T011 to T039): `.skilled/skills/sk-code/SKILL.md`, whose router bundles the OpenCode surface for work under `.skilled/`, then `.skilled/skills/sk-code/sk-code-opencode/SKILL.md`. READMEs (T041 to T048): `.skilled/skills/sk-doc/SKILL.md`. Version and changelog (T049 and T050): `.skilled/skills/sk-doc/sk-create-changelog/SKILL.md`. The edits below already follow these contracts; if one seems to break a rule, stop and report instead of changing the edit. (`.skilled/skills/sk-code/SKILL.md`) Evidence: verifier read the routing headers of `.skilled/skills/sk-code/SKILL.md`, `sk-code/sk-code-opencode/SKILL.md`, `sk-doc/SKILL.md` and `sk-doc/sk-create-changelog/SKILL.md` and scanned the added lines for em dashes and spec ids in code comments -> none (the changelog's `Spec folder:` line follows the v2.7.0.0 precedent)
- [x] T011 Create the deadline test. Do not retype it: copy the planner's file byte for byte. Run `cp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/units/hook-stdin-deadline.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`. Proof: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/units/hook-stdin-deadline.test.mjs .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs && echo same` prints `same`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`) Evidence: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/units/hook-stdin-deadline.test.mjs .ski` -> same (DeepSeek unit)

- [x] T012 Run the new test before any reader edit, to see it fail for the right reason (about 16 seconds). The full output lands in `scratch/baseline/new-test-before-fix.txt`. Expected lines: `ℹ tests 37`, `ℹ pass 7`, `ℹ fail 30`. The seven passes are the four payload tests and the three Claude hooks that already stop at their 1800 ms budget. If more pass, a kill-switch or a changed hook is in play: stop and report. Run `mkdir -p specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/baseline && node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs > specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/baseline/new-test-before-fix.txt 2>&1; grep -E '^ℹ (tests|pass|fail) ' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/baseline/new-test-before-fix.txt`. Proof: `grep -c '^ℹ fail 30$' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/baseline/new-test-before-fix.txt` prints `1`. (`specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/baseline/new-test-before-fix.txt`) Evidence: `grep -c '^ℹ fail 30$' specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/baseline/new-test-bef` -> 1 (DeepSeek unit)

- [x] T013 Create the compiled reader. Copy the planner's file byte for byte. Run `cp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/units/shared-stdin.ts .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts`. Proof: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/units/shared-stdin.ts .skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts && echo same` prints `same`. (`.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts`) Evidence: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/units/shared-stdin.ts .skilled/skills/s` -> same (DeepSeek unit)

- [x] T014 Give the shared ESM reader its deadline: replace the header tail and the old `readStdin` (lines 4-12). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'export function readStdin({ timeoutMs = 3000 } = {})' .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs`) Evidence: `grep -c 'export function readStdin({ timeoutMs = 3000 } = {})' .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs` -> 1 (DeepSeek unit)

T014 FIND (exact text, every line ends with a line break):

````text
// Keeps stdin collection and fail-open JSON parsing byte-identical across
// every ESM runtime hook adapter that previously repeated this boilerplate
// inline (Claude/Codex/Devin/Cursor spec-gate-enforce.mjs).

export async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
````

T014 REPLACE (exact text, every line ends with a line break):

````text
// Keeps stdin collection and fail-open JSON parsing byte-identical across
// every plain .mjs and .cjs hook adapter in this skill. ESM adapters import
// readStdin by name and CommonJS adapters load it with a dynamic import. The
// compiled TypeScript adapters read through ../shared-stdin.ts instead, which
// keeps the same deadline, because this file is not part of the TypeScript
// build and so is absent from dist. Nothing here imports from .skilled/hooks:
// this skill's hooks stay self-contained, and the reader in
// .skilled/hooks/shared/hook-adapter-shared.cjs is an independent sibling.

// A host that never closes stdin would otherwise hold the hook until the host's
// own timeout kills it, so the read settles on whichever comes first: the end of
// the stream, or the deadline with whatever has arrived by then.
export function readStdin({ timeoutMs = 3000 } = {}) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let settled = false;
    let timer = null;

    const onData = (chunk) => chunks.push(chunk);
    const onEnd = () => {
      if (settled) return;
      settled = true;
      release();
      resolve(Buffer.concat(chunks).toString('utf8'));
    };
    const onError = (error) => {
      if (settled) return;
      settled = true;
      release();
      reject(error);
    };
    const release = () => {
      clearTimeout(timer);
      process.stdin.removeListener('data', onData);
      process.stdin.removeListener('end', onEnd);
      process.stdin.removeListener('error', onError);
      process.stdin.pause();
    };

    timer = setTimeout(onEnd, timeoutMs);
    process.stdin.on('data', onData);
    process.stdin.on('end', onEnd);
    process.stdin.on('error', onError);
  });
}
````

- [x] T015 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "await import('../lib/hook-adapter-shared.mjs')" .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs`) Evidence: `grep -c "await import('../lib/hook-adapter-shared.mjs')" .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs` -> 1 (DeepSeek unit)

T015 FIND (exact text, every line ends with a line break):

````text
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
````

T015 REPLACE (exact text, every line ends with a line break):

````text
// The shared reader settles at a deadline, so a host that never closes stdin
// cannot hold this hook open. It is an ES module, so it loads on first use.
async function readStdin() {
  const shared = await import('../lib/hook-adapter-shared.mjs');
  return shared.readStdin();
}
````

- [x] T016 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "await import('../lib/hook-adapter-shared.mjs')" .skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs`) Evidence: `grep -c "await import('../lib/hook-adapter-shared.mjs')" .skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs` -> 1 (DeepSeek unit)

T016 FIND (exact text, every line ends with a line break):

````text
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
````

T016 REPLACE (exact text, every line ends with a line break):

````text
// The shared reader settles at a deadline, so a host that never closes stdin
// cannot hold this hook open. It is an ES module, so it loads on first use.
async function readStdin() {
  const shared = await import('../lib/hook-adapter-shared.mjs');
  return shared.readStdin();
}
````

- [x] T017 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "await import('../lib/hook-adapter-shared.mjs')" .skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs`) Evidence: `grep -c "await import('../lib/hook-adapter-shared.mjs')" .skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs` -> 1 (DeepSeek unit)

T017 FIND (exact text, every line ends with a line break):

````text
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
````

T017 REPLACE (exact text, every line ends with a line break):

````text
// The shared reader settles at a deadline, so a host that never closes stdin
// cannot hold this hook open. It is an ES module, so it loads on first use.
async function readStdin() {
  const shared = await import('../lib/hook-adapter-shared.mjs');
  return shared.readStdin();
}
````

- [x] T018 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "await import('../lib/hook-adapter-shared.mjs')" .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs`) Evidence: `grep -c "await import('../lib/hook-adapter-shared.mjs')" .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs` -> 1 (DeepSeek unit)

T018 FIND (exact text, every line ends with a line break):

````text
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
````

T018 REPLACE (exact text, every line ends with a line break):

````text
// The shared reader settles at a deadline, so a host that never closes stdin
// cannot hold this hook open. It is an ES module, so it loads on first use.
async function readStdin() {
  const shared = await import('../lib/hook-adapter-shared.mjs');
  return shared.readStdin();
}
````

- [x] T019 Delete the private reader: remove the FIND block (five lines plus the empty line after them); the replacement is nothing. The FIND text occurs exactly once in the file. Proof: `grep -c 'for await (const chunk of process.stdin)' .skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` prints `0`. (`.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`) Evidence: `grep -c 'for await (const chunk of process.stdin)' .skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` -> 0 (DeepSeek unit) Evidence: fix FIX-1 applied; `awk` longest blank run on cursor/post-tool-use.mjs -> 1; `build-units.py verify` no longer lists this file as BAD; `grep -c "for await (const chunk of process.stdin)"` -> 0 (verifier)

T019 FIND (exact text, every line ends with a line break):

````text
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

````

- [x] T020 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readStdin } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`) Evidence: `grep -c "^import { readStdin } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs` -> 1 (DeepSeek unit)

T020 FIND (exact text, every line ends with a line break):

````text
import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
````

T020 REPLACE (exact text, every line ends with a line break):

````text
import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
import { readStdin } from '../lib/hook-adapter-shared.mjs';
````

- [x] T021 Delete the private reader: remove the FIND block (five lines plus the empty line after them); the replacement is nothing. The FIND text occurs exactly once in the file. Proof: `grep -c 'for await (const chunk of process.stdin)' .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` prints `0`. (`.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs`) Evidence: `grep -c 'for await (const chunk of process.stdin)' .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` -> 0 (DeepSeek unit)

T021 FIND (exact text, every line ends with a line break):

````text
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

````

- [x] T022 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readStdin } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs`) Evidence: `grep -c "^import { readStdin } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs` -> 1 (DeepSeek unit)

T022 FIND (exact text, every line ends with a line break):

````text
import { validateSpecFolderBinding } from '../../../shared/dist/gate-3-classifier.js';
````

T022 REPLACE (exact text, every line ends with a line break):

````text
import { validateSpecFolderBinding } from '../../../shared/dist/gate-3-classifier.js';
import { readStdin } from '../lib/hook-adapter-shared.mjs';
````

- [x] T023 Delete the private reader: remove the FIND block (five lines plus the empty line after them); the replacement is nothing. The FIND text occurs exactly once in the file. Proof: `grep -c 'for await (const chunk of process.stdin)' .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` prints `0`. (`.skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs`) Evidence: `grep -c 'for await (const chunk of process.stdin)' .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` -> 0 (DeepSeek unit)

T023 FIND (exact text, every line ends with a line break):

````text
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

````

- [x] T024 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readStdin } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs`) Evidence: `grep -c "^import { readStdin } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs` -> 1 (DeepSeek unit)

T024 FIND (exact text, every line ends with a line break):

````text
import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
````

T024 REPLACE (exact text, every line ends with a line break):

````text
import { isHookEnabled } from '../../../../../hooks/shared/hook-flags.mjs';
import { readStdin } from '../lib/hook-adapter-shared.mjs';
````

- [x] T025 Delete the private reader: remove the FIND block (five lines plus the empty line after them); the replacement is nothing. The FIND text occurs exactly once in the file. Proof: `grep -c 'for await (const chunk of process.stdin)' .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` prints `0`. (`.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`) Evidence: `grep -c 'for await (const chunk of process.stdin)' .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` -> 0 (DeepSeek unit)

T025 FIND (exact text, every line ends with a line break):

````text
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}

````

- [x] T026 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readStdin } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs`) Evidence: `grep -c "^import { readStdin } from '../lib/hook-adapter-shared.mjs';$" .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs` -> 1 (DeepSeek unit)

T026 FIND (exact text, every line ends with a line break):

````text
import { evaluate, readHardRules } from '../../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs';
````

T026 REPLACE (exact text, every line ends with a line break):

````text
import { evaluate, readHardRules } from '../../../../../hooks/dispatch/lib/dispatch-rule-checks.mjs';
import { readStdin } from '../lib/hook-adapter-shared.mjs';
````

- [x] T027 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts`) Evidence: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` -> 1 (DeepSeek unit)

T027 FIND (exact text, every line ends with a line break):

````text
// drift in any one runtime silently forks the recovered-payload contract.
````

T027 REPLACE (exact text, every line ends with a line break):

````text
// drift in any one runtime silently forks the recovered-payload contract.

import { readHookStdin } from '../shared-stdin.js';
````

- [x] T028 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'await readHookStdin({ maxBytes: MAX_HOOK_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts`) Evidence: `grep -c 'await readHookStdin({ maxBytes: MAX_HOOK_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/claude/shared.ts` -> 1 (DeepSeek unit)

T028 FIND (exact text, every line ends with a line break):

````text
    const chunks: Buffer[] = [];
    let totalBytes = 0;
    for await (const chunk of process.stdin) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > MAX_HOOK_STDIN_BYTES) {
        process.stdin.destroy();
        hookLog('warn', 'stdin', `Hook stdin exceeded ${MAX_HOOK_STDIN_BYTES} bytes`);
        return null;
      }
      chunks.push(buffer);
    }
    const raw = Buffer.concat(chunks, totalBytes).toString('utf-8').trim();
````

T028 REPLACE (exact text, every line ends with a line break):

````text
    const text = await readHookStdin({ maxBytes: MAX_HOOK_STDIN_BYTES });
    if (text === null) {
      hookLog('warn', 'stdin', `Hook stdin exceeded ${MAX_HOOK_STDIN_BYTES} bytes`);
      return null;
    }
    const raw = text.trim();
````

- [x] T029 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts`) Evidence: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` -> 1 (DeepSeek unit)

T029 FIND (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
````

T029 REPLACE (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
import { readHookStdin } from '../shared-stdin.js';
````

- [x] T030 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'await readHookStdin({ maxBytes: MAX_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts`) Evidence: `grep -c 'await readHookStdin({ maxBytes: MAX_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/codex/shared.ts` -> 1 (DeepSeek unit)

T030 FIND (exact text, every line ends with a line break):

````text
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    for await (const chunk of process.stdin) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > MAX_STDIN_BYTES) {
        process.stdin.destroy();
        return null;
      }
      chunks.push(buffer);
    }

    const raw = Buffer.concat(chunks, totalBytes).toString('utf8').trim();
````

T030 REPLACE (exact text, every line ends with a line break):

````text
    const text = await readHookStdin({ maxBytes: MAX_STDIN_BYTES });
    if (text === null) return null;

    const raw = text.trim();
````

- [x] T031 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/cursor/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/cursor/shared.ts`) Evidence: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/cursor/shared.ts` -> 1 (DeepSeek unit)

T031 FIND (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
````

T031 REPLACE (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
import { readHookStdin } from '../shared-stdin.js';
````

- [x] T032 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'await readHookStdin({ maxBytes: MAX_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/cursor/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/cursor/shared.ts`) Evidence: `grep -c 'await readHookStdin({ maxBytes: MAX_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/cursor/shared.ts` -> 1 (DeepSeek unit)

T032 FIND (exact text, every line ends with a line break):

````text
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    for await (const chunk of process.stdin) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > MAX_STDIN_BYTES) {
        process.stdin.destroy();
        return null;
      }
      chunks.push(buffer);
    }

    const raw = Buffer.concat(chunks, totalBytes).toString('utf8').trim();
````

T032 REPLACE (exact text, every line ends with a line break):

````text
    const text = await readHookStdin({ maxBytes: MAX_STDIN_BYTES });
    if (text === null) return null;

    const raw = text.trim();
````

- [x] T033 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/devin/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/devin/shared.ts`) Evidence: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/devin/shared.ts` -> 1 (DeepSeek unit)

T033 FIND (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
````

T033 REPLACE (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
import { readHookStdin } from '../shared-stdin.js';
````

- [x] T034 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'await readHookStdin({ maxBytes: MAX_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/devin/shared.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/devin/shared.ts`) Evidence: `grep -c 'await readHookStdin({ maxBytes: MAX_STDIN_BYTES })' .skilled/skills/system-spec-kit/runtime/hooks/devin/shared.ts` -> 1 (DeepSeek unit)

T034 FIND (exact text, every line ends with a line break):

````text
    const chunks: Buffer[] = [];
    let totalBytes = 0;

    for await (const chunk of process.stdin) {
      const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk);
      totalBytes += buffer.length;
      if (totalBytes > MAX_STDIN_BYTES) {
        process.stdin.destroy();
        return null;
      }
      chunks.push(buffer);
    }

    const raw = Buffer.concat(chunks, totalBytes).toString('utf8').trim();
````

T034 REPLACE (exact text, every line ends with a line break):

````text
    const text = await readHookStdin({ maxBytes: MAX_STDIN_BYTES });
    if (text === null) return null;

    const raw = text.trim();
````

- [x] T035 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts`) Evidence: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` -> 1 (DeepSeek unit)

T035 FIND (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
````

T035 REPLACE (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
import { readHookStdin } from '../shared-stdin.js';
````

- [x] T036 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "JSON.parse((await readHookStdin()) ?? '')" .skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts`) Evidence: `grep -c "JSON.parse((await readHookStdin()) ?? '')" .skilled/skills/system-spec-kit/runtime/hooks/claude/directive-lifecycle-boundary.ts` -> 1 (DeepSeek unit)

T036 FIND (exact text, every line ends with a line break):

````text
    const chunks: Buffer[] = [];
    for await (const chunk of process.stdin) chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    const parsed = JSON.parse(Buffer.concat(chunks).toString('utf8')) as HostDirectiveLifecycleBoundary;
````

T036 REPLACE (exact text, every line ends with a line break):

````text
    const parsed = JSON.parse((await readHookStdin()) ?? '') as HostDirectiveLifecycleBoundary;
````

- [x] T037 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { closeSync, fstatSync, openSync, readSync } from 'node:fs';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`) Evidence: `grep -c "^import { closeSync, fstatSync, openSync, readSync } from 'node:fs';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` -> 1 (DeepSeek unit)

T037 FIND (exact text, every line ends with a line break):

````text
import { closeSync, fstatSync, openSync, readFileSync, readSync } from 'node:fs';
````

T037 REPLACE (exact text, every line ends with a line break):

````text
import { closeSync, fstatSync, openSync, readSync } from 'node:fs';
````

- [x] T038 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`) Evidence: `grep -c "^import { readHookStdin } from '../shared-stdin.js';$" .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` -> 1 (DeepSeek unit)

T038 FIND (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
````

T038 REPLACE (exact text, every line ends with a line break):

````text
import { isMainModule } from '../../lib/esm-entry.js';
import { readHookStdin } from '../shared-stdin.js';
````

- [x] T039 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^async function runAuthoredSnapshotWorker(): Promise<void> {$' .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts`) Evidence: `grep -c '^async function runAuthoredSnapshotWorker(): Promise<void> {$' .skilled/skills/system-spec-kit/runtime/hooks/claude/compact-inject.ts` -> 1 (DeepSeek unit)

T039 FIND (exact text, every line ends with a line break):

````text
function runAuthoredSnapshotWorker(): void {
  const input = JSON.parse(readFileSync(0, 'utf-8')) as {
````

T039 REPLACE (exact text, every line ends with a line break):

````text
async function runAuthoredSnapshotWorker(): Promise<void> {
  const input = JSON.parse((await readHookStdin()) ?? '') as {
````

- [x] T040 Rebuild `dist/` with the skill's own build command (about a minute). Expected: exit 0, then the check prints `All watched dist outputs are fresh.` and the path `.skilled/skills/system-spec-kit/runtime/dist/hooks/shared-stdin.js`. `dist/` is git-ignored, so the build adds nothing to `git status`. Run `cd .skilled/skills/system-spec-kit/runtime && npm run build`. Proof: `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all && ls .skilled/skills/system-spec-kit/runtime/dist/hooks/shared-stdin.js` prints `All watched dist outputs are fresh.`. (`.skilled/skills/system-spec-kit/runtime/dist/hooks`) Evidence: `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all && ls .skilled/skills/system-spec-kit/runtime/dist/hooks/shared-stdin.js` -> All watched dist outputs are fresh. (DeepSeek unit)

- [x] T041 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'settles when stdin ends or after 3000 ms' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md`) Evidence: `grep -c 'settles when stdin ends or after 3000 ms' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` -> 1 (DeepSeek unit)

T041 FIND (exact text, every line ends with a line break):

````text
- `hook-adapter-shared.mjs` is a small stdin-and-JSON helper pair used directly by the classify and enforce adapters that do not need the full spec-gate core themselves.
````

T041 REPLACE (exact text, every line ends with a line break):

````text
- `hook-adapter-shared.mjs` is a small stdin-and-JSON helper pair. Its `readStdin()` settles when stdin ends or after 3000 ms, whichever comes first, so a host that never closes stdin cannot hold a hook open. Every plain `.mjs` and `.cjs` adapter in this skill reads stdin through it. The compiled TypeScript adapters use `../shared-stdin.ts`, which keeps the same deadline.
````

- [x] T042 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'hook-stdin-deadline.test.mjs  # Proves every hook entry' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md`) Evidence: `grep -c 'hook-stdin-deadline.test.mjs  # Proves every hook entry' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` -> 1 (DeepSeek unit)

T042 FIND (exact text, every line ends with a line break):

````text
├── hook-adapter-shared.mjs   # readStdin() + parseJsonFailOpen() for classify/enforce adapters
````

T042 REPLACE (exact text, every line ends with a line break):

````text
├── hook-adapter-shared.mjs   # Deadline readStdin() + parseJsonFailOpen() for the plain .mjs and .cjs adapters
├── hook-stdin-deadline.test.mjs  # Proves every hook entry gives up at the stdin deadline
````

- [x] T043 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^| `hook-stdin-deadline.test.mjs` |' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md`) Evidence: `grep -c '^| `hook-stdin-deadline.test.mjs` |' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` -> 1 (DeepSeek unit)

T043 FIND (exact text, every line ends with a line break):

````text
| `hook-adapter-shared.mjs` | `readStdin()` collects and decodes a hook's stdin payload; `parseJsonFailOpen(raw)` parses it and returns `null` on any failure instead of throwing. Imported by `claude/spec-gate-classify.mjs`, `codex/spec-gate-classify.mjs`, and the `spec-gate-enforce.mjs` of `claude/`, `codex/`, `cursor/` and `devin/`. |
````

T043 REPLACE (exact text, every line ends with a line break):

````text
| `hook-adapter-shared.mjs` | `readStdin({ timeoutMs = 3000 })` collects a hook's stdin payload until the stream ends or the deadline passes, returns what arrived and releases stdin so the process can exit. `parseJsonFailOpen(raw)` parses it and returns `null` on any failure instead of throwing. Imported by the `spec-gate-classify.mjs` and `spec-gate-enforce.mjs` of `claude/`, `codex/`, `cursor/` and `devin/`, by `cursor/post-tool-use.mjs`, `cursor/spec-gate-prebind.mjs`, `cursor/completion-evidence-response.mjs` and `devin/permission-request-policy.mjs`, and loaded with a dynamic import by the three `completion-evidence-stop.cjs` adapters and `devin/post-compaction.cjs`. |
| `hook-stdin-deadline.test.mjs` | Spawns every hook entry with stdin held open and asserts each exits on its own at the deadline with its fail-open result, then pins the payload path of entries no other suite spawns. The compiled entries run from `dist/`, so build first. |
````

- [x] T044 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^node --test hooks/lib/hook-stdin-deadline.test.mjs$' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md`) Evidence: `grep -c '^node --test hooks/lib/hook-stdin-deadline.test.mjs$' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` -> 1 (DeepSeek unit)

T044 FIND (exact text, every line ends with a line break):

````text
node --test tests/hooks/spec-gate-core.test.mjs
```
````

T044 REPLACE (exact text, every line ends with a line break):

````text
node --test tests/hooks/spec-gate-core.test.mjs
node --test hooks/lib/hook-stdin-deadline.test.mjs
```
````

- [x] T045 Add one import line directly after the anchor line: replace the FIND line with the REPLACE lines. The FIND text occurs exactly once in the file. Proof: `grep -c 'shared-stdin.ts          # Deadline stdin reader' .skilled/skills/system-spec-kit/runtime/hooks/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`) Evidence: `grep -c 'shared-stdin.ts          # Deadline stdin reader' .skilled/skills/system-spec-kit/runtime/hooks/README.md` -> 1 (DeepSeek unit)

T045 FIND (exact text, every line ends with a line break):

````text
├── shared-provenance.ts     # Provenance-wrapped transport helpers
````

T045 REPLACE (exact text, every line ends with a line break):

````text
├── shared-provenance.ts     # Provenance-wrapped transport helpers
├── shared-stdin.ts          # Deadline stdin reader for the compiled adapters
````

- [x] T046 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c 'Deadline stdin reader and fail-open JSON parser' .skilled/skills/system-spec-kit/runtime/hooks/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`) Evidence: `grep -c 'Deadline stdin reader and fail-open JSON parser' .skilled/skills/system-spec-kit/runtime/hooks/README.md` -> 1 (DeepSeek unit)

T046 FIND (exact text, every line ends with a line break):

````text
| `lib/hook-adapter-shared.mjs` | Shared helper for the four `spec-gate-enforce` adapters. |
````

T046 REPLACE (exact text, every line ends with a line break):

````text
| `lib/hook-adapter-shared.mjs` | Deadline stdin reader and fail-open JSON parser for every plain `.mjs` and `.cjs` adapter. See [`lib/README.md`](./lib/README.md). |
````

- [x] T047 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^| `shared-stdin.ts` |' .skilled/skills/system-spec-kit/runtime/hooks/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`) Evidence: `grep -c '^| `shared-stdin.ts` |' .skilled/skills/system-spec-kit/runtime/hooks/README.md` -> 1 (DeepSeek unit)

T047 FIND (exact text, every line ends with a line break):

````text
The completion-evidence policy each runtime's Stop-equivalent adapter calls lives in `lib/completion-evidence-sentinel.cjs`.
````

T047 REPLACE (exact text, every line ends with a line break):

````text
| `shared-stdin.ts` | `readHookStdin()` reads a compiled adapter's stdin until the stream ends or 3000 ms pass, and returns `null` when the payload passes the caller's byte cap. Consumed by the four `shared.ts` readers, `claude/compact-inject.ts` and `claude/directive-lifecycle-boundary.ts`. |

The completion-evidence policy each runtime's Stop-equivalent adapter calls lives in `lib/completion-evidence-sentinel.cjs`.
````

- [x] T048 Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^node --test hooks/lib/hook-stdin-deadline.test.mjs$' .skilled/skills/system-spec-kit/runtime/hooks/README.md` prints `1`. (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`) Evidence: `grep -c '^node --test hooks/lib/hook-stdin-deadline.test.mjs$' .skilled/skills/system-spec-kit/runtime/hooks/README.md` -> 1 (DeepSeek unit)

T048 FIND (exact text, every line ends with a line break):

````text
node --test tests/hooks/spec-gate-codex.test.mjs
```
````

T048 REPLACE (exact text, every line ends with a line break):

````text
node --test tests/hooks/spec-gate-codex.test.mjs
node --test hooks/lib/hook-stdin-deadline.test.mjs
```
````

- [x] T049 Bump the system-spec-kit version for the patch release (line 5). Replace the FIND block with the REPLACE block. The FIND text occurs exactly once in the file. Proof: `grep -c '^version: 2.7.1.0$' .skilled/skills/system-spec-kit/SKILL.md` prints `1`. (`.skilled/skills/system-spec-kit/SKILL.md`) Evidence: `grep -c '^version: 2.7.1.0$' .skilled/skills/system-spec-kit/SKILL.md` -> 1 (DeepSeek unit)

T049 FIND (exact text, every line ends with a line break):

````text
version: 2.7.0.0
````

T049 REPLACE (exact text, every line ends with a line break):

````text
version: 2.7.1.0
````

- [x] T050 Create the changelog entry. Copy the planner's file byte for byte. Run `cp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/units/v2.7.1.0.md .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md`. Proof: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/units/v2.7.1.0.md .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md && echo same` prints `same`. (`.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md`) Evidence: `cmp specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines/scratch/units/v2.7.1.0.md .skilled/skills/syste` -> same (DeepSeek unit)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T051 REQ-001, no unbounded reader is left: `rg -n "for await \(const chunk of process\.stdin\)|readFileSync\(0" .skilled/skills/system-spec-kit/runtime/hooks --glob '!**/dist/**' --glob '!**/node_modules/**'; echo "exit=$?"`. Expected: no match lines and `exit=1`. (`.skilled/skills/system-spec-kit/runtime/hooks`) Evidence: `rg -n "for await \(const chunk of process\.stdin\)|readFileSync\(0" ...hooks --glob '!**/dist/**' --glob '!**/node_modules/**'; echo exit=$?` -> no match lines, `exit=1`
- [x] T052 REQ-002, every entry gives up at the deadline (about 4 seconds): `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; node --test .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs > "$F/scratch/new-test-after.txt" 2>&1; echo "exit=$?"; grep -E "^ℹ (tests|pass|fail) " "$F/scratch/new-test-after.txt"`. Expected: `exit=0`, `ℹ tests 37`, `ℹ pass 37`, `ℹ fail 0`. A failing subtest is named by its entry path; recheck that file's Phase 2 tasks, then rerun. (`.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`) Evidence: `node --test hooks/lib/hook-stdin-deadline.test.mjs` -> exit=0, `ℹ tests 37`, `ℹ pass 37`, `ℹ fail 0`
- [x] T053 REQ-003, the existing suites keep their counts: rerun the T004 command, expected `Test Files  16 passed (16)` and `Tests  290 passed (290)`; then rerun the T005 command, expected `exit=0`, `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3`. Both must equal the Phase 1 records. (`.skilled/skills/system-spec-kit/runtime/tests/`) Evidence: vitest set -> `Test Files  16 passed (16)`, `Tests  290 passed (290)`; `node --test tests/hooks/*.test.mjs` -> exit=0, `ℹ tests 184`, `ℹ pass 181`, `ℹ fail 0`, `ℹ skipped 3`
- [x] T054 REQ-004, the tree stays self-contained: `rg -n "(from |import\(|require\()'[^']*hook-adapter-shared\.cjs'" .skilled/skills/system-spec-kit/runtime/hooks; echo "exit=$?"` prints only `exit=1`. Then `rg -n "(from |import\(|require\()'[^']*hook-adapter-shared\.mjs'" .skilled/skills/system-spec-kit/runtime/hooks | wc -l` prints `16`: the eight spec-gate adapters, the four `.mjs` hooks of T019 to T026 and the four `.cjs` hooks of T015 to T018. (`.skilled/skills/system-spec-kit/runtime/hooks`) Evidence: `rg ... hook-adapter-shared\.cjs'` -> exit=1; `rg ... hook-adapter-shared\.mjs' | wc -l` -> 16
- [x] T055 REQ-005, every edited file parses, type-checks, lints and builds: `for f in .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs .skilled/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs .skilled/skills/system-spec-kit/runtime/hooks/codex/completion-evidence-stop.cjs .skilled/skills/system-spec-kit/runtime/hooks/devin/completion-evidence-stop.cjs .skilled/skills/system-spec-kit/runtime/hooks/devin/post-compaction.cjs .skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs .skilled/skills/system-spec-kit/runtime/hooks/cursor/spec-gate-prebind.mjs .skilled/skills/system-spec-kit/runtime/hooks/cursor/completion-evidence-response.mjs .skilled/skills/system-spec-kit/runtime/hooks/devin/permission-request-policy.mjs .skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs; do node --check "$f" || echo "FAIL $f"; done; echo done` prints only `done`. Then `cd .skilled/skills/system-spec-kit/runtime && npm run typecheck > /dev/null 2>&1; echo "typecheck=$?"; ../node_modules/.bin/eslint hooks/shared-stdin.ts hooks/claude/shared.ts hooks/codex/shared.ts hooks/cursor/shared.ts hooks/devin/shared.ts hooks/claude/directive-lifecycle-boundary.ts hooks/claude/compact-inject.ts; echo "eslint=$?"` prints `typecheck=0` and `eslint=0` with no findings. Then `node .skilled/skills/system-spec-kit/runtime/cli/lib/dist-freshness.cjs check-all; ls .skilled/skills/system-spec-kit/runtime/dist/hooks/shared-stdin.js` prints `All watched dist outputs are fresh.` and the path. (`.skilled/skills/system-spec-kit/runtime/hooks`) Evidence: ten `node --check` calls print nothing; `npm run typecheck` -> exit 0; eslint on the seven files -> exit 0; `npm run build` -> exit 0; `check-all` -> `All watched dist outputs are fresh.`; `ls dist/hooks/shared-stdin.js` -> path printed
- [x] T056 REQ-006, entries reached through symlinks still run: `for f in .skilled/hooks/dispatch/cursor/post-tool-use.mjs .skilled/hooks/completion/claude/completion-evidence-stop.cjs .devin/hooks/post-compaction.cjs .cursor/hooks/spec-gate-prebind.mjs; do printf '%s ' "$f"; node "$f" < /dev/null; echo " exit=$?"; done`. Expected four lines, in order: `.skilled/hooks/dispatch/cursor/post-tool-use.mjs {"permission":"allow"} exit=0`, `.skilled/hooks/completion/claude/completion-evidence-stop.cjs  exit=0`, `.devin/hooks/post-compaction.cjs  exit=0`, `.cursor/hooks/spec-gate-prebind.mjs {"permission":"allow"} exit=0`. (`.skilled/hooks/`, `.devin/hooks/`, `.cursor/hooks/`) Evidence: four symlinked entries -> `{"permission":"allow"} exit=0`, empty `exit=0`, empty `exit=0`, `{"permission":"allow"} exit=0`, in the expected order
- [x] T057 REQ-007, each file carries exactly the planned edits: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; python3 -I "$F/scratch/build-units.py" verify "$F/scratch/before" | tail -1; echo "exit=$?"`. Expected: `files=21 mismatches=0` and `exit=0`. Without the `tail`, a `BAD` line names any file that differs. (`.skilled/skills/system-spec-kit/runtime/hooks`) Evidence: `build-units.py verify scratch/before | tail -1` -> `files=21 mismatches=2`; the two `BAD` files are `hooks/README.md` (FIX-2 moved the `shared-stdin.ts` row into the table) and `changelog/v2.7.1.0.md` (FIX-3 and FIX-4 narrowed the "every hook" claim). Both are deliberate deviations from the planned text; the other 19 files, including cursor/post-tool-use.mjs, match byte for byte (verifier)
- [x] T058 REQ-008, the READMEs describe the readers and still validate: rerun the first two T008 commands, expected `VALID` and `Total issues: 0` for each. Then `grep -c 'shared-stdin.ts' .skilled/skills/system-spec-kit/runtime/hooks/README.md` prints `2` and `grep -c 'hook-stdin-deadline.test.mjs' .skilled/skills/system-spec-kit/runtime/hooks/lib/README.md` prints `3`. Then rerun the alignment command of T007, expected `[alignment-drift] PASS`, `Findings: 0`, `exit=0`; it reads tracked files only, so the two new files are not scanned until staged. (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`, `.skilled/skills/system-spec-kit/runtime/hooks/lib/README.md`) Evidence: `validate_document.py` -> `VALID`, `Total issues: 0` for both READMEs; `grep -c shared-stdin.ts hooks/README.md` -> 2; `grep -c hook-stdin-deadline.test.mjs lib/README.md` -> 3; alignment -> `[alignment-drift] PASS`, `Findings: 0`. Review note: the README table row is detached by a blank line (FIX-2)
- [x] T059 REQ-009, the release is versioned: `grep -c '^version: 2.7.1.0$' .skilled/skills/system-spec-kit/SKILL.md` prints `1`, and `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/system-spec-kit/changelog/v2.7.1.0.md` prints `VALID`, `Document type: changelog` and `Total issues: 0`. (`.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md`) Evidence: `grep -c '^version: 2.7.1.0$' SKILL.md` -> 1; `validate_document.py changelog/v2.7.1.0.md` -> `VALID`, `Document type: changelog`, `Total issues: 0`
- [x] T060 REQ-010, only the planned files changed: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; git status --porcelain -- .skilled/skills/system-spec-kit/runtime/hooks .skilled/skills/system-spec-kit/SKILL.md .skilled/skills/system-spec-kit/changelog > "$F/scratch/status-after.txt"; diff "$F/scratch/status-before.txt" "$F/scratch/status-after.txt" > "$F/scratch/status-delta.txt"; grep -c '^>  M ' "$F/scratch/status-delta.txt"; grep -c '^> ?? ' "$F/scratch/status-delta.txt"; grep -c '^<' "$F/scratch/status-delta.txt"`. Expected: `18`, `3` and `0`. The three `??` lines must be `.skilled/skills/system-spec-kit/runtime/hooks/lib/hook-stdin-deadline.test.mjs`, `.skilled/skills/system-spec-kit/runtime/hooks/shared-stdin.ts` and `.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md`. Any other line means a file outside this plan changed: report it, do not revert another builder's work. (`scratch/status-after.txt`) Evidence: `>  M` -> 18, `> ??` -> 3, `<` -> 0; status-before.txt created empty (planner recorded 0); the three `??` lines are the test, shared-stdin.ts and v2.7.1.0.md
- [x] T061 SC-001, no listed hook is held by an open stdin: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; grep -c '^✔ every hook entry gives up at the stdin deadline when its host never closes stdin' "$F/scratch/new-test-after.txt"` prints `1`, and `grep -c '^  ✔ ' "$F/scratch/new-test-after.txt"` prints `32`, one per entry, each of which exited on its own before 10000 ms. (`scratch/new-test-after.txt`) Evidence: `grep -c '^✔ every hook entry gives up ...' scratch/new-test-after.txt` -> 1; `grep -c '^  ✔ ' ...` -> 32
- [x] T062 SC-002, no answer changed on an empty or invalid payload: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; node "$F/scratch/compare-fail-open.mjs"; echo "exit=$?"`. Expected: `cases=64 mismatches=0` and `exit=0`. A `DIFF` line names the entry and input that changed. (`scratch/compare-fail-open.mjs`) Evidence: `node scratch/compare-fail-open.mjs; echo exit=$?` -> `cases=64 mismatches=0`, `exit=0`
- [x] T063 Hermes mirror, check form only: rerun the T009 command. Expected: the T009 `DRIFT` lines plus `DRIFT system-spec-kit`, because `SKILL.md` changed in T049. Do not regenerate: T065 is the orchestrator's. (`.hermes/skills/`) Evidence: `sync-skills-hermes.cjs --check` -> includes `DRIFT system-spec-kit` as expected plus sibling drift (cli-pi, sk-code-obsidian, sk-code-quality, sk-code-review, sk-code-webflow, deep-review); regeneration is the orchestrator's (PENDING-ORCHESTRATOR)
- [x] T064 Validate this folder: `F=specs/sk-code/011-sk-code-poinytail-based-refinement/010-round-three-remediation/007-spec-kit-hook-deadlines; node .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs --folder "$F" --apply; bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh "$F" --strict`. Expected: `RESULT: PASSED`. (`spec.md`) Evidence: `repair-derived.cjs --folder "$F" --apply` -> `inspected=1 repaired=1 failed=0`; `validate.sh "$F" --strict` -> `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`
- [x] T065 Orchestrator only, after every child is built; the builder skips this task: run `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs` once, then `node .skilled/skills/system-spec-kit/runtime/cli/hermes/sync-skills-hermes.cjs --check` must print no `DRIFT system-spec-kit` line. Also rebuild the trigger index for the new changelog entry with the repo's usual step. (`.hermes/skills/`) Evidence: (orchestrator, after every build) `sync-skills-hermes.cjs` -> `Wrote 9 of 70 Hermes skill copies`, `--check` -> `PASS: 70 Hermes skill copies in sync`; `generate-trigger-index.mjs` exit 0, `--check` exit 0.
- [x] T066 FIX-1, remove the two extra blank lines left by the reader deletion in `.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`. (`.skilled/skills/system-spec-kit/runtime/hooks/cursor/post-tool-use.mjs`) Evidence: awk longest blank run on the file -> 1; `build-units.py verify` no BAD for it (verifier)
- [x] T067 FIX-2, attach the `shared-stdin.ts` row to the key-files table in `.skilled/skills/system-spec-kit/runtime/hooks/README.md`. (`.skilled/skills/system-spec-kit/runtime/hooks/README.md`) Evidence: `grep -A1 '^| `shared-provenance.ts` |' README.md | grep -c '^| `shared-stdin.ts` |'` -> 1; `validate_document.py` -> `VALID`, `Total issues: 0` (verifier)
- [x] T068 FIX-3, narrow the changelog description to exclude the Claude prompt-submit hook. (`.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md`) Evidence: `grep -c '^description: "Every spec-kit hook except the Claude prompt-submit hook' changelog/v2.7.1.0.md` -> 1 (verifier)
- [x] T069 FIX-4, narrow the changelog opening paragraph the same way. (`.skilled/skills/system-spec-kit/changelog/v2.7.1.0.md`) Evidence: `grep -c 'Every hook except `claude/user-prompt-submit.ts`' changelog/v2.7.1.0.md` -> 1; `validate_document.py` -> `VALID`, `Document type: changelog`, `Total issues: 0` (verifier)
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
