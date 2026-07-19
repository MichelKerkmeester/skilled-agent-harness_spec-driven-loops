---
title: "discover(scope)"
description: "The first adapter method: turn a lane's scope into an artifact corpus plus coverage-graph seed FILE nodes, identically for every authority."
trigger_phrases:
  - "discover scope contract"
  - "adapter discover method"
  - "artifact corpus seed nodes"
  - "FILE seed nodes upsert"
  - "authority-agnostic discover"
version: 1.0.0.1
---

# discover(scope)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

The first adapter method: turn a lane's scope into an artifact corpus plus coverage-graph seed `FILE` nodes, identically for every authority.

ADR-003 locks a three-method adapter contract — `discover(scope)`, `standardSource(authority)`, `check(artifact, rules)` — so the loop itself never branches on which authority it is running. `discover()` is the first method: the authority-agnostic "find the artifacts this lane covers" half, satisfied identically by every adapter phase and any future authority.

## 2. HOW IT WORKS

`discover(scope) -> { artifacts, nodes }` takes exactly the `scope` field of one resolved lane — already validated against the repo root, so an implementation may assume every `paths`/`globs` value is repo-relative and traversal-free. The signature has one parameter and no authority name: the adapter already knows its own authority by virtue of being that authority's module, and passing it again would give the loop a reason to branch, which ADR-003 forbids. No adapter may widen the signature to a second parameter.

The `artifacts` array has one entry per discovered item — `{ path }` for `paths`/`globs` scopes, `{ path, ref }` for `branchRange` scopes since the same file can exist differently across a range. The `nodes` array carries one `FILE`-kind coverage seed node per artifact, shaped for `runtime/scripts/upsert.cjs --nodes`, with `authority`/`artifactClass` (and `ref` where relevant) in `metadata` so downstream findings trace back to their lane. `FILE` is a valid `NodeKind` for the reused loop types, so this is not a new node shape invented for the mode. An empty or zero-match scope returns `{ artifacts: [], nodes: [] }`, and the lane is marked zero-coverage rather than the run failing.

**Difference from deep-review:** deep-review seeds a richer graph vocabulary — `DIMENSION` nodes, `FINDING` nodes with `metadata.severity`, and `COVERS`/`CONTRADICTS`/`EVIDENCE_FOR` edges — because its composite convergence score reads that structure. deep-alignment's `discover-contract.md` only specifies adapters seeding `FILE` nodes; it deliberately does not fabricate a `DIMENSION`-per-lane graph, which is one reason its convergence check runs against the reducer's registry directly instead of the shared graph-based `convergence.cjs`.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/discover-contract.md` | Reference | Specifies the signature, the `artifacts`/`nodes` output shape, the FILE-seed convention, and the authority-agnostic extensibility guarantee. |
| `scripts/adapters/sk-doc.cjs` | Adapter | Reference implementation of `discover()` for the `docs` artifact-class (path walk + document-type classification). |
| `scripts/adapters/sk-git.cjs` | Adapter | `discover()` for `git-history`: commit-range walk plus branch listing, `{ path, ref }` entries. |
| `scripts/adapters/sk-code.cjs` | Adapter | `discover()` for `code`: reads each candidate's content for the surface-marker fallback. |
| `runtime/scripts/upsert.cjs` | Runtime | The coverage-graph seeding entrypoint every adapter's `nodes` output is written through. |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| Each `scripts/adapters/*.cjs` CLI `discover` subcommand | Manual dry-run | Prints an adapter's real `discover()` output for a scope, used to verify the corpus while building. |
| `scripts/tests/state-machine-wiring.test.cjs` | Regression test | Consumes a discover()-shaped corpus (hand-seeded) through the downstream `ITERATE`/`CONVERGE` wiring. |

---

## 4. SOURCE METADATA

- Group: Adapter contract
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `adapter-contract/discover.md`
- Primary sources: `references/discover-contract.md`, `scripts/adapters/sk-doc.cjs`, `runtime/scripts/upsert.cjs`
Related references:
- [standard-source.md](../../feature-catalog/adapter-contract/standard-source.md) — standardSource(authority)
- [check.md](check.md) — check(artifact, rules)
- [../lane-resolution/scope-types.md](../../feature-catalog/lane-resolution/scope-types.md) — Scope types
