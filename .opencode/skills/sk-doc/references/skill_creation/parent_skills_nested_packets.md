---
title: Parent Skills with Nested Mode Packets
description: The parent-skill pattern - one advisor-routable hub dispatching to several self-contained mode packets over a shared backend, its single hard invariant, and the registry routing contract.
trigger_phrases:
  - "parent skill nested packets"
  - "mode registry advisor routing"
  - "single graph metadata invariant"
  - "advisorRouting routingClass"
  - "thin routing hub skill"
importance_tier: normal
contextType: implementation
version: 1.8.0.2
---

# Parent Skills with Nested Mode Packets

The pattern for a parent skill: one advisor-routable hub that dispatches to several self-contained mode packets over a shared backend, with one hard invariant and a declarative routing contract.

---

## 1. OVERVIEW

This reference defines the parent-skill pattern in full: its anatomy, the single load-bearing invariant (exactly one `graph-metadata.json` per parent skill), the registry `advisorRouting` contract, the drift-guard rule that keeps hardcoded projection maps honest, and the naming standard. It is the most deep-linked skill-creation content because it governs how multi-mode skills stay discoverable without re-creating multi-identity brittleness.

**Core Principle**: One hub identity routes to many self-contained mode packets — keep the hub logic-free and the invariant intact.

**When to Use**:
- Designing a family of related workflows that share one backend but keep distinct per-mode contracts
- Reviewing or repairing a parent skill's discovery, routing, or registry
- Deciding whether a multi-mode need warrants nested packets or just mode subsections

**Key Sources**:
- [parent_skill_hub_template.md](../../assets/skill/parent_skill_hub_template.md) - routing-only hub SKILL.md
- [parent_skill_registry_template.json](../../assets/skill/parent_skill_registry_template.json) - mode-registry.json scaffold
- [`deep-loop-workflows/`](../../../deep-loop-workflows/SKILL.md) - the canonical worked example

---

## 2. PARENT SKILLS WITH NESTED MODE PACKETS

Most skills are a single `SKILL.md` plus bundled resources. A small number of skills are **parent skills**: one advisor-routable hub that dispatches a request to one of several self-contained **mode packets** over a shared backend. This section defines that pattern, its single hard invariant, and the routing contract that keeps it discoverable.

**Use this pattern only when** a family of related workflows shares one backend but keeps genuinely distinct per-mode contracts (convergence math, state shape, artifacts, tool permissions). For two or three near-identical modes, prefer one `SKILL.md` with mode subsections — do not reach for nested packets to chase organization.

Worked example throughout: [`.opencode/skills/deep-loop-workflows/`](../../../deep-loop-workflows/SKILL.md) (hub + `mode-registry.json` + five mode packets — four over the frozen `deep-loop-runtime` backend, the `deep-improvement` packet over `improvement-host`/`external-adapter` per its `backendKind`).

### Anatomy

```
parent-skill/
├── SKILL.md               # thin routing hub (routing ONLY, no per-mode logic)
├── mode-registry.json     # declarative single source of truth (the discriminator + advisorRouting)
├── graph-metadata.json    # EXACTLY ONE — the only advisor identity for the whole skill
├── deep-<mode-a>/         # mode packet: own SKILL.md / references / scripts / assets, NO graph-metadata.json
├── deep-<mode-b>/         # mode packet (verbatim self-contained)
├── …                      # N mode packets
└── shared/                # non-discoverable workflow-layer helpers (synthesis, NOT execution primitives)
```

- **Thin hub `SKILL.md`** — routes by mode key through `mode-registry.json` and holds **no** per-mode convergence, state, or synthesis logic. Every mode keeps its own contract in its packet.
- **Declarative `mode-registry.json`** — the single source of truth. Routers, commands, and tests **read** it; none re-derive the mapping. It carries the 3-tier discriminator plus the `advisorRouting` projection (below).
- **Exactly one `graph-metadata.json`** — the hub's. This is the one hard invariant (next subsection). Mode packets and `shared/` carry **none**.
- **N mode packets** — each is verbatim self-contained (its own `SKILL.md`, `references/`, `scripts/`, `assets/`, and any `feature_catalog/` or `manual_testing_playbook/`), with internal paths repointed to its packet root. Naming standard: `folder == packetSkillName == deep-<mode>` for single-mode packets. A packet MAY host several modes (the canonical `deep-improvement` hosts four) — it keeps one `packetSkillName`; and a grandfathered `folder != packetSkillName` is allowed when recorded via `packetSkillName` (the canonical `ai-council`/`deep-ai-council`).
- **Non-discoverable `shared/`** — packet-shared **workflow-layer** helpers only (e.g. output-formatting synthesis). Execution primitives (scoring, fan-out, state, coverage-graph) belong in the backend, not here. `shared/` being advisor-invisible is *incidental* — it follows from nesting, not from a special mechanism.

