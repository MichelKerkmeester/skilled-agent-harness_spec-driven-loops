GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check

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

You are a mechanical editor in one repository. Do exactly the steps below, nothing more.
Repo root: /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration (all paths from there).

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check
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

STEP 1: Create the replay run script that routes each sk-design mode scenario once
Scope: 1 new file, .skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/raw/mode-routing-run.sh
(create the folders). Input, read only: specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/scratch/briefs/13-mode-scenarios.tsv,
a header row then 49 rows of id, gold_mode, source, separated by tabs. source is relative to
.skilled/skills/sk-design/. Each source file has exactly one line starting "- Real user request: "
followed by the prompt between backticks: the prompt is the text between those backticks.
The file starts with exactly these lines (literal, between the markers, markers excluded):
----BEGIN----
#!/usr/bin/env bash
# Replays the sk-design mode playbook scenarios through the compiled front door, one probe per
# scenario, each prompt copied verbatim from the scenario's "Real user request" bullet. The label
# holds the scenario id, the mode whose playbook holds it (its gold) and its source file.
# Routing only: no provider credential, no model call and no network.

set -uo pipefail

CR="node .skilled/bin/compiled-route.cjs --hub sk-design"

probe() {
  local label="$1" prompt="$2" out rc
  out=$($CR --prompt "$prompt" 2>&1)
  rc=$?
  printf '### %s\nPROMPT: %s\nRC: %s\nROUTE: %s\n\n' "$label" "$prompt" "$rc" "$out"
}

----END----
Then one line per TSV data row, in TSV order, 49 lines, each exactly:
  probe '<id> | <gold_mode> | <source>' '<prompt>'
Quoting: both arguments in single quotes. In the prompt write each ' as '\'' and change nothing
else (CAP-001, IMP-001 and GUIDED-014 hold an apostrophe, CMD-001 and CMD-002 double quotes).
Nothing follows the last probe line, "node" appears only on the CR line, and you do not run it.
Accept when: 1 file created, 0 files changed, bash -n passes, 49 probe lines.

VERIFY (paste each command with its result line and exit code)
  bash -n .skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/raw/mode-routing-run.sh    # expect exit 0, no output
  grep -c '^probe ' .skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/raw/mode-routing-run.sh    # expect 49
  grep -oE 'node [^ ]+' .skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/raw/mode-routing-run.sh | sort -u    # expect only: node .skilled/bin/compiled-route.cjs
  bash -c 'probe(){ printf "%s\t%s\n" "$1" "$2"; }; eval "$(grep "^probe " .skilled/skills/sk-design/benchmark/reports/2026-09-27--manual-testing-playbook--hub-routing-replay/raw/mode-routing-run.sh)"' | diff - <(tail -n +2 specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check/scratch/briefs/13-mode-scenarios.tsv | while IFS=$'\t' read -r id g s; do printf '%s | %s | %s\t%s\n' "$id" "$g" "$s" "$(grep -m1 '^- Real user request: ' ".skilled/skills/sk-design/$s" | sed -E 's/^- Real user request: `(.*)`$/\1/')"; done) && echo IDENTICAL    # expect IDENTICAL

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
