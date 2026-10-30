---
title: "Implementation Plan: Phase 7: docs-and-changelogs"
description: "Document /doctor:sk-skill on the root README, the command index, the doctor scripts README and the sk-create-skill docs, add playbook scenarios and a catalog entry, then write one changelog per touched skill through create-changelog and rerun the five doc gates."
trigger_phrases:
  - "docs and changelogs plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 7: docs-and-changelogs

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs, generated JSON manifests |
| **Framework** | sk-doc modes: create-readme, create-manual-testing-playbook, create-feature-catalog, create-changelog |
| **Storage** | None |
| **Testing** | `validate_document.py`, `check_readme_references.py`, sk-create-skill CI scripts |

### Overview
This phase writes the docs for the shipped command and one changelog per touched skill. Each doc goes through the sk-doc mode that owns its type. The five doc gates from design phase 7 prove nothing broke.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified: phases 2 and 6 closed, and the list of skills each phase changed is recorded in `scratch/touched-skills.md` — phase 2 is closed, phase 6 is being built in parallel, so the convert docs describe the behavior its spec and the script state rather than a landed route

### Definition of Done
- [ ] All acceptance criteria met — open on the two changelog criteria the conductor owns
- [x] The five gates in spec REQ-005 exit 0 and each changelog link in spec section 3 resolves with `ls`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Docs follow shipped code.

### Key Components
- **Doc surfaces**: README, command index, scripts README, sk-create-skill docs, playbook and catalog.
- **Changelog index**: `.skilled/changelog/` links into each skill's real `changelog/` folder; create-changelog writes through them.

### Data Flow
The touched-skills list from phases 1 to 6 selects the changelog targets; create-changelog computes each next version and writes the entry; the sk-doc metadata generator then refreshes the leaf manifest the new docs changed.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: documentation phase, not a fix. The generated surfaces below are listed so they are not missed.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/sk-doc/leaf-manifest.json` | Lists sk-doc leaf docs | update (generated) | `ci-leaf-manifest-freshness.cjs` exit 0 |
| `.skilled/bin/lib/compiled-routing/013-live-activation/activation/sk-doc/manifest.json` | Compiled-routing activation | update only on drift | its freshness check exit 0 |

Required inventories:
- Same-class producers: `rg -n "/doctor:ci" README.md .skilled/commands/README.txt` shows where each doctor command is listed.
- Consumers of changed symbols: `rg -n "convert-in-place|no convert" .skilled/skills/sk-doc`.
- Matrix axes: skill by "When" condition in the changelog table.
- Algorithm invariant: N/A.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup records the touched skills, Implementation edits the docs and writes the changelogs, and Verification runs the doc gates and resolves every link.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each new doc against its type rules | `validate_document.py --type changelog|playbook_feature|feature_catalog` |
| Integration | Links, root metadata, leaf manifest, derived blocks, intent signals | `check_readme_references.py`, `ci-skill-root-metadata.cjs`, `ci-leaf-manifest-freshness.cjs`, `ci-skill-derived-freshness.cjs`, `generate-router-intent-signals.cjs --check` |
| Manual | Follow one new playbook scenario end to end | Agent runtime |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 2 and 6 | Internal | Yellow | The docs would describe behavior that does not ship |
| create-changelog mode | Internal | Green | Entries would be hand-written |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a doc gate fails after the edits, or a changelog lands under the wrong component.
- **Procedure**: Revert the phase commit and rerun `ci-skill-root-metadata.cjs --fix --skill sk-doc` so the generated manifest matches the reverted docs.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 2 and 6 closed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase 10 |
<!-- /ANCHOR:phase-deps -->

---

