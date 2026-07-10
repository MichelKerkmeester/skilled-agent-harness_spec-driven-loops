---
title: sk-prompt
description: Prompt engineering engine that turns a vague request into a structured, high-quality prompt through seven frameworks, a five-phase DEPTH thinking pass and CLEAR quality scoring.
trigger_phrases:
  - "improve prompt"
  - "prompt engineering"
  - "framework"
  - "CLEAR scoring"
  - "/prompt"
version: 2.3.0.21
---

# sk-prompt

> Turn a vague ask into a structured prompt, auto-selected from seven frameworks, shaped by a five-phase thinking pass and scored so nothing ships below the threshold.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Transforming a rough or under-specified request into a prompt that clears a fixed quality bar |
| **Invoke with** | The `/prompt` command, the `@prompt-improver` agent or keyword routing through Gate 2 |
| **Works on** | Any text task that benefits from structure: generation, review, research, editing and analysis |
| **Produces** | An enhanced prompt with a transparency report naming the framework, the rounds, the CLEAR breakdown and any flagged assumptions |

---

## 2. OVERVIEW

### Why This Skill Exists

A vague prompt gets a vague answer. People under-specify the role, skip the constraints, bury the real ask and leave the model to guess, then blame the model when the output misses. Picking a structure by feel does not help, because different tasks want different shapes and there is no signal for when a prompt is actually good enough to send. This skill scores the task against seven frameworks and picks the best fit. It runs a structured thinking pass that surfaces assumptions and engineers the prompt. It scores the result against a fixed rubric so a prompt ships only when it clears the bar.

### What It Does

sk-prompt is the prompt-engineering engine. It evaluates the task across seven frameworks, runs the selected prompt through DEPTH (a five-phase thinking pass of Discover, Engineer, Prototype, Test and Harmonize), scores every dimension of the output with the CLEAR rubric and delivers the result with a transparency report. You call it through the `/prompt` command or the `@prompt-improver` agent. The skill sets the quality bar. The output tells you how it measured up.

---

## 3. QUICK START

**Step 1: Invoke it.** Type `/prompt` followed by a mode flag and your request.

**Step 2: Run the primary workflow.**

```bash
/prompt $text "Write a cold email for a SaaS CRM targeting mid-market sales leaders"
```

The skill runs a ten-round DEPTH pass, picks the best framework, scores the result with CLEAR and delivers the enhanced prompt. Below it you get a transparency report:

```text
FRAMEWORK: COSTAR
DEPTH ROUNDS: 10
CLEAR_SCORE: 43/50 (C:8 L:9 E:12 A:10 R:4)
THRESHOLD: 40/50 (PASS)
ASSUMPTIONS FLAGGED: audience title inferred from "mid-market sales leaders"
```

**Step 3: Use a mode flag for speed.** Add `$short` for a three-round pass or `$raw` for a zero-round passthrough when you are certain the prompt is ready.

```bash
/prompt $short "Rephrase this PR description for a non-technical reviewer: ..."
```

**Step 4: Verify the README structure before you rely on it.**

```bash
python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-prompt/README.md --type readme
```

Zero issues means the README matches the house template.

---

## 4. HOW IT WORKS

### Framework Selection

The skill evaluates seven frameworks against five task characteristics: complexity, urgency, audience specificity, creative need and precision. It scores at least three frameworks before choosing a primary and an alternative. The definitions live in `references/patterns_evaluation.md`.

| Framework | Elements | Best for |
|---|---|---|
| RCAF | Role, Context, Action, Format | General tasks, 80% of prompts |
| COSTAR | Context, Objective, Style, Tone, Audience, Response | Content creation, communication |
| RACE | Role, Action, Context, Execute | Urgent tasks, quick iterations |
| CIDI | Context, Instructions, Details, Input | Process documentation, tutorials |
| TIDD-EC | Task, Instructions, Dos, Donts, Examples, Context | Quality-critical work, compliance |
| CRISPE | Capacity, Insight, Statement, Personality, Experiment | Strategy, creative exploration |
| CRAFT | Context, Role, Action, Format, Target | Complex projects, planning |

