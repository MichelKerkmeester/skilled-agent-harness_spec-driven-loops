---
title: "Lane config"
description: "The non-interactive --lane-config <file.json> path: a bare JSON array of lane objects for headless and cron runs."
trigger_phrases:
  - "lane config"
  - "--lane-config json"
  - "non-interactive lane resolution"
  - "parseLaneConfigFile"
  - "headless alignment scoping"
version: 1.0.0.0
---

# Lane config

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The non-interactive `--lane-config <file.json>` path: a bare JSON array of lane objects for headless and cron runs.

When a run cannot ask an operator the three-axis question — an unattended sweep, a cron job, a headless invocation — the lanes come from a config file instead. ADR-011 locks this to config-file-only (one `--lane-config` flag, not repeated `--lane` flags and not an inline JSON-array flag), because a file is versionable, diffable, and reviewable as a tracked artifact.

## 2. HOW IT WORKS

`parseLaneConfigFile()` reads a file path (or `-` for stdin, mirroring the runtime's own stdin convention), parses it as JSON, and hands the result to `resolveLanesFromConfig()`, which requires a bare array and maps each entry through the same `validateLane()` the interactive path uses. Each entry has exactly three keys — `authority`, `artifactClass`, `scope` — and any single malformed lane fails the whole file with exit `3`, never a partial or best-effort lane set. An empty array is valid and resolves to zero lanes, mirroring the "empty resolves, does not fail" pattern used for empty scopes.

The two paths never run together and neither is silently skipped: `scoping.cjs`'s CLI entrypoint exits non-zero with an explicit message if invoked without `--lane-config`, since the only other path is the conversational one owned by the planned invoking command (phase-009, not yet built). Because `resolveLanesFromConfig()` has no session-state or clock dependency, the same file always resolves to the same lane set, which is what makes cron runs reproducible (NFR-R01).

**Difference from deep-review:** deep-review is configured through its own packet config written at initialization, not a lanes file, because it has no per-run lanes to declare — its dimensions are fixed. deep-alignment's config file exists precisely to carry the variable, per-run lane set that a headless run cannot obtain conversationally, and it maps 1:1 onto the interactive tree's output so the two producers stay indistinguishable.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/scoping.cjs` | Script | Implements `parseLaneConfigFile()`, `resolveLanesFromConfig()`, the `--lane-config` CLI parsing, and the exit-`3` fail-closed behavior. |
| `references/lane_config_schema.md` | Reference | The concrete field-level JSON shape, the authority-to-class validity table, and the error contract. |
| `assets/deep_alignment_config_template.json` | Template | The run config whose frozen `lanes` field is populated from a resolved lane-config. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Drives `resolveLanesFromConfig()` for multi-lane, zero-lane, and zero-artifact-lane inputs. |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/` | Spec phase | ADR-011 (config-file-only lock), ADR-012 (authority-enum growth). |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/004-scoping-and-discovery/` | Spec phase | Non-interactive path acceptance criteria. |

---

## 4. SOURCE METADATA

- Group: Lane resolution
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `lane-resolution/lane-config.md`
- Primary sources: `scripts/scoping.cjs`, `references/lane_config_schema.md`, `assets/deep_alignment_config_template.json`
Related references:
- [scoping-tree.md](scoping-tree.md) — Scoping tree
- [scope-types.md](scope-types.md) — Scope types
