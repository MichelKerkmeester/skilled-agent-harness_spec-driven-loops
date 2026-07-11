---
title: "Authority registry"
description: "The AUTHORITY_ARTIFACT_CLASSES map binding each registered standard authority to the artifact-class(es) it may check."
trigger_phrases:
  - "authority registry"
  - "AUTHORITY_ARTIFACT_CLASSES"
  - "registered authorities"
  - "new authority registration"
  - "sk-doc sk-git sk-design sk-code authority"
version: 1.0.0.0
---

# Authority registry

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The `AUTHORITY_ARTIFACT_CLASSES` map binding each registered standard authority to the artifact-class(es) it may check.

A standard authority is the owner whose own creation standards a lane audits against. The registry is the single place that decides which authorities exist and which artifact-class each one is allowed to cover, so a lane naming a real authority with an unsupported class fails fast, before `DISCOVER` starts.

## 2. HOW IT WORKS

`AUTHORITY_ARTIFACT_CLASSES` is a frozen map: `sk-doc -> [docs]`, `sk-git -> [git-history]`, `sk-design -> [designs]`, `sk-code -> [code]`. `validateLane()` reads it twice — once to confirm the authority is registered at all (naming the full registered set in the error if not), and once to confirm the requested artifact-class is one that authority supports. The values are arrays deliberately: a future authority may cover more than one class, and a class may be covered by more than one authority, even though every v1 authority-to-class mapping is a singleton. `registeredAuthorities()` returns the keys in registration order for the interactive tree's multi-select and for error messages.

The set is extensible by design: a fifth authority registers by adding one entry here plus the short adapter decision-record ADR-012 requires — no change to the scoping tree's shape, to `discover_contract.md`, or to the loop. This is the concrete mechanism behind ADR-003's "do NOT hard-wire only 4" constraint.

**Difference from deep-review:** deep-review has no authority concept — it audits general correctness with no owner whose standard is being conformed to, so there is nothing analogous to a registry of authorities. This registry is exactly the surface that encodes deep-alignment's defining boundary: a finding is always relative to a *named* authority's documented standard, never a free-floating "this is wrong."

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `scripts/scoping.cjs` | Script | Declares the frozen `AUTHORITY_ARTIFACT_CLASSES` map, `registeredAuthorities()`, and the two registry checks inside `validateLane()`. |
| `references/scoping_protocol.md` | Reference | Section 2.2 documents the authority axis, the determinism ordering, and the extensibility rule. |
| `references/lane_config_schema.md` | Reference | Section 4 restates the authority-to-artifact-class validity table and the parse-time enforcement. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Resolves `sk-doc` and `sk-git` lanes, exercising the registry-backed validation. |
| `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/` | Spec phase | ADR-003 (adapter contract), ADR-004 (authority determinism ordering), ADR-012 (new-authority governance). |

---

## 4. SOURCE METADATA

- Group: Lane resolution
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `lane-resolution/authority-registry.md`
- Primary sources: `scripts/scoping.cjs`, `references/scoping_protocol.md`, `references/lane_config_schema.md`
Related references:
- [scoping-tree.md](scoping-tree.md) — Scoping tree
- [artifact-classes.md](artifact-classes.md) — Artifact classes
- [../adapter-contract/standard-source.md](../adapter-contract/standard-source.md) — standardSource(authority)
