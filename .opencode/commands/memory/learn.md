---
description: "DEPRECATED - the constitutional-memory layer was retired; this command manages no rule tier."
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

## 1. ROUTER CONTRACT

This router has one job: report the deprecation and send the caller to the command that now
owns what they asked for. It authors nothing, indexes nothing, and mutates nothing.

What changed:

- The special always-surface, search-boosted "constitutional" tier was removed from the memory
  database. No tier now pins rules to the top of memory search or injects them at session start.
- The former rule files under `.opencode/skills/system-spec-kit/constitutional/` **were deleted**.
  They are gone from the repository, not moved to a quieter tier.
- There is no token budget, qualification prompt, or approval flow to run. Those governed the
  retired tier.

What still holds:

- The `memory-system-spec-kit-only` rule still applies: general topic and knowledge memory routes
  through the system-spec-kit continuity system, not ad-hoc stores. That is plain operating
  guidance now, not a constitutional-tier entry.
- Spec-folder continuity and the spec-kit Memory MCP are unchanged.

Guardrails:

- Do not author, edit, or index a constitutional rule from this command.
- Do not recreate the deleted rule directory or a replacement tier.
- This is a direct-dispatch command with no workflow YAML by design; do not create or modify
  workflow YAML from this command.

---

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation | `.opencode/commands/memory/assets/learn-presentation.txt` |

The asset is a tombstone: it holds the deprecation wording and no active displays. Read it before
rendering any response, exactly as the live memory routers read theirs.

---

## 3. MODE ROUTING

There are no modes. Every invocation, with or without arguments, takes the same path: report the
deprecation from the presentation asset and name the replacement command for what was asked.
Arguments are read only to pick the most useful replacement, never to select behavior.

---

## 4. EXECUTION TARGETS

No workflow asset and no MCP tool. The router hands off to a sibling command:

| Asked for | Route to |
| --- | --- |
| Saving conversation or scoped session context | `/memory:save` |
| Searching continuity and spec-doc memory | `/memory:search` |
| Managing the indexed-continuity database | `/memory:manage` |
| Resuming prior work | `/speckit:resume` |

A durable project rule belongs in the spec-kit continuity surfaces, recorded through
`/memory:save`, rather than in a constitutional tier.

---

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/memory/assets/learn-presentation.txt`:

- The deprecation notice as shown to the caller.
- Replacement-command wording and next-step text.

The router must not invent visible wording for those surfaces.

---

## 6. WORKFLOW SUMMARY

The router reads the presentation tombstone, reports that the constitutional-memory layer was
retired, and points the caller at `/memory:save`, `/memory:search`, `/memory:manage`, or
`/speckit:resume` depending on what they asked for. It runs no workflow and touches no database.

Related commands: `/memory:save` (save conversation context); `/memory:search` (intent-aware
context retrieval and analysis tools); `/memory:manage` (database management, checkpoints,
ingest, retention, and health); `/speckit:resume` (session recovery and continuation).
