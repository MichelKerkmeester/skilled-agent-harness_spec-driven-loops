---
title: "Verification Checklist: Phase 6 advisor-and-integration"
description: "Planned Level-2 verification checklist for the graph union and referrer sweep; items are pending until the phase executes."
trigger_phrases:
  - "advisor integration checklist"
  - "phase 006 verification"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "mcp-tooling/007-mcp-tooling-parent/006-advisor-and-integration"
    last_updated_at: "2026-07-10T07:20:00Z"
    last_updated_by: "claude"
    recent_action: "Verified integration checklist; 2 items stay deferred"
    next_safe_action: "Rebuild advisor skill-graph DB when scheduled"
    blockers: []
    key_files:
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-006-advisor-and-integration"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Phase 6 advisor-and-integration

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Phases 004-005 confirmed complete before the sweep — both validated 0/0 before this phase started
- [x] CHK-002 [P0] Phase 001 referrer inventory re-run to refresh the live-hit inventory — re-run against `doctor_mcp_install.yaml` and `labeled-prompts.jsonl` before authoring the referrer repoints
- [x] CHK-003 [P1] Three source graph files read for the union inputs — union inputs listed in `mcp-tooling/graph-metadata.json`'s `derived.source_docs`
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Hub `graph-metadata.json` is valid and unions the three bridges — `.opencode/skills/mcp-tooling/graph-metadata.json` schema_version 2, `skill_id: mcp-tooling`, `family: mcp`, unions all three bridges' `intent_signals`
- [x] CHK-011 [P0] Three child `graph-metadata.json` files deleted — `git status --short` shows `D` for `mcp-chrome-devtools/graph-metadata.json`, `mcp-click-up/graph-metadata.json`, `mcp-figma/graph-metadata.json`
- [x] CHK-012 [P1] Outward edges preserved (figma to sk-design, union enhances to sk-code) — hub `edges.depends_on` includes `sk-design@0.7`; `edges.enhances` includes `sk-code@0.5`
- [x] CHK-013 [P1] `mcp-code-mode` recorded as an external cross-skill dependency, not a hub member — hub `edges.depends_on` includes `mcp-code-mode@0.7` with context "External cross-skill dependency (ADR-005)... not a hub member"
- [x] CHK-014 [P0] Inbound/reverse edges in `mcp-code-mode` and `sk-design` graph metadata repointed to `mcp-tooling`, atomically with deletion, no dangling edge left — both files show `"target": "mcp-tooling"` edges with "Repointed from the former flat ... identity" context
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-020 [P0] All acceptance criteria (REQ-001..004) met — REQ-001/002 fully met; REQ-003 (P0) and REQ-004 (P1) partially met, see `spec.md` Execution Note for the exact split
- [x] CHK-021 [P0] Grep sweep returns zero live hits for the old flat skill-folder paths — confirmed via a repo-wide `ripgrep` sweep outside historical/frozen text
- [ ] CHK-022 [P1] 3 `labeled-prompts.jsonl` rows retargeted to `mcp-tooling`; advisor skill-graph rebuilt — labeled-prompts retargeted (`grep -c mcp-tooling` returns 3); DB rebuild deferred (operator-gated reindex)
- [x] CHK-023 [P1] `code_mode` registration and name-keyed `.utcp` manuals byte-unchanged — `git diff .utcp_config.json` shows the `chrome_devtools_1/2`, `clickup_official`, and `figma` manual blocks untouched (file's only diff is an unrelated concurrent `gitkraken` manual addition)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] N/A — this phase is an integration sweep via `graph-metadata.json` and doc edits, not a bug-fix
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets introduced by the referrer edits — edits are path repoints and JSON metadata only, confirmed via `git diff`
- [x] CHK-031 [P0] N/A — no runtime input to validate; all changes are static edits to `graph-metadata.json` and doc files
- [x] CHK-032 [P1] N/A — no auth/authz surface changed; `.utcp_config.json`'s manuals are untouched
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] README catalogs (skills + root) reference the hub — `.opencode/skills/README.md:64` and root `README.md:936-940,1297` both reference `mcp-tooling`
- [ ] CHK-041 [P1] CLAUDE.md/AGENTS.md figma-transport prose restated — deferred; both still read "`mcp-figma` is the external sibling Figma transport" (operator decision, governs agents repo-wide)
- [x] CHK-042 [P2] Stale `mcp-open-design` entry in `doctor_mcp_install.yaml` corrected in passing
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Temp files in scratch/ only — no temp files were created outside `scratch/` during the sweep
- [x] CHK-051 [P1] scratch/ cleaned before completion — `scratch/` holds only the tracked `.gitkeep` placeholder
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 10 | 9/10 (CHK-020 open — see REQ-003 partial-completion note) |
| P1 Items | 10 | 8/10 (CHK-022, CHK-041 deferred — advisor DB rebuild, CLAUDE.md/AGENTS.md prose) |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-10
<!-- /ANCHOR:summary -->

---

<!--
Level 2 checklist - Verification focus
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
-->
