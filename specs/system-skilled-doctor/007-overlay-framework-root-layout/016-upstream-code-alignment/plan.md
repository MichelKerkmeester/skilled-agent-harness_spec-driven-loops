---
title: "Implementation Plan: Phase 16: upstream code alignment for overlaid files"
description: "Audits the 24 Skilled counterparts of Barter's overlaid code files against sk-code's Skilled mode and fixes the behavior-neutral flaws at source. The suites that cover each changed file prove that behavior did not change."
trigger_phrases:
  - "upstream code alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 16: upstream code alignment for overlaid files

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | JavaScript (CommonJS and ESM), TypeScript, Bash |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test`, vitest, the hook shell tests |

### Overview
Audits the 24 Skilled counterparts of Barter's overlaid code files against sk-code's Skilled mode and fixes the behavior-neutral flaws at source. The suites that cover each changed file prove that behavior did not change.
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
- [ ] Each suite covering a changed file exits 0 with its baseline count
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: comment, header and doc-comment edits only.

### Key Components
- **Read-only audits**: cli-pi sweeps g1 to g4 and one @review pass for `fanout-run.cjs`, each reporting file:line findings against the standard.
- **Handoff list**: the ai-speckit session's list of flaws its overlay copies share with upstream.

### Data Flow
Audit findings and handoff items become edits in the Skilled counterparts. Every handoff item copies the text Barter's copy carries on the same lines, and then the covering suites run.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup runs the audits and reads the handoff list. Implementation applies the in-scope fixes file by file. Verification runs the covering suites and re-reads the handoff list. `tasks.md` holds the ordered work.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Regression | Git hooks | `bash .skilled/scripts/git-hooks/tests/*.test.sh` |
| Regression | Compiled-route guard and canary router | `node --test .skilled/bin/tests/compiled-route-*.test.cjs` |
| Regression | Deep-loop and spec-kit runtime files | vitest in each runtime |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ai-speckit handoff list | Internal | Green | Items written after close are recorded as missed |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a covering suite fails or its count changes.
- **Procedure**: `git revert` the phase commit on main; the change has no state to repair.
<!-- /ANCHOR:rollback -->

---

