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

TASK: fix the flip count for a row with three different answers. The keep rule defines the modal pick as the key at least 2 of the 3 answers name, so three different keys leave no modal pick and all 3 answers are non-modal. summarizeColumn counts `3 - maxFreq` (2) for such a row; it must count 3. Tests pin it.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read summarizeColumn and describe('score-jev-tiebreak column and keep rule') first.

In the script, inside summarizeColumn only. Old (about line 552):
    flips += 3 - maxFreq;
New:
    // Three different keys leave no modal pick, so all three answers are non-modal.
    flips += pick === null ? 3 : 3 - maxFreq;
Nothing else changes.

In the vitest file:
1. In describe('score-jev-tiebreak column and keep rule'), directly after the it('keeps a column when the sign, rank, right-3, and flip conditions all hold', ...) block, add:
  it('counts all three answers of a three-way split as flips, which blocks a keep', () => {
    const rows = Array.from({ length: 25 }, (_, index) => {
      const row = mk(`s${index}`, 'b', ['a', 'c', 'b'], ['a', 'c', 'b'], index % 2 === 1 ? 'train' : 'test');
      row.confidence = { a: 0.9, c: 0.85, b: 0.8 };
      row.score = { a: 0.5, c: 0.45, b: 0.4 };
      return row;
    });
    const answers = Object.fromEntries(rows.map((row, index) => [row.id, index < 22 ? ['b', 'b', 'b'] : ['a', 'c', 'b']]));
    const column = summarizeColumn('deem', rows, recs(answers), { ...synthCensus(), rows });
    expect(column.measured).toBe(25);
    expect(column.wins).toBe(22);
    expect(column.unstable).toBe(3);
    expect(column.flip.toFixed(4)).toBe('0.1200');
    expect(column.conditions.flip.held).toBe(false);
    expect(column.verdict).not.toBe('keep');
  });
2. In describe('score-jev-tiebreak fake deem server'), two assertions contain `flip=0.0952`. The flip row there gives three different picks, so under the fixed count the rate is 3 of 21 calls. Replace `flip=0.0952` with `flip=0.1429` in both (the `movable_wins=6` line and the `verdict: inconclusive` line). Change nothing else in them.

VERIFY (repo root):
  node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-jev-tiebreak.mjs
  grep -c "flip=0.0952" .skilled/skills/system-skill-advisor/runtime/tests/parity/score-jev-tiebreak.vitest.ts
Accept when: 2 files changed and nothing else; node --check exits 0; the grep prints 0.

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
