# Rust compiler companion protocol v1

Status: **frozen selection envelope; implementation private**.

The compiler companion is a Supercov-owned frontend component built against
one exact rustc private ABI. It is selected automatically by the main binary
and used as Cargo's compiler wrapper. It is not an external coverage engine,
does not analyze coverage, and may emit only obligations, provenance and probe
observations through evidence v3.

Selection is exact across the rustc commit, host triple and SHA-256 of the
loaded `librustc_driver`. Release text is diagnostic metadata, not a substitute
for those identities. Unknown fields, malformed identities, or a mismatch are
fatal. Supercov may never try a “nearby” compiler companion.

Every handshake declares these capabilities explicitly:

- expanded HIR provenance;
- runtime MIR probe insertion;
- generated-source provenance;
- CTFE path tracing;
- rustdoc/doctest tracing;
- exact test-harness attribution.

All six are required before `rust-source-v1` can be public and
measurement-complete. A private spike may truthfully advertise a subset. The
main engine, not the companion, decides readiness and completeness.

Building companions requires exact development components. User runs require
only the ordinary matching `rustc`/Cargo toolchain: the small prebuilt
companion dynamically uses the compiler-driver library already shipped with
rustc. Missing companions fail closed without installing or modifying a user
toolchain.
