---
title: "Implementation Plan: Phase 2: current-state-discipline"
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
    packet_pointer: "system-spec-kit/027-xce-research-based-refinement/001-research-and-doctrine/001-peck-teachings-adoption/003-current-state-discipline"
    last_updated_at: "2026-06-10T06:45:00Z"
    last_updated_by: "gpt-5.5-fast"
    recent_action: "Registered info current-state advisory"
    next_safe_action: "No follow-up; phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-scaffold/003-current-state-discipline"
      parent_session_id: null
    completion_pct: 100
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
Add a sibling fence-aware content scanner for `implementation-summary.md`, register it at INFO severity,
and document it. The check is advisory: it flags stale-history narrative without hard-blocking ordinary work.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks/checklist/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Validation rule. Additive advisory check layered on the existing scanner.

### Key Components
- **Content scanner**: `check-phase-parent-content.sh` (reused) or a sibling script.
- **Registry**: `validator-registry.json` entry at severity `info`.
- **Docs**: `validation_rules.md` rule entry + exemption list.

### Data Flow
`validate.sh` invokes the rule; the rule scans the targeted summary (skipping fenced/comment regions) and emits an INFO advisory citing the offending lines.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase touches shared validation policy, so the affected surfaces are tracked here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `check-current-state-discipline.sh` | Scans implementation summaries for history narrative | Add sibling rule script | Fixture doc emits info; fenced/commented examples do not |
| `validator-registry.json` | Registers rules + severity | Add the advisory rule at `info` | Rule appears; severity is info |
| `validate.sh` callers + completion gate | Run the rule suite | Observe info advisories only | Existing strict validation still exits 0 |

Required inventories:
- Consumers of the rule suite: confirmed INFO stays non-blocking under `--strict`.
- Exemptions: decision-record.md and changelog/ must be excluded before rollout.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Study the existing scanner's fence/comment-aware logic
- [x] Decide the exact doc set in scope and the exemptions
- [x] Draft the token list + test fixtures

### Phase 2: Core Implementation
- [x] Extend the scanner to the new doc types (or add a sibling rule)
- [x] Register the rule in validator-registry.json at `info`
- [x] Document the rule + exemptions in validation_rules.md

### Phase 3: Verification
- [x] Fixture with history tokens emits an info advisory; fenced/commented examples do not
- [x] Existing strict validation still exits 0
- [x] Update phase docs; parent changelog unchanged because it is outside the allowed write paths
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Token match + fence/comment skipping | Temporary fixture |
| Regression | No new errors on existing folder | `validate.sh --strict` |
| Exemption | decision records/changelogs ignored by scope | Rule docs and targeted scan |
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
