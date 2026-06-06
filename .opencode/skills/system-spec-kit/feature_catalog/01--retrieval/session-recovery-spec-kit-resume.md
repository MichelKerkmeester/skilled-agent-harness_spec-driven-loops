---
title: "Session recovery via /spec_kit:resume"
description: "Reconstructs interrupted session state through the unified spec-folder resume workflow."
trigger_phrases:
  - "session recovery"
  - "spec_kit:resume"
  - "interrupted session reconstruction"
  - "resume workflow"
  - "session continuity recovery"
---

# Session recovery via /spec_kit:resume

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

When a session is interrupted by a crash, context compaction, timeout, or an ordinary handoff between sessions, `/spec_kit:resume` reconstructs the most likely previous state and routes the user to the best next step. Session recovery is owned by the spec-folder resume workflow, where the canonical continuity ladder is `handover.md -> _memory.continuity -> spec docs` and the wrapper exposes helper access only when the packet is still thin.

---

## 2. HOW IT WORKS

**SHIPPED.** `/spec_kit:resume` owns both standard continuation and interrupted-session recovery. Its primary recovery chain uses 3 borrowed tools, while the live wrapper also allows `memory_stats`, `memory_match_triggers`, `memory_delete`, `memory_update`, plus health, indexing, validation, checkpoint, and Code Graph helpers:

- **`memory_context`** (from `/memory:search`) -- Helper recovery path in `resume` mode when the handover packet is thin. In `mcp_server/handlers/memory-context.ts`, resume mode is a dedicated `memory_search`-backed strategy with anchors `["state", "next-steps", "summary", "blockers"]`, default `limit=5`, a 1200-token budget, `minState=WARM`, `includeContent=true`, and both dedup and decay disabled. When auto-resume is enabled and the caller resumes a reusable working-memory session, `systemPromptContext` is injected before token-budget enforcement.
- **`_memory.continuity`** (in `implementation-summary.md`) -- Supporting continuity state when `handover.md` is present but needs enrichment from the canonical packet.
- **`memory_search`** (from `/memory:search`) -- Fallback for thin summaries when `memory_context` resolves the right folder but does not return enough state detail. Uses the same resume anchors.
- **`memory_list`** (from `/memory:manage`) -- Recent-candidate discovery when no clear session candidate exists. Returns the most recently updated memories.

`memory_stats` remains diagnostic/helper access on the wrapper rather than part of the primary recovery chain. Additional helper access includes `memory_match_triggers()` for early session detection, `memory_delete`, `memory_update`, health, indexing, checkpoint, validation, and Code Graph support surfaces.

### Resume Modes

- **Auto** (`:auto`) -- Resolves the strongest session candidate with minimal prompting. Prefers a candidate when folder discovery matches a single spec folder, top results cluster around one `specFolder`, or returned content contains state/next-steps/summary/blockers anchors.
- **Confirm** (`:confirm` or default interactive mode) -- Presents the detected session, optional supplemental context choices, and continuation options when confidence is lower or the operator wants checkpoints.

### Recovery Chain (Priority Order)

| Priority | Source | Use |
|----------|--------|-----|
| 1 | `handover.md` (<24h) | Preferred continuation context when a fresh structured handoff exists |
| 2 | `_memory.continuity` in `implementation-summary.md` | Supporting continuity state when the handover packet needs enrichment |
| 3 | `memory_context(mode: "resume")` | Helper recovery path when the packet is still thin |
| 4 | `memory_search()` with resume anchors | Fallback when the summary is thin |
| 5 | `memory_list()` | Recent-candidate discovery |
| 6 | User confirmation | Final fallback |

### Post-Recovery Routing

- Quick "what was I doing?" answer: stop after the recovery summary
- Structured spec work: continue directly inside `/spec_kit:resume`
- Broader historical analysis: recommend `/memory:search history <spec-folder>`

---

## 3. SOURCE FILES

### Command Definition

| File | Role |
|------|------|
| `.opencode/commands/spec_kit/resume.md` | `/spec_kit:resume` command: standard continuation plus interrupted-session recovery |
| `.opencode/commands/spec_kit/assets/spec_kit_resume_auto.yaml` | Autonomous resume and recovery workflow |
| `.opencode/commands/spec_kit/assets/spec_kit_resume_confirm.yaml` | Interactive resume and recovery workflow |

### Related Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-context.ts` | Handler | Context orchestration entry point (resume mode) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-search.ts` | Handler | Search handler (fallback path) |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/memory-crud-list.ts` | Handler | List handler (candidate discovery) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/session/session-manager.ts` | Lib | Session lifecycle and crash-recovery breadcrumbs |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/memory-context.vitest.ts` | Automated test | Resume-mode token budget, anchor selection, and auto-resume routing |
| `mcp_server/tests/continue-session.vitest.ts` | Automated test | Session recovery generation helpers and crash-recovery data shape |
| `mcp_server/tests/crash-recovery.vitest.ts` | Automated test | Supplemental recovery prompt generation and recovery write path |
| `mcp_server/tests/recovery-hints.vitest.ts` | Automated test | User-facing recovery hint routing for expired sessions |

---

## 4. SOURCE METADATA
- Group: Retrieval
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `01--retrieval/session-recovery-spec-kit-resume.md`
Related references:
- [fast-delegated-search-memory-quick-search.md](fast-delegated-search-memory-quick-search.md) — Fast delegated search (memory_quick_search)
- [search-api-surface.md](search-api-surface.md) — Search API surface
