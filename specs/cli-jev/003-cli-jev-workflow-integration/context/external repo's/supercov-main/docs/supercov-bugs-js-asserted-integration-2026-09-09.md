# JS/TS assertion integration: new reproducible bugs

Status update: **JS-ASSERT-001 through JS-ASSERT-004 are fixed** on
`codex/asserted-js-integration`, with passing ordinary-archive regressions in
`analyzers/typescript/tests/archive.integration.test.mjs`. See the
[follow-up and new calibration](asserted-js-fixes-2026-09-09.md). Their original
reproductions below describe the pre-fix state. Conclusions still remain
**unverified candidates**, not certified assertion coverage. A subsequently
discovered reporting bug is recorded separately as JS-ASSERT-005.

Reproduce in the main Supercov checkout:

```sh
npm ci --ignore-scripts --prefix analyzers/typescript
npm run test:asserted-integration
```

Set `SUPERCOV_KEEP_ASSERTED_FIXTURE=1` to retain the temporary project, raw run and
`asserted-query-result.json`. Native mutation checks modify only that temporary
fixture, restoring each file before the next check. Neither sample application
was changed. The committed fixture contains ordinary tests; there is no
assertion-analysis DSL.

## JS-ASSERT-001 — discarded return receives value credit

Source: `discarded()` returns 4. Test:

```js
assert.equal((discarded(), 7), 7);
```

The existing analyzer/join calls the return site `evident`. Changing 4 to 9
survives both native Node and native Vitest. Calling the function while evaluating
an assertion does not make its discarded return an assertion operand.

The suspect rule is the outermost-entered-function enrichment in
`analyzers/typescript/src/analyze.ts`, `runtimeObsFor` and its function-index
helpers. The source file's historical comment asserting that the outermost
function supplies the compared value is contradicted by this example. It is
retained as evidence of the old implementation, not endorsed as a proof.

Expected: execution linkage may remain; this test must not provide value credit
for the return. A future fix must also cover ignored callback results, comma
expressions, wrappers returning constants and overwritten locals.

## JS-ASSERT-002 — helper name substitutes for implementation

Production `sendStatus(response)` calls `response.status(201)`. The test passes
an object with a no-op `status` method, then checks a local fake:

```js
function fetch() {
  return { status: 200 };
}
sendStatus({ status() {} });
const response = await fetch();
assert.equal(response.status, 200);
```

The production status call is `evident`. Changing 201 to 500 survives both
native runners. The assertion reads a different object and cannot notice the
production status argument.

`originOf` consults `HELPERS` by identifier spelling before resolving the
callee implementation; `boundariesOfOrigin` maps `helper:fetch` to a shared
`client-status` boundary. Neither helper identity nor instance/channel identity
is established here.

Expected: no production status credit from this observation. Similar adapters
for process/output helpers need implementation- and capture-specific validation,
not a larger whitelist of plausible names.

## JS-ASSERT-003 — an assertion that never ran lends credit

```js
unchecked();
if (false) assert.equal(unchecked(), 4);
```

The production return is `evident`; changing it from 4 to 9 survives both native
runners. The call executes, but the only value assertion does not.

The static observation set is joined to a passing test without requiring that
the particular assertion executed successfully. Linking a test by title or by
some assertion line does not establish every static observation in that test.

Expected: the unexecuted assertion must not be a witness. Future cases should
include caught assertion failures, early returns, skipped conditional branches,
parameterized test identities and asynchronous assertions after test completion.

## JS-ASSERT-004 — node:test publication rejects statementId

Ordinary `supercov -- node --test tests/core.test.mjs` runs the fixture tests,
then exits 1 while reading a per-test record:

```text
unknown field `statementId`, expected one of `type`, `meta`, `vector`, `id`, `timestampMs`, `phaseId`, `scope`
```

`RuntimeEvent` accepts the newly recorded statement id, but `ServerRecord` in
`crates/supercov-engine/src/coverage_report.rs` does not. The latter is used by
node:test evidence too; this is not restricted to a child-process test. The
ordinary archive cannot be published, so no assertion query can repair it.

The successful integration uses the existing Vitest runtime-snapshot path and
does not strip statement ids, disable probes, modify captured records, or patch
the publisher. The node:test test is a failing TODO pending authorization to fix
that existing capture path. A fix must preserve ownership through subsequent
server-record projections, not merely make deserialization permissive.

## Additional findings, not extra false-positive bug counts

- `Boolean(coerced()) === true` notices a change from 4 to 0 but not 4 to 9.
  This really asserts a predicate. It does **not** pin the original returned
  value; an undifferentiated `evident` label cannot express the distinction.
- The real subprocess test accumulates `stderr` data, waits for child `close`,
  checks exit code 3, and checks `output.includes('token:')`. Changing the suffix
  survives; removing the substring or changing exit code fails in both native
  runners. This validates those concrete changes, not every timing, buffering,
  encoding or side-effect alternative.
- The first archive adapter deliberately does not join browser/server journals,
  merged runs, ambiguous/duplicate attempts, setup records or retries. These
  remain reported limitations, not evidence that those behaviors are unasserted.
