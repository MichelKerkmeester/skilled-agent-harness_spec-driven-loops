---
title: cli-pi
description: Cross-AI dispatcher for Pi's terminal coding agent with guarded print, JSON event, RPC, and community-extension workflows.
trigger_phrases:
  - "pi cli"
  - "pi agent"
  - "pi.dev cli"
  - "delegate to pi"
  - "pi coding agent"
version: 1.0.0.0
---

# cli-pi

> Dispatch a scoped task to Pi's terminal coding agent and return validated code, analysis, JSON events, or RPC results to the calling runtime.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Headless Pi coding, read-only tool-constrained review, JSON event output, RPC integration, and Pi resource inspection |
| **Invoke with** | "pi cli", "pi agent", "pi.dev cli", "delegate to pi", or "pi coding agent" |
| **Works on** | An external runtime that can reach the pi binary and the shared deep-loop executor |
| **Produces** | Validated text, JSONL event output, RPC handback, or workspace changes |

---

## 2. OVERVIEW

### Why This Skill Exists

A calling AI needs a stable way to reach Pi without hand-building flags, accidentally dispatching from Pi, or treating a failed provider call as successful. Pi has more than one headless surface, and its JSON event mode and persistent RPC mode require different consumers. The local contract pin confirms the core command shape and the unreliable failure exit-code behavior. See the [pinned contract](../../../specs/cli-external-orchestration/031-cli-pi-creation/001-pi-contract-pin/implementation-summary.md).

### What It Does

cli-pi probes for the binary, guards against likely self-invocation, chooses the requested headless surface, and delegates process execution to the shared deep-loop runtime. It keeps Pi-native skills, prompt templates, extensions, MCP, and community packages in separate references so documentation-only behavior is not mistaken for live verification.

---

## 3. QUICK START

**Step 1: Verify the CLI is installed.**

~~~bash
command -v pi
~~~

Success prints the path to the Pi executable. If it prints nothing, stop before constructing a dispatch.

**Step 2: Choose the output contract.**

~~~bash
pi -p "Review the authentication flow and report findings" --mode text --tools read,grep,find,ls
~~~

This is the read-only tool-constrained print pattern from the live help capture. Validate the output before relying on it.

**Step 3: Use structured output only when the consumer is ready.**

~~~bash
pi --mode json "Summarize the changed files"
~~~

JSON mode emits one JSON object per line. For a persistent integration, use pi --mode rpc and a JSONL client. See [cli-reference.md](./references/cli-reference.md).

---

## 4. HOW IT WORKS

The calling AI remains the conductor. It classifies the task, selects print, JSON, or RPC, composes a scoped prompt, and sends it to the shared runtime. The runtime launches Pi and returns output. The caller checks provider errors, extension errors, changed files, and tests.

Pi print mode is the one-shot path. JSON mode is an event stream. RPC is a long-lived stdin/stdout protocol. The pinned contract confirms these distinctions, while native skills and prompt-template discovery remain documented but unconfirmed for this packet. The exact source links and confidence labels live in [native-skills-and-extensions.md](./references/native-skills-and-extensions.md).

The packet's guard is conservative. Process ancestry is checked first, then a .pi project-directory heuristic is checked. Neither absence of a signal nor the presence of a directory proves that a session is active. A detected signal stops dispatch.

Prompt quality follows the shared three-tier rule in [prompt-quality-card.md](./assets/prompt-quality-card.md). The card delegates framework selection to sk-prompt/prompt-models and adds only Pi dispatch mechanics.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Use cli-pi when the request names Pi, needs Pi's native model/provider surface, or specifically asks for Pi JSON or RPC output. Use a sibling packet when the user names another CLI or the task needs that provider's unique runtime.

### Sibling Boundaries

| Skill | Relationship |
|---|---|
| cli-opencode | Full OpenCode runtime, plugins, memory stack, and detached sessions |
| cli-claude-code | Anthropic-backed CLI dispatch and structured Claude Code output |
| cli-codex | OpenAI-backed coding, review, and web research |
| cli-cursor | Cursor Composer, plan/ask modes, and shared editor configuration |
| cli-devin | Devin models, subagents, and cloud handoff |

### Resource Map

- CLI behavior: [references/cli-reference.md](./references/cli-reference.md)
- Conductor patterns: [references/integration-patterns.md](./references/integration-patterns.md)
- Subagents: [references/agent-delegation.md](./references/agent-delegation.md)
- Native resources: [references/native-skills-and-extensions.md](./references/native-skills-and-extensions.md)
- MCP and packages: [references/mcp-and-third-party-packages.md](./references/mcp-and-third-party-packages.md)
- Prompt assets: [assets/prompt-templates.md](./assets/prompt-templates.md)

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| pi is not found | The binary is absent from PATH | Install the Pi package, refresh PATH, then rerun command -v pi |
| Missing provider API key | Pi cannot reach the selected model | Configure provider auth and retry; do not rely on the exit code |
| Different failure exit codes | The pinned contract observed exit 0 and exit 1 for similar unauthenticated runs | Inspect output text and classify the failure |
| Extension load failure | An extension can block the session when its export is invalid | Remove or fix the extension, then rerun with the required validation |
| JSON consumer hangs or misparses | JSON mode is line-delimited and RPC is persistent | Choose one contract and parse JSONL records correctly |
| Self-invocation refused | The guard found Pi ancestry or a .pi heuristic | Use a different runtime or a fresh shell session |
| Package install asks for trust | Project-local package changes need approval | Review the package and approve project-local changes explicitly |

---

## 7. FAQ

**Q: Is Pi's RPC mode a JSON version of print mode?**

A: No. The pinned contract treats RPC as a persistent stdin/stdout JSONL protocol. Use a long-lived client and read [integration-patterns.md](./references/integration-patterns.md).

**Q: Does this packet claim that Pi flattens every nested skill?**

A: No. That discovery behavior remains documented but unconfirmed. The packet labels the claim and routes live verification to the native-resource reference.

**Q: Are pi-subagents and pi-mcp-extension first-party Pi features?**

A: No. They are community packages. The package reference separates their documented surfaces from the Pi CLI contract and does not treat installation as approval.

**Q: Why not use the alias pi?**

A: It is a common short word and a math constant. This packet uses multi-word aliases to reduce cross-hub routing collisions.

---

## 8. VERIFICATION

| Check | Result |
|---|---|
| Availability | command -v pi prints a path before dispatch |
| CLI contract | cli-reference.md matches the pinned implementation summary |
| Self-invocation | Guard refuses detected ancestry or project heuristic |
| Output handling | Text, JSON, and RPC consumers use the matching parser |
| Workspace safety | Returned changes pass the calling workflow's verification gates |
| Package safety | Community packages remain explicitly labeled and trust-gated |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [SKILL.md](./SKILL.md) | Runtime instructions, smart routing, and hard rules |
| [references/cli-reference.md](./references/cli-reference.md) | Pi flags, commands, modes, environment, and failure handling |
| [references/integration-patterns.md](./references/integration-patterns.md) | Cross-AI dispatch lifecycle and handback patterns |
| [references/agent-delegation.md](./references/agent-delegation.md) | Built-in boundary and community subagent package guidance |
| [references/native-skills-and-extensions.md](./references/native-skills-and-extensions.md) | Native resource discovery with confidence labels |
| [references/mcp-and-third-party-packages.md](./references/mcp-and-third-party-packages.md) | MCP and community package boundaries |
| [assets/prompt-quality-card.md](./assets/prompt-quality-card.md) | Thin prompt-quality delegator |
| [assets/prompt-templates.md](./assets/prompt-templates.md) | Reusable Pi dispatch templates |

