---
title: "Implementation Plan: Per-Mode Naming Conformance"
description: "Add a shared kebab conformance check reachable by every generating sk-doc mode, wire the existing catalog/playbook checker, re-anchor create-quality-control to the canon, and reconcile create-benchmark doc drift — sequenced after Phase 1's shared reconcile."
trigger_phrases:
  - "per-mode conformance plan"
  - "shared kebab checker"
  - "mode naming plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/022-naming-standard-hardening/002-per-mode-naming-conformance"
    last_updated_at: "2026-07-20T10:13:27Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase-002 plan for per-mode kebab conformance"
    next_safe_action: "Break the plan into tasks and sequence after phase 001"
    blockers: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Per-Mode Naming Conformance

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3 (guards/checkers), Markdown (mode docs) |
| **Framework** | sk-doc mode workflows; existing guard scripts |
| **Storage** | None |
| **Testing** | pytest (existing guard/checker tests) |

### Overview
Give every generating sk-doc mode a kebab conformance check for its artifacts and align the remaining mode docs to the canon. The preferred approach is one shared authored-name checker the prose-only modes invoke, rather than a bespoke check per mode, to keep the enforcement surface small and consistent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 1 (shared standard reconciled, guards wired) is complete
- [ ] The shipped-underscore-root dependency is understood and sequenced
- [ ] Shared-checker vs per-mode-check decision is recorded

### Definition of Done
- [ ] A generated snake_case name is flagged for every generating mode
- [ ] create-quality-control cites the canon; a filename-case signal appears in its output
- [ ] create-benchmark doc drift reconciled; cosmetic template fixed
- [ ] `validate.sh --strict` on this phase reports Errors: 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Shared checker invoked by modes (single source of enforcement), preferred over per-mode duplication.

### Key Components
- **Shared authored-name kebab checker**: one script/entry point that validates a generated artifact's basename/slug against `^[a-z0-9]+(?:-[a-z0-9]+)*$`, honoring the canon §3 exemptions; reachable by every generating mode's workflow.
- **`check_no_hyphenated_catalog_content.py`** (exists): wired into the create-feature-catalog and create-manual-testing-playbook workflows, scoped to new content.
- **create-quality-control docs**: re-anchored pointer + a filename-case conformance signal.

### Data Flow
A mode generates an artifact path → the shared checker validates the basename/slug against the kebab rule and exemptions → a violation blocks or reports per the mode's tier.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

The per-mode reconciliation touches doc pointers and a shared checker; it changes no scoring or rename logic.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| prose-only mode workflows (agent/readme/command/changelog/flowchart/benchmark) | State kebab in prose, no checker | Add invocation of the shared checker | A generated snake_case name is flagged per mode |
| create-quality-control README/SKILL | Cite stale `core-standards.md` | Re-anchor to `filesystem-naming-convention.md`; add signal | grep shows canon pointer; validation output shows filename-case signal |
| `check_no_hyphenated_catalog_content.py` | Correct but unwired | Wire into catalog/playbook workflows, scoped to new content | Runs on new content; does not red-flag shipped underscore roots |
| `model-benchmark-fixture-guide.md:67` | States underscore, contradicts disk | Correct to kebab; cite canon §6 | grep matches on-disk kebab dir |

Required inventories:
- Generating modes and their artifact-path rules: enumerated in the survey (spec.md §2).
- Consumers of the checker: each mode workflow that emits a filesystem name.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Shared checker
- [ ] Decide shared-checker vs per-mode-check (record in decision notes)
- [ ] Provide/identify the shared authored-name kebab checker with canon-§3 exemptions
- [ ] Make it reachable from each generating mode's workflow

### Phase B: Wire existing guards + reconcile docs
- [ ] Wire `check_no_hyphenated_catalog_content.py` into catalog/playbook workflows, scoped to new content
- [ ] Re-anchor create-quality-control to the canon; add a filename-case signal
- [ ] Fix `model-benchmark-fixture-guide.md:67`; cite canon §6 for the family-key exemption
- [ ] Fix the cosmetic counter-example in `skill-asset-template.md:691`

### Phase C: Verification
- [ ] Each generating mode flags a deliberate snake_case name
- [ ] No mode doc points at a snake_case filename rule
- [ ] `validate.sh --strict` Errors: 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Shared checker: kebab pass, underscore fail, exemptions honored | pytest |
| Integration | Catalog/playbook checker on new vs shipped-underscore content | pytest |
| Manual | Mode-doc pointers re-anchored; benchmark drift fixed | grep / read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 (shared standard + gate) | Internal | Green | Per-mode checks would reference an inconsistent canon |
| Shipped underscore content roots on disk | Internal | Yellow | Catalog guard must be scoped to new content or exclude them |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The catalog guard red-flags shipped underscore roots, or a mode-doc change breaks a workflow.
- **Procedure**: Revert the mode-doc edits and un-wire the checker; the shared checker is additive and can be disabled without affecting generation.
<!-- /ANCHOR:rollback -->
