GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes

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

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/011-spec-validator-fixes
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

STEP 1: add a resolver that keeps only the cited file:line entries that do not resolve (nothing calls it yet)
Files: R = .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh, T = .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh
R. Directly above the line `run_check() {` (line 386 before this phase, about 400 after the cited-field change), add three functions. Use bash
   builtins only: no awk, sed, wc, cat or other process. BSD awk aborts with "i/o error" when getline reads a directory, and a
   process per citation is slow. Say that in one comment line above the three. Must run on bash 3.2 (no mapfile) under set -euo pipefail.
   1. `_ac_file_has_line PATH LINE`: return 0 only when PATH is a regular readable file (`[[ -f && -r ]]`), LINE read base 10
      (`$((10#$LINE))`, so `08` is 8) is at least 1, and the file holds at least LINE lines. Count with
      `while IFS= read -r _line || [[ -n "$_line" ]]` so a last line without a newline counts, and return 0 as soon as the count
      reaches LINE. Otherwise return 1. Declare every variable local.
   2. `_ac_citation_resolves FOLDER ROOT CITE`: CITE is `path:line`, split at the last colon (`${CITE%:*}`, `${CITE##*:}`).
      An absolute path (starts with `/`) is checked as written and nothing else. Else, when FOLDER/path is a regular readable
      file, it alone decides. Else, when ROOT is not empty, ROOT/path decides. Else return 1.
   3. `_ac_unresolved_citations FOLDER ROOT LIST`: LIST is `ID (path:line)` entries joined by `, `, or empty. Print with no
      trailing newline the entries whose citation does not resolve, unchanged, in input order, joined by `, `. Print nothing
      when none. Always return 0. Split with `${rest%%, *}` and `${rest#*, }`; the citation is the text after the last ` (`
      with the closing `)` removed.
T. Above the `echo` right before the final `printf '  %d passed, %d failed\n'`, add helper expect_unresolved NAME WANT FOLDER ROOT LIST
   modelled on expect_source (line 47): in a `set +e` subshell source the rule, run `_ac_unresolved_citations "$FOLDER" "$ROOT" "$LIST"`,
   print `none` for empty output, compare with WANT, same ok/FAIL row. Fixture, then 5 cases (ROOT is "" unless named):
   d="$TMP/resolve"; mkdir -p "$d/sub" "$TMP/rootdir/tools"; printf 'one\ntwo\nthree' > "$d/sub/a.sh"; printf 'one\n' > "$TMP/rootdir/tools/r.sh"
   1. "a citation inside the file resolves": LIST "AC-001 (sub/a.sh:3), AC-002 ($d/sub/a.sh:1)" -> none
   2. "a missing file and line 0 or past the end do not": LIST "AC-001 (nope.sh:1), AC-002 (sub/a.sh:0), AC-003 (sub/a.sh:4)" -> that same string
   3. "a directory and an ellipsis path do not resolve": LIST "AC-001 (./sub:1), AC-002 (.../a.sh:1)" -> that same string
   4. "the root is tried after the packet folder": ROOT "$TMP/rootdir", LIST "AC-001 (tools/r.sh:1)" -> none
   5. "an empty list reports nothing": LIST "" -> none
Accept when: 2 files changed. R gains the three functions and one comment line, nothing else. T gains 1 helper + 5 cases.

VERIFY (paste each command with its result line and exit code; the orchestrator runs the suite)
  bash -n .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh && bash -n .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh   # exit 0
  grep -cE '^_ac_(file_has_line|citation_resolves|unresolved_citations)\(\) \{' .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh   # 3
  grep -c '^expect_unresolved ' .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh   # 5

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
