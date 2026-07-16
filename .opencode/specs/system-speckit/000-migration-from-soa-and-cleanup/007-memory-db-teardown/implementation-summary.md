---
title: "Implementation Summary: Gated teardown of the system-speckit memory, vector, and eval databases"
description: "Planning-only scaffold for the gated, irreversible memory+vectors+eval delete. No daemon stopped, no file deleted."
trigger_phrases:
  - "memory db teardown"
  - "delete context-index sqlite"
  - "wipe vectors and eval set"
  - "speckit database wipe"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/000-migration-from-soa-and-cleanup/007-memory-db-teardown"
    last_updated_at: "2026-07-16T00:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored planning-stub implementation-summary"
    next_safe_action: "Wait for phase 006 research.md, then fresh wipe confirmation"
    blockers:
      - "Blocked until phase 006 (research) has durably saved research.md."
      - "Blocked on a fresh explicit operator 'wipe it' confirmation at execution time; never auto-runs."
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/database/context-index.sqlite"
      - ".opencode/skills/system-spec-kit/mcp_server/database/vectors/"
      - ".opencode/skills/system-spec-kit/mcp_server/database/speckit-eval.db"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "007-memory-db-teardown-impl-summary-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the two git-tracked checkpoint manifest.json files be removed with git rm or left as orphaned pointers?"
      - "Is the shared hf-embed.sock / hf-embed-respawn.lock in scope, given it may be shared with skill-advisor?"
    answered_questions:
      - "Scope is memory + vectors + eval only; code-graph, deep-loop runtime, and skill-advisor databases are operator-confirmed EXCLUDED."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-memory-db-teardown |
| **Completed** | Pending (scaffold only, not executed) |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This packet plans the gated, irreversible deletion of ~1.14 GB of live system-spec-kit runtime state (the canonical memory index, all vector shards, and the evaluation database), to run only after the daemons holding them are stopped and after phase 006's `research.md` is durably saved. No file has been deleted and no daemon has been stopped; this packet documents the exact allowlist of paths and the two hard gates that must clear first.

### Gated Teardown Plan

The plan enumerates every file/dir in the delete set path-by-path (never a directory glob) so an excluded database (code-graph, deep-loop, skill-advisor) can never be hit by accident, and requires a fresh, explicit operator "wipe it" confirmation captured at the moment of execution; a prior approval of this spec does not satisfy that gate. Execution also cannot start until phase 006's `research.md` is confirmed present and committed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Planned | Stop `mk_spec_memory` + `mk_code_index` daemons, delete the named memory+vectors+eval file set, verify the exclusion boundary held |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. Execution is pending per plan.md / checklist.md.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope the delete set as an explicit path-by-path allowlist, not a directory glob | A broad delete under `mcp_server/database/` risks silently deleting an excluded sibling database (code-graph, deep-loop, skill-advisor) that must survive untouched. |
| Require a fresh "wipe it" confirmation captured at execution time | A prior approval of this planning packet is explicitly not sufficient, since eval history and `memory:learn` constitutional rules do not rebuild once deleted. |
| Stop daemons before any delete | Deleting a live SQLite file out from under `mk_spec_memory` or `mk_code_index` risks a half-written WAL/lock state and a corrupted index on next boot, so daemon-stop is ordered strictly before delete. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `validate.sh --recursive --strict` | Not yet run (acceptance criteria in checklist.md) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Scaffold only.** No daemon has been stopped and no file in the delete set has been removed; this document only plans the sequence.
2. **Irreversible action, double-gated.** Execution is blocked both on phase 006's `research.md` being durably saved and on a fresh operator "wipe it" confirmation at run time; neither gate has cleared yet.
3. **Two open questions unresolved.** Whether to `git rm` or orphan the two tracked checkpoint `manifest.json` files, and whether the shared `hf-embed.sock` is in scope, are both left to the execution phase.
<!-- /ANCHOR:limitations -->

---
