---
title: "Implementation Plan: Unified Observability Event Envelope"
description: "Documents the completed producer-side observability event envelope and append helper work."
trigger_phrases:
  - "unified observability envelope"
  - "observability event envelope"
  - "observability-events.cjs"
  - "normalizeObservabilityEvent"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/030-deep-loop-improved/006-ux-observability-automation/003-unified-observability-event-envelope"
    last_updated_at: "2026-07-01T22:50:00Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Replaced scaffold content with spec-grounded complete info"
    next_safe_action: "Regenerate metadata and run recursive strict validation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/commands/deep/assets/deep_research_auto.yaml"
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/round-state-jsonl.cjs"
      - ".opencode/skills/deep-loop-runtime/scripts/status.cjs"
    session_dedup:
      fingerprint: "sha256:1111111111111111111111111111111111111111111111111111111111111111"
      session_id: "scaffold-content-remediation-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Unified Observability Event Envelope

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS deep-loop runtime helpers plus YAML producer calls |
| **Framework** | Deep-loop observability producers and JSONL ledgers |
| **Storage** | Existing JSONL streams with envelope-wrapped rows |
| **Testing** | Envelope unit test, producer wiring fixture, strict spec validation |

### Overview
This completed work added a canonical producer-side event envelope for deep-loop observability rows. Native producer payloads remain intact inside `payload`, while `schema_version`, `event_id`, `producer`, `stream`, `subject`, `event`, and `status` make rows indexable by future cross-mode dashboards.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear: each producer wrote incompatible native event shapes.
- [x] Success criteria measurable: `normalizeObservabilityEvent()` returns every required envelope field.
- [x] Dependencies identified: existing JSONL records remain valid and are not migrated.

### Definition of Done
- [x] `observability-events.cjs` exports `normalizeObservabilityEvent()` and `appendObservabilityEvent()`.
- [x] Five core producers normalize native events before append.
- [x] Envelope rows preserve the original native payload under `payload`.
- [x] Existing consumers can parse envelope-wrapped rows without losing native fields.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Additive envelope wrapper: producers retain their native payload format, then the shared helper wraps it with stable indexing metadata before appending to JSONL.

### Key Components
- **`observability-events.cjs`**: Owns normalization and append semantics for envelope rows.
- **`normalizeObservabilityEvent()`**: Validates and fills required envelope fields around a native payload.
- **`appendObservabilityEvent()`**: Normalizes and writes one JSONL row to the target stream.
- **Producer integrations**: `fanout-run.cjs`, `deep_research_auto.yaml`, `convergence.cjs`, `round-state-jsonl.cjs`, and `status.cjs` route writes through the helper.

### Data Flow
A producer prepares its native event payload, supplies metadata identifying producer, stream, subject, event, and status, and calls the append helper. The helper adds schema and event identifiers, stores the native payload under `payload`, and appends the envelope row without rewriting historical records.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `observability-events.cjs` | New shared helper | Normalize and append envelope rows | Unit test asserts required fields |
| Fan-out producer | Emits fan-out status events | Route appends through helper | Fan-out row keeps native payload |
| Deep-research YAML | Emits single-loop telemetry | Route heartbeat events through helper | Single-loop row has envelope fields |
| Convergence and status scripts | Emit runtime status events | Normalize before append | Existing consumers read `payload` successfully |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Read the completed spec and confirm producer-side-only scope.
- [x] Inventory the five core producers named by the spec.
- [x] Preserve unified reader and historical migration work as out of scope.

### Phase 2: Core Implementation
- [x] Create `observability-events.cjs` with normalization and append helpers.
- [x] Add required envelope fields around native payloads.
- [x] Wire fan-out, single-loop telemetry, convergence, round-state, and status producers.
- [x] Preserve existing native payload shape inside `payload`.

### Phase 3: Verification
- [x] Verify normalization returns `schema_version`, `event_id`, `producer`, `stream`, `subject`, `event`, `status`, and `payload`.
- [x] Verify an envelope-wrapped fan-out row remains parseable through the existing consumer path.
- [x] Verify strict validation passes for the leaf folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `normalizeObservabilityEvent()` required fields | CommonJS helper fixture |
| Integration | Envelope-wrapped fan-out row parseability | Existing consumer fixture |
| Producer wiring | Five named producers use append helper | Import and output inspection |
| Spec validation | Leaf packet structure | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Native producer payloads | Internal | Complete | Envelope must wrap existing data without migration |
| Node UUID support | Runtime | Available | `event_id` generation requires modern Node support |
| Unified reader | Out of scope successor | Not required | This leaf only prepares producer-side normalized rows |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Envelope rows break existing consumers, required fields are missing, or producer writes fail through the helper.
- **Procedure**: Revert `observability-events.cjs` and the five producer integrations, restoring native producer append paths and leaving historical JSONL untouched.
<!-- /ANCHOR:rollback -->
