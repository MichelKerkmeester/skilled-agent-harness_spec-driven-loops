# Agent workflow

Use Supercov with your coding agent and the test suite you already have.
Supercov reports coverage and gaps. Your agent writes a test, reruns the suite,
and checks what improved.

## Start with one test

Open your own repository in your coding agent and paste this prompt. You don't
need to install Supercov first; the agent can handle that.

```text supercov-prompt
Measure code coverage with npx supercov and write one missing test.
Only change tests. Rerun the full test suite and show me the test you
added and the before-and-after coverage.
```

If the project has several test commands, tell the agent which full suite to
use. Let it run the commands and edit the tests, approving those actions if
your agent asks.

The result is a normal test-file change and a coverage comparison in the
conversation. Ask separately if you want a commit or pull request.

## One safe pass

The agent should run the suite, inspect a gap, write a test, then rerun the
same suite and compare. These are the commands it can use:

```sh supercov-example
# 1. Establish a baseline.
npx supercov -- npm test

# 2. Ask for a short list of useful targets.
npx supercov runs latest gaps --limit 5

# 3. Inspect one target.
npx supercov runs latest file app/checkout/session.ts
npx supercov runs latest decision app/checkout/session.ts:64
npx supercov runs latest line app/checkout/session.ts:64

# 4. Write one focused test, rerun, and prove the gain.
npx supercov -- npm test
npx supercov diff <previous-run-id> latest
```

Everything after `--` is your project's test command. Use your actual command
and file paths in place of the examples. For example,
Rust projects can use `cargo test`, Python projects `pytest`, and Ruby projects
`bundle exec rspec`. Keep the baseline and verification commands identical.

The `line` query is useful before writing a test because it shows which tests
already reach that line. Extending a nearby test is often better than adding a
duplicate.

## Add assertion coverage

For JavaScript and TypeScript projects, you can also ask the agent to explain
what each test assertion checks. Every normal run creates an `assertions.json`
map and carries forward compatible work from earlier runs of the same command.

```sh supercov
npx supercov runs latest assertions
npx supercov docs assertion-agent
```

Keep the printed run ID fixed while editing. The agent reads matching current
source, updates the map, validates its references and saves review tokens for
the explanations it examined. The regular run report then shows the assertion
percentage. It does not need another test run just to read the edited map.

Start with [Understanding assertion coverage](assertions.md) for a copyable
prompt. [Mapping assertions with an agent](assertion-agent.md) gives the complete
editing and checking loop. Use the evidence and recorded observations alongside
MC/DC when deciding which tests need stronger checks.

## Example

Here's a recorded Codex run in a JavaScript project, using the first prompt.
The files are from our checkout example; you don't need to add them to your
project.

