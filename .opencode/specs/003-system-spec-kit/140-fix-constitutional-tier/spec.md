# Feature Specification: Fix Constitutional Tier Misclassification

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-02-21 |
| **Branch** | `140-fix-constitutional-tier` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
595 out of 597 "constitutional" tier memories in the Spec Kit Memory database were SESSION SUMMARY entries incorrectly classified as constitutional. The `extractImportanceTier()` function in `memory-parser.ts` scanned the entire file content with a regex, matching `importanceTier: 'constitutional'` from an HTML comment block in `context_template.md` (line 77) before reaching the actual YAML metadata block (line ~714). This caused every memory generated from that template to be indexed as constitutional instead of its real tier.

### Purpose
Correct the parser to ignore HTML comment content when extracting importance tiers, and re-tier the 595 misclassified database rows to restore an accurate tier distribution.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Strip HTML comments from file content before running the importance tier regex
- Apply the fix to both the TypeScript source and compiled JavaScript dist
- Bulk SQL UPDATE to re-tier 595 SESSION SUMMARY rows from `constitutional` to `normal`
- Unit tests covering the specific bug scenario and related edge cases

### Out of Scope
- Changes to `context_template.md` — the template comment blocks are valid instructional content
- Any changes to how constitutional tier is assigned for legitimately constitutional memories
- Changes to other parser functions not related to tier extraction

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skill/system-spec-kit/mcp_server/lib/parsing/memory-parser.ts` | Modify | Strip HTML comments before regex match in `extractImportanceTier()` |
| `.opencode/skill/system-spec-kit/mcp_server/dist/lib/parsing/memory-parser.js` | Modify | Compiled equivalent of the TypeScript fix |
| `.opencode/skill/system-spec-kit/mcp_server/dist/database/context-index.sqlite` | Modify | SQL UPDATE: 595 rows from `constitutional` → `normal` |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Parser ignores HTML comment blocks when extracting tier | HTML comment containing `importanceTier: 'constitutional'` does not affect returned tier |
| REQ-002 | Fix applied to both source and dist | Both `.ts` and `.js` files updated consistently |
| REQ-003 | 595 misclassified rows re-tiered in SQLite database | `constitutional` count drops from 597 to ≤5; `normal` count increases accordingly |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Unit tests confirm correct behaviour | 6 tests pass covering comment stripping, YAML extraction, and real template pattern |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `constitutional` tier count in database drops from 597 to ≤5 (only legitimately constitutional entries remain)
- **SC-002**: Parser correctly extracts tier from YAML metadata block, ignoring any comment blocks
- **SC-003**: All 3071 embeddings remain in success state (no data loss)
- **SC-004**: 6 unit tests pass
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | SQL UPDATE on live database | Data loss if WHERE clause incorrect | Verified row count before executing; backup implicit via git |
| Risk | Dist file diverging from source | Runtime behaviour differs from source | Applied equivalent change to both files manually |
| Dependency | SQLite database | Must be accessible for re-tiering | Database confirmed accessible at known path |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None. Fix is implemented and verified.
<!-- /ANCHOR:questions -->

---

<!--
CORE TEMPLATE (~80 lines)
- Essential what/why/how only
- No boilerplate sections
- Add L2/L3 addendums for complexity
-->
