---
title: "Implementation Summary: Retire the aesthetics reference folder and --mode aesthetic lane"
description: "Planned-state implementation summary: no work has started on retiring the aesthetics folder or the --mode aesthetic lane; this document records the pre-work state and will be rewritten once the retirement lands."
trigger_phrases:
  - "aesthetics retirement implementation summary"
  - "mode aesthetic lane removal summary"
  - "design-interface aesthetics folder summary"
importance_tier: "important"
contextType: "continuity"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/009-aesthetics-retirement"
    last_updated_at: "2026-07-27T17:17:23.686Z"
    last_updated_by: "spec-author"
    recent_action: "Committed c10ded2ab8, 10 files; reverify found 2 residual citing-site gaps"
    next_safe_action: "Flag hub-router.json and real-ui-loop.md gaps to operator for fix"
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

<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->
# Implementation Summary: Retire the aesthetics reference folder and --mode aesthetic lane
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 009-aesthetics-retirement |
| **Completed** | 2026-07-27 (commit `c10ded2ab8`) |
| **Level** | 2 |
| **Status** | Complete (core) — 2 residual citing-site gaps open, see Known Limitations |
| **Completion Pct** | 90% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`design-interface/references/aesthetics/` (5 hand-written look files: `README.md`, `apple-bento.md`, `brutalist.md`, `minimalist.md`, `soft.md`) was deleted via `git rm` so it cannot return from HEAD. The `AESTHETICS` entry was removed from both `INTENT_SIGNALS` and `RESOURCE_MAP` in `design-interface/SKILL.md`, the `AESTHETICS` task lane was removed from `command-metadata.json`, and `aesthetic` was removed from `commands/interface/design.md`'s argument-hint (frontmatter and the selectable-lanes prose row) and from both the `argumentHint` and `argumentGrammar.render` fields in `command-metadata.json` (drift-checked against the command doc). The ON_DEMAND row in `design-interface/SKILL.md`'s Resource Loading Levels table and `references/design-process/resource-loading-notes.md` were repointed at the `styles/` corpus — one real shipped exemplar from 1,290 beats prose about brutalism. `leaf-manifest.json` was regenerated via the canonical generator; aesthetics leaves went 5 → 0. `design-interface/procedures/aesthetic-direction.md` (a private procedure card for greenfield direction work, unrelated to the retired folder despite the similar name) was correctly left untouched. Landed as a single commit, `c10ded2ab8` (10 files, +298/-365).

