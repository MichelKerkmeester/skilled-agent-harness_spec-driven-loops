# Build design: an opt-in Pi transport for `choice`

One shared module answers a `choice` question through Pi's classifier runtime and returns what a
`jev` caller reads today, dormant unless a caller or the environment names it. The `jev` CLI stays
the default and the fallback. Every path, line and signature below was read in this worktree;
anything else is marked `(proposed)`.

Move chosen on the reversal-cost ladder: **add one new module + one test file** (`.mjs`), no facade
file, no new dependency (Pi's SDK is reached by a lazy `await import()` of the already-installed
package, exactly as the sibling scorer does), and no retry, cache or config object inside it. What
fails at the cheaper move (extending an existing caller in place) is that two callers in two skill
trees need the same seam with the same switch.

---

## 1. Caller review

Census of the three candidates `spec.md` section 10 Q3 names. All spawn shapes and field reads are
from the files named; the shapes are identical across all three, which is what makes one module
serve them.

| Caller | Language | Spawn | Args it passes | Fields it reads |
|---|---|---|---|---|
| `benchmark/pi-transport/score-pi-transport.mjs:908-909` (CLI arm) | ESM | `await spawnCall(...)`, imported at `:38` from `system-skill-advisor/.../score-jev-tiebreak.mjs:785` | `['choice','--provider',provider,'-q',CHOICE_QUESTION,...order.args]` | `timedOut`, `code`, `stdout` (`readProbabilities` at `score-suggested-order.mjs:82`), `wallMs` (`:911`) |
| `sk-create-skill/scripts/leaf-route-replay.cjs:1342` | CJS | `await spawnCall(...)`, local at `:1026`, inside `call()` `:1341` | `['choice','--provider',provider,'-q',CHOICE_INSTRUCTION,...optionArgs(order,texts)]` (`:1415`) | `judgeChoice` `:1115-1138`: `timedOut`, `code`, `JSON.parse(stdout).answers.answer.choice` (`:1130`), `.probabilities[pick]` (`:1133`); `body.model` (`:1419-1425`); `code`/`wallMs` into `writeCall` |
| `sk-create-skill/scripts/score-clarify-default.cjs:1150` | CJS | `await spawnCall(...)`, local at `:889`, inside `call()` `:1149` | same shape (`:1222`) | `judgeChoice` `:978-1000`: `.choice` (`:993`), `.probabilities[pick]` (`:996`); `body.model` after a measured call |

**A. `benchmark/pi-transport/score-pi-transport.mjs` — REJECT.** This arm *is* the CLI column of a
two-arm measurement; the Pi column already exists beside it (`runPiArm`, `:655`). Opting in means
either pinning `transport: 'jev'` (a diff that can never use Pi) or letting the ambient switch turn
the CLI column into a second Pi column, which silently destroys the comparison the file exists to
produce. Its unwired `spawnCall` already keeps the ambient switch out of the measurement, which is
the behavior this phase wants there. One call-site change is possible (`:909`) but buys nothing.

**B. `sk-create-skill/scripts/leaf-route-replay.cjs` — APPROVE.** One call site: the local `call()`
helper (`:1341-1342`), which the arm reaches for its three rotated choice calls (`:1416`) and for its
auth test (`:1377`). The change replaces the spawn expression at `:1342` with the module call and adds
one `require` line; `judgeChoice`, `writeCall`, the exit-2/3/130 stops (`:1442-1445`), the exit-4
retry (`:1359`) and the verdict lines stay untouched, because the module returns the same
`{ code, stdout, stderr, wallMs, timedOut }` contract. Switch-off bytes are unchanged: the module's
CLI branch is the same bounded spawn with the same args, stdin, env and timeout. The retry at `:1359`
stays on the caller's own `spawnCall` on purpose: the module never retries, so a Pi failure falls back
to the CLI and the CLI's own retry policy then applies. The auth test passes through the module and
takes the CLI branch unchanged (section 3).

**C. `sk-create-skill/scripts/score-clarify-default.cjs` — APPROVE.** Identical shape and identical
reasoning; the one call site is `call()` at `:1149-1150`, reached by the choice calls (`:1223`) and the
auth test (`:1185`), with the same retry at `:1167` and the same stop lines (`:1249-1251`).

