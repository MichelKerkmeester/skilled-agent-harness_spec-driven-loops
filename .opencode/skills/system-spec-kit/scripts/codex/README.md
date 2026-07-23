---
title: "Codex Scripts: Codex CLI mirror generators and drift checks"
description: "Generators that keep .codex/agents, .codex/prompts and command routers in sync with their opencode canonical sources."
---

# Codex Scripts

---

## 1. OVERVIEW

`scripts/codex/` keeps the Codex CLI runtime mirrors in sync with their `.opencode/` canonical sources. Each script is a `--check`/default read-only drift report paired with a write mode that regenerates the mirror. None of them touch the canonical source files.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `sync-agents.cjs` | Generates `.codex/agents/*` from `.opencode/agents/*`, mapping tool access to a `sandboxMode` and applying per-agent model/reasoning-effort settings. `--check` reports drift without writing. |
| `sync-prompts.cjs` | Generates `.codex/prompts/*` from `.opencode/commands/*`, walking every command markdown file except `assets/`, `scripts/` and `fixtures/` subfolders. `--check` reports drift without writing. |
| `generate-command-routers.cjs` | Compares each router's OWNED ASSETS and EXECUTION TARGETS asset paths against the command contract (`sk-doc/create-command/assets/command-contract.json`). `--check` (default) reports path drift and non-canonical table shape. `--write` normalizes the table shape and asset-path cells in place, leaving hand-authored label and mode prose untouched. |

## 3. CONSUMERS

- `.opencode/skills/system-deep-loop/deep-alignment/references/adapters/sk-doc-command-adapter.md` runs `sync-prompts.cjs --check` as its canonical-source/generated-mirror parity gate.
- `.opencode/skills/sk-doc/create-command/SKILL.md` documents `generate-command-routers.cjs` as the router drift check for new commands.

## 4. RELATED

- [`.codex/agents/`](../../../../../.codex/agents) and [`.codex/prompts/`](../../../../../.codex/prompts): the generated mirrors these scripts own.
