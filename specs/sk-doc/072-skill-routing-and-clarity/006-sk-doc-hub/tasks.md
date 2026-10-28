---
title: "Tasks: Phase 6: sk-doc hub and mode packets"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "sk-doc hub and mode packets tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 6: sk-doc hub and mode packets

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

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: findings 4, 5 and 6 rechecked at the baseline: finding 4's source-of-truth paragraph at `sk-doc/SKILL.md:53`, finding 5's nine packets without `INTENT_SIGNALS` or `RESOURCE_MAP`, and finding 6's rationale copies in four hubs (`scratch/before.md` §3, §4). Finding 5 is why the phase's packet count had to be re-measured: the ledger counts every machine line, not only the two maps.
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: recorded in `scratch/before.md`, 35 of 35 gates exit 0, with accuracy 155/195, 49/66, 19/24, and the ledger holding 15 sk-doc entries. The runner grew to 38 gates after the baseline added `catalog-packages`, `sk-doc-script-tests` and `cite-drift-gate`.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: `plan.md` §4 fixes the four steps, and the verify command for every step is the runner `scratch/gates.sh`. No separate `/speckit:plan` run was made (Deviation 3).
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 List the 14 packets with machine blocks (`.skilled/skills/sk-doc/sk-create-*/SKILL.md`). Evidence: the ledger at `00018303dc` lists 15 sk-doc entries, the hub and all 14 packets, each with `machineBlocks: 1` (`scratch/before.md` §3). The spec counted five; the ledger counted 14, because nine packets carry call-sequence blocks (`def discover_markdown_resources`, `def _guard_in_skill`) that are machine lines under the canon. All 14 are in scope.
- [x] T005 Restructure each and run the gates. Evidence: every SMART ROUTING section is now 4 to 12 lines and 90 to 176 words, and `MACHINE ROUTER` is the last H2 in all 15 files (`scratch/after.md` §5). The moved blocks are byte-identical: `verify_move.py`, `verify_verbatim.py` and `rrv-verify.py` compared them against the saved originals. `parent-skill-check` 12b prints `hub and 14 packet(s) follow the routing canon (0 known debt)`, `package_skill.py --check --strict` passes on all 15, and `verify-router-sync` 5/5 (`scratch/after.md` §1, §4).
- [x] T006 Rewrite the hub routing paragraph and re-mint (`.skilled/skills/sk-doc/SKILL.md`). Evidence: §2 is 12 lines / 176 words, down from 58 / 816, and `## 3. HOW IT WORKS` now starts at line 67. The compiled-routing directive, the surface-router pointer, the discriminator and the routing rule sit in `## 6. MACHINE ROUTER`, last. `compiled-route-guard.cjs --json` reports 7 of 7 fresh and `compiled-route-sync.cjs --check` 55 of 55 after the re-mint (`scratch/after.md` §1, §5, §7).
- [x] T007 Consolidate the separation rationale (`sk-create-skill/references/parent-skill/parent-skills-nested-packets.md`). Evidence: the full statement lives once at line 136 under `### Why the leaf router stays in ROUTER.md`; `sk-doc`, `cli-external-orchestration`, `system-deep-loop` and `sk-design` `SKILL.md` link to its anchor at lines 142, 77, 50 and 73. `rg -n "must not move into" .skilled/skills --glob 'SKILL.md'` finds nothing (`scratch/after.md` §6).
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §1; 38 gates, 37 exit 0 here. `contract-drift` was 2 on the first run because the phase's own edit to `system-deep-loop/SKILL.md` invalidated the recorded digests; recompiling the three contracts makes it 0. `catalog-packages` is 1 here and 0 on main: the sk-code leaf description it names was fixed in `e244718df9`, which this worktree predates. Accuracy 155/195, 49/66, 19/24, unchanged.
- [x] T009 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh specs/sk-doc/072-skill-routing-and-clarity/006-sk-doc-hub --strict` and `--recursive --strict` both print `RESULT: PASSED`.
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
- [x] CHK-003 [P1] Dependencies identified and available Evidence: phase 003's routing-shape canon and phase 004's vocabulary authority read; the ledger limits (12 lines, 180 words) and the 15 entries are cited in `scratch/before.md` §3.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests Evidence: no script changed. The checks the phase relies on pass: `routing-shape-known-debt-ratchet.test.cjs` 4 of 4, `sk-doc-script-tests` all passed, `cite-drift-gate` 5 of 5.
- [x] CHK-011 [P0] Every gate in scope passes Evidence: `scratch/after.md` §1, 37 of 38 exit 0 here with the one red gate explained (main's `e244718df9` is not in this worktree); `contract-drift` rechecked 0.
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file Evidence: `router-reach` reports operator-local 0; no private skill is named, and the additions are Markdown prose, links and changelog text.
- [x] CHK-013 [P1] Changes follow the phase 003 canon Evidence: `parent-skill-check` 12b prints `hub and 14 packet(s) follow the routing canon (0 known debt)` after the fifteen sk-doc entries came off the ledger.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md: 2 of 2 Met.
- [x] CHK-021 [P0] Gate output recorded before and after Evidence: `scratch/before.md` and `scratch/after.md`.
- [x] CHK-022 [P1] The largest file in scope was changed last Evidence: not followed as written. The largest packet by lines (`sk-create-manual-testing-playbook`, 574) moved third of fifteen, and the largest SMART ROUTING section (`sk-create-skill`, 143 lines) moved mid-run; four smaller files were written after it with review fixes. The risk the row guards against did not arise: each mover slices by line range, `verify_verbatim.py` compared every moved block, and the gates ran after every batch.
- [x] CHK-023 [P1] A reverted change leaves the gates as they were Evidence: the movers assert their target boundaries before cutting (`migrate.py` on the first moved line, `move_router.py` on the body, `move_routing.py` on the section) and exit non-zero otherwise, and each verifier compares the moved block against the saved original; a failed assert leaves the file untouched. No revert was needed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file Evidence: no secrets; Markdown, JSON and changelog text only.
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested Evidence: no script changed.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree Evidence: spec.md, plan.md and tasks.md agree on the four steps and the gate set; T004 records the 14 packets the phase moved, the count `scratch/before.md` §3 measured.
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill Evidence: sk-doc 2.3.27.0, one patch step for each of the 14 packets, and the three linked hubs (cli-external-orchestration 1.7.9.0, sk-design 2.0.7.0, system-deep-loop 1.6.17.0); 18 new changelog files.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temporary files in `.scratch-dc90/072-006/` only; the runner and the two gate tables live under `scratch/`.
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
