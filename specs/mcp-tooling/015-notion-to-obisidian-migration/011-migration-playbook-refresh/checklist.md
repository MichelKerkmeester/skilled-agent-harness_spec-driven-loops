---
title: "Verification Checklist: Phase 011 — Refresh the Notion→Obsidian migration playbook"
description: "Verification checklist for the migration-playbook refresh: view recovery and interactive-element recovery added to the write-side method, the sibling references wired to the notion-bases and meta-bind trees, a recovery-routing map added to the read-side inventory, every capability grounded in the plugin refs, and scope contained to the two named docs and this phase folder."
trigger_phrases:
  - "015 migration playbook refresh checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/011-migration-playbook-refresh"
    last_updated_at: "2026-08-23T06:00:00Z"
    last_updated_by: "claude"
    recent_action: "Refreshed migration playbook with 006 plugin research"
    next_safe_action: "None — parent phase-map refresh is the orchestrator's step"
    blockers: []
    key_files: ["spec.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-011-migration-playbook-refresh"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 011 — Refresh the Notion→Obsidian migration playbook

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
  - **Evidence**: `spec.md` authored with 9 sections incl. NFRs and Edge Cases; scope-locked to the two migration playbook docs and this folder.
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: `plan.md` includes the source-grounded refresh architecture, the view/interactive recovery and recovery-routing components, phases, and rollback.
- [x] CHK-003 [P0] The corrected 006 plugin reference docs read before editing
  - **Evidence**: notion-bases, meta-bind, and dataview refs read as source of truth; each cited key/action traces to them; the resulting docs pass `validate_document.py` = 0 issues.
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both edited docs pass `validate_document.py` (0 issues)
  - **Evidence**: `notion-migration.md` and `migration-inventory.md` each report `Total issues: 0` (`--type reference`).
- [x] CHK-011 [P0] Comment hygiene — no spec path / phase number / rec-id inside any authored code fence
  - **Evidence**: the edits add tables and prose with inline code only; no code fence was added to either shipped doc; `validate_document.py` = 0 issues.
- [x] CHK-012 [P1] The vault was read-only — no vault write and no plugin-file read
  - **Evidence**: no write to any vault path; no `.env`/token read; only the two shipped docs and this phase folder were written; the plugin refs were read, not edited.
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001..REQ-007 acceptance criteria met
  - **Evidence**: REQ-001 (view recovery) — met; REQ-002 (interactive-element recovery) — met; REQ-003 (sibling references) — met; REQ-004 (recovery-routing map) — met; REQ-005 (grounded + read-only vault) — met; REQ-006 (validator 0 issues) — met; REQ-007 (this folder strict) — met via `validate.sh --strict`.
- [x] CHK-021 [P0] `validate.sh <this-folder> --strict` reports Errors:0
  - **Evidence**: recorded in `implementation-summary.md` Verification.
- [x] CHK-022 [P0] Every cited capability is grounded in a plugin reference doc
  - **Evidence**: view-config keys → notion-bases `data-model.md` §6–§7; calendar recipe → notion-bases `workflows.md` §6a–§6b; Meta Bind widgets/actions → meta-bind `data-model.md` §5 / `workflows.md` §2–§5; Dataview surface → dataview `data-model.md`. No key or action invented.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Change class assigned
  - **Evidence**: each edit maps to a specific refresh item (view recovery, interactive-element recovery, sibling references, recovery-routing map); `validate_document.py` = 0 issues on both docs.
- [x] CHK-FIX-002 [P0] Cross-doc coherence
  - **Evidence**: `notion-migration.md` §4 (view + interactive recovery) and `migration-inventory.md` §2 (recovery-routing map) name the same plugins and the same calendar recipe, and both point to `references/plugins/notion-bases/` and `references/plugins/meta-bind/`.
- [x] CHK-FIX-003 [P0] Parity honesty preserved
  - **Evidence**: in `notion-migration.md` §4 the existing "do not overstate parity" formula note is kept, and the new view and interactive subsections each carry their own honesty note (7 of 10 views faithful; Form/Map/Dashboard lost; Meta Bind rebuild is an equivalent, not a faithful conversion; Dataview a fallback).
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets read or written; no vault mutation
  - **Evidence**: only plugin-ref-confirmed capabilities authored; no `.env`, token, or vault-content file touched; no plugin file written.
- [x] CHK-031 [P1] No write outside the allowed surfaces
  - **Evidence**: `git status --short` scoped to `notion-migration.md`, `migration-inventory.md`, and this phase folder; phase 010, the parent packet, the deep-loop runtime, `system-deep-loop`, and `compiled-routing` untouched.
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized with the actual implementation
  - **Evidence**: all four docs plus `implementation-summary.md` reflect the shipped state — view recovery, interactive-element recovery, sibling references, and the recovery-routing map.
- [x] CHK-041 [P1] `implementation-summary.md` honestly frames what is grounded vs UNCONFIRMED
  - **Evidence**: `implementation-summary.md` records the plugin-ref basis for each mapping and leaves the plugin refs' UNCONFIRMED cases (e.g. multi-day calendar spans) as-is rather than restating them as fact.
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside a scratch directory
  - **Evidence**: verification used `validate_document.py`/`validate.sh`/grep against the working tree; nothing written outside the two docs and this folder.
- [x] CHK-051 [P1] Changes confined to the two migration docs and this phase folder
  - **Evidence**: `git status --short` shows only `011-migration-playbook-refresh/` (new) and the two named `mcp-obsidian`/`mcp-notion` edits; the parent `015/spec.md` and phase 010 were not modified.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 6 | 6/6 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-23
**Verified By**: AI Assistant (Claude) — migration-playbook refresh
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
