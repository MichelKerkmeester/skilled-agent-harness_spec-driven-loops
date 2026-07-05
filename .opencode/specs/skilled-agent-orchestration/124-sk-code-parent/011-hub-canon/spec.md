---
title: "Feature Specification: Phase 11 hub canon"
description: "Define the one canonical parent-hub method: the sk-design/sk-code 2-tier shape generalized, with deep-loop's 3-tier machinery expressed as named extensions and a two-axis modes[] model."
trigger_phrases:
  - "parent hub canonical method"
  - "hub-router.json schema"
  - "two-axis parent hub packetKind"
importance_tier: "critical"
contextType: "implementation"
parent: "skilled-agent-orchestration/124-sk-code-parent"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/011-hub-canon"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "openai-gpt-5.5"
    recent_action: "Backfilled the shipped phase into current Level 2 template shape without changing code."
    next_safe_action: "Run strict validation for the 011-hub-canon phase folder."
---
# Feature Specification: Phase 11 hub canon

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
| **Created** | 2026-07-04 |
| **Branch** | `124-sk-code-parent` |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The repo had competing parent-hub shapes: deep-loop-workflows' 3-tier machinery and the sk-design/sk-code 2-tier shape. Canon docs, templates, validators, and scaffolding encoded mixed expectations, leaving parent hub authoring ambiguous and allowing tooling to miss required hub metadata.

### Purpose
Define one parent-hub method for the repo, publish the corresponding sk-doc templates and router schema, and upgrade enforcement so every hub can be checked against the same canonical contract.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Define the two-axis parent-hub model where every `modes[]` entry has `packetKind: "workflow" | "surface"`.
- Generalize the sk-design/sk-code 2-tier shape as canonical and model deep-loop's 3-tier machinery as named `extensions`.
- Require `hub-router.json` and `description.json` for all hubs.
- Publish sk-doc parent-hub templates, the first `hub-router.json` schema doc, and the parent-hub creation index updates.
- Upgrade parent hub enforcement and scaffolding for the canonical contract.
- Preserve additive behavior for advisor drift-guard and router replay compatibility.

### Out of Scope
- Promoting parent-skill-check warnings to failures; this was left to a later strict phase.
- Restructuring live sk-code packets into the two-axis layout; that belongs to phase 013.
- Moving spec-folder authoring docs into system-spec-kit; that belongs to phase 012.
- Changing implementation code during this documentation backfill.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/skill/parent_skill_hub_template.md` | Rewrite | v2.0 canonical parent hub template with sk-code as the canonical example |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_registry_template.json` | Rewrite | Registry template for the two-axis `modes[]` model |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_graph_metadata_template.json` | Rewrite | Graph metadata template aligned with one advisor identity per hub |
| `.opencode/skills/sk-doc/references/skill_creation/parent_hub_router_schema.md` | Create | First schema documentation for required `hub-router.json` |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_hub_router_template.json` | Create | Hub router template for canonical parent hubs |
| `.opencode/skills/sk-doc/assets/skill/parent_skill_description_template.json` | Create | Required hub `description.json` template |
| `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md` | Rewrite | Three-hub extension matrix covering sk-code, sk-design, and deep-loop |
| `.opencode/skills/sk-doc/references/skill_creation.md` | Update | Index update for parent hub authoring docs |
| `.opencode/skills/sk-doc/SKILL.md` | Update | New routable PARENT_HUB intent |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Update | Full checks 1-9 for all hubs; strict mode promotes migration-gated findings |
| `.opencode/skills/deep-loop-workflows/deep-improvement/scripts/skill-benchmark/parent-hub-vocab-sync.cjs` | Update | Fail-loud missing router/registry handling |
| `.opencode/commands/create/sk-skill-parent/` | Update | Two-axis parent hub scaffolder contract and presentation |
| `.opencode/commands/doctor/doctor_parent-skill.yaml` | Update | Two-axis invariant for parent hub checks |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Establish one canonical parent-hub model | `design-contract.md` defines the 2-tier generalized model with deep-loop extensions |
| REQ-002 | Represent workflows and surfaces in one registry axis | Every packet is modeled as a `modes[]` entry with required `packetKind` discriminator |
| REQ-003 | Require hub companion metadata | `hub-router.json` and `description.json` are documented as required for all hubs |
| REQ-004 | Publish sk-doc templates for the canon | Nine sk-doc files are authored or updated for the parent-hub intent |
| REQ-005 | Enforce all hubs without basename gating | `parent-skill-check.cjs` runs checks 1-9 for all hubs |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Keep migration enforcement gated | New strict gaps warn by default and fail under `PARENT_HUB_CHECK_STRICT` |
| REQ-007 | Make vocab sync fail loud on missing metadata | Missing router/registry no longer returns a silent empty result |
| REQ-008 | Upgrade scaffolding to emit the canonical shape | `/create:sk-skill-parent` creates two-axis hub files and runs the parent-skill-check gate |
| REQ-009 | Preserve additive transition behavior | Advisor drift-guard and router replay compatibility remain green |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The canonical contract is published in `design-contract.md` and sk-doc parent hub authoring docs.
- **SC-002**: `parent-skill-check.cjs` inventories all hubs and reports strict gaps for sk-code, deep-loop, and sk-design.
- **SC-003**: `parent-hub-vocab-sync.cjs` fails loud for missing router/registry fixtures and passes its test suite.
- **SC-004**: `/create:sk-skill-parent` emits a two-axis scratch hub that passes parent-skill-check in default and strict mode.

