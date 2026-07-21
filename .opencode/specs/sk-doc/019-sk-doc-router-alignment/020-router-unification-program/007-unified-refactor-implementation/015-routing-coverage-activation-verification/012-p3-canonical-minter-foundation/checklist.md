---
title: "Checklist: P3 Canonical Manifest Minter Foundation"
description: "Planned QA gate for canonical initial minting, exact freshness, store durability, fail-closed behavior, and unchanged routing decisions."
trigger_phrases:
  - "canonical minter checklist"
  - "manifest freshness QA gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-sk-doc-router-alignment/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/012-p3-canonical-minter-foundation"
    last_updated_at: "2026-07-21T00:00:00Z"
    last_updated_by: "codex"
    recent_action: "Defined the minter and freshness verification matrix"
    next_safe_action: "Check items only after the cited implementation evidence exists"
    blockers:
      - "No implementation evidence exists yet."
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-21-canonical-minter-spec"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Refresh and discovery acceptance belong to future packets."
    answered_questions:
      - "Freshness is exact effective-policy hash equality."
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-architecture | v2.2 -->
# Checklist: P3 Canonical Manifest Minter Foundation

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | Hard blocker | Cannot report the foundation implemented while unchecked |
| **[P1]** | Required | Must verify or record an operator-approved deferral |
| **[P2]** | Optional | May defer with an explicit reason |

All checks are **Planned** and remain unchecked until implementation evidence exists.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Baseline routing suites and counts are captured before edits.
  - **Planned evidence**: Command log and per-suite counts.
- [ ] CHK-002 [P0] Frozen scorer SHA-256 values are captured before edits.
  - **Planned evidence**: Three path-to-hash rows.
- [ ] CHK-003 [P0] The create-skill parent fixture compiles through the unchanged 006 `compileRegistry()`.
  - **Planned evidence**: Fixture compile result and policy hash.
- [ ] CHK-004 [P1] Current seven-hub status output is saved for additive schema comparison.
  - **Planned evidence**: Normalized JSON fixture.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Only the shared module computes the current policy and freshness result.
  - **Planned evidence**: Consumer import/call-site inventory.
- [ ] CHK-011 [P0] The adapter calls existing `compileRegistry()` and defines no policy-selection algorithm.
  - **Planned evidence**: Import path and test spy or fixture assertion.
- [ ] CHK-012 [P0] Public functions return the documented stable result envelope.
  - **Planned evidence**: Exact object assertions.
- [ ] CHK-013 [P1] Canonical bytes exclude timestamps, absolute paths, and environment values.
  - **Planned evidence**: Repeat-mint fixture byte comparison across temp roots.
- [ ] CHK-014 [P1] The CLI contains no manifest or freshness logic beyond argument and exit handling.
  - **Planned evidence**: Source review and module-call assertion.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] First mint creates generation `1` at the canonical path with legacy authority and shadow-only state.
  - **Planned evidence**: Manifest bytes and parsed field assertions.
- [ ] CHK-021 [P0] Immediate post-mint validation returns `manifestValid: true`, `fresh: true`, and `causeCode: fresh`.
  - **Planned evidence**: CLI JSON and exit `0`.
- [ ] CHK-022 [P0] Editing `SKILL.md`, `mode-registry.json`, or `hub-router.json` independently produces stale freshness.
  - **Planned evidence**: Three-axis drift matrix with exit `1`.
- [ ] CHK-023 [P0] Missing, malformed, mismatched, and compiler-invalid inputs fail closed.
  - **Planned evidence**: Negative matrix with stable cause codes.
- [ ] CHK-024 [P0] Duplicate mint leaves the first manifest byte-identical.
  - **Planned evidence**: Pre/post SHA-256 and `already-exists` result.
- [ ] CHK-025 [P0] Status reports nested `manifestFreshness` separately from the top-level serving `causeCode`.
  - **Planned evidence**: Fresh legacy-authority record and stale record.
- [ ] CHK-026 [P0] Runtime sync preserves a valid non-seven-hub manifest byte-for-byte.
  - **Planned evidence**: Pre/post SHA-256 around sync fixture.
- [ ] CHK-027 [P0] Invalid retained entries and destination conflicts fail sync without silent replacement.
  - **Planned evidence**: Negative sync cases.
- [ ] CHK-028 [P1] `--pretty` changes formatting only; semantic JSON is equal.
  - **Planned evidence**: Parsed object equality.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-030 [P0] `mint` invokes the same freshness predicate exported to consumers.
  - **Planned evidence**: Call-order test.
- [ ] CHK-031 [P0] `knownHubs()` unions status visibility without editing engine or advisor eligibility.
  - **Planned evidence**: Source diff plus explicit new-hub status.
- [ ] CHK-032 [P0] Sync preservation covers only safe, structurally valid, legacy-authority new-hub manifests.
  - **Planned evidence**: Inclusion and exclusion fixture table.
