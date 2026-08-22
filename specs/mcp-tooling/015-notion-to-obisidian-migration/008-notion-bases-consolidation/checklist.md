---
title: "Verification Checklist: Phase 008 — Notion Bases consolidation and calendar recipe"
description: "Verification checklist for the Notion Bases calendar recipe: the §6b recipe authored and validated, every calendar-view key confirmed against the installed plugin main.js, the three already-completed consolidation items recorded honestly, scope contained to notion-bases/workflows.md + this phase folder."
trigger_phrases:
  - "015 notion bases consolidation checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/008-notion-bases-consolidation"
    last_updated_at: "2026-08-22T21:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored notion-bases calendar recipe and recorded three prior-phase items"
    next_safe_action: "Complete and closed; no further build work in this phase"
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-008-notion-bases-consolidation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 008 — Notion Bases consolidation and calendar recipe

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: `spec.md` authored with 9 sections incl. NFRs and Edge Cases; scope-locked to `notion-bases/workflows.md` + this phase folder; the four-item consolidation ledger stated.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` includes the verify-then-author architecture, the layered-recipe design, cross-reference discipline, phases, and rollback.
- [x] CHK-003 [P0] Existing notion-bases tree read before authoring, to avoid duplicating §6a
  - **Evidence**: all four notion-bases reference files read; §6b explicitly builds on §6a and adds only new layers; `validate_document.py` = 0 issues on the changed doc.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The changed shipped doc passes `validate_document.py` (0 issues)
  - **Evidence**: `workflows.md` reports `Total issues: 0` under `--type reference`.
- [x] CHK-011 [P0] Comment hygiene — no spec path / phase number / rec-id inside any authored code fence
  - **Evidence**: the §6b YAML/markdown/Dataview fences carry only durable WHY (e.g. `# a type:date column id — the field the grid keys on`); no spec path, phase number, or rec/REQ/CHK id; `validate_document.py` = 0 issues.
- [x] CHK-012 [P1] The vault was read-only — only plugin `main.js`/`manifest.json` read, no vault write
  - **Evidence**: verification greps read `main.js`/`manifest.json` under `.obsidian/plugins/notion-bases/`; no write to any vault path; no `.env`/token read.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001..REQ-006 acceptance criteria met
  - **Evidence**: REQ-001 (§6b recipe authored) — met; REQ-002 (every calendar key confirmed in `main.js`, event-span field marked UNCONFIRMED) — met; REQ-003 (validator 0 issues) — met; REQ-004 (scope + read-only vault) — met; REQ-005 (four items recorded honestly) — met; REQ-006 (confirmed keys only, no `date_field`) — met.
- [x] CHK-021 [P0] `validate.sh <this-folder> --strict` reports Errors:0
  - **Evidence**: recorded in `implementation-summary.md` Verification.
- [x] CHK-022 [P0] Each documented calendar key confirmed against the installed `main.js`
  - **Evidence**: T003 — `calendarDateField` (10 occ, matched to `type: date` columns), `calendarViewMode` (3 occ, default `month`, toggle `month`/`week`), `calendar` view type (4 occ), `notion-bases` marker (7 occ); no other `calendar*` key exists, so the event-span field is UNCONFIRMED.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Build item vs. record-only items separated
  - **Evidence**: the calendar recipe is the only newly-performed action; Project Manager deprecation (prior commit), Meta Bind reference (phase 009), and roster sync (phase 005) are recorded, not re-performed.
- [x] CHK-FIX-002 [P0] No duplication of existing calendar coverage
  - **Evidence**: §6b names §6a as its prerequisite and contributes only `calendarViewMode`, Meta Bind `datePicker`, and the Dataview agenda; the §6a base view block is not restated.
- [x] CHK-FIX-003 [P0] Cross-referenced surfaces left unedited
  - **Evidence**: the Meta Bind and Dataview steps point to `../meta-bind/` and `../dataview/` read-only; neither tree was edited; the `git status` shows only `notion-bases/workflows.md` changed under `references/plugins/`.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets read or written; no vault mutation
  - **Evidence**: only plugin `main.js`/`manifest.json` read; no `.env`, token, or vault-content file touched.
- [x] CHK-031 [P1] No write outside the allowed surfaces
  - **Evidence**: `git status --short` scoped to `.opencode/skills/mcp-tooling/mcp-obsidian/references/plugins/notion-bases/workflows.md` + this phase folder; parent files, dataview/advanced-canvas/claudian/meta-bind docs, deep-loop runtime, research trees, and concurrent lanes untouched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized with the actual implementation
  - **Evidence**: all four docs plus `implementation-summary.md` reflect the applied state — one shipped-doc edit (§6b + the §8 checkpoint) and the four-item consolidation ledger.
- [x] CHK-041 [P1] `implementation-summary.md` honestly frames what was newly built vs recorded
  - **Evidence**: the summary marks the calendar recipe as newly built and the other three items as prior-phase completions, and lists the `main.js` confirmations and the one UNCONFIRMED field.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside a scratch directory
  - **Evidence**: verification used inline `python3`/grep against the read-only vault; nothing written outside the two allowed surfaces.
- [x] CHK-051 [P1] Changes confined to this phase folder and the one notion-bases shipped doc
  - **Evidence**: `git status --short` shows only `008-notion-bases-consolidation/` (new) and the `notion-bases/workflows.md` edit; the parent `015/spec.md` and `015/graph-metadata.json` were not modified — the new phase is discoverable via its own `graph-metadata.json`.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-22
**Verified By**: AI Assistant (Claude) — Notion Bases consolidation / calendar recipe
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
</content>
