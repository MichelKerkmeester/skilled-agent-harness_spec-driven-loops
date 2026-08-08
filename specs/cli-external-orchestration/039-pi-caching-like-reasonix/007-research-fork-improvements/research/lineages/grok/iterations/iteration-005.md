# Iteration 005 — Maintainability and dual-fork coherence

## Focus

What maintainability risks (fork drift, dual ownership, shared predicates) threaten long-term coherence?

## Actions Taken

- Compared package metadata / upstream remotes for both vendored forks
- Re-read 003 limitations about GitHub fork vs vendored copy drift
- Inspected `.pi/settings.json` package pointers
- Contrasted module structure (monolith vs modular) and test runners

## Findings

1. **Triple-source drift surface for the optimizer.** Operational source is `.pi/extensions/pi-cache-optimizer/`; provenance also exists at personal GitHub fork commit and upstream `jiangge/pi-cache-optimizer` (package.json still points repository URL upstream). Spec 003 already warns that nothing keeps vendored copy ↔ published fork in sync, and upstream fixes must be manually re-applied. Improvement: document a one-command `diff`/`patch` refresh checklist; optionally drop or archive the non-operational GitHub fork as provenance-only with a README pointer. [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:45-48] [SOURCE: specs/.../003-fork-and-guard-cache-optimizer/implementation-summary.md:140-143]

2. **deep-pi has the same upstream-vs-vendored pattern.** package.json still references `christopherarter/deep-pi` while Pi loads `extensions/deep-pi` locally. Hardening patches from 006 live only in the vendored tree unless re-exported. Improvement: pin a `VENDOR_BASE` commit SHA in README and a `scripts/check-upstream-delta.sh` that fails CI when silent drift exceeds the expected patch set. [SOURCE: .pi/extensions/deep-pi/package.json:7-14] [SOURCE: .pi/settings.json:27-35]

3. **Ownership allowlists are duplicated across packages (maintainability form of iter-1 finding).** Extract a tiny shared constant module (or generated JSON consumed by both) under e.g. `.pi/extensions/shared/deep-pi-owned-models.json` — or a test-only parity check if sharing runtime code is undesirable. Without this, every DeepSeek model launch is a two-PR coordination tax. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts:1279-1281] [SOURCE: .pi/extensions/deep-pi/extensions/deeppi/eligibility.ts:1-18]

4. **Structural asymmetry raises change cost.** Optimizer is a ~8k-line single `index.ts` with `__internals_for_tests`; deep-pi is modular (`eligibility`, `telemetry`, `stability`, `stormbreaker`, `hashlines`). Guard patches in the optimizer are mechanically small but hard to review in context; deep-pi changes are easier to unit-test in isolation. Improvement for optimizer fork: extract ownership/guard helpers (+ tests) into a small local module without full upstream refactor. [SOURCE: .pi/extensions/pi-cache-optimizer/index.ts] [SOURCE: .pi/extensions/deep-pi/extensions/]

5. **Heterogeneous verify tooling.** Optimizer: `node --import jiti/register` + `tsc`. deep-pi: vitest + `tsc` + pack dry-run + optional live benchmark. No workspace-level script verifies both after a settings/package change. Improvement: a repo-local `npm`/`node` script under the 007 packet or `.pi/` that runs both `verify`/`check` targets and a parity test. [SOURCE: .pi/extensions/pi-cache-optimizer/package.json:30-36] [SOURCE: .pi/extensions/deep-pi/package.json:51-56]

6. **Composition policy is documentation-borne, not encoded.** The split (deep-pi owns direct DeepSeek V4 flash/pro; optimizer owns everything else including DeepSeek-family via other providers) lives in specs and predicates, not in a machine-readable policy file both packages validate. Encoding it would reduce tribal knowledge risk when a third extension appears.

## Questions Answered

- Maintainability backlog: upstream-delta checks, shared/parity allowlist, extract optimizer guard helpers, unified dual-package verify script, machine-readable ownership policy.

## Ruled Out

- Full upstream merge-back of the DeepSeek guard as a prerequisite for further local improvements — useful later, but local maintainability fixes do not require upstream acceptance first. [SOURCE: specs/.../003-fork-and-guard-cache-optimizer/spec.md:109]

## Next Focus

Known-open-limitations deep dive and prioritized improvement backlog across both forks.

## Assessment

Maintainability risks are mostly process/structure, not new runtime defects. Convergence telemetry only; continue to final forced angle.
