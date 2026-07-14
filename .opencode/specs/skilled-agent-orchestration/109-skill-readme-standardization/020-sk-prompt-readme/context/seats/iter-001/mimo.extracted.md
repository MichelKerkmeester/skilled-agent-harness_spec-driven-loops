Now I have all the data needed. Here is the factual map:

---

## 1. PURPOSE

Transforms vague or under-specified AI prompts into structured, high-quality outputs through a four-phase pipeline of mode detection, automatic framework selection (7 frameworks), DEPTH iterative refinement, and CLEAR quality scoring.

## 2. PROBLEM

A vague prompt yields poor results because the model lacks context, role clarity, and structural constraints — leading to ambiguous, off-target, or shallow outputs. Ad-hoc prompting offers no way to measure or improve quality; the user iterates blindly. `sk-prompt` solves this by matching every request to the best-fit structural framework, running a multi-round thinking methodology (DEPTH) that discovers hidden assumptions and generates multiple enhancement approaches, and applying a quantified quality score (CLEAR 40/50) with per-dimension floors so no single weak axis slips through. The result is a repeatable, measurable prompt-engineering process that replaces guesswork with systematic improvement.

## 3. MODES & CAPABILITIES

- **7 frameworks:** RCAF (general, 92%), COSTAR (audience/content, 94%), RACE (speed, 88%), CIDI (instructions/tutorials, 90%), TIDD-EC (precision/compliance, 93%), CRISPE (strategy/exploration, 87%), CRAFT (complex projects, 91%).
- **Automatic framework selection:** scores each framework against task complexity (1-10), urgency, audience specificity, creativity, and precision needs; picks best match + alternative.
- **DEPTH thinking:** 5-phase iterative methodology — Discover, Engineer, Prototype, Test, Harmonize — with energy levels (Raw/Quick/Standard/Deep) controlling phase count, perspective count (min 3, target 5), and cognitive technique application.
- **CLEAR scoring:** 50-point scale — Correctness (10), Logic (10), Expression (15), Arrangement (10), Reusability (5) — with per-dimension floors (C≥7, L≥7, E≥10, A≥7, R≥3) and a 40/50 pass threshold.
- **8 operating modes:** Interactive (default, 10 rounds), Text (`$text`, 10), Short (`$short`, 3), Improve (`$improve`, 10), Refine (`$refine`, 10), JSON (`$json`, 10), YAML (`$yaml`, 10), Raw (`$raw`, 0 rounds, no scoring).
- **Invocation modes:** interactive (no prefix, guided), text/improve/refine (standard enhancement), raw (passthrough, skip DEPTH entirely).

## 4. INVOCATION

- **Trigger:** `/prompt` command or `@prompt-improver` agent dispatch; keyword triggers ("improve my prompt", "prompt engineering"); command prefixes (`$improve`, `$text`, `$short`, `$refine`, `$json`, `$yaml`, `$raw`, `$deep`).
- **Workflow phases:** (1) Mode Detection — command prefix check, then keyword-weighted intent scoring with ambiguity-delta tiebreaker; (2) Framework Selection — 7 frameworks scored against task characteristics; (3) DEPTH Processing — 5 phases (Discover→Engineer→Prototype→Test→Harmonize), 0-10 rounds per mode; (4) Scoring & Delivery — CLEAR 40+/50 with per-dimension floors, transparency report.
- **Output:** Enhanced prompt in the target format (Markdown/JSON/YAML) plus a transparency report showing framework selected, DEPTH rounds applied, perspectives used, CLEAR score breakdown, and flagged assumptions.
- **Agent contract:** `@prompt-improver` accepts `raw_task`, `task_type`, `target_cli`, `complexity_hint`, `constraints`; returns a structured block (`FRAMEWORK`, `CLEAR_SCORE`, `RATIONALE`, `ENHANCED_PROMPT`, `ESCALATION_NOTES`) ready for CLI handoff.

## 5. KEY FILES

| Path | Purpose |
|------|---------|
| `SKILL.md` | AI entry point: mode detection, smart routing pseudocode, operating rules, pipeline definition |
| `README.md` | Human-facing documentation: overview, quick start, features, examples, troubleshooting, FAQ |
| `references/depth_framework.md` | DEPTH methodology: five phases, four energy levels (Raw/Quick/Standard/Deep), cognitive techniques, RICCE integration, CLEAR integration |
| `references/patterns_evaluation.md` | Framework library (7 frameworks with selection algorithm, success rates), CLEAR scoring rubrics, enhancement patterns, recovery protocols |
| `assets/framework-registry.json` | Machine-readable framework registry with slot-based templates for RCAF, RACE, CIDI, TIDD-EC, COSTAR (5 of 7; CRISPE and CRAFT absent from this file) |
| `assets/format_guide_markdown.md` | Markdown format deep-dive: delivery standards, RCAF/CRAFT structures, validation |
| `assets/format_guide_json.md` | JSON format deep-dive: data types, nested structures, API-ready output |
| `assets/format_guide_yaml.md` | YAML format deep-dive: templates, validation, config-style prompts |
| `manual_testing_playbook/manual_testing_playbook.md` | Manual validation playbook with sub-tests for mode detection, routing, DEPTH/CLEAR loop, framework selection, escalation, format modes |

