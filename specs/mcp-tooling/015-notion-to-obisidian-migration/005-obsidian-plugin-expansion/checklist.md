---
title: "Verification Checklist: Phase 005 — Obsidian plugin-stack expansion (nine-plugin install + file-layer references + router wiring)"
description: "Verification checklist for the nine-plugin vault install (executed and verified) and the skill-folder authoring — three file-layer references, the twenty-one-plugin roster, and the mcp-obsidian router wiring — all authored and validated. Every P0/P1 gate is complete; CHK-065 (live per-plugin load) is deferred to the operator's next Obsidian open."
trigger_phrases:
  - "015 plugin expansion checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/005-obsidian-plugin-expansion"
    last_updated_at: "2026-08-22T09:00:00Z"
    last_updated_by: "claude"
    recent_action: "installed 9 vault plugins and wired 3 references + roster into mcp-obsidian"
    next_safe_action: "None — phase complete; per-plugin deep research is a separate follow-up"
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-005-obsidian-plugin-expansion"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 005: Obsidian plugin-stack expansion

<!-- SPECKIT_LEVEL: 2 -->

<!-- NOTE: the "Real Install Execution" section covers the nine-plugin BRAT-headless
install into the operator's real vault, executed and verified (2026-08-22). The
"Code Quality" / "Testing" / "Documentation" sections cover the skill-folder
deliverables (three file-layer references, the twenty-one-plugin roster, and the
mcp-obsidian router wiring), all authored and validated. Every P0/P1 item is complete;
CHK-065 (live per-plugin load) is deferred to the operator's next Obsidian open. -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` authored with scope, six acceptance criteria, and a risk table
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` includes architecture, phases, effort estimate, and a two-legged (skill-docs + vault) rollback
- [x] CHK-003 [P1] Source (operator request + obsolescence review) re-verified before authoring
  - **Evidence**: the nine-plugin request and the file-layer vs UI/automatic split re-confirmed and recorded in `spec.md` §9; the obsolescence review found all plugins coexist, with two soft overlaps documented, not resolved by removal
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The three file-layer references (Advanced Canvas, Claudian, Project Manager) each pass `validate_document.py --type feature_catalog`
  - **Evidence**: all 15 files (3 × 4 reference + 3 catalog) at `Total issues: 0`, independently re-run per file; unconfirmed data-model keys flagged `VERIFY`
- [x] CHK-011 [P0] `SKILL.md` intent-count comment matches the number of `INTENT_SIGNALS` keys after wiring
  - **Evidence**: 22 `INTENT_SIGNALS` keys; comment reads "twenty-two"; three new intents wired into resource map, `INTENT_SIGNALS`, `specific_plugin_intents`, `RESOURCE_MAP`, `PLUGINS` aggregate, and §8; version 0.19.0.0 → 0.20.0.0; `validate_document.py --type skill` = 0 issues
- [x] CHK-012 [P1] No plugin id is hardcoded — every id is derived from a fetched `manifest.json`
  - **Evidence**: all nine ids (`virtual-linker`, `editing-toolbar`, `notebook-navigator`, `advanced-canvas`, `realclaudian`, `obsidian-custom-frames`, `darlal-switcher-plus`, `project-manager`, `link-favicon`) were read from each downloaded manifest at install time, never assumed as the on-disk folder name, and passed the safe-folder guard
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Acceptance criteria AC-1 through AC-6 met
  - **Evidence**: AC-1 (nine plugins staged, `community-plugins.json` 12→21, registered in BRAT `data.json`) — **met**; AC-2 (ids derived, not assumed) — **met**; AC-3 (15 reference + catalog files validate clean) — **met**; AC-4 (roster of all 21 plugins validates clean) — **met**; AC-5 (`SKILL.md` routes the three new intents; count comment matches) — **met**; AC-6 (leaf-manifest fresh 13/13; `validate.sh --strict` Errors:0) — **met**
- [x] CHK-021 [P0] `validate.sh <this-folder> --strict` reports Errors:0
  - **Evidence**: `RESULT: PASSED`, `Summary: Errors: 0` from the final closeout run
- [x] CHK-022 [P0] `ci-leaf-manifest-freshness.cjs` is green for `mcp-tooling`
  - **Evidence**: `checked=13 fresh=13 failed=0` after `generate-leaf-manifest.cjs --write`
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

<!-- Not applicable: this phase authors new reference/roster content and adds router
wiring, not a bug fix. Items below are answered N/A with the reasoning, kept for
template-structure compliance rather than left blank. -->

- [x] CHK-FIX-001 [P0] Finding class assigned, if applicable
  - **Evidence**: N/A — see `spec.md` §3 Out of Scope: green-field authoring, not a fix
- [x] CHK-FIX-002 [P0] Same-class producer inventory, if applicable
  - **Evidence**: N/A — no producer class exists per `spec.md` §3 Out of Scope
- [x] CHK-FIX-003 [P0] Consumer inventory for changed helpers/policies/schema/docs/tests
  - **Evidence**: the only consumer is `mcp-obsidian/SKILL.md`'s router (resource map, `INTENT_SIGNALS`, `RESOURCE_MAP`, `PLUGINS` aggregate); named in `spec.md` §3 In Scope and gated in `tasks.md` T009
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the references, roster, or SKILL.md wiring
  - **Evidence**: no token, API key, or credential value is written to `SKILL.md`, the roster, or the three reference trees; Claudian's MCP-config coverage names the config keys without embedding values
- [x] CHK-031 [P0] Every vault write path in the install was preceded by a backup step
  - **Evidence**: timestamped `.bak` backups of `community-plugins.json` and BRAT `data.json` were made before writing; the named rollback restores each from its `.bak`
- [x] CHK-032 [P1] The vault write was operator-approved, append-only, and backed up
  - **Evidence**: unlike a doc-only phase, this phase's install did write to the real iCloud-synced vault — but only under operator go-ahead, append-only (nine new plugin folders + two JSON edits), with `.bak` backups and a named rollback recorded first
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized with the actual implementation
  - **Evidence**: `spec.md` Status reconciled to `Complete`; all P0/P1 checklist items marked with evidence; `implementation-summary.md` written; description.json/graph-metadata regenerated
- [x] CHK-041 [P1] `implementation-summary.md` honestly frames the install-done state and activation-pending caveat
  - **Evidence**: `implementation-summary.md` records the install as executed and verified, activation pending the operator's next Obsidian open, and the `VERIFY`-flagged data-model keys as known limitations
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:real-install -->
## Real Install Execution

<!-- Operator-approved real-vault action, executed and verified 2026-08-22 —
the nine-plugin BRAT-headless install of the broader plugin stack. -->

- [x] CHK-060 [P0] Nine plugins staged into the real vault via BRAT-headless install
  - **Evidence**: `virtual-linker`, `editing-toolbar`, `notebook-navigator`, `advanced-canvas`, `realclaudian`, `obsidian-custom-frames`, `darlal-switcher-plus`, `project-manager`, `link-favicon` each written to `.obsidian/plugins/<id>/` (`main.js` + `manifest.json`); each `manifest.id` derived from the fetched manifest (never hardcoded) and passed the safe-folder guard
- [x] CHK-061 [P0] `community-plugins.json` updated and backed up
  - **Evidence**: all nine ids added; entry count 12 → 21; timestamped `.bak` backup written before the edit
- [x] CHK-062 [P1] BRAT `data.json` updated with frozen versions and backed up
  - **Evidence**: each plugin's repo registered with a frozen version in BRAT `data.json`; timestamped `.bak` backup written before the edit
- [x] CHK-063 [P1] Soft-overlap plugins left in place (no removal)
  - **Evidence**: `community-plugins.json` still lists all 21 ids (no plugin folder deleted); the two soft overlaps (Claudian vs Local REST API, Project Manager vs Dataview/Notion Bases) were documented, not resolved by removing anything
- [x] CHK-064 [P1] Rollback remains available and was not needed
  - **Evidence**: remove the nine staged `.obsidian/plugins/<id>/` folders and restore `community-plugins.json` and BRAT `data.json` from their `.bak` (entry count 21 → 12) — documented and available; the install succeeded, so rollback was not executed
- [ ] CHK-065 [P2] Each installed plugin confirmed loading in a live Obsidian session
  - **Gate**: deferred — Obsidian was closed during the write; activation and per-plugin load confirmation complete when the operator next opens Obsidian, so this is not independently confirmed by this task
- [x] CHK-066 [P1] Activation status recorded honestly
  - **Evidence**: Obsidian was closed during the write to `.obsidian/plugins/<id>/`; activation completes when the operator next opens Obsidian — not independently confirmed active by this task
<!-- /ANCHOR:real-install -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside a scratch directory
  - **Evidence**: the installer ran from the session scratchpad (`install-9-plugins.py`); `git status` shows no stray temp file in the repo, and downloaded assets were consumed into the staged plugin folders
- [x] CHK-051 [P1] No files touched outside this spec folder and `mcp-obsidian/` during the authoring session (beyond the operator-approved vault install)
  - **Evidence**: `git status` shows only this spec folder, `mcp-obsidian/`, and `mcp-tooling/leaf-manifest.json` changed; the vault install is the one expected, scoped, operator-approved write outside the repo
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 0/1 (CHK-065 deferred — Obsidian closed during install) |

**Verification Date**: 2026-08-22 (nine-plugin real-vault install executed and verified; three references + roster + router wiring authored and validated)
**Verified By**: AI Assistant (Claude) — all P0/P1 gates complete; CHK-065 (live per-plugin load) deferred to the operator's next Obsidian open
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
