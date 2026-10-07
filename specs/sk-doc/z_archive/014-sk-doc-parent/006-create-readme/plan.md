---
title: "Implementation Plan: Build create-readme packet (install-guide variant folded)"
description: "Reconstructed Level 1 implementation plan for phase 006 of the sk-doc monolith-to-parent-hub conversion. It restates the spec.md purpose, scope and requirements; the original plan was never written."
trigger_phrases:
  - "sk-doc create readme packet plan"
  - "sk-doc parent phase 006 plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Build create-readme packet (install-guide variant folded)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown references and templates, Python audit script and symlinks under `.opencode/skills/sk-doc/create-readme/` |
| **Framework** | sk-doc two-tier parent-hub conversion; install-guide folded as a README lifecycle variant |
| **Storage** | Not recorded |
| **Testing** | Facade resolution checks; `validate.sh` for this folder |

### Overview
Phase 006 builds the create-readme packet: the readme_creation.md and install_guide_creation.md references, the readme template set including the install-guide template, and the packet-unique audit_readmes.py. Install-guide stays a variant of the same README-authoring lifecycle, matching the existing folder-readme route.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 shared/ backbone + facades landed
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
- create-readme/ SKILL.md + README.md + changelog/
- references/{readme_creation,install_guide_creation}.md
- assets/readme/* (incl install_guide_template)
- scripts/audit_readmes.py + inward symlinks

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Setup
- [ ] Confirm the phase 004 backbone and facades landed

### Phase 2: Build
- [ ] Build the packet shell (SKILL.md, README.md, changelog/)
- [ ] Land the README and install-guide references and the readme assets
- [ ] Land audit_readmes.py and the inward symlinks; establish the root facade if 001 confirms an external ref

### Phase 3: Verification
- [ ] Confirm the audit script and asset facades resolve unchanged
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
| Phase 004 shared/ backbone + facades | Internal | Not recorded | The packet consumes shared standards and validators |
| Phase 001 deep-research rulings | Internal | Not recorded | This phase's scope may shift |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->
