# Assertion coverage

Line coverage shows which code ran. Assertion coverage helps you see what the
tests checked. Your coding agent traces assertions back to the source, and
Supercov checks those links against recorded execution from the same test.

Assertion coverage measures JavaScript, TypeScript, Python, Ruby and Rust. The
map format is the same for every one of them: an assertion is identified by its
file, line and column, so a project written in more than one language keeps a
single map.

Python and Ruby report an assertion's line but not its column, so two
assertions written on one line cannot be told apart and neither is credited.
Put them on separate lines.

## A passing test can miss a wrong result

This function confirms an order and calculates its total:

```js
export function checkout(price, quantity) {
  const total = price * quantity;
  return { status: 'confirmed', total };
}
```

The test checks the status, but not the total:

```js
import assert from 'node:assert/strict';
import test from 'node:test';
import { checkout } from './checkout.js';

test('confirms an order', () => {
  const order = checkout(25, 2);
  assert.equal(order.status, 'confirmed');
});
```

Every line in the function runs. The test passes. But it would also pass if the
total were `49` instead of `50`.

## How the agent finds the gap

1. **Supercov records execution:** which statements ran in each test and which
   assertions passed.
2. **Your agent traces each assertion** through the test and source to explain
   what it checks. It saves those links in the run's `assertions.json` map.
3. **Supercov checks the map against the run.** A statement needs a current
   explanation, execution, and a passing assertion in the same test to count.

In this example, the agent follows the status assertion back to the returned
order. It finds no check that reads the total:

- `order.status` → must equal `'confirmed'`.
- `order.total` → no assertion checks the calculated total.

The agent adds the missing assertion to the existing test:

```js
assert.equal(order.total, 50);
```

It reruns the full suite and updates the map. A total of `49` now fails the
test: two items at $25 must total $50. Line coverage has not changed, but the
test now checks the calculation.

## Try it in your project

Open your project in your usual coding agent and paste this prompt. The agent
can install Supercov and run the commands for you.

```text supercov-prompt
Read npx supercov docs assertion-agent. Run the full test suite through
Supercov, then build and validate its assertion map. Find one useful
missing check and add an assertion for the expected behavior.
Only change tests; do not weaken existing checks. Rerun the same suite
and update the map. Show the test change, before-and-after assertion
coverage, and any uncertainty or missing evidence.
```

The agent uses your actual test command after `--`, for example
`npx supercov -- npm test`. On later runs of the same command, Supercov reuses
compatible mappings and flags explanations that need another look.

## Read the result

The agent can show the summary and the statement-level report for a file:

```sh
npx supercov runs <run-id>
npx supercov runs <run-id> assertions report --view statements --file checkout.js
```

**Assertions** is the percentage of measured source statements linked to
passing assertions by the agent's map. It is not a count of assertions. Each
statement counts once; statements that never ran remain in the total.

An unmapped statement is a place to investigate, not proof of a missing test:
the agent may not have mapped its existing check yet.

The strength of the check still matters. `assert.ok(order.total)` accepts both
`49` and `50`; `assert.equal(order.total, 50)` distinguishes them. Review the
expected behavior, not just the percentage.

Supercov does not generate or execute mutated code for this assessment. Unlike
mutation testing, it does not test whether deliberately introduced bugs are
caught. The agent's explanations still need review.

For the detailed workflow, see [Mapping assertions with an agent](assertion-agent.md).
For a result you cannot explain, see [Investigating assertion evidence](assertion-evidence.md).
