---
title: "Implementation Plan: Parent Set-String Playbook"
description: "The operator-facing contract for what actually gets set as the objective: a short pointer plus the completion criteria copied out, because no stop evaluator opens the referenced file."
trigger_phrases:
  - "set string playbook"
  - "goal pointer"
  - "completion criteria copied"
  - "stop evaluator"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/004-parent-set-string-playbook"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the playbook and its worked example"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/references/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-042-004-parent-set-string-playbook"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Completion criteria are copied into the set string because evaluators do not read the file"
---

# Implementation Plan: Parent Set-String Playbook

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown reference |
| **Framework** | Spec-kit reference surface |
| **Storage** | None |
| **Testing** | A worked example measured against the smallest documented cap |

### Overview
The playbook fixes what an operator types: a pointer to the packet's goal document, the binding and precedence wording, and the completion criteria copied out because no evaluator opens the file. A worked example is drawn from a real packet so the shape is concrete.
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
Documentation only. Enforcement lives in the phase 2 rule; this phase covers the part no validator can see.

### Key Components
- **Set-string shape**: pointer, binding wording, copied completion criteria
- **Precedence rule**: parent decisions outrank child detail; child detail outranks parent summary
- **Worked example**: drawn from a real packet

### Data Flow
An operator reads the playbook, copies the shape, fills the pointer and the criteria from the packet's goal document, and sets that string.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Goal document shape (policy) | Established by phase 1 | unchanged | Consumed, not redefined |
| This phase (consumer) | Reads or documents that shape | update | Verified by the criteria in acceptance-criteria.md |

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

Read the shape phase 1 established and the contract surrounding this change, and capture a before-state so the same check proves the after.

### Phase 2: Implementation

Build the behaviour this phase owns, keeping absence silent and existing packets untouched.

### Phase 3: Verification

Run the negative control, confirm each violation is named, and confirm an unrelated packet's result is unchanged.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The behaviour this phase adds | A worked example measured against the smallest documented cap |
| Integration | The packet end to end | `validate.sh --strict` |
| Manual | Read the result as an operator would | Rendered output |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 1 goal document shape | Internal | Yellow | This phase cannot land before it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: this phase disturbs packets that carry no goal document.
- **Procedure**: revert this phase's files; nothing else depends on them.
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
| Setup | Low | Read the shape and the surrounding contract |
| Core Implementation | Medium | The behaviour this phase owns |
| Verification | Low | Negative control plus the packet gate |
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

