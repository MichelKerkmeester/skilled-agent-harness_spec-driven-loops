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

STEP 1: the canonical criteria parser also returns every citation it counts, as a fifth tab field (the covered count must not move)
Files: R = .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh, T = .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh
Line numbers are those of the file before this brief. Apply the R edits bottom-up (f, e, d, c, b, a) so each stays valid.
R a. Line 280, old `    #   Prints a tab-separated row: rows, covered, malformed, malformed-ids` becomes these 2 lines:
    #   Prints a tab-separated row: rows, covered, malformed, malformed-ids, cited.
    #   An empty list is written as "-", since read with a tab IFS merges empty fields.
R b. Directly below line 291 (`        function has_file_line(v) { ... }`), insert exactly:
        # Each accepted citation as "ID (path:line)". A trailing boundary character can open the next one, so it stays.
        function cited_in(v, id,   rest, m, out) {
            out = ""; rest = v
            while (match(rest, /(^|[[:space:](`])[^[:space:]|()`:]*[.\/][^[:space:]|()`:]*:[0-9]+([[:space:]).,;`]|$)/)) {
                m = substr(rest, RSTART, RLENGTH)
                if (m ~ /[0-9]$/) rest = ""
                else { rest = substr(rest, RSTART + RLENGTH - 1); m = substr(m, 1, length(m) - 1) }
                sub(/^[[:space:](`]/, "", m)
                out = out (out == "" ? "" : ", ") id " (" m ")"
            }
            return out
        }
R c. Directly above line 327 (`            if (has_file_line(evidence)) { covered++; next }`, which stays byte-identical), insert:
            if (has_file_line(evidence)) cited = cited (cited == "" ? "" : ", ") cited_in(evidence, toupper(id))
R d. Line 336 only (line 382 has the same text and stays byte-identical): old `        END { printf "%d\t%d\t%d\t%s\n", rows, covered, malformed, malformed_ids }`, new:
        END { printf "%d\t%d\t%d\t%s\t%s\n", rows, covered, malformed, (malformed_ids == "" ? "-" : malformed_ids), (cited == "" ? "-" : cited) }
R e. Line 410, old `    local analysis rows covered malformed malformed_ids total`, new `    local analysis rows covered malformed malformed_ids cited total`
R f. Line 430, old `    IFS=$'\t' read -r rows covered malformed malformed_ids <<< "$analysis"` becomes these 3 lines:
    IFS=$'\t' read -r rows covered malformed malformed_ids cited <<< "$analysis"
    if [[ "$malformed_ids" == "-" ]]; then malformed_ids=""; fi
    if [[ "$cited" == "-" ]]; then cited=""; fi
T. Above line 193 (the `echo` right before the final `printf '  %d passed, %d failed\n'`), add helper expect_analysis NAME WANT FILE
   modelled on expect_source (line 47): in a `set +e` subshell source the rule, run `_ac_analyze_canonical "$FILE"`, compare the
   whole output with WANT, print the same ok/FAIL row with tabs shown as `|`. Then 2 cases, fixtures made with mkpacket and ac
   as at lines 67-70, FILE "$d/acceptance-criteria.md":
   1. "the parser lists every citation of a counted row": AC-001 Verification `` `a.sh:1` and `gone.sh:2` `` Met, AC-002
      Verification `checked by hand` Met. WANT $'2\t1\t1\tAC-002\tAC-001 (a.sh:1), AC-001 (gone.sh:2)'
   2. "empty id and citation lists are written as -": one row AC-001, Verification `-`, Status Superseded, Waiver ADR-007. WANT $'1\t1\t0\t-\t-'
Accept when: 2 files changed. R: edits a-f only; no line holding `covered++` changes; line 382 unchanged. T: 1 helper + 2 cases, the 25 existing calls unedited.

VERIFY (paste each command with its result line and exit code; the orchestrator runs the suite)
  bash -n .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh && bash -n .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh   # exit 0
  grep -c 'cited_in' .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh   # 2
  grep -c 'malformed_ids cited' .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh   # 2
  grep -c '^expect_analysis ' .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh   # 2

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
