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

TASK: add R21's Deem half, the Gate 3 calibration: on every run where the Deem gate passes, one cli-deem noul per labeled prompt, and print its calibration line. Tests pin it.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read both first, runDeemArm most closely.

In the script:
1. Constants: const NOUL_QUESTION = 'Does this request require writing a file?'; const ARCHIVED_F1 = 0.9843;
2. `export function calibrationMetrics(pairs)` with JSDoc; pairs = Array<{ p, yes }>. With n = pairs.length and a prediction of yes when p >= 0.5, return { n, accuracy, f1, brier, ece5, temperature }: accuracy = correct / n; f1 = 2TP / (2TP + FP + FN), 0 when that denominator is 0; brier = mean of (p - y)^2 with y 1 for yes; ece5 = sum over 5 bins (bin = Math.min(4, Math.floor(p * 5))) of (bin count / n) * |mean p - mean y|; temperature = the T in 0.05, 0.06, ..., 10.00 (T = i / 100 for i = 5 to 1000) with the lowest NLL = -sum(y ln q + (1 - y) ln(1 - q)), q = 1 / (1 + exp(-logit(pc) / T)), pc = p clamped to [1e-6, 1 - 1e-6]; keep the first T on a tie. When n is 0 return { n: 0 } with the five others null.
3. In runDeemArm, move stop() and deemCall() above the `if (headroom === 'ok')` block, and give deemCall a third parameter persist (the callback it already calls after each spawn); the choice loop passes its current persist. Behavior of the choice arm stays the same.
4. After that block (so it also runs when headroom is 'none' or 'underpowered'): for each label of census.labels, { r, stop } = await deemCall(['noul', '-q', NOUL_QUESTION], label.prompt, persistNoul). p = JSON answers.answer.noul when r.code is 0, not timed out, and that value is a number in [0, 1]; status 'measured', else answer null and status 'unmeasured' ('unmeasured_timeout' when timed out). persistNoul writes { kind: 'noul', backend: 'deem', row_id: label.id, order: null, wall_ms, exit_code, model: gate.model, model_commit: gate.modelCommit, source_commit: gate.sourceCommit, answer: p or null, pick_prob: null, none_prob: null, status }. When stop is set return stop(stop, labelsDone). Measured labels become pairs { p, yes: label.yes }.
   m = calibrationMetrics(pairs); f = (v) => (v === null ? 'none' : v.toFixed(4)). out `calibration: backend=deem n=${census.labels.length} measured=${pairs.length} accuracy=${f(m.accuracy)} f1=${f(m.f1)} brier=${f(m.brier)} ece5=${f(m.ece5)} temperature=${m.temperature === null ? 'none' : m.temperature.toFixed(2)} archived_f1=${ARCHIVED_F1}`. No threshold is applied to raw probabilities.
   Return { column, calibration: { measured: pairs.length, ...m } }.

In the vitest file import calibrationMetrics and add describe('score-jev-tiebreak deem calibration'):
1. calibrationMetrics([{ p: 0.9, yes: true }, { p: 0.8, yes: true }, { p: 0.3, yes: false }, { p: 0.6, yes: false }]): n 4, accuracy 0.75, f1 0.8, brier close to 0.125, ece5 close to 0.3, temperature 0.53. calibrationMetrics([]) equals { n: 0, accuracy: null, f1: null, brier: null, ece5: null, temperature: null }.
2. stub = makeStub('cli-deem', body), body:
   if [ "$1" = health ]; then echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0; fi
   p=$(cat); if [ "$1" = noul ]; then case "$p" in *write*) v=0.9;; *) v=0.2;; esac; echo "{\"model\":\"deem-0.8-v1\",\"answers\":{\"answer\":{\"noul\":$v}}}"; exit 0; fi
   echo '{"model":"deem-0.8-v1","answers":{"answer":{"choice":"b","probabilities":{"b":0.8,"none":0.05}}}}'
   labels = [{ id: 'l1', prompt: 'write a file', yes: true }, { id: 'l2', prompt: 'read only', yes: false }, { id: 'l3', prompt: 'write docs', yes: true }]. With the six-row deem-arm census plus those labels, main(['--deem', '--out', dir], ...) prints a line starting 'deem: nothing leaves the machine planned_calls=21 ', a line starting 'verdict: ', and exactly 'calibration: backend=deem n=3 measured=3 accuracy=1.0000 f1=1.0000 brier=0.0200 ece5=0.1333 temperature=0.05 archived_f1=0.9843'; calls.jsonl holds 3 lines with kind 'noul', each with model_commit 'm1'.
3. Same stub and labels, six rows mk(id, 'a', ['a', 'b'], ['a', 'b']) (no movable row, so 'no headroom'): output has a line starting 'deem: nothing leaves the machine planned_calls=3 ', no line starting 'column:' and the same calibration line.

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
