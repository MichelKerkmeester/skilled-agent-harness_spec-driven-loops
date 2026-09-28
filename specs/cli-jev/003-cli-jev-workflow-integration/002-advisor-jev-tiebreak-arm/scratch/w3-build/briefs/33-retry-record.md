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

TASK: record every spawn and count every wall time. When jev exits 4, runJevArm retries once but writes only the retry to calls.jsonl, and the first attempt's wall time never reaches p50/p95. The Deem arm records both spawns but also drops the first attempt's wall time from latency. Fix both. Tests pin it.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read summarizeColumn, runJevArm (call, record, the auth test, the choice loop, the calibration loop) and runDeemArm's deemCall and choice loop first.

In the script:
1. summarizeColumn. Old: `    for (const record of records) wallTimes.push(record.wallMs);`
   New:
    for (const record of records) {
      wallTimes.push(record.wallMs);
      if (typeof record.retryWallMs === 'number') wallTimes.push(record.retryWallMs);
    }
   Add `retryWallMs?: number|null` to the recordsByRow element type in its JSDoc.
2. runJevArm: give call a third parameter `fields` ({ kind, row_id, pass }). When the first spawn exits 4, first run `record(result, { ...fields, answer: null, pick_prob: null, none_prob: null, status: 'unmeasured' })`, keep `const firstWallMs = result.wallMs`, wait the backoff, retry, then set `result.retryWallMs = firstWallMs` on the retry's result. Without a retry set `result.retryWallMs = null`. The three callers pass: auth test `{ kind: 'auth_test', row_id: null, pass: null }`; choice `{ kind: 'choice', row_id: row.id, pass }`; noul `{ kind: 'noul', row_id: label.id, pass }`. Each caller still records the final result as now.
   Choice loop: `records[row.id].push({ answer, wallMs: result.wallMs })` becomes `records[row.id].push({ answer, wallMs: result.wallMs, retryWallMs: result.retryWallMs })`.
   Calibration loop: after `wallTimes.push(result.wallMs);` add `if (result.retryWallMs !== null) wallTimes.push(result.retryWallMs);`.
3. runDeemArm deemCall: in the exit-4 branch, before the retry spawn keep `const firstWallMs = r.wallMs;`, and after the retry spawn set `r.retryWallMs = firstWallMs;` (before its persist). The choice loop push becomes `records[row.id].push({ answer: fields.answer, wallMs: outcome.r.wallMs, retryWallMs: outcome.r.retryWallMs ?? null });`.

In the vitest file:
1. describe('score-jev-tiebreak jev arm'), it('records retries, failures, timeouts, and measured picks'): row r0's prompt makes every spawn exit 4, so its 3 passes now write 6 lines. Old: `    expect(byRow('r0')).toHaveLength(3);` New: `    expect(byRow('r0')).toHaveLength(6);`. Directly after `    expect(choiceLines).toHaveLength(21);` add `    expect(choice).toHaveLength(choiceLines.length);`.
2. describe('score-jev-tiebreak column and keep rule'), add at its end:
  it('counts a retried attempt in latency', () => {
    const rows = [mk('t1', 'b', ['a', 'b'], ['a', 'b'])];
    const records = { t1: [{ answer: 'b', wallMs: 10, retryWallMs: 1000 }, { answer: 'b', wallMs: 10 }, { answer: 'b', wallMs: 10 }] };
    const column = summarizeColumn('jev', rows, records, { ...synthCensus(), rows });
    expect(column.latency.p50).toBe(10);
    expect(column.latency.p95).toBe(1000);
  });

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
