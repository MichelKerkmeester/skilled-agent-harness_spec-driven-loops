---
name: sk-doc
description: "Documentation & OpenCode-component authoring parent hub: routes to ten workflow packets that create skills, parent hubs, READMEs/install-guides, agents, commands, feature catalogs, manual-testing playbooks, MCP benchmark folders, ASCII flowcharts, and changelogs, plus a doc-quality mode that validates/scores/optimizes existing docs. Holds no per-packet logic; dispatches by workflowMode through mode-registry.json."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 2.0.0.0
metadata:
  author: OpenCode
  family: sk-doc
---

<!-- Keywords: sk-doc, documentation, markdown, authoring, parent-hub, mode-registry, hub-router, workflowmode, packetkind, create-skill, create-readme, create-agent, create-command, create-feature-catalog, create-manual-testing-playbook, create-benchmark, create-flowchart, create-changelog, doc-quality, shared-backbone, doc-quality-pipeline -->

# Documentation Authoring Hub (sk-doc)

One advisor identity, ten workflow packets, one shared doc-quality backbone. `sk-doc` is the parent hub for documentation and OpenCode-component authoring. It holds NO per-packet logic: it routes by `workflowMode` through `mode-registry.json`, and each packet keeps its own contract in its nested folder. The cross-cutting doc-quality pipeline (validators, global standards, frontmatter/llms/template assets) lives once in `shared/` and is consumed by every packet.

---

## 1. WHEN TO USE

Use this skill for documentation and OpenCode-component authoring, and for document-quality work. The hub classifies the request, resolves a `workflowMode`, and loads the matching nested packet.

| Mode | Use it for | Packet | Command |
|------|------------|--------|---------|
| **create-skill** | Scaffold an OpenCode skill (and, via `create-skill-parent`, a parent hub with nested mode packets) | `create-skill/` | `/create:sk-skill`, `/create:sk-skill-parent` |
| **create-readme** | Author a folder README or an install guide (install-guide is a folded variant) | `create-readme/` | `/create:folder_readme` |
| **create-agent** | Scaffold an OpenCode agent (permission/authority frontmatter) | `create-agent/` | `/create:agent` |
| **create-command** | Scaffold an OpenCode slash command (argument-hint + allowed-tools + router/presentation split) | `create-command/` | — |
| **create-feature-catalog** | Author a feature-catalog inventory package | `create-feature-catalog/` | `/create:feature-catalog` |
| **create-manual-testing-playbook** | Author a manual-testing-playbook package | `create-manual-testing-playbook/` | `/create:testing-playbook` |
| **create-benchmark** | Promote a curated MCP benchmark folder into a consuming skill | `create-benchmark/` | — |
| **create-flowchart** | Generate and validate an ASCII flowchart | `create-flowchart/` | — |
| **create-changelog** | Author a global or packet-local changelog entry (version bump + topology-aware placement) | `create-changelog/` | `/create:changelog` |
| **doc-quality** | Validate / score / optimize an EXISTING document (extract → DQI → HVR → validate) | `doc-quality/` | `/doc:quality` |

### When NOT to Use
- Code implementation, tests, or debugging — use `sk-code`.
- Git worktree, branch, commit, PR, or release work — use `sk-git`.
- Spec-folder workflow / memory / save context — use `system-spec-kit`.
- Design judgment, visual direction, motion, or UI audit — use `sk-design`.
- The `shared/` backbone is consumed by the packets, not invoked as a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven**. `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. The advisor routes any documentation/authoring query to the single identity `sk-doc`; the hub then picks the packet.

### The discriminator
- **`workflowMode`** — the public packet key (e.g. `create-skill`, `doc-quality`). `create-skill-parent` is a second mode over the same `create-skill` packet.
- **`packetKind`** — `workflow` for every sk-doc packet (there is no surface axis; the doc-quality pipeline is universal doctrine in `shared/`, not orthogonal stack-evidence).
- **`backendKind`** — `template-scaffold` for the create-* generators, `doc-quality` for the doc-quality mode.

### Routing rule
```
classify the request to a workflowMode (dominant authoring/quality intent; a command like /create:agent resolves directly)
read mode-registry.json
  -> resolve workflowMode
  -> load the packet at registry[mode].packet (e.g. sk-doc/create-agent/SKILL.md)
