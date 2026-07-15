---
name: sk-doc
description: "Documentation & OpenCode-component authoring parent hub: routes to eleven workflow packets that create skills, parent hubs, READMEs/install-guides, agents, commands, feature catalogs, manual-testing playbooks, MCP benchmark folders, ASCII flowcharts, changelogs, and local before/after document reviews, plus a create-quality-control mode that validates/scores/optimizes existing docs. Holds no per-packet logic; dispatches by workflowMode through mode-registry.json."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 2.0.0.0
metadata:
  author: OpenCode
  family: sk-util
---

<!-- Keywords: sk-doc, documentation, markdown, authoring, parent-hub, mode-registry, hub-router, workflowmode, packetkind, create-skill, create-readme, create-agent, create-command, create-feature-catalog, create-manual-testing-playbook, create-benchmark, conformance benchmark, conformance_benchmark, peer adapter benchmark, deep-alignment benchmark, lane-config benchmark, sk-doc-command, create-flowchart, create-changelog, create-diff, create-quality-control, shared-backbone, create-quality-control-pipeline -->

# Documentation Authoring Hub (sk-doc)

One advisor identity, eleven workflow packets, one shared create-quality-control backbone. `sk-doc` is the parent hub for documentation and OpenCode-component authoring. It holds NO per-packet logic: it routes by `workflowMode` through `mode-registry.json`, and each packet keeps its own contract in its nested folder. The cross-cutting create-quality-control pipeline (validators, global standards, frontmatter/llms/template assets) lives once in `shared/` and is consumed by every packet.

---

## 1. WHEN TO USE

Use this skill for documentation and OpenCode-component authoring, and for document-quality work. The hub classifies the request, resolves a `workflowMode`, and loads the matching nested packet.

| Mode | Use it for | Packet | Command |
|------|------------|--------|---------|
| **create-skill** | Scaffold an OpenCode skill (and, via `create-skill-parent`, a parent hub with nested mode packets) | `create-skill/` | `/create:skill`, `/create:skill-parent` |
| **create-readme** | Author a folder README or an install guide (install-guide is a folded variant) | `create-readme/` | `/create:readme` |
| **create-agent** | Scaffold an OpenCode agent (permission/authority frontmatter) | `create-agent/` | `/create:agent` |
| **create-command** | Scaffold an OpenCode slash command (argument-hint + allowed-tools + router/presentation split) | `create-command/` | `/create:command` |
| **create-feature-catalog** | Author a feature-catalog inventory package | `create-feature-catalog/` | `/create:feature-catalog` |
| **create-manual-testing-playbook** | Author a manual-testing-playbook package | `create-manual-testing-playbook/` | `/create:manual-testing-playbook` |
| **create-benchmark** | Author MCP-promotion, behavior, conformance, skill-benchmark, and model-benchmark packages or inputs | `create-benchmark/` | `/create:benchmark` |
| **create-flowchart** | Generate and validate an ASCII flowchart | `create-flowchart/` | `/create:flowchart` |
| **create-changelog** | Author a global or packet-local changelog entry (version bump + topology-aware placement) | `create-changelog/` | `/create:changelog` |
| **create-diff** | Produce a local, Git-free before/after review of an AI-edited document (preview; engine pending packet 136) | `create-diff/` | — (preview) |
| **create-quality-control** | Validate / score / optimize an EXISTING document (extract → DQI → HVR → validate) | `create-quality-control/` | `/doc:quality` |

### When NOT to Use
- Code implementation, tests, or debugging — use `sk-code`.
- Git worktree, branch, commit, PR, or release work — use `sk-git`.
- Spec-folder workflow / memory / save context — use `system-spec-kit`.
- Design judgment, visual direction, motion, or UI audit — use `sk-design`.
- The `shared/` backbone is consumed by the packets, not invoked as a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven at runtime and packet-authored at source**. Each nested packet's single `Keyword triggers:` line is the source of truth for its routing vocabulary; `mode-registry.json` and `hub-router.json` are synchronized projections that the hub reads without re-deriving mappings during a request. The advisor routes any documentation/authoring query to the single identity `sk-doc`; the hub then picks the packet.

### The discriminator
- **`workflowMode`** — the public packet key (e.g. `create-skill`, `create-quality-control`). `create-skill-parent` is a second mode over the same `create-skill` packet.
- **`packetKind`** — `workflow` for every sk-doc packet (there is no surface axis; the create-quality-control pipeline is universal doctrine in `shared/`, not orthogonal stack-evidence).
- **`backendKind`** — `template-scaffold` for the create-* generators, `create-quality-control` for the create-quality-control mode.

