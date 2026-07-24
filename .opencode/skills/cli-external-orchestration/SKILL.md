---
name: cli-external-orchestration
description: "Parent hub for external CLI dispatch: routes to four workflow modes (cli-opencode, cli-claude-code, cli-codex, cli-cursor) through mode-registry.json. Holds no per-mode logic; dispatches by workflowMode."
allowed-tools: [Bash, Read, Glob, Grep]
version: 1.2.0.0
metadata:
  author: OpenCode
  family: cli
---

<!-- Keywords: cli-external-orchestration, mode-registry, hub-router, workflowMode, packetKind, cli-opencode, opencode-cli, opencode-run, cli-claude-code, claude-code, claude-cli, cli-codex, codex-cli, codex-exec, cli-cursor, cursor-cli, cursor-agent, composer, cross-ai, agent-delegation, executor-delegation -->

# CLI External Dispatch Hub (cli-external-orchestration)

One skill, four workflow modes, one shared `family: cli` identity. `cli-external-orchestration` is the public, advisor-routable home for every external CLI dispatch orchestrator in this repo. Before routing, the hub reads `hub-router.json` to resolve a `workflowMode`, then delegates through `mode-registry.json`. This hub holds NO per-mode logic — each mode keeps its own dispatch contract, self-invocation guard, and hard rules in its packet, and the hub only routes by `workflowMode`.

---

## 1. WHEN TO USE

Use this skill (through the hub) for any cross-AI CLI dispatch. Invoke it as `cli-external-orchestration`; the hub classifies the request, resolves a mode key, and loads the matching nested packet.

| Mode | Kind | Use it for | Packet |
|------|------|-----------|--------|
| **cli-opencode** | workflow | OpenCode CLI orchestration: external dispatch, in-OpenCode parallel/detached sessions, full plugin/skill/MCP/Spec-Kit-Memory runtime, small-model dispatch (DeepSeek, Kimi, MiniMax, MiMo, GLM) | `cli-external-orchestration/cli-opencode/` |
| **cli-claude-code** | workflow | Claude Code CLI orchestration: Anthropic-backed extended thinking, surgical code editing, structured JSON-schema output, agent delegation, cross-AI second opinions | `cli-external-orchestration/cli-claude-code/` |
| **cli-codex** | workflow | Codex CLI orchestration: OpenAI-backed coding, review, and web research; fails closed when `codex` is absent | `cli-external-orchestration/cli-codex/` |
| **cli-cursor** | workflow | Cursor CLI orchestration: cursor-agent-backed coding, Composer-model dispatch, read-only plan/ask modes; fails closed when `cursor-agent` is absent | `cli-external-orchestration/cli-cursor/` |

### When NOT to Use

- The current runtime IS the target CLI — each mode's own self-invocation guard refuses self-dispatch (see that packet's §2); this hub does no dispatch itself and carries no guard of its own.
- Application-code implementation, review, or design work with no CLI-dispatch need — use `sk-code` / `sk-design` directly.
- A quick in-process task with no cross-AI handoff — dispatching to an external CLI process is unnecessary overhead.

---

## 2. SMART ROUTING

Routing is registry-driven. `mode-registry.json` lists all three modes in one `modes[]` array. `hub-router.json` decides whether the result is a single mode, an ordered bundle, or a deferred disambiguation.

> **Compiled routing (default-on, flag-gated, additive).** Resolve the mode via the compiled router contract first:
> ```bash
> node .opencode/bin/compiled-route.cjs --hub cli-external-orchestration --prompt "<task>"
> ```
> Follow the returned decision — `route` (use its `targets`), `clarify`/`defer` (disambiguate), `reject` (refuse). On a `{"servingAuthority":"legacy"}` sentinel or any error, use the routing below. The front door self-gates on serving-authority. Compiled routing is now the default for `cli-external-orchestration`; set `SPECKIT_COMPILED_ROUTING=0` to force legacy routing fleet-wide — the explicit kill-switch.

### Two-Axis Model

- `packetKind: "workflow"` — `cli-opencode`, `cli-claude-code`, `cli-codex`, and `cli-cursor` orchestrate a CLI binary and their dispatched writes land in THIS repo's workspace (`mutatesWorkspace:true`). None is a transport packet: all classify intent, choose/confirm a provider, and conduct the dispatched session. (`cli-cursor`'s native worktree/cloud-worker surfaces are opt-in escape hatches, not its default dispatch shape.)
- Zero extensions: no surface-axis, no transport-axis, no runtime-loop. All four modes are primary, independently-routable dispatch workflows.

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

