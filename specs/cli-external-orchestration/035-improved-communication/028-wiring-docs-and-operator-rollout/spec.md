---
title: "Feature Specification: Phase 028 Wiring Docs and Operator Rollout"
description: "Plan the closing operator documentation for the wired projection: an enablement guide covering the environment variable, the git-ignored local override, and per-runtime setup; a rollout runbook for staged enablement with capability and privacy prerequisites and evaluation-gate reading; and a rollback path covering flag disable, original-only emergency mode, plugin uninstall, and stopping the wrappers."
trigger_phrases:
  - "wiring-docs-and-operator-rollout"
  - "operator enablement guide"
  - "projection rollout runbook"
  - "wired projection rollback"
  - "per-runtime setup docs"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/028-wiring-docs-and-operator-rollout"
    last_updated_at: "2026-08-14T08:58:00.000Z"
    last_updated_by: "claude"
    recent_action: "Closed the phase with the operator references authored and validated."
    next_safe_action: "Hand the parent packet its closing-phase handoff for the parent-packet decision."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-028-wiring-docs-rollout-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Phase purpose, boundary, dependencies, and acceptance are defined."
      - "The closing phase delivers operator documentation, not runtime code: the enablement sources and the per-runtime seams already exist from Phases 016, 019, and 020 through 025."
      - "The enablement guide, rollout runbook, and rollback path are authored, every authored operator doc passes the reference validator, and the phase passes strict validation."
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Phase 028 Wiring Docs and Operator Rollout

<!-- SPECKIT_LEVEL: 2 -->

---

## EXECUTIVE SUMMARY

This closing phase turns the wired projection into a safe operator story: one enablement guide, one rollout runbook, and one rollback path. The enablement guide documents the `COMMUNICATION_PROJECTION_ENABLED` environment variable and the git-ignored `enablement.local.json` override, plus per-runtime setup covering the OpenCode plugin and each wrapper runtime. The rollout runbook stages enablement behind capability and privacy prerequisites and teaches operators to read the evaluation gate before enabling a runtime. The rollback path covers disabling the flag, original-only emergency mode, uninstalling the plugin, and stopping wrapper use. Every authored doc follows the sk-doc reference standard so `validate_document.py --type reference` passes.

**Key decision**: the three operator surfaces (enablement, rollout, rollback) are authored against the already-wired seams from Phases 016, 019, and 020 through 025, and they consume the Phase 027 evaluation gate rather than inventing new runtime code.

**Critical dependency**: the full wiring from Phases 019 through 027, headed by the Phase 027 evaluation and release gate. This phase changes operator documentation only.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-14 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 28 of 28 |
| **Predecessor** | `027-evaluation-and-release-gate` |
| **Successor** | Parent packet decision |
| **Handoff Criteria** | A fresh operator can enable, verify, and roll back projection for each runtime using only the enablement guide, rollout runbook, and rollback path; every authored operator doc passes `validate_document.py --type reference` with zero issues; and this phase passes strict validation with zero errors and warnings. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This planned phase delivers the operator-facing surface that closes the wired projection. Every runtime already has a projection seam from Phases 016, 019, and 020 through 025, and the Phase 027 evaluation and release gate fixes the readiness evidence. This phase documents how an operator turns the wired projection on safely, per runtime, and how to turn it off completely.

**Scope boundary**: Author operator documentation only. The plugin, the wrappers, the enablement gate, and the evaluation gate are consumed, never modified. This packet does not build runtime wiring or change canonical output behavior.

**Dependencies**:

- Phase 027 evaluation and release gate (predecessor), which supplies the gate the rollout runbook teaches operators to read
- The enablement sources from Phase 016: `COMMUNICATION_PROJECTION_ENABLED` and the git-ignored `enablement.local.json`
- The Phase 019 OpenCode plugin and the Phase 020 CLI-output wrapper with its per-runtime wrappers (Phases 021 through 025)
- The Phase 014 operator-reference set and the sk-doc reference standard with `validate_document.py --type reference`

**Deliverables**:

- An enablement guide covering the env var, the git-ignored local override, precedence, and per-runtime setup
- A rollout runbook covering staged enablement, capability and privacy prerequisites, and evaluation-gate reading
- A rollback path covering flag disable, original-only emergency mode, plugin uninstall, and stopping wrapper use
- Reference-standard conformance for every authored operator doc
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