### Routing rule
```
SKILL_ROOT = path containing this SKILL.md
REGISTRY = SKILL_ROOT / "mode-registry.json"
HUB_ROUTER = SKILL_ROOT / "hub-router.json"

def _guard_in_skill(relative_path):
  resolved = (SKILL_ROOT / relative_path).resolve()
  resolved.relative_to(SKILL_ROOT)
  if resolved.suffix.lower() not in {".md", ".json"}:
    raise ValueError("only skill-local markdown/json router resources are routable")
  return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path, seen):
  guarded = _guard_in_skill(relative_path)
  if guarded not in seen and (SKILL_ROOT / guarded).exists():
    load(guarded)
    seen.add(guarded)
    return True
  return False

seen = set()
if not REGISTRY.exists() or not HUB_ROUTER.exists():
  return defer("router metadata missing; inspect sk-doc/mode-registry.json and sk-doc/hub-router.json")

read mode-registry.json and hub-router.json
classify the request to one or more workflowMode values using hub-router.json
  (dominant authoring/quality intent; a command like /create:agent resolves directly)

if confidence is low, intent is contradictory, or routerPolicy.defaultMode is null and no mode wins:
  load_if_available("shared/references/quick_reference.md", seen)
  return UNKNOWN_FALLBACK with a checklist to confirm workflowMode, target document/component, inputs, and validation expectations

for each resolved workflowMode:
  entry = the matching mode-registry.json modes[] item
  if entry is missing or entry.packetKind != "workflow":
    return defer("unknown sk-doc workflowMode; extend mode-registry.json and create a packet first")
  if not load_if_available(f"{entry.packet}/SKILL.md", seen):
    return defer("registered packet SKILL.md is missing; repair the packet before routing")

return single or orderedBundle according to hub-router.json routerPolicy.outcomes
```
`routerPolicy.defaultMode` is `null`: an unclear documentation intent asks for disambiguation rather than forcing a stale default. `hub-router.json` carries the router signals, vocabulary classes, default fallback resource, and bundle rules. Outcomes are `single`, `orderedBundle`, or `defer` — there is no `surfaceBundle` (no surface axis).

Per-packet behavior is **not flattened**: each packet keeps its own authoring contract, references, assets, scripts, and templates.

This hub does **not** use keyed resource discovery (`references/<key>/` or `assets/<key>/`) at the hub root: there are no hub-root `references/` or `assets/` directories, and packet resources stay inside their owning packet or the shared backbone. If a future workflow needs keyed resource subdirectories, add that behavior inside the owning packet using guarded runtime discovery; do not hardcode resource inventories in this hub.

---

## 3. HOW IT WORKS

### Layout
```
sk-doc/
  SKILL.md               # this routing hub (no per-packet logic)
  mode-registry.json     # the eleven-packet discriminator + advisorRouting (single source of truth)
  hub-router.json        # router signals + vocabulary classes
  description.json       # hub advisor descriptor
  graph-metadata.json    # the ONE advisor identity for the whole skill
  changelog/  manual_testing_playbook/  benchmark/
  create-skill/  create-readme/  create-agent/  create-command/
  create-feature-catalog/  create-manual-testing-playbook/
  create-benchmark/  create-flowchart/  create-changelog/  create-diff/  create-quality-control/    # nested workflow packets
  scripts/               # facade symlinks -> shared/ + owning packets (tool paths only)
  shared/                # create-quality-control backbone: validators, global standards, shared assets
```

Each packet is self-contained (its own `SKILL.md`, `README.md`, `changelog/`, and moved `references/`/`assets/`/`scripts/`) and carries **no** `graph-metadata.json`, so the advisor discovers exactly one `sk-doc` identity.

### Shared backbone
`shared/` holds the universal create-quality-control pipeline consumed by every packet: generic validator scripts (`shared/scripts/`), cross-cutting standards and vocabulary (`shared/references/`), and shared templates (`shared/assets/`). The `sk-doc/scripts/` root directory keeps facade symlinks pointing inward to `shared/` and the owning packets so tool paths resolve. There are no hub-root `assets/` or `references/` aggregation directories: consumers reference each packet's own `assets/`/`references/` or the `shared/` backbone directly.

---

## 4. RULES

### ✅ ALWAYS
- **ALWAYS** resolve a packet through `mode-registry.json`; never hardcode a router mapping in the hub.
- **ALWAYS** keep authoring contracts in the packets; the hub stays routing-only.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one identity.
- **ALWAYS** keep the create-quality-control pipeline as one shared source under `shared/`, consumed by the packets.
- **ALWAYS** keep changelogs as real files at the hub and in each packet — never symlinked.

### ⛔ NEVER
- **NEVER** add a `graph-metadata.json` inside a packet or `shared/`.
- **NEVER** put per-packet authoring logic in the hub.
- **NEVER** add a surface axis or a `surfaceBundle` outcome — sk-doc is workflow-only.

### ⚠️ ESCALATE IF
- A new documentation workflow is needed — extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- A packet would become a near-empty shell (generic doctrine, no type-specific behavior) — fold it into `shared/` instead.

---

## 5. REFERENCES

- Registry: `mode-registry.json` (eleven packets; `packetKind: workflow`).
- Hub router: `hub-router.json` (signals + vocabulary classes).
- Advisor descriptor: `description.json`; skill-graph identity: `graph-metadata.json`.
- Packets: `create-skill/`, `create-readme/`, `create-agent/`, `create-command/`, `create-feature-catalog/`, `create-manual-testing-playbook/`, `create-benchmark/`, `create-flowchart/`, `create-changelog/`, `create-diff/`, `create-quality-control/`.
- Shared backbone: `shared/scripts/`, `shared/references/`, `shared/assets/`.
- Parent-skill pattern: `create-skill/references/parent_skill/parent_skills_nested_packets.md`.
