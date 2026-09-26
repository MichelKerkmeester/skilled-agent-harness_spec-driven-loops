# Assertion map format

Edit a run's `assertions.json` to record which assertions check which source
statements. Start with [Understanding assertion coverage](assertions.md) if you
want an agent to create the map for you. This reference covers the fields and
commands used to inspect, update and validate it.

## Open the run's map

```sh supercov
npx supercov runs latest assertions --json
```

The response gives you `data.run` and `data.map`. Use that run ID throughout the
edit. A normal run creates the file automatically and inherits compatible work
from earlier runs of the same test command and language.

Only edit `assertions.json`. Keep `assertions.state.json` and the run's evidence
unchanged. Use current project files that match the run when investigating.

## Describe an assertion and its flow

This illustrative draft maps an equality check to a return statement:

```json
{
  "schemaVersion": 2,
  "assertions": [{
    "id": "a_example",
    "at": {
      "file": "tests/value.test.ts",
      "line": 5,
      "column": 3,
      "text": "assert.equal(value(), 1)"
    },
    "observes": ["The returned number equals one."],
    "flows": [{
      "id": "return-value",
      "basis": null,
      "appliesTo": [{ "file": "tests/value.test.ts", "name": "value" }],
      "explanation": "value() returns the number compared by the assertion.",
      "nodes": [{
        "id": "return",
        "at": {
          "file": "src/value.ts",
          "line": 2,
          "column": 3,
          "text": "return 1;"
        }
      }],
      "edges": [{ "from": "return", "to": "$assertion", "kind": "data" }],
      "countsAsAsserted": ["return"],
      "watch": []
    }]
  }]
}
```

Use the actual assertion IDs, test names and source locations from your run.
The example remains a draft until its references match and its flow has been
examined and acknowledged.

| Field | What to write |
| --- | --- |
| Assertion `id`, `at` | Preserve the assertion's ID and exact test expression. |
| `observes` | Describe the property checked, such as an exact value, length or substring. |
| `flows` | Explain the routes from relevant source to this assertion. An empty array means no explanations are recorded. |
| Flow `id` | Choose a stable name within the assertion, such as `return-value`. |
| Flow `basis` | Start with `null`. After review, copy the token returned by validation. |
| `appliesTo` | Select tests by project-relative file and exact displayed test name. |
| `nodes`, `edges` | Record source locations and relationships ending at `$assertion`. |
| `countsAsAsserted` | List the node IDs you judge to be checked by the assertion. |
| `watch` | List additional files the explanation depends on, such as helpers or configuration. A watched file is depended on **as a whole**: any change to it that is not a comment is a review. Use it for a file your claim reasons about but holds no node of yours -- including claims about what a file does *not* contain, which no node can anchor. Naming a file that already holds this flow's nodes widens the flow from those declarations to the whole file, so a neighbouring function's body becomes a review again; that is sometimes what you mean, and the report says when you have done it. Manifests, lockfiles and runner configuration are already tracked for the whole run; naming one catches nothing, and the report says so. A redundant entry is free to take back out: it is not part of what the acknowledgement rests on, so removing one keeps the flow's credit. A watch may name any UTF-8 file in the project, such as the `index.html` or stylesheet a browser test renders: a run captures every file its inherited map watches, so a watch added since the current run was recorded is reported missing until the tests run again. |
| `questions` | Record unresolved investigation questions. Questions inside a flow block its credit. |

Source anchors use project-relative paths with `/`, one-based lines and one-based
UTF-8 byte columns. Preserve exact text, including multiline expressions. IDs
use letters, digits, `_`, `-` or `.`. Edge `basis` is optional explanatory text;
it is separate from the flow's review token.

Every counted node needs a path through the recorded edges to `$assertion` and
must match a measured statement exactly. Counting an `if` statement does not
also count every statement inside it. Nodes that only provide context can stay
in the graph without appearing in `countsAsAsserted`.

Test selectors must be unambiguous. An empty `appliesTo` supplies no execution
credit. For a shared assertion, select the applicable test cases explicitly.
An absence or fixture-only check can use `countsAsAsserted: []`; explain what
was observed and, for absence, the ordering and observation window.

## Validate and acknowledge your edits

```sh supercov-example
npx supercov assertions schema --json
npx supercov assertions validate --file <map-path> --json
npx supercov runs <run-id> assertions validate --json
```

The first command exports the editor schema. File validation checks JSON shape.
Run validation also checks IDs, source anchors, graph links, selected tests and
changed inputs. It does not edit the map or prove the explanation.

