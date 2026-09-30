GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/014-sk-design-doc-and-routing-check

Proceed directly to the work. Do not print A/B/C/D options. Do not stop to confirm anything.
Your task is complete only when files exist on disk and the verification command has been run.

=== BEGIN AGENT PERSONA (resolved runtime path: .claude/agents/markdown.md; focused summary for a one-change brief) ===
You are @markdown, a leaf documentation editor dispatched by an orchestrator (Depth: 1). Never dispatch another agent.
Scope: edit only the files this brief names. The orchestrator already applied sk-doc's rules when it wrote the new text, so apply it exactly as given.
Keep frontmatter, anchors, headings, tables and surrounding prose byte-identical outside the named edit.
Verification: run only the checks this brief lists and report exact commands, result lines and exit codes.
Output: end with the HANDBACK block, STATUS DONE or BLOCKED.
=== END AGENT PERSONA (resolved persona: markdown) ===

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

STEP 1: Rewrite rule 6 of the sk-design hub so it names the compiled front door
Scope: 1 file, .skilled/skills/sk-design/SKILL.md. Read it before editing. Rule 6 is the last
item of section 5 and the last two lines of the file (lines 202 and 203).
Replace these two lines (OLD, literal, both lines in full):
OLD line 202: 6. Never quote a compiled routing decision for this hub. It is not in the compiled closure, and the
OLD line 203:    call returns a legacy sentinel rather than a route.
With these four lines (NEW, literal, three spaces of indent on lines 2 to 4, as rule 5 uses):
NEW line 1: 6. Take the mode from the compiled front door,
NEW line 2:    `node .skilled/bin/compiled-route.cjs --hub sk-design --prompt "<task>"`, as the section 2
NEW line 3:    callout says. On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing in
NEW line 4:    section 2 instead.
The literal text of each line is everything after "OLD line N: " or "NEW line N: ". The file
keeps its single trailing newline. Change nothing else, rules 1 to 5 included.
Accept when: 1 file changed, 2 lines removed and 4 lines added, all at the end of section 5.

VERIFY (paste each command with its result line and exit code)
  grep -c "not in the compiled closure" .skilled/skills/sk-design/SKILL.md    # expect 0
  grep -n "compiled-route.cjs --hub sk-design" .skilled/skills/sk-design/SKILL.md    # expect 2 hits: the callout near line 50 and the new line 203
  grep -c 'servingAuthority":"legacy"' .skilled/skills/sk-design/SKILL.md    # expect 2
  git diff --numstat -- .skilled/skills/sk-design/SKILL.md    # expect 4 added, 2 removed

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
