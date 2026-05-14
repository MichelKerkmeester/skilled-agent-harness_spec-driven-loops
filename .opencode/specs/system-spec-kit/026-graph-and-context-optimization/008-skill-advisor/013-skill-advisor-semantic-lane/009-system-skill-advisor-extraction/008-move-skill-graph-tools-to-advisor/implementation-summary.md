---
title: "Implementation Summary: Move skill_graph_* tools to advisor ownership"
description: "Scaffold-only implementation summary for the pending 013/009/008 skill_graph_* ownership migration."
trigger_phrases:
  - "013/009/008 implementation summary"
  - "skill graph advisor move summary"
importance_tier: "critical"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/008-move-skill-graph-tools-to-advisor"
    last_updated_at: "2026-05-14T00:00:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Scaffold authored; implementation pending"
    next_safe_action: "Dispatch 013/009/008 implementation (gpt-5.5 high fast, mirror 004->005->006 shape)"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "description.json"
      - "graph-metadata.json"
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Operator selected Option B: create new packet 013/009/008."
      - "Tool ids remain skill_graph_*; only server ownership changes."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify + level3-arch | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `008-move-skill-graph-tools-to-advisor` |
| **Completed** | Not complete |
| **Level** | 3 |
| **Status** | Scaffolded |
| **Completion** | 0% |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Nothing has been implemented yet. This dispatch authored the Level 3 scaffold for a future implementation packet that will move the four `skill_graph_*` MCP tools from `spec_kit_memory` ownership to `system_skill_advisor` ownership.

### Scaffolded Documents

| File | Purpose |
|------|---------|
| `spec.md` | Defines problem, scope, REQ table, success criteria, risks, and user stories. |
| `plan.md` | Defines architecture, 3-phase implementation plan, consumer inventory, and rollback paths. |
| `tasks.md` | Defines pending setup, implementation, and verification tasks. |
| `checklist.md` | Defines pending verification gates in `CHK-NNN [PN]` format. |
| `decision-record.md` | Captures five ADRs for tool-id stability, handler location, proxy, cutover order, and namespace semantics. |
| `description.json` | Packet metadata for retrieval. |
| `graph-metadata.json` | Packet graph metadata with `derived.status` set to `not_started`. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The scaffold uses the existing 004, 005, 006, and 007 packet shape. It treats 004 as the registration pattern, 005 as the consumer cutover and proxy pattern, 006 as the deprecation-removal pattern, and 007 as the lower-risk DB rename that explicitly deferred this topology move.

No code, test, config, parent metadata, sibling packet, or git operations were performed by this scaffold.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep `skill_graph_*` public tool ids stable | Mirrors parent ADR-001 caller-stability invariant. |
| Move handler entrypoints into system-skill-advisor | Avoids preserving private memory-server coupling. |
| Use a one-window `spec_kit_memory` proxy | Protects hidden callers while consumer cutover lands. |
| Cut over consumers in risk order | Session-critical and runtime surfaces move before docs cleanup. |
| Treat server-prefix migration as caller-visible | `mcp__spec_kit_memory__...` to `mcp__system_skill_advisor__...` is still a breaking name change. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Packet 008 strict validation | Pending; command is `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/026-graph-and-context-optimization/008-skill-advisor/013-skill-advisor-semantic-lane/009-system-skill-advisor-extraction/008-move-skill-graph-tools-to-advisor --strict`. |
| Description JSON parse | Pending; command is `node -e "JSON.parse(require('fs').readFileSync('<packet>/description.json','utf8'))"`. |
| Graph metadata JSON parse | Pending; command is `node -e "JSON.parse(require('fs').readFileSync('<packet>/graph-metadata.json','utf8'))"`. |
| ADR count >= 4 | Pending |
| REQ count >= 9 | Pending |
| Implementation tests | Not run; implementation pending |
| Runtime smoke matrix | Not run; implementation pending |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This is a scaffold, not implementation.
2. The scaffold-time targeted consumer inventory is a starting point; Phase 1 must rerun full live grep before edits.
3. The required prompt path for `007-skill-graph-db-rename/decision-record.md` did not exist in the repository. The scaffold used 007 `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md`, and adjacent 005/006 decision records for the relevant deferral and proxy/removal patterns.
4. Parent `graph-metadata.json` and `description.json` were not updated because the dispatch forbids writing outside this packet folder.
<!-- /ANCHOR:limitations -->

---

<!-- ANCHOR:next-steps -->
## Next Steps

Dispatch implementation for this packet with the existing operator constraints:

1. Run Phase 1 inventory and baseline tests.
2. Register advisor-owned `skill_graph_*` tools.
3. Add the temporary memory proxy.
4. Cut over consumers.
5. Remove memory-side proxy/descriptors after zero-caller evidence and operator confirmation.
6. Run the full verification matrix and update this summary with evidence.
<!-- /ANCHOR:next-steps -->
