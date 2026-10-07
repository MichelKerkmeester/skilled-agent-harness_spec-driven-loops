---
title: "Implementation Plan: Build shared/ doc-quality backbone + facade symlinks"
description: "Reconstructed Level 1 implementation plan for phase 004 of the sk-doc monolith-to-parent-hub conversion. It restates the spec.md purpose, scope and requirements; the original plan was never written."
trigger_phrases:
  - "sk-doc shared backbone plan"
  - "sk-doc parent phase 004 plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Build shared/ doc-quality backbone + facade symlinks

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown references, Python/JavaScript validator scripts and symlink facades under `.opencode/skills/sk-doc/` |
| **Framework** | sk-doc two-tier parent-hub conversion; shared/ backbone in front of per-packet content |
| **Storage** | Not recorded |
| **Testing** | Facade resolution checks for external consumers; `validate.sh` for this folder |

### Overview
Phase 004 populates `shared/` as the single source of truth: the generic validator scripts move into `shared/scripts/`, the cross-cutting global refs and frontmatter_versioning move into `shared/references/`, and the frontmatter/llms.txt/template_rules.json/flowchart assets move into `shared/assets/`. The critical root facades are established so external consumers resolve with zero edits, and `shared/` carries no graph-metadata.json or description.json.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 hub scaffold landed
- [ ] Phase 001 deep-research rulings available

### Definition of Done
- [ ] Deliverables exist and validate; canon invariants preserved
- [ ] `validate.sh` passes for this folder
- [ ] Zero external-coupling breakage introduced by this phase (facades resolve)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not recorded — the technical approach was to be finalized from the 001 deep-research rulings when the phase was worked.

### Key Components
- shared/scripts/ (7 canonical validators)
- shared/references/global/ + frontmatter_versioning
- shared/assets/ (frontmatter, llms.txt, template_rules.json, flowcharts/*)
- Root facade symlinks (scripts + frontmatter_templates)
- shared/README.md

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Setup
- [ ] Confirm the phase 003 hub scaffold landed

### Phase 2: Backbone
- [ ] Move the 7 canonical validator scripts into shared/scripts/
- [ ] Move the global references and frontmatter_versioning into shared/references/
- [ ] Move the shared assets into shared/assets/
- [ ] Establish the root facade symlinks and write shared/README.md

### Phase 3: Verification
- [ ] Confirm external consumers resolve unchanged
- [ ] Run `validate.sh` for this folder
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

N/A — record any testing beyond the verification tasks in `tasks.md` here.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 001 deep-research rulings | Internal | Not recorded | This phase's scope may shift |
| Phase 003 hub scaffold | Internal | Not recorded | The hub tree the backbone lands in does not exist |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->
