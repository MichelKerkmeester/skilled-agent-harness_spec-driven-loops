---
title: "Scoping Protocol - ARTIFACT-CLASS x AUTHORITY x SCOPE Decision Tree"
description: "The structured three-axis decision tree that resolves an interactive or non-interactive deep-alignment run into N alignment lanes, before any artifact is discovered."
trigger_phrases:
  - "deep-alignment scoping question"
  - "alignment lane resolution"
  - "artifact-class authority scope tree"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.1
---

# Scoping Protocol - ARTIFACT-CLASS x AUTHORITY x SCOPE Decision Tree

The structured three-axis decision tree that resolves a deep-alignment run into N alignment lanes, before any artifact is discovered.

---

## 1. OVERVIEW

### Purpose

`deep-alignment` cannot discover a single artifact until it knows three things: what kind of artifact to look at, whose standard to check it against, and where to look. This protocol is the structured decision tree that resolves those three answers into one or more **alignment lanes** before the `DISCOVER` state runs. It replaces free-text scoping (rejected by ADR-002) with a small, enumerable tree so the same answers always resolve to the same lanes, whether a human answers interactively or a `--lane-config` file supplies them for a headless run.

An alignment lane is a `(authority, artifactClass, scope)` tuple. One run resolves to **N** lanes, not one. The tree is walked once per lane the operator wants, and lanes accumulate across as many walks as needed in a single session.

### When to Use

- Resolving an interactive deep-alignment scoping question into concrete lanes.
- Authoring a `--lane-config` file and confirming it maps onto the same lane-tuple shape.
- Auditing whether a proposed lane combination is a valid `(authority, artifactClass)` pairing.
- Debugging why a scoping walk produced zero or unexpected lanes.

### Prerequisites

- `lane_config_schema.md` §5, the field-level `scope` definition shared verbatim between the interactive path and `--lane-config`.
- `discover_contract.md`, what a lane's `scope` becomes once `DISCOVER` calls an adapter's `discover(scope)`.

---

## 2. THE THREE AXES

### 2.1 ARTIFACT-CLASS

One of exactly four values:

| Value | Meaning |
|---|---|
| `docs` | Markdown documentation, spec-kit docs, skill reference docs |
| `code` | Source files under a stack `sk-code` recognizes (OpenCode/Webflow surfaces) |
| `designs` | DESIGN.md style-reference docs and design tokens |
| `git-history` | Commits, branches, and worktree state, not file content |

This is asked first because it determines which authorities are even offered next. A `git-history` lane has nothing to do with `sk-doc`, and a `docs` lane has nothing to do with `sk-git`.

### 2.2 AUTHORITY

One or more of the currently registered authorities, presented as a **multi-select** once ARTIFACT-CLASS narrows the offered list:

| Authority | v1 artifact-class | Determinism (ADR-004) |
|---|---|---|
| `sk-doc` | `docs` | Reference, most deterministic |
| `sk-git` | `git-history` | Deterministic |
| `sk-design` | `designs` (static only, live-render is phase 010's own authority slot) | Audit-rubric |
| `sk-code` | `code` | Hybrid (ADR-008), hardest, least deterministic |

The set is **extensible**: a fifth authority registers by adding one entry to the `AUTHORITY_ARTIFACT_CLASSES` map in `scripts/scoping.cjs`, plus the short adapter decision-record ADR-012 requires. No change to this tree's shape is needed, only to the options it offers. In v1 each authority maps to exactly one artifact-class. The map itself supports an authority covering more than one class, and an artifact-class being covered by more than one authority, once a later authority actually needs that (the multi-select exists in this tree for that future case, not because v1 needs it: v1's per-class authority lists are always singletons).

### 2.3 SCOPE

One of three shapes, validated against the repo root before being accepted (NFR-S01):

| Type | Shape | Typical artifact-class |
|---|---|---|
| `paths` | A list of one or more repo-relative paths | `docs`, `code`, `designs` |
| `globs` | A list of one or more glob patterns | `docs`, `code`, `designs` |
| `branchRange` | A `{from, to}` pair of git refs | `git-history` |

`scope` validation and its exact JSON shape are shared verbatim between the interactive path and `--lane-config`. See `lane_config_schema.md` §5 for the field-level definition, and `scripts/scoping.cjs`'s `validateScope()` for the one implementation both paths call.

---

## 3. LANE RESOLUTION

One walk of the tree (one ARTIFACT-CLASS, one multi-selected set of AUTHORITY values valid for that class, one SCOPE) expands to one lane per selected authority:

```
walk = (artifactClass, [authority_1, authority_2, ...], scope)
lanes += [(authority_1, artifactClass, scope), (authority_2, artifactClass, scope), ...]
```

A single interactive session repeats this walk as many times as the operator wants (once per artifact-class/authority-set they care about), accumulating lanes across walks. This is how "sk-code and sk-git and/or sk-design in one pass," the multi-authority precedent from `002-architecture-decision`, resolves: three separate walks (`code`/`sk-code`, `git-history`/`sk-git`, `designs`/`sk-design`), each contributing one lane, all inside one session. It is **not** a full cross-product of every artifact-class against every authority. Only the combinations the operator actually names become lanes (REQ-002).

