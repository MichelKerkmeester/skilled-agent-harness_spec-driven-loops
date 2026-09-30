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

STEP 1: the legacy traceability parser returns its counted citations too, so run_check reports unresolved ones for legacy packets
Files: R = .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh, T = .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh
Prerequisite: run_check already reads a fifth `cited` field and has an `Unresolved evidence citation(s):` detail; T has expect_detail. Else stop BLOCKED.
All R edits are inside _ac_analyze_traceability (starts about line 354; its has_file_line has no backtick in its character class).
R a. Directly below its line `        function has_file_line(value) { ... }`, insert exactly:
        function cited_in(v, id,   rest, m, out) {
            out = ""; rest = v
            while (match(rest, /(^|[[:space:](])[^[:space:]|():]*[.\/][^[:space:]|():]*:[0-9]+([[:space:]).,;]|$)/)) {
                m = substr(rest, RSTART, RLENGTH)
                if (m ~ /[0-9]$/) rest = ""
                else { rest = substr(rest, RSTART + RLENGTH - 1); m = substr(m, 1, length(m) - 1) }
                sub(/^[[:space:](]/, "", m)
                out = out (out == "" ? "" : ", ") id " (" m ")"
            }
            return out
        }
R b. In the block `if ((class_l ~ /tested/ || class_l ~ /partial/) && has_file_line(evidence)) {`, insert directly above its `covered++`:
                cited = cited (cited == "" ? "" : ", ") cited_in(evidence, ac_id)
R c. Its END line, old `        END { printf "%d\t%d\t%d\t%s\n", rows, covered, malformed, malformed_ids }`, new:
        END { printf "%d\t%d\t%d\t%s\t%s\n", rows, covered, malformed, (malformed_ids == "" ? "-" : malformed_ids), (cited == "" ? "-" : cited) }
T. Above the `echo` right before the final `printf '  %d passed, %d failed\n'`, add 2 fixtures and 3 cases. Each fixture is
   mkpacket "$d"; printf 'one\ntwo\n' > "$d/a.sh"; and a tasks.md (no acceptance-criteria.md) written with printf '%s\n':
   '# Tasks' '<!-- ANCHOR:protocol -->' '| AC-ID | Class | Evidence |' '|-------|-------|----------|' <rows> '<!-- /ANCHOR:summary -->'
   1. d="$TMP/legacy", rows '| AC-001 | tested | a.sh:2 |' '| AC-002 | tested | missing-cite.sh:3 |'
      expect_detail "the legacy table names an unresolved citation" "Unresolved evidence citation(s): AC-002 (missing-cite.sh:3)" "$d"
      expect "the legacy ratio is unchanged" "2/2" "$d"
   2. d="$TMP/legacy-clean", row '| AC-001 | tested | a.sh:2 |'
      expect_detail "a resolving legacy citation adds no detail" "none" "$d"
Accept when: 2 files changed. R: a, b and c inside _ac_analyze_traceability only. T: 2 fixtures + 3 cases.

VERIFY (paste each command with its result line and exit code; the orchestrator runs the suite)
  bash -n .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh && bash -n .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh   # exit 0
  grep -c 'cited_in' .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh   # 4
  grep -c 'malformed_ids == "" ? "-"' .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh   # 2
  grep -c '^expect_detail ' .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh   # 5

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
