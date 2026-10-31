---
title: "Tasks: Phase 21: align-system-skill-advisor"
description: "Ordered tasks for one operator-local alignment check over system-skill-advisor: scope, battery, probes, review lanes, critic, fix lane, prose pass, recheck and the routing parse check."
trigger_phrases:
  - "align system skill advisor tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 21: align-system-skill-advisor

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

`S` is `.skilled/skills/system-skill-advisor/`. `R` is the run folder outside the checkout, which holds `evidence.md`, `report.md`, `fix-plan.md`, `findings.json` and `probes.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the system-skill-advisor files changed since base `6a9946a800` (`R/scope.json`). Verify: the scope line names 27 first-parent commits.
  - Observed: Commits: `6a9946a80064c9971385d4c9cfba6bf9809fd1a5` to `4f741f6b48ac5825a3ce18dbe19575d76043885f`, 27 first-parent commits. Files: 10, of which 0 uncommitted or untracked.
- [x] T002 Run the existing check battery on the pushed tree (`R/battery.json`). Verify: no row fails.
  - Observed: `{"pass":48,"not_applicable":8}`.
- [x] T003 [P] Score the routing probe prompts against the advisor (`R/probes.json`). Verify: `run-probes` prints its counts.
  - Observed: `STATUS=FINDINGS run-probes: pass=3 fail=5 cannot_run=0`. Each failed probe expected system-skill-advisor. P01, the index reported stale after only a ROUTER.md change, got system-deep-loop. P02, confirming the daemon reindexes after a ROUTER.md edit, got sk-doc. P03 (watcher coverage of every ROUTER.md), P04 (the advisor router's intent and resource maps) and P05 (the skill-local reference for a scorer fusion question) got no skill. The daemon watcher already watches each skill's ROUTER.md (`runtime/lib/daemon/watcher.ts`, committed earlier), so these are advisor vocabulary gaps, carried to the routing follow-up, not a watcher bug.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Send the four read-only review lanes over the scope (`R/lanes/`). Verify: lanes A, B, C and D report.
  - Observed: lanes A, B, C and D ran with DeepSeek V4.1 Flash workers.
- [x] T005 Let the critic overturn weak findings (`R/critic.json`). Verify: the findings line counts the overturned ones apart.
  - Observed: 19 findings (P0 0, P1 8, P2 11), 5 literal, 5 inferred, 9 outside the scope. The critic overturned 10 more, which are not counted.
- [x] T006 Apply the upheld findings that do not change routing through the fix lane (`S`). Verify: each result line reads FIXED, LEFT or OUTSIDE.
  - Observed: 9 FIXED, 0 LEFT and 2 OUTSIDE. The fixes add ROUTER.md to every place that lists what the daemon watches, hashes or reindexes: the freshness contract, the watcher catalog entry, the watcher playbook, README.md, SKILL.md, the drift reference and ARCHITECTURE.md. The stress test fixture now writes a ROUTER.md, and the changelog claim is true. OUTSIDE D-01 (freshness and router `intent_signals` in `graph-metadata.json`): Routing vocabulary in graph-metadata.json intent_signals; held by the no-routing-change decision, carried to the routing follow-up.
- [x] T007 Fix the router prose the fix lane was barred from (`S`). Verify: each LEFT or OUTSIDE line carries a disposition.
  - Observed: OUTSIDE A-6 (a duplicate line inside the MACHINE ROUTER section, which the fix lane was barred from): Fixed after the fix lane: the duplicate sentence under the MACHINE ROUTER heading is removed.
- [x] T008 Run the fix-lane checks over the edited files. Verify: each check passes or matches HEAD.
  - Observed: `package_skill.py --check --strict` printed `Result: PASS`. `validate_document.py` printed `Total issues: 0` on the freshness contract, the watcher catalog entry, the watcher playbook, README.md, SKILL.md, the drift reference and the changelog. On ARCHITECTURE.md it printed the `document_type_fallback` notice, which is pre-existing and filename-driven. `check-markdown-links.cjs` printed `OK` with 0 broken links.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the full battery against the worktree (`R/evidence.md`). Verify: each failure is classified.
  - Observed: `{"pass":51,"not_applicable":8,"fail":2}`. S7-compiled-route-guard is derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate. S11-hermes-skills is derived: the Hermes skill copies regenerate from source before the commit.
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
