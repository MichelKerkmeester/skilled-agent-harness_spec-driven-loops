---
title: "Devin CLI — Prompt Quality Card"
description: "Fast-path prompt discipline for cli-devin dispatches. Frameworks and CLEAR are canonical in sk-prompt; this card carries Devin model-selection mechanics."
---

# Devin CLI — Prompt Quality Card

Fast-path prompt-quality discipline for cli-devin dispatches. The 7-framework selection table, task-to-framework map, density notes, and CLEAR 5-question check are owned by the canonical card — do not inline them here. This card adds only the Devin-executor mechanics: which Devin model + permission mode fits which task shape.

## 1. OVERVIEW

### Purpose

This card is the Devin CLI fast-path prompt-quality reference; it delegates the framework table + CLEAR check to the canonical card and records only Devin-specific model selection / overrides plus the precedence rule.

### Usage

Compose a dispatch prompt by starting from the shared layer (canonical card), applying the Devin model selection and overrides, and following the precedence rule.

---

## 2. SHARED LAYER (DELEGATED — DO NOT INLINE)

The 7-framework selection table, the task-to-framework map, the pre-planning-density / bundle-gate / anti-hallucination notes, and the CLEAR 5-question check are OWNED by the canonical card. Do NOT copy them here. The canonical CLEAR (Correctness / Logic / Expression / Arrangement / Reusability) is the single CLEAR for the cli-* family — cli-devin does not define its own.

-> `../../sk-prompt/assets/cli_prompt_quality_card.md`
(deep theory: `../../sk-prompt/references/patterns_evaluation.md`)

## 3. DEVIN MODEL SELECTION & OVERRIDES

cli-devin dispatches several profiled models. Pick the Devin model + permission mode by task shape, then compose the prompt with the canonical framework named below. These rows are EXECUTOR MECHANICS (model routing + permission mode), NOT prompt frameworks — the framework column points back to the canonical card's owned set.

| Task shape | Devin model | Permission mode | Canonical framework | Hub profile |
|------------|-------------|-----------------|---------------------|-------------|
| Clearly-scoped single-file / small multi-file coding | `swe-1.6` | `auto` | `RCAF` | `../../sk-prompt-small-model/references/models/swe-1.6.md` |
| Narrative-heavy / context-gathering coding | `swe-1.6` | `auto` | `RCAF` (profile fallback `STAR`) | `../../sk-prompt-small-model/references/models/swe-1.6.md` |
| Well-defined multi-file refactor | `swe-1.6` (escalate to `deepseek-v4-pro` as complexity grows) | `auto` | `RCAF` (profile fallback `BUILD`) | `../../sk-prompt-small-model/references/models/swe-1.6.md` · `.../deepseek-v4-pro.md` |
| Security review / RCA / architecture review | `deepseek-v4-pro` | `auto` | Hub profile (RCAF default; see `../../sk-prompt-small-model/references/models/deepseek-v4-pro.md`) | `../../sk-prompt-small-model/references/models/deepseek-v4-pro.md` |
| Complex refactor with cross-cutting context | `deepseek-v4-pro` (large-context fallback `kimi-k2.6`) | `auto` | Hub profile (RCAF default; see `../../sk-prompt-small-model/references/models/deepseek-v4-pro.md`) | `../../sk-prompt-small-model/references/models/deepseek-v4-pro.md` · `.../kimi-k2.6.md` |
| Agentic / tool-use-heavy review (e.g. cross-MCP correlation) | `glm-5.1` | `auto` | Hub profile (RCAF default; see `../../sk-prompt-small-model/references/models/glm-5.1.md`) | `../../sk-prompt-small-model/references/models/glm-5.1.md` |
| Async cloud session | per task shape above | operator-approved | per task shape above | see `../references/cloud_handoff.md` |

Read the hub profile before composing for any profiled model — it may prescribe a different framework, pre-planning density, or bundle-gate strictness than the cross-model defaults (tier-2 of §3). The SWE-1.6 mandatory pre-planning contract (ordered steps + acceptance criteria + stop conditions + verification) is owned by `../../sk-prompt-small-model/references/models/swe-1.6.md` — it is not restated here.

### Pre-dispatch addendum — permission mode (Devin-specific, not a CLEAR axis)

Before each `devin --prompt-file` invocation, confirm the permission mode matches the work: `auto` is the default; `dangerous` and other escalations require explicit operator approval recorded in the dispatch log. This is an executor pre-flight check, NOT a competing CLEAR definition — CLEAR is canonical (§1).

## 4. DELEGATION / PRECEDENCE

The 3-tier precedence rule (fast path -> model override -> deep path) is canonical in `../../sk-prompt/assets/cli_prompt_quality_card.md` and restated in `../SKILL.md`. Apply it in order; stop at the first tier that fully covers the task:

- **Tier 1 (fast path):** build the prompt from the canonical card — select a framework, run the CLEAR check, dispatch.
- **Tier 2 (model override):** when dispatching a profiled model, honor the model profile at `../../sk-prompt-small-model/references/models/<id>.md` — it overrides the cross-model defaults. (This replaces cli-devin's former "every dispatch MUST be composed through sk-prompt" mandate.)
- **Tier 3 (deep path):** dispatch `@prompt-improver` via the Task tool when any canonical Tier 3 trigger applies: complexity >= 7/10, compliance/policy/privacy/security sensitivity, >1 stakeholder or audience, >1 ambiguous requirement, or the fast-path CLEAR check cannot clear its floor; hand the returned `ENHANCED_PROMPT` to the `devin` invocation.

## 5. RELATED RESOURCES

-> `../../sk-prompt/assets/cli_prompt_quality_card.md` · `./prompt_templates.md` (copy-paste templates + composition patterns A/B/C) · `../SKILL.md` · `../../sk-prompt-small-model/references/models/` (per-model profiles)

- Memory Handback: when a dispatch produces continuity-worthy state, request a `MEMORY_HANDBACK` block in the prompt and run the canonical protocol — see `./prompt_templates.md` §8 and `../../system-spec-kit/references/cli/memory_handback.md`.
