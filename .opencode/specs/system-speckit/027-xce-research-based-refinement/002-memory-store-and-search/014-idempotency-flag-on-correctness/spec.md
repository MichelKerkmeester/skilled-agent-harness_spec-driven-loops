---
title: "Feature Specification: Idempotency Flag-On Correctness"
description: "Fixes correctness defects in the default-off SPECKIT_MEMORY_IDEMPOTENCY path so server-derived receipt replay, conflict detection, and receipt writes are safe when operators explicitly enable the flag. Enablement remains gated and default-off after this phase."
trigger_phrases:
  - "memory idempotency correctness"
  - "SPECKIT_MEMORY_IDEMPOTENCY"
  - "idempotency receipts"
  - "server-derived idempotency"
  - "memory save replay"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness"
    last_updated_at: "2026-06-11T12:35:00Z"
    last_updated_by: "opencode"
    recent_action: "Fixed flag-on memory idempotency correctness"
    next_safe_action: "Use implementation-summary.md for final verification evidence."
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The idempotency feature remains default-off; this phase fixes correctness only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Idempotency Flag-On Correctness

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-11 |
| **Branch** | `028-mcp-to-cli-tool-transition` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 23 |
| **Predecessor** | `022-provenance-injection` |
| **Handoff Criteria** | Flag-on and flag-off idempotency test file passes, related memory-save suites stay green, TypeScript passes, strict spec validation passes, and changed-code comment hygiene is clean. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This phase fixes correctness in the server-derived memory idempotency path behind `SPECKIT_MEMORY_IDEMPOTENCY`. The feature remains default-off. The scope is limited to correctness for explicit flag-on runs, not rollout or enablement.

**Scope Boundary**: Receipt key derivation, replay, conflict behavior, store semantics, and `memory_save` receipt-write gating. The near-duplicate advisory behavior is preserved and covered by the same regression file. No live shard, host daemon, or persistent MCP database path is touched.

**Dependencies**:
- Existing `memory_idempotency_receipts` table contract and in-memory schema helper.
- Existing `memory_save` save result statuses: `indexed`, `updated`, `deferred`, `duplicate`, `unchanged`, `rejected`, and `error`.
- Existing normalization contract that strips client-supplied idempotency tokens before hashing.
- Existing near-duplicate marker tests in the idempotency regression file.

**Deliverables**:
- Replay returns the originally stored response exactly.
- Repeated receipt stores preserve the first response for the receipt key.
- Payload normalization allows token/key-order/undefined differences while preserving genuine conflict detection.
- Receipt writes occur only for successful mutating saves.
- Duplicate, unchanged, rejected, error, and aborted save paths do not create blocking receipts.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The default-off idempotency path had correctness defects that only matter when `SPECKIT_MEMORY_IDEMPOTENCY` is explicitly enabled:

- `lookupIdempotencyReceipt` decorated stored responses with replay metadata, so replay did not return the original response.
- `storeIdempotencyReceipt` used an upsert that could overwrite the original response for a receipt key, breaking first-write idempotency semantics.
- `memory_save` wrote receipts with a broad guard that excluded only duplicate and unchanged results; structured error or rejection results with a positive id could leave a receipt that blocks a legitimate retry.

### Purpose

Make the flag-on path correct before any future enablement discussion. The feature flag remains default-off and no rollout behavior changes in this phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Fix receipt replay to return the stored response as originally written.
- Make receipt storage immutable for an existing receipt key.
- Add a tested mutating-success guard for `memory_save` receipt writes.
- Extend idempotency tests for replay stability, immutable receipt writes, normalization, genuine conflicts, successful writes, skipped duplicate/unchanged/error/rejected writes, and retry-safe failed paths.
- Run the idempotency/near-duplicate test file with the flag enabled and unset.
- Run related memory-save suites with the flag enabled.
- Preserve near-duplicate behavior and default-off behavior.

