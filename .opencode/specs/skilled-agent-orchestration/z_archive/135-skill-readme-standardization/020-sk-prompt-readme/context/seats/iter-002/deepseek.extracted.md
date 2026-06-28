Let me also check for the playbook and any additional files.
Now I have all the data. Here is the verification report:

---

## 1. EXACT INVOCATION

**Command surface:** `/prompt` dispatches to this skill (the standard skill-invocation path). The `@prompt-improver` agent is the fresh-context escalation target (`.opencode/skills/sk-prompt/SKILL.md:27`, `.opencode/skills/sk-prompt/SKILL.md:370`).

**Mode flags** (`.opencode/skills/sk-prompt/SKILL.md:30-31` and `.opencode/skills/sk-prompt/SKILL.md:244-253`):

| Flag | Mode | DEPTH Rounds | Scoring |
|---|---|---|---|
| *(no prefix)* | Interactive (default) | 10 | CLEAR |
| `$text` | Text | 10 | CLEAR |
| `$short` | Short | 3 | CLEAR |
| `$improve` | Improve | 10 | CLEAR |
| `$refine` | Refine | 10 | CLEAR |
| `$json` | JSON | 10 | CLEAR |
| `$yaml` | YAML | 10 | CLEAR |
| `$raw` | Raw | 0 | None |

**Additional aliases** found only in `references/depth_framework.md` and `README.md`, NOT in `SKILL.md`'s activation trigger list:
- `$s` — alias for `$short` (`.opencode/skills/sk-prompt/references/depth_framework.md:38,62`)
- `$deep:q`
- `$d` — triggers Deep energy level (`.opencode/skills/sk-prompt/references/depth_framework.md:40,69`; `.opencode/skills/sk-prompt/README.md:184`)

**Outputs:** The enhanced prompt plus a transparency report containing: framework selected, DEPTH rounds applied, CLEAR score breakdown, and assumptions flagged (`.opencode/skills/sk-prompt/SKILL.md:296-297`). The `@prompt-improver` agent additionally returns a structured output block: `FRAMEWORK`, `CLEAR_SCORE`, `RATIONALE`, `ENHANCED_PROMPT`, `ESCALATION_NOTES` (`.opencode/skills/sk-prompt/SKILL.md:392-399`).

---

## 2. CAPABILITY ROSTER

**Seven frameworks** (`.opencode/skills/sk-prompt/SKILL.md:13`, `.opencode/skills/sk-prompt/references/patterns_evaluation.md:30-38`):

1. **RCAF** — Role, Context, Action, Format (92% success rate, covers ~80% of prompts)
2. **COSTAR** — Context, Objective, Style, Tone, Audience, Response (94%)
3. **RACE** — Role, Action, Context, Execute (88%)
4. **CIDI** — Context, Instructions, Details, Input (90%)
5. **TIDD-EC** — Task, Instructions, Do's, Don'ts, Examples, Context (93%)
6. **CRISPE** — Capacity, Insight, Statement, Personality, Experiment (87%)
7. **CRAFT** — Context, Role, Action, Format, Target (91%)

**Framework-selection logic:** Score each framework against five task characteristics — complexity (1-10), urgency (bool), audience_specific (bool), creative_element (bool), precision_critical (bool) — select highest score (`.opencode/skills/sk-prompt/references/patterns_evaluation.md:42-84`). SKILL.md §4 requires scoring at least 3 frameworks before selecting (`.opencode/skills/sk-prompt/SKILL.md:305-306`).

**DEPTH methodology** (`.opencode/skills/sk-prompt/references/depth_framework.md:14,29`):

| Phase | Purpose |
|---|---|
| **D** - Discover | Map prompt, identify weaknesses, select framework, surface assumptions, analyze from 3-5 perspectives |
| **E** - Engineer | Generate 8+ enhancement approaches, apply constraint reversal, select best approach |
| **P** - Prototype | Build structured draft with mechanism-first ordering (WHY before WHAT), apply format |
| **T** - Test | Apply CLEAR scoring, check per-dimension floors, verify intent preservation |
| **H** - Harmonize | Final polish, confirm perspectives, prepare transparency metadata |

**RICCE integration** (`.opencode/skills/sk-prompt/references/depth_framework.md:246-258`): CLEAR dimensions map to RICCE criteria — Correctness→Relevance/Correctness, Logic→Coherence, Expression→Clarity (implicit), Arrangement→Coherence/Efficiency, Reusability→Efficiency.

