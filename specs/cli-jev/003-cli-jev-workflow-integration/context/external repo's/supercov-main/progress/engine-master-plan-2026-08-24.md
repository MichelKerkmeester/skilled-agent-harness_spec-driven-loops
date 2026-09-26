# Supercov engine end-state — master plan (2026-08-24)

Decision: optimize for best possible UX and best possible performance, no
shortcuts. Rewrites are approved. This document fixes the target architecture,
the acceptance gates, and the order of work. It deliberately does not touch
code; a compatibility sweep is in flight and Tier 1 (trust) still lands first.

Current sequencing note (2026-08-26): the Rust-only JavaScript cutover described
in the checkpoint below is complete and published. The active critical path and
requirement-to-gate ordering now live in
`progress/current-execution-plan-2026-08-26.md`: finish the owned Rust-language
frontend and prove it through Supercov-on-Supercov dogfood before resuming
Python and later languages. This master plan remains the architectural end
state and invariant set; the current execution plan supersedes only obsolete
migration sequencing.

## Committed end-state decisions

1. **Rust core engine, single static binary.** CLI, project discovery,
   workspace isolation, instrumentation orchestration, evidence analysis,
   and query engine all compile into one 5–15 MB static binary per
   platform. The current TypeScript engine is a *regression reference* only
   while the port is incomplete—not the semantic authority. As soon as the
   complete
   Rust engine passes the frozen differential and conformance gates, the
   cutover removes the old TypeScript engine in the same consolidation phase.
   There is no permanent engine selector and no extra fallback release.
2. **oxc for JS parsing/codegen** in the Rust instrumenter (published
   benchmarks: ~40x Babel, ~4x SWC for parse→transform→codegen). This is a
   true port of the ~1,600-line instrumenter, not a parser swap — Babel and
   oxc ASTs differ.
3. **Every user run is measured entirely by Supercov.** External coverage
   engines—coverage.py, LLVM source coverage/profdata, Go native coverage and
   equivalents—are development-only differential oracles. They may generate
   checked-in conformance facts and CI comparisons, but they are never invoked,
   imported, configured, or required by a user's Supercov run. The existing
   test command is the only user configuration. Supercov discovers its launch
   graph, transforms/injects its own probes inside the isolated workspace, and
   collects its own evidence automatically. A missing third-party coverage
   package can therefore never change whether a user run works.

   The unavoidable collectors stay in the target language. The JS runtime and
   adapters remain Supercov-generated JS; Python receives a Supercov-generated
   stdlib-only import/runtime/pytest shim; compiler and runner hooks for other
   languages follow the same rule. Per language the engine grows exactly two
   things—where Supercov-owned probes are inserted and how test/phase identity
   propagates to them. The evidence contract, analysis, MC/DC pair search and
   query surface are shared and are never rewritten per language; probe v2's
   ternary-vector/epoch model is language-neutral precisely to keep that true.

   The ownership rule is stricter than merely moving hot paths: **everything
   that can live in Rust does**. Target-language code is permitted only where
   it must execute inside a runtime, browser, compiler/plugin API, test runner,
   or assertion framework. Such shims may propagate context and append frozen
   Supercov evidence records; they may not implement manifests, coverage
   arithmetic, MC/DC solving, merging, persistence, querying, or policy.
   Ahead-of-run source transformation belongs in Rust whenever a sound parser
   exists; runtime hooks remain thin loaders for dynamic/generated modules.
   This keeps one correctness implementation and one performance profile
   across every language rather than accumulating a Python product, an OCaml
   product, etc.
4. **No resident processes — ever.** (User decision 2026-08-24; supersedes
   the earlier `supercov serve` proposal.) Every invocation is fire-and-
   forget; "no resident service" stays a product guarantee. Query latency is
   solved at the root instead: (a) Rust engine cold start ≤10 ms; (b) the
   query index becomes a memory-mappable zero-copy binary format so opening
   it costs milliseconds at any repo size — persistent *data*, not a
   persistent *process*, with the same integrity checks as today; (c) engine
   layering so read-only queries never load instrumentation code (on the TS
   engine: dynamic imports so query commands skip Babel — cheap interim win).
   MCP, if ever shipped, is a thin optional wrapper spawned and owned by the
   agent harness over the same CLI semantics — never an engine assumption.
5. **Probe architecture v2** — the real performance ceiling is instrumented
   runtime overhead, which no engine rewrite touches. Architecture gate
   ≤1.10x; post-architecture optimization target ≤1.05x. The
   frozen design uses base-3 decision frames (`unreached/false/true`),
   file-local numeric point indices, dense vector epochs for ordinary
   decisions, and per-attempt/phase epoch short-circuiting so hot loops enter
   the collector only once per obligation. V8 builtin coverage remains a
   possible cheap line/function source where
   attribution semantics allow (serial runners only — precise V8 deltas are
   process-global and cannot attribute concurrently interleaved tests, so
   probes remain the attribution mechanism; this constraint is load-bearing).
6. **Distribution matrix, ruff/uv pattern.** One release pipeline publishing
   the same binary everywhere: GitHub Releases artifacts; npm with
   per-platform `optionalDependencies` (esbuild pattern); PyPI platform
   wheels via maturin `bindings = "bin"` (well under the 100 MB PyPI file
   limit once the engine is Rust); Homebrew; `curl | sh`; cargo-binstall.
   Wrappers are exec-only glue.
7. **Frozen contracts, written as specs.** Evidence archive schema, run-store
   layout, CLI surface + JSON envelopes, waivers file format, and process
   supervision. (The no-resident-process decision removes serve entirely.)
   Both engines must pass the same black-box contract tests. Independent
   language behavior, coverage-model specifications, and external oracles are
   authoritative; TypeScript/Rust differences are diagnostics to investigate,
   not an automatic requirement that Rust reproduce a TypeScript defect.
   These specs are the Rust implementation's requirements document.

## Why a full rewrite is safe *for this project specifically*

The project already owns a runtime-agnostic conformance net:
- Test262 semantic-equivalence corpus (65,051 baseline-passing scenarios at
  revision `3655e7464de3d52643ecddd4b5f9f4f3e7f62398`) —
  validates instrumented-output *behavior*, not implementation.
- Independent Clang/LLVM MC/DC oracle.
- Golden fixture repos across Playwright/Vitest/Jest/node:test/opaque runners.
- The self-dogfood loop plus `supercov diff` for exact regression evidence.

A differential harness runs both engines on the same inputs and requires
identical frozen obligations plus semantically identical reports where the
contract is unchanged. It is a neighborhood/regression detector, not an
oracle. Every intentional Rust correction requires an independent semantic or
coverage-model test that demonstrates why the difference is correct; the
frozen contract is versioned deliberately when the correction changes it.

## Acceptance gates (performance)

| Metric | Today | Gate |
| --- | --- | --- |
| 500-file transform (median) | ~1,008 ms (Babel) | ≤50 ms |
| 50k-file monorepo transform | ~100 s extrapolated | ≤5 s |
| CLI query total (start + index open) | ~100–300 ms | ≤15 ms (Rust + mmap index) |
| Instrumented runtime overhead | ~1.04–1.06x pinned realistic | ≤1.10x architecture; ≤1.05x optimization |
| Evidence analysis, 25 MB raw | ~2 s cold | ≤200 ms cold |
| Engine binary (compressed) | n/a (needs Node) | ≤15 MB/platform |
| Workspace prep, 500 files | ~78 ms (clonefile) | unchanged (already floor) |

Gates are measured by the existing benchmark suite extended per phase; a gate
miss blocks flipping any default.

## Phase order and gating

- **Phase 0 (in flight): Tier 1 trust work.** Compatibility sweep, per-test
  empty-evidence diagnostic, docs reconciliation. Nothing below starts until
  the sweep's fixes land — the rewrite must port *fixed* behavior.
- **Phase 1: contracts + harnesses.**
  (a) Author the five contract specs from current behavior.
  (b) Differential/conformance harness: golden corpus of
  (fixture → evidence archive → report JSON) with a byte/semantic comparison
  mode able to run two engine builds side by side.
  (c) TS-engine query latency trim: dynamic imports so read-only queries
  never load the instrumenter stack (no daemon; fire-and-forget preserved).
- **Phase 2: probe architecture v2 contract.** First prototyped on the TS
  engine so Rust does not port an obsolete transport, but validated against
  independent semantic and coverage-model tests rather than TS behavior. Gate:
  identical MC/DC verdicts across Test262 corpus + full fixture matrix,
  overhead ≤1.10x, self-dogfood diff shows no lost attribution. Reaching
  ≤1.05x is deliberately deferred until the architecture and Rust parity are
  established.
- **Phase 3: Rust instrumenter crate (oxc).** Exercised behind
  `SUPERCOV_ENGINE=rust` by development, differential and ecosystem CI while
  the shipped TypeScript engine remains the user path. This selector is a
  migration tool, not a product feature. Gate: Test262 corpus green,
  exact frozen manifests across the matrix, independently correct behavior,
  and the 500-file gate met. A TypeScript differential remains a diagnostic.
- **Phase 4: Rust engine shell.** CLI, discovery, workspace (clonefile/
  FICLONE parity), run lifecycle, analysis (bitset MC/DC pair search),
  and query engine. Gate: every differential deviation on the full sweep and
  self-dogfood matrix is either eliminated or justified by an independent
  conformance test and deliberate contract revision; query cold-start gate
  met. Then perform one atomic
  cutover: Rust becomes the sole engine; delete the TypeScript instrumenter,
  analyzer, report/query engine, orchestration implementation, migration flag,
  and Babel engine dependencies. Preserve frozen contracts, golden outputs,
  corpora and black-box tests—not a second executable engine.
- **Phase 5: distribution matrix + owned Python frontend.** Release pipeline
  for all registries; then a Rust Python parser/transformer emits the complete
  owned obligation manifest and injects probe v2 ahead of the existing test
  command. A generated stdlib-only import hook handles dynamic modules and a
  generated pytest adapter supplies exact worker/test/retry/phase/assertion
  context. coverage.py remains outside the product and runs only in the
  development differential harness. PyPI wheels and `npx supercov -- pytest`
  both execute the same Rust binary and require no project dependency.
- **Phase 6: every other language, at full quality.** Rust, C/C++, Go, then
  JVM/Ruby/PHP. Each product frontend owns its instrumentation and emits the
  shared probe/evidence protocol; native coverage output is used only as an
  independent development oracle. LLVM and Go coverage can validate structural
  verdicts, but no shipped run imports their profiles. Full per-test
  attribution and assertion linkage remain requirements even for compiled
  languages; compiler passes, PPX/plugin APIs, generated wrappers and runner
  hooks are acceptable Supercov-owned injection mechanisms. Gate per language:
  semantic-equivalence corpus, exact differential against the strongest
  independent oracle, runner/concurrency/crash matrices, explicitly enumerated
  limitations, and a zero-configuration run using only the pre-existing test
  command. A language whose corpus is not green is a language we do not claim
  to support. Full design, per-language matrix, attribution ladder and spikes
  S8–S10: `progress/multi-language-architecture-2026-08-24.md`.

## Checkpoint — 2026-08-25 Phase 3 Rust JS instrumenter complete

- Phase 0 findings, Phase 1's five frozen v1 contracts, black-box harness,
  probe-v2 contract, and Rust workspace are committed. Published v1
  manifests/evidence remain unchanged. Probe v2 uses exact base-3 vectors
  through 32 conditions and the exact v1 frame above that numeric cap.
- TypeScript remains a useful regression reference while the port is private,
  but is not authoritative. Language semantics, frozen obligations, Test262,
  the independent MC/DC oracle, and black-box contracts decide correctness.
  Its semantic/property corpus, frozen vectors, reset recovery,
  interleaved-attribution tests, and measured 1.04–1.06x realistic runtime
  overhead remain green.
- The oxc 0.133 Rust transformer now implements the complete frozen JavaScript
  denominator: statements, functions, control decisions, logical value
  selection, optional members/calls, logical assignments, parameter and
  destructuring defaults, try/catch, zero-versus-entered `for-in`/`for-of`,
  switch match/no-match, exact wide-decision fallback, and explicit dynamic
  code limitations. It also ports `with`, direct/dynamic evaluation,
  Function source reflection, unsafe parameter/class handling, framework
  request handlers, generic HTTP/WebSocket callbacks, full manifest
  generation, source maps, probe-v2 registration, and real runtime evidence
  calls.
- Classic scripts remain scripts and bind helpers through the injected global
  runtime; modules retain the virtual runtime import. Directive prologues,
  parenthesized assignment name inference, anonymous default names, optional
  call receiver references, comments (including Test262 YAML payloads), and
  source-map destinations have dedicated regression handling. The 64,171-
  comment Mozilla staging stress file transforms and runs in about 1.6s after
  eliminating quadratic comment editing and line/column lookup.
- The live Babel/oxc differential gate covers 240 exact decision/point/branch/
  limitation manifests, 33 hand-authored behavior/effect/vector/hit cases,
  and 160 deterministic generated programs. Rust and TypeScript also produce
  byte-identical archived manifests and exact summary/files/gaps JSON for a
  mixed Vitest + two-worker Playwright production run, including request,
  popup, user-context, service-worker, and WebSocket attribution.
- The complete pinned Test262 gate at revision `3655e746...` is green over
  41,593 selected files. Four disjoint shards observed 65,053 baseline-passing
  scenarios in total with zero Rust transform failures and zero semantic
  failures. (The monolithic run observed 65,051; baseline host support has a
  two-scenario scheduling variance, and every execution is compared only to
  the passing baseline in the same invocation.) A representative monolithic
  timing measured 598.54s baseline execution, 14.67s Rust transformation, and
  454.59s instrumented execution; this conformance workload shows no gross
  runtime regression, though it is not the realistic overhead benchmark.
  The harness now obtains results through a dedicated machine channel and
  rejects incomplete, crashed, or console-contaminated result streams. Its
  default, CI, conformance, and release invocations all name Rust explicitly;
  TypeScript can be selected only as a diagnostic reference.
- The release transform gate now measures 500 distinct files inside the Rust
  engine rather than timing the legacy Babel transformer over one concatenated
  source. Current measurements are 25.60 ms median and 30.12 ms p95, with a
  2.56 s linear 50,000-file projection. The temporary Node/JSON migration
  boundary measures 54.96 ms median and is intentionally removed in Phase 4.
- The private production selector batches an entire direct workspace or Vite
  inventory through one Rust child and includes the Rust binary fingerprint in
  run/build integrity. The Rust child is excluded from application child-
  process telemetry. `SUPERCOV_ENGINE=rust` remains the only activation path.
- The complete supported-fixture matrix now runs through that Rust selector,
  covering Vitest, Playwright, native `node:test`, the retained Jest
  compatibility fixture, CommonJS and ESM opaque launch interception,
  esbuild, webpack, SWC, Next.js, distributed merge, and the bounded agent
  query workflow. The Playwright surface is green with two workers in
  Chromium, Firefox, and WebKit, including request fixtures, user-created
  contexts, popup frames, service workers, and WebSockets.
- Exact-fingerprint build reuse is a first-class Rust gate. A reused bundle
  and its current preloader now share collector identity by build fingerprint
  rather than run ID; otherwise cached bundle probes silently become
  background evidence. esbuild, webpack, and SWC each prove fresh and reused
  runs retain four attributed tests and 100% passed-only MC/DC. Pull-request,
  weekly conformance, and release workflows run the Rust parity and browser
  gates; weekly/release Test262 shards invoke the release Rust binary.
- Engine parity is no longer an aggregate-score check. Six production shapes
  (mixed Playwright/Vitest, native `node:test`, esbuild, webpack, SWC, and
  Next.js) now require byte-identical manifests plus exact normalized raw test
  and server evidence, deterministic full-report semantics, outcomes,
  explicit action/assertion attribution, confidence, and representative agent
  query envelopes. Normalization is restricted to run IDs, clocks, temporary
  paths, process-derived worker/attempt identity, and timestamp-only phase
  correlation; a TypeScript-versus-TypeScript repeat proves the comparator is
  stable under those rules. Probe v2 also no longer archives registered but
  unobserved decisions as empty snapshots, matching the frozen v1 evidence
  contract rather than merely producing the same aggregate score.
- Supercov self-dogfood now compares large archives in memory-bounded child
  processes rather than retaining two expanded archives and reports at once.
  The current 186-test TypeScript-reference run
  `2026-08-25T00-29-05-152Z` and Rust run
  `2026-08-25T00-30-26-768Z` both pass. They have identical 1,427 decisions,
  1,953 conditions, 551 covered conditions, outcomes, and MC/DC. The only
  diff is 19 line/branch observations in `engineInstrumenter`,
  `engineProcess`, and `engineEvidence`, which deliberately execute different
  outer-engine implementations. Rust completed the tests in 14.7 s versus
  54.8 s for the recursively instrumented TypeScript reference.
- Assertion phases without measured application evidence are now reported as
  an ambiguity warning, not falsely asserted to be transport loss. Static
  contract/data tests can legitimately have no application probe. Corrupt
  evidence and explicit transport failures remain errors. Unscoped health and
  readiness requests also form an attribution boundary instead of inheriting
  the launching test, while nested callbacks with explicit request scope
  retain that scope. Timestamp-only correlation remains diagnostic and cannot
  upgrade action/assertion confidence.
