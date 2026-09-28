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

TASK: add the Deem choice arm (three option orders per row, exit handling, one calls.jsonl record per call, the column and verdict lines) and run it from main after a passing Deem gate, with three vitest cases.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. R = specs/cli-jev/003-cli-jev-workflow-integration/017-deem-search-narrowing-arm/scratch/w3-build/briefs/ref-gates.mjs (read only). Read S, T and R's spawnCall first.

In S, section 7:
1. Add `spawn` to the node:child_process import. Port R's spawnCall(file, args, stdinText, env, timeoutMs) as an export, same behavior (stdin written then closed, SIGKILL and resolve at the timeout with timedOut true, spawn error as code 127).
2. export function createCallLog(outDir): returns { append(record) }. With a non-empty outDir the first append runs fs.mkdirSync(outDir, { recursive: true }) and writes an empty <outDir>/calls.jsonl, and every append adds JSON.stringify(record) plus '\n'. Without outDir append does nothing.
3. export async function runDeemArm(plan, gate, ctx) with JSDoc. plan = { rows, probes, options, baselinePicks } (probes: the gold-bearing probes); gate = deemGate's passing result { cmd, model, modelCommit, sourceCommit }; ctx = { out, env, timeoutMs, callLog }.
 a. items = rows as { kind: 'test', id, question } then probes as { kind: 'probe', id, question }. planned = ORDERS * items.length. out(`deem: nothing leaves the machine; planned calls: ${planned}; estimated wall time: ${(planned * DEEM_P50_MS / 1000).toFixed(1)} s at ${DEEM_P50_MS} ms per call, the 2-option p50 from deem-local.md`).
 b. For each item, for order 0..ORDERS-1: args = ['choice', '-q', CHOICE_INSTRUCTION] plus '-o', `${key}=${description}` for each pair of rotateOptions(options.pairs, order); r = await spawnCall(gate.cmd[0], [...gate.cmd.slice(1), ...args], item.question, ctx.env, ctx.timeoutMs). Exit 4 without a timeout: record r, then h = readDeemHealth(gate.cmd, ctx.env); !h.ok stops with 'deem arm stopped: server gone'; a modelCommit or sourceCommit different from gate's stops with 'deem arm stopped: model commit changed mid-run'; otherwise spawn once more and judge that result. Judging: timedOut gives status 'unmeasured_timeout'; code 0 whose JSON answers.answer.choice is one of options.keys gives pick = that key, pickProb = answers.answer.probabilities?.[pick] ?? null, noneProb = probabilities?.none ?? null, status 'measured'; code 2 stops with 'deem arm stopped: usage error', 3 with 'deem arm stopped: backend refused', 130 with 'deem arm stopped: interrupted'; anything else is 'unmeasured' with pick null.
 c. Every spawn is recorded before a stop acts: ctx.callLog.append({ backend: 'deem', kind: item.kind, rowId: item.id, order, attempt (1, or 2 for the retry), wallMs: r.wallMs, exitCode: r.code, pick, pickProb, noneProb, status, modelId: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit }) (pick, probabilities null and status 'unmeasured' on a spawn that led to a stop or a retry). Every spawn's wallMs goes into a wallTimes list.
 d. A stop: out(line), out(`deem: partial rows=${finished}`) where finished counts items whose three orders completed, and return { stopped: line, partialRows: finished }. No column or verdict prints.
 e. Otherwise answers = Map from item id to its three picks. column = summarizeColumn('deem', rows, answers restricted to row ids, plan.baselinePicks, `model=${gate.model} model_commit=${gate.modelCommit} source_commit=${gate.sourceCommit}`); latency = { p50: nearestRank(wallTimes, 0.5), p95: nearestRank(wallTimes, 0.95) }; out(columnLine(column, latency)); out(column.line). probePicks = Map from probe id to modalPick(its answers).pick when it has three string answers, else null. Return { column: { ...column, latency, modelId: gate.model, modelCommit: gate.modelCommit, sourceCommit: gate.sourceCommit }, probePicks }.
