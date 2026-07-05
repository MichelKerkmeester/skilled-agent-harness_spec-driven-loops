---
title: "Feature Specification: Phase 17 canon hardening"
description: "Plan the parent-hub canon hardening pass that reconciles bundleRules vocabulary, sk-code registry/router naming, version format, stale placeholders, and template-schema-validator consistency without increasing deep-loop parent-skill-check failures."
trigger_phrases:
  - "phase 017 canon hardening"
  - "bundleRules vocabulary reconciliation"
  - "parent hub canon hardening"
importance_tier: "high"
contextType: "implementation"
status: "Draft"
parent: "skilled-agent-orchestration/124-sk-code-parent"
phase: "017"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/124-sk-code-parent/017-canon-hardening"
    last_updated_at: "2026-07-05T00:00:00Z"
    last_updated_by: "gpt-5.5"
    recent_action: "Phase planned and documented"
    next_safe_action: "Start T001 canon source inventory"
---
# Feature Specification: Phase 17 canon hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

Phase 017 plans the shared parent-hub canon hardening pass before downstream hubs copy or enforce conflicting shapes. The phase is moderate risk because it touches the shared parent-skill validator while deep-loop-workflows already has exactly 26 strict failures, so validator changes must be additive and tolerant.

**Key Decisions**: use one canonical `bundleRules[]` shape; keep validator migration-safe.

**Critical Dependencies**: `parent-skill-check.cjs` serves sk-code, sk-design, and deep-loop-workflows; deep-loop failure count must not increase.

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P0 |
| **Status** | Draft |
| **Created** | 2026-07-05 |
| **Branch** | `system-speckit/028-memory-search-intelligence` |
| **Parent** | `skilled-agent-orchestration/124-sk-code-parent` |
| **Phase** | 017 |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The parent-hub canon is defined, but its live router template, schema reference, and validator do not speak one `bundleRules` vocabulary. The master plan identifies conflicting shapes: template `when` / `primary` / `surfaces`, schema `whenPrimary` / `includeSurfaces`, and validator `modes` / `primary` / `evidence`; the same section also flags sk-code's stale `surfacePackets` field, 3-part registry/router versions, and three placeholder metadata fields.

### Purpose
Plan a narrow canon hardening pass that makes the parent-hub template, schema, validator, and sk-code reference metadata self-consistent while preserving current strict checker outcomes for sk-code and not increasing deep-loop's 26 known failures.

### Evidence Base
- Master plan lines 38-47: phase 017 deliverables, collision warning, and verification target.
- Audit digest lines 49-51: x:sk-doc-canon confirms the canon core is usable but the template, schema, and validator need self-consistency repairs.
- Audit digest lines 69-79: category rollup includes 24 canon-gap findings and 12 collision-risk findings.
- Current source read: `parent_skill_hub_router_template.json` uses `when`, `primary`, and `surfaces`; `parent_hub_router_schema.md` uses `whenPrimary` and `includeSurfaces`; `parent-skill-check.cjs` reads `modes`, `primary`, and `evidence`.

<!-- /ANCHOR:problem -->
---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Reconcile `bundleRules[]` to one canonical field vocabulary across the parent hub router template, schema doc, and validator.
- Plan a tolerant validator update that recognizes legacy field names during migration without adding new deep-loop strict failures.
- Rename sk-code `extensions.surface-axis.surfacePackets` to `surfaces`.
- Bump sk-code `mode-registry.json` and `hub-router.json` from 3-part versions to 4-part versions.
- Remove three stale `"internal design notes"` placeholder fields from sk-code `description.json` and `graph-metadata.json`.
- Fix template-to-schema-to-validator self-consistency gaps flagged by x:sk-doc-canon.

### Out of Scope
- Implementing phase 015 sk-design alignment or phase 018 deep-loop alignment.
- Promoting parent-skill-check checks 5-9 from migration warnings to strict failures; phase 019 owns that gated promotion after all three hubs pass.
- Editing deep-loop registry files while live-agent context-deprecation work is hot.
- Running metadata generation or memory backfill from this planning packet.

