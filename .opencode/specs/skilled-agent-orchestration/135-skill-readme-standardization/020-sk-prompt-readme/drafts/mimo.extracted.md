---
title: sk-prompt
description: Prompt engineering specialist that turns vague asks into structured prompts by auto-selecting from seven frameworks, running a five-phase DEPTH thinking pass and scoring the result with CLEAR.
trigger_phrases:
  - "improve prompt"
  - "prompt engineering"
  - "framework"
  - "CLEAR scoring"
  - "/prompt"
---

# sk-prompt

> Turn a vague ask into a structured prompt that clears a quality bar before you send it.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | Enhancing, scoring and framework-matching AI prompts for any task |
| **Invoke with** | `/prompt` command, `$text`, `$short`, `$improve`, `$refine`, `$json`, `$yaml`, `$raw` mode flags or `@prompt-improver` agent dispatch |
| **Works on** | Any text prompt or task description, delivered in Markdown, JSON or YAML |
| **Produces** | An enhanced prompt, a transparency report (framework, CLEAR breakdown, rounds, flagged assumptions) and a pass/fail score |

---

## 2. OVERVIEW

### Why This Skill Exists

A vague prompt gets a vague answer. You under-specify the role, skip the constraints, bury the real ask and leave the model to guess. Then you blame the model when the output misses. Picking a framework by feel does not help either, because different tasks want different shapes and there is no signal for when a prompt is good enough to send. The result is trial and error that wastes tokens and time.

### What It Does

sk-prompt scores your task against seven frameworks and picks the best fit. It runs a structured five-phase DEPTH thinking pass that surfaces assumptions, engineers the prompt from multiple angles and tests it against a fixed rubric. The result ships only when it clears the CLEAR threshold of forty out of fifty. You get the enhanced prompt and a transparency report showing which framework was chosen, how many rounds ran and where each dimension scored.

The `/prompt` command is the primary entry point. The `@prompt-improver` agent serves as the fresh-context escalation surface for CLI prompt cards, returning a structured block that callers inject into a dispatch without loading the full skill inline.

---

## 3. QUICK START

**Step 1: Invoke it.**

```bash
/prompt Improve this: write a blog post about AI
```

The skill detects mode from keywords and loads the matching references.

**Step 2: Run the primary workflow.**

```bash
/prompt $short Write a user story for password reset
```

```
FRAMEWORK: RCAF
CLEAR_SCORE: 43/50 (C:9 L:9 E:13 A:8 R:4)
RATIONALE: RCAF fits the low-complexity, clarity-focused task.
ENHANCED_PROMPT: |
  Role: You are a product manager writing user stories.
  Context: The application has a password reset flow...
  Action: Write a single user story...
  Format: Use the standard user story template...
ESCALATION_NOTES: None. Score clears threshold.
```

The `$short` flag runs three DEPTH rounds instead of ten, which suits straightforward tasks.

**Step 3: Verify before you rely on it.**

Run the manual testing playbook to confirm mode detection, framework selection and CLEAR scoring behave as expected.

```bash
Read(".opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md")
```

The playbook covers seven scenario groups: mode detection, smart routing, DEPTH loop, CLEAR scoring, framework selection, escalation tiers and format modes.

---

## 4. HOW IT WORKS

### Framework Selection

Seven frameworks cover the prompt engineering space. The skill scores each one against your task characteristics (complexity, urgency, audience, creativity, precision) and picks a primary framework plus an alternative. The definitions and selection algorithm live in `references/patterns_evaluation.md`.

| Framework | Elements | Best For |
|---|---|---|
| **RCAF** | Role, Context, Action, Format | General tasks, 80% of prompts |
| **COSTAR** | Context, Objective, Style, Tone, Audience, Response | Content creation, communication |
| **RACE** | Role, Action, Context, Execute | Urgent tasks, quick iterations |
| **CIDI** | Context, Instructions, Details, Input | Process documentation, tutorials |
| **TIDD-EC** | Task, Instructions, Do's, Don'ts, Examples, Context | Quality-critical, compliance |
| **CRISPE** | Capacity, Insight, Statement, Personality, Experiment | Strategy, exploration |
| **CRAFT** | Context, Role, Action, Format, Target | Complex projects, planning |

The skill scores at least three frameworks before committing to one. The `assets/framework-registry.json` file holds a machine-readable scaffold for a code-oriented subset of five of these (RCAF, RACE, CIDI, CRISPE, CRAFT). The full definitions for all seven live in `references/patterns_evaluation.md`.

### DEPTH Thinking

DEPTH is a five-phase thinking pass that runs over a mode-driven number of rounds:

1. **Discover** - Map the prompt from multiple perspectives (minimum three, target five). Surface assumptions. Select the framework.
2. **Engineer** - Generate enhancement approaches. Apply constraint reversal. Pick the strongest.
3. **Prototype** - Build the structured draft. Validate against RICCE (Role, Instructions, Context, Constraints, Examples).
4. **Test** - Score against CLEAR. Apply quality gates.
5. **Harmonize** - Final polish. Attach transparency metadata.

The round count is mode-driven: zero for `$raw`, three for `$short`, ten for the standard modes. The methodology and RICCE integration are defined in `references/depth_framework.md`.

### CLEAR Scoring

CLEAR is a five-dimension rubric scored out of fifty:

