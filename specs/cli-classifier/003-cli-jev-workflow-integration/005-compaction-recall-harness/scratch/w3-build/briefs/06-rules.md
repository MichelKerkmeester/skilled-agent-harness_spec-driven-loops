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

TASK: add the five must-survive rules and the recall columns to S, and pin them with two cases in T.
R = specs/cli-jev/003-cli-jev-workflow-integration/005-compaction-recall-harness/scratch/w3-build/briefs/ref/design.md (read only).
S, T and F are named at the top of R. Read S, T and R section 8 first. Never edit F.

In S:
1. Section 5 (MUST-SURVIVE RULES): export identifiers(text) and stringLeaves(value) exactly per R section 8 bullet 1, plus
   pure helpers for rules 2, 3 and 4 item extraction and a keptCount(items, keeperText, mode) helper.
2. parseTranscript: at each boundary capture, from the segment Messages, the pre-segment identifier Set, the rule 2 basenames,
   the rule 3 item and the rule 4 items (from the last user instruction, tracked across the whole file and not reset at a
   boundary). After a boundary, add identifiers of later `assistant` records (text blocks and tool_use input string leaves)
   to that boundary's post Set until the next boundary or the end of the file. Collect every record `uuid` in the file.
3. At the end of the file, for each boundary, score rules 1 to 4 against the summary text and the brief text kept by the
   previous step, and rule 5 against the collected uuids; add the row fields of R section 8 bullet 7 in that order, then drop
   every text and Set. Only counts, 'uncheckable', 'ok', 'fail', 'absent', numbers and null reach the row.
4. Row line: append ` r1=.. r2=.. r3=.. r4=.. r5=<r5> summary_recall=.. brief_recall=.. violations=<n>` per R section 8 after
   brief_chars. Totals: add summary_recall_avg, brief_recall_avg (numbers rounded to 2 places in report.totals, null when none),
   uncheckable and violations after markers.

In T, add two cases after the current ones:
 a. 'a missing written file gives 1 violation': runCensus(['--transcripts', fixture('missing-written-file')]): code 0; one row
    with r2Found 1, r2Summary 0, r2Brief 0, r1Found 1, r1Summary 1, r3Found 1, r3Summary 1, r4Found 1, r4Summary 1,
    uncheckable 0, r5 'ok', violations 1; its row line contains ' r2=1/0/0 ' and ' violations=1'.
 b. 'a clean session with a raw U+2028 in a text field gives 0 violations': readFileSync(fixture('clean'), 'utf8') includes
    '\u2028'; runCensus(['--transcripts', fixture('clean')]): code 0; report.totals.sessions_stopped 0; one row with r1 1/1/1,
    r2 1/1/1, r3 1/1/1 (Found/Summary/Brief), r4Found 2, r4Summary 2, r4Brief 2, uncheckable 0, r5 'ok', summaryRecall 1,
    briefRecall 1, violations 0.

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/scripts/compaction-recall/score-compaction-recall.mjs
Accept when: 2 files changed (S and T) and nothing else; node --check exits 0; T holds exactly 9 `it(` cases.

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
