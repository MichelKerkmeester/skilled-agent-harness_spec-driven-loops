---
title: "discover(scope) -> artifacts Contract"
description: "The authority-agnostic discover(scope) -> artifacts half of the pluggable adapter contract every deep-alignment authority adapter implements identically."
trigger_phrases:
  - "alignment discover contract"
  - "deep-alignment adapter discover"
  - "coverage graph seed FILE nodes"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# discover(scope) -> artifacts Contract

The authority-agnostic `discover(scope) -> artifacts` half of the pluggable adapter contract every deep-alignment authority adapter implements identically.

---

## 1. OVERVIEW

### Purpose

ADR-003 (`002-architecture-decision/decision-record.md`) locks a three-method adapter contract: `discover(scope) -> artifacts`, `standardSource(authority) -> {templates, rules}`, and `check(artifact, rules) -> findings`. That split keeps the loop itself from ever branching on which authority it is running. This document specifies the **first** method only: its input shape, its output shape, and the authority-agnostic guarantee every adapter phase (005 sk-doc, 006 sk-git/sk-design, 007 sk-code, 010 sk-design live-render, and any future authority under ADR-012) must satisfy identically. `standardSource` and `check` belong to each adapter phase's own spec, not this one (`spec.md` §3 Out of Scope).

### When to Use

- Implementing a new authority adapter's `discover(scope)` method.
- Verifying an adapter's artifact and seed-node output shape before wiring it into `DISCOVER`.
- Auditing whether an adapter's signature stays authority-agnostic per ADR-003.
- Debugging coverage-graph seeding for a lane's discovered artifacts.

### Prerequisites

- `scoping-protocol.md`, how the `scope` this method receives gets resolved and validated before `DISCOVER` ever calls it.
- `lane-config-schema.md` §5, the field-level shape of the `scope` object.

---

## 2. SIGNATURE

```
discover(scope) -> artifacts
```

One parameter. No authority name, artifact-class, or lane identifier appears in the signature. The adapter calling it already knows its own authority and artifact-class by virtue of being that authority's own module (per the v1 registry in `scoping-protocol.md` §2.2, one authority maps to one artifact-class), so passing them again would be redundant. Passing them again would also give the loop a reason to branch on authority, which ADR-003 forbids.

---

## 3. INPUT: `scope`

Exactly the `scope` field of one resolved alignment lane (`scoping-protocol.md` §4), already validated against the repo root (NFR-S01) before `DISCOVER` calls this method, so an implementation may assume every `paths`/`globs` value is repo-relative and traversal-free. Three shapes, one per `scope.type`:

```json
{ "type": "paths", "values": ["docs/", "README.md"] }
{ "type": "globs", "values": ["src/**/*.ts"] }
{ "type": "branchRange", "from": "main", "to": "HEAD" }
```

Full field definitions: `lane-config-schema.md` §5.

---

## 4. OUTPUT: ARTIFACT CORPUS + SEED FILE NODES

`discover()` returns two things together: the artifact list itself, and the coverage-graph seed nodes that make the artifacts visible to `ITERATE`/`CONVERGE`.

```json
{
  "artifacts": [
    { "path": "docs/foo.md" }
  ],
  "nodes": [
    {
      "id": "file:docs/foo.md",
      "kind": "FILE",
      "name": "docs/foo.md",
      "metadata": { "authority": "sk-doc", "artifactClass": "docs" }
    }
  ]
}
```

### 4.1 `artifacts`

One entry per discovered artifact. For `paths`/`globs` scopes, an entry is `{ path }` (a repo-relative file path). For `branchRange` scopes, an entry is a path+ref pair, `{ path, ref }`, since the same file can exist differently at different points in the range. `plan.md` §3 states this explicitly ("file paths or path+ref pairs for git-history scopes"). The exact `path`/`ref` identity convention (which ref, how a rename across the range is represented) is each adapter's own design choice: phase 006 owns `sk-git`'s.

### 4.2 `nodes`

Seed nodes shaped for `runtime/scripts/upsert.cjs`'s `--nodes` input, one node per discovered artifact, `kind: "FILE"`. This is not a new node shape invented for this mode. It is the same `FILE` kind `deep-review` already seeds through the same script:

