---
title: "Verification Checklist: Drift Gate and Shared Synopsis Extractor [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-22. All P0 and P1 items verified, vitest 11/11 green and validate.sh --strict exit 0."
trigger_phrases:
  - "generated metadata drift gate"
  - "shared synopsis extractor"
  - "derive packet synopsis"
  - "check generated metadata drift"
  - "source doc hashes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-spec-data-quality/006-generated-metadata-build/037-drift-gate-synopsis-extractor"
    last_updated_at: "2026-07-04T17:11:55.086Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified drift gate and shared extractor, all P0/P1 items checked with evidence"
    next_safe_action: "Decide the scoped migration that flips the flag on"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/packet-synopsis.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/generated-metadata-drift.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
      - ".opencode/skills/system-spec-kit/scripts/tests/generated-metadata-drift.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Drift Gate and Shared Synopsis Extractor

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

- [x] CHK-001 [P0] Requirements documented in spec.md — REQ-001 through REQ-005 present
- [x] CHK-002 [P0] Technical approach defined in plan.md — shared extractor + read-only drift gate
- [x] CHK-003 [P1] The two divergent extractors, the schema seam, and the validate and backfill wiring points identified and available — `extractDescription` and `deriveCausalSummary` routed, schema field added, `validate.sh` + backfill wired
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both the `description` and `causal_summary` fields derive from the one shared `derivePacketSynopsis` helper when the flag is on. The legacy extractor bodies are retained behind the flag, NOT removed: REQ-001 and the task require flag-off to be byte-identical, which is impossible without the legacy path. This is a deliberate reconciliation of the affected-surfaces "body is gone" hint against the dominant byte-identical guard.
- [x] CHK-011 [P0] The drift gate reports only and writes no folder, proven by the sha256 before/after no-write assertion in the vitest
- [x] CHK-012 [P1] Missing `source_doc_hashes` (ungraded), missing source doc (empty derivation), and unreadable doc (read error) branches handled in `checkGeneratedMetadataDrift`
- [x] CHK-013 [P1] Change follows the existing generated-metadata patterns — mirrors the `GENERATED_METADATA_INTEGRITY` report/resolve + CLI-bridge shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005) — vitest 11/11 green
- [x] CHK-021 [P0] With the flag OFF drift resolves to `info` (verdict unchanged) and with it ON to `error`, proven by the grandfather-vs-enforce vitest cases over `resolveGeneratedMetadataDrift`
- [x] CHK-022 [P1] `checkGeneratedMetadataDrift` returns drift for a changed folder and no drift for an in-sync folder, writing nothing — drift-detection and no-write vitest cases
- [x] CHK-023 [P1] A doc edit changes the persisted `source_doc_hashes` and the backfill summary surfaces the drift without mutating the folder — freshness-key vitest case + backfill `drift` array
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `class-of-bug` (two-extractor divergence) and `algorithmic` (missing drift proof), both from 031 research recs 10 and 11.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg 'causal_summary|description|derivePacketSynopsis'` confirms the two fields are the only synopsis producers, both now routed.
- [x] CHK-FIX-003 [P0] Consumer inventory: `checkGeneratedMetadataDrift`, `computeSourceDocHashes`, `derivePacketSynopsis`, `source_doc_hashes` consumers swept; api barrel, validate.sh, registry, backfill all updated.
- [x] CHK-FIX-004 [P0] Adversarial branches tested: empty derivation (no spec.md), ungraded (no hashes), no-write snapshot, and the precedence fallback chain are vitest cases.
- [x] CHK-FIX-005 [P1] Matrix axes exercised: flag-off grandfather, flag-on enforce, drifted folder, in-sync folder, missing source_doc_hashes, no source doc, shared-extractor precedence, no-write.
- [x] CHK-FIX-006 [P1] Hostile env/global-state: the flag is read from `process.env` per-call and the vitest sets/deletes it per case with restore in `afterEach`.
- [x] CHK-FIX-007 [P1] Evidence pinned to the working-tree diff of this phase, uncommitted by instruction.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The gate reads existing folders and docs and introduces no new untrusted input
- [x] CHK-032 [P1] No new execution surface introduced by the gate wiring — the bridge runs the same tsx/node path as the integrity rule
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized — status set COMPLETE across spec, impl-summary, checklist
- [x] CHK-041 [P1] Code comments adequate — durable WHY comments, no artifact ids or spec paths
- [x] CHK-042 [P2] README updated — N/A, no README in scope; ENV_REFERENCE.md updated for the flag
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — vitest uses os.tmpdir, no scratch artifacts
- [x] CHK-051 [P1] scratch/ cleaned before completion — none created
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 12 | 12/12 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-22
<!-- /ANCHOR:summary -->

---
