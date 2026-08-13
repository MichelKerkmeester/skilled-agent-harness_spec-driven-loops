---
title: "Implementation Summary: Maintainability and Provenance"
description: "Final evidence for deep-pi benchmark packaging, vendored-fork provenance, coupling measurement, and the local provider boundary fixture."
trigger_phrases:
  - "maintainability provenance implementation"
  - "vendored fork provenance check"
  - "deep-pi benchmark packaging"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/008-implement-fork-improvements/003-maintainability-and-provenance"
    last_updated_at: "2026-08-11T06:43:14.636Z"
    last_updated_by: "codex"
    recent_action: "Fixed HANDOFF stray files and ran REQ-006 fixture live"
    next_safe_action: "Re-run boundary fixture only in a loopback-permitting sandbox"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "checklist.md", "implementation-summary.md", ".opencode/scripts/check-vendored-fork-provenance.mjs", ".opencode/scripts/vendored-fork-provenance.json"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-08-cli-039-008-003"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No extraction was selected after coupling measurement; prompt transforms were lowest at 60 shared identifiers and zero tracked extension-state references."
      - "The provenance check runs on demand and reports drift without failing builds."
      - "The local boundary fixture ran live in a permitting sandbox and a deepPiDormant logic bug it exposed was fixed."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-maintainability-and-provenance |
| **Status** | Complete; REQ-006's live session ran and its logic bug was fixed in a HANDOFF follow-up |
| **Completed** | 2026-08-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The two independent deep-pi benchmark packaging defects are fixed, both vendored forks have a report-only provenance check, and the optimizer extraction decision is evidence-backed. No source, tests, or package metadata under `pi-cache-optimizer` changed. The local provider fixture's live session was deferred in this build's sandbox by a loopback bind denial; a later HANDOFF-driven run in a permitting sandbox executed it successfully and fixed a real logic bug it exposed (see REQ-006 below).

## Changes

| File | Action | Purpose |
|------|--------|---------|
| `.pi/extensions/deep-pi/package.json` | Modified | Added `scripts` to the shipped `files` allowlist |
| `.pi/extensions/deep-pi/scripts/live-benchmark.mjs` | Created | Opt-in live benchmark entry point; safe default mode skips external calls |
| `.opencode/scripts/check-vendored-fork-provenance.mjs` | Created | Hashes each fork's allowlisted shipped file set and reports identity/content drift |
| `.opencode/scripts/vendored-fork-provenance.json` | Created | Records both fork identities, file sets, and baseline SHA-256 hashes |
| `.opencode/scripts/run-local-deep-pi-boundary.mjs` | Created | Test-scoped OpenAI-compatible provider fixture and real-Pi boundary runner |
| `spec.md`, `plan.md`, `tasks.md`, `checklist.md` | Updated | Reconciled status, evidence, open-question answers, and explicit deferrals |
| `implementation-summary.md` | Created | Final implementation and verification handoff |
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The required order was followed: the Step 1 gate and predecessor contract checks were run before seam measurement; REQ-007 was implemented first, REQ-005 was added next, REQ-006 was attempted without a credential, and the extraction decision was made from measured coupling. No extraction diff was created because no candidate met the low-coupling bar.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Do not extract a seam in this phase | Prompt transforms were lowest, but still shared 60 identifiers; persistence was not the lowest at 145/1. The measured coupling did not justify new conflict surface. |
| Keep provenance report-only and on demand | Drift must be visible without blocking legitimate local fork patches; CI or hook scheduling can be chosen later. |
| Run the real local boundary result once a permitting sandbox was available | The fixture is credential-free and test-scoped; the build sandbox rejected the loopback bind, but a later run elsewhere completed it and fixed a real `deepPiDormant` logic bug the deferral had hidden. |
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

The required Step 1 gate passed before implementation:

- deep-pi: `npm test` exit 0 — 11 test files, 76 tests passed.
- pi-cache-optimizer: `npm test` exit 0 — 34 tests, 8 suites passed.

Final verification also passed:

- deep-pi: `npm test` 11 files/76 tests; `npm run typecheck` exit 0.
- pi-cache-optimizer: `npm test` 34 tests/8 suites; `npm run typecheck` exit 0.
- Phase 001 focused contract run: deep-pi composition 3 tests passed; optimizer composition plus six hook guards 9 tests passed.
- `pi list --approve` exit 0 resolved both `extensions/pi-cache-optimizer` and `extensions/deep-pi` to their in-repo paths.

