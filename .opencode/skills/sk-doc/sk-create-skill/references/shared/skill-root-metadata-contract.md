---
title: Skill Root Metadata Contract
description: Which root-level metadata JSON files a skill root must, may, and must not carry - the two-class contract, the discriminator that decides a root's class, and the fleet gate that enforces it.
trigger_phrases:
  - "which json files does a skill need"
  - "skill root metadata contract"
  - "leaf-manifest config aliases required"
  - "hub versus standalone skill class"
  - "skill metadata drift gate"
importance_tier: normal
contextType: implementation
version: 1.1.1.0
---

# Skill Root Metadata Contract

Which root-level metadata JSON files a skill root must, may, and must not carry, and why the answer depends on exactly one declaration the author writes by hand.

---

## 1. OVERVIEW

A skill root carries up to eight metadata JSON files. Which of them apply is not a per-skill preference: it follows from the root's **class**, and the class follows from one authored declaration.

**Core Principle**: Classify first, then check. A root's class is decided by an authored declaration, never by a generated artifact.

**When to Use**:
- Creating a new skill or parent hub and deciding which metadata files to write
- Auditing an existing root, or diagnosing a `ci-skill-root-metadata` failure
- Deciding whether a metadata file may be generated or must be authored

> **Not the spec-folder schema.** `description.json` and `graph-metadata.json` also exist under `.opencode/specs/` under a completely separate continuity schema. The two are never the same file and never interchangeable. This contract governs `.opencode/skills/<root>/` only, and the gate never scans the spec tree.

---

## 2. THE TWO CLASSES

| Class | What it is | Discriminator |
| --- | --- | --- |
| **H** — packet hub | Routes prompts across several mode packets and projects one advisor identity | Declares **both** `mode-registry.json` and `hub-router.json` |
| **S** — standalone routed-resource skill | One workflow mode; its `references/`, `assets/`, `feature-catalog/`, and `manual-testing-playbook/` docs are the routed corpus | Declares **neither** |

The registry and the router are the discriminator because they are consumed as one coupled declaration — the router's signal keys must name registry modes. A root carrying exactly one of them is therefore not a third class; it is a half-written declaration, and the gate rejects it rather than guessing.

Classification deliberately ignores every other file, including generated output. If a generated manifest could change a root's class, then a root whose manifest was never written would classify differently after regeneration, and the gate could never report that manifest as missing.

### Current fleet

| Class | Roots |
| --- | --- |
| **H** (7) | `cli-external-orchestration`, `mcp-tooling`, `sk-code`, `sk-design`, `sk-doc`, `sk-prompt`, `system-deep-loop` |
| **S** (4) | `mcp-code-mode`, `sk-git`, `system-skill-advisor`, `system-spec-kit` |

---

## 3. THE FILE MATRIX

`SKILL.md` is required for every root — it is the marker that makes a directory a skill root at all, and the gate discovers roots by it.

| File | H | S | Producer |
| --- | :---: | :---: | --- |
| `graph-metadata.json` | required | required | authored |
| `description.json` | required | **forbidden** | authored |
| `mode-registry.json` | required | **forbidden** | authored |
| `hub-router.json` | required | **forbidden** | authored |
| `leaf-manifest.config.json` | **forbidden** | required | authored |
| `leaf-manifest.json` | required | required | **generated** |
| `leaf-aliases.json` | optional, authored | required, **generated** | see §4 |
| `command-metadata.json` | required | **forbidden** | authored |

Forbidden is not stylistic. Each forbidden file would create a second source of truth for something the class already declares elsewhere: a hub carrying a standalone manifest config would hand the generator two competing inputs, and a standalone carrying registry, router, or description would claim a hub identity its packet layout cannot back.

### Why `description.json` is H-only

No production consumer reads a skill-root `description.json`. The advisor ingests `graph-metadata.json` — that is what supplies identity, domains, intent signals, and typed edges to the skill graph. `description.json` exists for the hub doctor checks, which are hub-scoped. Adding one to a standalone root would produce prose nothing consults, so the contract forbids it rather than leaving it as a harmless option.

### Why `command-metadata.json` is hub-required

Every hub declares its slash-command surface as checkable data: one entry per command it owns, or an empty array (`[]`) when it owns none. The fleet gate is the root-enumerating consumer — it validates each entry's core schema (`command`, `ownerMode`, `description`, `argumentHint`, `userIntent`, `choreography`) against the hub's own registry and the disk: owner modes must exist in `mode-registry.json`, choreography resources must resolve, the command's definition file must exist under `.opencode/commands/`, and owned routing signals must be unique across the file. Entries may carry hub-specific extension fields beyond the core (the design hub's register policies and task projections, for example); unknown fields are legal so richer per-hub validators can layer on top. The file started as an sk-design-only overlay and graduated to a class requirement once this consumer existed — the rule that an extension never ships without a reader still holds. The core schema lives in `scripts/lib/command-metadata-schema.cjs`.

The file is forbidden on standalone roots: every entry binds a command to an `ownerMode` in a mode registry, and a standalone root has none.

---

## 4. GENERATED VERSUS AUTHORED

Only files with no authored meaning may be written unattended.

| File | Generated for | Why |
| --- | --- | --- |
| `leaf-manifest.json` | H and S | A deterministic, canonically-sorted function of the declared packets and the on-disk corpus |
| `leaf-aliases.json` | **S only** | See below |

`leaf-aliases.json` splits on class, and the split reflects what the two shapes actually are.

A **hub's** alias rows carry real compatibility triples — they relocate a mode's resource onto a disk path outside that mode's own packet, for example `assets/changelog-template.md → shared/assets/changelog-template.md`. Nothing in the corpus implies those rows, so they must be authored and a generator must never overwrite them.

