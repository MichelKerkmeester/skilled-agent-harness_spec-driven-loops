---
title: "Tasks: Phase 20: align-system-deep-loop"
description: "Ordered tasks for one operator-local alignment check over system-deep-loop: scope, battery, probes, review lanes, critic, fix lane, prose pass, recheck and the routing parse check."
trigger_phrases:
  - "align system deep loop tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 20: align-system-deep-loop

<!-- SPECKIT_LEVEL: 1 -->

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

`S` is `.skilled/skills/system-deep-loop/`. `R` is the run folder outside the checkout, which holds `evidence.md`, `report.md`, `fix-plan.md`, `findings.json` and `probes.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the system-deep-loop files changed since base `6a9946a800` (`R/scope.json`). Verify: the scope line names 27 first-parent commits.
  - Observed: Commits: `6a9946a80064c9971385d4c9cfba6bf9809fd1a5` to `4f741f6b48ac5825a3ce18dbe19575d76043885f`, 27 first-parent commits. Files: 47, of which 0 uncommitted or untracked.
- [x] T002 Run the existing check battery on the pushed tree (`R/battery.json`). Verify: no row fails.
  - Observed: `{"pass":96,"not_applicable":3}`.
- [x] T003 [P] Score the routing probe prompts against the advisor (`R/probes.json`). Verify: `run-probes` prints its counts.
  - Observed: `STATUS=FINDINGS run-probes: pass=12 fail=2 cannot_run=0`. P03, an autoresearch session over the trigger index retrieval path, expected system-deep-loop and got system-spec-kit. P14, planning a new cache layer, expected system-spec-kit and got no skill. This phase changes no routing, so both results stand as recorded in `R/probes.json`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Send the four read-only review lanes over the scope (`R/lanes/`). Verify: lanes A, B, C and D report.
  - Observed: lanes A, B, C and D ran with DeepSeek V4.1 Flash workers.
- [x] T005 Let the critic overturn weak findings (`R/critic.json`). Verify: the findings line counts the overturned ones apart.
  - Observed: 29 findings (P0 0, P1 6, P2 23), 19 literal, 1 inferred, 17 outside the scope. The critic overturned 7 more, which are not counted.
- [x] T006 Apply the upheld findings that do not change routing through the fix lane (`S`). Verify: each result line reads FIXED, LEFT or OUTSIDE.
  - Observed: 26 FIXED lines, 1 LEFT and 1 OUTSIDE. One FIXED line covers a bullet in each of the five changelogs, and C-5 covers two reference files. The fixes point the playbooks and the catalog at ROUTER.md for the discriminator, backend routing and mode-hint rules, retarget six deep-review playbook line ranges and one deep-research range, add ROUTER.md to the README, remove two no-op `addRedaction` calls and correct the council examples. OUTSIDE D-10 (`hub-router.json` needs three phrases in `vocabularyClasses`): Routing data in hub-router.json vocabularyClasses; held by the no-routing-change decision, carried to the routing follow-up.
- [x] T007 Fix the router prose the fix lane was barred from (`S`). Verify: each LEFT or OUTSIDE line carries a disposition.
  - Observed: LEFT D-07 held, but line 103 sits in the MACHINE ROUTER section the fix lane must not edit. Disposition: Fixed after the fix lane: the sentence now says SKILL.md keeps a short routing summary and a pointer, matching the other hubs.
- [x] T008 Run the fix-lane checks over the edited files. Verify: each check passes or matches HEAD.
  - Observed: `package_skill.py --check --strict` printed `Result: PASS` for the hub, deep-review, deep-research and deep-ai-council. It printed `FAIL (SKILL.md not found)` for runtime, manual-testing-playbook and feature-catalog, which are nested layers with no SKILL.md; runtime has none at HEAD either. `validate_document.py` printed `Total issues: 0` on 24 changed markdown files, and 1 `document_type_fallback` warning on `feature-catalog.md`, identical on the HEAD blob. `check-markdown-links.cjs` printed 0 broken links. `parent-skill-check.cjs` printed `OK: all hard invariants passed, 0 warnings`. `validate-playbook-package.cjs --strict` passed all 5 packages with `violations=0`. `tsc --noEmit -p runtime/tsconfig.json` printed `EXIT=0`. The runtime `vitest run --no-coverage` timed out after 1200s with no result; no test asserts the removed redactions.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the full battery against the worktree (`R/evidence.md`). Verify: each failure is classified.
  - Observed: `{"pass":107,"not_applicable":3,"fail":3}`. S7-compiled-route-guard is derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate. S11-hermes-skills is derived: the Hermes skill copies regenerate from source before the commit. S15-ci-contract-drift was fixed after this recheck: `compile-command-contracts.cjs --command deep/{ai-council,research,review} --write` recompiled the three deep command contracts, and `check-contract-drift.cjs` now prints `OK commands=3`.
- [x] T010 Prove routing did not change. Verify: the router-file resolver parses all 54 skill routers identically to HEAD.
  - Observed: all 54 skill routers parse identically to HEAD, which holds the packet decision that no skill routes differently.
- [x] T011 Fill this phase's four documents from the evidence (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
  - Observed: `validate.sh --strict` on this folder printed `RESULT: PASSED` with `Warnings: 0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `R/evidence.md` holds the first run, the fix-lane results and the recheck behind every claim here.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`, which records the routing follow-up
<!-- /ANCHOR:cross-refs -->

---
