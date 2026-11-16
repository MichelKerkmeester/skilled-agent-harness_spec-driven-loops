---
title: "Implementation Plan: Hand-over doc alignment, third pass: fix the 25 findings of the deepseek-flash check"
description: "The alignment tool applies the 18 literal fixes after a dry run and a check of the riskier claims against the code, the orchestrator writes the 7 judgment fixes by hand, and the validator, the voice scan and the topic's checks confirm the result."
trigger_phrases:
  - "handover doc alignment 3 plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Hand-over doc alignment, third pass: fix the 25 findings of the deepseek-flash check

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown docs |
| **Framework** | None |
| **Storage** | None |
| **Testing** | sk-doc `validate_document.py`, `hvr_scan.py`, the topic's `drift-guards` and `hook-registrations` checks |

### Overview
The run's `findings.json` holds 18 literal fixes and 7 that need judgment. `apply-fixes.cjs` applies the literal ones from the worktree root after a dry run, and the orchestrator writes the rest by hand. Each changed doc is checked against its committed copy, and the topic's two checks run on the fixed tree.
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
- [x] `doc-alignment.cjs checks` prints `pass=2 fail=0 cannot_run=0` on the fixed tree
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: in-place doc edits.

### Key Components
- **`apply-fixes.cjs`**: replaces each literal finding's old text with its new text in the named doc, from the working directory's repository.
- **The hand edits**: the 7 judgment fixes, each written after reading the code it describes.

### Data Flow
`findings.json` from the alignment run goes to `apply-fixes.cjs`, which edits the docs in worktree 383. The hand edits follow, then the checks read the fixed tree.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Hand-over docs under `.skilled/hooks/` | State the loop's behavior | update | `validate_document.py` and `hvr_scan.py` per file |
| `ENV-REFERENCE.md` | Lists every switch and wrapper variable | update | `grep -o "export SKILLED_LOOP_[A-Z_]*" .skilled/bin/skilled-loop` against the table |
| Hand-over code | Owns the behavior | unchanged | `git diff --stat` lists no code file |

Required inventories:
- Same-class producers: `rg -n "\.claude\`, \`\.codex\`, \`\.opencode\`" .skilled README.md` found the two linked-folder lists, both fixed.
- Consumers of changed symbols: none, since no symbol changed.
- Matrix axes: N/A, docs only.
- Algorithm invariant: N/A, docs only.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reads the findings and checks the riskier claims, Implementation applies the literal fixes and writes the judgment fixes, and Verification runs the validator, the voice scan and the topic's checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each changed doc's structure and voice | `validate_document.py`, `hvr_scan.py` |
| Integration | The hand-over drift guards and hook registrations | `doc-alignment.cjs checks` |
| Manual | Each riskier claim read against the code | `rg`, `sed -n` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| The operator-local alignment assets in the primary checkout | Internal | Green | The literal fixes would be written by hand |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A changed doc states something the code contradicts.
- **Procedure**: `git revert` the commit that carries the doc fixes.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The alignment run's findings | Implementation |
| Implementation | Setup's claim checks | Verification |
| Verification | Implementation | Closing the packet |
<!-- /ANCHOR:phase-deps -->

---
