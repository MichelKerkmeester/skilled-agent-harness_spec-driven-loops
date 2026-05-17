---
title: "Devin CLI — Prompt Quality Card"
description: "CLEAR 5-check + framework selection for composing cli-devin dispatch prompts. Apply before every Bash invocation; tag the framework in the comment."
---

# Devin CLI — Prompt Quality Card

Pre-dispatch checklist for prompts sent to `devin`. Mirrors the cli-* family card shape.

---

## 1. OVERVIEW

This card provides the pre-dispatch quality discipline for cli-devin prompts. Section 2 is the CLEAR 5-check (Concrete / Limited / Evidence / Acceptance / Risk-Tier). Section 3 is the framework selection table mapping task shape to a structured prompt framework. Section 4 lists common composition patterns. Section 5 covers Memory Handback notes. Apply this card BEFORE every `devin --prompt-file` invocation; tag the chosen framework in the Bash invocation comment.

---

## 2. CLEAR 5-Check

Before composing the `devin --prompt-file` payload, verify the prompt is CLEAR:

| Check | Question | Pass Criteria |
|-------|----------|---------------|
| **C — Concrete** | Does the prompt name files, line ranges, and verification commands? | Yes — no vague "improve this code" / "make it better" |
| **L — Limited** | Is scope bounded? | Yes — explicit "do not modify outside <path>" / "touch only <files>" |
| **E — Evidence** | Does it include the evidence the dispatched session needs? | Yes — surface tag (from sk-code), relevant excerpts, prior decisions |
| **A — Acceptance** | Are completion criteria stated? | Yes — exact tests, exit-code expectations, behaviors to verify |
| **R — Risk-Tier** | Is the permission mode appropriate for what's being asked? | `auto` default; escalate only with operator approval |

If any check fails → revise the prompt before dispatching. If complexity ≥ 7/10 OR compliance/security signals present → dispatch `@prompt-improver` via the Task tool instead of inline composition.

---

## 3. Framework Selection

Choose the prompt framework that matches the task shape. Tag the chosen framework in a comment above the Bash invocation:

```bash
# FRAMEWORK: ATLAS — Audit / Trace / Localize / Articulate / Suggest (security review)
devin --prompt-file /tmp/devin-prompt.md --model deepseek-v4 --permission-mode auto 2>&1 </dev/null
```

| Framework | When | Devin Defaults |
|-----------|------|----------------|
| **RCAF** (Role / Context / Action / Format) ★★ empirically-best for SWE-1.6 (v1.0.5.0) | Default for SWE-1.6 coding tasks; clearly-scoped single-file or small multi-file generation | `--model swe-1.6 --permission-mode auto` — **REQUIRED**: dispatch through `sk-prompt` + include pre-planning block. 003-eval-loop scored RCAF + medium pre-plan **33% higher** than STAR baseline. |
| **STAR** (Situation / Task / Action / Result) | Narrative-heavy context gathering, tool-use traces, simple-to-medium code tasks where role framing doesn't fit naturally | `--model swe-1.6 --permission-mode auto` — **REQUIRED**: dispatch through `sk-prompt` + include pre-planning block. STAR baseline scored 0.4357 vs RCAF's 0.5796 in 003 run. |
| **BUILD** (Bounds / User-need / Implementation / Limits / Done-when) | Well-defined multi-file refactor where scope boundaries dominate the prompt design | `--model swe-1.6 --permission-mode auto` (escalate to `deepseek-v4` if complexity grows) — **REQUIRED** for SWE-1.6: dispatch through `sk-prompt` + include pre-planning block. **Don't combine BUILD with strict bundle-gate wording** — verbose constraints pushed SWE 1.6 toward defensive output and HURT scores in 003 run (v-005 scored 0.4846 vs RCAF's 0.5796). |
| **ATLAS** (Audit / Trace / Localize / Articulate / Suggest) | Complex security review / RCA / architecture review | `--model deepseek-v4 --permission-mode auto` (fallbacks: `glm-5.1` agentic, `kimi-k2.6` large-context) |
| **CONTEXT** (Context / Outcome / Notes / Tasks / Examples / Xtra / Tests) | Complex refactor with cross-cutting context | `--model deepseek-v4 --permission-mode auto` (Kimi k2.6 fallback for large context) |
| **CLOUD-HANDOFF** (Context / Termination / Return) | Async cloud session | See `references/cloud_handoff.md` |

