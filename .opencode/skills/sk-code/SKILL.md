---
name: sk-code
description: "Unified two-axis code skill: routes to two WORKFLOW modes (quality, code-review) and bundles two read-only SURFACE evidence packets (code-webflow, code-opencode) — each surface carrying the implement/debug/verify workflow doctrine plus its stack knowledge — over shared surface-detection; holds no per-mode logic; dispatches by workflowMode through mode-registry.json."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 4.1.0.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: sk-code, code, surface-aware, two-axis, webflow, opencode, animation, motion.dev, frontend, browser, typescript, python, shell, json, jsonc, code-quality, code-review, quality, review, verification, debug, implement, workflow-doctrine, mode-registry, workflowmode, packetkind, backendkind, surface-router, evidence-base, surface-packet -->

# Code Family Hub (sk-code)

One skill, two axes, one shared surface-detection router, and one advisor identity. The **workflow axis** is two code modes that act (quality, code-review); the **surface axis** is two read-only evidence packets the hub bundles alongside a workflow mode (code-webflow, code-opencode). Each surface carries the shared **implement → debug → verify** workflow doctrine (`shared/references/workflow_*.md`, symlinked in) plus its own stack knowledge; code-webflow also carries the folded-in Motion.dev animation overlay. This hub holds NO per-mode logic: it routes by `workflowMode` through `mode-registry.json`, and each mode or surface keeps its own contract in its packet.

---

## 1. WHEN TO USE

Use this skill for code-family workflows. Invoke it as `sk-code` with an optional mode hint such as `quality: <request>`; the hub classifies the request, resolves a mode key, and loads the matching nested packet.

**Workflow axis** (modes that act — one is chosen as primary):

| Mode | Use it for | Packet |
|------|------------|--------|
| **quality** | Quality gate; P0/P1/P2 author checks; comment hygiene; surface checklists. | `sk-code/code-quality/` |
| **code-review** | Findings-first review; security/correctness baseline; checklists; output contract; PR-state gates. | `sk-code/code-review/` |

**Surface axis** (read-only evidence the hub bundles alongside the primary mode — never a primary, advisor-invisible):

| Surface | Carries | Packet |
|---------|---------|--------|
| **code-webflow** | Frontend evidence: CSS/HTML/JS standards, implementation and performance patterns, CDN deployment, browser debug/verify — plus the Motion.dev animation overlay. Bundles the implement → debug → verify workflow doctrine (read-only evidence) for the Webflow surface; the acting agent applies it. | `sk-code/code-webflow/` |
| **code-opencode** | System-code evidence: TypeScript/Python/shell/config standards, hooks, alignment verification, authoring checklists. Bundles the implement → debug → verify workflow doctrine (read-only evidence) for the OpenCode surface; the acting agent applies it. | `sk-code/code-opencode/` |

The **implement → debug → verify** phases are not standalone modes. Their surface-agnostic doctrine lives once in `shared/references/workflow-implement.md`, `workflow-debug.md`, and `workflow-verify.md`, and is symlinked into each surface so the active surface carries the full workflow. A request to implement, debug, or verify code detects its surface and loads that surface's bundled doctrine; the acting agent applies it.

