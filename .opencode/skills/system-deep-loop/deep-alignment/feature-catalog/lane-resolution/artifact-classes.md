---
title: "Artifact classes"
description: "The four artifact-class values a deep-alignment lane may carry: docs, code, designs, and git-history."
trigger_phrases:
  - "artifact classes"
  - "ARTIFACT_CLASSES"
  - "docs code designs git-history"
  - "alignment artifact class axis"
version: 1.0.0.1
---

# Artifact classes

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The four artifact-class values a deep-alignment lane may carry: `docs`, `code`, `designs`, and `git-history`.

An artifact-class names the kind of thing a lane audits. It is the first axis of the scoping tree because it determines which authorities are even offered next — a `git-history` lane has nothing to do with `sk-doc`, and a `docs` lane has nothing to do with `sk-git` — and it constrains which scope shapes make sense for the lane.

## 2. HOW IT WORKS

`ARTIFACT_CLASSES` is a frozen four-value set: `docs` (Markdown documentation, spec-kit docs, skill reference docs), `code` (source files under a stack `sk-code` recognizes), `designs` (DESIGN.md style-reference docs and design tokens), and `git-history` (commits, branches, and worktree state, not file content). `validateLane()` rejects any lane whose `artifactClass` is outside this set, and additionally rejects a class the named authority does not support (see the authority registry). Declaration order matches the documented axis order but validation does not depend on it.

The class also implies the natural scope shape: `paths`/`globs` for `docs`/`code`/`designs`, and `branchRange` for `git-history`. That coupling is enforced downstream — each adapter's `discover()` returns an empty result for an out-of-contract scope type rather than throwing — but the tree steers an operator toward the sensible pairing at authoring time.

**Difference from deep-review:** deep-review's coverage axis is its four fixed review *dimensions* (correctness, security, traceability, maintainability), which describe how deeply to look at one code target. deep-alignment's artifact-class axis instead describes *what kind of artifact* is under audit, because a conformance check against sk-git's standards operates on commits and branches, not on the source files a review dimension would examine.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/scoping.cjs` | Script | Declares the frozen `ARTIFACT_CLASSES` set and enforces membership in `validateLane()`. |
| `references/scoping-protocol.md` | Reference | Section 2.1 defines each artifact-class value and why it is asked first. |
| `references/lane-config-schema.md` | Reference | Section 3/4 enumerates the four values and the authority-to-class validity table. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Exercises `docs` and `git-history` lanes through `resolveLanesFromConfig()`. |

---

## 4. SOURCE METADATA

- Group: Lane resolution
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `lane-resolution/artifact-classes.md`
- Primary sources: `scripts/scoping.cjs`, `references/scoping-protocol.md`, `references/lane-config-schema.md`
Related references:
- [scoping-tree.md](../../feature-catalog/lane-resolution/scoping-tree.md) — Scoping tree
- [authority-registry.md](../../feature-catalog/lane-resolution/authority-registry.md) — Authority registry
- [scope-types.md](../../feature-catalog/lane-resolution/scope-types.md) — Scope types
