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

TASK: add the Deem choice arm, runDeemArm, and run it from main after a passing Deem gate, with tests against a stub cli-deem.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first; runJevArm is the model to follow.

In the script:
1. Constants: const DEEM_MAX_KEYS = 25; const DEEM_P50_MS = 65.6;
2. After runJevArm add `export async function runDeemArm(census, gate, headroom, ctx)` with JSDoc; gate is deemGate's passing result, ctx = { out, env, timeoutMs, outDir }. Returns { column } or { stopped: line }. It never starts a server and passes no key and no --provider.
   a. rows = eligible rows (classifyRow not 'ineligible'); sent = rows with cluster.length <= DEEM_MAX_KEYS; over = rows.length - sent.length. choiceCalls = headroom === 'ok' ? sent.length * PASSES : 0; planned = choiceCalls + census.labels.length. out `deem: nothing leaves the machine planned_calls=${planned} est_wall_s=${(planned * DEEM_P50_MS / 1000).toFixed(1)} unmeasured_over25=${over}`.
   b. deemCall(args, text): r = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], text, ctx.env, ctx.timeoutMs). When r.code === 4: h = readDeemHealth(gate.cmd, ctx.env); when !h.ok return { r, stop: 'deem arm stopped: server gone' }; when h.modelCommit !== gate.modelCommit or h.sourceCommit !== gate.sourceCommit return { r, stop: 'deem arm stopped: model commit changed mid-run' }; else spawn once more and keep that result. Then code 2 gives stop 'deem arm stopped: usage error', 3 gives 'deem arm stopped: backend refused', 130 gives 'deem arm stopped: interrupted'. Return { r, stop }.
   c. Every spawned call is written with writeCall(ctx.outDir, { kind, backend: 'deem', row_id, order, wall_ms, exit_code, model: gate.model, model_commit: gate.modelCommit, source_commit: gate.sourceCommit, answer, pick_prob, none_prob, status }) BEFORE any stop is acted on.
   d. stop(line, finished): out(line), out `deem: partial_rows=${finished}`, return { stopped: line }.
   e. When headroom is 'ok': records = {} keyed by row.id, finished = 0. For each sent row, keys = [...row.cluster, 'none']; for order 0 to 2, rotated = [...keys.slice(order), ...keys.slice(0, order)]; args = ['choice', '-q', CHOICE_QUESTION] then '-o' before `${k}=${k === 'none' ? NONE_DESCRIPTION : census.describe(k)}` for each k of rotated; { r, stop } = await deemCall(args, row.prompt). Status: r.timedOut is 'unmeasured_timeout'; code 0 with JSON answers.answer.choice in keys gives answer, 'abstained' for 'none' else 'measured', pick_prob and none_prob from answers.answer.probabilities; anything else 'unmeasured' with answer null. Write the record (kind 'choice'), then return stop(stop, finished) when stop is set, else push { answer, wallMs: r.wallMs } onto records[row.id]. finished += 1 after a row's three orders.
      column = summarizeColumn('deem', rows, records, census); out each columnLines line, then out(verdictLine(column, `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`)).
   f. Return { column } (column is undefined when headroom is not 'ok').
3. In main keep the deemGate result; when it passed, await runDeemArm(census, gate, summary.headroom, { out, env, timeoutMs, outDir: values.out }).

In the vitest file add describe('score-jev-tiebreak deem arm'), driving main(['--deem', '--out', dir], { census, out, env: { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}` }, timeoutMs: 5000 }), census built like the jev-arm tests (6 rows, prompts given per case), 60_000 ms timeout, dirs removed in finally. stub = makeStub('cli-deem', body) with body:
  if [ "$1" = health ]; then n=$(cat "$D/n" 2>/dev/null || echo 0); n=$((n+1)); echo $n > "$D/n"
    if [ -f "$D/gone" ] && [ $n -gt 1 ]; then echo '{"ok":false,"error":"Deem unreachable"}' >&2; exit 4; fi
    mc=m1; if [ -f "$D/newpair" ] && [ $n -gt 1 ]; then mc=m2; fi
    echo "{\"ok\":true,\"backend\":\"torch\",\"model\":\"deem-0.8-v1\",\"model_commit\":\"$mc\",\"source_commit\":\"s1\"}"; exit 0; fi
  p=$(cat); case "$p" in *exit1*) exit 1;; *exit2*) exit 2;; *exit3*) exit 3;; *exit4*) exit 4;; esac
  echo '{"model":"deem-0.8-v1","answers":{"answer":{"choice":"b","probabilities":{"b":0.8,"none":0.05}}}}'
1. prompts ['ok a', 'exit1 b', 'ok c', 'ok d', 'ok e', 'ok f'], plus a 7th row r6 with order and cluster of 26 skills 'k0' to 'k25' and gold 'k1': resolves 0; output has a line starting 'deem: nothing leaves the machine planned_calls=18 ' and ending 'unmeasured_over25=1', a line starting 'column: backend=deem rows=7 measured=5 ', and a line starting 'verdict: ' ending 'model=deem-0.8-v1 model_commit=m1 source_commit=s1'. Every calls.jsonl line has backend 'deem', model_commit 'm1', source_commit 's1' and order 0, 1 or 2. The first three cli-deem.log lines starting 'choice' have their first ' -o ' option keys 'a', 'b' and 'none'. No cli-deem.log line contains '--provider', 'k25=' or 'KEY'.
2. prompts with 'exit3' in r2: output includes 'deem arm stopped: backend refused' and 'deem: partial_rows=2', no line starts 'verdict: ', and calls.jsonl holds 7 lines.
3. 'exit4' in r1 and an empty file join(stub, 'newpair'): output includes 'deem arm stopped: model commit changed mid-run' and 'deem: partial_rows=1'.
4. 'exit4' in r1 and an empty file join(stub, 'gone'): output includes 'deem arm stopped: server gone'.

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
