# Supercov current execution plan — 2026-08-26

This is the current sequenced execution plan. The architectural end state,
invariants and no-shortcuts policy remain defined by
`progress/engine-master-plan-2026-08-24.md`. This document replaces that
plan's now-obsolete migration ordering with the repository's actual state and
one falsifiable critical path.

## Corrected baseline

As of npm `supercov@0.0.16` and commit `911bbee`:

- the production engine, CLI, instrumenter, analyzer, storage, lifecycle and
  query implementation are Rust;
- the TypeScript/Babel engine, selector and fallback have been removed;
- the remaining JavaScript is unavoidable generated runtime/test-runner glue
  executed inside Node, browsers, Playwright and Vitest;
- JavaScript/TypeScript is the only public coverage frontend;
- owned Rust coverage automatically detects `cargo test` and runs end to end,
  but is private and explicitly measurement-incomplete;
- owned Python has a private denominator/evidence candidate but no owned probe
  injection and is not on the current critical path;
- npm native distribution is live for six macOS/Linux targets; Windows and
  other registries remain gated future work.

The old objective's JavaScript rewrite and atomic-cutover clauses are complete.
They remain regression invariants, not future tasks.

## Current objective

Make Supercov's owned Rust-language coverage frontend independently correct,
zero-configuration, exactly attributable, crash-safe and public-ready on the
single Rust engine, while preserving the verified JavaScript/TypeScript
frontend. Prove the Rust frontend with versioned contracts, independent
rustc/LLVM development oracles, semantic differential/property corpora and
Supercov-on-Supercov dogfood. Do not claim Rust support while any denominator,
semantic, attribution, lifecycle, platform or performance release gate is
unproven; fail closed and report limitations instead of publishing partial
confidence.

Python and later languages resume only after this milestone proves that the
shared frontend protocol works for a second, compiled language without a
language-specific analyzer.

## Governing invariants

1. Every user run is measured by Supercov-owned instrumentation. rustc/LLVM
   coverage is a development oracle only and is never a product dependency or
   fallback.
2. The user's checkout and ordinary build artifacts are never modified.
   Generated state stays transactionally under `.supercov` and is recoverable
   after interruption, ENOSPC and process death.
3. The shared evidence, analysis, MC/DC, attribution, storage, query,
   minimization and lifecycle implementation remains language-neutral Rust.
4. Unsupported or unmeasured behavior is explicit and blocks a
   measurement-complete claim. No denominator may silently omit code.
5. Original and instrumented programs must preserve values, errors/panics,
   stdout/stderr, drop order, side effects, scheduling-relevant behavior,
   borrowing and compilation results.
6. Exact test/worker/retry/phase identity is required. Evidence from failed,
   flaky, skipped, background and terminally passing attempts must remain
   distinguishable.
7. Existing commands remain the only user configuration:
   `npx supercov -- <working test command>` must detect and instrument the
   selected language automatically.
8. Correctness and architecture precede micro-optimization, but public Rust
   support still requires a fair warm/warm and cold/cold overhead of at most
   1.10x.
9. Full hosted matrices and corpus sweeps are manual release gates. Ordinary
   work is validated locally to conserve GitHub Actions minutes.

## Critical path

### R0 — Freeze the second-language contracts

Turn the private evidence-v3 and Rust coverage-model candidates into reviewed,
versioned specifications before expanding implementation.

Work:

- define exact Rust statement, function, branch and masking-MC/DC obligations,
  source locations, stable identities and reachability semantics;
- define language/frontend/model identity in evidence v3 and make it the sole
  archive format; this pre-1.0 repository has no legacy v2 reader or writer;
- specify limitation severity and when `measurement: complete` is legal;
- freeze runner/test/outcome/assertion/action identity and archive/query JSON;
- add malformed, truncated, mixed-language and unknown-version rejection
  vectors;
- produce a requirement-to-test traceability table so every public claim maps
  to an executable gate.

Exit gate: no implementation-defined semantics remain in the public Rust
coverage model or evidence envelope, and all frozen contract fixtures pass
through the shared analyzer.

Checkpoint (2026-08-26): the evidence-v3 envelope, coverage-model-v1
declaration and target Rust source model are frozen. V3 is the sole archive;
frontend/model language mismatch, unknown declaration fields, malformed or
partial recognized JSONL, missing identities and incompatible merged models
fail closed. JavaScript/TypeScript now publishes v3 and passed the complete
node:test, Vitest, Playwright, build-adapter, merge, agent-query, watchdog and
isolation matrices. The Playwright migration exposed and fixed a real scoped-
record merge bug: server evidence now attaches only to the exact full
execution scope rather than the first equal test/retry status record. Timeout
runs publish a command-level setup outcome without inventing test coverage.
`contracts/rust-coverage-v1/traceability.md` records every still-open Rust
implementation/promotion gate; those open rows keep Rust private.

R0 exit gate: **green locally on 2026-08-26**. `npm run check`, the full
fixture/browser/build/merge/isolation/watchdog matrix, the frozen engine
contract and the bounded agent-query evaluation all passed. Hosted workflows
remain manual-only and were intentionally not invoked.

### R1 — Complete the Rust denominator and semantics-preserving probes

The current concrete-syntax frontend covers an initial subset and explicitly
reports macro and const limitations. Complete every normal Rust source surface
before optimizing it.

Work:

- statements; functions, methods, closures and async bodies;
- `if`/`if let`, `while`/`while let`, `for`, `loop`, `match` arms and guards;
- `&&`/`||` atomic conditions and masking MC/DC;
- `?`, `let else`, destructuring/refutable patterns and early exits;
- assertions and panic paths without changing evaluation or formatting;
- generics/monomorphizations, traits/default methods and nested modules;
- generated/build-script sources and include/module ownership;
- macro expansion, proc-macro/derive output, const/const-fn evaluation,
  doctest source mapping and no_std/target constraints.

The source-transform backend cannot honestly cover every expansion surface by
itself. Run a time-boxed compiler-expansion spike first. Choose and document a
maintainable owned backend—potentially a stable source path plus automatically
selected rustc-versioned compiler components—rather than hiding expansion
gaps. If exact support is not yet possible, Rust remains private.

Checkpoint (2026-08-26): the compiler-backend spike selected an owned,
rustc-commit- and host-matched compiler companion as the public architecture.
An exact Rust 1.95.0 `rustc_driver` wrapper observed authored, declarative-
macro, procedural-macro and build-script-generated HIR/MIR, and an
`optimized_mir` provider replacement changed the emitted fixture behavior.
The same experiment proved that const/CTFE bodies need a separate provider
path and that Cargo's ordinary `RUSTC_WRAPPER` does not observe rustdoc's
extracted doctest crate. Those are release blockers, not exclusions. The
frozen `rust-compiler-companion-v1` envelope now requires exact compiler-driver
identity, rejects unknown or nearby companions, and cannot claim public
readiness until expanded provenance, runtime probes, generated sources, CTFE,
doctests and exact test attribution are all present. The concrete-source Rust
transformer remains only a private differential reference and will not be the
public injection authority.

The next spike increment removed the fixture-defined runtime: the companion
now appends a synthetic private runtime module to the in-memory crate AST and
inserts real side-effecting calls into optimized MIR. The temporary bitmask has
also been removed. The companion injects the same std-only mmap runtime used
by the engine, and both a normal binary and an actual test process publish all
four expected MIR ordinals through an authenticated supervisor-created file.
The checkout hash stayed exact, and ordinary-versus-instrumented behavior
preserved values, `Result` errors, caught panic status, drop ordering, stdout
and stderr.

`rust-probe-transport-v1` now freezes the 128-byte header, 40-byte descriptors,
record kinds, per-record process/context identity, bounded payload, 128-bit
task binding, release/acquire publication, 64-bit metadata/payload checksum and
fail-closed health rules. Executable tests cover eight concurrent threads,
eight concurrent processes, descriptor and payload exhaustion, wrong token,
malformed context, corrupt/truncated headers and descriptors, symlink refusal,
an uncommitted reservation and process kill after a committed observation.
This closes the wire/crash slice, not R1/R2: exact dynamic context propagation,
the complete Rust denominator, CTFE/doctest publication, no_std and the target
matrix remain release blockers.

The next attribution slice is also executable in the companion spike. The
target runtime now supports nesting-safe thread-local context entry/restoration.
The companion derives test identities from rustc's post-expansion
`rustc_test_marker` records, so it covers ordinary tests and tests generated by
procedural attribute macros without repository or framework names. It injects
entry plus normal/unwind restoration in optimized MIR. Five concurrent tests,
including an expected panic, retain distinct deterministic context IDs; helper
scopes restore both after return and propagated panic. A child thread produces
context zero rather than inheriting by timing or global state. Public R2 still
requires owned child/async/subprocess propagation or an automatic switch to the
existing exact process-per-test path whenever that explicit gap appears.

The compiler now also emits the first strict manifest candidate under the
frozen Rust source-identity-v1 rules. Function-entry obligations use
project-relative original byte ranges for authored, included and declarative-
macro tokens; two expansions of the same declarative macro body aggregate to
one obligation. Proc-macro output that collapses to its invocation is instead
bound to the stable callsite, complete expansion chain and textual compiler
owner path, so repeated invocations remain distinct. Owned `OUT_DIR` source is
keyed by project-relative package root and out-relative path. Two entirely
clean Cargo target directories produced byte-identical candidates, with no
target hash or absolute scratch path. IDs are SHA-256-derived and any in-run
digest collision is fatal.

The next structural increment now walks expanded HIR rather than concrete
source. It adds executable statement points; `if`, `if let` and let-chain
decisions; source-ordered `&&`/`||` atomic conditions; and true/false branch
alternatives. Those identities aggregate repeated declarative expansion
tokens, distinguish repeated proc-macro invocations with an owner-local
ordinal, and stay byte-identical across clean targets. Synthetic condition
display comes from rustc's expanded HIR instead of falsely printing the macro
invocation as the condition. The exploratory 0/1/2/3 function ordinals are
gone: runtime MIR hits now carry the u64 prefix of the exact manifest point ID,
and the compiler rejects both full-ID and probe-prefix collisions. A later
audit removed the remaining fixture-name shortcut: every source-backed
function and statement point is now injected. rustc code mappings and exact
MIR-span fallback locate statement entry; sequential statements coalesced into
one optimized block become an authored-order probe chain. A focused one-sided
branch proves its untaken statement remains uncovered while the taken and
following statements are observed. Dummy-span compiler harness functions keep
an explicit source limitation rather than receiving invented identity. The
candidate still carries blocking denominator limitations. The authored match
   slices below have since narrowed that surface. The six stable assertion
   macros now have exact passed/failed and MC/DC observations, including
   collapsed proc-macro output and panic/evaluation-order goldens. Exact nested
   assertion phase contexts now cover argument evaluation and restore on normal
   and unwind exits. `rust-probe-transport-v2` now publishes authenticated
   child-to-parent assertion phase definitions. A transport-global invocation
   nonce distinguishes repeated executions of the same assertion site and is
   collision-safe across concurrent processes; malformed derivations, missing
   parents, cycles and cross-attempt chains fail closed. The real compiler
   corpus corrected one false premise before freezing: a valid phase definition
   may have no committed observation when evaluation panics or touches only
   uninstrumented data. The shared engine now projects those verified dynamic
   contexts into distinct evidence-v3 assertion phases with source, causal
   parent and committed passed/failed status; missing verdicts remain unknown
   rather than inferred. Compiler-supervisor integration of that projection,
   CTFE and doctest obligation/probe mappings, plus full package and compiler
   fingerprints, remain R1 work. No measurement-complete claim is possible
   yet.

The production engine now also owns strict ingestion of the compiler manifest
candidate. Unknown fields/schema/model, premature completeness, malformed or
noncanonical source identities, duplicate IDs or probe ordinals, unsupported
obligation kinds, dangling/cyclic match ownership and mismatched match-arm
ordinals fail before evidence can be analyzed. The companion must still be
moved out of the development spike and connected to this boundary. The real
clean-build companion manifest now passes this production parser on every
spike run. That integration caught and specified three shapes a synthetic unit
fixture had missed: `authored-expansion` provenance, distinct
`branch-alternative` IDs, and nested matches owned by a parent scrutinee without
an arm index.