### Acceptance Scenarios

- **Scenario 1**: **Given** a parent hub registry, **when** a packet is listed, **then** it has `packetKind` set to `workflow` or `surface`.
- **Scenario 2**: **Given** a surface packet, **when** the hub is checked, **then** the packet is read-only, uses `backendKind: "evidence-base"`, and routes through metadata.
- **Scenario 3**: **Given** a hub with missing router or registry metadata, **when** vocab sync runs, **then** it fails loudly instead of returning an empty success result.
- **Scenario 4**: **Given** a scratch scaffolded parent hub, **when** parent-skill-check runs in default and strict mode, **then** it exits 0.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Existing sk-design/sk-code hub shapes | Canon could conflict with already-shipped hub patterns | Generalize the 2-tier shape rather than introducing a third structure |
| Dependency | Deep-loop's 3-tier machinery | Deep-loop behavior could be broken by flattening | Model it as named `extensions` that activate in-place fields |
| Risk | Advisor drift-guard path sensitivity | Moving `advisorRouting.*` fields could break drift checks | Keep additions additive and preserve current field locations |
| Risk | Migration strict gaps | Enforcing immediately could block existing hubs | Warn by default and fail only under `PARENT_HUB_CHECK_STRICT` |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Parent hub checks remain usable as local doctor gates across all hubs.

### Security
- **NFR-S01**: Surface packets are read-only and forbid workspace mutation tools.

### Reliability
- **NFR-R01**: Missing required hub metadata fails loudly instead of silently passing.
- **NFR-R02**: Validator strict mode can distinguish default migration warnings from strict failures.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Surface packets remain in `modes[]`; no separate `surfacePackets[]` array is introduced.
- `runtimeLoopType` is required only when the `runtime-loop` extension is declared.
- `hub-router.json` signal keys must match registry modes bidirectionally.

### Error Scenarios
- Missing `hub-router.json` or registry metadata fails loud in vocab sync.
- Hub strict gaps remain warnings by default and become failures under `PARENT_HUB_CHECK_STRICT`.

### Concurrent Operations
- Additive fields keep Lane-C router replay and advisor drift-guard compatible during migration.

<!-- /ANCHOR:edge-cases -->
---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 20/25 | Cross-cutting templates, validator, vocab sync, and scaffolder docs |
| Risk | 20/25 | Parent hub canon affects all future hub authoring |
| Research | 15/20 | Design contract reconciles sk-code, sk-design, and deep-loop shapes |
| **Total** | **55/70** | **Level 2** |

<!-- /ANCHOR:complexity -->
---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The canonical method is settled by `design-contract.md` and shipped commits `b6fe2f31b1`, `deab5a3853`, and `d1b545e4b6`.

<!-- /ANCHOR:questions -->
---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Design Contract**: See `design-contract.md`

<!-- /ANCHOR:related-docs -->
