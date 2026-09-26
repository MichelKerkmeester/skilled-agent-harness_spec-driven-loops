# The binding lattice — 2026-08-29

## Problem

R3 dogfooding found eight distinct generated-code shapes the pre-borrow
binder could not bind (waves 1–8 in
`progress/rust-string-match-binding-2026-08-29.md`). Each one stopped the
build, because an obligation that cannot be bound exactly used to be a
`fatal`. That is the right default for Supercov's own gates and the wrong
default for a user's codebase: a single unknown shape anywhere in a
dependency-shaped macro expansion makes the tool unusable, and the shape
space of generated Rust is effectively open.

The waves also shared one root cause worth stating plainly: the binder
*reconstructs* the HIR→MIR correspondence after the fact (spans, dominators,
literals, discriminants) wherever identity-carrying markers were not already
injected. Every reconstruction heuristic has a blind spot, and each blind
spot is a wave. Marker-first binding is the long-term elimination of the
class; the lattice is what makes the remaining blind spots non-fatal.

## Decision

An obligation now degrades instead of failing the build:

- **exact** — bound through injected identity, exact vectors as today;
- **structural** — bound through the structural marker path (coverage-off
  bodies, CTFE owners), still exact;
- **unbound** — the body is left uninstrumented and the obligation is
  recorded as an explicit `RUST_OBLIGATION_UNBOUND` limitation naming the
  phase, the exact definition and the binder's own diagnosis.

The guarantee changes from "every number is exact or the build fails" to
"every number is exact or explicitly marked unmeasured". That is not a
weaker honesty claim: nothing is ever silently approximate, and an unbound
obligation must never be reported as *uncovered* — an unmeasured branch and
an uncovered branch are different facts and conflating them would be the
lie this design exists to prevent.

Degradation is per body: the failing body loses instrumentation, every other
body in the crate keeps exact measurement. `mir_built` returns the original
untouched body, so a degraded body carries no partial markers.

## Strict mode

`SUPERCOV_RUST_STRICT_BINDING=1` restores the old behavior and every corpus
compile sets it. Supercov's own gates must keep failing hard on an
unbindable shape, or the corpus would silently degrade instead of proving
exactness, and we would lose the discovery signal that produced waves 1–8.
An empty value counts as unset so a single gate can opt out.

## Why the degradation path is itself gated

`SUPERCOV_RUST_FORCE_UNBINDABLE=<substring>` treats every matching body as
unbindable. The corpus uses it to prove, in one crate, that:

- the lattice build succeeds and records the exact unbound limitation;
- an unrelated body in the same crate keeps its obligations;
- the strict build fails and names the same obligation.

An untested degradation path would be precisely the silent wrongness the
lattice is meant to prevent, so it is proven on demand rather than assumed.

## Mechanics

`BINDER_LIMITATIONS` collects degradations during MIR passes.
`after_analysis` forces `optimized_mir`/`mir_for_ctfe` for every body while
collecting obligations, so all degradations are recorded before the manifest
candidate is serialized; the merge happens after that loop (merging before
it silently produced empty limitations — the first version of this change
had exactly that bug).

## Consequences for iteration speed

Lattice mode turns discovery from serial into parallel: a probe run no
longer stops at the first unbindable shape, it compiles everything and
reports *every* remaining shape at once. That makes an overnight shape
miner over external crates worthwhile — one run enumerates the remaining
shape space instead of one wave per attempt.

## Follow-ups

- Per-obligation unmeasured buckets in the analyzer and report (three-way
  covered / uncovered / unmeasured) so one degraded body does not flip a
  whole run to `coverage_complete = false`. Today any limitation does.
- Degrade per obligation rather than per body, so eight bound match groups
  survive when the ninth cannot bind.
- Report the exact fraction as a released metric so the shape space is
  visibly ratcheting toward total exactness.

## Bug found by gating the lattice: symlinked source roots measured nothing

Adding the lattice gate to the corpus surfaced a real product defect. The
gate crate lives in the corpus scratch directory, which macOS reaches through
the `/var` -> `/private/var` symlink, and it produced no manifest at all:
every obligation was recorded as
`RUST_SOURCE_IDENTITY_UNRESOLVED: unowned external source`.

Cause: source ownership compared paths lexically. `normalized_path` only
removes `.` and `..`; it never resolves symlinks. rustc reports the physical
file path (`/private/var/...`) while `SUPERCOV_RUST_SOURCE_ROOT` carried the
symlinked spelling (`/var/...`), so `strip_prefix` failed and every authored
file was classified external. `package_identity` already canonicalized for
exactly this reason (see the `RCV-GENERATED-1` traceability row), so
ownership disagreed with itself depending on which check ran.

Impact: any project reached through a symlinked path — macOS `/tmp` and
`/var`, symlinked worktrees, some network mounts and home directories —
measured nothing, while still compiling and reporting successfully.

Fix: `root_relative` keeps the lexical comparison as the fast path and falls
back to comparing canonical physical paths, matching `package_identity`.
The lattice gate now doubles as the regression test, because owning that
crate's obligations at all requires physical containment to work.

## What the shape miner found (first runs)

The miner compiles a shape-dense dependency set in lattice mode with the
source root pointed at the registry checkout, so every downloaded crate's own
source is owned and reaches the binder. Three findings in the first runs:

1. **The lattice was incomplete.** Only the pre-borrow sites had been
   converted, so a real shape in `proc-macro2`'s build script still stopped
   the build. All binder and injection sites are converted now; the surviving
   `fatal`s are I/O and rustdoc-catalog integrity, where measurement is
   genuinely impossible.
2. **A defect introduced by the lattice itself.** Degrading try-operator
   binding to an empty map left downstream marker code indexing that map,
   panicking with `no entry found for key`. Degraded phases now skip their
   obligations instead of assuming an entry exists. Worth noting the failure
   mode: a compiler *panic* is not covered by the lattice at all, so
   degradation must never leave a partially-populated data structure behind.
3. **Four distinct shapes enumerated in one crate in a single pass** — the
   parallel discovery the lattice was built for, against one shape per
   multi-hour dogfood before it.

## A second category: invariant violations, not blind spots

The miner then surfaced a different class, and it should not be degraded
reflexively:

- `Rust branch aggregation mismatch` fires when two obligations hash to the
  same stable ID but carry different content (kind, discriminator,
  alternatives or parent arm). That is an *identity* defect: if it were
  ignored, two distinct branches would merge under one ID and report a
  single wrong number. It fired on `bytes`, so the ID derivation has a real
  collision case in real code, and that is worth fixing rather than
  degrading.
- `has no Rust decision kind for X` is the opposite — an authored control
  shape we do not model yet, which is an ordinary lattice case.

The rule to apply when converting the rest: degrade *shape* problems (we
cannot bind this construct), fail on *environment* problems (our own runtime
or evidence path is broken), and treat *identity* problems as bugs to fix
first — degrading them only as a safety net, and never by merging the
colliding obligations.

## The `bytes` aggregation mismatch: visit metadata treated as identity

The miner's `Rust branch aggregation mismatch` on `bytes` turned out to be a
regression, and the first hypothesis was wrong in an instructive way.

An authored obligation's canonical ID deliberately excludes the def path and
the owner-local ordinal, so one macro's body aggregates into a *single*
obligation across all of its invocations. The natural suspicion was therefore
`parent_match_arm` (added in wave 2), which genuinely does describe the
callsite rather than the obligation. Making the error self-diagnosing settled
it immediately: the differing field was `alternatives`.

