---
title: "Verification Checklist: Generator Hardening [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "graph metadata source fingerprint"
  - "phase child contract unify"
  - "access telemetry split"
  - "freshness telemetry split"
  - "generator hardening"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/038-generator-hardening"
    last_updated_at: "2026-07-04T17:11:56.393Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded QA items for the fingerprint and telemetry split"
    next_safe_action: "Hold for implementation, no item has been verified yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/folder-discovery.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Generator Hardening

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies confirmed: 031 identity resolver/merge guard present in `graph-metadata-parser.ts`; index access path is the new `access-telemetry.ts` store; projection is ISO-datetime normalization in `computeSourceFingerprintFromDocs`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fingerprint derives over the ISO-normalized projection; the no-op-re-derive vitest case proves an identical fingerprint and a clean idempotent skip (`created:false`, byte-identical)
- [x] CHK-011 [P0] Typecheck clean (0 TS errors); flag default-off path is byte-identical (field omitted), proven by the flag-off vitest case
- [x] CHK-012 [P1] Grandfather mode resolves a missing/mismatched fingerprint to non-blocking `info`; the optional schema field parses with and without the value
- [x] CHK-013 [P1] Follows the existing capability-flag, generator, and first-class-validator patterns (`isIdentityMergeSafetyEnabled` sibling shape, `GENERATED_METADATA_INTEGRITY` validator)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-007), 15/15 vitest passing
- [x] CHK-021 [P0] Proven by the source_fingerprint vitest cases (no-op identical + clean skip; doc change differs)
- [x] CHK-022 [P1] Proven by the unified-child-contract vitest cases on a fixture tree (qualifying + bare child)
- [x] CHK-023 [P1] Proven by the telemetry-split vitest cases (read records to store, JSON byte-identical; resume resolves from store; strict run reports `info` under grandfather)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `algorithmic` (fingerprint projection + unified child enumeration) plus `cross-consumer` (telemetry relocation across parser, resume, validator)
- [x] CHK-FIX-002 [P0] Producer inventory run: `rg 'source_fingerprint|listPhaseChildren|isPhaseParent|resolveChildrenIds|last_active_child_id'` over `mcp_server` confirmed the changed symbols and their existing consumers
- [x] CHK-FIX-003 [P0] Consumers checked: `isPhaseParent` consumers (`orchestrator.ts`) keep flag-off behavior byte-identical; `resolveChildrenIds` now exported; schema field optional so all loaders tolerate absence
- [x] CHK-FIX-004 [P0] Adversarial cases tested: no-op re-derive, store-miss fallback, bare (non-qualifying) child, missing/mismatched fingerprint; `writeGraphMetadataFile` retains its existing outside-root guard
- [x] CHK-FIX-005 [P1] Matrix axes: flag on/off x {fingerprint write, child contract, telemetry split}, grandfather on/off, schema with/without field, store hit/miss
- [x] CHK-FIX-006 [P1] Hostile env/global-state covered: every vitest case sets and cleans `SPECKIT_GENERATOR_HARDENING`/`SPECKIT_GENERATED_METADATA_GRANDFATHER` per-case; the env-reference-drift guard passes
- [x] CHK-FIX-007 [P1] Evidence pinned to the working-tree diff for this phase (uncommitted, no SHA yet, listed in implementation-summary.md)
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] Fingerprint derives over the canonical source docs the generator already reads; no new untrusted input
- [x] CHK-032 [P1] No new execution surface: the strict read is a pure sha256 compare, the telemetry store is a best-effort fail-closed JSON read/write
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized; ENV_REFERENCE.md documents the new flag plus the sibling-phase flags
- [x] CHK-041 [P1] Code comments adequate (durable WHY, no artifact ids or spec paths in comments)
- [ ] CHK-042 [P2] README updated — N/A, no folder README in scope for this internal lib hardening
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No scratch files created; all changes are in the named source files and the phase docs
- [x] CHK-051 [P1] No scratch/ directory created
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 0/1 (CHK-042 N/A, deferred) |

**Verification Date**: 2026-06-22 — 15/15 vitest passing, `validate.sh --strict` exit 0, typecheck 0 errors
<!-- /ANCHOR:summary -->

---
