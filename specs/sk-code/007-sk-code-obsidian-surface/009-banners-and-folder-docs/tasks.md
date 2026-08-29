---
title: "Tasks: Banners and Folder Docs"
description: "Task breakdown for the folder docs and the styles.css sectioning: setup reads and measurements, writing the 19 docs and transforming the stylesheet, and verifying every gate stays or turns green."
trigger_phrases:
  - "obsidian banners folder docs tasks"
  - "phase 009 tasks"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-code/007-sk-code-obsidian-surface/009-banners-and-folder-docs"
    last_updated_at: "2026-08-28T22:05:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Folder docs + styles.css sections"
    next_safe_action: "Kebab rename (phase 010)"
    blockers: []
    key_files:
      - "../../../styles.css"
      - "../../../screenshots/manifest.json"
      - "../../../tools/naming/scan-folder-docs.mjs"
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-code-obsidian-009"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Tasks: Banners and Folder Docs

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Read both sk-doc README templates and the surface's `folder-docs.md` rule for doc shape and the pairing threshold
- [x] T002 [P] Run `scan-folder-docs.mjs --json` for the 19-violation baseline and the exact owe-both / owe-README-only split
- [x] T003 [P] Measure the real `src`/`tools` tree with `find`; correct the stale reference that listed `src/data/__tests__` as README-only (5 source files, owes both)
- [x] T004 Enumerate the 34 banner comments in `styles.css` and read `verify.mjs`/`manifest.json` to confirm `styles.css` is fingerprinted in all 180 entries

<!-- /ANCHOR:phase-1 -->
---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T010 Write the 10 `README.md` folder docs across `src/` and `tools/` from each folder's real files (`../../../src/README.md` and siblings)
- [x] T011 Write the 9 `CODE.md` code maps for the folders above the threshold (`../../../src/CODE.md` and siblings)
- [x] T012 Replace the `styles.css` Chinese preamble with an English header and all 33 banners with numbered box-drawing sections, via a self-checking one-shot transform (`../../../styles.css`)
- [x] T013 Re-fingerprint `styles.css` in all 180 manifest entries to the post-edit hash, then delete the one-shot transform script (`../../../screenshots/manifest.json`)

<!-- /ANCHOR:phase-2 -->
---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T020 Run `node tools/naming/scan-folder-docs.mjs`: 10 scanned, 9 owe both, 1 owe README only, exit 0
- [x] T021 Resolve all 56 links and slashed source paths across the 19 docs: 0 broken
- [x] T022 Run `npm run screenshots:verify`: 180 entries current, no recapture
- [x] T023 Run `npx tsc --noEmit` (0), `npm run build` (0), `npx vitest run` (386/49), `npm run lint` (115, unchanged)
- [x] T024 Confirm `grep -c '======' styles.css` is 0 and the transform's byte-equality guard held
- [x] T025 Replace this leaf's four scaffolds and grep for residual scaffold placeholder markers and bare Given-scenario stubs

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
- **Deliverables**: 19 folder docs under `src/` and `tools/`, `../../../styles.css`, `../../../screenshots/manifest.json`

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
- [x] CHK-003 [P1] Templates, the folder-docs rule, and the verify/manifest contract read before writing

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The `styles.css` edit is comment-structure only; a byte-equality guard confirmed no CSS rule moved
- [x] CHK-011 [P0] No spec path, requirement id, task id, or checklist id appears in any folder doc or stylesheet comment
- [x] CHK-012 [P1] Every folder doc is current-state only: no migration note, no "renamed from", no phase numbering
- [x] CHK-013 [P1] The 33 stylesheet sections are numbered 1..33 with short upper-case titles and the durable why preserved

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing Checklist

- [x] CHK-020 [P0] `scan-folder-docs.mjs` run live, exits 0 (was 19 violations)
- [x] CHK-021 [P0] `screenshots:verify` reports 180 current with no capture run
- [x] CHK-022 [P0] Baseline gates run to real exit status: `tsc` 0, `build` 0, `vitest` 386/49, `lint` 115
- [x] CHK-023 [P1] All 56 references across the 19 docs resolve; 0 broken

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The folder-doc pairing follows the live scan, not the stale reference list; `src/data/__tests__` and `tools/naming` correctly owe both
- [x] CHK-FIX-002 [P0] The manifest re-fingerprint covers all 180 entries, not a spot sample, so no entry is left stale
- [x] CHK-FIX-003 [P1] Every banner comment (33 sections plus the header) was replaced, leaving no `=====` banner and no Chinese preamble behind

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secret, token, or absolute personal path is embedded in any doc, comment, or the manifest edit
- [x] CHK-031 [P1] No `src/*.ts` logic, `tools/screenshots/*.mjs` behavior, or hub file was modified; the one-shot transform script was deleted after use

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec, plan, tasks, and implementation-summary carry the real gate counts, not estimates
- [x] CHK-041 [P1] The 249-file MODULE-banner pass is stated plainly as out of scope for this phase
- [x] CHK-042 [P2] The stylesheet section grammar matches the numbered upper-case box-drawing style the surface documents

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Docs written only where the scan requires them; no stray `CODE.md` below the threshold
- [x] CHK-051 [P1] `scratch/` left untouched

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 8 | 8/8 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-28

<!-- /ANCHOR:summary -->
</content>
