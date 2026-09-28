GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow

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

TASK: create the Pi goal-verifier census and its test. Two new files. Node builtins only. No em dash anywhere.
Layout: box header with COMPONENT and PURPOSE lines as in .skilled/hooks/goal/lib/goal-core.test.cjs:1-9, then numbered section dividers as in .skilled/hooks/goal/lib/goal-core.cjs:9-37.

FILE 1 .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs (ES module, CLI only, exports nothing).
- Usage: node count-pi-goal-nudges.mjs --dir <path>. No --dir: stderr "error: MISSING_DIR --dir <path> is required", exit 2. Not a directory: stderr "error: DIR_NOT_FOUND <path>", exit 2.
- Walk <path> recursively, keep files ending .jsonl, sort their posix paths relative to <path> with the default string sort. Read each whole (utf8), split on "\n", skip lines empty after trim, count lines from 1.
- JSON.parse fails: stderr "error: MALFORMED_RECORD file=<rel> line=<n>", exit 1, empty stdout.
- record.type outside this set: stderr "error: UNKNOWN_RECORD_TYPE type=<first 40 chars of String(type)> file=<rel> line=<n>", exit 1, empty stdout.
  Set: session message thinking_level_change model_change usage compaction branch_summary custom custom_message context_edit label session_info
- Nudge: type "custom_message" and customType "goal-verify-nudge". Content is a string, or an array whose {type:"text"} items' text joins with "\n".
  Match /^\[goal_verify\] verdict=([^;]*); reason=([\s\S]*)$/. Verdict "not-met" or "unclear" counts under that name, anything else or no match under other_verdict.
  Reason category: "Evidence is too short to prove completion" too_short, "Evidence includes blocking or incomplete-work language" blocking, "Evidence appears truncated before it proves completion" truncated, "Evidence lacks an explicit completion signal" no_completion, "Evidence does not reference the goal objective specifically enough" weak_link, anything else other.
  Date: first 10 chars of record.timestamp when they match /^\d{4}-\d{2}-\d{2}$/, else no date.
- Compute everything first, then print exactly these stdout lines (never any content or message text), exit 0:
  method: unit=one custom_message record with customType goal-verify-nudge, files_scanned=<count of .jsonl files>, window=<first>..<last> from the record timestamp field
  session: file=<rel> nudges=<n> not-met=<n> unclear=<n> other_verdict=<n> met=not_recorded too_short=<n> blocking=<n> truncated=<n> no_completion=<n> weak_link=<n> other=<n> first=<date> last=<date>
  totals: sessions_with_nudges=<n> nudges=<n> not-met=<n> unclear=<n> other_verdict=<n> met=not_recorded too_short=<n> blocking=<n> truncated=<n> no_completion=<n> weak_link=<n> other=<n> first=<date> last=<date>
  One session line per file with at least one nudge, in sorted order. first/last are the earliest/latest nudge dates, "none" when there is none.

FILE 2 .skilled/hooks/goal/lib/count-pi-goal-nudges.test.mjs (node:test, node:assert/strict). Run the census with spawnSync(process.execPath, [CENSUS, '--dir', dir], { encoding: 'utf8' }). Fixtures are JSONL written by the test into mkdtempSync(join(tmpdir(), 'pi-census-')) dirs, removed in finally.
A nudge line looks like {"type":"custom_message","customType":"goal-verify-nudge","content":"[goal_verify] verdict=unclear; reason=Evidence is too short to prove completion","display":false,"id":"n1","parentId":null,"timestamp":"2026-08-01T10:00:00.000Z"}.
Fixture A: <dir>/proj/s1.jsonl = header {"type":"session","version":3,"id":"s1","timestamp":"2026-08-01T09:00:00.000Z","cwd":"/tmp"}, a {"type":"message",...,"message":{"role":"assistant","content":[{"type":"text","text":"PLANTED-MESSAGE-TEXT-7f3a"}]}} record, a {"type":"custom","customType":"other"} record, then five nudges dated 2026-08-01..2026-08-05, one per reason in the order above, verdict "not-met" for blocking and "unclear" for the rest. <dir>/proj/sub/s2.jsonl = one nudge, truncated reason, verdict "unclear", dated 2026-08-06.
Test 1, Fixture A: exit 0. Line 1 starts "method: unit=one custom_message record with customType goal-verify-nudge," and contains "files_scanned=2" and "window=2026-08-01..2026-08-06". Stdout has these exact lines:
  session: file=proj/s1.jsonl nudges=5 not-met=1 unclear=4 other_verdict=0 met=not_recorded too_short=1 blocking=1 truncated=1 no_completion=1 weak_link=1 other=0 first=2026-08-01 last=2026-08-05
  totals: sessions_with_nudges=2 nudges=6 not-met=1 unclear=5 other_verdict=0 met=not_recorded too_short=1 blocking=1 truncated=2 no_completion=1 weak_link=1 other=0 first=2026-08-01 last=2026-08-06
Test 2: a dir whose one file holds {"type":"mystery","id":"x","parentId":null,"timestamp":"2026-08-01T00:00:00.000Z"}: status is not 0, stderr contains "UNKNOWN_RECORD_TYPE", stdout is "".
Test 3, Fixture A: stdout plus stderr contain none of "PLANTED-MESSAGE-TEXT-7f3a", "[goal_verify]", "Evidence".

Accept when: 2 files changed, both new, and the checks below pass.
CHECKS (run exactly these; do not run node --test):
  node --check .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs
  node --check .skilled/hooks/goal/lib/count-pi-goal-nudges.test.mjs
  grep -c "UNKNOWN_RECORD_TYPE" .skilled/hooks/goal/lib/count-pi-goal-nudges.mjs     (expect 1 or more)

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/003-goal-verifier-jev-shadow
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
- Read ~/.pi, ~/.claude or any session or transcript file. The tests build their own fixtures.

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
