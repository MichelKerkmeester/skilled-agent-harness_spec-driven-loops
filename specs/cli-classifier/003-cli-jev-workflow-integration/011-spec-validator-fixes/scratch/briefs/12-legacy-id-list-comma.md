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

You are a code editor in one repository. Do exactly the steps below, nothing more.

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

STEP 1: keep a legacy multi-id cell as one list entry
Scope: .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh, the legacy traceability parser (near line 397). Literal old line:
```text
                cited = cited (cited == "" ? "" : ", ") cited_in(evidence, ac_id)
```
Literal new text (three lines, same indentation):
```text
                # ", " separates list entries, so an id cell naming several ids keeps a bare comma.
                list_id = ac_id; gsub(/,[[:space:]]*/, ",", list_id)
                cited = cited (cited == "" ? "" : ", ") cited_in(evidence, list_id)
```
Why: an id cell `AC-001, AC-002` was split on its own comma and reported a bogus `AC-001` as unresolved.

STEP 2: pin it with one case
Scope: .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh. Insert these lines directly above the final `echo` line (the one before `printf '  %d passed, %d failed\n'`):
```text
d="$TMP/legacy-ids"; mkpacket "$d"; printf 'one\n' > "$d/a.sh"
printf '%s\n' '# Tasks' '<!-- ANCHOR:protocol -->' '| AC-ID | Class | Evidence |' '|-------|-------|----------|' \
    '| AC-001, AC-002 | tested | a.sh:1 |' '| AC-003 | tested | gone.sh:4 |' '<!-- /ANCHOR:summary -->' > "$d/tasks.md"
expect_detail "a legacy row naming two ids reports only real misses" "Unresolved evidence citation(s): AC-003 (gone.sh:4)" "$d"

```
Accept when: 2 files changed; .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh changes 1 line into 3, .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh gains 4 lines; the suite prints 44 passed, 0 failed.

VERIFY (paste each command with its result line and exit code)
  bash -n .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh    # exit 0
  bash -n .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh    # exit 0
  bash .skilled/skills/system-spec-kit/runtime/cli/tests/check-ac-coverage.sh 2>&1 | tail -1    # expect: 44 passed, 0 failed
  git diff -U0 -- .skilled/skills/system-spec-kit/runtime/cli/rules/check-ac-coverage.sh | grep -cE '^[-+].*covered\+\+'    # expect 0

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
