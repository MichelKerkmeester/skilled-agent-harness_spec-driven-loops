---
title: "Implementation Plan: Phase 38: alignment-p1-remediation"
description: "Four fixes for the alignment run's branch-caused P1 findings, a restatement of the stored unsafe counts the scorer fix moves, and a recorded reason for every other open P0 and P1 row."
trigger_phrases:
  - "alignment p1 remediation plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 38: alignment-p1-remediation

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node ES modules, TypeScript, Markdown |
| **Framework** | Vitest in the advisor runtime |
| **Storage** | Gate files, rescored summaries and the probe comparison in this phase's `scratch/` |
| **Testing** | Full suite with the child flag unset and set, `FLOOR`, `EVAL`, the four stored sets rescored |

### Overview
The scorer passes the run's checkout to the guarded write check it already passes to the start shape. The command matcher's suffix pattern takes a chain of the advertised suffixes. The vitest config clears the inherited child flag beside the temp folder it already sets. The README paragraph is restored and names every runtime. The stored sets are rescored and each run whose unsafe ruling moved is listed.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Each P0 and P1 row of the alignment run read and reproduced or overturned

### Definition of Done
- [ ] All acceptance criteria met
- [ ] The goal log names each open P0 and P1 row and each new unsafe run
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Local fixes at the producer. No new file, module, option or dependency in the shipped code.

### Key Components
- **`startState`**: `wrote` uses `firstWritePosition(stream, checkoutDir)`, the boundary `startShape` and the decline counts use
- **`MODE_SUFFIX`**: a run of `:auto`, `:confirm`, `:autopilot`, `:unattended` and `:with-context|phases|research` ends a typed command
- **`vitest.config.ts`**: deletes `AI_SESSION_CHILD` before workers start
- **Root README**: Claude Code, Codex, Devin, Cursor, Pi, DSH and Vibe write a health record, the OpenCode plugin writes none

### Data Flow
Unchanged. The scorer reads the same run logs, and the matcher reads the same prompt.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `startState` unsafe | Ignores the checkout | Passes it | Two arena tests fail on the old rule |
| Stored 007 and 033 summaries | Count arena writes as safe | Restated | `unsafe-rows.txt` names each moved run |
| `typedCommandIn` | Misses three advertised suffixes and chains | Reads them | Suffix tests and `FLOOR` |
| `scorer/text.ts` suffix strip | Strips the four mode words only | Unchanged on purpose | Its comment keeps `:with-*` as intent |
| Advisor vitest config | Inherits the child flag | Clears it | Suite with `AI_SESSION_CHILD=1` |
| Root README | Says three hooks write none | Names all seven | `hook-health-check.mjs` |

Required inventories:
- Same-class producers: `rg -n "firstWritePosition\(stream\)" $S` finds no other call without a checkout.
- Consumers of changed symbols: `unsafe` feeds the summary's `unsafe` and `unsafeNoChangedPath`, both restated. `typedCommandIn` feeds `attachTypedCommand` and `withholdWritingCommandsOnNoEdit`, covered by `FLOOR`.
- Matrix axes: the suite is run with the child flag unset and set.
- Algorithm invariant: a run line with no checkout keeps the scratch-folder fallback.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup records the before gates and the stored summaries. Implementation makes the four fixes and their tests. Verification rebuilds, reruns the gates both ways, rescores the stored sets, lists the moved runs, compares the probes on head and main and logs every disposition. The ordered work is in `tasks.md`.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Arena write cases, suffix cases | Vitest |
| Integration | Full suite with the flag unset and set, `FLOOR`, `EVAL` | Vitest, the capture scripts |
| Manual | None. The hook records and probes are counted by committed scripts | `hook-health-check.mjs`, `compare-probes.mjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Alignment run folder | Internal | Green | The findings cannot be cited |
| Stored 007 and 033 session stores | Internal | Green | The restatement cannot run |
| A built copy of origin/main | Internal | Green, under the session scratchpad | The probe comparison cannot run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a suite failure or a moved floor the fixes cause
- **Procedure**: revert the phase's commit and rebuild the advisor dist
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup (before gates, stored summaries) | Phase 037 and the merge committed | Implementation |
| Implementation (four fixes) | The before gates | Verification |
| Verification (gates, rescore, probes, goal rows) | A green suite | Close-out |
<!-- /ANCHOR:phase-deps -->

---
