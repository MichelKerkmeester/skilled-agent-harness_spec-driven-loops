---
title: Parent Skill Hub Template - Routing-Only SKILL.md
description: Fill-in template for a parent skill's routing hub that dispatches a request to one of N self-contained mode packets over a shared backend.
trigger_phrases:
  - "parent skill hub template"
  - "routing hub skill"
  - "nested mode packet skill"
  - "mode registry routing"
importance_tier: normal
contextType: general
version: 1.8.0.3
---

# Parent Skill Hub Template - Routing-Only SKILL.md

Template for the thin routing hub of a **parent skill**: one advisor-routable identity that dispatches by mode key through `mode-registry.json` to N verbatim, self-contained mode packets over a shared backend. The hub holds **no** per-mode logic.

Read the pattern first: [parent_skills_nested_packets.md](../../references/skill_creation/parent_skills_nested_packets.md). Canonical example: [`deep-loop-workflows/SKILL.md`](../../../deep-loop-workflows/SKILL.md).

---

## 1. OVERVIEW

### When to Use This Template

Use for a family of related workflows that share one backend but keep genuinely distinct per-mode contracts (convergence math, state shape, artifacts, tool permissions). For two or three near-identical modes, prefer one `SKILL.md` with mode subsections instead.

### The Hard Invariant

