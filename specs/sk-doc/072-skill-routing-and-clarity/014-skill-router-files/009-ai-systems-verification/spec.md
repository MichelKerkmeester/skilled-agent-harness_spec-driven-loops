---
title: "Feature Specification: Phase 9: ai-systems-verification"
description: "Phase 008 moved 16 AI Systems routers into sibling ROUTER.md files, but no run had yet proved that the moved tree resolves, links and passes its gates without this phase writing to it. This phase reruns the resolver, the link check, the 37-row battery, the Moneybird resolve and token checks and the seven parity runs read-only, and records the result."
trigger_phrases:
  - "ai systems verification"
  - "phase 9 ai systems verification"
  - "ai systems router resolver check"
  - "ai systems battery rerun"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.4 -->
# Feature Specification: Phase 9: ai-systems-verification

<!-- SPECKIT_LEVEL: 2 -->
---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-10-29 |
| **Branch** | AI Systems `main` read only; planning docs on `worktrees/274-packet-router-migration` |
| **Parent Spec** | ../spec.md |
| **Phase** | 9 of 9 |
| **Predecessor** | 008-ai-systems-migration |
| **Successor** | None |
| **Handoff Criteria** | Every AI Systems check exits 0 once the noted cases are counted, each of the 16 routers resolves `router-md` or `none` (table form) and none resolves `skill-md` or `dual-declaration`, all 16 `SKILL.md` links to `./ROUTER.md` resolve, and the seven parity runs pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is **Phase 9** of the Move the machine router of each skill in the AI Systems repository into a sibling ROUTER.md specification.

**Scope Boundary**: This phase reads the AI Systems checkout at `/Users/michelkerkmeester/MEGA/Development/AI Systems` and writes none of its files (goal decision D1). Writes land only in this spec folder: the six spec documents and the evidence files under `scratch/`. The six foreign `Product Context/Collab Phases/` entries belong to another session and stay untouched.

**Dependencies**:
- `008-ai-systems-migration`: the 16 moved routers, committed locally and unpushed, and its `scratch/baseline.md` battery definition (37 rows).
- The Public `router-file-resolver.cjs`, reached through the AI Systems `.skilled/skills` symlink to the Public main checkout.
- A seeded tiktoken cache for the Moneybird resolve-mode replay and `token-baseline.py --check`, kept in the conductor's scratch outside both repositories.

**Deliverables**:
- `scratch/resolver-and-links.txt`: resolver verdict and link state for the 16 routers.
- `scratch/pre-move-verdicts.txt`: the resolver over each readable pre-move `SKILL.md` at AI Systems `8e4573b8f`.
- `scratch/battery.txt`: the 37-row battery rerun, the two Moneybird extras and the tree check.
- `scratch/moneybird-resolve.txt`: the cached resolve-mode replay.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Phase 008 moved the machine router of 16 AI Systems skills into sibling `ROUTER.md` files and reran its own baseline, but the run that made the change also judged it. Nothing yet showed, from a run that changed no AI Systems file, that every router resolves through the Public resolver, that every `SKILL.md` link lands, and that the Claude Project kernels still match their routers.

### Purpose
A read-only rerun proves the moved tree resolves, links and passes its gates, and records any finding with the phase that owns its fix.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:measured-behavior -->
### Measured Behavior
Captured read-only on 2026-10-29 against AI Systems `main` at `8171d5249`. Full output in `scratch/resolver-and-links.txt`, `scratch/battery.txt` and `scratch/moneybird-resolve.txt`.
```text
$ node router-file-resolver.cjs <each of the 16 ROUTER.md folders>   # scratch/resolver-and-links.txt
routers=16 router-md=8 links-resolve=16

$ battery rerun                                                       # scratch/battery.txt
ROW 7 1 FAILED differential gate: 0/186 inputs diverge; lane-budget-baseline.md is not what lane_budget.py produces
ROW 13 1 FAILED differential gate: 0/186 inputs diverge; - lane budget: lane-budget-baseline.md is not what lane_budget.py produces
ROW 29 2 route-replay: missing encoding cache cl100k_base (TIKTOKEN_CACHE_DIR is not set); the row unsets it by design
EXTRA resolve 0 route-replay: ok, 445 rows passed (445 PASS verdicts in results.csv), output in run-009/mb-resolve
EXTRA token-baseline 0 token-baseline: check ok, 476 files, 1427 sections; corpus o200k_base 2030902, cl100k_base 2136505
COUNTS rows=37 exit0=34 nonzero=3
```
<!-- /ANCHOR:measured-behavior -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Run `router-file-resolver.cjs` over the 16 AI Systems `ROUTER.md` folders and check each `SKILL.md` link to `./ROUTER.md` on disk.
- Run the same resolver over each pre-move `SKILL.md` at AI Systems `8e4573b8f` and compare verdicts.
- Rerun the 37-row battery from `008-ai-systems-migration/scratch/baseline.md`, plus the Moneybird resolve-mode replay and `token-baseline.py --check` with a seeded tiktoken cache.
- Prove the Claude Project mirrors through the seven `benchmark/parity/run_parity.sh` runs (rows 31 to 37).
- Check each AI Systems working tree for changes after the runs.