- The release contract audit also corrected a stale fixture golden that counted
  an exported function declaration as both an executable statement and a
  function entry. The frozen denominator has three real statements plus one
  function obligation; an explicit model regression prevents double-counting.
- A watchdog regression exposed why implementation parity is insufficient:
  the old parent sent SIGUSR2 to every Node descendant after 60 seconds, which
  could terminate a healthy unpreloaded test child. Diagnostics are now
  signal-free. One atomically elected preloaded process reports active resource
  types on a timer, while the parent remains observational unless the user set
  an explicit command timeout.
- The first language-neutral Phase 4 ownership slice is now real Rust code:
  evidence archives are collected, framed, gzip-compressed, fsynced, and
  atomically published by Rust whenever the private Rust engine is selected.
  Its streaming reader is also implemented for the coming Rust analyzer. The
  contract tests reject unsafe/unsorted/duplicate paths, non-canonical headers,
  symlinks, missing manifests, truncation, concatenated gzip members, trailing
  data, and leftover temporary files; they prove deterministic gzip metadata,
  arbitrary binary payloads, and true Unicode code-point ordering. This audit
  found and corrected two historical JavaScript deviations—locale-dependent
  ordering and permissive archive reads—instead of preserving them as Rust
  behavior. The internal Rust child is explicitly excluded from application
  launch telemetry.
- The Playwright parity fixture now exercises a failed first attempt followed
  by a terminal pass, a skipped test, and an expected failure. The gate asserts
  the complete observed view reports `flaky`/`skipped`/`failed`, passed-only
  retains only retry 1 of the flaky test, and expected-failure coverage cannot
  become verified coverage. Rust fixture CI also executes the real SIGKILL
  transaction recovery and hung-process watchdog paths before the Firefox and
  WebKit reruns, so engine selection is covered under failure supervision as
  well as normal completion.
- Phase 3 is promoted. The independent syntax matrix is green for 43 cases on
  Node 22, Node 24, Chromium, Firefox, and WebKit. Essential SEO Rust dogfood
  run `2026-08-25T00-25-52-427Z` passed all 30 offline tests; a preceding VM
  snapshot tar race failed before test execution and the retry isolated that
  failure to Supermachine's bake path. The six production fixture shapes,
  retries, crashes, async context, concurrency, multi-worker attribution,
  complete Test262 corpus, MC/DC oracle, self-dogfood, and transform budgets
  are green. Every observed TypeScript/Rust deviation is either normalized
  execution identity/timing, proven same-engine workload nondeterminism, or
  the expected execution of different outer-engine implementation files.
  `instrument_candidate` now declares the complete
  `complete-js-instrumenter-v1` contract with no port-progress limitations.
  Rust selection remains private because the product engine shell is not yet
  complete. Phase 4 already owns frozen probe/agent-JSON contract slices and
  evidence packing/strict reading; discovery, workspace, supervision,
  analysis, solving, indexing, querying, and lifecycle are the next Rust ports.
- Phase 4 has begun with the first language-neutral analyzer slice. Rust now
  owns deterministic masking-MC/DC witness search using dense candidate
  bitsets, plus exact line/statement/function/branch/condition summary
  arithmetic. Manifest condition counts are explicit, so unexecuted decisions
  cannot disappear from the denominator. The independent Clang fixture and
  250 generated models require exact witness order and summary parity with the
  regression reference. This core accepts no JavaScript-specific types and is
  the shared verdict engine for every future language frontend.
- Phase 4 now also owns language-neutral evidence normalization and complete
  report reconstruction. Rust merges runtime, browser, scoped server and
  background evidence; de-duplicates vectors and hits; resolves retries and
  terminal outcomes; derives all/passed/failed views; preserves per-test and
  per-phase attribution; computes explicit action/assertion confidence; and
  aggregates lines, test files, runner/kind views and transport diagnostics.
  One hundred generated evidence models require exact serialized report
  parity, while real immutable Playwright, `node:test`, esbuild, webpack and
  SWC archives require exact report, attribution, outcome, filter and transport
  parity when read directly by the strict Rust archive reader. Independent
  Rust regressions prove that an unexecuted manifest decision cannot disappear
  from the denominator, timestamp overlap cannot claim causal confidence,
  expected failures cannot become verified coverage, malformed JSONL remains
  visible without discarding valid records, and cross-run evidence is rejected.
  The differential also found and removed an old TypeScript-only serialization
  leak where an internal `Set` appeared as `explicitPhases: {}` on line
  results despite not existing in the frozen public schema.
- Phase 4 spike S2 is closed by
  `progress/query-index-adr-2026-08-25.md`. On the pinned 100,000-line corpus,
  gzipped JSON misses the complete CLI gate at 16.473 ms p95 before process
  startup; authenticated+validated rkyv measures 5.231 ms, authenticated+
  verified FlatBuffers 9.306 ms, and the selected fixed-layout columnar index
  with SHA-256 header/page validation 0.129 ms. The fixed format is also stable
  across Rust/compiler layouts and 34% smaller than rkyv. Its section layout,
  checked arithmetic, corruption corpus, immutable publication and rebuild-on-
  version-mismatch rules are now Phase 4 implementation requirements.
- The production Rust crate now implements the selected index container rather
  than retaining the benchmark as an aspiration: a 4 KiB authenticated v1
  header binds evidence hash/length, archive schema, analysis identity and
  producer ABI; a checked section directory uses fixed little-endian widths;
  and every read authenticates each touched 64 KiB page before returning bytes.
  Publication uses unique temporary files, `fsync`, and atomic rename; readers
  reject symlinks, stale identities, malformed record shapes, overflow, bounds,
  overlapping regions and corrupt pages. Tests prove old mappings survive an
  atomic replacement and invalid inputs leave no published artifact. The typed
  coverage sections and agent query operators are the next layer; the shipped
  TypeScript gzipped-JSON cache remains in place until that layer reaches the
  same black-box query gates.
- The language-neutral exact smallest-test-set solver has moved into Rust.
  It preserves MC/DC witness-pair choices rather than flattening them into
  ordinary set cover, expands file-scoped setup evidence only with selected
  tests, recomputes every structural metric for each final subset, rejects
  background/unattributed evidence, proves unreachable targets explicitly,
  and enforces the frozen search-state budget. One hundred twenty generated
  mixed line/statement/function/branch/MC/DC models require exact selected and
  expanded identities, summaries and explored-state counts against the
  regression engine; independent Rust tests cover redundant vectors,
  unattributed evidence and combinatorial-budget failure. The remaining query
  work is the typed mmap column layer and the complete summary/files/file/
  decision/covers/test/diff agent surface.
- The typed mmap layer now stores interned UTF-8 strings, complete structural
  summaries and per-file gap arithmetic for all, terminal-passed and failed
  views as fixed little-endian records—not JSON report blobs. Readers validate
  record widths, reserved fields, references, UTF-8, view cardinality,
  decision/count ordering, limitation masks and recomputed gap scores. Five
  real immutable fixture archives require exact round trips for every summary
  and file gap. More importantly, the first production query operators now
  read only these columns: `coverage files` and `coverage gaps` produce
  byte-identical frozen agent-JSON envelopes across Playwright, `node:test`,
  esbuild, webpack and SWC with varied outcome filters, metrics, pagination
  offsets and limits. The same fixed records now materialize every observed
  test-kind, runner, and valid kind+runner projection. Each projection
  recomputes masking-MC/DC witnesses from its own selected vectors and records
  whether a missing obligation is covered by other tests or uncovered
  everywhere. Byte-identical live queries prove those provenance filters on
  the same five archives. A typed decision-gap section now also powers the
  agent-oriented `coverage file --group decision` query, with exact
  per-projection witness recomputation, location/missing ordering, totals and
  pagination; its live JSON is byte-identical across that archive matrix.
  Typed provenance-dimension records now power `coverage kinds` and
  `coverage runners`, including each dimension's independently recomputed
  structural summary and stable pagination. Their byte-level gate uncovered
  and fixed a Rust/JavaScript representation difference: integer-valued
  percentages now serialize as JSON integers (`100`, not `100.0`) everywhere
  in Rust agent output, preserving the frozen JSON byte contract centrally.
  A typed projection section now powers the complete `coverage summary`
  envelope for every outcome/kind/runner selection. It stores independently
  recomputed structural coverage, measurement blockers, transport health,
  action/assertion attribution, empty-evidence diagnostics, confidence,
  test outcomes, gap counts and source-scope roots/counts. The full summary
  JSON—not selected fields—is byte-identical on all five real archives for
  both provenance-filtered and passed-only views. Strict relation-range
  validation caught a scope-root-count/summary-flag layout overlap during the
  differential; the fixed-width layout was corrected before publication.
  `coverage scope` now reads typed scope-entry records with strict file/status/
  reason/package-root validation, limitation counts and kind masks. It
  preserves ambiguous/included/excluded ordering, roots, aggregate counts,
  measurement status and pagination byte-for-byte on real scoped archives;
  malformed source-scope or limitation shapes fail index construction rather
  than silently disappearing from the completeness model.
  The first normalized attribution graph is now indexed as typed line,
  confidence, test, phase and obligation-anchor records. `coverage covers`
  resolves exact per-line test provenance and causal action/assertion phases,
  paginates tests and phases independently, and reports decision/branch/point
  anchors without falsely calling a non-line location uncovered. Point-anchor
  test relations are retained so kind/runner filters recompute coverage rather
  than reusing an invalid aggregate. The complete agent envelope is byte-
  identical to the shipped CLI across immutable Playwright, `node:test`,
  esbuild, webpack and SWC archives, including filtered provenance and
  anchor-only locations. Independent index tests cover line confidence, test
  provenance, decision and point relations without relying on a serialized
  report blob.
  The reverse attribution edge, `coverage test`, now also runs exclusively on
  normalized typed columns. Per-test retries and terminal attempts, source
  lines, hit IDs, decision-vector groups with ternary short-circuit values,
  point/branch metadata, complete decision metadata and phase evidence counts
  are independently validated fixed records. Unique-test detail and ambiguous
  selector listings preserve the frozen per-category pagination contract and
  produce byte-identical agent JSON on the same five real archive families.
  This establishes bidirectional line/test attribution without coupling the
  query engine to JavaScript report objects and leaves the same evidence graph
  reusable by future language frontends.
  `coverage decision` now completes the MC/DC detail edge over typed decision,
  observation and condition records. It preserves short-circuit ternary
  vectors, per-vector provenance/phases/confidence, assertion-linked
  conditions, exact witness vectors and both witness-test sets. Kind/runner
  filters discard unrelated observations and recompute first-pair masking
  witnesses in Rust; aggregate witnesses are never reused across provenance
  subsets. Both exact-ID detail and ambiguous file:line selection, including
  independently paginated conditions/observations/tests, are byte-identical
  on all five real archive families. Index round trips independently require
  the reconstructed decision graph to equal the analyzer graph.
  The ungrouped `coverage file` surface is now Rust/index-native as well. It
  composes typed lines, point/function metadata, branch alternatives,
  independently filtered decisions, per-file tests and complete measurement-
  limitation records into the frozen obligation inventory. Other-test
  provenance is recomputed from exact test relations; MC/DC vector text and
  witness-based cross-kind coverage are derived from the normalized graph.
  Byte parity covers all five archive families, provenance filters, pagination
  and the `all`/lines/branches/MC/DC/functions metric selections. Independent
  records preserve limitation id/kind/location/source/reason and point source/
  test relations, including files that sit outside the measured denominator.
  The exact Rust smallest-test-set solver now also owns the complete
  `coverage minimize` agent surface. Outcome/provenance selection constrains
  candidates without shrinking the obligation denominator; the response
  preserves selected and setup-expanded IDs, exact recomputed summaries,
  explored-state accounting, candidate counts, per-test provenance and stable
  pagination. Its JSON is byte-identical on all five real archive families in
  addition to the 120 generated mixed-obligation solver models. Integer-valued
  targets use the shared JavaScript-number serializer, preventing `50.0` from
  silently breaking the frozen byte contract.
  Rust now also owns `diff` over two authenticated typed indexes. Covered line,
  branch-alternative and MC/DC-condition identities are compared without
  report JSON; percentage deltas, gained/lost counts and independently paged
  labels preserve the frozen envelope. Real historical archive pairs require
  byte parity for both all-attempt and passed-only views. Branch records retain
  their parent decision identity, and output sorting deliberately implements
  JavaScript UTF-16 order so non-BMP paths cannot create cross-engine drift.
  The remaining run-list/integrity/lifecycle agent surfaces remain
  before this path can replace the shipped query engine.
- Phase 4 now owns strict persisted-run discovery and the disposable index
  lifecycle in Rust. `run.json` is deserialized into a closed schema; IDs,
  SHA-256 fingerprints, Git revisions, archive schema/format/name/count and
  compressed length are validated; and run-store, run-directory, metadata and
  evidence symlinks are refused. Inventory returns valid runs and separately
  sorted rejection diagnostics, so one corrupt historical entry can no longer
  disappear silently or hide healthy runs. Exact/prefix/latest selection and
  stale-reason ordering match the frozen contract. Query-index identities now
  bind the actual evidence hash and length plus a deterministic compile-time
  fingerprint of the Rust engine/contracts source and Cargo lock, rather than
  the temporary harness constants. A query opens an existing mmap index only
  after authenticating every page and validating every typed section; stale,
  corrupt, truncated or linked indexes are reconstructed from authoritative
  evidence and atomically replaced. Evidence is hashed again around analysis
  and publication so a mixed-generation index is never accepted. Real fixture
  tests prove first-build/reuse/corruption repair, and a symlink attack test
  proves replacement leaves the linked user file untouched. Run-list output,
  current-project fingerprint creation, pruning/retention and atomic run
  publication still have to move into Rust before lifecycle ownership is
  complete.
  The typed `runs` operator is now also implemented over that inventory. It
  paginates metadata without triggering analysis, reads all/passed/failed
  percentages only from an already authenticated binary index, treats a bad
  disposable index as "not indexed" without mutating it, and reports stored-
  versus-current stale reasons in frozen order. Its agent data and pagination
  use the shared bounded JSON contract. Production CLI routing remains gated
  on Rust current-project fingerprint discovery; until then the operator is a
  tested engine layer rather than a partially exposed command.
- Rust now owns the current JavaScript project/source inventory and run-
  integrity inputs. The source walker deterministically discovers conventional
  roots, workspace packages, manifest exports and JSONC `tsconfig` roots;
  excludes declarations/tests/fixtures/config/tool/generated trees; and turns
  every unclassified first-party file into a blocking source-scope limitation.
  It never follows links and rejects a linked explicit root. The Rust parser,
  not regular expressions, discovers project-owned Playwright fixtures,
  relative compiled-output imports and build-config environment comparisons.
  Build selection distinguishes direct Jest/Vitest/`node:test`, generic builds
  and Vite, including project-owned environment overrides. Eight source-scope
  and ten complete project shapes—synthetic plus Playwright, `node:test`,
  esbuild, webpack and SWC repositories—have exact differential parity;
  independent tests cover safer inline-comment JSONC and symlink boundaries.
  Run fingerprints are now language-neutral engine code: source, tests,
  workspace package manifests/locks, nested build/test configuration,
  frontend shims, Rust transformation identity, execution environment and Git
  state occupy separately domain-separated SHA-256 inputs. Changes in each
  domain have independent regressions, generated caches cannot inflate the
  test fingerprint, links cannot enter a fingerprint, and an execution-only
  change now marks a run stale instead of being missed by the historical
  comparator. The JavaScript frontend contributes only its runtime shim files
  and frozen frontend version; future languages use the same Rust integrity
  implementation. Production CLI routing and the versioned atomic cutover
  still need to wire these authoritative Rust fingerprints into publication.
- Persisted-run queries now traverse the real Rust lifecycle end to end rather
  than only the archive differential harness. One path discovers and validates
  a stored run, hashes its authoritative evidence, lazily creates or reuses the
  authenticated binary index, opens its typed mmap sections and executes the
  shared agent-query operators. Summary, scope, files/gaps, dimensions,
  decision grouping/detail, file detail, covers/test attribution,
  minimization and historical diff all produce byte-identical bounded JSON on
  the five real fixture stores. Tests copy stores into isolated temporary
  projects and deliberately omit every old JSON/binary cache, proving first-
  query reconstruction rather than accidentally accepting historical output.
  Query execution is now path-independent engine code; storage policy remains
  solely in `run_store`. Reviewed MC/DC waivers are likewise Rust-owned and
  remain a dynamic overlay: strict v1 parsing, ECMAScript-whitespace source
  matching, ID/line/positional selection, first-waiver ownership, applied,
  contradicted and unmatched classifications all run at read time, never enter
  evidence or disposable-index identity, and never mutate raw totals. An
  independently missing real-fixture condition proves byte-identical waiver
  summary, file inventory, grouped-decision sorting/counts, file obligations
  and condition detail. Public CLI routing now remains gated on current-
  project integrity wiring, structured public argument errors and human-output
  parity—not missing coverage semantics.
