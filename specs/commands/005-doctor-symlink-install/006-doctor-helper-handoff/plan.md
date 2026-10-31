---
title: "Implementation Plan: Phase 6: doctor-helper-handoff"
description: "Add a post-fusion scorer step that asks /doctor:helper's ranker about a prompt no doctor bridge matched, and passes the helper bridge when the ranker reads a doctor problem and the prompt carries a problem cue. Prove it on four corpora and the helper's held-out fixtures."
trigger_phrases:
  - "doctor helper handoff plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: doctor-helper-handoff

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (ESM), with a CommonJS doctor script loaded through `createRequire` |
| **Framework** | The skill advisor's lane-fusion scorer |
| **Storage** | None |
| **Testing** | vitest in `system-skill-advisor/runtime`, `node --test` for the doctor scripts |

### Overview
One new module, `lib/scorer/doctor-helper-handoff.ts`, loads `/doctor:helper`'s ranker from the workspace and reads the prompt's problem cue. One new step in `fusion.ts`, `applyDoctorHelperHandoff`, runs after the doctor ordering step and passes `command-doctor-helper` when no doctor bridge passes and the ranker reads a doctor problem. The proof is the advisor's routing-accuracy gates staying exact while the helper's held-out fixtures gain reach.
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
- [x] `npx vitest run` in `system-skill-advisor/runtime` prints `Test Files  159 passed (159)` and exits 0
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Post-fusion re-rank step

### Key Components
- **`doctor-helper-handoff.ts`**: loads `doctor-helper-match.cjs` once per workspace, reloads it when `_routes.yaml` changes, returns the ranker's first candidate at score 6 or more, and grades the prompt's problem cue as strong, weak or none.
- **`applyDoctorHelperHandoff` in `fusion.ts`**: decides whether the hand-off fires and places the helper bridge with the existing `keepPassingSkillsAboveDoctorBridges` ordering.

### Data Flow
The scorer ranks as before and applies the doctor anchor and ordering steps. The hand-off step then returns unchanged if a doctor bridge passes or a `/doctor:` command was typed. It also returns unchanged when a skill passes and the cue is not strong. Otherwise it asks the ranker. With no cue, it needs a ranker score of 10 or more. When it fires, the helper bridge passes at the confidence threshold and is reordered so a passing skill stays first.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `fusion.ts` `scoreAdvisorPrompt` | Owns the doctor anchor and ordering | update | Advisor suite, routing slice |
| `render.ts` brief | Prints the top pick and `Also:` doctor line | unchanged | Hook output for the DOC-406 prompts |
| Python fallback `skill_advisor.py` | Matches doctor bridges on typed commands only | not a consumer | `test_skill_advisor.py` 8 passed |
| Hook no-match hint (`SETUP_WORDING`) | Adds the `/doctor:setup` hint on a no-match | unchanged | DOC-389 and DOC-390 prompts print their recorded briefs |

Required inventories:
- Same-class producers: `rg -n "requireDoctorPhraseAnchor|keepPassingSkillsAboveDoctorBridges" .skilled/skills/system-skill-advisor/runtime/lib` lists the two existing doctor steps, both in `fusion.ts`.
- Consumers of changed symbols: `rg -n "surfaces only on its own wording|passes only on its own wording" .skilled` found the three docs this phase corrects.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup measures the gap, Implementation adds the module and the step, and Verification runs the corpora, the suites and the playbook scenario.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Cue tiers, the ranker bridge and the missing-script fallback | vitest, `tests/doctor-helper-handoff.vitest.ts` |
| Integration | End-to-end ranking for four prompts, and every advisor accuracy gate | vitest, `tests/doctor-routing-slice.vitest.ts` and the full suite |
| Manual | The hook brief for three prompts | DOC-406 in the central playbook |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `doctor-helper-match.cjs` (`loadEntries`, `rankProblem`) | Internal | Green | The hand-off returns no match and the ranking is unchanged |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routing-accuracy gate drops, or a brief shows `/doctor:helper` for a request with no problem in it.
- **Procedure**: Revert the commit. The step is one call in `fusion.ts` plus one new module, and no data or schema changes with it.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Implementation |
| Implementation | Setup's measured thresholds | Verification |
| Verification | Implementation | Closure |
<!-- /ANCHOR:phase-deps -->

---
