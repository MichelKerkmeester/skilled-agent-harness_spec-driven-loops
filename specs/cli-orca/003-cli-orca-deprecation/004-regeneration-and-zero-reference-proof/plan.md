---
title: "Implementation Plan: Phase 4: regeneration-and-zero-reference-proof"
description: "Regenerate the advisor graph, the trigger index, the sk-doc README fixtures and the mcp-tooling routing manifest, then prove no live file names cli-orca."
trigger_phrases:
  - "cli orca removal regeneration"
  - "cli orca zero reference proof"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 4: regeneration-and-zero-reference-proof

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node.js, Python, Markdown, JSON |
| **Framework** | None |
| **Storage** | None |
| **Testing** | vitest, node --test, Python test scripts, ripgrep |

### Overview
Regenerate the advisor graph, the trigger index, the sk-doc README fixtures and the mcp-tooling routing manifest, then prove no live file names cli-orca.
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
- [x] Every touched suite matches its baseline
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Removal. Every surface that names the cli-orca skill drops that entry, and every other skill keeps its behavior.

### Key Components
- **Advisor graph**: built from each skill's `graph-metadata.json`
- **Trigger index**: built from frontmatter trigger phrases
- **Compiled routing**: hub manifests pinned to a policy hash

### Data Flow
Source edits change derived inputs. Each derived artifact is rebuilt by its own tool, never edited by hand, except where a refresh would absorb unrelated drift.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.skilled/skills/system-skill-advisor/runtime/scripts/skill-graph.json` | Advisor graph | regenerate | `compiled-route-status.cjs --hub mcp-tooling` reports compiled-serving |

- Same-class producers: `rg -n -i "cli-orca|\borca\b"` outside `specs/`, as in the phase 1 manifest.
- Consumers of changed symbols: the suites in the phase 1 baseline, run before and after.
- Matrix axes: one axis, the skill roster; every roster that listed cli-orca loses one row.
- Algorithm invariant: no remaining skill's routing changes except where cli-orca's edge fed its score.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup reads the targets and the baseline, Implementation makes the change, Verification reruns the same checks.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Advisor scorer and parity tests, metadata contract | vitest, node |
| Integration | README fixtures, compiled-route tests, runtime mirrors | Python scripts, node --test |
| Manual | Residue sweep and an advisor replay | rg, skill-advisor.cjs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Compiled-routing manifest minting | Internal | Green | mcp-tooling serves legacy routing |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A remaining skill breaks because of the removal, or the operator reverses the decision.
- **Procedure**: The work lives on branch `worktrees/534-deprecate-cli-orca`. Before merge, discard the branch. After merge, `git revert` the merge commit; every deleted path returns from git history.
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
| Implementation | Setup | Verification |
| Verification | Implementation | Next phase |
<!-- /ANCHOR:phase-deps -->

---
