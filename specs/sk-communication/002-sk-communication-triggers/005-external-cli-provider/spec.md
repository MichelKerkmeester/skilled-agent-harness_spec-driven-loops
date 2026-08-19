---
title: "Feature Specification: Phase 5: external-cli provider"
description: "A first-class external-cli provider family routes the cli-* engine path through the package's real privacy and fidelity pipeline: a new provider family, adapter, preset, and an injected child-process transport, all deterministically tested, so the /rewrite-response-by-external-agent cli-* path has tested package code instead of pure command-level orchestration."
trigger_phrases:
  - "external-cli provider"
  - "cli provider family"
  - "external agent projection provider"
  - "cli transport"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-communication/002-sk-communication-triggers/005-external-cli-provider"
    last_updated_at: "2026-08-19T07:35:00.000Z"
    last_updated_by: "claude"
    recent_action: "Landed external-cli provider; gate green"
    next_safe_action: "Reconcile parent metadata and validate"
    blockers: []
    key_files:
      - ".opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts"
      - ".opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-005-external-cli-provider"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Operator approved building the first-class external-cli provider (option B)."
      - "The engine selector lives in providerId; the endpoint is a non-resolving .invalid sentinel because validation requires an http/https URL and no HTTP egress happens."
      - "External agents route as hosted-retained; the subprocess boundary is injected so dispatch is deterministically tested."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 5: external-cli provider

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-19 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | ../spec.md |
| **Phase** | 5 of 5 |
| **Predecessor** | 004-skill-and-mirrors |
| **Successor** | 006-external-cli-runtime-wiring |
| **Handoff Criteria** | The external-cli provider builds, `npm run check` is green, the sk-code drift-guard packet delta is clean, the catalog and playbook reference the new adapter code, and every touched folder validates `--strict` with zero errors. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 5** of the sk-communication trigger commands packet.

**Scope Boundary**: This phase adds a first-class provider family to the shipped projection package so the `/rewrite-response-by-external-agent` cli-* engine path runs through the package's real privacy and fidelity pipeline. It changes provider wiring only; it never changes the default-off gate, the default transport, or the live wrapper path.

**Dependencies**:
- Phase 003 shipped command 2 as command-level orchestration and recorded the first-class provider as a deferred hardening.
- The provider contract, executor, privacy router, and fidelity validator are the surfaces this phase plugs into unchanged.

**Deliverables**:
- A new `external-cli` provider family, adapter case, and evidence-backed preset.
- A new injected child-process transport (`createExternalCliTransport` plus a generic runner) under `src/transports/`.
- Deterministic tests for the adapter, preset, privacy routing, transport seam, and fail-closed fallback.
- A feature-catalog entry and a manual-testing-playbook scenario that reference the new adapter code and its tests.

**Changelog**:
- On phase close, refresh the matching parent changelog entry.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Command 2's cli-* engine path is pure command-level orchestration. It dispatches to an external CLI agent by prompt, so the rewrite never passes through the package's privacy routing, protected-span fidelity, or exact-original fallback. There is no tested package code behind the cli-* path, and no provider record describes the external-agent privacy boundary.

### Purpose
Add an `external-cli` provider family so the cli-* path becomes a first-class provider inside the projection pipeline. A provider record describes the external agent (hosted, retained, honest privacy facts), an adapter compiles the copy-editing request, and a transport dispatches to the chosen CLI binary through an injected subprocess boundary, returning the rewrite for the same fidelity validation and exact-original fallback every other provider gets. The subprocess boundary is injected, so the whole path is deterministically tested without a live CLI.

The invariants this phase preserves:

```text
default-off gate           ──> unchanged; the provider is inert unless explicitly selected
default provider transport ──> unchanged; the CLI transport is opt-in per call
live wrapper path          ──> unchanged; external-cli is a one-shot projection provider only
canonical bytes            ──> unchanged; any non-accept terminal returns the exact original
```
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A new `EXTERNAL_CLI` value in `ProviderFamilies`, its adapter case, and its registry family/protocol compatibility clause.
- `createExternalCliModelRecord` preset producing a valid, routable hosted-retained provider record for a chosen engine and model.
- A new `src/transports/cli.ts`: `createExternalCliTransport` (pipeline seam) plus `createChildProcessCliRunner` (generic subprocess runner with an injected spawn boundary) and an engine-command table.
- Public exports for the new preset and transport through the existing barrels.
- Deterministic tests covering the adapter, preset validity, privacy routing, transport seam, generic runner argv/timeout/stdout handling, engine resolution, and fail-closed fallback.
- A feature-catalog entry and a manual-testing-playbook scenario referencing the new adapter code and tests.

