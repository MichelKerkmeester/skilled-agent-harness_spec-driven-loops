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

TASK: add the Jev gate (identity line, pinned version, credential check, payload rule) to the D4 agreement script and wire it into main before the Deem block, with three tests. 2 files. The Jev arm itself comes in a later brief.
S = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
T = .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/tests/d4-agreement.vitest.ts
Read first: S, T, sections 7 and 8 of specs/cli-jev/003-cli-jev-workflow-integration/024-hallucination-grader/scratch/w4-build/design.md (implement ONLY the Jev gate), and `jevGate` in .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs:1463-1510 (read only; the model to port).

STEP 1. In S insert a section `// 8. JEV GATE` after `deemGate` and before the MAIN divider; renumber MAIN to 9, EXPORTS to 10, CLI ENTRYPOINT to 11. Add, JSDoc each:
- `JEV_VERSION = 'jev 0.6.2'` (comment: the pinned client version the gate accepts).
- `trackedFiles(dir, names)` returns a Set of the names git tracks: `spawnSync('git', ['ls-files', '-z', '--', ...names], { cwd: dir, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] })`; on `error` or non-zero status return an empty Set; else the NUL-separated, non-empty entries of stdout. A comment says an untracked output may hold text nobody committed, which is why it needs the operator's explicit accept before it leaves the machine.
- `jevGate(ctx)`, ctx `{ out, env, timeoutMs, outputsDir, labeledFiles, acceptPayload }`: the port of jevGate (provider `ctx.env.JEV_PROVIDER || 'official'`, identity line `jev: path=<path or none> provider=<P>`, then not on PATH / version with its `jev: found=<JSON> path=<path>` details line / `auth status --provider P` exit not 0 -> `no credential`), then the payload rule: `untracked` = count of `labeledFiles` not in `trackedFiles(ctx.outputsDir, labeledFiles)` (0 without calling git when labeledFiles is empty); when `untracked > 0` and `ctx.acceptPayload` is not true print `jev arm skipped: payload not accepted` and fail. Returns `{ passed, path, provider, untracked, reason? }`, reason = the skip line printed.
- Export `JEV_VERSION, trackedFiles, jevGate`.

STEP 2. In `main`, replace the line `  // The Jev block runs here, before the Deem block.` with:
```
  let jevResult;
  if (values.jev === true) {
    const jevCheck = jevGate({ out, env, timeoutMs, outputsDir: values.outputs, labeledFiles: rows.map((row) => row.file), acceptPayload: values['accept-payload'] === true });
    if (!jevCheck.passed) {
      jevResult = { skipped: jevCheck.reason };
    } else if (gate !== 'open') {
      const line = gate === 'headroom' ? 'jev arm skipped: no headroom' : 'jev arm skipped: label gate';
      out(line);
      jevResult = { skipped: line };
    } else {
      // The Jev arm runs here after a passing gate.
    }
  }
```

STEP 3. In T add `//   Jev gate (jevGate, trackedFiles)` to the MODULE header list and append `describe('score-d4-agreement jev gate', ...)`. Every run uses an env copy with PATH = `${stubs}${path.delimiter}${process.env.PATH}` and `delete env.JEV_PROVIDER`, and base = the same argv without `--jev`/`--out` over `writeFixtures()` and `writeOutputs(['fx-a.md', 'orphan.md'])`. Three it():
1. 'prints the identity line and passes when auth status exits 0': jev stub body `case "$1" in --version) echo 'jev 0.6.2';; auth) exit 0;; esac`; with `--jev --out <tempDir>`: code 0; lines equal `[...base.lines, \`jev: path=${path.join(stubs, 'jev')} provider=official\`, 'jev arm skipped: label gate']`; `jev.log` lines equal `['--version', 'auth status --provider official']`.
2. 'skips with no credential or a wrong version, the rest byte-identical': auth `exit 3` -> the lines after base.lines are `[identity line, 'jev arm skipped: no credential']`; a stub printing `0.2.3` for --version -> `[identity line, 'jev arm skipped: version', \`jev: found="0.2.3" path=${path.join(stubs, 'jev')}\`]`.
3. 'refuses untracked labeled outputs without --accept-payload and still runs the Deem gate': `labeledSet(0, 10, 20)`, stubs with the passing jev body and cli-deem `if [ "$1" = health ]; then echo '{"ok":true,"backend":"torch","model":"deem-0.8-v1","model_commit":"m1","source_commit":"s1"}'; exit 0; fi`; run with `--jev --deem --out <tempDir>`: code 0; lines contain 'jev arm skipped: payload not accepted' and then, later, 'deem: health backend=torch model=deem-0.8-v1 model_commit=m1 source_commit=s1'; `jev.log` contains no line starting with `noul` or `auth test`.

VERIFY (repo root; paste each command, its result line and exit code):
  node --check .skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs
  node -e "const m = require('./.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs'); console.log([...m.trackedFiles('.skilled/skills/system-deep-loop/deep-improvement/scripts/model-benchmark/scorer', ['score-model-variant.cjs', 'no-such.md'])].join(','))"   (expect score-model-variant.cjs)
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