- Phase 4 lifecycle ownership has moved into Rust as an isolated engine layer.
  Run state is a closed typed schema; project locks use exclusive creation,
  live-owner detection, incomplete-write grace and owner-checked release;
  recovery derives every cleanup target from root plus validated run ID rather
  than trusting persisted paths. A killed pre-publication run is marked
  abandoned, while a fully renamed run is treated as the durable terminal
  record and only transactional leftovers are removed. Publication hashes the
  immutable evidence before and after copying, verifies the staged copy and
  compressed length, fsyncs both files/directories and exposes the run with one
  final directory rename. Retention is deterministic, dry-run safe, project-
  locked, preserves live work, and distinguishes `prune` (history/transients,
  keep shared cache) from `clean` (also current and legacy owned caches).
  Recursive deletion remains off the foreground path: owned trees are renamed
  into durable trash and one PID-locked child sweeps them. Every existing
  ancestor is checked for links before create/rename/delete; a regression with
  a linked `.supercov/evidence` proves external user data is untouched. Rust
  and TypeScript have exact differential results for prune, clean, dry-run,
  active-run preservation, cache policy and dead-run recovery. The Windows
  process-ownership implementation now exists and cross-compiles with warnings
  denied; actual Windows runtime and NTFS crash behavior remain explicitly
  gated on the configured compatibility-matrix run rather than being inferred
  from a cross-target build.
- Windows hosted-runner follow-up: GitHub's runner intermittently denied
  redundant directory and write operations first beneath its 8.3-alias
  `%TEMP%` path and then through a repo-local fixture path containing unresolved
  `..` components, even though the dedicated NTFS lifecycle, crash, junction,
  rename, ENOSPC and Job-object tests passed. The two frontend semantic
  fixtures now live under Cargo's ignored `target` tree and canonicalize that
  test-only root before use. Verify this small fixture correction on the next
  deliberate compatibility run; do not spend another matrix run on it today,
  and do not weaken production path validation or lifecycle guarantees to
  accommodate hosted-runner policy.
- Actions-budget policy: ordinary pushes do not trigger a release-sized CI
  run. Pull requests and explicit manual dispatches use a compact Rust/Node
  correctness gate; the browser/platform compatibility matrix, full Test262
  conformance and cross-repository ecosystem sweep are deliberate manual
  gates. npm tags run the compact gate plus the required native artifact and
  publication jobs, while the exhaustive local release gate must pass before
  tagging. This prevents benchmarks and repeated oracle sweeps from consuming
  hosted minutes on routine commits.
- Phase 4 now also owns isolated workspace and stable build-cache publication.
  The Rust layer performs deterministic tree copies with clonefile/FICLONE
  fallback through `reflink-copy`, excludes only the frozen generated-output
  roots and marker-owned Supercov stores, relocates internal links, rejects
  links escaping the canonical project root, and exposes a real
  `node_modules` mount point containing per-entry links. Every preparation,
  refresh, recovery and source-prune operation requires the live project lock.
  Stable cache refresh retains only explicitly fingerprint-selected artifacts,
  keeps the previous complete generation through the publication boundary,
  restores it on failure, recovers the newest complete generation after a
  killed process, and defers obsolete trees to the lifecycle sweeper. Rename
  boundaries fsync both source and destination parents when necessary. A
  black-box TypeScript/Rust differential compares complete file contents,
  modes, exclusions and link targets for isolated copies, cached refresh,
  artifact reuse, pruning and interrupted publication; the independent Rust
  tests additionally make the project lock and unchanged-source guarantees
  explicit. The public Rust engine now has a real SIGKILL-equivalent crash test:
  it is killed while cache staging and the live lock are both present, the last
  complete generation must survive, the next Rust invocation must recover and
  publish, and the source-project hash inventory must remain unchanged. That
  test passes on APFS and is part of the three-OS Rust platform gate. Windows
  dependency-directory mounts and relocated internal directory links now use
  NTFS junctions rather than privileged symbolic links; ordinary top-level
  dependency metadata files are isolated copies. Windows-only Rust tests verify
  both behaviors without Developer Mode. The Rust workspace now also has a
  private operation boundary used to force the ordinary-copy backend, ENOSPC
  on an in-progress staging copy, and failure of the second publication rename.
  All three tests prove source immutability, prior-generation survival,
  transaction cleanup, and (for rename failure) restoration through the third
  rename; they run on every platform rather than existing only in the
  TypeScript reference suite. Actual NTFS execution remains open until the
  matrix runs and is not inferred from Unix parity. Public execution is now
  available only through the explicit migration selector; it cannot become the
  default until the remaining platform gates close.
- The POSIX process-supervision contract is now implemented in Rust behind a
  private black-box surface. Commands start in a dedicated process group with
  inherited stdio and no runner-specific argument changes; positive-integer
  diagnostic/timeout configuration is validated before spawn; no timeout is
  invented by default. Sanitized descendant snapshots contain only PID, PPID,
  executable basename, state and accumulated CPU time and are collected
  through native process APIs rather than a possibly hanging `ps` subprocess.
  SIGHUP, SIGINT and SIGTERM handlers are installed with a serialized
  `sigaction` guard, forwarded to the entire group, escalated after the frozen
  grace period and restored byte-for-byte after each command. Explicit timeout
  returns 124; signal interruption returns 129/130/143; spawn and wait failures
  cannot become successful tests. Diagnostic-output failure is observational
  and cannot alter or orphan the command. A black-box Node parent/grandchild
  regression proves full-tree cooperative signal delivery, while another
  proves invalid configuration cannot spawn and diagnostics never expose a
  private argument. Windows now closes the pre-assignment escape race by
  creating every command suspended, assigning it to a private Job Object with
  `JOB_OBJECT_LIMIT_KILL_ON_JOB_CLOSE`, and only then resuming its primary
  thread. Console control events provide cooperative interruption while
  `TerminateJobObject` is the grace-period authority; dropping the supervisor
  is the crash-safe full-tree boundary. Windows-only tests cover ordinary exit
  propagation and a parent/descendant timeout escape attempt, and the existing
  filesystem matrix now builds the Rust binary and runs the Rust platform gate
  on Windows, macOS, and Linux. The Windows code and tests cross-compile under
  MSVC with clippy warnings denied; the first real Windows Actions result is
  still a release gate, not silently treated as green locally. The unavoidable
  JavaScript capability/remote launch interception remains a runtime shim;
  provider-neutral local process ownership no longer needs to remain
  JavaScript after build orchestration is wired.
- Language-neutral external-phase orchestration is now Rust-owned as well. A
  frontend supplies explicit preparation/build commands and exactly one
  terminal test command; Rust validates that plan before spawning, invokes a
  lifecycle observer before each phase, records each phase's typed result and
  monotonic duration, and stops before the test on any failed preparation or
  build. One `ProcessSupervisor` and one saved/restored signal guard span the
  complete plan, closing the otherwise dangerous gap where a SIGTERM could
  arrive after the build exited but before the test spawned. This deliberately
  does not move JavaScript config/runtime generation into a generic process
  abstraction: the frontend shim still contains unavoidable Playwright,
  Vitest, node:test and remote-capability hooks, while Rust owns when and how
  every resulting command runs.
- The first private Rust-owned execution is now complete for a direct
  `node:test` project. Rust discovers the project, fingerprints source/tests/
  dependencies/configuration/frontend artifacts, prepares the isolated stable
  workspace, instruments application source with a direct runtime ABI,
  instruments native ESM `node:assert` argument evaluation for exact assertion
  phases, emits the complete sorted manifest, supervises the test command,
  packs the frozen evidence archive, atomically publishes immutable run
  metadata, prunes copied source and serves the persisted run through the Rust
  mmap query index. The black-box fixture proves five concurrent test scopes,
  100% line/branch/MC/DC, all three executable lines and both MC/DC conditions
  assertion-linked, no fallback attribution, a valid/complete passed view,
  unchanged project source and no retained raw-evidence directory in the
  shared workspace. This integration exposed and fixed two real boundaries:
  generated modules/scripts now use one explicit direct-runtime global instead
  of virtual/legacy bindings, and persisted-run queries derive validity from
  the test exit code rather than defaulting it to false. This remains private:
  A second black-box case now proves the same complete structural result for
  CommonJS plus top-level and nested `require` assertion bindings. Assertion
  discovery is resolved by lexical symbol identity, so shadowed imports,
  shadowed `require`, and unrelated assert-shaped APIs cannot be falsely
  claimed. Native `node:test` suites using imported `expect` matchers are
  attributed as exact assertion phases as well. The CommonJS module-export
  assignment is correctly retained as background/setup execution: the all-
  evidence view is structurally complete while the passed-test-only view does
  not falsely attribute module initialization to a test assertion.
- The second private Rust-owned execution frontend now runs zero-configuration
  Vitest projects, including commands hidden behind an npm script. Rust writes
  an isolated merged Vitest configuration, injects the unavoidable local
  setup/reporter shims, transforms lexical Vitest `expect` matchers, and keeps
  the exact run/worker/test/retry/attempt scope active for each serial worker
  attempt. The black-box fixture proves four passing tests, 100% line/branch/
  MC/DC, three assertion-linked executable lines, two assertion-linked MC/DC
  conditions, exact per-test phase operations, unchanged source, and a valid
  structurally complete persisted query. Snapshot evidence now retains
  de-duplicated explicit phase events instead of discarding the only causal
  link between an assertion and its obligations. Empty request contexts still
  suppress inherited process carriers, so unscoped health/background work is
  not accidentally promoted into a test. Both direct Node and Vitest fixtures
  pass the complete Rust differential suite.
- The third private Rust-owned execution frontend now runs Playwright through
  the same isolated lifecycle, including commands hidden behind npm scripts.
  Rust writes a path-confined merging config, relocates the original config,
  installs the coverage reporter, and configures the existing unavoidable
  page/request/browser collector shim. Project discovery—not a hardcoded
  package list—supplies custom fixture modules, test exports, and assertion
  imports. The black-box fixture uses a project-owned
  `@acme/browser-fixtures` package and proves two parallel worker processes,
  four unique attempt identities, four passing tests, full line/branch/MC/DC,
  exact assertion-linked obligations, unchanged source, and valid persisted
  Rust queries. Native assertion phase IDs have their own namespace so they
  cannot collide with Playwright action/assertion phases. This closes the
  direct Playwright runner boundary.
- Rust now owns the first complete build-backed browser execution as well.
  Vite project source remains byte-for-byte untouched in the isolated copy.
  Rust freezes an immutable per-file transform map keyed by original-source
  SHA-256, and a minimal generated Vite plugin returns only the matching Rust
  code/source map while resolving the isolated application-runtime ABI. A hash
  mismatch is a hard error rather than silently instrumenting changed source.
  Cache/Rollup/build outputs remain confined to the isolated workspace, and
  build then test run under one Rust process supervisor. The browser black-box fixture builds a real page, starts the
  project's unchanged Vite preview command through Playwright `webServer`,
  runs four cases in two workers, collects non-empty frame snapshots with
  explicit action phases, and reconstructs 100% line/branch/MC/DC plus exact
  per-test vectors from the persisted archive. Build and test timings are
  recorded separately and source remains unchanged.
- The initial generic compiler/build frontend is Rust-owned too. Rust places
  one isolated runtime plus declarations inside the narrowest discovered
  source root, rewrites its own virtual ABI import to a source-relative
  physical module, and leaves the generic build command otherwise unchanged.
  A strict TypeScript `rootDir` fixture proves compilation, emitted-module
  loader relocation, exact assertion attribution, and full persisted coverage;
  an independent esbuild fixture proves the same contract when the runtime is
  bundled into output. Neither fixture changes source or normal build output,
  and both record build/test durations separately. The same unmodified generic
  path now runs real webpack and SWC fixtures: both preserve source, publish a
  valid measurement-complete run, retain four passed `node:test` attempts and
  reconstruct 100% line/branch/MC/DC with assertion-linked obligations. This
  exposed a source-scope defect rather than a compiler special case: a root
  `build.*`, `gulpfile.*`, or `gruntfile.*` is build/tool configuration, not an
  ambiguous product file. Rust owns that correction and an independent test;
  the temporary TypeScript reference was aligned only so the live
  differential continues to diagnose unexplained changes.
- The authoritative conformance and browser gates were rerun after the pure
  Rust shell landed. Node 22, Node 24, Chromium, Firefox, and WebKit each pass
  all 43 syntax/runtime cases. The monolithic pinned Test262 invocation at
  revision `3655e746...` selected 41,593 files and observed 65,051
  baseline-passing scenarios, with zero Rust transform failures and zero
  semantic-equivalence failures. Its measured durations were 595.04 s for the
  original baseline, 17.05 s for Rust transformation, and 453.79 s for the
  instrumented corpus. This compares observable program behavior directly;
  it does not treat the TypeScript engine as the semantic oracle.
- Pure Rust-shell self-dogfood now runs the repository's native `node:test`
  command without the product TypeScript CLI. Run
  `rust-self-dogfood-2026-08-25T` passed all 188 tests, recorded 788 assertion
  calls, and published 394 evidence entries (40.7 MB raw, 2.53 MB compressed).
  It exposed a correctness bug that fixture-only probe observations could
  expand and overwrite the supposedly frozen manifest. The analyzer now
  treats the manifest as the sole denominator: out-of-scope synthetic
  observations are ignored, while an in-scope unknown decision or metadata
  mismatch is a hard error. Independent regressions cover all three cases.
  The repaired archived run is valid and queryable at 52.98% lines, 40.77%
  branches, and 28.30% MC/DC; structural completeness is false only because
  the current tests do not execute every declared obligation.
- Essential SEO also runs end to end through the private Rust shell with no
  Supermachine/provider special case. Run
  `rust-essential-seo-dogfood-2026-08-25c` built the isolated Remix/Vite app,
  launched the existing opaque offline command, passed all 30 Playwright E2E
  tests, packed 90 evidence entries, and served the stored run through the
  Rust mmap query path. Its report is valid and measurement-complete across
  154 included source files with zero ambiguous files, limitations, or corrupt
  records: 49.20% lines, 32.79% branches, and 12.88% MC/DC, including 1,130
  assertion-linked lines. A fully cold Supermachine layer rebuild took 317.5 s;
  the ready-pool suite took 38.1 s. Rust initialization, workspace preparation,
  adapter setup, instrumented build, and evidence publication measured 0.16 s,
  0.14 s, 5.00 s, 3.05 s, and 0.55 s respectively. The run also found and
  fixed an assertion-transform semantic hazard: a matcher such as
  `expect(await value()).toBe(...)` can never move its receiver `await` into a
  synchronous attribution callback. Such sites remain honestly
  execution-covered instead of receiving false assertion attribution.
- The current full checkpoint is green: 103 Rust engine tests, 189
  TypeScript/reference tests, type checking, clippy with warnings denied, all
  generated/real differential models, and direct Node, Vitest, Playwright,
  Vite, esbuild, tsc, webpack, and SWC integrations. Remaining atomic-cutover
  blockers are now narrower: execute and pass the newly wired Windows Job-
  object plus APFS/NTFS crash/filesystem matrices; require a sustained zero-
  unexplained-diff release window; then
  delete the TypeScript instrumenter, analyzer, discovery, orchestration,
  persistence/query implementations and Babel engine dependencies in the same
  consolidation. Only unavoidable Node/browser/test-runner collectors and
  runtime shims survive.
- Public cutover wiring has started with the lifecycle commands. The Rust
  binary now identifies itself honestly as a private differential candidate,
  parses `prune`/`clean` plus `--keep`/`--dry-run` directly, invokes the
  Rust-owned locked lifecycle, and reproduces the frozen human summaries and
  exit-2 argument failures. Live dry runs against the real Supercov store were
  byte-identical to the temporary TypeScript CLI for both commands. This does
  not flip the npm wrapper or authorize engine deletion; public run/query,
  structured-error, native packaging, and cross-platform gates remain.
- The complete public agent-JSON query grammar now enters Rust directly in the
  candidate binary. Rust parses the frozen instance-first `runs <id> coverage`
  hierarchy, every resource selector/filter/metric/group/sort/pagination option,
  minimization and `diff`; opens or rebuilds authenticated immutable indexes;
  computes current-project staleness with the same Rust frontend inputs used by
  execution; overlays reviewed waivers; and emits the bounded v1 success/error
  envelope. Query failures retain typed identities through the operator layer,
  so source/test/decision misses, ambiguous selectors, empty provenance views,
  unavailable scope, unreachable targets and solver limits are never recovered
  by parsing diagnostic strings. A public black-box differential covers every
  resource plus malformed hierarchy, numeric pagination, filters, selection,
  minimization, diff and exact structured failures. All outputs are byte
  identical to the temporary reference except deliberately excluded engine-
  identity staleness fields: the Rust instrumenter/configuration fingerprint is
  independently more complete and must differ from a run produced by the old
  engine. The differential also found a real reference bug in
  `file:line:column` parsing; Rust had the documented behavior, so the temporary
  TypeScript implementation was corrected and independently regressed instead
  of teaching Rust the bug. Integral timing metadata now uses JavaScript-number
  serialization, closing the last otherwise-spurious JSON byte difference.
  Human rendering now uses the same typed `IndexedQueryOutput` enum as JSON—no
  serialization round-trip and no second query implementation. Every summary,
  inventory, gap, dimension, scope, grouped/file detail, decision, cover,
  test, minimization and diff variant reproduces the frozen text, pagination
  command and warning/error behavior. Black-box tests cover both the complete
  webpack run and the mixed-outcome Playwright run with blocking source-scope
  limitations; a live Essential SEO comparison additionally exercised large
  uncovered-obligation pages, decision sorting, exact test detail and subset
  minimization without a difference. The only normalized text remains the
  intentional old-engine fingerprint reason. Both human and JSON query slices
  are active in the private Rust candidate; the npm wrapper remains on the
  shipped engine until wrapped execution and platform gates close.
