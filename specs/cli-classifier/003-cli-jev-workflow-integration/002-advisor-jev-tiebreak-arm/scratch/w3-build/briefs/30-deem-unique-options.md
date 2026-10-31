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

TASK: the Deem arm must never send two options with the same description. The local cli-deem client maps an answer back to its key by description and exits 2 ("duplicate option description") when two keys share one, which stopped a live run: the alias pair memory:save and command-memory-save share one projection description. Fix the Deem option text and pin it with tests.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read runDeemArm's choice loop and describe('score-jev-tiebreak deem arm') first.

In the script, inside runDeemArm only:
1. Directly after the line `      const keys = [...row.cluster, 'none'];` add:
      // The local client maps an answer back to its key by description and refuses
      // two options that share one, so a shared description carries its key.
      const text = new Map();
      for (const k of row.cluster) {
        const d = census.describe(k);
        const shared = row.cluster.some((other) => other !== k && census.describe(other) === d);
        text.set(k, shared ? `${d} [${k}]` : d);
      }
      text.set('none', NONE_DESCRIPTION);
2. Line 1236. Old:
          args.push('-o', `${k}=${k === 'none' ? NONE_DESCRIPTION : census.describe(k)}`);
   New:
          args.push('-o', `${k}=${text.get(k)}`);
Nothing else changes. The Jev arm keeps its option text.

In the vitest file, inside describe('score-jev-tiebreak deem arm'):
1. In it('rotates options, skips a cluster over the key cap, and records the commits'), directly before the line `    const firstKeys = choiceLines.slice(0, 3).map((line) => {`, add:
    expect(choiceLines[0]).toContain('-o a=desc a -o b=desc b -o none=None of these skills fits the request');
2. Directly before it('stops when health says the server is gone'), add:
  it('gives options that share a description their key, so the client accepts them', async () => {
    const scored = { ...census(['ok a', 'ok b', 'ok c', 'ok d', 'ok e', 'ok f']), describe: () => 'same text' };
    const result = await drive(scored);
    expect(result.lines.some((line) => line.startsWith('deem arm stopped'))).toBe(false);
    expect(result.lines.some((line) => line.startsWith('verdict: '))).toBe(true);
    const choiceLines = result.logLines.filter((line) => line.startsWith('choice'));
    expect(choiceLines[0]).toContain('-o a=same text [a] -o b=same text [b] -o none=None of these skills fits the request');
  }, 60_000);

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
