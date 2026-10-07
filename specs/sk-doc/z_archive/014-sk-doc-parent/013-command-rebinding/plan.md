---
title: "Implementation Plan: Repoint the 7 /create command YAMLs + README.txt"
description: "Reconstructed Level 1 implementation plan for phase 013 of the sk-doc monolith-to-parent-hub conversion. It restates the spec.md purpose, scope and requirements; the original plan was never written."
trigger_phrases:
  - "sk-doc command rebinding plan"
  - "sk-doc parent phase 013 plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Repoint the 7 /create command YAMLs + README.txt

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Command YAML pairs and Markdown router prose under `.opencode/command/create/` |
| **Framework** | sk-doc two-tier parent-hub conversion; the tightest external coupling is the command path literals |
| **Storage** | Not recorded |
| **Testing** | Per-command runtime smoke check for missing-path breaks; `validate.sh` for this folder |

### Overview
Phase 013 repoints the tightest coupling surface: each of the 7 create commands is a thin router loading auto.yaml/confirm.yaml pairs with hardcoded sk-doc path literals and no fallback resolution. The per-packet asset and reference paths move to their new child homes and shared paths, the README.txt reference table is regenerated, and the folder_readme error-handler string is fixed. It lands as one atomic commit that also flips the self-hosting parent_skill_* template references, while preserving the shared-backbone facades.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phases 005 through 012 landed the packet homes and shared paths
- [ ] The facade set from phase 004 is in place

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
- 7 repointed auto.yaml/confirm.yaml pairs
- Regenerated commands/create/README.txt reference table
- sk-skill-parent.md router prose repoint
- Atomic self-hosting-safe repoint commit
- Per-command runtime smoke check (no missing-path breaks)

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Setup
- [ ] Confirm phases 005 through 012 landed and the phase 004 facades are in place

### Phase 2: Repoint
- [ ] Repoint the 7 command YAML pairs to the new child homes and shared paths
- [ ] Regenerate the README.txt reference table and fix the folder_readme error-handler string
- [ ] Flip the self-hosting parent_skill_* template references in the same change

### Phase 3: Verification
- [ ] Run the per-command runtime smoke check for missing-path breaks
- [ ] Run `validate.sh` for this folder
- [ ] Confirm the shared-backbone facades still resolve
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
| Phases 005-012 packet homes and shared paths | Internal | Not recorded | There are no new target paths to repoint to |
| Phase 004 facade set | Internal | Not recorded | Preserved facades keep shared scripts resolving |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->
