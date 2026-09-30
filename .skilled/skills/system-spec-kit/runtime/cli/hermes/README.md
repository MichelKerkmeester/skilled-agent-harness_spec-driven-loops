---
title: "Hermes Scripts: Hermes CLI mirror generators and drift checks"
description: "Generators that keep .hermes/prompts and .hermes/skills in sync with their .skilled/ canonical sources."
---

# Hermes Scripts

---

## 1. OVERVIEW

`runtime/cli/hermes/` keeps the Hermes CLI runtime mirrors in sync with their `.skilled/` canonical sources. Each generator supports a `--check` drift report and a default write mode that regenerates the mirror. Neither generator modifies the canonical source files.

---

## 2. CONTENTS

| File | Purpose |
|------|---------|
| `sync-prompts-hermes.cjs` | Generates flat `.hermes/prompts/*.md` files from `.skilled/commands/**/*.md`, walking every command markdown file except `assets/`, `scripts/` and `fixtures/` subfolders, `README.md` and `*.contract.md` files. Each generated prompt is a stub that names the canonical command path instead of copying it. `--check` reports `MISSING`, `STALE` and `EXTRA` drift without writing. |
| `sync-skills-hermes.cjs` | Generates `.hermes/skills/<name>/SKILL.md` from `.skilled/skills/**/SKILL.md`, skipping `node_modules`, `dist`, `.state`, `scratch`, `benchmark`, `fixtures` and `z_archive` directories. It also mirrors every `.skilled/agents/*.md` persona as a `agent-<name>` skill. Relative links in each body are rewritten so they resolve from the generated folder, and stale output directories are pruned. `--check` reports `DRIFT` and `STALE` names without writing. |

---

## 3. MIRROR SHAPE

The skills mirror is markdown only: one folder per skill holding a single `SKILL.md`, with the canonical directory named in the body. Hermes runs a static security scanner over every project skill directory at session start, so no scripts, `node_modules` or `references` folders are copied. A body that points into `references/`, `assets/` or `scripts/` directs the reader to the canonical path.

Agents are mirrored as skills because Hermes has no flag that loads an agent file, and a plugin prompt section is capped at 4000 characters. Preloading `-s agent-<name>` carries the whole persona into the session.

`HERMES_SKILLS_SOURCE_DIR`, `HERMES_SKILLS_OUTPUT_DIR` and `HERMES_AGENTS_SOURCE_DIR` override the default source and output roots.

---

## 4. CONSUMERS

- Hermes has no slash-command engine of its own, so each prompt file is a template the caller hands to `hermes chat -Q --oneshot --query-file .hermes/prompts/<name>.md`.
- CI or a runtime-mirror verification pass can run both generators with `--check` to detect source and output drift without changing files.

---

## 5. RELATED

- [`.hermes/prompts/`](../../../../../../.hermes/prompts) and [`.hermes/skills/`](../../../../../../.hermes/skills): the generated mirrors these scripts own.
- [`runtime/cli/README.md`](../README.md): the parent CLI script inventory.
