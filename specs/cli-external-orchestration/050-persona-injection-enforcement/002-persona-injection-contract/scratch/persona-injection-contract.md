# Persona-Injection Contract v1

> The shared contract every external-CLI dispatch path must follow. P3 references this per-mode; P4 installs the canonical copy into `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md`. Architecture-preserving: it ADDS enforcement and reuses existing precedents; it does not restructure routing or the registry.

## 1. THE RULE (invariant)

On every external-CLI dispatch, the orchestrator MUST compose `{resolved agent persona + task prompt}`. A dispatch that sends only the task prompt is a defect: the leaf model runs as a generic assistant and silently loses the agent's tool-scope, verification gates, output contract, and safety framing.

This mirrors the native-dispatch precedent already mandatory in `[runtime_agent_path]/orchestrate.md` → "Agent Loading Protocol (MANDATORY)": *READ the agent definition file → INCLUDE its content in the prompt (or a focused summary for large files) → dispatch.* The contract extends that same discipline to the external-CLI path.

## 2. PERSONA RESOLUTION (runtime-aware — AGENTS.md §7; never hardcode one runtime)

Resolve the agent `.md` from the ACTIVE runtime's agent directory:

| Runtime | Agent directory |
|---------|-----------------|
| Opencode | `.opencode/agents/<name>.md` |
| Claude Code | `.claude/agents/<name>.md` |
| Codex CLI | `.codex/agents/<name>.md` |
| Cursor | `.cursor/agents/<name>.md` |
| Pi | `.pi/agents/<name>.md` |
| Devin | `.devin/agents/<name>.md` |

Map each subtask to the RIGHT persona — not one default:

`code → code` · `review → review` · `design → design` · `research → deep-research` · `exploration/context → context` · `debugging → debug` · `docs/markdown → markdown` · `planning/architecture → ai-council` · `coordination → orchestrate`.

## 3. MECHANISM — NATIVE SURFACE vs INLINE (per mode; corrected after independent verification)

> **Correction (independent cline/DeepSeek verification of P1):** the P1 inventory under-counted native surfaces. It is NOT "only cli-claude-code native, 5 inline uniformly." Cursor and Devin carry native persona-file surfaces (roster mirrors of the canonical `.claude/agents/`), and opencode reaches subagents via a primary. The accurate split is below.

| Mode | Native persona surface | How the orchestrator attaches the resolved persona |
|------|------------------------|----------------------------------------------------|
| `cli-claude-code` | **YES — top-level flag.** `claude -p --agent <name>` resolves `.claude/agents/<name>.md`. | Pass `--agent <name>`. Native load satisfies the rule. |
| `cli-cursor` | **YES — file-convention subagent surface.** `.cursor/agents/*.md` + `.claude/agents/*.md` mirror all 13 canonical agents (symlinked); no `--agent` selector on `-p`. | Dispatch by naming the resolved subagent (discovery-based). **INLINE fallback on a bare `cursor-agent -p`.** |
| `cli-devin` | **YES — `run_subagent` surface.** `.devin/agents/<name>/AGENT.md` mirrors all 13 canonical agents (symlinked); the `.claude/agents` auto-import is broken on the installed CLI. | Dispatch via `run_subagent` naming the resolved profile. **INLINE fallback on a bare top-level `devin -p`.** |
| `cli-opencode` | **PARTIAL — via a primary.** `mode: subagent` personas are rejected at top-level `--agent`; only `orchestrate`/`plan` are primary. | Route `--agent orchestrate` → Task subagent for the resolved persona. **Else INLINE.** |
| `cli-codex` | **NO.** `.codex/agents/*.toml` is TUI-only; `codex exec` / `-p <profile>` load sandbox/effort config, not a persona. | **INLINE (mandatory).** |
| `cli-pi` | **NO.** Core Pi has no persona system; `pi-subagents` / `.pi/agents` are non-core / uninstalled. | **INLINE (mandatory).** |
| shared runtime | **NO separate slot.** `system-deep-loop/runtime/scripts/fanout-run.cjs`. | **INLINE** into the composed prompt string. |

**Rule of thumb:** attach the resolved persona via the mode's native surface where the CLI loads it on the dispatch path (claude-code `--agent`; cursor/devin/opencode by naming the resolved subagent). **INLINE is the universal fallback and is REQUIRED on any bare top-level dispatch that does not name a native subagent** — this is the actual gap the enforcement closes.

## 4. INLINE BLOCK FORMAT (reuse the `DESIGN_DISPATCH_MANIFEST v1` inline-payload pattern)

The persona travels IN the payload because the child cannot resolve skill/agent paths by reference — the same reason `DESIGN_DISPATCH_MANIFEST v1` is inlined rather than linked.

```
=== BEGIN AGENT PERSONA (resolved runtime path: <dir>/<name>.md) ===
<full agent .md content — OR a focused persona summary for very large files / small-context models>
=== END AGENT PERSONA (resolved persona: <name>) ===
You are dispatched AS the @<name> agent defined above. Obey its role, tool-scope,
verification gates, and output contract.

<task prompt>
```

## 5. CONSISTENCY GUARD (mirror `orchestrate.md` "Prompt/Agent Consistency Guard")

Before every dispatch, confirm the inlined (or `--agent`-named) persona MATCHES the subtask's intent/route. The persona named in the block, the resolved definition, and the task body must be the same agent.

## 6. RARE, EXPLICIT EXCEPTIONS (default is ALWAYS attach)

1. **Native surface used** (claude-code `--agent`; cursor/devin/opencode dispatched by naming the resolved subagent per §3): native resolution satisfies the rule; a redundant inline copy is not required.
2. **Small-context model**: substitute a *focused persona summary* (role + tool-scope + output contract + verification gates) for the full `.md`, per `orchestrate.md`'s "or a focused summary for large files".
3. **Pure mechanical command** with no agent semantics (e.g. "run exactly `<cmd>`"): the persona MAY be omitted, but the omission MUST be stated at the dispatch site.

Any exception is declared at the dispatch site; silence is never an exception.

## 7. PLACEMENT PLAN (architecture-preserving)

| Where | What | Phase |
|-------|------|-------|
| `sk-prompt/sk-prompt-models/assets/cli-prompt-quality-card.md` | Canonical "Persona Injection" section (this contract). It is already the single source all 6 cli-* cards + 6 mode SKILLs reference. | P4 |
| Each mode `SKILL.md` (×6) | One numbered Rule (mirroring the existing Rule 10–14 style) that references the canonical contract and states THIS mode's native/inline verdict from §3. | P3 |
| Hub `SKILL.md` | One `✅ ALWAYS` rule + a `REFERENCES` link. Keep the hub thin. | P3 |

## 8. TRACEABILITY

The §3 table was CORRECTED after an independent cli-opencode/cline (DeepSeek V4 Flash @ xhigh, `review` persona) verification of P1 found that the inventory under-counted native surfaces — it wrongly claimed cursor "cannot load role-specific personas." Corrected verdicts trace to source: cursor `cli-cursor/SKILL.md` "Custom Subagents" (`.cursor/agents` + `.claude/agents` mirror, 13 agents); devin `cli-devin/SKILL.md` "Agent Roster Parity" (`run_subagent` + `.devin/agents/<name>/AGENT.md`). The two reuse precedents are `orchestrate.md` "Agent Loading Protocol (MANDATORY)" and each mode's Rule 14 `DESIGN_DISPATCH_MANIFEST v1`. Verification evidence: `../001-analysis-inventory/scratch/p1-verification-cline-deepseek.md`.
