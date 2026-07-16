---
title: "Unified Observability Event Envelope"
description: "Fan-out ledger, single-loop telemetry, convergence events, and council round-state each emit in different native formats with no canonical schema, making it impossible to build a cross-mode dashboard or alerting system without bespoke parsers for each producer."
trigger_phrases:
  - "unified observability envelope"
  - "observability event envelope"
  - "003 unified observability"
  - "observability-events.cjs"
  - "normalizeObservabilityEvent"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/024-deep-loop-improved/006-ux-observability-automation/003-unified-observability-event-envelope"
    last_updated_at: "2026-06-28T00:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Authored leaf spec for 003-unified-observability-event-envelope"
    next_safe_action: "Author plan.md and tasks.md before implementation"
    blockers: []
    key_files:
      - ".opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Unified Observability Event Envelope

<!-- SPECKIT_LEVEL: 1 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope, and verification evidence.
- Remove placeholders, stale status, and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria, and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-06-28 |
| **Branch** | `main` |
| **Parent Spec** | ../spec.md |
| **Phase** | 3 of 6 |
| **Predecessor** | 002-single-loop-telemetry-heartbeat |
| **Successor** | 004-run-now-control |
| **Handoff Criteria** | `validate.sh --strict` passes; `observability-events.cjs` exports `normalizeObservabilityEvent` and `appendObservabilityEvent`; at least one existing producer imports and uses it |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is Phase 3 of 6 within `006-ux-observability-automation`.

**Scope Boundary**: Create `observability-events.cjs` and wire it into producers as a normalizer. Legacy ledger formats remain valid — additive only. No unified reader built in this leaf.

**Dependencies**:
- Logically follows 002 (telemetry heartbeat rows should flow through the envelope first).
- No hard blocking dependency: can implement envelope before single-loop rows if needed.

**Deliverables**:
- New `observability-events.cjs` with `normalizeObservabilityEvent()` and `appendObservabilityEvent()`
- Five existing producers wired to normalize before appending (`fanout-run.cjs`, `deep_research_auto.yaml`, `convergence.cjs`, `round-state-jsonl.cjs`, `status.cjs`)

**Changelog**:
- When this phase closes, refresh `../changelog/` using `156-ux-observability-003`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Each deep-loop producer appends events in a different native format. The fan-out ledger, single-loop telemetry, convergence events, and council round-state share no canonical schema or append path. Building a cross-mode dashboard or alert requires bespoke parsers per producer, and each new producer adds another bespoke format.

### Purpose
Create a canonical `observability-events.cjs` module with `normalizeObservabilityEvent()` and `appendObservabilityEvent()` — a shared envelope (`schema_version`, `event_id`, `producer`, `stream`, `subject`, `event`, `status`, `payload`) — so producers pass their native payload through the normalizer and dashboards index one normalized stream. Producers retain their internal payload format; the envelope adds indexable metadata.

> **Reference**: `external/kasper/src/logging.ts:4,27,33`; `external/loop-cli-main/src/types.ts:46,50,85` — `appendObservabilityEvent()` wraps native payloads in a typed envelope with `schema_version` and `producer` fields before appending; the unified type is the sole persistence contract for the reader. (Research: research.md §5.5, iter 49)
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- New `observability-events.cjs` with `normalizeObservabilityEvent(payload, meta)` → envelope; `appendObservabilityEvent(path, payload, meta)` → normalize + append
- Envelope fields: `schema_version`, `event_id` (UUID v4), `producer`, `stream`, `subject`, `event`, `status`, `payload` (native)
- Wire into five producers: `fanout-run.cjs`, `deep_research_auto.yaml`, `convergence.cjs`, `round-state-jsonl.cjs`, `status.cjs`
- Legacy JSONL files remain valid — additive only; no migration of existing records
- Unit test for `normalizeObservabilityEvent` with a known native payload

### Out of Scope
- Unified reader over all event streams — tagged as the deep variant (unified reader = deep-rewrite); only producer-side envelope is in scope
- Migration of existing JSONL records to the new format — additive only; old records remain as-is
- Council fan-out event wiring (lower priority; five core producers are sufficient for this leaf)

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/observability-events.cjs` | Create | Canonical envelope module: `normalizeObservabilityEvent` + `appendObservabilityEvent` |
| `.opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs` | Modify | Normalize fan-out events through envelope before appending |
| `.opencode/commands/deep/assets/deep_research_auto.yaml` | Modify | Use `appendObservabilityEvent` in telemetry heartbeat steps |
| `.opencode/skills/deep-loop-runtime/scripts/convergence.cjs` | Modify | Normalize convergence events through envelope |
| `.opencode/skills/deep-loop-runtime/lib/deep-loop/round-state-jsonl.cjs` | Modify | Normalize round-state events through envelope |
| `.opencode/skills/deep-loop-runtime/scripts/status.cjs` | Modify | Normalize status events through envelope |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `normalizeObservabilityEvent()` produces a valid envelope with all required fields for any producer's native payload | Unit test: call with a fan-out native payload → assert `schema_version`, `event_id`, `producer`, `stream`, `subject`, `event`, `status`, `payload` all present |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | Existing fan-out consumer reads envelope-wrapped rows without error | Integration test: write an envelope-wrapped row → existing consumer parses `payload` field successfully |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A fan-out run with the wired producers writes envelope-wrapped JSONL rows parseable by a shared schema validator
- **SC-002**: `validate.sh --strict` on this folder exits 0
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Existing strict-JSON consumers break when rows gain envelope fields | Medium — additive fields may conflict with fixed-schema parsers | Envelope is a wrapper; native payload preserved inside `payload` field; consumers reading `payload` see unchanged data |
| Risk | UUID generation (`crypto.randomUUID()`) unavailable in older Node versions | Low — Node 16+ required | Check Node version at module load; throw if < 16 |

> **Deep-variant note**: Unified reader over all event streams is the deep variant (requires cross-stream schema migration). This leaf is producer-side only, additive. (Research: research.md §5.5, iter 49)
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should envelope rows append to the existing JSONL file path (alongside non-envelope rows) or to a new `observability-events.jsonl` sidecar file?
- Is `schema_version` a semantic-version string (e.g., `"1.0.0"`) or a monotonic integer?
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->

<!-- SCAFFOLD_VALIDATION_COUNTS:
REQ-003
REQ-004
REQ-005
REQ-006
REQ-007
REQ-008
**Given**
**Given**
**Given**
**Given**
**Given**
**Given**
-->
