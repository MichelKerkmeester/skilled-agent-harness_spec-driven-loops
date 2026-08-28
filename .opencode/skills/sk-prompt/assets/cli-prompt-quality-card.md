---
title: CLI Prompt Quality Card
description: Fast-path framework selection and CLEAR checks for CLI orchestrator prompt construction.
trigger_phrases:
  - "cli prompt quality card"
  - "prompt framework selection table"
  - "clear pre-dispatch check"
  - "fast path prompt quality"
  - "escalate to prompt improver"
importance_tier: important
contextType: general
version: 0.8.0.19
---

# CLI Prompt Quality Card

Lightweight prompt-quality guidance for CLI orchestrator skills. Use this card on the fast path so routine dispatches get framework selection, a quick CLEAR check, and explicit escalation triggers without loading the full `sk-prompt` body.

## 1. OVERVIEW

### Purpose

Provide a compact, reusable asset for CLI prompt construction that improves prompt quality without paying the full `sk-prompt` context cost on routine work.

### Usage

Load this card before building any CLI dispatch prompt. Select a framework from the task map, run the CLEAR pre-dispatch check, and escalate to `@prompt-improver` when the task crosses the fast-path risk threshold.

---

## 2. FRAMEWORK SELECTION TABLE

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

## 3. CLI TASK TO FRAMEWORK MAP

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

## 4. CLEAR 5-QUESTION PRE-DISPATCH CHECKLIST

Use one question per dimension before every CLI dispatch. If any answer is "no", tighten the prompt before running the CLI.

| Dimension | Floor | Pre-dispatch question |
|-----------|-------|-----------------------|
| Correctness | `>= 7/10` | Does the prompt accurately describe the task, constraints, and source files without contradictions? |
| Logic | `>= 7/10` | Does the prompt explain the reasoning path or decision criteria the delegated CLI should follow? |
| Expression | `>= 10/15` | Is the wording specific enough that a second AI will not have to guess what "good" looks like? |
| Arrangement | `>= 7/10` | Is the prompt structured in a clean order: task, context, constraints, output, verification? |
| Reusability | `>= 3/5` | Could this prompt be reused by swapping placeholders instead of rewriting it from scratch? |

---

## 5. PROMPT-COMPOSITION PRECEDENCE

Two tiers govern how a prompt is built, from fastest to most thorough. Evaluate in order — stop at the first tier that fully covers the task.

**Tier 1 — Fast path (default)**
Build the prompt directly from this canonical card. Select a framework from the table in section 2, apply the task-to-framework map in section 3, run the CLEAR pre-dispatch check in section 4, and dispatch. No additional skill loading required for routine work.

**Tier 2 — Deep path (escalation)**
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

## 6. PERSONA INJECTION

Every external-CLI dispatch MUST compose `{resolved agent persona + task prompt}` — never a bare task. A persona-less dispatch runs the leaf model as a generic assistant: it silently loses the agent's tool-scope, verification gates, output contract, and safety framing, so results drift from what the orchestrator expects. This mirrors the native-dispatch precedent in `orchestrate.md` "Agent Loading Protocol (MANDATORY)" (READ the agent definition → INCLUDE it in the prompt → dispatch) and extends that discipline to the external-CLI path. Each cli-* mode `SKILL.md` carries a persona-injection ALWAYS rule that points here; this section is the canonical source.

### 6.1 Resolve the persona (runtime-aware — AGENTS.md §7; never hardcode one runtime)

Resolve the agent `.md` from the ACTIVE runtime's agent directory:

| Runtime | Agent directory |
|---------|-----------------|
| Opencode | `.opencode/agents/<name>.md` |
| Claude Code | `.claude/agents/<name>.md` |
| Codex CLI | `.codex/agents/<name>.md` |
| Cursor | `.cursor/agents/<name>.md` |
| Pi | `.pi/agents/<name>.md` |
| Devin | `.devin/agents/<name>/AGENT.md` |

Map each subtask to the RIGHT persona, not one default: `code → code` · `review → review` · `design → design` · research → `deep-research` · exploration/context → `context` · debugging → `debug` · docs/markdown → `markdown` · planning/architecture → `ai-council` · coordination → `orchestrate`.

### 6.2 Attach it — native surface vs inline (per mode)

Attach the resolved persona via the mode's native surface where the CLI loads it on the dispatch path; INLINE is the universal fallback, REQUIRED on any bare top-level dispatch that names no native subagent.

