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

TASK: add the off-by-default `--replay` path to S for boundaries with no recorded brief, and pin it with one case in T.
R = specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build/briefs/ref/design.md (read only).
S, T and F are named at the top of R. Read S, T and R section 9 first. Never edit F. Do not open or edit any file under
.skilled/skills/system-spec-kit/runtime/dist/ or runtime/hooks/: the script only imports the built module at run time.

In S:
1. main: under `--replay` only, before any transcript is read, load the builder exactly per R section 9 bullet 1 (dynamic
   import of the built compact-inject module, the `replay unavailable: build the runtime dist first` refusal with exit 2, and
   REPLAY_VERSION from the module file's mtime). Without `--replay` nothing is imported and nothing changes.
2. parseTranscript takes a `replay` option (the loaded builder, or null). With it, keep the raw text of the last 50 non-empty
   lines read before each boundary line on that boundary's internal record. A boundary whose brief is absent calls
   `await replay(lines)` and uses the returned `.text` as its brief text per R section 9 bullet 2. A recorded brief is never
   replayed. The replayed text feeds the rules exactly as a recorded brief text does and never enters the row.
3. Row field replayVersion (REPLAY_VERSION on replayed rows, else null) after violations; row line appends
   ` replay_version=<n or n/a>`; totals add briefs_replayed after violations. briefs_absent counts only rows left 'absent'.

In T, add one case after the current ones: 'a boundary without a recorded brief takes the replay path with replay_version'.
 First runCensus(['--transcripts', fixture('no-brief')]): code 0; rows[0].briefStatus 'absent'; rows[0].briefWindowStatus
 'hook_cancelled'; rows[0].briefRecall null; rows[0].replayVersion null.
 Then runCensus(['--transcripts', fixture('no-brief'), '--replay']): code 0; rows[0].briefStatus 'replayed';
 rows[0].briefWindowStatus 'hook_cancelled'; Number.isInteger(rows[0].replayVersion) and > 0; rows[0].briefChars > 0;
 rows[0].briefMarker null; report.totals.briefs_replayed 1; report.totals.briefs_absent 0; the row line contains ' replay_version='
 followed by that integer.

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs
and: grep -c 'child_process' .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs (expect 0)
Accept when: 2 files changed (S and T) and nothing else; node --check exits 0; the grep prints 0; T holds exactly 10 `it(` cases.

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
