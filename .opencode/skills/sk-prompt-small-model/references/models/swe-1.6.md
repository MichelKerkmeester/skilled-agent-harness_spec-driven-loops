---
title: "SWE-1.6 — Prompt-Craft Profile"
model_id: "swe-1.6"
profile_of: "../../../sk-prompt-small-model/assets/model-profiles.json"
status: "default-unverified"
last_benchmarked: "none"
---

# SWE-1.6 — Prompt-Craft Profile

Single source of truth for how to prompt SWE-1.6 via `cli-devin`. Mirrors
`sk-prompt-small-model/assets/model-profiles.json#swe-1.6 recommended_frameworks` (the DATA
source). Executor MECHANICS (flags, wrappers, budgets) live in `cli-devin` — follow
`../pattern-index.md` to those files; do not look for them here.

---

## 1. Identity

| Field | Value |
| --- | --- |
| Slug | `swe-1.6` |
| Context window | 128,000 tokens |
| Quota pool | `cognition-free` (Cognition free tier; no Pro quota burn) |
| Executor path | `cli-devin` → provider `cognition` |
| Free tier | Yes — default path when Cognition Pro is exhausted |
| Avg. wall-clock per iteration | ~7 min |

SWE-1.6 is a code-specialized model dispatched exclusively through `cli-devin` on the
Cognition free tier. It is fast, tool-use friendly, and the default choice for
clearly-scoped coding tasks that do not require deep multi-step reasoning. Its one
hard constraint is that the calling AI must supply structured decomposition upfront —
SWE-1.6 does not self-plan reliably without it.

---

## 2. Recommended Framework

**Primary:** RCAF (Role / Context / Action / Format)
**Fallback:** none in the registry (`fallback: null`) — RCAF is the only registry-backed
framework for SWE-1.6.
**Profile-level Devin options (NOT canonical frameworks — defined in no registry):** STAR
(Situation / Task / Action / Result) for narrative-heavy tasks where role framing does not
fit naturally, and BUILD (Bounds / User-need / Implementation / Limits / Done-when) for
well-defined multi-file refactors where scope boundaries dominate. Keep both as cli-devin
profile guidance only.
**Registry avoid list:** none (`avoid: []`). Dense pre-plans and strict bundle-gate /
aggressive constraint language are profile-level cautions, not registry avoid entries.

**Pre-planning density:** medium (3–4 ordered steps; see §4 scaffold).

These choices mirror `recommended_frameworks` in
[`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json)
(`id: "swe-1.6"`, `primary: "rcaf"`, `fallback: null`, `avoid: []`,
`preplanning_density: "medium"`). That JSON is the DATA source of truth; STAR, BUILD,
and the cautionary avoid wording above are profile-level cli-devin guidance, not registry
data (STAR/BUILD are not canonical sk-prompt framework ids).

**Why RCAF is the default.** The role anchor gives SWE-1.6 immediate framing without
burning tokens on situation-setting, producing tighter and more focused output with
less prose preamble and more direct code.

**Why medium pre-planning.** The registry specifies medium density. Keep the plan to
3–4 steps so it surfaces ambiguity early without becoming the task itself.

**Profile-level caution — strict bundle-gate wording.** Verbose constraint
language ("smoke-run required", aggressive anti-hallucination clauses, multi-layer
enforcement imperatives) pushes SWE-1.6 toward *defensive* output: more disclaimers,
more caveats, less direct code. Trust the RCAF structure and the pre-plan to do the
work; do not pile on imperatives. This caution is not a registry `avoid` entry.

---

## 3. Benchmark Evidence

No model-specific benchmark has been run for SWE-1.6 under this hub. The profile
status is **default-unverified**.

**Reasoned default (source: `model-profiles.json` evidence fields + contract prose):**

The RCAF + medium pre-planning default comes from `model-profiles.json` and the
SWE-1.6 caller-side pre-planning contract in `cli-devin`, not a head-to-head
framework bakeoff. The registry names RCAF as primary and `fallback: null`. STAR and
BUILD, dense-plan cautions, and strict bundle-gate cautions are profile-level cli-devin
task-shape guidance; they are not registry fallback or avoid entries.

**Discriminator (notional):** If a benchmark were run, the primary discriminator
would be correctness on clearly-scoped single-file and multi-file coding tasks (not
format adherence or token efficiency), since that is SWE-1.6's declared strength and
the domain of the contract.

Confidence: **low** (contract basis, no head-to-head run).
Sample: mandatory caller-side pre-planning contract (no fixture rig).

---

## 4. Tuned Template Snippet

The scaffold below is the canonical RCAF + medium pre-planning shape for SWE-1.6.
It is copy-paste ready and executor-agnostic (no `devin` invocation wrapper here —
that lives in `cli-devin/assets/prompt_templates.md` §2).

For the generic RCAF framework definition, see
[`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md).

```
<framework>RCAF</framework>

<role>
Senior implementation engineer working on <stack — e.g. typescript-react, python-fastapi, go-stdlib>.
Your job is to produce code that satisfies the acceptance criteria exactly, staying strictly in scope.
</role>

<context>
Calling AI: <runtime + model>
Spec folder: <path — pre-approved, skip Gate 3> OR none
Active surface: <stack from sk-code>
Existing files in scope: <list>
Allowed writes: <list of paths SWE-1.6 may touch — scope-creep is a hard fail>
Context budget: Tool results may include markers like `[... truncated N tokens]`.
  Treat those markers as intentional budget boundaries: do not assume omitted content
  is absent, do not invent the omitted section, request narrower evidence if the
  missing span is required.
</context>

<pre-plan>
Restate the task as 4 things BEFORE writing any code:

1. Expected outputs (exact files, function signatures, return types, behavior)
2. Available inputs / state (existing files, dependencies, repo conventions)
3. Ordered steps — medium density, 3 to 4 steps:
   a. <step a>
   b. <step b>
   c. <step c>
4. Verification step that proves the work is done: <exact command>

Execute the plan. Stop after each step and confirm the artifact matches the plan
before proceeding to the next step. If any step proves harder than expected
(ambiguous input, surface mismatch, test that will not run), STOP and escalate —
do not silently push past the plan.
</pre-plan>

<action>
<one-line goal — derived from step 1 of the pre-plan>
</action>

<format>
- Code in fenced markdown blocks with file paths in comments.
- Inline verification commands at the end that prove acceptance.
- Do not modify files outside <Allowed writes>.
</format>
```

