GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order

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

TASK: extend runArm with the Jev backend: cost line, one auth test, one provider on every call, its exit handling, and tests.
R = .skilled/skills/system-skill-advisor/runtime. Files: S = R/scripts/routing-accuracy/score-suggested-order.mjs and T = R/tests/parity/score-suggested-order.vitest.ts. Read both first, then R/scripts/routing-accuracy/score-jev-tiebreak.mjs lines 851-951 and 1375-1411 (the older Jev arm and gate; never edit that file).

In S: add `const JEV_VERSION = '0.6.2';` and `const AUTH_TIMEOUT_MS = 30000;`. In runArm (update its JSDoc: backend is 'jev' or 'deem'; a Jev gate is { path, provider }; ctx also takes backoffMs, default 2000):
 1. rows: for 'jev' every eligible row (no key cap); 'deem' keeps the cap.
 2. For 'jev', instead of the deem cost line: chars = sum over rows of PASSES * (row.prompt.length + CHOICE_QUESTION.length + the summed lengths of the `key=text` values in optionArgs([...row.cluster, 'none'], census.describe, row.cluster)); out(`jev: payload=routing corpus prompts and skill projection descriptions planned_calls=${rows.length * PASSES + 1} est_input_tokens=${Math.ceil(chars / 4)}`). No dollar figure anywhere. The question line follows for both backends, as now.
 3. For 'jev', before the rows: auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, AUTH_TIMEOUT_MS); model = JSON.parse(auth.stdout).model when auth.code is 0 and that parses to a string, else 'unknown'. writeCall(ctx.outDir, { backend: 'jev', kind: 'auth_test', wall_ms: auth.wallMs, exit_code: auth.code, jev_version: JEV_VERSION, provider: gate.provider, model, status: auth.code === 0 ? 'measured' : 'unmeasured' }). Code 3 -> return stop('jev arm stopped: key rejected'); code 130 -> return stop('jev arm stopped: interrupted'); any other non-zero -> return stop('jev arm stopped: auth test failed'). Then out(`jev: auth_test provider=${gate.provider} model=${model}`). identity for 'jev' = { jev_version: JEV_VERSION, provider: gate.provider, model }.
 4. The Jev job has no health step: { prompt: row.prompt, call: { cmd: [gate.path], args: ['choice', '--provider', gate.provider, '-q', CHOICE_QUESTION, ...optionArgs(...)] } }. Add kind: 'choice' to every choice record of both backends (right after backend).
 5. Exit handling for 'jev': code 3 -> stop('jev arm stopped: key rejected'); code 4 on attempt 1 -> `await new Promise((done) => { setTimeout(done, ctx.backoffMs ?? 2000); });` then attempt = 2 and loop once more. Codes 2 and 130 and the stop and partial lines use the backend name, as they already do; Deem handling stays as it is.
 6. The verdict extra for 'jev' is `jev_version=${JEV_VERSION} provider=${gate.provider} model=${model}`, and the calls line reads `${backend}: calls=... timeouts=...`.

In T: add a `JEV_STUB` CommonJS string: append `${args.join(' ')}\n` to jev.log next to __dirname; '--version' prints 'jev 0.6.2' and exits 0; 'auth status' exits 0; 'auth test' exits 3 when process.env.STUB_AUTH is '3', else prints '{"model":"stub-model"}' and exits 0; otherwise read stdin, and when the prompt starts with 'busy' and busy.done does not exist next to __dirname, create busy.done and exit 4; else answer like DEEM_STUB (key 'g' 0.7, the rest share 0.3). Build it with nodeBin('jev', JEV_STUB); gate { path: join(dir, 'jev'), provider: 'openrouter' }; ctx as in the deem arm tests plus backoffMs 10. describe('score-suggested-order jev arm') with its (timeout 60_000 each):
 1. Six m rows p1..p6: out has a line starting 'jev: payload=routing corpus prompts and skill projection descriptions planned_calls=19 est_input_tokens=' and 'jev: auth_test provider=openrouter model=stub-model'; the verdict line starts 'verdict jev: ' and ends 'jev_version=0.6.2 provider=openrouter model=stub-model'; jev.log's first line is 'auth test --provider openrouter', the other 18 start 'choice --provider openrouter -q ', no line is 'health', and every line holds '--provider' exactly once; calls.jsonl has 19 lines, all with provider 'openrouter', and 18 of kind 'choice' with model 'stub-model'.
 2. STUB_AUTH '3': runArm returns { stopped: 'jev arm stopped: key rejected' }, out has 'jev: partial_rows=0', and jev.log holds only 'auth test --provider openrouter'.
 3. Rows p1 and 'busy two': the calls for the busy row at order 0 are two records, attempt 1 with exit_code 4 and status 'unmeasured', then attempt 2 with status 'measured'; the column line contains 'measured=2'.

VERIFY (repo root): node --check .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
  grep -cE "API_KEY|TYPESAFE|Bearer|Authorization" .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs
Accept when: the same 2 files changed and nothing else; node --check exits 0; grep prints 0.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/019-advisor-suggested-order
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