### The One Hard Invariant: exactly one `graph-metadata.json` per parent skill

This is the load-bearing keystone. The Skill Advisor's discovery (`skill-graph-db.ts` `discoverGraphMetadataFiles`) **recursively** finds every `graph-metadata.json` under the skills tree, and `isSkillGraphMetadata` keys discovery on the presence of `skill_id`/`family`/`edges`. The build then **throws** when a discovered file's `skill_id` does not equal its containing folder name (and rejects a `family` outside the allowed set).

Consequences that make the pattern work:
- Add a `graph-metadata.json` inside a mode packet and discovery either throws (`skill_id != folder`) or — if you force `skill_id == folder` — registers a **second** skill identity, re-creating the multi-ID brittleness the hub was built to remove and breaking any routing-parity fixture that asserts a single `{skill, mode}` mapping.
- Because discovery keys **only** on `graph-metadata.json`, every nested directory without one (mode packets, `shared/`) is **advisor-invisible** by construction. "Non-discoverable `shared/`" is therefore a consequence of the invariant, not a separate feature to engineer.

Net rule: **one hub `graph-metadata.json`, `skill_id == folder`, `family` in the allowed set `{cli, mcp, sk-code, deep-loop, sk-util, system}`; zero `graph-metadata.json` anywhere below it.**

### The Registry `advisorRouting` Contract

Each mode in `mode-registry.json` carries an `advisorRouting` block describing **how the advisor routes to it**. A `routingClass` discriminates the four real routing mechanisms; the other fields supply the data the advisor's projection maps key on.

```jsonc
"advisorRouting": {
  "routingClass": "lexical | alias-fold | metadata | command-bridge",
  "legacyAdvisorId": "deep-<mode>",        // lexical + alias-fold only
  "advisorDefaultMode": true,               // optional; marks the default mode a multi-mode id folds to
  "legacyAliases": ["spec_kit:deep-…", "command-spec-kit-deep-…"],
  "packetSkillName": "deep-<mode>"          // the packet SKILL.md name
}
```

**`routingClass` values:**

| routingClass | How the advisor finds the mode | Carries `legacyAdvisorId` |
| --- | --- | --- |
| `lexical` | Weighted-regex scoring in `skill_advisor.py` **and** present in both projection maps (Python + TS). The lexically scored modes. | Yes |
| `alias-fold` | TS `DEEP_MODE_BY_CANONICAL` only — an alias projection (a multi-mode id folding to its default mode), not lexically scored. | Yes |
| `metadata` | Resolved by skill membership; no advisor map entry of its own. | No |
| `command-bridge` | Routed by its `/deep:*` command, not by an advisor map entry. | No |

**Field notes:**
- **`legacyAliases`** must carry the advisor's **system-ID** aliases (e.g. `spec_kit:deep-review`, `command-spec-kit-deep-review`, `sk-deep-review`) — NOT the natural-language `aliases[]` phrases elsewhere in the mode. The two sets are different on purpose; the drift-guard asserts `legacyAliases` matches the advisor's alias group order-insensitively.
- **`advisorDefaultMode: true`** marks the single mode a multi-mode legacy id folds to (in the example, `deep-improvement` → `agent-improvement`). The fold derives from this flag, never from array order.
- **`packetSkillName`** records the packet's `SKILL.md` name so the standard (`folder == packetSkillName == deep-<mode>`) is machine-checkable even for a grandfathered folder.

### The C-plus Drift-Guard Rule

Keep the advisor's **hardcoded** projection maps (Python `DEEP_ROUTING_MODE_BY_KEY`, TypeScript `DEEP_MODE_BY_CANONICAL`). A CI test asserts those maps **equal** the registry's `advisorRouting` projection, and treats the registry as authoritative — a map change without a matching registry change fails CI.