### Executor Delegation

A prompt naming a specific executor (e.g. "use cli-opencode", "delegate to opencode", "get a claude code second opinion", "delegate to codex", "delegate to cursor", or a small model that dispatches through one) is resolved by the system-skill-advisor's executor-delegation scorer, which sources its alias table from THIS hub's `mode-registry.json` — keyed by each mode's `packetSkillName` — and resolves to `cli-opencode`, `cli-claude-code`, `cli-codex`, or `cli-cursor`. See `system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts`.

---

## 3. HOW IT WORKS

### Layout

```text
cli-external-orchestration/
  SKILL.md
  mode-registry.json
  hub-router.json
  description.json
  graph-metadata.json
  changelog/
  manual-testing-playbook/
  benchmark/
  cli-opencode/
    SKILL.md
    README.md
    references/
    assets/
    scripts/
    manual-testing-playbook/
    changelog/
  cli-claude-code/
    SKILL.md
    README.md
    references/
    assets/
    manual-testing-playbook/
    changelog/
  cli-codex/
    SKILL.md
    README.md
    references/
    assets/
    manual-testing-playbook/
    changelog/
  cli-cursor/
    SKILL.md
    README.md
    references/
    assets/
    manual-testing-playbook/
    changelog/
```

### Companion Metadata

- `mode-registry.json` owns `workflowMode`, `packetKind`, `backendKind`, `toolSurface`, packet folder identity, alias phrases, and `advisorRouting`. It is also the executor-delegation scorer's source of truth for which CLI executors exist.
- `hub-router.json` owns `routerPolicy`, `routerSignals`, `vocabularyClasses`.
- `description.json` owns advisor-facing summary fields.
- `graph-metadata.json` owns the one skill-graph identity node for the whole hub (`family: cli`).

### Self-Invocation Guards Stay Packet-Local

Each mode's self-invocation guard is runtime-signal-based (env var / process ancestry / lockfile), not path-based, so it is unaffected by this hub's routing layer. `cli-opencode` additionally carries a parallel-detached carve-out that `cli-claude-code` intentionally does not — that asymmetry is preserved.

---

## 4. RULES

### ✅ ALWAYS

- Resolve packets through `mode-registry.json`; never hardcode packet roots in prose-only logic.
- Keep `SKILL.md` thin: routing, invariants, and navigation only.
- Keep every packet in `modes[]` and give every packet a `packetKind`.
- Keep exactly one `graph-metadata.json`, at the hub root.
- Keep `hub-router.json` signal keys and registry `workflowMode` values bidirectionally aligned.
- Read the target mode's `SKILL.md` before composing any dispatch prompt (constitutional cli-dispatch-skill-preload rule) — the advisor recommendation alone does not waive this.

### ⛔ NEVER

- Never add a second packet array.
- Never add packet-local `graph-metadata.json` files.
- Never let any mode dispatch itself — the self-invocation guard is packet-owned and non-negotiable.
- Never let the executor CLI (the HOW) override the calling skill's own workflow (the WHAT) — "use cli-opencode gpt-5.5 high" still runs inside the caller's skill-owned route.

### ⚠️ ESCALATE IF

- A packet cannot be classified as `workflow` (all three current modes are; a future mode may not be).
- Router signals, vocabulary classes, and registry modes cannot be made bidirectionally consistent.
- The executor-delegation scorer resolves a delegation prompt to `cli-external-orchestration` itself instead of a real executor — that is the exact silent-misroute failure mode ADR-005 rewrote the scorer to prevent; report it rather than working around it.

---

## 5. REFERENCES

- Registry: `mode-registry.json`.
- Router: `hub-router.json`.
- Advisor description: `description.json`.
- Skill graph identity: `graph-metadata.json`.
- Workflow packets: `cli-opencode/SKILL.md`, `cli-claude-code/SKILL.md`, `cli-codex/SKILL.md`, `cli-cursor/SKILL.md`.
- Executor-delegation scorer (hub-aware, sources from this hub's registry): `../system-skill-advisor/mcp-server/lib/scorer/executor-delegation.ts`.
- Constitutional CLI dispatch skill-preload rule: `../system-spec-kit/constitutional/cli-dispatch-skill-preload.md`.
