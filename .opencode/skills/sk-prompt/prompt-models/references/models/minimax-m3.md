---
title: MiniMax-M3 Prompt-Craft Profile
model_id: "minimax-m3"
description: How to prompt MiniMax-M3 via cli-opencode, TIDD-EC framework with dense pre-planning carried from benchmark 003, tuned scaffold, and dispatch gotchas.
trigger_phrases:
  - "minimax m3 prompt framework"
  - "minimax tidd-ec scaffold"
  - "minimax dense pre-planning"
  - "minimax m3 dispatch gotchas"
importance_tier: normal
contextType: implementation
version: 0.8.0.12
---

# MiniMax-M3 Prompt-Craft Profile

Single source of truth for HOW TO PROMPT `minimax-m3`. Framework choices mirror `model-profiles.json` (the DATA source of truth). Executor MECHANICS (binary flags, invocation wrappers) live in `cli-opencode`.

---

## 1. OVERVIEW

### Purpose

The single source for how to prompt `minimax-m3` when dispatching it through `cli-opencode`, mirroring its `model-profiles.json` registry entry so the framework, scaffold, and gotchas stay in sync with the canonical data.

### When to Use

- Before dispatching `minimax-m3` through `cli-opencode`.
- When choosing its prompt framework or building its tuned scaffold.
- When you need its dispatch gotchas (slug, variant, agent, quota pool).

### Core Principle

MiniMax wants guardrail-heavy TIDD-EC framing plus dense pre-planning — more structure, not less.

---

## 2. IDENTITY

| Field | Value |
|---|---|
| **Model slug (Token Plan — primary)** | `minimax-coding-plan/MiniMax-M3` |
| **Model slug (Direct API — alternative)** | `minimax/MiniMax-M3` (confirm live id with `opencode models minimax` before use) |
| **Context window** | 204,800 tokens (confirmed on M2.7; shared architecture) |
| **Quota pools** | `minimax-token-plan` (subscription, primary) · `minimax-api` (pay-per-token, alternative) |
| **Executor path(s)** | `cli-opencode` — two paths: Token Plan (`provider: minimax-coding-plan`) and Direct API (`provider: minimax`, requires `MINIMAX_API_KEY`) |
| **Billing** | Token Plan = subscription (5-hour rolling window); Direct API = pay-per-token |

`--variant` behavior is unverified for this provider and is omitted by default (see §5). `--agent` is rejected on opencode 1.15.13 and must be omitted.

---

## 3. RECOMMENDED FRAMEWORK

**Primary:** TIDD-EC (Task → Instructions → Do's → Don'ts → Examples → Context)
**Fallback:** RCAF (Role → Context → Action → Format)
**Avoid:** nothing explicitly blocked, but lean/medium pre-planning and bare RCAF underperform (see §4)
**Pre-planning density:** DENSE — 4–5 ordered steps, each with an explicit input, output, acceptance criterion, and verification command

This mirrors `model-profiles.json` `recommended_frameworks` for `minimax-m3`:
`primary: "tidd-ec"`, `fallback: "rcaf"`, `preplanning_density: "dense"`.

**Counter-intuitive note:** MiniMax wants guardrail-heavy framing (TIDD-EC Do's/Don'ts) **plus** dense pre-planning — the **opposite** of the cross-model default (medium pre-planning, lighter framing). Most models plateau or regress with dense pre-plans; MiniMax actively uses the dense plan structure rather than being slowed by it. This is because TIDD-EC's explicit Do's/Don'ts curb MiniMax's scope and format drift more effectively than RCAF's role anchor, and the dense pre-plan gives MiniMax a concrete decision scaffold it follows rather than ignoring. For other models in the rotation that follow the cross-model default (e.g. DeepSeek), RCAF + medium applies; MiniMax is the explicit exception.

---

## 4. BENCHMARK EVIDENCE

| Field | Value |
|---|---|
| **Benchmark id** | `003` |
| **Model under test** | MiniMax-M2.7 (real runs on `minimax-coding-plan/MiniMax-M2.7-highspeed`); contract carried to M3 |
| **Primary score** (TIDD-EC medium) | `0.7671` |
| **Fallback score** (RCAF medium) | `0.7419` |
| **Dense vs medium pre-plan** | `0.7750` (dense) vs `0.7671` (medium) — dense wins |
| **Sample** | 7-fixture rig; 49 real MiniMax dispatches (7 variants × 7 fixtures) |
| **Confidence** | medium |
| **Caveat** | Single sample per variant/fixture; margins of `0.008`–`0.03` were above the synthesis' `~0.02` fixture-noise floor |

