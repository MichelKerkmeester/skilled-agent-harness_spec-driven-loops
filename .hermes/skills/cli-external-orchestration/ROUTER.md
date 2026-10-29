---
title: cli-external-orchestration Surface Router — per-mode leaf sets
description: First-class surface router document at the cli-external-orchestration hub root (ROUTER.md). hub-router.json selects the workflow mode; this doc maps a request's CLI-dispatch intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs. Relocated verbatim from shared/references/smart-routing.md (v1.0.0.4) as the ROUTER.md consolidation pattern.
trigger_phrases:
  - "cli-external-orchestration smart routing"
  - "cli dispatch surface router"
  - "cli executor leaf routing"
  - "cli dispatch resource map"
importance_tier: important
contextType: general
version: 1.7.6.0
router_state: active
skill_pointer: SKILL.md
---


# cli-external-orchestration Surface Router — per-mode leaf sets

## 1. OVERVIEW

This is cli-external-orchestration's second-layer (surface) router, first-class at the hub root
as `ROUTER.md`. The hub
selects a workflow mode in [`hub-router.json`](../../../.skilled/skills/cli-external-orchestration/hub-router.json)
(`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`,
`cli-pi`, or `cli-hermes`); this doc maps a request's CLI-dispatch intent to the exact
packet-local leaf resources that mode should load. Every path is
packet-qualified (`<packet>/references|assets/…`, where
`<packet>` is the mode's `mode-registry.json` `packet` field) and converts to
the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary
(`sk-doc/sk-create-skill/scripts/lib/leaf-resource-contract.cjs`).

Routing is two stages: the hub picks the WORKFLOW mode (mode telemetry), this
router picks the LEAVES within it. The two layers stay separate — the hub never
emits leaf paths, and this router never re-decides the mode.

---

## 2. INTENT MODEL

Each mode's first-slice leaf set is its CLI command reference + its
integration-pattern guide. Each mode ALSO carries a dedicated
`references/providers-and-models.md` catalog (provider / model / effort /
invocation index) that loads on demand inside the packet — like the deeper
per-mode references, it is not part of the first slice.

- **cli-opencode leaves** — the OpenCode CLI command reference (invocation flags,
  models, sandbox) and the integration-pattern guide a request to dispatch an
  external / parallel-detached OpenCode session, run a full plugin + Spec-Kit
  runtime, or fan out a small-model worker loads.
- **cli-claude-code leaves** — the Claude Code CLI command reference (non-interactive
  `claude -p`, extended thinking, permission modes) and the integration-pattern
  guide a request for an Anthropic-backed second opinion, extended-thinking
  handoff, or surgical structured-output dispatch loads.
- **cli-codex leaves** — the Codex CLI command reference (`codex exec`, sandbox
  modes, web research) and the integration-pattern guide a request to dispatch an
  OpenAI-backed coding / review / research session loads.
- **cli-cursor leaves** — the Cursor CLI command reference (`cursor-agent -p`,
  Composer + the enforced model allowlist) and the integration-pattern guide a
  request to dispatch a Cursor-Composer coding session loads.
- **cli-devin leaves** — the Devin CLI command reference (`devin -p`, the curated
  DeepSeek / Gemini / GLM-5.2 / GPT-5.6 Luna Max / Grok (4.5 and 4.6) / SWE-2 roster, permission modes) and the
  integration-pattern guide a request to dispatch a Cognition-backed autonomous
  SWE session or cloud handoff loads.
- **cli-pi leaves** — the Pi CLI command reference (headless print mode, the
  multi-provider passthrough + `--thinking` lever) and the integration-pattern
  guide a request to dispatch a Pi passthrough session loads.
- **cli-hermes leaves** — the Hermes Agent CLI command reference (headless oneshot
  chat, LLM Gateway model routing, exit codes, and the safe dispatch shape) and the
  integration-pattern guide a request to dispatch a Hermes conductor or headless
  executor session loads.

A bare CLI-dispatch phrase that names no executor (e.g. "dispatch this to a CLI
executor") names no mode, so it fires no intent and falls back to the hub default
(disambiguation) — the router does not silently default to `cli-opencode` on
genuine ambiguity.

---

## 3. MACHINE-READABLE ROUTER (replay / benchmark source)

The single machine-readable projection of the intent model above. The prose is
the human-facing contract; this block is the byte-for-byte source the
deterministic router-replay parses. Keep them in sync: when a map row changes
above, update the matching `RESOURCE_MAP` entry here. Every `RESOURCE_MAP` path
resolves on disk and is registered in `leaf-manifest.json`, so each dual-reads to
a canonical typed pair.

```python
# No always-loaded preamble: CLI-dispatch routing loads only the selected mode's
# leaves so the hub default route stays minimal (disambiguation on no match).
DEFAULT_RESOURCE = []

INTENT_SIGNALS = {
    "OPENCODE":    {"weight": 4, "keywords": ["opencode", "opencode cli", "opencode run", "delegate to opencode", "cli-opencode", "parallel detached session", "full plugin runtime", "full plugin and memory stack", "ablation suite", "worker farm opencode", "parallel opencode session", "detached opencode session", "full plugin runtime dispatch", "cross-ai handback opencode", "ablation suite opencode", "in-opencode parallel session"]},
    "CLAUDE_CODE": {"weight": 4, "keywords": ["claude code", "claude cli", "cli-claude-code", "anthropic cli", "anthropic cli second opinion", "delegate to claude", "extended thinking", "deep reasoning handoff", "deeply-reasoned opinion", "structured claude code output", "claude code review", "claude-code", "claude-cli"]},
    "CODEX":       {"weight": 4, "keywords": ["codex", "codex cli", "codex exec", "cli-codex", "openai cli second opinion", "delegate to codex", "openai coding agent", "codex web search", "codex diff review", "codex sandbox", "gpt codex dispatch", "cli codex"]},
    "CURSOR":      {"weight": 4, "keywords": ["cursor", "cursor cli", "cursor-agent", "cli-cursor", "composer", "cursor composer", "composer dispatch", "delegate to cursor", "cursor agent dispatch", "grok coding dispatch", "cursor agent", "cursor plan mode", "cursor ask mode", "cursor worktree", "cursor cloud worker"]},
    "DEVIN":       {"weight": 4, "keywords": ["devin", "devin cli", "cli-devin", "cognition devin", "delegate to devin", "swe-2 dispatch", "autonomous swe agent", "devin cloud session", "devin headless", "grok 4.5 devin dispatch", "grok 4.6 devin dispatch", "cognition cli", "cognition cli second opinion", "devin handoff", "cognition-cli", "devin subagent", "devin cloud handoff", "swe-1.7 dispatch"]},
    "PI":          {"weight": 4, "keywords": ["pi cli", "cli-pi", "pi dispatch", "pi headless", "delegate to pi", "pi thinking", "pi passthrough", "pi print mode", "pi multi-provider", "pi agent", "pi.dev cli", "pi coding agent", "cli pi", "pi json event stream", "pi rpc integration", "pi community package", "pi headless dispatch"]},
    "HERMES":      {"weight": 4, "keywords": ["hermes cli", "cli-hermes", "hermes agent", "nous hermes", "delegate to hermes", "hermes chat", "hermes oneshot", "hermes dispatch", "hermes headless", "hermes query-file", "cli hermes", "hermes coding agent", "hermes yolo dispatch", "hermes second opinion", "nous research agent dispatch"]},
}

RESOURCE_MAP = {
    "OPENCODE": [
        "cli-opencode/references/cli-reference.md",
        "cli-opencode/references/integration-patterns.md"
    ],
    "CLAUDE_CODE": [
        "cli-claude-code/references/cli-reference.md",
        "cli-claude-code/references/integration-patterns.md"
    ],
    "CODEX": [
        "cli-codex/references/cli-reference.md",
        "cli-codex/references/integration-patterns.md"
    ],
    "CURSOR": [
        "cli-cursor/references/cli-reference.md",
        "cli-cursor/references/integration-patterns.md"
    ],
    "DEVIN": [
        "cli-devin/references/cli-reference.md",
        "cli-devin/references/integration-patterns.md"
    ],
    "PI": [
        "cli-pi/references/cli-reference.md",
        "cli-pi/references/integration-patterns.md"
    ],
    "HERMES": [
        "cli-hermes/references/cli-reference.md",
        "cli-hermes/references/integration-patterns.md"
    ],
}
```

---

## 4. HOW TO READ THIS

- One dominant executor intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair and capped at the selected-map union limit —
  the `orderedBundle` outcome `hub-router.json` declares.
- Each mode's first-slice leaves are its own CLI command reference plus its
  integration-pattern guide; the deeper per-mode references (its
  `providers-and-models.md` provider/model catalog, tool catalogs, permission
  matrices, recursion guards) load on demand inside the packet, not on the
  first slice.
- No keyword match is the hub's `defer` fallback: confirm the target executor
  (`cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`,
  `cli-pi`, `cli-hermes`) before loading anything.

---

## 5. MACHINE ROUTER

The hub's detailed routing prose, moved here from `SKILL.md` so the skill body keeps only a short routing summary and a pointer to this file. It sits last, after the stage-two map above, and it declares no map of its own: the `INTENT_SIGNALS` and `RESOURCE_MAP` block in section 3 stays the only replay source.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `cli-external-orchestration`; set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide — the explicit kill-switch.

### Two-Axis Model

- `packetKind: "workflow"`:
  - `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, and `cli-hermes` orchestrate a CLI binary.
  - Their dispatched writes land in THIS repo's workspace (`mutatesWorkspace:true`).
  - None is a transport packet. All classify intent, choose/confirm a provider, and conduct the dispatched session.
  - `cli-cursor`'s native worktree/cloud-worker surfaces are opt-in escape hatches, not its default dispatch shape.
- No extension is declared: the `transport-axis` left with the `cli-jev` transport, no mode here is read-only evidence, and none converges on a loop. The seven workflows stay primary, independently-routable dispatch modes.

### Routing Rule

```text
read hub-router.json
  -> score routerSignals and vocabularyClasses
  -> apply routerPolicy.tieBreak
  -> read mode-registry.json for packetKind, backendKind, toolSurface, and advisorRouting
  -> load the selected packet(s)
```

### Outcomes

- `single`: one dominant executor signal routes to one mode.
- `orderedBundle`: multiple explicitly requested executors route in tie-break order.
- `defer`: unclear or contradictory dispatch intent asks for disambiguation — the router does not silently default to `cli-opencode` on genuine ambiguity.

### Surface Router — per-mode leaf sets

Stage 2 of routing lives in section 3 of this file. It defines three things:
- The per-mode leaf-intent model. It covers every mode in `mode-registry.json`, plus one deliberate absence: a bare CLI-dispatch phrase that names no executor fires no intent and defers at the hub.
- The machine-readable `DEFAULT_RESOURCE` / `INTENT_SIGNALS` / `RESOURCE_MAP` block that the deterministic router-replay parses.
- The how-to-read rules: a dominant intent → one leaf set; near-tied intents → deduped union, the `orderedBundle` outcome; no keyword match → hub `defer`, never a silent default to `cli-opencode`.

Every `RESOURCE_MAP` path is packet-qualified and converts to the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary.

This router stays a separate document on purpose; [the parent-skill reference](../../../.skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md#why-the-leaf-router-stays-in-routermd) gives the reason once.

### Executor Delegation

A specific-executor prompt is resolved by the system-skill-advisor's executor-delegation scorer. Examples include:
- "use cli-opencode", "delegate to opencode", and "get a claude code second opinion".
- "delegate to codex", "delegate to cursor", "delegate to devin", and "delegate to pi".
- A small model that dispatches through one.

The scorer sources its alias table from THIS hub's `mode-registry.json`, keyed by each mode's `packetSkillName`.
It resolves to `cli-opencode`, `cli-claude-code`, `cli-codex`, `cli-cursor`, `cli-devin`, `cli-pi`, or `cli-hermes`.
See `system-skill-advisor/runtime/lib/scorer/executor-delegation.ts`.