Out, and why: `sk-communication/benchmark/reply-harness/judge-agreement.mjs` is a `score` question
(`spec.md` section 10 Q3), `benchmark/injection-screen/score-injection-screen.mjs` and
`sk-doc/shared/scripts/cite-drift-scan.mjs` are `noul`, and `sk-create-with-human-voice/scripts/hvr_reader_lens.py`
is a Python reader. None is a `choice` consumer.

---

## 2. Interface

**Module.** `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs` (the `shared/` tier's
first helper; `shared/README.md` already reserves the directory). **Tests.**
`.skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs`, `node --test`, the
convention of `benchmark/pi-transport/tests/score-pi-transport.test.mjs`. No other file: the `.cjs`
callers reach the module directly (below), so no facade is added.

**Switch**, resolved in `resolveTransport` and nowhere else:

| Input | Route |
|---|---|
| env `JEV_TRANSPORT` undefined or `''`, no option | `jev` (today's CLI), silent |
| env `JEV_TRANSPORT=jev` | `jev`, silent |
| env `JEV_TRANSPORT=pi`, or option `transport: 'pi'` | Pi for a `choice` request; CLI otherwise |
| any other value | one line `skip: unknown transport '<value>', using jev CLI`, then the CLI |

The per-call option wins over the environment. Values are compared verbatim; only `''` counts as
unset. The environment is read from the `env` object the caller already passes to `jev` — the same
object its own gate used — never from `process.env` directly, so a narrow env means the CLI.

**Exports** (`(proposed)` signatures; constants `TRANSPORT_ENV = 'JEV_TRANSPORT'`,
`PI_PROVIDER = 'openrouter'`, `PI_MODEL_ID = 'typesafe/jev-1.13'`, `ANSWER_NAME = 'answer'`):

| Function | Signature | Returns |
|---|---|---|
| `resolveTransport` | `(option: 'jev'\|'pi'\|undefined, env) -> { transport, line }` | the route and the one unknown-value line or `null` |
| `choiceRequestFrom` | `(args: string[]) -> { question, keys, criteria } \| null` | the parsed request, or `null` when the args are not the declared shape |
| `classifierContextFor` | `(request, stateText: string) -> object` | Pi's `ClassifierContext` |
| `choicePayloadFor` | `(answer, keys: string[], model: string) -> object \| null` | the CLI-shaped payload, or `null` when the answer does not cover the submitted keys |
| `spawnClassifierCall` | `async (options, deps = {}) -> { code, stdout, stderr, wallMs, timedOut }` | the caller's own spawn contract, from either backend |

`options` for `spawnClassifierCall`: `{ file, args, stdin, env, timeoutMs, transport, report }`.
`deps`: `{ spawn, runtime }` — the test seams, the pattern `readPiCensus(env, deps)` and
`runPiArm(deps)` already use at `score-pi-transport.mjs:390` and `:655`. `report` is a
`(line) => void` sink defaulting to `process.stdout.write(line + '\n')`; both approved callers pass
their own `out`, which is in scope at their call site (`leaf-route-replay.cjs:1316`,
`score-clarify-default.cjs:1125`). Three options exist because three callers need them today: the
switch (`spec.md` REQ-002), the sink (two callers), the two test seams (the suite).

**Returned shape, field for field against the jev CLI's `choice` JSON.** The module returns the spawn
outcome, and its Pi branch serializes the CLI's JSON onto `stdout`:

| CLI JSON (the shape callers parse) | Pi branch emits | Read by |
|---|---|---|
| `answers.answer.choice` | the answer's `choice` | `leaf-route-replay.cjs:1130`, `score-clarify-default.cjs:993` |
| `answers.answer.probabilities` | the answer's `probabilities` | `:1133`, `:996`, `score-suggested-order.mjs:85-99` |
| `answers.answer.confidence` | Pi's own value; callers ignore it | — |
| top-level `model` | Pi's model id | `leaf-route-replay.cjs:1419-1425`, `score-clarify-default.cjs` |
| exit `0` = a judgment was produced (`cli-usage/SKILL.md:169`) | `code: 0`, `stderr: ''`, `timedOut: false` | `judgeChoice`, `readProbabilities` |

Emitted bytes: `JSON.stringify(payload) + '\n'` — compact, like the CLI's default output, with the
trailing newline Python's `print` produces. `wallMs` is measured around the Pi call.

**A `choice` request maps to Pi's `classify()` and back.** The declared shape is
`choice [--provider <p>] [-q <text>] (-o <key>=<desc>)+` with the state on stdin; anything else
(another subcommand, `-s/--state`, `--pretty`, `--value`, `--endpoint`) makes `choiceRequestFrom`
return `null`. `-o` pairs keep argument order and a pair with no `=` is dropped, matching
`criteriaMap` at `score-pi-transport.mjs:462-471`. `classifierContextFor` builds
`{ state: { request: stdinText }, questions: { answer: { type: 'choice', instructions: <the -q text>,
criteria: <the -o map> } } }` — the shape `toClassifierContext` builds at `:482-491` and Pi's
`ClassifierContext` declares (`pi-ai/dist/types.d.ts:467`). Back: `runtime.classify(model, context,
{ signal })` (`dist/core/model-runtime.d.ts:106`, `ClassifierResult` at `types.d.ts:488`) →
`choicePayloadFor` reads `answers.answer.{ choice, probabilities, confidence }` and returns `null`
unless every submitted key holds a finite number and `choice` is one of the keys submitted — the
boundary `probabilitiesFrom` draws at `score-pi-transport.mjs:504-516`.

**Sync or async.** `spawnClassifierCall` is async: it awaits the spawn, `ModelRuntime.create()` and
`classify()`. All approved call sites are inside `async` functions, so no caller changes shape.

**How a `.cjs` caller reaches it.** `require('../../../cli-classifier/shared/scripts/jev-transport.mjs')`
at the top of each `.cjs` caller. A `.cjs` file cannot `require` a module with top-level `await`, so
the module ships **no top-level await** and keeps an async graph only inside functions; the Pi SDK is
imported lazily inside the Pi branch (`await import(pathToFileURL(path.join(packageDir,'dist','index.js')))`,
the pattern at `score-pi-transport.mjs:352-356`). Node ≥ 22.12 resolves this form
(`node --version` here: v26.8.2; 14 `.cjs` files in this tree already `require` an `.mjs`). A test
pins it: `createRequire(import.meta.url)` loads the module and asserts the five exports are functions.

---

## 3. Gates

**Switch-off parity.** The module's CLI branch is a line-for-line port of the callers' own
`spawnCall` (`leaf-route-replay.cjs:1026-1061`): `spawn(file, args, { env, stdio: ['pipe','pipe','pipe'] })`,
utf8 on both pipes, `stdin.on('error')` swallowed, `stdin.end(stdinText)`, `setTimeout` → `SIGKILL`
and settle `{ code: null, timedOut: true }`, `close` → `code ?? -1`, `error` → `{ code: 127,
stderr: error.message }`, resolve once. Same file, same args, same stdin, same timeout, **no `cwd`**,
no added line, no file, no second process, and no Pi import on that path.

**The `choice`-only type gate.** The Pi route is entered only when `choiceRequestFrom(args) !== null`.
Every other invocation — `auth`, `noul`, `score`, `run`, an unmappable `choice` flag — is spawned on
the CLI unchanged and **prints nothing**. Reason: the switch selects a transport for `choice`
questions; for any other request there is no transport decision to report, and a line per
pass-through would add output to callers whose bytes must not move under any switch state. This is
also why the two approved callers can route their auth test through `call()` without special cases.

**The three Pi gates, in the order `spec.md` section 4 fixes. The first failure stops the Pi path.**
Each failure prints exactly one line to the `report` sink and then runs the CLI branch, so the caller
still receives a CLI-shaped outcome:

| Gate | Checked with | Line on failure |
|---|---|---|
| 1. package | `resolvePiPackage(env)` (ported from `score-pi-transport.mjs:123-149`) resolves, and `ModelRuntime.create()` does not throw | `skip: pi transport unavailable (package), using jev CLI` |
| 2. model | `runtime.getModelOfType('classifier', 'openrouter', 'typesafe/jev-1.13')` is defined | `skip: pi transport unavailable (model), using jev CLI` |
| 3. credential | `await runtime.getAvailableOfType('classifier', 'openrouter')` lists `typesafe/jev-1.13`; Pi's availability read is the credential signal, the way the census counts `known` against `available` at `score-pi-transport.mjs:361-377` | `skip: pi transport unavailable (credential), using jev CLI` |
| backend | `classify()` throws, `stopReason === 'error'`, the answer names a key that was not submitted, or a submitted key has no finite probability | `skip: pi transport unavailable (backend), using jev CLI` |

The call itself uses `AbortSignal.timeout(timeoutMs)` with the caller's own bound. A gate failure
never calls Pi, never changes the answer's type or shape, and is never silent. Pi is reached only
after all three gates pass. No retry runs inside the module.

**CLI also unavailable.** The module's spawn error is `{ code: 127, stderr: <message> }`, which is
what the callers' own `spawnCall` returns today. In practice the caller's gate stops first: its
`jevGate` runs `command -v jev` and `--version` (`cli-usage/SKILL.md:97`; `leaf-route-replay.cjs:720-746`)
and `auth status` refuses on exit 3 (`:1400-1402`), so the caller stops with the CLI's own error and
exit status, unchanged.

**Credentials.** The module calls `ModelRuntime.create()` and lets Pi resolve credentials from its own
store. It reads no `.env`, prints no environment variable, copies no key into Pi's options, and
writes no line containing one. `grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization'` on the module
exits 1. The `env` object is passed only to the `jev` child, as today.

---

## 4. Test cases

`name | input | expected` — both backends stubbed (`deps.spawn`, `deps.runtime`), no socket, no key.

| Test | Input | Expected |
|---|---|---|
| `resolve_transport_defaults_to_cli` | `(undefined, {})` | `{ transport: 'jev', line: null }` |
| `resolve_transport_reads_the_environment` | `(undefined, { JEV_TRANSPORT: 'pi' })` | `{ transport: 'pi', line: null }` |
| `resolve_transport_option_wins_over_the_environment` | `('jev', { JEV_TRANSPORT: 'pi' })` | `{ transport: 'jev', line: null }` |
| `resolve_transport_empty_value_is_unset` | `('', { JEV_TRANSPORT: '' })` | `{ transport: 'jev', line: null }` |
| `resolve_transport_unknown_value_names_itself` | `('auto', {})` | `{ transport: 'jev', line: "skip: unknown transport 'auto', using jev CLI" }` |
| `choice_request_parses_the_cli_arguments` | `['choice','--provider','official','-q','Q','-o','a=A','-o','b=B']` | `{ question: 'Q', keys: ['a','b'], criteria: { a: 'A', b: 'B' } }` |
| `choice_request_rejects_any_other_invocation` | `['noul',…]`, `['auth','test',…]`, `['choice','--pretty',…]`, `['choice','-s','-',…]` | `null` each |
| `classifier_context_carries_the_state_and_ordered_criteria` | request + `'the row prompt'` | `{ state: { request: 'the row prompt' }, questions: { answer: { type: 'choice', instructions: 'Q', criteria: { a: 'A', b: 'B' } } } }` |
| `choice_payload_matches_the_cli_shape` | answer with a full map over the submitted keys | `{ answers: { answer: { choice, probabilities, confidence } }, model }`; extra keys ignored |
| `choice_payload_rejects_a_partial_or_foreign_pick` | a submitted key without a number; a `choice` outside the submitted keys | `null` each |
| `spawn_call_switch_off_is_the_cli_spawn` | switch off, spawn stub, choice args | one `spawn(file, args, { env, stdio })`, stdin ended once, outcome passed through, `runtime` never read, nothing printed |
| `spawn_call_switch_on_answers_through_pi` | switch on, runtime stub, spawn stub | one `classify(model, context, { signal })`, zero spawns, `{ code: 0, stdout: <CLI-shaped JSON> + '\n', stderr: '', timedOut: false }` |
| `spawn_call_package_gate_falls_back` | switch on, empty `PATH` so no `pi` resolves | line `(package)` once, then one CLI spawn |
| `spawn_call_model_gate_falls_back` | runtime stub without the model | line `(model)` once, one CLI spawn, zero `classify` calls |
| `spawn_call_credential_gate_falls_back` | `getAvailableOfType` returns `[]` | line `(credential)` once, one CLI spawn, zero `classify` calls |
| `spawn_call_backend_refusal_falls_back` | `classify` throws; and `stopReason: 'error'` | line `(backend)` once each, then one CLI spawn, no payload |
| `spawn_call_partial_map_falls_back` | answer missing one submitted key | line `(backend)` once, then one CLI spawn |
| `spawn_call_never_reaches_pi_for_another_type` | switch on, `['score',…]` and `['auth','test',…]` | zero `classify` calls, zero lines, one CLI spawn each |
| `spawn_call_times_out_like_the_caller` | spawn stub that never closes | `{ code: null, timedOut: true }` after `timeoutMs` |
| `spawn_call_spawn_error_is_127` | spawn stub emitting an error | `{ code: 127, stderr: <message>, timedOut: false }` |
| `module_requires_from_commonjs` | `createRequire(import.meta.url)(the module)` | the five exports are functions; no throw, no warning |
| `leaf_route_replay_switch_off_bytes_unchanged` | `S.main(['--jev','--out',dir], { env: { PATH: stubBin, STUB_LOG }, out: sink })` from the pre-change state and the final state | identical `sink` lines; identical `STUB_LOG` argv list; `calls.jsonl` equal once its timing fields are masked |
| `score_clarify_default_switch_off_bytes_unchanged` | `runWithStubs(stubs, ['--score', file, '--jev', '--out', out])` before and after | identical stdout; identical `STUB_LOG` argv list |

The last two are recorded runs (`scratch/verify/`), not new assertions inside the callers' suites:
their existing harnesses already build the stub `jev` and capture the lines
(`leaf-route-replay.test.cjs:160` `makeStubs`, `score-clarify-default.test.cjs:59` `makeStubs`, `:122`
`runWithStubs`). Timing fields are masked because no two runs of any script produce equal
milliseconds; every other byte is compared.

---

## 5. Build steps

One change per step, for one executor (DeepSeek V4.1 Flash, D6); MiMo reviews each diff. Code steps
follow `sk-code`'s `sk-code-quality` mode (implement → debug → verify); doc steps follow `sk-doc` and
the mode named. Code comments carry no spec path, phase number or requirement id.

1. **Module skeleton + constant + the switch.** Create `.skilled/skills/cli-classifier/shared/scripts/jev-transport.mjs`
   with the four constants, `resolveTransport` and `spawnClassifierCall` returning only the CLI
   branch (the ported spawn). Tests: `resolve_transport_*` (5) and `spawn_call_switch_off_is_the_cli_spawn`.
   No Pi import in the file yet.
2. **The request parser and the context mapper.** Add `choiceRequestFrom` and `classifierContextFor`.
   Tests: `choice_request_*` (2), `classifier_context_carries_the_state_and_ordered_criteria`.
3. **The Pi gates and the Pi backend.** Add `resolvePiPackage` (ported), the lazy runtime import, the
   three gates, the timed `classify()` call and the skip lines. Tests: `spawn_call_switch_on_answers_through_pi`
   and the three gate rows.
4. **The payload mapper and the backend fallbacks.** Add `choicePayloadFor` plus the
   throw/`stopReason`/partial-map/foreign-pick fallbacks. Tests: `choice_payload_*` (2),
   `spawn_call_backend_refusal_falls_back`, `spawn_call_partial_map_falls_back`,
   `spawn_call_never_reaches_pi_for_another_type`.
5. **The CJS reach and the timeout/error edges.** Keep the file free of top-level await; Tests:
   `module_requires_from_commonjs`, `spawn_call_times_out_like_the_caller`, `spawn_call_spawn_error_is_127`.
6. **Caller opt-in B.** In `.skilled/skills/sk-doc/sk-create-skill/scripts/leaf-route-replay.cjs`: add
   the `require` line after the existing requires (`:19-25`) and replace the spawn at `:1342` with
   `await spawnClassifierCall({ file: gate.path, args, stdin: text, env, timeoutMs, report: out })`.
   Nothing else changes; `:1359`, `:1115`, `:1442-1445` stay byte-identical. Record both switch-off
   runs and `diff` them.
7. **Caller opt-in C.** The same edit in `score-clarify-default.cjs`: the `require` line and the spawn
   at `:1150`. Record and `diff` both runs.
8. **Docs: `cli-usage`.** `.skilled/skills/cli-classifier/cli-usage/SKILL.md` (sk-doc mode
   `sk-create-skill`; shape model: the sibling transport packet `.skilled/skills/cli-classifier/cli-deem/SKILL.md`,
   which documents a second backend against the same reader). Add a `### Transport Selection`
   subsection under section 2 next to `### Prerequisite Detection` (`:92-104`) and `### Transport Guard`
   (`:105-114`): `JEV_TRANSPORT` and the `transport` option, the unset/`jev`/`pi`/unknown routes, the
   four skip lines, `choice` only, the Pi route behind `ModelRuntime.create()`, credentials staying in
   Pi's store, and the fold-back that a classifier answer is evidence, never permission. Bump the
   frontmatter version and add its changelog entry.
9. **Docs: `cli-pi`.** `.skilled/skills/cli-external-orchestration/cli-pi/SKILL.md` (mode
   `sk-create-skill`; shape model: its own `### Provider Preflight` `:169-172` and `### Native Resources`
   `:173-179`). Add a short classifier section: a Pi worker calls `models.classify()` from a codemode
   script (`"defaultTools": ["+codemode"]`), `ctx.modelRegistry.classify()` from an extension, or the
   SDK's `ModelRuntime`; the classifier types are `choice`, `bool` and `score`
   (`docs/models.md:103-136` in the installed package); credentials stay in Pi's own store; an answer
   is evidence, never permission. Add the matching row to the `### Smart Router` `INTENT_SIGNALS`, one
   `### ALWAYS` line, one `### NEVER` line. Version bump + changelog entry.
10. **Docs: catalog entry.** Create
    `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-integration.md` (mode
    `sk-create-feature-catalog`; shape model:
    `.skilled/skills/cli-classifier/feature-catalog/measurements/pi-transport-comparison.md`) with the
    module path, the test path, the switch and the skip lines. Index rows: a `### Pi classifier
    transport integration` block under `## 2. MEASUREMENTS` in
    `.skilled/skills/cli-classifier/feature-catalog/feature-catalog.md` (Description / Current Reality
    / Source Files, the shape of its two existing entries at `:25-53`), and one sentence in
    `.skilled/skills/cli-classifier/SKILL.md` `### Offline Measurement` (`:118-120`). Facts only: no
    verdict, number or live run is claimed beyond `037-pi-native-classifier-transport/scratch/live-run.stdout.txt`.
11. **Docs: playbook scenario.** Create
    `.skilled/skills/cli-classifier/manual-testing-playbook/measurements/pi-transport-integration.md`
    (mode `sk-create-manual-testing-playbook`; shape models: `measurements/pi-transport-comparison.md`
    and a `hub-routing/` scenario file) with one deterministic scenario: stub `jev` first on `PATH`,
    switch off → the caller's bytes are today's; switch on → the Pi stub answers and the result is
    CLI-shaped; each gate → one skip line then the CLI. Index rows in
    `.skilled/skills/cli-classifier/manual-testing-playbook/manual-testing-playbook.md`: a
    `### CC-006` entry under `## 7. MEASUREMENTS` (`:131-142`), a row in `## 8. AUTOMATED TEST
    CROSS-REFERENCE` (`:147-155`), and a row in `## 9. FEATURE CATALOG CROSS-REFERENCE INDEX` (`:162-170`).
12. **Validate.** `python3 .skilled/skills/sk-doc/scripts/validate_document.py <path>` on each changed
    doc plus its changelog entry; fix to `✅ VALID` before moving on.

---

## 6. Proof plan

One row per completion criterion in `goal.md`, run from the final state.

| Criterion | Command | Expected |
|---|---|---|
| Switch off, every changed caller prints what it printed before, byte for byte, on a stub-backed run | run the two recorded harness cases once from the pre-change state and once from the final state, then `diff scratch/verify/<caller>.before.txt scratch/verify/<caller>.after.txt`, and `diff` the two `STUB_LOG` lists | both `diff` runs print nothing, exit 0 |
| Switch on, the transport answers a `choice` question through Pi and returns the CLI's result shape, both backends stubbed | `node --test .skilled/skills/cli-classifier/shared/scripts/tests/jev-transport.test.mjs` | `# fail 0` and `# pass 21` for the module suite, exit 0; the switch-on row asserts `answers.answer.choice` and `probabilities` over the submitted keys, and the two caller rows are the recorded runs below |
| A failed Pi gate prints one skip line and follows the rule, one test per gate | the four gate rows in the same suite, captured to `scratch/verify/transport-tests.txt` | one line per gate — `(package)`, `(model)`, `(credential)`, `(backend)` — and zero `classify` calls on each failure path |
| `cli-usage` and `cli-pi/SKILL.md` document the Pi route; `validate_document.py` VALID on every changed doc | `python3 .skilled/skills/sk-doc/scripts/validate_document.py <each changed doc>` | `✅ VALID` and exit 0 on each, with no verdict or number beyond the recorded run |
| Runtime-tree callers listed as a follow-up with paths; `validate.sh --strict` passes | `git diff --stat -- .skilled/skills/system-deep-loop .skilled/skills/system-skill-advisor .skilled/skills/system-spec-kit` then `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/cli-jev/003-cli-jev-workflow-integration/038-pi-classifier-transport-integration --strict` | empty `diff --stat`; the 13 rows of `spec.md` section 3 named in `implementation-summary.md`; `RESULT: PASSED` |

Plus the two REQ-011/REQ-006 checks: the byte comparison above, and
`grep -nE 'API_KEY|TYPESAFE|Bearer|Authorization' <module>` → no output, exit 1.

---

## 7. Open questions from `spec.md` section 10, answered

1. **Switch name.** `(proposed)` `JEV_TRANSPORT` (env) and `{ transport: 'pi' }` (per-call option),
   resolved only in `resolveTransport`; unset or `''` or `jev` = today's CLI, `pi` = Pi, anything else
   prints `skip: unknown transport '<value>', using jev CLI` and stays on the CLI.
2. **Do the scorer's Pi helpers move or get copied?** `(proposed)` **Copied.** `resolvePiPackage`,
   `criteriaMap`, `toClassifierContext` and the probability rule are re-implemented in the module;
   `score-pi-transport.mjs` stays byte-identical and its 41-case suite untouched. Reason (observed):
   the scorer's static import graph contains a top-level `await` — `node -e "require('./.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-suggested-order.mjs')"`
   fails with `ERR_REQUIRE_ASYNC_MODULE` (exit 1) — so importing the scorer would make this module
   un-`require`-able from the two `.cjs` callers. Second reason: a shipped transport should not depend
   at runtime on another packet's benchmark tree. Cost: about 60 duplicated lines, with a comment that
   names the provenance and the reason.
3. **Which `choice` callers opt in?** `(proposed)` `leaf-route-replay.cjs:1342` and
   `score-clarify-default.cjs:1150`, one call site each. The scorer's CLI arm is rejected (section 1).
4. **Live smoke call?** `(proposed)` No by default. On the operator's yes, one `choice` call through
   the module recorded under `scratch/`; no build step depends on it.
5. **Do baselines exist to measure `bool` and `score` later?** `(proposed)` **UNKNOWN**, unchanged:
   the 019 baseline and the 037 run hold `choice` rows only, and neither recorded file was read for
   `bool`/`score` in this design. `bool`, `score` and `noul` stay on the CLI until each passes its own
   run under 037's keep rule.

**Follow-up list (runtime trees, read-only here).** The 13 callers of `spec.md` section 3 stay
unedited; a later phase wires the ones it owns: `deep-improvement/scripts/model-benchmark/lib/score-verdict-fallback.cjs`
(`choice`), `deep-improvement/scripts/model-benchmark/scorer/score-d4-agreement.cjs` (`noul`),
`deep-review/scripts/score-residue-flagger.cjs` (`noul`), `runtime/scripts/score-fanout-pairs.cjs`
(`noul`), `runtime/scripts/score-severity-replay.cjs` (`choice`, `noul`),
`runtime/scripts/score-stop-hint.cjs` (type unnamed in the context), `runtime/scripts/score-stop-rater.cjs`
(`score`), `routing-accuracy/score-jev-tiebreak.mjs` (`choice`, `noul`),
`routing-accuracy/score-suggested-order.mjs` (`choice`), `runtime/cli/evals/score-alignment-suggestion.ts`
(`choice`), `runtime/cli/retrieval/score-track-narrowing.mjs` (`choice`),
`runtime/scripts/completion-claim-audit/score-completion-claims.mjs` (`noul`),
`runtime/scripts/debug-next-check/score-debug-next-check.mjs` (`choice`). The two `.cjs` runtime
callers are the ones a `.cjs`-reachable module could wire without a facade; the `.ts`/`.mjs` ones
import it directly.
