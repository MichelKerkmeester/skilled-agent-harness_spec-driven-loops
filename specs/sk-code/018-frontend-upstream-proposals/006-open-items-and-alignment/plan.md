---
title: "Implementation Plan: Phase 6: open-items-and-alignment"
description: "Close the five open items with one small fix and one test each, then run the alignment check over the branch with DeepSeek V4.1 Flash on opencode-go and fix what it confirms on the touched skills until a recheck is clean."
trigger_phrases:
  - "open items and alignment plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 6: open-items-and-alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CommonJS, TypeScript, Markdown |
| **Framework** | Compiled routing, spec-kit continuity workflow |
| **Storage** | None |
| **Testing** | `node --test`, vitest, `/local-skilled-alignment` |

### Overview
Four code or doc fixes close the open items, each proven by a test or a grep. Then `/local-skilled-alignment` runs over the branch's own commits, its lanes on `opencode-go/deepseek-v4.1-flash` through a `--config` copy of its executor file, and every finding it confirms on a touched skill is fixed and rechecked.
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
- [x] `node --test .skilled/bin/tests/compiled-route-*.test.cjs` reports `fail 0`, and the alignment recheck lists no open finding on a touched skill
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Targeted fixes, then a check-fix-recheck loop.

### Key Components
- **sk-design canary router**: owns the same-mode tie order that throws.
- **Continuity workflow summary**: owns what a save prints at the end.
- **`/local-skilled-alignment`**: finds drift between the touched skills' SKILL.md, ROUTER.md, hub routing, references and assets.

### Data Flow
Alignment run → `findings.json` and `fix-plan.md` → a DeepSeek build per fix batch → verification in this session → `--recheck` on the same run folder.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `009-sk-design/lib/canary-router.cjs` (authored and served) | Sorts tied intents | Update | The tie test, then `compiled-route-sync.cjs --check` |
| `core/workflow.ts` summary | Prints the save's outcome | Update | The plan-only vitest |
| Other hubs' canary routers | Already define or import `compareText` | Unchanged | `rg -n "compareText" 009-parent-hub-rollout/*/lib/` |
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
| Unit | The tie order, the plan-only line, the corpus pin | `node --test`, vitest |
| Integration | Hub status, sync check, reach on every hub | `compiled-route-status.cjs`, `ci-router-vocabulary-reach.cjs` |
| Manual | Alignment findings on the touched skills | `/local-skilled-alignment` and `--recheck` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `pi` with the `opencode-go` provider | External | Green, `pi --list-models` lists `opencode-go/deepseek-v4.1-flash` | No alignment lanes; stop and ask |
| `opencode run -m opencode-go/deepseek-v4.1-flash#max` | External | Green, used for every build this session | No builds; stop and ask |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a fix moves routing on any hub, or a suite that passed before fails after.
- **Procedure**: `git revert` the fix commit; for a routing source, rerun `compiled-route-sync.cjs` and finalize.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Main merged into the branch | Implementation |
| Implementation | Setup | Verification |
| Verification | Implementation | Phase close |
<!-- /ANCHOR:phase-deps -->

---