The same real clean-build candidate is now normalized by the production Rust
engine into the shared language-neutral `CoverageManifest`. The conversion
requires an explicit source-key-to-byte-snapshot map, rejects missing sources,
out-of-range offsets and non-UTF-8 boundaries, and derives line, column and
source text without resolving compiler keys through filesystem guesses. It
also produces a collision-checked ordinal resolver. Match-arm selection is
expanded offline into the selected arm plus every evaluated sibling's
`not selected` alternative, preserving the compiler frontend's group semantics
without reconstructing interleaved event timing. The rustc spike exercises
this normalization against authored, expanded and build-generated sources on
every run.
The source namespace is now closed as well: only normalized project-relative
`source:` keys and `generated:package:<package>:<out-relative>` keys are
accepted. Absolute paths, backslashes, empty components and traversal are
fatal, and the source snapshot map must equal the denominator's complete key
set—missing and extra snapshots are both rejected.

Authenticated `rust-probe-transport-v2` records now pass through a production
Rust evidence projector. It validates every string probe, ordinal and decision
vector against the normalized denominator; expands compiler selection
semantics; assigns test and dynamic assertion phase IDs explicitly; and keeps
context-zero observations in a separate background snapshot so they cannot
silently become passed-test coverage. Dropped and incomplete records remain
visible transport health rather than being discarded. The real isolated
libtest/compiler probe run now traverses the production transport reader,
manifest normalizer and evidence-v3 projection and proves a passed assertion's
causal phase and exact test context.
The shared Rust engine now owns the frozen libtest-context derivation too. Its
domain-separated FNV-1a input, reserved-value remap and fatal collision policy
are part of `rust-source-v1`; supervisor preflight rejects duplicate names and
any 64-bit collision before a process is launched. The compiler corpus's exact
known context remains a cross-implementation golden. The existing exact
process-per-libtest supervisor now performs this preflight per artifact and
places the resulting context in the authenticated runtime environment before
launch, which gives child threads the attempt identity without relying on
thread timing or global mutable attribution.

Exact compiler selection is now executable outside the spike as well. At
build time the companion records the rustc commit, release, host and SHA-256
of the exact `librustc_driver` it linked against. At selection time the engine
independently resolves the requested rustc, hashes its driver, hashes the
candidate executable, runs the candidate's strict handshake under that
toolchain's dynamic-library environment, and accepts exactly one
commit/host/driver/build match. Missing, duplicate, malformed, self-hash-
mismatched and merely nearby companions fail closed. The current private
candidate deliberately advertises CTFE and rustdoc/doctest publication as
false, so the same selector rejects it when public capabilities are required.
This closes identity negotiation only; production Cargo orchestration and the
remaining capability gates still block cutover.

Production Cargo orchestration and the first complete runtime path are now
executable too. Cargo supplies its actual rustc path to Supercov through
`RUSTC_WORKSPACE_WRAPPER`; the engine selects and re-verifies the exact
commit/host/driver/binary-matched companion for every compiler invocation.
All generated state lives under the run's `.supercov/work` directory with a
fresh private Cargo target. The companion writes strict paired manifest and
source-snapshot sidecars from rustc's own `SourceMap`; the engine rejects
missing, extra, duplicate and identity-changing units, then merges repeated
workspace compilation units into one normalized denominator. A full fixture
build exposed and fixed a real generated-test-harness collision: structural
markers are now keyed by `LocalDefId`, not textual owner names such as
`main`.

The same path now enumerates real libtest artifacts and executes one process
per selected test candidate with an OS-random 128-bit token, one bounded mmap
transport and one preflighted deterministic context. Every observation is
validated against the frozen denominator and projected into evidence v3;
supported assertion macros retain exact nested phase causality, while context
zero becomes a separate background result and cannot upgrade the test.
Malformed, unauthenticated, unknown or capacity-dropped evidence fails closed.
Interrupted reservations remain explicit attempt health: they can represent a
caught panic that correctly produced no decision outcome, so they are not
silently relabeled as transport loss. Ignored tests may legitimately attach no
runtime because their bodies did not execute. The production-shaped fixture
passes through the shared frontend validator and analyzer with nonzero line
and branch coverage and zero dropped records.

This closes the initial Cargo -> companion -> libtest -> evidence-v3 ->
analyzer path, not R1/R2. The compiler run now also uses the production
isolated-workspace and atomic archive/store lifecycle, and its published run is
queryable through the normal CLI. That roundtrip forced query-index schema v2
to replace the JavaScript-only scope assumption with typed source-discovery
and compiler-owned language/model scopes. The internal run still needs exact
capture of Cargo/libtest filter and retry semantics, build-phase evidence, the
full lifecycle crash/ENOSPC/concurrency matrix, CTFE publication and doctest
execution. The private companion continues to advertise CTFE and doctest
capabilities as false, so public selection still fails by construction.

The first real-probe doctest attempt was deliberately rejected. It exposed and
fixed an unstable-feature capability leak by adding rustc's empty
`-Zallow-features=` restriction, but the instrumented run still regrouped one
standalone plus two merged doctests into one three-test runner and therefore
changed visible command output. Passing verdicts are insufficient: doctest
probe publication stays blocked until execution grouping and output are also
equivalent.

The first dynamic decision slice is now executable as well. The companion
uses rustc's exact source-to-optimized-MIR branch regions to locate each
authored condition edge, translates those edges into Supercov-owned
token-bearing frames, and emits frozen string decision IDs plus ternary values
through `rust-probe-transport-v1`. Exact goldens cover `&&`, `||`, mixed
`(a || b) && c`, nested `if` bodies, an outer `&&` whose second condition is a
value-producing inner `if`, `if let` and a three-atom let chain, including every
exercised short-circuit vector and parallel libtest attribution. The outer
frame remains open while the inner decision completes without the vectors
merging. Baseline and instrumented behavior remain exact.
The work also removed hidden control flow from external macro implementations
such as `assert!` and `println!` from the caller's authored denominator.
Generated owners use a fail-closed expanded-span fallback that accepts only
one compiler-typed boolean MIR branch for the exact condition. Declarative
macro expansions sharing an authored identity, distinct proc-macro
invocations and build-script generated source now all emit gated exact
decision vectors.

Decision frames reserve their bounded mmap descriptor at evaluation start and
commit only at the final outcome. A compiler-level condition panic and a
killed process now leave explicit incomplete health without publishing a false
complete vector.

The native-profile blocker is now closed rather than hidden. The exact-version
companion adds rustc's internal `no-profiler-runtime` switch, removes the native
MIR coverage statements and maps before codegen, and gates both the absence of
`.profraw` output and LLVM profile/coverage symbols in the linked executable.
Rustc's branch correspondence is used only during compilation; every published
observation remains Supercov-owned. A broader nested/derive/external expansion
corpus and the rest of the R1 denominator are still required. Rust remains
private and measurement-incomplete.

Compound `while` and nested-pattern `while let` conditions now use the same
exact ternary decision model. Pattern conditions are not assumed to be one MIR
switch: the companion finds the condition subgraph's common dominator and
instruments every dominated edge into its terminal true/false blocks. For the
separate zero-iterations/entered obligation, it climbs to the actual natural
loop header, starts one first-commit frame only on the external entry, and
redirects backedges past that start. The executable fixture proves two zero
and one entered compound-`while` invocation, three zero and one entered
`while let` invocation, exact short-circuit vectors, multiple iterations and
no per-iteration relabeling or duplicate loop observation.

Authored `for` loops now use the frozen `loop-entry` branch kind without
inventing a Boolean decision. The companion overrides rustc's documented
post-borrow-check/pre-optimization MIR boundary, binds the exact
`Iterator::next` `Option::None`/`Some` switch while it is still structural, and
inserts the same crash-visible first-commit frame before ordinary optimization.
This survives optimizer-specific iterator lowering without importing native
coverage. The corpus proves empty and multi-iteration loops, two loops in one
function, nested loops, a body with no backedge, and a panic from `next()`.
Nested switches bind to the smallest enclosing authored loop. The panic leaves
an incomplete frame and no false alternative. Compiler-generated for/while
scaffolding is no longer counted as authored statement coverage, and candidate
branch/decision kinds are gated against the frozen contract enums.

Reachable authored `match` arms and match guards now have a first exact
compiler-backed slice. The candidate manifest persists one stable selection
group relating every frozen `match-arm` branch and both of its alternatives.
At runtime, one crash-visible frame begins after the scrutinee has evaluated
and commits only when an arm is actually selected; the language-neutral
frontend can derive that arm's selected alternative and every sibling's
not-selected alternative from the single raw ordinal. Exact goldens cover a
two-condition guard and all of its ternary vectors, guard rejection, nested
matches, identical and empty bodies, a local declarative-macro match and an
irrefutable one-arm match that correctly creates no branch. A panicking guard
leaves an incomplete selection frame and no fabricated alternative, while
baseline/instrumented values and output remain identical. Synthetic
proc-macro match tokens exposed a real boundary: their arm spans collapse to
one invocation location. The companion now inserts semantics-neutral private
arm markers in built MIR, maps them through rustc's real/imaginary match edges,
requires each marker to survive borrow checking exactly once, removes them,
   and only then installs runtime hits. Unguarded and compound-guard proc-macro
   matches retain exact arm identities without pre-analysis runtime calls.
   Separately, built-MIR reachability excludes a statically unreachable authored
   arm while retaining and measuring both reachable siblings. The marker bridge
   now also freezes each synthetic group's HIR parent, nesting site and arm,
   solves one parent-consistent CFG assignment, and fails compilation when that
   assignment is absent or ambiguous. Proc-macro matches nested in an arm body,
   a scrutinee and a guard retain independent exact selections. Separate
   condition markers select only Boolean switches that change the guard's
   accepting/rejecting reachability, so nested control flow is excluded while
   the synthetic two-condition guard emits the exact three ternary vectors.

`let else` is now exact as a branch rather than being mislabeled as an MC/DC
decision. Expanded HIR freezes one `matched` and one `else` alternative at the
refutable pattern. For authored source, rustc's exact branch region binds those
alternatives to the optimized MIR targets before native coverage metadata is
removed. Collapsed proc-macro source has no such retained region, so the built-
MIR bridge marks the final real/imaginary pattern edge, requires both markers
to survive borrow checking exactly once, removes them, and installs the same
first-commit runtime frame. Simple and nested patterns, two sequential authored
statements, and two sequential synthetic statements sharing one collapsed
callsite all preserve baseline behavior and exact per-invocation counts.

The `?` operator now has an independently owned compiler-backed branch path as
well. Expanded HIR freezes `continued` and `early return` alternatives, while
built MIR identifies the actual `Try::branch` call and its typed
`ControlFlow::Continue`/`Break` switch. Private endpoint markers survive borrow
checking exactly once, are rebound after enclosing structural edits, and are
removed before the first-commit runtime frame is installed. The frame begins
only after operand evaluation and `Try::branch` return, so a panicking operand
records neither alternative and does not create a false incomplete frame.
Exact behavior/evidence goldens cover `Result`, `Option`, sequential operators,
nested `value??`, and sequential/nested proc-macro operators whose source spans
all collapse to one invocation.

The CTFE provider spike is now executable rather than hypothetical. The
companion overrides `mir_for_ctfe`, inserts execution markers in original
blocks, splits multi-successor edges for independently identifiable edge
markers, and observes only those markers through a private in-process rustc
interpreter subscriber. Both true and false const-fn paths were observed while
const values and complete stdout/stderr stayed byte-identical to the ordinary
build. The one-function/16-bit marker proof has now been generalized to every
local CTFE body: marker identity is a domain-separated hash of crate,
definition, block-or-edge kind and local ordinal; collisions are fatal and
events retain the exact definition. The companion now also inserts explicit
entry and return markers and records the observing compiler thread. The corpus
reconstructs a per-thread nested invocation stack, requires balanced frames
after a successful compilation, and proves that the two `const_decision`
evaluations are separate frames with opposite edge paths. This replaces the
unsound idea of assigning flat adjacent events to a definition; missing return
markers after a panic or compiler crash can instead remain explicitly
incomplete. Edge identity is carried by each event, so concurrent evaluation
does not require guessing from adjacent log records.
Rust still remains private. The proof now covers distinct direct-const,
static, const-fn, const-generic-fn, generic-associated-const, anonymous
array-length and inline-const owners. It does not yet cover every CTFE branch
kind, failure mode, target, `RUSTC_LOG` coexistence or acceptable performance.

