# Assertion packaging findings — 2026-09-09

## ASSERTED-PACK-001: TypeScript 7.0.2 does not supply the required compiler API

Status: **open compatibility limitation**, with a passing rejection regression.
No TypeScript 7 adapter or silent fallback has been implemented.

Reproduction: build the analyzer and native CLI, then run
`node scripts/asserted-packed-integration.mjs --binary target/release/supercov`.
The script installs actual npm tarballs in a temporary consumer, without checkout
binary/analyzer overrides. Its TypeScript 5.8.3 consumer completes assertion
queries. Its TypeScript 7.0.2 consumer completes normal coverage, but assertion
analysis must fail with the explicit unsupported-API message.

Local evidence: the installed 7.0.2 package exports `.` as `./lib/version.cjs` and
provides different APIs under `./unstable/*`. It does not expose the analyzer's
required `createProgram` and `parseJsonConfigFileContent` interface at its root.
The product checkout's root development dependency is 7.0.2; the analyzer's own
locked toolchain is 5.8.3. A root `npm ci` alone therefore must not be assumed to
provide the analyzer toolchain. Build/release jobs now install its nested lockfile
explicitly. The project being analyzed still supplies its own compiler.

Next decision: publish the experiment with this explicit limit, or implement and
separately calibrate a TypeScript 7 frontend. Do not ask application maintainers
to downgrade their compiler merely to satisfy this report.

## Packaging issues resolved in this change

- Installed artifacts lacked query assets and source/build-identity inputs.
  The npm allowlist now includes the checked analyzer and excludes research docs.
  Identity hashes shipped package metadata instead of an npm-excluded lockfile.
- Global evidence overflowed the JSON budget even with one site requested.
  It is now independently addressable and pageable, including oversized leaves.
- Release binaries could refer to a development-tree analyzer path. That fallback
  is now debug-only; native-only users receive the explicit npm-assets requirement.

These packaging changes do not resolve semantic analysis limits, the four
false-kill predictions in the historical cohort, or the public/legacy inventory
difference. See the linked release record for the measured scope.
