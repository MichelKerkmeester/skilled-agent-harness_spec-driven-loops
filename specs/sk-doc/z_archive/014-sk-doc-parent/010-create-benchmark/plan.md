---
title: "Implementation Plan: Build-or-fold create-benchmark (PROVISIONAL)"
description: "Reconstructed Level 1 implementation plan for phase 010 of the sk-doc monolith-to-parent-hub conversion. It restates the spec.md purpose, scope and requirements; the original plan was never written."
trigger_phrases:
  - "sk-doc create benchmark packet plan"
  - "sk-doc parent phase 010 plan"
importance_tier: "normal"
contextType: "implementation"
---
> Reconstructed on 2026-10-07 from spec.md and git history. It was not written at the time.

# Implementation Plan: Build-or-fold create-benchmark (PROVISIONAL)

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference and benchmark templates, link-checker allowlist entries and symlinks under `.opencode/skills/sk-doc/` |
| **Framework** | sk-doc two-tier parent-hub conversion; build-or-fold branch settled by the 001 ruling |
| **Storage** | Not recorded |
| **Testing** | Link-checker reconciliation check; `validate.sh` for this folder |

### Overview
Phase 010 executes the 001 ruling for create-benchmark. If KEEP, it builds the packet with the benchmark_creation.md reference, the benchmark report and source templates, and inward symlinks. If FOLD, it moves the benchmark_creation.md and templates into the shared authoring guides and updates the check-markdown-links.cjs allowlist or preserves the assets/benchmark facade. The spec branches on the decision.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 004 shared/ backbone + facades landed
- [ ] The 001 build-or-fold ruling for create-benchmark is available

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
- create-benchmark/ packet OR shared fold (per 001)
- check-markdown-links.cjs allowlist reconciliation for benchmark templates
- changelog/ (if kept as packet)

### Data Flow
Not recorded.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

### Phase 1: Setup
- [ ] Confirm the phase 004 backbone and facades landed
- [ ] Read the 001 build-or-fold ruling for create-benchmark

### Phase 2: Build or Fold
- [ ] Execute the KEEP branch: packet shell plus benchmark_creation.md and templates with inward symlinks
- [ ] Or execute the FOLD branch: shared authoring guides plus allowlist reconciliation or facade preservation

### Phase 3: Verification
- [ ] Confirm the link checker resolves the benchmark template paths
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
| Phase 004 shared/ backbone + facades | Internal | Not recorded | Shared homes for a fold branch do not exist |
| Phase 001 build-or-fold ruling | Internal | Not recorded | The phase cannot pick its branch |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

N/A — record rollback steps beyond reverting the scoped change here.
<!-- /ANCHOR:rollback -->
