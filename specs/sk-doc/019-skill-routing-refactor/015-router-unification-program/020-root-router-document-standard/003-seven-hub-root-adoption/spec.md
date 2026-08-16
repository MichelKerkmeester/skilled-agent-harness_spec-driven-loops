---
title: "Feature Specification: Seven-Hub Root Adoption"
description: "Define and freeze serial active root ROUTER.md adoption across seven class-H hubs: fixed order, byte preservation except adjudicated sk-code root-location and sk-prompt stale-leaf repairs, fallback preservation, gated legacy deletion, and a live-residue handoff gate."
trigger_phrases:
  - "seven hub root adoption"
  - "root router serial migration"
  - "hub adoption checkpoint"
  - "legacy router deletion gate"
  - "root router residue scan"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/003-seven-hub-root-adoption"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Adopted root ROUTER.md across all seven hubs; all checkpoints closed."
    next_safe_action: "Phase 004 proves parity, refreshes manifests, and closes the program."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Seven-Hub Root Adoption

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 003 migrates the six class-H hubs that still serve their second-stage router from `shared/references/smart-routing.md` to a root `ROUTER.md` with `router_state: active`, then verifies the mcp-tooling pilot root idempotently, in one fixed serial order: mcp-tooling golden check, cli-external-orchestration, sk-design, sk-prompt, sk-doc, system-deep-loop, and sk-code last. Four migrations preserve the machine block byte-for-byte; sk-prompt replaces one deleted leaf with its live generic patterns reference, and sk-code applies the approved root-location/shared-control repair. Every checkpoint preserves zero-signal fallback semantics, regenerates derived metadata only through owner tooling, adds a version/changelog entry, deletes the legacy file only after its validator, doctor, package, replay/benchmark, and canary gates pass, and closes with zero live legacy references.

**Key Decisions**: serial adoption with mcp-tooling first and sk-code last; four byte-equal moves plus bounded sk-prompt and sk-code repairs; literal-legacy stage-one repoints only for cli-external-orchestration, sk-design, and system-deep-loop; gated legacy deletion; advisor index rebuild only after files are final.

**Critical Dependencies**: ratified Phase 001 contract and frozen fleet matrix, Phase 002 validator/doctor/package fixtures, the frozen replay and scorer trio, per-hub canary owners, owner-tool metadata generators, hub changelogs, and a clean scoped Git baseline in the isolated 010 worktree.
<!-- /ANCHOR:executive-summary -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-15 |
| **Ratified** | 2026-08-16 |
| **Worktree** | `.worktrees/010-root-router-document-standard` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `../002-create-skill-template-and-validator-alignment/spec.md` |
| **Successor** | `../004-parity-regression-and-closeout/spec.md` |
| **Execution Boundary** | During execution: seven live hub surfaces plus this child folder. This authoring pass: writes only inside this child folder. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Six class-H hubs still load their stage-two router from `shared/references/smart-routing.md`, while mcp-tooling already serves a root `ROUTER.md`. The frozen Phase 001 contract makes root `ROUTER.md` mandatory and `active` for all seven hubs, but no hub has been migrated yet. A naive fleet-wide move would risk machine-policy drift, broken relative links, changed zero-signal fallbacks, stale derived metadata, unversioned changelogs, and legacy files outliving their replacements.

### Purpose