- **Do NOT make the advisor read `mode-registry.json` at runtime.** Runtime registry-loading buys nothing but hot-path I/O and a novel cross-skill import coupling (the advisor reaching into another skill's directory). The drift-guard gives the same anti-drift guarantee at test time, with zero runtime cost.
- **Lexical regex weights stay in code** (`DEEP_ROUTING_LEXICAL_PATTERNS`). Moving weighted regex into JSON risks silent escaping corruption against exact fixture thresholds. The registry governs only the lexical **set** (which modes are lexically routed), guarded by a coverage fixture — not the weights.
- The guard lives at `.opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts` for the worked example.

### Single-Parent Limitation (current state)

The worked example is the only parent skill, and two pieces are still **deep-loop-specific**, not generic — design for this before scaffolding a second:

- The advisor's merged-identity projection (`MERGED_DEEP_SKILL_ID` + `DEEP_MODE_BY_CANONICAL`) is a single global map. A second parent skill needs its **own** merged-identity layer and its **own** drift-guard test scoped to its `mode-registry.json`.
- The `/doctor:parent-skill` validator's drift-guard check only `existsSync`-tests the *canonical* guard path, so it reports PASS vacuously for a non-canonical target with no guard of its own. Until that check is made target-aware, treat its drift-guard PASS as canonical-only and verify a new parent skill's guard by hand.

### ALWAYS / NEVER

**ALWAYS**
- Resolve a mode through `mode-registry.json`; never hardcode a router mapping in the hub.
- Keep each mode's convergence/state/artifact/tool-permission contract in its packet — the hub stays logic-free.
- Keep exactly one `graph-metadata.json` (the hub's) so the advisor sees one skill.
- Give every mode an `advisorRouting` block with a valid `routingClass` and `packetSkillName`.
- Enforce `hardcoded maps == registry projection` with the drift-guard test.

**NEVER**
- Add a `graph-metadata.json` (or any discoverable skill marker) inside a mode packet or `shared/`.
- Make the advisor read `mode-registry.json` at runtime — keep the projection maps in code and guard them with the test.
- Move weighted lexical regex into the registry JSON — the registry governs the set, code governs the weights.
- Move synthesis into the execution backend, or move execution primitives into `shared/`.
- Widen the behavior-parity contract to chase routing coverage — add separate coverage/drift fixtures instead.

### Naming Standard and the Grandfathered Exception

For **new** parent skills the standard is `folder == packetSkillName == deep-<mode>`, so no packet is ever one accidental discovery away from breaking the single-identity invariant. In the worked example, `ai-council/` is a **grandfathered** exception: its folder is `ai-council` while its packet name is `deep-ai-council`, recorded explicitly via `packetSkillName`. Grandfather an existing mismatch through `packetSkillName`; never codify a new one.

### Templates and Reference

- Hub scaffold: [parent_skill_hub_template.md](../../assets/skill/parent_skill_hub_template.md) - routing-only `SKILL.md` for a parent skill.
- Registry scaffold: [parent_skill_registry_template.json](../../assets/skill/parent_skill_registry_template.json) - `mode-registry.json` with the 3-tier discriminator + one example mode per `routingClass`.
- Canonical example: [`deep-loop-workflows/SKILL.md`](../../../deep-loop-workflows/SKILL.md), [`mode-registry.json`](../../../deep-loop-workflows/mode-registry.json), [`graph-metadata.json`](../../../deep-loop-workflows/graph-metadata.json).

---

## 3. RELATED RESOURCES

### Sibling Skill-Creation References
- [overview.md](./overview.md) - Skill anatomy and structure system
- [creation_workflow.md](./creation_workflow.md) - The 6-step skill creation process
- [validation_and_packaging.md](./validation_and_packaging.md) - Validation requirements and distribution

### Templates
- [parent_skill_hub_template.md](../../assets/skill/parent_skill_hub_template.md) - Parent-skill routing hub SKILL.md
- [parent_skill_registry_template.json](../../assets/skill/parent_skill_registry_template.json) - Parent-skill mode-registry.json
- [skill_md_template.md](../../assets/skill/skill_md_template.md) - SKILL.md file templates
