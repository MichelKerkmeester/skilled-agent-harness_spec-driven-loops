---
title: "Implementation Plan: Phase 3: alignment-fixes"
description: "Fix each in-scope finding of the two alignment runs at its source file, verify every claim against live output, then rerun the phase 2 gates and the alignment recheck."
trigger_phrases:
  - "alignment fixes plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 3: alignment-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, YAML, TypeScript tests |
| **Framework** | Skilled skills, doctor commands, skill advisor |
| **Storage** | None |
| **Testing** | vitest, `node --test` through `run-all.sh`, playbook and document validators |

### Overview
The two runs left 61 findings, many of them the same line seen by two lanes. Each distinct fix lands in the file that states the stale fact, and each new expected string comes from a live advisor run, not from a lane's paraphrase.
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
- [x] `run-all.sh` prints `7 suite(s) passed, 0 failed`, and the advisor and spec-kit vitest match the phase 2 counts plus the new cases
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: documentation and metadata alignment, with pin tests.

### Key Components
- **Workflow YAML headers**: the `skill_owner` field each doctor workflow declares.
- **Playbook scenarios**: the expected brief lines and state paths an operator checks.
- **Skill router**: the stage-two intent map a request reaches after the advisor picks the skill.

### Data Flow
The advisor hook renders a brief from the command rows. The scenarios quote that brief, so they follow the rows that phase 1 regenerated.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill_owner` in doctor workflows | Declares the owning skill; no script reads it | update | `grep -n '^skill_owner' .skilled/commands/doctor/assets/*.yaml` |
| Brief head and companion labels in `render.ts` | Producer of the strings the scenarios quote | unchanged | live hook runs and `doctor-brief-render.vitest.ts` |
| `typedCommandForTop` and `withholdLoopHubOnWritingAbout` | Owner-keyed gates that moved with the rows | unchanged, pinned | the two new vitest cases |
| `release-update.cjs` state constants | Producer of the paths DOC-409 checks | unchanged | `sed -n 20,30p` of the engine |

Required inventories:
- Same-class producers: `rg -n '^skill_owner' .skilled/commands/doctor/assets` found the seven, and the other 20 already named system-skilled-doctor.
- Consumers of changed symbols: `rg -n skill_owner` finds no reader outside the YAML assets.
- Matrix axes: brief head (owner, command, policy word) by scenario, four scenarios.
- Algorithm invariant: N/A, no parser or resolver changes.
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
| Unit | The two owner-keyed gates and the provenance scan | vitest |
| Integration | Doctor suites, the advisor and spec-kit suites, phrase reach, bridges | `run-all.sh`, vitest, `doctor-phrase-reach.cjs` |
| Manual | The four routing scenarios' hook commands | the UserPromptSubmit hook from `dist/` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Built advisor runtime in the worktree | Internal | Green | No live brief to quote |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate that drops below the phase 2 final state.
- **Procedure**: `git checkout -- <file>` for the file that caused it; the phase is uncommitted until the operator asks.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phases 1 and 2 committed | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