**Discriminator:** TIDD-EC's explicit Do's/Don'ts curbed MiniMax's scope/format drift, and dense pre-planning gave MiniMax extra structure it used rather than being slowed by it. Format adherence was the primary differentiator; correctness was roughly equivalent between frameworks.

**Status note:** The benchmark was run on M2.7. The framework contract is carried to M3 given MiniMax's architectural continuity. A fresh M3-specific benchmark would elevate this from `carried` to `empirical`.

---

## 5. TUNED TEMPLATE SNIPPET

For the **generic TIDD-EC framework definition** (component meanings, scoring rubric, usage guidance), see [`../../../prompt-improve/references/patterns-evaluation.md`](../../../prompt-improve/references/patterns-evaluation.md). The scaffold below is the MiniMax-M3-specific fill — copy-paste-ready, executor-agnostic (no invocation wrapper).

```markdown
## Task
<one-line goal — be precise, no preamble>

## Instructions
1. Write a `<pre-plan>` block with 4-5 ordered steps (dense). Each step must include:
   - Input: what this step receives
   - Output: what this step produces
   - Acceptance criterion: the exact condition that proves this step is done
   - Verification command: the shell/test command that checks it
2. Write the code in fenced markdown blocks with the file path in a comment on the first line.
3. End with a `## Verification` section listing the exact commands that prove all acceptance criteria are met.

## Do's
- Stay strictly within the allowed-writes scope (list affected files explicitly).
- Use only documented, real CLI flags, functions, and file paths.
- Satisfy every acceptance criterion exactly as stated.
- Emit a `<pre-plan>` block before any code.

## Don'ts
- Do not invent CLI flags, functions, or files that are not in the codebase.
- Do not touch files outside the explicit scope list.
- Do not replace code blocks with prose disclaimers or "you could also..." alternatives.
- Do not omit the `## Verification` section.

## Examples
Output shape: a `<pre-plan>` block (dense, 4-5 steps), then fenced code blocks each with a path comment on line 1, then a `## Verification` command list.

## Context
- CWD: <absolute path>
- Active surface: <surface name, e.g. "Node.js / TypeScript">
- Files in scope: <list of files that may be read or written>
- Acceptance criteria: <what "done" means — be concrete>
```

**Why this shape:** The `## Do's` / `## Don'ts` block is the mechanism that suppresses MiniMax's observed scope drift and format evasion. The dense `<pre-plan>` block gives the model a concrete decision scaffold to follow. The `## Examples` section (even when only describing the shape rather than providing a real example) anchors output format expectations. Omitting any of these three sections degrades to RCAF-level performance.

---

## Design-Task Variant

Use this variant when MiniMax-M3 is dispatched for UI build, redesign, design review, accessibility/readiness review, or design recommendations that may become implementation guidance. It keeps the tuned TIDD-EC + dense pre-plan scaffold above and adds the shared design-loading contract from [`../../../../sk-design/shared/context-loading-contract.md`](../../../../sk-design/shared/context-loading-contract.md).

```markdown
## Task
Load and apply the sk-design context bundle for <surface> before producing <recommendations | code | review findings>.

## Instructions
1. Write a `<pre-plan>` block with 4-5 ordered steps (dense). Each step must include:
   - Input: what this step receives
   - Output: what this step produces
   - Acceptance criterion: the exact condition that proves this step is done
   - Verification command: the shell/test command that checks it
2. Read the required design context files before design decisions.
3. Emit the Context Loaded card before recommendations, code, audit findings, or design direction.
4. Emit the Proof Of Application card before any "ready", "accessible", "release-ready", "done", or equivalent claim.
5. End with a `## Verification` section listing the exact commands or evidence that prove all acceptance criteria are met.

## Design Manifest
- Files loaded:
  - .opencode/skills/sk-design/shared/context-loading-contract.md
  - .opencode/skills/sk-design/shared/register.md
  - <required mode SKILL.md files and axis references>
  - .opencode/skills/sk-design/shared/assets/context-loaded-card.md
  - .opencode/skills/sk-design/shared/assets/proof-of-application-card.md
- Register: Brand | Product
- Dials:
  - VARIANCE: <0-5>
  - MOTION: <0-5>
  - DENSITY: <0-5>
- Proof fields:
  - REGISTER / DIALS: <complete | incomplete>
  - CONTRAST PAIRS: <complete | incomplete | not applicable with reason>
  - INTERFACE PREFLIGHT: <complete | incomplete | not applicable with reason>
  - AUDIT EVIDENCE: <complete | incomplete | not applicable with reason>

