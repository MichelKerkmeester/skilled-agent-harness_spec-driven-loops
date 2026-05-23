---
title: "Doctor router and manifest-driven dispatch"
description: "Argv-positional /doctor router that dispatches to per-subsystem YAML workflows via a canonical _routes.yaml manifest. Shipped in 013 phases 004 + 005 to consolidate 10 /doctor:* commands into 3 markdown files."
---

# Doctor router and manifest-driven dispatch

## 1. OVERVIEW

`/doctor <target>` is the single entry point for per-subsystem maintenance diagnostics in the spec-kit ecosystem. It dispatches to one of seven subsystem YAML workflows (memory, causal-graph, code-graph, deep-loop, cocoindex, skill-advisor, skill-budget) by reading the canonical route manifest `.opencode/commands/doctor/_routes.yaml`. Two companion commands round out the surface: `/doctor:mcp <install|debug>` for MCP-server infrastructure repair, and `/doctor:update` for the cross-subsystem rebuild orchestrator.

The router shipped as a hard cutover in `010-doctor-update-orchestrator` phases 004 + 005, replacing 10 standalone `/doctor:<name>` commands with 3 markdown files (`doctor.md`, `doctor/mcp.md`, `doctor/update.md`). Each subsystem keeps its existing YAML workflow under `assets/doctor_<target>.yaml` — only the markdown command surface was consolidated.

---

## 2. CURRENT REALITY

### Trigger / Auto-Fire Path

Manual slash command. `/doctor` with no arguments shows an interactive subsystem menu; `/doctor list` (or `/doctor ?`) prints the SUBSYSTEM MANIFEST table and exits.

### Class

Manual. The router is operator-driven; no automation triggers it. `/doctor:update` (the orchestrator) and `/doctor:mcp` (MCP infra repair) are also operator-driven companions.

### Routing Contract

The router parses the FIRST positional argument as the target name, then runs a per-target flag parser using only that target's `allowed_flags` from the manifest. Cross-target flag injection (e.g. `--confidence-threshold` outside of `causal-graph`) raises a clear error pointing at the correct command. The `--target=<name>` flag is preserved as a compatibility alias; argv-positional is the documented primary form. The route manifest is the single source of truth for target metadata: YAML asset, setup variables, allowed flags, mutation class, MCP tools, and Skill Advisor trigger phrases.

### CI Assertion

`route-validate.sh` (`route-validate.py` is the python core) asserts: manifest schema version, exactly 7 routes, required keys per route, no duplicate target names, each `yaml` field references an existing asset, each route's `mcp_tools` is a subset of the router's frontmatter `allowed-tools` union, every route has at least one trigger phrase. A `--self-test` mode runs three corrupted-fixture probes and confirms each fails. The script's only dependency is Python with PyYAML (no external `yq` required).

### Mutation Boundaries

The router itself never mutates anything. Each YAML workflow declares its own mutation class in `_routes.yaml`: read-only (skill-budget), add-only (causal-graph), or mutates (memory, code-graph, deep-loop, cocoindex, skill-advisor). The combined GATE 3 STATUS table in `doctor.md` cites each target's specific mutation location.

---

## 3. SOURCE FILES

### Implementation

| File | Role |
|------|------|
| `.opencode/commands/doctor/speckit.md` | Router entry point: target resolution, per-target flag parser, YAML handoff |
| `.opencode/commands/doctor/mcp.md` | MCP infrastructure command: `install` / `debug` sub-action dispatch |
| `.opencode/commands/doctor/update.md` | Multi-subsystem orchestrator (unchanged from 013) |
| `.opencode/commands/doctor/_routes.yaml` | Canonical route manifest (7 routes + 2 MCP sub-routes) |
| `.opencode/commands/doctor/scripts/route-validate.sh` | CI assertion bash wrapper |
| `.opencode/commands/doctor/scripts/route-validate.py` | Python core asserting manifest consistency |
| `.opencode/commands/doctor/assets/doctor_*.yaml` | 10 per-target / per-subsystem YAML workflows (unchanged) |

### Cross-runtime mirrors

| Path | Role |
|------|------|
| `.claude/commands/doctor/speckit.md` + `.claude/commands/doctor/{mcp,update}.md` | Auto-synced from `.opencode` (APFS clone) |
| `.gemini/commands/doctor/speckit.toml` + `.gemini/commands/doctor/{mcp,update}.toml` | Manual TOML mirrors (regenerated from .opencode markdown via converter) |
| `.codex/prompts` | Symlink to `.opencode/commands` |

### Specification

| File | Role |
|------|------|
| Internal design notes | Phase parent (lean trio) |
| Router phase docs | Additive router design |
| Cutover phase docs | Hard cutover design |

---

## 4. KEY BEHAVIORS

1. **Target-first parsing** — the positional target is parsed BEFORE any `--flag`. Global flag pre-parse is forbidden; each target's flag schema is disjoint and per-target parsing is the only safe order.
2. **Interactive fallback** — invoking `/doctor` with no positional target presents the SUBSYSTEM MANIFEST menu.
3. **Hard cutover end state** — the 9 legacy `/doctor:<name>` markdown files were deleted in 013 Phase 5 (commit `1b8d4d691`). No shim aliases. Skill Advisor lexical routing absorbs the historical trigger phrases.
4. **YAML workflows untouched** — the consolidation collapsed only the markdown surface; per-target workflow YAMLs in `assets/` remain stable and self-sufficient.

---

## 5. RELATED CATALOG ENTRIES

- `08--doctor-code-graph/` (under `.opencode/skills/system-code-graph/feature_catalog/`) — original per-command catalog rows for the code-graph apply mode policy. The `/doctor code-graph` invocation form is now driven by this router.

---

## 6. INVARIANTS

- `_routes.yaml` is the single source of truth for routing metadata.
- The router's frontmatter `allowed-tools` is the UNION of all per-target tool sets (unavoidable; the OpenCode runner does not support lazy authorization per-route).
- `/doctor:update` and `/doctor:mcp` are intentional colon-form survivors of the consolidation.
- `route-validate.sh` exits 0 on a clean manifest and non-zero on any structural violation.
