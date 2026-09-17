---
title: "Fan-out config schema"
description: "Multi-executor fan-out config layer: lineageExecutorSchema, fanoutConfigSchema, parseFanoutConfig, expandLineages — sits on top of the existing single-executor config without modifying it."
trigger_phrases:
  - "fan-out config schema"
  - "parseFanoutConfig"
  - "configure fanout executors"
  - "lineage executor schema"
  - "expand lineages label collision"
version: 1.4.0.3
---

# Fan-out config schema

<!-- sk-doc-template: skill_asset_feature_catalog -->

---

## 1. OVERVIEW

Adds the opt-in multi-executor config representation above the existing `executorConfigSchema`.
Defines `lineageExecutorSchema` (executorConfigSchema extended with a dir-safe `label`
matching `/^[a-z0-9][a-z0-9-]*$/`, `count` int≥1 default 1, `iterations` int≥1|null default
null), `fanoutConfigSchema` (`executors[]` min 1, `concurrency` int≥1 default 2),
`parseFanoutConfig` (delegates each entry's executor subset to the existing
`parseExecutorConfig` — reuses all kind/model/flag rules — then enforces unique labels and
collision-safe count expansion), and `expandLineages` (count=1 keeps base label; count>1
yields `label-1…label-N`, each with count:1).

### Why This Matters

Foundation for all fan-out dispatch. If this schema drifts, all downstream pool, CLI driver,
salvage, and merge primitives will receive malformed lineage descriptors.

---

## 2. HOW IT WORKS

Fully shipped in `executor-config.ts`. `parseFanoutConfig` validates uniqueness of declared
labels AND of expanded labels (e.g. a base label `x` with count:3 must not collide with
another declared label `x-2`). The optional `lineageId` field on
`RunAuditedExecutorCommandInput` and `buildExecutorAuditRecord` is a companion addition —
conditionally spread so records are byte-identical when absent (parity guaranteed).

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|---|---|
| `lib/deep-loop/executor-config.ts` | `lineageExecutorSchema` (~L294), `fanoutConfigSchema` (~L304), `parseFanoutConfig` (~L323), `expandLineages` (~L381) |
| `lib/deep-loop/executor-audit.ts` | Optional `lineageId` on `RunAuditedExecutorCommandInput` (~L106) and `buildExecutorAuditRecord` (~L491); conditional spread preserves byte-identical single-executor records |

### Validation

| File | Role |
|---|---|
| `tests/unit/executor-config.vitest.ts` | 9 fan-out tests added to the existing 27: happy path, unique-label enforcement, expanded-label collision detection, count expansion (label-1…label-N), per-entry kind validation reuse (cli-opencode requires model) |

---

## 4. SOURCE METADATA

- Group: Fan-Out
- Feature ID: F023
- Catalog source: `feature-catalog/fanout/fanout-config-schema.md`
- Primary source files: `lib/deep-loop/executor-config.ts`, `lib/deep-loop/executor-audit.ts`
Related references:
- [fanout-pool.md](../../feature-catalog/fanout/fanout-pool.md) — Fan-out worker pool