### Out of Scope
- Any change to the default-off enablement gate, the default provider transport, or the live wrapper path.
- Changing command 2's authored `.md` beyond, at most, a pointer to the new provider path (the command stays engine-agnostic orchestration; wiring the provider into the command runtime is a later step if requested).
- Verifying dispatch against a live, installed CLI binary; the runner's real-spawn path is exercised through an injected boundary, and per-engine command specs are operator-verifiable.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/cli-communication-projection/src/providers/types.ts` | Modify | Add the `EXTERNAL_CLI` family. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/providers/adapters.ts` | Modify | Add the external-cli adapter and switch case. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/providers/registry.ts` | Modify | Add the family/protocol compatibility clause. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/providers/presets.ts` | Modify | Add `createExternalCliModelRecord`. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/providers/index.ts` | Modify | Export the new preset and options type. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/transports/cli.ts` | Create | The external-cli transport, generic runner, and engine table. |
| `.opencode/skills/sk-communication/cli-communication-projection/src/transports/index.ts` | Modify | Export the new transport API. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/transports/cli.test.ts` | Create | Transport and runner tests. |
| `.opencode/skills/sk-communication/cli-communication-projection/test/providers/external-cli.test.ts` | Create | Preset, routing, and end-to-end provider tests. |
| `.opencode/skills/sk-communication/feature-catalog/provider-and-privacy/external-cli-provider.md` | Create | Feature-catalog entry. |
| `.opencode/skills/sk-communication/feature-catalog/feature-catalog.md` | Modify | Register the entry in the index. |
| `.opencode/skills/sk-communication/manual-testing-playbook/fidelity-and-privacy/external-cli-provider-fallback.md` | Create | Playbook scenario. |
| `.opencode/skills/sk-communication/manual-testing-playbook/manual-testing-playbook.md` | Modify | Register the scenario in the index. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The external-cli provider record validates and routes. | `validateProviderModelRecord` succeeds and `selectPrivacyRoute` approves it under a hosted-retained, egress-consented policy. |
| REQ-002 | The cli-* rewrite flows through the real pipeline. | `executeProviderRoute` with the CLI transport returns a candidate that passes fidelity validation; a failed or empty CLI result returns the exact original. |
| REQ-003 | The default-off gate and default transport are unchanged. | No edit touches `config/enablement.ts` or the default-transport selection in `runtime/project-message.ts`; the provider is inert unless explicitly selected. |
| REQ-004 | The subprocess boundary is injected and deterministically tested. | The transport and runner accept an injected runner/spawn double, and tests assert argv, timeout, stdout capture, and fail-closed behavior without a live CLI. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The package gate stays green. | `npm run check` (typecheck, build, test, import smoke) exits 0. |
| REQ-006 | The change aligns with sk-code-opencode standards. | The sk-code drift guards report a clean packet-scoped delta against the frozen baseline. |
| REQ-007 | The catalog and playbook reference the new adapter code. | The new feature-catalog entry and playbook scenario list the source and test files and are registered in their indexes. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `createExternalCliModelRecord` yields a record that validates and routes under an egress-consented hosted-retained policy.
- **SC-002**: An end-to-end projection through the CLI transport returns the rewrite on success and the exact original on any CLI failure.
- **SC-003**: `npm run check` is green and the sk-code drift-guard packet delta is clean.
- **SC-004**: The feature-catalog entry and playbook scenario reference the new adapter code and its tests and are registered in their indexes.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A new family breaks an exhaustive switch or validator | High | The `getProviderAdapter` switch and the registry compatibility clause are updated in the same change; the compiler enforces switch completeness. |
| Risk | The provider becomes active by default | High | The provider is only selected when a caller passes its record and the CLI transport; the default transport and default-off gate are untouched. |
| Risk | Un-verifiable per-engine dispatch is baked into shipped code | Medium | The subprocess is behind an injected boundary; per-engine command specs are data, marked operator-verifiable, and never claimed as live-verified. |
| Dependency | The existing executor, privacy router, and fidelity validator | Low | The provider plugs into these unchanged; no pipeline stage is re-architected. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Wiring the external-cli provider into command 2's runtime (so the authored `.md` invokes the provider directly) is deferred; this phase delivers the tested package path the command can adopt.
<!-- /ANCHOR:questions -->
