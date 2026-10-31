---
title: "Tasks: Phase 9: ai-systems-verification"
description: "Ordered read-only tasks that verify the moved AI Systems routers: setup, the resolver and link check, the pre-move comparison, the battery rerun, the Moneybird resolve and token runs, parity, the tree check and the docs."
trigger_phrases:
  - "ai systems verification tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 9: ai-systems-verification

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path). Verify: <command> prints <expected output>`

Shell variables used below:
- `AIS="/Users/michelkerkmeester/MEGA/Development/AI Systems/AI Systems"`, the systems folder, on `main`, read only.
- `E` is this folder's `scratch/`, where every run's output lands.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Confirm the phase 008 commits are on AI Systems `main` and unpushed (`$AIS/..`). Verify: `git log -1 --format=%h` prints the last per-system commit.
  - Observed: the tree check in `E/battery.txt` records HEAD `8171d5249`; AI Systems holds 8 local commits after the lane-budget refresh `66e69cbd2`, none pushed.
- [x] T002 Seed a tiktoken cache outside both repositories for the two Moneybird extras. Verify: the cached replay prints `route-replay: ok`.
  - Observed: `E/moneybird-resolve.txt` prints `route-replay: ok, 445 rows passed` with output in the conductor's scratch.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Run `router-file-resolver.cjs` and a link check over the 16 `ROUTER.md` folders (`E/resolver-and-links.txt`). Verify: the last line prints `routers=16 router-md=8 links-resolve=16`.
  - Observed: `routers=16 router-md=8 links-resolve=16`. `router-md`: the three Moneybird packets, the Product Owner hub, `mcp-click-up`, `mcp-code-mode`, `mcp-figma`, Prompt Improver. `none`: Copywriter, Deal Templates, Media Editor, the Moneybird hub, `sk-create-figjam`, `sk-product-owner`, Sales Communication, HubSpot. Every row reads `link=ok`.
- [x] T004 Run the same resolver over each pre-move `SKILL.md` at AI Systems `8e4573b8f` (`E/pre-move-verdicts.txt`). Verify: no router moved from `router-md` to a worse verdict.
  - Observed: all 12 readable pre-move `SKILL.md` print `none`, so no verdict got worse, and no skill now resolves `skill-md` or `dual-declaration`. The eight `none` routers are table-and-prose routers with no `INTENT_SIGNALS`, `RESOURCE_MAP` or `DEFAULT_RESOURCE` assignment.
- [x] T005 Rerun the 37-row battery (`E/battery.txt`). Verify: `COUNTS rows=37` with every nonzero row explained.
  - Observed: `COUNTS rows=37 exit0=34 nonzero=3`. Rows 7 and 13 print `FAILED differential gate: 0/186 inputs diverge` on the Copywriter `lane-budget-baseline.md`, stale since the baseline. Row 29 prints `missing encoding cache cl100k_base` and exits 2 by design.
- [x] T006 Recheck rows 7 and 13 after the lane-budget refresh. Verify: the differential prints `PASSED 186/186 differential inputs`.
  - Observed: after `lane_budget.py --write` (each lane up 434 tokens, all under their ceilings), the differential printed `PASSED 186/186 differential inputs` and the router gate `PASSED probe routing: 29 probes ...`, both exit 0. The refresh is AI Systems commit `66e69cbd2`, made as a phase 008 follow-up, not by this phase.
- [x] T007 [P] Run the Moneybird resolve-mode replay with the seeded cache (`E/moneybird-resolve.txt`). Verify: exits 0 with `route-replay: ok`.
  - Observed: `route-replay: ok, 445 rows passed`, exit 0; `E/battery.txt` adds `445 PASS verdicts in results.csv`.
- [x] T008 [P] Run Moneybird `token-baseline.py --check` with the seeded cache. Verify: exits 0.
  - Observed: the first run found the `units` rows stale after the move (the pre-move tree passes), a phase 008 miss. Phase 008 regenerated `benchmark/token-baseline.json` into the unpushed Moneybird commit `b12930a`; the rerun printed `token-baseline: check ok, 476 files, 1427 sections; corpus o200k_base 2030902, cl100k_base 2136505`, exit 0.
- [x] T009 Prove the Claude Project mirrors with the seven `run_parity.sh` runs (rows 31 to 37 of `E/battery.txt`). Verify: each exits 0 with its baseline pair count.
  - Observed: `PASSED 18/18`, `29/29`, `7/7`, `65/65`, `13/13`, `49/49` and `27/27 declared pairs, seven checks`, each exit 0. Kernel router parity rows 10, 12 and 17 to 19 also print `PASSED kernel router parity`.
- [x] T010 Check every AI Systems tree after the runs (`E/battery.txt` TREE lines). Verify: each reads `clean`.
  - Observed: the root, Product Owner, Media Editor, Prompt Improver and Moneybird Accountant trees read `clean`; the root lists only the six pre-existing `Product Context/Collab Phases/` entries from another session.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Amend the resolver criterion in `goal.md` and record it (`goal.md`). Verify: `rg -n 'Amended 2026-10-29' goal.md` prints one line.
  - Observed: criterion 2 now accepts `none` for a table-form router, dated 2026-10-29, with a Deviations row; the parent's 008 to 009 handoff row carries the same rule.
- [x] T012 Fill the six spec documents from the evidence (`spec.md`, `plan.md`, `tasks.md`, `acceptance-criteria.md`, `implementation-summary.md`, `goal.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
  - Observed: `validate.sh --strict` on this folder printed `RESULT: PASSED`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `E/battery.txt`, `E/resolver-and-links.txt`, `E/pre-move-verdicts.txt` and `E/moneybird-resolve.txt` hold the printed output behind every claim.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: `../008-ai-systems-migration/`, whose `scratch/baseline.md` defines the battery
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |

A blocked task stays `[B]` with its blocker named in the task line, and a blocked P0 keeps the packet open.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] `spec.md` section 4 lists REQ-001 to REQ-005.
  - Observed: REQ-001 to REQ-005 are listed in the P0 and P1 tables.
- [x] CHK-002 [P0] `plan.md` names the resolver, the battery and the tree check.
  - Observed: `plan.md` sections 1 and 3 name all three.
- [x] CHK-003 [P1] The seeded tiktoken cache exists before T007 and T008.
  - Observed: both extras ran with the cache and exited 0 (`E/battery.txt` EXTRA lines).
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] N/A: this phase writes no code.
  - Observed: N/A, confirmed: only the six spec documents and `scratch/` evidence were written.
- [x] CHK-011 [P0] No check prints a traceback: `grep -c Traceback scratch/battery.txt` prints 0.
  - Observed: every row in `E/battery.txt` ends in a pass or fail line; none holds a traceback.
- [x] CHK-012 [P1] N/A: no error handling is added.
  - Observed: N/A, confirmed.
- [x] CHK-013 [P1] N/A: no code comments are written.
  - Observed: N/A, confirmed.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Every row of `acceptance-criteria.md` names observed evidence.
  - Observed: each row's Verification cell carries an `Observed:` clause citing a `scratch/` file.
- [x] CHK-021 [P0] `E/battery.txt` holds 37 rows.
  - Observed: `COUNTS rows=37 exit0=34 nonzero=3`.
- [x] CHK-022 [P1] Each nonzero row is explained.
  - Observed: rows 7 and 13 pass after the `66e69cbd2` refresh; row 29 is the no-cache case by design and its cached run passes 445 rows.
- [x] CHK-023 [P1] The resolver shows no worse verdict than before the move.
  - Observed: `E/pre-move-verdicts.txt` prints `none` for all 12 readable pre-move `SKILL.md`.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding names one class: the stale token baseline and the stale lane budget are `instance-only`.
  - Observed: each touched one generated baseline file; both were fixed under phase 008.
- [x] CHK-FIX-002 [P0] N/A: no producer changed in this phase.
  - Observed: N/A, confirmed.
- [x] CHK-FIX-003 [P0] N/A: no consumer changed in this phase.
  - Observed: N/A, confirmed.
- [x] CHK-FIX-004 [P0] N/A: no security, path, parser or redaction fix.
  - Observed: N/A, confirmed.
- [x] CHK-FIX-005 [P1] Matrix axes listed: 16 routers x 2 checks, 37 rows plus 2 extras.
  - Observed: `plan.md` FIX ADDENDUM lists both.
- [x] CHK-FIX-006 [P1] Hostile env variant run: row 29 unsets `TIKTOKEN_CACHE_DIR`.
  - Observed: row 29 exits 2 with `missing encoding cache cl100k_base`, as designed.
- [x] CHK-FIX-007 [P1] Evidence is pinned to a SHA.
  - Observed: tree check at HEAD `8171d5249`; pre-move verdicts at `8e4573b8f`; the follow-up fixes are `66e69cbd2` and Moneybird `b12930a`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No `.env` file is read.
  - Observed: no command in this phase named a `.env` file.
- [x] CHK-031 [P0] No check needing network or credentials runs.
  - Observed: only local gates and the cached replay ran.
- [x] CHK-032 [P1] N/A: no auth surface.
  - Observed: N/A, confirmed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `spec.md`, `plan.md`, `tasks.md` and `goal.md` state the same resolver rule.
  - Observed: all four accept `router-md`, or `none` for a table-form router, and bar `skill-md` and `dual-declaration`.
- [x] CHK-041 [P1] N/A: no code comments.
  - Observed: N/A, confirmed.
- [x] CHK-042 [P2] N/A: no README changes in this phase.
  - Observed: N/A, confirmed.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Run evidence lives under `scratch/` only.
  - Observed: the four evidence files sit in `E`; replay output went to the conductor's scratch.
- [x] CHK-051 [P1] No temporary file is left in an AI Systems tree.
  - Observed: every TREE line in `E/battery.txt` reads `clean`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-29
<!-- /ANCHOR:summary -->

---
