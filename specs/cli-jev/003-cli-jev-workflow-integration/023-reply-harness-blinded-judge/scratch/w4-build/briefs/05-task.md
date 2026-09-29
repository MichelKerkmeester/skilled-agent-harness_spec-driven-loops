TASK: add stub `cli-deem` and `jev` binaries to the test file, so later tests can put logging fakes first on PATH.
T = .skilled/skills/sk-communication/benchmark/reply-harness/judge-agreement.test.mjs (exists; the only file you edit)
D = specs/cli-jev/003-cli-jev-workflow-integration/023-reply-harness-blinded-judge/scratch/w4-build/drafts/stub-main.js (read only)
Read T and D in full first. Keep every existing line of T unchanged.

STEP 1. In T, after the `makeFixture` helper, paste D lines 1-36 verbatim: the one comment line and the whole `function stubMain() { ... }`. Do not reformat it, do not change a character. It uses `require` on purpose: T never calls it, it is written to disk as its own CommonJS program.

STEP 2. In T, directly below it, add one constant and three helpers:
- `const STUB_SOURCE = \`#!/usr/bin/env node\n(${stubMain.toString()})();\n\`;`
- `makeStubBin(root)`: creates `path.join(root, 'bin')`, writes STUB_SOURCE to `bin/cli-deem` and `bin/jev` with `{ mode: 0o755 }`, and returns the bin path.
- `stubEnv(root, extra = {})`: returns `{ ...process.env, PATH: \`${path.join(root, 'bin')}${path.delimiter}${process.env.PATH}\`, STUB_LOG: path.join(root, 'stub.log'), ...extra }`.
- `readStubLog(root)`: the non-empty lines of `path.join(root, 'stub.log')`, or `[]` when the file does not exist.
Import `spawnSync` from `node:child_process` for the tests below.

STEP 3. Add two tests after the existing ones, each on a fresh `fs.mkdtempSync(path.join(os.tmpdir(), 'judge-agreement-test-'))` root removed in a `finally`:
17. After `makeStubBin(root)`, `spawnSync('jev', ['--version'], { env: stubEnv(root), encoding: 'utf8' })` has status 0 and stdout `'jev 0.6.2\n'`, and `readStubLog(root)` is one line starting `'jev\t--version'`. With `extra` `{ STUB_HEALTH: 'stub' }`, `spawnSync('cli-deem', ['health'], ...)` has status 3.
18. Write `answers.json` in root as `{ [\`${sha256Hex('state')}|Q\`]: [2, 2, 0] }` and pass `{ STUB_ANSWERS: <that path> }`. Three runs of `spawnSync('jev', ['score', '--provider', 'official', '-q', 'Q', '-l', 'a', '-l', 'b', '-l', 'c'], { env, input: 'state', encoding: 'utf8' })` print JSON whose `answers.answer.score` is 2, then 2, then 0. Import `sha256Hex` from the script.

Accept when: 1 file changed (T), no other file changed, `node --check T` passes, and `grep -c "function stubMain" T` prints 1.
Checks you run: `node --check T`, `grep -c "function stubMain" T`. Do not run `node --test`: the orchestrator runs it.
