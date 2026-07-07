---
title: "Implementation Summary: Design + ADR for skill advisor extraction"
description: "Design summary for ADR-001 locking the standalone advisor MCP with legacy tool bridge."
trigger_phrases:
  - "advisor extraction design summary"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/001-skill-graph/006-system-skill-advisor-package-extraction/001-extraction-design-and-adr"
    last_updated_at: "2026-05-14T07:35:00Z"
    last_updated_by: "codex"
    recent_action: "Wrote ADR-001 and extraction survey"
    next_safe_action: "Run strict validation and scaffold child 002"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "decision-record.md"
      - "research/extraction-survey.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
# Implementation Summary: Design + ADR for skill advisor extraction

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Implemented |
| **Created** | 2026-05-14 |
| **Branch** | `001-extraction-design-and-adr` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet produced the design artifacts for the skill advisor extraction.

- `decision-record.md` now contains ADR-001, **Standalone Advisor MCP With Legacy Tool Bridge**.
- `research/extraction-survey.md` inventories the current advisor source tree, live consumer grep summary, registration lines, runtime config baselines, and documentation references.
- No advisor source, skill metadata, tests, runtime configs, launcher code, or parent phase file was modified.

The parent 015/009 `spec.md` already contained the locked 5-phase migration sequence; this packet references that sequence rather than rewriting it because the current dispatch write scope allowed only this packet's ADR, survey, and implementation summary.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Delivery was research-only:

1. Read the parent phase spec, this packet's spec/plan/tasks/checklist/summary, and the full `research/standalone-mcp-discussion.md`.
2. Read the advisor README and install guide, tool registration sites in `tool-schemas.ts`, MCP wiring in `context-server.ts`, the memory launcher pattern, and all four runtime MCP configs.
3. Ran `git grep` inventories for advisor handler imports, `advisor_*` ids, `skill_advisor` mentions, and `skill-graph.sqlite` references.
4. Wrote the structured survey and ADR inside the approved packet write scope.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## KEY DECISIONS

| Decision | Why |
|----------|-----|
| Chosen shape: Standalone Advisor MCP With Legacy Tool Bridge | Satisfies DB-local and standalone-MCP constraints while avoiding immediate caller churn. |
| Keep `advisor_*` tool ids stable | Server id `system_skill_advisor` provides namespace separation; renaming tools would force broad hook, shim, docs, and operator-guide edits. |
| Keep deprecated `spec_kit_memory` proxy tools during one migration window | Protects callers still bound to the old server while runtime configs and hooks cut over. |
| Allow `SYSTEM_SKILL_ADVISOR_DB_DIR` only for tests/CI | Preserves DB-local default ownership while allowing isolated temporary roots for verification. |
| Parent phase sequence referenced, not edited | Direct write scope for this dispatch excluded the parent phase file; the sequence was already locked there. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Gate | Status | Evidence |
|------|--------|----------|
| Strict spec validation | Pass | `validate.sh --strict` passed for packet 001, parent 015/009, and parent 015 with 0 errors and 0 warnings. |
| ADR-001 present | Pass | `decision-record.md` exists and names **Standalone Advisor MCP With Legacy Tool Bridge**. |
| Survey present | Pass | `research/extraction-survey.md` includes source tree, consumer call sites, registration sites, runtime configs, and docs references. |
| Consumer grep evidence | Pass | Live consumer grep found 607 matching lines across 154 files after excluding historical spec packets, sandbox content, tests, feature catalogs, playbooks, references, and SQLite binaries. |
| Runtime configs inventoried | Pass | Survey lists `opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, and `.gemini/settings.json` current `spec_kit_memory` entries. |
| Scope control | Pass | Only `decision-record.md`, `research/extraction-survey.md`, and `implementation-summary.md` were written. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Survey is point-in-time**: future consumer additions need to be tracked separately.
2. **Scoring is rubric-based**: a future packet could re-score after seeing migration friction.
3. **ADR may need amendment**: if later phase discovers a blocker, scaffold an amendment packet rather than rewriting in place.
<!-- /ANCHOR:limitations -->