After examining a flow, copy its returned `expectedBasis` into that flow's
`basis`, save the file, and run `check`. Treat the token as an opaque value;
do not generate it yourself. Editing a claim or its dependencies makes the old
token stale.

### What makes a review token stale

A flow needs a fresh review when its claim changes; when a declaration holding
one of its nodes changes -- the function, method or class the node sits in, or
the top level of that file, its imports and constants; when that file's set of
declarations changes, one added, removed or renamed; when a file it watches, a
test it selects or its assertion's file changes; or when the configuration
that decides what executes changes: a transpiler, a test runner, an
interpreter pin.

Each reason names what moved -- `src/server.js: Server.start (line 12)
changed (holds this flow's return:31)` -- so you can look rather than reread.

Several things that sound like they should count do not, because an
acknowledgement demanded for all of them at once stops being read.

Comments do not, nor blank lines or trailing whitespace: no program can tell.
A comment the language itself reads is the exception and does count -- a Go
`//go:embed` directive, a Ruby magic comment, a Rust doctest.

A change to another declaration in a node's file does not. The claim rests on
the code it names; the rest of the file is the author's to name in `watch` if
it matters. Such a change is a notice on the flow (`notices` in the report),
not a review, and it is asked about once, as a change to assess.

Code the flow's test ran elsewhere does not make the flow stale either. A claim
does not pass through every function its test happened to execute. What each
test ran is recorded, and a changed file's change record says which tests ran
the changed code and how many flows that exposes, so the one assessment the
change asks for is asked of the right people -- and a change no selected test
ran is not asked about at all.

Cutting a release does not. A manifest is fingerprinted by what it declares, so
a version number moving in `package.json`, `Cargo.toml`, `pyproject.toml` or a
lockfile changes nothing. Neither does reformatting one.

Upgrading Supercov does not. Your claims are about your code, and a new release
re-derives the evidence they rest on rather than making them wrong. Only a
deliberate change to the instrumenter contract counts.

Upgrading a dependency does not make every flow stale either. It is recorded
once, as a change to assess, and flows keep their credit until that assessment
says otherwise. One explanation answers for the upgrade.

Linters, formatters, type checkers and coverage settings never count, because
none of them change what the code does when it runs.

The ambient environment does not count: running from another directory, a new
terminal session, a different package manager or another Node installation
leaves current flows current. A behavioural difference that matters still shows
up on its own, because credit requires a passing assertion occurrence and
execution of the claimed statement in the same selected test.

If your suite genuinely depends on particular variables, name them; only the
ones you name participate, and an unset variable is recorded as absent.

```sh supercov-example
SUPERCOV_ASSERTION_CONTEXT_ENV=TZ,LANG npx supercov -- npm test
```

Use the same list for every run. Changing it changes the recorded context and
asks for a fresh review.

```sh supercov-example
npx supercov runs <run-id> assertions check --require-mappings
npx supercov runs <run-id>
```

| Check option | Requirement |
| --- | --- |
| No extra option | Authored claims and references are valid and current, questions and change assessments are resolved, and the run passed. Untouched assertions without flows are allowed. |
| `--require-mappings` | Every recognized assertion observed passing has a current explanation, including legitimate zero-credit explanations. |
| `--require-observed` | Every listed assertion and explicit test selector has matching passing evidence. |
| `--min <percentage>` | The available assertion percentage meets your target. |

Use `--require-observed` when every mapped site is expected to run. Skipped,
TODO and untaken cases can make it fail even when their explanations are useful.
Neither gate establishes that every possible flow has been found.

`validate` exits with code 2 for syntax or reference errors. A null or stale
review token alone is not a syntax error. `check` exits with code 2 when a
requested requirement is unmet.

## Understand statement credit

The percentage counts the union of explicitly claimed measured statements with
current flows, a passing assertion and execution in the same selected passing
test. Duplicate claims count once. Unexecuted statements remain in the
denominator. A line receives assertion credit only when all measured statements
on it receive credit.

TypeScript imports known to disappear during compilation are excluded. Inspect
their locations with:

```sh supercov-example
npx supercov runs <run-id> assertions report --view excludedStatements
```

This includes explicit `import type` and, for supported tsc/tsx/ts-node settings,
imports used only as types. Runtime, mixed and side-effect imports remain.
Preserving compiler settings and configurations that Supercov cannot resolve
keep ambiguous imports in the denominator. Older runs keep their recorded totals.

An assertion detail explains each node's credit decision. In JSON, computed
`nodeCredit` entries include the decision, reason codes, matched statement IDs
and matching tests. Keep these report fields out of the editable map. See
[Investigating assertion evidence](assertion-evidence.md) for missing execution,
shared setup and asynchronous cases.