| Dimension | Max | What It Measures |
|---|---|---|
| Correctness | 10 | Factual accuracy and task alignment |
| Logic | 10 | Structural coherence and flow |
| Expression | 15 | Clarity, tone and readability |
| Arrangement | 10 | Organisation and formatting |
| Reusability | 5 | Adaptability to similar tasks |

The pass threshold is forty. Each dimension has a floor that blocks a pass even when the total clears forty. Bands: pass at forty and up, revision at thirty to thirty-nine, rejected below thirty.

### Modes

| Mode | Flag | DEPTH Rounds | Scoring | Use Case |
|---|---|---|---|---|
| Interactive | (default) | 10 | CLEAR | Guided enhancement with questions |
| Text | `$text` | 10 | CLEAR | Standard text prompt |
| Short | `$short` | 3 | CLEAR | Quick refinement |
| Improve | `$improve` | 10 | CLEAR | Standard enhancement |
| Refine | `$refine` | 10 | CLEAR | Maximum optimisation |
| JSON | `$json` | 10 | CLEAR | API-ready output format |
| YAML | `$yaml` | 10 | CLEAR | Config-style output format |
| Raw | `$raw` | 0 | None | Skip DEPTH, fast pass-through |

The improvement cycle caps at three iterations and delivers the best version with a scored note.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for sk-prompt when you need to enhance a vague or under-specified prompt, when you want a framework recommendation for a task or when you need a quality score before sending a prompt to a model. Skip it for writing code (use `sk-code`), creating documentation (use `sk-doc`) or bare text editing that needs no prompt structure.

### Boundaries With Sibling Skills

sk-prompt owns the generic framework definitions, the DEPTH methodology and the CLEAR rubric. It does not own the per-model dispatch choice: `sk-prompt-small-model` decides which of these seven frameworks a given small model (MiniMax, MiMo, Kimi, Qwen and others) wants, and adds the model-specific scaffold and gotchas. The cli-X skills (`cli-codex`, `cli-claude-code`, `cli-devin`, `cli-opencode`) own the executor mechanics for invoking models from the terminal.

In short: sk-prompt defines what RCAF or TIDD-EC is and how to score a prompt. `sk-prompt-small-model` decides which one a specific small model should use. The cli-X skills handle the actual dispatch.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-prompt-small-model` | Chooses which framework a small model wants and adds model-specific scaffolds |
| `sk-doc` | Owns documentation outputs; sk-prompt enhances the prompts that produce them |
| `sk-code` | Owns code generation and tests; sk-prompt enhances the prompts that drive them |
| `cli-codex` | Executor mechanics for Codex CLI dispatch |
| `cli-claude-code` | Executor mechanics for Claude Code CLI dispatch |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| CLEAR below forty after DEPTH | Input lacked context or the framework did not fit | Add more context to your prompt or name a framework directly with `$improve` |
| Wrong framework selected | Ambiguous task underscored its complexity | State the complexity level or name the framework (e.g., `/prompt Use TIDD-EC for...`) |
| JSON output carries Markdown | The `$json` prefix was not used | Use the explicit `$json` flag: `/prompt $json your request` |
| Too many rounds for a simple task | Default mode runs ten rounds | Switch to `$short` for three rounds or `$raw` for zero |
| Skill does not activate | Request lacks prompt-related keywords | Use the `/prompt` command prefix or include "improve prompt" in your request |

---

## 7. FAQ

**Q: How does `$refine` differ from `$improve`?**

A: Both run ten DEPTH rounds and apply CLEAR scoring. `$refine` targets maximum optimisation and is suited for prompts that already have some structure. `$improve` is the standard enhancement path for any prompt.

**Q: Can I name a framework directly?**

A: Yes. Include the framework name in your request (e.g., `/prompt Use COSTAR to write...`). The skill applies it instead of auto-selecting.

**Q: What happens when CLEAR cannot reach forty?**

A: The skill suggests three options: run an additional refinement round, switch to a different framework or accept the prompt as-is. The escalation notes in the transparency report explain which dimension fell short.

**Q: Does the skill change my intent?**

A: No. sk-prompt has an intent-preservation check. It restructures and enhances your prompt but flags any assumptions it made in the transparency report. You review and accept before sending.

**Q: What is the difference between sk-prompt and sk-prompt-small-model?**

A: sk-prompt defines the seven frameworks, the DEPTH methodology and the CLEAR rubric. `sk-prompt-small-model` decides which of those frameworks a specific small model (like MiniMax or MiMo) should use and adds the model-specific scaffold and gotchas for dispatch.

---

## 8. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Runtime instructions, the smart router and the full rule set |
| [`references/patterns_evaluation.md`](./references/patterns_evaluation.md) | Seven framework definitions, the selection algorithm and the CLEAR rubric |
| [`references/depth_framework.md`](./references/depth_framework.md) | DEPTH five-phase methodology, energy levels and RICCE integration |
| [`assets/format_guide_markdown.md`](./assets/format_guide_markdown.md) | Markdown delivery format deep-dive |
| [`assets/format_guide_json.md`](./assets/format_guide_json.md) | JSON delivery format deep-dive |
| [`assets/format_guide_yaml.md`](./assets/format_guide_yaml.md) | YAML delivery format deep-dive |
| [`assets/framework-registry.json`](./assets/framework-registry.json) | Machine-readable scaffold registry for the code-oriented framework subset |
| [`manual_testing_playbook/manual_testing_playbook.md`](./manual_testing_playbook/manual_testing_playbook.md) | Manual validation scenarios for mode detection, routing, DEPTH and scoring |
