GATE 3 IS PRE-RESOLVED. DO NOT ASK THE DOCUMENTATION-SCOPE QUESTION.

You are a non-interactive dispatched worker. `AI_SESSION_CHILD=1` and
`SYSTEM_SPEC_GATE_ENFORCE=0` are set in your environment, which this repository's AGENTS.md
defines as the autonomous child-dispatch exemption: the spec-folder question is pre-resolved
and MUST NOT be asked. No answer can reach you, because nobody is at a prompt.

Your write authority is already bound. The spec folder is:
  specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader

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

TASK: add the Deem gate (a local health check behind --deem) to the D4 agreement script and wire it into main, with three tests. 2 files. The Deem arm itself comes in a later brief.
S = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
T = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts
Read first: S, T, sections 7 and 9 of specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/design.md (implement ONLY the Deem gate), and the code you port: .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs lines 1024-1186 (read only; ESM there, CommonJS here).

STEP 1. In S insert a section `// 7. DEEM GATE` between `summarizeColumn` and the MAIN divider; renumber MAIN to 8, EXPORTS to 9, CLI ENTRYPOINT to 10. Port, keeping behavior and JSDoc: `DEEM_MODEL = 'deem-0.8-v1'`, `DEEM_P50_MS = 60.5` (comment: the noul p50 in deem-local.md, used for the wall-time estimate), `HEALTH_TIMEOUT_MS = 10000` (comment: process cap; cli-deem applies its own 2,000 ms HTTP timeout), `REPO_CLI_DEEM = path.resolve(__dirname, '../../../../../cli-classifier/cli-deem/scripts/cli-deem.mjs')`, `which(name, env)`, `deemCommand(env)`, `readDeemHealth(cmd, env)` and `deemGate(ctx)` exactly as in lines 1054-1186 of that file. Export `DEEM_MODEL, DEEM_P50_MS, which, deemCommand, readDeemHealth, deemGate`.

STEP 2. In `main`, replace the marker line `  // Arms run here: the Jev block, then the Deem block.` with:
```
  // The Jev block runs here, before the Deem block.
  let deemResult;
  if (values.deem === true) {
    const deemCheck = deemGate({ out, env });
    if (!deemCheck.passed) {
      deemResult = { skipped: deemCheck.reason };
    } else if (gate !== 'open') {
      const line = gate === 'headroom' ? 'deem arm skipped: no headroom' : 'deem arm skipped: label gate';
      out(line);
      deemResult = { skipped: line };
    } else {
      // The Deem arm runs here after a passing gate.
    }
  }
```

STEP 3. In T add `//   Deem gate (deemGate)` to the MODULE header list and append `describe('score-d4-agreement deem gate', ...)`. Use `const HEALTHY = 'if [ "$1" = health ]; then echo \'{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}\'; exit 0; fi';` and `base = await runMain(['--outputs', outputs, '--fixtures', fixtures])` over `writeFixtures()` and `writeOutputs(['fx-a.md', 'orphan.md'])`, with env PATH = `${stubs}${path.delimiter}${process.env.PATH}` for every run. Three it():
1. 'passes a healthy server and prints the commit pair': stubs `stubDir({ 'cli-deem': HEALTHY })`; run `[...base argv, '--deem', '--out', tempDir('d4-out-')]`; code 0; `lines` equal `[...base.lines, 'deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1', 'deem arm skipped: label gate']`; the stub log file `cli-deem.log` holds exactly one line, `health`.
2. 'skips a stub backend with the rest of the output byte-identical': the stub echoes `{"ok":true,"backend":"stub","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}` for health; code 0; lines contain 'deem arm skipped: stub backend'; lines without that one line equal base.lines.
3. 'skips an unreachable server, a wrong model and a bad health body': stub bodies `exit 4`, then the torch body with `"model":"other"`, then `echo 'not json'`; the new lines after base.lines are, in turn, `['deem arm skipped: not reachable']`, `['deem arm skipped: model', 'deem: found="other"']` and `['deem arm skipped: bad health response', 'deem: found="not json"']`.

VERIFY (repo root; paste each command, its result line and exit code):
  node --check .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
  node -e "const m = require('./.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs'); console.log(m.deemCommand({ PATH: '' }).join(' '))"   (expect the node path, a space, then the absolute path ending in cli-classifier/cli-deem/scripts/cli-deem.mjs)
  test -f .skilled/skills/cli-classifier/cli-deem/scripts/cli-deem.mjs && echo present   (expect present)
Accept when: 2 files changed (S and T) and nothing else; each check prints what it expects.

RUN CONTEXT
- Repo root, a git worktree. Run every command from here:
  /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.worktrees/069-cli-jev-workflow-integration
- Spec folder (pre-approved, Gate 3 answered): specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader
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
