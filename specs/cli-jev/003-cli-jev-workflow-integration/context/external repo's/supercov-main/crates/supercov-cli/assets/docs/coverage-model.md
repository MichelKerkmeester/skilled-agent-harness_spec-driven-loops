# Understanding coverage

Supercov answers a more useful question than “which lines ran?” It shows which
behaviors were exercised, which paths still need a test, and where measurement
was incomplete.

## Gaps and measurement limits are different

An **uncovered gap** is behavior Supercov measured but did not observe. A test
may be able to close it.

A **measurement limit** means Supercov could not establish a complete boundary
for some code or execution. Common causes include ambiguous source scope,
dynamically created source, self-inspecting code, and an unsupported process or
runner boundary.

Supercov keeps those states separate. It does not turn “unknown” into
“uncovered,” and it does not round either one away to produce a reassuring 100%.

```sh supercov
npx supercov runs latest
npx supercov runs latest gaps
npx supercov runs latest scope
```

## What Supercov measures

| Metric | The question it answers |
| --- | --- |
| Line | Did execution reach this source line? |
| Statement | Did this executable statement run? |
| Function | Was this function entered? |
| Branch | Did each alternative execute? |
| Decision vector | Which combinations of boolean conditions occurred? |
| MC/DC witness | Was each condition shown to affect the decision independently? |
| Assertion coverage | Which measured statements are linked to passing checks by the agent-authored map? |
| Value path | Did defaults, optional chains, logical assignments, and similar constructs take each meaningful path? |

The exact obligations depend on the language and source construct. You do not
need to reason about all of them at once. Start with a file, then open a decision
or line only when the missing behavior needs explanation:

```sh supercov
npx supercov runs latest file app/checkout/session.ts
npx supercov runs latest decision app/checkout/session.ts:64
npx supercov runs latest line app/checkout/session.ts:64
```

## Why line coverage is not enough

Consider:

```js
if (user.isAdmin || user.ownsDocument) allowEdit();
```

The line can run even if the suite never proves that administrators are allowed,
owners are allowed, and everyone else is denied. Branches, decision vectors, and
MC/DC expose those missing cases instead of treating one executed line as proof
that the decision is safe.

The same principle applies to Rust, Python, and Ruby boolean expressions and
control flow.

## What 100% means

Supercov derives the coverage denominator from source structure before the test
run. Adding or removing tests cannot silently change the definition of 100%.

A complete result means every declared obligation was measured and covered. It
does not mean the product has no bugs, the assertions are meaningful, or every
possible input was tested. Review test quality and user-visible behavior, not
only the percentage.

TypeScript imports known to disappear during compilation do not add runtime
statement obligations. The assertion report's `excludedStatements` view lists
these locations. Imports that still execute, including side-effect imports,
remain in the denominator.

To review what your JavaScript and TypeScript tests actually check, see
[Understanding assertions](assertions.md).

If source cannot be measured safely, Supercov reports a measurement limit
instead of claiming completeness.

## Exact and aggregate evidence

When a runner exposes test and attempt boundaries, Supercov can show which test
covered an obligation. When it cannot, Supercov records aggregate background
coverage without guessing which test caused it.

Both are useful:

- exact evidence helps you inspect or minimize individual tests;
- aggregate evidence still shows whether the whole suite reached the source.

See [Supported suites](supported-suites.md) for the attribution available from
each runner.

## Recalculate a view from selected tests

The same stored run can answer different questions:

```sh supercov
npx supercov runs latest --filter all
npx supercov runs latest --filter passed
npx supercov runs latest --filter failed
```

`all` matches the usual whole-run view. `passed` shows evidence from successful
attempts. `failed` isolates failed attempts, including failed retries.

You can also focus on a test level or runner:

```sh supercov
npx supercov runs latest gaps --kind e2e
npx supercov runs latest gaps --runner playwright
```

These views are recalculated from stored evidence. Supercov is not filtering a
percentage that was computed from a different set of tests.

## Fix source scope before chasing gaps

If the summary reports ambiguous source scope, inspect it:

```sh supercov
npx supercov runs latest scope
```

When first-party source lives in unusual directories, declare it explicitly:

```sh supercov
SUPERCOV_SOURCE_ROOTS=src,app npx supercov -- npm test
```

Supercov never treats these as project source, so they are neither measured
nor reported as limitations: another checkout nested in the tree (a directory
with its own `.git`, such as an agent worktree or a vendored clone), hidden
directories at the project root (`.shopify/`, `.vercel/`, `.idea/`), directories
named `generated`, and hashed bundler output inside `assets/`, `static/`, or
`public/`. Packages the root manifest declares in `workspaces` (or
`pnpm-workspace.yaml`) are discovered wherever they live; a declared package
without a conventional source directory is measured as a whole. Functions passed
to compile-time style macros (`stylex.create(...)`) are left as written because
the bundler consumes them at build time; nothing about them runs.

Choose roots that describe code the repository owns. Do not include dependencies
or generated output merely to make a warning disappear.

## Assertion percentage

When a run has an `assertions.json` map, its regular summary also shows
agent-assessed assertion coverage: credited measured statements divided by all
measured statements. This row always describes the whole archived run,
independently of `--filter`, `--kind` and `--runner`. It is separate from the
structural metrics above. See [assertion maps](assertion-maps.md) for credit,
freshness and incomplete-map rules.
