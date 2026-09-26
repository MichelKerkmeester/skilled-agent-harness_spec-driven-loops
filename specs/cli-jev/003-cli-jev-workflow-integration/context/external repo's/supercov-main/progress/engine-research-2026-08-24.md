# Engine plan — research findings and open spikes (2026-08-24)

Companion to `engine-master-plan-2026-08-24.md`. What comparable projects do,
what that changes in our plan, and the spikes that must close before each
phase starts.

## Findings from other projects

### 1. TypeScript's Go port (tsgo): port structurally, never redesign mid-port
Microsoft ported tsc file-by-file, keeping the code *structurally identical*
to the TS implementation, then validated against ~20,000 existing compiler
test cases and multi-million-LOC real codebases. They did not "improve" logic
during the port. **Implication:** our Rust port mirrors the TS modules
one-to-one (same decision order, same naming, same edge-case handling), and
all redesigns (probe v2, bitset MC/DC pair search) land on the TS engine
*before* the port so Rust targets frozen semantics. This confirms and
hardens our phase ordering.

### 2. Ruff's "ecosystem check": the differential harness should be permanent
Ruff runs every PR against a pinned corpus of real-world repositories and
comments the behavioral diff. Biome published a Prettier-compatibility score
computed from Prettier's own test suite. **Implication:** the Tier-1
compatibility sweep corpus (pinned SHAs) graduates into a standing
"ecosystem check": a scheduled CI job that runs the engine against the corpus
and diffs evidence/reports against the previous engine build. During the
port, parity is publishable as a number ("N/M corpus runs byte-identical").
Budget note: run nightly/on-demand, not per-PR — Actions minutes are a
constraint the user has set.

### 3. LLVM MC/DC: per-decision bitmaps are the probe-v2 design
Clang's `-fcoverage-mcdc` allocates one 2^n-bit bitmap per decision (n =
conditions); each condition probe is a single bitwise-OR; the executed test
vector sets one bit; llvm-cov reconstructs vectors offline. **Implication:**
probe v2's JS analog is a per-decision typed-array bitmap with integer
condition indices (`frame |= 1 << i`, then
`bitmap[v >> 3] |= 1 << (v & 7)`), replacing string-keyed function calls on
the hot path. Per-test attribution — which LLVM does not do — comes from
swapping bitmap buffers per attempt epoch, keeping our concurrent-runner
attribution. Sizing: our largest observed decision has 10 conditions
(128-byte bitmap); enforce a cap with explicit degradation like LLVM does.
Offline reconstruction moves the vector→independence-pair work fully into
analysis, off the user's runtime.

### 4. oxc: production-ready parser, custom transforms are the open question
The oxc parser is production infrastructure (Rolldown, Vite's plugin-react
React-refresh transform, Nuxt; oxlint at Shopify/ByteDance/Preact). Custom
AST rewriting uses `oxc_traverse`/transformer plugins. Risks: crate APIs
still move fast (pin + vendor), and our instrumenter needs exact evaluation-
order-preserving rewrites, not off-the-shelf transforms. **Implication:**
Phase 3 starts with a spike (S1) porting the three hairiest instrumenter
features before committing.

### 5. napi-rs v3: platform packages are solved; WASI is not a full-CLI fallback
Per-target binaries as scoped `optionalDependencies` with an automatic
`wasm32-wasip1-threads` fallback for platforms without prebuilds, plus
version-mismatch guards in the loader. Known footgun: a `wasm-runtime`
release once broke `npm ci` — pin the fallback chain exactly.
**Implication:** npm distribution for the Phase-4/5 engine binary can reuse the
platform-package and version-guard pattern. The WASI part applies only to a
pure transform/addon surface: the full Supercov CLI owns arbitrary child
processes, signals, filesystem transactions and mmap indexes, which Node WASI
cannot implement equivalently. The CLI therefore fails honestly on an
unsupported target rather than silently losing supervision guarantees.

### 6. cargo-dist: alive, but decide with an ADR
Actively maintained (0.32.0, May 2026); Astral forked it for uv and their
fixes merged back upstream. But some projects (e.g. googleworkspace/cli)
left it for hand-written pipelines with npm sub-packages, and it has no PyPI
target — maturin `bindings = "bin"` wheels remain the PyPI path regardless.
**Implication:** Phase 5 opens with an ADR: cargo-dist for
Releases/brew/curl/msi + separate maturin and napi jobs, versus one
hand-rolled matrix. Either way PyPI and npm are custom steps.

### 7. reflink-copy: workspace isolation parity in Rust is done
The `reflink-copy` crate (used by uv, maturin, and pnpm's NAPI cloning
package) wraps macOS `clonefile` and Linux `FICLONE` with copy fallback —
exactly our workspace semantics. Windows: CoW only on ReFS/Dev Drive;
regular NTFS falls back to real copies, so the Windows workspace-prep gate
needs its own budget number rather than inheriting the mac one.

