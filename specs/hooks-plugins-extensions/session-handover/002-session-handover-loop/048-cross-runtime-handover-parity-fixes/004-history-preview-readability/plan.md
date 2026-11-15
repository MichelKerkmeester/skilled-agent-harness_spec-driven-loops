---
title: "Implementation Plan: Phase 4: history-preview-readability"
description: "Build a model turn's history preview from its text and its tool calls' names and arguments instead of serialized block objects, then rerun a live Pi hop on DeepSeek Flash at max thinking."
trigger_phrases:
  - "history preview readability plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: history-preview-readability

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript compiled to `dist/`, Bash |
| **Framework** | Skilled history lookup engine |
| **Storage** | None |
| **Testing** | vitest |

### Overview
`turnText` in `lib/navigator.ts` renders a model turn for both `previewFor` and the search index `itemText` from the projected blocks: text as it is and each tool call as its name and compact arguments. Projection has already dropped thinking, paging calls and private signatures, and the redaction on main has already masked secret arguments. One browse test and one search test pin the readable form. The build regenerates `dist/`, and a live Pi hop on DeepSeek Flash at max thinking checks recall.
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
- [ ] The history engine suite prints its baseline plus one passing
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
A change to one pure formatting function over projected data

### Key Components
- **`lib/navigator.ts` `previewFor`**: the reference preview.
- **`tests/history-search-browse.vitest.ts`**: the pinning test.

### Data Flow
The CLI projects a history item, `buildReference` asks `previewFor` for its preview, and browse, search and load return it. Search still replaces it with an excerpt around the matched term.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `previewFor` | Reference preview for every runtime | update | the new browse test, the existing suite unchanged |
| Search excerpt and index | Preview around a matched term | update; quotes tool calls by name and arguments | the new search test, the existing search tests unchanged |
| `dist/` | What the CLI runs | regenerate | the CLI suite and the live hop |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`: baseline, one Vibe brief, review, the live hop and the docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Both fixture turns preview as text and tool name with arguments, with no block object or call id | vitest, one mutation |
| Manual | Live Pi hop on DeepSeek Flash at max thinking, scored by `score.cjs` | `PI_ROUTE=deepseek ../scratch/harness/live-hop.sh pi` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| llmgateway provider for Pi | External | To check | No live hop |
| tmux | External | Green | No live hop |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a preview that hides what a turn did.
- **Procedure**: `git revert` the phase's feature commit and rebuild `dist/`.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | The operator's go-ahead | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Merge |
<!-- /ANCHOR:phase-deps -->

---
