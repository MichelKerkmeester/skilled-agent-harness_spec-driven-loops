---
title: "Session resume continuity ladder"
description: "session_resume returns continuity in the documented priority order: handover.md, _memory.continuity, then canonical spec docs, with explicit phase-parent handling that does not silently skip child continuity."
trigger_phrases:
  - "session resume continuity ladder"
  - "session_resume"
  - "resume from spec folder"
  - "continuity ladder priority order"
  - "phase-parent continuity redirect"
---

# Session resume continuity ladder

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

`session_resume` is the canonical recovery surface when hook-injected startup context is unavailable. The handler walks the documented continuity ladder for the target spec folder: `handover.md`, `_memory.continuity` frontmatter, then the canonical spec docs (`implementation-summary.md`, `tasks.md`, `plan.md`, `spec.md`).

When the target is a phase parent, the handler honors `graph-metadata.json.derived.last_active_child_id` and resolves to the named child. Missing, null, stale, or no-redirect cases list the children with their statuses so the caller can pick which phase to continue. The response surfaces each layer of the ladder explicitly so callers can audit recovery without re-reading source files.

---

## 2. HOW IT WORKS

The handler reads the target folder, walks the ladder, and returns a structured response naming the layers it consulted. Phase-parent detection follows the shared lean-trio rule: a folder qualifies as a phase parent when at least one direct child matches `^[0-9]{3}-[a-z0-9-]+$` and that child has `spec.md` or `description.json`.

- Target identification: explicit folder reference in the response
- Layer ordering: handover, continuity frontmatter, canonical spec docs in that order
- Phase-parent redirect: follows `derived.last_active_child_id` when present; lists children when absent

The ladder is documented in the quick reference workflow doc and is the same path used by `/speckit:resume`. The two surfaces share semantics so operators get identical recovery via either path.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `mcp_server/handlers/session-resume.ts` | Handler | Walks the continuity ladder, handles phase-parent redirect, returns layered response |
| `mcp_server/lib/spec/phase-parent.ts` | Library | Phase-parent detection and child-listing helpers |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/session-resume.vitest.ts` | Automated test | Layer ordering, phase-parent redirect, missing-redirect listing |

---

## 4. SOURCE METADATA
- Group: Discovery
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `03--discovery/session-resume-continuity-ladder.md`
Related references:
- [session-bootstrap-reader-ready-context.md](session-bootstrap-reader-ready-context.md) — Session bootstrap reader-ready context
- [session-health-shared-payload.md](session-health-shared-payload.md) — Session health shared payload
