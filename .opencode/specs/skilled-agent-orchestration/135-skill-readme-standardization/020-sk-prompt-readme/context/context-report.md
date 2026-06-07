# Context Report: sk-prompt README rewrite

Two-iteration by-model sweep (DeepSeek v4 Pro + MiMo v2.5 Pro, read-only). Both iterations converge with cited file:line evidence on the seven frameworks, the DEPTH methodology, the CLEAR rubric and the invocation modes. Both note the same drift (mode-count inconsistency, the registry holding only five of seven frameworks).

---

## 1. PURPOSE

`sk-prompt` is the prompt-engineering engine. It turns a vague or basic request into a structured, high-quality prompt by selecting one of seven frameworks, running a multi-round DEPTH thinking pass and scoring the result with the CLEAR rubric.

## 2. PROBLEM

A vague prompt gets a vague answer. People under-specify the role, skip the constraints, bury the real ask and leave the model to guess, then blame the model when the output misses. Picking a structure by feel does not help, because different tasks want different shapes and there is no signal for when a prompt is actually good enough to send. This skill scores the task against seven frameworks and picks the best fit, runs a structured thinking pass that surfaces assumptions and engineers the prompt, and scores the result against a fixed rubric with a pass threshold, so a prompt ships only when it clears the bar.

## 3. MODES & CAPABILITIES

- Seven frameworks with automatic selection: RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE and CRAFT, scored against the task and the best fit chosen.
- DEPTH thinking: a five-phase pass (Discover, Engineer, Prototype, Test, Harmonize) run over several rounds, with RICCE woven through it.
- CLEAR scoring: a five-dimension rubric out of fifty with a pass threshold and per-dimension floors.
- Modes: an interactive default plus text, short, improve, refine, json, yaml and a raw pass-through that skips the thinking pass.
- Dispatch: the `/prompt` command and the `@prompt-improver` agent, which is the fresh-context escalation surface for CLI prompt cards.

## 4. THE FRAMEWORKS, DEPTH AND CLEAR (verified)

The seven framework definitions live in `references/patterns_evaluation.md`. The selection algorithm scores each against task characteristics (complexity, urgency, audience, creativity, precision) and the skill scores at least three before choosing a primary and an alternative.

DEPTH (`references/depth_framework.md`) runs five phases: Discover (map the prompt, surface assumptions, analyze from several perspectives, select the framework), Engineer (generate many enhancement approaches, apply constraint reversal, pick the best), Prototype (build the structured draft, mechanism first), Test (CLEAR scoring and quality gates), Harmonize (final polish and the transparency metadata). The round count is mode-driven, zero for raw, three for short, ten for the standard modes.

CLEAR scores out of fifty: Correctness (10), Logic (10), Expression (15), Arrangement (10) and Reusability (5). The pass threshold is forty, and each dimension has a floor that blocks a pass even when the total clears forty. Bands are pass at forty and up, revision at thirty to thirty-nine, rejected below thirty.

## 5. INVOCATION (verified)

`/prompt` dispatches the skill. Mode flags select the depth: the interactive default, `$text`, `$short` (three rounds), `$improve`, `$refine`, `$json`, `$yaml` and `$raw` (zero rounds, no scoring). The `@prompt-improver` agent is the fresh-context escalation target and returns a structured block (the framework, the CLEAR score, the rationale, the enhanced prompt and escalation notes). The output is the enhanced prompt plus a transparency report listing the framework chosen, the rounds applied, the CLEAR breakdown and the flagged assumptions. The improvement cycle caps at three iterations and then delivers the best version with a scored note.

## 6. KEY FILES (real, host-verified)

| Path | Role |
|------|------|
| `SKILL.md` | The mode detection, the smart router, the operating rules and the agent contract |
| `references/depth_framework.md` | The DEPTH five-phase methodology, the energy levels, RICCE integration and the CLEAR integration |
| `references/patterns_evaluation.md` | The seven framework definitions, the selection algorithm and the CLEAR rubric |
| `assets/framework-registry.json` | A machine-readable scaffold registry holding a code-oriented subset of five of the seven frameworks |
| `assets/format_guide_markdown.md` | The Markdown delivery format deep-dive |
| `assets/format_guide_json.md` | The JSON delivery format deep-dive |
| `assets/format_guide_yaml.md` | The YAML delivery format deep-dive |

## 7. BOUNDARIES

sk-prompt owns the generic framework definitions, the DEPTH methodology and the CLEAR rubric. It does not own the per-model dispatch choice: `sk-prompt-small-model` is the hub that chooses which of these frameworks a given small model wants and adds the model-specific scaffold and gotchas. It does not own executor mechanics either, which live in the cli-X skills. In short, sk-prompt defines what RCAF or TIDD-EC is and how to score a prompt; sk-prompt-small-model decides which one MiniMax or MiMo should use.

## 8. TROUBLESHOOTING & FAQ MATERIAL

- CLEAR below forty after the pass: the input lacked context or the framework did not fit. Add context or name a framework.
- Wrong framework selected: an ambiguous task underscored its complexity. State the complexity or name the framework directly.
- JSON output carried Markdown: the `$json` prefix was not used. Use the explicit prefix.
- Too many rounds for a simple task: use `$short` for three rounds or `$raw` for none.
- FAQ: how `$refine` differs from `$improve`, whether you can name a framework directly, what happens when CLEAR cannot reach forty, whether the skill changes your intent (no, it has an intent-preservation check), and how it differs from `sk-prompt-small-model`.

## 9. STALE FACTS

The narrative template drops version lines and brittle counts, so the drift resolves on rewrite:

- Version: the README pins a version that drifts. Drop the version line.
- Mode count: the README claims eight modes in one place and lists nine in another, because the `$deep`/`$d` and `$s` aliases appear in the references but not in the SKILL.md mode table. Describe the modes rather than pin a count.
- Framework registry: `framework-registry.json` holds only five of the seven frameworks (a code-oriented scaffold subset). Do not present it as the source of all seven definitions; those live in `patterns_evaluation.md`.
- The "5 to 10 rounds" phrasing in one SKILL.md line does not match the actual round counts (zero, three or ten). Describe the rounds as mode-driven.

## 10. METHODOLOGY

Two iterations, by-model-shared-scope (DeepSeek + MiMo, read-only). Iteration 1 gathered purpose, the frameworks and the modes; iteration 2 verified the framework set, the DEPTH phases, the CLEAR rubric and the stale facts, each cited to a file and line. Both models agreed on the rubric and the framework set, and both flagged the registry-subset and mode-count drift. Converged before the three-iteration ceiling.