Adopt root `ROUTER.md` across all seven canonical hubs serially with per-hub receipts, preserving machine bytes, map semantics, defaults, versions, and historical files, and proving before handoff that exactly seven active root routers exist and zero live legacy files remain.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Execute the fixed serial checkpoint order: mcp-tooling golden/idempotent verification, then cli-external-orchestration, sk-design, sk-prompt, sk-doc, system-deep-loop, and sk-code last.
- Move six live `shared/references/smart-routing.md` files to root `ROUTER.md` with `router_state: active`; preserve four machine blocks byte-for-byte, apply only the recorded sk-prompt stale-leaf replacement and sk-code root-location/shared-control repair, and keep mcp-tooling idempotent.
- Rebase document-relative links and provenance for the root location without changing map semantics outside the two recorded routing-specific repairs.
- Update each hub's root `SKILL.md` two-stage pointer, layout, rules, references, README, graph key-file/path references, and other live source docs.
- Repoint literal legacy `defaultResource` entries to `ROUTER.md` only for cli-external-orchestration, sk-design, and system-deep-loop; preserve all other fallback behavior.
- Regenerate derived leaf metadata through owner tooling and inspect the exact delta.
- Add per-hub release/version alignment and a new changelog entry; keep historical entries untouched.
- Run the root-router validator, parent doctor, package gate, replay/benchmark checks, and hub canary per hub with child-local receipts.
- Delete each legacy file only after its hub's gates pass, then rescan live sources excluding immutable history.
- Prove the 003 to 004 handoff: seven checkpoint receipts, old/new map adjudication, zero live legacy files, strict validation exit 0.

### Out of Scope

- Reopening the ratified two-state contract or the frozen seven-hub matrix from Phase 001.
- Editing frozen `router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`, or their protected digests.
- Changing `mode-registry.json` or `hub-router.json` beyond the literal-legacy `defaultResource` repoints approved in Phase 001.
- Adding `ROUTER.md` to any typed leaf set or `leaf-manifest.json` pair.
- Editing system-skill-advisor runtime, scorer, or indexing code; index rebuild/validation happens only after hub files are final.
- Rewriting historical changelogs, benchmark reports, or archived packets.
- Rebuilding rollout artifacts, refreshing or promoting manifests, or finalizing rollback closures; Phase 004 owns those actions.

### Files to Change

| Path | Change Type | Description |
|------|-------------|-------------|
| `spec.md` | Modify | Normative Phase 003 adoption contract, checkpoint order, and gate matrices |
| `plan.md` | Modify | Serial checkpoint procedure, commands, milestones, and rollback |
| `tasks.md` | Modify | Receipt-backed per-hub task ledger |
| `checklist.md` | Create | P0/P1/P2 handoff gates for all seven checkpoints |
| `decision-record.md` | Create | Proposed adoption decisions for ratification |
| `implementation-summary.md` | Modify | Completed delivery state (receipt-backed) |
| `description.json` | Create | Level and discovery metadata |
| `graph-metadata.json` | Regenerate | Completed graph metadata with source hashes |
| `scratch/checkpoints/**` | Create during execution | Per-hub receipts: before/after hashes, gates, residue scans |
| Live hub surfaces (execution only) | Modify during execution | Root `ROUTER.md`, legacy deletion, `SKILL.md`/README/live docs, `hub-router.json` repoints, derived metadata, changelogs |

