---
title: "Implementation Plan: Phase 7: docs-and-closeout"
description: "Bring every contract, reference, command doc, catalog, playbook and changelog in line with what phases 003 to 005 shipped, then verify the whole packet and write the closure record."
trigger_phrases:
  - "docs closeout plan"
  - "changelog and version bumps"
  - "closure record"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 7: docs-and-closeout

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML frontmatter |
| **Framework** | sk-doc authoring contracts, spec-kit templates |
| **Storage** | None |
| **Testing** | `validate_document.py`, `hvr_scan.py`, `check-frontmatter-versions.sh`, `parent-skill-check.cjs`, `validate.sh --strict --recursive` |

### Overview
Each earlier phase wrote its own reference docs as it closed. This phase reconciles what is left: the command docs, the catalog and playbook entries, the changelogs with their version bumps, two stale claims about strict mode, and the final packet validation. It adds no behavior.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: phases 003 to 005 built

### Definition of Done
- [ ] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Documentation reconciliation. Every claim a doc makes is checked against the code that shipped.

### Key Components
- **Contract text**: `sk-create-frontmatter`'s templates and the spec-kit key table, which phase 003 already updated.
- **Rule reference**: `validation-rules.md`, with one section per shipped rule.
- **Command docs**: the `/speckit:*`, `/deep:*` and `/doctor:speckit` docs, each naming the check it now runs.
- **Release record**: one changelog entry per changed skill, with the matching `SKILL.md` version.

### Data Flow
The code is the source. Docs are checked against it, and the changelog summarizes the docs.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Two stale doc claims are fixed here. Both said strict mode fails on warnings.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `runtime/lib/validation/orchestrator.ts` | Sets `passed` and the exit code | Unchanged, the source of truth | `passed: summary.errors === 0`, exit 0 when passed |
| `system-spec-kit/ARCHITECTURE.md` | Describes strict mode | Update | `validate_document.py` result matches HEAD |
| `references/workflows/spec-folder-write-recipe.md` | Tells writers what strict needs | Update | `validate_document.py` VALID |

Required inventories:
- Same-class producers: `rg -i 'warnings? (as|count as) (errors|failures)'` over spec-kit and command docs finds only these two.
- Consumers of changed symbols: none, since no symbol changed.
- Matrix axes: not applicable.
- Algorithm invariant: not applicable.
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
| Doc structure | Every doc edited in the program | `validate_document.py` |
| Voice | Every changelog entry | `hvr_scan.py` |
| Versions | Every changed skill | `check-frontmatter-versions.sh`, `parent-skill-check.cjs` for the sk-doc hub |
| Packet | The whole packet | `validate.sh --strict --recursive` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 003 to 005 closed | Internal | Green | Docs would describe the wrong state |
| The commit that carries the program | Operator | Yellow, held by root D4 | Each edited doc's fourth version digit waits for it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A doc describes behavior that did not ship.
- **Procedure**: Nothing is committed, so `git restore` on the doc puts it back.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──► Phase 2 (Docs and changelogs) ──► Phase 3 (Verify and close)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 003 to 005 | Docs |
| Docs and changelogs | Setup | Verify |
| Verify and close | Docs | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Under an hour |
| Docs and changelogs | Medium | Two to three hours |
| Verification | Low | One hour, most of it the CLI suite |
| **Total** | | **Three to five hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes): not applicable, no data changes
- [x] Feature flag configured: not applicable, docs only
- [x] Monitoring alerts set: not applicable, docs only

### Rollback Procedure
1. `git restore` the doc that is wrong.
2. Rerun `validate_document.py` on it.
3. Rerun `validate.sh --strict --recursive` on the packet.
4. Nothing is user-facing until the operator commits.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
