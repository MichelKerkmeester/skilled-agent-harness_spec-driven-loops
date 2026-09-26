# Investigating assertion evidence

Use assertion details when a statement runs but receives no assertion credit,
or when a mapped assertion has no passing occurrence. The report shows the
recorded explanation and the evidence supporting it separately.

```sh supercov-example
npx supercov runs <run-id> assertions --needs-attention --limit 5
npx supercov runs <run-id> assertion <assertion-id>
```

Replace the placeholders with the run and assertion IDs from your report.

## Follow one assertion

The detail identifies the exact assertion in the test and the source nodes in
each flow. Each node has an explanation and a credit decision:

| Decision | Meaning |
| --- | --- |
| Credited | The map counts this statement, its flow is current, and the selected passing test supplies both assertion and execution evidence. |
| Not credited | The map claims this statement, but a reference, freshness or execution requirement is missing. Read the reason beside it. |
| Context only | The node helps explain the assertion; the map does not claim it as an asserted statement. |

The agent's explanation describes why a value or behavior reaches the assertion.
Supercov's credit reason describes what the recorded evidence supports. A credit
decision does not independently prove that explanation.

## When a test has no source coverage

You may see a warning that a test made assertions but has no source-coverage
evidence. For example, a test might check a third-party parser, a constant, or
configuration without calling measured application code.

It can also mean application code ran in shared setup or across a process or
network boundary that was not attributed to the test. Missing evidence alone
cannot distinguish these cases. Inspect the test and the relevant statement:

```sh supercov-example
npx supercov runs <run-id> assertions report --view tests --limit 20
npx supercov runs <run-id> assertions report --view statements --file src/shipping.js
```

In JSON output, a statement's `executionEvidence` distinguishes any recorded
execution, passing tests and execution outside those tests. The tests view
includes outcomes and identifies setup scopes. Use that information to decide
whether to add a test, adjust the test setup or investigate measurement.

## When a mapped assertion was not observed

An assertion can appear in source without being reached in this run. Common
causes include skipped or TODO tests and untaken branches inside passing tests.
An unsupported custom assertion form or missing attribution can also prevent
Supercov from recording the occurrence.

Read the selected test's outcome before changing the map. A recorded skipped
test and a test with no record are different cases. A passing sibling test does
not supply evidence for an assertion it never reached.

Use the stricter gate when you expect every mapped assertion and selected test
to have passing evidence:

```sh supercov-example
npx supercov runs <run-id> assertions check --require-observed
```

This gate can intentionally fail for a suite with TODO or skipped cases. Keep
those entries visible instead of deleting them to make the check pass.

## Shared setup and asynchronous work

Code executed once in shared setup does not count as execution by every test
that later uses its result. Setup remains visible separately. If a statement
needs its own test evidence, arrange a test that executes it and checks its
behavior.

Per-test `t.after` assertions are included for Node's test runner. Supported HTTP
requests and test-owned WebSocket connections can carry a test's attribution
into callbacks. A WebSocket shared across tests may still lack enough information
to distinguish individual messages. Do not assign that work to a test merely
because it ran around the same time.

The regular report's **Runtime action phases** section is also separate from
assertion coverage. Zero lines recorded inside action phases does not mean the
agent-authored map credits zero statements.

## Read a large flow

Page the nodes and edges of one flow when the complete graph is too large:

```sh supercov-example
npx supercov runs <run-id> assertion <assertion-id> --flow <flow-id> --view nodes --limit 10 --compact
npx supercov runs <run-id> assertion <assertion-id> --flow <flow-id> --view edges --limit 10
npx supercov runs <run-id> source src/shipping.js --offset 0 --limit 20
```

`--compact` leaves source locations and credit reasons visible while omitting
repeated source text. It only changes the displayed report. Follow the printed
next-page command, or `pagination.nextOffset` in JSON, until the view is complete.
Never copy compact report objects back into `assertions.json`.

See [Assertion map format](assertion-maps.md) for fields and validation rules,
and [Mapping assertions with an agent](assertion-agent.md) for the editing loop.
