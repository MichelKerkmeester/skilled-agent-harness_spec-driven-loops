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

TASK: add the Jev choice arm (payload notice, one auth test, three option orders per row with one provider on every call, exit handling, calls.jsonl records, requalify, column and verdict) and run it from main after a passing Jev gate, with three vitest cases.
S = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs. T = .skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts. Read both first; runDeemArm is the model to follow.

In S, section 8: export async function runJevArm(plan, gate, ctx) with JSDoc; plan as runDeemArm's, gate = jevGate's passing result { path, provider }, ctx = { out, env, timeoutMs, backoffMs, callLog, stored }.
 a. items as in runDeemArm. chars = ORDERS times the sum over items of (question.length + CHOICE_INSTRUCTION.length + the sum over options.pairs of key.length + description.length + 1). out(`jev: payload: committed packet descriptions, fixture probe text and track descriptions; planned calls: ${ORDERS * items.length + 1}; estimated input tokens: ${Math.ceil(chars / 4)}`). No cost figure is printed.
 b. auth = await spawnCall(gate.path, ['auth', 'test', '--provider', gate.provider], '', ctx.env, ctx.timeoutMs); model = the `model` of its JSON stdout on exit 0, else 'unknown' (also when stdout does not parse). Record it: { backend: 'jev', kind: 'auth_test', rowId: null, order: null, attempt: 1, wallMs, exitCode, pick: null, pickProb: null, noneProb: null, status: exit 0 ? 'measured' : 'unmeasured', jevVersion: JEV_VERSION, provider: gate.provider, model }. Exit 3 stops with 'jev arm stopped: key rejected', 130 with 'jev arm stopped: interrupted', any other non-zero with 'jev arm stopped: auth test failed'. Then out(`jev: auth test provider=${gate.provider} model=${model}`).
 c. For each item and order 0..ORDERS-1: args = ['choice', '--provider', gate.provider, '-q', CHOICE_INSTRUCTION] plus '-o', `${key}=${description}` for each pair of rotateOptions(options.pairs, order); stdin is the question only. Exit 4 without a timeout: record it (status 'unmeasured'), wait ctx.backoffMs, spawn once more (attempt 2) and judge that result. Judging: timedOut gives 'unmeasured_timeout'; code 0 whose JSON answers.answer.choice is one of options.keys gives pick, pickProb, noneProb and 'measured' as in runDeemArm; code 2 stops with 'jev arm stopped: usage error', 3 with 'jev arm stopped: key rejected', 130 with 'jev arm stopped: interrupted'; code 1, unparseable stdout or a key outside the set is 'unmeasured'. Records carry jevVersion, provider and model (the auth-test model) in place of Deem's commit fields, and every spawn is recorded before a stop acts.
 d. A stop prints the line and `jev: partial rows=${finished}` and returns { stopped, partialRows }.
 e. Otherwise column = summarizeColumn('jev', rows, answers, plan.baselinePicks, `jev_version=${JEV_VERSION.split(' ')[1]} provider=${gate.provider} model=${model}`); out(columnLine(column, latency)); when stored?.columns?.jev exists and its provider or model differs, out('requalify: model changed'); out(column.line). Return { column: { ...column, latency, jevVersion: JEV_VERSION, provider: gate.provider, model, requalify }, probePicks }.
In main, where the Jev gate passes with --out, run jevResult = await runJevArm(same plan, jevCheck, { out, env, timeoutMs, backoffMs, callLog, stored }). buildReport fills columns.jev (with jevVersion, provider, model), stopped.jev and requalify.jev as it does for deem, and the probe line adds ['jev', hits] after deem when the Jev arm finished.

In T add describe('score-track-narrowing jev arm'). JEV stub body: line 1 `case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) [ "$2" = test ] && echo '{"ok":true,"valid":true,"model":"stub-model"}'; exit 0;; esac`, then the DEEM stub's last two lines (the stdin case and the echo). env without JEV_PROVIDER.
 1. 'runs every jev call under one provider and prints keep on stub answers': keepCorpus(root); runMain(['--jev', '--out', out], deps) gives code 0 and lines including `jev: path=${path.join(stubs, 'jev')} provider=official`, 'jev: auth test provider=official model=stub-model', a line starting 'jev: payload: committed packet descriptions, fixture probe text and track descriptions; planned calls: 19; estimated input tokens: ' that holds no '$', and 'verdict jev: keep K=6 M=6 A=6 B=0 W=6 L=0 F=0 p=0.01563 jev_version=0.6.2 provider=official model=stub-model'. In the jev log every line except '--version' contains '--provider official' and no other '--provider' value; there are 18 lines starting 'choice --provider official -q Which spec track is this text about? -o ', each with exactly 3 ' -o ' pairs. calls.jsonl has 19 lines, each with a numeric wallMs, an exitCode, jevVersion 'jev 0.6.2', provider 'official' and model 'stub-model'.
 2. 'stops with key rejected when a judgment exits 3 after the gate': keepCorpus(root, 'exit3') gives 'jev arm stopped: key rejected' and `jev: partial rows=${index}` (index as in the deem arm case), and no line starting 'verdict jev:'.
 3. 'prints requalify when the stored jev model differs': a stored <out>/report.json { columns: { jev: { provider: 'official', model: 'old-model' } } } gives 'requalify: model changed' on the line directly before the one starting 'verdict jev:'.

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
