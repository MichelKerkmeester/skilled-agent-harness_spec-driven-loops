---
title: "Scope types"
description: "The three scope shapes a lane may carry — paths, globs, branchRange — validated against the repo root before any adapter sees them."
trigger_phrases:
  - "scope types"
  - "SCOPE_TYPES"
  - "paths globs branchRange"
  - "validateScope repo root"
  - "alignment scope validation"
version: 1.0.0.0
---

# Scope types

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The three scope shapes a lane may carry — `paths`, `globs`, `branchRange` — validated against the repo root before any adapter sees them.

A lane's scope answers "where to look." It is the third axis of the scoping tree, and it is the only axis with a security surface: an unvalidated scope value could point a lane outside the workspace before any adapter's `discover()` ever ran, so scope validation is a hard containment boundary, not a formatting nicety.

## 2. HOW IT WORKS

`SCOPE_TYPES` is the frozen set `['paths', 'globs', 'branchRange']`. `validateScope()` requires a scope object whose `type` is one of these. For `paths`/`globs` it requires a non-empty array of non-empty string `values`, and validates every value against the repo root via the shared `validateNamespaceValue()` helper the runtime CLIs already use — rather than re-implementing path-traversal detection — so an absolute path outside the repo or a `..` traversal segment fails the whole lane. For `branchRange` it requires non-empty `from`/`to` strings; those are git refs, not filesystem paths, so they are deliberately not repo-root-checked the same way.

A scope that resolves fine here but matches zero files at discover-time is not a distinct case: the lane still resolves, `discover()` returns an empty corpus, and the lane is marked zero-coverage downstream, never an error. Adapters defensively re-check repo-root containment (for example sk-doc's `isInsideRepoRoot()`) as defense-in-depth for a direct or test call that bypasses `scoping.cjs`, but `validateScope()` is the primary enforcement point.

**Difference from deep-review:** deep-review resolves its target into a plain file set through one of five target types, with no per-lane scope object and no `branchRange` shape — it never audits git history, so it never needs a ref-range scope. deep-alignment carries `branchRange` specifically because the `sk-git` authority audits commits and branches over a range, an artifact-class deep-review has no analog for.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/scoping.cjs` | Script | Declares the frozen `SCOPE_TYPES` set and implements `validateScope()`, including the per-value repo-root check. |
| `runtime/scripts/lib/cli-guards.cjs` | Shared library | Provides `validateNamespaceValue()`, the repo-root/traversal check `validateScope()` reuses. |
| `references/scoping_protocol.md` | Reference | Section 2.3 defines the three scope shapes and the NFR-S01 repo-root constraint. |
| `references/lane_config_schema.md` | Reference | Section 5 gives the field-level scope schema for the config-file path. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Resolves `paths` and `branchRange` scopes, including a `paths` scope that matches zero files (the zero-artifact-lane fixture). |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/004-scoping-and-discovery/` | Spec phase | NFR-S01 (repo-root containment) acceptance evidence. |

---

## 4. SOURCE METADATA

- Group: Lane resolution
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `lane-resolution/scope-types.md`
- Primary sources: `scripts/scoping.cjs`, `runtime/scripts/lib/cli-guards.cjs`, `references/scoping_protocol.md`
Related references:
- [scoping-tree.md](scoping-tree.md) — Scoping tree
- [lane-config.md](lane-config.md) — Lane config
- [../adapter-contract/discover.md](../adapter-contract/discover.md) — discover(scope)