- Projection is now wired across six runtimes, but the operator has no single, current source of truth for turning it on safely, so the enablement choices and per-runtime launch commands are scattered across Phases 016, 019, and 020 through 025.
- A fresh operator cannot tell whether a runtime is safe to enable, because the capability and privacy prerequisites and the evaluation-gate reading rule are not assembled into one rollout runbook.
- Turning projection back off after enabling it has no consolidated procedure, so disabling the flag, original-only emergency mode, plugin uninstall, and stopping wrapper use risk being done incompletely. [SOURCE: Phase 016 enablement gate and the Phase 014 operator-reference set]

### Purpose

Make the wired projection operable by any fresh operator using only the documentation: enable with an env var or a private local override, launch each runtime through its documented seam, verify against the evaluation gate, and roll back through a complete original-only path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- An enablement guide documenting `COMMUNICATION_PROJECTION_ENABLED`, the git-ignored `enablement.local.json` override, their precedence with the variable winning, and the per-machine privacy boundary.
- Per-runtime setup in the guide: installing the Phase 019 OpenCode plugin and launching each Phase 020-025 wrapper runtime (Claude Code, Codex, Pi, Devin, Cursor).
- A rollout runbook defining staged enablement, the capability and privacy prerequisites, and how to read the evaluation gate before enabling a runtime.
- A rollback path covering disabling the flag, `OriginalOnlyEmergencyMode`, uninstalling the plugin, and stopping wrapper use.
- Reference-standard conformance: every authored operator doc passes `validate_document.py --type reference` with zero issues.

### Out of Scope

- Any change to runtime source, the plugin, the wrappers, the enablement gate, or the evaluation gate, which are consumed, never modified.
- Building new runtime wiring, which belongs to Phases 019 through 027.
- Rewriting canonical transcripts, events, tool inputs, or tool results.
- Documentation for features not yet wired at the closing phase.

### Technical Approach