### Files to Change During Execution

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/sk-doc/assets/skill/parent_skill_hub_router_template.json` | Update | Replace template bundleRules example with the chosen canonical field names |
| `.opencode/skills/sk-doc/references/skill_creation/parent_hub_router_schema.md` | Update | Align schema examples and prose to the same bundleRules shape |
| `.opencode/commands/doctor/scripts/parent-skill-check.cjs` | Update | Add migration-tolerant canonical bundleRules validation without increasing existing hub failures |
| `.opencode/skills/sk-code/mode-registry.json` | Update | Rename `surfacePackets` to `surfaces` and bump to a 4-part version |
| `.opencode/skills/sk-code/hub-router.json` | Update | Bump to a 4-part version and optionally encode sk-code surface bundle rules after canon vocabulary is settled |
| `.opencode/skills/sk-code/description.json` | Update | Remove stale `merger_spec_folder: "internal design notes"` placeholder |
| `.opencode/skills/sk-code/graph-metadata.json` | Update | Remove stale `merger_packet` and `motion_dev_packet` placeholder fields |

<!-- /ANCHOR:scope -->
---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Choose and apply one `bundleRules[]` vocabulary | `parent_skill_hub_router_template.json`, `parent_hub_router_schema.md`, and `parent-skill-check.cjs` all document or validate the same canonical fields; source: master plan lines 38-40 and audit digest lines 49-51 |
| REQ-002 | Keep validator migration-safe | Validator changes accept legacy fields as aliases while preferring the canonical shape; deep-loop strict failure count is unchanged or reduced, never increased; source: master plan lines 45-46 and audit digest lines 3-5 |
| REQ-003 | Rename sk-code surface extension field | `mode-registry.json` uses `extensions.surface-axis.surfaces` instead of `surfacePackets`; source: master plan line 41 and parent hub template line 56 forbids a second packet array |
| REQ-004 | Remove stale placeholder metadata fields | `description.json` no longer has `merger_spec_folder`; `graph-metadata.json` no longer has `merger_packet` or `motion_dev_packet`; source: master plan line 43 and current sk-code metadata reads |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Bump sk-code registry and router versions to 4-part form | `mode-registry.json` and `hub-router.json` versions are four-part release-hub versions; source: master plan line 42 and parent hub template lines 96-110 |
| REQ-006 | Repair x:sk-doc-canon self-consistency gaps | Template, schema, and validator examples no longer contradict each other for router policy, bundle rules, and surface naming; source: master plan line 44 and audit digest lines 49-51 |
| REQ-007 | Preserve sk-code strict green status | `PARENT_HUB_CHECK_STRICT=1` parent-skill-check remains green for sk-code; source: master plan line 46 and audit digest lines 42-43 |
| REQ-008 | Record the bundleRules decision | `decision-record.md` names the selected field shape, alternatives, trade-offs, and rollback; source: user prompt line 5 |

<!-- /ANCHOR:requirements -->
---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A future executor can implement the canon hardening without choosing between three incompatible `bundleRules[]` field vocabularies.
- **SC-002**: sk-code remains the strict green reference hub after the registry/router naming and version cleanup.
- **SC-003**: deep-loop-workflows does not gain any new parent-skill-check failures from validator hardening.
- **SC-004**: All three stale `"internal design notes"` placeholders are gone from sk-code metadata.
- **SC-005**: The docs, template, and validator speak the same surface-bundle terminology.

### Acceptance Scenarios
- **Scenario 1**: Given a surface bundle rule for `review`, when the template, schema, and validator are checked, then all three accept the same fields: `name`, `whenPrimary`, `includeSurfaces`, optional `whenAll`, and `outcome`.
- **Scenario 2**: Given sk-code has surface packets, when parent-skill-check strict runs, then it still reports sk-code as passing.
- **Scenario 3**: Given deep-loop has existing strict failures, when the updated validator runs, then its failure count does not increase because legacy or absent bundleRules fields are not newly punished.
- **Scenario 4**: Given sk-code metadata is inspected, when placeholder fields are searched, then no `"internal design notes"` values remain in the three named fields.

<!-- /ANCHOR:success-criteria -->
---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Shared validator change | A stricter parser could add failures to deep-loop or sk-design during migration | Make validation additive and alias-tolerant; compare before/after fail counts |
| Dependency | Phase 016 sk-code content work | Hub-root metadata refresh may overlap registry/router version and naming decisions | Land phase 017 naming/version decisions before or with phase 016 hub-root refresh |
| Dependency | Phase 019 validator promotion | Checks 5-9 cannot become hard migration failures until all hubs pass | Keep this phase limited to consistency hardening, not policy promotion |
| Risk | BundleRules overfitting | Canon could encode sk-code-specific surface behavior too narrowly | Document generic surfaceBundle fields and validate mode references only |

<!-- /ANCHOR:risks -->
---

<!-- ANCHOR:nfr -->
## 7. NON-FUNCTIONAL REQUIREMENTS

### Maintainability
- **NFR-M01**: The final canon uses one human-readable bundle rule vocabulary across template, schema, and validator.

### Reliability
- **NFR-R01**: Verification includes sk-code strict pass and deep-loop failure-count comparison.

### Compatibility
- **NFR-C01**: Validator parsing remains tolerant of legacy `primary`, `surfaces`, `modes`, and `evidence` fields during the migration window.

<!-- /ANCHOR:nfr -->
---

<!-- ANCHOR:edge-cases -->
## 8. EDGE CASES

### Data Boundaries
- Rules with only workflow modes should still validate through `whenAll` and `outcome: "orderedBundle"`.
- Rules with a workflow primary and surfaces should validate through `whenPrimary`, `includeSurfaces`, and `outcome: "surfaceBundle"`.

### Error Scenarios
- A bundle rule referencing an unknown mode should still fail or warn through check 5f.
- A hub without `bundleRules[]` should not fail solely because the field is absent.

### Concurrent Operations
- Deep-loop mode-registry edits remain gated by live-agent context-deprecation work; this phase must not require direct deep-loop file edits.

<!-- /ANCHOR:edge-cases -->
---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 18/25 | Seven named files across sk-doc canon, shared validator, and sk-code reference metadata |
| Risk | 20/25 | Shared validator can affect all parent hubs |
| Research | 14/20 | Requires reconciling audit evidence and live template/schema/validator source |
| Multi-Agent | 8/15 | Must coordinate around phase 016, phase 018, and phase 019 sequencing |
| Coordination | 12/15 | Deep-loop fail-count guard and migration-window behavior are load-bearing |
| **Total** | **72/100** | **Level 3** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Validator change increases deep-loop strict failures | High | Medium | Capture baseline count and require unchanged-or-reduced count after changes |
| R-002 | Template and schema still disagree after patch | Medium | Medium | Include explicit grep/read review for `bundleRules`, `whenPrimary`, `includeSurfaces`, `primary`, `surfaces`, `modes`, and `evidence` |
| R-003 | Version bump conflicts with phase 016 metadata refresh | Medium | Medium | Sequence version decision first and keep phase 016 prose refresh additive |

---

## 11. USER STORIES

### US-001: Canon Maintainer (Priority: P0)

**As a** parent-hub canon maintainer, **I want** one bundleRules field shape, **so that** templates, schema docs, and validators do not teach different contracts.

**Acceptance Criteria**:
1. Given the router template, schema doc, and validator, when bundleRules fields are compared, then they use the same canonical names or explicitly tolerated aliases.

---

### US-002: Hub Implementer (Priority: P1)

**As a** hub implementer copying sk-code, **I want** the sk-code registry/router and metadata to match the canon, **so that** new hubs do not inherit stale fields or 3-part versions.

**Acceptance Criteria**:
1. Given sk-code metadata and router files, when the canon hardening is implemented, then surface naming, versions, and placeholder fields match the published parent-hub rules.

---

<!-- ANCHOR:questions -->
## 12. OPEN QUESTIONS

- Should phase 017 encode declarative sk-code bundleRules immediately after reconciling the shape, or leave only the generic canon and let phase 016/015 add concrete hub rules?

<!-- /ANCHOR:questions -->
---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
