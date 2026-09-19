---
title: "Implementation Plan: Phase 16: fix-stale-compiled-routing-docs-and-research-workflow"
description: "Correct stale compiled-routing comments and docs in place, keep both resolver copies byte-identical, drop a retired rule from the research workflows, and prove nothing routes differently."
trigger_phrases:
  - "stale compiled routing text plan"
  - "phase 16 plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 16: fix-stale-compiled-routing-docs-and-research-workflow

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node CJS, TypeScript comments, Markdown, workflow YAML |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Vitest (`vitest.config.bin.ts`, deep-loop runtime), `node:test` gate, route guard, contract drift check |

### Overview
Every change is a comment, a sentence or a rule name, so the plan is to edit each in place and then prove behaviour is unchanged. The resolver's authored source and its promoted copy get the same comment, because the promotion step copies the source over the runtime. The research workflows drop `TEMPLATE_HEADERS`, and the compiled deep research contract, which digests those workflows, is recompiled.
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
- [x] Tests passing (if applicable)
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
In-place correction; no structure changes.

### Key Components
- **Authored resolver** under `specs/sk-doc/019-skill-routing-refactor/`: the source the promotion step copies.
- **Promoted resolver** under `.skilled/bin/lib/compiled-routing/`: what serves.
- **Research workflows**: the auto and confirm YAML that call the validator with a rule list.

### Data Flow
`compiled-route-sync.cjs` copies the authored closure over the promoted one. A correction made only in the promoted copy is therefore lost on the next promotion, which is why both copies change together.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| Both `resolve.cjs` copies | Cohort comment | Update, identically | `cmp` and the bin vitest suite |
| `compiled-routing-flag.ts` | Advisor cohort comment | Update | Bin vitest suite |
| `compiled-routing-foundation.vitest.ts` | Header comment | Update | Bin vitest suite |
| `compiled-routing-architecture.md` | Hub author reference | Update | `validate_document.py` |
| Research workflow YAML, two files | Validator rule lists | Update | The corrected list runs; contract drift check |
| `deep-research.contract.md` | Digest of the workflows | Recompile | `check-contract-drift.cjs` |
| Eight system-spec-kit files naming the rule | Docs, playbooks, fixtures | Unchanged, out of scope | Listed in the summary |

Required inventories:
- Same-class producers: `rg -n -i "\bseven\b|all 7|eighth" .skilled/bin .skilled/skills/sk-doc/sk-create-skill/references/parent-skill .skilled/skills/system-skill-advisor/runtime/lib` and `rg -l TEMPLATE_HEADERS --hidden -g '!specs/**'`.
- Consumers: the promotion tool reads the authored resolver; the contract compiler digests the workflows.
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
| Unit | Compiled-routing foundation and flag propagation | `npx vitest run --config vitest.config.bin.ts` |
| Integration | Node gate; deep-loop runtime suite, which holds the contract checks | `run-node-tests.mjs`, deep-loop `vitest.config.ts` |
| Manual | Route guard, contract drift, the corrected rule list against a real folder | CLI runs |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 15 research | Internal | Green | Nothing to fix |
| Contract compiler | Internal | Green | The deep research contract stays stale |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any test, the guard or the drift check fails after the change.
- **Procedure**: Revert the phase commit; no state outside the tracked files changes.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Inventory ──► Edits ──► Recompile contract ──► Verify
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Inventory | None | Edits |
| Edits | Inventory | Recompile |
| Recompile | Edits | Verify |
| Verify | Recompile | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Inventory | Low | Under an hour |
| Edits and recompile | Low | Under an hour |
| Verification | Low | Under an hour |
| **Total** | | **About two hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes). Not applicable: no data changes
- [x] Feature flag configured. Not applicable: no behaviour change
- [x] Monitoring alerts set. Not applicable

### Rollback Procedure
1. Revert the phase commit.
2. Rerun the contract drift check; the reverted contract matches the reverted workflows.
3. Rerun the bin vitest suite.
4. No notice is needed; nothing user-facing changes.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