The first mapped CTFE evidence slice is now carried through the real run
boundary. Each successful compiler unit publishes one strict
`supercov-rust-ctfe-unit-v1` bundle containing its mappings and observations.
The bundle is written and synced under a recognizable partial name, exposed by
one same-filesystem rename, and followed by a directory sync; marker and hit
ordinals are lossless decimal strings rather than unsafe JSON numbers. There is
no reader for the old map/event pair. Strict Rust ingestion rejects those old
files plus partial, non-regular, truncated, unknown-field and malformed unit
files, and requires exact crate/definition/kind/site identity, balanced
per-thread invocation frames, and resolution of every hit ordinal to the
frozen denominator. Function and statement hits are archived as exact `rustc`
setup-phase evidence and survive evidence-v3 analysis plus normal run querying.
CTFE decisions now carry explicit start, condition and finish mappings. Strict
nested reconstruction produces exact masking-MC/DC vectors and commits the
frozen true/false outcome branch alternative. Engine corruption tests reject
semantic markers with unrelated hits, a finish mapped to the wrong alternative,
a condition without a frame and an invocation that exits with an open decision.
The real compiler corpus proves independent `[false] -> false` and
`[true] -> true` const-fn evaluations with unchanged values and output.

That outcome relation is frozen directly into every compiler manifest decision
rather than inferred from overlapping spans. The same relation corrected the
ordinary runtime path: decision outcomes now use an atomic ordinal observation
before the MC/DC frame is committed, while loop-entry alternatives retain their
separate first-commit frame. A crash can therefore leave a truthful outcome hit
plus an explicitly incomplete vector, but never a complete vector whose
outcome branch is missing. The manifest limitation now says *complete* CTFE and
doctest mapping remain; the controlled CTFE slice is real, but the wider const
corpus is still a release blocker and this is not a completeness claim.

The owner matrix exposed a real compiler distinction and closed it without a
source heuristic. rustc retains native branch regions for const functions but
not for direct consts, statics, anonymous consts or associated consts. Those
owner kinds now receive typed Boolean condition markers in built MIR before
borrow checking; the exact-version companion requires each marker to survive
once, reconstructs it from the CTFE MIR, and removes it before evaluation.
Runtime const-function instrumentation remains on its independent native-region
path. Exact corpus vectors now cover direct true/false consts and statics, two
instantiations each of a const-generic function and generic associated const,
an anonymous array-length decision, two independent inline consts, all four
masked paths through `(first || second) && third`, and separate outer/inner
const decisions. The complete CTFE branch-kind and failure corpus remains open.

CTFE now also reconstructs exact `match` and `let else` alternatives through
the same compiler-owned selection bridge used at runtime. A selected match arm
derives every sibling's not-selected alternative offline, and both the matched
and fallback `let else` paths retain their frozen branch identities. Const
`while` decisions carry an explicit manifest relation to their loop-entry
branch rather than relying on overlapping source ranges. Each CTFE invocation
commits only its first loop condition outcome for zero-versus-entered coverage:
an entered loop's later terminating false condition remains an exact MC/DC
vector but cannot fabricate a zero-iteration hit. The real corpus proves zero,
disabled and two-iteration paths with unchanged behavior; strict ingestion
rejects wrong loop alternatives. At this checkpoint CTFE `?`, assertions,
promoted/const-trait surfaces and the complete failure/platform/performance
corpus remained open; the following compatibility slice resolves the first two.

The next CTFE compatibility slice resolves the first two items against the
actual Rust 1.95 language boundary rather than assuming their runtime forms
also exist during const evaluation. Stable Rust rejects `?` in `const fn`
because `Try`/`FromResidual` are not const traits, and rejects
`assert_eq!`/`assert_ne!` in `const fn` because `assert_failed` is non-const.
Checked-in compile-fail programs require the exact baseline error count, codes,
spans and text from the instrumented compiler and require that a rejected
compiler invocation publishes no partial CTFE sidecars. Boolean `assert!` and
`debug_assert!` are valid const surfaces: compound short-circuit and direct-
const corpus cases now publish their exact successful vectors with unchanged
values and output, while a failing `assert!` preserves rustc's E0080 diagnostic
and publishes nothing. The companion now enables rustc's branch metadata
through exact-version internal configuration rather than leaking
`RUSTC_BOOTSTRAP` or unstable flags into user code. CTFE observation is active
during compilation, but atomic sidecar publication is gated on successful
analysis. Promoted/const-trait surfaces, the remaining failure/resource/
concurrency matrix, `RUSTC_LOG` coexistence and performance remain open.

`RUSTC_LOG` coexistence is now closed at the exact-version companion boundary.
The companion reproduces rustc 1.95's logger configuration and formatting but
applies the user's filter only to the ordinary logging layer; an independent
target-and-level filter enables the private CTFE observer without printing
extra interpreter events or suppressing requested logs. A direct compile gate
runs stock rustc and the companion with the same JSON/output-target settings,
requires requested interpreter records from both, and simultaneously requires
nonempty Supercov CTFE sidecars. This gate also exposed and fixed acceptance of
rustc's `--crate-name=value` form in addition to `--crate-name value`.
Promoted/const-trait surfaces and performance remain open at this checkpoint.

The pinned-toolchain promoted/const-trait ambiguity is now resolved. Rust's
constant promotion of borrowed literals and arrays is a compiler storage
choice, not a second authored execution in `rust-source-v1`: the enclosing
runtime functions retain and emit every authored function/statement point,
promotion adds no fictitious source decision or branch, and the CTFE stream
does not double-count those owners. The corpus checks all three facts against
real `promoted_mir`. Rust 1.95 rejects const trait definitions/implementations
on stable; its checked-in compile-fail oracle preserves E0658/E0015 diagnostics
and publishes no compiler evidence. Exact companions for future toolchains
must reclassify this when stable const traits exist. Supported-target and
performance gates remain open.

CTFE publication now has a deterministic resource/crash/concurrency corpus at
the real compiler boundary. An injected ENOSPC after a partial write makes the
compilation fail, removes the partial and publishes no final unit. SIGKILL at a
barrier after file sync but before rename leaves exactly one recognizable
partial and no readable final unit. Four simultaneous rustc processes publish
four distinct complete bundles into one directory with no collision or leftover
partial. These gates close compiler-unit CTFE publication atomicity; they do
not replace the broader run-store crash, ENOSPC and concurrent-run lifecycle
matrix tracked under RCV-ARCHIVE-1.

The rustdoc launch boundary is now proven as well. Cargo's ordinary
`RUSTC_WRAPPER` still does not see synthesized doctest crates, so Supercov uses
a scoped launcher for the exact ordinary rustdoc and adds its compiler
companion as rustdoc's test-builder wrapper. The controlled fixture observes
standalone source, merged bundle source and merged runner source; maps hidden
and visible standalone lines through rustdoc's path/offset metadata; and joins
merged `__doctest_N` owners to the runner's source path, line and test name.
The launcher removes its private unstable-option bootstrap before user code is
compiled, and a stable `compile_fail` feature-gate case proves there is no
capability leak. Baseline/intercepted output (excluding elapsed-time values)
and checkout hashes match.

The first doctest runtime-attribution slice is now executable. It exposed a
general cross-crate flaw in the per-crate injected runtime: a harness could set
TLS context without the called instrumented library seeing it. The corrected
architecture links one Supercov-owned static runtime into the complete test
process graph while each crate receives only private declarations/wrappers.
Standalone synthesized `main` derives a crate/path/line test identity. Rustdoc's
merged runner and separately executed bundle derive the same crate-group plus
`__doctest_N` identity independently, so no process-global environment mutation
or timing join is needed; the runner HIR also maps that key to the exact human
test name. Two doctests calling one instrumented dependency now publish its
authored function-entry probe under two distinct exact test contexts with zero
drops/incomplete records and unchanged output. Unrelated setup evidence remains
background. Public tracing still requires complete extracted-source obligations
and probes, outcome/retry archive joining, custom wrapper composition, failure
and signal forwarding, and the full doctest semantics/crash corpus.

The standalone extracted-source slice now carries real owned obligations too.
For single- and multiline spans, the companion combines rustdoc's original
path/line metadata with bounded unique per-line anchors, requires those anchors
to remain in authored order and emits one exact byte range against the original
documentation source snapshot. Hidden setup, one real multiline statement and
three visible assertion invocations become exactly five authored statement
points; each assertion macro is one source statement while its generated
implementation and rustdoc's synthetic `fn main` remain outside the
denominator. Assertion statement hits enter the authenticated assertion phase
before argument evaluation, so optimized MIR cannot erase the statement and a
panicking argument cannot misattribute it. The real rustdoc gate requires all
five source ordinals under the exact standalone test root with zero dropped or
incomplete records and unchanged output. Missing, ambiguous, reordered,
carriage-return or synthetic mappings fail closed.

The merged extracted-source path now has a strict deferred join as well. The
bundle compiler publishes one temporary `doctest-pending:<group>` source and
cannot pass the ordinary manifest parser. The later generated runner publishes
an atomically renamed, directory-synced map from each numeric `__doctest_N`
module to rustdoc's exact original path, line and display name. Only then does
the engine align the complete extracted `main` body against the runner-bounded
documentation interval, translate exact subranges (including repeated atoms
and repeated lines), rebuild every point, branch, alternative, decision and
match-group identity, and return complete old-to-new ID and string-safe
ordinal maps for already-emitted evidence. Synthetic expansion canonicals are
strictly parsed and rebuilt too: every expansion callsite is mapped through
the same full-body alignment, temporary generated owner definitions become
stable doctest owners, and alternative ordinals are rekeyed without guessing.
The candidate manifest schema was cleanly replaced by v2 because complete
alternative canonicals are now mandatory; there is no v1 reader. The resulting
manifest passes the ordinary production validator and normalizer with no
temporary identity. The real Cargo/rustdoc gate proves an owned proc-macro-
generated local decision plus ordinary statement and assertion evidence under
the exact merged test root without changing output or checkout bytes. Broader
derive/external/nested expansion coverage, outcome/retry archive joining,
wrapper composition and the full failure/signal corpus remain explicit
blockers, so this still does not enable the public rustdoc capability.

The deferred join is now on the production compiler-output boundary rather
than only behind a development command. One generation is parsed as a whole:
ordinary candidates first establish exact immutable source snapshots, every
pending bundle must match exactly one strict runner map, duplicate/unmatched
groups fail, and map-only tests with no executable obligations remain available
for outcome attribution. Only joined final candidates reach workspace
normalization. A transport translator also rekeys string observations and
numeric ordinals and recursively rebuilds nested assertion context IDs, whose
derivation includes the translated decision identity; descriptor order is not
assumed and collisions fail closed.

The exact outcome boundary is now implemented through both pinned Rust 1.95
formats: rustdoc's version-2 `--output-format=doctest` catalog and libtest's
JSON event stream. The strict catalog preserves every compiler-generated name,
file, line, execution attribute, original snippet and generated wrapper for
merged, standalone, compile-fail, ignored, no-run and syntax-error tests. The
event parser validates suite/test ordering and arithmetic, distinguishes
timeout warnings from terminal failures, preserves ignored details and
represents fail-fast tests as completed, started-but-unfinished or unstarted
without inventing verdicts. One framed publication atomically binds both exact
byte streams, the invocation and the companion digest; partial, duplicate,
malformed, truncated and future-incompatible units fail closed. The real
rustdoc gate captures five passed and one ignored doctest, proves all six
catalog identities and verifies standalone/compile-fail attributes.