## Do's
- Stay strictly within the allowed-writes scope (list affected files explicitly).
- Use only documented, real CLI flags, functions, and file paths.
- Read `.opencode/skills/sk-design/shared/register.md` first and set Brand|Product plus dials before palette, layout, motion, density, copy, or audit-severity choices.
- Emit the Context Loaded card before recommendations.
- Produce a contrast-pair inventory for all foreground/background pairs touched or evaluated.
- Fill interface pre-flight before any "done", "ready", "ship", or equivalent claim.
- Use audit evidence labels before accessibility, score, release-readiness, or review claims.

## Don'ts
- Do not invent CLI flags, functions, or files that are not in the codebase.
- Do not touch files outside the explicit scope list.
- Do not summarize `sk-design` from memory.
- Do not claim accessibility without audit evidence.
- Do not omit any proof field from the Design Manifest or Proof Of Application card.
- Do not replace code blocks with prose disclaimers or "you could also..." alternatives.

## Examples
Output shape: a `<pre-plan>` block, then the Design Manifest, then the Context Loaded card, then recommendations/code/findings, then `## Verification`, then the Proof Of Application card.

## Context
- CWD: <absolute path>
- Active surface: <surface name, e.g. "React app / marketing page">
- Files in scope: <list of files that may be read or written>
- Required mode bundle: <interface | interface + foundations | interface + foundations + audit | audit>
- Acceptance criteria: <what "done" means — be concrete>
```

---

## 6. DISPATCH GOTCHAS

Source of truth for capability fields: [`../../assets/model-profiles.json`](../../assets/model-profiles.json) → `models[id="minimax-m3"].capability`.

| Capability field | Value | Dispatch rule |
|---|---|---|
| `model_slug` (Token Plan) | `minimax-coding-plan/MiniMax-M3` | Pass as `--model minimax-coding-plan/MiniMax-M3` |
| `model_slug` (Direct API) | `minimax/MiniMax-M3` | Pass as `--model minimax/MiniMax-M3` (confirm live id with `opencode models minimax`) |
| `variant_flag` | `--variant` | `variant_status: "omitted-by-default-historically"` — omit `--variant` until accepted behaviour on this provider is verified |
| `agent_policy` | `omit-general` | **Do NOT pass `--agent`** — rejected on opencode 1.15.13; causes immediate dispatch failure |
| `format_mode` | `json` | Pass `--format json` for the normalized token/cost/latency envelope |
| `quota_pool` (Token Plan) | `minimax-token-plan` | Subscription; resets on a 5-hour rolling window |
| `quota_pool` (Direct API) | `minimax-api` | Pay-per-token; large-context runs can be expensive |

**Non-TTY / automation rule (executor mechanic):** every non-interactive `opencode run` must append `</dev/null` after the prompt argument, before any `> file` redirects — opencode reads stdin at startup and hangs at 0% CPU without closed stdin. The full invocation wrapper (slug, `--format json`, `--dir`, redirects) lives in [`../../../../cli-external-orchestration/cli-opencode/assets/prompt-templates.md`](../../../../cli-external-orchestration/cli-opencode/assets/prompt-templates.md); compose from there, not from this profile.

**Slug availability note:** Plain `minimax-coding-plan/MiniMax-M3` is confirmed live (2026-06-02; re-verified on opencode 1.16.2 on 2026-06-06). There is **no `MiniMax-M3-highspeed`** on opencode 1.16.2. Dispatch the plain `MiniMax-M3` slug.

---

## 7. SEE ALSO

- [`../../assets/model-profiles.json#minimax-m3`](../../assets/model-profiles.json) — canonical capability registry entry (model_slug, variant_flag, agent_policy, format_mode, quota_pool, recommended_frameworks)
- [`../../../prompt-improve/references/patterns-evaluation.md`](../../../prompt-improve/references/patterns-evaluation.md) — generic TIDD-EC and RCAF framework definitions + scoring rubric
- [`../../../../cli-external-orchestration/cli-opencode/assets/prompt-templates.md`](../../../../cli-external-orchestration/cli-opencode/assets/prompt-templates.md) — Template 14 (MiniMax TIDD-EC + dense); executor invocation wrappers, `</dev/null` rule, Memory Epilogue
- [`../../../../cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md`](../../../../cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md) — per-model override block for MiniMax (cross-model pre-planning density context)
- [`../../SKILL.md`](../../SKILL.md) — prompt-models hub workflow, dispatch matrix, escalation rules
