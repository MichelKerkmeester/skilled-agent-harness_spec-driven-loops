---
title: "Implementation Plan: deep-loop-test-debt"
description: "Baseline the deep-loop-owned red tests and typecheck errors, fix each at its producer, and rerun the exact failing check plus the whole affected suite before recording the fix."
trigger_phrases:
  - "implementation plan"
  - "technical approach"
  - "testing strategy"
  - "deep loop test debt"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: deep-loop-test-debt

<!-- SPECKIT_LEVEL: 1 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (deep-loop runtime), Vitest |
| **Framework** | Vitest projects config at the spec-kit skill root; the deep-loop runtime's own vitest config |
| **Storage** | None |
| **Testing** | Rerun each named test, then the whole affected suite and `tsc --noEmit` |

### Overview
Each red test names a producer in the deep-loop runtime. The fix goes into that producer, or into the fixture the test ships with when the fixture no longer matches the shape the producer emits. An assertion changes only when the documented contract, not the code, is the authority, and that case is reported rather than decided.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All named tests pass
- [x] Deep-loop runtime typecheck exits 0
- [x] Implementation summary records each root cause and fix
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Producer-first repair: reproduce the failure, trace the assertion to the code path that emits the value, fix there, rerun.

### Key Components
- **Council persist-artifacts**: the payload containment check and the seat vantage the fixture assumes.
- **Review reducer**: the fail-closed path for a missing machine-owned strategy anchor.
- **Deep-review command contract**: the restart input the auto setup must expose.
- **Runtime typecheck**: the errors reported by `tsc --noEmit` under the runtime's own tsconfig.

### Data Flow
Failing test → producer module → fix → exact test rerun → whole suite rerun → summary row.
<!-- /ANCHOR:architecture -->

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
| Unit | Each named vitest file | `npx vitest run <file>` from the owning workspace |
| Integration | Whole deep-loop runtime suite and the spec-kit CLI project | `npx vitest run`, `npx vitest run --project cli` |
| Static | Runtime typecheck | `npx tsc --noEmit -p tsconfig.json` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Another session's edits to the executor files | Internal | Active | Those files stay out of scope; a fix that needs them is reported, not made |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix turns a previously green deep-loop test red.
- **Procedure**: revert that fix commit alone; each fix is committed by pathspec so the revert is one commit.
<!-- /ANCHOR:rollback -->