The engine now joins every catalog entry, including standalone and
compile-fail tests, and augments the merged subset with exact compiler source
and probe translations. Outcomes absent from the catalog and compiler maps
that disagree on name, path, line or flags are rejected. Libtest exposes only
aggregate filtered and fail-fast-unstarted counts; if both are non-zero,
Supercov retains the exact counts and marks affected identities ambiguous
instead of assigning states by catalog order. Cataloged tests project exact
pass/fail/skipped/unknown status, retry zero, source and phase identity into
evidence v3; a test that never started creates no fictitious phase. Exact
runtime transport attachment is now implemented as well. The engine reserves
one authenticated mmap per rustdoc invocation, binds its normalized snapshot
into outcome-unit v3, deletes the terminal transport after atomic publication,
and rejects duplicate reservations, wrong tokens, digest tampering, count
disagreement and evidence owned by an unknown doctest root. The outcome join
partitions committed records into exact catalog tests plus context-zero
background, translates merged identities/ordinals/nested assertion contexts,
projects each partition through the shared evidence-v3 runtime path and proves
that every committed record is accounted for exactly once. Dropped evidence is
fatal; incomplete reservations remain explicit group health. The real Rust
1.95 rustdoc gate publishes five passed and one ignored cataloged tests with
runtime probes and leaves no transport file behind. Stable multi-package
invocation identity, retry
policy and preservation of the user's ordinary human output across
pass/fail/signal cases remain required before these candidates can enter a
measurement-complete public run.

Checkpoint (2026-08-27): the expansion corpus now crosses crate boundaries.
A project-owned path dependency exports one declarative macro used from two
modules. rustc may retain that file only as external source, so the companion
uses rustc's own source loader and metadata hash check to recover the exact
normalized bytes; it never reopens an unverified path itself. The resulting
function, statement, decision and branch obligations aggregate under
`source:external-rules/src/lib.rs`, remain byte-identical across clean target
directories and receive exact false/true runtime vectors. A real derive macro
also emits an impl method whose complete points, decision and alternatives stay
distinct at the authored derive callsite and publish both vectors.

That corpus exposed a separate authored-control boundary. In an ordinary
source match guard, `matches!(...)` is one authored Boolean condition, not the
macro's internal pattern-comparison graph. Expanded HIR now records the exact
invocation as one opaque condition only when the enclosing match itself is
authored. Before borrow checking, the compiler bridge selects the unique typed-
Boolean result switch reachable from every internal comparison, marks it once,
then removes the marker before runtime instrumentation. Proc/declarative-
generated guards continue through their existing expanded structural models.
Missing or non-unique result switches fail closed. The full rustc/Cargo/
rustdoc/nextest corpus, 267 engine tests, 19 contract tests, 17 CLI tests,
warnings-denied clippy and every public JavaScript/TypeScript integration gate
are green locally. The larger cold corpus required its own bounded five-minute
harness allowance; this is not a performance claim and the 1.10x promotion
gate remains open. No hosted workflow ran.

Correctness corpus:

- original-versus-instrumented differential programs checking values, panics,
  output, drops, side effects and ordering;
- property/fuzz generation over nested control flow, patterns, ownership,
  async and error propagation;
- compile-pass and compile-fail cases across supported editions/MSRVs;
- an independent LLVM/rustc structural oracle where models overlap;
- independent MC/DC goldens rather than self-expected vectors;
- real ecosystem crates selected for macros, async, workspaces, generated code
  and unusual build graphs.

Exit gate: every in-scope source construct has a proven obligation/probe model;
every remaining exclusion is an explicit public blocker; zero unexplained
semantic differences.

### R2 — Complete automatic Cargo/runner attribution

Replace the current narrow `cargo test`/one-process-per-test prototype with a
runner architecture that is both exact and compatible with existing commands.

Work:

- preserve Cargo package/target/feature/profile/test filters and arguments;
- support unit tests, integration tests, doctests, examples and benches where
  they act as tests;
- support standard libtest, nextest and custom harnesses through discovered
  launch behavior rather than repository-specific names;
- carry exact identity across threads, async executors, subprocesses,
  workspaces, retries and crashes;
- attribute assertion/action phases for Rust assertions and common test
  frameworks without hardcoding application code;
- persist background and late evidence without assigning it to the wrong test;
- integrate the frozen kill-resilient transport with dynamic context carriers
  so committed observations survive termination and any uncommitted/lost work
  becomes explicit health rather than silent absence;
- fail closed for genuinely ambiguous mixed-language or unsupported runners.

The process-per-test path remains a strict attribution reference: it proves
thread, async, subprocess, assertion, background and late-work partitioning
under one supervisor-owned attempt context. It is not the public standard
libtest architecture. The presentation/process-state differential proved that
external splitting changes stock libtest's aggregate output and observable
process-global state. Standard libtest must instead run once under the selected
toolchain's own scheduler and formatter, with an exact-toolchain replacement
for `library/test` that emits authenticated lifecycle events and otherwise
preserves stock behavior. Process-per-test remains appropriate where the
selected runner itself defines that model, including nextest. Exact subprocess
context propagation from concurrent in-process libtest tests remains a release
gate; it cannot be inferred from timestamps or a process-global environment.

Checkpoint (2026-08-26): the production process-per-test path now preserves
Cargo's pre-separator `TESTNAME` and libtest's positional filters, `--skip`,
`--ignored`, `--include-ignored`, `--exclude-should-panic`, `--test`, `--bench`,
`--exact` and force-in-process selection. The same parsed plan filters each
artifact before tasks are created and carries only execution-relevant modes to
the exact child invocation; a deliberately empty selection is a successful
zero-test run. Supercov no longer injects `--nocapture`. The reference splitter
now parses and applies explicit `--test-threads` and `RUST_TEST_THREADS` as its
exact worker bound. Presentation options the split model cannot reproduce—
shuffle, fail-fast, formats and capture/display modes—still fail closed rather
than being discarded. A real compiler run proves
`cargo test records_real_runtime_probes -- --include-ignored` executes exactly
the one requested ignored test with authenticated evidence. Full output/order,
cross-artifact fail-fast, retries and custom-runner composition remain open.

The production wrapper now also builds one shared static probe runtime with the
exact `rustc` executable supplied by Cargo. Concurrent wrapper processes use a
bounded create-new lock and atomic archive rename; four real builders converge
on one nonempty archive with no partial or lock debris. All instrumented crates
link the shared ABI, so dependency probes and doctest assertion contexts cannot
silently split across per-crate thread-local runtimes. Cargo target planning is
now explicit and tested: default and `--doc` select doctests, while explicit
non-doc targets do not.

The production rustdoc supervisor is now connected. Cargo's nested rustc
version/build probes publish the exact compiler selection before rustdoc may
start; the matching rustdoc executable must have the same commit, release and
host, and the exact companion remains the test-builder wrapper. Default
`cargo test`, explicit `cargo test --lib` and doc-only `cargo test --doc` all
run through the transactional compiler lifecycle and ordinary stored-run query
path. The real gate covers six cataloged doctests, standalone and merged roots,
ignored/no-run/should-panic/compile-fail identities, compiler dependency hits,
assertion phases, context-zero background work and CTFE setup evidence.

Rustdoc's version-2 extracted catalog is captured before every instrumented
execution, including the output-equivalence path that does not capture
outcomes. Standalone identity is bound from rustdoc's generated HIR marker to
exact catalog path/line; merged temporary roots are translated and rebased to
the same canonical test identity. A regression carries runtime evidence under
both roots for one test and requires both records to survive exactly once.
Transport health now states whether it describes an exact test attempt or one
shared runner invocation instead of fabricating one attachment per doctest.
Frontend runner declarations are likewise derived from observed evidence, so
doc-only runs cannot claim libtest attribution and explicit non-doc runs cannot
claim rustdoc attribution.

A deliberately failing real doctest proves the distinction between test
failure and coverage failure: rustdoc's exact exit 101 is preserved, the failed
run and outcome remain atomically queryable, authenticated transport is
complete, and terminal work is removed. Full output/order compatibility,
cross-artifact fail-fast, retries, multi-package identity, wrapper composition
and failure/signal recovery remain open.

The production compiler path now uses one shared process-supervision session
for Cargo builds, rustdoc, libtest discovery and every parallel process-per-test
attempt. Captured stdout and stderr are drained separately without changing
exit status. Signals remain visible to every active child rather than being
consumed by one worker. On POSIX, every command is held before `exec` until a
forked copy of the exact Supercov binary has left the target group, closed
unrelated descriptors and acknowledged its private liveness pipe. Ordinary
return, unwind and uncatchable supervisor death close that pipe and kill the
complete group; Windows retains the existing kill-on-close Job Object.

Executable gates now send SIGTERM after the exact Cargo companion is active and
require exit 143 plus no original-store or isolated-workspace debris. A separate
gate SIGKILLs that production supervisor, proves its active Cargo/descendant
group cannot escape, requires cooperative cleanup not to run, and then requires
the next exact-selection run to report and remove the abandoned transaction.
This exposed and fixed two lifecycle bugs: compiler runs had no minimum durable
run state, and recovery retained terminal `Abandoned` state under `.supercov/work`.
Failure/signal recovery for this standard Cargo/rustdoc topology is now closed;
retry, multi-package, custom-runner and wrapper-composition failure matrices
remain open.

The same armed parent-death boundary now protects the already-public
JavaScript/TypeScript frontend rather than existing only on the compiler path.
Its production isolation gate waits until an instrumented test has spawned a
descendant, SIGKILLs Supercov, proves that neither process survives or performs
delayed work, and requires the following run to report and remove the abandoned
transaction. The complete node:test, Vitest, Playwright and build-adapter matrix
remains green under this supervisor.

Multi-package libtest identity is now exact for the first collision corpus.
Every Cargo compiler artifact must carry a regular `Cargo.toml` manifest within
the project; the engine derives a relocation-stable `package:.` or
`package:<workspace-relative-root>` identity and combines it with sorted target
kinds, target name, workspace-relative source and libtest name. A real copied
workspace adds two packages with the same lib target and test name, executes
both through the production compiler frontend and proves the two distinct IDs
survive stored-run querying. Artifact enumeration and execution also reproduce
Cargo 0.96's ordered dynamic-library search path, including profile root,
dependency directory, exact target libdir, sysroot libdir, inherited paths and
the macOS fallback defaults. This closes the dynamically linked proc-macro
harness failure exposed by the multi-package gate.

Checkpoint (2026-08-27): Cargo is now the production launch authority. The
full original Cargo test command runs once with an injected internal target
runner; Cargo supplies every package/build-script variable, native loader path,
profile setting, artifact order and cross-artifact fail-fast decision. The
runner enumerates each Cargo-selected libtest artifact, executes every exact
test through the existing authenticated process-per-test transport and
atomically publishes an ordinal-bound unit. A real three-package workspace
proves build-script runtime variables, identical target/test names, default
fail-fast and `--no-fail-fast` behavior. The former reconstructed dynamic-loader
environment and its macOS-specific fallback logic have been deleted; the real
proc-macro harness remains green using Cargo's inherited environment.

Cargo also forwards target runners to rustdoc. The exact rustdoc wrapper now
removes only Supercov's injected `--test-runtool` pair before entering the
already-authenticated rustdoc catalog/outcome supervisor; missing, duplicated
or foreign composition fails closed. This prevents generated doctest binaries
from being misclassified as ordinary libtest artifacts. Every normal internal
runner error atomically publishes a strict failure unit, while a killed runner
remains distinguishable as an unmatched durable reservation. The complete
rustc/rustdoc corpus, the public JavaScript/TypeScript engine matrix, clippy,
228 engine tests, 19 contract tests and 16 CLI tests are green locally. No
hosted workflow ran.

This closes reconstructed Cargo launch state, standard Cargo ordering/default
fail-fast, package/build-script environment and the libtest/rustdoc ownership
split.

The next configured-runner slice resolves Cargo's normal hierarchical target
configuration and `CARGO_TARGET_<TRIPLE>_RUNNER` environment through Cargo's
documented precedence before the checkout is copied. Exact target entries beat
matching `cfg(...)` entries and the environment beats both. Search-path,
absolute and workspace-relative programs remain distinct; workspace-relative
programs are relocated into the isolated copy. Scalar and array forms, fixed
arguments and paths/arguments containing spaces are composed as structured
argv inside both libtest discovery/exact attempts and rustdoc's
`--test-runtool` chain. Cargo's original artifact argument is preserved for
the user runner while its canonical path remains the security/evidence
identity. A real mixed libtest/rustdoc compiler run, killed rustdoc run and
filtered libtest run pass through the configured runner; the standalone
three-package Cargo-authority corpus also remains green.

