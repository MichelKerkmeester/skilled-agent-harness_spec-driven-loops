---
title: sk-prompt
description: "Prompt engineering engine that turns a vague request into a structured prompt in one pass: a ten-row checklist, one component skeleton with optional framework presets, and CLEAR screening."
trigger_phrases:
  - "improve prompt"
  - "prompt engineering"
  - "framework"
  - "CLEAR scoring"
  - "/prompt:improve"
version: 4.0.0.0
---

# sk-prompt

> Turn a vague ask into a structured prompt that clears a fixed quality bar in one pass: one component skeleton with optional framework presets, a ten-row checklist, a CLEAR screen against a fixed threshold and a transparency report that shows what changed.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Transforming a rough or under-specified request into a prompt that clears a fixed quality bar |
| **Invoke with** | The `/prompt:improve` command, the `@prompt-improver` agent, keyword routing through Gate 2 or a framework name stated directly |
| **Works on** | Any text task that benefits from structure: generation, review, research, editing and analysis |
| **Produces** | An enhanced prompt with a transparency report naming the framework, the effort level, the checklist marks, the CLEAR breakdown, the change report and any flagged assumptions |

---

## 2. OVERVIEW

### Why This Skill Exists

A vague prompt gets a vague answer. People under-specify the role, skip the constraints, bury the real ask and leave the model to guess, then blame the output when it misses. Picking a structure by feel does not help, because different tasks want different shapes and nothing signals when a prompt is actually good enough to send. This skill checks the request once against ten components, writes the prompt from one skeleton or a named preset, records its assumptions and screens the result against a fixed rubric so a prompt ships only when it clears the bar.

### What It Does

`sk-prompt` is the prompt-engineering engine. It routes on the user's own words, with a pasted prompt set aside before routing, then checks the request once against ten checklist rows and exits early when the prompt already passes. Otherwise it writes the prompt from one component skeleton or a named framework preset, self-checks the draft against its own success criteria and screens it with the CLEAR rubric. The prompt arrives first, followed by the numbered open items and a change report. You call it through the `/prompt:improve` command or the `@prompt-improver` agent. The skill sets the quality bar. The output tells you how it measured up.

### The Framework Layer

The skill operates a library of seven prompt frameworks, each one a proven shape for a task family.

| Framework | Elements | What it operates best |
|---|---|---|
| **RCAF** | Role, Context, Action, Format | General tasks, 80% of prompts |
| **COSTAR** | Context, Objective, Style, Tone, Audience, Response | Content creation, communication |
| **RACE** | Role, Action, Context, Execute | Urgent tasks, quick iterations |
| **CIDI** | Context, Instructions, Details, Input | Process documentation, tutorials |
| **TIDD-EC** | Task, Instructions, Dos, Donts, Examples, Context | Quality-critical work, compliance |
| **CRISPE** | Capacity, Insight, Statement, Personality, Experiment | Strategy, creative exploration |
| **CRAFT** | Context, Role, Action, Format, Target | Complex projects, planning |

---

## 3. QUICK START

**Step 1: Invoke it.** Type `/prompt:improve` followed by a mode flag and your request.

**Step 2: Run the primary workflow.**

```bash
/prompt:improve $text "Write a cold email for a SaaS CRM targeting mid-market sales leaders"
```

The skill runs one pass over the prompt, checks it against the ten rows, writes it from the default skeleton or a named preset, screens it with CLEAR and delivers the enhanced prompt. Below it you get a transparency report:

```text
FRAMEWORK: COSTAR
EFFORT: standard
CHECKLIST: 7 present, 2 added, 1 not needed
CLEAR_SCORE: 43/50 (C:8 L:9 E:12 A:10 R:4)
THRESHOLD: 40/50 (PASS)
QUICK TEST: NOT RUN
ASSUMPTIONS FLAGGED: audience title inferred from "mid-market sales leaders"
CHANGES: Added audience and tone constraints; Changed the ask into a numbered task; Removed a duplicated length rule; Skipped examples (not needed)
```

**Step 3: Use a mode flag for speed.** Add `$short` for a quick checklist pass or `$raw` for a straight pass-through when you are certain the prompt is ready.

```bash
/prompt:improve $short "Rephrase this PR description for a non-technical reviewer: ..."
```

