---
title: "Scoping tree"
description: "Resolves an interactive or non-interactive deep-alignment run into N alignment lanes through one three-axis decision tree."
trigger_phrases:
  - "scoping tree"
  - "alignment lane resolution"
  - "artifact-class authority scope tree"
  - "resolveLanesFromSelections"
  - "validateLane choke point"
version: 1.0.0.1
---

# Scoping tree

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Resolves an interactive or non-interactive deep-alignment run into N alignment lanes through one three-axis decision tree.

`deep-alignment` cannot discover a single artifact until it knows three things: what kind of artifact to look at, whose standard to check it against, and where to look. The scoping tree is the structured decision that resolves those three answers into one or more alignment lanes — a `(authority, artifactClass, scope)` tuple each — before the `DISCOVER` state runs. It replaces free-text scoping (rejected by ADR-002) with a small, enumerable tree so the same answers always resolve to the same lanes.

## 2. HOW IT WORKS

The tree is walked once per lane the operator wants: pick one ARTIFACT-CLASS, multi-select the AUTHORITY values valid for that class, name one SCOPE. Each walk expands to one lane per selected authority, and a single session accumulates lanes across as many walks as needed — this is how "sk-code and sk-git and/or sk-design in one pass" resolves as three separate walks in one session. It is not a full cross-product of every class against every authority; only the combinations the operator actually names become lanes.

Both entry paths funnel through the same choke point. The interactive path is the planned `@deep-alignment` dispatched agent (phase-009, not yet built) asking the three-axis question conversationally, then calling `resolveLanesFromSelections()` with the structured answers; the non-interactive path calls `resolveLanesFromConfig()` with a parsed `--lane-config` array and is runnable through `scoping.cjs`'s own CLI today. Both map every candidate lane through `validateLane()`, so an interactively-answered lane and a config-file lane are byte-indistinguishable once resolved — there is no separate "interactive lane" type and "config lane" type, only one shape with two producers. Lane resolution is a pure planning step: `scoping.cjs` does no artifact scanning of its own, only validating and shaping the tuples `DISCOVER` later acts on. Lane count is unbounded by contract; per-run partitioning is `ITERATE`'s concern, not this step's.

**Difference from deep-review:** deep-review has no scoping tree at all — its four review dimensions (correctness, security, traceability, maintainability) are a fixed constant baked into initialization, so it only resolves a target into a file set. deep-alignment's lanes are resolved per-run from operator input across three axes, which is why it needs a dedicated resolution engine that deep-review's `initialization` phase never required.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/scoping.cjs` | Script | Implements `resolveLanesFromSelections()`, `resolveLanesFromConfig()`, and the shared `validateLane()`/`validateScope()` choke point both paths call. |
| `references/scoping-protocol.md` | Reference | Defines the three-axis tree, the walk-to-lanes expansion, the internal lane-tuple representation, and the interactive/non-interactive split. |
| `references/lane-config-schema.md` | Reference | Defines the on-disk `--lane-config` shape the config path resolves through the same `validateLane()`. |
| `SKILL.md` | Skill contract | States the `SCOPE` state and the "Resolve lanes before discovering artifacts" ALWAYS rule. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Drives `resolveLanesFromConfig()` end to end across the multi-lane, zero-lane, and zero-artifact-lane fixtures. |

---

## 4. SOURCE METADATA

- Group: Lane resolution
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `lane-resolution/scoping-tree.md`
- Primary sources: `scripts/scoping.cjs`, `references/scoping-protocol.md`, `references/lane-config-schema.md`
Related references:
- [artifact-classes.md](../../feature-catalog/lane-resolution/artifact-classes.md) — Artifact classes
- [authority-registry.md](../../feature-catalog/lane-resolution/authority-registry.md) — Authority registry
- [scope-types.md](../../feature-catalog/lane-resolution/scope-types.md) — Scope types
- [lane-config.md](../../feature-catalog/lane-resolution/lane-config.md) — Lane config
