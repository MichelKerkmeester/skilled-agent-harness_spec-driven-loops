---
title: "Implementation Plan: Phase 13: UX and alignment pass"
description: "Red-first engine fixes, one serial queue for the overlay engine, parallel workers for hooks, doctor output and docs, two alignment runs on opus-high with a native critic, and one merge into local main."
trigger_phrases:
  - "ux and alignment pass plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 13: UX and alignment pass

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node (CommonJS and ESM), bash, Python, Markdown |
| **Framework** | node:test, vitest, unittest |
| **Storage** | None |
| **Testing** | The engine, guard and contract suites, the alignment command suites, the drift guards, route-validate, the trigger index check, the deep-loop vitest suite and strict validation |

### Overview
The work runs on `worktrees/506-ux-and-alignment-pass`. Every behavior change starts with a failing test. Workers that edit `overlay-engine.cjs` run one at a time. Hooks, doctor output and docs run beside them. Both alignment commands run before the fixes, so their findings join the same queue. The branch merges into local main with `--no-ff`, as `7153a45a8b9` did.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] Every gate below is at or above its main baseline on the merged main
- [ ] The final `@review` returns APPROVED with no P0 or P1
- [ ] Docs updated (spec/plan/tasks/implementation-summary)

| Gate | Command |
|------|---------|
| engine | `node --test .skilled/commands/doctor/scripts/tests/overlay-engine-*.test.cjs` |
| guard | `node --test .skilled/hooks/overlay-guard/lib/overlay-guard.test.cjs .skilled/hooks/overlay-guard/tests/*.test.mjs` |
| contract | `node --test .skilled/commands/doctor/scripts/tests/doctor-overlay-contract.test.cjs` |
| lsa, ldoc | `node --test .skilled/commands/assets/local-{skilled,doc}-alignment/tests/*.test.cjs` |
| router-sync | `node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/*.test.cjs` |
| drift | `bash .skilled/skills/sk-code/sk-code-skilled/scripts/run-all-drift-guards.sh` |
| route-validate | `bash .skilled/commands/doctor/scripts/route-validate.sh` |
| trigger index | `node .skilled/skills/system-spec-kit/runtime/cli/retrieval/generate-trigger-index.mjs --check` |
| deep loop | `npx vitest run --no-coverage` in `.skilled/skills/system-deep-loop/runtime` |
| validate | `validate.sh <parent> --recursive --strict` |
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Serial engine queue.

### Key Components
- **The engine queue**: the cache fixes, the README role, the folder-to-file apply, then the engine messages. Each lands as its own commit.
- **The parallel lanes**: hook messages, doctor scripts and presentation, onboarding docs, the deep-loop tests.

### Data Flow
Inventory and alignment findings feed one fix list. Each fix is a tested commit on the branch, then the review, then the merge.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `overlay-engine.cjs` cache helper | Decides what a directory entry ships, deletes and backs up | update | `overlay-engine-cache-skip.test.cjs` |
| Message consumers: engine tests, guard tests, contract test, presentation files, Barter's hooks | Match engine and hook text | unchanged machine tokens, new `Next:` lines | the guard, contract and engine suites |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Setup creates the worktree, runs the baseline gates on main and the two alignment runs. Implementation works the engine queue and the parallel lanes from `tasks.md`. Verification runs the review rounds, merges into main and reruns every gate there.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Each engine fix, the drift guard scope, the hermetic deep-loop cases | node:test, unittest, vitest |
| Integration | Hook refusals and doctor output | The guard and hook tests |
| Manual | None beyond the gates | N/A |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| ai-speckit handoff file | Internal | Read twice | Upstream items wait for the next phase |
| Skilled main at `65751f8d61a` | Internal | Green | No start point |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a gate on the merged main falls below its baseline.
- **Procedure**: `git revert -m 1 <merge>` on main. Main is pushed as `13eae0c562b` and Barter is pinned to it, so the revert goes out as a new commit and Barter re-pins onto that.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 011's push | Implementation |
| Implementation | The baseline and both alignment runs | Verification |
| Verification | Every implementation commit | The merge |
<!-- /ANCHOR:phase-deps -->