You can name a framework directly and the skill will use it. The selection algorithm still runs so the transparency report shows why that framework fits.

### The DEPTH Thinking Pass

DEPTH runs five phases. The round count is mode-driven: zero for raw, three for short, ten for the standard modes.

| Phase | What happens |
|---|---|
| Discover | The prompt is mapped from multiple perspectives, assumptions are surfaced and the best framework is selected |
| Engineer | Several enhancement approaches are generated and evaluated, and the strongest is chosen |
| Prototype | The structured draft is built, mechanism-first, with the selected framework and format applied |
| Test | CLEAR scoring runs against all five dimensions and quality gates are checked |
| Harmonize | Final polish, format verification and the transparency report are assembled |

Every phase carries an exit gate. Discover requires at least three perspectives before it moves on. Test blocks forward progress when any CLEAR dimension falls below its floor.

### The CLEAR Rubric

CLEAR scores out of fifty points across five dimensions. The pass threshold is forty, and each dimension has a floor that blocks a pass even when the total clears forty.

| Dimension | Max | Floor | What it measures |
|---|---|---|---|
| Correctness | 10 | 7 | Facts, logic, no contradictions |
| Logic | 10 | 7 | Coherent structure, clear reasoning |
| Expression | 15 | 10 | Clarity, conciseness, word choice |
| Arrangement | 10 | 7 | Framework adherence, flow, organization |
| Reusability | 5 | 3 | Adaptable to similar tasks, template-ready |

Scoring bands are pass at forty and up, revision at thirty to thirty-nine, rejected below thirty. The improvement cycle caps at three iterations. After that the best version ships with a scored note.

### The Operating Modes

The mode is detected from the command prefix. An absent prefix defaults to the interactive mode.

| Mode | Prefix | DEPTH rounds | When to use it |
|---|---|---|---|
| Interactive | (none) | 10 | The skill asks one question before processing |
| Text | `$text` | 10 | Standard prompt enhancement after the one comprehensive pre-processing question |
| Short | `$short` | 3 | You need a quick refinement, not full depth |
| Improve | `$improve` | 10 | Standard enhancement, equivalent to the default |
| Refine | `$refine` | 10 | Maximum optimization for a prompt that is close but not clearing |
| JSON | `$json` | 10 | The output must be JSON, ready for an API |
| YAML | `$yaml` | 10 | The output must be YAML, ready for config |
| Raw | `$raw` | 0 | Skip all phases. Passthrough with no scoring |