### Out of Scope
- Fixing any finding inside AI Systems - D1 bars writes; each fix goes to the phase that owns it, here phase 008.
- Pushing the local AI Systems commits - the push waits for the operator's approval.
- A CI run - no CI run exists until the operator approves the push.
- A Claude Project routing knowledge document - option C, recorded in phase 008, ships none.

### Files to Change

All paths are relative to this spec folder.

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md` | Modify | Fill the scaffolds with the observed evidence and amend the resolver criterion |
| `scratch/resolver-and-links.txt`, `scratch/pre-move-verdicts.txt`, `scratch/battery.txt`, `scratch/moneybird-resolve.txt` | Create | Verbatim run evidence |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS
REQ ids run in one sequence across the P0 and P1 tables. A new requirement takes the highest REQ id plus one. validate.sh does not link ids between files.

### P0 - Blockers (MUST complete)

| ID | Requirement |
|----|-------------|
| REQ-001 | Every AI Systems check exits 0, counting row 29 as the no-cache case that exits 2 by design with its cached run passing, and rows 7 and 13 as passing after the stale lane budget is refreshed outside this phase. |
| REQ-002 | Each of the 16 routers resolves `router-md`, or `none` for a table-form router that declares no `INTENT_SIGNALS`, `RESOURCE_MAP` or `DEFAULT_RESOURCE` assignment; none resolves `skill-md` or `dual-declaration`. |
| REQ-003 | Each of the 16 `SKILL.md` links to `./ROUTER.md` resolves on disk. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement |
|----|-------------|
| REQ-004 | Each of the seven `benchmark/parity/run_parity.sh` runs exits 0 with its baseline pair count. |
| REQ-005 | No AI Systems working tree changes because of this phase's runs. |

> Acceptance criteria for these requirements live in `acceptance-criteria.md`,
> which is the document that decides whether this packet may close.
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `scratch/resolver-and-links.txt` ends `routers=16 router-md=8 links-resolve=16`, and its other 8 rows read `none`.
- **SC-002**: `scratch/battery.txt` prints `COUNTS rows=37 exit0=34 nonzero=3`, the three nonzero rows are 7, 13 and 29, and both `EXTRA` lines exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | Seeded tiktoken cache | Without it the resolve replay and token check exit 2 and prove nothing | Seed the cache in the conductor's scratch and set `TIKTOKEN_CACHE_DIR` for the two extra runs only |
| Risk | A check writes into the AI Systems tree, breaking D1 | Med | Run Python with `PYTHONDONTWRITEBYTECODE=1`, send replay output to a fresh temp dir, and check each tree's `git status` after the runs |
<!-- /ANCHOR:risks -->

---


---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS
N/A for performance: the phase runs no service, only one-off checks.
<!-- /ANCHOR:nfr -->

### Performance
- **NFR-P01**: N/A: one-off read-only checks with no latency target.
- **NFR-P02**: N/A: no throughput to measure.

### Security
- **NFR-S01**: No `.env` file is opened and no check that needs credentials or network runs.
- **NFR-S02**: The tiktoken cache lives outside both repositories, so no encoding file lands in a tracked tree.

### Reliability
- **NFR-R01**: Each AI Systems working tree shows no change from these runs (`scratch/battery.txt` TREE lines).
- **NFR-R02**: Every claim in this packet cites a file under `scratch/` that holds the printed output.

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Empty input: a router with no machine assignment (the eight table-form routers) resolves `none`, which is the resolver's answer for nothing to key on, and its pre-move `SKILL.md` resolved `none` too.
- Maximum input: the Moneybird resolve replay runs 445 rows and prints `route-replay: ok, 445 rows passed`.
- Failure path: row 29 unsets `TIKTOKEN_CACHE_DIR` by design and exits 2 with `missing encoding cache cl100k_base`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 6/25 | Read-only runs over 16 routers and 37 battery rows; writes only in this spec folder |
| Risk | 5/25 | No AI Systems write; the one risk is a check that writes, guarded by the tree check |
| Research | 6/20 | Explaining the eight `none` verdicts and the stale Moneybird token baseline |
| **Total** | **17/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Can the resolver criterion hold for table routers? Decision: no; it was amended on 2026-10-29 to accept `none` for a table-form router, in `goal.md` and in the parent's 008 to 009 handoff row.
- None else blocks.
<!-- /ANCHOR:questions -->

---

