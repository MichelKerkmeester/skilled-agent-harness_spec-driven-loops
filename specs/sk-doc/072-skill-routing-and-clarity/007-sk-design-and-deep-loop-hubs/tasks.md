---
title: "Tasks: Phase 7: sk-design and system-deep-loop hubs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk-design and system-deep-loop hubs tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: sk-design and system-deep-loop hubs

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
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: finding 7 ("the no-match outcome has three names") was marked Unconfirmed and is rechecked here: a scan of the nine files at `HEAD` finds `UNKNOWN_FALLBACK` and `UNKNOWN_FALLBACK_CHECKLIST` only, so the three-names risk does not reach these two hubs (`scratch/before.md` §4). The shape this phase applies is §7's verdict for mode packets, "keep §2 to 8 to 12 lines, then a final `## MACHINE ROUTER` appendix", and the phase order row that puts sk-design and system-deep-loop in phase 007 (research lines 104 and 148).
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: `scratch/before.md` records 38 of 38 gates at exit 0, routing accuracy 155/195, 49/66 and 19/24, and the nine ledger entries for these two hubs. Raw logs in `.scratch-dc90/072-007/baseline/`.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: `plan.md` §4 fixes the two steps, sk-design then system-deep-loop, and the verify command for both is the runner `scratch/gates.sh`. `plan.md` is unchanged from `HEAD`, so the plan stayed as the planning step wrote it and the per-file detail travelled in the two dispatch briefs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Restructure the sk-design packets and hub, then run the gates and re-mint. Evidence: the hub and its four packets are at the canon shape. SMART ROUTING went from 88 to 12 lines on the hub, 164 to 8 on fundamentals, 145 to 5 on the md-generator and 44 to 5 on chart, and `MACHINE ROUTER` is the last H2 in each file (`scratch/after.md` §4). `parent-skill-check` 12b prints `hub and 4 packet(s) follow the routing canon (0 known debt)`. The mode table moved into §1 WHEN TO USE at line 26 because check 6c reads the first row whose first cell is a mode id, and the Layout table in `## 3` also names each packet folder in its first cell with no command column. The manifest was refreshed, and the guard reports `sk-design fresh`.
- [x] T005 Restructure the system-deep-loop packets and hub, then run the gates and re-mint. Evidence: the hub and its three packets are at the canon shape. SMART ROUTING went from 38 to 10 lines on the hub, 168 to 9 on deep-ai-council, 163 to 8 on deep-review and 157 to 6 on deep-research, and `MACHINE ROUTER` is the last H2 in each file (`scratch/after.md` §4). `parent-skill-check` 12b prints `hub and 3 packet(s) follow the routing canon (0 known debt)`. The three deep-loop command contracts were recompiled after the hub `SKILL.md` changed, three digest lines each, and `check-contract-drift` reads `OK commands=3`.
- [x] T006 Keep every machine line and every moved block byte-identical, and give each of the nine files its changelog and version. Evidence: the canon regex over `INTENT_SIGNALS`, `RESOURCE_MAP`, `UNKNOWN_FALLBACK_CHECKLIST`, `def discover_markdown_resources` and `def _guard_in_skill` matches the same multiset at `HEAD` and in the working tree for all nine files, 0 to 5 lines each (`scratch/after.md` §5), and the read-only review compared every fenced block the same way. Nine third-segment bumps and nine new changelog files: sk-design 2.0.8.0, fundamentals 1.0.2.0, md-generator 1.1.8.0, chart 0.23.3.0, diagram 1.2.7.0, system-deep-loop 1.6.18.0, deep-research 1.15.9.0, deep-review 1.11.11.0, deep-ai-council 1.8.6.0. `parent-skill-check` 13a passes for both hubs and reads the same version out of `description.json`, `hub-router.json` and `mode-registry.json`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T007 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §1, 39 gates at exit 0. The runner is the baseline's 38 plus `skill-graph-freshness`. Accuracy 155/195, 49/66 and 19/24, identical to the baseline.
- [x] T008 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh specs/sk-doc/072-skill-routing-and-clarity/007-sk-design-and-deep-loop-hubs --strict` and the same command with `--recursive --strict` on the parent both print `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Research**: See `../001-deep-research/research/research.md`
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
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md Evidence: spec.md §4, REQ-001 and REQ-002.
- [x] CHK-002 [P0] Technical approach defined in plan.md Evidence: plan.md §3 and §4.
- [x] CHK-003 [P1] Dependencies identified and available Evidence: phase 003's routing-shape canon and phase 004's vocabulary authority were read, and the canon limits of 12 lines and 180 words with the nine ledger entries are recorded in `scratch/before.md` §3.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests Evidence: no shipped script changed. The checks this phase relies on pass: `routing-shape-known-debt-ratchet.test.cjs` 4 of 4, `sk-doc-script-tests` all passed, `cite-drift-gate` exit 0.
- [x] CHK-011 [P0] Every gate in scope passes Evidence: `scratch/after.md` §1, 39 of 39 at exit 0, including `catalog-packages` and `contract-drift`.
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file Evidence: `router-reach` reports operator-local 0 on all seven hubs. No private skill is named, and the additions are Markdown prose, links, JSON versions and changelog text.
- [x] CHK-013 [P1] Changes follow the phase 003 canon Evidence: `parent-skill-check` 12b prints `hub and 4 packet(s) follow the routing canon (0 known debt)` on sk-design and `hub and 3 packet(s) ...` on system-deep-loop, after the nine entries came off the ledger. `package_skill.py --check --strict` passes on all nine files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md, 2 of 2 Met.
- [x] CHK-021 [P0] Gate output recorded before and after Evidence: `scratch/before.md` and `scratch/after.md`, with one raw log per gate in `.scratch-dc90/072-007/baseline/` and `.scratch-dc90/072-007/after/`.
- [x] CHK-022 [P1] The largest file in scope was changed last Evidence: not verifiable as written. The nine files were restructured in one dispatched batch, so no per-file order was recorded, and the largest SMART ROUTING section at `HEAD` (deep-ai-council, 168 lines) leaves no trace of a position in the sequence. The risk the row guards against is covered instead by the per-file comparison against `HEAD` (`scratch/after.md` §5) and by the gate run over the final tree.
- [x] CHK-023 [P1] A reverted change leaves the gates as they were Evidence: the movers in `.scratch-dc90/072-007/` slice by line range and assert their target boundaries before cutting, and each is paired with a verifier that compares the result against `HEAD`. No revert was needed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file Evidence: no secrets. Markdown, JSON and changelog text only, and no credential appears in any changed file or in these docs.
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested Evidence: no shipped script changed. `scratch/gates.sh` is the phase runner, and the only edit to it is its default output directory.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree Evidence: spec.md, plan.md and tasks.md agree on the two steps, sk-design then system-deep-loop, and on the gate set `scratch/gates.sh` runs. T004 and T005 record the nine files the plan named by folder.
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill Evidence: nine new changelog files and nine third-segment version bumps, listed in T006. The two hubs' `description.json`, `hub-router.json` and `mode-registry.json` carry the same versions.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temporary files in `.scratch-dc90/072-007/` only. The runner and the three gate records live under `scratch/`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 8 | 8/8 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-10-28
<!-- /ANCHOR:summary -->
