---
description: Manage indexed-continuity DB: stats, scan, cleanup, retention, learned triggers, ledger sweeps, validate, checkpoint, ingest.
argument-hint: "[scan [--force]] | [cleanup] | [retention-sweep [--dry-run]] | [learned-expire [--dry-run]] | [learned-clear] | [ledger-sweep [--dry-run] [--apply]] | [bulk-delete <tier> [--older-than <days>] [--folder <spec>]] | [tier <id> <tier>] | [triggers <id>] | [validate <id> <true|false>] | [delete <id>] | [health] | [checkpoint <subcommand>] | [ingest <subcommand>]"
allowed-tools: Read, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__memory_list, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_index_scan, mcp__mk_spec_memory__memory_validate, mcp__mk_spec_memory__memory_update, mcp__mk_spec_memory__memory_delete, mcp__mk_spec_memory__memory_bulk_delete, mcp__mk_spec_memory__memory_retention_sweep, mcp__mk_spec_memory__memory_learned_expire, mcp__mk_spec_memory__memory_learned_clear, mcp__mk_spec_memory__memory_health, mcp__mk_spec_memory__checkpoint_create, mcp__mk_spec_memory__checkpoint_restore, mcp__mk_spec_memory__checkpoint_list, mcp__mk_spec_memory__checkpoint_delete, mcp__mk_spec_memory__memory_ingest_start, mcp__mk_spec_memory__memory_ingest_status, mcp__mk_spec_memory__memory_ingest_cancel
---

# /memory:manage

Thin router for indexed-continuity database management.

## 1. ROUTER CONTRACT

Guardrails:
- Never query the database with Bash or raw `sqlite3`.
- All database access goes through the allowed MCP tools.
- Do not fall back to raw SQL when MCP fails; report the MCP error and operator fallback guidance.
- Protected tiers require the confirmation gates described in the presentation asset.
- Learned-trigger expiry and ledger sweeps default to dry-run. Mutation requires an explicit apply/confirmation gate and must report matched/deleted counts for every touched ledger.
- This is a direct-dispatch command with no workflow YAML by design; do not create or modify workflow YAML from this command.

## 2. OWNED ASSETS

| Purpose | Asset |
|---------|-------|
| Presentation | `.opencode/commands/memory/assets/manage-presentation.txt` |

This is a direct-dispatch command: it routes straight to the memory MCP tools and owns no workflow YAML by design.

Before rendering any dashboard, confirmation prompt, or result block, read the presentation asset and follow it as the display source of truth.

## 3. MODE ROUTING

Default mode is `stats` when `$ARGUMENTS` is empty.

Recognized modes:
- `stats`
- `scan [--force]`
- `cleanup`
- `retention-sweep [--dry-run]`
- `learned-expire [--dry-run]`
- `learned-clear`
- `ledger-sweep [--dry-run] [--apply]`
- `bulk-delete <tier> [--older-than <days>] [--folder <spec>]`
- `tier <id> <tier>`
- `triggers <id>`
- `validate <id> <true|false>`
- `delete <id>`
- `health`
- `checkpoint create|restore|list|delete <name>`
- `ingest start|status|cancel ...`

On an unknown mode, return `STATUS=FAIL ERROR="Unknown mode: <mode>"` and list the valid modes.

## 4. EXECUTION TARGETS

Each recognized mode dispatches to the memory MCP tools below and applies the listed confirmation gate:

| Mode | Primary Tooling | Confirmation |
| --- | --- | --- |
| `stats` | `memory_stats` plus `memory_list` | No |
| `scan` | `memory_index_scan` | Yes |
| `cleanup` | `memory_list`, `checkpoint_create`, `memory_delete` | Yes |
| `retention-sweep` | `memory_retention_sweep` | Yes for mutating sweep |
| `learned-expire` | `memory_learned_expire` | Yes for mutating expiry |
| `learned-clear` | `memory_learned_clear` | Yes |
| `ledger-sweep` | Feedback/audit ledger sweep entry points | Yes for `--apply`; default is dry-run |
| `bulk-delete` | `memory_bulk_delete` | Yes |
| `tier` | `memory_update` | No |
| `triggers` | `memory_update` | User saves explicitly |
| `validate` | `memory_validate` | No |
| `delete` | `memory_delete` | Yes |
| `health` | `memory_health` | No |
| `checkpoint` | checkpoint tools | Restore/delete require confirmation |
| `ingest` | ingest tools | Cancel requires explicit job id |

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/memory/assets/manage-presentation.txt`:

- Stats, scan, cleanup, retention, learned-trigger maintenance, ledger sweeps, bulk-delete, tier, trigger, validation, delete, health, checkpoint, ingest, and error displays.
- Confirmation prompts, protected-tier gates, dashboard layouts, result envelopes, and next-step text.
- Valid-mode menu wording for unknown-mode recovery.
- Stats dashboard render contract: `.opencode/commands/memory/assets/manage-presentation.txt` Section 2.

The router must not invent visible wording for those surfaces; it only resolves mode, tooling, and confirmation requirements.

## 6. WORKFLOW SUMMARY

The router resolves one recognized mode (defaulting to `stats`), applies the mode's confirmation gate, and dispatches to the allowed memory MCP tools for the continuity-DB lifecycle — stats, indexing, cleanup, retention, learned-trigger maintenance, ledger sweeps, tier/trigger/validation edits, deletes, health, checkpoints, and ingest — rendering every user-facing string through the presentation asset. It is a direct-dispatch command with no workflow YAML by design.

Embedding-status repair is intentionally NOT a `/memory:manage` mode: it is the direct `memory_ln` MCP maintenance tool (`memory_ln({ mode: "apply" })`), which reconciles stored embeddings against the active embedder shard inside one guarded transaction and runs dry-run by default. Run it directly when `memory_health` reports `degraded_needs_repair` — this command manages the continuity-DB lifecycle, not embedding reconciliation.

Related commands: `/memory:search` (intent-aware context retrieval and analysis tools); `/memory:save` (save conversation context); `/memory:learn` (constitutional rules); `/speckit:resume` (session recovery and continuation).
