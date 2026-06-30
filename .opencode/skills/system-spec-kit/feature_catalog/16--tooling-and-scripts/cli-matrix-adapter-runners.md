---
title: "CLI matrix adapter runners"
description: "Definition-driven F1-F14 matrix runner package for cli-opencode and cli-claude-code executor cells."
trigger_phrases:
  - "matrix_runners"
  - "CLI matrix adapters"
  - "F1-F14 matrix"
  - "adapter-cli-opencode"
version: 3.6.0.13
---

# CLI matrix adapter runners

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

`mcp_server/matrix_runners/` turns the F1-F14 x CLI executor matrix into executable external-CLI cells.

The package is intentionally separate from native/local matrix checks. Local status uses focused local runners; the external adapter layer documented here covers CLI executor cells.

---

## 2. HOW IT WORKS

The matrix runner has a frozen matrix definition file, prompt templates for F1-F14, one adapter per supported CLI executor, and a meta-runner that filters by feature or executor. It writes one JSONL file per cell plus `summary.tsv`, records per-cell status and evidence, and treats non-applicable cells as `NA`.

Each adapter maps a normalized `AdapterInput` into the target CLI's argv/stdin contract. Spawn failures such as missing binaries, permission failures, `EAGAIN`, and `ENOSPC` return `BLOCKED`; timeouts return `TIMEOUT_CELL`; zero exit without the expected stdout signal returns `FAIL`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `mcp_server/matrix_runners/README.md:8-10` | Docs | Defines the package as CLI-only matrix adapter runners and distinguishes local-runner coverage |
| `mcp_server/matrix_runners/README.md:31-45` | Docs | Documents matrix definition fields and applicability rules |
| `mcp_server/matrix_runners/README.md:54-71` | Docs | Documents adapter status vocabulary and smoke verification command |
| `mcp_server/matrix_runners/run-matrix.ts:21-45` | Meta-runner | Defines executor, matrix definition, and CLI option contracts |
| `mcp_server/matrix_runners/run-matrix.ts:63-73` | Meta-runner | Registers the supported CLI executors |
| `mcp_server/matrix_runners/run-matrix.ts:134-147` | Meta-runner | Routes each executor to its adapter |
| `mcp_server/matrix_runners/run-matrix.ts:172-190` | Meta-runner | Writes JSONL cell records and TSV summary rows |
| `mcp_server/matrix_runners/adapter-cli-claude-code.ts:11-28` | Adapter | Runs a matrix cell through Claude Code CLI |
| `mcp_server/matrix_runners/adapter-cli-opencode.ts:13-36` | Adapter | Runs a matrix cell through OpenCode CLI |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `mcp_server/tests/matrix-adapter-claude-code.vitest.ts` | Vitest | Mocked adapter coverage for Claude Code CLI cells |
| `mcp_server/tests/matrix-adapter-opencode.vitest.ts` | Vitest | Mocked adapter coverage for OpenCode CLI cells |

---

## 4. SOURCE METADATA
- Group: Tooling And Scripts
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `16--tooling-and-scripts/cli-matrix-adapter-runners.md`

- Packet source: `011-cli-matrix-adapter-runners`
Related references:
- [strict-validation-addons-continuity-freshness-and-evidence-markers.md](strict-validation-addons-continuity-freshness-and-evidence-markers.md) — Strict validation add-ons: continuity freshness and evidence markers
- [opencode-hook-freshness-smoke-check.md](opencode-hook-freshness-smoke-check.md) — OpenCode hook freshness smoke check
