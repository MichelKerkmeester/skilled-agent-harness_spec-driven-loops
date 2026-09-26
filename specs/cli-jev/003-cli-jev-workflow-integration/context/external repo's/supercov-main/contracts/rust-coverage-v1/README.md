# Rust source coverage model v1

Status: **semantic contract frozen; product frontend private**.

Variant: `rust-source-v1`. Language: `rust`. This is the target denominator
for public Rust support, not a claim that the current private instrumenter is
complete. Until the implementation passes every requirement below, it must use
an explicitly private model variant, publish blocking manifest limitations and
refuse a measurement-complete claim.

## Source identity and aggregation

Obligations are attached to the frozen, project-relative UTF-8 source range
that expresses the behavior. Generic monomorphizations, trait instantiations,
and repeated macro expansions contribute observations to the same source
obligation when they originate from the same authored range. Distinct authored
ranges never merge merely because their generated code or names match.

Build-script output, included files and proc-macro output that compile into an
owned crate are part of the denominator. Each must have a deterministic source
identity and provenance mapping. Code outside the owned source graph is out of
scope only through the separately frozen scope rules; it may not disappear
because it is difficult to instrument.

Source identity v1 hashes a NUL-delimited canonical tuple with SHA-256 and uses
the first 12 digest bytes in the typed obligation ID. Authored source,
`include!` source and declarative expansion tokens use model, obligation kind,
project-relative source key and original UTF-8 byte range. This deliberately
aggregates repeated expansions of the same authored macro tokens. An explicit
semantic discriminator separates alternatives that share a range. Synthetic
procedural/derive output whose spans collapse to an invocation additionally
uses the complete stable expansion chain, rustc's textual owner path and an
owner-local structural ordinal; two distinct invocations or generated nodes
therefore cannot merge merely because they emit the same name or bytes.
Generated `OUT_DIR` sources use the project-relative owning
package root plus path relative to `OUT_DIR`, never target-directory hashes or
absolute paths. Any unknown provenance, ephemeral-path dependency or digest
collision is fatal for manifest publication. Run fingerprints separately bind
the exact source, package graph, compiler and macro binaries that gave those
stable locations meaning.

## Points

- One statement obligation for each executable `let` statement, expression
  statement and executable tail expression.
- One function-entry obligation for every function, method, closure and async
  body with executable source. Async entry means first execution/poll of the
  body, not construction of its future.
- Item declarations, type-only syntax, attributes and compile-time-only
  declarations are not runtime statement obligations. Executable initializer
  or generated bodies are measured under their own semantics.

## Decisions, conditions and MC/DC

Masking MC/DC uses source-ordered atomic conditions and probe-v2 ternary values
(`unreached`, `false`, `true`). A condition is independently covered only by a
valid masking witness pair; merely observing true and false is insufficient.

Control decisions include boolean and pattern conditions in `if`, `if let`,
`while`, `while let`, let chains, match guards, and assertion conditions.
Nested `&&` and `||` are flattened in source evaluation order; parentheses do
not create conditions. A pattern/let condition is one atomic match-success
condition unless it contains a separately evaluated boolean guard.

Control flow hidden inside an external macro implementation is not attributed
to the caller merely because its expansion span collapses to the invocation.
An owned assertion invocation contributes the frozen assertion pass/panic
alternatives, but private `if` expressions used to implement `assert!`,
`println!` or another external macro are not extra authored decisions.

Instrumentation must preserve short-circuiting, evaluation count/order,
temporaries, borrows, moves, autoderef/autoref, `Drop`, panic/unwind behavior,
async suspension, inferred names/types and diagnostic outcomes.

## Branch alternatives

The denominator includes:

- true and false decision outcomes;
- short-circuited and right-evaluated outcomes for `&&` and `||` wherever they
  select values or contribute to a decision;
- zero and entered outcomes for `while`, `while let` and `for` loops;
- selected and not-selected outcomes for each reachable match arm, including
  guard rejection;
- matched and `else` outcomes for `let else`;
- continued and early-return/residual outcomes for `?`;
- assertion pass and panic outcomes where an assertion exists in owned source.

An unconditional `loop` has no fictitious zero-iteration alternative. Diverging
and statically unreachable code remains in the structural denominator unless
the frozen scope/exclusion contract identifies it explicitly.

## Expansion and compile-time execution

Declarative macros, procedural/derive macro output, generated sources,
`include!`, const blocks, const/static initializers and `const fn` evaluation
cannot be silently omitted. Public support requires an owned, automatically
selected insertion/observation path with exact authored/generated provenance.
If a supported toolchain cannot provide that path, the run must carry a
located blocking limitation and may not claim model completeness.

Doctests are owned tests. Their extracted source, hidden lines, crate mapping,
runner identity and observations must map deterministically back to the
documented source without editing the user's checkout.

## Attribution and completeness

Every observation carries exact run, worker, logical test, retry and phase
identity. Background or late work is retained but never reassigned by timing.
Failed attempts cannot verify passed-only coverage. Missing/corrupt evidence,
unknown obligations, ambiguous runner identity, unsupported generated code,
or any blocking structural limitation makes measurement incomplete.

Standard `cargo test` and rustdoc/libtest each expose exactly one attempt, so
their frozen retry ordinal is zero. A retry-capable runner must supply attempt
identity rather than Supercov inferring it from repeated names or output.
For nextest 0.9.138 through 0.9.140, the target-runner environment is
authoritative. The outer supervisor authenticates the exact nextest version
before list or run. Official 0.9.138 and 0.9.140 binaries have executable
contract gates; no 0.9.139 release exists. Versions outside that frozen range
fail closed:
the 1-based `NEXTEST_ATTEMPT` becomes retry ordinal `attempt - 1`, while
`NEXTEST_ATTEMPT_ID` remains an opaque run-unique runner identity. The list
phase is a transparent pass-through and publishes no evidence. Partial or
inconsistent identity fails before the test runs. Stress iterations are not
retries; until the shared protocol gains that separate axis, stress mode fails
closed rather than collapsing multiple executions into one logical attempt.
The machine-readable list is also the exact selected-test catalog. A selected
test cancelled by fail-fast is retained as `unstarted` with logical test
identity only; Supercov must not invent a worker, retry, phase, scope or
observation for an attempt that nextest never launched.
Pre-separator selection options and post-separator emulated-libtest filters are
projected byte-for-byte into the machine-readable list command. Concurrent
target-runner invocations reserve distinct durable ordinals and retain distinct
opaque attempt IDs. An uncatchable target-runner death publishes no false unit,
leaves an unmatched durable reservation that makes ingestion fail closed, and
cannot let its supervised test process escape.

`100%` for this model means every frozen point and branch alternative was
observed and every atomic condition has a valid masking-MC/DC witness, with no
blocking measurement limitation. It does not prove input-partition, path,
schedule, mutation or assertion semantic correctness.
