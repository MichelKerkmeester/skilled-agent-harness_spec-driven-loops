---
description: DEPRECATED — the constitutional-memory layer has been retired; this command no longer manages a searchable rule tier.
argument-hint: "(deprecated — no active routes)"
allowed-tools: Read, Glob
---

# /memory:learn — DEPRECATED

> **DEPRECATED.** The constitutional-memory layer has been retired and removed from the code.
> This command previously authored and managed "constitutional rules": rule files pinned to a
> special always-surface, search-boosted database tier and injected at session start. **That tier
> no longer exists.** `/memory:learn` no longer creates, edits, indexes, or budgets any
> constitutional tier, and it should not be used to do so.

The file is retained only because command routing may still reference it. Do not restore
constitutional-tier authoring behavior from it.

---

## 1. WHAT CHANGED

- The special always-surface / search-boosted "constitutional" tier was removed from the memory
  database. There is no longer a tier that pins rules to the top of memory search or injects them
  at session start.
- The former rule files under `.opencode/skills/system-spec-kit/constitutional/` **were deleted**. They are gone from the repository, not a searchable or
  auto-surfacing memory tier. Read them directly when needed.
- There is no token budget, qualification prompt, or approval flow to run — those governed the
  retired tier.

---

## 2. STILL IN FORCE

- The `memory-system-spec-kit-only` rule still applies: general topic/knowledge memory routes
  through the system-spec-kit continuity system, not ad-hoc stores. This is plain operating
  guidance now, not a constitutional-tier entry.
- Spec-folder continuity and the spec-kit Memory MCP are unchanged.

---

## 3. WHERE TO GO INSTEAD

- To save conversation or scoped session context: `/memory:save`.
- To search continuity / spec-doc memory: `/memory:search`.
- To manage the indexed-continuity database (stats, retention, learned triggers, health):
  `/memory:manage`.
- To resume prior work: `/speckit:resume`.

If you need a durable project rule, record it through the spec-kit continuity surfaces rather than a
constitutional tier.