- Public wrapped execution now enters Rust through
  `SUPERCOV_ENGINE=rust npx supercov -- <command>`; the default npm path remains
  TypeScript and there is still no permanent product selector. Rust generates
  exact UTC run identities, discovers/fingerprints the current project,
  prepares and instruments the isolated workspace, supervises build plus test,
  packs and atomically publishes evidence, renders progress/timings, and
  returns the original child exit. Failed suites publish their useful evidence
  with a failed terminal lifecycle state. SIGHUP/SIGINT/SIGTERM are forwarded
  to the complete process group, return 129/130/143, publish no misleading run,
  release the project lock, and leave only the small recoverable terminal
  state. RAII cleanup removes transient evidence and copied source on every
  return path; abandoned runs are recovered before new work starts. A public
  black-box test covers empty command, success, failure, source isolation,
  durable evidence, diagnostics, lock cleanup, and SIGINT.
- Runner identity and assertion attribution now survive the public build-tool
  path rather than merely the private direct fixtures. Assertion-only Rust
  transforms emit inline source maps, Node runs with source-map support, and
  node:test registration columns are canonicalized to the source line because
  Babel, esbuild, SWC and TypeScript disagree on mapped call-expression
  columns. Vitest lexical `expect` calls remain ahead-of-run transformed;
  Playwright's project-discovered assertion module uses a static fallback plus
  an assertion-phase bridge. The bridge creates one Playwright phase before
  assertion arguments execute and reuses that same ID for matcher/browser
  work, preserving both synchronous coverage causality and action linkage
  without duplicate phases. The temporary TypeScript reference was aligned to
  this independently tested contract so this accuracy improvement is not hidden
  by parity normalization.
- Whole-engine public parity is green across the mixed Playwright/Vitest,
  native node:test, esbuild, webpack, SWC and Next.js fixtures: exact frozen
  manifest, evidence semantics, report, per-test attribution, outcomes,
  confidence, and human/JSON queries. Probe v2 deliberately removes three
  duplicate server records in the mixed fixture while retaining the identical
  unique hit/vector set; the comparator permits only this strict multiset
  reduction and still rejects any missing unique observation. Nested npm/pnpm/
  yarn scripts receive both generated runner configs because the top-level
  command cannot soundly predict a later runner process. The complete
  `npm run test:rust` and `npm run test:rust-engine` gates pass after these
  changes. Windows Job Object ownership is now implemented without a child-
  escape window and the three-OS compatibility workflow runs the Rust platform
  tests; the MSVC target cross-build and clippy gate pass locally. Rust-engine
  mid-publication kill/recovery is green on APFS, and NTFS directory mounts no
  longer depend on privileged symlink creation. Remaining cutover blockers are
  a real green Windows/macOS/Linux matrix (including NTFS crash, junction, copy-
  fallback, injected rename and ENOSPC cases), native platform packaging,
  sustained zero-unexplained-
  diff releases, and then the one atomic deletion of the TypeScript engine and
  Babel engine dependencies. Language/runtime collectors remain; duplicate
  engine implementations do not.
- Native npm distribution now has a frozen target registry and a generated-
  package contract for macOS arm64/x64, Linux arm64/x64 glibc and musl, and
  Windows arm64/x64. The exec-only npm loader detects Linux libc, resolves the
  exact platform package, rejects name/version mismatches and malformed or
  missing binaries, and permits `target/debug` only inside a source checkout.
  A clean packed-install integration disables lifecycle scripts, installs the
  primary plus platform tarball, completes a real Rust coverage run, and then
  proves wrong-version, missing-binary, missing-optional-package and unsupported-
  target errors. The Apple arm64 release binary is 4.1 MiB uncompressed and
  1.9 MiB under deterministic gzip, comfortably below the 15 MiB gate. A
  manual-only eight-target native artifact workflow now builds on native
  macOS/Linux/Windows arm64/x64 hosts, adds glibc/musl Linux variants, performs
  packed installs on matching hosts, validates direct musl execution, enforces
  the compressed-size gate, records binary/tarball SHA-256 digests and uploads
  the generated artifacts. Every npm tarball also receives GitHub artifact-
  attestation build provenance from the workflow's ephemeral OIDC identity.
  A final aggregate job accepts only a complete eight-package, single-version
  release set whose tarball sizes and SHA-256 digests match each native job;
  it independently checks every packed npm manifest and embedded binary.
  It is deliberately not triggered by ordinary pushes
  so this groundwork consumes no Actions minutes until explicitly requested.
  The first `0.0.11` tag exposed a distribution-only workflow error: matrix
  targets were installed into moving `stable` while Cargo selected the pinned
  1.93.1 toolchain, so musl could not find its target `core`. Native jobs now
  install every target into the exact pinned compiler. The failed unpublished
  run was cancelled as soon as this was known to conserve hosted minutes. The
  corrected build then exposed npm 11 interpreting `native-dist/package` as a
  GitHub repository shorthand; native packing now uses the explicit local
  `./native-dist/package` form. That run was likewise cancelled immediately,
  before publication, rather than letting unrelated matrix jobs continue. A
  subsequent publication attempt built, packed and validated the native artifacts
  but confirmed GitHub artifact attestations are unavailable on the current
  private-organization plan. Optional GitHub provenance was removed instead of
  turning a billing-tier feature into a release blocker. Tag publication now
  runs only the necessary native builds, aggregate validation and npm publish;
  correctness/conformance gates run locally before the tag and are not repeated
  just to spend hosted minutes.
  The native packed-install harness also now resolves `npm.cmd` on Windows and
  reports spawn errors before asserting an exit status. Five native targets
  completed their full artifact path before the Windows-only bare-`npm` spawn
  exposed this harness bug; the run was cancelled immediately after diagnosis.
  Node 24 also refuses to execute `npm.cmd` directly, so the final harness uses
  the Windows command interpreter explicitly. A Windows npm preflight now runs
  before native compilation so package-manager invocation can no longer waste
  a five-minute binary build before failing.
  The installed-package harness invokes the package's actual JavaScript bin
  target through Node on every OS rather than treating npm's generated Windows
  `.cmd` shim as a native executable. Both Windows binaries had compiled and
  the npm preflight had passed before this second harness-only boundary was
  exposed; all six macOS/Linux artifacts were already fully validated.
  Hosted publication is now deliberately manual-only. Partial native releases
  can select only the missing target matrix and merge artifacts from a prior
  run before the aggregate integrity check, avoiding repeated builds on
  platforms that have already passed. Push CI remains disabled; conformance,
  browser and Test262 work stays local or explicitly dispatched.
  The first sparse retry (`32886591618`) proved the selector worked—only the
  two Windows jobs were created—but the x64 binary's real packed run then hit
  `Access is denied` while isolating its own `.supercov` store on NTFS. This is
  a Windows runtime/isolation defect, not a compiler or package-launcher
  failure. The ARM job was cancelled immediately. Windows publication is
  deferred until that defect is reproduced and fixed under the dedicated
  Windows gate; `0.0.11` intentionally advertises only the six fully validated
  macOS/Linux targets. The reusable release gate can also verify a complete
  prior artifact set without rebuilding any target.
  Registry publication is independently resumable: it checks each exact
  package/version before publishing, verifies an existing identity, and skips
  it. An expired OTP or interrupted bootstrap therefore cannot turn a partial
  first-time platform claim into another artifact build or an unrecoverable
  release script failure.
  The release workflow now calls that complete native matrix, downloads and
  revalidates the aggregate release set, publishes all eight exact-version
  platform packages first, and publishes the primary package only after every
  platform publication succeeds. The primary `0.0.10` candidate declares all
  eight packages as exact optional dependencies. Manual branch dispatch is
  rejected before expensive release work; only a matching version tag may
  publish. A local Apple arm64 packed install of the `0.0.10` candidate is
  green. Initial publication of the unclaimed platform package names still
  needs one npm credential with new-package authority; existing `supercov`
  OIDC trust cannot authorize names that do not yet exist.
  The
  distribution ADR explicitly rejects WASI as an unsound fallback for a CLI
  that owns processes/signals/filesystem transactions. Platform packages are
  generated from release binaries and are not committed or published by this
  checkpoint. The Rust CLI is now self-contained: all unavoidable JavaScript
  runtime collectors are embedded, and a copied binary with no adjacent
  `dist`, npm wrapper, or runtime override completes a real coverage run. The
  exact-version Cargo graph (`supercov` → `supercov-engine` →
  `supercov-contracts`) was published at `0.0.10`; a clean install from
  crates.io completed a real run. A maturin `bindings = "bin"` macOS arm64
  wheel likewise passed metadata checks and a clean-venv real run. The
  functional wheel was published as `supercov-cli 0.0.10`; a fresh
  registry-backed `uvx --from supercov-cli==0.0.10 supercov` invocation
  completed a real coverage run. The executable and product remain `supercov`.
  PyPI's exact `supercov` project name is nevertheless owned by a pre-existing
  release-less active project, so the authenticated Supercorp account receives
  403 and must pursue a project transfer rather than falsely treating JSON 404
  as availability. After transfer, `supercov-cli` remains only as a
  compatibility distribution.
  RubyGems `supercov 0.0.10` is now published. Its `arm64-darwin` platform gem
  contains the same embedded-runtime Rust binary and a minimal `exec` shim. The
  manual-only GitHub OIDC workflow passed a packed install and real run before
  publication; a separate clean install from the public registry completed a
  second real run. The first successful upload converted the pending publisher
  into permanent trusted publishing without a stored registry secret. NuGet
  and Hex names remain unclaimed until functional ecosystem launchers meet the
  same gate; empty registry placeholders are forbidden.
  The native npm matrix is defined but has not yet produced a real
  hosted-run green result; the attestation step is wired but therefore has not
  yet produced signed provenance. Initial npm package claims,
  hosted matrix proof, npm platform-package claims, the PyPI name transfer,
  GitHub Releases, Homebrew/cargo-binstall/opam
  and C-compatible wrappers remain Phase 5 gates.
- The shared producer boundary was first frozen independently as
  `contracts/frontend-v1`. The first real Python spike exposed that v1 had no
  honest phase kind for ordinary test-body execution: mapping pytest's `call`
  phase to `assertion` would overclaim causality, while `background` would lose
  exact test attribution. V1 remains immutable and checked in; the current
  `contracts/frontend-v2` adds only the `test` transition and records the
  reason for the version change. A language frontend contributes a complete
  obligation manifest, normalized observations, run/worker/test/retry/phase
  identity and action/assertion transitions only to its declared precision,
  plus explicit limitations. Rust retains manifest merging, validation,
  attribution, analysis, persistence and every query. Attribution is declared
  per actual runner and execution model rather than optimistically per
  language. Strict Rust types reject unknown fields, invalid identities,
  duplicate or inconsistent limitations, unexplained precision downgrades,
  impossible exact causal linkage and exact test causality from parallel-
  unattributed execution. Python and LLVM adapters must pass this contract
  unchanged. A Rust analyzer-entry validator
  now additionally binds a declaration to the manifest's exact limitation-ID
  set and observed runner set, verifies exact test/scope/retry identities, and
  rejects illegal, duplicate, unresolved or cyclic phase transitions before
  coverage analysis. The declaration is not added to frozen v2 archives yet;
  that requires an explicit archive-schema migration before an adapter can be
  publicly enabled.
- Python ownership was clarified on 2026-08-25: external coverage engines are
  development oracles only. The coverage.py work below is therefore an oracle
  corpus/import validator used to test Supercov's future owned Python probes;
  it is not a candidate user frontend, will never be selected by a user run,
  and creates no coverage.py dependency in npm, PyPI, or the target project.
  Product Python support begins with the Rust-owned transformer and
  Supercov-generated stdlib-only runtime described in Phase 5.
- The Python development-oracle harness has started. A checked-in pytest fixture
  runs under coverage.py 7.15.4, exports through documented `Coverage` and
  `CoverageData` APIs, and differentially reconstructs 10/12 executable lines
  and 6/8 branch arcs in the shared Rust analyzer. The importer rejects unknown
  fields, malformed line partitions, source/path drift, run/context/outcome
  inconsistencies, unattributed executed facts and non-branch measurement. It
  preserves import-time module execution as background rather than dropping
  it. A Python 3.14 run also proved that coverage.py's `sys.monitoring` core
  warns dynamic contexts can be incomplete; exact attribution is therefore
  accepted only from explicitly selected `ctrace` or `pytrace` collection.
  Pytest setup/call/teardown phases are exact, but action and individual
  assertion linkage are explicitly unavailable. MC/DC vectors and exact
  columns are blocking structural limitations, never zero-sized success. The
  producer contract, fixture, golden export, architectural decision and public
  API sources are recorded in `contracts/python-coverage-v1` and
  `progress/python-tier-a-spike-2026-08-25.md`. This proves the oracle side of
  later differentials only. Rust-owned Python parsing/transformation, owned
  runtime evidence, automatic command injection, packaging and broad dogfood
  remain unfinished product gates. The next oracle step
  has proven a real two-worker pytest-xdist run: the generated plugin starts a
  separate coverage.py collector in each worker, uses a run-unique suffixed
  data file plus static worker context, leaves the controller uninstrumented,
  and records outcomes only in the worker. The public API combines those files
  without deleting them; the golden import preserves both worker identities,
  both background import contexts and exact per-test arcs. Rust now requires
  the real supervised test exit code rather than manufacturing success and
  preserves pytest expected-failure semantics. A second checked-in real-pytest
  matrix now covers ordinary pass/fail/skip, xfail, setup failure and teardown
  failure. Starting collection at plugin import (the earliest `-p` boundary)
  captures conftest imports that `pytest_configure` necessarily misses, while
  the xdist controller still stops and discards its collector once identified.
  Background imports remain visible in the all-evidence view but have unknown
  verdict and cannot verify passed-only coverage. The matrix reconstructs the
  coverage.py oracle exactly at 11/12 executable lines and 7/8 branch arcs;
  passed-only retains only the terminal ordinary pass. This work also corrected
  a shared analyzer defect: setup-only/background-only confidence now follows
  observed phase kinds whenever phase evidence exists, rather than a synthetic
  result role. Broader xdist scheduling, path/package, and low-level
  execution-surface cases are still open. Retry attribution is now
  proven in both serial pytest and two-worker xdist using the real
  pytest-rerunfailures 16.6 lifecycle: `item.execution_count` identifies the
  active attempt before setup/call/teardown, and `report.rerun` identifies the
  emitted report. Attempt zero's rerun outcome is retained as failed evidence,
  attempt one's terminal pass alone verifies passed-only coverage, and the
  shared analyzer classifies the logical test as flaky. No wall-clock or hook-
  ordering inference is used.
  A 14-test causal-concurrency matrix now proves ordinary asyncio, a task that
  outlives its test, an ordinary thread, a late thread, reuse of the same
  thread-pool worker by different tests, `subprocess.Popen`, and
  multiprocessing `spawn`. The generated hook uses a coverage.py dynamic-
  context plugin only at measured-source frames, Python `ContextVar`
  propagation for tasks/submissions, explicit child environment injection,
  and the documented coverage.py process-startup configuration. The same
  matrix passes under xdist for its non-order-dependent cases. It also exposed
  and fixed an xdist bootstrap bug: setting `COVERAGE_PROCESS_START` before
  xdist created workers caused them to inherit the controller's `main`
  context. Child auto-start is now enabled only after authoritative worker
  identity exists. Raw `_thread`/native-created threads and low-level
  `os.system`/spawn/exec/fork/forkserver paths remain blocking, explicitly
  declared structural limitations rather than hidden attribution claims.
  An xdist worker-crash matrix now proves a crash followed by a successful
  retry on a replacement worker. The generated hook durably journals phase
  starts, enables coverage.py's documented `_exit` save patch, and joins the
  controller's synthetic crash report to the last exact worker/test/retry/
  phase. Pre-crash coverage stays failed-only; the replacement worker's
  terminal retry alone verifies passed coverage; the logical test is flaky.
  SIGKILL and equivalent uncatchable termination cannot flush coverage.py's
  in-memory observations and remain a separate blocking structural limitation.
- Shared analysis no longer hardcodes the JavaScript coverage-model label for
  every language. `CoverageReportRequest` now carries an optional strict
  `CoverageModelDeclaration`; absent declarations retain the byte-compatible
  JavaScript masking-short-circuit model, while the private Python importer
  selects `python-native-branch` and names only coverage.py executable
  statements, branch arcs and pytest identities as measured. Atomic-condition
  outcomes, MC/DC, exact columns and action/assertion causality are listed as
  unmeasured and remain blocking manifest limitations. This is currently an
  in-memory analyzer contract only. It is intentionally not smuggled into
  frozen evidence v2; archive v3 must make the frontend declaration and model
  mandatory and retain a dual reader for historical JavaScript runs.
