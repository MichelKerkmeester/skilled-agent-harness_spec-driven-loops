---
title: "Feature Specification: Phase 002 — Parent Hub Compatibility Shell"
description: "Completed Level 2 specification for the sk-design parent hub manager shell: context-first intake, visible plan, proof gates, verifier cadence, and transport-vs-taste separation."
trigger_phrases:
  - "parent hub compatibility shell"
  - "sk-design manager shell"
  - "context-first intake"
  - "visible plan"
  - "proof gates"
  - "verifier cadence"
importance_tier: "high"
contextType: "spec"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/sk-design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/"
    last_updated_at: "2026-07-05T22:14:30Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Closed hub shell evidence docs."
    next_safe_action: "Start Phase 003 procedure cards."
---
# Feature Specification: Phase 002 — Parent Hub Compatibility Shell

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-07-05 |
| **Completed** | 2026-07-05 |
| **Phase Folder** | `.opencode/specs/sk-design/009-sk-design-claude-parity/002-parent-hub-compatibility-shell/` |
| **Parent Packet** | `.opencode/specs/sk-design/009-sk-design-claude-parity/` |
| **Writable Scope Used** | `.opencode/skills/sk-design/SKILL.md` plus this Phase 002 folder only |
| **Depends On** | `001-baseline-ownership-gate/` closed; checklist shows 9/9 P0 and 12/12 P1 verified |

<!-- /ANCHOR:metadata -->
---

## Phase Navigation

| Link | Target |
|------|--------|
| **Parent Spec** | ../spec.md |
| **Predecessor Phase** | ../001-baseline-ownership-gate/spec.md |
| **Successor Phase** | ../003-private-procedure-card-layer/spec.md |

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent `sk-design` hub needed the feel of a design manager: context first, visible plan, proof expectations, and verifier cadence before mode handoff. The shell also needed to preserve the existing OpenCode architecture: one public `sk-design` advisor identity, registry-backed routing, five public mode packets, read-only advisory mode tool boundaries, and a clear separation between design judgment and external transport mechanics.

### Purpose
This phase implements that parent-hub shell in `.opencode/skills/sk-design/SKILL.md`. The shell adds manager choreography at the hub boundary while leaving per-mode design logic inside the existing packets and leaving `mode-registry.json` and `hub-router.json` unchanged.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Implement context-first intake in the parent hub before mode routing or transport use.
- Require a visible plan before substantial design, build, implementation handoff, or transport work.
- Add proof-gate language for taste, accessibility, responsive behavior, and requested transport evidence.
- Add verifier-cadence language without creating new hub-local verification logic.
- Preserve the single public `sk-design` advisor identity and the existing five public modes.
- Preserve `mode-registry.json` as the routing source of truth and keep `hub-router.json` unchanged.
- Extend section 7 transport-vs-taste separation so transports never decide design acceptance.
- Update Phase 002 tasks, checklist, decision record, implementation summary, and generated metadata.

### Out of Scope
- Editing `mode-registry.json`, `hub-router.json`, mode packets, `shared/**`, `benchmark/baseline/**`, `manual_testing_playbook/**`, `external/**`, or `research/**`.
- Creating private procedure cards; that belongs to Phase 003.
- Refactoring individual mode packets; that belongs to Phase 004.
- Building parity benchmark release gates; that belongs to Phase 005.
- Adding public micro-skill identities or a public mirror of another design skill family.
- Dispatching sub-agents or nested Task execution.