4. In main: callLog = createCallLog(values.out) once, before the arms; after the refusal check, a passing deemCheck runs deemResult = await runDeemArm({ rows: testSet.rows, probes: gold-bearing probes, options, baselinePicks }, deemCheck, { out, env, timeoutMs, callLog }).

In T add describe('score-track-narrowing deem arm'). keepCorpus(root, marker = '') helper: tracks 'alpha-track' and 'beta' (as in smallCorpus); packets specs/alpha-track/00N-a `quartz lantern number ${word} glows` and specs/beta/00N-b `ember harbor number ${word} drifts` for N = 1..3, word = 'one', 'two', 'three', except alpha 002-a is `quartz lantern ${marker} two glows` when a marker is given; doc(root, 'specs/beta/100-docs/spec.md', ['unrelated phrase words']); probes.json { paraphrase: { rows: [] } }; indexFor(root); returns { indexPath, probesPath }. Stub body DEEM (JSON in the echo lines written with escaped quotes):
  if [ "$1" = health ]; then n=$(cat "$D/n" 2>/dev/null || echo 0); n=$((n+1)); echo $n > "$D/n"; mc=m1; if [ -f "$D/newpair" ] && [ $n -gt 1 ]; then mc=m2; fi; echo "{\"ok\":true,\"backend\":\"torch\",\"model\":\"deem-0.8-v1\",\"model_commit\":\"$mc\",\"source_commit\":\"s1\"}"; exit 0; fi
  p=$(cat); case "$p" in *exit1*) exit 1;; *exit3*) exit 3;; *exit4*) exit 4;; *quartz*) k=alpha-track;; *ember*) k=beta;; *) k=none;; esac
  echo "{\"model\":\"deem-0.8-v1\",\"answers\":{\"answer\":{\"choice\":\"$k\",\"probabilities\":{\"$k\":0.8,\"none\":0.05}}}}"
 1. 'asks three rotations per row and prints keep when the stub is right and both baselines abstain': keepCorpus(root); runMain(['--deem', '--out', out], deps) with the stub first on PATH: code 0; lines include 'deem: nothing leaves the machine; planned calls: 18; estimated wall time: 1.2 s at 65.6 ms per call, the 2-option p50 from deem-local.md', a line starting 'column deem: rows=6 measured=6 unmeasured=0 unstable=0 abstained=0 flip_rate=0.0000 ', and then 'verdict deem: keep K=6 M=6 A=6 B=0 W=6 L=0 F=0 p=0.01563 model=deem-0.8-v1 model_commit=m1 source_commit=s1' before the last line. calls.jsonl has 18 lines, each with a numeric wallMs, exitCode 0, modelId 'deem-0.8-v1', modelCommit 'm1', sourceCommit 's1', status 'measured' and order 0, 1 or 2. The cli-deem log's first line is 'health'; its 18 'choice' lines each start 'choice -q Which spec track is this text about? -o '; the first three name first options 'alpha-track', 'beta' and 'none'; no line contains '--provider'.
 2. 'stops when the commit pair changes after exit 4, or when the backend refuses': keepCorpus(root, 'exit4') with an empty file 'newpair' in the stub dir gives lines 'deem arm stopped: model commit changed mid-run' and `deem: partial rows=${index}` where index = buildTestSet(root, { hubNames: [] }).rows.findIndex((row) => row.question.includes('exit4')), and no line starting 'verdict deem:'. The same with marker 'exit3' and no newpair file gives 'deem arm stopped: backend refused'.
 3. 'marks exit-1 calls unmeasured and stops on coverage': keepCorpus(root, 'exit1') gives a line starting 'column deem: rows=6 measured=5 unmeasured=1 ' and a line starting 'verdict deem: stop (coverage) K=6 M=5 '.

VERIFY (repo root): node --check .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs
Accept when: 2 files changed and nothing else; node --check exits 0.

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