### Out of Scope
- Enabling `SPECKIT_MEMORY_IDEMPOTENCY` by default.
- Changing the receipt table schema or adding migrations.
- Changing near-duplicate scoring or advisory thresholds.
- Touching host daemons or live `mcp_server/database/**` shards.
- Editing the parent 027 metadata.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/storage/idempotency-receipts.ts` | Modify | Return stored responses exactly, keep first receipt immutable, and expose the mutating-success receipt-write guard. |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-save.ts` | Modify | Use the guard before storing a memory-save receipt. |
| `.opencode/skills/system-spec-kit/mcp_server/tests/memory-idempotency-and-near-duplicate.vitest.ts` | Modify | Add flag-on regression tests for replay, conflicts, normalization, write gating, and retry safety while preserving near-duplicate coverage. |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/002-memory-store-and-search/014-idempotency-flag-on-correctness/*` | Create | Document this completed Level 2 phase and verification evidence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Replay must return the original response. | A stored receipt replay deep-equals the original MCP response and does not add replay-only data or hints. |
| REQ-002 | Receipt storage must preserve first-write semantics. | A repeated store for the same key cannot overwrite the first response. |
| REQ-003 | Conflict detection must ignore non-semantic client-token and ordering differences. | Key order, stripped client idempotency tokens, and object `undefined` values do not create conflicts. |
| REQ-004 | Conflict detection must still catch genuine payload changes. | Changing a real payload field under the same derived key returns `conflict`. |
| REQ-005 | Receipt writes must happen only for successful mutating saves. | `indexed`, `updated`, and `deferred` non-error responses may store receipts; duplicate, unchanged, rejected, error, and error envelopes do not. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Failed or aborted saves must not block legitimate retries. | A skipped failed candidate leaves lookup as `miss`, so retry can proceed. |
| REQ-007 | Default-off behavior must remain unchanged. | The idempotency test file passes with the flag unset and no default flag logic changes are made. |
| REQ-008 | Near-duplicate handling must not regress. | Existing near-duplicate tests in the same file continue to pass with the flag enabled and unset. |
| REQ-009 | Tests must avoid live shards and host daemons. | Tests use in-memory SQLite fixtures and no `mcp_server/database/**` path. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Flag-on idempotency/near-duplicate suite passes with replay, immutable receipt, normalization, conflict, write-gating, and retry-safety coverage.
- **SC-002**: Flag-off idempotency/near-duplicate suite passes with no regression.
- **SC-003**: Related memory-save suites pass with the flag enabled.
- **SC-004**: `npx tsc --noEmit` passes from the MCP server directory.
- **SC-005**: Strict phase validation and changed-code comment-hygiene checks pass.
- **SC-006**: The feature flag remains default-off after the fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing receipt table schema | Schema changes would increase rollout risk. | Keep schema unchanged and change only insert/replay semantics. |
| Dependency | `memory_save` status strings | Receipt writes depend on status classification. | Use an explicit allowlist of successful mutating statuses. |
| Risk | Replay observability loss | Removing replay decoration means callers do not get an inline replay marker. | Idempotency correctness requires original response equivalence; operational observability can be added separately if needed. |
| Risk | Over-broad guard | New success statuses could be skipped until reviewed. | Prefer fail-closed receipt writes for unrecognized statuses while the flag remains default-off. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Replayed responses must be deterministic and equal to the original response.
- **NFR-R02**: Retry after failure must not be blocked by a persisted receipt.

### Security
- **NFR-S01**: Client-supplied idempotency tokens must not influence server-derived keys or payload hashes.
- **NFR-S02**: No live memory shard or host daemon may be used for tests.

### Maintainability
- **NFR-M01**: Fixes must be minimal and local to receipt storage, memory-save write gating, and focused tests.
- **NFR-M02**: New code comments must avoid ephemeral artifact labels and numeric finding lists.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Payload Normalization
- **Client token aliases**: `idempotencyToken`, `idempotency_key`, and client-idempotency variants are ignored anywhere in payload or fingerprint objects.
- **Key ordering**: Object keys are sorted before hashing, so equivalent payloads hash the same.
- **Undefined object values**: Object fields that normalize to `undefined` are omitted; real value changes still conflict.

### Save Outcomes
- **Duplicate or unchanged**: Existing no-op save paths do not create receipts.
- **Rejected or error**: Non-mutating outcomes do not create receipts even if a structured result carries an id.
- **Deferred embedding**: A saved row with deferred indexing is still a successful mutation and may create a receipt.
- **Repeated store race**: If two stores race for the same key, the first response remains authoritative.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 10/25 | Two production files, one focused test file, and phase docs. |
| Risk | 14/25 | Idempotent write correctness affects retry and replay safety when the flag is enabled. |
| Research | 8/20 | Required reading receipt derivation, memory-save branches, and existing coverage. |
| Multi-Agent | 0/15 | No additional agent work required. |
| Coordination | 6/15 | Must avoid live shards and parent metadata. |
| **Total** | **38/100** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

- Should replay observability be exposed through a separate out-of-band metric instead of mutating the response? **RESOLVED: Out of scope; response equivalence is required for correctness.**
- Should `SPECKIT_MEMORY_IDEMPOTENCY` be enabled after this fix? **RESOLVED: No. The flag remains default-off pending review and future enablement work.**
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`.
- **Task Breakdown**: See `tasks.md`.
- **Verification Checklist**: See `checklist.md`.
- **Implementation Summary**: See `implementation-summary.md`.
<!-- /ANCHOR:related-docs -->
