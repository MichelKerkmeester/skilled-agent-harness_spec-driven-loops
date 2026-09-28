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

TASK: add the Jev choice arm, runJevArm, and run it from main after a passing Jev gate, with tests against a stub jev.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first.

In the script:
1. Constants: const PASSES = 3; const CHOICE_QUESTION = 'Which skill should handle this request?'; const NONE_DESCRIPTION = 'None of these skills fits the request';
2. After writeCall add `export async function runJevArm(census, gate, ctx)` with JSDoc; ctx = { out, env, timeoutMs, backoffMs, outDir }. It returns the summarizeColumn result, or { stopped: line } when the arm stops.
   a. rows = census.rows whose classifyRow is not 'ineligible'. P = gate.provider. model = 'unknown'.
   b. chars = PASSES * sum over rows of (prompt.length + CHOICE_QUESTION.length + sum over row.cluster of (k.length + census.describe(k).length + 1) + 5 + NONE_DESCRIPTION.length). out `jev: payload=routing corpus prompts and skill projection descriptions planned_calls=${rows.length * PASSES + 1} est_input_tokens=${Math.ceil(chars / 4)}`.
   c. call(args, text): r = await spawnCall(gate.path, args, text, ctx.env, ctx.timeoutMs); when r.code === 4, wait ctx.backoffMs ms and spawn once more, keeping the second result. Return r.
   d. record(r, fields) writes with writeCall(ctx.outDir, { kind, row_id, pass, wall_ms: r.wallMs, exit_code: r.code, jev_version: JEV_VERSION, provider: P, model, answer, pick_prob, none_prob, status }).
   e. stop(line, finished): out(line), out `jev: partial_rows=${finished}`, return { stopped: line }.
   f. Auth test: r = await call(['auth', 'test', '--provider', P], ''). On code 0 model = JSON.parse(r.stdout).model (a parse failure keeps 'unknown'). Record kind 'auth_test', row_id and pass null, answer and probabilities null, status 'measured' on code 0 else 'unmeasured'. Code 3: stop('jev arm stopped: key rejected', 0). Code 130: stop('jev arm stopped: interrupted', 0). Any other non-zero code: stop('jev arm stopped: auth test failed', 0). Else out `jev: auth_test provider=${P} model=${model}`.
   g. records = {} keyed by row.id; finished = 0. For each row, for pass 1 to PASSES: args = ['choice', '--provider', P, '-q', CHOICE_QUESTION, then '-o' before each of `${k}=${census.describe(k)}` for k in row.cluster, then '-o', `none=${NONE_DESCRIPTION}`]; r = await call(args, row.prompt).
      - r.timedOut: status 'unmeasured_timeout', answer null.
      - code 0: json = JSON.parse(stdout) (failure is 'unmeasured'); a = json?.answers?.answer?.choice. When a is 'none' or in row.cluster: answer a, status 'abstained' for 'none' else 'measured', pick_prob = probabilities?.[a] ?? null, none_prob = probabilities?.none ?? null, and model = json.model ?? model. Otherwise answer null, status 'unmeasured'.
      - code 2: stop('jev arm stopped: usage error', finished). code 3: stop('jev arm stopped: key rejected', finished). code 130: stop('jev arm stopped: interrupted', finished). Any other code: answer null, status 'unmeasured'.
      Record kind 'choice' with row_id row.id and pass, then push { answer, wallMs: r.wallMs } onto records[row.id]. After a row's passes, finished += 1.
   h. summary = summarizeColumn('jev', rows, records, census); out each columnLines(summary) line, then out(verdictLine(summary, `provider=${P} model=${model}`)); return summary.
3. In main: const backoffMs = deps.backoffMs ?? 2000. Keep the jevGate result; when it passed and the census summary's headroom is 'ok', await runJevArm(census, gate, { out, env, timeoutMs, backoffMs, outDir: values.out }).

In the vitest file add describe('score-jev-tiebreak jev arm'), driving the arm through main: stub = makeStub('jev', body) with body
  case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) [ "$2" = test ] && echo '{"ok":true,"valid":true,"model":"stub-model"}'; exit 0;; esac
  p=$(cat); case "$p" in *hang*) exec sleep 30;; *exit1*) exit 1;; *exit2*) exit 2;; *exit3*) exit 3;; *exit4*) exit 4;; esac
  echo '{"model":"stub-model","answers":{"answer":{"choice":"b","probabilities":{"b":0.7,"none":0.1}}}}'
census(prompts) = { ...synthCensus(), rows: prompts.map((p, i) => ({ ...mk(`r${i}`, 'b', ['a', 'b'], ['a', 'b'], i % 2 ? 'train' : 'test'), prompt: p })) } (mk is the column-tests helper; move it to module level if needed). Run main(['--jev', '--out', dir], { census, out, env: { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}`, JEV_PROVIDER: 'openrouter' }, timeoutMs: 1500, backoffMs: 10 }) with dir from mkdtemp; 60_000 ms timeout; remove dirs in finally.
1. prompts ['exit4 a', 'exit1 b', 'hang c', 'ok d', 'ok e', 'ok f']: resolves 0. calls.jsonl choice lines: r0 three with status 'unmeasured' and exit_code 4; r1 three 'unmeasured'; r2 three 'unmeasured_timeout'; r3 to r5 'measured' with answer 'b', pick_prob 0.7, none_prob 0.1. Every calls.jsonl line has numeric wall_ms, provider 'openrouter', model 'stub-model' and a status. jev.log holds 21 lines starting 'choice', and every jev.log line except '--version' contains '--provider openrouter'. One output line starts 'verdict: ' and ends 'provider=openrouter model=stub-model'.
2. prompts ['ok a', 'ok b', 'exit3 c', 'ok d', 'ok e', 'ok f']: output includes 'jev arm stopped: key rejected' and 'jev: partial_rows=2', and no line starts 'verdict: '.
3. prompts ['exit2 a', 'ok b', 'ok c', 'ok d', 'ok e', 'ok f']: output includes 'jev arm stopped: usage error' and 'jev: partial_rows=0'.

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
