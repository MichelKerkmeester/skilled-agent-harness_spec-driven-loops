---
title: "Implementation Plan: Phase 11: alignment-fixes"
description: "Fix the two advisor scorer faults at their producers with tests, narrow and extend the sk-code-ci aliases and regenerate what derives from them, then close four documentation gaps."
trigger_phrases:
  - "alignment fixes plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 11: alignment-fixes

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Python 3, TypeScript, JSON, Markdown |
| **Framework** | The skill advisor runtime and the sk-code hub router |
| **Storage** | None |
| **Testing** | The advisor Python suite, vitest and advisor CLI probes |

### Overview
The matcher in `skill_advisor.py` lets a marker replace the current match only when it contains it, the read-only classifier in `text.ts` gains its missing write verbs, and the explicit lane anchors sk-git on a release that names a tag. The sk-code-ci aliases change in the four files that carry them, and the compiled manifest and skill graph are regenerated. Each change is proved by a test or probe read before and after.
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
- [x] `python3 runtime/tests/python/test_skill_advisor.py` prints `Summary: pass=87, fail=0`, and the whole advisor vitest run passes apart from one watcher test that fails the same way on the main checkout
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Producer-side fixes.

### Key Components
- **`detect_explicit_command_intent`**: picks the command bridge a typed slash command names.
- **`isReadOnlyExplainer`**: decides whether a prompt is held at the read-only floor.
- **The sk-code-ci alias class**: the vocabulary that bundles the CI surface.

### Data Flow
A prompt reaches the advisor, which scores the hub from `graph-metadata.json`. The hub router then picks the mode from `hub-router.json`. The compiled manifest snapshots that router policy.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `skill_advisor.py` matcher | Owns the explicit command intent on the Python path | update | Python sibling-target case |
| `fusion.ts` doctor ordering | Owns the same ordering on the TypeScript path | unchanged, pinned | vitest sibling-target cases |
| `text.ts` classifier | Owns the read-only floor | update | `read-only-explainer.vitest.ts` |
| sk-code-ci aliases | `hub-router.json`, `mode-registry.json`, `graph-metadata.json`, `ROUTER.md` | update | `rg -n 'release workflow' .skilled/skills/sk-code` prints only anchored forms |
| Compiled manifest and skill graph | Derived from the hub files | regenerate | route guard `failures: 0`, freshness `SIGNAL DRIFT: none` |
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
| Unit | The matcher, the doctor ordering and the classifier | Python suite, vitest |
| Integration | Corpus accuracy and the routing suites | `capture-scorer-eval-baseline.mjs`, vitest parity and scorer folders |
| Manual | Top-1 routing for the finding prompts and unrelated phrases | Advisor CLI probes |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Advisor runtime build | Internal | Green | Probes read the old scorer |
| Nested changelog generator | Internal | Green | The phase 002 changelog cannot be written |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routing suite or a probe regresses after landing.
- **Procedure**: Revert the commit, then rerun the manifest refresh and the skill graph compiler so the derived files match the reverted sources.
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
| Implementation | Baselines captured | Verification |
| Verification | All fixes applied | Close |
<!-- /ANCHOR:phase-deps -->

---