[`src/session.js`](https://github.com/supercorp-ai/supercov/blob/main/examples/checkout-verification/starter/src/session.js)
allows checkout only when the customer is signed in and their session has
not expired:

```js
export function canCheckout(signedIn, expired) {
  if (signedIn && !expired) return true;
  return false;
}
```

The two tests in
[`tests/session.test.js`](https://github.com/supercorp-ai/supercov/blob/main/examples/checkout-verification/starter/tests/session.test.js)
check a valid session and a signed-out visitor:

```js
assert.equal(canCheckout(true, false), true);
assert.equal(canCheckout(false, false), false);
```

The agent ran `npx supercov -- npm test`. Both tests passed, and the summary
from `npx supercov runs latest` showed:

```text
Coverage
  Lines      100.00% (3/3)
  Branches   100.00% (2/2)
  MC/DC      50.00% (1/2)
```

It listed the gaps and inspected the file. You can open those views with:

```sh
npx supercov runs latest gaps
npx supercov runs latest file src/session.js
```

The file query explained the gap:

```text
 LINE  STATUS        SOURCE
    2  PARTIAL       signedIn && !expired
       Unobserved: no witness pair shows `!expired` independently changing the decision result
```

Both return paths had run, but neither test checked an expired session. MC/DC
checks whether each condition has been shown to affect the decision
independently. Here, `signedIn` had; `!expired` had not.

The agent added one test to `tests/session.test.js`, leaving the application
code and existing tests unchanged:

```js
test('a signed-in visitor with an expired session cannot check out', () => {
  assert.equal(canCheckout(true, true), false);
});
```

It reran the same full suite. All three tests passed, and MC/DC reached 100%.
The comparison from `npx supercov diff <before-run-id> latest` showed:

```text
lines +0pp, branches +0pp, MC/DC +50pp
gained: 0 lines, 0 branches, 1 MC/DC conditions
lost: 0 lines, 0 branches, 0 MC/DC conditions
+ MC/DC src/session.js:2 C2 !expired
```

The new assertion checks that checkout is denied when a signed-in customer's
session has expired. Removing the expiry check makes this test fail; the
original two tests still pass.

In your project, look for the same evidence: the test checks the behavior the
agent identified, and the full suite passes. One useful test won't necessarily
take coverage to 100%.

To try these exact files, [download the starter](https://supercov.com/downloads/supercov-tutorial.zip),
extract it, open the `supercov-tutorial` folder in your agent, and run `npm ci`.
Then use the JavaScript prompt above. The completed test is not included in the
download. The [recorded run](https://github.com/supercorp-ai/supercov/tree/main/examples/checkout-verification/agent-run)
includes the commands, full output, and completed test.

## A complete prompt for longer runs

Once you've reviewed the first test, use this prompt to continue through
useful gaps—for example, during an overnight run:

```text supercov-prompt
Use `npx supercov` to improve coverage. Only write tests. Keep going while
useful gaps remain.

Run the repository's complete test command through Supercov. Then repeat:
1. Run `npx supercov runs latest gaps --limit 5`.
2. Choose one useful uncovered behavior.
3. Inspect it with the `file`, `decision`, or `line` query.
4. Write one focused test with meaningful assertions.
5. Rerun the same complete suite through Supercov.
6. Run `npx supercov diff <previous-run-id> latest` to prove the gain.

Only edit tests. Never weaken assertions, delete tests, or change application
code to make coverage easier. Stop when no useful gap remains, a path is not
reachable through public behavior, Supercov reports a measurement limit, or
the time budget is exhausted. Report the run ids compared and what improved.
```

## Choose value, not just percentage

`gaps` ranks unresolved obligations, but the largest number is not always the
most valuable test. Prefer behavior around:

- permissions and access control;
- payments and state transitions;
- retries, failures, and recovery;
- user-visible outcomes; and
- public APIs with consequential edge cases.

Before writing a test, ask whether the behavior is reachable, whether an
existing test almost covers it, and whether the new test can make a meaningful
assertion. Dead code is usually something to report for human review, not a
reason to manufacture a test.

If the repository separates test levels, narrow the view:

```sh supercov
npx supercov runs latest gaps --kind e2e --limit 10
```

## Keep the loop efficient

- Begin and end with the complete test command.
- A focused command is fine during iteration, but finish against the full
  denominator before reporting success.
- Write one related test at a time. Large batches make failures and gains hard
  to explain.
- Use immutable run ids when work spans sessions. Use `latest` for an
  interactive loop.
- Treat a run as history after the source or relevant configuration changes.

## Use Supercov in a software factory

Your factory schedules agents; Supercov gives each pass a bounded coverage task
and a durable result. A worker can run the suite, choose a gap, write one test,
and return the before-and-after run ids. The next worker can inspect that result
without relying on a dashboard or the previous agent's memory.

Keep the same safety contract in unattended work: tests only, meaningful
assertions, full-suite verification, and an explicit stop when the remaining
items are measurement limits rather than testable gaps.

## Know when to stop

Stop instead of grinding when:

- no useful uncovered behavior remains;
- the path cannot be reached through supported public behavior;
- source scope is ambiguous and needs `SUPERCOV_SOURCE_ROOTS`;
- the runner can provide only aggregate evidence for the question being asked;
- Supercov reports a measurement limit rather than an ordinary gap; or
- the next test would exist only to move a number.

See [Troubleshooting](troubleshooting.md) when a run appears incomplete or
unexpected.
