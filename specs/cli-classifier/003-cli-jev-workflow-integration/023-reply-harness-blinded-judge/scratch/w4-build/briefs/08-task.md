TASK: add the Deem gate behind `--deem`, so a requested Deem arm checks the local server before any call, with tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
M = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only, the model)
Read S and T in full, then M lines 1016-1188. Keep every existing line unchanged except where STEP 2 adds lines. Same style as S.

STEP 1. In S, insert section `7. DEEM ARM` between section 6 and section 9, starting with a comment: the gate runs only behind `--deem`, reads the local model's health once, passes no key and never starts the server.
a. Exported constants: `DEEM_MODEL = 'deem-0.8-v1'`; `DEEM_P50_MS = 60.2` with JSDoc "Deem 3-level score p50 in milliseconds, from deem-local.md, used for the wall-time estimate."; `HEALTH_TIMEOUT_MS = 10000` with JSDoc "Bounds the health spawn; cli-deem bounds its own HTTP health request at 2,000 ms."
b. Not exported: `REPO_CLI_DEEM = path.join(REPO_ROOT, '.skilled', 'skills', 'cli-classifier', 'cli-deem', 'scripts', 'cli-deem.mjs')`, the repo copy run under node when no `cli-deem` is on PATH.
c. Copy these four functions from M with their JSDoc, changing nothing but what the names above require: `which` (M:1045-1068, not exported), `deemCommand` (M:1070-1080), `readDeemHealth` (M:1082-1146), `deemGate` (M:1148-1167).

STEP 2. In `main` in S, after the loop that prints the summary lines and before `return 0`, add:
```
let deemResult;
if (values.deem === true) {
  const check = deemGate({ out, env });
  if (!check.passed) {
    deemResult = { skipped: check.reason };
  } else if (summary.gate !== 'planned') {
    const line = `deem arm skipped: ${summary.gate === 'stop' ? 'label gate' : 'no headroom'}`;
    out(line);
    deemResult = { skipped: line };
  } else {
    // The Deem arm runs here after a passing gate.
  }
}
```
Use the variable names `main` already has for the parsed values and the summary result; if they differ, keep main's names and change only this block to match. A comment above the block says a skipped or refused gate leaves every earlier line as it was.

STEP 3. In T, add two tests on `makeFixture()` with `makeStubBin(root)`, both comparing against a default run (no `--deem`) of the same fixture and env:
28. `--deem --out <root>/out`: code 0, and the lines equal the default run's lines followed by exactly `deem: health backend=torch model=deem-0.8-v1 model_commit=stubmodel source_commit=stubsource` and `deem arm skipped: label gate`. `readStubLog(root)` is one line starting `'cli-deem\thealth'`.
29. The same with `stubEnv(root, { STUB_HEALTH: 'stub' })`: code 0, and the lines equal the default run's lines followed by exactly `deem arm skipped: stub backend`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 23.
Checks you run: `node --check S`, `node --check T`, that grep. Do not run `node --test`: the orchestrator runs it.