Authoring-pass paths are relative to this child folder. Live hub packages are migration targets during execution, not writable during this authoring pass.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Fix the serial checkpoint order. | Exactly seven checkpoints run in order: mcp-tooling golden, cli-external-orchestration, sk-design, sk-prompt, sk-doc, system-deep-loop, sk-code. No hub starts before its predecessor's checkpoint receipt passes. |
| REQ-002 | Reach exactly seven active root routers. | At exit, every canonical hub has root `ROUTER.md` with `router_state: active`; zero live legacy router files remain. |
| REQ-003 | Preserve policy bytes except adjudicated repairs. | cli-external-orchestration, sk-design, sk-doc, and system-deep-loop inner machine fences are byte-identical; mcp-tooling is unchanged. sk-prompt replaces only its deleted design-pattern leaf with `patterns-evaluation.md`. sk-code removes the router self-reference, normalizes ten shared paths, and declares eight mapped shared controls. |
| REQ-004 | Rebase links and shared control paths for the root location. | Prose links and provenance are rebased to root-relative targets; sk-code's legacy-file-relative shared resources become explicit contained `shared/...` control paths; every rebased path resolves on disk. |
| REQ-005 | Update root `SKILL.md` and live source docs. | The root `SKILL.md` two-stage pointer, layout, rules, references, README, and graph key-file/path references match the new root location; no leaf map is duplicated into `SKILL.md` or `hub-router.json`. |
| REQ-006 | Preserve `defaultResource` semantics. | The literal legacy path is replaced by `ROUTER.md` only in cli-external-orchestration, sk-design, and system-deep-loop stage-one defaults; sk-prompt, sk-doc, and sk-code stage-one defaults are preserved byte-for-byte; mcp-tooling is unchanged. |
| REQ-007 | Regenerate derived metadata through owner tooling. | Leaf manifests and other derived metadata are regenerated only by their owning tools; the exact delta is captured and adjudicated before the checkpoint closes. |
| REQ-008 | Align versions and changelogs additively. | Each hub gains release/version alignment and one new changelog entry; no historical changelog line is rewritten. |
| REQ-009 | Gate each hub with receipts. | Root-router validator, parent doctor, package gate, replay/benchmark route-gold, and hub canary each exit 0 with a child-local receipt before the checkpoint closes. |
| REQ-010 | Delete legacy files only after gates pass. | The legacy file is deleted only after that hub's new root passes every REQ-009 gate; deletion is followed by a live residue rescan. |
| REQ-011 | Prove zero live legacy residue. | The final live-vs-history residue scan finds no live references to either legacy path outside immutable history; protected replay fallback strings remain byte-identical and are documented as the compatibility exception. |
| REQ-012 | Keep the frozen substrate byte-identical. | `router-replay.cjs` and the two scorer files match their Phase 001 pinned SHA-256 values before and after every checkpoint. |
| REQ-013 | Preserve advisor boundaries. | No system-skill-advisor runtime or scorer code is edited; if root graph signals or root `SKILL.md` metadata change, the advisor index is rebuilt/validated only after the hub files are final. |
| REQ-014 | Gate the 003 to 004 handoff. | Seven serial checkpoint receipts exist; every hub's old/new map delta is adjudicated; zero live legacy files; strict child validation exits 0. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-015 | Keep rollback ready. | Rollback is Git restoration of the worktree plus the retained compiled-route-sync rollback closure; router prose is never restored without matching policy and manifest state. |
| REQ-016 | Keep the diff scoped and staging clean. | Every Phase 003 write is inside this child folder or an approved live-hub surface; no staged files exist; receipts live under `scratch/checkpoints/`. |
| REQ-017 | Produce a strict-valid draft packet. | All six Level-3 authored documents, `description.json`, and normalized `graph-metadata.json` exist; no unresolved tokens remain; strict validation exits 0 while lifecycle remains draft/planned. |
| REQ-018 | Document the checkpoint closing rule. | A checkpoint closes only after its pre-change capture, migration, machine-hash comparison, link resolution, gate receipts, and legacy deletion/rescan are all complete. |

### Serial Checkpoint Order

```text
CP1 mcp-tooling (golden/idempotent verification)
CP2 cli-external-orchestration
CP3 sk-design
CP4 sk-prompt
CP5 sk-doc
CP6 system-deep-loop
CP7 sk-code (last; only intentional machine-block delta)
```

| Checkpoint | Hub | Pre-State | Post-State | Legacy Action |
|------------|-----|-----------|------------|---------------|
| CP1 | mcp-tooling | root `ROUTER.md`, 7/7 keys | root `ROUTER.md` active, unchanged bytes | None (golden; must be idempotent) |
| CP2 | cli-external-orchestration | legacy `shared/references/smart-routing.md`, 6/6 keys | root `ROUTER.md` active, byte-equal machine block | Delete legacy after gates |
| CP3 | sk-design | legacy, 4/4 keys | root active, byte-equal machine block | Delete legacy after gates |
| CP4 | sk-prompt | legacy, 13/13 keys | root active; one adjudicated stale-leaf replacement (`patterns-evaluation.md`) | Delete legacy after gates |
| CP5 | sk-doc | legacy, 14/14 keys | root active, byte-equal machine block | Delete legacy after gates |
| CP6 | system-deep-loop | legacy, 7/7 keys | root active, byte-equal machine block | Delete legacy after gates |
| CP7 | sk-code | legacy, 20/20 keys | root active; self-reference removal, shared-path normalization, explicit shared controls | Delete legacy after gates |

