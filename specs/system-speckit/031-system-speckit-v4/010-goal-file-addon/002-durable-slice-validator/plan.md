---
title: "Implementation Plan: Durable Slice Validator"
description: "A present-file rule that checks a goal document's shape: its durable and log headings, a binding block on phase parents, listed child paths that exist, and a durable slice within its character budget."
trigger_phrases:
  - "goal validator"
  - "durable slice cap"
  - "binding block check"
  - "child path existence"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/010-goal-file-addon/002-durable-slice-validator"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the rule and register it"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/"
    session_dedup:
      fingerprint: "sha256:e06210a4c302ee5c88c22aa6a860998fc8a15497971bb8dce6beaa7b45532de4"
      session_id: "2026-08-29-042-002-durable-slice-validator"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The cap applies to the durable slice only; a progress log is not a defect"
---

# Implementation Plan: Durable Slice Validator

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash rule module and a JSON registry entry |
| **Framework** | Validation orchestrator and its shell-rule bridge |
| **Storage** | None |
| **Testing** | A fixture packet driven through the rule directly |

### Overview
A present-file rule reads the goal document when it exists and reports shape violations. It measures the durable slice alone, so a growing progress log never trips it, and it verifies that any child path the parent lists resolves inside the packet.
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
- **Shape check**: durable and log headings present and distinguishable
- **Binding check**: a phase-parent document carries its binding block
- **Path check**: every listed child path resolves inside the packet
- **Budget check**: the durable slice measured on its own

### Data Flow
The orchestrator resolves the packet level, sources the rule, and the rule reads the goal document if present. Absent, it returns immediately with no finding.
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

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.

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
| Unit | The behaviour this phase adds | A fixture packet driven through the rule directly |
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