The report shows `EFFORT: quick` for `$short`, and `$raw` runs no checklist at all.

**Step 4: Verify before you rely on it.**

```bash
python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-prompt/README.md --type readme
```

Zero issues means the README matches the house template.

---

## 4. HOW IT WORKS

### Framework Selection

Every prompt starts from one default skeleton, so the framework layer is a set of optional presets rather than a contest between seven candidates. Name a framework and the prompt is written from that preset. Leave it unnamed and the skeleton carries the structure, with a preset applied only when the task makes its fit plain, such as a compliance job that wants the dos and donts shape. Nothing is chosen by score. The definitions live in `references/patterns-evaluation.md`.

### The One-Pass Checklist

The checklist is a single reading of the prompt, not a gate that repeats until clean. Every row is marked present, absent or not needed with a one-line reason, and a row marked not needed is never added.

1. Task and requested outcome.
2. Role or audience, only when it changes the response.
3. Context and source facts the model needs.
4. Constraints, priorities and how conflicts between them resolve.
5. Steps, tools or process, only when the task needs them.
6. Output format, schema and length limits.
7. Examples when they help: at least 1, about 3 typical, at most 5, in `<example>` tags with identical formatting.
8. Success criteria, edge cases or a way to verify the answer.
9. Contradictions, assumptions and missing information.
10. Wording: plain instructions with the reason given; soften CRITICAL and MUST rather than banning capitals.

When every row is present or not needed, the prompt comes back unchanged or with the smallest edit the user asked for, and the answer says so.

Effort decides how much of the list runs: quick checks the four core rows, standard checks all ten, thorough checks all ten and attempts the quick test, and `$raw` runs no pass at all.

### The CLEAR Rubric

CLEAR scores out of fifty points across five dimensions. The pass threshold is forty. Each dimension has a floor that blocks a pass even when the total clears forty.

| Dimension | Max | Floor | What it measures |
|---|---|---|---|
| Correctness | 10 | 7 | Facts, logic, no contradictions |
| Logic | 10 | 7 | Coherent structure, clear reasoning |
| Expression | 15 | 10 | Clarity, conciseness, word choice |
| Arrangement | 10 | 7 | Framework adherence, flow, organization |
| Reusability | 5 | 3 | Adaptable to similar tasks, template-ready |

Scores of forty and up pass. Scores from thirty to thirty-nine go back for revision. Scores below thirty are rejected. Repair is bounded at 3 cycles, then the best version ships with a note naming what stayed weak.

### The Operating Modes

The mode is detected from the command prefix. An absent prefix defaults to the interactive mode.

| Mode | Prefix | Effort | When to use it |
|---|---|---|---|
| Interactive | (none) | standard | The skill asks one question before processing |
| Text | `$text` | standard | Standard prompt enhancement after the one comprehensive pre-processing question |
| Short | `$short` | quick | You need a quick refinement, not the full checklist |
| Improve | `$improve` | standard | Standard enhancement, equivalent to the default |
| Refine | `$refine` | thorough | Maximum optimization for a prompt that is close but not clearing |
| JSON | `$json` | standard | The output must be JSON, ready for an API |
| YAML | `$yaml` | standard | The output must be YAML, ready for config |
| Raw | `$raw` | none | Skip the checklist. Passthrough with no scoring |

### The Agent Escalation Path

The `@prompt-improver` agent is the fresh-context escalation surface. It loads the same references and applies the same rules. It returns a structured block (framework, CLEAR score, rationale, enhanced prompt and escalation notes) that a caller can inject into a CLI dispatch without loading the full skill.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for `sk-prompt` when a prompt you are about to send feels vague or unstructured, when you need a framework you do not use every day, when you want a quality score before you dispatch and when you are building a reusable prompt template. Skip it for a one-line fact-check query where structure adds no value. For design-generation work, the skill constructs the brief from the framework library and CLEAR rubric in `references/patterns-evaluation.md`, plus a handoff note to `sk-code`; it ships no design-specific reference of its own. It owns the prompt only. `sk-design-md-generator` owns measured design-reference extraction.

### Related Skills

