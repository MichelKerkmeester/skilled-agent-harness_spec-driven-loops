---
title: "Verification Checklist: Compiled-Routing Deep-Review Remediation"
description: "Verification evidence for the remediation; each finding fixed with a regression, every release invariant re-verified."
importance_tier: "critical"
contextType: "implementation"
status: "complete"
completion_pct: 100
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/016-review-remediation"
    last_updated_at: "2026-07-22T06:53:44Z"
    last_updated_by: "claude"
    recent_action: "All fixes and invariants verified with evidence; conformed checklist to the Level-2 template."
    next_safe_action: "Operator sign-off; merge to v4 remains operator-gated."
    blockers: []
    key_files: []
---

# Verification Checklist: Compiled-Routing Deep-Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Every finding verified against the actual code (finding equals hypothesis)
  - **Evidence**: three Explore agents plus direct reads of the cited sources (e.g. `cutover-playbook-executor.cjs:209`); the F002 flip-gate framing was re-checked and corrected to the cutover-playbook gate
- [x] CHK-002 [P1] Spec, plan, and tasks authored for the four workstreams
  - **Evidence**: `spec.md`, `plan.md`, `tasks.md` present, Level-2 conformant
- [x] CHK-003 [P1] Release invariants baselined before edits
  - **Evidence**: frozen SHAs, parity 49/49, seven-hub serving captured at start

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P1] F005: sk-doc `preview` no longer over-routes; word-boundary matcher mirrors legacy
  - **Evidence**: `containsSignal` word-boundary-matches `{review,lcp,inp,cls}` in both router copies; `preview the latest changes` defers, `review`/`/doc:quality` route; hash unchanged (`634ae6eb55`)
- [x] CHK-011 [P1] F002: cutover gate falls back only on `defer`; clarify/reject compared
  - **Evidence**: `cutover-playbook-executor.cjs` short-circuits PASS only on `action === 'defer'`; clarify/reject compare intents against legacy
- [x] CHK-012 [P1] F001: `refreshCanonicalManifest` preserves a concurrent serving flip
  - **Evidence**: re-reads serving fields after the compile (fail-closed), publishes via temp-file plus atomic rename
- [x] CHK-013 [P1] F007: authored engine reconciled to the promoted bin twins
  - **Evidence**: 12 divergent engine files reconciled; `--check` resolves all seven hubs; `--verify` reports 0 reads under `.opencode/specs`
- [x] CHK-014 [P2] DOC-3: cohort drift-guard strengthened across all four copies
  - **Evidence**: order-identity within each family plus membership-identity across; bin vitest 64/64
- [x] CHK-015 [P2] F006: `classifyFlagState` telemetry reflects the live seven-hub default-on
  - **Evidence**: `permitsCompiledWhenEligible` true for `force-on || default`; locking test updated; no runtime gate consumes it

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Frozen scorer SHA-256 unchanged
  - **Evidence**: re-hashed live: `d5e13daf3e99469c / d5a9cc72ec7cfcfb / 5029f22df920418e`
- [x] CHK-021 [P0] Parity 49/49 plus the new F002/F005 cases; compiled equals legacy, 0 drift, all seven hubs
  - **Evidence**: `compiled-routing-parity.vitest.ts` 49/49 green
- [x] CHK-022 [P0] Seven-hub compiled-serving plus fresh; kill-switch falls back to legacy
  - **Evidence**: `compiled-route-status.cjs --all` 7/7 `compiled-serving` + `fresh`; `SPECKIT_COMPILED_ROUTING=0` yields 7/7 legacy
- [x] CHK-023 [P1] Authored closure resolves; `DEFAULT_ON_HUBS` stays seven in both resolver copies
  - **Evidence**: `--verify` "all 7 hubs resolve; 0 reads under .opencode/specs"; both `resolve.cjs` copies list the same seven
- [x] CHK-024 [P1] Bin vitest suite green (foundation + manifest + flag-propagation)
  - **Evidence**: 8 files / 64 tests green via `vitest.config.bin.ts`
- [x] CHK-025 [P1] Manifest suite green including the new F001 regression
  - **Evidence**: 17/17 pass
- [x] CHK-026 [P1] `validate.sh --strict` run at close
  - **Evidence**: only the CONTINUITY_FRESHNESS timestamp heuristic remains (also present on shipped sibling 013), no structural errors

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-016 [P1] Every confirmed finding has a landed fix and a regression that fails-before and passes-after
  - **Evidence**: F001/F002/F005 have failing-then-green regressions; F007 resolved via `--check`; DOC-3/F006 via the strengthened guard and updated locking test
- [x] CHK-017 [P1] F005 and F007 applied to both the runtime bin and the authored spec-tree twin
  - **Evidence**: the `router.cjs` word-boundary fix landed in both copies; 12 engine files reconciled; the diff shows the engine trees aligned
- [x] CHK-018 [P2] No partial fixes; latent-scope items surfaced rather than silently taken
  - **Evidence**: the F005 fleet-wide expansion is surfaced in Known Limitations, not applied silently

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] The three frozen scorer files are never edited
  - **Evidence**: `shasum -a 256` re-run live on the trio: `d5e13daf3e99469c / d5a9cc72ec7cfcfb / 5029f22df920418e`, byte-identical to the pins
- [x] CHK-031 [P0] The two pre-existing strays are never touched
  - **Evidence**: `git status` shows neither `mcp-tooling/008-mcp-aside` nor `system-deep-loop/032` in the change set
- [x] CHK-032 [P1] No runtime path reads under `.opencode/specs`
  - **Evidence**: `compiled-route-sync.cjs --verify` reports 0 reads under `.opencode/specs`

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] DOC-1: the 013 lifecycle metadata reconciled
  - **Evidence**: plan/tasks/decision-record `planned` to `complete` plus `completion_pct` 100; CHK-040/CHK-140 checked with evidence; CHK-025/041/103 kept as recorded follow-ups
- [x] CHK-041 [P2] DOC-2: the SD-015 limitation and follow-up resolved
  - **Evidence**: `013/implementation-summary.md` cites the positive and adversarial lock-in tests in `compiled-routing-parity.vitest.ts`
- [x] CHK-042 [P2] This packet's docs are Level-2 template-conformant
  - **Evidence**: spec/plan/tasks/checklist/implementation-summary carry the SPECKIT markers and anchors

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files; scratch confined
  - **Evidence**: no `scratch/` directory in this packet; temporary validate output kept in the session scratchpad only

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 6 | 6/6 |
| P1 Items | 15 | 15/15 |
| P2 Items | 5 | 5/5 |

**Verification Date**: 2026-07-22
**Verified By**: AI Assistant (Claude)

**Operator sign-off (surfaced, not granted)**: technical prerequisites are met (all eight findings fixed with regressions, every invariant re-verified, docs reconciled). Formal sign-off and the merge to v4 are the operator's to grant.

<!-- /ANCHOR:summary -->
