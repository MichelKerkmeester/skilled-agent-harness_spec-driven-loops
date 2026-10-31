---
title: "Feature Specification: Correct the graph metadata backfill command in the spec folder write recipe"
description: "Step 5 of the spec folder write recipe passed --root to the graph metadata backfill, which exits 1. The folder must be the positional argument."
trigger_phrases:
  - "fix write recipe backfill flag"
  - "step 5 of the spec folder write recipe"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Correct the graph metadata backfill command in the spec folder write recipe

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-09-28 |
| **Branch** | `main (no branch created)` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Step 5 of the spec folder write recipe refreshes a new packet's graph metadata with `backfill-graph-metadata.js --root <folder>`. In that script `--root` names the specs directory for an `--all` run, so a folder passed to it is not a target. The script exits 1 with "a target spec folder is required", and an author who follows the recipe stops at Step 5, before the strict validation gate.

### Purpose
The recipe's Step 5 command runs as written and refreshes the packet it names.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Pass the packet folder to the backfill command as its positional argument, the form the script's own usage header lists first.

### Out of Scope
- The `generate-description.js` command above it in Step 5 - it was not reported as failing, so it is left as it is.
- The script's flag handling - `--root` is correct for `--all`, and only the recipe misused it.
- The `version:` value in the recipe's frontmatter - the enforced gate checks presence and format only, and the advisory verify mode already reads stale across the corpus.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.skilled/skills/system-spec-kit/references/workflows/spec-folder-write-recipe.md` | Modify | Replace `--root <folder>` with `<folder>` in Step 5 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Step 5 backfill command takes the folder as its positional argument | The command text, copied from the recipe with a real folder and `--dry-run` added, exits 0 |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-002 | No other document under `.skilled` invokes the script with `--root <folder>` | A multi-line search for `--root` after the script name returns only the recipe before the fix and nothing after it |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The old form exits 1 and the corrected text exits 0 against the same folder.
- **SC-002**: `validate.sh --strict` on this packet prints `RESULT: PASSED`.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | The built `dist/graph/backfill-graph-metadata.js` | Low, the corrected command needs it just as the old one did | The dry-run in SC-001 loads it |
| Risk | Another copy of the wrong form exists outside `.skilled` | Low | The search covers `.skilled`, `.claude`, `.opencode` and the root rule files |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None. The script's usage header names the positional form.
<!-- /ANCHOR:questions -->

---
