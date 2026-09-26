# Supercov issues observed during the scaling step

No existing product bug was fixed. Measurements and this note are in the
`codex/asserted-typescript-analyzer` worktree.

## RUST-TIMING-001: build and execution intervals overlap

Source-confirmed in this checkout. `rust_compiler_orchestration.rs` starts its
`started` clock before the build/setup phase. It then starts `execution_started`
before the Cargo test execution and calculates both `execution_ms` and `build_ms`
after execution has ended. Thus `build_ms` includes `execution_ms`.

`rust_compiler_run.rs` publishes these directly as `instrumentedBuildMs` and
`testCommandMs`. The shared `RunTimings` names invite interpreting them as separate
phases, but adding them double-counts the execution interval for this backend.

Example from the previous identity repeat's `run.json`:

- Total recorded duration: 7,185.2 ms.
- `instrumentedBuildMs`: 6,633.4 ms.
- `testCommandMs`: 861.9 ms.
- Those two fields alone add to 7,495.3 ms, already greater than total duration.

Retained example:
`/var/folders/4q/cdhj37516zzbc7z9ckrst0x40000gn/T/supercov-rust-asserted-AnvVdk/fixture/.supercov/runs/run_a123456789abcdef/run.json`.

Measurement-only workaround: retain both raw numbers, subtract `testCommandMs`
from `instrumentedBuildMs`, and label the result **pre-execution setup/build**,
not pure rustc compilation. The execution number still includes Cargo and runner
bookkeeping. Do not modify the product clocks, silently relabel old reports, or
subtract execution a second time in consumers already compensating for it.

Future fix should define non-overlapping timer semantics and test the actual
orchestration boundaries. This step only documents and accounts for the overlap.

## RUST-ASSERT-PERF-001: repeated source analysis grows superlinearly

Prototype scalability limitation, not an established false assertion verdict.
The frozen scaling run retained all expected evidence while optimized source
analysis took 8.96 ms, 152.73 ms and 3,571.52 ms at 32, 128 and 512 functions.
No recognizer optimization or scope expansion was made during measurement.

The recognizer reparses a whole file per test result, walks all test bodies per
result, and repeatedly scans compiler records. These are code-confirmed repeated
operations; their individual cost shares were not resolved by the unsymbolized
release profile. Raw samples and reproduction are in the scaling findings and
results JSON. Optimize only with unchanged witness/provenance/unknown parity.

## Comparator correction, not a product bug

The first scaling pair failed only because it required identical opaque phase
IDs across runs. Those include dynamic invocation nonces. The benchmark now
checks a phase-label bijection with no lost links, merged phases or split phases;
the stopped pair is retained. The prior tiny identity calibration's raw
cross-run phase-ID equality may likewise be unnecessarily strict. It was not
silently rewritten in this step. Same-archive query replay still requires exact
semantic equality, including phase IDs.
