---
title: CLI Prompt Quality Card
description: Fast-path framework selection and CLEAR checks for CLI orchestrator prompt construction.
---

# CLI Prompt Quality Card

Lightweight prompt-quality guidance for CLI orchestrator skills. Use this card on the fast path so routine dispatches get framework selection, a quick CLEAR check, and explicit escalation triggers without loading the full `sk-prompt` body.

## 1. OVERVIEW

### Purpose

Provide a compact, reusable asset for CLI prompt construction that improves prompt quality without paying the full `sk-prompt` context cost on routine work.

### Usage

Load this card before building any CLI dispatch prompt. Select a framework from the task map, run the CLEAR pre-dispatch check, and escalate to `@prompt-improver` when the task crosses the fast-path risk threshold.

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

## 3. CLI Task to Framework Map

| CLI task type | Default framework | Notes |
|---------------|-------------------|-------|
| Generation | `RCAF` | Default for most code, docs, and implementation asks |
| Review | `TIDD-EC` | Use when correctness, policy, or security checks matter |
| Research | `CRISPE` | Prefer for comparison, investigation, and discovery |
| Edit | `RCAF + TIDD-EC` | Pair execution clarity with explicit guardrails |
| Analyze / plan | `CRAFT` | Prefer when dependencies, stakeholders, or phases matter |

**Pre-planning density**: 
For non-trivial dispatches (multi-step tasks, code generation with acceptance criteria, anything that touches more than one file), prefer **medium-density pre-planning** — 3-4 ordered steps with per-step acceptance criteria + verification command. Dense pre-plans (4+ steps with full I/O contracts per step) add prompt cost without clear yield — medium pre-planning matches or beats dense on every measured model. Lighter pre-plans (no steps, or fewer than 3) leave too much structural decision-making to the model. For smaller or coding-specialized executor models, pre-planning is the calling AI's job and skipping it is the largest cause of underwhelming output; for frontier models, pre-planning is recommended for non-trivial dispatches but not mandatory.

**Bundle-gate strictness**:
Keep bundle-gate / acceptance-verification language at the "standard" level (single-layer check or implicit acceptance verification matching the fixture's stated criteria). Strict bundle-gate wording (multi-layer enforcement clauses, "smoke-run required", aggressive validation insistence) underperforms standard across every measured model — verbose constraint language pushes models toward defensive output (more disclaimers, fewer direct code blocks) rather than the discipline the strict wording is trying to elicit.

**Anti-hallucination wording is a secondary lever, not the primary on:** 
Framework choice (RCAF role anchor) is ~2.4× more impactful than aggressive anti-hallucination wording across measured models. Anti-hallucination wording is useful as a backstop for high-risk fixture clusters (CLI flag invention, library symbol references, defensive validation of unverifiable claims), but don't expect it to outweigh framework choice or pre-planning density.

---

## 4. CLEAR 5-Question Pre-Dispatch Checklist

Use one question per dimension before every CLI dispatch. If any answer is "no", tighten the prompt before running the CLI.

| Dimension | Floor | Pre-dispatch question |
|-----------|-------|-----------------------|
| Correctness | `>= 7/10` | Does the prompt accurately describe the task, constraints, and source files without contradictions? |
| Logic | `>= 7/10` | Does the prompt explain the reasoning path or decision criteria the delegated CLI should follow? |
| Expression | `>= 10/15` | Is the wording specific enough that a second AI will not have to guess what "good" looks like? |
| Arrangement | `>= 7/10` | Is the prompt structured in a clean order: task, context, constraints, output, verification? |
| Reusability | `>= 3/5` | Could this prompt be reused by swapping placeholders instead of rewriting it from scratch? |

---

## 5. Prompt-Composition Precedence

Three tiers govern how a prompt is built, from fastest to most thorough. Evaluate in order — stop at the first tier that fully covers the task.

**Tier 1 — Fast path (default)**
Build the prompt directly from this canonical card. Select a framework from the table in section 2, apply the task-to-framework map in section 3, run the CLEAR pre-dispatch check in section 4, and dispatch. No additional skill loading required for routine work.

**Tier 2 — Model override (mandatory when a per-model profile exists)**
If the target model has a per-model profile in the executor's model-craft hub, that profile OVERRIDES the cross-model defaults from this card. The profile may prescribe a different framework, pre-planning density, or bundle-gate strictness than the table above. Read the profile before composing the prompt — skipping this step is the leading cause of underperformance on profiled models.

**Tier 3 — Deep path (escalation)**
Dispatch `@prompt-improver` via the Task tool (never load full `sk-prompt` inline) when ANY of the following are true:

- Complexity is `>= 7/10`
- Compliance, policy, privacy, or security sensitivity is present
- More than one stakeholder or audience must be satisfied
- More than one key requirement is still ambiguous
- The fast-path CLEAR check cannot be brought above the floor quickly

Expected structured return:

```text
FRAMEWORK: <name>
CLEAR_SCORE: <n>/50
RATIONALE: <short explanation>
ENHANCED_PROMPT: |
  <ready-to-dispatch prompt>
ESCALATION_NOTES: <open ambiguity or risk>
```

---

## 6. Common CLI Prompt Failure Patterns

- Missing output format or success criteria
- Unbounded scope that lets the delegated CLI wander
- Vague verbs such as "improve", "look at", or "handle" without specifics
- No file, artifact, or interface anchors when repo context matters
- No guardrails for security, compliance, or "do not change" boundaries
- No verification request when the delegated CLI should prove its work
- Overloaded prompts that mix research, implementation, and review with no order

---

## 7. Mirror Sync

All five cli-* cards (`cli-claude-code`, `cli-codex`, `cli-devin`, `cli-gemini`, `cli-opencode`) are THIN DELEGATING mirrors: they link to this card as the authoritative source and do not copy the framework table or CLEAR scoring table. Each card contains a short header, a link here, and any model-specific addenda — nothing more.

A duplication guard enforces this contract:

```
.opencode/skills/system-skill-advisor/mcp_server/scripts/check-prompt-quality-card-sync.sh
```

The script asserts that no cli-* card re-inlines the framework selection table or the CLEAR 5-question table from this file. If the guard fails, remove the inlined content from the offending cli-* card and replace it with a link back to this file.

When editing this file, no mirroring step is required — the delegating cards reference it by path.

---

## 8. Related Resources

- `../SKILL.md`
- `../../sk-prompt/references/patterns_evaluation.md`
- `../../sk-prompt/references/depth_framework.md`
- `../../cli-claude-code/assets/prompt_quality_card.md`
- `../../cli-codex/assets/prompt_quality_card.md`
- `../../cli-gemini/assets/prompt_quality_card.md`
