# ADR: one Rust engine, many distribution wrappers (2026-08-25)

## Decision

Supercov will build one Rust CLI source tree and distribute the resulting
target binaries through thin, registry-native wrappers. No registry package
may contain a second analyzer or coverage model.

The Cargo graph is deliberately split into three exact-version packages:
`supercov-contracts` owns the frozen interchange schemas, `supercov-engine`
owns the single analyzer/instrumenter implementation, and `supercov` owns the
user-facing CLI. Consumers install only `supercov`; Cargo nevertheless requires
its two library dependencies to be published before the CLI. All three
functional `0.0.10` packages were published and a clean `cargo install
supercov --version =0.0.10 --locked` completed a real coverage run on
2026-08-25. This split is a reuse boundary for future language/runtime shims,
not three implementations.

For npm, the primary `supercov` package remains the `npx supercov` entrypoint
and selects an exact-version platform package. The initial matrix is macOS
arm64/x64, Linux arm64/x64 with glibc and musl, and Windows arm64/x64. Platform
packages are unscoped (`supercov-<platform>-<arch>[-<libc>]`) because the
existing npm ownership is the unscoped `supercov` package and no npm scope is
currently authenticated. All eight names were unclaimed when checked on
2026-08-25. They are generated from `npm/native-targets.json`; binary files are
never committed.

The loader rejects a platform package whose name or version differs from the
primary package. Missing optional dependencies produce an actionable error.
There is no silent network download, postinstall compilation, or fallback to
the JavaScript engine after atomic cutover. A local `target/debug` fallback is
available only in a source checkout containing `Cargo.toml`, and
`SUPERCOV_RUST_BINARY` remains a development/conformance override.

WASI is not a sound fallback for the full CLI: the engine owns arbitrary child
processes, signals, filesystem transactions, and memory-mapped indexes, which
the Node WASI environment cannot provide equivalently. Unsupported platforms
must receive an honest unsupported-target error until they have a native build.

GitHub Releases are the binary source of record. npm platform tarballs, PyPI
binary wheels, Homebrew, cargo-binstall metadata, installers, opam, and future
C-compatible packages wrap the same checksummed release artifacts. PyPI uses
maturin `bindings = "bin"`; it does not rebuild the analyzer in Python. A
future cargo-dist-versus-handwritten release-pipeline choice may change release
orchestration, not artifact identity or package contracts.

The Rust CLI now embeds every unavoidable JavaScript runtime collector, so a
Cargo- or wheel-installed executable completes a JavaScript coverage run with
no adjacent npm `dist` directory. A functional macOS arm64 PyPI wheel was built,
metadata-checked and installed into a fresh virtual environment. It is
published as `supercov-cli 0.0.10`, while the installed binary and product name
remain `supercov`; a clean `uvx --from supercov-cli==0.0.10 supercov` registry
install completed a real coverage run. The exact PyPI name `supercov` is not
currently claimable: PyPI has an existing active project record with no public
releases whose owner is not the authenticated Supercorp account. Uploads
correctly fail with 403. A PyPI transfer request or owner cooperation is
therefore a distribution gate; a 404 JSON response must not be interpreted as
name availability. If the canonical name is transferred, `supercov-cli`
becomes a compatibility package directing new installations to `supercov`.

RubyGems `supercov 0.0.10` was published on 2026-08-25. The real
`arm64-darwin` platform gem embeds the same self-contained Rust binary behind a
minimal Ruby `exec` shim. Both the workflow's packed-gem installation and a
second clean installation from the public registry completed real coverage
runs. Publication used RubyGems' pending GitHub trusted-publisher flow, which
converted into permanent OIDC trust after the first successful upload; no API
key is stored. NuGet and Hex also returned unregistered, but Supercov will not
squat them with empty placeholders: each name is claimed only when its
ecosystem-native launcher passes the same install-and-real-run gate.

The artifact workflow is manual-only on its own so ordinary commits consume no
eight-platform build minutes. It uses GitHub's native macOS arm64/x64, Linux
arm64/x64, and Windows arm64/x64 hosted runners; each Linux architecture also
builds its musl target. This avoids treating cross-compilation as native runtime
proof. GitHub documents `ubuntu-24.04-arm`, `windows-11-arm`, `macos-15`, and
their x64 counterparts as standard hosted-runner labels, including for private
repositories: <https://docs.github.com/en/actions/reference/runners/github-hosted-runners>.
Each tarball is signed with GitHub artifact-attestation build provenance using
the workflow's short-lived OIDC identity; private repositories use GitHub's
private Sigstore instance. Verification is therefore tied to repository,
workflow, commit and triggering event rather than to a long-lived signing key:
<https://docs.github.com/en/actions/concepts/security/artifact-attestations>.
An aggregate job downloads all eight independently built artifacts and refuses
to form a release set unless every target, version, size and SHA-256 digest
matches the frozen registry. This prevents a primary-package release from being
assembled from a partial or mixed-version matrix. It also reads each npm
tarball directly and verifies its packed manifest selectors, executable path,
binary size, binary digest and POSIX execute bit rather than trusting detached
checksum metadata alone.

### Temporary Windows publication hold

The `0.0.11` candidate publishes only the six macOS/Linux targets. Both Windows
binaries compile, and npm invocation/package launching was validated, but the
first real packed x64 run failed with an NTFS `Access is denied` error while
isolating the project's own `.supercov` store (Actions run `32886591618`). The
ARM job was cancelled rather than spending more hosted minutes on the same
known boundary. Windows target packages stay out of the public registry and
the primary package's optional dependencies until a native packed run passes
the full workspace and evidence lifecycle. This narrows advertised support; it
does not weaken the native-runtime gate.

Publication is manual-only and resumable. A complete set of already validated
artifacts may be imported from a prior run, checked again as one release set,
and published without rebuilding those targets.

The tag-only release workflow invokes this artifact workflow as a reusable
gate. It publishes every verified platform tarball before the primary package,
whose exact `optionalDependencies` are machine-checked against the target
registry. Partial native publication is harmless because no primary package
can reference it; partial primary publication is structurally impossible.
Initial publication of each new unscoped platform name requires an npm
credential authorized to create packages. Once claimed, each package should be
migrated to the same GitHub OIDC trusted publisher as the primary package and
the bootstrap credential removed.

## Gates

- Every target cross-compiles with warnings denied and runs on a native CI host
  before it is published.
- A packed-install test installs the primary and matching platform tarballs in
  a clean project with lifecycle scripts disabled, then completes a real run.
- Wrong version, missing package, unsupported target, wrong executable type,
  and disabled optional dependencies have deterministic tests.
- Release binaries include checksums and provenance; registry artifacts are
  constructed only from those binaries.
- Platform-package publication and the primary-package publication are one
  coordinated release. A primary version is never published before all its
  mandatory platform packages.
- The npm loader is unavoidable exec-only glue and survives TypeScript-engine
  deletion; it contains no instrumentation or analysis behavior.