## 6. BOUNDARIES

- **Does NOT own per-model dispatch:** `sk-prompt-models` (at `.opencode/skills/sk-prompt-models/`) owns per-model prompt-craft profiles, model-specific scaffolds, and dispatch mechanics for small models (SWE-1.6, DeepSeek, Kimi, Qwen, GLM, MiniMax, MiMo). It selects from `sk-prompt`'s framework set but makes its own dispatch and formatting decisions.
- **Does NOT own executor mechanics:** CLI invocation wrappers, binary flags, and provider routing live in `cli-devin`, `cli-opencode`, `cli-codex`, `cli-claude-code`.
- **Does NOT own agent dispatch:** The `@prompt-improver` agent (defined in AGENTS.md) is the caller-facing surface; `sk-prompt` is the engine it loads. The skill defines the agent contract (Section 7 of SKILL.md) but does not control when the agent is dispatched.
- **Owns:** All 7 generic framework definitions, the DEPTH methodology, CLEAR scoring, framework selection algorithm, format guides, and the `framework-registry.json` machine-readable registry.

## 7. TROUBLESHOOTING & FAQ MATERIAL

**Common failure modes:**
- CLEAR score below 40: insufficient input context or framework mismatch; fix by providing more context or naming a framework explicitly.
- Wrong framework selected: ambiguous task description causes scoring algorithm to underestimate complexity; fix by stating complexity explicitly or naming the framework.
- JSON output contains Markdown: `$json` prefix was not used; keyword detection alone does not activate JSON-only mode.
- Mode detection picks wrong mode: keyword overlap across modes; fix by using an explicit command prefix.
- DEPTH rounds feel excessive: standard modes default to 10 rounds regardless of perceived complexity; use `$short` (3 rounds) or `$raw` (0 rounds).

**User FAQ (from README.md):**
1. When should I use `$refine` instead of `$improve`? — Both run 10 rounds; `$refine` signals high-stakes intent.
2. Can I specify which framework to use? — Yes, name it explicitly; the skill skips auto-selection.
3. What happens if CLEAR cannot reach 40? — After 3 iterations the skill stops and delivers the best version with options to accept, refine with more context, or switch frameworks.
4. Does the skill modify the meaning of my original prompt? — No; intent preservation checks in Prototype and Test phases roll back meaning-altering changes.

## 8. STALE FACTS

| Item | Current README.md | Actual (SKILL.md / files) | Status |
|------|-------------------|---------------------------|--------|
| `$deep` / `$d` mode | Listed in CONFIGURATION table (line 184) as a separate mode | Not present in SKILL.md's operating modes table (Section 3); `$deep`/`$d` exists only in `depth_framework.md` as a signal routing trigger for Deep energy level, not as a named operating mode in the skill's own mode table | **Stale** — README adds a mode not listed in SKILL.md's canonical mode table |
| `$s` alias | Listed in CONFIGURATION table (line 179) as alias for `$short` | Not mentioned in SKILL.md's operating modes table or keyword triggers | **Stale** — alias not confirmed in SKILL.md |
| Framework Fusion | README lists 5 fusion combinations (Section 3.2) | Not present in SKILL.md; not found in `patterns_evaluation.md` within the first 80 lines (may exist deeper) | **UNKNOWN** — cannot confirm from partial read of `patterns_evaluation.md`; SKILL.md does not mention fusion |
| `assets/framework-registry.json` | Not mentioned in README | Exists in `assets/` with 5 framework entries (RCAF, RACE, CIDI, TIDD-EC, COSTAR; missing CRISPE, CRAFT) | **Stale** — README omits this file entirely from structure and key files |
| `manual_testing_playbook/` | Not mentioned in README | Exists with 28 test files organized by category | **Stale** — README omits this directory from structure |
| CRAFT "Full-scope" label | README line 112: "Full-scope" | SKILL.md line 265: "Comprehensive" | **Stale** — label mismatch |
| `$text` equivalence claim | README line 178: "Equivalent to Improve for text prompts" | SKILL.md lists them as separate modes with identical config (both 10 rounds, CLEAR scoring) but does not call them equivalent | **Minor stale** — unverified equivalence claim |