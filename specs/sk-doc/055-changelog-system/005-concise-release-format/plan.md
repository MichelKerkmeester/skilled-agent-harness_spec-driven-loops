---
title: "Implementation Plan: Phase 5: concise-release-format"
description: "Rewrite the changelog template, SKILL.md, references and both /create:changelog YAMLs so the expanded format is bounded and modeled on v4.0.1.0, then add a standalone shape gate with tests that blocks a draft past the ceilings."
trigger_phrases:
  - "concise release format plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 5: concise-release-format

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, YAML command assets, Python 3 standard library |
| **Framework** | sk-doc mode packet and the `/create:changelog` command |
| **Storage** | None |
| **Testing** | pytest through `.skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` |

### Overview
The template, `SKILL.md`, the two references, the README and both YAMLs take the ranked edits from `research/iteration-005.md` in research order, so length moves to the template's ceilings before any ceiling is added. A new `scripts/check_changelog_shape.py` then enforces five of those ceilings as errors, and the YAMLs run it on the draft before writing. The proof is the gate passing v4.0.1.0, failing the long `bc28fcbbba` version and passing the sk-doc suite.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] `bash .skilled/skills/sk-doc/scripts/tests/run-script-tests.sh` prints `all sk-doc script tests passed`, and the shape gate prints `PASS` on v4.0.1.0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Template plus standalone gate.

### Key Components
- **`assets/changelog-template.md`**: owns the format and the ceilings. Every other surface mirrors it.
- **`scripts/check_changelog_shape.py`**: reads one entry, strips the frontmatter, ignores fenced code and checks five rules against constants that equal the template's ceilings.

### Data Flow
`/create:changelog` step 4 assembles the draft from the template's slots. Step 5 writes the draft to a temp file and runs the gate. Exit 0 lets step 6 write the entry, and exit 1 sends the draft back to be cut at the H4 level.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `assets/changelog-template.md` | Producer of the format rules | update | `grep -n "Level {N}" assets/changelog-template.md` prints nothing |
| `create-changelog-auto.yaml`, `create-changelog-confirm.yaml` | The text the workflow runs | update | `yaml.safe_load` parses both, and the create assets tests pass 15 of 15 |
| `validate_document.py` | Changelog frontmatter and omission checks | unchanged | Owned by another session, so the gate is standalone |
| `ROUTER.md` of the mode | Routes markdown under `references/` and `assets/` | not a consumer | Its resource bases are `references` and `assets`, so `scripts/` needs no route |
| `leaf-manifest.json` of the hub | Lists each mode's markdown leaves | not a consumer | `ci-leaf-manifest-freshness.cjs` reports `checked=13 fresh=13` |

Required inventories:
- Same-class producers: `rg -n "List every change|seven at most|7 paragraphs|Adopt/Repoint/Drop|size of the exemplar|files_changed_count" .skilled/commands/create/assets .skilled/skills/sk-doc/sk-create-changelog` prints nothing after the edit.
- Consumers of changed symbols: `rg -n "style_reference|files_changed_count|section_count" . --glob '!specs/**'` finds only the two YAMLs and the presentation file.
- Matrix axes: format (compact or expanded) by rule (five rules) by side of the ceiling (at or past).
- Algorithm invariant: the gate counts only lines outside fenced code, and a compact entry never meets the expanded-only rules.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each gate rule at its ceiling and one past it, the fence exemption, the compact exemption and the exit codes | pytest, `test_check_changelog_shape.py` |
| Integration | The gate on v4.0.1.0, v4.0.0.0, the long `bc28fcbbba` version, the template skeletons and the worked examples | `check_changelog_shape.py` |
| Manual | The changed docs read in the HVR voice | `hvr_scan.py`, `validate_document.py` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Python 3 standard library | Internal | Green | None. The gate imports only `re`, `sys` and `pathlib` |
| pytest | External | Green | The suite could not run the gate tests |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the gate blocks an entry a reader needs at full length, or a ceiling proves wrong for a real release.
- **Procedure**: revert the one commit. To loosen a ceiling instead, change the template's length table and the matching constant in `check_changelog_shape.py` together, then rerun the suite.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The research and the operator decisions | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->

---
