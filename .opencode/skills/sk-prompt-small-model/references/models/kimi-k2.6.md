---
title: "Kimi-k2.6 Prompt-Craft Profile"
model_id: "kimi-k2.6"
profile_of: "../../../sk-prompt-small-model/assets/model-profiles.json"
status: default-unverified
last_benchmarked: "none"
---

# Kimi-k2.6 Prompt-Craft Profile

Single source of truth for how to prompt Kimi-k2.6 in the small-model rotation. Framework choices mirror `recommended_frameworks` in the model-profiles registry (the DATA source); executor MECHANICS live in `cli-devin` / `cli-opencode`.

---

## 1. Identity

| Field | Value |
| --- | --- |
| Model slug | `kimi-k2.6` |
| Context window | 200,000 tokens |
| Primary quota pool | `cognition-pro` (shared with DeepSeek-v4-pro, GLM-5.1) |
| Executor path A | `cli-devin` → provider `cognition` → pool `cognition-pro` |
| Executor path B | `cli-opencode` → provider `opencode-go` → pool `opencode-go` |
| Avg iteration wall-clock | ~22 min |
| Fallback target | none |

Kimi-k2.6 is the **large-context specialist** in the rotation — 200 k tokens makes it the first choice for sprawling diff reviews, long-file inspection, multi-repo evidence gathering, and cross-cutting refactors that would overflow the context of the 32 k / 64 k / 128 k siblings. It carries a documented ~5–10% hang rate on complex fixtures (see the `cli-opencode` SKILL.md §3); always set a `gtimeout` wrapper on automation paths.

---

## 2. Recommended Framework

**Primary:** RCAF  
**Fallback:** none specified in registry  
**Avoid:** none specified in registry  
**Pre-planning density:** MEDIUM

These choices mirror `recommended_frameworks` in [`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) entry `kimi-k2.6` (the DATA source of truth). See `patterns_evaluation.md` for the generic RCAF, COSTAR, and RACE definitions — this profile records the per-model choice and rationale only.

**Why RCAF for Kimi-k2.6:** RCAF's four elements — Role, Context, Action, Format — map cleanly onto large-context work. The model's primary strength is absorbing wide context and synthesising across many files; RCAF lets you front-load that in the `Context` block while keeping the action and output format explicit. The registry does not specify TIDD-EC or COSTAR for Kimi-k2.6, and no model-specific benchmark has compared them. Medium pre-planning density is appropriate: enough caller-side scoping to keep the action bounded, without importing MiniMax's dense guardrail pattern.

**Counter-intuitive note:** Kimi-k2.6's large context window is a capability, not a licence to send unstructured dumps. Prompt structure still matters — pad the `Context` block with explicit file anchors and line ranges rather than trusting the model to self-select from a raw paste. This keeps the action section tight and makes the output verifiable.

---

## 3. Benchmark Evidence

No model-specific benchmark has been run for Kimi-k2.6. The registry entry records `benchmark: null`, `primary_score: null`, `sample: "no model-specific benchmark"`, `confidence: "low"` — reproduced verbatim from the DATA source.

**Reasoned default rationale:** RCAF at medium pre-planning density is the convention default for all `default-unverified` models in this rotation (SWE-1.6, DeepSeek-v4-pro, Qwen3.6, GLM-5.1 all share this assignment). For Kimi-k2.6 specifically, two additional factors reinforce the default:

1. The model's use case (large-context synthesis, sprawling diff review) aligns with RCAF's strengths: wide context staging in the `Context` block, clear scoped action, structured output format.
2. Medium pre-planning density fits the typical Kimi-k2.6 dispatch (multi-file or multi-repo tasks where the caller can name the scope but cannot hand the model a line-level plan).

Until a dedicated benchmark is run (fixtures covering long-file analysis and cross-file refactor), treat the RCAF default as a reasonable but unvalidated starting point. Do not carry scores from sibling models — their contexts differ enough that score transfer would be misleading.

---

## 4. Tuned Template Snippet

The generic RCAF framework definition and its full layered-RCAF YAML are defined in [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md) § 3 "RCAF Mastery Patterns" — do not restate them here.

The scaffold below is the Kimi-k2.6-specific fill of the RCAF body. Copy-paste-ready; executor-agnostic (no opencode/devin invocation wrapper included — those live in the executor cards).

```text
## Role
You are a senior software engineer specialising in [domain: e.g. TypeScript / Python / Go].
Your task requires reading across [N] files / [N] repos and producing a unified analysis.

## Context
<!-- LARGE-CONTEXT ANCHOR BLOCK — keep explicit; do not paste raw file dumps -->
Target files / ranges:
  - <path/to/file-A.ts>  (lines <start>–<end> or "full file")
  - <path/to/file-B.py>  (lines <start>–<end> or "full file")
  [add entries for every relevant file or module]

Background:
  - [One-paragraph description of the codebase area, its purpose, and why this task exists]
  - Constraints: [Any hard limits — API compatibility, performance envelope, do-not-touch areas]
  - Related prior work: [PR/commit/spec link if relevant]

## Action
[Single primary directive, e.g.:]
  "Review all listed files for <concern> and produce a ranked list of findings."
  OR
  "Refactor <pattern X> to <pattern Y> across all listed files, maintaining the existing public API."

Pre-plan (medium density):
  1. Read each anchored file in the order listed above.
  2. Identify occurrences of [target pattern / concern].
  3. [Next logical step — e.g. "Group by severity" or "Produce a unified diff".]
  4. Verify the output satisfies [acceptance criterion].

## Format
Output:
  - [Structured list / unified diff / markdown table — pick one]
  - Max [N] items or [N] lines; favour precision over completeness.
  - Include file path + line number for every finding or edit.
  - End with a one-paragraph summary of confidence and any unresolved ambiguities.
```

**Kimi-k2.6-specific notes for the scaffold:**

- Keep `Context` as the longest block — this is where the model's 200 k window earns its place.
- The `Action` pre-plan should name files in the same order as the `Context` block; Kimi-k2.6 is sensitive to ordering mismatches on long contexts.
- Avoid open-ended `Action` directives like "analyse and improve" — scope to one concern per dispatch to keep results verifiable.

---

## 5. Dispatch Gotchas

Model-specific capability fields and flags are sourced from the `kimi-k2.6` entry in [`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json). Full dispatch wrappers live in [`cli-devin`](../../../cli-devin/SKILL.md) and [`cli-opencode`](../../../cli-opencode/SKILL.md); this section does not own wrapper syntax.

