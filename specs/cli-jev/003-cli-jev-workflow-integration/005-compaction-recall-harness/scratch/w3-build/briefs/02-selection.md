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

TASK: add `--newest-compacted <n>` session selection to S and pin it with two cases in T.
R = specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build/briefs/ref/design.md (read only).
S, T and F are named at the top of R. Read S, T and R section 10 first (sections 2 to 5 if you need the context). Never edit F.

In S, section 7 (SESSION SELECTION):
1. Export listNewestCandidates(dirs) returning [{ path, name, size, mtimeMs }]: only files named `*.jsonl` directly in each
   directory (readdirSync with withFileTypes, no recursion), stat'ed once, ordered by mtimeMs descending, then name ascending.
2. Export async selectNewestCompacted(dirs, n, { maxFileBytes }) that walks those candidates per R section 10 and returns
   { selected: [{ name, subagent: false, result }], read, stopped: [...], skippedOversized: [...] } where result is the
   parseTranscript return value (called with byteLimit = the candidate's stat size) and stopped entries are { file, line, code }.
   It opens no candidate once n are selected.
3. In main: under `--newest-compacted`, refuse a named path that is not a directory with `--newest-compacted needs a directory`
   (stderr, exit 2, before reading), use selectNewestCompacted instead of the recursive discovery, print the selection line of
   R section 10 right after the scope line, set report.selection = { newest, read }, and make the scope line count only the
   selected files. Parse errors still print `parse error: ...` and count in sessions_stopped; sessions_read = read.
   Without the flag, behavior and output stay byte-identical to now and report.selection is null.

In T, add two cases inside the existing describe, after the current ones. Helper selectionDir(): mkdtemp dir holding
a-old.jsonl and b-new.jsonl (both copies of fixture('clean')), c-newest.jsonl (the first 4 lines of fixture('clean'), no boundary)
and sess/subagents/d.jsonl (a copy of fixture('clean')); set mtimes with utimesSync to 1000, 2000, 3000 and 4000 seconds
for a, b, c and d. Return the dir.
 a. '--newest-compacted 1 picks the newer compacted file and skips an uncompacted newer file and a subagent file':
    runCensus(['--transcripts', dir, '--newest-compacted', '1']): code 0; lines[1] 'scope: 1 main-session files, 0 subagent
    files, 1 boundaries (1 main, 0 subagent)'; lines[2] 'selection: newest 1 compacted main-session files by modification time,
    2 read'; report.rows has length 1 and rows[0].file 'b-new.jsonl'; report.selection equals { newest: 1, read: 2 }.
 b. '--newest-compacted 5 over two compacted files takes both': the same dir with '5': code 0; lines[2] 'selection: newest 2
    compacted main-session files by modification time, 3 read'; report.rows.map((r) => r.file) equals ['b-new.jsonl', 'a-old.jsonl'].

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs
Accept when: 2 files changed (S and T) and nothing else; node --check exits 0; T holds exactly 5 `it(` cases.

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
