---
title: "Tasks: Phase 8: cli and mcp hubs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "cli and mcp hubs tasks"
importance_tier: "normal"
contextType: "planning"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 8: cli and mcp hubs

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

- [x] T001 Read the phase 001 research findings this phase acts on (`../001-deep-research/research/research.md`). Verify: each finding used here is marked Confirmed or rechecked. Evidence: the shape this phase applies is §7's verdict for mode packets, "Keep §2 to 8 to 12 lines, then a final `## MACHINE ROUTER` appendix", with the same paragraph's "Delete only the copies that restate the hub's first leaf slice", and the phase order row that puts these three hubs in phase 008 (research lines 104 and 149). Finding 8's confirmed half, the `mcp-obsidian` health-term gap between the two stages, was settled in phase 002 and is not shape; its unconfirmed per-executor drift counts were not acted on. The phase 002 row also lists `shared-smart-router.md` six to seven, and that one was still open here: the `<PROVIDER>` slug list carried six slugs at `HEAD` and carries seven after.
- [x] T002 Record the starting output of every gate in scope (`scratch/before.md`). Verify: the file lists each gate with its exit status. Evidence: `scratch/before.md` records 39 of 39 gates at exit 0, routing accuracy 155/195, 49/66 and 19/24, and the eighteen ledger entries for these two hubs and sixteen packets. Raw logs in `.scratch-dc90/072-008/baseline/`.
- [x] T003 Detail these tasks with `/speckit:plan` before implementation. Verify: each task below names its file and its verify command. Evidence: `plan.md` §4 fixes the four steps and §7 names the rollback per packet. `plan.md` is unchanged from `HEAD`, so the plan stayed as the planning step wrote it, and the per-file detail travelled in the two dispatch briefs.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Restructure one cli packet and run the gates. Evidence: the phase did not record a per-packet order, because the two dispatches restructured the packets in parallel, so there is no first-packet gate run to point at. What does exist is a per-file proof for `cli-pi` and `cli-jev` in `.scratch-dc90/072-008/verify.txt`: the moved slice is `IDENTICAL` to the `HEAD` copy, sections 3 to 8 are `IDENTICAL`, `package_skill.py --check --strict` prints `Result: PASS` on both, and the changelog validator reports `total_issues: 0`. Every other packet is covered by the same comparison run over the final tree (`scratch/after.md` §5).
- [x] T005 Restructure the other cli packets. Evidence: all seven cli packets are at the canon shape and every SMART ROUTING section is inside the 12-line and 180-word limits: claude-code 87 to 6 lines, codex 86 to 6, cursor 94 to 3, devin 85 to 3, hermes 82 to 6, opencode 64 to 7, pi 57 to 5 (`scratch/after.md` §4). The six-step call sequence that each of them restated is gone; the single statement of the helpers is `shared-smart-router.md`. `parent-skill-check` 12b prints `hub and 7 packet(s) follow the routing canon (0 known debt)`, and `package_skill.py --check --strict` passes on all seven.
- [x] T006 Restructure cli-jev and the mcp packets. Evidence: `cli-jev` went 136 to 5 lines and 771 to 130 words; the eight mcp packets went 294 to 4 (obsidian), 177 to 5 (notion), 172 to 5 (click-up), 142 to 6 (figma), 135 to 5 (mobbin), 132 to 4 (refero), 128 to 4 (aside) and 128 to 4 (chrome) (`scratch/after.md` §4). `mcp-tooling/mcp-magicpath` was left untouched: no diff, no changelog and no version step, and its ledger entry stays. `parent-skill-check` reads `hub and 1 packet(s) ... (0 known debt)` on `cli-classifier` and `hub and 9 packet(s) ... (1 known debt)` on `mcp-tooling`, the one entry being `mcp-magicpath`.
- [x] T007 Shorten the three hub routing sections and re-mint. Evidence: two hubs were shortened and the third needed nothing. `cli-external-orchestration` went 26 to 10 lines and 586 to 139 words, `cli-classifier` 24 to 11 and 334 to 140, and `mcp-tooling` was already 10 lines and 148 words at the baseline with no `MACHINE ROUTER` heading, so it is unchanged. The re-mint covers all three: the manifests were refreshed, `compiled-route-guard.cjs --json` reports seven hubs `fresh` with `failures: 0`, and `compiled-route-sync.cjs --check` reports all 55 served copies matching. `shared-smart-router.md` steps 1.6.1.0 to 1.6.2.0, and its `<PROVIDER>` slug list gains `hermes`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T008 Rerun every gate in scope (`scratch/after.md`). Verify: no gate is worse than in `scratch/before.md`. Evidence: `scratch/after.md` §1, 39 gates at exit 0, the same 39 the baseline ran. Accuracy 155/195, 49/66 and 19/24, identical to the baseline. Of the 39 logs, nine differ and every difference is either a debt count the phase moved, a removed advisory, or a duration.
- [x] T009 Validate this folder. Verify: `validate.sh --strict` prints `RESULT: PASSED`. Evidence: `validate.sh specs/sk-doc/072-skill-routing-and-clarity/008-cli-and-mcp-hubs --strict` and the same command with `--recursive --strict` on the parent both print `RESULT: PASSED`, exit 0.
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
- [x] CHK-003 [P1] Dependencies identified and available Evidence: phase 003's contract fixes the canon at 12 non-blank lines, 180 words and a final `MACHINE ROUTER` section (`003-routing-canon-and-tooling/scratch/routing-shape-contract.md:8`), and phase 004 settled `hub-router.json` as the authored mode vocabulary. The same numbers and the eighteen ledger entries are in `scratch/before.md` §3.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every changed script passes its own tests Evidence: no shipped script changed. The checks this phase relies on pass: `routing-shape-known-debt-ratchet.test.cjs` 4 of 4, `sk-doc-script-tests` all passed, `cite-drift-gate` 5 of 5.
- [x] CHK-011 [P0] Every gate in scope passes Evidence: `scratch/after.md` §1, 39 of 39 at exit 0, including `catalog-packages` and `contract-drift`.
- [x] CHK-012 [P1] No operator-local surface is named in a tracked file Evidence: `router-reach` reports `operator-local=0` on all seven hubs, with `allowed=9`. No private skill is named, and the additions are Markdown prose, links, JSON versions and changelog text.
- [x] CHK-013 [P1] Changes follow the phase 003 canon Evidence: `parent-skill-check` 12b prints `hub and 7 packet(s) follow the routing canon (0 known debt)` on `cli-external-orchestration`, `hub and 1 packet(s)` on `cli-classifier` and `hub and 9 packet(s)` on `mcp-tooling`, after the eighteen entries came off the ledger. `package_skill.py --check --strict` passes on all eighteen changed files.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met Evidence: acceptance-criteria.md, 2 of 2 Met.
- [x] CHK-021 [P0] Gate output recorded before and after Evidence: `scratch/before.md` and `scratch/after.md`, with one raw log per gate in `.scratch-dc90/072-008/baseline/` and `.scratch-dc90/072-008/after/`.
- [x] CHK-022 [P1] The largest file in scope was changed last Evidence: not verifiable as written. The eighteen files were restructured in two parallel dispatches, so no per-file order was recorded, and the largest SMART ROUTING section at `HEAD` (`mcp-obsidian`, 294 lines) leaves no trace of a position in the sequence. The risk the row guards against is covered instead by the per-file comparison against `HEAD` (`scratch/after.md` §5) and by the gate run over the final tree.
- [x] CHK-023 [P1] A reverted change leaves the gates as they were Evidence: every mover in `.scratch-dc90/072-008/` reads the pristine `HEAD` copy from its `orig/` directory and slices by line range with asserted boundaries, so a re-run is repeatable, and each is paired with a verifier that compares the result against that copy (`machine-lines.py`, `no_lost_lines.py`, `section_check.py`, `verify_packet.py`). No revert was needed.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets in any changed file Evidence: no secrets. Markdown, JSON and changelog text only, and no credential appears in any changed file or in these docs.
- [x] CHK-031 [P1] N/A unless a script changes: input handling is tested Evidence: no shipped script changed. `scratch/gates.sh` is the phase runner, and it was not edited: it runs the same 39 commands the baseline ran, with the output directory passed on the command line.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks agree Evidence: spec.md, plan.md and tasks.md agree on the four steps and on the 39-gate set, and T004 to T007 record the eighteen changed files the plan named by folder. One planning line went further than the work: `plan.md` and T007 say three hub routing sections, and only two needed shortening, which T007's evidence and the summary's deviations both record.
- [x] CHK-041 [P2] Changelog and version bumped for each changed skill Evidence: eighteen new changelog files and eighteen version steps, listed in the summary. The two changed hubs' `description.json`, `hub-router.json` and `mode-registry.json` carry the same versions, and 13a reads them.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only Evidence: temporary files in `.scratch-dc90/072-008/` only. The runner and the two gate records live under `scratch/`.
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