| Field | Value | Implication |
| --- | --- | --- |
| `model_slug` | `kimi-k2.6` | Pass as-is to the executor; no `-highspeed` suffix or variant slug for this model. |
| `variant_flag` | not declared | No `--variant` flag for this model; omit entirely. |
| `agent_policy` | not declared | No `--agent` flag documented; omit unless executor-specific docs say otherwise. |
| `format_mode` | not declared | No JSON envelope constraint; plain text output is expected. |
| `quota_pool` | `cognition-pro` (cli-devin) / `opencode-go` (cli-opencode) | Both pools are shared across multiple models. Check pool exhaustion before dispatching; no same-pool fallback target is configured. |
| `fallback_target` | `null` | When both pools are exhausted there is no automated fallback model. Escalate or defer. |
| `avg_iter_wall_clock_min` | ~22 | Size timeout headroom via the executor-owned wrapper; complex fixtures may run longer. |
| Hang rate | ~5–10% documented | On complex fixtures (cli-opencode SKILL.md §3). Use the executor-owned timeout wrapper. |

**Non-TTY automation rule (executor mechanic):** In any non-interactive automation context, append `</dev/null` to the executor-owned invocation wrapper to prevent stdin blocking. Use the wrapper from [`cli-devin`](../../../cli-devin/SKILL.md) or [`cli-opencode`](../../../cli-opencode/SKILL.md), not this profile.

**Fallback target:** none. If `cognition-pro` is exhausted, switch to the `opencode-go` executor path. If both pools are exhausted, defer the task — do not retry against the same pool.

---

## 6. See Also

- [`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) `#kimi-k2.6` — Registry entry; the authoritative DATA this profile mirrors.
- [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md) — Generic framework definitions (RCAF § 3, full framework library).
- [`../../../cli-devin/SKILL.md`](../../../cli-devin/SKILL.md) — Executor MECHANICS for the cli-devin path (cognition-pro); budget, verification, timeout wrappers.
- [`../../../cli-opencode/SKILL.md`](../../../cli-opencode/SKILL.md) — Executor MECHANICS for the cli-opencode path (opencode-go); hang-rate note, non-TTY rule, permissions.
- [`../../../cli-opencode/assets/prompt_templates.md`](../../../cli-opencode/assets/prompt_templates.md) — Executor prompt-pack templates (MiniMax TIDD-EC + MiMo COSTAR templates as worked examples of the format).
- [`../pattern-index.md`](../pattern-index.md) — Index of all executor-owned MECHANICS patterns + ship status.
- [`../models/_index.md`](../models/_index.md) — Sibling model index; see GLM-5.1 and DeepSeek-v4-pro for cognition-pro pool peers.
- **Executor quality cards (card↔profile round-trip):** [`../../../cli-devin/assets/prompt_quality_card.md`](../../../cli-devin/assets/prompt_quality_card.md) · [`../../../cli-opencode/assets/prompt_quality_card.md`](../../../cli-opencode/assets/prompt_quality_card.md) — the model-selection tables link to this profile; this closes the navigability round-trip.