**Profile-level option — STAR (narrative-heavy or context-gathering tasks; a cli-devin task-shape, not a registry fallback):** Replace
`<framework>RCAF</framework>` with `<framework>STAR</framework>` and restructure:
`<situation>`, `<task>`, `<action>`, `<result>`. Retain the `<pre-plan>` block at
medium density.

**Profile-level option — BUILD (multi-file refactor where scope boundaries dominate):** Use
`<bounds>`, `<user-need>`, `<implementation>`, `<limits>`, `<done-when>`. Retain
`<pre-plan>` at medium density. Do NOT add strict bundle-gate wording when using BUILD
with SWE-1.6; this is cli-devin profile guidance, not a registry fallback.

---

## 5. Dispatch Gotchas

Source of truth for model-specific capability fields and flags:
[`../../../sk-prompt-small-model/assets/model-profiles.json`](../../../sk-prompt-small-model/assets/model-profiles.json) `id: "swe-1.6"`. Full invocation wrappers live in [`cli-devin`](../../../cli-devin/SKILL.md); this profile records wrapper inputs, not wrapper syntax.

| Field | Value | Notes |
| --- | --- | --- |
| `model_slug` | `swe-1.6` | Positional or `--model swe-1.6` in cli-devin |
| `variant_flag` | (none) | No variant flag for SWE-1.6; `model-profiles.json` has no `capability.variant_flag` entry |
| `agent_policy` | (none) | No `--agent` restriction documented; `model-profiles.json` has no `capability.agent_policy` entry |
| `format_mode` | (none) | No JSON-envelope requirement; `model-profiles.json` has no `capability.format_mode` entry |
| `quota_pool` | `cognition-free` | Cognition free tier; does not burn Cognition Pro quota |
| `fallback_target` | `null` | No same-skill fallback defined; escalate to `deepseek-v4-pro` for tasks beyond SWE-1.6's clearly-scoped zone (see escalation rule below) |
| `executor` | `cli-devin` | Only executor path; no `cli-opencode` alternative |
| `free_tier` | `true` | Available when Cognition Pro quota is exhausted |

**Non-TTY rule (executor mechanic):**
Append `</dev/null` to every non-interactive executor-owned wrapper. Use the full
invocation wrapper from [`cli-devin`](../../../cli-devin/SKILL.md), not this profile.

**Escalation rule:** When the pre-planning step itself reveals the task exceeds
SWE-1.6's clearly-scoped zone (ambiguous requirements, multi-step reasoning,
large refactor scope, security-sensitive changes), switch to
`--model deepseek-v4-pro` rather than adding more prompt volume to SWE-1.6. More
freeform prompt does not compensate for the model's reasoning-depth limit.

**Pre-planning is the contract — not optional:** Every `--model swe-1.6` dispatch
MUST include the `<pre-plan>` block (ordered steps + acceptance criteria + stop
conditions + verification command). This is the largest lever on SWE-1.6 output
quality. Skipping it is the top cause of weak results.

**Timeout headroom:** `avg_iter_wall_clock_min` is 7 min. Set the executor-owned
timeout wrapper to at least 10 min to prevent premature kills on the slower end of
the distribution.

---

## 6. See Also

- [`../../../sk-prompt-small-model/assets/model-profiles.json#swe-1.6`](../../../sk-prompt-small-model/assets/model-profiles.json)
  — Registry entry; `recommended_frameworks`, `executors`, capability fields, and
  strengths/weaknesses. DATA source for all sections above.
- [`../../../sk-prompt/references/patterns_evaluation.md`](../../../sk-prompt/references/patterns_evaluation.md)
  — Generic RCAF and the other canonical framework definitions (the 7-framework set).
  STAR and BUILD are cli-devin task-shapes and are NOT defined here.
- [`../../../cli-devin/assets/prompt_quality_card.md`](../../../cli-devin/assets/prompt_quality_card.md)
  — Devin model-selection mechanics + the SWE-1.6 contract (§3). CLEAR and the
  framework selection table are delegated to the canonical card, not inlined here.
- [`../../../cli-devin/assets/prompt_templates.md`](../../../cli-devin/assets/prompt_templates.md)
  — Executor-owned templates. §2 is the canonical SWE-1.6 RCAF dispatch template
  with `devin` invocation wrapper.
- [`../../../cli-devin/references/context-budget.md`](../../../cli-devin/references/context-budget.md)
  — Context budget engine (per-model token defaults, truncation, priority eviction).
- [`../../../cli-devin/references/quota-fallback.md`](../../../cli-devin/references/quota-fallback.md)
  — Pool-aware fallback decision matrix.
- [`../../../cli-devin/assets/per-model-budgets.json`](../../../cli-devin/assets/per-model-budgets.json)
  — Per-model token budget defaults (SWE-1.6 row).
- **Sibling profiles:** [`deepseek-v4-pro.md`](./deepseek-v4-pro.md) (escalation
  target for tasks beyond SWE-1.6's zone).
- [`../_index.md`](./_index.md) — Index of all active model profiles.