- The private evidence-v3 candidate now does that migration explicitly rather
  than modifying the frozen public writer. V3 has its own magic, retains v2's
  canonical framing, and requires strict `frontend.json`,
  `coverage-model.json` and `manifest.json` entries. The versioned reader
  recognizes v2 and v3; the legacy v2-only API deliberately rejects v3 so no
  old caller can misclassify it. The current public writer still emits v2.
  The Python oracle importer can produce deterministic v3 entries for shared-
  analyzer contract testing, and a complete
  write/read/analyze round trip revalidates frontend identities and limitations
  before reproducing the native model and oracle totals. Unknown coverage-model
  fields are fatal. V3 now rejects every deterministic truncation, oversized
  entry headers and each missing required identity entry without allocating
  from an attacker-controlled header length. A broader property/fuzz corpus
  and a staged public-writer migration remain before its status can leave
  `private-candidate`.
  The persisted run store now accepts both frozen v2 and strict v3 metadata,
  binds disposable indexes to the archive's actual schema version, and
  rebuilds v3 evidence through the shared analyzer. The typed query index
  persists the versioned coverage model as a required authenticated section,
  and `coverage.summary --json` exposes that model explicitly so agents never
  interpret a language-specific denominator as JavaScript MC/DC. The owned
  Python frontend must produce v3 directly from Supercov probes; a coverage.py
  import is never a public migration path.

## Checkpoint — 2026-08-25 Rust-only atomic cutover

- The atomic JavaScript-engine cutover is complete in the repository. The npm
  launcher now resolves and executes the native Rust binary unconditionally;
  `SUPERCOV_ENGINE`, `SUPERCOV_RUNTIME_ROOT`, readiness/candidate modes and the
  TypeScript fallback path no longer exist.
- The complete legacy engine was deleted in the same consolidation: `src/`,
  compiled `dist/`, TypeScript engine tests and configuration, Babel runtime
  transformation, Babel dependencies, Jest-specific migration coverage and
  every TypeScript-versus-Rust differential script are gone. Frozen contracts,
  independent oracles, golden agent outputs, Test262 and black-box fixtures
  remain.
- JavaScript under `runtime/javascript/` is the sole canonical set of 16
  target-runtime shims required inside Node, browsers, Playwright and Vitest.
  Rust embeds these files at compile time, fingerprints them, writes them only
  into the isolated workspace and performs all source instrumentation ahead of
  execution. The former dynamic Babel ESM transformer and external runtime-root
  override were removed; capability imports are now transformed by the Rust/
  oxc frontend.
- The Rust engine owns source/project discovery, complete JavaScript
  instrumentation and manifest generation, build orchestration, process
  supervision, workspace transactions, evidence archives, attribution,
  coverage analysis, MC/DC witnesses, exact test-set minimization, integrity,
  lifecycle/retention, query indexes and every human/agent query.
- Local cutover gates are green for 146 Rust workspace tests, clippy with
  warnings denied, runtime-shim tests, the frozen run/store/query contract, the
  agent drill-down/minimization workflow, independent Clang MC/DC oracle,
  node:test, Vitest, Playwright, Chromium/Firefox/WebKit syntax behavior,
  opaque local-to-remote launch discovery, Vite, Next, esbuild, TypeScript
  compilation, Webpack, SWC, distributed merge, native npm package pairing,
  packed `npx`, APFS forced-termination recovery and the transform benchmark.
  The current 500-file release transform is 32.24 ms median and 33.43 ms p95.
  The post-cutover monolithic pinned Test262 run selected 41,593 files and
  retained all 65,051 baseline-passing scenarios with zero Rust transform
  failures and zero semantic-equivalence failures; baseline, transformation
  and instrumented execution took 844.91 s, 16.65 s and 580.47 s.
- npm packaging contains only the exec launcher, target-runtime shims, docs and
  README plus one exact-version optional native package. The package has no
  JavaScript engine dependencies and no public Vite engine API. Native package
  publication remains a manual, deliberately expensive workflow; ordinary CI,
  compatibility, cross-repository and Test262 workflows are manual dispatches
  so routine development consumes no GitHub Actions minutes.
- Windows remains an explicitly deferred platform gate, not a reason to retain
  a second engine. The Rust Job-object, NTFS and native-package work stays in
  the plan and must pass on a real Windows host before Windows binaries are
  claimed or published.
- Python has a strict language-frontend contract, independent coverage.py/
  pytest oracle fixtures and private evidence-v3 analysis. The first
  Supercov-owned denominator implementation now lives in Rust and uses exact,
  pinned Ruff parser/AST/text-range crates (`0.0.10`) to discover stable
  statement, function, decision and branch obligations for current Python
  syntax. This required intentionally raising the pinned Rust MSRV/toolchain to
  1.95. The implementation remains private and emits a blocking readiness
  limitation: it does not yet transform source or inject owned probes. Public
  runs therefore remain JavaScript/TypeScript only. The next language
  milestone is semantics-preserving Python probe insertion, followed by the
  stdlib dynamic-import hook and generated pytest context feeding evidence v3;
  coverage.py remains development-only.
- Rust-language coverage work started on 2026-08-26 with the accepted private
  architecture in `progress/rust-frontend-adr-2026-08-26.md`, subsequently
  refined by the compiler spike. The intended owned path is now an exact rustc-
  commit/host companion plus the generated std-only probe runtime; the stable
  concrete-source frontend is only a differential reference. Libtest marker
  contexts are the primary in-process attribution path, with process-per-test
  retained as an automatic exact fallback where child/async propagation is not
  proven. Compiler-generated macros, const, no_std, doctests and generated
  source remain explicit release blockers, not silently missing denominator.
  Supercov itself is the first dogfood target.

## Checkpoint — 2026-08-26 sole evidence v3 and frozen Rust model

- The user explicitly removed the pre-release backward-compatibility
  requirement. This checkpoint supersedes the earlier v2/v3 dual-reader
  migration notes: evidence v3 is now the sole product archive, and the old v2
  reader/writer and frontend-v1 contract have been removed rather than carried
  indefinitely.
- Every archive requires strict `frontend.json`, `coverage-model.json` and
  `manifest.json` identities. The persisted model now includes an exact
  language token; frontend/model language mismatch, unknown fields, malformed
  or partial recognized JSONL and incompatible merge declarations are fatal.
  JavaScript/TypeScript emits the same v3 boundary that private Rust and later
  languages must use.
- The target `rust-source-v1` semantic model is frozen separately from the
  incomplete private implementation variant. It fixes authored-source
  identity, point/branch/decision obligations, masking-MC/DC semantics,
  generated/macro/const/doctest surfaces, attribution axes and completeness
  meaning. Open implementation gates remain visible in
  `contracts/rust-coverage-v1/traceability.md` and block promotion.
- Real v3 migration tests exposed two historical ambiguities and converted
  them into enforced behavior: Playwright server evidence joins only on the
  full execution scope, and commands that terminate before a test starts
  retain a command-level setup outcome without inventing test coverage. The
  complete local JavaScript engine, merge, query, watchdog and isolation
  matrices remain green after the cutover.

## Checkpoint — 2026-08-26 Rust compiler-companion boundary

- The R1 expansion spike proved that an exact-version `rustc_driver` wrapper
  can observe authored, declarative-macro, procedural-macro and build-script-
  generated HIR/MIR and can inject real calls into optimized runtime MIR
  before codegen. Its private runtime is inserted into the in-memory crate AST,
  not the checkout; probe observations arrive while values, errors, caught
  panic status, drops, stdout and stderr remain equal to the baseline fixture.
- The public Rust frontend will therefore use an automatically selected,
  Supercov-owned compiler companion matched by rustc commit, host and the
  exact `librustc_driver` digest. It is an injection/provenance frontend only;
  the shared Rust engine remains the sole analyzer, attribution, archive and
  query implementation. LLVM/rustc coverage remains a development oracle.
- The spike also proved two hard boundaries: CTFE requires a distinct provider
  path, and Cargo's normal `RUSTC_WRAPPER` does not receive rustdoc's extracted
  doctest crate. The CTFE path now has a working exact-version proof: the
  companion injects in-memory block and split-edge markers through
  `mir_for_ctfe` and captures only their interpreter events without compiler
  log output; true and false paths preserved values and stdout/stderr. Its full
  const corpus, manifest, crash and performance gates remain blockers.
  Doctest interception now has a separate executable proof: a scoped launcher
  adds the compiler companion through exact rustdoc's test-builder-wrapper
  boundary, maps standalone hidden lines, and joins merged bundle/runner
  `__doctest_N` identities without a second extraction pass or unstable-user-
  code leak. Doctest probes and per-test transport remain blockers. The
  concrete-source Rust transformer is a private differential reference, not
  the intended public denominator or injection authority.
- `rust-compiler-companion-v1` freezes fail-closed selection and capability
  negotiation. Public readiness requires expanded provenance, runtime MIR
  probes, generated-source provenance, CTFE tracing, rustdoc/doctest tracing
  and exact test-harness attribution together; a private partial companion
  cannot claim measurement completeness.
- The engine now enforces that envelope against real binaries. It independently
  hashes the selected rustc driver and candidate executable, supplies the exact
  toolchain library directory only to the child loader, and accepts exactly one
  commit/host/driver/build match. The private companion's honest false CTFE and
  doctest capabilities are rejected by public selection, while private spike
  selection succeeds; missing and duplicate candidates are executable failures.

## Checkpoint — 2026-08-26 Rust probe transport v1

- The compiler companion no longer uses its temporary in-process atomic
  bitmask. Its in-memory AST injection now embeds the same std-only target
  runtime generated by the engine, and optimized-MIR calls publish numeric
  ordinals through the supervisor-owned mmap transport. A normal binary and an
  actual `cargo test` process both deliver all four expected ordinals while
  preserving source bytes, values, errors, caught panic, drop order, stdout and
  stderr.
- `rust-probe-transport-v1` freezes a bounded, authenticated fixed layout with
  one per-record process ID and 64-bit context ID, independently committed
  descriptors, explicit attachment/drop/incomplete health, a 128-bit task
  token, and a 64-bit checksum over record metadata and payload. Context zero
  is background/unattributed and cannot verify passed per-test coverage.
- The production reader/runtime tests now cover concurrent thread and process
  writers, descriptor and payload exhaustion, wrong token, malformed context,
  corrupt and truncated structures, symlink refusal, a reserved-but-
  uncommitted descriptor, and recovery of a fully committed observation after
  killing its writer. The exact layout is a typed packaged contract and drift
  is a test failure.
- This does not promote Rust coverage. Dynamic exact context propagation for
  concurrent libtest/async/subprocess work, complete obligations and stable
  expansion identities, CTFE/doctest publication, no_std, the six-target local
  matrix and the broader semantic corpus remain explicit blockers. Windows
  transport remains a later target-specific gate and no GitHub Actions were
  invoked for this checkpoint.
- A follow-on compiler proof now derives logical test names from rustc's
  generated test markers—including a test produced by a procedural attribute
  macro—and injects nesting-safe context entry/restoration on every normal and
  unwind exit. Five concurrent libtests, including expected panic, remain
  separated. A spawned child thread deliberately remains context zero, proving
  Supercov detects rather than guesses missing propagation; exact child/async
  propagation or automatic process-per-test rerun remains a promotion gate.
- The private compiler frontend advances the wire to
  `rust-probe-transport-v2`: assertion phase definitions authenticate their
  parent, static assertion decision and transport-global dynamic invocation
  nonce. This distinguishes repeated executions at one source site, preserves
  nested causality, and avoids PID/counter collisions across concurrent or
  cloned writers. Orphan observation contexts, cycles and cross-attempt chains
  fail closed; a definition without an observation remains valid because
  evaluation can panic before a verdict is committed.
- Rust source identity v1 is now frozen and executable for compiler-derived
  function/statement points and the first `if`/`if let`/let-chain decision,
  condition and branch shapes. Authored and declarative-expansion tokens use
  normalized project source ranges and repeated expansions aggregate;
  synthetic proc-macro output adds its callsite, stable expansion chain and textual owner
  path plus an owner-local ordinal; owned `OUT_DIR` source uses project-relative
  package and generated paths. The compiler rejects full-ID and shortened probe
  collisions, and two clean target
  directories emit byte-identical candidates without ephemeral paths. The
  selected function MIR probes now emit manifest-derived ordinals. The manifest
  remains deliberately incomplete until the same identity and real probes
  cover assertions, CTFE and doctest obligations.
- The next private slice translates rustc's authored branch regions into
  Supercov-owned MIR decision frames rather than importing a rustc/LLVM
  profile. Exact goldens now cover all exercised ternary shapes for `&&`, `||`,
  mixed `(a || b) && c`, nested bodies, value-producing nested decisions,
  `if let` and a let chain, nested/thread-migrated runtime frames and parallel
  libtest contexts. An mmap descriptor reserved at decision start and committed
  only at its outcome makes condition panic and process kill explicit
  incomplete health. External macro implementation control flow no longer
  pollutes an authored caller's denominator. Declarative, procedural and
  build-generated owners now bind only through a unique compiler-typed boolean
  branch at the exact expanded span, with their runtime vectors gated in the
  spike. The exact-version companion now prevents rustc from injecting
  its profiler runtime and strips native MIR coverage before codegen; gates
  prove no `.profraw` output or LLVM profile/coverage symbol remains in the
  linked executable. Rustc branch correspondence is therefore a compiler
  oracle inside Supercov's owned injection path, not a shipped measurement
  dependency. The broader nested/derive/external macro corpus remains open.
- The next compiler slice closes `while`/`while let` decisions and their
  separate zero-iterations/entered branches. Nested patterns are handled as
  arbitrary optimized-MIR condition subgraphs with complete terminal-edge
  instrumentation, not guessed single switches. A first-commit branch frame
  starts once at the natural loop entry and is bypassed by backedges, preserving
  the start context across migration and leaving killed writers explicitly
  incomplete. Exact fixtures prove multi-iteration behavior without duplicate
  or relabeled invocation evidence. Match and `?` are now closed below; assertions,
  CTFE and doctest completeness remain private release blockers.
- Authored `for` loops now close the same frozen `loop-entry` zero/entered
  obligation without inventing an MC/DC decision. A documented post-borrow-
  check/pre-optimization provider binds rustc's exact desugared
  `Iterator::next` `Option::None`/`Some` switch and inserts Supercov's owned
  first-commit mmap frame before later optimizer-specific lowering. The
  executable corpus covers empty, multi-iteration, sequential, nested,
  always-exiting and iterator-panic loops. Smallest-enclosing-source ownership
  separates nested loops, and panicking `next()` leaves only explicit
  incomplete health. This work also removes compiler-desugaring scaffolding
  from authored statement points and gates emitted branch/decision kinds
  against the frozen Rust contract.
- Reachable authored `match` arms now use stable manifest selection groups and
  a pre-optimization first-commit runtime frame. One selected-arm observation
  derives the selected branch plus every sibling rejection without emitting
  redundant raw events. Guard MC/DC vectors, rejection, nested, identical,
  empty and local declarative-macro bodies are exact; irrefutable one-arm
  matches create no false denominator, and a panicking guard leaves explicit
  incomplete health without an arm hit. For proc-macro output whose arm spans
  collapse to one callsite, semantics-neutral markers are inserted in built
  MIR, follow rustc's real/imaginary match-edge structure, survive borrow
  checking exactly once and are removed before runtime calls are added. Exact
  unguarded and compound-guard proc arm selections are now proven. Built-MIR
  semantic reachability also removes a statically unreachable authored arm
  from the denominator. Synthetic groups now preserve their expanded-HIR
  parent/site/arm relation and require one parent-consistent CFG assignment;
  body-, scrutinee- and guard-nested proc matches have exact independent arm
  counts. Separate built-MIR condition markers exclude nested control switches
  by accepting/rejecting reachability and emit exact synthetic guard MC/DC
  vectors. Every marker is required to survive borrow checking exactly once and
  is removed before runtime instrumentation.
- `let else` now has its frozen `matched`/`else` denominator and exact owned
  first-commit observations. Authored patterns bind to rustc's retained branch
  region; collapsed proc-macro output uses built-MIR real/imaginary endpoint
  markers that must survive borrow checking exactly once and are removed before
  runtime calls. Simple/nested patterns and multiple sequential authored and
  synthetic statements preserve behavior and exact invocation counts.
- `?` now has a frozen `continued`/`early return` denominator and an exact
  owned first-commit path. Expanded HIR supplies stable obligations; the built-
  MIR bridge binds the actual typed `Try::branch` call and
  `ControlFlow::Continue`/`Break` switch, carries semantic endpoint markers
  across borrow checking exactly once, removes them, and only then installs
  runtime calls. `Result`, `Option`, sequential and nested authored operators,
  collapsed sequential/nested proc-macro operators and an operand panic have
  exact behavior/evidence goldens. Operand evaluation precedes frame start, so
  its panic creates neither a false alternative nor a false incomplete frame.
- Rust assertions now have an owned outcome denominator and exact runtime
  observations for `assert!`, `assert_eq!`, `assert_ne!` and their debug
  variants. Expanded HIR retains authored compound conditions; structural
  Boolean markers bind them before optimization and are removed before runtime
  injection. Goldens prove passed/failed vectors, `assert_ne!`'s inverted
  compiler comparison, collapsed proc-macro source, once-only left-to-right
  operand evaluation, no false failure when condition evaluation panics, and a
  committed failure before a message argument panics. Compiler-owned phase
  boundaries now derive a deterministic child transport context from the
  active test/assertion context and stable decision ID. Exact concurrent
  goldens prove argument attribution, normal/unwind restoration and nested
  assertion restoration. Supervisor collision preflight and persistence of
  those contexts as explicit evidence-v3 assertion phases remain the promotion
  gate; phase causality is never inferred from outcome timing.

## Checkpoint — 2026-08-26 production Rust compiler execution