### When NOT to Use
- Documentation-only changes with no code-work contract - use `sk-doc`.
- Git workflow, branch, commit, PR, merge, or release work - use `sk-git`.
- Pure browser inspection or external MCP transport work - use the relevant MCP skill.
- Design judgment, visual direction, motion taste, or UI audit - use `sk-design` first.
- Backend support primitives in `shared/` - they are consumed by the modes, not invoked as a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven**. `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. The advisor routes any code query to the single identity `sk-code`; the hub then picks the mode. This hub is a simple intent-to-packet router, not a root `references/<key>/` resource router: root `references/` and `assets/` directories are intentionally absent here, and resource slicing lives inside the nested packets plus `shared/references/smart-routing.md`.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .opencode/bin/compiled-route.cjs --hub sk-code --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `sk-code`; set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide — the explicit kill-switch.

### The discriminator
- **`workflowMode`** - the public mode/packet key: `quality`, `code-review` (workflow) or `code-webflow`, `code-opencode` (surface).
- **`packetKind`** - the axis: `workflow` (a mode that acts) or `surface` (read-only evidence bundled alongside a mode).
- **`backendKind`** - which backend runs the packet: `surface-router` or `review-cache` for workflow modes, `evidence-base` for surface packets.

Surface packets are advisor-invisible (`routingClass: metadata`, read-only `toolSurface`): the advisor still routes the single identity `sk-code`, and the hub bundles zero-or-more surfaces as evidence via `routerPolicy.outcomes.surfaceBundle` (workflow mode ordered first, surfaces after). "review my webflow animation for jank" → `[code-review, code-webflow]`.

### Routing rule
```python
from pathlib import Path

SKILL_ROOT = Path(__file__).resolve().parent
UNKNOWN_FALLBACK_CHECKLIST = [
    "Confirm whether this is quality, code-review, Webflow, or OpenCode work",
    "Confirm the target files or runtime surface",
    "Confirm the expected action: implement, debug, verify, quality gate, or review",
    "Confirm the verification command set before completion",
]

def _guard_in_skill(relative_path: str) -> str:
    resolved = (SKILL_ROOT / relative_path).resolve()
    resolved.relative_to(SKILL_ROOT)
    if resolved.name != "SKILL.md" and resolved.suffix.lower() != ".md":
        raise ValueError(f"Only markdown skill resources are routable: {relative_path}")
    return resolved.relative_to(SKILL_ROOT).as_posix()

def load_if_available(relative_path: str, loaded: list[str], seen: set[str]) -> None:
    guarded = _guard_in_skill(relative_path)
    path = SKILL_ROOT / guarded
    if path.exists() and guarded not in seen:
        load(guarded)
        loaded.append(guarded)
        seen.add(guarded)

def route(task):
    loaded, seen = [], set()
    registry = read_json(SKILL_ROOT / "mode-registry.json")
    workflow_mode = explicit_mode_hint(task) or classify_workflow_mode(task)

    if not workflow_mode:
        load_if_available("shared/README.md", loaded, seen)
        return {
            "load_level": "UNKNOWN_FALLBACK",
            "needs_disambiguation": True,
            "disambiguation_checklist": UNKNOWN_FALLBACK_CHECKLIST,
            "resources": loaded,
        }

    entry = find_registry_entry(registry, workflowMode=workflow_mode)
    if not entry:
        load_if_available("shared/README.md", loaded, seen)
        return {"load_level": "UNKNOWN_FALLBACK", "unknown_mode": workflow_mode, "resources": loaded}

    packet_skill = f"{entry['packet']}/SKILL.md"
    load_if_available(packet_skill, loaded, seen)

    for surface_mode in surface_bundle_from_hub_router(task):
        surface_entry = find_registry_entry(registry, workflowMode=surface_mode)
        if surface_entry:
            load_if_available(f"{surface_entry['packet']}/SKILL.md", loaded, seen)

    if not loaded:
        load_if_available("shared/README.md", loaded, seen)
        return {"load_level": "UNKNOWN_FALLBACK", "notice": "matched registry but no packet SKILL.md was available", "resources": loaded}

    return {"workflowMode": workflow_mode, "backendKind": entry["backendKind"], "resources": loaded}
