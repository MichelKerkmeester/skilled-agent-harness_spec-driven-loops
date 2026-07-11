---
title: "Verification Checklist: A3 Enum-Constrain JSON Metadata Schemas [template:level_2/checklist.md]"
description: "Verification Date: Pending (scaffold, not yet verified)"
trigger_phrases:
  - "enum constrain schemas"
  - "importance_tier status content_type"
  - "graph-metadata zod schema"
  - "description schema enum"
  - "mutation_class enum discipline"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-spec-data-quality/001-on-write-quality/003-enum-constrain-schemas"
    last_updated_at: "2026-07-04T17:12:02.139Z"
    last_updated_by: "benchmark-spec-agent"
    recent_action: "Added benchmark, test and default-safety rows to checklist"
    next_safe_action: "Hold for implementation, no item has been verified yet"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/description/description-schema.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/graph/graph-metadata-parser.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Verification Checklist: A3 Enum-Constrain JSON Metadata Schemas

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

- [ ] CHK-001 [P0] Requirements documented in spec.md
- [ ] CHK-002 [P0] Technical approach defined in plan.md
- [ ] CHK-003 [P1] Canonical content_type vocabulary and A4 dependency identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-010 [P0] Each vocabulary is one named `as const` tuple feeding both the `z.enum(...)` and any consumer, mirroring `SAVE_LINEAGE_VALUES`
- [ ] CHK-011 [P0] No console errors or warnings from the schema parse on a valid file
- [ ] CHK-012 [P1] Absent optional fields and `.passthrough()` authored keys preserved
- [ ] CHK-013 [P1] Change follows the existing constant-then-enum and per-field message patterns
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-008)
- [ ] CHK-021 [P0] A derive-then-parse round trip over real packets exercising all three producer paths produces only in-enum values with zero re-index
- [ ] CHK-022 [P1] An out-of-enum value yields a precise per-field message through `formatDescriptionSchemaIssues`
- [ ] CHK-023 [P1] Case or separator drift normalizes before the value reaches the strict enum
- [ ] CHK-024 [P0] Enum swap-precision benchmark passes, catch-rate 1.00 and false-reject-rate 0.00 on the planted fixture set across both schemas, reproduced via `enum-constrain-schemas.vitest.ts`
- [ ] CHK-025 [P0] Corpus conformance-count baseline frozen through the warn-tier `GRAPH_METADATA_SHAPE` and `DESCRIPTION_SHAPE` rules with the count-to-zero handed to A4
- [ ] CHK-026 [P0] Flags-off byte-identical parse proven with `SPECKIT_SCHEMA_ENUM_ENFORCE` off and the flag registered in the flag-ceiling drift guard
- [ ] CHK-027 [P0] The enum is reachable only through the flag seam, not a bare `z.enum` baked into the base schema, verified by a grep showing free-string base `importance_tier` and `status` plus the `isSchemaEnumEnforceEnabled()` resolver
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each actionable finding has a finding class: `instance-only`, `class-of-bug`, `cross-consumer`, `algorithmic`, `matrix/evidence`, or `test-isolation`.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed, or instance-only status proven by grep.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for changed helpers, policies, schema fields, response fields, docs, and tests.
- [ ] CHK-FIX-004 [P0] Security/path/parser/redaction fixes include adversarial table tests for delimiter, joined-input, outside-root, no-op, and fallback cases.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count are listed before completion is claimed.
- [ ] CHK-FIX-006 [P1] Hostile env/global-state variant executed when tests or code read process-wide state.
- [ ] CHK-FIX-007 [P1] Evidence is pinned to a fix SHA or explicit diff range, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [ ] CHK-030 [P0] No hardcoded secrets
- [ ] CHK-031 [P0] Change stays inside the existing parse-on-load trust boundary and reads no new inputs
- [ ] CHK-032 [P1] No new execution surface introduced by the enum tuples or the producer guard
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks synchronized
- [ ] CHK-041 [P1] The content_type source vocabulary is cited in a code comment with no artifact id
- [ ] CHK-042 [P2] README updated (if applicable)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files in scratch/ only
- [ ] CHK-051 [P1] scratch/ cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 0/16 |
| P1 Items | 13 | 0/13 |
| P2 Items | 1 | 0/1 |

**Verification Date**: Pending (scaffold, not yet verified)
<!-- /ANCHOR:summary -->

---