A numeric result can come from a partial map. `current` means the flow has no
freshness, reference or question blockers; it does not mean all source nodes
receive credit or every relevant flow is known. The normal report shows counts
of assertions without flows and flows still needing attention beside the score.

JSON regular reports put the summary at `data.assertionCoverage.summary`.
Assertion reports use `data.summary`. A `summary.status` of `available` supplies
a percentage; `notAssessed`, `pending`, `unavailable` and `notApplicable` do not.
The assertion summary always covers the whole run, even when other coverage
metrics or the returned items are filtered.

## Find the next part to investigate

| Command after `npx supercov runs <run-id>` | Shows |
| --- | --- |
| `assertions` | Assertions, including those without recorded flows. |
| `assertions --needs-attention` | Missing explanations, questions, stale or draft flows, and claimed nodes without credit. |
| `assertion <id>` | One assertion, its flows and node-credit reasons. |
| `source <path>` | Matching current code with line numbers. |
| `assertions files` | Captured input paths, sizes and hashes, even if the checkout is stale. |
| `assertions report --view <view>` | `summary`, `assertions`, `statements`, `tests`, `changes`, `creditedLines`, `unassertedLines` or `excludedStatements`. |

Use `--file <path>` to filter applicable list views; the summary still describes
the whole run. Lists support `--offset`, `--limit` and `--json`. Follow the
printed next-page command or JSON `pagination.nextOffset` until it is null.
Restart a paged read if `revision` changes while you are reading it.

An assertion detail pages whole flows by default. For a large individual flow,
use `--flow <flow-id> --view nodes` and `--view edges`. Add `--compact` to omit
repeated source text while retaining locations. Read that text with `source`;
do not save compact report objects into the map.

Large validation results support `--view flows`, `--view changes` or
`--view errors`. Each page still reports validity for the entire map. The source
command pages lines; JSON source output uses `{line, text}` objects for integrations.

## Update the map after a change

Run the same test command again, then edit the new run's map. Supercov carries
forward compatible mappings and leaves the previous run unchanged. If a newer
map cannot be reused, `inheritance.skipped` explains the fallback.

Each flow depends on the declarations holding its nodes and the top level of
their files, on its assertion file, its selected test files and its extra
`watch` files. A change to any of those requires another look at that flow;
a comment, a blank line or another declaration's body does not. Independent
sibling flows stay current. Changing the assertion or its observation affects
all its flows. Dependency, configuration and instrumentation changes can
affect many flows.

Start with `assertions report --view changes`. Investigate every listed change,
including effects on flows that did not yet watch the changed file. Add a
response in the map's top-level `changeAssessments` array:

```json
{
  "changeAssessments": [{
    "id": "c_copy_from_changes_view",
    "basis": null,
    "affectedFlows": ["a_example/return-value"],
    "explanation": "The edit affects the returned value. The independent sibling calculation is unchanged."
  }]
}
```

This is an excerpt to add to your existing map. `affectedFlows` is your
judgement: the flows this change invalidates, and only those. It is not a
restatement of `knownFlows` -- Supercov already holds that list and does not
ask you to retype it. **Every flow you name loses its acknowledgement and has
to be reread**, so naming a flow is a decision, and naming all of them is the
expensive one.

To make that judgement, read what the change view gives you. `knownFlows`
counts the flows the change has already made stale and samples them. `exposed`
counts the flows whose selected tests ran the changed code and names those
tests -- not stale for it, but the ones most worth thinking about. Neither is
a verdict: under an integration suite every test runs most of the code, so
exposure is a place to look, not a list to copy.

An empty list is the normal outcome for a change that touches no claim, and it
is the contract this channel exists to provide: one explanation answers for the
change and every dependent keeps its credit. It still needs an explanation of
why existing claims are unaffected, and it does not mean the changed code is
tested.

Save the assessments and graph edits, validate, and copy the examined change
tokens. Save again, then validate once more before copying final flow tokens.
Assessing a change can make another flow stale, so the order matters. Removing
an assessment or reverting a file does not by itself clear an unresolved change.

Keep removed or ambiguous assertion records for review under `retiredAssertions`.
Follow the supplied questions when inheriting older maps. Do not invent source
links or evidence to clear a warning.

## Keep queries fast

Reports reuse a disposable assessment cache while checking that sources still
match. Editing the map invalidates the cached assessment automatically. Queries
never acknowledge flows or change the authored map. See [Speed and storage](performance.md)
for keeping repeated investigation fast.
