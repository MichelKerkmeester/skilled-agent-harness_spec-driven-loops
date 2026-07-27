---
title: "Pi Scripts: Pi CLI mirror generators and drift checks"
description: "Generators that keep .pi/agents and .pi/prompts in sync with their OpenCode canonical sources."
---

# Pi Scripts

---

## 1. OVERVIEW

`scripts/pi/` keeps the Pi CLI runtime mirrors in sync with their `.opencode/` canonical sources. Each generator supports a `--check` drift report and a default write mode that regenerates the mirror. Neither generator modifies the canonical source files.

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `sync-agents-pi.cjs` | Generates flat `.pi/agents/*.md` files from `.opencode/agents/*.md`, mapping allowed OpenCode permissions onto Pi's built-in tool names and preserving each agent body. `--check` reports drift without writing. |
| `sync-prompts-pi.cjs` | Generates flat `.pi/prompts/*.md` files from `.opencode/commands/*.md`, walking every command markdown file except `assets/`, `scripts/` and `fixtures/` subfolders. `--check` reports drift without writing. |

## 3. CONSUMERS

- Pi discovers project-local prompt and extension resources from `.pi/`; `pi-subagents` discovers project-local agent profiles from `.pi/agents/**/*.md` after its built-in, package, and user agent sources.
- CI or a runtime-mirror verification pass can run both generators with `--check` to detect source/output drift without changing files.

## 4. RELATED

- [`.pi/agents/`](../../../../../.pi/agents) and [`.pi/prompts/`](../../../../../.pi/prompts): the generated mirrors these scripts own.
