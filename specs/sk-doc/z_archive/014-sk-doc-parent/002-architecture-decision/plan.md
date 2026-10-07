---
title: "Implementation Plan: Architecture decision: registry, router, shared/symlink, advisor plan"
description: "Reconstructed Level 1 implementation plan for phase 002 of the sk-doc monolith-to-parent-hub conversion. It restates the spec.md purpose, scope and requirements; the original plan was never written."
trigger_phrases:
  - "sk-doc architecture decision plan"
  - "sk-doc parent phase 002 plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Architecture decision: registry, router, shared/symlink, advisor plan

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown decision record plus the registry/router JSON schema it locks under `.opencode/skills/sk-doc/` |
| **Framework** | sk-doc two-tier parent-hub conversion; phase 002 converts the phase 001 research into locked decisions |
| **Storage** | Not recorded |
| **Testing** | `validate.sh` for this folder; operator review sign-off before build phases begin |

### Overview
Phase 002 locks the hub architecture from the 001 findings in a decision record: the finalized mode-registry and hub-router schemas, the shared/ versus per-packet split, the symlink facade topology, the graph-metadata rewrite plus description.json plan, the zero-extension confirmation, and the atomic command-repoint sequencing that survives the self-hosting hazard. Build phases 003 and later begin only after operator review sign-off.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 001 research and canon rulings available

### Definition of Done
- [ ] Deliverables exist and validate; canon invariants preserved
- [ ] `validate.sh` passes for this folder
- [ ] Operator review sign-off on the decision record before build phases begin
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Not recorded — the architecture is the subject of the decision record this phase produces (`decision-record.md`).

### Key Components
- decision-record.md — final packet set, registry and router schema, extensions, routingClass rationale
- shared/symlink plan (canonical-in-shared, symlink-inward; the 4 critical facades)
- graph-metadata + description.json + advisor-booster rewrite spec
- Command-repoint sequencing plan (atomic, self-hosting-safe)
- backendKind + vocabularyClasses discriminator vocabulary

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Setup
- [ ] Confirm the phase 001 deep-research rulings and canon are available

### Phase 2: Decide
- [ ] Author the decision record (packet set, registry/router schema, facade map)
- [ ] Lock the shared/ split, graph-metadata rewrite and command-repoint sequencing

### Phase 3: Verification
- [ ] Run `validate.sh` for this folder
- [ ] Record operator review sign-off before the build phases begin
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
| Phase 001 deep-research rulings | Internal | Not recorded | There are no findings to lock into decisions |
| Operator review sign-off | External | Not recorded | Build phases 003 and later do not begin |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->
