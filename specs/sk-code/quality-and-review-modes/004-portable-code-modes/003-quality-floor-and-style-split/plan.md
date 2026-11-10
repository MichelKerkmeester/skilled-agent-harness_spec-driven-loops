---
title: "Implementation Plan: Phase 3: quality-floor-and-style-split"
description: "Give each universal floor rule an id and an override mark, cut the style guide to universal rules and move the house style, the JavaScript and CSS checklists and the checklist map into sk-code-skilled, proven by tests that fail before the change."
trigger_phrases:
  - "quality floor and style split plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: quality-floor-and-style-split

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, Node.js CommonJS tests |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, the sk-code drift guards, the playbook validator |

### Overview

The floor tables gain an Id and an Override column, and a test in the shared linter suite compares the FIXED marks with `rule-overrides.json`. The house rules leave the floor and the style guide for sk-code-skilled's references and checklists. The three JavaScript and CSS checklists move under sk-code-skilled and become SKILLED declaration rows, so this repository's SKILLED files keep them while any other repository stops getting them. The checklist map moves to sk-code-skilled with its test.
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
- [x] The quality suite, the sk-code-skilled suite and the shared suite report `fail 0`, and the drift guards print PASS for all four guards
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Universal rules in one place, house rules with the surface that chose them, and declarations as the only source of which checklist applies.

### Key Components
- **`code-quality-standards.md`**: the floor tables with Id and Override columns and the precedence pointer to the contract.
- **`code-style-guide.md`**: the universal style rules, with pointers to the surface for each house choice.
- **`mode-registry.json` SKILLED rows**: the three JavaScript and CSS checklists, now under `sk-code-skilled/assets/checklists/js-css-style/`.
- **`sk-code-skilled/SKILL.md` section 5**: this repository's checklist map, rendered from the quality defaults and the registry.

### Data Flow

The runner reads the quality defaults and each surface's `quality.checklists`. With the three extension rows gone from the defaults, a `.js` or `.css` file gets them only through the SKILLED declaration, which applies only when SKILLED resolves for the file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Universal floor | Add-only, house rules inside | update: ids, marks, precedence, house rows out | Floor id test passes, `rg "adds rules"` finds nothing |
| Quality style guide | SKILLED style, always loaded | update: universal rules only | `rg "MODULE:\|__tests__\|Prettier"` finds nothing in it |
| Quality defaults | Three `.js`/`.css` rows | update: rows retired | Map test "no house-style row" passes |
| SKILLED surface | House checklists | update: receives moved rules, files and map | `--explain` sample unchanged, map test passes |
| Hub router and leaf manifest | Route the old paths | update: route the new paths | Router-sync legs 1a to 4 PASS |
| Phase 002 and 004 files | Hygiene checker, explain path | not touched | `git status` lists no file of theirs |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the baselines, Implementation makes the moves in the order floor, style guide, checklists, pointers, tests, and Verification reruns every suite and guard and compares `--explain` before and after.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The floor ids and marks against `rule-overrides.json`, the checklist map against the declarations | `node --test` |
| Integration | F21: a foreign repository's `.js` file through the real runner | `node --test` |
| Manual | `--explain` on SKILLED sample files before and after | `quality-gate.cjs --explain` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-shared-rule-contract` | Internal | Green | The ids would have no grammar or floor to match |
| `generate-leaf-manifest.cjs` | Internal | Green | Router-sync leg 3 would fail on the moved files |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A SKILLED file loses a checklist, or another repository is blocked by a rule it cannot see.
- **Procedure**: Revert the phase commit, then regenerate the leaf manifest and the Hermes copies. The quality defaults and the registry rows return together, so no checklist is listed twice.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->