**CLEAR scoring** (`.opencode/skills/sk-prompt/SKILL.md:271`; `.opencode/skills/sk-prompt/references/patterns_evaluation.md:574-580,662-671`):

| Dimension | Max | Weight | Floor | Measures |
|---|---|---|---|---|
| **C**orrectness | 10 | 20% | 7 | Accuracy, no contradictions, valid assumptions |
| **L**ogic | 10 | 20% | 7 | Reasoning flow, cause-effect, conditional handling |
| **E**xpression | 15 | 30% | 10 | Clarity, specificity, minimal ambiguity |
| **A**rrangement | 10 | 20% | 7 | Structure, organization, logical flow |
| **R**eusability | 5 | 10% | 3 | Adaptability, parameterization, flexibility |
| **Total** | **50** | | **40 to pass** | |

Thresholds (`.opencode/skills/sk-prompt/references/depth_framework.md:317-324`): 40-50 = PASS, 30-39 = REVISION NEEDED, 0-29 = REJECTED. A total ≥40 with any per-dimension floor unmet still requires revision.

---

## 3. KEY FILES

| Real path | Role |
|---|---|
| `.opencode/skills/sk-prompt/SKILL.md` | AI entry point: mode detection, smart routing pseudocode, operating rules, agent invocation contract |
| `.opencode/skills/sk-prompt/README.md` | Human-readable overview, quick start, feature reference, troubleshooting, FAQ |
| `.opencode/skills/sk-prompt/references/depth_framework.md` | DEPTH methodology: five phases, energy levels (Raw/Quick/Standard/Deep), cognitive techniques, RICCE integration, CLEAR scoring |
| `.opencode/skills/sk-prompt/references/patterns_evaluation.md` | Seven framework definitions, selection algorithm, CLEAR scoring rubrics, REPAIR protocol, enhancement patterns |
| `.opencode/skills/sk-prompt/assets/framework-registry.json` | Machine-readable scaffold registry (code-oriented subset: RCAF, RACE, CIDI, TIDD-EC, COSTAR — only 5 of 7 frameworks) |
| `.opencode/skills/sk-prompt/assets/format_guide_markdown.md` | Markdown format deep-dive: delivery standards, RCAF/CRAFT structures, validation, best practices |
| `.opencode/skills/sk-prompt/assets/format_guide_json.md` | JSON format deep-dive: data types, delivery standards, RCAF/CRAFT structures, validation, best practices |
| `.opencode/skills/sk-prompt/assets/format_guide_yaml.md` | YAML format deep-dive: data types, delivery standards, templates, validation, best practices |
| `.opencode/skills/sk-prompt/manual_testing_playbook/manual_testing_playbook.md` | Manual validation playbook |
| `.opencode/skills/sk-prompt/graph-metadata.json` | Skill graph metadata for advisor indexing |
| `.opencode/skills/sk-prompt/changelog/` | Versioned changelogs (v1.0.0.0 through v2.1.3.0) |

---

## 4. WORKFLOWS & OUTPUTS

**Enhancement pipeline** (`.opencode/skills/sk-prompt/SKILL.md:216-238`):

```
STEP 1: Mode Detection (command prefix or keyword scoring, ≥80% confidence = auto-route)
    → Ask ONE comprehensive question (all modes except $raw)
STEP 2: Framework Selection (score 7 frameworks against complexity/urgency/audience/creativity/precision, select primary + alternative)
STEP 3: DEPTH Processing (0/3/10 rounds depending on mode, through D→E→P→T→H phases)
STEP 4: Scoring & Delivery (CLEAR scoring, verify 40+/50 threshold, deliver enhanced prompt with transparency report)
```

**What it produces:**
- An enhanced structured prompt in the selected framework format
- A transparency report containing: mode used, framework selected with rationale, DEPTH rounds applied, perspectives used, CLEAR score per dimension, assumptions flagged (`.opencode/skills/sk-prompt/SKILL.md:296-297`)
- For `@prompt-improver` agent: a structured output block with `FRAMEWORK`, `CLEAR_SCORE`, `RATIONALE`, `ENHANCED_PROMPT`, `ESCALATION_NOTES` (`.opencode/skills/sk-prompt/SKILL.md:392-399`)
- RICCE validation: Role, Instructions, Context, Constraints, Examples must be present or documented as intentionally omitted (`.opencode/skills/sk-prompt/SKILL.md:291-292`)

