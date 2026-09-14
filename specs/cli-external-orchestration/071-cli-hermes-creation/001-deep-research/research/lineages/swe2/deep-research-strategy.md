---
title: Deep Research Strategy - swe2 lineage
description: Lineage-local strategy for Hermes Agent seventh-runtime research (second, deepening pass).
trigger_phrases:
  - "hermes headless dispatch contract"
  - "hermes fan-out fitness"
importance_tier: important
contextType: research
version: 1.15.0.0
---

# Deep Research Strategy - Session Tracking

Lineage: swe2. Executor: cli-devin / swe-2-max. Stop policy: max-iterations (5). Convergence is telemetry only.

## 1. OVERVIEW

### Purpose

Persistent research plan for the Hermes Agent (v0.21.1, `~/.hermes`) seventh-runtime investigation. This lineage is the five-iteration deepening pass of the two-lineage fan-out: the ten-iteration sibling (`deepseek`) works the ten angles of `research-angles.md` in order as the first pass; this lineage deepens the five angles carrying the most decision weight and the most open questions after `resource-map.md` — the decision spine dispatch → roster → fan-out fit → comparison → plan.

---

## 2. TOPIC

Hermes Agent (Nous Research, installed at ~/.hermes, v0.21.1) as the seventh cli-external-orchestration runtime: what it can and cannot do as a headless dispatch target; how its providers, repo-local .hermes configuration, skills, agents, commands, hooks, plugins and MCP host compare with the six existing runtimes; whether it is fit for deep-loop fan-out; and what phase plan the integration should follow.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
Generated from the reducer registry.

- [ ] Angle 1: What is Hermes's exact non-interactive dispatch contract — flags, exit codes, `-Q` stdout shape, session id — and how does it compare with `devin -p`, `pi -p`, `claude -p`, `codex exec`, `opencode run`, `cursor-agent -p`?
- [ ] Angle 2: Which providers/models can Hermes reach with the credential kinds on this machine, how do `--reasoning` levels map, and what would a closed fail-closed `HERMES_SUPPORTED_MODELS` roster look like?
- [ ] Angle 8: What does a `buildHermesLineageCommand` need — write-permitting flags, approval semantics, timeout, stdin, state isolation, env passthrough, self-invocation signal, exit-code trust — and do Hermes's out-of-repo writes matter to the write-containment guard?
- [ ] Angle 9: Where does Hermes cost more or less than the six runtimes — install, startup, background subsystems, persona, memory injection, sandbox, approvals, telemetry — and which differences need hard rules in the skill packet?
- [ ] Angle 10: Given the evidence, what is the ranked phase plan for 002+ — which candidate phases merge/split/drop, what stays UNKNOWN pending a live contract pin, what does the operator decide?
<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Shipping any integration code; this phase produces findings and a plan, not code.
- Modifying `~/.hermes/` or running any mutating `hermes` command (no `config set`, `skills install`, `plugins install`, `mcp add`, `skills trust`, `import-agent`, `setup`, `update`).
- Hermes messaging gateways, cron, kanban, voice, desktop, TUI skins, pets, journeys (per `research-angles.md` out-of-bounds).
- Re-deriving `resource-map.md` content; cite it, do not rediscover it.
- First-pass coverage of angles 3-7 (`.hermes/` folder, skill format, agents/commands, hooks/plugins, MCP): the sibling `deepseek` lineage owns those; this lineage pulls only the residual evidence the angle-9 comparison table needs.

---

## 5. STOP CONDITIONS
- Max iterations reached (5). Stop policy is `max-iterations`; early composite convergence is telemetry only.
- All five key questions have evidence-backed answers, including a ranked phase plan.
- Three consecutive stuck iterations with no new sources (recovery then synthesis with gaps).

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
(none yet)
<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
(none yet)
<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
(none yet)
<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
(none yet)
<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
(none yet)
<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: all five key questions open
<!-- /ANCHOR:divergence-frontier -->

---

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
(none yet)
<!-- /ANCHOR:carried-forward-open-questions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Iteration 1 (Angle 1): pin Hermes's headless dispatch contract — `hermes chat` flags on a non-TTY, exit codes, `-Q` stdout shape and session id, versus the six runtimes' documented headless forms; run `hermes status` first and at most one capped smoke dispatch if a provider is configured.
<!-- /ANCHOR:next-focus -->

---

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT

resource-map.md present at the spec root; 58 references, 0 missing on disk (observed 2026-09-14). Known inventory cited, not rediscovered.

### Bounded Context Snapshot

- Source pointers:
  - `~/.hermes/hermes-agent/hermes_cli/_parser.py` — flag surface: `-q/--query`, `--query-file -` reads stdin, `--oneshot` implied on non-TTY and by `-Q`, `-Q/--quiet`, `--yolo`, `--max-turns`, `--run-budget`, `--in`, `--worktree`, `--ignore-rules`, `--ignore-user-config`, `--safe-mode`, `--accept-hooks`, `--pass-session-id`, `--resume` (resource-map §2).
  - `~/.hermes/hermes-agent/agent/coding_context.py:35,38` — `AGENTS.md`, `CLAUDE.md`, `.cursorrules` read from working directory.
  - `~/.hermes/hermes-agent/agent/prompt_builder.py:1223,1388,1465-1578` — SOUL.md + instruction-file loaders; trusted project skill dirs as highest-precedence tier.
  - `~/.hermes/hermes-agent/agent/skill_utils.py:410,490` — `PROJECT_SKILLS_SUBDIRS = (".hermes/skills", ".agents/skills")`; walks up ≤64 levels.
  - `~/.hermes/hermes-agent/cli-config.yaml.example` — provider list: `auto openrouter nous nous-api anthropic openai-codex copilot gemini zai kimi-coding minimax minimax-cn huggingface nvidia xiaomi arcee ollama-cloud deepinfra kilocode ai-gateway azure-foundry lmstudio custom`.
  - `~/.hermes/config.yaml` — only `plugins.enabled: [orca-status]`; `~/.hermes/.env` key names only, never values.
  - `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` — `buildDevinLineageCommand` ~line 2403, `buildPiLineageCommand` ~line 2515; per-lineage env `SYSTEM_SPEC_GATE_DISABLED=1`, `AI_SESSION_CHILD=1`.
  - `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-config.ts` — `EXECUTOR_KINDS` (l.11), flag support (l.79-99), sandbox map (l.124), web-search matrix (~l.164), `DEVIN_SUPPORTED_MODELS` (l.362-379), `PI_SUPPORTED_MODELS` + `isPiModelAllowed`.
  - `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` — state-dir env by kind (l.80-91), `SELF_PRESENCE_EXEMPT_KINDS` (l.108), session env prefixes (l.133-152).
  - `.opencode/hooks/dispatch/lib/dispatch-audit.mjs:28-36` — binary regex table for the six runtimes.
  - `.opencode/skills/cli-external-orchestration/cli-*/SKILL.md` + `references/cli-reference.md` — the six modes' headless contracts and hard rules.
- Reuse candidates: `cli-pi` packet shape (closed roster + `pi-availability-required` + self-dispatch carve-out) is the precedent a `cli-hermes` packet mirrors; `hermes profile` for per-lineage state isolation; `hermes mcp`/`hooks`/`plugins` read-only subcommands for capability enumeration.
- Integration points: hub `mode-registry.json`/`hub-router.json`/`ROUTER.md`; `executor-config.ts` `EXECUTOR_KINDS`; `combo-matrix.vitest.ts` per-kind tables; `dispatch-audit.mjs` regex table; repo-root `.hermes/` (PLANNED).
- Constraints and risks: no mutating `hermes` commands; smoke dispatches capped at 2 of the exact shape `hermes chat -Q --oneshot --max-turns 1 --run-budget 60 -q "Reply with the single word OK" </dev/null`; write surface is this lineage directory only; no `generate-context.js`, `validate.sh`, or git writes.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only; stopPolicy = max-iterations)
- Per-iteration budget: 12 tool calls
- Progressive synthesis: true
- research.md ownership: workflow-owned canonical synthesis output at this lineage root (`research.md`) with the full synthesis at `research/research.md`
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11A, including Section 10A
- Canonical pause sentinel: `.deep-research-pause` in this lineage directory
- Current generation: 1
- Started: 2026-09-14T16:30:00Z
- Write surface: `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/research/lineages/swe2` only

---

## Final status — 2026-09-14

All 5 planned angles executed (1→2→8→9→10). stopReason: `maxIterationsReached`.
Synthesis: `research.md` · `findings-registry.json` (29 findings / 7 ruled-out / 6 unknowns) · `deep-research-dashboard.md`.
Verdict: integrate `cli-hermes`, gated on phase-002 provider pin + live smoke.