### 8. rkyv: zero-copy mmap index is real; format needs an ADR
rkyv gives true zero-copy access from an mmapped file including a paged B+
tree for bulk data; the community caveat is that it is a heavy dependency
that couples schema versioning to the crate. One property simplifies our
choice a lot: **the query index is immutable per run** (write-once, integrity
-checked), so we need no update concurrency — plain fixed-layout sections or
rkyv both work; SQLite is likely overkill. Settle by benchmark spike (S2).

## Plan amendments from these findings

- Parity gate wording clarified: **byte-identical manifests and evidence,
  behaviorally equivalent generated code.** Babel and oxc will never emit
  identical JS text; Test262 equivalence + identical manifests/evidence is
  the correct gate.
- The Tier-1 sweep corpus is a launch asset *and* the permanent ecosystem-
  check input; build it with pinned SHAs and cached clones from day one.
- Probe v2 adopts the LLVM bitmap model with epoch-swapped buffers for
  attribution; vector reconstruction moves offline into analysis.
- Distribution: napi platform-package pattern for npm; no unsound WASI fallback
  for the process-owning CLI; maturin bin wheels for PyPI; cargo-dist vs hand-
  rolled decided by ADR in Phase 5.

## Open spikes (each blocks the phase it feeds)

- **S1 (→ Phase 3): oxc port spike.** Port optional-call completeness,
  source-sensitive function detection, and MC/DC condition wrapping to
  oxc_traverse; run the pinned Test262 shard subset. Exit: zero semantic
  failures, manifest byte-parity on fixtures, measured transform throughput.
- **S2 (→ Phase 4): index format ADR.** Benchmark rkyv vs flatbuffers vs
  fixed-layout custom vs status-quo gzipped JSON on a synthetic 100k-line
  run. Exit: open+first-query ≤15 ms at p95 on the large index, versioning
  and integrity story written down.
- **S3 (→ any binary GA): Windows strategy.** Job objects for process-group
  termination (command-group/nix equivalents), junction vs symlink for
  workspace node_modules, NTFS copy fallback budget, Dev Drive reflink
  detection. Exit: full test suite green on Windows CI, workspace-prep gate
  number set.
- **S4 (→ Phase 4): process-supervision spec.** Enumerate current cli.ts
  child-process behaviors (detached groups, signal escalation timeline,
  stdio inheritance, exit-code mapping) as a contract test both engines run.
- **S5 (→ Phase 2): carrier overhead measurement.** AsyncLocalStorage cost
  dominates probe attribution; Node 24+ enables AsyncContextFrame which
  changes the numbers. Exit: measured overhead budget per Node version,
  informing how aggressively probes can consult the carrier.
- **S6 (→ Phase 5): registry groundwork.** PyPI/npm name availability and
  scope naming for platform sub-packages, wheel platform tags
  (manylinux/musllinux/universal2/win), sdist policy, brew tap vs core.
- **S7 (→ Phase 1): perf CI.** Criterion/hyperfine harness wired to the
  acceptance-gate table so gates are enforced by CI, not by memory; corpus
  ecosystem-check scheduled nightly with cached clones.
- **S8 (→ Phase 6, Rust): insertion-point ADR.** rustc MC/DC status and
  stability, then MIR pass vs out-of-tree LLVM plugin vs source transform,
  including the ongoing cost of tracking LLVM/rustc release cadence. Exit:
  ADR with a maintenance-burden estimate per option.
- **S9 (→ Phase 6, C/C++): Tier A sufficiency.** clang's per-decision
  condition cap and its configurability; we already observe 10-condition
  decisions in JS, so Tier A must degrade explicitly rather than silently
  merge. Exit: cap documented, degradation specified.
- **S10 (→ Phase 6): attribution-ladder validation.** Per-test evidence from
  a real Rust crate under `cargo nextest` (process-per-test = exact
  attribution), MC/DC verdicts matching `llvm-cov` on the same run. Exit: a
  golden-corpus fixture shaped like today's JS fixtures.

Detail for S8–S10, the two-tier model and the per-language matrix live in
`multi-language-architecture-2026-08-24.md`.

## Risk register (new since master plan)

- oxc API churn → pin exact crate versions, vendor if needed; revisit each
  phase boundary.
- WASI fallback chain can break installs → exact pins + install-matrix CI.
- Windows CoW absence changes workspace performance class → own gate (S3).
- AsyncLocalStorage overhead varies by Node version → measure, don't assume
  (S5).
- cargo-dist single-vendor risk → ADR keeps hand-rolled exit path (S6/Phase 5).
- Owning compiled-language instrumentation means tracking LLVM/rustc release
  cadence indefinitely; this is the dominant long-term cost of Phase 6 Tier B
  and must be priced before committing to a plugin (S8).
- Per-language equivalence corpora, not instrumenters, are the real cost
  driver for new languages. Treat a missing corpus as a hard ship blocker,
  not a documentation gap.