```
`routerPolicy.defaultMode` is `null`: an unclear documentation intent asks for disambiguation rather than forcing a stale default. `hub-router.json` carries the router signals and vocabulary classes. Outcomes are `single`, `orderedBundle`, or `defer` — there is no `surfaceBundle` (no surface axis).

Per-packet behavior is **not flattened**: each packet keeps its own authoring contract, references, assets, scripts, and templates.

---

## 3. HOW IT WORKS

### Layout
```
sk-doc/
  SKILL.md               # this routing hub (no per-packet logic)
  mode-registry.json     # the ten-packet discriminator + advisorRouting (single source of truth)
  hub-router.json        # router signals + vocabulary classes
  description.json       # hub advisor descriptor
  graph-metadata.json    # the ONE advisor identity for the whole skill
  changelog/  manual_testing_playbook/  benchmark/
  create-skill/  create-readme/  create-agent/  create-command/
  create-feature-catalog/  create-manual-testing-playbook/
  create-benchmark/  create-flowchart/  create-changelog/  doc-quality/    # nested workflow packets
  scripts/               # facade symlinks -> shared/ + owning packets (tool paths only)
  shared/                # doc-quality backbone: validators, global standards, shared assets
```

Each packet is self-contained (its own `SKILL.md`, `README.md`, `changelog/`, and moved `references/`/`assets/`/`scripts/`) and carries **no** `graph-metadata.json`, so the advisor discovers exactly one `sk-doc` identity.

### Shared backbone
`shared/` holds the universal doc-quality pipeline consumed by every packet: generic validator scripts (`shared/scripts/`), cross-cutting standards and vocabulary (`shared/references/global/`), and shared templates (`shared/assets/`). The `sk-doc/scripts/` root directory keeps facade symlinks pointing inward to `shared/` and the owning packets so tool paths resolve. There are no hub-root `assets/` or `references/` aggregation directories: consumers reference each packet's own `assets/`/`references/` or the `shared/` backbone directly.

---

## 4. RULES

### ALWAYS
- **ALWAYS** resolve a packet through `mode-registry.json`; never hardcode a router mapping in the hub.
- **ALWAYS** keep authoring contracts in the packets; the hub stays routing-only.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one identity.
- **ALWAYS** keep the doc-quality pipeline as one shared source under `shared/`, consumed by the packets.
- **ALWAYS** keep changelogs as real files at the hub and in each packet — never symlinked.

### NEVER
- **NEVER** add a `graph-metadata.json` inside a packet or `shared/`.
- **NEVER** put per-packet authoring logic in the hub.
- **NEVER** add a surface axis or a `surfaceBundle` outcome — sk-doc is workflow-only.

### ESCALATE IF
- A new documentation workflow is needed — extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- A packet would become a near-empty shell (generic doctrine, no type-specific behavior) — fold it into `shared/` instead.

---

## 5. REFERENCES

- Registry: `mode-registry.json` (ten packets; `packetKind: workflow`).
- Hub router: `hub-router.json` (signals + vocabulary classes).
- Advisor descriptor: `description.json`; skill-graph identity: `graph-metadata.json`.
- Packets: `create-skill/`, `create-readme/`, `create-agent/`, `create-command/`, `create-feature-catalog/`, `create-manual-testing-playbook/`, `create-benchmark/`, `create-flowchart/`, `doc-quality/`.
- Shared backbone: `shared/scripts/`, `shared/references/global/`, `shared/assets/`.
- Parent-skill pattern: `create-skill/references/skill_creation/parent_skills_nested_packets.md`.
