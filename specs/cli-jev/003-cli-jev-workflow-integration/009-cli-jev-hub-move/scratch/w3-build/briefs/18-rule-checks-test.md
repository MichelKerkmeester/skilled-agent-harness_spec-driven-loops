GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move

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

TASK: one test-scope change in `.skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs` (test file only).
Context: the Jev transport is now the `cli-usage` packet of the `cli-classifier` hub; the folder
`.skilled/skills/cli-jev/` is gone, so this test's scan root no longer exists. The classifier hub also
holds `cli-deem`, a local client with no dispatch shape and no hard rules: the preflight never inspects
its commands, so the scan must take from that hub only the packets a dispatch shape governs.
1. Lines 12-15. Old (exact, 4 lines):
// The Jev transport left that hub for one of its own. A scan of a single root reads its
// eight checks as implemented-but-undeclared, so every cli-* packet in either hub is scanned.
const CLI_JE = path.resolve(HERE, '../../../skills/cli-jev');
const PACKET_ROOTS = [CLI_ORCHESTRATION, CLI_JE];
   New (exact, 7 lines):
// The Jev transport is a mode of the classifier hub. A scan of a single root reads its
// eight checks as implemented-but-undeclared, so that hub is scanned too, but only for the
// packets a dispatch shape governs: its Deem client has no shape, so no preflight reads it.
const CLI_CLASSIFIER = path.resolve(HERE, '../../../skills/cli-classifier');
const PACKET_ROOTS = [CLI_ORCHESTRATION, CLI_CLASSIFIER];
const GOVERNED = new Set(DISPATCH_SHAPES.map((shape) => shape.packetPath));
const scanned = (root, name) => root === CLI_ORCHESTRATION || GOVERNED.has(`cli-classifier/${name}`);
2. Old line 19: `      .filter((entry) => entry.isDirectory() && entry.name.startsWith('cli-'))`
   New: `      .filter((entry) => entry.isDirectory() && entry.name.startsWith('cli-') && scanned(root, entry.name))`
3. Old line 464: `    assert.equal(resolveDispatchPacket(cmd)?.skill, 'cli-jev', `should govern (${label}): ${cmd}`);`
   New: same line with `'cli-jev'` replaced by `'cli-classifier'`.
4. Old line 469: `    ['grep for the text', 'grep -rn "jev noul" .skilled/skills/cli-jev/cli-usage'],`
   New: `    ['grep for the text', 'grep -rn "jev noul" .skilled/skills/cli-classifier/cli-usage'],`
Change nothing else.
Checks (report result line and exit code):
  node --check .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs   (expect exit 0)
  grep -c "cli-jev\|CLI_JE\b" .skilled/hooks/dispatch/lib/dispatch-rule-checks.test.mjs   (expect 0)
Do not run the test; the orchestrator runs it.
Accept when: 1 file changed, +10/-7 lines. No other file differs.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/009-cli-jev-hub-move
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

HANDBACK (print exactly this block, filled in, as your last output)
STATUS: DONE | BLOCKED
FILES CHANGED: one line per file: <path> (+<added>/-<removed>)
EDITS: one line per step: <file>:<line> <what changed>
CHECKS: one line per check: <command> -> <result line> (exit <n>)
BLOCKED REASON: <one line, or none>
