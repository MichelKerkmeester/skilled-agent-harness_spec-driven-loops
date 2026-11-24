---
title: "Tasks: Phase 16: fix-second-follow-up-findings"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "fix second follow up findings tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 16: fix-second-follow-up-findings

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

`H` is `.skilled/skills/mcp-browser-use`. `R` is `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/010-mcp-browser-use`.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Reproduce each P1 with the reviewer's own case. Verify: each finding has a check row in `../review/review-report.md`. Evidence: 5 confirmed, 1 refuted.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T002 Drop a keyword match contained in a longer match (`$R/lib/router.cjs`). Verify: the two mixed prompts route bundles. Evidence: `orderedBundle mcp-chrome-devtools,mcp-bladebro` and `orderedBundle mcp-aside-devtools,mcp-bladebro`; the three-id prompt still routes all three.
- [x] T003 Add the `mixed-id-and-alias-bundle` and `aside-in-prose` canary cases (`$R/fixtures/canary-cases.v1.json`). Verify: the harness exits 0, and 1 with the HEAD router. Evidence: `without fix exit=1`, "gold mismatch for mixed-id-and-alias-bundle", `restored exit=0`.
- [x] T004 Copy the router and fixture to their authored archive paths. Verify: `compiled-route-sync.cjs --check` names no mcp-browser-use file. Evidence: only the older `007-sk-doc/lib/registry-compiler.cjs` drift is listed.
- [x] T005 [P] Add `in aside` (`$H/hub-router.json`, `$H/ROUTER.md`). Verify: "open it in aside" routes to Aside, the two idiom prompts defer. Evidence: `route single mcp-aside-devtools`; "set that aside ..." and "as an aside ..." print `defer`.
- [x] T006 [P] Point every Aside install surface at `scripts/install.sh` (seven docs and `scripts/doctor.sh`). Verify: the pipe grep over the hub, excluding reports, changelogs and the dated note, finds only the nvm line. Evidence: no Aside match; `bash -n doctor.sh` exit 0.
- [x] T007 [P] Pass the task on stdin through a quoted heredoc (`$H/SKILL.md`, `$H/manual-testing-playbook/manual-testing-playbook.md`). Verify: a heredoc task holding `$(touch /tmp/pwned-015)` and a backtick routes and creates no file. Evidence: `route mcp-chrome-devtools`; `ls` reports no such file.
- [x] T008 [P] Install Node 20 (`$H/mcp-chrome-devtools/references/troubleshooting.md`). Verify: lines 187 and 188 read `nvm install 20`, `nvm use 20`. Evidence: grep output.
- [x] T009 Trim the Smart Routing section back under 180 words (`$H/SKILL.md`). Verify: `parent-skill-check.cjs` passes. Evidence: OK, 0 warnings, after it first failed at 201 words.
- [x] T010 Bump to 1.1.4.0, write the changelog, regenerate intent signals (`$H/*.json`, `$H/SKILL.md`, `$H/changelog/v1.1.4.0.md`, `$H/graph-metadata.json`). Verify: no `1.1.3.0` left in the JSON metadata or `SKILL.md`, and the generator prints RESULT: PASSED. Evidence: no match; `added=1, orphans=0`.
- [x] T011 Re-mint the activation manifest and its archive copy. Verify: `compiled-route-guard.cjs --json` shows 0 stale. Evidence: policy `4db40e86`, 0 stale.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Run the 56-row replay. Verify: only MBU-PB-04 fails. Evidence: `{"PASS":55,"FAIL":1}`, recorded under `compiled-routing/2026-11-24--two-stage-replay--compiled--second-follow-up/`.
- [x] T013 Run the advisor ratchet and suite. Verify: metrics unchanged, only the known test fails. Evidence: metrics identical to 015; 2,737 passed, 4 skipped, 1 failed.
- [x] T014 Run the bin tests. Verify: only the sync test fails, on the older sk-doc drift. Evidence: 122 tests, 121 pass; the failure names only `007-sk-doc/lib/registry-compiler.cjs`. Installer test pass 5, fail 0.
- [x] T015 Run the hub checks. Verify: each clean. Evidence: `parent-skill-check` OK; playbook validators `violations=0 warnings=0` for the hub and three modes; `quality-gate.cjs --worktree` prints `NO_BLOCKER_FOUND`.
- [x] T016 Validate the hub epic. Verify: `validate.sh --strict --recursive` prints RESULT: PASSED. Evidence: recorded in `implementation-summary.md`.
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
- **Review**: See `../review/review-report.md`
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

- [x] CHK-001 [P0] Requirements documented in spec.md. Evidence: REQ-001 to REQ-006.
- [x] CHK-002 [P0] Technical approach defined in plan.md. Evidence: sections 1 to 4.
- [x] CHK-003 [P1] Dependencies identified. Evidence: the lockstep parity test read before deciding the callout's scope.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `node -c` passes on the router and `bash -n` on the doctor. Evidence: both exit 0.
- [x] CHK-011 [P0] No debug code left. Evidence: `quality-gate.cjs --worktree` reports no blocker.
- [x] CHK-012 [P1] Comments carry the why, not finding ids. Evidence: the `scoreModes` comment names the id-and-alias case.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met. Evidence: `acceptance-criteria.md` reads Closeable Yes.
- [x] CHK-021 [P0] Manual testing complete. Evidence: the heredoc injection check created no file.
- [x] CHK-022 [P1] Edge cases tested. Evidence: the three-id prompt and the two "aside" idioms.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the harness throws a gold mismatch with the HEAD router.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each finding has a class. Evidence: the bundle drop is class-of-bug; the install docs, prose form, splice and Node version are instance-only.
- [x] CHK-FIX-002 [P0] Same-class inventory done. Evidence: the contained-match rule covers every mode; the pipe grep covers the whole hub; the splice grep covers all eight hubs.
- [x] CHK-FIX-003 [P0] Consumer inventory done. Evidence: canary harness, replay, bin tests, advisor ratchet and suite.
- [x] CHK-FIX-004 [P1] The splice fix was tested with `$()` and a backtick. Evidence: no file created.
- [x] CHK-FIX-005 [P1] Evidence is pinned to the phase commit named in `implementation-summary.md`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: no new constant.
- [x] CHK-031 [P0] Input handling. Evidence: the task reaches the front door on stdin and never through shell expansion; every Aside install path verifies the pinned digest.
- [x] CHK-032 [P1] Auth and authz: N/A. No change touches sign-in or permissions.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan and tasks name the same six requirements. Evidence: REQ-001 to REQ-006.
- [x] CHK-041 [P1] Code comments adequate. Evidence: `scoreModes`.
- [x] CHK-042 [P2] Changelog written. Evidence: `changelog/v1.1.4.0.md`.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch only. Evidence: replay output and router backups in the session scratchpad.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: this packet has no scratch folder; the sync rollback dir was removed by `--revert`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-24
<!-- /ANCHOR:summary -->
