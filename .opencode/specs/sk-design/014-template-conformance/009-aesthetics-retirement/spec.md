---
title: "Feature Specification: Retire the aesthetics reference folder and --mode aesthetic lane"
description: "design-interface carries 5 hand-written aesthetic-look files (~290 lines) plus a selectable --mode aesthetic argument lane. The styles/ corpus supplies 1,290 real exemplars, better evidence than prose about brutalism, so this packet retires both the files and the lane."
trigger_phrases:
  - "aesthetics retirement"
  - "mode aesthetic lane removal"
  - "design-interface aesthetics folder"
  - "aesthetic argument lane"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-design/014-template-conformance/009-aesthetics-retirement"
    last_updated_at: "2026-07-27T12:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Authored spec for aesthetics folder + mode lane retirement"
    next_safe_action: "Confirm all six citing sites before deleting any file"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design/design-interface/references/aesthetics/"
      - ".opencode/skills/sk-design/design-interface/SKILL.md"
      - ".opencode/skills/sk-design/command-metadata.json"
      - ".opencode/commands/interface/design.md"
      - ".opencode/skills/sk-design/hub-router.json"
      - ".opencode/skills/sk-design/leaf-manifest.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "spec-author-session"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Feature Specification: Retire the aesthetics reference folder and --mode aesthetic lane
<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned — no work started |
| **Created** | 2026-07-27 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Packet** | `sk-design/014-template-conformance` |
| **Parent Spec** | `../spec.md` |
| **Predecessor** | `008-structural-anomalies` |
| **Successor** | `010-motion-merge` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

`design-interface/references/aesthetics/` holds 5 hand-written look descriptions (`minimalist.md`, `brutalist.md`, `soft.md`, `apple-bento.md`, `README.md`, ~290 lines total) and a paired `--mode aesthetic` argument lane wired through `SKILL.md`'s `AESTHETICS` intent, `command-metadata.json`'s task-lane table, `commands/interface/design.md`'s lane row and `argument-hint`, its 2 YAML assets, and `hub-router.json`'s vocabulary. The hub's `styles/` corpus now supplies 1,290 real exemplars — measured evidence from live sites — which is a strictly better grounding source than prose describing what brutalism looks like.

### Purpose

Retire the folder and the lane together, in the same commit, this is not a doc delete: `aesthetic` is a selectable mode argument with wiring across five separate files, and command task lanes must match the owning mode's `INTENT_SIGNALS` exactly (a checker enforces this, and it already broke once this session when an intent was added without its matching lane). This packet takes the hub from its post-008 state one step toward the session's fourth reduction: `/interface:design` and `/interface:design-reference` becoming the entire public design surface.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Deleting all 5 files under `design-interface/references/aesthetics/` (`minimalist.md`, `brutalist.md`, `soft.md`, `apple-bento.md`, `README.md`).
- Removing the `AESTHETICS` intent and its `RESOURCE_MAP` entry from `design-interface/SKILL.md`.
- Removing the `aesthetic` task lane from `design-interface`'s block in `command-metadata.json` (label `"aesthetic"`, surface string, and the `argumentHint`/`render` enum value at `:9`/`:32`).
- Removing the `aesthetic` lane row and the `aesthetic` term from the `argument-hint` in `commands/interface/design.md` (`:3`, `:60`).
- Updating the `argument-hint` frontmatter in the 2 paired YAML assets (`.opencode/commands/interface/assets/interface-design-auto.yaml`, `interface-design-confirm.yaml`).
- Removing `"aesthetic"` from `hub-router.json`'s vocabulary list (`:121`).
- Regenerating `leaf-manifest.json` so it no longer lists the 5 deleted `references/aesthetics/*` paths (`:23`-`:27`).
- Updating the two reference docs that cite the folder: `design-interface/references/design-process/resource-loading-notes.md` and `real-ui-loop.md`.

### Out of Scope