| Skill | Relationship |
|---|---|
| `cli-claude-code` | Consumes the prompt quality card this skill produces and handles the executor mechanics. This skill does not own invocation flags or dispatch rules |
| `cli-opencode` | Same boundary as cli-claude-code. Consumes the prompt card, owns the mechanics |
| `system-skill-advisor` | Routes non-trivial tasks to this skill at Gate 2 when the prompt carries prompt-engineering keywords |
| `sk-doc` | Owns the documentation output. This skill hands off when the final artifact is a spec doc or README |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| CLEAR score below forty after the full pass | The input lacked enough context or the framework did not fit the task | Add more context about your audience and constraints. Name a framework directly when you already know the right shape |
| The preset did not fit the task | A preset was applied where the default skeleton would have carried the structure | Name the preset you want, or ask for the default skeleton |
| JSON output arrived wrapped in Markdown | The `$json` prefix was not used, so the skill delivered in the default format | Use the `$json` prefix explicitly |
| The checklist ran deeper than the task needed | The default effort is standard, which checks all ten rows | Use `$short` for the four core rows or `$raw` to pass the prompt through |
| The skill's confidence dropped below fifty percent | The request did not carry enough prompt-engineering signals | The skill will ask a single comprehensive question before it processes anything |
| A CLI dispatch card failed or was rejected | The prompt did not carry enough quality evidence for the executor to accept it | Run `$refine` for a full optimization pass, then re-dispatch with the transparency report attached |

---

## 7. FAQ

**Q: What is the difference between `$improve` and `$refine`?**

A: `$improve` is the standard path: all ten checklist rows at standard effort, the default skeleton or a named preset, CLEAR screening and a transparency report. `$refine` runs the same pass at thorough effort and targets maximum optimization. Reach for `$refine` when a prompt scored 35 to 39 and you need it to cross forty. It is also the right mode for a prompt heading to a high-stakes dispatch.

**Q: Can I name a framework directly instead of letting the skill pick one?**

A: Yes. State the framework name and the prompt is written from that preset, which the change report names. Nothing is scored in the background.

**Q: What happens when CLEAR cannot reach forty after three repair cycles?**

A: The skill delivers the highest-scoring version with an explicit escalation note. It tells you why the score stalled, which dimensions blocked the pass, how to add context and how to switch frameworks to get across the line.

**Q: Does the skill change my intent when it reworks a prompt?**

A: No. The self-check reads the draft against the intent you stated before it is delivered. The skill keeps the goal, the audience, the constraints and the intended format you stated unless you explicitly ask it to broaden or narrow scope. Flagged assumptions appear in the transparency report so you can spot where inference filled a gap.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .skilled/skills/sk-doc/scripts/validate_document.py .skilled/skills/sk-prompt/README.md --type readme` reports zero issues |
| Router fixtures | `bash .skilled/skills/sk-prompt/benchmark/router/run_fixtures.sh` runs 19 routing fixtures |
| Manual testing playbook | Scenarios under `manual-testing-playbook/` cover mode detection, smart routing, the checklist pass, CLEAR scoring, framework presets, escalation tiers and format modes |
| Agent contract | The `@prompt-improver` output block contract lives in `SKILL.md` Section 7. Validate with the playbook scenarios under `manual-testing-playbook/escalation-tiers/` |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the mode table, the agent contract and the full rule set |
| [`ROUTER.md`](./ROUTER.md) | Machine router: intent map, resource map and loading levels |
| [`references/patterns-evaluation.md`](./references/patterns-evaluation.md) | The default skeleton, the seven framework presets and the CLEAR rubric |
| [`references/improvement-checklist.md`](./references/improvement-checklist.md) | The one-pass checklist, early exit, effort levels, quick test and change report |
| [`assets/framework-registry.json`](./assets/framework-registry.json) | Machine-readable scaffold registry with code-oriented slot templates for a subset of five frameworks |
| [`assets/cli-prompt-quality-card.md`](./assets/cli-prompt-quality-card.md) | The canonical CLI prompt-quality card that the `cli-*` cards delegate to before dispatch |
| [`assets/format-guide-markdown.md`](./assets/format-guide-markdown.md) | Markdown delivery format deep-dive |
| [`assets/format-guide-json.md`](./assets/format-guide-json.md) | JSON delivery format deep-dive |
| [`assets/format-guide-yaml.md`](./assets/format-guide-yaml.md) | YAML delivery format deep-dive |
| [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Scenario-based manual validation covering all modes, the checklist pass and the agent contract |
