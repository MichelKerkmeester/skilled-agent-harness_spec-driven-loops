---
title: "Feature Specification: Create-Skill Template and Validator Alignment"
description: "Align the sk-create-skill templates, generator, parent command workflows, pure root-router contract validator, parent doctor, package validation, and positive/negative tests with the two-state root ROUTER.md standard ratified in Phase 001, without touching the class discriminator, frozen replay, scorer files, or live hubs."
trigger_phrases:
  - "create skill template alignment"
  - "root router validator"
  - "stage1-only scaffold"
  - "parent skill doctor gate"
  - "stable router failure codes"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/019-skill-routing-refactor/015-router-unification-program/020-root-router-document-standard/002-create-skill-template-and-validator-alignment"
    last_updated_at: "2026-08-16T07:40:46.607Z"
    last_updated_by: "markdown-agent"
    recent_action: "Ratified the two-state tooling contract and aligned every authoring surface."
    next_safe_action: "Phase 003 adopts the verified fixtures and stable-code matrix."
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Create-Skill Template and Validator Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:executive-summary -->
## EXECUTIVE SUMMARY

Phase 002 makes the class-H authoring toolchain produce and enforce the two-state root `ROUTER.md` standard ratified in Phase 001, before any live hub is migrated. `init_skill.py --kind parent` always emits a valid root `stage1-only` `ROUTER.md`; the parent command promotes it to `active` only after a concrete leaf map is authored. A new pure library, `scripts/lib/root-router-contract.cjs`, enforces the state and machine-map shape with stable negative codes and delegates path identity to the existing leaf-resource contract. The parent doctor and `validate_skill_package.py` parent path consume the library; positive scaffolds pass and every negative fixture fails at its intended code.

**Key Decisions**: `stage1-only` is the generator default, `active` requires authored maps (ADR-102); a pure root-router-contract library with frozen codes (ADR-103); `defaultResource` preserved, never universally repointed (ADR-104); class discriminator and frozen replay/scorer bytes byte-identical (ADR-105).

**Critical Dependencies**: ratified Phase 001 contract, existing sk-create-skill assets and scripts, parent command workflows, `parent-skill-check.cjs`, the leaf-resource contract library, and the existing replay byte set.
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
| **Predecessor** | `../001-contract-and-fleet-audit/spec.md` |
| **Successor** | `../003-seven-hub-root-adoption/spec.md` |
| **Execution Boundary** | Named sk-create-skill, command, doctor, and test files below; no live hub router edits |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

The parent generator emits no second-stage router and its template still instructs authors to create `shared/references/smart-routing.md`. No validator or doctor enforces the two-state root contract, and no negative fixture proves stable failure behavior. Tooling drift would make the Phase 003 fleet migration undisciplined.

### Purpose

Make every canonical authoring surface emit and enforce root `ROUTER.md` with `router_state: active` or `stage1-only`, while preserving `defaultResource` behavior and leaving the class discriminator and frozen replay bytes untouched.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Two-state root `ROUTER.md` authoring in every parent-skill template, scaffold, and schema reference.
- `init_skill.py --kind parent` emitting a valid root `stage1-only` `ROUTER.md`; promotion to `active` only after a concrete authored leaf map.
- Command workflow state classification and `ROUTER.md: create|migrate|unchanged` UX.
- Pure `scripts/lib/root-router-contract.cjs` with stable negative codes, integrated into `parent-skill-check.cjs` and the parent path of `validate_skill_package.py`.
- Positive/negative tests: create-journey proof, root-router contract, doctor fixtures/mutants, auto/confirm parity, migration fixture with machine-block hash.
- Documentation-only update of `references/shared/skill-root-metadata-contract.md`.

### Out of Scope

