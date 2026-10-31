---
title: "Implementation Plan: Phase 9: ai-systems-verification"
description: "A read-only verification of the 16 moved AI Systems routers: the Public resolver and a link check over each router, a pre-move verdict comparison, the 37-row battery rerun, the cached Moneybird resolve and token checks, and a tree check that proves no AI Systems file changed."
trigger_phrases:
  - "ai systems verification plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.4 -->
# Implementation Plan: Phase 9: ai-systems-verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node (`router-file-resolver.cjs`), Python 3 gates, bash runners |
| **Framework** | None |
| **Storage** | None; evidence files under this folder's `scratch/` |
| **Testing** | The AI Systems battery (37 rows), the Moneybird replay and token checks, `run_parity.sh` |

### Overview
Nothing in AI Systems changes. The resolver and a link check run over the 16 `ROUTER.md` folders, the same resolver runs over each pre-move `SKILL.md` at `8e4573b8f`, and the 37-row battery reruns with the two cached Moneybird checks. A `git status` of each AI Systems tree after the runs proves D1.
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
- [x] `scratch/battery.txt` prints `COUNTS rows=37 exit0=34 nonzero=3` with rows 7, 13 and 29 explained, and `scratch/resolver-and-links.txt` prints `routers=16 router-md=8 links-resolve=16`
- [x] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Other: read-only verification run.

### Key Components
- **`router-file-resolver.cjs`**: the Public resolver; prints `router-md`, `skill-md`, `dual-declaration` or `none` per skill folder from its `INTENT_SIGNALS`, `RESOURCE_MAP` and `DEFAULT_RESOURCE` assignments.
- **The 37-row battery**: the gate set defined in `008-ai-systems-migration/scratch/baseline.md`, including the seven `run_parity.sh` runs that compare each Claude Project kernel with its router.

### Data Flow
Each check reads the AI Systems tree and prints one line; the runner writes that line with its exit code to a file under this folder's `scratch/`, and replay output goes to a temp dir outside both repositories.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

N/A: this phase fixes nothing. The two findings it raised, the stale Moneybird token baseline and the stale Copywriter lane budget, were fixed under phase 008.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| AI Systems tree | Holds the moved routers and gates | unchanged | `scratch/battery.txt` TREE lines read `clean` |
| This spec folder | Records the evidence | update | `validate.sh --strict` |

Required inventories:
- Same-class producers: N/A, no producer changes.
- Consumers of changed symbols: N/A, no symbol changes.
- Matrix axes: 16 routers x (resolver verdict, link), and 37 battery rows plus 2 extras.
- Algorithm invariant: no router resolves `skill-md` or `dual-declaration`, so no router lives anywhere but `ROUTER.md`.
<!-- /ANCHOR:affected-surfaces -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. Setup confirms the start commit and cache, the run phase covers the resolver, pre-move comparison, battery, Moneybird extras, parity and tree check, and verification fills the docs.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Resolver verdict per router folder | `router-file-resolver.cjs` |
| Integration | 37 battery rows, Moneybird resolve and token checks | AI Systems gates, `route-replay.py --mode resolve`, `token-baseline.py --check` |
| Manual | Claude Project mirrors and tree state | `run_parity.sh` (seven), `git status --porcelain` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phase 008 local commits on AI Systems `main` | Internal | Green | Nothing to verify |
| Seeded tiktoken cache | External | Green | Resolve replay and token check exit 2 |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: a run is found to have written into an AI Systems tree.
- **Procedure**: `git -C <tree> checkout -- <path>` for a tracked file or delete the new untracked file, after naming it to the operator; this phase's own docs revert by restoring the six files.
<!-- /ANCHOR:rollback -->

---


---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Setup ──► Implementation ──► Verification
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | Phase 008 commits | Runs |
| Implementation (runs) | Setup | Verification |
| Verification (docs) | Runs | Close |
<!-- /ANCHOR:phase-deps -->

---
