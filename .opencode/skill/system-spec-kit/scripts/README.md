---
title: "System-Spec-Kit Scripts"
description: "Current script inventory and execution flow for system-spec-kit scripts."
trigger_phrases:
  - "spec kit scripts"
  - "validation scripts"
  - "memory save script"
  - "upgrade level workflow"
importance_tier: "normal"
---


# System-Spec-Kit Scripts

<!-- ANCHOR:table-of-contents -->
## TABLE OF CONTENTS

- [1. OVERVIEW](#1--overview)
- [2. INVENTORY SNAPSHOT](#2--inventory-snapshot)
- [3. POST-SPEC124/128/129 WORKFLOW](#3--post-spec124128129-workflow)
- [4. BUILD AND RUNTIME](#4--build-and-runtime)
- [5. RELATED READMES](#5--related-readmes)

<!-- /ANCHOR:table-of-contents -->
<!-- ANCHOR:overview -->
## 1. OVERVIEW

This directory contains the shell and TypeScript tooling that powers spec creation, upgrades, validation, memory save, and context indexing.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:inventory-snapshot -->
## 2. INVENTORY SNAPSHOT


Top-level files:
- `common.sh`
- `registry-loader.sh`
- `scripts-registry.json`
- `package.json`
- `tsconfig.json`

Primary script directories:
- `spec/` - 8 lifecycle scripts (`create.sh`, `upgrade-level.sh`, `check-placeholders.sh`, `validate.sh`, `check-completion.sh`, `calculate-completeness.sh`, `recommend-level.sh`, `archive.sh`)
- `rules/` - 13 modular validation rules used by `spec/validate.sh`
- `memory/` - 3 TypeScript CLIs (`generate-context.ts`, `rank-memories.ts`, `cleanup-orphaned-vectors.ts`)
- `core/` - 8 TypeScript workflow modules
- `extractors/` - 11 TypeScript extraction modules plus barrel export
- `loaders/` - 2 TypeScript loading modules plus barrel export
- `renderers/` - 2 TypeScript rendering modules plus barrel export
- `lib/` - 10 TypeScript libraries plus 3 shell helper libraries
- `evals/` - 9 evaluation scripts (redaction calibration, phase1-5 shadow eval, quality backfill, performance benchmarks, closure metrics, telemetry dashboard, quality legacy remediation, dataset generation)
- `kpi/` - shell KPI scripts (`quality-kpi.sh`)
- `tests/` - JS, shell, and Python test suites for scripts and modules


<!-- /ANCHOR:inventory-snapshot -->
<!-- ANCHOR:post-spec124128129-workflow -->
## 3. POST-SPEC124/128/129 WORKFLOW


For spec-level upgrades and memory-safe docs flow:
1. Run `spec/upgrade-level.sh` to inject level-specific template sections.
2. Auto-populate injected placeholders from existing spec context (no placeholder text left behind).
3. Run `spec/check-placeholders.sh` to confirm placeholder cleanup.
4. Run `spec/validate.sh` to enforce rule checks, including anchor checks.
5. Run `spec/check-completion.sh` before claiming completion.

Anchor requirements introduced in this workflow are validated by `rules/check-anchors.sh` and enforced through `spec/validate.sh`.


<!-- /ANCHOR:post-spec124128129-workflow -->
<!-- ANCHOR:build-and-runtime -->
## 4. BUILD AND RUNTIME


TypeScript sources compile to `dist/`:

```bash
cd .opencode/skill/system-spec-kit/scripts
npm run build
```

Memory save entrypoint (required by Memory Save Rule):

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release
```

JSON mode is also supported:

```bash
node .opencode/skill/system-spec-kit/scripts/dist/memory/generate-context.js /tmp/save-context-data.json specs/003-system-spec-kit/130-memory-overhaul-and-agent-upgrade-release
```


<!-- /ANCHOR:build-and-runtime -->
<!-- ANCHOR:related-readmes -->
## 5. RELATED READMES


- `spec/README.md`
- `core/README.md`
- `memory/README.md`
- `tests/README.md`
- `extractors/README.md`
- `loaders/README.md`
- `renderers/README.md`
- `lib/README.md`
<!-- /ANCHOR:related-readmes -->
