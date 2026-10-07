---
title: "Implementation Plan: Build doc-quality workflow packet (workflow-axis anchor)"
description: "Reconstructed Level 1 implementation plan for phase 012 of the sk-doc monolith-to-parent-hub conversion. It restates the spec.md purpose, scope and requirements; the original plan was never written."
trigger_phrases:
  - "sk-doc doc quality packet plan"
  - "sk-doc parent phase 012 plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Build doc-quality workflow packet (workflow-axis anchor)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown orchestration docs citing shared scripts and global references under `.opencode/skills/sk-doc/doc-quality/` |
| **Framework** | sk-doc two-tier parent-hub conversion; doc-quality is the workflow-axis anchor, analogous to the sk-design audit route |
| **Storage** | Not recorded |
| **Testing** | Existing-doc validate/score run; `validate.sh` for this folder |

### Overview
Phase 012 builds the doc-quality packet as the validate/score/optimize-an-existing-doc route. It is orchestration-only: the SKILL.md carries the extract, DQI, HVR and validate lifecycle and cites the shared scripts and global references. The packet owns no unique scripts or templates; the 001 ruling decides which global references are shared vocabulary and whether a /doc:quality command is warranted.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 shared/ backbone + facades landed
- [ ] The 001 global-reference home split is ruled

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
- doc-quality/ SKILL.md + README.md + changelog/
- DQI scoring + HVR-application procedure (extracted from monolith SKILL.md)
- Inward symlinks to the shared pipeline
- Global-references home-split decision applied

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Setup
- [ ] Confirm the phase 004 backbone and facades landed
- [ ] Confirm the 001 global-reference home split

### Phase 2: Build
- [ ] Build the packet shell (SKILL.md, README.md, changelog/)
- [ ] Extract the DQI/HVR procedure into the packet and symlink the shared pipeline inward
- [ ] Apply the global-references home-split decision

### Phase 3: Verification
- [ ] Confirm the cited shared scripts and references resolve unchanged
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
| Phase 004 shared/ backbone + facades | Internal | Not recorded | The packet cites shared scripts and references |
| Phase 001 global-references ruling | Internal | Not recorded | The home split of the global references is unsettled |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->
