# Mapping assertions with an agent

Use these instructions when asking a coding agent to create or update an
assertion map. The agent reads your tests and source, explains what each
assertion checks, and edits the run's `assertions.json`. Supercov supplies the
run evidence and checks the file's references and freshness.

Start with [Understanding assertion coverage](assertions.md) for a prompt you
can copy. The steps below are the agent's working instructions.

## Choose a run and keep it fixed

1. Use a matching current run, or run the requested suite through
   `supercov -- <test command>`. Use the full suite for a suite-wide result.
2. Read `npx supercov runs latest assertions --json` and keep `data.run` fixed for
   this investigation. Edit the file at `data.map`.
3. Check `data.inheritance` for reused work or fallback errors. Keep the old
   runs and maps. Inspect changes before renewing inherited flows.
4. Read the [map format](assertion-maps.md), also available through
   `npx supercov docs assertion-maps`.

Use a single writer for the map. Save atomically if your editor supports it.
Do not change application code or tests unless the user also requested those
changes. Never edit `assertions.state.json` or the run's recorded evidence.

## Inspect the assertions and source

```sh supercov-example
npx supercov runs <run-id> assertions --limit 100 --json
npx supercov runs <run-id> assertions report --view statements --limit 100 --json
npx supercov runs <run-id> assertions report --view tests --limit 100 --json
npx supercov runs <run-id> assertions report --view changes --limit 100 --json
npx supercov runs <run-id> assertion <assertion-id>
npx supercov runs <run-id> source src/shipping.js --offset 0 --limit 100
```

Follow every `pagination.nextOffset`; a page is not the whole result. Restart a
paged read if its `revision` changes. Current source must match the pinned run.
Use ordinary source-reading tools to inspect setup, inputs, mocks, callbacks,
branches, called functions, helpers and relevant configuration.

Preserve each assertion's ID and complete `at` anchor. Locations use one-based
lines and UTF-8 byte columns. Restore recognized sites marked `inMap: false`
when investigating them; removing an entry does not remove the assertion from
Supercov's list.

## Write precise explanations

For each assertion:

- Describe exactly what its predicate distinguishes in `observes`. Existence,
  truthiness, length and substring checks do not imply equality of every field.
- Split independently maintainable explanations into flows with stable IDs.
  Start a new or changed flow with `basis: null`.
- Choose `appliesTo` tests from the tests view using their exact file and name.
  Select applicable cases explicitly for shared or parameterized assertions.
- Use complete source statements from the statements view as node anchors when
  possible. Write the relationships that connect those nodes to `$assertion`.
- Put a node in `countsAsAsserted` only when its behavior is checked by this
  assertion. Every counted node needs a recorded path to `$assertion`.
  Counting a guard or block does not count the nested body automatically.
- Add helper, configuration and other dependency files to `watch`. The
  declarations holding your nodes, the top level of their files, the assertion
  file and the selected test files are already dependencies. Include relevant
  guards and alternatives even when they do not appear as graph nodes.
- Keep uncertainty in `questions`. A flow's unresolved questions block its
  credit. Assertion-level questions record broader unfinished investigation.

A fixture-only or absence explanation can have `countsAsAsserted: []`. For
absence, describe the ordering or barrier and the observation window. Never
credit an unexecuted body merely because executing it would violate the check.

There is no known number of flows an assertion should have. Do not label an
assertion complete just because you recorded one explanation.

## Check why a node receives no credit

Read the node's credit reason in assertion detail, or its computed `nodeCredit`
entry in JSON. Compare the statement's execution evidence and selected test's
outcome. Keep these report fields out of the editable map.

A source node can be context only, lack a measured statement, have stale inputs,
or lack matching passing assertion and execution evidence. Shared setup and
background execution do not count as execution by every consuming test. Skipped
and TODO tests supply no passing witness. An unobserved site in a passing test
can indicate an untaken branch or missing measurement.

Do not borrow another assertion's identity or another test's execution. Preserve
zero-credit explanations when they accurately describe what the test checks.
Use `assertions report --view excludedStatements` to inspect erased TypeScript
imports. See [Investigating assertion evidence](assertion-evidence.md) for
asynchronous and missing-evidence cases.

For a large flow, page `assertion <id> --flow <flow-id> --view nodes --json` and
`--view edges` separately. `--compact` omits repeated source text from the
report; read the matching source separately and never save the compact objects
back into the map.

## Assess changes before renewing flows

When inheriting a map, read every entry in `--view changes`. Each names the
flows it already made stale (`knownFlows`) and, under `exposed`, the tests that
ran the changed code and how many flows they carry; start with those, and
investigate whether other flows are affected too. A flow's own `notices` list changes near its
nodes that could not have reached it.

Add a `changeAssessments` entry for each managed change ID. Include all listed
`knownFlows` that still exist, plus any other affected flows. Explain why the
remaining claims are unaffected. An empty affected-flow list needs a reason.
Repair missing watches and update the affected graphs or selectors.

Save these edits, then validate:

```sh supercov-example
npx supercov assertions validate --file <map-path> --json
npx supercov runs <run-id> assertions validate --view changes --json
npx supercov runs <run-id> assertions validate --view flows --json
```

Page the validation views too. Overall validity covers the whole map even when
only one page is returned. Copy change `expectedBasis` tokens only after
examining the corresponding impact assessments, then save. Validate again and
copy flow tokens only for the claims you have examined.

Obtain final flow tokens after saving change tokens: a change assessment can
invalidate additional flows. Treat tokens as opaque; do not implement their
hashing or manufacture them. Changing a claim after getting its token makes
that token stale.

## Check and summarize

```sh supercov-example
npx supercov runs <run-id> assertions check --require-mappings --json
npx supercov runs <run-id> assertions report --view statements --limit 100 --json
npx supercov runs <run-id>
```

Add `--require-observed` when every mapped site and test selector is expected to
have passing evidence. Report skipped, TODO or untaken cases when that gate is
unmet. Use `--min <percentage>` only for the user's chosen target; do not lower
it or hide gaps to make a check pass.

Report the run ID, map path, assertion percentage and counts, unresolved changes,
missing execution and useful next tests. Distinguish statements credited by the
map from raw line coverage and MC/DC. Mention which claims were newly examined
and which were reused.

A valid file does not prove the explanation or its completeness. A credited
statement can change without failing a test when the edit preserves the observed
property. Keep that distinction clear when recommending code changes.