> **SWE-1.6 prompt-quality contract (v1.0.2.0+ — empirically tuned v1.0.5.0)**: Every `--model swe-1.6` dispatch MUST be composed through `sk-prompt` (**default RCAF** — empirically best per 003-eval-loop; STAR for narrative tasks; BUILD for multi-file refactors) + CLEAR 5-check, AND include an explicit pre-planning block (ordered steps + acceptance criteria + stop conditions + verification approach). SWE-1.6 is coding-specialized but smaller than the complex-task models — the calling AI must do the structural decomposition upfront rather than asking SWE-1.6 to figure it out. Skipping this contract is the largest cause of underwhelming SWE-1.6 output. For complex tasks beyond SWE-1.6's clearly-defined zone, escalate to `deepseek-v4` rather than throwing more freeform prompt at SWE-1.6.
>
> **What 003-eval-loop measured (v1.0.5.0 evidence)**: RCAF + medium pre-plan + 5-thought sequential_thinking threshold + standard bundle-gate language is the best-scoring combination across 7 fixtures. Framework choice was 2.4× more impactful than anti-hallucination wording. Dense pre-planning blocks did NOT improve scores. Strict bundle-gate language HURT scores. See `specs/skilled-agent-orchestration/114-cli-devin-swe16-prompt-optimization/003-eval-loop/synthesis.md` for the full ranking.

---

## 4. Common Composition Patterns

### Pattern A — Single-file edit
```
<context>
File: src/auth/token.ts
Surface: typescript-react
</context>

<task>
<one-line goal>
<exact change>
<verification: npm test -- --filter token>
</task>

<constraints>
- Permission mode: auto.
- Touch only src/auth/token.ts.
</constraints>
```

### Pattern B — Multi-file refactor
```
<context>
Surface: <stack>
Affected files: <list>
</context>

<task>
Refactor <name> following <pattern>. Keep behavior identical (verified by <tests>).
</task>

<constraints>
- Permission mode: auto.
- Do not modify files outside <scope>.
- Run <tests> after every significant change; stop on failure.
</constraints>
```

### Pattern C — Architectural review (read-only intent)
```
<context>
Files: <list or directory>
Surface: <stack>
</context>

<task>
Review the architecture of <area>. Identify: <axes>. Produce Markdown report with file:line citations. Do not modify any files.
</task>

<constraints>
- Permission mode: auto. Read-only intent.
- Output: P0/P1/P2 finding blocks with rationale and suggested fix.
</constraints>
```

---

## 5. Memory Handback Notes

If the dispatch produces continuity-worthy state (decisions, new failure modes, surfaced rules), include a `<memory_handback>` block in the prompt asking Devin to emit a `MEMORY_HANDBACK` section. The calling AI then runs the canonical 7-step protocol (see `system-spec-kit/references/cli/memory_handback.md`).

Template:
```
<memory_handback>
After completing the task, emit a MEMORY_HANDBACK section containing:
- recent_action: <one-line summary>
- next_safe_action: <suggested follow-up>
- blockers: <list or empty>
- key_files: <list>
- open_questions: <list or empty>
- answered_questions: <list with answers>
</memory_handback>
```

---

## 6. Related Resources

- [SKILL.md](../SKILL.md) — Smart router + Default Invocation
- [prompt_templates.md](./prompt_templates.md) — Copy-paste templates
- [shared CLEAR card](../../system-spec-kit/references/cli/shared_prompt_quality_card.md) — Family-wide CLEAR (if present in this repo)