---

## 5. TROUBLESHOOTING & FAQ

**Concrete failure modes** (`.opencode/skills/sk-prompt/README.md:233-280`):

1. **CLEAR score below 40 after DEPTH processing** — insufficient context in original prompt, or framework-task mismatch. Fix: provide more context; request framework switch
2. **Wrong framework selected** — ambiguous task description causes scoring algorithm to underestimate complexity. Fix: state complexity explicitly or name the framework directly
3. **JSON output contains Markdown formatting** — `$json` prefix was not used; keyword detection matched "JSON" in text but didn't activate JSON-only mode. Fix: use `$json` prefix
4. **Mode detection picks wrong mode** — keyword overlap across modes. Fix: use explicit command prefix
5. **DEPTH rounds feel excessive for simple task** — Standard/Improve default to 10 rounds. Fix: use `$short` (3 rounds) or `$raw` (0 rounds)

**FAQ** (`.opencode/skills/sk-prompt/README.md:285-306`):

- **`$refine` vs `$improve`:** Both run 10 rounds and same framework selection. `$refine` signals high-stakes intent for maximum optimization; the transparency report reflects a maximum-effort pass.
- **Can I specify a framework directly?** Yes — name it explicitly. The skill skips auto-selection. If it's a poor fit, the transparency report flags it.
- **What if CLEAR can't reach 40 after all cycles?** After max iterations the skill delivers the best version with a scored transparency report and offers three options: accept, more context + retry, or framework switch. (depth_framework.md §5 Improvement Protocol caps at 3 iterations — `.opencode/skills/sk-prompt/references/depth_framework.md:398`)
- **Does it modify my original intent?** No. Prototype and Test phases include an intent preservation check. Changes that alter core meaning are rolled back and flagged.

**How it differs from sk-prompt-models:** `sk-prompt` is the general prompt-engineering engine with 7 frameworks, DEPTH, and CLEAR scoring for any AI prompt. `sk-prompt-models` is a per-model prompt-craft hub specifically for small-model dispatch (SWE-1.6, DeepSeek-v4-pro, Kimi-k2.6, etc.) across `cli-devin` and `cli-opencode` — it owns per-model prompt-craft profiles in `references/models/` and deals with executor-specific mechanics. Not documented in `sk-prompt/`'s own files; sourced from the system-level available-skills listing.

---

## 6. STALE FACTS IN CURRENT README

1. **`$deep`/`$d` mode listed in README but absent from SKILL.md's operating modes table.** README §5 line 184 claims `$deep`/`$d` as a Deep mode. SKILL.md's authoritative mode table (§3, lines 244-253) lists exactly 8 modes and does NOT include `$deep`/`$d`. The depth_framework.md supports Deep energy level with `$deep`/`$d` triggers, but the skill's own mode-definition table does not recognize it as a first-class mode.

2. **`$s` alias for `$short` not in SKILL.md's activation triggers.** README §5 line 179 and depth_framework.md line 62 list `$s` as an alias. SKILL.md §1 activation triggers (line 30) lists `$short` only, no `$s`.

3. **`$deep`/`$d`/`$s` completely absent from SKILL.md §1 activation trigger list.** SKILL.md lines 30-31 enumerate trigger keywords: `$improve`, `$text`, `$short`, `$refine`, `$json`, `$yaml`, `$raw`. Neither `$deep`, `$d`, nor `$s` appear.

4. **Internal README inconsistency: 8 modes claimed in §1/§3.2 but 9 modes listed in §5.** README line 34 states "Operating Modes: 8", and the §3.2 table has 8 rows. README §5 Configuration (line 184) adds a 9th row for `$deep`/`$d`, contradicting the count claim.

5. **SKILL.md internal inconsistency: "5-10 rounds" label in pipeline vs. actual mode table.** SKILL.md line 227 says "STEP 3: DEPTH Processing (5-10 rounds)". The actual operating modes table (lines 244-253) shows only 0, 3, or 10 rounds — no mode uses 5, 6, 7, 8, or 9 rounds.

6. **framework-registry.json lists only 5 frameworks, not 7.** The machine-readable registry (`.opencode/skills/sk-prompt/assets/framework-registry.json`) contains only RCAF, RACE, CIDI, TIDD-EC, COSTAR. CRISPE and CRAFT are missing. The registry description states a code-oriented scaffold subset, but a README that claims 7 frameworks and points to this file as a reference would overstate its coverage.