- `FILE` is a valid `NodeKind` for loop type `review` (`runtime/lib/coverage-graph/coverage-graph-db.ts:22`) **and** for loop type `context` (`runtime/lib/coverage-graph/coverage-graph-db.ts:34`), so a `FILE` seed node is valid regardless of which of those two `runtimeLoopType` values ADR-010's reuse-boundary work (phase 008) ultimately picks for `deep-alignment`.
- The node object itself is a `CoverageNode` (`runtime/lib/coverage-graph/coverage-graph-db.ts:79-93`): `id`, `kind`, `name` are required. `metadata` is free-form and is where an adapter should carry `authority`/`artifactClass` (and, for `branchRange` discoveries, the `ref`) so downstream findings can be traced back to their lane without a second lookup.
- `upsert.cjs` derives the rest at insert time: `kind = String(n.kind || n.nodeKind || n.type || '').toUpperCase()`, checked against `db.VALID_KINDS[loopType]` (`runtime/scripts/upsert.cjs:204-212`), and `name = n.name || n.label || n.id` (`runtime/scripts/upsert.cjs:214`). A discovered-artifact node only needs to supply `id`, `kind: "FILE"`, `name`, and `metadata`. `specFolder`, `sessionId`, and `loopType` are namespace context the CLI call supplies once for the whole batch, not per node.
- Seeding (as opposed to an ordinary iteration upsert) is what marks these `FILE` nodes as `DISCOVER`-origin rather than `ITERATE`-origin: pass `--seed-source` and `--seed-confidence` on the same `upsert.cjs` invocation (`runtime/scripts/upsert.cjs:103-129`'s `parseSeedOptions()`, both required together, `seedConfidence` a number in `[0, 1]`). A `DISCOVER`-state call seeding a lane's corpus looks like:

  ```
  node runtime/scripts/upsert.cjs \
    --spec-folder <bound-spec-folder> \
    --loop-type review \
    --session-id <session-id> \
    --seed-source deep-alignment-discover \
    --seed-confidence 1.0 \
    --nodes '[{"id":"file:docs/foo.md","kind":"FILE","name":"docs/foo.md","metadata":{"authority":"sk-doc","artifactClass":"docs"}}]'
  ```

  Zero edges is a valid call shape here: `upsert.cjs` only rejects an entirely empty `nodes`+`edges` payload when no seed options are supplied (`runtime/scripts/upsert.cjs:175-196`). A non-empty `--nodes` array with `--seed-source`/`--seed-confidence` set passes through normally.

---

## 5. EMPTY AND ZERO-MATCH SCOPE

Per `spec.md`'s edge cases, an empty scope (no paths/globs match anything on disk) is not an error. `discover()` returns `{ "artifacts": [], "nodes": [] }`, and the lane it belongs to is marked zero-coverage downstream rather than the run failing. A `SCOPE` value that resolved fine in the scoping step but happens to match zero files at discover-time is exactly the same case, not a distinct one.

---

## 6. AUTHORITY-AGNOSTIC EXTENSIBILITY GUARANTEE

No adapter phase may widen this signature to take a second parameter, and no engine-side caller may special-case a named authority when invoking it. This is the concrete meaning of ADR-003's "do NOT hard-wire only 4" constraint, made checkable: a diff of the planned signature against every adapter phase's stated usage (`plan.md` §4 Phase 3's own verification task for this phase) should show zero authority-specific parameters, in phase 005 through phase 010 alike. A fifth authority (`sk-prompt`, `system-spec-kit`, or any other) implements `discover(scope) -> artifacts` in exactly this shape, ships the short decision-record ADR-012 requires, and needs no change to this document, to `scripts/scoping.cjs`, or to the loop.

---

## 7. REFERENCES AND RELATED RESOURCES

- `scoping-protocol.md`, how the `scope` this method receives gets resolved and validated before `DISCOVER` ever calls it.
- `lane-config-schema.md`, the on-disk shape of a lane's `scope`, field by field.
- `runtime/scripts/upsert.cjs`, the coverage-graph seeding entrypoint every adapter's `nodes` output is written through.
- `runtime/lib/coverage-graph/coverage-graph-db.ts`, the `CoverageNode`/`NodeKind` types `upsert.cjs` validates against.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-003 (this contract), ADR-004 (authority sequencing), ADR-012 (new-authority governance).
