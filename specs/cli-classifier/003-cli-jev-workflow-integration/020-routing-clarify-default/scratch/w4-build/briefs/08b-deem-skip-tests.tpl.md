@@PREAMBLE_CODE@@

TASK: test-only change. Pin the two Deem skip lines no test covers yet: `model` and `bad health response`. Do not edit the script.

FILE (edit): .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs
a. In the `makeStubs` helper, the `cli-deem` stub's `health` case switches on `${STUB_HEALTH:-ok}` with the modes `ok`, `stub` and `down`. Add two modes there and change nothing else in the stub:
   - `model`: echo `{"ok":true,"backend":"torch","model":"deem-9b-v1","model_commit":"mc1","source_commit":"sc1"}` and exit 0.
   - `bad`: echo `not json` and exit 0.
b. Append one test after the last one:
28. `a deem stub with another model or an unreadable health answer skips with a details line`: 30 `'second'` rows (the `writeRowsFile` helper), `base` = `runWithStubs(stubs, ['--score', rows])`. Run `runWithStubs(stubs, ['--score', rows, '--deem', '--out', <fresh tmp dir>], { STUB_HEALTH: 'model' })`: status 0, stdout includes `deem arm skipped: model` and `deem: found="deem-9b-v1"`, and `withoutLines(stdout, ['deem arm skipped: model', 'deem: found="deem-9b-v1"'])` equals `base.stdout`. Run it again with `STUB_HEALTH: 'bad'`: stdout includes `deem arm skipped: bad health response` and `deem: found="not json"`, and without those two lines it equals `base.stdout`.

Accept when: 1 file changed (the test file), `node --check` passes on it, and `grep -c "^test(" <test file>` prints 28.

@@TAIL@@

Checks to run: `node --check .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs` and `grep -c "^test(" .skilled/skills/sk-doc/sk-create-skill/scripts/tests/score-clarify-default.test.cjs`.

@@HANDBACK@@