`StableObligationIdentity` carries `owner_local_ordinal`, a visit counter that
advances on every recorded obligation. Two invocations of the same macro
therefore produce identical IDs and canonical strings but different counters,
and aggregation compared whole identity structs — so it reported a mismatch
between two recordings of the very same alternative. Aggregation now compares
semantic identity only (each alternative's stable ID and label).

The `parent_match_arm` change was kept anyway on its own merits: it is a
binding *hint* that narrows a search, so when two invocations disagree the
honest response is to drop the hint and fall back to sequential ranking, not
to fail.

Fixture: one macro invoked twice in the same function pins the aggregation
path. Writing it also surfaced an unrelated unbindable shape — a macro
invocation forming an entire match-arm body degenerates the span-located
planner exactly like the wave-5 derived `PartialOrd` case. That is tracked
separately rather than being absorbed by the lattice, because real code hits
that pattern constantly and it deserves an exact binding.

## Miner run 4: 11 crates, 22 shapes, and one model inconsistency

With the lattice covering every binder and injection site and the branch
aggregation fixed, the miner reached 11 crates and enumerated 22 distinct
unbindable shapes in a single pass (`bytes` alone contributes decision-probe,
try-operator and statement-probe shapes). That is the intended behavior:
shapes are now a ranked worklist rather than a sequence of build failures.

The run also stopped on a `decision aggregation mismatch` in `itoa`, and the
self-diagnosing message named the differing fields immediately:
`assertion-source,outcome-branch`.

The cause is a model inconsistency rather than a binder blind spot. A
decision's identity is derived from the assertion condition's own span, which
for macro-expanded code is the macro body and therefore invocation
independent. Two of its recorded parts are not: `assertion_source` comes from
`expression.span.source_callsite()`, and the outcome branch is recorded at a
callsite-dependent span. One `assert!`-bearing macro invoked at two callsites
therefore produces a single decision ID carrying two different callsite links,
and neither recording is wrong.

Interim behavior: the conflict degrades instead of failing. The first
recording is kept — never merged with the second, since merging is exactly the
silent wrongness to avoid — and a `RUST_OBLIGATION_AGGREGATION_AMBIGUOUS`
limitation records it. The obligation's condition set and vectors are
identical either way; only its callsite link is ambiguous, which is what the
limitation says. Strict binding still fails hard.

The real fix is a semantic decision, tracked separately: either every recorded
part becomes invocation-independent to match the ID, or macro-expanded
obligations get per-invocation identity. The choice determines whether a macro
body reports one aggregated number or one per expansion site, and it changes
obligation IDs and the `repeated_expansions` corpus expectations, so it is not
a patch to make in passing.

## Closing the honesty gap the lattice opened

The lattice let unbindable code compile, but it left a defect behind that the
north star names explicitly: a declined obligation still appeared in the
manifest with no hits, so the analyzer counted it as **uncovered**. That is a
measurement gap reported as a coverage gap — a wrong number, and wrong numbers
get trusted. It was introduced by the lattice itself.

The fix runs end to end:

- The wrapper records the exact obligation IDs it declines
  (`UNMEASURED_OBLIGATIONS`) and publishes them as `unmeasuredObligations`;
  the manifest candidate schema moves to v4.
- Declining is per body, not per phase. Once any phase of a body fails to bind
  we cannot prove which of its probes still fire, so the whole body is
  declined. Over-declining only under-reports coverage; under-declining would
  recreate exactly the defect above.
- The analyzer removes declined obligations from the covered/uncovered
  denominator and reports `unmeasuredObligations` alongside
  `exactFractionPct` — the share measured exactly, which is the number that
  must ratchet toward 100 and never regress.
- Both fields are omitted when nothing was declined, so a fully exact run
  serializes byte for byte as before and no existing consumer sees a change.

A unit test pins all four properties, including the byte-identical
serialization of a fully measured summary. The compiler route carries the
declined set through `normalize`; the legacy source-rewriting route has none
by construction.

Still owed: an end-to-end corpus gate proving a wrapper-declined obligation
arrives in the report as unmeasured rather than uncovered. The unit test
covers the analyzer and the lattice gate covers the wrapper, but the seam
between them is exactly where a defect would hide.

## What the seam gate found immediately

Writing the end-to-end gate (wrapper declines an obligation -> it arrives in
the manifest as unmeasured) failed on its first run, and the failure was real:
the declined body's `rs:function:` obligation was never declined. Function
identity occupies owner-local ordinal zero and is recorded outside the
per-body collector, so the marking missed it, and every uninstrumented body
would still have reported its function-entry obligation as uncovered — the
same defect the change had just fixed, surviving in the one corner not
checked.

Both sides of that seam were green: the analyzer had a passing unit test and
the wrapper had a passing lattice gate. Only the assertion that crossed
between them found the gap. Declining a body now covers all five obligation
kinds.

## Note on the wave-9 relaxations and the misbind invariant

Every wave-9 fix made binding more permissive: containment as a fallback when
a terminator span collapses, accepting either the expanded or callsite span
for a try operator, and accepting a pattern switch in either lowering shape.
Each relaxation is a potential misbind source, so each keeps the property that
matters: candidates must still resolve to exactly one match, and ambiguity
still fails closed rather than picking one. The pattern-switch binder
explicitly declines when the recorded variant is not among the tested values,
rather than guessing an edge.

That reasoning is currently held by review, not by a machine check. A
differential oracle against rustc's own branch mappings would catch a misbind
automatically wherever both exist, and is tracked separately.

## Precision of declining, and the first real exactness number

Declining a whole body is the correct conservative rule for a binder failure:
once a phase cannot be bound we cannot prove which of that body's probes still
fire. It is the wrong rule for an uncompiled construct, which is identified
exactly. Splitting the two took `bytes` from 98.68% to 99.68% exact — 29
declined obligations down to exactly 7, one per cfg-eliminated statement, with
no collateral. The unmeasurable marker carries its obligation ID through an
explicit constructor/parser pair rather than ad-hoc string parsing.

`bytes` is now the first real third-party measurement: 2199 obligations, zero
binder blind spots, and the entire remainder explained as code this target
does not compile.

Two traps worth remembering from taking that measurement. `Finished` is not
evidence — cargo had not rebuilt the crate at all on the first attempt. And
`SUPERCOV_RUST_COMPILER_OUTPUT` must be absolute: cargo runs a dependency with
its own directory as the working directory, so a relative path sends that
crate's manifest into the registry checkout and leaves an empty output
directory that reads exactly like "nothing to report".

## Misbind detection: the obvious oracle is vacuous

Diffing Supercov's bindings against rustc's own branch mappings sounds like
the natural check for the never-misbind invariant, but it only applies where
rustc supplies mappings — and on that path Supercov's binding is derived from
those mappings, so it compares a thing to itself. The misbind risk lives in
the fallback paths, which exist precisely because rustc gives no mapping
there.

What would reach it: structural post-conditions on each binding (the chosen
switch dominated by the decision's entry and dominating its outcome, distinct
true/false targets, no two obligations sharing a switch edge), cheap enough to
run on every compile; and an execution differential against
`-C instrument-coverage` counts for the same run, which is the strongest
available check and does cover the fallbacks.

## A crash the lattice could not catch

Converting the injection sites to degradations was done by rewriting many call
sites at once, and in `mir_drops_with_structural_probes` that produced
`return body;` paths *after* `body.steal()`. Returning an already-stolen
`Steal` makes rustc panic with "attempt to steal from stolen value", which
killed `proc-macro2` outright.

Two things this is worth remembering for:

A panic is not covered by the lattice at all. There is no limitation, no
degradation and no report — just a dead build. Every degradation path must
therefore leave the compiler in a state it can still use, which is a stronger
requirement than merely returning an error.

Returning the partially instrumented body would have been worse than the
crash. Half-applied markers produce evidence we cannot justify, and wrong
numbers outrank broken builds in the priority order. The fix keeps a pristine
copy taken immediately after the steal, so a decline returns exactly the
uninstrumented body.

This is the second defect tonight introduced by mechanically rewriting many
call sites (the first left a half-populated map that panicked on lookup), and
both were found only by compiling real third-party crates rather than by the
type checker or the corpus.

## Unmeasurable, second case: an arm that cannot complete

`once_cell` uses the `match void {}` idiom on an uninhabited type, and such an
arm lowers to no blocks of its own. The first attempt reused the span-overlap
test from the cfg-eliminated case and silently did not fire: the enclosing
match's spans overlap the arm's range, so "no MIR overlaps it" was simply not
true.

Rather than widen the heuristic until it passed, the arm obligation now
records a fact about the program instead of a guess about spans: whether the
arm body's type is uninhabited, taken from typeck at HIR time. `match void {}`
has type `!`, so the arm provably cannot complete, and an arm that cannot
complete is unmeasurable rather than unbindable. A loosened span rule could
have misfired on a real binder miss; a type cannot.

once_cell: 493 obligations, 98.99% exact, the five declined being exactly
those arms.

## Measured crates so far

| crate | obligations | exact | declined |
|---|---|---|---|
| bytes | 2199 | 99.68% | 7 cfg-eliminated statements |
| once_cell | 493 | 98.99% | 5 uninhabited match arms |
| proc-macro2 | 2108 | 94.59% | 6 bodies, half from one aggregation question |

proc-macro2's largest remaining family is not a binder defect: `next_ch!`
contains a match and is invoked twice in the same function, so one aggregated
obligation faces two independent MIR structures and only one can be bound.
That is the aggregation semantics decision, recorded with evidence rather than
guessed at.

## Containment must be a fallback, not an equal alternative

`http` exposed a defect in the wave-9 collapsed-span fix. That change admitted
a switch whose range is contained in the condition's range, to handle spans
that collapse to a point — but it admitted containment *simultaneously* with
exact matches. In `HeaderMap::find` the condition's own switch sits at
13349..13402 and a nested switch sits at 13349..13357, so both matched and the
pair failed as ambiguous.

Exact matches now win outright; containment applies only when nothing matches
exactly. The uniqueness requirement still fails closed on real ambiguity. This
is worth remembering as a general rule for the binder: a relaxation added for
one shape has to be ordered below the precise rule it backs up, or it competes
with it.

http: 3657 obligations, 90.32% exact.

## Marker-first has a prerequisite

Marking every match group pre-borrow — the direction that would eliminate the
degenerate-span family (28 occurrences in syn, derived PartialOrd, macro-bodied
arms) — was attempted and reverted. Two findings:

`synthetic_groups` feeds guard-condition markers as well as arm markers, so
widening both records a guard condition twice. Only arm marking should widen;
that part works.

The blocker is that the pre-borrow binder is weaker than the span planner for
macro-generated authored groups. `generated_match` binds today by span but
reports "0 structurally valid arm chains" once marked, because its spans
collapse to the macro body and chain walking cannot recover arm order. So
marking everything currently makes some groups worse. The prerequisite is for
`synthetic_match_candidates` to bind collapsed authored groups as reliably as
the span planner does.

## Miner run 8: 157 crates, and what the ranking says

Unblocking http, log and the CTFE marker path let the miner reach 157 crates
in one pass, up from 23. At that scale the ranking is decisive rather than
anecdotal, and it says the remaining work is concentrated in two families:

- **350 occurrences** of "match arm entry edge was not found", across axum,
  axum_core, h2, hyper_util and tracing. This is the macro-aggregation
  question: a macro containing a match, invoked more than once in one function
  body. All invocations are one obligation, they lower to independent MIR
  structures, and only the first can be bound. proc-macro2's `next_ch!` was
  the first instance; it is plainly a common idiom.
- **59 occurrences** in `either` of the degenerate-span family, which needs
  the marker-first prerequisite.

Everything else is a long tail: winnow decision probes at 39, tracing
statement probes at 31, and so on.

The useful conclusion is that the biggest remaining obstacle to universality
is not a binder defect at all. It is a semantic decision about what a
twice-expanded macro's branch means — one number covered when either
expansion takes it, or one number per expansion site — and no amount of
binder work substitutes for making it.

## Marker-first, measured

The dual-span candidate fix (candidates offering both the expanded span and
the callsite, mirroring the wave-9 try-operator defect) unblocked the
marker-first experiment, and two further prerequisites fell out of trying it:
guard conditions must keep the narrow marking rule or they get recorded twice,
and marker survival must be required only for arms that still exist in the
pruned obligations, because markers are placed before rustc prunes the arms it
proves unreachable.

With all three in place the widening was measured rather than assumed:

| crate | before | after |
|---|---|---|
| either | did not compile | 350 obligations @ 94.57% |
| once_cell | 98.99% | 100.00% |
| bytes | 99.68% | unchanged |
| log | 90.24% | unchanged |
| proc-macro2 | 94.59% | 86.62% |

It was reverted for the last row. The regression is six authored match groups
that the span planner binds today and the pre-borrow chain walk cannot, so
marking them makes them decline. Marker-first remains the right direction —
it eliminates a 59-occurrence family and takes once_cell to 100% — but the
pre-borrow binder has to be a full replacement for the span planner first, and
the exact fraction must never regress for any crate.

Those six groups are now the specification for the next step, and they are
reproducible in seconds via the pm2-repro crate.

## The never-misbind invariant gets its first automatic check

Until now the invariant that outranks everything was held by reasoning and by
fail-closed uniqueness at each binding site. That is not enough on its own: a
misbind produces confident wrong numbers rather than no numbers, so the
fail-closed paths never exercise it, and every relaxation added for one shape
widens the space where one could hide.

Decision bindings now carry structural post-conditions. No condition may select
the same block for both outcomes, and no two conditions may claim the same
switch edge — two conditions can only share a switch if they are the same
condition, so a repeat means at least one binding is wrong. They run on every
compile, including the corpus.

They pass on the fixture and on bytes, once_cell, proc-macro2, http, log and
either. A clean pass is exactly the kind of result that can be vacuous, so the
check is proven by fault injection (`SUPERCOV_RUST_FORCE_MISBIND`) and gated in
both directions: strict binding fails naming the duplicated edge, and lattice
mode declines the body, so a *suspected* misbind never produces numbers.

Chasing that also exposed a latent trap in the older fault injection: an empty
`SUPERCOV_RUST_FORCE_UNBINDABLE` made `definition.contains("")` true for every
body, silently declining everything. Empty now means unset for both injections,
matching the strict-binding flag.

Still open for this invariant: the execution differential against
`-C instrument-coverage` counts, which is the only check that would catch a
misbind whose structure is locally plausible.

## Match bindings get the same treatment

Two arms of one group are alternatives: they cannot both be entered, so they
cannot share an entry block, and an arm cannot list its own entry as a
selection source. Those post-conditions now run on every compile alongside the
decision ones, pass on the fixture and on bytes, once_cell, proc-macro2, http
and either, and are proven able to fire by the same fault injection.

Both halves of the automatic check are gated in strict and lattice directions.
Strict names the duplicated edge or shared block; lattice declines the body, so
a *suspected* misbind never produces numbers — which is the point, since a
misbind is the one failure mode that yields confident wrong numbers rather
than none.

What these checks cannot catch is a misbind that is locally plausible: one
binding, no collision, no self-reference, but attached to the wrong switch.
Only the execution differential against `-C instrument-coverage` counts
reaches that, and it remains the last piece of this invariant.

## Marker widening, targeted correctly

The earlier attempt marked every match group and regressed proc-macro2, so it
was reverted with the finding written down. Returning with that data, the
right cut was narrower: mark **macro-expanded** groups regardless of coverage
eligibility (synthetic-expansion and authored-expansion alike), and leave
plain authored matches to the span planner.

That is principled rather than tuned. Span degeneracy is a property of macro
expansion — collapsed bodies, derives, generated code — while plain authored
code has real distinct arm spans that the span planner handles correctly and
the chain walk cannot. The pre-borrow binder never needed to replace the span
planner wholesale; it needed to cover exactly the cases where spans collapse.

| crate | before | after |
|---|---|---|
| proc-macro2 | 94.59% | 95.54% |
| http | 90.32% | 92.64% |
| bytes | 99.68% | unchanged |
| once_cell | 98.99% | unchanged |
| log | 90.24% | unchanged |
| either | 94.57% | unchanged |

No crate regressed, and the fixture stays strict-green. The general lesson is
that the failed wide experiment was worth more than a success would have been:
it produced the measurement that showed where the real boundary lay.

## Declining is scoped to what the failed phase actually cost

The per-crate baseline made a defect visible that no single-crate run could:
`zmij` declined 368 of 593 obligations — 37.94% exact — from **eleven**
limitation entries, and `either` declined 79 obligations from about five
bodies. The bodies were large and the failures were narrow. Whole-body
declining, the conservative rule adopted when the lattice was introduced, had
become the dominant cost of exactness in the whole corpus, larger than every
binder fix in this file recovered.

The conservatism was not justified. Reading the call sites rather than
reasoning about them shows two distinct failure shapes:

- a **bind** phase that fails degrades its own plan list to `Vec::new()` and
  falls through — the body still instruments its other kinds, and those probes
  still fire;
- an **inject** phase that fails returns the pristine body, so nothing is
  instrumented at all.

The distinction is a property of the call site and not of the phase name: two
`bind ...` sites abandon the body, and two `inject Rust CTFE ...` sites
continue with a partially instrumented one. So `DeclineScope` is passed
explicitly at all 46 call sites rather than derived from the phase text, and a
new call site has to state what its failure costs.

Ownership within a body follows the plan that instruments it. A decision owns
the branches carrying its outcome, its loop back edge and its logical
selections; a match group owns its arms' branches and guard decisions. Those
are declined with their owner and stay measured without it.

| crate | before | after |
|---|---|---|
| zmij | 37.94% | 63.07% |
| either | 77.43% | 96.86% |
| build_script_build | 17.14% | 50.71% |
| tracing_attributes | 88.56% | 96.72% |
| serde_json | 91.98% | 98.71% |
| http | 90.32% | 93.25% |
| proc_macro2 | 94.59% | 97.49% |
| syn | 94.01% | 96.32% |
| serde_core | 95.13% | 97.65% |
| serde | 95.79% | 97.76% |
| tracing_core | 97.72% | 98.99% |
| tracing | 95.62% | 95.89% |

Twelve crates gained, none regressed, across all 18 measured.

This change declines *less*, which is the direction that can turn an
unmeasured obligation into a reported-uncovered one — the wrong number the
whole design exists to prevent. So it is proven rather than argued.
`SUPERCOV_RUST_FORCE_UNBOUND_DECISIONS` fails only the decision bind phase of
a chosen body, reproducing the exact shape that dominates the corpus, and the
lattice gate requires that the same body's statements, match group and arm
branches stay measured while the decision and the one branch it owns are
declined. Two obligations declined out of eleven, where the old rule declined
all eleven.

The first run of that gate passed for the wrong reason — a stale cargo target
directory served a cached rlib, so the wrapper never ran and the manifest was
the previous one. Same false-green mechanism as earlier in this work; a gate
that cannot recompile must fail loudly rather than read whatever is on disk.

## Why zmij's decisions decline: counters are not the coverage graph

zmij is the worst-exactness real crate at 63.07%, and all seven of its
decision-bind failures read

    coverage block N for rs:decision:... maps to 0 MIR blocks

The binder indexes coverage basic blocks by scanning the body for
`CoverageKind::VirtualCounter` statements. Extending the diagnosis to list
which BCBs *do* carry a counter settled the cause immediately: the missing one
is always a lone interior gap in an otherwise dense run — bcb 25 missing from
`[0..24, 26, 27]`, bcb 7 from `[0..6, 8, 9]`, bcb 43 from `[0..36, 50..59]`.

Nothing was optimised away and the mapping logic is sound. rustc minimises
physical counters: a BCB whose count follows arithmetically from other
counters carries no counter statement at all. Counter statements are a lossy
projection of the coverage graph, and the binder was treating them as the
graph itself. These decisions are compiled and do execute, so this is not the
unmeasurable class — it is exactness being lost to a wrong assumption.

The obvious repair does not survive contact. Deriving the uncounted side from
the unique two-way switch that reaches the known target — requiring the
recovered block to be entered by that edge alone — gains nothing and produces
wrong bindings: three of the seven then failed the misbind post-condition with
`condition 1 bound the same switch edge (1, 2, 3) as condition 0`. A
decision's conditions may legitimately share a target, since `a && b` sends
both false edges to the same block, so a whole-body search finds a switch
belonging to a different condition. The post-condition caught it, which is the
invariant earning its keep, but plausible is not provable and it was reverted.

The first-principles direction is to reconstruct the coverage graph the way
rustc builds it, from the MIR CFG, rather than infer it from counters. That
yields every BCB, not just the counted ones, and it comes with its own proof:
every BCB that does carry a counter must land on that counter's block. Making
that agreement a hard post-condition — decline the body if the reconstruction
disagrees anywhere — is what turns the recovery from plausible into provable.

## Cost, not frequency, decides what to fix next

Two waves in a row ranked work by how often a limitation fires and were wrong
both times. The `either` shape — `match arm entry bbN has no external incoming
edge` — fires 66 times and looks like the largest remaining blind spot, but it
costs 11 obligations: the generic `AsMut<Target>` impl is instantiated for many
targets that share one authored source, so all 66 failures collapse onto a
handful of obligation identities.

Attributing declined obligations to limitations by definition name gives the
ranking that matters. Cost first, occurrences second:

| cost | count | family |
|---|---|---|
| 1107 | 114 | bind pre-optimization match probes |
| 1010 | 40 | bind Rust decision probes |
| 673 | 15 | bind Rust statement probes |
| 645 | 18 | bind Rust logical-selection probes |
| 587 | 108 | NOT_COMPILED statements (legitimately unmeasurable) |
| 368 | 49 | inject pre-optimization match probes |
| 259 | 3 | inject Rust decision probes |

Three `inject Rust decision probes` failures cost more than the entire either
family, because an inject failure returns the pristine body and declines
everything in it.

## Injection phases rewrite the edges later phases recorded

Those three failures are one shape, and it is not a binding defect.
`Punct::new` matches a 22-alternative or-pattern arm, and its decision plan
recorded the true edge `bb0 -> bb2`. By the time decisions are injected:

    bb0 now targets [bb8 x22, bb1], whose own successors are
    [(bb1, [bb4]), (bb8, [bb7])], reaching bb2

Twenty-two identical targets is a match-arm bridge — match injection correctly
installs one block recording "this arm was taken" for all 22 entry edges — and
the original target now sits behind a chain of our own bridges. Decisions are
injected after match arms and loop frames, so the phase looks for an edge that
an earlier phase already rewrote, and gives up.

The first hypothesis, a single intervening block, was tested and refuted: the
one-hop reachability set came back empty. The diagnosis was extended a second
time rather than a fix guessed at, which is what turned "edge was not found"
into a cause.

The repair needs no heuristic, because we create every bridge ourselves: keep a
map from each inserted bridge to the edge it replaced, and have later
injections resolve recorded edges through it, requiring the resolved chain to
consist only of blocks we inserted and to terminate at the recorded target.

## The injection phase that rewrote its own edge

Three inject-decision failures cost 259 obligations — the most per occurrence
of any family, because an inject failure returns the pristine body and declines
everything in it. Finding the cause took four diagnostic rounds, and rounds
three and four each moved the fix to a different function than the previous
round implied. That is worth recording, because every round in between looked
like enough to act on.

1. "condition 0 true edge from bb0 was not found" — no cause, just a symptom.
2. Testing for a single intervening block returned an empty reachability set,
   refuting the obvious reading.
3. Following the bridge showed a chain, `bb0 -> bb8 -> bb7`, and 22 identical
   targets — the signature of a match-arm bridge.
4. Snapshotting the CFG after each phase showed the edge surviving both match
   arms and loop frames untouched:

       [("before injection", [bb2 x22, bb1]),
        ("after match arms", [bb2 x22, bb1]),
        ("after loop frames", [bb2 x22, bb1])]

`instrument_runtime_decisions` rewrites it itself. Two decision obligations
legitimately claim the same CFG edge; the first injected redirects it, and the
second finds nothing to replace and declines the whole body.

A first repair was built on round three's reading — a bridge map populated in
`instrument_runtime_matches` — and reverted: it compiled, changed nothing, and
was keyed in a function that turns out to be uninvolved. The working fix is
local to one function: record `(source, replaced_target) -> bridge` at the
existing replacement site, and when a later plan finds nothing to replace, walk
that map until the source targets the result, bounded by the map size.

This is semantically right rather than merely effective. When two obligations
observe one edge, both probes *should* fire, and a keyed chain makes them fire
in order on exactly that edge and no other. The unkeyed alternative — walking
appended blocks until the chain reaches the target — was rejected: a bridge
deliberately collects every edge between its pair, so it would place a probe
where edges the decision never claimed also arrive. It would have worked in
`Punct::new`, where all 22 edges share an outcome, and been wrong in general.

| crate | before | after |
|---|---|---|
| syn | 96.32% | 97.88% |
| proc_macro2 | 97.49% | 97.77% |

No crate regressed across the 18 measured. The gain landed with the exactness
ratchet as its guard rather than a dedicated fixture: which source construct
makes two decision plans share an edge is not yet established, and encoding
that guess as an assertion would be worse than recording the gap. Task #32
carries the method for establishing it.

## A regression that was the report becoming honest

Statement-probe binding aborted on its first failure. That looked like a
tidiness question and was a wrong-number defect: when the first failing
statement was unmeasurable, `runtime_statement_plans` returned `Err`, so the
caller emptied the plan list and *no* statement probe was injected anywhere in
that body, while `degrade_unbound_obligations` saw the UNMEASURABLE marker,
declined only the obligation it named, and returned before applying
`DeclineScope::Statements`. Every other statement in the body was therefore
uninstrumented, never fired, and was reported as **uncovered**. Live
behaviour: tracing_attributes carried 19 such statements, serde_core 10,
bytes 8.

Binding every statement that can be bound and declining only the failures
repairs it, and is worth a great deal besides — zmij 63.07% to 77.57%,
build_script_build 50.71% to 70%, http, tracing_core, tracing and three more.

The defect was found only because the fix was reverted first. The ratchet
reported bytes, serde_core and tracing_attributes going backwards, and the
change was withdrawn on that signal. Diffing the limitation families showed
every added decline was `RUST_OBLIGATION_NOT_COMPILED`: aborting on the first
failure meant only the *first* uncompiled statement per body was ever
discovered, so the exact fraction fell precisely because the report had become
more honest. All three crates carry zero `UNBOUND` statement declines, so no
part of those decreases can be a binder failure.

The lesson is about the gate, not the binder. The ratchet exists to enforce
the north star's first property, and it could not distinguish *losing
exactness* from *gaining honesty* — so it vetoed a correctness fix and would
have vetoed the next one. It now records per-crate uncompiled counts and
permits a decrease only when newly declared uncompiled constructs account for
it, reporting `honesty:` rather than `REGRESSION:`. Until the baseline stored
those counts the exemption compared against zero and was permissive by
construction; the re-baseline made it real.

When a gate blocks a change, the gate is a hypothesis too.

## One rewrite, two stages, five wrong turns

Logical-selection binding aborted on its first failure, declining every branch
obligation in the body — 645 across the crate set. The failures themselves are
correct: `cfg!(feature = "full") && input.peek(..)` has a constant left
operand, rustc folds it, and no branch region exists. Only the collateral was
wrong.

Declining per branch instead gained syn and http and collapsed
build_script_build from 70% to 37.86%, through a single new
`inject Rust decision probes` limitation — an inject failure returns the
pristine body, so one limitation cost 45 of 140 obligations.

Finding out why took five attempts, and every wrong turn came from reading
part of a diagnostic that was complete on the first run:

    condition 0 true edge from bb86 to bb87 was not found;
    bb86 targeted [("before injection", [bb88, bb87]),
                   ("after match arms", [bb139]), ...];
    bb86 now targets [bb139], whose own successors are
    [(bb139, [bb138, bb137])], reaching bb87

Edge invalidation in general, refuted by inspection. Match bridges, refuted by
measurement when a cross-phase bridge map changed nothing. The two
`mem::replace` relocation sites, refuted by checking their enclosing functions
— one is never called from this path, the other runs after the snapshot that
already shows the change. Then a relocation map alone, which also changed
nothing.

`instrument_runtime_matches` applies **two** rewrites, and a recorded edge can
be subject to both. Arm bridging interposes a block on an edge. The
selection-start split then takes the whole terminator out of the block and
pushes it into a fresh one, leaving a call behind. So `bb86 -> bb87` became
`bb86 -> bb139 -> bb13x -> bb87`: resolving only the relocation stops at
`bb139` where `bb87` is still not a successor, and resolving only the bridges
never leaves `bb86`, which no longer holds a switch at all.

The order matters and is not symmetric. Arm bridging runs first, so its keys
are stated in terms of the block as it was *before* the split — the target
resolves against the original source. The split runs second, so the source
resolves last. Reversed, the lookup finds nothing.

| crate | before | after |
|---|---|---|
| build_script_build | 70.00% | 71.43% |
| syn | 97.92% | 98.43% |
| http | 94.86% | 95.05% |

The trailing `reaching bb87` clause named the second stage from the very first
run. It was read past three times. The lesson is not about this binder: a
change that measures neutral on its own may be half of a fix rather than a
wrong one, and the cross-phase bridge map was exactly that.

## FAST, measured for the first time

The north star's third property had no numbers attached to it at any point in
this work. It does now, and they are a long way from the target.

Cold `cargo build -j 4` of a 13-dependency probe crate (serde_json, serde,
syn, quote, proc-macro2, tracing, bytes, http, either, once_cell, log, itoa,
memchr), fresh target directory on both sides:

| wrapper | wall | user | vs baseline |
|---|---|---|---|
| none | 4.38s | 8.81s | — |
| debug build | 28.58s | 68.98s | 6.5x |
| release build | 21.35s | 52.05s | **4.9x** |

The target is ≤1.10x. Optimising the wrapper moved 6.5x to 4.9x, so the
unoptimised driver explained part of the gap but nowhere near all of it.

User time grows faster than wall time — 8.81s to 52.05s against 4.38s to
21.35s — so the cost is CPU spent in the wrapper rather than serialisation.
Parallelism is not the bottleneck; the per-body analysis is.

What this does **not** measure, and none of it is known: test execution
overhead with probes firing, the warm content-addressed cache path that the
north star relies on for "warm runs in seconds", a large workspace, the
release profile, or the cost of per-test attribution across threads and
subprocesses. Four separate budgets, one of them now measured.

The honest position is that ≤1.10x cold compile is not close, and it is not
yet known whether it is reachable or whether the gate wants restating in terms
the architecture can meet — cold build overhead X, warm build near zero,
runtime overhead Y. That is a decision to make on evidence once the warm path
and runtime overhead exist, not before.

### Warm and incremental

| scenario | baseline | instrumented | overhead |
|---|---|---|---|
| cold, everything from scratch | 4.38s | 21.35s | **4.9x** |
| warm, no-op rebuild | 0.05s | 0.04s | none |
| incremental, local crate edited | 0.06s | 0.08s | *not measured* |

The no-op result matters: cargo's own caching means an unchanged rebuild pays
nothing, so 4.9x is a once-per-clean-build cost rather than a per-invocation
tax. That is a materially different thing from a 4.9x tool.

The incremental row is honest about being empty. The probe crate's `lib.rs` is
a one-line stub, so editing it recompiles almost nothing and instruments
almost nothing — the numbers are real and mean nothing. What a developer
actually feels is recompiling *their own substantial crate* while its
dependencies stay cached, and that measurement does not exist yet. It is the
one that decides whether the overhead is tolerable in practice, and it needs a
crate with real code in it.

Nor does any of this cover test execution with probes firing, which is a
separate budget again.

### Own-code cost: the number that matters, and it is bad

The 4.9x cold figure was measured on a crate whose own source is a one-line
stub, so it is dominated by dependency compilation. A developer feels the cost
of instrumenting *their own* code. Measured on a generated crate of 3,600
lines — 400 functions, each with an if/else chain, a loop with a match, and a
guarded match — single crate, no dependencies:

| | baseline | instrumented | overhead |
|---|---|---|---|
| wall | 0.46s | 37.75s | **82x** |
| user | 0.41s | 22.23s | |
| sys | 0.05s | 15.50s | |

Two things stand out. The overhead scales with obligation density, not with
line count, so the dependency-heavy measurement understated it badly. And 15.5
seconds of *system* time against 22.2 of user time points at per-body I/O
rather than analysis alone — something is hitting the filesystem far more than
the work requires.

The generated code is deliberately branch-dense and real code will be less so,
so 82x is an upper bound rather than a typical figure. But the earlier 4.9x
was a lower bound for the same reason, and the truth for a normal crate sits
between them, unmeasured. What is now clear is that the cost is not a fixed
per-crate constant: it is proportional to how much there is to measure, which
is exactly the code a user cares about.

This reframes FAST from "document the cold cost" to a genuine engineering
problem. The sys-time share is the first thing to look at, because I/O per
body is the kind of overhead that is usually structural rather than
algorithmic.

### Where the time goes

Artefacts written for that 3,600-line crate:

| artefact | size |
|---|---|
| `manifest-*.json` | 8.5 MB (~2.4 KB per source line) |
| `*.jsonl` trace | 0.9 MB |
| `sources-*.json` | 0.17 MB |
| target directory | 49 MB, against 8.4 MB baseline |
| `libsupercov_runtime.a` | 17 MB, linked into **every** instrumented crate |

The 17 MB static archive is the first suspect: it is linked per crate, so a
workspace pays it once per member, and it plausibly explains both the system
time and the 6x target bloat. The 8.5 MB manifest is the second — that is real
serialisation work per crate, and 2.4 KB of manifest per source line invites
the question of whether obligations carry redundant fields or the JSON is
pretty-printed. The 22 seconds of user time is third, and only worth attacking
once the I/O is understood.

None of this is optimisation work yet. It is the first time the cost has been
attributed to anything at all.

### The 82x, decomposed

Running the wrapper with instrumentation off, and again with instrumentation
on but no static runtime directory, splits the cost cleanly:

| configuration | wall | user | sys |
|---|---|---|---|
| no wrapper | 0.46s | 0.41s | 0.05s |
| wrapper, instrumentation off | 0.56s | 0.27s | 0.10s |
| instrumented, no runtime archive | 26.67s | 16.62s | 10.01s |
| instrumented, archive linked | 37.75s | 22.23s | 15.50s |

| stage | cost | share |
|---|---|---|
| wrapper process overhead | ~0.10s | negligible |
| instrumentation analysis (user) | 16.6s | 44% |
| instrumentation I/O (sys) | 10.0s | 26% |
| linking the 17 MB runtime archive | 11.1s | 29% |

The wrapper itself is free — being a rustc driver costs nothing measurable.
The cost is three roughly comparable pieces, and two of them are not analysis:
linking a 17 MB static archive into the crate, and 10 seconds of filesystem
work during instrumentation, against an 8.5 MB manifest for 3,600 lines of
source.

That is an encouraging shape. Better than half the overhead is I/O and
linking, which are usually structural — a smaller or dynamically linked
runtime, and a leaner manifest format — rather than algorithmic work that
would need the binder rewritten. The 16.6 seconds of analysis is the part that
would be genuinely hard, and it is the minority.

### One HIR walk per body, not twelve

Profiling the 400-function crate put 86% of samples under the pre-optimization
phase, with `runtime_body_obligations` -> `HirManifestCollector::visit_expr`
the dominant frame beneath it. That function re-runs the entire HIR walk on
every call, and twelve call sites ask for it — every plan builder and every
degrade path.

Memoising it per body was an immediate 3.5x, and the ratchet rejected it:
`log` fell 90.24% to 89.16%, with smaller moves in four other crates. Diffing
`log`'s manifest found `set_logger_racy` gaining `match arm ... has no
authored MIR`.

The cause was a design flaw the cache merely exposed. `collect_body_obligations`
ended with `prune_unreachable_match_arms`, which reads `UNREACHABLE_MATCH_ARMS`
— a set that *grows* as later bodies are bound. So the function was never a
pure function of the body: it mixed a stable HIR walk with a step whose result
depends on when it runs. Caching froze whichever view existed at the first
call.

Separating the two fixes it properly. The walk is cached; pruning happens
fresh on every call, against the current set. `log` returns to byte-identical
output — 36 declined, zero limitations added or removed — and the ratchet
reports exactness held or improved across all 18 crates.

| fns | before | after |
|---|---|---|
| 100 | 4.17s | 1.74s |
| 400 | 24.85s | 7.93s |

With the archive fix, cold overhead on the 400-function crate goes 82x to 26x.

The lesson is not about caching. A function that reads mutable global state is
not a function of its arguments, and nothing in its signature says so. The
cache did not introduce the bug; it made an existing ambiguity observable.

### The quadratic: a file's identity, verified once per obligation

Profiling the 800-function crate was unambiguous where four rounds of
reasoning had not been:

    619  stable_source_range
    177  normalized_path
    124  ExactSourceSnapshot::eq
    117  ExactSourceSnapshot::clone

`stable_source_range` runs for every recorded span. On each call it
materialised the whole file's text, cloned it into an `ExactSourceSnapshot`,
and compared that snapshot against the stored one — three full passes over the
source, per obligation. With tens of thousands of obligations against a single
file that is quadratic in crate size, and it accounted for both the growth in
user time and a large share of the system time.

A file's identity needs verifying once, not once per span.

| fns | before | after | user before | user after |
|---|---|---|---|---|
| 400 | 7.85s | 4.16s | 4.67s | 1.20s |
| 800 | 23.14s | 7.30s | 17.56s | 2.37s |

The scaling result is the important one. Analysis time now doubles when the
code doubles — 1.98x from 400 to 800 functions, against 3.9x before — so
overhead is roughly 13x and *flat* in crate size, where it previously grew
32x, 53x, 83x. A tool whose overhead grows with the codebase is unusable on
the codebases that most need it.

Four hypotheses were wrong before this: memory (peak RSS 232 MB, 76 page
faults), manifest writing (8 MB is milliseconds), the static archive, and a
clone of the unreachable-arm set (empty in this workload, so it early-returns).
`sample` found the answer in a single run. On this codebase, measurement has
beaten reasoning every time they disagreed.

### The number that matters: 1.08x on a real dependency tree

Every figure above came from generated crates: one crate, no dependencies,
400 or 800 functions each carrying an if/else chain, a loop with a match and a
guarded match. That is a stress shape, not a workload. Measured on a real tree
— syn with `full`, serde_json and regex, `cargo build -j 4`, fresh target
directories both sides:

| | baseline | instrumented | ratio |
|---|---|---|---|
| wall | 4.97s | 5.37s | **1.08x** |
| user | 7.16s | 12.12s | 1.69x |
| sys | 0.86s | 2.41s | 2.80x |

Wall clock is 1.08x, inside the north star's ≤1.10x gate. The synthetic 13x
and the real 1.08x are both true and measure different things: a single
branch-dense crate compiled alone has no parallelism to hide the analysis,
while a real dependency tree compiles many crates at once and rustc's own work
dominates the critical path.

Two caveats that must travel with the number. CPU time is 1.81x combined, so a
machine with no spare cores — a constrained CI runner — would feel closer to
that than to 1.08x. And this measures compiling *dependencies*, which a user
pays once; their own crate is nearer the dense case, though real code is far
less branch-dense than the generator.

The honest summary is three numbers, not one: about 1.08x wall on a realistic
cold build, about 1.8x CPU, and warm rebuilds free. Publishing a single
multiplier would repeat exactly the merged-number mistake this project refuses
everywhere else — and the first figure measured tonight, 4.9x, was already
misleading for that reason.

## Wave: negated condition chains, and the decomposition invariant (#36)

`flatten_decision_expression` had no arm for `Unary(Not, ..)`, so `!(a || b)`
fell through to the atomic case and was recorded as a *single* condition. That
is a live wrong MC/DC number: a decision with two operands reported as one.

The naive fix — recurse through the negation — made it worse, and the exactness
ratchet caught it as −0.42 on `build_script_build`. Diffing obligation ids
rather than trusting the percentage showed what the percentage could not: two
obligations **vanished** (140 → 138) while the declined count stayed at 40.
They left the manifest without being declined.

The cause is at main.rs:1361. A decision is dropped whole (`return None`) when
any of its atomic conditions is an external-macro expansion — sound for the
case it was written for, hidden control flow inside `assert!` or `println!`.
But decomposing

```rust
!(err.kind() == ErrorKind::NotFound
    || (cfg!(target_os = "linux") && err.raw_os_error() == Some(ENOTEMPTY)))
```

exposes the `cfg!` operand, so an **authored** `if` was taken out of the
denominator because a sub-expression came from a macro. A vanished branch is
strictly worse than a declined one: it is a silent coverage hole, and we would
report 100% on code containing a real, unmeasured branch. This is the same
family as the uncovered-vs-unmeasured defect fixed in 413d2e2.

Falling back to atomic fixed the vanish but left one decline, which exposed a
second finding worth more than the fix: **there are two independent collectors
of short-circuit operators.** `flatten_decision_expression` claims the ones it
owns in `decision_logical_expressions`; a separate HIR visitor at main.rs:2511
records a logical-selection branch for every `&&`/`||` *not* so claimed. The
fallback discarded its selections without claiming them, so the visitor
resurrected them as orphans — and a `cfg!`-folded operand has no MIR switch to
bind to, so one could never bind. The two collectors disagreed, and the
disagreement was the decline.

The fix keeps both consistent. The drop predicate is extracted as
`external_macro_condition` and shared by both sites. The `Not` arm decomposes
into scratch vectors and splices only if the result survives that filter;
otherwise it falls back to atomic *and* records the discarded short-circuits in
a `subsumed` list the caller inserts into `decision_logical_expressions`.

The invariant this establishes, which outranks the decomposition itself:

> **Decomposing must never cost a decision.** A better MC/DC number is never
> worth losing a branch. When decomposition cannot bind, record the decision
> atomically — a merged number is honest and measurable; an absent one is not.

Evidence, `scratchpad/not-chain` under strict binding, 0 declined:

| function | conditions | selections |
| --- | --- | --- |
| `negated_or` | 2 | 1 |
| `negated_and` | 2 | 1 |
| `negated_chain_with_cfg` | 1 | 0, decision-outcome branch preserved |

Ratchet: 18 crates, zero regressions, `proc_macro2` +1.18, `syn` +1.00,
`build_script_build` +0.31 — the crate that regressed under the naive fix now
gains, because claiming subsumed short-circuits also retired pre-existing
orphan declines.

Two process notes. The percentage said "−0.42, regression"; only the id diff
said "two obligations disappeared", which is a different and more serious
claim. Diff identities, not aggregates. And the chain script reported exit 0
while dying at stage four: zsh treats an unmatched glob as a fatal error, so
`rm -f target/debug/*.libtest.json` aborted the script when no bundle was
present. Only the `CHAIN COMPLETE` check caught it — the exit code was from the
backgrounding wrapper, not the chain. Replaced with `find -delete`.

## Wave: match arms entered at function entry (bb0)

A match arm entered unconditionally on function entry has its body dominated by
`bb0`, the MIR entry block, which has no incoming edge. The binder places arm
probes on the edge *into* the arm, found none, and returned `Err` for the whole
body — declining every match obligation in it, not just that arm. It was the
largest family of unbound diagnostics: 98 of 295 across the 18-crate set,
concentrated in `either` (66) and `syn` (21).

The instrumenter already knew the move. Its function-entry probe clones `bb0`
into a fresh block and replaces `bb0` with a call targeting it — but at the
injection stage, long after planning has failed. Doing the same split *before*
planning gives the arm exactly the external incoming edge the binder wants.
Only bodies that need it are split: the entry block is load bearing elsewhere,
since observation kind is keyed off whether a block is `bb0`.

Family eliminated, 98 → 0, no crate regressing. Worth stating plainly:
**declined counts did not move**, because the affected bodies also fail for
other reasons that remain. This retires a false failure and makes the surviving
diagnostics legible; it is not an exactness win on its own.

## Investigation: per-invocation obligation identity (#22, not landed)

The defect is real. `scratchpad/twice` invokes one `macro_rules` body three
times; at HEAD that is a single obligation with `defs=[first,second,third]`, so
exercising `first` alone credits `second` and `third` — coverage reported for
code that never ran.

Three identities were measured, each against two repros and the 18-crate
ratchet. The second repro mattered most: `scratchpad/inbody` expands one macro
*twice inside a single body*.

| identity | twice | inbody | serde_json |
| --- | --- | --- | --- |
| full expansion chain | 3/3 bound | 2 obligations, both declined | 61.09% |
| def path + owner ordinal | 3/3 bound | still split | — |
| **def path only** | 3/3 bound | merges, matches HEAD | 98.74% |

The first variant failed for a reason worth recording: **the binder matches
obligations to MIR constructs by source range**, and two expansions inside one
body share that range exactly. Handed two indistinguishable obligations it
fails, and scope degradation then declines the body's *whole* scope — which is
why 755 `authored-source` obligations declined in serde_json, obligations the
change never touches. That also explains the arithmetic that first looked
impossible: declines grew more than obligations did (+1763 vs +1378). Pure
splitting cannot do that; collateral scope damage can.

Def-path identity is the correct one, and it still cannot land: `either` goes
96.86% → 67.75%. That regression is honest exposure, and the signature proves
it — obligations 350 → 645 (+295) against declines 11 → 208 (+197). Declines
growing *less* than obligations is what real splitting looks like, the exact
inverse of variant one. 136 of the declines are `authored-expansion` and only 5
`authored-source`, so it is not scope collateral.

What blocks it: 67 of `either`'s 72 unbound messages are "bind pre-optimization
Rust match probes". Macro-expanded match arms bind when one obligation stands
for every invocation and fail when each body must bind its own. Fix that first,
then land def-path identity — the same sequencing that worked for bb0. Then
honesty improves *and* the exact fraction does not regress, instead of trading
one for the other.

## Wave: match arms that share one macro body fragment (#28)

A macro that writes its body fragment once and expands it into several arms
gives every arm the identical body span. `either`'s `for_both!` is the case in
the wild — `$result` appears twice, once per arm. The binder selects an arm's
MIR blocks by that body range, so both arms resolved to the *same* block set,
computed the same entry block, and the misbind post-condition correctly refused
two arms entering one block, declining the whole body's match plans. It was 67
of `either`'s 72 unbound diagnostics, and http's `$body` case is the same
family.

The first fix attempt was to refine each arm's block set to those dominated by
blocks carrying the arm's own *pattern* range. Instrumenting it killed the idea
cleanly: the pattern block set comes back **empty**, because pre-optimization
MIR carries the scrutinee span on the test blocks, not the arm patterns. Spans
cannot separate these arms at all — only the CFG can.

So arms now carry `pattern_variant`, derived exactly as `if let` decision
conditions already derive theirs, and when an arm shares its body span with a
sibling the binder keeps only the blocks reached by that arm's `SwitchInt`
target. Arms with distinct body ranges stay on the existing path.

Deliberately rejected: matching arm order to switch-target order. Enum variant
order need not follow arm order, and that assumption is precisely what the
misbind check exists to catch.

No crate regressed: http 95.05% → 97.29% (+2.24), either 96.86% → 98.29%
(+1.43), tracing_attributes +0.34, syn +0.26. Corpus obligation-weighted
exactness 98.19% → 98.54%, declined 689 → 557.

### What it unblocked

#22's def-path identity was held at `either` 67.75% (−29.11) entirely by this
shape. With it fixed, `either` now *gains* +0.62 under per-definition identity,
and the remaining regressions are small: serde_core −3.80, tracing −0.65, syn
−0.51, proc_macro2 −0.44, http −0.25, serde_json −0.03.

serde_core is the one that matters, and its shape says honest splitting rather
than breakage: obligations 1787 → 7768 (+5981) against declines 44 → 486
(+442). Declines growing far slower than obligations is the inverse of the
full-expansion-chain variant, where declines *outran* obligation growth because
scope degradation was taking unrelated authored code down with it.

That leaves #22 as a judgement rather than a bug: the exact fraction falls
because the denominator became more honest, so the before and after percentages
measure different things and the ratchet cannot adjudicate between them. The
recommendation is to keep closing the newly exposed gaps first — 46 of
serde_core's messages are "inject pre-optimization Rust match probes" — and
land the identity change with no regression at all, which is exactly how this
wave unblocked `either`.

## Wave: chaining match-arm bridges on shared entry edges

With the `bb0` split letting planning succeed, the largest remaining family
moved one stage later, to injection: "match arm entry edge from bbN was not
found" (49 messages). That is why the `bb0` wave retired 98 diagnostics without
moving declined counts — the same bodies were failing again, further along.

The diagnostic carried its own answer:

    entry edge from bb1 was not found; entry_block=bb3;
    entry_sources=[bb1]; source successors=[bb24, bb4, bb2]

`bb3` is absent from bb1's successors and `bb24` is a bridge block, so an
earlier plan had already redirected that edge. The edge was never missing — it
was already bridged. And nested matches share entry edges *by design*; the
function's own comment says an outer arm commits on the edge entering the inner
match's frame. Both arms must commit, so the fix chains this arm's bridge onto
the existing one rather than declaring the edge lost.

No crate regressed: `proc_macro2` 99% → 99.95%, `serde_core` 97.54% → 98.15%.
Corpus obligation-weighted exactness 98.54% → **98.62%**, declined 557 → 526.

### Where #22 stands after three gaps closed

Per-definition identity, measured after each wave:

| after | either | serde_core | regressions |
| --- | --- | --- | --- |
| #36 | −29.11 | −3.80 | 6 |
| #28 | **+0.62** | −3.80 | 6 |
| bridge chaining | +0.62 | **+0.52** | 4 |

Now eight gains against four small regressions: tracing −0.65, syn −0.51, http
−0.25, serde_json −0.03. Both remaining tails are narrow — every one of
tracing's eleven messages is statement binding inside a single function,
`level_filters::get_max_level_inner`, and syn's fifteen are spread over 19,173
obligations.

The pattern is now well established: each closed gap converts a large #22
regression into a gain, because aggregation had been crediting one successful
binding to many bodies. Closing the last two tails should let per-definition
identity land at zero regression, so HONEST and the exactness ratchet agree
instead of being traded against each other.

## Finding: much of the "binder blind spot" count is cfg-disabled code (#39)

tracing's `level_filters::get_max_level_inner` produced eleven "statement has
no exact MIR entry mapping" diagnostics. Reading the source at the reported
range settles what they are: the statement is `LevelFilter::OFF`, the body of

```rust
} else if cfg!(feature = "max_level_off") {
    LevelFilter::OFF
```

That feature is off, so the branch is constant-folded and never lowered. Not a
binder blind spot — code this configuration did not compile, reported as a
binder defect.

The existing not-compiled path misses it for a precise reason. It asks whether
*any* MIR span overlaps the statement, and one does: the else-chain's own wide
span, `3751..4222`, overlaps the dead statement at `3796..3812`. The mapped
ranges show the truth plainly — `3754..3785`, then `3824..3860`, with the
statement sitting in the gap between them. An enclosing scope span is not
evidence that the statement lowered.

Excluding spans that strictly contain the statement fixes the target case
exactly (tracing UNBOUND 11 → 0) and regresses nothing. It was still reverted,
because corpus-wide it moves UNBOUND 295 → 93 and reclassifies roughly two
hundred diagnostics — and **not-compiled obligations do not fail strict
binding**. Reclassifying at that scale removes them from our own gate, and the
misclassification mode is plausible: a macro-expanded statement whose only MIR
evidence is a wider callsite span would be swept up by the same rule. Exactness
holding proves nothing about the labelling, since both classes count as
declined.

### The validation, and the verdict

All 284 statements the rule marks "not compiled" were extracted and the source
read at each reported range. The result rejects the rule.

Correctly classified — genuinely eliminated before lowering:

| crate | statement | eliminated by |
| --- | --- | --- |
| build_script_build | `return;` | `if !cfg!(feature = "proc-macro")` |
| bytes (×2) | `self.get_int(nbytes)` | `if cfg!(target_endian = "big")` |
| proc_macro2 | `debug.field("span", ..)` | `if cfg!(span_locations)` |
| tracing | `LevelFilter::OFF` | `else if cfg!(feature = "max_level_off")` |

Misclassified — live code inside `macro_rules!` bodies, whose MIR spans point
at the wider *callsite*: syn 165 (`_ = $content;`), tracing_attributes 19 (the
same syn macro), http 25, either 2. http's is the clearest tell — its range
slices a fragment mid-token, so the "statement" text is literally `"y "`, part
of `$body`.

That is roughly 209 of 284 in the macro-fragment class: exactly the failure
mode predicted before measuring. Since not-compiled obligations do not fail
strict binding, landing this would have dropped ~200 cases from our own gate,
most of them live code.

The correct fix is to decide it in HIR rather than by span arithmetic: mark a
statement not-compiled when it sits under a condition that is a constant
boolean, which is what a `cfg!` expands to. That is exact, covers all four
validated cases, and cannot mistake a macro's callsite span for a dead branch.
#36 already had to reason about `cfg!` folding to a constant inside decision
conditions, so the same predicate is wanted in both places.

One correction to the earlier reading of this: the raw unbound count *does*
overstate real blind spots, but not by the ~200 the span rule suggested — by
closer to the handful validated above. Ranking work off the unvalidated number
would have been a mistake.

## Wave: cfg-eliminated obligations, decided in HIR (#39)

tracing's `level_filters::get_max_level_inner` reported eleven statements as
binder blind spots. The source at those ranges is `LevelFilter::OFF`, the body
of `} else if cfg!(feature = "max_level_off") {`. The feature is off, the
branch never lowers, and calling it a binder defect is simply wrong.

The first attempt inferred elimination from span geometry — treat a span that
strictly *contains* the statement as enclosing scope rather than evidence it
lowered. It fixed the target case and regressed no crate. It was still wrong,
and the way it was caught is the point: reading the source at all 284 ranges it
reclassified showed roughly 209 were **live code** inside `macro_rules!`
bodies, whose MIR spans point at the wider callsite. http's was sliced
mid-token, so the "statement" text was literally `"y "`. Since not-compiled
obligations do not fail strict binding, landing it would have removed ~200
mostly-live cases from our own gate while every automated check stayed green.

So decide it where rustc already decided it. `cfg!(..)` is a bool literal by
the time HIR sees it, so the collector walks the live branch normally and the
dead branch with a depth counter raised, recording those ids in a set the
binder consults *before* any span comparison. Spans are never involved.

Reclassifies 30 — tracing 11, bytes 8, http 8, tracing_core 2, proc_macro2 1 —
and correctly excludes every macro-fragment case: syn 165, tracing_attributes
19, either 2.

A fixture pins it in the lattice gate rather than the fixture crate, for a
reason worth remembering: **the identity manifests are built without
`SUPERCOV_RUST_INSTRUMENT_MIR`**, so they carry no `unmeasuredObligations` and
no binding outcome can be asserted against them at all. The first pin failed
there — and the same trap had already produced a vacuous assertion in the #28
fixture, a "did not decline" check that could never fail. Both are fixed.

## Where #22 stands after five gaps closed

| after | regressions | worst |
| --- | --- | --- |
| #36 | 6 | either −29.11 |
| #28 arm/discriminant | 6 | serde_core −3.80 |
| bridge chaining | 4 | serde_core +0.52 |
| #39 cfg-elimination | **2** | syn −0.51 |

Eight gains now, against syn −0.51 and serde_json −0.03. The last gap is syn's
fifteen unbound messages across 19,173 obligations: five logical-selection
branches mapping to N rustc branches, four with no exact left-operand mapping,
one BCB block mapping to zero MIR blocks, one condition mismatch. Several
narrow shapes rather than one family.

Every gap closed so far has converted a #22 regression into a gain, because
aggregation was crediting one successful binding to many bodies. That is the
argument for finishing the same way rather than landing on "the remainder is
only honest exposure" — which is exactly the reasoning the ratchet exists to
resist, and which has not been needed once.

## Wave: short-circuits decided by a constant operand

syn's `let unnamed_field = cfg!(feature = "full") && input.peek(Token![_]);`
recorded a logical-selection branch mapping to zero rustc branches. Not a blind
spot: a short-circuit whose left operand is a compile-time constant makes no
run-time decision, so rustc emits no switch for it.

The rule is independent of the constant's **value**, which the first attempt
got wrong by gating on `And→false` / `Or→true`. That reclassified nothing —
syn's `full` feature is in fact *enabled* in the probe build. `false && x`
never evaluates the right operand and `true && x` always does; neither is a
branch.

Two seams had to close before it took effect, each silent on its own. Detection
without the bind-site consult put ids into a set nothing read. Then the
logical-selection failure handler turned out not to check the `UNMEASURABLE`
marker the way the statement handler does, so strict binding still aborted on a
non-defect. That handler now classifies failures the same way statements do,
which is what keeps strict binding failing on real blind spots only.

syn's unbound messages drop 15 → 10, no crate regresses.

### #22 is one regression from landing clean

| after | regressions | worst |
| --- | --- | --- |
| #36 | 6 | either −29.11 |
| #28 arm/discriminant | 6 | serde_core −3.80 |
| bridge chaining | 4 | serde_core +0.52 |
| #39 cfg-elimination | 2 | syn −0.51 |
| constant-operand short-circuits | **1** | serde_json −0.03 |

Eight gains against a single −0.03. serde_json now measures 4458 obligations
against a 3256 baseline — 37% more — while declines grew by 16, which is the
honest-splitting signature rather than a capability regression.

The last family is "condition branch_source" mismatches: 16 messages in
serde_json's `de.rs` (`deserialize_any`, `deserialize_struct`, `parse_decimal`,
`parse_exponent`) and one in syn, so one fix closes both tails.

The discipline holds: every gap closed has converted a #22 regression into a
gain, because aggregation was crediting one successful binding to many bodies.
Landing on "the remainder is only honest exposure" has not been necessary once,
and is not necessary now.

## The last gap before #22: one condition, two switches

The single remaining #22 regression is serde_json −0.03, and the diagnostic
names its own cause:

```
could not bind one expanded boolean MIR branch for
rs:decision:da295abecf594e31da26713a condition 0; found 2
```

The condition at `de.rs:46089-46115` maps to **two** boolean switches — bb46
and bb62 both carry `is_bool=true` with exactly that range — and the binder
requires exactly one. Five messages in serde_json (`deserialize_any`,
`deserialize_struct`, `parse_decimal`, `parse_exponent`) and one in syn, so a
single fix closes both crates' tails.

This is the condition-level analogue of two shapes already solved: logical
selection branches mapping to zero regions, and decisions sharing one CFG edge.
One authored construct, several MIR sites.

The obvious fix — bind every switch whose range equals the condition's and
union their outcomes — turns out to be blocked by the data model, which is
worth knowing before anyone starts. `RuntimeDecisionCondition` carries
`true_sources` and `false_sources` as **vectors** but `true_target` and
`false_target` as **single blocks**. Two switches that branch to different
targets therefore cannot be represented at all: the vectors express "several
blocks branch to one target", not "several switches with their own targets".

That left one question deciding whether this is a guard or a refactor: **do the
two switches share their true/false targets?** Measured, by dumping the actual
targets rather than their counts:

```
bb46: [(0, bb48)] otherwise bb47
bb62: [(0, bb64)] otherwise bb63
```

They do not. All four target blocks are distinct, so the two sites cannot be
collapsed onto one `true_target`/`false_target` pair and the union is not
expressible in today's model.

**This is therefore a data-model change, not a guarded relaxation.**
`RuntimeDecisionCondition` needs per-source targets — each source block paired
with the targets it actually branches to — and the injection path that consumes
`true_sources`/`false_sources` has to place a probe per pair rather than one
per condition. The guard still matters when it is built (exact range equality
plus `is_bool`, never overlap or nearest-match, since the one-switch rule is
also what catches genuine misbinds), but it is no longer the whole job.

That is worth knowing before starting: the earlier estimate of this as a small
guarded relaxation was wrong, and the measurement that corrected it cost one
instrumented build.

Worth stating plainly what the −0.03 is: serde_json measures 4458 obligations
against a 3256 baseline, 37% more, while declines rose by 16. That is honest
splitting, not lost capability. It would be easy to land #22 by calling the
remainder denominator growth — which is true — but closing the gap has worked
five times running, and each time it converted a regression into a gain rather
than merely excusing one.

## Ranking what is left (#30)

At 98.62% corpus exactness, 526 declined of 38,155. The split that matters for
planning: **118 are real binder blind spots, 200 are genuinely unmeasurable
code**. Roughly 40/60 — so ranking off the raw declined count overstates the
remaining work by more than half.

| count | family | crates |
| --- | --- | --- |
| 24 | statement in `write` | zmij |
| 23 | condition branch_source | serde_core, syn, http, serde_json |
| 12 | logical-selection maps to N rustc branches | http, serde_json |
| 9 | coverage block maps to N MIR blocks | build_script_build, zmij, syn |
| ~16 | misbind: match arms | serde_core mostly |
| ~14 | statement in HeaderMap methods | http |
| 5 | try-operator obligations | either |
| 4 | logical-selection, no exact left-operand | syn |

Order to work them, and why:

1. **condition branch_source** — not the largest, but the only one blocking
   #22, a user-decided correctness fix. Now known to need per-source targets.
2. **statement in `write`** — largest single family, confined to one crate and
   one function, so likely one shape. zmij is also the worst crate at 77.57%,
   making this the biggest exactness win available.
3. **misbind: match arms** — clusters in serde_core's `de::impls` and is
   probably one shape seen through several definitions. #28 solved the
   macro-body-fragment case; these arms are derive-generated, so it is a
   different one.
4. **logical-selection maps to N** — same underlying shape as #41: one authored
   construct, several MIR sites.
5. **coverage block maps to N MIR blocks** — spread across three crates, so
   probably several shapes. Lowest payoff-to-risk.

Re-rank after each landing. Every wave this session reordered the list, usually
by converting one family's failures into a different family one stage further
along.

## Wave: one condition, several MIR sites (#41)

A condition reached by two paths is lowered to two switches with their *own*
targets — serde_json's `deserialize_any` has bb46 → bb48/bb47 and bb62 →
bb64/bb63 for a single authored condition. `RuntimeDecisionCondition` held one
`true_target`/`false_target` pair, so two sites with distinct targets were not
representable, and the binder declined rather than misbind.

That made it a data-model change, not a relaxed guard. Probing only one site
would report the condition uncovered whenever execution took the other, which
is a wrong number rather than a missing one.

Each outcome now carries `Vec<(sources, target)>`, one group per evaluating
site. Landed in two stages deliberately: a pure structural refactor wrapping
the existing single group, confirmed by the ratchet as an exact no-op, then
multi-group construction on top — so if the second stage moved numbers, the
plumbing was already ruled out. The misbind guard was strengthened rather than
relaxed: it now rejects a binding if *any* true target coincides with *any*
false target, which is the property that makes several sites safe. The
one-switch rule had been doing that job incidentally.

serde_json 98.77% → 99.32%, serde_core +0.12, no regressions. Corpus
obligation-weighted exactness **98.67%**, declined 506.

## Why #22 stopped converging, and what it actually needs

After five gaps closed, per-definition identity still showed four regressions —
and they kept *moving* rather than shrinking. The reason is now clear, and it
is not a binder gap.

**tracing regresses −0.65 with zero unbound messages.** All sixteen of its
declines are NOT_COMPILED: cfg-eliminated code. Obligations go 365 → 380 and
declines 13 → 16, because per-definition identity counts each expansion of
*unmeasurable* code separately. There is nothing to bind, so no binder work can
close it. Part of the remaining regression is irreducible under the metric as
defined.

That also explains the movement: each binder fix changes which obligations
bind, and per-definition identity re-partitions whatever is left.

So the blocker is the metric, not the binder. The exact fraction currently
conflates *we failed to bind this* with *this code was never compiled*. It
should measure binding success over measurable obligations:

```
exact = (obligations - declined) / (obligations - uncompiled_obligations)
```

The baseline already carries an `uncompiled` field, but it counts NOT_COMPILED
*messages* rather than the declined obligations that are uncompiled — tracing
shows declined=13 against uncompiled=16, so they are different populations. The
manifest knows each obligation's decline reason at classification time, so the
per-obligation count is available.

Fix the metric, re-baseline once and say so, then re-measure #22. The
irreducible part vanishes by construction and what remains is real binder work:
syn's four no-exact-left-operand selections and http's six logical-selection
maps-to-N. Landing #22 by arguing the regressions away would leave the ratchet
measuring the wrong thing, which is worse than the regression.

## The metric was measuring the wrong thing

The exact fraction conflated two failures: *the binder could not bind this* and
*this code was never compiled*. Only the first is a defect, and counting the
second against it meant the ratchet vetoed changes that made the report more
honest.

There was already an honesty exemption, but it keyed off the NOT_COMPILED
**message** count, which is the wrong population — several messages can name
one obligation, and one message can accompany a scope decline covering many.
tracing exposed the gap exactly: under per-definition identity it regressed
0.65 with **zero** unbound messages, because its declines are all cfg-eliminated
code and per-definition identity counts each expansion separately. Its message
count never moved, so the exemption never fired, and no binder work could ever
have closed it.

Exactness now measures binding over **measurable** obligations:

```
exact = (measurable - unbound) / measurable
measurable = obligations - uncompiled_declined
```

The per-obligation count comes from the marker the wrapper already embeds,
`UNMEASURABLE<id>|<reason>`, intersected with `unmeasuredObligations` — no
wrapper change needed. Every number shifts once, deliberately: tracing 96.44% →
100%, and bytes, once_cell, proc_macro2 and tracing_core likewise, because
their remaining declines were all code absent from this build. Crates with real
gaps keep them — zmij 78.63%, build_script_build 71.74%, http 97.56%. Both
readings stay recoverable, since obligations, declined and measurable are all
recorded per crate.

### What it did for #22

| | regressions | worst |
| --- | --- | --- |
| before the metric fix | 4 | tracing −0.65 |
| after | **2** | http −0.17 |

tracing and syn stopped regressing entirely — they *were* the irreducible part.
What remains is genuine binder work, and both crates show the same dominant
family, six messages each: `logical-selection branch maps to N rustc branches`.

That is the #41 shape one obligation kind further along. A `&&`/`||` reached by
two paths is lowered several times, each site with its own BCB pair, and the
binder requires exactly one. Selections bind through `RuntimeMatchArm`, which
carries a single `entry_block`, so several sites are not representable — just
as decisions were before #41. Recorded as its own task, with the note that
emitting one arm per site (sharing `branch_id` and ordinal) may achieve the
union semantics with no data-model change, provided the misbind guard is
checked for whether it rejects two arms with equal ids.

## The last #22 blocker: spans that are not expressions

Two wrong turns before the cause, both worth recording.

First I read the family name — "logical-selection branch maps to N rustc
branches" — as the #41 shape, one selection lowered to several MIR sites, and
implemented multi-site binding for it. It built, regressed nothing, and changed
nothing. The message had said `maps to 0` all along. Generalising from a family
name instead of reading the count cost a full implementation, which was
reverted as dead code in the injection path. *Regresses nothing* is not
evidence that something belongs.

Second, with zero mappings established, the natural theory is that rustc omits
a branch region for this construct. It does — but not for the reason that
suggests.

Both http sites are inside a `macro_rules!` body:

```rust
let $danger = dist >= FORWARD_SHIFT_THRESHOLD && !$map.danger.is_red();
```

and the recorded mapping source *appeared* to be `" >= FORWARD_SHIFT_THRESHOLD
&& "` — starting and ending mid-token, which looked like an operand straddling
macro fragment boundaries.

**That was wrong, and the error was mine.** Read with byte-correct slicing the
range is `"dist >= FORWARD_SHIFT_THRESHOLD"` — a clean, complete expression.
`http/src/header/map.rs` contains two non-ASCII characters, four bytes of
drift, and the diagnostic sliced by JS string index against byte offsets. This
is precisely the trap recorded as #42, walked into while diagnosing.

So there is no fragment-straddling here. Starting again from the corrected
reading, the message itself carries the answer, in a part none of the earlier
theories had looked at:

```
maps to 0 rustc branches at ...:15715-15746; available: []
```

**`available` is empty.** rustc emitted no branch mappings for the enclosing
body at all — our range never failed to match, there was nothing to match
against. Every earlier theory had assumed a mismatch between our range and
rustc's, and that framing was wrong from the start.

The affected bodies are `HeaderMap::<T>::try_append2`, `try_entry2`,
`try_insert2` in http and `Deserializer::<R>::parse_integer` in serde_json, and
they share the trait that explains it: their branching originates *inside macro
expansions* — `insert_phase_one!` in http, `tri!` and friends in serde_json.
rustc does not emit branch regions for macro-expanded spans, so a body whose
branching is entirely macro-generated yields an empty mapping set. That is
compiler behaviour, not something to work around by loosening our matching.

Six of http's twenty-one unbound messages report `available: []` — exactly its
maps-to-zero count — and http's *statement* failures sit in the same three
functions, so one body-level cause plausibly explains both families there.

The fix already exists for a sibling obligation kind. Decisions do not depend on
rustc's branch regions alone: when the mapping is absent they fall through to
the expanded-boolean MIR path that finds the switch structurally — the same
path #41 extended to several sites. Logical selections have no such fallback and
simply decline. Giving them one is the work, and the selection's own
discriminator (`logical-selection:and` / `:or`) already says which target is
evaluated and which is short-circuited, which is exactly what a structural
search needs.

Two consequences worth carrying. Every source-text reading in this
investigation used the broken slicing, so any conclusion that rested on
*reading* a range — rather than on a measurement — needs redoing with byte
slicing; that includes the `"y "` observation attributed to http while
validating #39. **That one has since been rechecked**: byte-correct, the range
is `"$body"` — a macro fragment placeholder. The classification was right, only
the quoted text was wrong, so #39's validation conclusion stands. The measurement-based conclusions are unaffected, including
#39's own, which decides elimination from the HIR condition and never consults
a span. And the fix for #42 is now clearly worth doing for the diagnostics
themselves, not just the corpus assertions: a silently shifted range produced a
confident, wrong root cause.

This is a recurring shape rather than a one-off: the same pathology produced
http's `"y "` slice found while validating #39 — a "statement" whose text was a
fragment cut mid-token. Any binder step keyed on such a range fails, and it
will keep surfacing under different family names.

A third hypothesis followed naturally and also failed, which is the most useful
result of the three. The branch span already resolves opaque macro operands to
their call site, while `mapping_source` uses the raw span — a real asymmetry.
Applying the same correction left http and serde_json unchanged at six messages
each and pushed syn from zero to four, converting its "no exact left-operand
mapping" cases into maps-to-zero. It moved the failure rather than fixing it.

The reason is the constraint any fix has to respect:
`authored_opaque_macro_condition` requires the expanded span to be **unowned**,
that is, a *foreign* macro, with an owned call site. http's macro is defined
inside http, so its expanded span is owned, the predicate never fires, and the
correction never reaches the case that needs it. The property that matters is
not "foreign macro" but "this range straddles fragment boundaries", and no
existing predicate expresses that.

So the fix is a decision, not a mechanism. A range that is not an expression
cannot bind by range, so either the selection resolves to
`span.source_callsite()` — naming the invocation instead of the interpolation
gap — or it is recognised as unresolvable and declined as a source-identity
limitation, which is closer to what it is than "the binder has a blind spot".
The second is more honest if the construct cannot be attributed to authored
source at all; the first is better if the callsite names the real expression.
That is settled by looking at what the callsite range actually covers.

#42 is the same byte-range fragility on the reporting side, which suggests
treating fragment-straddling ranges as a first-class concept rather than
handling each symptom where it surfaces.

## Wave: selections in bodies rustc maps no branches for (#43)

The diagnostic had carried the answer all along, in a part none of four
theories had read:

```
maps to 0 rustc branches at ...:15715-15746; available: []
```

`available` is **empty**. rustc emits no branch region for a span inside a
macro expansion, so a body whose branching is entirely macro-generated yields
no mappings at all — http's `try_append2`/`try_entry2`/`try_insert2`, whose
branching comes from `insert_phase_one!`, and serde_json's `parse_integer`. The
range never failed to match a rival; there was nothing to match against.

Decisions already fall through to finding the switch structurally in MIR when
the mapping is absent. Selections had no such fallback and simply declined.
They now search for the short-circuit's own switch by the span the mapping
would have pointed at, with the plan tail factored into a closure so both paths
build the plan identically. The per-obligation matching rule is untouched:
loosening it would blind the misbind check for every body that *does* have
mappings, and this absence is body-level.

A second bug hid behind the first and surfaced only once the fallback ran. MIR
encodes a bool switch as `[0: false, otherwise: true]`, so asking for value 1
falls through to the otherwise arm — taking `target_for_value(1)` and
`otherwise()` returned the **same block** for both targets, their common
dominator was that block, the switch was not dominated by it, and the terminal
edges came back empty. The family moved from "maps to 0" to "incomplete
terminal edges" at an *identical count*, which is exactly what showed the
search was finding the switch and something downstream was wrong.

http 97.56% → 97.61%, serde_json 99.32% → 99.39%, no regressions. Both families
eliminated; total unbound messages across the crate set fall to 86.

### #22, after every blocker

| after | regressions | worst |
| --- | --- | --- |
| #36 | 6 | either −29.11 |
| #28 | 6 | serde_core −3.80 |
| bridge chaining | 4 | serde_core **+0.52** |
| #39 | 2 | syn −0.51 |
| metric fix | 2 | tracing and syn drop out |
| #43 | **2** | http **−0.07** |

Five gains against −0.07 and −0.04. What remains is no longer one family:
http's statement obligations in the three `try_*2` bodies, and serde_json's
derive-generated misbind arms. One caution recorded for whoever picks it up —
a sampled http "statement" failure is `RUST_OBLIGATION_NOT_COMPILED`, not
unbound, so that delta mixes real binder failures with uncompiled statements
splitting per definition. Separate the two before chasing either; if uncompiled
declines are not being excluded there, that is a metric bug rather than a
binder one.


## The shape behind http's last statements: obligations at a fragment placeholder

With byte-correct reading available, http's remaining statement failures are
legible for the first time. One sits at `map.rs:13426..13431`, and that range is

```
"$body"
```

a macro **fragment placeholder** in the macro definition, five bytes long. The
statement obligation was recorded against the placeholder rather than against
the code the caller interpolated there, so nothing in MIR carries that range
and the statement cannot bind.

This is the same family that produced the earlier `"y "` misreading — the range
was always `$body`; the byte bug simply rendered it as a slice of neighbouring
text. It is worth stating as its own shape because it recurs: **an obligation
whose source range is a fragment placeholder names no compiled code**, and any
binder step keyed on that range fails no matter how the step is written.

The fix is the same *question* posed earlier for selections and answered wrongly
there: resolve to the call site, or decline as a source-identity limitation.
What makes it different this time is the trigger. The earlier attempt reused
`authored_opaque_macro_condition`, which requires a FOREIGN macro and therefore
never fired on http's local one. The trigger here is structural and
ownership-independent: the span is a fragment placeholder, which is a property
of the expansion, not of who defined the macro.

## Wave: fragment-placeholder statements (#44), and #22 down to one regression

http's remaining statement failures sat at ranges like `map.rs:13426..13431`,
which byte-correctly reads:

```
"$body"
```

A macro **fragment placeholder**, five bytes. A fragment used as a statement
gives the *statement* the placeholder's span in the macro definition while the
*expression* keeps the caller's, so the obligation named no compiled code and
nothing in MIR could ever carry that range.

The test is **containment**, not ownership: a statement whose span does not
contain its own expression's span is a placeholder wrapper. That distinction is
the whole point — an earlier attempt at this family reused a predicate
requiring a *foreign* macro, which never fired on http's local one. And it is
deliberately not a text test for a leading `$`; the previous two heuristics on
source text both produced wrong diagnoses.

http 97.61% → 97.67%, no regressions, http's unbound messages 15 → 7, crate-set
total 78.

### #22 after every blocker

| after | regressions | worst |
| --- | --- | --- |
| #36 | 6 | either −29.11 |
| bridge chaining | 4 | serde_core **+0.52** |
| metric fix | 2 | tracing, syn drop out |
| #43 | 2 | http −0.07 |
| #44 | **1** | serde_json **−0.04** |

Six gains against a single −0.04. What remains is four misbind-arm messages in
serde_json plus one statement — #28's family reached through a different door:
those arms have *distinct* body spans and still resolve to one block, because
`format_escaped_str_contents` matches eight constants whose bodies are single
unit-variant assignments.

One attempt is recorded as failed. Dropping #28's `shares_body_span` guard, so
the discriminant refinement applies whenever the arm's variant is known, looked
good measured *with* #22 — serde_core +0.43, syn +0.06 — and **regressed
serde_core −0.06 measured alone**. The code comment I wrote claimed the
refinement "cannot widen a binding that already works"; the measurement refutes
it. The lesson is procedural as much as technical: measure a candidate on its
own before measuring it stacked on the change it is meant to unblock, because
the combined reading hid a regression the isolated one showed immediately.

## The last family: arms colliding on the dominator

22 messages across the crate set — serde_core 13, serde_json 4, syn 2, and one
each in http, serde, tracing_attributes — all of the form

```
misbind check: match arms <a> and <b> in <fn> both enter block <bb>
```

and serde_json's four are #22's only remaining regression.

#28 solved the case where arms share a body *span*, a macro fragment used in
several arms, by refining each arm's blocks through its variant's switch
target. These arms have **distinct** spans and collide anyway:
`format_escaped_str_contents` matches eight constants whose bodies are single
unit-variant assignments.

Two triggers were tried, both measured alone, both reverted.

Refining **whenever the variant is known** looked good stacked on #22 and
regressed serde_core −0.06 in isolation — refuting the safety property its own
comment asserted, so an arm's variant target does not always reach its own body
blocks.

Refining **when block sets overlap** was neutral and left all 22 messages
standing. The flaw is worth stating precisely, because it explains why the
obvious test fails: collision happens at the *entry block*, which is the
nearest common **dominator** of an arm's body blocks, and two arms with
disjoint block sets can still reduce to the same dominator. Set overlap misses
exactly the colliding cases.

The pre-pass was built — compute every arm's dominator-reduced entry block,
group by it, refine only genuine collisions — and it produced a result
**identical** to attempt one: syn +0.03, serde_core −0.06. Adding a further
guard excluding *guarded* arms changed nothing either.

Identical results across three different triggers is itself the finding: **the
trigger was never the problem.** And attempt four's measurement finally showed
what is: serde_core's misbind messages fall 13 → 11, so the refinement really
does fix two of them, while a new failure appears —

```
for branch <id> maps to N exact Option switches
```

serde_core gains that failure — it goes 0 → 1 — though the failure is not new
to the codebase, since syn carries one at HEAD.

The obvious explanation, that the refinement is mangling for-loop arms, is
**ruled out**: match groups are only recorded for `MatchSource::Normal |
Postfix` (main.rs:2601), so for-loop desugaring never becomes a match group and
the refinement cannot touch those arms directly. It is reaching for-branch
binding *indirectly* — most likely a `Normal` match over `Option` variants
whose arms get re-scoped, leaving the separate for-branch binder ambiguous.

That is where the next attempt starts, and it should start with a diff rather
than a theory: identify which serde_core body gains the failure and compare its
arm block assignments across the two runs. Five theories have been wrong in this
family and five measurements have each been informative, which is a clear enough
signal about which to trust.

One procedural note earned twice over: **measure a candidate alone before
measuring it stacked on the change it is meant to unblock.** The combined
reading hid a regression that the isolated reading exposed on the first try.

## Wave: refine by discriminant except in Option matches (#45)

The misbind-arm family took six attempts, and the one that worked came from
diffing two runs rather than reasoning about them.

#28 refines an arm's MIR blocks through its variant's switch target when two
arms share a body *span* — a macro expanding one fragment into several arms.
Arms with distinct spans collide too, so the trigger wanted widening. Widening
it regressed serde_core, and five theories about why were wrong: variant
availability, block-set overlap, a dominator-collision pre-pass, guarded arms,
and for-loop desugaring were each proposed and each eliminated.

The diff answered it in one step. serde_core's misbind messages fell 13 → 11,
so the refinement *was* fixing two, while `VecInPlaceVisitor::visit_seq` gained

```
for branch <id> maps to 0 exact Option switches
```

That body is `for i in 0..self.0.len()`. A `for` loop desugars to a match on the
`Option` that `next()` yields, and the for-loop binder **rebinds against that
same switch afterwards** — narrowing those arms to their variant targets
consumes it. #28's span-equality trigger had been excluding Option matches by
accident, which is exactly why widening the trigger is what exposed it.

So the guard is now named rather than incidental: never refine arms of an Option
match; refine everywhere else a variant is known. syn 99.78% → 99.81%, no
regressions, misbind messages 22 → 20, and the for-branch failure stays at its
pre-existing count of one.

This is the second time in this work that a guard turned out to be protecting
against something its author never named — `authored_opaque_macro_condition`'s
foreign-macro requirement had silently shielded local macros in the same way.
Both surfaced only when the surrounding condition widened, which is an argument
for widening deliberately and measuring, rather than leaving narrow conditions
unexamined because they happen to pass.

### What still blocks #22, and it is one shape

Seven gains against serde_json −0.04. Four of its five messages are misbind
arms, and #45 cannot reach them: `format_escaped_str_contents` matches **named
constants**, not variants —

```rust
match escape {
    self::BB => CharEscape::Backspace,
    self::TT => CharEscape::Tab,
```

`self::BB` is a `const`, so `arm_pattern_variant` returns None and the
refinement never fires. That is also why #45 gained syn and left serde_json
untouched. The arm already carries `pattern_int` for literal patterns, so the
same switch-target lookup would work — provided `integer_pattern_literal`
resolves a named const rather than only bare literals. That question decides
whether the extension is small or needs const evaluation, and it should be
answered before the work is estimated.

## Per-expansion obligation identity (#22), and what remains

The fixture stated the defect better than prose could. `behavior.rs` calls

```rust
generated_by_rules(false),
repeated_expansions::generated_by_rules(true),
```

so neither call site exercises both branches — yet while the two expansions
shared one obligation it carried **both** vectors and reported fully covered.
Coverage credited to a branch no call site ever took, and the corpus asserted
that as correct. Three chain runs, each failing on a fixture that had encoded
aggregation as intended behaviour, which is the corpus doing exactly its job.

The same fixture showed procedural macros were *already* per-invocation —
`notEqual` ids for `generated_by_proc`, `equal` for `generated_by_rules`. Two
macro systems, two answers to one question. They now agree.

Not the full expansion chain, which was tried and rejected earlier: two
expansions inside one body share a source range exactly, so per-expansion
identity hands the binder two indistinguishable obligations and it declines the
body's whole scope. Keying on the expanding *definition* splits across bodies,
which is where the false credit accrues.

Six gains, and two crates dip — http −0.02, serde_json −0.04. The arithmetic is
what justified landing rather than waiting:

| crate | obligations | declined |
| --- | --- | --- |
| serde_json | 3256 → 4458 (+1202) | 20 → 29 (+9) |
| http | 3660 → 3879 (+219) | 31 → 37 (+6) |

Nine more declines against twelve hundred more obligations. Where a split
obligation fails every copy now fails; before, one was counted unmeasured and
the rest silently credited. The dip is false credit being removed.

Corpus obligations 38,155 → 52,076 — about 14,000 obligations that had been
having their coverage inferred from a sibling — and binding exactness **99.25%**.

### The ranking now

72 real blind spots against 198 unmeasurable. Top families:

| count | family | crates |
| --- | --- | --- |
| 24 | statement in `write` | zmij |
| 9 | coverage block maps to 0 MIR blocks | build_script_build, zmij, syn |
| 9 | misbind: match arms | serde_core |
| 5 | try-operator obligations | either |
| 4 | logical-selection, no exact left-operand | syn |

zmij's 24 are the clear target and are recorded in full. Two attempts on its
*decision* failures were reverted and are worth not repeating: a counter-less
BCB cannot be recovered from its Code mapping, because rustc emits neither a
counter nor a code mapping for it — the diagnostic showed BCB 25 wanted while
code-mapped BCBs ran 0–21, 23, 24, 26. And skipping such mappings so the
condition falls through to the structural switch search works, but only
relabels: nine "maps to 0" became seven "condition branch_source", with corpus
unbound unchanged at 72.

## Performance, and a hole in the guard that found itself

Remeasuring #16's numbers first, because they were an order of magnitude stale:
scale-400 (3,600 lines, deliberately branch-dense) runs **8.1x**, not the 82x
recorded — 0.55s baseline against 4.46s instrumented. The improvement came from
work landed for other reasons: deferring the archive to the final link,
memoising the HIR walk, verifying file identity once.

Two of the three original leads are now ruled out by measurement rather than
argument. **Disk I/O is not the cost** — `time -l` reports *zero* block input
and output operations, so the 2.6s of sys time is allocation churn from rustc's
MIR pipeline, not the filesystem. **The manifest is not the cost** either: 8.1 MB
for 3,600 lines looks wasteful and never reaches disk in the measured window.
And the **diagnostic trace is not the cost**: gating its per-body span
formatting measured 4.46/4.49 with against 4.49/4.46 without, so the gate was
reverted rather than shipped as a knob that buys nothing.

`sample` puts 924 of 1635 samples in `after_analysis` → `optimized_mir`, and
removing the forcing outright takes 5.32s → 2.30s. So the forcing is 57% of the
cost, matching the profile. It is also load-bearing: the comment at main.rs:3286
records that forcing per body is what ensures every degradation is recorded
before the manifest is written.

### The ratchet rewarded breaking that

Forcing the *earliest* hooked query instead of the last looked principled — the
binder consumes pre-optimization MIR in most paths — and the ratchet called it a
large win:

```
build_script_build 71.74% -> 100%  (+28.26)
zmij               78.63% -> 100%  (+21.37)
exactness held or improved across 18 crates
```

It was catastrophically wrong. Obligation counts were **identical** while
declines went 133 → 0 and 39 → 0 and every limitation vanished, `uncompiled`
included — those cfg-eliminated statements certainly still exist. Binding
simply stopped running, so nothing could fail, and the manifest claimed 100%.

The gap is structural: exactness is `(measurable − unbound) / measurable`, and
**both halves fall when checking stops**. A change that binds nothing scores
perfectly. Our primary guard against wrong numbers rewards the worst wrong
number the tool can produce.

What the manifest is missing is a count of bindings *attempted*. Obligations
collected come from HIR and stayed constant, which is exactly why nothing
looked wrong. Recorded as its own task, with two cheaper cross-checks: a large
fall in limitations should read as suspicious, and `uncompiled` reaching zero in
a crate with validated cfg-disabled code should fail outright.

The corpus chain would probably have caught this at the fixtures. But the
ratchet is what gates every binder change during development, it runs in two
minutes against the chain's twenty, and it said *held or improved*.

## The structural cost: two instrumentation systems, one shipped

Measured back to back on a real-crate probe (serde_json + http + dependencies),
each with a fresh target directory:

| build | wall | CPU |
| --- | --- | --- |
| plain | 1.54s | 2.07s |
| rustc `-C instrument-coverage` | 1.60s | **2.15s — 1.04x** |
| supercov | 3.93s | **6.62s — 3.2x** |

**rustc's own coverage instrumentation is essentially free.** Four percent of
CPU. Ours costs another 220% on top of it — and main.rs:2995 sets
`instrument_coverage = InstrumentCoverage::Yes`, so every supercov build already
pays rustc's pipeline in full.

We consume half of what we pay for. rustc computes coverage graphs, emits
`VirtualCounter` statements, builds `function_coverage_info` mappings and links
LLVM counter arrays. We read the **mappings** — to learn which block group is
which branch — and discard the **counters**, injecting our own in their place:
bridge blocks, edge rewrites, `runtime_call_block` calls, and the misbind
post-conditions and relocation composition that exist to keep those injections
correct. Much of what this session repaired is machinery guarding a second
counter system we did not need to build.

The reason it exists is **per-test attribution**. LLVM counters are one global
array dumped at exit, giving whole-run totals; our probes carry a context id so
a hit can be traced to the test that caused it. That requirement, not the
measurement, forced the second pipeline.

Which reframes the performance problem entirely. The question is not "how do we
make our instrumentation cheaper" — it is **"can per-test attribution be
obtained from rustc's counters"**. Reset them between tests and read the deltas,
and the whole injection layer disappears along with its failure modes.

The objection to answer first is parallelism: libtest runs tests in threads
against one global array, so naive snapshot deltas interleave and attribution
becomes *wrong* rather than coarse. Three routes, cheapest first — serialise
only when attribution is requested and measure what that costs; per-context
counter sections if LLVM's runtime can provide them; or a hybrid using rustc's
counters for the denominator and probes only where per-test data is actually
asked for.

Also worth recording: the 3.60s "baseline" quoted earlier in this work was
measured under contention. The real figure is 1.54s, which makes supercov 2.6x
wall rather than 1.31x. Every comparison in this section was re-run back to back
for that reason.

### Per-test attribution without probes: proven

The requirement that forced the second pipeline is per-test attribution — LLVM
counters are one global array dumped at exit, so they give whole-run totals,
while our probes carry a context id. That turns out not to need probes at all.

`scratchpad/llvmcov`, an ordinary crate built with `-C instrument-coverage`,
declares three symbols from the profiling runtime rustc already links:

```rust
fn __llvm_profile_reset_counters();
fn __llvm_profile_begin_counters() -> *const u8;
fn __llvm_profile_end_counters() -> *const u8;
```

Reset before a test, read the array after, and the result is exactly what that
test touched:

```
only_alpha  ->  counters [0, 3, 4, 5]
only_beta   ->  counters [0, 1, 2, 5]
```

Distinct per test; the shared indices are the harness itself. No custom runtime,
no injected probes, no bridge blocks.

So the performance question resolves into a much smaller one. Not "how do we
make our instrumentation cheaper", but **what does parallel test execution cost
us** — libtest runs tests in threads against one global array, so concurrent
reset-and-read interleaves and attribution becomes *wrong* rather than coarse.

That is a measurement, not a design puzzle: compare `cargo test` serial against
parallel on a real suite, and weigh that delta against the 3.2x compile cost
this design removes. Serialising only when per-test attribution is requested is
very likely cheaper than paying 220% CPU on every build. If it is not, the
hybrid stays available — rustc's counters for the denominator, probes only where
per-test data is actually asked for.

### What per-test attribution costs, and why it settles into a default

Counters are one global array, so attributing them per test means serialising.
Measured on `bytes-1.12.1`'s real suite, warm, under `-C instrument-coverage`:

| run | wall |
| --- | --- |
| parallel (default threads) | 38.4s |
| serial (`--test-threads=1`) | 64.0s |

**1.67x on test wall, against 2.6x on compile wall.** Which of those is the
better trade depends entirely on the project, and the two cases point opposite
ways:

- **Compile-dominated** work — most libraries, most CI — wins clearly with the
  structural design: 1.04x compile, and serialisation only when attribution is
  actually requested.
- **Test-dominated** suites like `bytes`, where tests take 38s against a few
  seconds of compiling, would pay *more* for serialising than our current
  instrumentation costs them.

So this is a default rather than an algorithm. Whole-run coverage from rustc's
counters, parallel tests, 1.04x compile — structurally fast, not cached-fast —
with per-test attribution as an explicit mode that serialises. Users who want
per-test data pay 1.67x on tests instead of everyone paying 220% CPU on every
build.

Two things remain unmeasured and both would strengthen the case. The **runtime**
cost of our probes against LLVM counters has never been timed — the numbers
above are all `-C instrument-coverage`, and the same suite under supercov's
probes is unknown. And **one test per process** would give attribution without
serialising within a process, since counters are per-process; the cost is
process spawn per test, which for a suite of small tests may beat both options.

### Process-per-test ruled out by measurement

Counters are per-process, so running each test in its own process would give
attribution *without* serialising — parallelism and per-test data at once. On
`test_buf`, 875 tests:

| strategy | wall | attribution |
| --- | --- | --- |
| one process, parallel threads | 0.01s | no |
| one process, serial | 0.03s | **yes** |
| one process per test, 8-way parallel | **0.28s** | yes |

Process spawn costs **28x** for a suite of many small tests, against 3x for
serialising the same work — and in absolute terms serialising costs 20ms.
Spawn is a per-test constant, so it dominates precisely when tests are cheap,
which is the common case. Process-per-test would only pay off for a handful of
long-running tests, which is the case that least needs the help.

So serialisation is the mechanism, and its cost tracks how much parallelism a
suite genuinely exploits: 3x on `test_buf`'s trivial tests where threads barely
help, 1.67x across `bytes`' whole suite where some tests are slow. Both are paid
only when per-test attribution is requested, against 220% CPU on every compile
under the current design.

That settles the architecture:

- **Default**: rustc's own counters, whole-run coverage, tests parallel.
  **1.04x compile**, no test-time penalty, and the entire injection layer —
  bridges, edge rewrites, misbind post-conditions, relocation composition —
  stops being needed.
- **Per-test attribution**: an explicit mode that serialises, using
  `__llvm_profile_reset_counters` and the begin/end counter symbols proven
  above. Cost is suite-dependent and bounded by how much the suite parallelises.

One measurement still outstanding, and it can only strengthen the case: the
runtime cost of our probes against LLVM counters. Every figure here is
`-C instrument-coverage`; the same suites under supercov's probes have not been
timed.

### The runtime side, and the case closes

The last outstanding comparison: our probes against LLVM counters *at test time*.
Same `test_buf` binary, same 875 tests:

| build | wall | user |
| --- | --- | --- |
| `-C instrument-coverage` | 0.01s | 0.01s |
| supercov probes | **0.70s** | 0.02s |

User time is nearly identical, so this is not per-probe execution cost — it is
roughly **0.7s of fixed startup and teardown per test binary**. `bytes` ships 14
of them, so that is about ten seconds of pure overhead on a suite whose actual
instrumented work is milliseconds.

So the second pipeline costs on both sides: 220% CPU at compile, and a fixed
per-binary toll at test time that LLVM counters do not pay.

**The full picture:**

| | compile | test-time | attribution |
| --- | --- | --- | --- |
| rustc counters, parallel | **1.04x** | ~0 | whole-run |
| rustc counters, serial | 1.04x | 1.67x worst observed | **per-test** |
| supercov probes today | **3.2x** | ~0.7s per binary | per-test |

Which makes the design decision straightforward, and it is a default rather than
an algorithm. Ship rustc's counters with whole-run coverage and parallel tests —
1.04x compile, no per-binary toll, structurally fast rather than cached-fast.
Offer per-test attribution as an explicit mode that serialises, using
`__llvm_profile_reset_counters` and the begin/end symbols proven above, paying a
suite-dependent cost bounded by how much that suite actually parallelises.

Process-per-test was the appealing third option — counters are per-process, so
it would give attribution without serialising — and it is ruled out: 28x on 875
small tests, because spawn is a per-test constant that dominates exactly when
tests are cheap.

What this retires, if adopted: probe injection, bridge blocks, edge rewriting,
relocation composition, and the misbind post-conditions that exist to keep those
correct — most of what this session spent its time repairing. The HIR obligation
walk stays, because that is what makes the numbers *mean* something, and it is
the cheap half.

## Perfect coverage at 1.04x: shard the tests

The apparent trade — per-test attribution *or* parallelism — was false. It came
from assuming the only two options were one process (serialise) or one process
per test (spawn cost). The middle is sharding, and libtest supports it directly:
multiple `--exact` filters in one invocation select an arbitrary subset
(`running 3 tests … 872 filtered out`).

So: N processes in parallel, each running its shard's tests **serially** with
reset-and-read between them. Counters are per-process, so each shard owns its
array; serial within a shard makes attribution exact; N processes instead of one
per test makes spawn negligible. Measured on `test_buf`, 875 tests, warm:

| strategy | wall | attribution | parallel |
| --- | --- | --- | --- |
| parallel threads | 0.01s | no | yes |
| serial, one process | 0.03s | yes | no |
| process per test | 0.28s | yes | yes |
| **8 shards, serial within each** | **0.01s** | **yes** | **yes** |
| supercov probes today | 0.70s | yes | yes |

Sharding matches uninstrumented parallel speed while giving exact per-test data.

### The whole design, then

| stage | mechanism | cost |
| --- | --- | --- |
| compile | rustc `-C instrument-coverage` (already enabled) | **1.04x** |
| obligations | our HIR walk — identity, denominator, honesty | cheap, unchanged |
| binding | match obligations against rustc's coverage mappings | no MIR forcing |
| hits | rustc's LLVM counters | free |
| per-test | shard tests, reset-and-read within each shard | ~0 |

The honesty guarantee survives intact, which is the part worth being careful
about. "Exact or declined" does not depend on *our* MIR analysis — it depends on
whether an obligation can be tied to something that counts. Today we bind to our
own injected probes; in this design we bind to rustc's coverage mappings, which
it computes anyway and which we already parse. An obligation with no mapping
declines exactly as it does now. The lattice is unchanged; only the thing it
binds against gets cheaper.

What this retires: probe injection, bridge blocks, edge rewriting, relocation
composition, and the misbind post-conditions that keep those correct — most of
what this session spent its time repairing. What it keeps is the HIR obligation
walk, which is what makes the numbers *mean* something, and is the cheap half.

Cost of the whole thing: 1.04x compile, no per-binary toll, full per-test
attribution. Against today's 3.2x CPU and 0.7s per test binary.

### Correction: sharding breaks arbitrary test commands

Sharding requires supercov to enumerate tests and re-invoke the binary with
`--exact` filters — that is, to **rewrite the user's command**. It breaks
`cargo nextest run`, custom test scripts, and anything with its own arguments.
The JS frontend never does this: it instruments and lets the command run
untouched, and the Rust frontend today matches that — per-test attribution comes
from libtest *context* inside the process, not from how the command is invoked.

So sharding is available as an opt-in for users who accept a managed command,
but it cannot be the default without giving up UNIVERSAL, which outranks FAST.

That constraint is worth stating precisely, because it is fundamental rather
than an implementation gap: **with parallel tests and one global counter array,
exact per-test attribution is impossible.** Concurrent reset-and-read
interleaves, so a test gets credited with work another thread did — a wrong
number, not a coarse one. Attribution under parallelism needs per-context
counters, which is exactly what our injected probes provide and what LLVM's
runtime does not.

### What survives, and it is most of the win

The expensive part of our pipeline was never the probes themselves. It is
forcing `optimized_mir` for every body — 57% of cost — and that exists only
because the manifest is written in `after_analysis`, before codegen, so every
degradation has to be recorded by then.

Two changes remove it without touching attribution:

1. **Bind against rustc's coverage mappings** rather than our own MIR analysis.
   rustc computes `function_coverage_info` during the coverage pass it already
   runs, and we already parse it. Binding an obligation to a mapping needs no
   forced pipeline.
2. **Move the manifest past codegen** (#49). `main()` already writes CTFE
   outputs after `run_compiler` returns. Injection then happens naturally as
   codegen lowers each body — no forcing, and bodies codegen never lowers are
   honestly NOT_COMPILED rather than expensively "measured".

That keeps injected probes, so per-test attribution and arbitrary test commands
both survive, while removing the forcing that dominates compile cost. The
sharding experiment is not wasted: it stays the opt-in path for anyone who wants
attribution *and* wants it free, and it proved that rustc's counters can carry
per-test data at all.

## Decomposing the 3.2x: injection is only half of it

Before converting probes from calls to statements, the cost was decomposed by
running the wrapper with MIR instrumentation disabled — which keeps the HIR
obligation walk and the manifest but emits no probes. Real-crate probe, fresh
target dir each:

| build | wall | CPU |
| --- | --- | --- |
| no wrapper | 2.35s | 2.06s |
| wrapper, HIR walk + manifest, **no injection** | 2.61s | **3.60s — 1.75x** |
| wrapper, full | 4.32s | **6.53s — 3.2x** |

So the overhead splits nearly evenly: **+1.54s before any probe is emitted**,
and +2.93s for MIR binding and injection. The assumption that injection
dominated was wrong; it is about 55%.

That matters for the target. Converting probes to thread-local statement form
addresses the injection half — CFG inflation is real, since a
`TerminatorKind::Call` splits a block per obligation where LLVM emits a single
`add` — but even a *free* injection leaves 1.75x from collecting obligations and
serialising the manifest. Reaching 1.1x means cutting roughly 99% of the current
overhead, which no single change delivers.

The honest levers, each now sized:

1. **Statement-form probes** (#51). Removes CFG inflation and everything rustc
   pays downstream for carrying it. Bounded above by the 55% injection share.
2. **The manifest.** 8.1 MB per crate built by ~10,800 `format!` calls and a
   join. It never touches disk in the measured window, so this is pure CPU in
   string construction — and 33% of its bytes are `canonical` strings, whose
   digest is already the obligation id.
3. **The HIR walk**, already memoised, and the part that makes the numbers mean
   anything. Least negotiable.

Which reframes the target honestly. 1.1x cold, with per-obligation instrumentation
*and* per-test attribution *and* the full obligation model, is not reachable by
tuning these three. What looks reachable is materially better than 3.2x — plausibly
under 2x — and the remaining gap is a design question about how much is measured
per obligation, not an optimisation question.

## What rustc's integrated instrumentation can and cannot give us

The 1.04x figure is real, but it was quoted before checking what it buys.
rustc 1.95 accepts `-Zcoverage-options=block | branch | condition` (the older
`mcdc` spelling is gone), and all three compile. The ceiling is set by the
mapping model in `rustc_middle/src/mir/coverage.rs:133`:

```rust
pub enum MappingKind {
    /// Associates a normal region of code with a counter/expression/zero.
    Code { bcb: BasicCoverageBlock },
    /// Associates a branch region with separate counters for true and false.
    Branch { true_bcb: BasicCoverageBlock, false_bcb: BasicCoverageBlock },
}
```

**Two variants. There is no condition or decision mapping kind at all.**
`CoverageLevel::Condition` is documented as "same as branch coverage, but also
adds branch instrumentation for certain boolean expressions that are not
directly used for branching" — it emits *more Branch mappings*, one per operand,
so each condition gets its own true/false counters.

That is **condition coverage**, and it is not MC/DC. Per-condition totals say
each operand took both values across the whole run; MC/DC requires knowing which
*combination* occurred on each evaluation, so that a condition can be shown to
have independently affected the outcome. Counters cannot express a vector — two
conditions each hitting true and false separately is indistinguishable from the
pairs that actually occurred together.

So the honest accounting of what our 3.2x buys over rustc's 1.04x is exactly two
things:

| capability | rustc integrated | ours |
| --- | --- | --- |
| line / region coverage | yes | yes |
| branch coverage | yes | yes |
| condition coverage | yes (`condition` level) | yes |
| **MC/DC decision vectors** | **no — not expressible** | yes |
| **per-test attribution** | **no — counters are global** | yes |
| obligation identity, exact-or-declined | derivable from mappings | yes |

Both gaps are structural rather than missing features. MC/DC needs correlated
observations, which a counter array cannot hold; per-test attribution needs
per-context recording at the hit, which a global array cannot do under parallel
tests.

Which means the earlier framing — "we run two instrumentation systems and use
half of one" — was too strong. We do run rustc's pipeline and discard its
counters, and binding against its `Code` and `Branch` mappings instead of our own
MIR analysis is still worth doing. But its counters genuinely cannot carry the
two things the north star's MC/DC and per-test claims depend on. The redundancy
is in the *binding analysis*, not in the probes.

## Research: what LLVM can express, and why our probes stay

Reading upstream rather than inferring from the local toolchain changes two of
the conclusions above.

**MC/DC is expressible in LLVM, and rustc used to expose it.** `MappingKind`
carried `MCDCBranch` and `MCDCDecision` until they were removed in
rust-lang/rust#144999, on the grounds that the MC/DC code was "a major burden on
overall maintenance of coverage instrumentation, and a major obstacle to other
planned improvements, such as internal changes needed for proper support of
macro expansion regions." Re-implementation of both DC and MC/DC is a 2026
roadmap goal with AdaCore committing to ongoing maintenance. So the capability is
not impossible — it is *absent from 1.95 and returning later*.

**How LLVM expresses it matters more than the fact that it can.** Each decision
gets a bitmap of 2^n bits for n conditions. As conditions evaluate, a *local*
temporary accumulates the condition vector; when the outcome is reached, one bit
is set in the bitmap at the index that vector encodes. Bitmaps merge by OR, and
llvm-cov recovers the executed test vectors from the set bits. That is a handful
of ordinary instructions per decision — no calls.

**Per-thread counters are not available.** The LLVM RFC for putting profiling
counters in thread-local storage (llvm-project#95494) is explicitly experimental,
aggregates per-thread values into the globals only *at thread exit*, and says
nothing about reading them per thread at runtime or about making MC/DC bitmaps
thread-local. It also only works "when no threads are left running and the main
thread calls exit". So there is no upstream mechanism today for attributing hits
to a test under parallel execution.

### What this settles

Our probes stay, and for a sharper reason than before: rustc 1.95 cannot express
MC/DC *at all* right now, and nothing upstream provides per-test attribution
under parallelism. Both of the things our 3.2x buys are genuinely unavailable
from the integrated pipeline.

But the *shape* of LLVM's instrumentation is the target, and it is proven at
1.04x on the same workload:

| | LLVM | ours today | ours, target |
| --- | --- | --- | --- |
| region hit | one `add` in an existing block | `Call` + block split | statement, thread-local base |
| MC/DC | local temp accumulates vector, one bitmap bit set per decision | `Call` per condition and per decision | local temp + one thread-local bitmap update |
| attribution | none (global) | thread-local context in runtime | thread-local base *is* the attribution |

The thread-local base is the whole trick: it is what LLVM lacks and what makes
per-test attribution work without serialising, and it costs the same as LLVM's
global base because TLS access on both targets is a register-relative load.

Which also means MC/DC gets *cheaper*, not just faster. Today each condition
costs a call; under the bitmap scheme a decision with n conditions costs n cheap
accumulations plus one bitmap write, regardless of n.

## Building the LLVM-shaped instrumentation

### Stage 1, landed: publish a hit once per context, not once per execution

`ordinal_hit` reserved a crash-visible descriptor and payload in the mmap on
*every* hit, so a loop running a million times published a million records where
LLVM increments one counter. Coverage asks whether an obligation ran, never how
often.

The first attempt buffered hits and flushed at context boundaries, and the gate
caught it immediately: 817 records against 818. Not deduplication — the fixture
calls `ordinal_hit(7)` exactly once, as the last statement before `main`
returns, and the buffered hit was **lost**, because Rust does not reliably run
thread-local destructors for the main thread. Adding an `atexit` hook did not
help either; the buffer is already torn down by then.

Publishing the first sighting immediately and skipping repeats removes the
failure mode rather than patching around it. Nothing is ever buffered, so
nothing can be lost at thread or process exit, and the flush machinery, the
destructor guard and the `atexit` hook all disappeared with it. One asymmetry is
deliberate: during thread-local teardown the dedup set may be gone, and there the
fallback is to **publish**, because a duplicate record reads as one observation
while a missing one reads as uncovered code.

`test_buf`'s 875 tests now run in **0.01s warm, matching `-C instrument-coverage`
on the same binary**, from 0.70s.

### Stage 2, the compile half: scoped, and the main risk retired

The cost is precise: `instrument_runtime_points` clones each plan's block,
pushes it as a continuation, and replaces the original with a call block — **+1
block and +1 call per statement obligation**. scale-400 gains ~2,800 blocks that
rustc then optimises and codegens.

**Coalescing probes per block was measured and rejected.** Statements mostly get
their own block: 2,800 plans across 2,400 blocks on scale-400 (1.17x), 11,369
across 8,980 on real crates (1.27x). Worth ~21% at best, so probe *count* is not
the lever — cost *per* probe is.

**The main risk is retired.** `scratchpad/tlspike` proves a `#[thread_local]`
static array in an rlib built with `RUSTC_BOOTSTRAP` is readable and writable
from a consumer crate compiled *without* bootstrap. Since user crates are never
bootstrap, that was the question that could have killed the approach.

What remains is delivery, not language. The wrapper resolves runtime symbols via
`find_runtime_function`, which scans foreign items from the injected
`RUNTIME_ABI_DECLARATIONS` block, and the runtime ships as a **staticlib** —
which carries no metadata, so there is no `DefId` for a static the way an rlib
would provide. Three routes, with route 2 the most self-contained: declare the
array crate-locally in the injected module and have each crate register its base
pointer with the runtime once, sidestepping staticlib metadata entirely.

Stage 2 also needs dense per-crate indices, since probe ordinals are sparse u64
hashes that cannot index an array. Mechanical, but it changes the evidence format
and must go through the corpus.

## M1/M2/M3: decomposing the overhead, and one fix that moved both halves

**M2's premise was wrong, and measuring it first is what caught that.** The plan
was to delete the manifest's `canonical` strings — a third of its 8.1 MB — as a
large, safe win. Timing the parts:

| component | cost | share of collection |
| --- | --- | --- |
| HIR walk itself | 1.09s | **91%** |
| identity hashing (SHA-256) | 0.072s | 6% |
| source-range resolution | 0.034s | 3% |
| manifest construction | 0.16s | — |

Manifest construction is 0.16s in total, so deleting *all* of it is worth about
1% of overhead. The cost is the HIR walk over every body — precisely what
rustc's own coverage avoids by working on MIR, only for bodies being codegened.

**The fix that did land came from the same measurement.** `stable_source_range`
runs for every recorded span and, for a real file, cloned the `FileName`,
formatted it to a string, normalised the path, then took the global snapshot
mutex just to ask whether the file was already verified. That is a property of
the *file*, not the obligation. Memoised per file per thread, populated only
after the bytes are verified so a hit stands for both identity and verification.

The result was much larger than the collection measurement predicted, because
`stable_source_range` is called throughout **binding** as well:

| | session start | after |
| --- | --- | --- |
| full instrumentation | 6.53s CPU — **3.2x** | **4.63s CPU — 2.28x** |
| collection only | 3.60s — 1.75x | 3.33s — 1.64x |

Reproducible across runs (4.63, 4.62 against a 2.03 baseline). **Total overhead
fell 30% from one change**, and the two halves are now even: ~1.30s collection,
~1.30s injection, where injection was 2.93s.

That puts **M1's ≤2.0x target within reach of a single further step**, and it
was reached from the M2 direction rather than the M1 one — the lesson being that
the profile, not the plan, decides where the cost is.

What remains for each milestone is now sharp. M1 targets the 1.30s of injection,
where CFG inflation is the mechanism: a `TerminatorKind::Call` splits a block per
obligation where LLVM emits one `add`. M2 targets the 1.30s of collection, which
is the HIR walk itself and not the manifest. M3 needs both to land near zero,
and on current evidence the honest expectation is closer to 1.3x than 1.1x
unless what is measured per obligation changes.

### Where the collection cost actually was

Asked to work on the slowest part, and profiling kept giving the same answer:
**JSON escaping**, not the HIR walk.

The first fast path checked whether a string needed escaping and returned it
untouched otherwise. That helped ids and paths and did nothing for the strings
that matter — canonical strings are NUL-separated, so they *always* need
escaping and always fell to the character-by-character loop. Copying the runs
between escapes instead took scale-400 from 1.06s to ~0.95s.

| workload | session start | now |
| --- | --- | --- |
| real crates | 6.53s CPU — 3.2x | **~4.32s CPU — 2.14x** |
| collection only | 3.60s — 1.75x | ~3.19s — 1.58x |
| scale-400 | 4.46s wall — 8.1x | **~0.97s wall — 1.8x** |

Five wins landed, every one located by the profile rather than the plan:
per-file source identity, the escape fast path, `Rc`-shared body obligations,
`format!` removed from id construction, and run-based escaping.

**Two things were tried and reverted**, both because the measurement said so
rather than because they looked wrong. Rewriting `json_strings` and
`json_usizes` to build in place removed four allocations per call and measured
*slightly slower* — the capacity precomputation walks the slice twice and
`definitions` is usually one element. And the manifest's `canonical` strings,
proposed for deletion as a third of its bytes, turned out to be worth about 1%.

**M1's original delivery route is closed.** A foreign `#[thread_local]` static
cannot be declared in a user crate: the feature gate fires and user crates are
never bootstrap. Statement-form probes therefore need a crate-local array plus
registering its base pointer with the runtime, which is materially more work
than "dense indices and a delivery route" implied when the milestone was
written.

What is left in the profile is no longer waste. `escape` remains top at ~48
samples even after the rewrite, SHA-256 is ~61 and is inherent to obligation
identity unless the digest changes (which would rewrite every id in stored
evidence), and `stable_source_range` still costs ~52 after memoisation. The
cheap allocations are gone; what remains is the work itself.
