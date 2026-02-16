<!-- SPECKIT_LEVEL: 3 -->
# Task 02 — SKILL.md & References Audit

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Parent Spec** | 130 — Memory Overhaul & Agent Upgrade Release |
| **Task** | 02 of 07 |
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-16 |
| **Depends On** | None (parallel with Tasks 01, 03, 04) |
| **Blocks** | Task 05 (Changelog Updates) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## Purpose

Audit all SKILL.md files (9 total) and system-spec-kit reference files to ensure version numbers, feature descriptions, and cross-references reflect the post-implementation state of specs 014–016 and 122–129.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:scope -->
## Scope

### SKILL.md Files (P0)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/skill/system-spec-kit/SKILL.md` | Version (should reflect post-v2.2.18.0 state), 5-source discovery, 7 intents, upgrade-level workflow, auto-populate workflow, anchor tag script, check-placeholders.sh |

### SKILL.md Files (P1) — Other Skills

| File | Key Audit Points |
|------|-----------------|
| `.opencode/skill/workflows-documentation/SKILL.md` | Version number, cross-references |
| `.opencode/skill/workflows-code--opencode/SKILL.md` | Version number, cross-references |
| `.opencode/skill/workflows-code--web-dev/SKILL.md` | Version number, cross-references |
| `.opencode/skill/workflows-code--full-stack/SKILL.md` | Version number, cross-references |
| `.opencode/skill/workflows-git/SKILL.md` | Version number, cross-references |
| `.opencode/skill/workflows-chrome-devtools/SKILL.md` | Version number, cross-references |
| `.opencode/skill/mcp-code-mode/SKILL.md` | Version number, cross-references |
| `.opencode/skill/mcp-figma/SKILL.md` | Version number, cross-references |

### Reference Files (P0)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/skill/system-spec-kit/references/memory/memory_system.md` | 5 sources, 7 intents, schema v13, document-type scoring |
| `.opencode/skill/system-spec-kit/references/memory/readme_indexing.md` | 5-source pipeline (not 4) |
| `.opencode/skill/system-spec-kit/references/memory/save_workflow.md` | Spec docs row in source table |

### Reference Files (P1)

| File | Key Audit Points |
|------|-----------------|
| `.opencode/skill/system-spec-kit/references/structure/sub_folder_versioning.md` | upgrade-level.sh references (spec 124), check-anchors.sh |
| `.opencode/skill/system-spec-kit/references/templates/level_specifications.md` | Auto-populate workflow (spec 128), level escalation criteria |
| `.opencode/skill/system-spec-kit/references/templates/template_guide.md` | Anchor tag conventions (spec 129), CORE + ADDENDUM structure |
| `.opencode/skill/system-spec-kit/references/workflows/quick_reference.md` | Complete workflow listing including upgrade-level, auto-populate, check-placeholders |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:audit-criteria -->
## Audit Criteria

### SKILL.md Checks

1. **Version number**: system-spec-kit SKILL.md should reference the latest version (post-v2.2.18.0)
2. **Feature completeness**: All features from specs 122–129 mentioned
   - 5-source discovery pipeline
   - 7 intent types (find_spec, find_decision)
   - Schema v13 with document types
   - Document-type scoring multipliers
   - upgrade-level.sh workflow
   - AI auto-populate workflow
   - check-placeholders.sh verification
   - Anchor tag conventions (spec 129, if implemented)
3. **Cross-references**: Links to reference files and README resolve correctly

### Reference File Checks

1. **memory_system.md**: Must describe 5 sources (not 4), list all 7 intents, reference schema v13
2. **readme_indexing.md**: Must describe 5-source pipeline with spec folder documents as 5th source
3. **save_workflow.md**: Must include spec documents row in the content source table
4. **sub_folder_versioning.md**: Must reference upgrade-level.sh and its capabilities
5. **level_specifications.md**: Must reference auto-populate workflow for spec upgrades
6. **template_guide.md**: Must reference anchor tag conventions
7. **quick_reference.md**: Must list all current workflows including new ones from specs 124, 128, 129
<!-- /ANCHOR:audit-criteria -->

---

<!-- ANCHOR:output -->
## Expected Output

The implementer should populate `changes.md` with:
- One section per file requiring changes
- Each section listing the specific content to update
- Before/after text for each change
- Priority (P0/P1/P2) for each change
<!-- /ANCHOR:output -->

---

<!-- ANCHOR:acceptance -->
## Acceptance Criteria

1. All 9 SKILL.md files audited
2. All 7 reference files audited
3. system-spec-kit SKILL.md reflects all specs 122–129 features
4. All reference files consistent with current implementation
5. changes.md has no placeholder text
<!-- /ANCHOR:acceptance -->

---

## Related Documents

- **Parent**: [../spec.md](../spec.md)
- **Checklist**: [checklist.md](checklist.md)
- **Changes**: [changes.md](changes.md)
