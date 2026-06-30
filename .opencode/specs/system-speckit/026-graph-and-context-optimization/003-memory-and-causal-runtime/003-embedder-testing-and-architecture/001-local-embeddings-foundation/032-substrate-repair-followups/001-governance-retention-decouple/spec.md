---
title: "001 governance-retention-decouple (ADR-002 Option A implementation)"
description: "Decouple `retentionPolicy: 'ephemeral'` from governance enforcement, default ephemeral TTL, and verify with focused governance tests."
trigger_phrases:
  - "ADR-002 Option A implementation"
  - "retentionPolicy ephemeral decouple"
  - "DEFAULT_EPHEMERAL_TTL_MS"
  - "scope-governance.ts requiresGovernedIngest fix"
importance_tier: "important"
contextType: "spec"
status: "complete"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/001-local-embeddings-foundation/032-substrate-repair-followups/001-governance-retention-decouple"
    last_updated_at: "2026-05-14T11:10:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Implemented ADR-002 Option A and documented verification evidence."
    next_safe_action: "Review the documented llama-cpp memory_search blocker if strict live search proof is required."
---

# 001 — Governance Retention Decouple

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| Level | 2 |
| Priority | P0 |
| Status | Complete |
| Created | 2026-05-14 |
| Packet | `032-substrate-repair-followups/001-governance-retention-decouple` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Passing `retentionPolicy: "ephemeral"` to `memory_save` silently triggered governed-ingest validation and required the full audit chain. Callers that only wanted temporary retention were rejected with governance errors.

### Purpose

Implement ADR-002 Option A: ephemeral retention is a retention concern, not an audit-governance concern. Ephemeral saves without governance fields should succeed and receive a concrete default TTL.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Update `requiresGovernedIngest()` in `scope-governance.ts`.
- Add `DEFAULT_EPHEMERAL_TTL_MS = 24 * 60 * 60 * 1000`.
- Compute default `deleteAfter` for ephemeral retention when the caller omits it.
- Preserve explicit caller `deleteAfter` values for ephemeral retention.
- Mirror the runtime change to `dist/lib/governance/scope-governance.js`.
- Add focused vitest coverage.

### Out of Scope

- Retention sweep changes.
- Error-code changes beyond the existing E085 classifier.
- Existing-row migrations.
- Running `npm run build`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/scope-governance.ts` | Modify | Source governance behavior. |
| `.opencode/skills/system-spec-kit/mcp_server/dist/lib/governance/scope-governance.js` | Modify | Runtime mirror while build is broken. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/governance-ephemeral-decouple.vitest.ts` | Create | Three-case vitest coverage. |
| Packet docs | Create/modify | Plan, tasks, checklist, implementation summary, metadata. |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Ephemeral alone is allowed | `validateGovernedIngest({ retentionPolicy: "ephemeral" })` returns `allowed: true`. |
| REQ-002 | Default TTL is populated | Ephemeral alone returns non-null `normalized.deleteAfter` within the 24h TTL window. |
| REQ-003 | Explicit ephemeral TTL is preserved | `retentionPolicy: "ephemeral"` with explicit `deleteAfter` returns the caller value. |
| REQ-004 | Full governance still works | Ephemeral with full governance fields and explicit `deleteAfter` remains allowed. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Dist mirror updated | Runtime JS file matches source behavior. |
| REQ-006 | Existing governance tests pass | Existing governance-focused vitests exit 0. |
| REQ-007 | Live save path checked | `memory_save` without governance fields returns a positive id and non-null `delete_after`. |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- SC-001: Focused vitest file passes all three new cases.
- SC-002: Existing governance tests pass with no regression.
- SC-003: Live `memory_save({ filePath, retentionPolicy: "ephemeral" })` no longer returns E085.
- SC-004: Packet docs record PASS/FAIL evidence for implementation and live verification.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Broken build | Source changes cannot be compiled into dist | Patch source and dist directly. |
| Dependency | llama-cpp provider | `memory_search` may fail before lexical results | Document provider failure and clean up saved id. |
| Risk | Over-decoupling `deleteAfter` | Explicit TTL-only ephemeral case could still trigger governance | Treat `ephemeral + deleteAfter` as retention-only when no audit fields exist. |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- NFR-001: Keep the code change surgical and local to governance validation.
- NFR-002: Avoid schema changes and migrations.
- NFR-003: Preserve audit-governance enforcement when scope or provenance fields are supplied.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- Ephemeral with no `deleteAfter`: default to 24h.
- Ephemeral with explicit `deleteAfter`: preserve caller timestamp.
- Ephemeral with full governance: validate through governed-ingest path.
- Non-ephemeral with `deleteAfter`: still treated as governance-triggering metadata.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should `memory_search` have a lexical-only fallback when the embedding provider cannot initialize? Resolved for this packet as out of scope and documented as a verification blocker.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:complexity -->
## 10. COMPLEXITY

Small behavioral change in a shared governance helper, medium verification risk because the live memory-search round trip depends on local llama-cpp availability.

<!-- /ANCHOR:complexity -->
