---
title: "Implementation Plan: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor"
description: "Mask an executor alias that names the owner of a hook, plugin, extension, adapter or guard before the delegation resolver matches aliases, then prove it with the alignment probes and advisor_validate against today's numbers."
trigger_phrases:
  - "runtime name implementation routing plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Route implementation prompts that name a runtime surface to the code skill, not the CLI executor

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, compiled to `runtime/dist` |
| **Framework** | None: the advisor's own scorer |
| **Storage** | None |
| **Testing** | vitest, `advisor_validate`, `run-probes.cjs` |

### Overview
The change sits in `executor-delegation.ts`, the post-fusion override that lifts a CLI executor when a prompt hands work to it. Before matching aliases, the resolver masks any alias followed within two words by a surface noun, so "the Claude Code Stop hook" stops reading as a hand-off. The probes, the vitest suite and `advisor_validate` prove it against the numbers measured before the edit.
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
- [ ] `run-probes.cjs` prints at least `pass=7`, and `advisor_validate` prints full corpus and holdout counts at or above 158/195 and 30/40
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Post-fusion override

### Key Components
- **`resolveExecutorDelegation`**: decides whether a prompt hands work to an executor. It gains the surface mask.
- **`executor-delegation-cases.json`**: the parity fixture that pins delegation decisions.

### Data Flow
The fusion scorer ranks skills, then `applyExecutorDelegationOverride` calls the resolver on the lowercased prompt. With the mask, a surface mention never reaches alias matching, so the fused ranking stands unless a separate hand-off names an executor.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `resolveExecutorDelegation` | Owns the hand-off decision | update | executor-delegation vitest and parity fixture |
| `applyExecutorDelegationOverride` | Calls the resolver after fusion | unchanged | same tests; it reads only the resolver's result |
| Advisor hook and CLI | Show the routed skill | not a consumer of the change itself | `advisor_recommend` on the probe prompts |

Algorithm invariant: a mask removes only an alias that is followed, within two words and no sentence punctuation, by hook, plugin, extension, adapter or guard. Adversarial cases: a hand-off cue beside a surface ("use codex to fix the Claude Code Stop hook"), a surface with no alias ("the Stop hook"), and an alias with no surface ("ask Claude Code to review this").
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | `resolveExecutorDelegation` surface and hand-off cases | vitest |
| Integration | The full corpus, holdout and parity slices | `advisor_validate` |
| Manual | The eleven alignment probes through the CLI | `run-probes.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `runtime/dist` build | Internal | Green | The CLI scores the old build until `npm run build` runs |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: `advisor_validate` drops below 158/195 or 30/40, or a real hand-off stops routing to its executor.
- **Procedure**: revert the commit and run `npm run build` in `.skilled/skills/system-skill-advisor/runtime`.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup: baselines | Nothing | Implementation |
| Implementation: mask and tests | Setup | Verification |
| Verification: probes and validate | Implementation and a rebuilt dist | Closing the packet |
<!-- /ANCHOR:phase-deps -->

---