- The private path now spans real Cargo invocation through exact rustc-
  companion selection, compiler-owned source snapshots, repeated-unit
  denominator merge, process-per-libtest execution, authenticated transport,
  assertion/background projection and shared evidence-v3 analysis. Cargo's
  actual compiler path is the selection authority; wrapper attestations are
  independently reverified after build.
- A production-shaped test-harness build exposed and fixed textual-`main`
  marker aliasing by keying all structural markers with rustc `LocalDefId`.
  Paired source/manifest sidecars are strict and complete; the engine never
  guesses compiler source keys from the later filesystem.
- Each exact test attempt gets an OS-random 128-bit token, a bounded private
  mmap and a collision-preflighted base context. Supported assertion phases
  retain causal identity; context-zero evidence becomes a background result.
  Ignored/no-source tests may honestly produce no attachment, caught panics
  retain incomplete reservations without false vectors, and dropped or
  invalid evidence fails closed.
- Cargo/libtest filtering now has a strict production contract. Cargo's
  `TESTNAME` and libtest positional/ignored/skip/exact selection are preserved
  across artifact listing and exact process execution; empty filtered sets are
  valid, and Supercov no longer injects `--nocapture`. Options whose scheduling
  or presentation semantics are not yet reproducible fail closed. The real
  compiler gate runs exactly one ignored test selected on both sides of `--`.
- The Cargo wrapper now compiles a single shared probe runtime with the exact
  rustc path Cargo supplied. Concurrent compiler processes converge through a
  bounded create-new lock and atomic archive rename; the gate proves one
  archive and no terminal lock/partial debris. Every instrumented crate links
  that ABI, closing the per-crate TLS split before production doctests are
  enabled. The pinned target planner also distinguishes Cargo's default/doc
  selection from explicit non-doc targets; doc-only remains fail-closed until
  its supervisor is connected.
- Public Rust remains blocked on full Cargo/libtest output/order and retry
  capture, remaining doctest execution integration, compiler-build evidence,
  atomic store/query lifecycle and the
  complete semantic, platform and performance matrices. The candidate still
  advertises those incomplete public capabilities as false.

## Checkpoint — 2026-08-26 compiler-run lifecycle and cross-language query scope

- The private compiler frontend now uses the production transactional run
  lifecycle rather than returning an in-memory report only. It acquires the
  project lock, recovers abandoned state, prepares the isolated workspace,
  runs Cargo and the exact compiler companion there, writes one deterministic
  compressed evidence-v3 archive, re-analyzes that archive, atomically
  publishes run metadata plus evidence, removes terminal work state and
  verifies the original checkout hash is unchanged.
- The production-shaped rustc fixture then resolves that published run through
  the ordinary `supercov runs <id> --json` path. This exposed a real second-
  language leak: the immutable query index assumed every scope had JavaScript
  `mode`, `roots` and classification entries. Query-index schema v2 now stores
  a typed language/model scope. JavaScript retains source-discovery mode,
  roots and entries; Rust stores compiler-owned language, model, crate unit and
  frontend completeness without fabricated JavaScript fields. A direct index
  regression and the end-to-end spike gate both prove the shape.
- The compiler-supervisor limitation has therefore been removed from the
  candidate manifest. CTFE and doctest obligation/probe mapping remain its two
  honest denominator limitations. Lifecycle promotion is still blocked on the
  crash, ENOSPC and concurrent-run matrix; public Rust selection remains false
  until those plus every R1/R2 gate are closed.
- A post-checkpoint audit found a real spike-era shortcut before moving to
  CTFE: the denominator emitted general statement/function points, but runtime
  function hits were limited to four fixture names and statement hits were not
  injected. The companion now instruments every source-backed function and
  statement obligation. It uses rustc code mappings with exact MIR-span
  fallback, chains sequential statements that rustc coalesces into one block
  in authored order, and leaves dummy-span harness functions unmeasured with
  their existing explicit source limitation rather than inventing identity.
  The full macro/generated/concurrent corpus remains behavior-identical; every
  raw hit must resolve to a compiler manifest, all former branch evidence is
  retained, and a dedicated one-sided branch proves no false statement hit on
  its unexecuted arm.
- The first CTFE generalization step also removes the hard-coded
  `const_decision` target and the process-local 16-bit block/edge namespace.
  Every local compile-time body queried through `mir_for_ctfe` now receives a
  domain-separated SHA-256 marker keyed by crate, textual compiler definition,
  observation kind and local ordinal. Registration rejects any 64-bit
  collision, the interpreter observer accepts only registered constants, and
  records carry the exact definition plus local site. Compiler-owned entry and
  return markers plus the observing compiler thread now frame nested CTFE
  invocations without relying on rustc tracing spans (the step events expose
  none). The successful-build corpus requires balanced per-thread stacks and
  proves two separately framed calls take opposite edges. The existing
  true/false const behavior remains byte-identical and the corpus proves more
  than one CTFE definition is observed. This is framing groundwork only: marker-to-
  frozen-obligation mapping and crash-safe evidence-v3 build-phase publication
  were subsequently completed for function and statement points. Compiler-finalized
  compiler unit bundle is atomically renamed, uses lossless textual identities,
  and is rejected unless every event, frame and hit ordinal resolves exactly.
  The non-atomic map/event pair has no compatibility reader. Real compiler
  gates prove ENOSPC cleanup, SIGKILL-before-rename visibility and collision-free
  simultaneous publishers. A real
  compiler run now archives and re-queries those observations as `rustc` setup
  evidence. CTFE semantic start/condition/finish markers now reconstruct exact
  nested vectors and commit the explicitly frozen decision-outcome alternative;
  the controlled const-fn corpus proves independent false and true evaluations.
  The direct decision-to-outcome-branch relation also removed a runtime
  token-domain error and now guarantees the branch observation is committed
  before a decision vector can become complete. The next corpus expansion
  proves direct const, static, const-fn, const-generic-fn, generic associated
  const, anonymous array-length and independent inline-const owners. rustc
  omits native branch regions for several of these owners, so typed Boolean
  markers are now inserted into built MIR, required to survive exactly once,
  consumed from CTFE MIR and removed before evaluation. Multi-condition
  masking and separate nested decisions are exact as well. Remaining CTFE
  branch kinds, supported-target coverage and performance are active blockers;
  the candidate therefore reports incomplete CTFE mapping and stays private.
- Merged rustdoc source mapping now uses a strict two-stage compiler contract.
  The extracted bundle can publish only `doctest-pending:<group>` identities,
  which the normal manifest parser rejects. The later runner atomically
  publishes exact `__doctest_N` path/line descriptors; the Rust engine aligns
  each complete extracted `main` body against original documentation, then
  rebuilds all points, branches, alternatives, decisions, selection groups,
  cross-references and runtime ordinals. Complete synthetic expansion chains
  receive the same exact rebase: callsites map to original documentation,
  temporary owners become stable doctest definitions, and alternative
  canonicals/ordinals are rebuilt. Full-body alignment disambiguates repeated
  atoms and repeated lines while malformed synthetic chains, missing,
  ambiguous, reordered, tampered or partial inputs fail closed. The joined
  real-rustdoc manifest, including an owned proc-macro-generated local
  decision, passes the production validator/normalizer with no temporary key,
  and its runtime events retain the exact merged test root. Broader derive/
  external/nested expansion coverage plus archive/retry, wrapper and failure/
  signal corpora remain promotion blockers.
- Production compiler-output ingestion now performs that deferred join before
  workspace normalization. Pending bundles cannot leak through the normal
  parser, unmatched or duplicate groups fail, and maps for zero-obligation
  tests remain available for later outcome attribution. The corresponding
  transport translator rekeys string IDs and numeric ordinals and recursively
  reconstructs nested assertion contexts because their authenticated identity
  incorporates the translated decision ID. The pinned libtest JSON stream now
  publishes one atomic outcome unit authenticated by companion and raw-stream
  SHA; strict parsing preserves passed/failed/ignored, timeout-warning and
  fail-fast completed/unfinished/unstarted states. The same invocation now
  captures rustdoc's exact version-2 extracted catalog, and the atomic outcome
  unit binds catalog plus event bytes independently. The lossless join catalogs
  every merged, standalone and compile-fail test, validates merged compiler
  descriptors against exact names/paths/lines/flags and preserves the one
  identity ambiguity rustdoc leaves when filtered and fail-fast-unstarted
  counts coexist. Cataloged tests project status, retry zero and source/phase
  identity into evidence v3 without inventing a phase for a test that never
  started. Outcome-unit v3 now additionally binds the authenticated runtime
  transport snapshot. A supervisor-created per-invocation mmap is consumed and
  removed at atomic publication; the join partitions every committed record
  exactly once across cataloged test roots and context-zero background,
  translates merged obligation/ordinal/assertion identities and projects the
  result through the shared evidence-v3 runtime path. Unknown roots, digest or
  count tampering and dropped evidence fail closed, while incomplete
  reservations remain explicit health. Stable multi-package invocation
  identity and visible-output equivalence remain open before public rustdoc
  execution.

## Checkpoint — 2026-08-27 production Cargo doctest execution

- The production Rust compiler frontend now executes rustdoc rather than only
  ingesting artifacts from a separate spike. The Cargo wrapper publishes an
  atomic exact-compiler attestation, resolves a rustdoc with the same commit,
  release and host, and launches the exact companion as rustdoc's test-builder
  wrapper. A wrapper-dispatch deadlock discovered by the doc-only gate is
  closed: inherited rustdoc mode cannot intercept Cargo's nested `rustc -vV`
  probe before that probe publishes the required selection.
- Real default, explicit `--lib` and `--doc` Cargo commands run through the
  same isolated workspace, compiler normalization, evidence-v3 archive,
  atomic run publication and normal query path. Runner declarations reflect
  only observed `rustc`, `rust-libtest` and `rustdoc` evidence; doc-only runs no
  longer make a false libtest capability claim.
- Rustdoc's exact version-2 catalog is captured before every instrumented
  execution, even the low-level output-equivalence path. Standalone temporary
  line metadata is never treated as source identity: generated HIR binds one
  exact catalog path/line. Merged roots translate obligation IDs, probe
  ordinals and nested assertion contexts before rebasing to that canonical
  identity. A focused regression combines canonical and merged evidence for
  the same doctest and requires both records exactly once.
- Transport health now has an explicit `test-attempt` or `runner-invocation`
  scope. One parallel rustdoc invocation is no longer misrepresented as one
  independent attachment per cataloged test. The real fixture proves six
  cataloged doctests, ignored/no-run/should-panic/compile-fail states, CTFE
  setup, compiler dependency hits, assertion phases and context-zero
  background evidence with no dropped or incomplete record.
- A deliberately failing doctest preserves rustdoc's exact exit 101 while
  Supercov atomically publishes a queryable failed run and removes terminal
  work. The full compiler spike, complete engine tests, clippy, runtime assets and
  Rust-only package preflight are green locally. No hosted workflow ran.
- This closes production happy-path and ordinary failed-test execution, not
  public Rust promotion. Retry/fail-fast orchestration, complete visible-output
  behavior, multi-package identity, existing-wrapper composition, signal and
  ENOSPC recovery, remaining semantic corpora, platform matrices and the
  1.10x performance gate remain blocking.

## Checkpoint — 2026-08-27 Cargo-authoritative libtest execution

- Production no longer reconstructs Cargo's test-artifact launch environment.
  The original Cargo test command remains the authority and invokes one
  internal Supercov target runner with Cargo's exact package/build-script
  variables, profile state, loader paths, artifact order and fail-fast policy.
  The runner retains the proven process-per-test transport and assertion
  contexts inside that Cargo-owned boundary.
- A real three-package workspace gives every package the same target and test
  names, sets a distinct runtime value from each build script and deliberately
  fails the middle package. Default Cargo execution runs the first two packages
  and stops; `--no-fail-fast` runs all three. Ordinal-bound units preserve the
  observed order and exact exit statuses.
- Cargo passes the target runner to rustdoc as `--test-runtool`. The exact
  rustdoc wrapper strips only Supercov's injected runner pair and then uses the
  existing catalog/outcome/transport supervisor. Missing, duplicated or
  foreign runner composition is rejected. Generated doctest binaries therefore
  cannot create libtest units or be counted twice.
- Each runner invocation reserves a durable create-new ordinal. A normal
  internal failure atomically publishes a strict diagnostic failure unit; an
  uncatchable death leaves an unmatched reservation and is reported as a
  distinct incomplete transaction. Partial files, duplicate publications,
  retained transports and incompatible identities fail closed.
- The reconstructed dynamic-loader implementation and macOS fallback defaults
  were removed. The full real compiler corpus—including the dynamically linked
  proc-macro harness—passes using only Cargo's inherited environment. The
  complete public JavaScript/TypeScript matrix, clippy, 228 engine tests, 19
  contract tests, 16 CLI tests, runtime assets and Rust-only package preflight
  are also green locally. No hosted workflow ran.
- This is an R2 checkpoint, not public Rust promotion. Composition with an
  existing configured runner is now proven for normal hierarchy/environment
  precedence, structured scalar/array argv, isolated workspace relocation and
  rustdoc composition. Cargo config `include`, command-line `--config`,
  and multi-target selection remain fail-closed. Explicit installed rustup
  `+toolchain` selection now resolves the real Cargo executable through the
  same rustup installation, verifies proxy/selected verbose identity, and lets
  that Cargo select the matching rustc configuration. A real run without a
  `RUSTC` override proves exact companion selection, configured-runner
  composition, test selection, evidence and cleanup.
  Cargo's cached workspace now lives in an authenticated same-filesystem
  sibling, preserves the project basename beneath neutral generated ancestors,
  and proves through a real build script that copied and parent configuration
  is applied exactly once. Atomic staging/current/previous generations,
  marker-tamper refusal, copy-exhaustion and rename-failure recovery, exact
  terminal cleanup and `supercov clean` integration are green. A writable
  same-filesystem parent is still required; the read-only-parent, cross-volume
  and supported-platform fallback remains a release blocker.
  Retry identity, nextest/custom harnesses, complete presentation modes, their
  crash/concurrency matrices, remaining R1 semantic corpora,
  supported-platform gates and the 1.10x performance gate remain blocking.

## Checkpoint — 2026-08-27 owned Cargo 1.95 runner configuration

- Target-runner selection no longer splits ordinary files and newer Cargo
  layers between two implementations. One Rust-owned Cargo 1.95 model loads
  the ordinary hierarchy and Cargo home, recursive ordered/optional `include`
  files and left-to-right `--config` files or strict dotted-key assignments.
  It preserves non-mergeable runner arrays, definition-relative program roots,
  ASCII-whitespace string parsing and CLI-over-environment-over-file
  precedence. Include cycles, malformed values and Cargo-forbidden registry
  token/secret assignments fail during preflight.
- Exact target entries beat cfg entries. When cfg evaluation is necessary,
  Supercov invokes the exact configured rustc command with the selected target,
  parses its cfg facts through Cargo's own `cargo-platform` model and rejects
  multiple matching cfg runners. Ordinary config files use this owned path as
  well, eliminating the previous dependency behavior that silently chose one
  duplicate cfg match and split runner strings only on spaces.
- Direct Cargo process argv remains structured. Supercov no longer joins and
  reparses it through shell syntax, which had destroyed quote characters inside
  TOML `--config` payloads. Opaque package-script commands still use their
  necessary textual expansion path.
- The real compiler corpus runs exact-target and cfg runners supplied through
  `include`, then proves a CLI runner overrides them without losing quoted
  arguments. An independent paired oracle makes Cargo 1.95 and Supercov reject
  the same duplicate cfg-runner configuration before tests execute. Successful
  libtest/rustdoc runs retain authenticated evidence and leave no terminal work.
- The authoritative corpus, 241 engine tests, 19 contract tests, 16 CLI tests,
  warnings-denied clippy and the complete public JavaScript/TypeScript matrix
  are green locally. No hosted workflow ran.
- This is an R2 checkpoint, not public Rust promotion. Included/CLI changes to
  `build.rustc` or compiler wrappers still fail closed when host/cfg selection
  depends on the changed command. Multi-target selection, retries,
  nextest/custom harnesses, complete presentation modes, read-only/cross-volume
  fallback, remaining semantic corpora, target matrices and the 1.10x gate
  remain blocking.

## Checkpoint — 2026-08-27 target-indexed Cargo runner composition

- Multiple selected targets no longer share one implicit configured runner.
  Resolution produces an ordered, deduplicated target plan; every exact target
  gets a structured Cargo runner override containing Supercov's internal marker
  and the selected target identity. `host-tuple` normalizes to the exact Cargo
  host before deduplication. Relative custom JSON targets resolve from the
  tested project root, use Cargo's canonical path/short-name split and fail
  closed when distinct paths would alias one configuration name.
- Both internal consumer paths are target-bound. Libtest selects only the
  matching original runner and publishes version-2 atomic units keyed by target
  plus artifact. The reader accepts only the run's selected target set.
  Rustdoc removes the exact injected marker/target pair and restores only that
  target's original runner. Missing, unknown, duplicated or foreign target
  composition is fatal.
- A real Cargo 1.95 gate passes the explicit installed host and `host-tuple`
  together and proves Cargo deduplicates them before one exact runner
  invocation while preserving environment, order, fail-fast and cleanup.
  Synthetic two-target gates prove distinct runner selection, rustdoc
  restoration, structured config generation and collision-free publication.
