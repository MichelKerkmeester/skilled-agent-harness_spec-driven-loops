GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm

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

TASK: refuse `--deem` or `--jev` without `--out` right after argument parsing, before the census, any baseline and any spawn, and move the two vitest refusal cases to match. Two files.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. Read main in S and the two refusal cases in T first.

In S:
1. In main, directly after `const { values } = parsed;` and before `const stored = ...`, add:
   if ((values.deem === true || values.jev === true) && (typeof values.out !== 'string' || values.out === '')) {
     err(values.deem === true
       ? '--deem needs --out <dir> so every call is recorded'
       : '--jev needs --out <dir> so every call is recorded');
     return 2;
   }
2. Remove the two late checks: the `if (deemCheck.passed && (typeof values.out ...)) { err('--deem needs ...'); return 2; }` block after `deemGate(...)`, and the matching `--jev` block after `jevGate(...)`. Nothing else in the Deem or Jev blocks changes.
3. Header comment, lines 13 to 15. Old:
// Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad
// invocation or unreadable input, or a model switch whose gate passed without
// --out.
New:
// Exit codes: 0 = report printed, a skipped or stopped arm included; 2 = bad
// invocation or unreadable input, or --deem or --jev without --out, refused
// before any output or call.
4. main's JSDoc @returns line. Old: `0 = report printed, 2 = bad invocation or unreadable input.` New: `0 = report printed, 2 = bad invocation, unreadable input, or a model switch without --out.`

In T:
5. Deem gate case 'refuses a passing gate without --out before any call': rename it 'refuses --deem without --out before any output or call'. Keep its setup (HEALTHY stub first on PATH). Replace its run and expectations with: for each argv of ['--deem'] and ['--deem', '--out', ''], run = await runMain(argv, deps) gives code 2, run.errs equal to ['--deem needs --out <dir> so every call is recorded'], run.lines equal to [], and fs.existsSync(path.join(stubs, 'cli-deem.log')) false.
6. Jev gate case 'refuses a passing jev gate without --out before any call': rename it 'refuses --jev without --out before any output or call'. Keep its stub and env (JEV_PROVIDER 'openrouter'); drop its `base` run. For argv ['--jev']: code 2, run.errs equal to ['--jev needs --out <dir> so every call is recorded'], run.lines equal to [], and fs.existsSync(path.join(stubs, 'jev.log')) false.
Every other case that passes --deem or --jev already passes --out in a temp dir; leave them as they are.

VERIFY (repo root):
  node --check .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs
  grep -c "needs --out <dir> so every call is recorded" .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs   (expect 2, both inside the new early check)
Accept when: 2 files changed and nothing else; node --check exits 0; the grep prints 2.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm
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
