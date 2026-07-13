---
title: "--lane-config JSON Schema (ADR-011: Config-File Only)"
description: "The concrete JSON shape a --lane-config <file.json> file must satisfy for deep-alignment's non-interactive path, and how it maps 1:1 onto the interactive scoping tree's lane-tuple output."
trigger_phrases:
  - "lane-config schema"
  - "deep-alignment non-interactive lanes"
  - "--lane-config json shape"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# --lane-config JSON Schema

The concrete JSON shape a `--lane-config <file.json>` file must satisfy for deep-alignment's non-interactive path.

---

## 1. OVERVIEW

### Purpose

ADR-011 (`002-architecture-decision/decision-record.md`) locks the non-interactive path to **config-file only**: a single `--lane-config <file.json>` flag, not repeated `--lane` flags and not an inline `--lanes` JSON-array flag. This document is that ADR's remaining open deliverable, the concrete field-level JSON shape, and the reference implementation that parses and validates it is `scripts/scoping.cjs`.

### When to Use

- Authoring a `--lane-config` file for a headless deep-alignment run.
- Validating a config-file lane against the same rules `scripts/scoping.cjs` enforces at parse time.
- Confirming a config-file lane resolves to the identical shape an interactive session would produce.
- Debugging a lane-config validation failure (unknown authority, invalid artifact-class, malformed scope).

### Prerequisites

- `scoping_protocol.md`, the interactive tree that produces the identical lane-tuple shape this file's `authority`/`artifactClass`/`scope` triple maps onto 1:1.
- `discover_contract.md`, what `DISCOVER` does with a resolved lane's `scope` next.

---

## 2. TOP-LEVEL SHAPE

The file is a **bare JSON array** of lane objects, not wrapped in an envelope object:

```json
[
  { "authority": "sk-doc", "artifactClass": "docs", "scope": { "type": "paths", "values": ["docs/"] } },
  { "authority": "sk-git", "artifactClass": "git-history", "scope": { "type": "branchRange", "from": "main", "to": "HEAD" } }
]
```

No envelope, version field, or metadata wrapper is added at this level. ADR-011's own reasoning for a file (over an inline flag) is that the file itself is versionable, diffable, and reviewable *as a file*, properties git already gives any tracked JSON file, not that the content needs its own internal version counter. An empty array (`[]`) is valid and resolves to zero lanes. It is not an error (mirrors the "empty resolves, does not fail" pattern the rest of this phase uses for empty scopes, see `scoping_protocol.md` §7).

---

## 3. PER-LANE OBJECT SHAPE

Each array entry has three required keys, the same three ADR-011 names verbatim, plus an optional `adapter` discriminator:

| Key | Type | Constraint |
|---|---|---|
| `authority` | string | Must be one of the registered authorities (`scripts/scoping.cjs`'s `AUTHORITY_ARTIFACT_CLASSES` keys: `sk-doc`, `sk-git`, `sk-design`, `sk-code` in v1, extensible per ADR-012) |
| `artifactClass` | string | Must be one of `docs`, `code`, `designs`, `git-history`, AND must be one the named `authority` actually supports (see §4) |
| `scope` | object | One of the three shapes in §5, validated against the repo root for `paths`/`globs` |
| `adapter` | string | **Optional.** One of the authority's registered adapter modules (`scripts/scoping.cjs`'s `AUTHORITY_ADAPTERS[authority]`). Defaults to the authority's own module. Lets a `designs` lane select `sk-design-live-render` instead of the static `sk-design` adapter. It is a discovery/check module selector, not part of the lane's identity (laneId is authority×artifactClass×scope). |

This is not a schema-only rule. It is the literal object `scripts/scoping.cjs`'s `validateLane()` returns on success, unchanged, so a config-file lane and an interactively-resolved lane are indistinguishable once resolved (zero information loss, per ADR-011's own constraint).

---

## 4. AUTHORITY -> ARTIFACT-CLASS VALIDITY

| Authority | Valid `artifactClass` values (v1) |
|---|---|
| `sk-doc` | `docs` |
| `sk-git` | `git-history` |
| `sk-design` | `designs` |
| `sk-code` | `code` |

A lane naming a real authority with an artifact-class that authority does not support fails validation with both values named in the error (for example, `sk-git` paired with `docs`). This table is the config-file's version of the same rule the interactive tree enforces by only offering valid authorities once ARTIFACT-CLASS is picked (`scoping_protocol.md` §2.2). The config file has no such filtering at authoring time, so `scripts/scoping.cjs` enforces it at parse time instead.

---

## 5. `scope` SHAPES

Exactly one of three, discriminated by `scope.type`:

```json
{ "type": "paths", "values": ["docs/", "README.md"] }
```
```json
{ "type": "globs", "values": ["src/**/*.ts", "!src/**/*.test.ts"] }
```
```json
{ "type": "branchRange", "from": "main", "to": "HEAD" }
```