- [ ] CHK-033 [P0] The result distinguishes manifest-ready from runtime-serving.
  - **Planned evidence**: Contract assertion and new-hub legacy sentinel result.
- [ ] CHK-034 [P1] create-skill can parse the CLI contract without importing CommonJS internals.
  - **Planned evidence**: Python subprocess fixture or documented consumer stub.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-040 [P0] Invalid hub IDs and traversal paths cannot escape the activation root.
  - **Planned evidence**: Path matrix including separators, dot segments, absolute paths, and symlinks.
- [ ] CHK-041 [P0] A source-root identity mismatch cannot mint under another hub ID.
  - **Planned evidence**: Registry, router, root-name, and requested-ID mismatch cases.
- [ ] CHK-042 [P0] Mint is atomic and create-if-absent under concurrent attempts.
  - **Planned evidence**: Two-writer test with one success and one unchanged failure.
- [ ] CHK-043 [P1] Diagnostics contain no source contents, secret values, or absolute paths in stdout JSON.
  - **Planned evidence**: Output inspection.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-050 [P0] Spec, plan, tasks, checklist, decision record, and summary describe the same initial-only contract.
  - **Planned evidence**: Cross-document audit.
- [ ] CHK-051 [P0] ADR-002 allowlist removal and P4 cohort advancement remain explicitly deferred.
  - **Planned evidence**: Scope and decision-record citations.
- [ ] CHK-052 [P1] Downstream packet 013 references this interface rather than recreating it.
  - **Planned evidence**: Consumer implementation diff when 013 executes.
- [ ] CHK-053 [P1] Strict packet validation reports zero errors and warnings.
  - **Planned evidence**: `validate.sh --strict` output.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-060 [P0] Shared module source lives outside the sync-deleted `compiled-routing/` root.
  - **Planned evidence**: Path inspection and post-sync module availability.
- [ ] CHK-061 [P0] Canonical manifests exist only beneath the promoted activation root.
  - **Planned evidence**: Repository search and path assertions.
- [ ] CHK-062 [P0] Resolver, engine dispatch, advisor allowlists, default cohort, and frozen scorers are unchanged.
  - **Planned evidence**: Scoped diff and hash inventory.
- [ ] CHK-063 [P1] No runtime module reads `.opencode/specs`.
  - **Planned evidence**: Runtime import/path scan.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 34 | 0/34 | Planned |
| P1 Items | 13 | 0/13 | Planned |
| P2 Items | 0 | 0/0 | Planned |

**Verification Date**: Not run; implementation has not begun.

**Verification Scope**: Compiler reuse, canonical initial mint, exact freshness, path safety, status visibility, sync durability, routing invariance, and explicit deferrals.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [ ] CHK-070 [P0] All consumers use the shared predicate and no second policy-hash authority exists.
  - **Planned evidence**: Repository-wide symbol and literal inventory.
- [ ] CHK-071 [P0] Manifest-ready and runtime-serving remain separate states in code and output.
  - **Planned evidence**: State matrix and legacy-sentinel assertion.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [ ] CHK-072 [P1] Freshness compilation occurs only on explicit CLI/status control-plane calls.
  - **Planned evidence**: Call-site scan showing no resolver hot-path import.
- [ ] CHK-073 [P1] Existing status command latency is measured before and after additive freshness.
  - **Planned evidence**: Repeatable local timing record without a hard pass threshold.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [ ] CHK-074 [P0] Rollback removes the new adapter and consumers without touching existing seven manifests.
  - **Planned evidence**: Rollback drill or isolated fixture proof.
- [ ] CHK-075 [P0] Runtime sync after implementation leaves the CLI module and canonical new-hub manifest available.
  - **Planned evidence**: Post-sync path and hash checks.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [ ] CHK-076 [P0] No runtime path reads from `.opencode/specs` and no frozen scorer file changes.
  - **Planned evidence**: Import scan, scoped diff, and scorer hashes.
- [ ] CHK-077 [P1] Manifest output contains only the approved V1 fields.
  - **Planned evidence**: Exact-key assertion.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [ ] CHK-078 [P0] Implementation evidence reconciles all six packet documents without changing the accepted scope.
  - **Planned evidence**: Cross-document status and requirement audit.
- [ ] CHK-079 [P1] Parent phase map and generated metadata identify child 012 correctly.
  - **Planned evidence**: Parent validation and metadata inspection.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [ ] CHK-080 [P0] Technical sign-off confirms compiler reuse, freshness correctness, and zero routing delta.
  - **Planned evidence**: Named reviewer record with test outputs.
- [ ] CHK-081 [P0] Scope sign-off confirms allowlist removal, runtime discovery, refresh, and P4 flip remain deferred.
  - **Planned evidence**: Final scoped diff and deferral review.
<!-- /ANCHOR:sign-off -->
