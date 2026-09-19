---
title: "Implementation Plan: Phase 18: restore-advisor-suite-and-renew-scorer-freeze"
description: "Find each advisor suite failure's cause by bisection, fix it at the source, and renew the scorer freeze only once the routing battery passes."
trigger_phrases:
  - "advisor suite restore plan"
  - "phase 18 plan"
importance_tier: "normal"
contextType: "implementation"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 18: restore-advisor-suite-and-renew-scorer-freeze

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | ESM JavaScript plugin, TypeScript tests, Python reference scorer, Markdown skill metadata |
| **Framework** | Vitest for the advisor suite |
| **Storage** | A committed JSON embeddings cache |
| **Testing** | The advisor suite, its parity suites, the node gate, the route guard and contract drift check |

### Overview
Each failure gets its cause before its fix. The plugin failures trace to one line; the parity drop is bisected across the scorer, the advisor scripts and every skill's metadata until one file and one commit remain. Only when the routing battery is green is the scorer freeze renewed.
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
Targeted fixes, each at the producer of its failure.

### Key Components
- **Advisor plugin**: computes a source signature per workspace and caches advice under it.
- **Python reference scorer**: reads skill metadata live, and anchors the parity suite.
- **Scorer freeze**: pins the advisor scorer so activation and the flip never ride a scorer change.

### Data Flow
Skill metadata feeds both scorers; the parity suite compares them over a labeled corpus; a green battery licenses the freeze.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `system-skill-advisor.js` | Plugin source signature | Update | Plugin suite; a test that fails without the fix |
| `system-deep-loop/SKILL.md` | Advisor keywords | Update | Parity and CI ratchet suites |
| system-deep-loop manifests, deep contracts | Digest the `SKILL.md` | Regenerate | Route guard; contract drift |
| `seed-skill-embeddings.ts` | Test fixture seeding | Update | `git status` after a run |
| `frozen-scorer-pins.json` | Scorer freeze | Renew | The contract's own check |

Required inventories:
- Parity bisection: scorer files at the pin commit, the advisor scripts, and each skill's root metadata, one at a time, with a real copy of the advisor because its scripts resolve their skills directory through `realpath`.
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
| Unit | Plugin caching for nested and outside workspaces | Vitest |
| Integration | Parity suites; the full advisor suite; the node gate | Vitest, `run-node-tests.mjs` |
| Manual | The parity bisection; the freeze check | Python reference, `frozen-scorer-contract.cjs` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Python 3 | External | Green | The parity suite cannot run |
| Phase 17's rekeyed pins | Internal | Green | The freeze could not be renewed in place |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A routing regression traced to the keyword change, or the plugin caching stale advice.
- **Procedure**: Revert the phase commit, then re-mint the system-deep-loop manifest and recompile the deep contracts, which the pre-commit gates do on the revert.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Diagnose (plugin, parity, fixture) ──► Fix ──► Battery green ──► Renew freeze
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Diagnose | None | Fix |
| Fix | Diagnose | Battery |
| Battery | Fix | Freeze |
| Freeze | Battery | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Diagnose | Med | Two hours, most of it the bisection |
| Fix and regenerate | Low | Under an hour |
| Verify and freeze | Low | Under an hour |
| **Total** | | **About four hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Backup created (if data changes). Not applicable: no data changes
- [x] Feature flag configured. Not applicable
- [x] Monitoring alerts set. Not applicable

### Rollback Procedure
1. Revert the phase commit.
2. Let the pre-commit gates re-mint the manifest and recompile the contracts.
3. Rerun the parity suites.
4. No notice is needed.

### Data Reversal
- **Has data migrations?** No
- **Reversal procedure**: N/A
<!-- /ANCHOR:enhanced-rollback -->

---
