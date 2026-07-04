---
description: Manage indexed-continuity DB: stats, scan, cleanup, retention, learned triggers, ledger sweeps, validate, checkpoint, ingest.
argument-hint: "[scan [--force]] | [cleanup] | [retention-sweep [--dry-run]] | [learned-expire [--dry-run]] | [learned-clear] | [ledger-sweep [--dry-run] [--apply]] | [bulk-delete <tier> [--older-than <days>] [--folder <spec>]] | [tier <id> <tier>] | [triggers <id>] | [validate <id> <true|false>] | [delete <id>] | [health] | [checkpoint <subcommand>] | [ingest <subcommand>]"
allowed-tools: Read, mcp__mk_spec_memory__memory_stats, mcp__mk_spec_memory__memory_list, mcp__mk_spec_memory__memory_search, mcp__mk_spec_memory__memory_index_scan, mcp__mk_spec_memory__memory_validate, mcp__mk_spec_memory__memory_update, mcp__mk_spec_memory__memory_delete, mcp__mk_spec_memory__memory_bulk_delete, mcp__mk_spec_memory__memory_retention_sweep, mcp__mk_spec_memory__memory_learned_expire, mcp__mk_spec_memory__memory_learned_clear, mcp__mk_spec_memory__memory_health, mcp__mk_spec_memory__checkpoint_create, mcp__mk_spec_memory__checkpoint_restore, mcp__mk_spec_memory__checkpoint_list, mcp__mk_spec_memory__checkpoint_delete, mcp__mk_spec_memory__memory_ingest_start, mcp__mk_spec_memory__memory_ingest_status, mcp__mk_spec_memory__memory_ingest_cancel
---

# /memory:manage

Thin router for indexed-continuity database management.

## 1. ROUTING ASSETS

| Asset | Path | Status | Purpose |
| --- | --- | --- | --- |
| Workflow | _No memory workflow YAML exists in this checkout_ | Missing upstream asset | Keep management routing in this file until a workflow YAML is introduced by a separate workflow-asset change. Do not invent or edit YAML from this command. |
| Presentation | `.opencode/commands/memory/assets/manage_presentation.txt` | Required | Stats, scan, cleanup, retention, learned triggers, ledger sweeps, tier, trigger, validation, delete, health, checkpoint, ingest, and error displays. |

Before rendering any dashboard, confirmation prompt, or result block, read the presentation asset and follow it as the display source of truth.

## 2. ROUTER CONTRACT

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

## 3. WORKFLOW ROUTING

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

## 4. HARD RULES

- Never query the database with Bash or raw `sqlite3`.
- All database access goes through the allowed MCP tools.
- Do not fall back to raw SQL when MCP fails; report the MCP error and operator fallback guidance.
- Protected tiers require the confirmation gates described in the presentation asset.
- Learned-trigger expiry and ledger sweeps default to dry-run. Mutation requires an explicit apply/confirmation gate and must report matched/deleted counts for every touched ledger.
- Do not create or modify workflow YAML from this command.

## 5. PRESENTATION BOUNDARY

The following content lives only in `.opencode/commands/memory/assets/manage_presentation.txt`:

- Stats, scan, cleanup, retention, learned-trigger maintenance, ledger sweeps, bulk-delete, tier, trigger, validation, delete, health, checkpoint, ingest, and error displays.
- Confirmation prompts, protected-tier gates, dashboard layouts, result envelopes, and next-step text.
- Valid-mode menu wording for unknown-mode recovery.
- Stats dashboard render contract: `.opencode/commands/memory/assets/manage_presentation.txt` Section 2.

The router must not invent visible wording for those surfaces; it only resolves mode, tooling, and confirmation requirements.

## 6. RELATED COMMANDS

- `/memory:search`: Intent-aware context retrieval and analysis tools.
- `/memory:save`: Save conversation context.
- `/memory:learn`: Constitutional rules.
- `/speckit:resume`: Session recovery and continuation.
