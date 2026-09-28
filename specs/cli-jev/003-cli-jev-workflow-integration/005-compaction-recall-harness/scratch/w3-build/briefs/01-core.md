GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness

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

TASK: create the census script S (CLI, streaming parser, boundary rows, printed report, JSON report, stop line) and its test file T with a harness and three cases.
R = specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build/briefs/ref/design.md (read only). S, T and F are named at the top of R. Read R sections 1 to 5 first: they are the exact contract, including every message text. Do not read other sections yet. F already holds six fixtures; never edit them.

S (new file), exactly per R sections 1 to 5:
1. Shebang, header, the nine numbered section dividers, imports. Sections 3, 4 and 5 hold only their divider for now.
2. Constants: KNOWN_TYPES, METHOD (the method line text), TRIGGERS, ENTRYPOINTS, DEFAULT_MAX_FILE_BYTES = 1073741824.
3. Exports with JSDoc: parseCliArgs(argv) returning { ok: true, options } or { ok: false, message } for R section 2 checks 1 to 6;
   listTranscriptFiles(paths) returning [{ path, name, subagent, size }] per R section 3 bullet 1; splitLines(file, byteLimit);
   parseTranscript(file, { byteLimit }) returning { rows, error, boundariesSeen, partialTail } per R section 3;
   stopLine(rows, totals) per R section 5; formatRow(row) per R section 4; main(argv) returning the exit code.
4. main: on a failed parseCliArgs print the message to stderr and return 2. Otherwise read every discovered file: oversized goes to
   skippedOversized unread; an error prints `parse error: <basename>:<line>: <message>` to stderr and goes to stoppedSessions as
   { file, line, code }; other rows are kept in file order. Totals keys (report.totals uses these same names): compactions,
   sessions_read, sessions_stopped, sessions_skipped_oversized, partial_tails (count of files with partialTail). Print the stdout
   lines of R section 4, write the JSON report, return 1 when any session stopped, else 0.

T (new file, TypeScript for vitest): header `// ` + 67 x `─`, `// MODULE: Compaction Recall Census Tests`, the same divider,
then `// Synthetic fixtures only; every census run has stub jev and cli-deem binaries first on PATH.`
Imports from node:child_process (spawnSync), node:fs, node:os, node:path, node:url and vitest (describe, expect, it). Helpers:
- SCRIPT = resolve(HERE, '../scripts/compaction-recall/score-compaction-recall.mjs'), FIXTURES = resolve(HERE, 'compaction-recall-fixtures'),
  HERE = dirname(fileURLToPath(import.meta.url)); fixture(name) = join(FIXTURES, `${name}.jsonl`).
- makeStubs(): mkdtempSync(join(tmpdir(), 'compaction-recall-stub-')); writes executable (mode 0o755) files `jev` and `cli-deem`,
  each `#!/bin/sh\necho "$*" >> "$(dirname "$0")/<name>.log"\nexit 0\n`; returns the dir.
- runCensus(args: string[], stubDir = makeStubs()): out = join(mkdtempSync(join(tmpdir(), 'compaction-recall-out-')), 'report.json');
  spawnSync(process.execPath, [SCRIPT, ...args, '--out', out], { encoding: 'utf8', timeout: 60_000, env: { ...process.env,
  PATH: `${stubDir}${delimiter}${process.env.PATH}` } }); returns { code: status, stdout, stderr, lines: stdout.trimEnd().split('\n'),
  report: existsSync(out) ? JSON.parse(readFileSync(out, 'utf8')) : null, stubDir }.
describe('score-compaction-recall') with exactly these three cases:
 a. 'an unknown type exits 1 with a named error': runCensus(['--transcripts', fixture('unknown-type')]): code 1; stderr contains
    'parse error: unknown-type.jsonl:3: unknown type brand-new-type'; report.totals.sessions_stopped 1; report.stoppedSessions equals
    [{ file: 'unknown-type.jsonl', line: 3, code: 'unknown_type' }]; last line 'stop: census void (unknown shape in 1 of 1 sessions)'.
 b. 'a malformed line exits 1 with a named error': the same with 'malformed-line': 'parse error: malformed-line.jsonl:2: not JSON',
    [{ file: 'malformed-line.jsonl', line: 2, code: 'not_json' }], the same last line.
 c. 'an empty directory exits 0 with compactions=0': an empty mkdtemp dir: code 0; lines[0] is the method line of R section 4;
    lines[1] 'scope: 0 main-session files, 0 subagent files, 0 boundaries (0 main, 0 subagent)'; some line starts with
    'totals: compactions=0 '; last line 'stop: no boundaries'; report.rows has length 0.

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs
and: node .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs --transcripts .skilled/skills/system-spec-kit/runtime/tests/compaction-recall-fixtures/clean.jsonl --out /tmp/crc-smoke/report.json; echo "exit=$?"
(expect a `row clean.jsonl line=5 ...` line, a totals line, a `stop:` last line and exit=0).
Accept when: 2 files created (S and T) and nothing else changed; node --check exits 0; the smoke run exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness
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
- Read ~/.claude, ~/.pi or any transcript or session file. Build and test against the synthetic fixtures only.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
