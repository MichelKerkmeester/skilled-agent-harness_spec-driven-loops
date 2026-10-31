GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm

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

TASK: in the Jev choice arm, write the call that stops the arm to calls.jsonl before the stop is reported, and default a missing auth-test model to 'unknown'. Tests pin both.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read runJevArm and describe('score-jev-tiebreak jev arm') first.

In the script, inside runJevArm only:
1. Old: `      model = JSON.parse(auth.stdout).model;`
   New: `      model = JSON.parse(auth.stdout).model ?? 'unknown';`
2. After the line `      let status = 'unmeasured';` in the choice loop, add: `      let stopLine = null;`
3. Old:
      } else if (result.code === 2) {
        return stop('jev arm stopped: usage error', finished);
      } else if (result.code === 3) {
        return stop('jev arm stopped: key rejected', finished);
      } else if (result.code === 130) {
        return stop('jev arm stopped: interrupted', finished);
   New:
      } else if (result.code === 2) {
        stopLine = 'jev arm stopped: usage error';
      } else if (result.code === 3) {
        stopLine = 'jev arm stopped: key rejected';
      } else if (result.code === 130) {
        stopLine = 'jev arm stopped: interrupted';
4. Directly after the `record(result, { kind: 'choice', ... });` call in that loop and before `records[row.id].push(...)`, add:
      if (stopLine !== null) return stop(stopLine, finished);
   A stopping call keeps answer null and status 'unmeasured'. Nothing else in the function changes.

In the vitest file, inside describe('score-jev-tiebreak jev arm'):
1. In it('stops on a rejected key and reports the rows that finished'), before its closing line, add:
    const last = result.calls[result.calls.length - 1];
    expect(last).toMatchObject({ kind: 'choice', row_id: 'r2', pass: 1, exit_code: 3, answer: null, status: 'unmeasured' });
2. In it('stops on a usage error before any row finishes'), before its closing line, add:
    const choice = result.calls.filter((call) => call.kind === 'choice');
    expect(choice).toHaveLength(1);
    expect(choice[0]).toMatchObject({ row_id: 'r0', exit_code: 2, status: 'unmeasured' });
3. Add one new it('names the model unknown when auth test omits it', ...) at the end of that describe, 60_000 timeout. It makes its own stub:
    const stub = makeStub('jev', [
      `case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) [ "$2" = test ] && echo '{"ok":true,"valid":true}'; exit 0;; esac`,
      'exit 2',
    ].join('\n'));
   and calls main(['--jev'], { census: census(['a', 'b', 'c', 'd', 'e', 'f']), out, env: { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}`, JEV_PROVIDER: 'openrouter' }, timeoutMs: 1500, backoffMs: 10 }) with out pushing into a lines array, removes the stub in a finally block, and expects lines to contain 'jev: auth_test provider=openrouter model=unknown' and 'jev arm stopped: usage error'.

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
Accept when: 2 files changed and nothing else; node --check exits 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/002-advisor-jev-tiebreak-arm
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