Lane count is unbounded by this phase's contract (SC-002). No hard-coded authority ceiling exists in the tree or in `scripts/scoping.cjs`. A per-run lane cap, if one is ever adopted, is corpus-partitioning territory the `ITERATE` state (phase 008) owns, not a restriction this phase's engine enforces.

---

## 4. THE INTERNAL LANE-TUPLE REPRESENTATION

Both paths, interactive and `--lane-config`, resolve to the exact same shape, so nothing downstream needs to know which path produced a lane:

```json
{
  "authority": "sk-doc",
  "artifactClass": "docs",
  "scope": { "type": "paths", "values": ["docs/", "README.md"] }
}
```

This is the object `scripts/scoping.cjs`'s `validateLane()` returns, and it is what `lane_config_schema.md` documents as the on-disk `--lane-config` array-item shape. There is no separate "interactive lane" type and "config lane" type. One shape, two producers.

---

## 5. INTERACTIVE PATH (CONVERSATIONAL, NOT A TERMINAL PROMPT)

`deep-alignment` is invoked exclusively through `/deep:alignment`'s command workflow (`SKILL.md` "FORBIDDEN INVOCATION PATTERNS"), not as a standalone script a human runs at a terminal. The interactive path is therefore the dispatched agent asking the operator the three-axis question in natural conversation, mirroring how every other state in this mode is agent-driven, not readline-driven, and then calling `scripts/scoping.cjs`'s `resolveLanesFromSelections()` once it has the operator's answers, rather than a Node.js prompt loop. `resolveLanesFromSelections()` takes exactly the shape one or more tree walks produce:

```json
[
  {
    "artifactClass": "code",
    "authorities": ["sk-code"],
    "scope": { "type": "globs", "values": ["src/**/*.ts"] }
  },
  {
    "artifactClass": "git-history",
    "authorities": ["sk-git"],
    "scope": { "type": "branchRange", "from": "main", "to": "HEAD" }
  }
]
```

One array entry per walk, `authorities` carrying the walk's multi-select. This keeps the interactive path's own "script surface" identical in spirit to `discover`/`check`: a pure function the agent calls with structured input, not a UI this codebase would have to build and maintain separately from the conversational flow the rest of the mode already uses.

---

## 6. NON-INTERACTIVE PATH (ADR-011: CONFIG-FILE ONLY)

When `--lane-config <file.json>` is supplied, the interactive question is skipped entirely. When it is absent, the interactive question is the only path. The two never run together, and neither is silently skipped when required (REQ-004): `scripts/scoping.cjs`'s CLI entrypoint enforces this by exiting non-zero with an explicit message if invoked without `--lane-config`. There is no code fallback that guesses lanes, since the fallback is the conversational path above, owned by the invoking command, not this script.

Full field-level schema: `lane_config_schema.md`. Parsing/validation implementation: `scripts/scoping.cjs`'s `parseLaneConfigFile()` / `resolveLanesFromConfig()`.

---

## 7. EDGE CASES

- **Empty scope** (a `paths`/`globs` scope that matches zero files at discover-time): the lane still resolves here in `SCOPE`. `DISCOVER`'s `discover()` call returns an empty artifact corpus and the lane is marked zero-coverage, not an error. See `discover_contract.md` §5.
- **Overlapping scopes across two lanes of different authorities**: both lanes discover independently. This phase does not dedupe across authorities. The same file can be conformance-checked against more than one standard.
- **Invalid AUTHORITY value**: fails fast, before `DISCOVER` starts, naming the unknown authority and the currently registered set (`scripts/scoping.cjs`'s `validateLane()` error message does this verbatim).
- **Interactive session abandoned mid-question**: no lanes are persisted. `SCOPE` has no partial-lane carryover. A walk that never reaches a completed `(artifactClass, authorities, scope)` triple contributes nothing to `resolveLanesFromSelections()`'s input.

---

## 8. NON-FUNCTIONAL CONSTRAINTS

- **NFR-P01**: lane resolution is a pure planning step. `scripts/scoping.cjs` does no artifact scanning of its own. It only validates and shapes the tuples `DISCOVER` will later act on.
- **NFR-S01**: every `paths`/`globs` scope value is validated against the repo root before any adapter's `discover()` sees it. `scripts/scoping.cjs` reuses `runtime/scripts/lib/cli-guards.cjs`'s `validateNamespaceValue()` for this rather than re-implementing path-traversal checks.
- **NFR-R01**: the same `--lane-config` content always resolves to the same lane set. `resolveLanesFromConfig()` has no session-state or clock dependency, so cron runs are reproducible.

---

## 9. REFERENCES AND RELATED RESOURCES

- `discover_contract.md`, what a lane's `scope` becomes once `DISCOVER` calls an adapter's `discover(scope)`.
- `lane_config_schema.md`, the on-disk `--lane-config` JSON shape, field by field.
- `scripts/scoping.cjs`, the one implementation both paths call.
- `.opencode/specs/system-deep-loop/059-deep-alignment-mode/002-architecture-decision/decision-record.md`, ADR-002 (this tree), ADR-003 (the adapter contract `scope` feeds), ADR-011 (config-file-only), ADR-012 (new-authority registration governance).
