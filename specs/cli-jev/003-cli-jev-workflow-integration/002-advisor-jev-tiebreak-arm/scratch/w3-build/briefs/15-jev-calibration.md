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

TASK: add R21's Jev half: when the census prints `underpowered` and the Jev gate passes, runJevArm asks one `jev noul` per labeled prompt over 3 passes in place of the choice arm, and prints a calibration line. Tests pin it.
R = .skilled/skills/system-skill-advisor/runtime. Files: R/scripts/routing-accuracy/score-jev-tiebreak.mjs and R/tests/parity/score-jev-tiebreak.vitest.ts. Read runJevArm, calibrationMetrics, main and the runDeemArm noul loop first.

In the script:
1. runJevArm reads ctx.mode, 'choice' by default. When ctx.mode is 'calibration', the payload line is instead: chars = sum over census.labels of (label.prompt.length + NOUL_QUESTION.length), times PASSES; out(`jev: payload=routing corpus prompts planned_calls=${census.labels.length * PASSES + 1} est_input_tokens=${Math.ceil(chars / 4)}`). The choice payload line is unchanged.
2. The auth test, its record and its stops are unchanged. Directly after the line that prints `jev: auth_test provider=... model=...`, when ctx.mode is 'calibration', run this and return, so no choice call is made:
   For each label of census.labels, pass 1..PASSES: result = await call(['noul', '--provider', provider, '-q', NOUL_QUESTION], label.prompt). p = parsed answers.answer.noul when result.code is 0, not timed out, and the value is a number in [0, 1], status 'measured'; otherwise p null and status 'unmeasured' ('unmeasured_timeout' when timed out). Exit 2, 3 and 130 set the same stop lines the choice loop uses. record(result, { kind: 'noul', row_id: label.id, pass, answer: p, pick_prob: null, none_prob: null, status }) comes first, then `if (stopLine !== null) return stop(stopLine, labelsDone)`. Every call's wall time goes to a list for latency.
   A label is measured only when all 3 passes gave a p. For a measured label: pairs.push({ p: mean of its 3 p, yes: label.yes }); flips += Math.min(yesVotes, 3 - yesVotes) with yesVotes the passes with p >= 0.5; measuredCalls += 3. labelsDone counts labels whose 3 passes finished.
   m = calibrationMetrics(pairs); f = (v) => (v === null ? 'none' : v.toFixed(4)); flip = measuredCalls === 0 ? null : flips / measuredCalls; p50 and p95 by nearest rank over the wall times, printed with Math.round or 'none'.
   out(`calibration: backend=jev n=${census.labels.length} measured=${pairs.length} accuracy=${f(m.accuracy)} f1=${f(m.f1)} brier=${f(m.brier)} flip=${f(flip)} latency_p50_ms=${p50} latency_p95_ms=${p95} archived_f1=${ARCHIVED_F1} provider=${provider} model=${model}`)
   Return { calibration: { measured: pairs.length, flip, latency: { p50, p95 }, ...m } }. No verdict line and no column lines print in this mode.
3. In main, old:
      if (gate.passed && summary.headroom === 'ok') {
        await runJevArm(census, gate, { out, env, timeoutMs, backoffMs, outDir: values.out });
      }
   New: the same block followed by
      else if (gate.passed && summary.headroom === 'underpowered') {
        await runJevArm(census, gate, { out, env, timeoutMs, backoffMs, outDir: values.out, mode: 'calibration' });
      }
   Update runJevArm's JSDoc for ctx.mode.

In the vitest file add describe('score-jev-tiebreak jev calibration') with one it (60_000 timeout):
   stub = makeStub('jev', body), body:
     case "$1" in --version) echo 'jev 0.6.2'; exit 0;; auth) [ "$2" = test ] && echo '{"ok":true,"valid":true,"model":"stub-model"}'; exit 0;; esac
     p=$(cat); case "$p" in *bad*) echo 'not json'; exit 0;; *write*) v=0.9;; *) v=0.2;; esac
     echo "{\"model\":\"stub-model\",\"answers\":{\"answer\":{\"noul\":$v}}}"
   census = { ...synthCensus(), labels: [{ id: 'l1', prompt: 'write a file', yes: true }, { id: 'l2', prompt: 'read only', yes: false }, { id: 'l3', prompt: 'write docs', yes: true }, { id: 'l4', prompt: 'bad row', yes: false }] } (synthCensus has one movable row, so it is underpowered).
   main(['--jev', '--out', dir], { census, out, env: { ...process.env, PATH: `${stub}${delimiter}${process.env.PATH}`, JEV_PROVIDER: 'openrouter' }, timeoutMs: 1500, backoffMs: 10 }), dir from mkdtempSync, both dirs removed in finally. Expect:
   - code 0; lines contain 'underpowered' and 'jev: payload=routing corpus prompts planned_calls=13 est_input_tokens=152'
   - one line starting 'calibration: backend=jev n=4 measured=3 accuracy=1.0000 f1=1.0000 brier=0.0200 flip=0.0000 latency_p50_ms=' and ending ' archived_f1=0.9843 provider=openrouter model=stub-model'
   - no line starting 'verdict: ' or 'column: '
   - calls.jsonl: 12 lines with kind 'noul', every one with provider 'openrouter'; the 3 for row_id 'l4' have status 'unmeasured' and answer null
   - the stub log has 12 lines starting 'noul --provider openrouter -q ' and none starting 'choice'

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