- Migrating the seven live hubs; Phase 003 owns adoption and the three literal legacy-path `defaultResource` repoints.
- Changing `skill-root-metadata-contract.cjs` classification, `router-replay.cjs`, scorer files, or their protected digests.
- Adding leaf maps to `SKILL.md` or `hub-router.json`, or making `ROUTER.md` a typed leaf, advisor identity, or generated file.
- Rewriting immutable changelogs or benchmark reports.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md` | Modify | Normative Phase 002 scope, stable codes, and gates |
| `plan.md` | Modify | Implementation sequence, exact commands, rollback |
| `tasks.md` | Modify | Receipt-backed task ledger |
| `checklist.md` | Create | P0/P1/P2 handoff gates |
| `decision-record.md` | Create | Proposed tooling decisions |
| `implementation-summary.md` | Modify | Completed delivery state (receipt-backed) |
| `description.json` | Create | Level and discovery metadata |
| `graph-metadata.json` | Regenerate | Normalized graph metadata |

All paths above are relative to this child folder.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Stage1-only initializer. | `init_skill.py --kind parent` always emits one root `ROUTER.md` with `router_state: stage1-only`, empty stage-two maps and default, a root `SKILL.md` pointer, and a four-part `version`; never synthesizes placeholder paths or fake leaf intents. |
| REQ-002 | Templates teach both states, typed leaves, shared controls, and no legacy path. | `parent-skill-smart-routing-template.md`, `parent-skill-hub-template.md`, `scaffold/hub-skill-scaffold.md`, `parent-skill-hub-router-template.json`, `parent-hub-router-schema.md`, and `parent-skills-nested-packets.md` document root `ROUTER.md` authoring; `active` requires non-empty equal-key maps with typed packet leaves or explicit contained `SHARED_CONTROL_RESOURCES`, `stage1-only` is leafless; no surface instructs legacy-path creation. |
| REQ-003 | Pure root-router contract library. | `scripts/lib/root-router-contract.cjs` parses only `router_state` and the machine-map shape, returns violations with stable codes, delegates path identity to `lib/leaf-resource-contract.cjs`, and neither imports nor duplicates frozen replay scoring. |
| REQ-004 | Stable negative codes. | The eight failure cases map to frozen codes RRC-001..RRC-008 and are asserted by fixtures. |
| REQ-005 | Doctor and package integration. | `parent-skill-check.cjs` and the parent path of `validate_skill_package.py` run the library; a valid `stage1-only` scaffold and an `active` fixture both pass; every negative fixture fails at its intended code, exit non-zero. |
| REQ-006 | Command state classification. | The create/update flow classifies `stage1-only`, `active`, `legacy-migratable`, `already-current`, `conflict`, or `malformed`, shows `ROUTER.md: create|migrate|unchanged`, preserves the machine block byte-for-byte in ordinary migration, and stops on dual/conflicting copies. |
| REQ-007 | `defaultResource` preservation. | Phase 002 adds no `hub-router.json` or stage-two default change; `defaultResource` is never required to point to `ROUTER.md`; the three literal legacy repoints defer to Phase 003. |
| REQ-008 | No class-discriminator or frozen replay edits. | `skill-root-metadata-contract.cjs`, `router-replay.cjs`, and scorer files stay byte-identical; `references/shared/skill-root-metadata-contract.md` is documentation-only. |
| REQ-009 | Test coverage. | Extend `create-journey-proof.test.cjs`; add `root-router-contract.test.cjs`; add parent-skill-check fixture/mutant suites; add auto/confirm parity checks; add a migration fixture with before/after machine-block hash; cover active, stage1-only, missing, malformed, dual-source, key-mismatch, unresolved-leaf, manifest-missing; prove root-first replay compatibility with existing replay bytes. |
| REQ-010 | Exit gate. | Stage1-only scaffold and active fixture pass package validation and parent doctor; all negative fixtures fail at intended codes; no legacy creation instruction remains; strict child validation exits 0; scoped diff touches only named files, no live hub. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-011 | Skill docs updated. | `sk-create-skill/SKILL.md` and `README.md` describe two-state authoring and the stage1-only-to-active promotion rule. |
| REQ-012 | Command surfaces in lockstep. | `skill-parent.md`, the three `create-skill-parent-*` assets, `commands/create/README.txt`, and `.opencode/agents/markdown.md` share one state classification and `ROUTER.md` action line. |
| REQ-013 | Machine-block evidence. | The migration fixture hashes the inner machine-block bytes before and after ordinary migration and asserts equality. Phase 003 separately adjudicates sk-code's root-location normalization and the pre-existing sk-prompt stale-leaf replacement before changing their policy bytes. |

### Stable Negative Codes

| Code | Meaning | Trigger |
|------|---------|---------|
| RRC-001 | Missing root router | No root `ROUTER.md` at the hub root |
| RRC-002 | Malformed router shape | State or four-part version is absent/duplicated/invalid, or required machine declarations are missing or malformed |
| RRC-003 | Dual root + legacy sources | Root `ROUTER.md` coexists with `shared/references/smart-routing.md` or `references/smart-routing.md` |
| RRC-004 | Active empty maps or key mismatch | `active` with empty maps or unequal key sets |
| RRC-005 | Stage1-only non-empty maps | Any non-empty stage-two map or stage-two default |
| RRC-006 | Unsafe or unresolved resource | A packet leaf fails containment, disk resolution, or typed manifest membership; or a declared shared control is unsafe, missing, or unused |
| RRC-007 | Missing `SKILL.md` pointer | No resolvable root `SKILL.md` pointer |
| RRC-008 | Legacy default residue | A live `defaultResource` literally names a legacy smart-router path |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `init_skill.py --kind parent` output is a valid root `stage1-only` `ROUTER.md` with empty maps and no placeholder paths. — Met; stage1-only emission verified in `init_skill.py` and by the doctor/package positives.
- **SC-002**: A hand-authored `active` fixture passes the library, parent doctor, and package validation. — Met; active fixture exit 0 on all three consumers.
- **SC-003**: All eight negative fixtures fail at their exact stable codes in library, doctor, and package paths. — Met; RRC-001..RRC-008 asserted (re-verified 2026-08-16).
- **SC-004**: The command workflow emits exactly one `ROUTER.md: create|migrate|unchanged` decision per state and stops on dual copies. — Met; auto/confirm parity suite green (9 passed).
- **SC-005**: No authoring surface instructs legacy-path creation; only immutable history and protected replay strings reference it. — Met; zero live creation instructions.
- **SC-006**: `defaultResource` behavior is unchanged for all seven hubs; no universal `ROUTER.md` repoint. — Met; zero-delta check.
- **SC-007**: Discriminator, replay, and scorer digests are byte-identical before and after. — Met; re-verified 2026-08-16 (`14f169a4…`/`05bf38b8…`/`f5b44150…`).
- **SC-008**: Strict child validation exits 0; handoff diff contains no out-of-scope or live-hub path. — Met; strict validation exited 0 on 2026-08-16 (final re-run passed to the worktree-local authoritative gate); diff scoped to this child and the allowlist.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Ratified Phase 001 contract | Tooling could contradict the frozen schema | Consume `001` ADR-001..005; stop on conflict |
| Dependency | Templates and command assets | Prose and workflow could drift | One lockstep edit pass across all authoring surfaces |
| Dependency | Leaf-resource contract and replay bytes | Identity or compatibility regressions | Delegate identity; run replay with existing bytes |
| Risk | Stable codes drift across consumers | Fixtures pass for the wrong reason | Library-owned code table; doctor/package print it |
| Risk | Generator emits fake active leaves | Stage1-only contract bypassed | Hard rule: `--kind parent` emits `stage1-only` only |
| Risk | Defaults change during tooling work | Zero-signal behavior shifts | REQ-007 no-default-change gate |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

- **NFR-P01**: The library runs locally with no network access, per hub under two seconds.
- **NFR-S01**: Validators read bytes only; never rewrite a router, manifest, or source file. Fixtures contain no secrets or absolute host paths.
- **NFR-R01**: A negative result always carries one stable code; unknown failures exit non-zero with `RRC-UNKNOWN`.
- **NFR-R02**: Same fixture bytes produce the same codes on repeated runs.
- **NFR-R03**: The machine-block hash boundary matches the Phase 001 definition exactly.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

- **Active with zero intents**: invalid, RRC-004.
- **Stage1-only with one resource**: invalid, RRC-005.
- **Equal keys, one unresolved path**: invalid, RRC-006.
- **Root plus both legacy files**: invalid, RRC-003; flow stops before any migration decision.
- **Legacy file without root router**: `legacy-migratable`; ordinary migration preserves the machine block.
- **Both states absent**: malformed, RRC-002.
- **Library import failure**: fail closed; `RRC-UNKNOWN`, non-zero.
- **Manifest missing for a mapped path**: invalid, RRC-006; never auto-mint a pair.
- **Default names a legacy path after migration**: invalid, RRC-008, even when maps pass.
- **Stage1-only to active**: only after a concrete authored leaf map; no synthetic intents.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Rationale |
|-----------|-------|-----------|
| Scope | 20/25 | Templates, generator, commands, validator, doctor, package gate, six test surfaces |
| Risk | 21/25 | Authoring tooling feeds all seven hubs; defaults and protected bytes at stake |
| Research | 10/20 | Implements ratified decisions; replay-compatibility proof only |
| Multi-Agent | 9/15 | Consumes Phase 001 output; hands fixtures to Phase 003 |
| Coordination | 12/15 | Lockstep command/generator surfaces; serial handoffs |
| **Total** | **72/100** | **Level 3 architecture packet** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:risk-matrix -->
## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-101 | Templates/generator emit the legacy path | H | M | REQ-002 no-legacy-instruction gate plus grep |
| R-102 | Stable codes diverge across consumers | H | M | Library-owned table; doctor/package print it |
| R-103 | Workflow silently rewrites machine blocks | H | M | Before/after machine-block hash fixture |
| R-104 | Discriminator or replay bytes drift | H | L | Byte-identity gate on all four protected files |
| R-105 | Defaults shift during alignment | H | L | REQ-007 no-default-change assertion |
| R-106 | Active fixture ships placeholder intents | M | M | Active fixtures require typed, resolved pairs |
<!-- /ANCHOR:risk-matrix -->

---

<!-- ANCHOR:user-stories -->
## 11. USER STORIES

### US-001: Author Scaffolds a Leafless Hub (P0)

**As a** skill author, **I want** `init_skill.py --kind parent` to emit a valid leafless root router, **so that** a simple hub starts compliant without fake intents.

1. **Given** a fresh parent scaffold, **When** the initializer runs, **Then** one root `stage1-only` `ROUTER.md` exists with empty maps and a `SKILL.md` pointer.
2. **Given** that scaffold, **When** the doctor and package validation run, **Then** both exit 0.

### US-002: Author Promotes to Active (P0)

**As a** skill author, **I want** a promotion path that requires real leaves, **so that** `active` never carries synthetic routing.

1. **Given** a `stage1-only` root router, **When** the author authors non-empty equal-key maps with typed paths, **Then** the flow reclassifies it `active` and the doctor passes.
2. **Given** mismatched keys, **When** validation runs, **Then** RRC-004 is reported.

### US-003: Maintainer Migrates a Legacy Hub (P0)

**As a** routing maintainer, **I want** a `legacy-migratable` flow that preserves machine bytes, **so that** Phase 003 migrations are provably policy-neutral.

1. **Given** a hub with only the legacy router, **When** migration runs, **Then** the machine block hash is unchanged and the legacy path is removed.
2. **Given** a dual root-plus-legacy state, **When** the flow runs, **Then** it stops with RRC-003 instead of choosing.
<!-- /ANCHOR:user-stories -->

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

None at authoring time. Any requirement to change the class discriminator, frozen replay, scorer files, hub defaults, or a live hub triggers LOGIC-SYNC and stops rather than widening scope.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Approved plan**: `/Users/michelkerkmeester/.pi/agent/plans/01a00512-29e3-7bf3-8288-4454ffb94865.md`
- **Parent phase spec**: `../spec.md`
- **Predecessor contract**: `../001-contract-and-fleet-audit/spec.md`
- **Implementation plan**: `plan.md` · **Task breakdown**: `tasks.md` · **Verification checklist**: `checklist.md` · **Decision record**: `decision-record.md` · **Implementation summary**: `implementation-summary.md`
