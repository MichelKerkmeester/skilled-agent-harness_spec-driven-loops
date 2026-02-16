<!-- SPECKIT_LEVEL: 3 -->
# Task 06 — Root README Update

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Parent Spec** | 130 — Memory Overhaul & Agent Upgrade Release |
| **Task** | 06 of 07 |
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-02-16 |
| **Depends On** | Task 05 (Changelog Updates) |
| **Blocks** | Task 07 (GitHub Release) |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:purpose -->
## Purpose

Specify required updates to the project root `/README.md` to ensure all statistics, feature descriptions, and component references reflect the post-alignment state after spec 130 implementation.
<!-- /ANCHOR:purpose -->

---

<!-- ANCHOR:scope -->
## Scope

### Audit Targets in `/README.md`

| Section | Approximate Location | Key Audit Points |
|---------|---------------------|-----------------|
| Key Statistics table | ~lines 41–51 | Agent count, skill count, command count, template count, test count — all numbers must be accurate |
| "How It All Connects" diagram | ~lines 55–80 | Component count accuracy, correct labeling |
| Memory Engine description | ~lines 90–120 | Must reference 5 sources (not 4), 7 intents (not 5), document-type scoring |
| Spec Kit description | ~lines 130–160 | Must mention upgrade-level.sh, auto-populate workflow, anchor tags, check-placeholders.sh |
| Agent System description | ~lines 170–200 | Must reference 10 agents across 3 platforms (OpenCode, Claude Code, Codex) |
| Version badge/reference | Header area | Should reflect release version (v2.1.0) |

### Specific Checks

1. **Statistics table**: Count all agents (8 per platform × 3 = 24 configs, 8 unique agents + 2 workflow variants = 10), skills (9), commands, templates
2. **Memory Engine**: "5 content sources" not "4", "7 intent types" not "5", mention document-type scoring with multipliers
3. **Spec Kit**: Feature list should include upgrade-level.sh (L1→L2→L3→L3+), AI auto-populate workflow, check-placeholders.sh, anchor tag conventions
4. **Agent System**: "10 specialized agents across 3 platforms" — verify agent names and platform coverage
5. **Diagram**: Verify all components referenced in the ASCII flowchart match current architecture
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:output -->
## Expected Output

The implementer should populate `changes.md` with:
- Each section of README.md requiring updates
- Current (before) text
- Required (after) text
- Rationale for each change
<!-- /ANCHOR:output -->

---

<!-- ANCHOR:acceptance -->
## Acceptance Criteria

1. All statistics in Key Statistics table verified accurate
2. Memory Engine description references 5 sources and 7 intents
3. Spec Kit description includes all post-128 features
4. Agent count and platform coverage accurate
5. Version badge updated to release version
6. changes.md has no placeholder text
<!-- /ANCHOR:acceptance -->

---

## Related Documents

- **Parent**: [../spec.md](../spec.md)
- **Checklist**: [checklist.md](checklist.md)
- **Changes**: [changes.md](changes.md)
- **Dependency**: [../task-05-changelog-updates/changes.md](../task-05-changelog-updates/changes.md)