Exactly **one** `graph-metadata.json` per parent skill (the hub's, `skill_id == folder`). Mode packets and `shared/` carry **none** — they are advisor-invisible by construction. Adding a second `graph-metadata.json` either throws at discovery (`skill_id != folder`) or registers a second skill identity.

### Required Companion Files

- `mode-registry.json` — the declarative single source of truth (use [parent_skill_registry_template.json](./parent_skill_registry_template.json)).
- `graph-metadata.json` — exactly one, the hub's.
- N mode packets, each `folder == packetSkillName == deep-<mode>`, each with its own `SKILL.md`.

---

## 2. FRONTMATTER

```yaml
---
name: [parent-skill-name]
description: "[Unified skill: routes a request to one of N modes ([mode-a], [mode-b], …) over the shared [backend] backend. Holds no per-mode logic — dispatches by [modeKey] through mode-registry.json.]"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---
```

- `name` must match the hub folder name, hyphen-case.
- `description` says "routes to N modes" and "holds no per-mode logic"; keep it ≤ 130 chars after trimming stack/product enumerations.
- `allowed-tools` is the **union** the modes need (add `Task`/`WebFetch` only if a mode requires them).

---

## 3. HUB TEMPLATE

Copy the block below into the hub `SKILL.md` and fill the bracketed placeholders. Keep it routing-only.

```markdown
---
name: [parent-skill-name]
description: "[Unified skill that routes to N modes over a shared backend; holds no per-mode logic.]"
allowed-tools: [Read, Write, Edit, Bash, Grep, Glob]
version: 1.0.0.0
---

<!-- Keywords: [parent-skill-name], [mode-a], [mode-b], [modeKey], mode-registry, [backend], [domain keywords] -->

# [Parent Skill Title]

[One sentence: N modes, one shared backend, one identity.] This hub holds NO per-mode logic — it routes by [modeKey] through `mode-registry.json`. Each mode keeps its own contract in its packet.

---

## 1. WHEN TO USE

Use this skill (through its commands and agents) for any [family] workflow:

| Mode | Use it for | Command | Agent |
|------|-----------|---------|-------|
| **[mode-a]** | [inward/outward purpose → artifact] | `[/cmd:mode-a]` | `[agent-a]` |
| **[mode-b]** | [purpose → artifact] | `[/cmd:mode-b]` | `[agent-b]` |

### When NOT to Use
- A single quick read/edit (no loop) — use the relevant skill directly.
- Backend/runtime support primitives — that is `[backend]`, consumed here, not invoked as a user workflow.

---

## 2. SMART ROUTING

Routing is **registry-driven**. `mode-registry.json` is the single source of truth; the hub, commands, and advisor all read it and none re-derive the mapping.

### The discriminator
- **`[modeKey]`** — the public mode key (every mode).
- **`[loopTypeKey]`** — the backend convergence key (validated against the allowed set; explicit `null` for non-loop modes; NEVER inferred from `[modeKey]`).
- **`[backendKind]`** — which backend runs the mode.

### Routing rule
\`\`\`
read mode-registry.json
  → resolve [modeKey] from the command / advisor alias
  → load the mode packet at registry[mode].packet/
  → dispatch to the backend named by registry[mode].[backendKind]
\`\`\`

Per-mode behavior is **not flattened**: each packet keeps its own convergence math, state shape, artifacts, and tool-permission guards.

---

## 3. HOW IT WORKS

### Layout
\`\`\`
[parent-skill-name]/
  SKILL.md               # this routing hub (no per-mode logic)
  mode-registry.json     # the discriminator + advisorRouting (single source of truth)
  graph-metadata.json    # the ONE advisor identity for the whole skill
  deep-[mode-a]/  deep-[mode-b]/  …   # N verbatim mode packets (no per-packet graph-metadata.json)
  shared/                # non-discoverable workflow-layer helpers (synthesis, not execution primitives)
\`\`\`

Each mode packet is self-contained (own `SKILL.md`, `references/`, `scripts/`, `assets/`) with internal paths repointed and **no per-packet `graph-metadata.json`**.

### Backend
Modes consume `[backend]` per their `backendKind` (a mode may run over the shared backend, a host process, or an external adapter). Name what it provides and what it must never gain.

---

## 4. RULES

### ALWAYS
- **ALWAYS** resolve a mode through `mode-registry.json`; never hardcode a router mapping.
- **ALWAYS** keep each mode's contract in its packet — the hub stays logic-free.
- **ALWAYS** keep exactly one `graph-metadata.json` (this hub's) so the advisor sees one skill.
- **ALWAYS** give every mode an `advisorRouting` block with a valid `routingClass` and `packetSkillName`.

### NEVER
- **NEVER** add a `graph-metadata.json` or a discoverable skill marker inside a mode packet or `shared/`.
- **NEVER** infer `[loopTypeKey]` from `[modeKey]` — read it from the registry (explicit `null` is load-bearing).
- **NEVER** make the advisor read `mode-registry.json` at runtime — keep the projection maps in code and guard them with the drift-guard test.
- **NEVER** move weighted lexical regex into the registry, synthesis into the backend, or execution primitives into `shared/`.

### ESCALATE IF
- A new mode is needed — extend `mode-registry.json` and open a packet; do not bolt logic onto the hub.
- A change would require the backend to gain an out-of-class responsibility — that contradicts the architecture; escalate.

---

## 5. REFERENCES

- Backend: `[backend]` (consumed by every mode).
- Mode packets: `deep-[mode-a]/SKILL.md`, `deep-[mode-b]/SKILL.md`, … (per-mode detail).
- Commands: the per-mode commands under `[command dir]`.
- Registry: `mode-registry.json` (the routing contract).
```

---

## 4. CHECKLIST

Before claiming the hub complete:

- [ ] Hub `SKILL.md` holds routing only — no per-mode convergence/state/synthesis logic.
- [ ] Exactly one `graph-metadata.json` (the hub's); zero inside packets or `shared/`.
- [ ] `mode-registry.json` exists, every mode has an `advisorRouting` block.
- [ ] Each mode packet is self-contained with `folder == packetSkillName == deep-<mode>` (grandfathered mismatches recorded via `packetSkillName`).
- [ ] Drift-guard test asserts `hardcoded maps == registry projection` and passes.
- [ ] `package_skill.py` validation passes on the hub `SKILL.md`.

---

## 5. RELATED RESOURCES

- [parent_skills_nested_packets.md](../../references/skill_creation/parent_skills_nested_packets.md) - the full pattern, invariant, and routing contract.
- [parent_skill_registry_template.json](./parent_skill_registry_template.json) - the companion `mode-registry.json` scaffold.
- [skill_md_template.md](./skill_md_template.md) - the single-skill `SKILL.md` template (use for each mode packet).
- Canonical example: [`deep-loop-workflows/SKILL.md`](../../../deep-loop-workflows/SKILL.md), [`mode-registry.json`](../../../deep-loop-workflows/mode-registry.json), [`graph-metadata.json`](../../../deep-loop-workflows/graph-metadata.json).
