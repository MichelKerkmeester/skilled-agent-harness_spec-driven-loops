---
title: "Verification Checklist: Retire the aesthetics reference folder and --mode aesthetic lane"
description: "Verification checklist for the single-commit retirement: folder deletion, five-point lane removal, manifest regeneration, and citation cleanup."
trigger_phrases:
  - "aesthetics retirement checklist"
  - "mode aesthetic lane removal checklist"
  - "design-interface aesthetics folder checklist"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/009-aesthetics-retirement"
    last_updated_at: "2026-07-27T17:17:23.686Z"
    last_updated_by: "spec-author"
    recent_action: "Verified vs repo state; 11/13 pass, CHK-022/031/060 found open"
    next_safe_action: "Flag CHK-022, CHK-031, CHK-060 residual gaps to operator"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/aesthetics/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Retire the aesthetics reference folder and --mode aesthetic lane
<!-- SPECKIT_LEVEL: 2 -->

---

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

- [x] CHK-001 [P0] All six citing-site groups are located and line-confirmed before any edit
  - **Evidence:** confirmed pre-edit; all six groups located at their stated locations before commit `c10ded2ab8`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality [folder + lane removal]

- [x] CHK-010 [P0] All 5 `references/aesthetics/*` files are deleted
  - **Evidence:** `find .opencode/skills/sk-design/design-interface/references/aesthetics` → "No such file or directory" (verified 2026-07-27); files removed via `git rm` in commit `c10ded2ab8`
- [x] CHK-011 [P0] `AESTHETICS` intent and `RESOURCE_MAP` entry removed from `SKILL.md`
  - **Evidence:** `rg -n "AESTHETICS" .opencode/skills/sk-design/design-interface/SKILL.md` returns nothing (verified 2026-07-27); remaining lowercase `aesthetic` hits in the file are the legitimate, explicitly-preserved `procedures/aesthetic-direction.md` references
- [x] CHK-012 [P0] `aesthetic` task lane removed from `command-metadata.json`
  - **Evidence:** `rg -n "aesthetic" .opencode/skills/sk-design/command-metadata.json` returns only the legitimate `aesthetic-direction.md` procedure-card reference, no task lane (verified 2026-07-27)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing [command surface + manifest]

- [x] CHK-020 [P0] `commands/interface/design.md` lane row and argument-hint no longer mention `aesthetic`
  - **Evidence:** `rg -n "aesthetic" .opencode/commands/interface/design.md` returns nothing (verified 2026-07-27)
- [x] CHK-021 [P1] Both YAML asset mirrors updated
  - **Evidence:** re-verified 2026-07-27 neither `interface-design-auto.yaml` nor `interface-design-confirm.yaml` has an `argument-hint`/`argumentHint` field at all; their only `aesthetic` hit is the legitimate `procedures/aesthetic-direction.md` reference. Nothing required removal — correctly left untouched
- [ ] CHK-022 [P1] `hub-router.json` vocabulary entry removed
  - **Evidence:** `rg -n "aesthetic" .opencode/skills/sk-design/hub-router.json` → still returns `121:        "aesthetic",` (re-verified 2026-07-27). **NOT done** — not present in commit `c10ded2ab8`'s diff. Genuine residual gap, no covering sibling child
- [x] CHK-023 [P0] `leaf-manifest.json` regenerated with no dangling `aesthetics/` paths
  - **Evidence:** `rg -n "aesthetics/" .opencode/skills/sk-design/leaf-manifest.json` returns nothing (verified 2026-07-27)
- [x] CHK-024 [P0] Command task lanes match `SKILL.md` `INTENT_SIGNALS` exactly (no orphan either direction)
  - **Evidence:** `design-command-surface-check.mjs` invalid=0 drift=0; intent/lane parity check confirms the two sets are exactly equal
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness [citation cleanup]

- [x] CHK-030 [P1] `resource-loading-notes.md` no longer cites the retired folder
  - **Evidence:** repointed at the `styles/` corpus, confirmed present in commit `c10ded2ab8`'s diff
- [ ] CHK-031 [P1] `real-ui-loop.md` no longer cites the retired folder
  - **Evidence:** `rg -n "aesthetics/" .opencode/skills/sk-design/design-interface/references/design-process/real-ui-loop.md` → still returns `119:...The illustrative cues in ../aesthetics/ are reference material...` (re-verified 2026-07-27). **NOT done** — file not in commit `c10ded2ab8`'s diff. Genuine residual gap, no covering sibling child
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security [n/a]

- [x] CHK-040 [P2] No secrets or credentials touched by this packet
  - **Evidence:** commit `c10ded2ab8` diff review confirms markdown/JSON content only (no YAML files were actually touched — see CHK-021)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P1] `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `implementation-summary.md` describe the same scope
  - **Evidence:** cross-read of all five packet files confirms consistent scope and consistent reporting of the 2 residual gaps (CHK-022/CHK-031) across all of them
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization [final sweep]

- [ ] CHK-060 [P0] `rg -n "aesthetic"` across the hub (excluding `changelog/`) returns nothing
  - **Evidence:** **NOT clean, re-verified 2026-07-27.** Sweep returns `hub-router.json:121` and `real-ui-loop.md:119` (see CHK-022/CHK-031) in addition to the legitimate, preserved `aesthetic-direction.md` references. This is the one P0 item this packet does not yet satisfy in full
- [x] CHK-061 [P1] Single commit lands the whole retirement, independently revertable from siblings 008/010
  - **Evidence:** commit `c10ded2ab8`, 10 files changed, +298/-365, independent of `008` and `010`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 6/7 — CHK-060 open (hub-wide sweep not clean; see CHK-022/CHK-031) |
| P1 Items | 5 | 4/5 — CHK-022 open (`hub-router.json` vocabulary entry not removed) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-27. Packet executed and committed as `c10ded2ab8` (10 files, +298/-365). Core retirement (folder + lane + primary wiring) verified clean. Two genuine residual gaps found on re-verification and left honestly unresolved rather than rubber-stamped: `hub-router.json:121`'s `"aesthetic"` vocabulary entry (CHK-022) and a dangling `../aesthetics/` reference in `real-ui-loop.md:119` (CHK-031), which together keep the P0 hub-wide sweep (CHK-060) from passing clean. Neither gap is covered by `011-retirement-residue`'s current scope — flagged for operator follow-up.
<!-- /ANCHOR:summary -->
