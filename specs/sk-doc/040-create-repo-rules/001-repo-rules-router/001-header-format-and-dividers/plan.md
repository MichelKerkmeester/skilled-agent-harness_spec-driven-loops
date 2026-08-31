---
title: "Implementation Plan: Phase 1: Numbered-Header Casing and Section Dividers"
description: "A one-shot line-scoped transform uppercases the prose of every numbered ## heading across REPO RULES.md and the six repo-rules files while preserving backticked spans byte-for-byte, then inserts a --- divider before each numbered heading that lacks one. It is written to be idempotent so that a second run producing an empty diff proves the change is confined to headings."
trigger_phrases:
  - "header casing plan"
  - "divider insertion"
  - "repo rules formatting"
  - "idempotent transform"
  - "code span preservation"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1: Numbered-Header Casing and Section Dividers

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (GitHub-flavored); Python 3 for the one-shot transform |
| **Framework** | None - plain files an agent reads at load time |
| **Storage** | Git working tree; no generated artifact derives from heading casing |
| **Testing** | `grep` / `git diff` assertions plus `validate.sh --strict` on the packet |

### Overview
A one-shot, line-scoped transform over seven markdown files. Each `^## <n>. ` heading has its prose uppercased while backticked spans are preserved byte-for-byte, and a `---` divider is inserted immediately before every numbered heading not already preceded by one. The transform is written to be idempotent, because a second run producing an empty diff is the cheapest available proof that the change is confined to headings.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented - seven named files, 50 measured headers, 0 measured dividers
- [x] Success criteria measurable - three `grep` / `git diff` assertions in `spec.md` section 5
- [x] Dependencies identified - baseline packet shipped and validating at Errors 0 / Warnings 0

### Definition of Done
- [ ] All acceptance criteria met
- [ ] `git diff -U0` over the seven files contains only heading, divider, and blank lines
- [ ] Docs updated (spec/plan/tasks/acceptance-criteria)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Single-pass line rewriter. No abstraction and no reusable module - rung 1 on the restraint ladder in `repo-rules/overengineering.md`, because the requirement is seven files, once.

### Key Components
- **Heading matcher**: matches `^## (\d+)\. (.+)$` outside fenced regions and rewrites only the trailing text.
- **Code-span guard**: splits heading text on backtick pairs and uppercases only the non-backticked segments, so `` `AGENTS.md` `` survives intact.
- **Divider inserter**: emits `---` and a blank line before a numbered heading when the nearest preceding non-blank line is not already `---`.

### Data Flow
File text to line list, fence-state scan, per-line heading rewrite, divider insertion pass, write back, then an assertion pass over the resulting diff.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This phase changes presentation in files that agents read as instructions, so the consumer inventory is about readers and links rather than callers.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `REPO RULES.md` trigger and index tables | Route an action to one rule file | unchanged - link text and targets untouched | Every `repo-rules/*.md` link resolves on disk after the pass |
| `AGENTS.md` GATE 5 | Names `REPO RULES.md` as the mandatory load | not a consumer of heading casing | `rg -n 'REPO RULES' AGENTS.md` shows path references only |
| `sk-code` docs citing another repository's `REPO RULES.md` | Point at a different repository's copy | not a consumer | `rg -n 'REPO RULES' .opencode/skills` reviewed before the pass |
| Spec-kit generated metadata | Fingerprints spec docs, not repository-root governance files | unchanged | `validate.sh --strict` on the packet after the pass |

Required inventories:
- Same-class producers: `rg -n '^## [0-9]+\. ' 'REPO RULES.md' repo-rules/`.
- Consumers of changed symbols: `rg -n 'REPO RULES|repo-rules/' . --glob '*.md' --glob '*.ts' --glob '*.js'`.
- Matrix axes: file x heading shape (plain prose, contains a code span, contains punctuation); every axis must appear in the verification sample.
- Algorithm invariant: the multiset of non-heading, non-blank lines in each file is identical before and after.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

`tasks.md` owns the numbered task state (T001-T012); the stages below say what each one has to establish before the next can start.

### Phase 1: Measure
- [x] Baseline counts recorded per file: 50 numbered headers, 0 uppercase, 0 dividers
- [x] Confirmed no numbered heading sits inside a fenced code block, which is what lets the fence guard stay simple

### Phase 2: Transform
- [x] Heading pass: prose uppercased, backticked spans left byte-identical
- [x] Divider pass: `---` inserted before every numbered heading, including the first
- [x] Second run confirmed a no-op, which is the proof the pass is confined to headings

### Phase 3: Assert
- [x] Casing, divider, adjacency, diff-shape, idempotence and link checks all recorded
- [x] Packet gate run and its result recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Assertion | Numbered-header count equals uppercase-header count, per file | `grep -cE` |
| Assertion | Divider count is at least the numbered-header count, with no adjacent dividers | `grep -c`, `awk` |
| Diff review | Changed lines are heading, `---`, or blank only | `git diff -U0` |
| Idempotence | A second run of the transform produces an empty diff | re-run plus `git diff --quiet` |
| Packet gate | Spec docs still validate | `validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Baseline packet files (7 governance docs) | Internal | Green | Nothing to format |
| `validate.sh` orchestrator, compiled and not stale | Internal | Green | Packet cannot be gated; rebuild via `npm run build` in the spec-kit MCP server |
| Python 3 (system) | External | Green | Fall back to `sed` / `awk`, at higher risk to code spans |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the diff touches anything other than heading, divider, or blank lines; a rule file becomes harder to read; or a `REPO RULES.md` link stops resolving.
- **Procedure**: `git checkout -- 'REPO RULES.md' repo-rules/` restores all seven files. Nothing else in the repository depends on this phase, so there is no second step.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Measure (counts) --> Transform (headings) --> Transform (dividers) --> Assert (diff shape)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Measure | None | Transform: headings |
| Transform: headings | Measure | Transform: dividers |
| Transform: dividers | Transform: headings | Assert |
| Assert | Both transforms | Packet phase 2 |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Measure | Low | minutes |
| Core Implementation | Low | under an hour |
| Verification | Low | minutes |
| **Total** | | **under an hour** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] Working tree clean for the seven target paths before the transform, so the diff is attributable
- [ ] Pre-transform heading and divider counts recorded
- [ ] No feature flag or monitoring applies - these are static documents

### Rollback Procedure
1. `git checkout -- 'REPO RULES.md' repo-rules/`
2. Re-run the count assertions and confirm the pre-transform numbers are back
3. No redeploy, cache purge, or notification applies

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A - no persisted state derives from heading casing
<!-- /ANCHOR:enhanced-rollback -->

---