- The `styles/` corpus itself (referenced only as the replacement evidence source, not modified).
- `010-motion-merge`'s work (motion mode/command retirement) — a separate, independently-committed phase.
- Any other sibling's template/structure conformance work.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `design-interface/references/aesthetics/minimalist.md` | Delete | Hand-written look description, superseded by `styles/` corpus |
| `design-interface/references/aesthetics/brutalist.md` | Delete | Hand-written look description, superseded by `styles/` corpus |
| `design-interface/references/aesthetics/soft.md` | Delete | Hand-written look description, superseded by `styles/` corpus |
| `design-interface/references/aesthetics/apple-bento.md` | Delete | Hand-written look description, superseded by `styles/` corpus |
| `design-interface/references/aesthetics/README.md` | Delete | Folder index, no longer needed |
| `design-interface/SKILL.md` | Modify | Remove `AESTHETICS` intent + `RESOURCE_MAP` entry |
| `.opencode/skills/sk-design/command-metadata.json` | Modify | Remove `aesthetic` task lane + enum value (`:9`, `:32`, `:123`, `:125`) |
| `.opencode/commands/interface/design.md` | Modify | Remove lane row + `argument-hint` value (`:3`, `:60`) |
| `.opencode/commands/interface/assets/interface-design-auto.yaml` | Modify | Remove `aesthetic` from argument-hint mirror |
| `.opencode/commands/interface/assets/interface-design-confirm.yaml` | Modify | Remove `aesthetic` from argument-hint mirror |
| `.opencode/skills/sk-design/hub-router.json` | Modify | Remove `"aesthetic"` vocabulary entry (`:121`) |
| `.opencode/skills/sk-design/leaf-manifest.json` | Regenerate | Drop 5 deleted `references/aesthetics/*` paths |
| `design-interface/references/design-process/resource-loading-notes.md` | Modify | Remove citation to the retired folder |
| `design-interface/references/design-process/real-ui-loop.md` | Modify | Remove citation to the retired folder |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | All 5 `references/aesthetics/*` files are deleted | `find design-interface/references/aesthetics` returns "No such file or directory" |
| REQ-002 | `AESTHETICS` intent and its `RESOURCE_MAP` entry are removed from `SKILL.md` | `rg -n "AESTHETICS\|aesthetic" design-interface/SKILL.md` returns nothing |
| REQ-003 | The `aesthetic` task lane is removed from `command-metadata.json` AND the `aesthetic` lane row is removed from `commands/interface/design.md` in the same commit | `rg -n "aesthetic" .opencode/skills/sk-design/command-metadata.json .opencode/commands/interface/design.md` returns nothing; `command-metadata.json` lanes still match `SKILL.md`'s `INTENT_SIGNALS` 1:1 |
| REQ-004 | `leaf-manifest.json` no longer lists the 5 deleted paths | `rg -n "aesthetics/" .opencode/skills/sk-design/leaf-manifest.json` returns nothing after regeneration |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Both YAML assets' `argument-hint` mirrors drop `aesthetic` | `rg -n "aesthetic" .opencode/commands/interface/assets/interface-design-auto.yaml .opencode/commands/interface/assets/interface-design-confirm.yaml` returns nothing |
| REQ-006 | `hub-router.json`'s vocabulary list drops `"aesthetic"` | `rg -n "aesthetic" .opencode/skills/sk-design/hub-router.json` returns nothing |
| REQ-007 | Both citing reference docs (`resource-loading-notes.md`, `real-ui-loop.md`) no longer point at the retired folder | `rg -n "aesthetics/" design-interface/references/design-process/resource-loading-notes.md design-interface/references/design-process/real-ui-loop.md` returns nothing |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `rg -n "aesthetic" .opencode/skills/sk-design/design-interface/ .opencode/skills/sk-design/command-metadata.json .opencode/skills/sk-design/hub-router.json .opencode/commands/interface/` (excluding `changelog/`) returns nothing.
- **SC-002**: `command-metadata.json`'s task lanes match `design-interface/SKILL.md`'s `INTENT_SIGNALS` exactly — no orphaned lane, no orphaned intent.
- **SC-003**: `leaf-manifest.json` regenerates clean with no dangling paths into the deleted folder.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Task lane removed from `command-metadata.json` but not `design.md` (or vice versa) | Checker fails — this exact class of break already happened once this session when an intent was added without its lane | Remove both in the same commit; run the surface checker before claiming done |
| Risk | A citing site outside the 6 named files is missed | Skill still references a deleted folder | `rg -n "aesthetic"` sweep across the full `sk-design` hub as the closing gate, not just the named files |
| Dependency | `leaf-manifest.json` regeneration tooling | New manifest must reflect the deletion, not just be hand-edited | Regenerate via the hub's existing manifest script rather than manual edit |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Reliability
- **NFR-R01**: Command task lanes and mode `INTENT_SIGNALS` remain 1:1 matched at every commit boundary within this packet, not just at the final state — a checker enforces this and treats a temporary mismatch as a failure regardless of the end state.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Error Scenarios
- **Partial removal lands** (e.g. files deleted but `command-metadata.json` lane still present): halt before committing — this packet lands as its own single commit per the program's revertability rule, so a half-done state must never be the commit boundary.
- **A seventh citing site surfaces during execution** that this spec didn't name: treat it as in-scope (the requirement is "no citation to the retired folder remains," not "only these six files"), fix it, and note the addition in `implementation-summary.md`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None outstanding — the replacement evidence source (`styles/` corpus) and the full citation list are already confirmed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent**: `.opencode/specs/sk-design/014-template-conformance/spec.md`
- **Predecessor**: `../008-structural-anomalies/`
- **Successor**: `../010-motion-merge/`