The `@prompt-improver` agent is the fresh-context escalation surface. It loads the same references, applies the same rules and returns a structured block (framework, CLEAR score, rationale, enhanced prompt and escalation notes) that a caller can inject into a CLI dispatch without loading the full skill.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-prompt when a prompt you are about to send feels vague or unstructured, when you need a framework you do not use every day, when you want a quality score before you dispatch and when you are building a reusable prompt template. Skip it for a one-line fact-check query where structure adds no value.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-prompt-models` | Decides which of sk-prompt's seven frameworks a given small model wants and adds model-specific scaffold and gotchas. sk-prompt owns the definitions and the rubric. `sk-prompt-models` owns the per-model mapping. |
| `cli-claude-code` | Consumes the prompt quality card that sk-prompt produces and handles the executor mechanics. sk-prompt does not own invocation flags or dispatch rules. |
| `cli-opencode` | Same boundary as cli-claude-code. Consumes the prompt card, owns the mechanics. |
| `cli-opencode` | Same boundary. Receives the enhanced prompt and runs the session. |
| `system-skill-advisor` | Routes non-trivial tasks to sk-prompt at Gate 2 when the prompt carries prompt-engineering keywords. |
| `sk-doc` | Owns the documentation output. sk-prompt hands off when the final artifact is a spec doc or README. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| CLEAR score below forty after the full pass | The input lacked enough context or the framework did not fit the task | Add more context about your audience and constraints, or name a framework directly |
| The wrong framework was selected | An ambiguous task underscored its complexity and the selector picked a suboptimal match | State the complexity level or name the framework you want applied |
| JSON output arrived wrapped in Markdown | The `$json` prefix was not used, so the skill delivered in the default format | Use the `$json` prefix explicitly |
| Too many rounds for a simple task | The default mode runs ten rounds, which is heavy for a quick refinement | Use `$short` for three rounds or `$raw` for zero |
| The skill's confidence dropped below fifty percent | The request did not carry enough prompt-engineering signals | The skill will ask a single comprehensive question before it processes anything |
| A CLI dispatch card failed or was rejected | The prompt did not carry enough quality evidence for the executor to accept it | Run `$refine` for a full optimization pass, then re-dispatch with the transparency report attached |

---

## 7. FAQ

**Q: What is the difference between `$improve` and `$refine`?**

A: `$improve` is the standard enhancement path. Ten rounds, framework selection and CLEAR scoring. `$refine` runs the same pipeline but targets maximum optimization. Reach for `$refine` when a prompt scored 35 to 39 and you need to push it over forty, or when the prompt is heading to a high-stakes dispatch.

**Q: Can I name a framework directly instead of letting the skill pick one?**

A: Yes. State the framework name in your request, and the skill runs the full DEPTH pass through that framework. The selection algorithm still fires in the background so the transparency report confirms the fit.

**Q: What happens when CLEAR cannot reach forty after three iterations?**

A: The skill delivers the highest-scoring version with an explicit escalation note. It tells you why the score stalled, which dimensions blocked the pass and how to add context or switch frameworks to get across the line.

**Q: Does the skill change my intent when it reworks a prompt?**

A: No. An intent-preservation check runs during Prototype. The skill must preserve your stated goal, audience and constraints unless you explicitly ask it to broaden or narrow scope. Flagged assumptions appear in the transparency report so you can spot where inference filled a gap.

**Q: How does this differ from `sk-prompt-models`?**

A: sk-prompt owns the framework definitions, the DEPTH methodology and the CLEAR rubric. It answers "what is RCAF" and "how do I score a prompt." `sk-prompt-models` owns the per-model mapping. It answers "which framework should MiniMax use" and adds the model-specific scaffold and gotchas. When you dispatch to a small model, `sk-prompt-models` reads sk-prompt's framework set, picks the best fit for that model and layers on the prompt-craft profile.

---

## 8. VERIFICATION

| Check | How to run it |
|---|---|
| README structure | `python3 .opencode/skills/sk-doc/scripts/validate_document.py .opencode/skills/sk-prompt/README.md --type readme` reports zero issues |
| Manual testing playbook | Scenarios under `manual_testing_playbook/` cover mode detection, smart routing, the DEPTH-CLEAR loop, CLEAR scoring, framework selection, escalation tiers and format modes |
| Agent contract | The `@prompt-improver` output block contract lives in `SKILL.md` Section 7. Validate with the playbook scenarios under `manual_testing_playbook/06--escalation-tiers/` |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router, the mode table, the agent contract and the full rule set |
| [`references/patterns_evaluation.md`](./references/patterns_evaluation.md) | The seven framework definitions, the selection algorithm and the CLEAR rubric |
| [`references/depth_framework.md`](./references/depth_framework.md) | The DEPTH five-phase methodology, energy levels, round configuration and RICCE integration |
| [`references/design_generation_patterns.md`](./references/design_generation_patterns.md) | Design-generation prompt patterns for open-design: the grounded anti-default brief, seed-of-thought variation, discovery-form pre-answer and the sk-code handoff |
| [`assets/framework-registry.json`](./assets/framework-registry.json) | Machine-readable scaffold registry with code-oriented slot templates for a subset of five frameworks |
| [`assets/format_guide_markdown.md`](./assets/format_guide_markdown.md) | Markdown delivery format deep-dive |
| [`assets/format_guide_json.md`](./assets/format_guide_json.md) | JSON delivery format deep-dive |
| [`assets/format_guide_yaml.md`](./assets/format_guide_yaml.md) | YAML delivery format deep-dive |
| [`manual_testing_playbook/manual_testing_playbook.md`](./manual_testing_playbook/manual_testing_playbook.md) | Scenario-based manual validation covering all modes, the DEPTH-CLEAR loop and the agent contract |
