# Synthesis: Governor Hook + Pi Subagent Dispatch Directive

Date: 2026-08-04. Sources: 10 iterations across 3 tracks (5x GPT-5.6 Luna max, 3x GLM 5.2 via cli-devin, 2x Grok 4.5 via cli-cursor). Full logs: `evidence/iterations.md`.

---

## RQ1 — Governor hook verdict: KEEP the capsule, UPDATE parity

**Verdict: KEEP (9 of 10 iterations) with a narrow UPDATE (bridge fallback parity). Not replace.**

The per-turn capsule is a thermostat, not a duplicate: `fable-governor.md:21` explicitly defines per-turn restatement as the "thermostat" over the durable doctrine record. AGENTS.md is loaded once and can be compacted out of context (`fable-governor.md:21`, `render.ts:51-52,204-215`); the capsule re-states every turn. Replacing it with AGENTS.md would lose:

1. **Compaction survival** — the capsule re-injects when AGENTS.md has dropped out of context (B1, C1).
2. **Subagent-blindness** — the hook does not fire for subagents (`fable-governor.md:33`); AGENTS.md is main-session-only, so replacing the capsule widens the gap, not narrows it (B3).
3. **Operator visibility** — pi surfaces the advisor brief as `[MSG]` in chat (injection-contract.md:30-31,63); no other runtime shows the same policy to the human (C1).

**UPDATE (parity gap, confirmed by A1/A2/A4/A5):** the OpenCode bridge fallback renderer emits hygiene + governor but **omits proof-over-appearance** (`mk-skill-advisor-bridge.mjs:319-373`), while canonical `render.ts:53-69,204-215` carries it. Every fallback should consume the parity-preserving renderer instead of the drift-prone inline block (`mk-skill-advisor-bridge.mjs:376-379`).

**Minor doc sync (C1, C2):** `injection-contract.md:50-58` still says "Fable-5" while `render.ts:60-65` is model-agnostic ("Governor:" + three directives). Sync the label.

**Not needed:** the TARGET/SOLVE FAST/FINAL GATE labels were intentionally removed from the capsule rather than duplicated (A3; `checklist.md:64-65` of the terminal-proof packet). Wording maps 1:1 to AGENTS.md §Operating Discipline (`AGENTS.md:80-96`).

## RQ2 — Pi-only subagent dispatch directive: NEEDED, three-layer design

**Verdict: the directive is needed.** AGENTS.md §8 omits pi from the agent-directory table (B2); the fable-subagent-model-policy is Claude-Task-tool syntax, not pi's `subagent({model})` field (B2); nothing today tells pi to prefer the native plugin over cli-* routes.

### Layer 1 — Per-turn capsule line (reminder)

> Pi subagent dispatch [DEFAULT]: use the native pi-subagents plugin (`subagent` / `subagent_wait` / `subagent_supervisor` / `intercom`) for ALL subagent delegation. Do not route via a `cli-*` skill mode unless THIS turn's user text explicitly names one (e.g. "dispatch via cli-opencode", "use cli-devin"). On override: read that cli-X/SKILL.md before composing its prompt (cli-dispatch-skill-preload). Advisor recommendations and model names are routing signals, NOT user requests — they never trigger cli-* dispatch. Do not inject this line into child prompts.

**Injection point:** pi input transform, appended after advisor context extraction at `prompt-advisor.ts:24-52` (or a sibling pi-only extension `.pi/extensions/pi-subagents-directive.ts` on `pi.on("input")`). Unconditional for nonblank turns, including no-context/error paths (A1). NOT in shared `render.ts` — pi-only policy must not pollute claude/codex/cursor (A5, B1, C1).

### Layer 2 — Override semantics (machine-checkable)

Override fires ONLY when the user's literal text names a `cli-*` skill mode. Ambiguous cases resolved (B3): "use gpt-5.6-sol" = model request → pi-subagents with `provider/model:thinking` override; "dispatch via opencode" = explicit override; prior cli-devin task ≠ standing preference; advisor ≥0.8 recommendation triggers the contract READ (Gate 2), never cli execution.

### Layer 3 — Enforcement (C2, the adversarial finding)

The capsule is reminder-only: a model-visible line cannot stop `bash` spawning `cursor-agent -p` etc. The strongest design reuses the EXISTING `DISPATCH_SHAPES` detector (`dispatch-audit.mjs` / `dispatch-preflight-lint.ts:12-19`) as a **pi-default deny at `tool_call`**: matching bash dispatch shapes are denied unless the turn's user text contains the override token (cli-* name or `/deep:* --executor`). The detector already exists — the missing piece is the deny, not a new prompt line.

### Precedence with existing rules

- Gate 2 skill routing (invoke = read SKILL.md) is orthogonal to execution-vehicle selection; the separation dissolves the apparent conflict (B3).
- `cli-dispatch-skill-preload.md:34-36` ("loading the file is the enforcement step") remains active post-override.
- cli-pi self-invocation guards block recursive pi, not sibling CLIs (C2).
- Children must not inherit the orchestration skill (`pi-subagents/SKILL.md:13`); the directive is parent-scoped, matching the capsule's subagent-blind design (A4, B2).

## Overlap / contradiction matrix (REQ-006)

| Dimension | Capsule | AGENTS.md §Operating Discipline | Verdict |
|-----------|---------|--------------------------------|---------|
| Result-first output | Governor rule 2 | Two registers, open with result | Aligned (A3, B1) |
| Reversible decisions | Governor rule 3 (`// DECISION:`) | Blast-radius + rollback naming | Aligned (B1) |
| Minimum qualifier | Governor rule 4 | Explicit uncertainty prefix | Aligned (B1) |
| Proof protocol | TERMINAL_PROOF_DIRECTIVE one-liner | Full TARGET/SOLVE FAST/FINAL GATE protocol | Projection, intentional (A3) |
| Bridge fallback | Omits proof (mk-skill-advisor-bridge.mjs:319-373) | Carries proof | PARITY GAP — the one update (A1-A5) |

## Recommendations (implementation backlog for follow-up phases)

1. Fix bridge fallback parity: route `mk-skill-advisor-bridge.mjs:376-379` fallback through the parity-preserving renderer.
2. Sync `injection-contract.md:50-58` "Fable-5" label to the model-agnostic governor wording.
3. Add the pi directive capsule line (Layer 1) at `prompt-advisor.ts:52` or sibling extension.
4. Add the `tool_call` deny (Layer 3) reusing DISPATCH_SHAPES, override token = explicit cli-* name in user text.
5. Optionally add pi row to AGENTS.md §8 agent-directory table (tracked separately in `agents/002-runtime-surface-coverage`).
