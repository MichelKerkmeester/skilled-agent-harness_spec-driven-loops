---
title: "Tasks: Phase 7: bladebro-parity-and-changelogs"
description: "Task Format: T### [P?] Description (file path). Verify: <command> prints <expected output>"
trigger_phrases:
  - "bladebro parity and changelogs tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.4 -->
# Tasks: Phase 7: bladebro-parity-and-changelogs

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

- [x] T001 Scaffold this phase (`007-bladebro-parity-and-changelogs/`). Verify: `ls` lists `spec.md`. Evidence: `create.sh --phase --parent` created it and the parent phase map row.
- [x] T002 Find a registry-free switch in the binary (`bladebro`). Verify: `strings` lists `BLADE_NO_UPDATE_CHECK`. Evidence: `BLADE_NO_UPDATE_CHECK=1 bladebro --version` printed `update check disabled (BLADE_NO_UPDATE_CHECK=1)`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T003 Add `install.sh` and `doctor.sh` (`mcp-bladebro/scripts/`). Verify: `shellcheck` exits 0. Evidence: exit 0 on both.
- [x] T004 Add the manifest row (`mcp-mutation-class-manifest.yaml`). Verify: the guard prints `GUARD PASS`. Evidence: 23 scripts PASS, both Bladebro rows included.
- [x] T005 Add the asset and point `mcp-wiring.md` at it (`mcp-bladebro/assets/`). Verify: the JSON block diffs clean against `jq`. Evidence: `BYTE_TRUE`.
- [x] T006 Wire the router, `SKILL.md`, README and leaf manifest (`mcp-bladebro/ROUTER.md`). Verify: the MCP route loads the asset. Evidence: replay loaded `assets/utcp-bladebro-manual.md`.
- [x] T007 Add `INSTALL-GUIDE.md` and `scripts/README.md`. Verify: `validate_document.py` reports 0 issues. Evidence: 0 issues on both.
- [x] T008 Relink changelogs (`.skilled/changelog/mcp-browser-use/`). Verify: the coverage check. Evidence: `58 changelog dirs, 58 covered, 0 uncovered`, no dangling link.
- [x] T009 Add four changelog entries, fold the advisor fix into its v2.0.0.0 entry and bump versions. Verify: `check_changelog_shape.py` exits 0. Evidence: exit 0 on all of them, and on the edited `skilled/v4.2.0.0.md`.
- [x] T010 Run the uncovered scenarios that need no yes and record them (`*/benchmark/reports/2026-11-22--*`). Verify: an index row per report. Evidence: five reports, four index rows across two READMEs.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T011 Test the scripts' safe paths (`install.sh`, `doctor.sh`). Verify: `--help` 0, bad option 1, no-op 0, doctor 0. Evidence: as stated, and `pgrep -fl bladebro` found nothing after the doctor.
- [x] T012 Run the hub gates (`.skilled/skills/mcp-browser-use`). Verify: `parent-skill-check` ends `OK`, the guard reports the hub fresh. Evidence: `OK: parent-skill-check — all hard invariants passed, 0 warnings`, and `mcp-browser-use fresh` after one re-mint.
- [x] T013 Replay both routing stages (`skill-advisor.cjs`, `compiled-route.cjs`). Verify: hub then `mcp-bladebro`. Evidence: "install bladebro and run its doctor script" gave `mcp-browser-use` 0.8226 and `mcp-bladebro`.
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

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] Dependencies identified and available
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Code passes lint/format checks. Evidence: `shellcheck` exit 0 on both scripts.
- [x] CHK-011 [P0] No console errors or warnings. Evidence: the doctor run printed no `✗` line.
- [x] CHK-012 [P1] Error handling implemented. Evidence: digest mismatch and missing native binary both exit 1 and remove the install.
- [x] CHK-013 [P1] Code follows project patterns. Evidence: COMPONENT header, exit codes and Aside's helper layout.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met
- [x] CHK-021 [P0] Manual testing complete
- [x] CHK-022 [P1] Edge cases tested. Evidence: bad option exit 1, already-installed no-op exit 0.
- [x] CHK-023 [P1] Error scenarios validated. Evidence: the routing-recall harness failed a planted wrong intent and a missing resource.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX ADDENDUM: FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Each actionable finding has a finding class. Evidence: the dangling links and missing entries are `instance-only`.
- [x] CHK-FIX-002 [P0] Same-class producer inventory completed. Evidence: the coverage check walked all 58 changelog folders.
- [x] CHK-FIX-003 [P0] Consumer inventory completed. Evidence: router map, leaf manifest and `SKILL.md` list the asset.
- [x] CHK-FIX-004 [P0] Adversarial cases. N/A: no path, parser or redaction code changed.
- [x] CHK-FIX-005 [P1] Matrix axes listed. N/A: no matrix.
- [x] CHK-FIX-006 [P1] Hostile env variant. Evidence: ASD-014 ran the Aside doctor with `PATH=/usr/bin:/bin` and a scratch `HOME`.
- [x] CHK-FIX-007 [P1] Evidence pinned. Evidence: every report names base `b9d156d7473` plus the then-uncommitted changes, which landed as `a5d1912a6c2`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets. Evidence: the manual `env` is `{}`, and reports quote no cookie value.
- [x] CHK-031 [P0] Input validation implemented. Evidence: both scripts reject unknown options with exit 1.
- [x] CHK-032 [P1] Auth/authz. N/A: no auth surface.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] Code comments adequate. Evidence: each non-obvious block states its reason, with no packet ids.
- [x] CHK-042 [P2] README updated. Evidence: Bladebro README, hub README changelog row.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files outside the repository. Evidence: all run output went to the session scratch folder.
- [x] CHK-051 [P1] scratch/ cleaned before completion. Evidence: `scratch/` holds only `.gitkeep`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 12 | 12/12 |
| P1 Items | 13 | 13/13 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-11-22
<!-- /ANCHOR:summary -->

---