```

When no workflow mode dominates (a bare implement/debug/verify request), the router defers to a pure surface bundle: it detects the surface, loads that surface's evidence and workflow doctrine, and the agent acts. `routerPolicy.defaultMode` is `null` — the hub does not force a stale default; an unclear code intent asks for disambiguation.

Surface detection (`WEBFLOW`, `OPENCODE`, `MOTION_DEV`, with `OPENCODE` over `WEBFLOW` precedence) lives once in the hub's `shared/` layer and is consumed by every mode and surface. Modes own workflow contracts, not surface identity.

Per-mode behavior is **not flattened**: each packet keeps its own code-work contract, standards, evidence rules, and tool-permission guards.

---

## 3. HOW IT WORKS

### Layout
```
sk-code/
  SKILL.md               # this routing hub (no per-mode code logic)
  mode-registry.json     # the two-axis discriminator + advisorRouting (single source of truth)
  hub-router.json        # lexical routing signals + surfaceBundle policy for hub-local choice
  description.json       # hub advisor descriptor
  graph-metadata.json    # the ONE advisor identity for the whole skill
  code-quality/          # quality mode packet     (workflow)
  code-review/           # review mode packet      (workflow)
  code-webflow/          # webflow surface packet  (read-only evidence; carries the workflow doctrine + Motion.dev animation overlay)
  code-opencode/         # opencode surface packet (read-only evidence; carries the workflow doctrine)
  shared/                # shared surface-detection router, cross-mode helpers, and the implement/debug/verify workflow doctrine (references/workflow_*.md)
```

Each mode or surface packet is self-contained and carries no per-packet `graph-metadata.json`; only this hub carries one, so the advisor discovers exactly one code skill identity. The implement/debug/verify workflow doctrine is a single shared source under `shared/references/`; each surface symlinks it in rather than duplicating it.

### Backend
The `surface-router` backend is the shared surface-detection router under `shared/`. It centralizes WEBFLOW, OPENCODE, and MOTION_DEV detection and precedence, and it carries the shared implement → debug → verify workflow doctrine that each surface consumes. The `review-cache` backend supports the code-review mode's non-mutating review output cache. The `evidence-base` backend serves the surface packets: read-only domain evidence (`code-webflow/`, `code-opencode/`) the hub bundles alongside the primary mode — the packet mutates nothing and never carries process; the acting agent applies the doctrine it bundles. Shared backend material provides surface identity, the workflow doctrine, and cross-mode helpers; it must never gain per-mode workflow contracts.

---

## 4. RULES

### ✅ ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json`; never hardcode a router mapping in the hub.
- **ALWAYS** keep mode contracts in the mode packets; the hub stays routing-only.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill identity.
- **ALWAYS** give every mode an `advisorRouting` block with `routingClass: "metadata"` and the correct `packetSkillName`.
- **ALWAYS** keep the implement/debug/verify workflow doctrine as one shared source under `shared/references/`, symlinked into each surface — never fork per-surface copies.

### ⛔ NEVER
- **NEVER** add a `graph-metadata.json` inside a mode packet or `shared/`.
- **NEVER** put per-mode quality, review, or surface workflow logic in the hub.
- **NEVER** hardcode a router mapping outside `mode-registry.json`.
- **NEVER** reintroduce implement, debug, or verify as standalone mode packets; they are surface-owned doctrine.

### ⚠️ ESCALATE IF
- A new code mode is needed - extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- Surface identity and workflow ownership conflict in a way the shared router cannot classify.

---

## 5. REFERENCES

- Workflow mode packets: `code-quality/SKILL.md`, `code-review/SKILL.md`.
- Surface evidence packets: `code-webflow/SKILL.md`, `code-opencode/SKILL.md`.
- Shared workflow doctrine: `shared/references/workflow-implement.md`, `shared/references/workflow-debug.md`, `shared/references/workflow-verify.md` (symlinked into each surface).
- Registry: `mode-registry.json` (two-axis: `packetKind` discriminates workflow vs surface).
- Hub router signals + surface bundling: `hub-router.json`.
- Parent-skill pattern: `.opencode/skills/sk-doc/create-skill/references/parent-skill/parent-skills-nested-packets.md`.
- Sibling example: `.opencode/skills/sk-design/`.