A **standalone** root has exactly one workflow mode, so the same triple degenerates to an identity projection over its own leaves: `workflowMode` is the skill id and `leafResourceId` equals `diskPath` on every row. That is a pure function of the manifest, so deriving it is strictly better than authoring it — a hand-maintained identity list silently rots the moment a leaf is added.

The remaining seven files carry authored semantic identity, routing policy, or a declaration only a human can make. `--fix` never touches them.

---

## 5. ENFORCEMENT

```bash
# Report the whole fleet
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs

# Machine-readable
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --format json

# Regenerate what is derivable; authored files are still only reported
node .opencode/skills/sk-doc/sk-create-skill/scripts/ci-skill-root-metadata.cjs --fix
```

Exit `0` when every root conforms, `1` on violations, `2` when the gate cannot run.

The gate discovers roots from `SKILL.md` — the one marker that exists before any tooling has run. This ordering is the point. The freshness scanner it fronts (`ci-leaf-manifest-freshness.cjs`) discovers work by walking *committed* manifests, so a root that never committed one is invisible to it; a scanner that begins at outputs can never report a missing output. Starting from the authored marker turns an unadopted root into a finding instead of a silence.

Beyond presence and forbidden files, the gate enforces:

- **One advisor identity per root.** A nested `graph-metadata.json` or `description.json` below the root is rejected. Identity is discriminated by content (`skill_id` / `family` / `edges`), so a same-named continuity file is correctly ignored as a neighbour rather than a rival.
- **Generated freshness.** Every class-required generated file is regenerated and byte-compared, including when the committed file is absent.
- **Command-metadata core schema (hubs).** Entries are validated against the registry and the disk; violations surface as `COMMAND_METADATA_*` codes naming the offending command.

### Violation codes

| Code | Meaning |
| --- | --- |
| `UNCLASSIFIABLE_ROOT` | Declares exactly one of registry/router |
| `MISSING_REQUIRED_FILE` | An authored class-required file is absent — write it by hand |
| `MISSING_GENERATED_FILE` | A derivable class-required file is absent — `--fix` resolves it |
| `FORBIDDEN_FILE` | Present but forbidden for this class |
| `UNDECLARED_OVERLAY` | An overlay file on a root outside its declared scope (the overlay set is currently empty; the mechanism remains for the next extension that ships before its consumer) |
| `NESTED_IDENTITY` | A second advisor identity below the root |
| `STALE_GENERATED_FILE` | Committed bytes differ from a regeneration |
| `MANIFEST_REGENERATION_FAILED` | The generator could not run, usually a missing or malformed input |
| `COMMAND_METADATA_*` | A hub's command entry fails the core schema: unknown owner mode, unresolvable choreography resource, missing command definition file, duplicate command or owned signal, malformed entry |

---

## 6. ADDING A ROOT

**A new hub (H):** author `SKILL.md`, `graph-metadata.json`, `description.json`, `mode-registry.json`, `hub-router.json`, and `command-metadata.json` (one entry per owned slash command, `[]` when the hub owns none). Run `--fix` to generate the manifest. Author `leaf-aliases.json` only if a mode genuinely resolves a resource outside its own packet.

**A new standalone skill (S):** author `SKILL.md`, `graph-metadata.json`, and `leaf-manifest.config.json` — that config is the single declaration that names the workflow mode and the leaf roots. Run `--fix` to generate the manifest and the alias projection.

A standalone root therefore needs exactly one authored metadata file beyond identity. That is the whole delta between a non-conforming root and a conforming one.

### Templates

Every authored file has a scaffold under `create-skill/assets/`; the two generated files deliberately have none — hand-editing them is what the freshness gate exists to catch.

| File | Class | Template |
| --- | --- | --- |
| `description.json` | H | [parent-skill-description-template.json](../../assets/parent-skill/parent-skill-description-template.json) |
| `graph-metadata.json` | H | [parent-skill-graph-metadata-template.json](../../assets/parent-skill/parent-skill-graph-metadata-template.json) |
| `graph-metadata.json` | S | [skill-graph-metadata-template.json](../../assets/skill/skill-graph-metadata-template.json) |
| `mode-registry.json` | H | [parent-skill-registry-template.json](../../assets/parent-skill/parent-skill-registry-template.json) |
| `hub-router.json` | H | [parent-skill-hub-router-template.json](../../assets/parent-skill/parent-skill-hub-router-template.json) |
| `command-metadata.json` | H | [parent-skill-command-metadata-template.json](../../assets/parent-skill/parent-skill-command-metadata-template.json) |
| `leaf-aliases.json` | H (authored) | [parent-skill-leaf-aliases-template.json](../../assets/parent-skill/parent-skill-leaf-aliases-template.json) |
| `leaf-manifest.config.json` | S | [skill-leaf-manifest-config-template.json](../../assets/skill/skill-leaf-manifest-config-template.json) |
| `leaf-manifest.json` | H + S | none — generated by the gate |
| `leaf-aliases.json` | S | none — derived identity projection, generated by the gate |

---

## 7. RELATED RESOURCES

- [parent-skills-nested-packets.md](../parent-skill/parent-skills-nested-packets.md) - Parent-hub doctrine: one identity, nested mode packets, the two-axis registry
- [parent-hub-router-schema.md](../parent-skill/parent-hub-router-schema.md) - Field-level schema for `mode-registry.json` and `hub-router.json`
- [validation-and-packaging.md](validation-and-packaging.md) - The validation tiers a skill passes before release
- `scripts/lib/skill-root-metadata-contract.cjs` - The pure library this document describes
- `scripts/lib/command-metadata-schema.cjs` - The core command-metadata schema validated per hub
- `scripts/ci-skill-root-metadata.cjs` - The fleet gate
