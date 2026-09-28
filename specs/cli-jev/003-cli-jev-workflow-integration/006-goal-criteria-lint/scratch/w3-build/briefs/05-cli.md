GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint

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

TASK: give the goal-criteria lint its command line: a text report, --json, --all, one packet, --root, and exit 0 on every input. Pin it with two tests.
G = .skilled/skills/sk-doc/sk-create-goal/scripts. Edit only G/lint-goal-criteria.cjs and G/tests/lint-goal-criteria.test.cjs. Read both first, and G/check-goal.cjs:557-586 and :695-741 (the argument parser and entry point this one mirrors).

EDIT 1, G/lint-goal-criteria.cjs section 3 HELPERS, add `getDefaultWorkspaceRoot()` returning path.resolve(__dirname, '../../../../../'), as check-goal.cjs does.

EDIT 2, section 4 CORE LOGIC, after lintPacket, three functions with JSDoc blocks:
- `formatLintReport(result)` returns an array of lines, in this order: one `<key>=<value>` line per summary key in its key order; `no_input <path>` for each file with noInput; `criteria_count <path> <n>` for each file whose criteria count is above 0 and outside 3 to 7; `rule4 <id>: <rule4 spans joined by ' | '>` for each record with a rule4 span; then `rule5 <id>: <spans joined by ' | '>` for each record with a rule5 span.
- `parseLintArguments(argv)` returns { root: null, scanAll: false, json: false, packetArg: null } filled from `--all`, `--json`, `--root <path>` (path.resolve it) and one positional packet. Throw Error('--root requires a path'), Error('unknown option: ' + arg) for any other dash argument, Error('only one packet directory may be linted at a time') and Error('--all cannot be combined with a packet directory').
- `main(argv)`: parse; on a thrown error print TAG + ' ERROR ' + message to stderr and return 0. root = options.root || getDefaultWorkspaceRoot(). result = options.packetArg === null ? lintWorkspace(root) : lintPacket(options.packetArg, root). With json print JSON.stringify(result, null, 2), otherwise print each formatLintReport line, to stdout. Then print TAG + ' ERROR ' + e.path + ': ' + e.message to stderr for each result error. Return 0.
Add formatLintReport, parseLintArguments and main to the exports.

EDIT 3, after the EXPORTS section, a direct-run guard with this comment above it:
// The lint is advisory: no input, finding or failure changes the exit code.
if (require.main === module) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    console.error(TAG + ' ERROR ' + (error instanceof Error ? error.message : String(error)));
  }
  process.exitCode = 0;
}

EDIT 4, G/tests/lint-goal-criteria.test.cjs: require spawnSync from node:child_process and let LINT = path.join(__dirname, '..', 'lint-goal-criteria.cjs'). Append two tests, each spawning process.execPath with { encoding: 'utf8' }:
  1. 'the command line exits 0 and names a missing packet or a bad option': [LINT, '--root', WORKSPACE_ROOT, 'specs/no-such-packet'] gives status 0, stderr including '[lint-goal-criteria] ERROR specs/no-such-packet: packet not found' and stdout including 'goals_scanned=0'. [LINT, '--bogus'] gives status 0 and stderr including '[lint-goal-criteria] ERROR unknown option: --bogus'.
  2. 'the report prints per-rule counts and each flagged line': with createWalkRoot, write GOOD to specs/a/goal.md and to specs/a/scratch/b/goal.md. [LINT, '--root', root, '--all'] gives status 0 and stdout lines including 'scratch_excluded=1', 'rule4_violations=2', 'rule5_violations=1', 'rule4 specs/a/goal.md:9: The report' and 'rule5 specs/a/goal.md:11: REQ-001'. [LINT, '--root', root, '--all', '--json'] gives status 0 and JSON.parse(stdout).summary.rule5_violations === 1. Remove the root in a finally block.

VERIFY (repo root):
  node --check .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs
  node .skilled/skills/sk-doc/sk-create-goal/scripts/lint-goal-criteria.cjs specs/no-such-packet; echo "exit=$?"
Accept when: 2 files changed and nothing else; node --check exits 0; the second command prints goals_scanned=0, the packet-not-found ERROR line and exit=0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/006-goal-criteria-lint
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