### Provenance

`.opencode/scripts/check-vendored-fork-provenance.mjs --json` exits 0 on both clean and drift states. It records the shipped file set from each package's `files` allowlist plus npm's implicit `package.json` entry, then hashes sorted path/content pairs.

- deep-pi: `christopherarter/deep-pi@0f1cbd8124b4fb35df97f85aa943d730f4aae549`; clean hash `sha256:330c9ca984558cf16774679d94a3061eea18e594842b2bfb52f168165c58a8d2`.
- pi-cache-optimizer: `MichelKerkmeester/pi-cache-optimizer@5132d137ce28cb91ec12a5475832df4d5154085a`; clean hash `sha256:477ba012c7a297f8f49d9dcd30e26d80846c113530f9799c65b630eebb56dc1b`.

Self-test changed one character in `live-benchmark.mjs`; the check reported `shipped file content changed` and a different current hash. Reverting the character restored equal current/recorded hashes and `drift: false` for both forks.

### Extraction Decision

The completed lexical scan stripped comments and literals, then counted unique identifiers shared with the rest of `index.ts` and tracked extension-state references:

| Candidate seam | Shared identifiers | State references |
|---|---:|---:|
| Prompt transforms | 60 | 0 |
| Provider adapters | 139 | 1 |
| Persistence | 145 | 1 |
| Routing | 106 | 0 |
| Diagnostics | 195 | 0 |
| Commands | 101 | 6 |
| Hooks | 118 | 14 |

Prompt transforms ranked lowest, but 60 shared identifiers is not low coupling for a seam in an 8,390-line vendored entry module. Persistence was not the lowest despite the plan's hypothesis. No characterization test or extraction was started, so no extraction diff, allowlist churn, import-map churn, or upstream merge-conflict surface was introduced.

### REQ-006 — implemented, logic bug fixed, and verified live

The boundary runner created a temporary Pi configuration with provider `opencode`, model `deepseek-v4-flash-free`, an OpenAI-compatible endpoint on `127.0.0.1`, and no stored credential. The build-time attempt stopped before Pi startup at `listen EPERM: operation not permitted 127.0.0.1`, and a later HANDOFF review's own sandbox separately blocked `mkdtemp`. In a sandbox permitting both, `node .opencode/scripts/run-local-deep-pi-boundary.mjs` ran the real fixture end to end:

```
"piExitCode": 0, "loopbackOnly": true, "optimizerActive": true,
"deepPiDormant": true, "deepPiStatsPresent": true, "deepPiRecordedResponses": 0
```

That run also exposed a real bug the deferred state had hidden: `deepPiDormant` originally derived from the stats file's mere presence, but deep-pi's `session_shutdown` handler flushes stats for every model regardless of ownership eligibility, so the file existed (`deepPiStatsPresent: true`) even though deep-pi correctly recorded nothing (`deepPiRecordedResponses: 0`). The presence-only check reported `deepPiDormant: false` and the script exited 1 — a false failure on a run where deep-pi behaved exactly as intended. Reproduced directly: reverting the check to `!deepPiStatsPresent` on the same fixture reran to exit 1 with the identical false-failure message; restoring the content-based check (`deepPiDormant = deepPiRecordedResponses === 0`) reran to exit 0. Loopback-bind and `mkdtemp` permission remain environment-dependent — this proves the logic is correct where the sandbox allows it to run, not universal sandbox portability.

### Packaging

- deep-pi final `npm pack --dry-run`: 13 files, including `scripts/live-benchmark.mjs`.
- pi-cache-optimizer final `npm pack --dry-run`: 5 files, unchanged because no extraction occurred.
- `npm run benchmark:live` exits 0 in its default safe-skip mode.

The original deep-pi baseline had 12 files and no `scripts/` entry. The only final package delta is the benchmark script and its allowlist entry. The optimizer baseline and final package both contain 5 files.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. REQ-006's live session still requires a sandbox permitting both a loopback bind and `mkdtemp`; two build/review environments this phase touched did not have both, though a later run in a permitting sandbox completed successfully (see REQ-006 above).
2. No optimizer seam was extracted. Prompt transforms should be re-measured first if future upstream churn creates a concrete maintenance failure that justifies the conflict cost.
3. The provenance check is on demand and report-only. CI or pre-commit scheduling remains an operational decision.
<!-- /ANCHOR:limitations -->