- The authoritative rustc/rustdoc corpus, 245 engine tests, 19 contract tests,
  17 CLI tests, warnings-denied clippy and the complete public JavaScript/
  TypeScript matrix are green locally. No hosted workflow ran.
- This closes the single-target engine assumption, not the target platform
  matrix. Only `aarch64-apple-darwin` is installed on the proving host;
  execution on two genuinely different targets, supported Linux targets and
  Windows remain explicit release gates. Runner-affecting `build.rustc`/
  wrapper configuration, retries, nextest/custom harnesses, presentation modes,
  read-only/cross-volume fallback, semantic corpora and performance also remain
  blocking.

## Checkpoint — 2026-08-27 owned Cargo compiler-command selection

- One target-independent compiler plan now resolves Cargo's `build.rustc`,
  `rustc-wrapper` and `rustc-workspace-wrapper` surfaces across ordinary files,
  recursive includes, CLI config, `CARGO_BUILD_*` and direct `RUSTC*`
  environment variables. It preserves Cargo's special direct-environment
  precedence and empty-wrapper reset behavior plus definition-relative paths.
- The exact configured compiler now supplies both host identity and selected
  target cfg facts. Workspace-relative compiler programs execute only from the
  authenticated copied workspace; the configuration preflight no longer runs
  project-owned compiler code from the source checkout.
- The real rustc/rustdoc corpus supplies an included compiler proxy, requires
  every observed proxy invocation to live under the isolated workspace and
  reaches exact companion/evidence/query completion. General or workspace
  compiler wrappers are detected but fail before execution until transparent
  composition can preserve their compiler-visible semantics; a marker oracle
  proves a rejected wrapper never executes or creates run debris.
- The authoritative rustc/rustdoc corpus, 249 engine tests, 19 contract tests,
  17 CLI tests, warnings-denied clippy, the standalone Cargo runner gate and
  the complete public JavaScript/TypeScript matrix are green locally. No hosted
  workflow ran.
- This closes configured compiler selection and silent wrapper replacement,
  not wrapper composition. Retries, nextest/custom harnesses, presentation
  modes, read-only/cross-volume fallback, real distinct targets, remaining
  semantic corpora and performance remain release blockers.

## Checkpoint — 2026-08-27 exact Cargo compiler-wrapper composition

- Supercov now composes both Cargo compiler-wrapper layers instead of rejecting
  them. It temporarily occupies Cargo's general and workspace slots only for
  the isolated command, uses the nested self path as an exact workspace marker,
  delegates non-workspace compilations through the original general wrapper and
  rustc, and reconstructs workspace compilations as original general wrapper,
  original workspace wrapper and one inner Supercov compiler relay.
- The bridge restores the original wrapper environment before user wrapper
  code executes, including absence, empty values and non-UTF Unix/Windows
  values. Definition-relative wrapper programs remain relocated inside the
  authenticated workspace. Each inner relay independently attests the actual
  compiler token; the strict atomic run-level selection is read only after all
  concurrent Cargo jobs finish.
- A real two-layer Node wrapper corpus proves chain order, isolated executable
  paths, restored environment, exact evidence/query completion and cleanup. A
  forced workspace-wrapper exit 73 during crate compilation preserves Cargo's
  failure and leaves no terminal run debris. The complete rustc/rustdoc corpus,
  251 engine tests, 19 contract tests, 17 CLI tests, warnings-denied clippy and
  the standalone Cargo-runner gate are green locally. No hosted workflow ran.
- Direct execution of a concrete Cargo path now correctly retains Cargo's
  default `rustc` search behavior; only an explicit rustup `+toolchain` uses a
  pre-resolved sibling compiler during Supercov preflight.
- This closes normal forwarding and argument-transforming wrappers, not a
  compiler cache that returns artifacts without invoking its supplied compiler,
  intentional wrapper compiler substitution, composed-wrapper signal recovery
  or the relay's performance gate. Those remain explicit Rust promotion
  blockers alongside retries, custom harnesses, platform coverage and the
  remaining semantic corpora.

## Checkpoint — 2026-08-27 exact cargo-nextest attempt boundary

- Supercov now owns strict cargo-nextest 0.9.138 and 0.9.140 catalog and target-
  runner contracts. Exact version metadata is required; unverified older,
  hypothetical intermediate and newer releases fail closed before user tests.
- Selection is projected losslessly across Cargo, nextest and libtest. Real
  gates cover arguments on both sides of `--`, empty-suite pass/error policy,
  retries, terminal flaky status, default fail-fast with an exact unstarted
  test, bare timing flags and clustered verbosity.
- Every attempt carries exact nextest run, binary, test, retry, total-attempt
  and runner-attempt identity. Two real nextest attempts overlap while their
  contexts, ordinals, evidence and outcomes remain distinct.
- A production configured-runner composition gate kills Supercov's target
  runner after its durable reservation. The watchdog contains the child test,
  no false unit or stored run is published and the unmatched reservation is
  reported as infrastructure failure. Original nextest and instrumentation
  exit codes are preserved rather than collapsed into a generic failure.
- This closes the pinned ordinary nextest retry/concurrency/crash slice, not
  custom harnesses, remaining presentation modes, late work/subprocesses,
  cache-bypass wrappers, cross-volume isolation or platform matrices. A newly
  isolated constant-literal assertion denominator gap remains an R1 blocker at
  this checkpoint.

## Checkpoint — 2026-08-27 authored constant assertion decisions

- The constant-assertion gap from the nextest checkpoint is closed without a
  Supercov constant evaluator. Expanded HIR marks authored assertion atoms;
  built MIR may bind either their dynamic or rustc-folded typed Boolean switch.
  Synthetic equality-macro conditions continue to reject unrelated constant
  switches.
- Exact goldens cover literal true/false, `debug_assert!`, folded and named
  constants, and mixed literal/dynamic `&&` and `||`. `assert!(false)` remains
  a real decision with only the failed vector observed, so its passing
  alternative remains uncovered instead of disappearing or being invented.
- Baseline/instrumented behavior, assertion-phase evidence v3 and the full
  rustc/rustdoc/Cargo/nextest corpus are green. The public node:test, Vitest,
  Playwright, Vite, esbuild, tsc, webpack and SWC matrices remain green as
  well: 267 engine tests, 19 contract tests and 17 CLI tests pass with clippy
  warnings denied.
- The corpus runner now rejects killed or timed-out commands with no exit
  status even when failure was expected. A slow deliberately failing doctest
  receives its own bounded timeout rather than converting infrastructure death
  into a valid test failure.
- This closes one traced R1 branch-denominator blocker only. The remaining R1,
  R2, lifecycle, platform, oracle, performance and dogfood promotion gates are
  unchanged. No hosted workflow ran.

## Checkpoint — 2026-08-27 cross-crate macro and derive expansion

- A project-owned path dependency now exports one declarative macro used in
  two modules. rustc retains its source through the external-source path, so
  the companion asks rustc to reload and metadata-hash-verify the exact bytes.
  Stable function, statement, decision and branch identities aggregate under
  the dependency source key and receive both exact runtime vectors.
- A real derive macro emits an impl method. Its complete points, `if` decision,
  alternatives and false/true vectors remain one distinct synthetic expansion
  at the authored derive callsite across clean target directories.
- An ordinary source match guard containing `matches!(...)` remains one opaque
  authored condition rather than exposing the macro's internal comparisons.
  A pre-borrow compiler marker binds the unique terminal typed-Boolean result
  switch reachable from all internal switches, is consumed exactly once and
  is removed before runtime instrumentation. Generated proc/declarative guards
  retain their existing expanded models; missing or ambiguous structure fails
  closed.
- The authoritative rustc/Cargo/rustdoc/nextest corpus and the complete public
  JavaScript/TypeScript engine matrix are green locally: 267 engine tests, 19
  contract tests and 17 CLI tests pass with clippy warnings denied. The
  expanded cold corpus now has an explicit bounded five-minute harness budget;
  the public 1.10x performance gate remains entirely open. No hosted workflow
  ran.
- This narrows RCV-IDENTITY, POINT, MC/DC, BRANCH and EXPANSION gates. Nested
  external macros, broader attributes/derives, generic/trait/async corpora,
  independent oracles and every remaining R1-R4 promotion gate are still
  blockers.

## Checkpoint — 2026-08-27 serialization-safe generic/trait/async probes

- A focused downstream corpus reproduced a real compiler-boundary defect: MIR
  serialized from a library referenced a compiler-injected Rust wrapper body,
  and downstream generic monomorphization failed because that local wrapper had
  no loadable optimized MIR.
- The companion now injects foreign declarations only. Every MIR probe calls
  the shared `__supercov_rt_*` C ABI directly, while Cargo continues to build
  and link one exact static runtime. Compiler machinery creates no authored
  manifest records and no crate-local TLS copy.
- A downstream binary instantiates two generic monomorphizations, exercises a
  trait default through static and dynamic dispatch, calls an overriding impl,
  and polls a future that returns `Pending` once. Baseline and instrumented
  stdout, stderr and values match exactly. Each source function/decision stays
  one stable obligation and publishes both exact Boolean vectors.
- Async function-entry semantics are now explicit: the generated async body
  closure contributes one entry at first poll; constructing the future does
  not create a second function obligation. This corrects the denominator rather
  than preserving the earlier candidate behavior.
- The focused ABI/manifest/evidence gate, the full
  rustc/Cargo/rustdoc/nextest corpus, warnings-denied Clippy and all workspace
  tests are green locally: 19 CLI, 19 contract and 277 engine tests. The
  aggregate audit accepts no emitted ordinal outside the frozen denominator.
  Doctest descriptor goldens derive their authored source lines from the
  fixture, so corpus growth cannot silently stale the oracle. This narrows
  RCV-IDENTITY, POINT, SEMANTICS and RUNTIME only; broader
  async/generic/trait, oracle, platform and every R1-R4 gate remain blockers.
  No hosted workflow ran.

## Checkpoint — 2026-08-28 frozen logical selections and broader async parity

- Strict compiler manifest candidate v3 represents each decision-contributing
  `&&`/`||` branch with its exact right-subtree condition index. Runtime and
  CTFE evidence derive short-circuited/right-evaluated alternatives from the
  existing ternary MC/DC vector, and the parser rejects direct duplicate hits.
- Logical value selections use the same frozen branch kind without creating a
  fictitious control decision. MIR first-commit frames cover every incoming
  path to the right operand and the short-circuit continuation. A nested
  `(a && b) || c` runtime and const-evaluation corpus observes all alternatives
  with unchanged values and output.
- The manifest parser rejects v2 instead of carrying a migration path,
  normalization distinguishes internal derived ordinals from emitted value
  alternatives, evidence-v3 projection and CTFE projection agree, and rustdoc
  rebases the branch and decision relations together.
- Generic/trait/async parity now includes async trait defaults, overriding
  async implementations, a generic async dispatcher, an async closure, nested
  generic decisions and a borrow plus `Drop` guard across real suspension.
  Future construction remains outside the function denominator and first poll
  remains the one body entry.
- The focused gate, full rustc/Cargo/rustdoc/CTFE/nextest corpus, 19 CLI tests,
  19 contract tests, 280 engine tests, warnings-denied Clippy and formatting
  pass locally. No hosted workflow ran. R1–R4 remain open; independent oracle,
  broader language-feature, supported-platform and public-readiness gates are
  still release blockers.

## Checkpoint — 2026-08-28 advanced types and nested expansion binding

- The downstream compiler corpus now covers associated-type trait defaults,
  GAT projections, RPITIT methods and consumers, and a higher-ranked closure
  bound. Baseline and instrumented output match; each definition retains one
  source function identity and every compound decision publishes its exact
  three short-circuit vectors through the serialization-safe shared ABI.
- A body-replacing procedural attribute supplied two Boolean atoms whose spans
  both collapsed to the same authored callsite. The old optimized-MIR fallback
  failed closed on two possible switches. Synthetic non-guard decisions with
  duplicate condition ranges now use pre-borrow-check typed-Boolean markers,
  ordered only when CFG reachability proves one total semantic order. The
  attribute's exact decision and logical-selection evidence is now gated.
- A procedural macro that emits a project-owned dependency declarative macro
  invocation keeps the dependency macro's authored source identity and adds
  exact observations to its shared obligation. The parent procedural expansion
  creates no duplicate denominator. Exact event multiplicity is asserted.
- The focused gate, a clean complete rustc/Cargo/rustdoc/CTFE/nextest corpus,
  19 CLI tests, 19 contract tests, 280 engine tests, warnings-denied Clippy,
  formatting, script syntax and diff safety pass locally. No hosted workflow
  ran. These are narrow R1 identity/semantics/expansion advances; R1–R4 and all
  remaining oracle, toolchain, platform and public-readiness gates stay open.

## Checkpoint — 2026-08-28 generated Rust differential and diagnostic parity

- A deterministic generated corpus now covers 48 nested Boolean programs over
  every three-bit input plus sixteen cases each for let chains, match guards,
  error propagation/`let else`, and closure capture/destructor ordering.
  Baseline and instrumented output is exact, vectors and frozen alternatives
  are asserted, and an ordinal outside the manifest is fatal.
- An independent rustc/LLVM condition-coverage build agrees condition by
  condition with Supercov's true/false observations across all 96 overlapping
  generated decisions. A separate real `#![no_std]` library has the same
  oracle comparison and links only foreign probe declarations until the final
  executable supplies Supercov's shared runtime. LLVM remains development-only.
- Identical source under editions 2015, 2018, 2021 and 2024, with appropriate
  declared Rust-version floors, produces one byte-identical authored
  denominator after removing only the crate label and publishes the same exact
  short-circuit vectors. This is not yet a bare-target or multi-platform claim.
- The rustc-driver compile-fail presentation gap is closed rather than
  normalized away. The companion reproduces stock rustc's trimmed diagnostic
  setting, and all internal identity rendering explicitly requests untrimmed
  paths. Compile-fail stderr now differs only in fixture/output paths before
  comparison; rejected compilations still publish no partial evidence.
- The focused semantic/oracle gate and a clean complete
  rustc/Cargo/rustdoc/CTFE/nextest corpus pass locally, including production
  orchestration, multi-package libtests and doctests. The full workspace then
  passes 19 CLI, 19 contract and 280 engine tests, warnings-denied Clippy,
  formatting, script syntax and diff safety. R1–R4, supported-platform,
  runner/lifecycle, performance and public-readiness gates remain open. No
  hosted workflow ran.

## Checkpoint — 2026-08-28 nested authored opaque Boolean macros

- An unowned Boolean macro expansion with an exact owned callsite is one
  authored opaque condition even when nested in a larger decision. Owned
  declarative macro definitions remain expanded into their authored source
  obligations; the rule does not collapse project code.
- Structural markers bind the opaque call's unique terminal typed-Boolean
  result and every ordinary sibling independently. Rebinding after match
  instrumentation follows only straight-line MIR or exact Supercov-owned
  branch-runtime calls, never an arbitrary user call or branch.
- Exact runtime goldens cover one and two `matches!` calls as left and right
  operands in nested `&&`/`||` trees and inside a match guard. The denominator
  contains the macro invocation once, excludes implementation comparisons,
  retains authored siblings, publishes every expected ternary vector and
  derives all logical-selection alternatives without duplicate hits.
- The focused gate and a fresh complete rustc/Cargo/rustdoc/CTFE/nextest
  corpus pass locally, followed by 19 CLI, 19 contract and 280 engine tests,
  warnings-denied Clippy, formatting, script syntax and diff safety. R1–R4
  remain open. No hosted workflow ran.

## Checkpoint — 2026-08-28 independent function and statement oracle

- The generated differential corpus now includes three non-inlined functions:
  one executes both branches, one only its true branch and one is never called.
  Supercov freezes each function entry and five selected authored statements,
  including the intentionally uncovered path and function.
- A separately instrumented rustc/LLVM build supplies the independent oracle.
  Its function execution count and every code region contained by those 15
  statement ranges agree exactly with Supercov's observed/unobserved state.
  The same build continues to compare 96 generated MC/DC decisions condition
  by condition.
- The focused property/oracle gate and a fresh complete
  rustc/Cargo/rustdoc/CTFE/nextest corpus pass locally. The workspace then
  passes 19 CLI, 19 contract and 280 engine tests, warnings-denied Clippy,
  formatting, script syntax, package preflight and diff safety. R1–R4 remain
  open. No hosted workflow ran.

## Checkpoint — 2026-08-28 product-oracle dependency audit

- Independent coverage implementations are guarded as development oracles by
  an executable package preflight. It scans every shipped executable shim and
  normal CLI/engine Rust source and rejects external coverage executables or
  compiler-native coverage injection.
- The coverage.py importer is compile-inaccessible to ordinary product builds:
  it is exported only for tests or the explicit, non-default
  `oracle-harnesses` feature. The audit freezes that boundary and its empty
  default feature set.
- The preflight is green locally and part of the complete workspace gate. A
  supported-platform oracle matrix remains required before promotion; no
  platform or public-readiness claim is made.

## Checkpoint — 2026-08-28 repeated derive isolation and source ordering

- Two derive invocations now generate identical impl bodies at distinct
  authored callsites. The executed impl observes every function/statement point
  and both decision outcomes; the uncalled impl remains a complete uncovered
  denominator. Their point and decision identities are disjoint, proving that
  collapsed output cannot borrow coverage from a sibling invocation.
- The new source perturbation exposed logical-selection serialization by hashed
  branch ID. That was semantically unstable: unrelated obligations could change
  relation order. The compiler now serializes by exact right-condition index,
  and the strict parser requires increasing source order. A negative manifest
  uses reverse-sorted IDs to freeze that invariant.