`values` (for `paths`/`globs`) must be a non-empty array of non-empty strings. Each is validated against the repo root before the lane is accepted (NFR-S01): an absolute path outside the repo, or a value containing a `..` traversal segment, fails the whole lane-config, not just that one lane. `from`/`to` (for `branchRange`) must be non-empty strings. They are git refs, not filesystem paths, so they are not repo-root-validated the same way.

---

## 6. JSON SCHEMA (INFORMATIVE)

The following is a machine-checkable restatement of §3-§5, for tooling that wants a formal schema rather than the prose above. `scripts/scoping.cjs` does not load this file or any schema-validator library at runtime. It hand-validates against the same rules directly, matching this repo's existing convention (`runtime/scripts/upsert.cjs` validates its own JSON input the same hand-rolled way, with no `ajv`/`zod` dependency in this package).

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "deep-alignment lane-config",
  "type": "array",
  "items": {
    "type": "object",
    "required": ["authority", "artifactClass", "scope"],
    "additionalProperties": false,
    "properties": {
      "authority": { "type": "string", "enum": ["sk-doc", "sk-git", "sk-design", "sk-code"] },
      "artifactClass": { "type": "string", "enum": ["docs", "code", "designs", "git-history"] },
      "adapter": { "type": "string", "description": "Optional adapter-module discriminator; one of the authority's AUTHORITY_ADAPTERS entries (default: the authority's own module)." },
      "scope": {
        "oneOf": [
          {
            "type": "object",
            "required": ["type", "values"],
            "additionalProperties": false,
            "properties": {
              "type": { "const": "paths" },
              "values": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 1 } }
            }
          },
          {
            "type": "object",
            "required": ["type", "values"],
            "additionalProperties": false,
            "properties": {
              "type": { "const": "globs" },
              "values": { "type": "array", "minItems": 1, "items": { "type": "string", "minLength": 1 } }
            }
          },
          {
            "type": "object",
            "required": ["type", "from", "to"],
            "additionalProperties": false,
            "properties": {
              "type": { "const": "branchRange" },
              "from": { "type": "string", "minLength": 1 },
              "to": { "type": "string", "minLength": 1 }
            }
          }
        ]
      }
    }
  }
}
```

The `authority` enum grows by one value whenever ADR-012's governance process registers a new authority. Nothing else in this schema, or in `scripts/scoping.cjs`, changes shape to accommodate it.

---

## 7. WORKED EXAMPLE, MULTI-AUTHORITY SINGLE RUN

The operator precedent from `002-architecture-decision` ("sk-code and sk-git and/or sk-design" in one pass) as a `--lane-config` file:

```json
[
  {
    "authority": "sk-code",
    "artifactClass": "code",
    "scope": { "type": "globs", "values": ["src/**/*.ts"] }
  },
  {
    "authority": "sk-git",
    "artifactClass": "git-history",
    "scope": { "type": "branchRange", "from": "main", "to": "HEAD" }
  },
  {
    "authority": "sk-design",
    "artifactClass": "designs",
    "scope": { "type": "paths", "values": ["DESIGN.md"] }
  }
]
```

`node scripts/scoping.cjs --lane-config path/to/this-file.json` resolves this to 3 lanes in one call, the same 3-lane result an equivalent 3-walk interactive session produces via `resolveLanesFromSelections()`.

---

## 8. ERROR CONTRACT

Every validation failure fails the whole file (fail-closed, per ADR-011's own risk mitigation and `spec.md`'s Error Scenarios), before `DISCOVER` starts:

| Failure | Message names |
|---|---|
| Unknown `authority` | The bad value and the full currently-registered set |
| `artifactClass` not valid for the named `authority` | Both values and the authority's actual supported class(es) |
| Malformed/missing `scope` | Which lane (`lanes[N]`) and which field |
| File missing, unreadable, or not valid JSON | The resolved path and the underlying I/O or parse error |

`scripts/scoping.cjs` exits `3` (input-validation, matching `runtime/scripts/upsert.cjs`'s own exit-code convention) on any of these. It never resolves a malformed file to a partial or best-effort lane set.

---

## 9. REFERENCES AND RELATED RESOURCES

- `scoping_protocol.md`, the interactive tree that produces the identical lane-tuple shape this file's `authority`/`artifactClass`/`scope` triple maps onto 1:1.
- `discover_contract.md`, what `DISCOVER` does with a resolved lane's `scope` next.
- `scripts/scoping.cjs`, `resolveLanesFromConfig()`, `parseLaneConfigFile()`, and `validateLane()`, the reference implementation of everything in this document.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-011 (this schema's lock), ADR-012 (authority registration governance).
