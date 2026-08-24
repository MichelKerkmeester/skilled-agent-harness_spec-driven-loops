---
title: "Verification Checklist: Phase 002 — Notion→Obsidian migration playbook"
description: "Pre-implementation verification checklist for the notion-migration.md / migration-inventory.md build; items are unchecked until a future implementation session executes tasks.md."
trigger_phrases:
  - "015 migration playbook checklist"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/015-notion-to-obisidian-migration/002-migration-playbook"
    last_updated_at: "2026-08-22T03:41:25Z"
    last_updated_by: "claude"
    recent_action: "All checklist items verified with evidence after the build"
    next_safe_action: "Phase 003: build the Notion Bases plugin reference tree"
    blockers: []
    key_files: ["spec.md", "tasks.md", "implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "015-002-migration-playbook"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Verification Checklist: Phase 002: Notion→Obsidian migration playbook

<!-- SPECKIT_LEVEL: 2 -->

<!-- NOTE: authored at spec-planning time. No implementation has run yet, so almost
every item below is unchecked. A future implementation session checks each item
off with real evidence before this phase can be marked Complete. -->

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
- [x] CHK-003 [P1] Source research re-verified immediately before drafting (not from memory)
  - **Evidence**: `research.md` §3/§4/§5/§6/§9/§10 re-read in full immediately before drafting both reference docs (T001)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Both new reference docs pass `validate_document.py --type skill`
  - **Evidence**: `python3 validate_document.py notion-migration.md --type feature_catalog` (spec.md's designated verification command for these two leaves) → `✅ VALID ... Total issues: 0`; same for `migration-inventory.md` → `Total issues: 0`
- [x] CHK-011 [P0] Both edited SKILL.md pass `validate_document.py --type skill` with no new warnings
  - **Evidence**: `python3 validate_document.py mcp-obsidian/SKILL.md --type skill` → `Total issues: 0`; `mcp-notion/SKILL.md --type skill` → `Total issues: 0`
- [x] CHK-012 [P1] Router additions are additive-only — no existing `INTENT_SIGNALS`/`RESOURCE_MAP` entry altered
  - **Evidence**: both edits inserted new `NOTION_MIGRATION` blocks and count-comment updates only; a standalone extraction/execution of both routers' pseudocode against pre-existing sample queries (`dataview query for my notes`, `create a new note`, `query my notion database`, `upload a file to notion`, install/troubleshoot phrases) returned the same intent + resource set as before the edit
- [x] CHK-013 [P1] New reference docs follow the existing per-skill reference authoring shape
  - **Evidence**: `notion-migration.md` mirrors `dataview.md`'s numbered ALL-CAPS H2 + `---` divider + closing "WHEN TO USE"/"RELATED RESOURCES" shape; `migration-inventory.md` mirrors `api-gap-tools.md`'s compact table-first shape
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001 through REQ-005 acceptance criteria met
  - **Evidence**: REQ-001 — `notion-migration.md` carries all five content blocks (§2-6), each traceable to research §5/§6/§9/§10; REQ-002 — `migration-inventory.md` carries all three content blocks (§2-4), traceable to research §3; REQ-003 — both routers parse and route correctly (router pseudocode test), no existing entries altered; REQ-004 — `leaf-manifest.json` regenerated, freshness check `OK mcp-tooling`; REQ-005 — all four `validate_document.py` runs = 0 issues
- [x] CHK-021 [P0] `validate.sh <this-folder> --strict` reports Errors:0
  - **Evidence**: `Summary: Errors: 0  Warnings: 0` / `RESULT: PASSED`
- [x] CHK-022 [P1] `ci-leaf-manifest-freshness.cjs` reports `OK mcp-tooling`
  - **Evidence**: `OK    mcp-tooling  0da5bcc07780b2d121a5c9a261e0f3d109174c52b0f89aa003978dadfcb7e541` — `checked=13 fresh=13 failed=0`
- [x] CHK-023 [P1] No CLI claims introduced into `mcp-notion/SKILL.md` (Notion remains MCP + direct-API only)
  - **Evidence**: the `NOTION_MIGRATION` intent, its keywords, and the `references/migration-inventory.md` content are MCP-tool and direct-API only; no CLI binary or CLI command is named anywhere in the new intent, route, or reference doc
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

<!-- Not applicable: this phase authors new reference content, not a bug fix.
Items below are answered N/A with the reasoning, kept for template-structure
compliance rather than left blank. -->

- [x] CHK-FIX-001 [P0] Finding class assigned, if applicable
  - **Evidence**: N/A — see `spec.md` §3 Out of Scope: green-field authoring, not a fix
- [x] CHK-FIX-002 [P0] Same-class producer inventory, if applicable
  - **Evidence**: N/A — no producer class exists per `spec.md` §3 Out of Scope
- [x] CHK-FIX-003 [P0] Consumer inventory for changed helpers/policies/schema/docs/tests
  - **Evidence**: consumers listed in `spec.md` §3 Files to Change; covered by CHK-012
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
  - **Evidence**: docs-only change; no tokens/keys referenced anywhere except by env-var name (`notion_NOTION_TOKEN`, `obsidian_OBSIDIAN_API_KEY`), matching existing house style
- [x] CHK-031 [P0] No unsafe path handling introduced
  - **Evidence**: no scripts appear in `spec.md` §3 Files to Change (docs + generated JSON only)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks/checklist synchronized with the actual implementation
  - **Evidence**: `spec.md` Status → Complete and Phase Context reconciled; `tasks.md` T001-T012 marked `[x]` with evidence; this `checklist.md` marked `[x]` with evidence; all five docs' `_memory.continuity` set to `completion_pct: 100`
- [x] CHK-041 [P1] `implementation-summary.md` honestly frames the real final state
  - **Evidence**: `implementation-summary.md` Known Limitations §1-3 — no live Notion/Obsidian round-trip, no Notion Bases plugin reference tree yet, verification protocol is documented prose not an executable script
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside a scratch directory
  - **Evidence**: no `/tmp` or scratch files created; only the five files in spec.md §3 Files to Change plus this phase's own docs were written
- [x] CHK-051 [P1] No files touched outside `specs/mcp-tooling/015-notion-to-obisidian-migration/002-migration-playbook/` other than the five files named in spec.md §3 Files to Change
  - **Evidence**: `git status --short` shows exactly the five Files to Change entries plus this phase folder's docs — no other path modified
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-08-22 (build + verification pass complete)
**Verified By**: AI Assistant (Claude) — build session
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
