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
| **STAR** (Situation / Task / Action / Result) | Context gathering, tool use, simple-to-medium code task | `--model swe-1.6 --permission-mode auto` |
| **ATLAS** (Audit / Trace / Localize / Articulate / Suggest) | Complex security review / RCA / architecture review | `--model deepseek-v4 --permission-mode auto` (fallbacks: `glm-5.1` agentic, `kimi-k2.6` large-context) |
| **CONTEXT** (Context / Outcome / Notes / Tasks / Examples / Xtra / Tests) | Complex refactor with cross-cutting context | `--model deepseek-v4 --permission-mode auto` (Kimi k2.6 fallback for large context) |
| **BUILD** (Bounds / User-need / Implementation / Limits / Done-when) | Well-defined multi-file refactor | `--model swe-1.6 --permission-mode auto` (escalate to `deepseek-v4` if complexity grows) |
| **CLOUD-HANDOFF** (Context / Termination / Return) | Async cloud session | See `references/cloud_handoff.md` |

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
