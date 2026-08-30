---
title: "Implementation Plan: Checklist Deprecation Closure"
description: "Repoint the acceptance-coverage advisory at the document it counts from, correct the traceability-source precedence the tasks/checklist merge left backwards, and give the rule its first unit suite."
trigger_phrases:
  - "ac coverage evidence source"
  - "traceability precedence"
  - "canonical criteria read"
  - "checklist deprecation"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/004-checklist-deprecation-closure"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Planned the coverage-source fix against the merge that caused the split"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/"
    session_dedup:
      fingerprint: "sha256:c7d7aec6c043552789fb917ca7cbcf4239000694670e2f164072dc48df413df3"
      session_id: "2026-08-29-033-004-checklist-deprecation-closure"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "One parser serves the count and the evidence read, so they cannot disagree"
---

# Implementation Plan: Checklist Deprecation Closure

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash rule module |
| **Framework** | Validation orchestrator and its shell-rule bridge |
| **Storage** | None |
| **Testing** | Fixture packets driven through the rule, asserting the reported ratio |

### Overview
The advisory reads its evidence from whichever document it counted its total from. When `acceptance-criteria.md` exists that is the canonical table's Verification column; otherwise it keeps the legacy traceability read, with the merged tasks document preferred over the pre-merge checklist. A retired criterion is exempt from citation because the closure gate already verifies the decision record behind it.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Registry-bridged shell rule, matching every other rule in the set: the registry binds id and severity, the orchestrator sources the module and reads its result variables.

### Key Components
- **Canonical read**: evidence taken from the criteria table's Verification column
- **Single parser**: the total and the covered count come from one pass, so they cannot disagree about which rows are criteria
- **Header binding**: `AC-ID`, `Verification` and `Status` are located by name, not by position
- **Legacy fallback**: the merged tasks document first, the pre-merge checklist second

### Data Flow
The orchestrator resolves the packet level and sources the rule. When the packet carries a criteria document, one awk pass yields both the row count and the covered count; otherwise the legacy traceability read runs unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `_ac_count_total` (producer) | Counts from the canonical document | unchanged | Already repointed by phase 2 |
| `_ac_analyze_traceability` (consumer) | Read evidence from a different document | update | Canonical read added alongside it |
| `_ac_traceability_file` (resolver) | Preferred the pre-merge document | update | Precedence asserted by three suite cases |
| `_ac_lifecycle_active` (gate) | Required a legacy table to activate | update | Canonical-only packet is measured |

Required inventories:
- Same-class producers: `rg -n '<field|string|helper|literal|error-pattern>' <module-or-files>`.
- Consumers of changed symbols: `rg -n '<changedSymbol>|<changedConstant>|<changedPublicField>' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: list every independent input axis and the required rows before implementation.
- Algorithm invariant: for path/redaction/parser/resolver/security fixes, state the invariant and adversarial cases.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`; it owns the Setup, Implementation, and Verification phase checkboxes and task state.

### Phase 1: Setup

Read the merge that deprecated the checklist document and the rule that outlived it, and capture the reported ratio before the change so the same reading proves the after.

### Phase 2: Implementation

Point the evidence read at the counted document, correct the legacy precedence, and widen activation so a canonical packet is measured.

### Phase 3: Verification

Run the suite, confirm the prose case still scores zero, and confirm a pre-merge packet resolves to the same source it always did.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The reported ratio, per evidence shape | `scripts/tests/check-ac-coverage.sh` |
| Integration | The packet end to end | `validate.sh --strict` |
| Manual | Read the result as an operator would | Rendered output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `AC_CLOSURE` verifies waiver decision records | Internal | Green | Shipped in phase 2; the citation exemption rests on it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a packet's reported coverage moves for a reason other than where its evidence is written.
- **Procedure**: revert `check-ac-coverage.sh`. The advisory is `info` and gates nothing, so a revert changes reported numbers and no verdict.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Config) ───┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Config |
| Config | Setup | Core |
| Core | Setup, Config | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | Read the rule against the merge that caused the split |
| Core Implementation | Medium | Canonical read, precedence, activation |
| Verification | Low | Suite plus a live run across five packets |
| **Total** | | **Part of one session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Backup created (if data changes)
- [ ] Feature flag configured
- [ ] Monitoring alerts set

### Rollback Procedure
1. Stop relying on this phase's behaviour; nothing else reads it
2. Revert this phase's files together
3. Re-run the packet gate and confirm the prior result
4. Note the reversal in the packet changelog

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A. No existing packet is rewritten.
<!-- /ANCHOR:enhanced-rollback -->

---