This deliberately does not claim complete Cargo configuration support. Cargo
1.95 config `include`, user command-line `--config`, multiple selected targets
stop before user execution until their exact merge/selection semantics are
owned.

Checkpoint (2026-08-27): Cargo execution now uses an authenticated
same-filesystem sibling workspace rather than a descendant of the source
checkout. The copied project keeps its original basename beneath neutral
generated ancestors, so Cargo observes the copied project configuration and
the real parent hierarchy exactly once instead of rediscovering the source
checkout's project configuration as an ancestor. A real build script asserts
that a configured rustflag occurs exactly once in `CARGO_ENCODED_RUSTFLAGS`.
The container name and strict marker bind the canonical source root; a missing,
linked, malformed or mismatched marker is never trusted or deleted.

Refresh uses staging/current/previous generations and atomic rename. Injected
copy exhaustion and publication-rename failure preserve the prior complete
generation and leave no transaction debris. Recovery removes incomplete
staging, restores the newest prior generation when necessary, terminal run
cleanup removes only the exact run subtree, and `supercov clean` removes the
owned sibling only while holding the ordinary project lock. The authoritative
rustc/rustdoc corpus, public JavaScript/TypeScript matrix, clippy, 235 engine
tests, 19 contract tests and 16 CLI tests are green locally; no hosted workflow
ran.

Explicit installed rustup `+toolchain` selection is now exact as well. Before
configuration resolution, Supercov asks the same rustup installation for that
toolchain's real Cargo executable, requires the original proxy and selected
binary to return byte-identical verbose identities, and gives the selected
Cargo path to the configuration resolver so its sibling rustc and target cfg
set match execution. The original proxy command remains unchanged for the
actual run. A real `cargo +1.95.0 test ...` compiler run, with no `RUSTC`
override, selects the exact rustc companion, preserves the relocated configured
runner and selected tests, publishes evidence and leaves no terminal work.
Empty, misplaced and multiple selectors fail before execution.

Cargo 1.95 runner configuration now has one owned selection path instead of a
split between `cargo-config2` and Supercov's newer layers. The model loads the
ordinary hierarchy and Cargo home, recursively applies ordered and optional
`include` files with cycle rejection, then applies command-line `--config`
files or strict dotted-key values from left to right. It preserves Cargo's
non-mergeable runner arrays, config-relative program roots, ASCII-whitespace
string parsing and CLI-over-environment-over-file precedence. Exact target
entries beat `cfg(...)`; otherwise Supercov obtains the selected target's cfg
set from the exact configured rustc command and rejects multiple matching cfg
runners exactly as Cargo does. Forbidden registry token/secret values in
`--config` fail during preflight. Direct Cargo process argv is no longer
joined and reparsed, so embedded TOML quotes survive unchanged.

The real compiler corpus proves an exact-target runner supplied by `include`,
an included cfg runner selected from rustc's target facts and a CLI runner
overriding the included value. A paired Cargo/Supercov oracle requires both to
reject two matching cfg runners before a test executes. Each successful run
preserves configured-runner composition across libtest and rustdoc, publishes
authenticated evidence and removes terminal work. The full local gate is green
for 241 engine tests, 19 contract tests, 16 CLI tests, warnings-denied clippy,
the complete public JavaScript/TypeScript matrix and the authoritative
rustc/rustdoc corpus. No hosted workflow ran.

Cargo runner composition is now target-indexed end to end. Every selected
target receives a separate structured `--config` runner override carrying its
exact target identity; the internal libtest runner selects only that target's
resolved user runner, persists the target in its atomic unit and binds the
unit filename to target plus artifact. The reader rejects empty, duplicated or
unselected target identities. Rustdoc receives the same fixed target argument,
removes only Supercov's exact runner pair and restores only that target's
original scalar/array runner. Unknown, duplicated, missing and foreign
composition fails closed. Repeated targets and `host-tuple` normalize through
Cargo's ordered-set semantics before runner selection. Custom JSON target paths
are project-relative and canonical; two paths with the same Cargo short name
are rejected rather than aliasing.

The standalone real-Cargo gate supplies both the explicit installed host and
`host-tuple` and proves Cargo invokes the target runner once with exact argv,
ordering, fail-fast and cleanup. Synthetic two-target tests prove independent
runner selection, rustdoc restoration and collision-free publication. This
machine has only `aarch64-apple-darwin` installed, so execution across two
genuinely distinct targets is not claimed and remains part of the supported-
target matrix. The authoritative rustc/rustdoc corpus, 251 engine tests, 19
contract tests, 17 CLI tests, warnings-denied clippy and the complete public
JavaScript/TypeScript matrix are green locally. No hosted workflow ran.

Cargo's compiler command is now resolved by the same owned configuration
model. `RUSTC` has Cargo's special highest precedence; command-line `--config`
then overrides `CARGO_BUILD_RUSTC` and file/include values. Definition-relative
`build.rustc` paths retain workspace-relative identity. Supercov runs `-vV`
and target-cfg discovery through that exact compiler from the authenticated
isolated workspace, never from the source checkout. The real compiler corpus
uses an included, workspace-relative compiler proxy and proves that host
selection, cfg-runner selection, companion execution and every observed proxy
path stay inside the copied workspace.

General and workspace compiler wrappers are likewise discovered across direct
environment, `CARGO_BUILD_*`, ordinary files, includes and CLI configuration,
including Cargo's empty-environment reset behavior. During Cargo execution,
Supercov temporarily owns both wrapper slots as one unambiguous bridge. A
non-workspace invocation reconstructs the original general-wrapper-to-rustc
chain unchanged. A workspace invocation reconstructs the original general and
workspace wrappers in Cargo's order, then supplies one inner Supercov compiler
relay in place of rustc. The relay selects the exact companion against the
compiler token from that invocation; run-level selection remains an atomic,
strict audit checked after Cargo joins every compiler job.

Before user wrapper code executes, the bridge restores exact presence,
absence, empty values and non-UTF Unix/Windows contents for `RUSTC_WRAPPER` and
`RUSTC_WORKSPACE_WRAPPER`. Workspace-relative wrappers execute only from the
authenticated copy. A real two-layer Node wrapper oracle proves the general
wrapper still sees the workspace wrapper beneath it, the workspace wrapper
receives the inner compiler relay, neither observes Supercov's temporary Cargo
overrides, evidence/query publication completes and terminal work is removed.
A second oracle makes the workspace wrapper fail with exit 73 during a real
crate compile and requires Cargo's failure plus zero terminal work debris.
This closes ordinary forwarding/argument-transforming compiler-wrapper
composition, not compiler-cache hits which bypass the supplied compiler or a
wrapper that intentionally substitutes an unrelated compiler.

The same work corrected one Cargo-model edge: an exact Cargo executable still
uses Cargo's default `rustc` search token. Only an explicit rustup
`+toolchain` is pre-resolved to that selected Cargo's sibling rustc for
Supercov's preflight; the runtime compiler token is independently attested.

This closes copied/ancestor configuration duplication for the current
same-filesystem writable-parent topology. A checkout whose parent cannot host
the authenticated sibling still fails closed; an exact read-only-parent,
cross-volume and supported-platform fallback remains required before public
promotion. Retry identity, nextest/custom harnesses, complete
presentation/output modes and their crash matrix likewise remain open.
Cache-hit/non-forwarding wrapper evidence reuse, wrapper-induced compiler
substitution, the composed-wrapper signal matrix and relay performance remain
open. Execution across multiple genuinely distinct installed targets remains
unproven. These gaps keep Rust private.

Checkpoint (2026-08-27): the first owned cargo-nextest boundary is now exact
for the two pinned released contracts, 0.9.138 and 0.9.140. Supercov validates
the full version identity and fails closed for unknown, hypothetical or newer
releases. Machine-readable list projection preserves selectors on both sides
of `--`, empty-suite policy, bare timing flags and clustered verbosity without
changing the user's run command. Each real attempt retains nextest run,
binary, test, zero-based retry, total-attempt and runner-attempt identity.
Executable gates cover a retry that becomes passing, a terminally flaky run,
default fail-fast with an exact selected-but-unstarted outcome, two genuinely
overlapping attempts with no cross-attribution and both empty-suite exit
policies. A killed target runner behind the production configured-runner chain
leaves exactly one durable unmatched reservation, publishes no false attempt
or stored run and cannot leak its child test process. Original nonzero nextest
and instrumentation exits remain distinct.

This closes the ordinary nextest catalog/retry/flaky/fail-fast/concurrency and
target-runner-death slice. It does not close R2: custom harnesses, remaining
presentation/output modes, late work and subprocess attribution, non-forwarding
compiler caches, read-only-parent/cross-volume fallback, genuinely distinct
installed targets and the supported Linux/Windows matrices remain release
blockers. The compiler corpus also exposed a separate R1 denominator gap:
constant-literal assertion decisions such as `assert!(false)` had to be
modeled without depending on a generated switch or silently disappearing.

Checkpoint (2026-08-27): that constant-assertion gap is closed without a
Supercov constant evaluator. The companion distinguishes HIR-backed authored
assertion atoms from synthetic `assert_eq!`/`assert_ne!` macro control flow,
then permits either dynamic or rustc-folded typed Boolean switches only for the
authored atoms. Exact goldens cover literal true/false, debug variants, a
folded expression, a named constant and mixed literal/dynamic `&&` and `||`;
the existing equality and debug-equality vectors prove unrelated macro-
internal constant switches remain excluded. `assert!(false)` retains both
frozen outcome obligations, publishes only the observed failed vector and
therefore leaves the passing alternative honestly uncovered. Baseline and
instrumented values, panics, output, drops and ordering remain identical, and
every new decision reaches authenticated assertion-phase evidence v3.

The command harness now also rejects a signal or timeout with no exit status
even when a nonzero test result was expected. The deliberately failing doctest
has a separate bounded allowance rather than weakening this rule. The
authoritative rustc/rustdoc/Cargo/nextest corpus, 267 engine tests, 19 contract
tests, 17 CLI tests, warnings-denied clippy and the complete public
JavaScript/TypeScript integration matrix are green locally. No hosted workflow
ran. This closes the isolated assertion-denominator blocker, not R1 or R2.

Checkpoint (2026-08-27): downstream generic, trait and async MIR now reaches
one shared runtime through a serialization-safe ABI. The previous companion
inserted calls to compiler-injected Rust wrapper bodies. A generic or async
body serialized in a library could therefore retain a local wrapper reference
that downstream monomorphization could not load as optimized MIR. The focused
corpus reproduced that failure before the downstream binary could link.

The companion now injects declarations only and makes every MIR call directly
to the shared `__supercov_rt_*` C ABI. Cargo still builds and links one exact
static runtime, so probe calls no longer duplicate per-crate TLS or depend on
synthetic wrapper MIR. A downstream binary now preserves exact baseline stdout,
stderr and values while instantiating two generic monomorphizations, calling a
trait default through static and dynamic dispatch, calling an overriding impl
and polling a deliberately pending async future to completion. Authenticated
evidence contains one generic source obligation, one trait-default obligation,
one distinct override and both exact Boolean vectors for each decision.

The same corpus exposed and corrected an independent denominator error: an
`async fn` constructor and its generated future body had both been counted as
function entries. The frozen model now emits exactly one function obligation
at the async body closure's first poll; merely constructing the future creates
none. The focused ABI/manifest/evidence gate, the complete
rustc/Cargo/rustdoc/nextest corpus, warnings-denied Clippy and all workspace
tests are green locally: 19 CLI, 19 contract and 277 engine tests. The strict
aggregate audit proves every emitted ordinal belongs to the frozen point or
branch denominator. Doctest descriptor expectations now derive their source
lines from the fixture instead of retaining brittle line constants. This
narrows RCV-IDENTITY, POINT, SEMANTICS and RUNTIME; it does not close R1 or R2.
No hosted workflow ran.