- The focused compiler gate, strict parser test and a fresh complete
  rustc/Cargo/rustdoc/CTFE/nextest corpus pass locally. The workspace then
  passes 19 CLI, 19 contract and 280 engine tests, warnings-denied Clippy,
  formatting, script syntax, package preflight and diff safety. R1–R4 remain
  open; no hosted workflow ran.

## Checkpoint — 2026-08-28 generated-source identity and crash safety

- Every measured rustc source snapshot is now retained semantically through a
  domain-separated SHA-256 fingerprint over its stable key, display path and
  complete bytes. Compiler-owned archive scope carries exact source/generated
  counts, and strict analysis rejects malformed or extended fingerprint
  envelopes before a run can publish.
- Two clean target roots produce identical candidates and fingerprints. A
  build-script variant changes only a trailing generated comment outside every
  obligation: its denominator remains byte-identical while its full-source
  fingerprint must change. The same invariant holds when Cargo reuses the
  baseline target and reruns the build script through a declared environment
  dependency.
- Two workspace packages that emit byte-identical `generated.rs` functions
  retain distinct package-relative source keys, obligation IDs and source
  fingerprints. Physical ownership canonicalizes package/root directories, so
  macOS `/var` and `/private/var` aliases agree without entering persisted
  relocatable identities.
- The real transactional runner executes each package's generated function on
  both paths despite colliding test names. Stored evidence covers points,
  branches and MC/DC under two healthy transports and two exact
  package-qualified test IDs, while source remains byte-identical and terminal
  work is removed.
- Owned generated source must be a regular file whose canonical path remains
  under Cargo's exact target root. A symlink to external bytes is excluded and
  emits explicit unresolved function/statement/decision limitations, keeping
  measurement incomplete without changing the user's build result.
- A deterministic root-crate abort between manifest and source-snapshot writes
  proves the real product transaction exposes no run, removes terminal work
  state and permits the following clean compiler run.
- The fresh complete rustc/Cargo/rustdoc/CTFE/nextest/property/oracle corpus is
  green, followed by 19 CLI, 19 contract and 282 engine tests,
  warnings-denied Clippy, formatting, script syntax, package preflight and diff
  safety. No hosted workflow ran. This is a bounded R1/R3 integrity checkpoint,
  not Rust promotion; broader generated-source, package/build-script,
  supported-platform and all remaining R1–R4 gates stay open.

## Checkpoint — 2026-08-28 complete compiler-run publication faults

- Evidence archives can be faulted after a partial compressed write. The real
  compiler transaction observes storage exhaustion, removes its unique partial
  archive and exposes neither an archive destination nor a stored run.
- The final store boundary can independently fail after copied evidence,
  `run.json` and the staging directory are durable but before the one rename
  that makes the run visible. Staging is retired and no partial run appears.
- The executable gate publishes a healthy two-package run first, drives both
  failures through real Cargo, rustc instrumentation, runtime transport,
  archive analysis and lifecycle cleanup, then proves the earlier immutable
  run remains byte-identical and queryable after each failure. Project source
  and exact compiler/publication work paths remain clean.
- A following clean transaction publishes both exact package-qualified tests
  with healthy transports. Focused archive/lifecycle unit suites, the real
  fault/recovery gate and a fresh complete rustc/Cargo/rustdoc/CTFE/nextest/
  property/oracle corpus are green locally. The workspace then passes 19 CLI,
  19 contract and 286 engine tests, warnings-denied Clippy, formatting,
  package preflight and diff safety. No hosted workflow ran.
- A separate two-process gate pauses a real compiler transaction after archive
  validation in its durable `Publishing` state. The project lock rejects the
  contender before it creates workspace/publication state. Releasing the
  leader publishes two healthy exact transports, removes the gate/work state,
  preserves source and leaves the earlier run byte-identical and queryable.
- A read-only canonical checkout parent now selects an authenticated temporary
  Cargo workspace without nesting beneath the source/Cargo ancestor chain. A
  strict locator contains no arbitrary filesystem path—only placement, root
  digest and a random token repeated by the cache marker. A complete compiler
  run, exact stored-run query and public `clean` gate prove source preservation,
  evidence health and removal of both external cache and locator.
- A second fresh complete rustc/Cargo/rustdoc/CTFE/nextest/property/oracle
  corpus after the placement change is green, so ordinary sibling reuse and
  every later compiler entry point resolve the authenticated locator
  consistently.
- This closes only the local APFS ENOSPC/final-rename slice of RCV-ARCHIVE-1
  and RCV-LIFECYCLE-1 plus local complete-run lock exclusion and read-only-
  parent fallback. A genuine separate-volume run and supported Linux/Windows
  fault matrices remain open, as do R1–R4 and Rust promotion.

## Checkpoint — 2026-08-28 shared-runtime crash recovery

- Shared-runtime compilation now coordinates through one durable lock inode
  and a kernel-owned exclusive file lock. It no longer depends on deleting a
  PID lockfile, so uncatchable process death cannot strand ownership or force a
  healthy peer through the former 30-second stale-lock timeout.
- Four concurrent exact-rustc builders still converge on one atomically
  renamed archive. Failed compiler launch and OS `ENOSPC` after compilation
  leave no partial archive; the next real builder acquires immediately and
  publishes cleanly.
- A separate test process is killed with real `SIGKILL` while it owns the
  kernel lock. The next builder acquires in under five seconds and publishes a
  valid archive without partial debris.
- This closes the local crash/ENOSPC slice of RCV-RUNTIME-1. Supported-target,
  Linux and Windows filesystem verification remains open, as do R1–R4 and Rust
  promotion. The focused real Cargo/compiler/generated-source gate is green
  with the kernel lock in the production wrapper path. The workspace then
  passes 19 CLI, 19 contract and 289 engine tests, warnings-denied Clippy,
  formatting, script syntax, package preflight and diff safety. No hosted
  workflow ran.

## Checkpoint — 2026-08-28 Rust custom harness, subprocess and async attribution

- Cargo classifies selected `harness = false` targets before execution. A real
  mixed workspace proves one ordinary libtest and one opaque custom harness
  retain distinct runner and query identities; the custom harness runs exactly
  once with its original arguments and no invented internal cases.
- Authenticated child processes inherit exact parent-test attribution. A child
  with its context deliberately cleared remains authenticated background work,
  and a child that outlives the attempt is contained before its delayed probe
  can reach publication.
- Assertion context now survives a real future suspension and executor-thread
  migration. Compiler-private deterministic markers inserted before coroutine
  state transformation force the current and previous contexts into coroutine
  state; the late MIR pass replaces every suspend/resume marker with exact
  runtime context transitions. The marker has no linked implementation, so a
  missed replacement fails closed at link time.
- Suspension restores the prior context, resumption enters the assertion on
  the actual polling thread, and cancellation/drop cleanup retains base-test
  confidence. Non-yielding assertions receive no coroutine-context capture, so
  nested synchronous assertions preserve their existing exact inner/outer
  phase attribution.
- A retained binary-level forensic rerun reproduced and then closed the nested
  synchronous regression found by the broad corpus. The focused custom,
  subprocess and async completion/cancellation gates are green, followed by a
  fresh complete rustc/Cargo/rustdoc/CTFE/nextest/property/oracle corpus.
- The publication-concurrency lifecycle gate now shares the compiler runner's
  300-second cold-build bound and reports captured child output on timeout. It
  remains strict about the actual publication pause, lock exclusion and
  recovery behavior; it does not impose an accidental compile-performance
  threshold.
- The workspace passes 19 CLI, 19 contract and 290 engine tests,
  warnings-denied Clippy, formatting, script syntax, package preflight and diff
  safety. No hosted workflow ran.
- This closes bounded local R2 slices, not R2 or Rust promotion. Supported-
  platform/runtime ecosystem coverage, remaining presentation modes and the
  R3/R4 platform, performance and dogfood gates stay open. Concurrent
  process-per-test execution remains the attribution reference. A later
  stock-presentation differential proved that it cannot be the public ordinary
  libtest architecture because external splitting changes process-global state
  and aggregate output. The final path is an exact-toolchain libtest companion
  that retains stock scheduling/presentation while emitting authenticated
  lifecycle events; its production integration remains an R2 gate.

## Checkpoint — 2026-08-29 gate-verification correction and serde match binding

- CORRECTION: the two checkpoints below claimed fresh corpus passes their
  commits did not have — a shell defect let the session's chain marker print
  green past a failed corpus stage, which had tripped on one stale corpus
  expectation (rustdoc outcome schema v3 vs v4). All other listed gates were
  genuinely green. The expectation is fixed, chains now require the corpus's
  own success summary, and the complete corpus passes at this commit.
- R3 dogfood exposed serde-derive visitors as unbindable by pre-borrow
  synthetic match binding. Now binding exactly: per-arm pattern sources,
  literal-value correspondence for string/byte-string groups (multiway test
  trees erase source order), desugar-match exclusion, scrutinee-ADT edge
  rejection, and a reachability-then-dominance sibling order shared with the
  try/condition/let-else rankings. Remaining fail-closed boundary: try
  operators in parallel match arms need arm-scoped assignment; documented in
  `progress/rust-string-match-binding-2026-08-29.md` as the next R3 item.

## Checkpoint — 2026-08-29 thread-failure gate and Linux glibc proof

- The interposed `pthread_create` failure path is gated deterministically (a
  4 EiB stack demand): create fails, exact context survives, no thread phase
  commits, the start-routine allocation is reclaimed once, and a joined
  recovery thread stays exactly attributed.
- All five focused compiler gates pass on `aarch64-unknown-linux-gnu` in a
  real-toolchain container. Fixes found on the way: the interposer `dlsym`
  declaration used `*const i8` where Linux `c_char` is unsigned (product
  bug); the presentation spike now requires the full rmeta+rlib pair like the
  production builder and links its context stub as a bare object file
  (GNU-ld/ld64 portable). The proof container needs `--init` for zombie
  reaping. macOS stays fully green (20/19/316 plus corpus).
- musl and Windows remain open; no hosted workflow ran.

## Checkpoint — 2026-08-29 join-bounded thread phases

- `rust-probe-transport-v3` gives every inherited native thread a derived
  thread-phase context with an end record, and every test a boundary record
  from both the companion guard and the compiled MIR exit. Partitioning
  attributes thread work to the root test only when the thread ended before
  the test's boundary; anything else — notably lazily created shared pool
  workers — is deterministic background with an explicit
  `RUST_THREAD_OUTLIVED_TEST` limitation through runner units (v6), transport
  health and rustdoc outcomes (schema 4). Companion bundle schema is 3.
- A real two-test shared-pool gate, corpus raw-transport expectation shifts to
  the authenticated thread phase, parser corruption gates and a
  phase-projection collapse for assertions entered on executor threads close
  the pool-contamination soundness hole automatic inheritance had opened.
- 20 CLI, 19 contract and 316 engine tests, clippy/fmt/assets, all five
  focused compiler gates, runtime tests, preflight and the fresh complete
  corpus pass locally. No hosted workflow ran. Thread-creation failure,
  Linux GNU/musl container proof and Windows remain open.

## Checkpoint — 2026-08-28 direct exec-family and fork propagation

- Executable-owned `execve`, `execv` and `execvp` interposers extend the
  posix_spawn child-environment contract to direct exec callers; `execv`/
  `execvp` swap the process-global environment only for the exec attempt and
  restore it on failure. Plain `fork` children inherit the forking thread's
  context and shared transport with no interposition.
- Six new real gates prove exact attribution with no background leakage:
  plain-fork worker, fork+execve with verbatim parent environment, std
  `pre_exec` (fork+execvp fallback), direct `posix_spawnp`, failed launch
  preserving the platform error and exact context, and nested threads.
- All focused gates, the complete corpus and the full workspace suite (20
  CLI, 19 contract, 313 engine, clippy/fmt/runtime/assets/preflight) pass
  locally. No hosted workflow ran.
- Open: pre-existing task pools (task-level propagation or an explicit
  fail-closed boundary), deterministic thread-creation failure, Linux
  GNU/musl container proof, Windows.

## Checkpoint — 2026-08-28 automatic context inheritance and crash-safe companion builder

- Stock libtest keeps the user's exact argv: discovery projects only
  selection-affecting arguments, actual execution receives the original
  arguments unchanged, and `--list`/`--help` remain fail-closed non-execution
  surfaces. Persisted transport units are recombined and repartitioned before
  acceptance; runner-invocation health and per-test partition health are
  separate, and zero-test background evidence publishes without inventing an
  attempt. The companion bundle schema is now version 2.
- Private macOS/Linux interposers propagate context automatically:
  `pthread_create` installs the creator's active test/assertion context in the
  new native thread and restores the child afterward; `posix_spawn`/
  `posix_spawnp` replace an existing `SUPERCOV_RUST_CONTEXT_ID` only in the
  child environment; explicit `env_remove` remains an authenticated opt-out;
  the parent environment is never mutated.
- A thread spawned during assertion-argument evaluation inherits the assertion
  phase itself. The corpus proves the child-thread observation under the exact
  authenticated assertion phase of its spawning test — never background zero,
  never the bare base test context — concurrently and supervisor-isolated. Two
  stale corpus expectations that froze the old contextless behavior were
  corrected after a focused raw-transport reproduction proved exactly one
  authenticated phase record with no duplication or leakage.
- The exact-libtest companion builder is crash-safe in the engine: strictly
  authenticated patched-tree reuse, persistent kernel locks with automatic
  release and a five-minute bound, the locked open-file description duplicated
  into the rustc child before exec, builder-owned-only stale cleanup, RAII
  partials, fsync-before-publication and byte-identical final artifacts. A
  real-toolchain lifecycle spike proves two simultaneous builders converge and
  SIGKILL recovery publishes one authenticated companion without debris; the
  five focused compiler gates are wired as `test:rust-compiler-spikes`.
- The focused gates and a fresh complete corpus pass locally, followed by 20
  CLI, 19 contract and 313 engine tests, warnings-denied Clippy, formatting,
  runtime/packaged-asset tests and package preflight. No hosted workflow ran.
- Direct `fork`/`execve`, custom `pre_exec`, pre-existing task pools, Linux
  GNU/musl interposer ABI proof, thread-creation/child-launch failure gates
  and Windows process/lock-handle inheritance remain open. This closes bounded
  local R2 slices, not R2 or Rust promotion.

## Checkpoint — 2026-08-27 public JavaScript field hardening

- Essential SEO agent dogfood produced a consolidated B1–B9/D1–D7 field
  report. `progress/javascript-field-hardening-2026-08-27.md` now binds every
  in-scope finding to an implementation and executable proof; separately
  labelled Shopify harness and application bugs remain outside Supercov.
- The public frontend preserves class/callback identity while retaining
  provider-neutral opaque launch interception, excludes invariant control and
  ambient TypeScript from executable denominators, persists carrierless
  loopback work as background evidence and fails closed on transport loss.
- Expected failures and every outcome/kind/runner projection are exact.
  Reviewed exceptions now support every measured obligation kind as a loud,
  separately labelled policy layer. Branch-parent line queries reconstruct
  status, source, tests and missing alternatives from alternative evidence.
- Agent contact surfaces now explain full-command isolated execution, ship the
  guides, retain filters in drill-down commands, expose per-kind and E2E gap
  context and name the retained output workspace. The owned JavaScript
  workspace is non-dotted and adopted only through one exact marker predicate.
- Warnings-denied formatting/Clippy plus 19 CLI, 19 contract and 277 engine
  tests are green locally, followed by the runtime, public runner/build,
  opaque-launcher, four-browser syntax and macOS crash/isolation matrices.
  Test262 preserved all 65,051 baseline-passing scenarios across 41,593 files
  with zero semantic differences. Combined Essential SEO dogfood passed 436
  unit and 80 E2E tests with complete measurement. The release transformer
  measured 25.66ms median for 500 files. Hosted CI was not used.
- B9 is closed as well: strict merge rejection now names the exact incompatible
  fingerprint domains instead of listing every possibility.
- This closes the field-correctness checkpoint. The independent R3 1.10x
  promotion gate remains open: the first fair warm/warm end-to-end comparison
  measured 110.45s plain versus 124.06s instrumented (1.123x), including about
  0.76s of Supercov setup/publication outside the test command.
- This is a public-frontend correctness checkpoint, not a change to the
  current Rust-language R0–R4 critical path. Future language frontends inherit
  these shared attribution, lifecycle and agent-query invariants.

## Non-goals and guardrails

- No accidental behavior change during ports; every future language frontend
  remains private until its independent semantic and oracle gates pass.
  "Faster but unexplained" is a failure. A proven correction to historical
  behavior requires its own regression test and any needed versioned contract
  migration.
- Windows becomes a CI matrix member before any binary GA — no shipping
  binaries for platforms the suite has never run on.
- Contracts (schemas, CLI, envelopes, process supervision) change only by
  versioned, deliberate revision — never as a rewrite side effect.
- Passing parity authorizes deletion, not indefinite coexistence. A Rust
  implementation is not complete while equivalent production engine logic is
  still shipped in TypeScript. Only unavoidable Node/browser runtime and
  runner hooks survive the cutover.
- Agent-facing UX, grouped queries and verification workflows use the same
  Rust engine as ordinary coverage runs; no shadow analyzer is permitted.
