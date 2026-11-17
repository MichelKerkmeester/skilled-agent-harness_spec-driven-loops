---
title: "Implementation Plan: Phase 37: review-pass-six-remediation"
description: "Six doc, comment, config and test edits from review pass six, five findings recorded with a reason, and a check that no stored number moved."
trigger_phrases:
  - "review pass six remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 37: review-pass-six-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules, TypeScript tests, Markdown |
| **Framework** | Vitest in the advisor runtime |
| **Storage** | Gate files and the rescored 033 summary in this phase's `scratch/` |
| **Testing** | Full suite, `FLOOR`, `EVAL`, the buffer test with a cut fixture |

### Overview
Each fix is local to one file. The only behaviour edit is two more environment variables in the vitest config, which point at the same per-run folder. A rescore of the 033 arm shows no stored number moved.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Pass six's registries merged and each finding's case read

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The goal log names all 11 findings
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Doc and comment alignment. No new file, module, option or dependency.

### Key Components
- **Scorer README row and shell-step comment**: a read is a touch, a start needs a checkout write
- **`scoreRun` JSDoc**: lists `startShape`
- **`vitest.config.ts`**: `TMPDIR`, `TEMP` and `TMP` point at one per-run folder, and a signal-killed run leaves it
- **Buffer test**: measures its own listing
- **Root README**: names the runtimes whose prompt hook writes a health record

### Data Flow
Unchanged.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Scorer README row | Calls a `cat` of the document a start | Reworded | `rg` prints nothing |
| Shell-step test comment | Same claim | Reworded | Read |
| `scoreRun` `@returns` | Omits `startShape` | Added | Read |
| `vitest.config.ts` | Sets `TMPDIR` only | Adds `TEMP` and `TMP` | Full suite |
| Buffer test | Never measures the listing | Asserts its size | Fails at 3,000 files |
| Root README | Every prompt hook writes a record | Names the four that do | `rg` over the hooks |

Required inventories:
- Same-class producers: `rg -n "cat\` of the command" .skilled/skills/system-skill-advisor` lists every place the old claim sits.
- Consumers of changed symbols: none, no code path changes.
- Matrix axes: none.
- Algorithm invariant: no stored number moves.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the gates. Implementation makes the six edits. Verification reruns the gates, rescores the 033 arm, cuts the buffer fixture once and logs the dispositions. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | The buffer test with its listing assertion | Vitest |
| Integration | Full suite, `FLOOR` and `EVAL` | Vitest, the capture scripts |
| Manual | None. The rescore check is a `cmp` | `cmp` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Pass six lineages | Internal | Green, merged | The findings cannot be cited |
| The 033 session stores | Internal | Green, scored today | The no-move check cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a suite failure the config change causes
- **Procedure**: revert the phase's code commit
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
| Setup (gates) | Phase 036 committed | Implementation |
| Implementation (six edits) | The before gates | Verification |
| Verification (gates, rescore, goal row) | A green suite | Close-out |
<!-- /ANCHOR:phase-deps -->

---