**Execution result (2026-08-16)**: all seven checkpoints closed with receipts at `scratch/checkpoints/<hub>/checkpoint-close.md`; exactly seven hubs serve root `ROUTER.md` with `router_state: active`; zero live legacy files remain; four migrated hubs are byte-equal (`8899785a…`, `0a787088…`, `2ad1469c…`, `f9f410c1…`), sk-prompt carries one adjudicated leaf replacement (`7d828850…`), sk-code carries the approved one-resource repair (`9a5716cc…`), and mcp-tooling is unchanged (`8477b664…`).

### Per-Hub Adoption Procedure

For each checkpoint CP2 through CP7:

1. Capture old map hash, route receipts, `defaultResource`, manifest state, and live references into `scratch/checkpoints/<hub>/before/`.
2. Create/move the root `ROUTER.md` with `router_state: active`.
3. Preserve four machine blocks byte-for-byte and apply only the recorded sk-prompt and sk-code routing repairs (REQ-003).
4. Rebase document-relative links and provenance for the root location (REQ-004).
5. Update the root `SKILL.md` two-stage pointer, layout, rules, references, README, graph key-file/path references, and other live source docs (REQ-005).
6. Replace a legacy `defaultResource` path only where it already exists; preserve all other fallback behavior (REQ-006).
7. Regenerate derived leaf metadata through owner tooling and inspect the exact delta (REQ-007).
8. Add the hub's release/version alignment and one new changelog entry; keep historical files untouched (REQ-008).
9. Run the root-router validator, parent doctor, package gate, replay/benchmark checks, and hub canary (REQ-009).
10. Delete the legacy file only after the new root passes step 9, then rescan live sources excluding immutable history (REQ-010, REQ-011).

CP1 runs only the verification half: it must prove mcp-tooling's existing root conforms to the contract and that no file changes result.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The mcp-tooling golden checkpoint proves idempotent conformance with zero changed files. — Met; CP1 receipt at `scratch/checkpoints/mcp-tooling/checkpoint-close.md`.
- **SC-002**: Four migrated hubs show old/new machine-hash equality; sk-prompt and sk-code show only their adjudicated repairs; mcp-tooling bytes are unchanged. — Met; hashes re-verified 2026-08-16 (`8899785a…`, `0a787088…`, `2ad1469c…`, `f9f410c1…` equal; sk-prompt `7d828850…`; sk-code `9a5716cc…`; mcp-tooling `8477b664…`).
- **SC-003**: All seven canonical hubs serve root `ROUTER.md` with `router_state: active`; zero live legacy router files remain. — Met; re-verified 2026-08-16 (legacy count 0).
- **SC-004**: Every checkpoint closes with a complete receipt set covering validator, doctor, package, replay/benchmark, canary, and residue rescan. — Met; seven checkpoint-close receipts.
- **SC-005**: Stage-one and stage-two default behavior matches the Phase 001 matrix for all seven hubs. — Met; three literal repoints only; four hubs preserved byte-for-byte.
- **SC-006**: Derived metadata deltas are owner-generated and adjudicated; per-hub versions and changelogs are additive with history untouched. — Met; per-hub changelog-delta rows.
- **SC-007**: The 003 to 004 handoff shows seven checkpoint receipts, adjudicated old/new maps, zero live legacy files, strict validation exit 0, and no staged files. — Met; handoff approved (strict-validation final re-run passed to the worktree-local authoritative gate).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Ratified Phase 001 contract and matrix | Migration could violate frozen decisions | Treat `../001-*/spec.md` and `decision-record.md` as read-first authority; stop on conflict |
| Dependency | Phase 002 validator, doctor, package fixtures | Per-hub gates cannot run | CP1 requires the Phase 002 tools to pass their own gate before adoption starts |
| Dependency | Frozen replay and scorer trio | Route behavior could be assumed stable | Pin before and after every checkpoint |
| Dependency | Seven hub canary owners | Hub health cannot be proven | Run each owner serially and keep raw receipts |
| Dependency | Owner-tool metadata generators | Derived artifacts could be hand-edited | Regeneration only through owning tools; delta adjudication mandatory |
| Risk | Machine-block drift during move | Migration silently changes policy | Old/new byte comparison per hub with recorded byte counts |
| Risk | Link rebase breaks resolution | Validator fails or docs mislead | Resolve every rebased path; run the root-router validator per hub |
| Risk | Default fallback drift | Zero-signal behavior changes | Repoint only literal legacy entries per the Phase 001 matrix |
| Risk | Premature legacy deletion | Hub loses its fallback source | Hard gated deletion after all REQ-009 gates pass |
| Risk | Residue scan conflates history and live | History gets edited or live residue stays | Classify live vs immutable before acting; path-explicit exclusions |
| Risk | sk-code delta widens | Contract boundary leaks | Adjudicate the exact resource-set delta before and after CP7 |
| Risk | Advisor index built from intermediate state | Discovery reflects half-migrated hubs | Rebuild/validate only after files are final |
| Risk | Partial rollback restores prose without policy | Inconsistent hub state | Git restore plus the retained compiled-route-sync rollback closure as one unit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance

