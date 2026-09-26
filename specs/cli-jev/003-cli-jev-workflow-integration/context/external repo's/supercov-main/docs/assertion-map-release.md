# JS/TS assertion map release readiness

**0.0.45 is published.** [Release v0.0.45](https://github.com/supercorp-ai/supercov/releases/tag/v0.0.45)
points to `9f712bdf8821c7c6673d7ee88698f2f206e59311`, also merged into `main`.
It replaces the old assertion analyzer with agent-authored maps while retaining
the released Node registration, worker-attempt and source-location safeguards.
The current interface is described in [assertion maps](assertion-maps.md) and
[the agent workflow](assertion-agent.md). The candidate and earlier follow-up
sections below are historical records, including commands and release conditions
that have since changed.

## Publication verification, 2026-09-13

- [Linux Node 22/24 CI](https://github.com/supercorp-ai/supercov/actions/runs/34717782551)
  passed. All local release gates passed: the full pipeline found an outdated
  run-store snapshot, its expectation was updated for the two automatic map
  files, and that check plus every remaining gate passed.
- [The native matrix](https://github.com/supercorp-ai/supercov/actions/runs/34717784237)
  passed on all eight targets, including installed JS/TS assertion maps and
  verification of the complete release set. Its source is `43373b2`; the sole
  later candidate change is `tests/golden/engine-contract-v1.json`. All runtime,
  build, workflow and package inputs are identical. The release reused these
  validated artifacts and verified the set again from the tag.
- [Publication](https://github.com/supercorp-ai/supercov/actions/runs/34718585934)
  succeeded on npm, PyPI, RubyGems and crates.io. Registry readbacks confirmed
  the primary npm package, eight native npm packages, eight wheels, seven gems
  and all three crates at 0.0.45. npm integrity, wheel/gem hashes and all 23
  GitHub release attachment hashes match the validated artifacts.
- [Actual npm installs](https://github.com/supercorp-ai/supercov/actions/runs/34718681658)
  passed on all eight platforms. Immediate post-publication installs initially
  missed native packages while registry metadata propagated; fresh installs
  passed after propagation, with no artifact changes. A separate clean npm
  install on macOS ARM64 passed the complete JS and TS assertion-map workflow,
  including numeric reports, syntax, acknowledgement, threshold and stale-source
  checks.
- An optimized local query of a 590 KB map containing 500 assertions, 500 flows
  and 500 credited statements took about 0.29 seconds; validation took about
  0.12 seconds. This is one populated fixture, not a general scalability claim.

These checks validate the shipped implementation and distribution. They do not
measure model accuracy or establish semantic completeness or mutation resistance.

## Schema-2 candidate verification, 2026-09-12

The active contract is now [assertion maps](assertion-maps.md) and
[the agent workflow](assertion-agent.md). The sections below record historical
verification of earlier schemas and commands, not today's interface.

The editable map uses schema 2 and managed state uses schema 3. The assertion
completion enum and the `review` command are removed. A flow records its own
`basis`, explicit file/name test selectors, authored paths to `$assertion`,
whole-file watches and optional questions. Read-only validation supplies tokens
for the agent to save. Large validation responses can be paged by flows, changes
or errors. Version-1 maps import without altering their old files; their graphs
remain suggestions, with null tokens and migration questions.

Every changed captured file enters an impact queue, including files already
watched by some flows. Authored change assessments can identify additional
flows affected by missing dependencies. Invalidation generations survive reruns
and reverts; acknowledged changes fold into the next baseline without churning
unchanged tokens. Regular reports distinguish available percentages from
not-assessed, pending, unavailable and inapplicable results. An eligible
zero-credit explanation can yield a meaningful 0%; an untouched map cannot.
`--require-mappings` checks for current explanations at recognized passing
sites, without claiming semantic completeness.

`npm run check` passed: **503 Rust tests**, **22 runtime tests**, schema equality,
formatting, clippy, all 67 embedded assets, package preflight, the CLI lifecycle
and all six JS/TS runner configurations. The same six configurations passed
with Node **22.23.1** and **24.18.0**. The published schema also accepts all five
research design examples, including explicit null basis tokens. Regression
checks cover graph reachability, selector ambiguity, zero-credit status,
per-flow questions, change-response deletion, omitted known dependencies,
additional impact assignments, stable folded generations, token encoding,
legacy import and read-only map/state bytes.

A fresh Supergateway build and focused WebSocket lifecycle run
`run_b511d683679000f9` passed. It inherited `run_f39d12fd349052c2`, preserving all
**245 assertion IDs**, with five exact passing assertion sites and 790 measured
statements. Its public percentage is **pending**, with 46 inherited change
assessments unresolved. No semantic completion of that map is claimed. Local
debug-binary observations were approximately 0.10 seconds for validation and
0.34 seconds for the complete regular report query; this mostly empty map is
not a large authored-map performance benchmark.

`npm run test:native-package` also passed: the optimized Darwin ARM64 binary
was installed from actual npm tarballs and exercised with JavaScript and
TypeScript maps, matching embedded docs and schema. Native complete-set and
corruption checks passed. This is a local packed-install check, not execution
of the schema-2 binary on every release platform.

A release still requires a new native artifact set from the final release
commit. Earlier platform artifacts do not validate schema 2. No tag, merge to
main, registry publication, or model-accuracy claim is implied by these checks.

## Current project source follow-up, 2026-09-12

Assertion analysis now reads the ordinary current project files. New
`assertion-inputs.json` entries store a schema-2 file manifest (paths, SHA-256
hashes and byte sizes), assertion identities and context metadata. They contain
no complete source-file snapshots. The editable `assertions.json` format stays
at schema 1; managed review state uses schema 2. Normal coverage evidence and
exact snippets in map anchors remain available.

New runs inherit prior maps without reading the previous checkout. Unchanged
dependency files preserve review; changes in the assertion's test, node files
or declared watches preserve explanations and queue review. Unique snippets
and exact file hashes support relocation suggestions. Comments, blank lines
and renames require review under the whole-file policy. Unassigned changes
queue scope review. Old schema-1 maps import with review required; old archives,
maps and state remain intact. A checkout edit during execution does not prevent
run publication or discard existing explanations.

Run-bound assertion reporting, validation, review and source access require
matching current files. The regular structural report marks assertion coverage
unavailable when the checkout is stale. `source <path>` remains an optional
numbered current-file view. `assertions files` exposes recorded paths, sizes and
hashes even with stale source. `--archived` is removed; standalone map syntax
validation remains independent of source. User and agent guides reflect this
workflow, and all 67 packaged assets match.

`npm run check` passed with **494 Rust tests**, 22 runtime tests, schema checks,
formatting, clippy, package preflight, the nine-run lifecycle and all six JS/TS
configurations. The same six configurations passed on Node 22.23.1 as well as
Node 24.18.0. Regressions cover source-free input serialization, exact hashes,
missing/edited files, unchanged reuse, implicit test-file dependencies, dirty
latches, changed locations with identical text, legacy migration without old
source, and publication when the checkout changes during execution.

The nested-checkout capture issue identified below is fixed. Discovery excludes
hidden tool directories and nested Git checkouts while retaining ordinary
workspace packages. A regression verifies both the file manifest and integrity
fingerprints; capture also handles ordinary/canonical macOS root aliases and
the existing Windows verbatim-path cases.

A Supergateway build and focused WebSocket lifecycle test passed. Migration run
`run_cd6caa1ff7e33c79` retained all **245 current assertion IDs**, retiring the
299 unrelated nested-worktree sites. Its assertion input entry is 55,375 bytes,
contains 61 file-hash records and no nested-worktree paths; the whole evidence
archive is 57,054 bytes. After the CLI finished rebuilding, final run
`run_f39d12fd349052c2` inherited that map and verified as current. Its regular
report displays 0% (0/790) because all 245 assertions remain unmapped. All 790
statement anchors resolve; five exact assertion sites have passing evidence in
this focused test. The 46 scope-review entries from the removed worktree inputs
remain latched for agent classification. This trial validates migration and
bookkeeping, not a completed semantic mapping of Supergateway.

`npm run test:native-package` passed: a rebuilt release binary in an actual
macOS arm64 npm installation exercised JS/TS maps, source access, stale-input
rejection and percentage gates. Release-set, wheel, gem and corruption checks
also passed. The platform artifacts below belong to earlier code; build fresh
release artifacts from the final selected commit before publication.

## Assertion and source resources follow-up, 2026-09-12

The public inspection commands now follow the existing resource naming:
`runs <run> assertions` lists sites with mapping, review and passing-execution
status; `runs <run> assertion <id>` reads one assertion and its authored flows;
`runs <run> source <path>` prints archived code with line numbers. Structured
line/text objects are limited to `--json`. The separate inventory command and
nested assertion-source command are removed, with migration guidance on error.

The list combines authored entries with discovered sites missing from the map.
Those entries have `inMap: false` and remain incomplete without earning credit.
Detail queries read authored flows and calculated status from the same snapshot.
Source queries work independently of map JSON and preserve the archived code
when the checkout changes. Source/list pages include copyable next-page commands.

`npm run check` passed: 488 Rust tests, 22 runtime tests, all six JS/TS
configurations, schema, embedded assets, formatting, clippy and package preflight.
The six JS/TS configurations also passed on Node 22.23.1. Regressions cover
readable source, Unicode/indentation/blank lines, paging, missing-map entries,
exact detail IDs, invalid options, full flow details, matching test names and
source access during malformed map edits. All three text views were checked
against Supergateway's archived `run_1d377c69729e4e0d`.

`npm run test:native-package` passed for code commit `bf956b4`: the packed macOS
arm64 npm install exercised the new resources for JavaScript and TypeScript;
release-set, wheel, gem and corruption checks also passed. Earlier platform
artifacts below are historical; build new artifacts from the final release commit.

Source-storage research subsequently found a release issue in capture scope:
the Supergateway archive includes 46 files and 299 assertion sites from an
unrelated nested `.claude/worktrees` checkout. File discovery must exclude
unrelated nested checkouts without excluding real workspace packages. Add a
regression and verify a fresh Supergateway run before publishing. Do not rewrite
old archives to hide the issue. Measurements and storage alternatives are in
[the source snapshot research](source-snapshot-storage-research-2026-09-12.md).

## Automatic map creation follow-up, 2026-09-12

Code commit `c6811f4` makes each normal run publish `assertions.json` and
`assertions.state.json`
together with its evidence. The newest available map with the same command and
language is carried automatically. `assertions init` is removed. Fresh assertions
start unmapped; exact moves retain identity; changed or ambiguous claims require
review. Failed runs get maps without inheriting a passing score. If a newer map
is malformed, an older fallback preserves work but requires review. Reports
expose the map path, inheritance source and skipped-map diagnostics.

`npm run check` passed after this change: 484 Rust tests, 22 runtime tests,
all six JS/TS configurations, schema, embedded assets, formatting, clippy and
package preflight. The six JS/TS configurations also passed on Node 22.23.1.
The nine-run lifecycle regression checks automatic creation, unchanged reuse,
command isolation, source relocation, dirty-state persistence, malformed-map
fallback and failed runs. Old map and state files remain byte-for-byte unchanged.
The publication tests exercise final-rename and invalid-input failure paths.

A fresh Supergateway WebSocket lifecycle run, `run_1d377c69729e4e0d`, passed and
automatically inherited the 544 assertion entries from `run_a7a997bb35c093ec`.
No initialization command was used. Its 790 measured statement anchors resolve;
the inventory is still unmapped and correctly reports 0% assertion coverage.

`npm run test:native-package` passed using the new release binary: a real macOS
arm64 npm install exercised JavaScript/TypeScript automatic map creation, review,
validation, percentage and freshness gates. Native release-set checks also passed.
The platform CI and native artifacts recorded below belong to the earlier
baseline, not this change. Rebuild the release artifacts from the final selected
commit before publishing.

## Baseline verification, 2026-09-12

Environment: macOS arm64, Node 24.18.0, Rust 1.95.0. The JS/TS runner matrix
uses TypeScript 7.0.2, Vitest 4.1.11, Jest 30.5.1 and Playwright 1.62.1.

| Gate | Result |
| --- | --- |
| Full local `npm run release:check` | Passed, including existing language adapters, runner/browser matrices, packed npm, MC/DC oracle and transform benchmark |
| Final `npm run check` after report optimization | Passed: formatting, clippy, 483 Rust tests, 22 runtime tests, map lifecycle, six JS/TS configurations, schema, assets and package preflight |
| [Linux Node 22/24 CI](https://github.com/supercorp-ai/supercov/actions/runs/34708624833) | Both passed on corrected candidate code |
| Final local `npm run test:native-package` | Passed: actual macOS arm64 package installation, JS/TS maps, all 14 bundled guides, generated schema and release-set corruption gates |
| [Native platform matrix](https://github.com/supercorp-ai/supercov/actions/runs/34708623064) | All eight targets and the complete release-set verification passed |

The native matrix covers macOS arm64/x64, Linux glibc and musl arm64/x64,
and Windows arm64/x64. Installed-package hosts exercise JS/TS assertion maps;
musl binaries exercise the same map workflow in actual Alpine Node consumers.
The release-set job validates the complete native package, wheel and gem set.
Ruby/Python feature development is outside this release scope; existing adapter
regressions and distribution gates remain enabled.

The first native matrix caught a Windows-only frozen-input path mismatch:
canonical paths carried a verbatim prefix while discovery paths did not. The
collector now uses the existing workspace path normalization for both paths,
and deduplicates relative/absolute references to the same source. A regression
checks both Windows spellings plus rejection of inputs outside the project.
Both Windows path regressions passed; the corrected candidate passed on all
eight targets.

The map tests cover exact assertion identity, awaited operands, same-test
execution, explicit statement credit, dirty-state persistence, selective review,
carry across runs, invalid JSON diagnostics and scope/freshness/completion gates.
The regular summary is checked before mapping, after review, after a map edit,
after malformed JSON, and after repair. Invalid or changed maps cannot reuse an
old percentage.

A real Supergateway `tests/websocketLifecycle.test.ts` trial passed normally and
under Supercov using `node --import tsx --test --experimental-test-module-mocks`.
Run `run_a7a997bb35c093ec` records all five exact passing assertion identities,
including the awaited broadcast check; all 790 measured statement anchors
resolve. Its 544-site inventory remains unmapped. This is execution/identity
validation, not a completed assertion assessment for Supergateway. That
checkout's `ts-node/esm` command also failed without Supercov; the clean trial
uses `tsx` explicitly.

## Percentage display and cost

`supercov runs <run>` automatically includes **Assertions** beside Lines,
Branches and MC/DC when `assertions.json` exists. The JSON path is
`data.assertionCoverage.summary.statements.percentage`. The ratio is the union
of credited measured statements divided by all measured statements in the
archived run. Structural filters do not change this separately labelled score.
Incomplete maps, dirty flows and review problems remain visible. A zero
statement denominator displays `n/a`.

On the release binary, a synthetic fixture with 500 passing assertions, 500
mapped flows, 500 measured statements and a 529 KB map reported 100% (500/500).
Seven complete summary queries had a median of **118 ms** (117–133 ms), compared
with **15 ms** before adding the map. This is a local fixture measurement, not a
latency guarantee for arbitrary repositories. The query recalculates from the
map, state and local archive; it neither reruns tests nor calls a model. Exact
assertion witnesses are indexed once per query to avoid repeated inventory
scans. No cached percentage can become stale after a map edit.

## Reproduce and publish

```sh
npm ci
npm run release:check
npm run test:native-package
```

The candidate already uses the unused version 0.0.45 in Cargo and npm manifests,
lockfiles and native package URLs. Public guides and the JSON schema are
packaged, and 67 embedded assets are checked for exact agreement. The old
TypeScript analyzer and its build/install steps are removed.

The native matrix above produced and verified the complete 0.0.45 artifact
set from the corrected candidate. Publication remains a separate action:
recheck that the version is unused, select the release commit on main, then
follow the existing tag and trusted-publishing workflow. The validated
workflow run records the baseline artifacts only. The automatic-map follow-up
requires a fresh native artifact set from its final release commit. Do not reuse
the baseline artifacts or 0.0.44 binaries.

The support claim is an agent-authored assessment with mechanical bookkeeping
and exact execution evidence. Optional, nested or unrecognized assertion forms
can lack individual runtime identity. Generated/browser transports and unusual
loaders need representative map trials before broader claims are made. No
percentage proves the semantic graph, mutation resistance or safe arbitrary
changes.

User and agent entry points: `supercov docs assertions`,
`supercov docs assertion-agent`, `supercov docs assertion-maps`,
`supercov assertions schema`, and `supercov runs <run> assertions --help`.
