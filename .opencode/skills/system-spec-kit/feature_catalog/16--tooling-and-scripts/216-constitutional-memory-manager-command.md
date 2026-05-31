---
title: "Constitutional memory manager command"
description: "The `/memory:learn` slash command is the operator-facing workflow for constitutional memories: durable, always-surface rules stored under `.opencode/skills/system-spec-kit/constitutional/`."
trigger_phrases:
  - constitutional memory manager
  - /memory:learn
  - constitutional memory workflow
  - always-surface rules
  - memory learn command
---

# Constitutional memory manager command

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `/memory:learn` slash command is the operator-facing workflow for constitutional memories: durable, always-surface rules stored under `.opencode/skills/system-spec-kit/constitutional/`.

This command replaces the older "explicit learning" workflow. Instead of classifying ad hoc corrections or patterns into spec-folder memory files, it now guides the user through creating, listing, editing, removing, and budgeting constitutional memories that affect every search result.

---

## 2. HOW IT WORKS

`/memory:learn` is implemented entirely as a markdown command contract in `.opencode/commands/memory/learn.md`. The command has five supported flows:

- No arguments: show an overview dashboard with action hints instead of prompting for missing input.
- Default create mode: qualify the proposed rule, structure a constitutional markdown file, check the shared `~2000` token budget, write the file, index it with `memory_save`, and verify retrieval with `memory_search`.
- `list`: show all constitutional files with trigger phrases and budget usage.
- `edit <filename>`: update an existing constitutional file and force re-indexing.
- `remove <filename>`: require explicit confirmation, delete the file, and rebuild the index.
- `budget`: show per-file and aggregate token usage for the constitutional tier.

The supporting command indexes and operator-facing docs now consistently describe `/memory:learn` as a constitutional memory manager rather than an "explicit learning" or "corrections" workflow.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|------|-------|------|
| `.opencode/commands/memory/learn.md` | Command | Primary constitutional memory manager contract and subcommand routing |
| `.opencode/commands/memory/README.txt` | Command docs | Memory command group index and usage examples |
| `.opencode/commands/README.txt` | Command docs | Global command registry entry for `/memory:learn` |
| `.opencode/commands/spec_kit/debug.md` | Command docs | Debug workflow guidance for when `/memory:learn` is appropriate |
| `.opencode/commands/spec_kit/complete.md` | Command docs | Completion workflow guidance for constitutional-rule capture |
| `.opencode/README.md` | Workspace docs | High-level environment command summary |
| `README.md` | Workspace docs | Root command inventory |
| `.opencode/agents/speckit.md` | Agent docs | Speckit agent command summary |
| `scripts/tests/memory-learn-command-docs.vitest.ts` | Scripts test | Regression test for `/memory:learn` contract and active doc alignment |

### Verification

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/importance-tiers.vitest.ts` | Automated test | Constitutional tier boost, ordering, and invariants |
| `mcp_server/tests/full-spec-doc-indexing.vitest.ts` | Automated test | Constitutional file discovery, document typing, and indexing eligibility |
| `mcp_server/tests/handler-memory-save.vitest.ts` | Automated test | Save-path indexing, validation, and retry behavior used by create/edit flows |
| `mcp_server/tests/dual-scope-hooks.vitest.ts` | Automated test | Auto-surface/token-budget behavior for constitutional retrieval paths |
| `mcp_server/tests/context-server.vitest.ts` | Automated test | Runtime server behavior and response-envelope integrity |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/216-constitutional-memory-manager-command.md`

Related references:
- [215-session-capturing-pipeline-quality.md](215-session-capturing-pipeline-quality.md) — Session Capturing Pipeline Quality
- [217-source-dist-alignment-enforcement.md](217-source-dist-alignment-enforcement.md) — Source-dist alignment enforcement

---
## 5. PLAYBOOK COVERAGE

- Mapped to manual testing playbook scenario 147
