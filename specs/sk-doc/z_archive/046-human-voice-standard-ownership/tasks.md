---
title: "Tasks: Human Voice Rules standard ownership and packet template conformance"
description: "Ordered work for the move, the repointing, the template conformance pass, and the verification that proves each gate green from the final state."
trigger_phrases:
  - "hvr move tasks"
  - "repoint hvr references tasks"
  - "hvr gate verification checklist"
  - "packet conformance tasks"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Human Voice Rules standard ownership and packet template conformance

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

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Capture the four hub gates green before editing (`scratch/baseline/`)
- [x] T002 Capture the scanner fixture exits before editing: clean 0, dirty 1
- [x] T003 [P] Inventory every referencing file and split live from frozen (`scratch/baseline/hvr-refs-*.txt`)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Move `hvr-rules.md` into the packet, checksum-verified byte-identical
- [x] T005 Repoint `DEFAULT_RULES_PATH` in `scripts/hvr_scan.py` from `parents[2]` to `parents[1]`
- [x] T006 Repoint the 27 files carrying the repo-root-absolute path (37 occurrences)
- [x] T007 Repoint the 24 files carrying a relative path, one replacement per depth
- [x] T008 Update the alias `diskPath` and regenerate `leaf-manifest.json`
- [x] T009 Update the two `ROUTER.md` `RESOURCE_MAP` rows and the three hub playbook scenarios
- [x] T010 Substitute the eight golden-snapshot occurrences rather than rerunning with `-u`
- [x] T011 Rewrite every passage claiming the standard lives outside the packet
- [x] T012 Conform both references and the report asset to the packet templates
- [x] T013 Move `contextType` off the undefined value `reference` onto the published enum
- [x] T014 Add the `v1.1.0.0` changelog entry recording the reversal, leaving `v1.0.0.0` intact
- [x] T015 Derive the packet document versions with `frontmatter-version.mjs`
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T016 Prove the scanner with a negative control: renamed section 6 exits 2
- [x] T017 Prove the golden snapshot catches the template edit before fixing it
- [x] T018 Rerun all four hub gates plus playbook topology and manifest freshness
- [x] T019 Scan every authored file with the packet's own scanner and fix what it finds
- [x] T020 Confirm the old path survives only in frozen artifacts
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

- [x] CHK-010 [P0] `package_skill.py --check --strict` reports `Result: PASS`
- [x] CHK-011 [P0] `parent-skill-check.cjs` reports 0 warnings across 14 modes
- [x] CHK-012 [P1] The scanner still fails closed. Exit 2 on a renamed section, proven by control
- [x] CHK-013 [P1] The one Python edit follows the file's existing comment and path idiom
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] All acceptance criteria met (`acceptance-criteria.md`)
- [x] CHK-021 [P0] Scanner fixtures rerun from the final state: 0 and 1
- [x] CHK-022 [P1] Edge case: `--rules` override still bypasses the default path
- [x] CHK-023 [P1] Error scenario: a standard the parser cannot read exits 2, not 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `cross-consumer`. One file moved, many surfaces observe its path.
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg -l "hvr-rules" --hidden -g '!.git'` returns 678 files, 614 of them frozen spec documents.
- [x] CHK-FIX-003 [P0] Consumer inventory completed across scripts, router metadata, generated manifests, templates, fixtures, snapshots, commands and repo rules.
- [x] CHK-FIX-004 [P0] Path handling: the scanner resolves through `Path.resolve().parents[N]`, and the fail-closed floors are the adversarial case. Proven by the renamed-section control.
- [x] CHK-FIX-005 [P1] Matrix axis is relative depth: repo-root-absolute, `./`, `../`, `../../`, `../../../`. Every row was handled with its own replacement.
- [x] CHK-FIX-006 [P1] No process-wide state is read. The scanner takes its path from `__file__`, not the environment.
- [x] CHK-FIX-007 [P1] Nothing is committed, so evidence is pinned to command output captured in `scratch/`, not to a SHA.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets. The change is file layout and markdown links
- [x] CHK-031 [P0] The alias `diskPath` stays hub-contained, which the manifest generator enforces
- [x] CHK-032 [P1] No auth surface. No tool permission or allowed-tools value changed
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, acceptance criteria and implementation summary agree
- [x] CHK-041 [P1] The `hvr_scan.py` locating comment matches the new depth
- [x] CHK-042 [P1] Packet README, SKILL.md, references README and `shared/README.md` updated
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Working files live in `scratch/` and the session scratchpad only
- [x] CHK-051 [P1] The two manifest files the version tool wrote to the repo root were removed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 14 | 14/14 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-09-01
<!-- /ANCHOR:summary -->

---