### Files Changed

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-design/SKILL.md` | Updated | Added manager-style intake, visible-plan, proof-gate, verifier-cadence, negative-control, and transport-vs-taste shell language |
| `spec.md` | Updated | Reconciled scope and requirements with the completed hub shell |
| `plan.md` | Updated | Marked implementation phases and quality gates complete with evidence |
| `tasks.md` | Updated | Checked off all Phase 002 tasks with evidence |
| `checklist.md` | Updated | Marked P0/P1/P2 evidence gates with real evidence |
| `decision-record.md` | Created | Recorded release authority, shell-placement, registry-preservation, and transport-boundary decisions |
| `implementation-summary.md` | Updated | Recorded completed status, files changed, verification evidence, and handoff |
| `description.json` | Regenerated | Discovery metadata for the completed phase packet |
| `graph-metadata.json` | Regenerated | Graph metadata and source hashes for the completed phase packet |

### Compatibility Shell Capabilities

| Capability | Implemented Behavior | Evidence |
|------------|----------------------|----------|
| Context-first intake | Hub gathers goal, surface, inputs, constraints, and proof expectations before selecting a mode or transport | `.opencode/skills/sk-design/SKILL.md` section 2, `Manager Intake Before Routing` |
| Visible plan | Hub requires selected mode/bundle, loaded/missing context, design moves/audit dimensions, proof, and handoff target before substantial work | `.opencode/skills/sk-design/SKILL.md` section 2, `Visible Plan Before Design or Build Work` |
| Proof gates | Hub names taste, accessibility, responsive, and transport proof fields while delegating detailed evidence to selected modes | `.opencode/skills/sk-design/SKILL.md` section 2, `Proof Gates and Verifier Cadence` |
| Verifier cadence | Hub requires intake before routing, visible plan before substantial output, proof review before ready claims, and `sk-code` review/verification after implementation handoff | `.opencode/skills/sk-design/SKILL.md` section 2, `Proof Gates and Verifier Cadence` |
| Transport-vs-taste separation | Section 7 states Figma/Open Design transports execute mechanics only; acceptance returns to selected design/audit mode | `.opencode/skills/sk-design/SKILL.md` section 7, `Transports and Consumers` |
| Public identity preservation | Exactly one `graph-metadata.json` exists under `.opencode/skills/sk-design/` and no mode-packet graph metadata was added | `Glob("**/graph-metadata.json", .opencode/skills/sk-design)` returned only `.opencode/skills/sk-design/graph-metadata.json` |
| Registry preservation | `mode-registry.json` still declares five modes and was not changed by this phase | `git diff -- .opencode/skills/sk-design/mode-registry.json .opencode/skills/sk-design/hub-router.json` returned no output |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Evidence |
|----|-------------|---------------------|
| REQ-001 | Phase 001 gates pass before implementation | Phase 001 `checklist.md` records 9/9 P0, 12/12 P1, and gate status closed; Phase 001 `implementation-summary.md` says Phase 002 implementation is the next safe action |
| REQ-002 | Single public advisor identity preserved | One skill root `graph-metadata.json` found under `.opencode/skills/sk-design/`; no packet graph metadata added |
| REQ-003 | Mode registry remains routing authority | `SKILL.md` still says routing is registry-driven and `git diff` for `mode-registry.json`/`hub-router.json` is empty |
| REQ-004 | Context-first intake defined | `SKILL.md` section 2 defines goal, surface, inputs, constraints, and proof expectations |
| REQ-005 | Visible plan defined | `SKILL.md` section 2 requires a visible plan before substantial design/build/transport work |
| REQ-006 | Proof gates and verifier cadence defined | `SKILL.md` section 2 names proof fields and cadence moments while routing details to mode packets and `sk-code` |
| REQ-007 | Transport and taste remain separated | `SKILL.md` section 7 states transports do not decide design acceptance and conflicts return to selected design/audit mode |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Evidence |
|----|-------------|---------------------|
| REQ-008 | Existing five mode packets remain public surface | `mode-registry.json` still lists interface, foundations, motion, audit, and md-generator |
| REQ-009 | Negative controls documented | `SKILL.md` rules prohibit mode-packet graph metadata, public micro-skill identities, registry bypass, Write/Edit/Bash requirements for read-only modes, and transport-owned taste |
| REQ-010 | Handoff to Phase 003 is explicit | This spec and `implementation-summary.md` hand off private procedure-card detail to Phase 003 only |
| REQ-011 | Verification commands are listed | `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` record benchmark, diff, glob, metadata regeneration, and strict validation commands |
| REQ-012 | Rollback path is non-destructive first | `plan.md` and `implementation-summary.md` name diff/status inspection first and require explicit approval before destructive rollback |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

| Criterion | Result |
|-----------|--------|
| **SC-001** Phase 002 docs and metadata exist and validate as a Level 2 child packet | Complete; final strict validation evidence is recorded in `implementation-summary.md` |
| **SC-002** Implementation waits for Phase 001 closure | Complete; Phase 001 closed before the hub edit was accepted as Phase 002 work |
| **SC-003** Parent shell supports design-manager behavior without public identity proliferation | Complete; shell language lives in the parent hub and no public mode identities were added |
| **SC-004** Mode registry remains the routing source of truth | Complete; registry/router diffs are empty |
| **SC-005** Proof gates and verifier cadence are explicit | Complete; `SKILL.md` names proof fields and cadence moments |
| **SC-006** Transport-vs-taste separation is documented | Complete; section 7 says transports are mechanical and acceptance belongs to selected design/audit mode |

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Final State | Mitigation |
|------|------|-------------|------------|
| Dependency | Phase 001 gate closure | Closed before Phase 002 documentation closure | Phase 001 checklist and implementation summary were read and cited |
| Dependency | Existing `sk-design` registry | Preserved unchanged | Scoped `git diff` for registry/router returned no output |
| Risk | Public skill mirror creep | Blocked | `SKILL.md` NEVER rules prohibit public micro-skill identities and packet graph metadata |
| Risk | Transport owns taste decisions | Blocked | Section 7 makes transports mechanical and routes acceptance back to design/audit modes |
| Risk | Hidden plan or proof omissions | Mitigated | Hub now requires visible plan, proof fields, and cadence before ready claims |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Traceability
- **NFR-T01**: Shell requirements map to Phase 001 invariants and to `SKILL.md` sections 2, 4, 6, and 7.
- **NFR-T02**: Later private procedure-card details are explicitly handed to Phase 003, not embedded in the hub.

### Maintainability
- **NFR-M01**: The hub remains routing/manager choreography only; per-mode logic stays in existing mode packets.
- **NFR-M02**: Negative rules are visible in the parent hub ALWAYS/NEVER section.

### Safety
- **NFR-S01**: No registry, router, mode packet, `shared/**`, baseline, external, or research file was edited by Phase 002.
- **NFR-S02**: Rollback requires non-destructive diff/status inspection first and explicit approval before destructive recovery.

### Verification
- **NFR-V01**: Strict spec validation is run after metadata regeneration.
- **NFR-V02**: Router benchmark and scoped diffs are recorded as preservation evidence.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- **Phase 001 incomplete**: Not applicable now; Phase 001 is closed and cited as the go signal.
- **Existing registry has unexpected keys**: Not encountered; registry still lists the expected five modes.
- **Transport request includes design judgment**: Resolved by section 7: transport mechanics can be used only after design mode selection, and acceptance returns to selected design/audit mode.

### Error Scenarios
- **Validator fails**: Fix only files in the Phase 002 folder, regenerate metadata, and re-run strict validation.
- **Router baseline unavailable**: Not encountered; benchmark ran and produced `/tmp/skd-bench/report.json`.
- **Public mirror request appears**: Reject it under the parent hub NEVER rules and keep the single `sk-design` identity.

### Concurrent Operations
- **Sibling phase changes exist**: Preserved as unrelated dirty-tree work and not modified by Phase 002.
- **Unrelated worktree changes appear**: Preserve them and keep writes scoped to the allowed paths.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:questions -->
## 9. OPEN QUESTIONS

No open questions remain for Phase 002 closure.

### Resolved Questions and Decisions

| Question | Resolution |
|----------|------------|
| What Phase 001 evidence is accepted as the Phase 002 go signal? | Phase 001 checklist gate status closed with 9/9 P0 and 12/12 P1 verified, plus implementation summary next safe action naming Phase 002. |
| Which router/registry command proves routing preservation? | Canonical benchmark command from `benchmark/README.md`, plus scoped `git diff` proving `mode-registry.json` and `hub-router.json` unchanged. |
| Which verifier cadence blocks ready claims? | Intake before routing, visible plan before substantial output, proof review before ready claims, and `sk-code` review/verification after implementation handoff. |
| Who owns release/threshold decisions for this autonomous run? | Repository owner, delegated to this session, as provided in the task grounding facts. |

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Parent Packet**: `../spec.md`
- **Predecessor Gate**: `../001-baseline-ownership-gate/`
- **Implementation Plan**: `plan.md`
- **Task Breakdown**: `tasks.md`
- **Verification Checklist**: `checklist.md`
- **Decision Record**: `decision-record.md`
- **Implementation Summary**: `implementation-summary.md`

<!-- /ANCHOR:related-docs -->
