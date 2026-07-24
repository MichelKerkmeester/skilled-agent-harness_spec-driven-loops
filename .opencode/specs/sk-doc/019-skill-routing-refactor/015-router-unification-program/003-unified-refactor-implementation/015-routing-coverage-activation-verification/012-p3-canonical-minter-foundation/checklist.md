---
title: "Checklist: P3 Canonical Manifest Minter Foundation"
description: "Verified QA gate for canonical initial minting, exact freshness, store durability, fail-closed behavior, and unchanged routing decisions."
trigger_phrases:
  - "canonical minter checklist"
  - "manifest freshness QA gate"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/020-router-unification-program/007-unified-refactor-implementation/015-routing-coverage-activation-verification/012-p3-canonical-minter-foundation"
    last_updated_at: "2026-07-21T05:29:04Z"
    last_updated_by: "codex"
    recent_action: "Verified the complete minter, freshness, status, and sync matrix"
    next_safe_action: "Consume the verified JSON contract from create-skill"
    blockers:
      - "No implementation blockers remain; later serving changes stay explicitly deferred."
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-07-21-canonical-minter-spec"
      parent_session_id: null
    completion_pct: 100
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

All checks are verified against the evidence ledger in `implementation-summary.md`.
Inline evidence descriptions below map to the command, artifact, hash, and source citations in that ledger.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Baseline routing suites and counts are captured before edits. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Command log and per-suite counts.
- [x] CHK-002 [P0] Frozen scorer SHA-256 values are captured before edits. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Three path-to-hash rows.
- [x] CHK-003 [P0] The create-skill parent fixture compiles through the unchanged 006 `compileRegistry()`. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Fixture compile result and policy hash.
- [x] CHK-004 [P1] Current seven-hub status output is saved for additive schema comparison. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Normalized JSON fixture.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Only the shared module computes the current policy and freshness result. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Consumer import/call-site inventory.
- [x] CHK-011 [P0] The adapter calls existing `compileRegistry()` and defines no policy-selection algorithm. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Import path and test spy or fixture assertion.
- [x] CHK-012 [P0] Public functions return the documented stable result envelope. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Exact object assertions.
- [x] CHK-013 [P1] Canonical bytes exclude timestamps, absolute paths, and environment values. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Repeat-mint fixture byte comparison across temp roots.
- [x] CHK-014 [P1] The CLI contains no manifest or freshness logic beyond argument and exit handling. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Source review and module-call assertion.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] First mint creates generation `1` at the canonical path with legacy authority and shadow-only state. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Manifest bytes and parsed field assertions.
- [x] CHK-021 [P0] Immediate post-mint validation returns `manifestValid: true`, `fresh: true`, and `causeCode: fresh`. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: CLI JSON and exit `0`.
- [x] CHK-022 [P0] Editing `SKILL.md`, `mode-registry.json`, or `hub-router.json` independently produces stale freshness. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Three-axis drift matrix with exit `1`.
- [x] CHK-023 [P0] Missing, malformed, mismatched, and compiler-invalid inputs fail closed. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Negative matrix with stable cause codes.
- [x] CHK-024 [P0] Duplicate mint leaves the first manifest byte-identical. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Pre/post SHA-256 and `already-exists` result.
- [x] CHK-025 [P0] Status reports nested `manifestFreshness` separately from the top-level serving `causeCode`. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Fresh legacy-authority record and stale record.
- [x] CHK-026 [P0] Runtime sync preserves a valid non-seven-hub manifest byte-for-byte. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Pre/post SHA-256 around sync fixture.
- [x] CHK-027 [P0] Invalid retained entries and destination conflicts fail sync without silent replacement. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Negative sync cases.
- [x] CHK-028 [P1] `--pretty` changes formatting only; semantic JSON is equal. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Parsed object equality.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] `mint` invokes the same freshness predicate exported to consumers. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Call-order test.
- [x] CHK-031 [P0] `knownHubs()` unions status visibility without editing engine or advisor eligibility. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Source diff plus explicit new-hub status.
- [x] CHK-032 [P0] Sync preservation covers only safe, structurally valid, legacy-authority new-hub manifests. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Inclusion and exclusion fixture table.
- [x] CHK-033 [P0] The result distinguishes manifest-ready from runtime-serving. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Contract assertion and new-hub legacy sentinel result.
- [x] CHK-034 [P1] create-skill can parse the CLI contract without importing CommonJS internals. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Python subprocess fixture or documented consumer stub.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Invalid hub IDs and traversal paths cannot escape the activation root. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Path matrix including separators, dot segments, absolute paths, and symlinks.
- [x] CHK-041 [P0] A source-root identity mismatch cannot mint under another hub ID. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Registry, router, root-name, and requested-ID mismatch cases.
- [x] CHK-042 [P0] Mint is atomic and create-if-absent under concurrent attempts. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Two-writer test with one success and one unchanged failure.
- [x] CHK-043 [P1] Diagnostics contain no source contents, secret values, or absolute paths in stdout JSON. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Output inspection.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, decision record, and summary describe the same initial-only contract. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Cross-document audit.
- [x] CHK-051 [P0] ADR-002 allowlist removal and P4 cohort advancement remain explicitly deferred. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Scope and decision-record citations.
- [x] CHK-052 [P1] Downstream packet 013 references this interface rather than recreating it. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: `../../013-create-skill-alignment/spec.md:75`, `:130`, and `:162` require the canonical minter and forbid emulation.
- [x] CHK-053 [P1] Strict packet validation reports zero errors and warnings. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Final `validate.sh --strict` output records 0 errors and 0 warnings in `implementation-summary.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Shared module source lives outside the sync-deleted `compiled-routing/` root. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Path inspection and post-sync module availability.
- [x] CHK-061 [P0] Canonical manifests exist only beneath the promoted activation root. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Repository search and path assertions.
- [x] CHK-062 [P0] Resolver, engine dispatch, advisor allowlists, default cohort, and frozen scorers are unchanged. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Scoped diff and hash inventory.
- [x] CHK-063 [P1] No runtime module reads `.opencode/specs`. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Runtime import/path scan.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified | Status |
|----------|-------|----------|--------|
| P0 Items | 34 | 34/34 | Verified |
| P1 Items | 13 | 13/13 | Verified |
| P2 Items | 0 | 0/0 | Verified |

**Verification Date**: 2026-07-21.

**Verification Scope**: Compiler reuse, canonical initial mint, exact freshness, path safety, status visibility, sync durability, routing invariance, and explicit deferrals.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

- [x] CHK-070 [P0] All consumers use the shared predicate and no second policy-hash authority exists. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Repository-wide symbol and literal inventory.
- [x] CHK-071 [P0] Manifest-ready and runtime-serving remain separate states in code and output. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: State matrix and legacy-sentinel assertion.
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

- [x] CHK-072 [P1] Freshness compilation occurs only on explicit CLI/status control-plane calls. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Call-site scan showing no resolver hot-path import.
- [x] CHK-073 [P1] Existing status command latency is measured before and after additive freshness. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Repeatable local timing record without a hard pass threshold.
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

- [x] CHK-074 [P0] Rollback removes the new adapter and consumers without touching existing seven manifests. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Rollback drill or isolated fixture proof.
- [x] CHK-075 [P0] Runtime sync after implementation leaves the CLI module and canonical new-hub manifest available. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Isolated capture/root-removal/restore byte equality plus live sync `--check` and `--verify`; the stable CLI remains outside the replaced root.
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

- [x] CHK-076 [P0] No runtime path reads from `.opencode/specs` and no frozen scorer file changes. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Import scan, scoped diff, and scorer hashes.
- [x] CHK-077 [P1] Manifest output contains only the approved V1 fields. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Exact-key assertion.
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

- [x] CHK-078 [P0] Implementation evidence reconciles all six packet documents without changing the accepted scope. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Cross-document status and requirement audit.
- [x] CHK-079 [P1] Parent phase map and generated metadata identify child 012 correctly. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Parent `spec.md:45` maps P3 to this child; regenerated `description.json` and `graph-metadata.json` identify the same packet.
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: SIGN-OFF

- [x] CHK-080 [P0] Technical sign-off confirms compiler reuse, freshness correctness, and zero routing delta. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Codex implementation verification sign-off and test outputs are recorded in `implementation-summary.md`.
- [x] CHK-081 [P0] Scope sign-off confirms allowlist removal, runtime discovery, refresh, and P4 flip remain deferred. [Evidence: paired detail below maps to `implementation-summary.md` verification ledger]
  - **Evidence**: Final scoped diff and deferral review.
<!-- /ANCHOR:sign-off -->
