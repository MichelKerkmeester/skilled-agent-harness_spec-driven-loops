---
title: "Tasks: Repo convention audit"
description: "Measurement tasks and verification checklist for the plugin convention audit."
trigger_phrases:
  - "audit tasks"
importance_tier: "normal"
contextType: "implementation"
---

<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

# Tasks: Repo convention audit

<!-- ANCHOR:notation -->
## Task Notation

`T-NNN` numbers a task; `CHK-NNN [P0|P1]` numbers a verification item. Evidence is the command whose
output was read, not a description of it.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T-001 Link `node_modules` into the worktree so gates run against real dependencies
- [x] T-002 Confirm a system Chrome is present for the capture harness
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T-010 Capture gate baselines, reading each exit status directly
- [x] T-011 Inventory filenames and classify case across `src/` and `tools/`
- [x] T-012 Inventory comments: banners, section rules, density, commented-out code
- [x] T-013 Walk folders against the threshold in both directions
- [x] T-014 Measure the stylesheet: size, banners, comment language, distinct classes
- [x] T-015 Quantify the rename blast radius including hard-coded scenario paths
- [x] T-016 Record known open debt as evidence
- [x] T-017 Write `audit.json` and confirm it parses
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T-020 Confirm `audit.json` is valid JSON
- [x] T-021 Confirm the worktree carries no source mutation from this phase
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

Every convention the surface documents has a measured figure behind it, and the scanners built later
can be shown to fail before they are made to pass.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- [`audit.json`](audit.json) · [`spec.md`](spec.md) · [`plan.md`](plan.md)
<!-- /ANCHOR:cross-refs -->

---

## Verification Checklist

<!-- ANCHOR:protocol -->
## Verification Protocol

Each item below cites the command that produced it. A figure without a command is not evidence.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Worktree dependencies linked — `ls node_modules | wc -l` returned 284
- [x] CHK-002 [P0] Baseline captured before any change — `git status` clean at base commit
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] No source file was modified — `git status --porcelain` showed only the packet
- [x] CHK-011 [P0] No spec path or task id appears in any code comment; the phase wrote no code
- [x] CHK-012 [P1] `audit.json` parses — `python3 -c "json.load(...)"` returned without error
- [x] CHK-013 [P1] Each figure names the command that produced it in `plan.md`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] Gate exit statuses read directly, never through a pipe
- [x] CHK-021 [P0] `vitest` 386 passing across 49 files; `screenshots:verify` 180 entries current
- [x] CHK-022 [P1] `lint` recorded as FAILING at 115 problems (100 errors, 15 warnings)
- [x] CHK-023 [P1] Scanner counts later agreed with the audit: naming 235, comments 249, folder-docs 19
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The audit measures every convention the surface claims, not a sample
- [x] CHK-FIX-002 [P0] Rename blast radius covers consumers outside `src/` — 41 paths in the
      screenshot scenarios, plus the capture manifest coupling
- [x] CHK-FIX-003 [P1] Open debt is recorded as evidence and explicitly not repaired here
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token or credential appears in the audit record
- [x] CHK-031 [P1] No absolute personal path is embedded in `audit.json` beyond the repo-relative note
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `audit.json` is cited by the phases that consume it
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] The phase adds exactly one artifact beside its spec documents
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

All measurement tasks complete. The audit's figures were independently corroborated by phase 008's
scanners, which reported the same three counts from an entirely separate implementation.
<!-- /ANCHOR:summary -->
