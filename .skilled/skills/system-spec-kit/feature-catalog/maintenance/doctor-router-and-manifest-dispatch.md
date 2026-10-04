---
title: "Doctor router and manifest-driven dispatch"
description: "Four doctor routers split by owner that dispatch to nine per-subsystem YAML workflows via the canonical _routes.yaml manifest."
trigger_phrases:
  - "doctor router and manifest-driven dispatch"
  - "_routes.yaml"
  - "dispatch doctor manifest"
  - "argv-positional subsystem route"
  - "how do I add a new doctor route"
version: 1.6.0.12
---

# Doctor router and manifest-driven dispatch

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Four routers share the per-subsystem maintenance diagnostics in the spec-kit ecosystem, and each owns the routes of one subsystem. They dispatch to nine subsystem YAML workflows by reading the canonical route manifest `.skilled/commands/doctor/_routes.yaml`, where every route names its owning command:

- `/doctor:speckit` takes no target and runs the spec-kit retrieval diagnostic. Its old `speckit-retrieval` target still works as an optional positional.
- `/doctor:skill-advisor <target>` owns six targets: `tune`, `rebuild`, `skill-graph-freshness`, `router-reach`, `skill-budget` and `parent-skill`.
- `/doctor:deep-loop` takes no target, only `--scope`.
- `/doctor:runtime-mirrors` takes no arguments.

Three standalone companions round out the surface: `/doctor:update` for release updates and release migration, `/doctor:mcp install|debug` for MCP infrastructure repair and `/doctor:env` for environment diagnostics.

Each subsystem keeps its own YAML workflow under `assets/doctor-<target>.yaml`. The split moved routes between routers and left the workflows unchanged, except that the advisor tuning workflow is now `doctor-skill-advisor-tune.yaml`.

---

## 2. HOW IT WORKS

### Trigger / Auto-Fire Path

Manual slash command. `/doctor:skill-advisor` with no target shows an interactive target menu. `list` or `?` on `/doctor:speckit` or `/doctor:skill-advisor` prints its route manifest table and exits. A bare `/doctor:speckit`, `/doctor:deep-loop` or `/doctor:runtime-mirrors` binds that router's single route.

### Class

Manual. The router is operator-driven; no automation triggers it. `/doctor:update` (release updates) and `/doctor:mcp` (MCP infra repair) are also operator-driven companions.

### Routing Contract

`/doctor:skill-advisor` parses the FIRST positional argument as the target name, then runs a per-target flag parser using only that target's `allowed_flags` from the manifest. Cross-target flag injection (e.g. a target-specific flag passed to another target) raises a clear error pointing at the correct command. A router that owns one route takes no positional target, and `/doctor:speckit` answers a target another router now owns with a moved-target notice. The `--target=<name>` flag is preserved as a compatibility alias; argv-positional is the documented primary form. The route manifest is the single source of truth for target metadata: YAML asset, setup variables, allowed flags, mutation class, MCP tools, and Skill Advisor trigger phrases.

### CI Assertion

`route-validate.sh` (`route-validate.py` is the python core) asserts: manifest schema version, a non-empty route list, required keys per route, an owning command that names an existing doctor router, no duplicate target names, each `yaml` field references an existing asset, each route's `mcp_tools` is a subset of its router's frontmatter `allowed-tools` union, every route has at least one trigger phrase, and target parity between each router and its presentation. A `--self-test` mode runs three corrupted-fixture probes and confirms each fails. The script's only dependency is Python with PyYAML (no external `yq` required).

### Mutation Boundaries

The routers themselves never mutate anything. Each YAML workflow declares its own mutation class in `_routes.yaml`: read-only (skill-budget, parent-skill, skill-graph-freshness, router-reach, runtime-mirrors), add-only (speckit-retrieval, deep-loop), or mutates (tune, rebuild). See `mutating:` per target in the manifest. Each route's `gate3_location` names its specific mutation location.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `.skilled/commands/doctor/speckit.md` | Router for the spec-kit retrieval diagnostic, no target |
| `.skilled/commands/doctor/skill-advisor.md` | Router entry point for the six advisor targets: target resolution, per-target flag parser, YAML handoff |
| `.skilled/commands/doctor/deep-loop.md` | Router for the deep-loop diagnostic, `--scope` only |
| `.skilled/commands/doctor/runtime-mirrors.md` | Router for the mirror-parity diagnostic, no arguments |
| `.skilled/commands/doctor/mcp.md` | MCP infrastructure command: `install` / `debug` sub-action dispatch |
| `.skilled/commands/doctor/_routes.yaml` | Canonical route manifest (9 routes + 2 MCP sub-routes) |
| `.skilled/commands/doctor/scripts/route-validate.sh` | CI assertion bash wrapper |
| `.skilled/commands/doctor/scripts/route-validate.py` | Python core asserting manifest consistency |
| `.skilled/commands/doctor/assets/doctor-*.yaml` | Per-target and per-subsystem YAML workflows, one per route |

### Cross-runtime mirrors

| Path | Role |
|------|------|
| `.claude/commands/doctor/{speckit,skill-advisor,deep-loop,runtime-mirrors,mcp}.md` | Per-file symlinks into `.skilled/commands/doctor/` |
| `.skilled/prompts` | Symlink to `.skilled/commands` |

### Specification

| File | Role |
|------|------|
| Internal design notes | Phase parent (lean trio) |
| Router phase docs | Additive router design |
| Cutover phase docs | Hard cutover design |

---

## 4. KEY BEHAVIORS

1. **Target-first parsing** — the positional target is parsed BEFORE any `--flag`. Global flag pre-parse is forbidden; each target's flag schema is disjoint and per-target parsing is the only safe order.
2. **Interactive fallback**: invoking `/doctor:skill-advisor` with no target presents its target menu.
3. **Moved targets**: the old `/doctor:speckit <target>` forms for deep-loop, the advisor targets and runtime-mirrors now live on their owning router. `/doctor:speckit` names the new command for a moved target and stops. No shim aliases. Skill Advisor lexical routing absorbs the historical trigger phrases.
4. **YAML workflows untouched**: the split moved routes between routers. Per-target workflow YAMLs in `assets/` remain stable and self-sufficient.

---

## 5. RELATED CATALOG ENTRIES


---

## 6. INVARIANTS

- `_routes.yaml` is the single source of truth for routing metadata.
- Each router's frontmatter `allowed-tools` is the UNION of its per-target tool sets (unavoidable, because the OpenCode runner does not support lazy authorization per-route).
- `/doctor:update`, `/doctor:mcp` and `/doctor:env` dispatch through their own commands, outside the routed manifest.
- `route-validate.sh` exits 0 on a clean manifest and non-zero on any structural violation.