| Mode | How to attach the resolved persona |
|------|------------------------------------|
| `cli-claude-code` | NATIVE: `claude -p --agent <name>` resolves `.claude/agents/<name>.md`. INLINE on a bare `-p`. |
| `cli-cursor` | NATIVE: name the resolved subagent (`.cursor/agents` + `.claude/agents` mirror all 13 agents). INLINE on a bare `cursor-agent -p`. |
| `cli-devin` | NATIVE: `run_subagent` naming the resolved profile (`.devin/agents/<name>/AGENT.md`). INLINE on a bare `devin -p`. |
| `cli-opencode` | PARTIAL: route `--agent orchestrate` → Task subagent (`mode: subagent` personas are rejected at top-level `--agent`). Else INLINE. |
| `cli-codex` | INLINE (mandatory): `.codex/agents/*.toml` is TUI-only; `codex exec` / `-p` load config, not a persona. |
| `cli-pi` | INLINE (mandatory): core Pi has no persona surface on `pi -p`. |
| fanout runtime | INLINE into the composed prompt string (`fanout-run.cjs` has no persona slot). |

### 6.3 Inline block format

The persona travels IN the payload because the child cannot resolve agent paths by reference — the same reason `DESIGN_DISPATCH_MANIFEST` is inlined, not linked:

```
=== BEGIN AGENT PERSONA (resolved runtime path: <dir>/<name>.md — Devin: <name>/AGENT.md, per the §6.1 table) ===
<full agent .md content — OR a focused persona summary for large files / small-context models>
=== END AGENT PERSONA (resolved persona: <name>) ===
You are dispatched AS the @<name> agent defined above. Obey its role, tool-scope,
verification gates, and output contract.

<task prompt>
```

### 6.4 Consistency guard + exceptions

Before dispatch, confirm the inlined (or `--agent`-named) persona MATCHES the subtask's intent — the persona named in the block, the resolved definition, and the task body must be the same agent (mirrors `orchestrate.md`'s "Prompt/Agent Consistency Guard").

Default is always-attach. The only sanctioned exceptions, each DECLARED at the dispatch site:

1. **Native surface used** (claude-code `--agent`; cursor / devin / opencode dispatched by naming the resolved subagent) — native resolution satisfies the rule; a redundant inline copy is not required.
2. **Small-context model** — substitute a focused persona summary (role + tool-scope + output contract + verification gates) for the full `.md`.
3. **Pure-mechanical command** with no agent semantics — the persona MAY be omitted, but the omission MUST be stated at the dispatch site.

Silence is never an exception.

---

## 7. COMMON CLI PROMPT FAILURE PATTERNS

- Missing output format or success criteria
- Unbounded scope that lets the delegated CLI wander
- Vague verbs such as "improve", "look at", or "handle" without specifics
- No file, artifact, or interface anchors when repo context matters
- No guardrails for security, compliance, or "do not change" boundaries
- No verification request when the delegated CLI should prove its work
- Overloaded prompts that mix research, implementation, and review with no order
- **Weak-model observation drift**: a cheaper model (DeepSeek, MiniMax, Qwen) told to "review" or "observe" a repo will run the repo's own tooling — `generate-context.js`, `validate.sh`, `git` writes — and edit files it was only meant to read, unless the prompt forbids it by name. For any observation-only or single-directory-scoped dispatch, state the exact write surface AND name the forbidden tooling. "Stay inside your directory" is inferred by strong models but ignored by weak ones; make the boundary followable, not just present.

---

## 8. MIRROR SYNC

All three cli-* cards (`cli-claude-code`, `cli-opencode`, `cli-opencode`) are THIN DELEGATING mirrors: they link to this card as the authoritative source and do not copy the framework table or CLEAR scoring table. Each card contains a short header, a link here, and any model-specific addenda — nothing more.

A duplication guard enforces this contract:

```
.opencode/skills/system-skill-advisor/mcp-server/scripts/check-prompt-quality-card-sync.sh
```

The script asserts that no cli-* card re-inlines the framework selection table or the CLEAR 5-question table from this file. If the guard fails, remove the inlined content from the offending cli-* card and replace it with a link back to this file.

When editing this file, no mirroring step is required — the delegating cards reference it by path.

---

## 9. RELATED RESOURCES

- `../SKILL.md`
- `../references/patterns-evaluation.md`
- `../references/depth-framework.md`
- `../../../cli-claude-code/assets/prompt-quality-card.md`
- `../../../cli-external-orchestration/cli-opencode/assets/prompt-quality-card.md`
