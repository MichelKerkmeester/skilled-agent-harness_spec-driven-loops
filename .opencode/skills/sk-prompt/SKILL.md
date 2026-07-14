---
name: sk-prompt
description: "Prompt engineering parent hub: routes to prompt-improve (7-framework, DEPTH-thinking, CLEAR-scored prompt enhancement) and prompt-models (read-only per-model prompt-craft profiles for small-model dispatch) through mode-registry.json; holds no packet-local logic."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: sk-prompt, prompt-engineering, mode-registry, hub-router, workflowmode, packetkind, prompt-improve, prompt-models, DEPTH, CLEAR-scoring, framework-selection, small-model-dispatch -->

# Prompt Engineering Hub (sk-prompt)

One advisor identity, two workflow packets. `sk-prompt` is the parent hub for prompt engineering: transforming requests into structured, scored prompts, and dispatching small-model prompt craft. It holds NO per-packet logic: it routes by `workflowMode` through `mode-registry.json`, and each packet keeps its own contract in its nested folder.

---

## 1. WHEN TO USE

Use this skill for prompt engineering and small-model prompt-craft lookup. The hub classifies the request and loads the matching nested packet.

| Mode | Use it for | Packet | Command |
|------|------------|--------|---------|
| **prompt-improve** | Transform a request into a structured, scored AI prompt via 7 frameworks + DEPTH thinking + CLEAR scoring | `prompt-improve/` | `/prompt-improve` |
| **prompt-models** | Look up the recommended framework/scaffold/gotchas for a specific small model (DeepSeek-v4-pro, Kimi-k2.7-code, MiniMax-M3, MiMo-V2.5-Pro, GLM-5.2) before dispatching via `cli-opencode` | `prompt-models/` | none — advisor + cross-skill reference only |

### When NOT to Use
- Code implementation, tests, or debugging — use `sk-code`.
- Documentation/skill authoring — use `sk-doc`.
- Executor mechanics (binary flags, invocation wrappers) for any CLI — use `cli-opencode`/`cli-claude-code`; `prompt-models` owns per-model prompt-craft only, never executor plumbing.

---

## 2. SMART ROUTING

Routing is **registry-driven**. `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. The advisor routes any prompt-engineering query to the single identity `sk-prompt`; the hub then picks the packet.

### The discriminator
- **`workflowMode`** — the public packet key (`prompt-improve` or `prompt-models`).
- **`packetKind`** — `workflow` for both sk-prompt packets. `prompt-models` is `workflow`, not `surface`, because its real consuming workflow (`cli-opencode`'s pre-dispatch step) lives outside this hub — the surface-packet contract requires the consumer to be a same-hub primary workflow.
- **`backendKind`** — `prompt-engine` for `prompt-improve`'s DEPTH/CLEAR pipeline, `profile-lookup` for `prompt-models`' read-only reference.

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
  return defer("router metadata missing; inspect sk-prompt/mode-registry.json and sk-prompt/hub-router.json")

read mode-registry.json and hub-router.json
classify the request to one or more workflowMode values using hub-router.json
  (dominant prompt-engineering intent; a bare small-model name leans prompt-models)

if confidence is low, intent is contradictory, or routerPolicy.defaultMode is null and no mode wins:
  load_if_available("prompt-improve/SKILL.md", seen)
  return UNKNOWN_FALLBACK with a checklist to confirm workflowMode, target prompt/model, and delivery format

for each resolved workflowMode:
  entry = the matching mode-registry.json modes[] item
  if entry is missing or entry.packetKind != "workflow":
    return defer("unknown sk-prompt workflowMode; extend mode-registry.json and create a packet first")
  if not load_if_available(f"{entry.packet}/SKILL.md", seen):
    return defer("registered packet SKILL.md is missing; repair the packet before routing")

return single or orderedBundle according to hub-router.json routerPolicy.outcomes
```
`routerPolicy.defaultMode` is `"prompt-improve"` — the higher-traffic, more general mode. `hub-router.json` carries the router signals, vocabulary classes, and default fallback resource. Outcomes are `single`, `orderedBundle`, or `defer` — there is no `surfaceBundle` (no surface axis).

Per-packet behavior is **not flattened**: each packet keeps its own authoring contract, references, assets, and validation.

---

## 3. HOW IT WORKS

### Layout
```
sk-prompt/
  SKILL.md               # this routing hub (no per-packet logic)
  mode-registry.json     # 2 workflow modes, zero extensions
  hub-router.json        # base 3 outcomes, defaultMode: prompt-improve
  description.json       # hub advisor descriptor
  graph-metadata.json    # the ONE advisor identity for the whole skill
  changelog/  manual_testing_playbook/  benchmark/
  prompt-improve/         # workflow packet — 7-framework/DEPTH/CLEAR prompt engine
  prompt-models/          # workflow packet — read-only small-model prompt-craft profiles
```

Each packet is self-contained (its own `SKILL.md`, `README.md`, `changelog/`, and its `references/`/`assets/`) and carries **no** `graph-metadata.json`, so the advisor discovers exactly one `sk-prompt` identity.

### Zero extensions
This hub declares no named extensions (no `surface-axis`, `runtime-loop`, `advisor-projection`, `transform-verbs`, `transport-axis`) — the pure two-tier core, mirroring `sk-doc`'s own shape. `prompt-models` keeps a read-only `toolSurface` (Read/Grep/Glob only, `mutatesWorkspace: false`) as a plain `workflow` mode, not via a surface-axis declaration.

---

## 4. RULES

### ✅ ALWAYS
- **ALWAYS** resolve a packet through `mode-registry.json`; never hardcode a router mapping in the hub.
- **ALWAYS** keep authoring contracts in the packets; the hub stays routing-only.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one identity.
- **ALWAYS** keep changelogs as real files at the hub and in each packet — never symlinked.

### ⛔ NEVER
- **NEVER** add a `graph-metadata.json` inside `prompt-improve/` or `prompt-models/`.
- **NEVER** put per-packet authoring logic in the hub.
- **NEVER** duplicate executor mechanics (binary flags, invocation wrappers, budgets) inside `prompt-models/` — those stay in `cli-opencode`.

### ⚠️ ESCALATE IF
- A new prompt-engineering workflow is needed — extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- `prompt-models`' routing accuracy regresses under `routingClass: "metadata"` — see the phase 124/007 Lane-C benchmark before adding a lexical carve-out.

---

## 5. REFERENCES

- Registry: `mode-registry.json` (2 packets; `packetKind: workflow`).
- Hub router: `hub-router.json` (signals + vocabulary classes).
- Advisor descriptor: `description.json`; skill-graph identity: `graph-metadata.json`.
- Packets: `prompt-improve/`, `prompt-models/`.
- Parent-skill pattern: `sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md`.