- **NFR-P01**: All checkpoint commands complete locally without network access.
- **NFR-P02**: Each checkpoint is independently rerunnable and bounded to one hub.
- **NFR-P03**: No checkpoint proceeds while a prior checkpoint receipt is missing or non-zero.

### Security

- **NFR-S01**: Receipts contain no secrets, environment values, user data, or absolute paths outside the worktree and this spec folder.
- **NFR-S02**: Hashing reads bytes only; it never normalizes or rewrites a source file.

### Reliability

- **NFR-R01**: Every command records exit code and fails closed on parse, missing-file, hash, or count mismatch.
- **NFR-R02**: Identical source bytes yield identical machine hashes on repeated runs.
- **NFR-R03**: Any old/new hash mismatch blocks the checkpoint instead of auto-blessing the new value.
- **NFR-R04**: A checkpoint may not close until its legacy deletion rescan completes with zero live matches.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries

- **Dual source**: root plus either legacy router location fails closed; neither source is selected and the checkpoint stops.
- **Legacy file already missing**: record the pre-state factually and adjudicate before treating the move as complete.
- **mcp-tooling drift**: any changed path in CP1 fails the golden check; nothing is migrated until the pilot conforms.
- **Map keys unchanged**: the root move never adds, removes, or reorders intent/resource keys; only recorded resource values/defaults and sk-code's shared-control declaration change.

### Error Scenarios

- **Machine-hash mismatch**: keep both values, investigate byte boundary and move mechanics, and block the checkpoint; never overwrite expectations silently.
- **sk-code delta beyond one resource**: stop CP7 and record LOGIC-SYNC; never bless a wider delta.
- **Rebased link unresolved**: fail the checkpoint; do not ship a root router with a dangling target.
- **Canary non-zero**: record the exact command and failure; the checkpoint stays open.
- **Frozen digest mismatch**: stop the whole phase and record LOGIC-SYNC; the pins from Phase 001 are immutable.
- **Live residue after deletion**: reopen the checkpoint and resolve every live match before continuing.
- **Legacy path in immutable history**: classify and leave unchanged; excluded from the residue gate by explicit path rule.

### State Transitions

