# rustc backend feasibility spike

This development-only crate tests whether an exact rustc-versioned compiler
bridge can see the expanded HIR/MIR and source provenance required by
`rust-source-v1`. It is not linked into the Supercov product and is not a user
dependency.

Build it only with the repository's pinned toolchain and matching development
components:

```sh
rustup component add rustc-dev llvm-tools rust-src --toolchain 1.95.0
RUSTC_BOOTSTRAP=1 cargo build --manifest-path spikes/rustc-backend/Cargo.toml
```

`npm run test:rustc-backend-spike` runs the checked-in
macro/generated/const/doctest fixture through the resulting binary as
`RUSTC_WRAPPER`, validates compiler provenance, and proves that an optimized
MIR query replacement reaches emitted code. The companion injects its probe
runtime as an in-memory crate item, calls it from MIR, proves the observations
arrive, compares values/errors/panics/drop order/stdout/stderr to an ordinary
build, and verifies the fixture source hash is unchanged.

The same executable also overrides `mir_for_ctfe` for a const function. It
inserts in-memory block markers and concurrency-safe edge markers into split
CTFE edges, then observes only those markers through an in-process rustc
interpreter event subscriber. The fixture evaluates both sides at compile
time; the test requires both edge observations, all original blocks, identical
const values and byte-identical program stdout/stderr. The subscriber has no
formatting/output layer, so compiler-internal events do not leak into user
output.

This is a feasibility proof, not the production const implementation. Stable
manifest identities, every const/static/inline-const surface, crash-safe
publication, ordinary `RUSTC_LOG` coexistence and performance remain explicit
gates. External LLVM/rustc coverage is not used. All fixture targets and
observations live in a temporary directory and are deleted after the spike.

The executable also proves the rustdoc interception boundary. A generated
launcher invokes the exact ordinary rustdoc with Supercov as its
`--test-builder-wrapper`; user code needs no configuration. The companion sees
standalone synthesized stdin, merged bundle source and the merged runner's
`__doctest_N` identity table. For the proven single-line standalone slice,
rustdoc path/offset metadata plus an exact bounded snippet match maps hidden
setup and visible assertion statements to byte ranges in the original
documentation source. Assertion macro invocations become one authored
statement each; their generated implementation statements and rustdoc's
synthetic `fn main` do not enter the denominator. The emitted point probes run
under the standalone doctest's exact test context. Merged runner HIR binds the
same ordinal to rustdoc's source path and line. The launcher's
private unstable-option bootstrap is removed before compiling user doctest
code; a `compile_fail` feature-gate test proves it does not enable unstable
Rust. Normal and intercepted doctest output match after replacing elapsed-time
values, and the checkout hash remains exact. The first runtime slice is now
real as well. The spike links one Supercov-owned static runtime into the whole
doctest process graph, so an instrumented dependency and its rustdoc harness do
not get disconnected TLS state from duplicate per-crate runtimes. Standalone
tests enter a crate/path/line identity in their synthesized `main`. Merged
runner and bundle compilations independently derive the same crate-group plus
`__doctest_N` identity; the bundle child enters it itself, while the runner HIR
maps it to rustdoc's human test name. Calls into an instrumented dependency
publish under two distinct exact contexts with no drops or incomplete records.
Unrelated setup observations remain background rather than being reassigned.

Multiline and merged extracted-source obligations/probes, outcome/retry archive
joining, custom rustdoc/wrapper composition, failure/signal forwarding and the
full hidden/merged/compile-fail/no_std corpus remain promotion gates. Ambiguous
or missing source matches fail closed instead of receiving invented locations.
This spike proves automatic interception, exact standalone single-line source
identity and the first exact runtime-attribution slice, not the complete
`rustdocDoctestTracing` capability.