Checkpoint (2026-08-28): the compiler candidate now implements the frozen
`logical-selection` denominator rather than merely retaining short-circuit
information inside MC/DC vectors. Strict manifest candidate v3 adds a sorted,
validated relation from every decision-contributing `&&`/`||` branch to the
first atomic condition of its right subtree. Runtime and CTFE projection derive
`short-circuited` versus `right operand evaluated` directly from that ternary
condition value. Those alternative ordinals are internal and a direct emitted
hit is rejected, so control decisions pay no duplicate probe cost.

Logical expressions used as values remain branches but do not invent MC/DC
decisions. The companion records the right operand as the public obligation and
the rightmost atomic tail of the left subtree as its exact compiler mapping.
The MIR plan starts one first-commit branch frame at the alternatives' common
dominator, so every path entering the right operand is included even for nested
`(a && b) || c`. Runtime and real CTFE goldens observe both alternatives for
both nested operators while preserving byte-identical baseline output. The
strict parser distinguishes decision-derived logical alternatives from emitted
value-selection alternatives; doctest rebasing translates the new branch IDs
and relations, and v2 candidates are rejected rather than migrated.

The downstream corpus also now covers an async trait default, an overriding
async impl, a generic async dispatcher, an async closure, a nested generic
decision, and a mutable borrow plus `Drop` guard held across a genuine
suspension. No future constructor contributes a function point; each executed
body contributes exactly one first-poll entry. The focused gate, complete
rustc/Cargo/rustdoc/CTFE/nextest corpus, 19 CLI tests, 19 contract tests, 280
engine tests, warnings-denied Clippy and formatting are green locally. No
hosted workflow ran. This closes the discovered logical-selection denominator
hole and narrows generic/trait/async coverage; it does not close R1–R4.

Checkpoint (2026-08-28): the downstream compiler corpus now proves the next
type-system and expansion slice. Associated-type defaults, GAT projections,
RPITIT methods and consumers, and a higher-ranked closure bound preserve exact
baseline output while publishing one source function per definition and all
three short-circuit vectors for each compound decision. They reuse the direct
shared ABI across downstream instantiation; no monomorphization-specific
denominator is introduced.

A body-replacing procedural attribute exposed a real collapsed-span defect:
its two distinct Boolean atoms shared one synthetic callsite, so the optimized-
MIR fallback found two candidate switches and failed closed. Synthetic non-
guard decisions with duplicate condition ranges now receive pre-borrow-check
typed-Boolean markers ordered by CFG reachability. The attribute publishes the
exact false/short-circuit, true/false and true/true vectors plus its one logical
selection. A procedural macro that emits a dependency-owned declarative macro
invocation aggregates into the dependency macro's authored-source obligation;
it does not manufacture a parent-expansion duplicate, and exact evidence
multiplicity is gated.

The focused gate and a fresh complete rustc/Cargo/rustdoc/CTFE/nextest corpus
pass, followed by 19 CLI, 19 contract and 280 engine tests, warnings-denied
Clippy, formatting, script syntax and diff safety. No hosted workflow ran.
This closes the associated-type/GAT/RPITIT sub-gap and two concrete nested
expansion cases only. R1–R4, broader expansion/toolchain/oracle/platform
matrices and public Rust readiness remain open.

Checkpoint (2026-08-28): the first generated semantic differential and
independent condition oracle are now executable promotion evidence. Forty-eight
deterministic nested Boolean programs run every three-bit input, while sixteen
cases each cover `if let` chains, match guards, `?` plus `let else`, and
closure capture/destructor ordering. Baseline and instrumented stdout/stderr
are exact, each frozen vector and structural alternative is asserted, and no
runtime ordinal may exist outside the manifest. A separate rustc-native LLVM
condition run agrees with Supercov's true/false count for all 96 overlapping
decisions; LLVM is never invoked by the product run.

The same focused gate now includes a real `#![no_std]` library whose probes
link through the one shared runtime at the final executable, plus identical
authored denominators and vectors under editions 2015, 2018, 2021 and 2024
with declared Rust-version floors. This proves compiler-edition compatibility,
not bare-target support; the installed-target matrix remains open.

The last known compile-diagnostic presentation difference is also closed.
Stock rustc enables trimmed diagnostic definition paths in its driver
callback. The companion reproduces that setting, while every Supercov-internal
identity lookup explicitly uses rustc's no-trimming scope. Compile-fail stderr
is now exact after normalizing only fixture/output paths; no `std::result` or
`std::ops` rewrite remains. The focused gate and a fresh complete
rustc/Cargo/rustdoc/CTFE/nextest corpus pass locally, including production
orchestration, multi-package libtests and doctests. The full workspace follows
with 19 CLI, 19 contract and 280 engine tests, warnings-denied Clippy,
formatting, script syntax and diff safety all green. This checkpoint is fully
integrated, but R1–R4 remain open.

Checkpoint (2026-08-28): authored Boolean calls into unowned macro
implementations now remain exact opaque source atoms inside larger decisions.
The collector collapses an external expansion only when its implementation
range is unowned and its exact callsite is owned; project-owned declarative
macro definitions retain their normal authored denominator. Logical-selection
identity uses the owned invocation when the macro is the right operand, while
decision-linked alternatives continue to derive from the ternary vector and
emit no duplicate probes.

Pre-borrow structural markers bind every opaque atom's unique terminal typed-
Boolean switch and ordinary siblings independently. Post-borrow rebinding may
cross only a straight-line `goto` or an exactly identified Supercov match-
runtime call; it never crosses user control or guesses across a branch. The
corpus proves one and two `matches!` invocations in left/right and nested
`&&`/`||` positions plus a match guard, with exact source conditions, all
short-circuit vectors and logical selections, unchanged output, and no macro-
internal obligations. The focused gate and fresh complete
rustc/Cargo/rustdoc/CTFE/nextest corpus pass locally, followed by 19 CLI, 19
contract and 280 engine tests, warnings-denied Clippy, formatting, script
syntax and diff safety. R1–R4 remain open.

Checkpoint (2026-08-28): the generated differential now supplies an
independent point oracle as well as condition parity. Three `#[inline(never)]`
functions execute both paths, only the true path, or no path. Supercov must
observe the exact function entry and five selected authored statements in each
case, including the deliberately uncovered false path and wholly uncalled
function. The separately built rustc/LLVM oracle must expose exactly one
matching function and at least one contained code region for each selected
statement; every observed/unobserved Boolean agrees. Oracle profiles and
artifacts remain separate from the Supercov run. The focused property/oracle
gate and a fresh complete rustc/Cargo/rustdoc/CTFE/nextest corpus pass locally.
The workspace then passes 19 CLI, 19 contract and 280 engine tests,
warnings-denied Clippy, formatting, both script syntax checks, package preflight
and diff safety. R1–R4 remain open.

Checkpoint (2026-08-28): independent coverage implementations are now guarded
as development oracles, never product collectors. Package preflight recursively
audits the shipped launcher and target-language shims plus every normal Rust
CLI/engine source for external coverage executables or compiler-native coverage
injection. The coverage.py importer is compile-inaccessible outside tests or
the explicit non-default `oracle-harnesses` feature, whose default set is empty.
The preflight passes locally and is included in the complete workspace gate
above. The supported-platform oracle matrix remains an R1 blocker; this
checkpoint does not promote Rust or claim another target.

Checkpoint (2026-08-28): repeated derive expansion now has an explicit
non-contamination gate. Two invocations generate structurally identical impl
methods at different authored callsites. The called impl publishes every
function/statement point and both decision outcomes; the uncalled impl retains
its complete denominator but publishes no point or decision evidence, and all
synthetic IDs are distinct.

That addition exposed a separate ordering defect: logical-selection relations
were serialized by hashed branch ID, so unrelated source could reorder the
source condition indexes. The compiler now orders relations by exact right
condition index and the strict parser requires increasing source order. A
negative manifest test uses deliberately reverse-sorted IDs to prove identity
hashes cannot control semantics. The focused compiler gate, parser test and a
fresh complete rustc/Cargo/rustdoc/CTFE/nextest corpus pass. The workspace then
passes 19 CLI, 19 contract and 280 engine tests, warnings-denied Clippy,
formatting, script syntax, package preflight and diff safety. R1–R4 remain open.

Exit gate: the concurrency/crash/retry matrix produces exact, deterministic
per-test evidence with no contamination, loss or repository-specific setup.

### Binding lattice checkpoint — 2026-08-29

R3 dogfooding produced eight binder waves (waves 1-8, design and MIR evidence
in `progress/rust-string-match-binding-2026-08-29.md`), each one a generated
or authored shape whose obligations the pre-borrow binder could not prove:
serde string/byte multiway tries, parallel-arm try operators, integer and
nested-enum matches, coverage-ineligible derives and their value-position
selections, while-let and if-let pattern switches, loop-nested arm
membership, and or-pattern arm entries. Every one of them stopped the build,
because an unbindable obligation was a `fatal`.

That default is correct for Supercov's own gates and wrong for a user's
codebase: the shape space of generated Rust is open, so a single unknown
expansion anywhere would make the tool unusable. Obligations now degrade
instead (`progress/rust-binding-lattice-2026-08-29.md`): the failing body is
left uninstrumented and recorded as an explicit `RUST_OBLIGATION_UNBOUND`
limitation naming the phase, exact definition and the binder's own
diagnosis, while every other body keeps exact measurement. The guarantee
becomes "every number is exact or explicitly unmeasured" rather than "exact
or the build fails" - nothing is ever silently approximate, and an unbound
obligation is never reported as uncovered.

`SUPERCOV_RUST_STRICT_BINDING=1` keeps the old behavior and every corpus
compile sets it, so unbindable shapes stay hard, discoverable signals here.
The degradation path is itself gated through a `SUPERCOV_RUST_FORCE_UNBINDABLE`
fault injection proving, in one crate, that the lattice build succeeds and
records the exact limitation, that an unrelated body keeps its obligations,
and that the strict build fails naming the same obligation - an untested
degradation path would be exactly the silent wrongness the design prevents.

Dev builds also now hash at full speed (`[profile.dev.package.sha2]` and
friends): companion selection content-hashes multi-megabyte binaries on
every rustc proxy invocation, and unoptimized sha2 was adding tens of
seconds per crate, which had been misread as gate hangs.

Rust remains private and fail-closed. R4 is unchanged.

### Gate-verification correction and serde match binding checkpoint — 2026-08-29

