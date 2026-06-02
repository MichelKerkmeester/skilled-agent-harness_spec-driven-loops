---
title: Prompt Quality Card
description: Fast-path framework selection and CLEAR checks for OpenCode CLI prompt construction.
---

# Prompt Quality Card

Fast-path prompt-quality guidance for OpenCode CLI dispatches. Use this asset before building a routine `opencode run` prompt so the router stays lightweight while still applying framework selection and a quick CLEAR pass.

## 1. OVERVIEW

### Purpose

Provide a small, always-load asset for OpenCode CLI prompt construction that improves quality without pulling in the full prompt-engineering skill on routine dispatches.

### Usage

Select a framework from the task map, run the CLEAR 5-check, and escalate to `@prompt-improver` when the task crosses the fast-path risk threshold.

---

## 2. Framework Selection Table

| Framework | Best for | Complexity band | Core components |
|-----------|----------|-----------------|-----------------|
| `RCAF` | General implementation, edit, and documentation prompts | 1-6 | Role, Context, Action, Format |
| `COSTAR` | Audience-aware communication and content generation | 3-6 | Context, Objective, Style, Tone, Audience, Response |
| `RACE` | Fast single-output tasks where speed matters most | 1-3 | Role, Action, Context, Execute |
| `CIDI` | Process instructions, tutorials, and SOP-style prompts | 4-6 | Context, Instructions, Details, Input |
| `TIDD-EC` | Compliance, review, and quality-critical prompts | 6-8 | Task, Instructions, Do's, Don'ts, Examples, Context |
| `CRISPE` | Research, strategic exploration, and option generation | 5-7 | Capacity, Insight, Statement, Personality, Experiment |
| `CRAFT` | Complex multi-stakeholder planning and analysis | 7-10 | Context, Role, Action, Format, Target |

---

## 3. Task to Framework Map

| Task | Framework |
|------|-----------|
| Generation | `RCAF` |
| Review | `TIDD-EC` |
| Research | `CRISPE` |
| Edit | `RCAF + TIDD-EC` |
| Analyze / plan | `CRAFT` |
| Parallel detached session (use case 2) | `CIDI` |
| Cross-AI handback (use case 3) | `RCAF + TIDD-EC` |

> **Pre-planning density**: For non-trivial dispatches (multi-step tasks, code generation with acceptance criteria, anything touching more than one file), prefer **medium-density pre-planning** — 3-4 ordered steps with per-step acceptance criteria + verification command. Dense pre-plans (4+ steps with full I/O contracts per step) add prompt cost without clear yield — medium pre-planning matches or beats dense on every measured model. Lighter pre-plans leave too much structural decision-making to the model.
>
> **Bundle-gate strictness**: Keep bundle-gate / acceptance-verification language at the "standard" level (single-layer check or implicit acceptance verification). Strict bundle-gate wording (multi-layer enforcement clauses, "smoke-run required", aggressive validation insistence) underperforms standard across every measured model — verbose constraints push models toward defensive output (more disclaimers, fewer direct code blocks) rather than the discipline the strict wording is trying to elicit.
>
> **Anti-hallucination wording is a secondary lever, not the primary one.** Framework choice (RCAF role anchor) is ~2.4× more impactful than aggressive anti-hallucination wording across measured models. Anti-hallucination wording is useful as a backstop for high-risk fixture clusters (CLI flag invention, library symbol references), but don't expect it to outweigh framework choice or pre-planning density.
>
> **Per-model override — MiniMax (Token Plan default `minimax-coding-plan/MiniMax-M3-highspeed`, fallback `minimax-coding-plan/MiniMax-M2.7-highspeed`) → TIDD-EC + dense pre-planning.** The 120/003 benchmark (real MiniMax M2.7 runs across the 7-fixture rig) found MiniMax diverges from the cross-model defaults above: **TIDD-EC** (guardrail-heavy: Task/Instructions/Do's/Don'ts/Examples/Context) beats RCAF (0.767 vs 0.742), and **dense** pre-planning beats medium (0.775 vs 0.767) — the opposite of the medium-pre-plan default. For MiniMax dispatches, default to TIDD-EC with a dense 4-5 step pre-plan (carried forward to M3 until re-benchmarked); RCAF is the fallback. Omit `--agent`. See `cli-opencode/assets/prompt_templates.md` §MiniMax and `.opencode/specs/skilled-agent-orchestration/120-cli-opencode-minimax-optimization/003-minimax-prompt-framework-benchmark/eval-loop/synthesis.md`.
>
> **Per-model override — MiMo (`xiaomi-token-plan-ams/mimo-v2.5-pro`) → COSTAR + lean (RACE fallback).** The 126/004 benchmark (10/10 real MiMo-V2.5-Pro runs) found MiMo is the **opposite of MiniMax**: **COSTAR** wins (composite 1.0000), **RACE** is a statistical tie (0.9934), and the guardrail-heavy **TIDD-EC that won for MiniMax came DEAD LAST** for MiMo. MiMo is frontier-correct on every framework (100% assertion pass across the board), so the discriminator is **format adherence + token efficiency, not correctness** — lean output/audience-framed prompts (COSTAR `Style: "no preamble"` + `Audience: "automated suite"`) suppress the explanatory preamble that CIDI/RCAF/TIDD-EC leak. Default to **COSTAR with lean-to-medium pre-planning**; RACE is the fallback. Do **not** use TIDD-EC/dense (ranked last; ~2.4× longer output) and avoid CIDI (intermittent tool-only file-writes instead of inline code). Always pass **`--variant high`** (opencode maps low/medium/high to MiMo's reasoning effort; high is the standing default). Omit `--agent`. (Re-benchmarked at `--variant high`: COSTAR co-wins; at high reasoning the framework field compresses so the choice matters *less*, but COSTAR/RACE-lean stays the safe default.) See `cli-opencode/assets/prompt_templates.md` §MiMo, `.../004-mimo-prompt-framework-benchmark/eval/synthesis.md`, and `.../eval/synthesis-high-reasoning.md`.

---

## 4. CLEAR 5-Check

- Correctness: Does the prompt describe the real task and files without contradiction?
- Logic: Does it explain how the dispatched OpenCode session should reason or decide?
- Expression: Is the wording specific enough to avoid guesswork?
- Arrangement: Is the order task -> context -> constraints -> output -> verification?
- Reusability: Could this prompt be reused by swapping placeholders?

---

## 5. Escalate to `@prompt-improver`

Use Task-based escalation when complexity is `>= 7/10`, compliance or security sensitivity appears, more than one stakeholder matters, or more than one requirement is unclear.

OpenCode-specific example: if the task would otherwise need a long `opencode run` prompt plus an explicit Memory Epilogue and a parallel-session decision, ask `@prompt-improver` for the final `ENHANCED_PROMPT` first and then pass that result to OpenCode.

---

## 6. Failure Patterns

- Missing output format or success criteria
- Unbounded scope
- Vague verbs
- No repo or file anchors
- No "do not change" guardrails
- Ambiguous use case (1 vs 2 vs 3) — the smart router cannot pick a path
- Missing self-invocation guard signal in dispatched session

---

## 7. Related Resources

- `../../sk-prompt/assets/cli_prompt_quality_card.md`
- `./prompt_templates.md`
- `../SKILL.md`

