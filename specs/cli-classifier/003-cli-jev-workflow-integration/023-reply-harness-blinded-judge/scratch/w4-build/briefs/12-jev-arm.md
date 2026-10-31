GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge

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

TASK: add the Jev arm, three `jev score` calls per labeled reply and rubric dimension with no answer cache, with a flip test on stub answers.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
M = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only). Read S and T in full, then M lines 1512-1757 (the Jev arm to model the auth test, loop, backoff and stop on). Everything you need is in this brief: do not read spec, plan or scratch files. Keep existing lines unless a step names them. Same style as S. Make the edits, then run the checks and hand back.

STEP 1. In S, at the end of section 8 (after `payloadClass`, above the three-line section 9 header), add `export async function runJevArm(plan, gate, ctx)` with JSDoc. plan is `{ labeled, baseline, dimensions, labelsSha, payload }`, gate a passing `jevGate` result (`{ path, provider }`), ctx `{ out, env, timeoutMs, backoffMs, callLog, stored }`. D is the dimension count, K `labeled.size`, R = 3 reruns.
a. `chars` sums, over every labeled entry and dimension, `entry.text.length + d.judgeGuidance.length + LEVELS.join('').length`, times R. Print `` `jev: payload: ${plan.payload}; planned calls: ${R * D * K + 1}; estimated input tokens: ${Math.ceil(chars / 4)}` ``. No cost in any currency is printed.
b. The auth test as M:1589-1628 does it (`spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ...)`, model from its JSON `model`, else `'unknown'`), with the record `{ backend: 'jev', replySha: null, dimension: null, rerun: null, attempt: 1, wallMs, exitCode, position: null, status, jevVersion: '0.6.2', provider, model }` (status `'measured'` on exit 0, else `'unmeasured'`) and the stops `jev arm stopped: key rejected` (exit 3), `jev arm stopped: interrupted` (130) and `jev arm stopped: auth test failed` (any other non-zero). Then print `` `jev: auth test provider=${gate.provider} model=${model}` ``.
c. For each SHA of labeled in sorted order, each dimension d, each rerun 0 to 2, one spawn every time: `spawnCall(gate.path, ['score', '--provider', gate.provider, '-q', d.judgeGuidance, '-l', LEVELS[0], '-l', LEVELS[1], '-l', LEVELS[2]], entry.text, ctx.env, ctx.timeoutMs)`. Exit 4 without a timeout: append an `'unmeasured'` attempt-1 record, wait `ctx.backoffMs`, retry once as attempt 2. Then: timed out is `'unmeasured_timeout'`; exit 0 is `parseScoreAnswer(stdout)`, `'measured'` when not null else `'unmeasured'`; exit 2 stops with `jev arm stopped: usage error`, 3 with `jev arm stopped: key rejected`, 130 with `jev arm stopped: interrupted`; any other exit is `'unmeasured'`. Every spawn appends `{ backend: 'jev', replySha: sha.slice(0, 12), dimension: d.id, rerun, attempt, wallMs, exitCode, position, status, jevVersion: '0.6.2', provider: gate.provider, model }`. A stop prints its line and `` `jev: partial replies=${finished}` `` and returns `{ stopped: line, partialReplies: finished }`.
d. After the loop: `summarizeColumn({ backend: 'jev', ..., reruns: 3 })` over arrays of the three levels (null for an unmeasured call); print `` `column jev: replies=${K} measured=${M} unmeasured=${K - M} unstable=${unstable} latency_p50_ms=${p50 ?? 'none'} latency_p95_ms=${p95 ?? 'none'}` ``, then `dimensionLines`, then `requalify: model changed` only when `ctx.stored?.columns?.jev` has another provider or model, then `verdictLine(summary, labelsSha, \`jev_version=0.6.2 provider=${gate.provider} model=${model}\`)`. Return `{ column: { ...summary, line, latency, jevVersion: '0.6.2', provider: gate.provider, model }, requalify }`.

STEP 2. In `main`, replace the comment `// The Jev arm runs here after a passing gate.` with `jevResult = await runJevArm({ labeled, baseline, dimensions, labelsSha, payload }, check, { out, env, timeoutMs, backoffMs, callLog, stored })`, using main's own names.

STEP 3. In T, add one test using `scenario(fixture, (g, b) => [g, g, third(g, b)])`, args `--labels <labels> --jev --accept-payload --out <root>/out`, env `stubEnv(root, { STUB_ANSWERS: <answers> })`:
41. code 0; the last line starts `verdict jev: stop (flips) K=21 M=21 A=147 B=63 W=21 L=0 F=147` and ends `jev_version=0.6.2 provider=official model=stub-model`; `out/calls.jsonl` has 442 lines; and every stub log line whose first field is `jev`, except the one whose second field is `--version`, has a second field containing `--provider official`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export async function" S` prints 3.
Checks you run: `node --check S`, `node --check T`, that grep. Do not run `node --test`: the orchestrator runs it.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge
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
