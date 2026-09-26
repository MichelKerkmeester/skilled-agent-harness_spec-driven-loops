# Release review findings — 2026-09-09

## REVIEW-001: optional Rust parity test looks passed without comparing fixtures

Status: reporting limitation remains; review documentation corrected.

Without `SUPERCOV_ASSERTED_FACTS` and `SUPERCOV_ASSERTED_RESOLUTION`, the test
`the_join_reproduces_the_prototype_verdicts` prints a skip notice and returns.
Cargo reports the function as passing, not ignored. A normal `npm run check`
therefore does not prove the external frozen comparisons ran.

Rechecked with actual fixture paths during review: all 661 Supergateway and
1,813 Essential SEO sites compare successfully. These are join comparisons on
frozen facts, not proof of the source analyzer or all possible mutations.

Future improvement: a distinctly named required parity gate, with data supplied
explicitly and missing fixtures treated as missing verification. Do not relabel
the current optional return as a completed comparison.

## REVIEW-002: Supergateway external source test retained pre-pragma counter

Status: expectation corrected and evidence-migration assertions added; no
production inference or score changes.

Enabling `analyzers/typescript/tests/parity.test.mjs` failed because the old
expectation was 155 suppressed observations while the current result is 153.
The two-record difference is accounted for exactly: old facts contain two
`boundary: pragma` observations in T051 at `httpLifecycleE2e.test.ts:145`.
The new result has two separate hints attached to that same test/assertion,
declared on lines 143 and 144. They are not observations, and neither has a
passing witness in this legacy capture (`capture-unavailable`).

The revised test asserts this migration and absence of pragma observation credit,
instead of only lowering a magic number. All other expected counts, site
denominators and classification expectations are unchanged. The fresh 84/100
calibration uses a different capture with statement/phase evidence; the legacy
sample's zero accepted observations must not be confused with that calibration.

## REVIEW-003: isolated review omitted the replay manifest needed by recapture

Status: review-branch packaging corrected; no product change.

`asserted-supergateway-recapture.mjs` checks the cohort, inventory and prototype
checksums against `docs/asserted-stryker-replay-2026-09-09.json`. That file was
present in the shared checkout but was not selected for the first review commit,
so the isolated command failed with ENOENT before analyzing anything. The
review follow-up includes the unchanged manifest, retaining its checksum gates.
The external prototype, sample source and original capture are still explicit
inputs; this is not advertised as a self-contained generic CI calibration.

## REVIEW-004: installed assertion queries cannot resolve the compiler on Windows

Status: reproduced on both Windows architectures; release blocker, not fixed.

The [native matrix at 1668e3a](https://github.com/supercorp-ai/supercov/actions/runs/34375395031)
fails the packed JS/TS assertion check on x64 (job 102546796254, Node 24.19.0)
and arm64 (job 102546796458, Node 24.20.0). The native build and preceding packed
Rust coverage check pass on each. Both fail at the first positive asserted query
for consumer-0, which has the pinned TypeScript 5.8.3 package installed.

Before that query, the same harness successfully resolves the installed compiler
with `createRequire(packageFile).resolve("typescript")`, verifies it is inside
the consumer, reruns the suite and reads ordinary line coverage. The public
assertion query nevertheless returns INVALID_ARGUMENT / exit 2, saying the
project's compiler API is missing.

The error comes from `projectCompilerPath`, before the compiler API compatibility
guard. It is therefore **not** the intended TypeScript 7 rejection. Rust passes a
canonical Windows namespace-prefixed project root to the analyzer, unlike the
ordinary path used by the successful harness lookup. That boundary is a concrete
lead, not an established root cause: the current transport prints only the
wrapped error message, omitting the original resolution error's cause.

Next: expose the original cause in a bounded diagnostic, compare compiler
resolution under ordinary and namespace-prefixed paths on a real Windows
runner, and add a regression before changing path handling. Preserve compiler
identity, source freshness and project-containment checks. Do not silence the
gate, substitute another compiler or claim Windows release validation passed.

## REVIEW-005: two internal README research links are outside the review snapshot

Status: documentation-only gap, not fixed.

`analyzers/typescript/README.md` links to
`docs/asserted-js-witness-limits-2026-09-09.md` and
`docs/asserted-typescript-extraction.md`. Those historical notes remain in the
shared checkout but were not included in the isolated review branch, so the
relative links there are unresolved. The shipped public guide
`docs/assertion-evidence.md` is present. Research notes are deliberately excluded
from the npm artifact; a follow-up should distinguish repository background links
from the installed-package guide without importing unrelated Rust research.