Author three operator references against the wired seams, extending the Phase 014 operator-reference set under the sk-doc reference standard, so a fresh operator can enable, verify, and roll back each runtime without reading phase packets.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-communication/cli-communication-projection/docs/enablement.md` | Create | Enablement guide: env var, git-ignored local override, precedence, and per-runtime setup |
| `.opencode/skills/sk-communication/cli-communication-projection/docs/runbook.md` | Modify | Rollout runbook: staged enablement, capability/privacy prerequisites, and evaluation-gate reading |
| `.opencode/skills/sk-communication/cli-communication-projection/docs/rollback.md` | Modify | Rollback path: flag disable, original-only emergency mode, plugin uninstall, and stopping wrappers |
| `028-wiring-docs-and-operator-rollout/` | Create | Record the planned Level-2 packet |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Document the enablement sources. | The enablement guide covers `COMMUNICATION_PROJECTION_ENABLED` and the git-ignored `enablement.local.json`, their precedence with the variable winning, and the per-machine privacy boundary. |
| REQ-002 | Document per-runtime setup. | The guide covers installing the Phase 019 OpenCode plugin and launching each wrapper runtime (Claude Code, Codex, Pi, Devin, Cursor) through the Phase 020 wrapper and per-runtime seams. |
| REQ-003 | Define staged enablement. | The rollout runbook defines the enablement stages, their order, and the per-runtime verification step at each stage. |
| REQ-004 | State the capability and privacy prerequisites. | The runbook lists the Phase 005 capability and privacy prerequisites and how to confirm them before enabling a runtime. |
| REQ-005 | Explain how to read the evaluation gate. | The runbook explains how to read the Phase 007 and Phase 027 evaluation-gate output before enabling a runtime and when to stay on original-only. |
| REQ-006 | Document the rollback path. | The rollback path covers disabling the flag, `OriginalOnlyEmergencyMode`, uninstalling the plugin, and stopping wrapper use, with no canonical transcript change. |
| REQ-007 | Pass the reference validator. | Every authored operator doc passes `validate_document.py --type reference` with zero issues. |
| REQ-008 | Prove fresh-operator success. | A fresh operator can enable, verify, and roll back projection for each runtime using only the docs. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-009 | Keep canonical bytes unchanged. | The docs state that projection never changes canonical transcripts, events, tool inputs, or tool results. |
| REQ-010 | Keep the docs current with the wired seams. | Doc commands and paths match the plugin path, the wrapper entrypoints, and the enablement names from Phases 016 and 019 through 025. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The enablement guide documents both opt-in sources, their precedence, and the private per-machine boundary.
- **SC-002**: The guide covers installing the OpenCode plugin and launching each of the five wrapper runtimes.
- **SC-003**: The rollout runbook defines staged enablement, the capability and privacy prerequisites, and the evaluation-gate reading rule.
- **SC-004**: The rollback path covers flag disable, `OriginalOnlyEmergencyMode`, plugin uninstall, and stopping wrapper use.
- **SC-005**: Every authored operator doc passes `validate_document.py --type reference` with zero issues.
- **SC-006**: A fresh operator can enable, verify, and roll back projection for each runtime using only the docs.

### Acceptance Scenarios

1. **Given** the enablement guide, **When** an operator reads it, **Then** they can set `COMMUNICATION_PROJECTION_ENABLED` or write `enablement.local.json` and confirm the variable wins.
2. **Given** the per-runtime setup, **When** an operator enables a runtime, **Then** they install the OpenCode plugin or launch the wrapper and observe projected output.
3. **Given** the rollout runbook, **When** an operator stages enablement, **Then** they confirm the capability and privacy prerequisites and read the evaluation gate before enabling each runtime.
4. **Given** the rollback path, **When** an operator disables projection, **Then** the flag returns original-only behavior and the plugin and wrappers can be fully removed.
5. **Given** the authored operator docs, **When** the reference validator runs, **Then** `validate_document.py --type reference` exits with zero issues.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Wiring from Phases 019 through 027 | High | This phase is blocked until every runtime seam and the evaluation gate land; the docs consume them, never rebuild them. |
| Dependency | Phase 027 evaluation and release gate | High | The rollout runbook cannot teach evaluation-gate reading until the gate exists. |
| Risk | Docs drift from the wired seams | High | Author against the actual plugin path, wrapper entrypoints, and flag names, then gate with the reference validator. |
| Risk | A fresh operator enables a runtime before it is safe | High | The runbook stages enablement behind the capability, privacy, and evaluation-gate prerequisites. |
| Risk | Rollback is done incompletely | High | The rollback path names every step: flag disable, original-only emergency mode, plugin uninstall, and stopping wrappers. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: The docs are static references; following them adds no runtime latency.
- **NFR-P02**: Every enable, verify, and rollback step is local and synchronous with no network access.

### Security and Privacy

- **NFR-S01**: Capability and privacy prerequisites gate any hosted projection, matching the Phase 005 and Phase 017 policy.
- **NFR-S02**: The docs and packet contain no credentials, message content, or protected spans, and the per-machine opt-in boundary is explicit.

### Reliability

- **NFR-R01**: Original-only behavior on flag disable is deterministic and documented for every runtime.
- **NFR-R02**: Rollback is complete and reversible: disable the flag, select `OriginalOnlyEmergencyMode`, uninstall the plugin, and stop using the wrappers.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- The env var and local override disagree: the variable wins, as documented in the guide.
- A runtime is enabled before its evaluation gate is green: the runbook keeps it on original-only until the gate passes.
- The plugin is installed with the flag off: it no-ops and renders the byte-exact original.
- A wrapper is launched with projection off: it renders the byte-exact original.
- Rollback while another runtime stays enabled: the flag, plugin, and wrapper steps are per-runtime and independently reversible.
- A later phase changes a seam: the reference validator and the operator-reference set catch doc drift.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 15/25 | Three operator references covering six runtimes |
| Risk | 14/25 | Original-only guarantees and evaluation-gate ordering |
| Research | 10/20 | Confirming the per-runtime launch commands and the evaluation-gate reading rule |
| **Total** | **39/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

No unresolved question blocks planning. The exact spellings of the wrapper launch commands and the evaluation-gate report fields are recorded as versioned doc inputs at authoring time, not open design questions.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Parent Packet**: `../spec.md`
