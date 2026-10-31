---
title: "Tasks: Phase 22: align-system-spec-kit"
description: "Ordered tasks for one operator-local alignment check over system-spec-kit: scope, battery, probes, review lanes, critic, fix lane, prose pass, recheck, hand-run tests and the routing parse check."
trigger_phrases:
  - "align system spec kit tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 22: align-system-spec-kit

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

`S` is `.skilled/skills/system-spec-kit/`. `R` is the run folder outside the checkout, which holds `evidence.md`, `report.md`, `fix-plan.md`, `findings.json` and `probes.json`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Resolve the system-spec-kit files changed since base `6a9946a800` (`R/scope.json`). Verify: the scope line names 27 first-parent commits.
  - Observed: Commits: `6a9946a80064c9971385d4c9cfba6bf9809fd1a5` to `4f741f6b48ac5825a3ce18dbe19575d76043885f`, 27 first-parent commits. Files: 29, of which 0 uncommitted or untracked.
- [x] T002 Run the existing check battery on the pushed tree (`R/battery.json`). Verify: no row fails.
  - Observed: `{"pass":60,"not_applicable":7}`.
- [x] T003 [P] Score the routing probe prompts against the advisor (`R/probes.json`). Verify: `run-probes` prints its counts.
  - Observed: `STATUS=FINDINGS run-probes: pass=6 fail=4 cannot_run=0`. Each failed probe expected system-spec-kit. P05 (run the card sync check) got sk-code. P07 (Hermes router copy drift), P08 (sweep abandoned temp-path processes) and P09 (lower the orphan sweeper age floor) got no skill. These are advisor vocabulary gaps, carried to the routing follow-up with D-04 and D-05.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Send the four read-only review lanes over the scope (`R/lanes/`). Verify: lanes A, B, C and D report.
  - Observed: lanes A, B, C and D ran with DeepSeek V4.1 Flash workers.
- [x] T005 Let the critic overturn weak findings (`R/critic.json`). Verify: the findings line counts the overturned ones apart.
  - Observed: 33 findings (P0 0, P1 7, P2 26), 18 literal, 0 inferred, 19 outside the scope. The critic overturned 2 more, which are not counted.
- [x] T006 Apply the upheld findings that do not change routing through the fix lane (`S`). Verify: each result line reads FIXED, LEFT or OUTSIDE.
  - Observed: 26 FIXED, 0 LEFT and 3 OUTSIDE. The doc fixes name ROUTER.md in README.md, ARCHITECTURE.md, the shared smart-router reference, the rename pattern, the Hermes README and two authoring-card playbooks, and correct the template-guide pointer and the changelog sentence. The code fixes make the card sync guard check the router exists, make the Hermes sync reject a skill name that is not one path segment and drop a stale router copy, and make the smart-router analyzer and measurement harness read ROUTER.md. OUTSIDE D-04 (sweep and orphan terms in `graph-metadata.json`) and OUTSIDE D-05 (script names in `graph-metadata.json`): Routing vocabulary in graph-metadata.json intent_signals; held by the no-routing-change decision, carried to the routing follow-up.
- [x] T007 Fix the router prose the fix lane was barred from (`S/ROUTER.md`). Verify: each LEFT or OUTSIDE line carries a disposition.
  - Observed: OUTSIDE A-08 (line 120 inside the SECTION 3 MACHINE ROUTER, a no-edit region for the fix lane): Fixed after the fix lane: the exit-code note now points at the taxonomy in references/cli/daemon-cli-reference.md section 5.
- [x] T008 Run the fix-lane checks over the edited files. Verify: each check passes or matches HEAD.
  - Observed: `package_skill.py --check --strict` printed `Result: PASS`. `validate_document.py` printed `Total issues: 0` on README.md, the changelog, the shared smart-router reference, the template guide, the rename pattern, the Hermes README and both playbooks. On ARCHITECTURE.md it printed `Total issues: 1`, the `document_type_fallback` warning, with exit 0. `check-markdown-links.cjs` printed `OK` with 0 broken links. Vitest over card-sync, smart-router-analyze and smart-router-measurement printed `Tests 23 passed (23)`. `node --test sync-skills-hermes.test.mjs` printed pass 7, fail 0. `tsc --noEmit` exited 0. `check-source-dist-alignment.ts` printed `Source/dist alignment check passed`.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T009 Rerun the full battery against the worktree (`R/evidence.md`). Verify: each non-pass row is classified.
  - Observed: `{"pass":64,"cannot_run":1,"not_applicable":7,"fail":2}`. S1-package-check cannot run: tool precondition, the worktree runtime has no node_modules of its own, so `tsc --noEmit` and eslint on the changed files ran by hand and both exited 0. S7-compiled-route-guard is derived: the activation manifests re-mint at commit, by the pre-commit compiled-routing gate. S11-hermes-skills is derived: the Hermes skill copies regenerate from source before the commit.
- [x] T010 Test the fix lane's code changes by hand (`S/runtime/cli/`). Verify: each test reports 0 failures.
  - Observed: `node --test runtime/cli/tests/sync-skills-hermes.test.mjs` printed pass 7, fail 0. `bash runtime/cli/spec/check-card-sync.sh` printed `CARD SYNC OK` and exited 0. `vitest run --project cli tests/card-sync.vitest.ts` printed `Tests 11 passed (11)`. `vitest run tests/smart-router-analyze.vitest.ts tests/smart-router-measurement.vitest.ts` in the runtime printed `Tests 12 passed (12)`. `npx tsc --noEmit` in the runtime exited 0, and eslint on the five changed TypeScript files exited 0.
- [x] T011 Prove routing did not change. Verify: the router-file resolver parses the skill routers identically to HEAD.
  - Observed: the skill routers parse identically to HEAD, which holds the packet decision that no skill routes differently.
- [x] T012 Fill this phase's four documents from the evidence (`spec.md`, `plan.md`, `tasks.md`, `implementation-summary.md`). Verify: `validate.sh --strict` prints `RESULT: PASSED`.
  - Observed: `validate.sh --strict` on this folder printed `RESULT: PASSED` with `Warnings: 0`.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Manual verification passed
- [x] `R/evidence.md` holds the first run, the fix-lane results, the recheck and the hand-run tests behind every claim here.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Parent**: `../spec.md`, which records the routing follow-up
<!-- /ANCHOR:cross-refs -->

---