CORRECTION. The two prior 2026-08-29 checkpoints below ("Join-bounded thread
phases" and "Thread-failure gate and Linux glibc interposer proof") claimed a
fresh complete corpus pass. That claim was false at their commits (`c39c0e4`,
`877a30f`): the session's background gate chains used a success marker that a
shell `set -e` defect could print even when the corpus stage failed, and both
runs' corpora actually failed on one stale corpus expectation
(`supercov-rustdoc-outcome-unit-v3` vs the schema-4 bump). Every other gate
those checkpoints list (workspace tests, clippy, formatting, the five focused
compiler gates, runtime/assets/preflight, the Linux container proof) did pass
as stated. The stale expectation is now corrected, gate chains require the
corpus's own success summary before declaring green, and the complete corpus
passes at this checkpoint's commit, restoring the invariant both earlier
checkpoints intended to record.

R3 dogfooding on Supercov's own workspace then exposed that pre-borrow
synthetic match binding could not bind serde-derive visitors, and the fixes
are part of this checkpoint (design and MIR evidence in
`progress/rust-string-match-binding-2026-08-29.md`):

- arms carry their pattern's owned stable range, so chain edges may match the
  authored field/variant identifier spans serde puts on generated patterns;
- unguarded string/byte-string literal groups bind by exact recovered
  literal (equality-call consts and per-byte switch values), the only exact
  assignment once same-length candidates lower into a shared multiway test
  tree that erases source arm order;
- desugared matches (`?`, `while let`) no longer compete as chain candidates,
  and a group matching on an ADT rejects edges positively identified as
  switching on a different ADT (serde `tri!` on `Result` vs field matches on
  `Option`), while unidentifiable guard structures stay span/order-bound;
- same-source sibling structures follow HIR visit order under a strict
  one-way-reachability-then-dominance relation, applied to match assignment
  and the try-operator/condition/let-else rankings.

With these, every match group in the serde-derived supercov-contracts
visitors binds exactly. The dogfood build still fails closed at try-operator
selections generated in parallel match arms (no CFG order exists; they need
arm-scoped assignment through the bound enclosing group) — that boundary is
documented and is the next R3 work item. Rust remains private and
fail-closed.

### Thread-failure gate and Linux glibc interposer proof checkpoint — 2026-08-29

Deterministic thread-creation failure is now gated: the subprocess fixture
calls the interposed `pthread_create` directly with an attribute demanding a
4 EiB stack (a 16 TiB stack allocates lazily on current macOS, so the size
must exceed the address space), proves the create fails, the caller's exact
context survives, no thread phase is committed, and a subsequent joined
recovery thread stays exactly attributed. The interposer's failure path
reclaims its start-routine allocation exactly once.

The full focused compiler gate set now also passes on
`aarch64-unknown-linux-gnu` (rust:1.95 container, real toolchain):
subprocess/fork/exec/spawnp/pool/thread-failure propagation, async
suspension/resume, custom harness, exact-libtest presentation and the
builder lifecycle. Getting there surfaced and fixed one product bug and two
portability defects in spike harnesses: the thread interposer's `dlsym`
declaration hard-coded `*const i8` where Linux `c_char` is `u8`; the
presentation spike selected the toolchain's orphan `.rmeta` instead of the
full rlib pair (platform-dependent sort order — production's builder already
required the full pair); and its context stub archive was either
dead-stripped by GNU ld or duplicated rustc runtime shims under ld64
`force_load`, so it is now a bare object file linked unconditionally. The
container needs a zombie-reaping init (`docker run --init`) for the
late-child containment check to observe the kill. macOS remains fully green
after every fix (20 CLI, 19 contract, 316 engine tests, all focused gates,
fresh complete corpus). musl and Windows remain open; no hosted workflow ran.

### Join-bounded thread phases checkpoint — 2026-08-29

Automatic thread inheritance is now sound for shared pools. Every inherited
native thread runs under a fresh derived thread-phase context
(`rust-probe-transport-v3`, magic `SCVRUST3`, kinds 5 thread phase / 6 thread
end / 7 test boundary), and offline partitioning attributes a thread phase's
records to its root test only when the thread's end record committed before
the root test's boundary record in global transport order. A thread that
outlives its creating test — including a lazily created shared pool worker —
fails closed: every record on that chain is background with an explicit
`RUST_THREAD_OUTLIVED_TEST` limitation carried through persisted runner units
(runner version 6), transport health and rustdoc outcome units (schema 4).
Joined and nested threads, fork/exec children and async coroutine phases
remain exactly attributed; assertion phases entered on executor threads
collapse their thread parent for phase projection. Test boundaries are
committed by both the companion context guard and the compiled MIR test exit,
deduplicated on same-context re-entry; the companion bundle schema is 3.

A real shared-pool gate proves the semantics end to end: a never-joined
`OnceLock` worker used by two tests passes both, credits neither, retains the
pool evidence once as background and surfaces the limitation through the
production runner. The corpus's raw-transport expectations for
`tests::child_context` moved one level to the authenticated thread phase
parented by the assertion phase, with negatives for background, base-test and
direct assertion-phase attribution. Parser corruption gates cover tampered
thread-phase derivation, duplicate ends, duplicate boundaries, ends without
phases and boundaries under unknown roots.

The full local suite is green after the change: 20 CLI, 19 contract and 316
engine tests, warnings-denied Clippy, formatting, packaged assets, all five
focused compiler gates, runtime tests, package preflight and the fresh
complete rustc/Cargo/rustdoc/CTFE/nextest corpus. No hosted workflow ran.
Deterministic thread-creation failure, Linux GNU/musl container proof and
Windows remain open; R1–R4 remain open.

### Direct exec-family and fork propagation checkpoint — 2026-08-28

Context propagation now covers the direct process-creation surfaces that
bypass `posix_spawn`. Executable-owned `execve`, `execv` and `execvp`
interposers apply the same child-environment contract: an existing
`SUPERCOV_RUST_CONTEXT_ID` is replaced with the active test/assertion context,
absence remains the authenticated `env_remove` opt-out, and the parent
environment is never mutated. Because `execv`/`execvp` read the process-global
environment and their libc-internal exec calls do not pass through the
interposed `execve` symbol, they swap the global environment pointer to the
replaced copy only for the duration of the exec attempt and restore it on a
failure return; a fork child is single-threaded, so the swap is unobservable
on the paths that use it. A plain `fork` child needs no interposition at all —
it inherits the forking thread's context and the shared transport mapping
directly.

Six new real-fixture gates prove exact attribution with no background
leakage: a plain `fork` worker, a `fork`+`execve` child receiving the parent
environment verbatim, a `std::process` `pre_exec` child (std's fork+`execvp`
fallback), a direct `posix_spawnp` child, a failed launch of a nonexistent
binary that must surface the platform error and preserve the exact context,
and transitively inherited nested threads. The focused companion, async,
subprocess, custom-harness and builder-lifecycle gates and a fresh complete
rustc/Cargo/rustdoc/CTFE/nextest corpus pass locally, followed by 20 CLI, 19
contract and 313 engine tests, warnings-denied Clippy, formatting,
runtime/packaged-asset tests and package preflight. No hosted workflow ran.

Pre-existing task pools remain the open propagation semantics: a pool thread
created during one test keeps that test's context when another test later
submits work to it, so exactness requires task-level propagation or an
explicit fail-closed boundary before any promotion claim. Deterministic
thread-creation failure, Linux GNU/musl interposer ABI proof (prepared as a
container gate, blocked only by local VM repair) and Windows remain open;
R1–R4 remain open.

### Automatic context inheritance and crash-safe companion builder checkpoint — 2026-08-28

Stock-libtest execution fidelity is now argument-exact: discovery projects only
selection-affecting arguments while the actual stock run receives the user's
original argv unchanged, preserving presentation and scheduling; `--list` and
`--help` remain deliberately fail-closed non-execution surfaces. Persisted
transport units are strictly recombined and repartitioned before acceptance,
physical runner-invocation health is separated from zero-copy test-attempt
health, and background evidence publishes even when no test is selected,
without inventing an attempt. The libtest companion bundle schema is now
version 2, so an older canonical artifact with incompatible semantics can
never be reused.

Native thread and subprocess context propagation is now automatic. Private
macOS/Linux interposers make `pthread_create` capture the active
test/assertion context, install it in the new native thread and restore the
child after its start routine; `posix_spawn`/`posix_spawnp` replace an
existing `SUPERCOV_RUST_CONTEXT_ID` only in the child environment; explicit
`Command::env_remove` remains an authenticated opt-out that produces
background evidence; the parent environment is never mutated. Because
inheritance captures the active phase, a thread spawned during
assertion-argument evaluation belongs to the assertion phase itself: the
corpus now proves the child-thread observation under the exact authenticated
assertion phase of its spawning test — never under background zero and never
under the bare base test context — in both the concurrent five-thread slice
and the supervisor-isolated run. The two corpus expectations that had frozen
the old contextless behavior were corrected factually after a focused
reproduction dumped the raw concurrent transport and proved exactly one
authenticated phase record with no duplication or leakage.

The exact-libtest companion builder is crash-safe and lives in the engine as
`build_exact_rust_libtest_companion`; the CLI hidden command is a thin
wrapper. Completed patched source trees are strictly authenticated before
reuse; source identity rejects unknown fields, compiler/runtime mismatch,
changed exact toolchain source and changed patched-tree bytes. Source
preparation and companion publication hold persistent kernel locks that the
OS releases when a holder is killed, bounded at five minutes so a genuinely
stuck owner is an explicit error rather than an indefinite wait. On Unix the
locked open-file description is duplicated into the rustc child before exec,
so killing the builder cannot let a recovery process publish over a compiler
still writing. Stale cleanup touches only exact builder-owned partial
prefixes and refuses symlinks/special files; build and publication partials
have RAII cleanup; artifacts and their directory are synced before bundle
publication; existing final artifacts must be byte-identical. A real-
toolchain lifecycle spike proves two simultaneous builders converge on the
same bundle and that SIGKILL recovery publishes one authenticated companion
with no partial debris. The five focused compiler gates are now wired as
`test:rust-compiler-spikes`, and the obsolete never-constructed
`DestinationExists` builder error was removed after authenticated reuse
replaced it.

The focused async, subprocess, custom-harness and builder-lifecycle gates and
a fresh complete rustc/Cargo/rustdoc/CTFE/nextest corpus pass locally,
followed by 20 CLI, 19 contract and 313 engine tests, warnings-denied Clippy,
formatting, runtime and packaged-asset tests and package preflight. No hosted
workflow ran. Direct `fork`/`execve`, custom `pre_exec`, pre-existing task
pools, Linux GNU/musl interposer ABI proof, thread-creation failure and
child-launch-failure gates, and Windows process/lock-handle inheritance
remain open; R1–R4 remain open.

### Generated-source integrity checkpoint — 2026-08-28

The compiler frontend no longer treats obligation snippets as sufficient
identity for build-script output. Normalization hashes every measured source
snapshot's stable key, display path and complete bytes into one
domain-separated SHA-256 fingerprint. The compiler-owned archive scope carries
the algorithm, digest and exact total/generated file counts; strict archive
analysis rejects missing, malformed or extended fingerprint envelopes before
publication.

The executable corpus proves all of the following:

- two clean Cargo target directories produce byte-identical denominator
  candidates and identical complete-source fingerprints;
- changing only a generated trailing comment outside every obligation leaves
  the complete denominator identical but changes the source fingerprint,
  including a rebuild that deliberately reuses the same Cargo target;
- two packages emitting byte-identical `generated.rs` functions retain
  distinct package-relative source keys, obligation IDs and fingerprints;
  physical package containment also survives macOS `/var` versus
  `/private/var` aliases without leaking those aliases into persisted IDs;
- the transactional compiler runner executes both packages' generated
  functions on false and true paths under colliding test names, publishes
  covered points, branches and MC/DC with two healthy transports, retains both
  exact package-qualified test IDs, preserves source bytes and removes terminal
  work state;
- generated source must be a regular file whose canonical path remains below
  the exact target root; an external symlink contributes no obligation and is
  surfaced as explicit function/statement/decision identity limitations;
- a deterministic compiler abort after the root manifest flush but before the
  matching source snapshot exposes no stored run, leaves no terminal work
  state and does not poison the next clean compilation.

A fresh full rustc/Cargo/rustdoc/CTFE/nextest/property/oracle corpus passes,
followed by 19 CLI, 19 contract and 282 engine tests, warnings-denied Clippy,
formatting, script syntax, package preflight and diff safety. No hosted workflow
ran. This narrows RCV-GENERATED-1 and compiler-run lifecycle safety; broader
package/build-script fingerprint matrices, generated probes, supported
platforms and all remaining R1–R4 gates stay open.

### Complete-run archive/publication fault checkpoint — 2026-08-28

The real compiler transaction now has deterministic, private spike-only fault
points at the two immutable-store boundaries. They do not alter the ordinary
archive or run-publication API and are rejected by a public-capability request.

- ENOSPC is raised after bytes have entered the gzip sink. The unique temporary
  archive is removed and the final `evidence.raw.gz` path never appears.
- A separate fault occurs only after the archive, copied evidence, metadata and
  staging-directory sync have completed, immediately before the single rename
  that makes a run visible. Its staging tree is retired without creating a run.
- The executable two-package generated-source gate first publishes a healthy
  run, forces each failure through the complete Cargo/compiler/runtime path,
  and after each one proves that no failed run or terminal compiler/publication
  work exists, project source is unchanged, and the earlier run is byte-for-byte
  unchanged and still queryable with both exact test identities.
- A fourth clean compiler transaction then publishes successfully with two
  healthy per-test transports, proving immediate recovery rather than merely
  inspecting filesystem shape.
- A fifth real transaction pauses after archive validation in the durable
  `Publishing` state while retaining the project lock. A second process is
  rejected before workspace preparation and creates neither work nor a run;
  releasing the leader publishes both healthy exact transports and removes its
  private gate state. The earlier immutable run remains byte-identical.
- With the checkout's private parent made read-only, workspace selection falls
  back outside the Cargo ancestor chain. The strict in-project locator stores
  only `temporary`, the canonical-root digest and a random capability token;
  the cache path is derived under the canonical OS temporary directory and its
  marker must repeat the token. A real Cargo/compiler run publishes and queries
  one exact test with healthy evidence, preserves source, and the real `clean`
  command removes both the external cache and locator.

Focused archive and lifecycle suites, the focused real compiler gate and a
fresh complete rustc/Cargo/rustdoc/CTFE/nextest/property/oracle corpus pass
locally. The workspace then passes 19 CLI, 19 contract and 286 engine tests,
warnings-denied Clippy, formatting, package preflight and diff safety. This
closes the local APFS complete-run ENOSPC/final-rename, process-lock and
read-only-parent fallback slices of RCV-ARCHIVE-1 and RCV-LIFECYCLE-1. A
genuine separate-volume run and supported Linux/Windows fault matrices remain
release blockers. A second fresh complete corpus after the authenticated
placement locator and read-only-parent fallback landed is also green. No
hosted workflow ran.

### Shared Rust runtime crash-recovery checkpoint — 2026-08-28

The compiler wrapper's one-per-run static runtime cache no longer represents
ownership by creating and deleting `build.lock`. Every builder opens one
durable regular lock inode and uses Rust's cross-platform kernel-backed
exclusive file lock. The archive is rechecked after acquisition, so concurrent
builders still converge on the one atomic archive; ownership itself disappears
when a file handle closes or its process dies.

Focused executable proofs now require:

- four live builders publish one archive and leave no partial archive;
- a compiler launch failure releases ownership and a real compiler retry
  acquires immediately;
- OS `ENOSPC` injected after rustc produced the partial removes that partial,
  publishes no archive and permits a clean retry; and
- a separate helper process is killed with real `SIGKILL` while holding the
  kernel lock; the following builder acquires in under five seconds, publishes
  the archive and finds no partial debris.

This closes the local shared-runtime crash/ENOSPC part of RCV-RUNTIME-1. The
supported-target and Linux/Windows filesystem matrix remains a promotion gate.
The focused real Cargo/compiler/generated-source gate is green with the durable
kernel lock in the production wrapper path. The workspace then passes 19 CLI,
19 contract and 289 engine tests, warnings-denied Clippy, formatting, script
syntax, package preflight and diff safety.
No hosted workflow ran.

### Rust custom-harness and dynamic-attribution checkpoint — 2026-08-28

Cargo target classification now happens before execution and preserves
`harness = false` as an opaque custom invocation rather than attempting
libtest discovery. A real mixed workspace runs its ordinary libtest and custom
harness separately; the custom target executes exactly once with its original
arguments and one stable package/target/source identity. Supercov does not
invent internal custom-harness test cases it cannot observe.

Dynamic child work now has executable attribution boundaries. An instrumented
subprocess that inherits the authenticated mmap transport and context is
credited exactly to its parent test. Clearing the context while retaining the
authenticated transport publishes the child once as background evidence. A
child still alive when the attempt returns is killed by the shared process
group before publication, and its delayed unique probe is absent.

Rust assertions that genuinely suspend now preserve exact confidence across
executor threads. Before rustc transforms a coroutine, the compiler inserts
private deterministic marker calls around assertion-internal yields and makes
the current/previous contexts part of coroutine state. The late MIR pass must
consume every tagged marker; because the marker has no linked runtime
implementation, incomplete consumption fails at link time. Suspension restores
the prior context, resumption enters the assertion on the actual resume thread,
and cancellation/drop cleanup remains at base-test confidence. The capture is
emitted only for assertions that contain a real yield, preserving the already-
proven nested synchronous assertion behavior. Real completion, cancellation
and nested-sync fixtures prove exact phase events, point/decision attribution,
zero incomplete transport and no unrelated confidence upgrade.

The lifecycle corpus now gives its publication leader the same bounded
300-second cold-compiler allowance as the compiler transaction itself and
includes captured output in timeout diagnostics; this is not a performance
gate. The focused custom-harness, subprocess and async-attribution gates and a
fresh complete rustc/Cargo/rustdoc/CTFE/nextest/property/oracle corpus are
green. The workspace passes 19 CLI, 19 contract and 290 engine tests,
warnings-denied Clippy, formatting, script syntax, package preflight and diff
safety. No hosted workflow ran. This closes the local custom-harness,
subprocess/background/late-work and cross-thread async assertion slices of R2,
not R2 or Rust promotion. Supported-platform/runtime ecosystem coverage,
remaining presentation modes and the platform/performance/dogfood gates remain
open. The process-per-test path remains the reference oracle, not the final
standard-libtest execution model.

### Exact libtest presentation architecture checkpoint — 2026-08-28

The R2 presentation audit invalidated one earlier promotion assumption. Running
each stock libtest case as an external process gives exact attempt attribution,
but changes process-global state and cannot reproduce stock aggregate capture,
ordering or formatting. It therefore cannot be the public implementation for
ordinary `cargo test`.

An executable real-toolchain spike now builds a replacement from the selected
Rust 1.95.0 toolchain's exact `library/test` source and supplies it through
rustc's explicit `--extern test=...` boundary. The replacement inserts one
callback before stock console handling. Across `--test-threads=1`,
`--show-output`, `--nocapture`, pretty format, quiet output and ignored tests,
the candidate preserves stock exit status, stdout, stderr, capture, scheduling
and shared process state after normalizing only suite time and panic thread ID.

The callback no longer writes the spike's permissive text log. The frozen Rust
model now owns `rust-libtest-event-v1`: a supervisor-created 0600 regular file,
64-byte token-authenticated header, strictly contiguous binary records, bounded
UTF-8 names, token-bound checksums and exact filtered/start/timeout/terminal
events. Unknown kinds/results/flags, wrong token, symlinks, nonzero reserved
bytes, reordering, partial records, invalid semantics and tampering fail closed.
The runtime requires its transport instead of silently disabling attribution.

Production source preparation is also present. It hashes the exact unmodified
toolchain source, rejects symlinks and special/non-UTF-8 paths, requires exactly
one known patch anchor in both `lib.rs` and `console.rs`, embeds the checked-in
event runtime, computes relocation-stable original/runtime/patched identities,
and atomically renames a complete patched tree. A deterministic build plan
requires the selected target libdir's one full `getopts` and `libc` metadata
file. The real differential spike now invokes this production preparer rather
than carrying its own patch implementation.

This closes the event wire, source-preparation and stock-presentation design
spikes, not R2. Before promotion, the companion artifact must be
cryptographically bound to the exact compiler-companion handshake, injected
only into genuine test-harness rustc units, executed once per Cargo artifact
under the shared supervisor, and losslessly joined with probe evidence and
outcomes. Parallel in-process subprocess propagation, fail-fast/timeout
lifecycle validation, crash/partial-event publication and supported-platform
matrices remain open.

### Public JavaScript field-hardening checkpoint — 2026-08-27

Real agent work in Essential SEO found public-frontend defects that would also
invalidate later language frontends if left in the shared engine. They are now
release-blocking regression invariants, traced in
`progress/javascript-field-hardening-2026-08-27.md`.

- Ahead-of-run capability selection is AST- and mapping-shape-driven. It wraps
  only the imported root actually called with a host/guest mapping, preserves
  raw class/callback identity and still detects computed guest paths used by
  opaque ESM/CommonJS launchers.
- Syntactically invariant JavaScript control decisions and TypeScript ambient
  declarations no longer manufacture impossible obligations. Reviewed
  exceptions now cover line, statement, function, branch and MC/DC obligations
  without altering raw measured coverage.
- Expected failures, outcome/kind/runner projections, background loopback
  evidence, transport health, invalid command exits and branch-parent query
  reconstruction are exact and fail closed.
- The public CLI now teaches the full-command/isolated-workspace model, ships
  queryable guides, shows per-kind and E2E gap context, preserves filters in
  every generated command and distinguishes all files from unresolved gaps.
- JavaScript workspaces use an exactly marker-owned non-dotted container so
  framework path semantics are unchanged; cleanup and crash recovery share the
  same ownership predicate.

The checkpoint is closed by local evidence, without hosted workflow use:

- warnings-denied formatting/Clippy and 19 CLI, 19 contract and 277 engine
  tests pass, followed by every public runtime/build/runner integration;
- the full fixture matrix, opaque ESM/CommonJS launchers, four-browser syntax
  matrix and macOS crash/isolation gates pass;
- Test262 selected 41,593 files and preserved all 65,051 baseline-passing
  scenarios with zero transform and zero semantic-equivalence failures;
- the real combined Essential SEO command passed 436 unit and 80 E2E tests in
  one run, reported complete measurement, and attributed 99.96% lines, 99.62%
  branches and 98.86% MC/DC;
- the release transformer measured a 25.66ms median for 500 files (2.566s
  extrapolated to 50,000 files).

The separate R3 end-to-end performance promotion gate remains open: one fair
warm comparison measured 110.45s plain versus 124.06s instrumented (1.123x),
with 0.76s of Supercov setup/publication outside the wrapped tests. This is a
measured optimization backlog, not an unresolved correctness field defect.

### R3 — Make lifecycle and performance release-grade

Optimize the proven architecture, not a partial one.

Work:

- authenticate and incrementally reuse the isolated instrumented workspace and
  Cargo artifacts without stale evidence;
- reduce transformation/setup, cache authentication, runner process and
  evidence-publication costs;
- use compact buffered/mmap-safe observation records and avoid repeated
  identity encoding/compression;
- verify concurrent-run locking, atomic publication, deterministic cleanup,
  retention and recovery from signals, rename failure and ENOSPC;
- benchmark representative small, workspace, macro-heavy and async projects;
- test APFS, common Linux filesystems and NTFS/Windows before claiming those
  native targets.

Exit gates:

- fair cold/cold and warm/warm total runtime at most 1.10x the identical
  uninstrumented command;
- no source/build modification and no terminal work debris after success,
  failure or recoverable interruption;
- evidence/query results remain identical before and after cache reuse;
- query latency and binary-size gates from the master plan remain green.

### R4 — Dogfood to a public Rust release

Use Supercov itself as the primary agent workflow, then confirm generality on
unrelated repositories.

Work:

- run the entire Supercov Rust workspace through the public zero-config path;
- use bounded queries to select gaps, write tests, rerun and verify exact diffs
  and attribution, recording every agent UX defect separately;
- require measurement completeness before interpreting the percentage;
- compare against independent oracle facts and ensure the real checkout is
  byte-identical after every run;
- repeat on unrelated pinned Rust repositories across the supported runner and
  build matrix;
- run the full local suite, corpus, crash and performance gates;
- use one consolidated hosted release matrix and one release only after all
  required native artifacts are available.

Exit gate: Rust support can be enabled without a flag, configuration,
third-party coverage dependency or hidden limitation, and an installed npm
package reproduces the verified local behavior.

## Work after the Rust milestone

Only after R0–R4 pass:

1. finish the owned Python transformer/runtime/pytest frontend using the same
   frozen v3 protocol and development-only coverage.py oracle;
2. add C/C++, then Go and OCaml under the same denominator, semantics,
   attribution, lifecycle, performance and zero-configuration gates;
3. add later JVM, Ruby, PHP and other frontends only when their strongest
   independent oracle and runner identity model are defined;
4. distribute the same Rust binary through PyPI, crates.io/cargo-binstall,
   opam, GitHub Releases, Homebrew and useful C-compatible packaging—wrappers
   may not duplicate analysis or coverage semantics;
5. return to the deferred human query presentation in
   `progress/cli-query-ux-feedback-2026-08-26.md` without changing the stable
   agent JSON contract accidentally.

## Definition of current-goal completion

The current objective is complete only when R0–R4 are all green and evidenced
in this repository. A private prototype, aggregate percentage match, successful
happy-path dogfood run, explicit limitation, or performance promise does not
satisfy a release gate. Any discovered semantic or attribution uncertainty
keeps Rust private and becomes a traced requirement with a reproducing test.
