---
title: "Implementation Plan: Phase 2: current-state-discipline [template:level_1/plan.md]"
description: "Broaden the current-state content rule to more long-lived docs as an advisory check; reuse the existing fence-aware scanner."
trigger_phrases:
  - "implementation"
  - "plan"
  - "name"
  - "template"
  - "plan core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/028-peck-teachings-adoption/003-current-state-discipline"
    last_updated_at: "2026-06-02T10:04:53Z"
    last_updated_by: "planning-author"
    recent_action: "Authored phase plan (planned, not implemented)"
    next_safe_action: "Implement: extend the content scanner + register advisory rule"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-current-state-discipline"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 2: current-state-discipline

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash rule script + JSON registry |
| **Framework** | system-spec-kit validation rules |
| **Storage** | None |
| **Testing** | `validate.sh` on fixtures + existing tracks |

### Overview
Reuse the existing fence-aware content scanner that powers PHASE_PARENT_CONTENT, point it at more
long-lived docs (implementation-summary.md, non-parent spec.md), register it at WARNING severity, and
document it. The check is advisory: it flags stale-history narrative without hard-blocking ordinary work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Validation rule. Additive advisory check layered on the existing scanner.

### Key Components
- **Content scanner**: `check-phase-parent-content.sh` (reused) or a sibling script.
- **Registry**: `validator-registry.json` entry at severity `warn`.
- **Docs**: `validation_rules.md` rule entry + exemption list.

### Data Flow
`validate.sh` invokes the rule; the rule scans the targeted docs (skipping fenced/comment regions and exempt files) and emits warnings citing the offending lines.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches shared validation policy, so the affected surfaces are tracked here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-phase-parent-content.sh` | Scans phase-parent spec.md for history narrative | Extend to more doc types (or add sibling) | Fixture doc warns; exempt docs do not |
| `validator-registry.json` | Registers rules + severity | Add the advisory rule at `warn` | Rule appears; severity is warn |
| `validate.sh` callers + completion gate | Run the rule suite | Observe new warnings only | Existing tracks gain no new errors in normal mode |

Required inventories:
- Consumers of the rule suite: confirm the completion gate's strict invocation behavior, since WARNING becomes ERROR under `--strict` (see spec open questions).
- Exemptions: decision-record.md and changelog/ must be excluded before rollout.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Study the existing scanner's fence/comment-aware logic
- [ ] Decide the exact doc set in scope and the exemptions
- [ ] Draft the token list + test fixtures

### Phase 2: Core Implementation
- [ ] Extend the scanner to the new doc types (or add a sibling rule)
- [ ] Register the rule in validator-registry.json at `warn`
- [ ] Document the rule + exemptions in validation_rules.md

### Phase 3: Verification
- [ ] Fixture with history tokens emits a warning; exempt docs and fenced examples do not
- [ ] Existing tracks gain no new errors in normal mode
- [ ] Update phase docs + changelog
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Token match + fence/comment skipping | Fixture docs |
| Regression | No new errors on existing tracks | `validate.sh` |
| Exemption | decision-record/changelog ignored | Fixture docs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Existing content scanner | Internal | Green | Reuse avoids reinventing fence-awareness |
| validator-registry.json | Internal | Green | Rule would not be invoked |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Excessive false positives, or the advisory rule unexpectedly blocks under strict.
- **Procedure**: `git revert` the scanner change and remove the registry entry. No data migration involved.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
