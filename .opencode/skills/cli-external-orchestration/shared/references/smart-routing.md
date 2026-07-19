---
title: cli-external-orchestration Surface Router — per-mode leaf sets
description: Second-layer (surface) router for the cli-external-orchestration hub. hub-router.json selects the workflow mode; this doc maps a request's CLI-dispatch intent to the exact packet-local leaf resources that mode should load, emitting canonical (workflowMode, leafResourceId) pairs.
trigger_phrases:
  - "cli-external-orchestration smart routing"
  - "cli dispatch surface router"
  - "cli executor leaf routing"
  - "cli dispatch resource map"
importance_tier: important
contextType: general
version: 1.0.0.1
---

# cli-external-orchestration Surface Router — per-mode leaf sets

This is cli-external-orchestration's second-layer (surface) router. The hub
selects a workflow mode in [`hub-router.json`](../../hub-router.json)
(`cli-opencode`, `cli-claude-code`, or `cli-codex`); this doc maps a request's
CLI-dispatch intent to the exact packet-local leaf resources that mode should
load. Every path is packet-qualified (`<packet>/references|assets/…`, where
`<packet>` is the mode's `mode-registry.json` `packet` field) and converts to
the canonical `(workflowMode, leafResourceId)` pair at the one contract boundary
(`sk-doc/create-skill/scripts/lib/leaf-resource-contract.cjs`).

Routing is two stages: the hub picks the WORKFLOW mode (mode telemetry), this
router picks the LEAVES within it. The two layers stay separate — the hub never
emits leaf paths, and this router never re-decides the mode.

---

## 1. INTENT MODEL

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

A bare CLI-dispatch phrase that names no executor (e.g. "dispatch this to a CLI
executor") names no mode, so it fires no intent and falls back to the hub default
(disambiguation) — the router does not silently default to `cli-opencode` on
genuine ambiguity.

---

## 2. MACHINE-READABLE ROUTER (replay / benchmark source)

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
    "OPENCODE":    {"weight": 4, "keywords": ["opencode", "opencode cli", "opencode run", "delegate to opencode", "cli-opencode", "parallel detached session", "full plugin runtime", "full plugin and memory stack", "spec kit runtime", "spec kit memory", "ablation suite", "worker farm opencode"]},
    "CLAUDE_CODE": {"weight": 4, "keywords": ["claude code", "claude cli", "cli-claude-code", "anthropic cli", "anthropic cli second opinion", "delegate to claude", "extended thinking", "deep reasoning handoff", "deeply-reasoned opinion", "structured claude code output", "claude code review"]},
    "CODEX":       {"weight": 4, "keywords": ["codex", "codex cli", "codex exec", "cli-codex", "openai cli second opinion", "delegate to codex", "openai coding agent", "codex web search", "codex diff review", "codex sandbox", "gpt codex dispatch"]},
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
}
```

## 3. How to read this

- One dominant executor intent routes to one mode's leaf set.
- Two near-tied intents (within the ambiguity delta) route to both leaf sets; the
  union is deduped by canonical pair and capped at the selected-map union limit —
  the `orderedBundle` outcome `hub-router.json` declares.
- Each mode's leaves are its own CLI command reference plus its integration-pattern
  guide; the deeper per-mode references (tool catalogs, permission matrices,
  self-invocation guards) load on demand inside the packet, not on the first slice.
- No keyword match is the hub's `defer` fallback: confirm the target executor
  (`cli-opencode`, `cli-claude-code`, or `cli-codex`) before loading anything.
