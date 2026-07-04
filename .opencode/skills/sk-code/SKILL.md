---
name: sk-code
description: "Unified code skill: routes to five modes (implement, quality, debug, verify, review) over shared surface-detection; holds no per-mode logic; dispatches by workflowMode through mode-registry.json."
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob, Task]
version: 4.0.1.0
metadata:
  author: OpenCode
  family: sk-code
---

<!-- Keywords: sk-code, code, surface-aware, webflow, opencode, motion.dev, frontend, browser, typescript, python, shell, json, jsonc, code-quality, verification, debug, review, mode-registry, workflowmode, backendkind, surface-router, implement, quality, debug, verify, review, code-implement, code-quality, code-debug, code-verify, code-review -->

# Code Family Hub (sk-code)

One skill, five code modes, one shared surface-detection router, and one advisor identity. This hub holds NO per-mode logic: it routes by `workflowMode` through `mode-registry.json`, and each mode keeps its own contract in its packet.

---

## 1. WHEN TO USE

Use this skill for code-family workflows. Invoke it as `sk-code` with an optional mode hint such as `debug: <request>`; the hub classifies the request, resolves a mode key, and loads the matching nested packet.

| Mode | Use it for | Packet |
|------|------------|--------|
| **implement** | Research and implementation; WEBFLOW/OPENCODE authoring; Motion.dev overlay consumption. | `sk-code/code-implement/` |
| **quality** | Quality gate; P0/P1/P2 author checks; comment hygiene; surface checklists. | `sk-code/code-quality/` |
| **debug** | Root-cause debugging; error recovery; escalation discipline. | `sk-code/code-debug/` |
| **verify** | Verification; Iron Law evidence; mutation/falsifier ritual. | `sk-code/code-verify/` |
| **review** | Findings-first review; security/correctness baseline; checklists; output contract; PR-state gates. | `sk-code/code-review/` |

### When NOT to Use
- Documentation-only changes with no code-work contract - use `sk-doc`.
- Git workflow, branch, commit, PR, merge, or release work - use `sk-git`.
- Pure browser inspection or external MCP transport work - use the relevant MCP skill.
- Design judgment, visual direction, motion taste, or UI audit - use `sk-design` first.
- Backend support primitives in `shared/` - they are consumed by the modes, not invoked as a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven**. `mode-registry.json` is the single source of truth; the hub reads it and does not re-derive the mapping. The advisor routes any code query to the single identity `sk-code`; the hub then picks the mode.

### The discriminator
- **`workflowMode`** - the public mode key: `implement`, `quality`, `debug`, `verify`, or `review`.
- **`backendKind`** - which backend runs the mode: `surface-router` or `review-cache`.

### Routing rule
```
classify the request to a workflowMode (dominant code intent; mode hint like "verify: ..." overrides)
read mode-registry.json
  -> resolve workflowMode from the hint / classified intent
  -> load the mode packet at registry[mode].packet (e.g. sk-code/code-implement/SKILL.md)
  -> run the backend named by registry[mode].backendKind
```

Surface detection (`WEBFLOW`, `OPENCODE`, `MOTION_DEV`, with `OPENCODE` over `WEBFLOW` precedence) lives once in the hub's `shared/` layer and is consumed by every mode. Modes own workflow contracts, not surface identity.

Per-mode behavior is **not flattened**: each packet keeps its own code-work contract, standards, evidence rules, and tool-permission guards.

---

## 3. HOW IT WORKS

### Layout
```
sk-code/
  SKILL.md               # this routing hub (no per-mode code logic)
  mode-registry.json     # the discriminator + advisorRouting (single source of truth)
  hub-router.json        # lexical routing signals for hub-local mode choice
  graph-metadata.json    # the ONE advisor identity for the whole skill
  code-implement/        # implement mode packet
  code-quality/          # quality mode packet
  code-debug/            # debug mode packet
  code-verify/           # verify mode packet
  code-review/           # review mode packet
  shared/                # shared surface-detection router and cross-mode helpers
```

Each mode packet is self-contained and carries no per-packet `graph-metadata.json`; only this hub carries one, so the advisor discovers exactly one code skill identity.

### Backend
The `surface-router` backend is the shared surface-detection router under `shared/`. It centralizes WEBFLOW, OPENCODE, and MOTION_DEV detection and precedence for every authoring, quality, debugging, and verification mode. The `review-cache` backend supports the review mode's non-mutating review output cache. Shared backend material provides surface identity and cross-mode helpers; it must never gain per-mode workflow contracts.

---

## 4. RULES

### ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json`; never hardcode a router mapping in the hub.
- **ALWAYS** keep mode contracts in the mode packets; the hub stays routing-only.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill identity.
- **ALWAYS** give every mode an `advisorRouting` block with `routingClass: "metadata"` and the correct `packetSkillName`.

### NEVER
- **NEVER** add a `graph-metadata.json` inside a mode packet or `shared/`.
- **NEVER** put per-mode implementation, quality, debugging, verification, or review logic in the hub.
- **NEVER** hardcode a router mapping outside `mode-registry.json`.

### ESCALATE IF
- A new code mode is needed - extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- Surface identity and workflow ownership conflict in a way the shared router cannot classify.

---

## 5. REFERENCES

- Mode packets: `code-implement/SKILL.md`, `code-quality/SKILL.md`, `code-debug/SKILL.md`, `code-verify/SKILL.md`, `code-review/SKILL.md`.
- Registry: `mode-registry.json`.
- Hub router signals: `hub-router.json`.
- Parent-skill pattern: `.opencode/skills/sk-doc/references/skill_creation/parent_skills_nested_packets.md`.
- Sibling example: `.opencode/skills/sk-design/`.
