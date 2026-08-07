---
title: "Feature Specification: sk-doc manual-testing-playbook snippet template migration"
description: "Migrate the 32 sk-doc manual-testing-playbook snippet files to the v1.8.0.11 snippet template shape while preserving the routing-gold contract fields the topology gate requires: normalize frontmatter, restructure sections to the per-feature scaffold, and document the routing-gold fields the template currently omits."
trigger_phrases:
  - "playbook snippet template migration"
  - "manual-testing-playbook alignment"
  - "sk-doc playbook snippet reformat"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/027-playbook-snippet-template-migration"
    last_updated_at: "2026-08-06T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Migration applied and committed; authoring packet docs"
    next_safe_action: "Run validate.sh --strict on the packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-027-playbook-snippet-template-migration"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-doc manual-testing-playbook snippet template migration

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | In Progress |
| **Created** | 2026-08-06 |
| **Branch** | `skilled/v4.0.0.0` |
| **Predecessor** | None |
| **Successor** | None |
| **Handoff Criteria** | All 32 snippets carry the template shape and pass the conformance scan, the topology gate stays `valid=32 blocked=0`, the skill-benchmark corpus still exposes 32 scenarios, and no test content was invented for the minimal files |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 32 per-feature snippet files under `.opencode/skills/sk-doc/manual-testing-playbook/` drifted from the snippet template (`sk-create-manual-testing-playbook/assets/manual-testing-playbook-snippet-template.md`). They sat in a stalled partial migration across four distinct shapes and carried legacy frontmatter, an old 9-column TEST EXECUTION table, non-canonical H2 sections, and a mislabeled SOURCE METADATA header. They still passed the routing-gold contract that governs them (`validate-playbook-topology.cjs`), so nothing was functionally broken, but no gate caught the template drift.

### Purpose
Bring all 32 files to the template's per-feature scaffold without changing any behavior the routing-gold or skill-benchmark contracts depend on. The template itself omitted the routing-gold frontmatter fields the topology gate requires, so this packet also documents those fields in the template.

**End goal:** 32 conformant snippets, both playbook gates green, no invented test content, and a template that documents the routing-gold genre.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Restructure all 32 snippet files under `manual-testing-playbook/` to the per-feature scaffold.
- Normalize frontmatter per the verified field map below.
- Edit the snippet template to document the routing-gold fields it omitted.
- Author packet 027 documentation.

### Out of Scope
- Any behavior change to the topology validator, the skill-benchmark loader, or the package validator.
- Reclassifying any scenario's `stage`.
- Inventing commands, expected signals, or evidence for the 13 minimal files.
- Other skills' playbooks and the root `manual-testing-playbook.md` content.

### Verified Frontmatter Field Map

| Field | Action | Why |
|-------|--------|-----|
| `id`, `title`, `version`, `expected_intent`, `expected_resources` | keep | identity and loader-read |
| `expected_workflow_mode`, `expected_leaf_resources`, `route_shape`, `evidence_*` | keep | required by the topology and compiled-routing validators |
| `stage` | keep, or add `routing` when absent | loader defaults absent to `routing`, so `routing` preserves behavior |
| `description` | add | template-required, 0/32 had it |
| `category` | drop | loader derives category from the directory basename and root index |
| `created`, `expected_token_range_input`, `expected_token_range_output` | drop | 0 consumers |

### Four Shapes Migrated

| Shape | Count | Handling |
|-------|-------|----------|
| Full-old (9-col table + extra H2s + `## 4. SOURCE METADATA` mislabel) | 18 | 9-column row plus Setup block to prose subsections; supplemental sections folded into `Optional Supplemental Checks`; add `SOURCE FILES`; renumber metadata |
| Minimal (`## Scenario Contract` only) | 8 | Scaffold; TEST EXECUTION carries the real prompt and a prompt-only note |
| Minimal + `## Purpose` | 5 | Same; `Purpose` folded into `OVERVIEW` |
| Variant (`COMMAND SEQUENCE` / `Pass/Fail Criteria`) | 1 | `COMMAND SEQUENCE` mapped to TEST EXECUTION |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Topology gate stays green | `validate-playbook-topology.cjs` reports `valid=32 blocked=0` after migration |
| REQ-002 | Skill-benchmark corpus intact | The package validator still counts 32 scenarios, none dropped, no stage reclassified |
| REQ-003 | Frontmatter matches the field map | 32/32 carry `description` and `stage`; 0/32 carry `category`, `created`, or `expected_token_range_*` |
| REQ-004 | Section structure matches the scaffold | 32/32 carry `## 4. SOURCE FILES` and `## 5. SOURCE METADATA`; 0/32 carry the old 9-column table |
| REQ-005 | No invented content | Every command, expected signal, and evidence line traces to pre-migration content; minimal files state prompt-only |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | Template documents routing-gold fields | The snippet template scaffold describes `expected_workflow_mode` and `expected_leaf_resources` as required for routing-gold corpus files |
| REQ-007 | Root-index bijection intact | Every migrated file is referenced by the root index and vice versa |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Both playbook gates stay green (topology `valid=32 blocked=0`; package validator `violations=0`).
- **SC-002**: The conformance scan reports 32/32 on `description`, `stage`, `## 4. SOURCE FILES`, `## 5. SOURCE METADATA`, and 0/32 on the dropped fields and the old table.
- **SC-003**: A diff review of the minimal files shows no invented commands, signals, or evidence.
- **SC-004**: `validate.sh --strict` on packet 027 reports Errors 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Dropping a load-bearing field | Green gate turns red | Field map verified against real consumers; blacklist drop; re-run topology |
| Risk | Reclassifying `stage` | Benchmark scoring changes | Only `routing` (the loader default) added to stage-less files |
| Risk | Inventing test detail for minimal files | Fabricated scenarios | Prompt-only note, no commands or evidence |
| Risk | Hostile working tree deletes files mid-run | Lost work | Migration applied, staged, and committed in tight succession |
| Dependency | Template omitted routing-gold fields | Files could not strictly match the template | REQ-006 template edit closes the gap |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Operator selected full reformat of the 18 content-rich files, a template edit for the routing-gold fields, and faithful scaffolding of the 13 minimal files with no invented content.
<!-- /ANCHOR:questions -->
