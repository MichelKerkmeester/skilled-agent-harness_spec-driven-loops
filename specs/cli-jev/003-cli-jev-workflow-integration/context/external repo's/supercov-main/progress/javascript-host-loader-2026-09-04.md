# A host ESM loader claims our generated modules — 2026-09-04

Status: fixed by giving the generated modules the .mjs extension, with a gate
that reproduces the loader property. Found while triaging a report from
measuring Supergateway, whose test command is

```sh
node --test --experimental-loader ts-node/esm --experimental-test-module-mocks tests/**/*.test.ts
```

Every worker fails before test code runs:

```text
SyntaxError: The requested module './capability.js' does not provide an export
named '__supercovBindCapabilityWrapper'
```

## What is happening

The generated runtime lives at `.supercov/node_modules/` inside the project, so
it is inside the host's loader scope. `ts-node/esm` claims those files: the
instrumented workspace's `register.mjs` arrives with TypeScript's
`__rewriteRelativeImportExtension` helper spliced in, which is emit, not our
output. Importing the same directory under that loader from a scratch entry
gives the clearer error:

```text
ERR_REQUIRE_CYCLE_MODULE: Cannot require() ES Module .../capability.js in a
cycle
```

So a host loader pulls our ESM through `require()`, and a named import that
Node links statically has nothing to bind to.

We already declare the generated directory ESM with its own
`{"private":true,"type":"module"}`, and the modules have no cycle among
themselves: `capability.js` imports nothing and `launchSupervisor.js` imports
only Node built-ins. The cycle appears through the loader, not through us.

## What identified it

The directory name, not the loader. The same file, under the same loader, in
two places: under a directory called `node_modules` it fails, under one that
is not it links. Loaders skip dependencies by convention, so `ts-node/esm`
hands anything under `node_modules` back as CommonJS. Two earlier suspicions
were wrong and are recorded so nobody re-runs them: the extension appeared not
to matter, because the comparison was made outside `node_modules` where
nothing fails, and the duplicate loader registration the failing run performs
links fine on its own.

## The fix

The generated modules carry the `.mjs` extension. It keeps the directory and
every path-based exclusion that depends on its name, changes no resolution,
and no tool can misread it. The generated `package.json` declaring the
directory ESM was already written and is bypassed by a loader that claims the
file, so the extension is what settles it: under `node_modules` the `.mjs`
copy links even with no `package.json` present.

`scripts/rust-host-loader-integration.mjs` runs a fixture under a loader with
exactly that property, which reproduces ts-node without depending on its
version. Putting one module back to `.js` fails it.

## The rest of that report

Child-process attribution was the other open question, and it is not a defect.
Coverage from a child keeps its test through a direct spawn, a dependency
spawning on the test's behalf, a spawner that curates the child's environment,
an npm script in between, and a gateway over stdio through each teardown,
including the one where the child exits after the test body returned and
writes its last evidence with no test running. `scripts/
rust-child-attribution-integration.mjs` holds all of it. A child launched in a
hook and shared across tests still belongs to the run, which is the honest
answer rather than a bug.

Their suite hangs on its own. A child left running holds the test runner's
pipes open, and the same fixture hangs under plain `npm test` with no coverage
involved, timing out with "Promise resolution is still pending but the event
loop has already resolved". That is the hanging after-hook their report
describes.
