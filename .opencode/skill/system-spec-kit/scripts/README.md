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

This directory contains the shell and TypeScript tooling that powers spec creation, upgrades, validation, memory save, and context indexing.

## Inventory Snapshot

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
- `extractors/` - 9 TypeScript extraction modules plus barrel export
- `loaders/` - 2 TypeScript loading modules plus barrel export
- `renderers/` - 2 TypeScript rendering modules plus barrel export
- `lib/` - 10 TypeScript libraries plus 3 shell helper libraries
- `tests/` - JS, shell, and Python test suites for scripts and modules

## Post-Spec124/128/129 Workflow

For spec-level upgrades and memory-safe docs flow:
1. Run `spec/upgrade-level.sh` to inject level-specific template sections.
2. Auto-populate injected placeholders from existing spec context (no placeholder text left behind).
3. Run `spec/check-placeholders.sh` to confirm placeholder cleanup.
4. Run `spec/validate.sh` to enforce rule checks, including anchor checks.
5. Run `spec/check-completion.sh` before claiming completion.

Anchor requirements introduced in this workflow are validated by `rules/check-anchors.sh` and enforced through `spec/validate.sh`.

## Build and Runtime

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

## Related Readmes

- `spec/README.md`
- `core/README.md`
- `memory/README.md`
- `tests/README.md`
- `extractors/README.md`
- `loaders/README.md`
- `renderers/README.md`
- `lib/README.md`
