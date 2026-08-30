---
title: "Implementation Plan: Runtime-Neutral Goal Dispatch"
description: "Make the speckit goal offer dispatch by runtime instead of calling one runtime's tool, and make the stale-filename assertion path-specific so a spec document named goal.md stops colliding with it."
trigger_phrases:
  - "runtime neutral goal"
  - "goal offer dispatch"
  - "stale filename assertion"
  - "goal_prompt_choice"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/003-runtime-neutral-goal-dispatch"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase specification from the verified research"
    next_safe_action: "Author the dispatch table and tighten the assertion"
    blockers: []
    key_files:
      - ".opencode/commands/speckit/assets/"
    session_dedup:
      fingerprint: "sha256:d45628a51394ef5126cea487d85a030faa82050261aa6556196335e3f2b20aa8"
      session_id: "2026-08-29-042-003-runtime-neutral-goal-dispatch"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "The offer stays tool-free; only the set action dispatches, and it dispatches per runtime"
---

# Implementation Plan: Runtime-Neutral Goal Dispatch

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Command YAML and one CommonJS contract test |
| **Framework** | Speckit command surface |
| **Storage** | None |
| **Testing** | The existing goal-offer contract test |

### Overview
The set action gains a dispatch table keyed by runtime, so a runtime with a native goal surface uses it, one with a plugin uses that, and one with neither hands off rather than pretending. The stale-filename assertion narrows from a bare basename to the command path it guards.
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
Table-driven dispatch: the command declares the mapping and the runtime resolves it, rather than a single hard-coded tool call.

### Key Components
- **Dispatch table**: runtime to goal surface, with an explicit hand-off entry
- **Offer path**: unchanged and tool-free
- **Contract test**: assertion scoped to the command path rather than any occurrence of the name

### Data Flow
The command asks which runtime it is in, resolves the dispatch entry, and either calls that runtime's surface or hands off with an instruction. The offer path short-circuits before any of this.
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
| Unit | The behaviour this phase adds | The existing goal-offer contract test |
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