**Re-verification on 2026-07-27 found the retirement is not fully closed.** Two citing sites named in the original spec were never actually touched by the commit: `hub-router.json:121` still lists `"aesthetic"` in its vocabulary, and `references/design-process/real-ui-loop.md:119` still has a dangling reference to the deleted folder ("The illustrative cues in `../aesthetics/` are reference material..."). Both are real, unresolved gaps — not covered by `011-retirement-residue`'s current scope (which targets a different, already-confirmed set of `audit`/`foundations` residue sites). See `spec.md` REQ-006/REQ-007 and `checklist.md` CHK-022/CHK-031/CHK-060.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `design-interface/references/aesthetics/minimalist.md` | Deleted | Superseded by `styles/` corpus |
| `design-interface/references/aesthetics/brutalist.md` | Deleted | Superseded by `styles/` corpus |
| `design-interface/references/aesthetics/soft.md` | Deleted | Superseded by `styles/` corpus |
| `design-interface/references/aesthetics/apple-bento.md` | Deleted | Superseded by `styles/` corpus |
| `design-interface/references/aesthetics/README.md` | Deleted | Folder index, no longer needed |
| `design-interface/SKILL.md` | Modified | Removed `AESTHETICS` intent + `RESOURCE_MAP` entry; repointed ON_DEMAND row at `styles/` corpus |
| `.opencode/skills/sk-design/command-metadata.json` | Modified | Removed `aesthetic` task lane + `argumentHint`/`argumentGrammar.render` value |
| `.opencode/commands/interface/design.md` | Modified | Removed lane row + `argument-hint` value |
| `design-interface/references/design-process/resource-loading-notes.md` | Modified | Repointed citation at `styles/` corpus |
| `.opencode/skills/sk-design/leaf-manifest.json` | Regenerated | Dropped 5 deleted `references/aesthetics/*` paths |
| `.opencode/skills/sk-design/hub-router.json` | **Not modified** | Planned (REQ-006) but not done — `"aesthetic"` vocabulary entry still present at `:121` |
| `design-interface/references/design-process/real-ui-loop.md` | **Not modified** | Planned (REQ-007) but not done — dangling `../aesthetics/` reference still present at `:119` |
| `.opencode/commands/interface/assets/interface-design-auto.yaml` | Not applicable | No `argument-hint` field exists in this asset; nothing required removal |
| `.opencode/commands/interface/assets/interface-design-confirm.yaml` | Not applicable | No `argument-hint` field exists in this asset; nothing required removal |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivered as a single commit, `c10ded2ab8` (10 files, +298/-365): the 5 file deletions (via `git rm`), the lane removal across `SKILL.md`/`command-metadata.json`/`design.md`, the manifest regeneration, and one of the two planned citation updates (`resource-loading-notes.md`; `real-ui-loop.md` was not actually touched — see Deviations below). An intent/lane parity check caught an earlier error mid-consolidation (an intent added without its matching lane) before the commit landed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Retire the folder and the lane together, in one commit | An argument lane is a five-point wiring contract, not a doc; a partial removal already broke a checker once this session |
| Use the `styles/` corpus as the replacement evidence source, not a rewrite | 1,290 measured exemplars are strictly better grounding than hand-written aesthetic prose |
| Land as its own commit, separate from 010-motion-merge | Program-wide revertability rule: each phase must be independently revertible |
| Report the 2 residual gaps (hub-router.json, real-ui-loop.md) as open rather than mark them complete | Never fabricate completion; the packet's own P0 hub-wide sweep (CHK-060) genuinely does not pass yet, and this is more useful to the operator recorded honestly than hidden |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Test Type | Status | Coverage | Notes |
|-----------|--------|----------|-------|
| Contract test | Pass | 8/8 | Command/lane contract |
| Surface test | Pass | 7/7 | Command surface |
| `design-command-surface-check.mjs` | Pass | invalid=0 drift=0 | Lane/intent parity |
| `parent-skill-check.cjs` | Pass | OK, 0 warnings | Parent-hub invariants |
| `procedure-card-schema-check.mjs` | Pass | — | Procedure cards |
| `package_skill.py design-interface --check --strict` | Pass | — | Skill package check |
| Intent/lane parity check | Pass | — | Confirms `INTENT_SIGNALS` and task lanes are exactly equal |
| Hub-wide `rg -n "aesthetic"` sweep (excluding `changelog/`) | **Fail** | — | Not covered by any of the above; returns `hub-router.json:121` and `real-ui-loop.md:119` in addition to the legitimate, preserved `aesthetic-direction.md` references |
| `leaf-manifest.json` regeneration | Pass | — | Aesthetics leaves 5 → 0, verified clean |
| Checklist | Verified | 11/13 | See `checklist.md` — CHK-022 and CHK-031 open |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **`hub-router.json`'s `"aesthetic"` vocabulary entry was never removed** (`:121`) — REQ-006 unmet. Not a false positive; this is literally the retired lane's vocabulary token, still live in the router.
2. **`real-ui-loop.md` still has a dangling reference to the deleted folder** (`:119`, "The illustrative cues in `../aesthetics/` are reference material...") — REQ-007 partially unmet (its sibling citation, `resource-loading-notes.md`, was correctly updated).
3. **Neither gap is covered by any planned sibling child.** `011-retirement-residue` is scoped to a different, already-confirmed set of `audit`/`foundations` vocabulary residue — it does not mention `hub-router.json` or `real-ui-loop.md`. These 2 items need either a fix inside this packet's own follow-up or an explicit scope amendment to `011` (or a new packet), decided by the operator.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:deviations -->
## Deviations from Plan

| Planned | Actual | Reason |
|---------|--------|--------|
| REQ-006: remove `"aesthetic"` from `hub-router.json` | Not done — entry still present at `:121` | Not in the commit's diff; cause not established, flagged as an open gap rather than guessed at |
| REQ-007: repoint both `resource-loading-notes.md` and `real-ui-loop.md` | Only `resource-loading-notes.md` repointed | `real-ui-loop.md` not in the commit's diff; same as above |
| REQ-005: update both YAML asset `argument-hint` mirrors | No edit made to either YAML | Verified neither asset actually has an `argument-hint`/`argumentHint` field — the original spec's premise that a mirror existed there was incorrect, so no edit was needed |

<!-- /ANCHOR:deviations -->
