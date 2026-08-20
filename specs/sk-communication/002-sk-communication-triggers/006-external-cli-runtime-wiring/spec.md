---
title: "Feature Specification: Phase 6: external-cli runtime wiring"
description: "A runnable entrypoint drives the external-cli provider end-to-end through projectMessage, a verified per-engine command table maps the six cli-* skills to their dispatch argv, and command 2's Branch B adopts the entrypoint so the cli-* path runs through the package's privacy, fidelity, and exact-original guarantees."
trigger_phrases:
  - "external-cli runtime wiring"
  - "external-cli entrypoint"
  - "per-engine cli command table"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/006-external-cli-runtime-wiring"
    last_updated_at: "2026-08-19T20:34:00.000Z"
    last_updated_by: "claude"
    recent_action: "Authored phase 006 spec"
    next_safe_action: "Author plan and tasks, then implement the entrypoint and engine table"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/bin/external-cli-project.mjs"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/runtime/external-cli-projection.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli-engines.ts"
      - ".opencode/commands/rewrite-response-by-external-agent.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-external-cli-runtime-wiring"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The entrypoint drives projectMessage directly so the full route/execute/validate/render tail is reused with no divergence."
      - "The per-engine argv is sourced from each cli-* skill's SKILL.md; it is documentation-verified, not live-verified, because no CLI binaries are installed here."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 6: external-cli runtime wiring

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 6 of 7 |
| **Predecessor** | 005-external-cli-provider |
| **Successor** | 007-command-namespace-rename |
| **Handoff Criteria** | A runnable entrypoint drives the external-cli provider through `projectMessage`, the per-engine command table resolves all six cli-* engines, command 2's Branch B invokes the entrypoint, and the package gate is green. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 6** of the sk-communication trigger commands packet.

**Scope Boundary**: The runnable adoption of the phase-005 provider. Phase 005 shipped the external-cli family, transport, and tests; this phase adds the runnable entrypoint, the verified per-engine command table, and the command 2 Branch B adoption. No default-off gate, default transport, or existing wrapper behavior changes.

**Dependencies**:
- Phase 005 shipped `createExternalCliModelRecord`, `createExternalCliTransport`, and `createChildProcessCliRunner`.
- The package's `projectMessage` orchestrator runs the frozen route/execute/validate/render stage order.

**Deliverables**:
- A per-engine `CliCommandResolver` for the six cli-* skills.
- A tested projection module that assembles the projectMessage inputs for the external-cli case.
- A runnable `bin/` entrypoint that reads a target message and prints the projection or the exact original.
- Command 2's Branch B rewritten to invoke the entrypoint.

**Changelog**:
- On phase close, refresh the matching parent changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 005 delivered the external-cli provider as a tested package path, but command 2's Branch B still dispatches to a cli-* skill ad-hoc. That ad-hoc path bypasses the package's privacy routing, fidelity validation, and exact-original fallback, so a cli-* rewrite is displayed without the guarantees the projection layer exists to enforce.

### Purpose
Ship a runnable entrypoint that drives the external-cli provider through `projectMessage` and rewrite command 2's Branch B to invoke it, so the cli-* path runs through the same privacy, fidelity, and fallback pipeline as every other engine, while preserving the display-only and default-off invariants.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A per-engine command table mapping the six cli-* skills to their documented non-interactive one-shot dispatch argv.
- A projection module that builds the external-cli `projectMessage` inputs (record, generation, egress-consented policy, CLI transport) and returns the terminal result.
- A runnable `bin/` entrypoint over that module.
- Command 2's Branch B rewritten to invoke the entrypoint.
- Deterministic tests for the engine table and the projection module, driven through the injected spawn and runner boundaries.

### Out of Scope
- Any change to the default-off gate, the default transport, or the existing `cli-output-wrapper` (local) path.
- Live execution against installed CLI binaries; argv is documentation-verified only.
- Shipping credentials or performing authentication; each CLI binary owns its own auth.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.../src/transports/cli-engines.ts` | Create | Per-engine `CliCommandResolver` for the six cli-* skills. |
| `.../src/transports/index.ts` | Modify | Export the engine resolver and its types. |
| `.../src/runtime/external-cli-projection.ts` | Create | Build the projectMessage inputs and run the external-cli projection. |
| `.../src/runtime/index.ts` | Modify | Export the projection function and its types. |
| `.../bin/external-cli-project.mjs` | Create | Runnable entrypoint over the projection module. |
| `.../test/transports/cli-engines.test.ts` | Create | Engine-table argv and unknown-engine coverage. |
| `.../test/runtime/external-cli-projection.test.ts` | Create | End-to-end candidate and fallback coverage. |
| `.opencode/commands/rewrite-response-by-external-agent.md` | Modify | Branch B invokes the entrypoint. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The entrypoint routes the external-cli rewrite through the package pipeline. | `runExternalCliProjection` calls `projectMessage`; a successful injected runner yields a projection and a failing or denied one yields the exact original. |
| REQ-002 | The cli-* path honors hosted-retained egress consent. | The projection policy is hosted-retained with egress consent; without consent the route is denied and the exact original is returned. |
| REQ-003 | The default-off invariant is preserved. | The entrypoint sets no global state; projection runs only while `COMMUNICATION_PROJECTION_ENABLED=1` is scoped to the child process. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | The per-engine command table resolves all six cli-* engines. | `resolveCliEngineCommand` returns a `CliCommandSpec` for each of the six engines and null for an unknown engine. |
| REQ-005 | Command 2's Branch B invokes the entrypoint. | The Branch B steps call `bin/external-cli-project.mjs` and handle its projection and exact-original terminals in the status contract. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run check` (typecheck, build, test, import smoke) exits 0 with the new tests included.
- **SC-002**: The engine table resolves all six cli-* engines and rejects an unknown engine.
- **SC-003**: The external-cli projection returns a projection on a successful injected runner and the exact original on any failure or denied route.
- **SC-004**: Command 2's Branch B invokes the entrypoint and preserves the display-only and default-off invariants.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Per-engine argv is not live-verified | Medium | Each engine's argv is sourced from its SKILL.md and documented as documentation-verified; the table is injected data a caller can override. |
| Risk | The entrypoint reimplements the projection tail and diverges | High | The entrypoint calls `projectMessage`; the route/execute/validate/render tail is reused, not reimplemented. |
| Dependency | The phase-005 provider, transport, and runner | Low | Shipped and green. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. The argv table is documentation-verified by operator acceptance; live verification requires installed, authenticated CLI binaries and is out of scope here.
<!-- /ANCHOR:questions -->
