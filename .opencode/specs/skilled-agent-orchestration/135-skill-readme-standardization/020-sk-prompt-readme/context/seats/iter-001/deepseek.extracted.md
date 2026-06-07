## 1. PURPOSE

`sk-prompt` transforms vague AI prompts into structured, scored outputs by automatically selecting the best-matching framework from a library of seven, applying iterative DEPTH thinking, and validating quality with CLEAR scoring.

## 2. PROBLEM

A vague or underspecified prompt yields a poor result because the model must guess at the user's intent, audience, constraints, and desired output format — each guess is a chance to fail. Ad-hoc prompting (typing a sentence and hoping) lacks structure, so critical elements like role definition, context boundaries, success criteria, and output contracts are silently absent, and the resulting output is inconsistent. A framework forces those missing elements into the prompt before it reaches the model, and a structured thinking pass (DEPTH) iteratively discovers weaknesses, generates alternatives, and validates completeness. A quality score (CLEAR 40+/50) provides an objective gate: if the enhanced prompt falls below threshold, the skill cycles through targeted improvement rather than shipping a weak result.

## 3. MODES & CAPABILITIES

- **Seven frameworks with automatic selection**: RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT — scored against task complexity (1–10), urgency, audience specificity, creative needs, and precision requirements; the highest-scoring framework is selected and an alternative is offered.
- **DEPTH thinking methodology**: Five-phase iterative refinement (Discover → Engineer → Prototype → Test → Harmonize) scaled by energy level — 10 rounds for standard modes, 3 for `$short`, 0 for `$raw`; every phase has mandatory exit gates (e.g., ≥3 perspectives blocking at Standard, CLEAR ≥40 to exit Test).
- **CLEAR scoring with per-dimension floors**: 50-point scale (Correctness 10 + Logic 10 + Expression 15 + Arrangement 10 + Reusability 5); must reach 40+ overall and meet every per-dimension floor (C≥7, L≥7, E≥10, A≥7, R≥3) before delivery.
- **Interactive mode**: No prefix, one consolidated clarifying question before processing, guided walkthrough with transparency report.
- **Text mode** (`$text`): Standard 10 DEPTH rounds with CLEAR scoring for text prompt improvement.
- **Raw mode** (`$raw`): Zero DEPTH rounds, no scoring, passthrough with no enhancement.

## 4. INVOCATION

The skill is activated via Gate 2 skill routing when prompt-engineering intent is detected, or directly via the `/prompt` command. The `@prompt-improver` agent is the fresh-context escalation surface — it loads the same references, runs the same framework-selection and CLEAR rules, and returns a structured output block (FRAMEWORK, CLEAR_SCORE, RATIONALE, ENHANCED_PROMPT, ESCALATION_NOTES). Mode is selected by command prefix (`$improve`, `$text`, `$short`, `$refine`, `$json`, `$yaml`, `$raw`) or by keyword-weighted intent scoring when no prefix is present. The workflow has three phases: (1) Framework Selection — score all seven frameworks against task characteristics, pick the best fit; (2) DEPTH Processing — run 3–10 rounds across the five cognitive phases; (3) Scoring & Delivery — apply CLEAR scoring, verify threshold and floors, deliver the enhanced prompt with a transparency report (mode, framework, perspectives, score breakdown, assumptions flagged).

## 5. KEY FILES

| Path | Purpose |
|------|---------|
| `SKILL.md` | AI entry point: mode detection, smart routing pseudocode, operating modes table, rules, agent invocation contract |
| `README.md` | Human-readable skill documentation: overview, quick start, feature reference, configuration, usage examples, troubleshooting, FAQ |
| `references/depth_framework.md` | DEPTH methodology: five phases, four energy levels, cognitive techniques, CLEAR scoring integration, RICCE mapping, repair protocol |
| `references/patterns_evaluation.md` | Seven framework definitions with deep-dive patterns per framework, framework selection algorithm, CLEAR scoring rubrics, framework fusion patterns |
| `assets/framework-registry.json` | Machine-readable framework registry with slot-based templates (RCAF, RACE, CIDI, TIDD-EC, COSTAR) — partial, covering 5 of 7 frameworks, all labeled `applies_to: ["code"]` |
| `assets/format_guide_markdown.md` | Markdown format deep-dive: delivery standards, RCAF/CRAFT structures, validation, best practices |
| `assets/format_guide_json.md` | JSON format deep-dive: data types, nested structures, CLEAR validation for API outputs |
| `assets/format_guide_yaml.md` | YAML format deep-dive: templates, validation, best practices for config-style prompts |
| `graph-metadata.json` | Skill graph metadata: dependencies, enhances edges to `cli-*` skills, derived trigger phrases, entity index |
| `manual_testing_playbook/manual_testing_playbook.md` | Manual validation playbook with scenario-based tests across mode detection, routing, DEPTH/CLEAR loops, scoring, framework selection, escalation, and format modes |

