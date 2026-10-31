GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/code.md; focused summary for a one-change brief) ===
You are @code, a leaf implementer dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. Read each file before editing it and re-read the edited region after.
Standards: read .skilled/skills/sk-code/SKILL.md and follow the route it resolves for this file type.
Comment hygiene is a hard block: no spec paths, packet or phase numbers, or REQ/task ids in code comments. Keep the durable why.
Verification: run only the checks this brief lists. Fail closed: no retry loop, no workaround. Report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: code) ===

TASK: create a new read-only Node script with its census helpers, and its new vitest file with three census tests. 2 new files, nothing else.
S = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
T = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts
Read first: specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/design.md (the contract; implement ONLY its sections 1 and 2 now, later briefs add the rest), and S's sibling scorer/score-model-variant.cjs for the house layout (box header, numbered `// ───` section dividers, JSDoc with @param/@returns/@throws on each function, module.exports at the end).

STEP 1. Create S:
- Line 1 `#!/usr/bin/env node`, then a box header `score-d4-agreement — offline D4 hallucination-judgment agreement`, then `'use strict';`, then a module JSDoc of 3-5 lines: it measures offline whether a Jev or Deem noul that flags invented flags, files or functions agrees with the operator's labels more often than the deterministic hallucination-flag check; the default run makes no model call and writes no file; it holds and reads no credential.
- `// 1. IMPORTS`: fs, os, path, crypto from `node:` built-ins, `{ spawn, spawnSync }` from `node:child_process`, `{ parseArgs }` from `node:util`.
- `// 2. CONSTANTS`: every constant of design section 1, verbatim, each with a one-line comment saying what it fixes.
- `// 3. CENSUS`: `listOutputs`, `loadFixtures`, `matchOutputs` exactly as design section 2.
- `// 4. EXPORTS`: `module.exports = { QUESTION, MARGIN_LINE, KEEP_RULE_LINE, POWER_LINE, LABEL_GATE, CLASS_GATE, JEV_RERUNS, DEFAULT_FIXTURES_DIR, HALLUCINATION_CHECK, USAGE, listOutputs, loadFixtures, matchOutputs };`
No main function and no CLI entry yet.

STEP 2. Create T with a `// MODULE: score-d4-agreement` divider header like its sibling tests/run-benchmark-hardening.vitest.ts, then:
- imports: path, fs, os (node:), `createRequire` from node:module, `fileURLToPath` from node:url, `{ afterEach, describe, expect, it }` from vitest.
- `const TEST_DIR = path.dirname(fileURLToPath(import.meta.url));` `const require = createRequire(import.meta.url);` `const d4 = require(path.join(TEST_DIR, '../scorer/score-d4-agreement.cjs')) as Record<string, any>;`
- helper `tempDir(prefix)`: mkdtemp under os.tmpdir(), pushed on a `tempDirs` array that an `afterEach` removes (rmSync recursive force).
- helper `writeFixtures()` returns a temp dir holding fx-a.json `{ id: 'fx-a', task: 'Write add(a, b).', visibleSpec: 'add(1, 2) is 3', allowlist: { cli_flags: ['--dry-run'], symbols: ['add'] } }`, fx-b.json `{ id: 'fx-b', task: 'Write sub(a, b).', visibleSpec: 'sub(3, 1) is 2' }` and fx-c-file.json `{ id: 'fx-c', title: 'no task' }` (file name differs from id on purpose).
- helper `writeOutputs(names: string[])` returns a temp dir with each name written as a file holding `output for <name>\n`.
- describe('score-d4-agreement census') with three it():
  1. listOutputs on writeOutputs(['fx-a.md', 'fx-b.run2.md', 'fx-c.md', 'orphan.md', 'report.json']) plus a subdirectory named `dir.md` toEqual `[{ file: 'fx-a.md', id: 'fx-a' }, { file: 'fx-b.run2.md', id: 'fx-b' }, { file: 'fx-c.md', id: 'fx-c' }, { file: 'orphan.md', id: 'orphan' }]`.
  2. loadFixtures(writeFixtures()) has total 3, withAllowlist 1, byId.has('fx-c') true, byId.has('fx-c-file') false; matchOutputs of the same outputs gives matched files `['fx-a.md', 'fx-b.run2.md', 'fx-c.md']` and unmatched `[{ file: 'orphan.md', id: 'orphan' }]`.
  3. After adding dup.json `{ id: 'fx-a' }` to a writeFixtures() dir, loadFixtures throws 'duplicate fixture id: fx-a'.

VERIFY (repo root; paste each command, its result line and exit code):
  node --check .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
  node -e "const m = require('./.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs'); const f = m.loadFixtures(m.DEFAULT_FIXTURES_DIR); console.log(f.total, f.withAllowlist, f.byId.has('t1-echo'))"   (expect: 21 0 true)
  grep -cE "API_KEY|TYPESAFE|Bearer|Authorization" .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs   (expect 0)
Accept when: 2 files created (S and T) and no other file changed; each check prints what it expects.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader
- Other workers edit other files in this tree at the same time. Touch only the files this brief names.
- The orchestrator runs the test suites, spec validation and every git commit after you return.
- Your sandbox may block test runners that open local sockets (tsx, vitest). Run only the checks listed here; the orchestrator runs the rest.

DON'T
- Edit, create or delete any file this brief does not name.
- Run a git command that writes (add, commit, stash, checkout, restore, reset, merge, rebase, push).
- Install anything (npm/pnpm/pip/brew install, npm ci) or touch node_modules.
- Open any .env file, print environment variables, or write a key or token into any file.
- Call jev, the local Deem server (127.0.0.1:8300) or any network service.
- Put spec paths, packet or phase numbers, or REQ/task ids in code comments.
- Reformat, reorder or "improve" anything outside the named edit.
- Ask a question. If a step cannot be done exactly as written, stop and report BLOCKED with the reason.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
