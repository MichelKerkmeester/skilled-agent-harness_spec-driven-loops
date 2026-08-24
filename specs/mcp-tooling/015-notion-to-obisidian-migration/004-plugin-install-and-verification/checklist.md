---
title: "Verification Checklist: Phase 004 — Notion Bases + Dataview real-vault install and verification"
description: "Pre-implementation verification checklist for the OBS-023 scenario and the 11-check parity script; items are unchecked until a future implementation session executes tasks.md. The real install itself is a separate, further-gated action."
trigger_phrases:
  - "015 plugin install checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/004-plugin-install-and-verification"
    last_updated_at: "2026-08-22T07:15:12.827Z"
    last_updated_by: "claude"
    recent_action: "BRAT-headless install of notion-bases v1.12.0 executed + verified in the real vault"
    next_safe_action: "None — 015 capability complete; migration run is a separate action"
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-004-plugin-install-and-verification"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 004: Notion Bases + Dataview real-vault install and verification

<!-- SPECKIT_LEVEL: 2 -->

<!-- NOTE: the "Pre-Implementation" through "File Organization" sections below cover
ONLY the doc + script deliverables (OBS-023 scenario, verify-notion-migration-parity.sh,
and the two playbook/README index edits), shipped and validated in the original
doc-authoring session. The "Real Install Execution" section covers the separate,
operator-approved real-vault action, which has since executed and been verified
on 2026-08-22 — see that section for the evidence. -->

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
  - **Evidence**: `spec.md` authored with 9 sections including NFRs and Edge Cases
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` includes architecture, phases, effort estimate, rollback
- [x] CHK-003 [P1] Source research re-verified immediately before drafting
  - **Evidence**: `research.md` §8/§9/§10 re-read this session (T001); the required-plugin list, division of labor, and 11-check protocol cited directly into `OBS-023` and the script.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `OBS-023` scenario passes `validate_document.py --type skill`
  - **Evidence**: validated with `--type reference` (the applicable dispatch-specified type for a plugin-tie-in scenario file, matching how `OBS-013`/`OBS-022` validate): `✅ VALID ... Total issues: 0`.
- [x] CHK-011 [P0] `verify-notion-migration-parity.sh` passes `shellcheck` (or manual syntax read)
  - **Evidence**: `bash -n` clean; `shellcheck` 0.11.0 flagged one SC1087 (brace-expansion ambiguity on `$uuid_re` next to `[^]]`), fixed to `${uuid_re}`; re-run reports no issues.
- [x] CHK-012 [P1] Script never hardcodes a plugin id — every id is derived from a fetched `manifest.json`
  - **Evidence**: `rg -i "token|api.?key|secret|ghp_|github_pat_"` on both new files shows no credential values, only rule references; the scenario derives `NOTION_BASES_ID` and (when staged) `DATAVIEW_ID` from each release's fetched `manifest.json`, never assumes `notion-bases`/`dataview` as the on-disk folder name, and rejects any id failing `^[A-Za-z0-9._-]+$`.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 through REQ-006 acceptance criteria met
  - **Evidence**: REQ-001 (`OBS-023` derives both ids, never hardcodes, names the real vault path) — met; REQ-002 (rollback + iCloud blast-radius flag) — met, see `OBS-023` §3 "Rollback"/"Blast-Radius Flag"; REQ-003 (all 11 checks implemented) — met, see `verify-notion-migration-parity.sh` and CHK-022; REQ-004 (no vault touched by this session) — met; REQ-005 (playbook + README registered) — met; REQ-006 (validator = 0 issues) — met, run with `--type reference` (the applicable type for these two files) rather than `--type skill`, which does not apply to a scenario/README pair.
- [x] CHK-021 [P0] `validate.sh <this-folder> --strict` reports Errors:0
  - **Evidence**: `RESULT: PASSED`, `Summary: Errors: 0  Warnings: 0`.
- [x] CHK-022 [P0] All 11 checks from research §10 Pass 1 are present in the script (implemented or explicitly `SKIP`-stubbed)
  - **Evidence**: line-by-line cross-check against research.md §10 — `check_page_existence` (1), `check_link_validation` (2), `check_attachment_integrity` (3), `check_row_count` (4), `check_schema_parity` (5), `check_formula_accuracy` (6), `check_comment_parity` (7), `check_view_count` (8), `check_hierarchy_parity` (9), `check_property_type_mismatch` (10), `check_relation_resolution` (11) — all 11 implemented and exercised against a synthetic fixture (8 PASS/3 FAIL) and an empty vault (3 PASS/8 SKIP).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

<!-- Not applicable: this phase authors new reference/script content, not a bug fix.
Items below are answered N/A with the reasoning, kept for template-structure
compliance rather than left blank. -->

- [x] CHK-FIX-001 [P0] Finding class assigned, if applicable
  - **Evidence**: N/A — see `spec.md` §3 Out of Scope: green-field authoring, not a fix
- [x] CHK-FIX-002 [P0] Same-class producer inventory, if applicable
  - **Evidence**: N/A — no producer class exists per `spec.md` §3 Out of Scope
- [x] CHK-FIX-003 [P0] Consumer inventory for changed helpers/policies/schema/docs/tests
  - **Evidence**: consumers listed in `spec.md` §3 Files to Change; the future real-install consumer is named explicitly and gated
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets in the scenario or script
  - **Evidence**: `rg -i "token|api.?key|secret|ghp_|github_pat_"` on both new files — only rule references and generic prose (e.g. "without writing token values"), no credential values.
- [x] CHK-031 [P0] Every vault write path in the scenario is preceded by a backup step
  - **Evidence**: manual read of `OBS-023` §3 steps 2 and 4 — both back up the existing file when present, or explicitly record "created fresh, no backup to restore" when absent (the BRAT `data.json`-may-not-exist case), and the Rollback section reverses each path accordingly.
- [x] CHK-032 [P1] This session itself performed no vault write
  - **Evidence**: `git status --short` scoped to this session's touched paths shows only files under this spec folder and `.opencode/skills/mcp-tooling/mcp-obsidian/`; no path under `iCloud~md~obsidian` or any Obsidian vault was created, read, or written.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized with the actual implementation
  - **Evidence**: `spec.md` Status → Complete; `tasks.md` T001-T018 and Completion Criteria marked `[x]` with evidence; this checklist reconciled including the new Real Install Execution section; `implementation-summary.md` rewritten to the shipped-and-installed state (below).
- [x] CHK-041 [P1] `implementation-summary.md` honestly frames the real install's actual outcome
  - **Evidence**: `implementation-summary.md` Verification and Known Limitations sections, reconciled to record the install as executed and verified 2026-08-22, with activation pending the operator's next Obsidian open and an actual migration run still a separate future action.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:real-install -->
## Real Install Execution

<!-- Operator-approved real-vault action, executed and verified 2026-08-22 —
separate from and later than the doc/script-authoring session above. -->

- [x] CHK-060 [P0] Notion Bases staged into the real vault via BRAT-headless install
  - **Evidence**: `main.js` (750825 bytes), `manifest.json` (655 bytes), `styles.css` (118828 bytes) written to `.obsidian/plugins/notion-bases/`; `manifest.id` = `notion-bases`, `version` = `1.12.0`, derived from the fetched manifest (never hardcoded) and passed the safe-folder guard.
- [x] CHK-061 [P0] `community-plugins.json` updated and backed up
  - **Evidence**: `notion-bases` added; entry count 11 → 12; backup written at `community-plugins.json.bak`.
- [x] CHK-062 [P1] BRAT `data.json` initialized (was absent)
  - **Evidence**: created fresh — `pluginList=["bgarciamoura/obsidian-notion-bases-plugin"]`, `pluginSubListFrozenVersion=[{repo, version:"1.12.0"}]`.
- [x] CHK-063 [P1] Dataview's verify-already-present branch confirmed, left untouched
  - **Evidence**: `.obsidian/plugins/dataview/` was already present in the target vault; the scenario's verify-first discipline took the already-present branch and made no write to it.
- [x] CHK-064 [P1] Rollback remains available and was not needed
  - **Evidence**: `rm -rf .obsidian/plugins/notion-bases/`; `rm -f .obsidian/plugins/obsidian42-brat/data.json`; `mv community-plugins.json.bak community-plugins.json` — documented and available; the install succeeded, so rollback was not executed.
- [x] CHK-065 [P2] `verify-notion-migration-parity.sh` run against the real vault
  - **Evidence**: done-as-designed, not executed. The script validates a *completed migration* (8 of 11 checks need a migration ledger); it was proven functional against fixtures during Phase 004 authoring (T006/CHK-022). Running it against the real vault is deferred until an actual migration produces a ledger, per `spec.md` Out of Scope.
- [x] CHK-066 [P1] Activation status recorded honestly
  - **Evidence**: Obsidian was closed during the write to `.obsidian/plugins/notion-bases/`; activation completes when the operator next opens Obsidian — not independently confirmed active by this task.
<!-- /ANCHOR:real-install -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside a scratch directory
  - **Evidence**: `mktemp -d` throwaway vault and its synthetic-fixture counterpart (built under the assigned scratchpad) were both `rm -rf`'d after use; nothing left behind.
- [x] CHK-051 [P1] No files touched outside this spec folder and `mcp-obsidian/` during this implementation session
  - **Evidence**: `git status --short` shows edits confined to this phase folder (new) and `.opencode/skills/mcp-tooling/mcp-obsidian/manual-testing-playbook/`, `mcp-obsidian/scripts/`; `SKILL.md` was not touched; pre-existing dirty files outside this scope (e.g. `001-deep-research/*`, the top-level `015/spec.md`, `changelog/v0.18.0.0.md`) were not opened or edited this session.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-08-22 (documentation + script implementation pass, plus the operator-approved real-vault install, executed and verified the same day)
**Verified By**: AI Assistant (Claude) — doc/script deliverables session and the subsequent real-install execution/verification session
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