## 6. BOUNDARIES

This skill owns the **generic framework definitions** (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT), the DEPTH methodology, and CLEAR scoring. It does **not** own per-model dispatch — that belongs to `sk-prompt-small-model`, which selects a model-specific framework subset, prompt scaffold, and model profile from this engine's library before handing off to a CLI executor. It does **not** own executor mechanics — the `cli-*` skills (claude-code, codex, devin, opencode) consume the output but handle their own binary invocation. It does **not** own code generation (use `sk-code`), documentation authoring (use `sk-doc`), or code review (use `sk-code-review`). The `@prompt-improver` agent is a leaf-only escalation surface that loads this skill's references; it does not own independent logic.

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**
- **CLEAR score below 40 after DEPTH**: typically caused by insufficient context in the original prompt or a framework mismatch. The skill offers three options: additional refinement, framework switch, or accept-with-flag.
- **Wrong framework selected**: ambiguity in the task description causes the scoring algorithm to underestimate complexity. Fix by stating complexity explicitly or naming the desired framework directly.
- **JSON output contains Markdown formatting**: the `$json` prefix was not used; keyword overlap ("JSON" in prompt text) confused mode detection without activating JSON-only mode.
- **Excessive DEPTH rounds for simple tasks**: Standard mode defaults to 10 rounds; use `$short` (3 rounds) or `$raw` (0 rounds) for lightweight tasks.

**Frequently asked questions:**
- *"When should I use `$refine` instead of `$improve`?"* — Both run 10 rounds and use identical framework selection. `$refine` signals high-stakes intent in the transparency report.
- *"Can I name a framework explicitly?"* — Yes; the skill skips auto-selection and applies the named framework. A poor fit is flagged in the transparency report.
- *"What if the skill can't reach CLEAR 40?"* — After three improvement iterations it stops cycling and delivers the best version with explicit options: accept, add context, switch framework.
- *"Does the skill change my original intent?"* — No; DEPTH Prototype and Test phases include an intent preservation check; changes that alter core meaning are rolled back and flagged.

## 8. STALE FACTS

1. **README §5 Configuration table lists `$deep` / `$d` → "Deep" as a command prefix mode** with "Extended Discover phase, all 5 perspectives required." SKILL.md §3 authoritative operating modes table has only 8 modes and does **not** include a `$deep`/`$d` mode. SKILL.md §2 keyword list also omits `$deep`. The depth_framework.md (`references/depth_framework.md`) defines Deep as an energy level (not a top-level invocation mode), and its `$deep`/`$d` trigger is an energy-level routing signal within the DEPTH framework, not a standalone mode with its own DEPTH round count in the SKILL.md modes table.

2. **README §4 file structure tree omits four files/directories that exist in the skill directory**: `assets/framework-registry.json`, `changelog/` (10 versioned changelog entries), `manual_testing_playbook/` (8 subdirectories + root playbook), and `graph-metadata.json`.

3. **`assets/framework-registry.json` contains only 5 frameworks** (RCAF, RACE, CIDI, TIDD-EC, COSTAR) while the skill and README both advertise 7 — CRISPE and CRAFT are absent from the machine-readable registry. All 5 entries have `"applies_to": ["code"]`, which does not reflect the communication, creative, planning, and strategy use cases covered by the full seven-framework library.

4. **README §1 "Key Statistics" says "Operating Modes: 8"** but §5 Configuration table lists 9 command prefixes (adding `$deep`/`$d`), creating an internal inconsistency of 8 vs. 9 modes within the README itself.