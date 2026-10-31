GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge

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

TASK: create the census slice of a new read-only measurement script and its test file.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (new)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (new)
Read first, nothing more: the reply-harness `README.md` and `blind.mjs` (the masked file shape is blind.mjs:66), and `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` lines 1-62 for the header, divider and JSDoc style to copy. Node standard library only, ESM, single quotes, semicolons, a JSDoc block on every export.

STEP 1. Create S.
a. Line 1 `#!/usr/bin/env node`, then the header shape of score-track-narrowing.mjs:2-16 with `MODULE: Reply Judge Agreement` and this comment text: "Measures offline whether a Jev or Deem score per rubric dimension agrees with the operator's grades of masked replies more often than the mechanical scores of score.mjs. The default run makes no model call and writes no file. The script holds and reads no credential." Then `Usage: node judge-agreement.mjs --masked <dir>... --replies <dir>... [--labels <file>] [--jev] [--deem] [--out <dir>] [--accept-payload]` and `Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad invocation or unreadable input, refused before any call.`
b. Imports: `spawn, spawnSync` from node:child_process, `createHash` from node:crypto, default `fs`, `os`, `path`, `process`, `fileURLToPath` from node:url, `parseArgs` from node:util.
c. Section `1. CONSTANTS` (divider style of score-track-narrowing.mjs:32-34): `SCRIPT_DIR` (not exported) = directory of this file; exported `REPO_ROOT = path.resolve(SCRIPT_DIR, '..', '..', '..', '..', '..')`, `SCORE_SCRIPT = path.join(SCRIPT_DIR, 'score.mjs')`, `RUBRIC_PATH = path.join(SCRIPT_DIR, 'rubric.json')`, `LEVELS = Object.freeze(['absent', 'partly met', 'fully met'])`, `LABEL_GATE = 20`.
d. Section `2. CENSUS`, four exports:
 - `sha256Hex(text)`: lowercase hex SHA-256 of the UTF-8 text.
 - `readMaskedReply(text)`: take the first match of `/^Reply [AB]:[ \t]*\r?$/m`, return `text.slice(match.index + match[0].length).trim()`, or `null` when nothing matches.
 - `listMarkdown(dir)`: absolute paths of regular files ending `.md` directly in dir, no recursion, sorted by file name. Throw `new Error(\`not a directory: ${dir}\`)` when dir is missing or not a directory.
 - `buildCensus(maskedDirs, repliesDirs)` returns `{ maskedFiles, replyBySha, masked, distinct, matched, unmatched }`. `replyBySha` is a Map from `sha256Hex(fileText.trim())` to `{ file, caseId }` over `listMarkdown` of each replies dir in the order given, caseId being the file name without `.md`, first file seen for a SHA wins. `maskedFiles` is an array of `{ file, text, sha }` over `listMarkdown` of each masked dir in order: text is the whole file, sha is `sha256Hex(readMaskedReply(text))`, and a null reply throws `new Error(\`not a masked reply: ${file}\`)`. `masked` is the file count, `distinct` the unique SHAs, `matched` the unique SHAs found in `replyBySha`, `unmatched` is distinct minus matched.
e. Nothing runs at import. Add no other section.

STEP 2. Create T with `node:test` and `node:assert/strict`, importing from `./judge-agreement.mjs`.
a. Helper `makeFixture({ editOneAfterMasking = false } = {})`: root from `fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'))`. Replies dirs `r1`, `r2`, `r3`, each with `C1.md C2.md C3.md C4.md C5.md C6.md NC1.md` holding `` `Reply ${dirName} ${caseId}: the answer sits in \`src/${caseId}.ts\` and the run printed exit 0.\n` ``. Masked dir `m1` from r1 as label A and r2 as label B, masked dir `m2` from r2 as A and r3 as B, one file `${caseId}-${label}.md` per reply with content `` `Case: ${caseId}\n\nPrompt for ${caseId}\n\nReply ${label}:\n\n${replyText.trim()}\n` ``. When editOneAfterMasking, overwrite `r3/C1.md` with `'edited after masking\n'` after masking. Return `{ root, repliesDirs, maskedDirs }` as absolute paths. Every test removes its root with `fs.rmSync(root, { recursive: true, force: true })` in a `finally`.
b. Four tests, exactly:
 1. `readMaskedReply('Case: C1\n\nQ?\n\nReply B:\n\n  body text \n')` equals `'body text'`, and `readMaskedReply('no marker')` equals `null`.
 2. `buildCensus(maskedDirs, repliesDirs)` on `makeFixture()` gives masked 28, distinct 21, matched 21, unmatched 0.
 3. The same on `makeFixture({ editOneAfterMasking: true })` gives distinct 21, matched 20, unmatched 1.
 4. `listMarkdown` on a path that does not exist throws `/not a directory/`.

Accept when: 2 files created, no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 4.
Checks you run: `node --check S`, `node --check T`, `grep -c "^export function" S`. Do not run `node --test`: the orchestrator runs it.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge
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
