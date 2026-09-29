TASK: add the Jev gate and the payload gate behind `--jev`, run before the Deem arm, with tests.
S = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.mjs (exists)
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists)
M = .skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs (read only). Read S and T in full, then M lines 1455-1510. Everything you need is in this brief: do not read spec, plan or scratch files. Keep existing lines unless a step names them. Same style as S. Make the edits, then run the checks and hand back.

STEP 1. In S, insert section `8. JEV ARM` directly above the three-line header of section 9 (the rule line, `// 9. ENTRY POINT`, the rule line), so it follows the end of section 7 (`runDeemArm`). Give it the same three-line header shape, then a comment: the gate runs only behind `--jev`, reads no key and passes none, because jev resolves its own credential.
a. Copy from M with JSDoc, changing nothing: `JEV_VERSION` (M:1462-1463) and `jevGate` (M:1465-1510).
b. Add `export function payloadClass(maskedFiles)`: for each distinct `path.dirname(file)` of maskedFiles, run `spawnSync('git', ['-C', dir, 'ls-files', '-z', '--', '.'], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 10000 })`; the tracked names are `new Set(result.stdout.split('\0').filter(Boolean))` when status is 0, else an empty set. When any masked file's `path.basename(file)` is not tracked, return `'untracked masked replies'`; otherwise `'committed masked replies'`. JSDoc says why: an untracked masked file may hold text never meant to leave this machine, so Jev needs `--accept-payload` for it.

STEP 2. In `main`, directly above the line `  // A skipped or refused gate leaves every earlier line as it was.` (it sits above `let deemResult;`), add the Jev block, with a comment that Jev goes first, then Deem, each only on its own switch and checks, and a failed check never starts the other arm:
```
let jevResult;
if (values.jev === true) {
  const check = jevGate({ out, env, timeoutMs });
  if (!check.passed) {
    jevResult = { skipped: check.reason };
  } else {
    const payload = payloadClass(census.maskedFiles);
    if (payload === 'untracked masked replies' && values['accept-payload'] !== true) {
      out('jev arm skipped: payload not accepted');
      jevResult = { skipped: 'jev arm skipped: payload not accepted' };
    } else if (summary.gate !== 'planned') {
      const line = `jev arm skipped: ${summary.gate === 'stop' ? 'label gate' : 'no headroom'}`;
      out(line);
      jevResult = { skipped: line };
    } else {
      // The Jev arm runs here after a passing gate.
    }
  }
}
```
Match main's own variable names. In the `buildReport` call, change `jev: undefined,` to `jev: jevResult,`.

STEP 3. In T, change `stubEnv` so the returned object sets `JEV_PROVIDER: ''` after the PATH and STUB_LOG keys and before `...extra`, so a provider set in the caller's shell never leaks into a test. Then add four tests on `makeFixture()` with `makeStubBin(root)`, each comparing against a default run of the same fixture:
37. `--jev --out <root>/out` with `STUB_AUTH_STATUS_EXIT: '3'`: code 0, lines equal the default lines followed by exactly `` `jev: path=${path.join(root, 'bin', 'jev')} provider=official` `` and `jev arm skipped: no credential`. The stub log's first two tab fields are `jev`/`--version` then `jev`/`auth status --provider official`.
38. `--jev --accept-payload --out <root>/out`: code 0, and the last two lines are the same identity line and `jev arm skipped: label gate`.
39. With `scenario(fixture, (g) => g)` labels and answers, `--labels <labels> --jev --deem --out <root>/out` without `--accept-payload`: lines include `jev arm skipped: payload not accepted`, the last line starts `verdict deem: keep`, and no stub log line starts `'jev\tscore'`.
40. `payloadClass` over `buildCensus(maskedDirs, repliesDirs).maskedFiles` is `'untracked masked replies'`, and `payloadClass([{ file: <absolute path of the script's own score.mjs> }])` is `'committed masked replies'`.

Accept when: 2 files changed (S and T), no other file changed, both pass `node --check`, and `grep -c "^export function" S` prints 31.
Checks you run: `node --check S`, `node --check T`, that grep. Do not run `node --test`: the orchestrator runs it.