- **Draft to ratified**: completed 2026-08-16; CP1 through CP7 each have complete receipt sets and the handoff gate passed.
- **Draft to complete**: completed by the execution pass; the seven checkpoint receipts, adjudicated old/new maps, and the 003 to 004 handoff are recorded in `checklist.md` and `scratch/checkpoints/*/checkpoint-close.md`.
- **Checkpoint open to closed**: completed per checkpoint with pre-capture, migration, hash comparison, link resolution, gates, deletion, and rescan all closed out.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 21/25 | Seven serial checkpoints, seven live hub surfaces, six legacy deletions |
| Risk | 23/25 | Machine-policy preservation, defaults, derived metadata, canary health, rollback |
| Research | 14/20 | Link rebasing per hub, residue classification, owner-tool invocation shapes |
| Multi-Agent | 11/15 | Serial checkpoint execution with per-hub receipts and phase handoffs |
| Coordination | 14/15 | Seven serial checkpoints, five gates per hub, strict handoff discipline |
| **Total** | **83/100** | **Level 3 architecture packet** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Machine bytes drift during the move | H | M | Old/new byte comparison per hub with byte counts |
| R-002 | Link rebase produces dangling targets | H | M | Resolve every rebased path; validator per hub |
| R-003 | Default fallback semantics change | H | M | Repoint only literal legacy entries per the Phase 001 matrix |
| R-004 | Legacy file deleted before gates pass | H | M | Hard gated deletion after all five gate receipts |
| R-005 | Residue scan edits history or misses live matches | H | M | Classify before acting; path-explicit immutable exclusion |
| R-006 | sk-code delta exceeds one resource | H | L | Adjudicate the exact resource-set delta before and after |
| R-007 | Advisor index reflects intermediate hub state | M | M | Rebuild/validate only after files are final |
| R-008 | Rollback restores prose without policy and manifests | H | M | Git plus retained compiled-route-sync closure as one unit |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Hub Migrator Preserves Policy (Priority: P0)

**As a** hub migrator, **I want** byte-preserved machine blocks and preserved defaults, **so that** moving to root `ROUTER.md` never changes routing policy.

**Acceptance Criteria**:

1. **Given** a legacy hub with a frozen machine block, **When** the root move completes, **Then** four old/new machine hashes are equal and the sk-prompt/sk-code differences match only their recorded routing repairs.
2. **Given** a `defaultResource` that does not literally name the legacy router, **When** the root move completes, **Then** the stage-one fallback remains byte-identical.

### US-002: Checkpoint Reviewer Verifies Gates (Priority: P0)

**As a** checkpoint reviewer, **I want** five gate receipts per hub, **so that** no hub advances on prose claims.

**Acceptance Criteria**:

1. **Given** a closed checkpoint, **When** it is audited, **Then** validator, doctor, package, replay/benchmark, and canary receipts all exist with exit 0.
2. **Given** a hub whose canary is non-zero, **When** the checkpoint is reviewed, **Then** the receipt records the factual failure and the checkpoint stays open.

### US-003: Fleet Owner Sees Zero Residue (Priority: P0)

**As a** fleet owner, **I want** a live-vs-history residue scan, **so that** live sources are clean without rewriting history.

**Acceptance Criteria**:

1. **Given** the final rescan, **When** it completes, **Then** every live old-path match is resolved and only classified immutable history or protected replay fallbacks remain.
2. **Given** a match in a changelog or dated benchmark report, **When** the rescan classifies it, **Then** the row is immutable and no edit is planned.

### US-004: Program Owner Approves the Handoff (Priority: P0)

**As a** program owner, **I want** seven serial checkpoint receipts and adjudicated old/new maps, **so that** Phase 004 starts from a proven fleet state.

**Acceptance Criteria**:

1. **Given** all seven checkpoints, **When** the handoff gate runs, **Then** each hub has a receipt set and an adjudicated old/new map delta.
2. **Given** the worktree diff, **When** the handoff gate runs, **Then** every changed path is an approved hub surface or inside this child folder, no staged file exists, and strict validation exits 0.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None at authoring time. Any requirement to change routing policy, replay selection, scorer weights, protected digests, the Phase 001 matrix, or unrelated advisor/command/packet behavior triggers LOGIC-SYNC and stops the phase rather than widening scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Approved plan**: `/Users/michelkerkmeester/.pi/agent/plans/01a00512-29e3-7bf3-8288-4454ffb94865.md`
- **Parent phase spec**: `../spec.md`
- **Phase 001 contract**: `../001-contract-and-fleet-audit/spec.md`
- **Phase 002 tooling**: `../002-create-skill-template-and-validator-alignment/spec.md`
- **Implementation plan**: `plan.md`
- **Task breakdown**: `tasks.md`
- **Verification checklist**: `checklist.md`
- **Decision record**: `decision-record.md`
- **Implementation summary**: `implementation-summary.md`
