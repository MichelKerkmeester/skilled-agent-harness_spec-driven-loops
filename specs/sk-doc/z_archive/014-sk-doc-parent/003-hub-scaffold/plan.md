---
title: "Implementation Plan: Scaffold the sk-doc parent hub skeleton"
description: "Reconstructed Level 1 implementation plan for phase 003 of the sk-doc monolith-to-parent-hub conversion. It restates the spec.md purpose, scope and requirements; the original plan was never written."
trigger_phrases:
  - "sk-doc hub scaffold plan"
  - "sk-doc parent phase 003 plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Scaffold the sk-doc parent hub skeleton

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown spec-kit docs plus JSON registries under `.opencode/skills/sk-doc/` |
| **Framework** | sk-doc two-tier parent-hub conversion, scaffolded via `/create:sk-skill-parent` |
| **Storage** | Not recorded |
| **Testing** | `validate.sh` for this folder; parent-skill-check.cjs baseline run |

### Overview
Phase 003 scaffolds the two-tier hub in place at `.opencode/skills/sk-doc/`: the hub SKILL.md router shell, mode-registry.json, hub-router.json, description.json, a rewritten graph-metadata.json keeping one identity, and the empty packet dirs plus the shared/ skeleton and hub companion dirs. No content migration happens in this phase; the parent_skill_* templates stay at their current monolith path until they move.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 deep-research rulings available
- [ ] Phase 002 architecture decision accepted

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
- Hub SKILL.md router shell (holds no per-mode logic)
- mode-registry.json + hub-router.json (validated bidirectional)
- description.json (new) + rewritten graph-metadata.json (one identity)
- Empty packet dirs + shared/ skeleton + hub companion dirs
- parent-skill-check.cjs baseline run (known gaps expected until content lands)

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Setup
- [ ] Confirm the phase 001 and 002 gates clear

### Phase 2: Scaffold
- [ ] Create the hub SKILL.md router shell and the registry/router JSON pair
- [ ] Create description.json and rewrite graph-metadata.json to one identity
- [ ] Create the empty packet dirs, shared/ skeleton and hub companion dirs

### Phase 3: Verification
- [ ] Run parent-skill-check.cjs as a baseline and record expected gaps
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
| Phase 002 architecture decision | Internal | Not recorded | The registry/router schema is not locked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->
