Now let me verify the format guide files exist:
1. EXACT INVOCATION

- Command: `/prompt` (via Gate 2 skill routing when prompt engineering intent detected). Direct invocation: read `SKILL.md`.
- Agent dispatch: `@prompt-improver` — fresh-context escalation surface. Loads sk-prompt references, applies framework selection + CLEAR rules, returns structured block (`FRAMEWORK`, `CLEAR_SCORE`, `RATIONALE`, `ENHANCED_PROMPT`, `ESCALATION_NOTES`) ready for CLI handoff. Read-only, leaf-only (SKILL.md:370-406).
- Mode flags (SKILL.md:244-254):

| Flag | Mode | DEPTH Rounds |
|------|------|-------------|
| (none) | Interactive | 10 |
| `$text` | Text | 10 |
| `$short` | Short | 3 |
| `$improve` | Improve | 10 |
| `$refine` | Refine | 10 |
| `$json` | JSON | 10 |
| `$yaml` | YAML | 10 |
| `$raw` | Raw | 0 |

- Additional signals from depth_framework.md:37-40: `$s` alias for `$short`, `$deep` / `$d` for Deep energy (extended Discover, all 5 perspectives blocking, all 5 techniques). These appear in `depth_framework.md` but are **not listed in SKILL.md's Operating Modes table** — a gap.
- Output: structured enhanced prompt + transparency report (framework selected, DEPTH rounds, CLEAR score breakdown per dimension). `$raw` skips all DEPTH and scoring.

---

2. CAPABILITY ROSTER

**Seven frameworks** (patterns_evaluation.md:30-38):

| Framework | Elements |
|-----------|----------|
| RCAF | Role, Context, Action, Format |
| COSTAR | Context, Objective, Style, Tone, Audience, Response |
| RACE | Role, Action, Context, Execute |
| CIDI | Context, Instructions, Details, Input |
| TIDD-EC | Task, Instructions, Do's, Don'ts, Examples, Context |
| CRISPE | Capacity, Insight, Statement, Personality, Experiment |
| CRAFT | Context, Role, Action, Format, Target |

**Framework selection logic**: scores 5 characteristics (complexity 1-10, urgency, audience specificity, creative element, precision criticality) against per-framework modifier rules; highest score wins (patterns_evaluation.md:42-84). SKILL.md:257-266 provides the simplified selection matrix.

**DEPTH methodology** (depth_framework.md:27-29): **D**iscover → **E**ngineer → **P**rototype → **T**est → **H**armonize. Five energy levels: Raw (none), Quick (D-P-H), Standard (all 5), Deep (extended D). RICCE integration: Role, Instructions, Context, Constraints, Examples validated during Test/Harmonize (depth_framework.md:246-257).

**CLEAR scoring** (patterns_evaluation.md:572-580; depth_framework.md:259-267):

| Dimension | Max | Weight | Floor |
|-----------|-----|--------|-------|
| Correctness | 10 | 20% | 7 |
| Logic | 10 | 20% | 7 |
| Expression | 15 | 30% | 10 |
| Arrangement | 10 | 20% | 7 |
| Reusability | 5 | 10% | 3 |
| **Total** | **50** | | **40 to pass** |

Threshold: 40+/50. Per-dimension floors are blocking — a 40+ total that fails a floor must still be revised (depth_framework.md:324).

---

3. KEY FILES

| Path | Role |
|------|------|
| `SKILL.md` | AI entry point: mode detection, smart routing pseudocode, operating rules, pipeline |
| `references/depth_framework.md` | DEPTH five-phase methodology, energy levels, cognitive techniques, RICCE integration, CLEAR integration |
| `references/patterns_evaluation.md` | Seven framework definitions, selection algorithm, CLEAR scoring rubrics, fusion patterns, REPAIR protocol |
| `assets/framework-registry.json` | Machine-readable framework registry (5 of 7 frameworks: RCAF, RACE, CIDI, TIDD-EC, COSTAR) for slot rendering — code-focused scaffolds |
| `assets/format_guide_markdown.md` | Markdown format deep-dive: delivery standards, RCAF/CRAFT structures, validation |
| `assets/format_guide_json.md` | JSON format deep-dive: data types, nested structures, CLEAR validation |
| `assets/format_guide_yaml.md` | YAML format deep-dive: templates, validation, best practices |
| `README.md` | Human-facing documentation: overview, quick start, features, troubleshooting, FAQ |
| `manual_testing_playbook/manual_testing_playbook.md` | Manual validation playbook (SKILL.md:435) |

---

4. WORKFLOWS & OUTPUTS

**Enhancement pipeline** (SKILL.md:214-238):
1. **Mode Detection** — command prefix check, keyword signal analysis (≥80% confidence = auto-route), ambiguous = ask ONE question.
2. **Framework Selection** — evaluate 7 frameworks against task characteristics, select primary + alternative.
3. **DEPTH Processing** — 3-10 rounds based on mode. Five phases: Discover (5 perspectives, assumption audit), Engineer (8+ approaches, constraint reversal), Prototype (template build, mechanism-first), Test (CLEAR scoring, quality gates), Harmonize (final polish, transparency metadata).
4. **Scoring & Delivery** — CLEAR 40+/50 threshold verified, enhanced prompt delivered with transparency report.

**What it produces**: a structured prompt (in the selected framework format) in Markdown/JSON/YAML, plus a transparency report showing framework, DEPTH rounds, perspectives used, CLEAR score per dimension, and flagged assumptions.

**`@prompt-improver` agent output block** (SKILL.md:392-399):
```
FRAMEWORK: <name>
CLEAR_SCORE: <n>/50 (C:<n> L:<n> E:<n> A:<n> R:<n>)
RATIONALE: <1-2 lines>
ENHANCED_PROMPT: | <multi-line prompt>
ESCALATION_NOTES: <remaining ambiguity/risk>
```

**Improvement cycle** (depth_framework.md:396-406): max 3 iterations if below threshold; delivers best version with quality note if exceeded.

---

5. TROUBLESHOOTING & FAQ

**Failure modes** (README.md:232-279):

| Failure | Cause | Fix |
|---------|-------|-----|
| CLEAR < 40 | Insufficient input context or framework mismatch | Provide more context; ask skill to switch frameworks; accept with score flagged |
| Wrong framework | Ambiguous task description causes scoring to underestimate | State complexity explicitly; name framework directly |
| JSON output has Markdown | `$json` prefix not used; keyword detection didn't activate JSON-only mode | Prefix with `$json` |
| Wrong mode detected | Keyword overlap across modes | Use explicit command prefix |
| Excessive DEPTH rounds | Standard mode defaults to 10 rounds regardless of complexity | Use `$short` (3 rounds) or `$raw` (0) |

**Top user questions** (README.md:283-305):

1. **`$refine` vs `$improve`?** — Both run 10 rounds with same selection. `$refine` signals maximum-effort/high-stakes intent.
2. **Can I name a framework?** — Yes. State it explicitly (e.g., "Use TIDD-EC"); skill skips auto-selection.
3. **What if CLEAR stays below 40?** — After 3 improvement iterations, delivers best version with score flags and three options: accept, retry with context, switch framework.
4. **Does it change my meaning?** — No. Prototype and Test phases include intent preservation check; changes that alter meaning are rolled back.
5. **How does it differ from `sk-prompt-small-model`?** — Not explicitly addressed in any file. UNKNOWN from current contents.

---

6. STALE FACTS IN CURRENT README

| Claim in README.md | Actual in SKILL.md / references | Status |
|---|---|---|
| `framework-registry.json` lists 7 frameworks | `framework-registry.json` contains only **5** entries (RCAF, RACE, CIDI, TIDD-EC, COSTAR); missing CRISPE and CRAFT | **STALE** |
| README §5 Configuration lists `$deep` or `$d` as a mode | SKILL.md Operating Modes table does **not** list `$deep`/`$d`; only `depth_framework.md` documents it | **PARTIALLY STALE** — `$deep` is real (depth_framework.md:40) but absent from SKILL.md's mode table |
| README §5 lists `$short` or `$s` | SKILL.md mode table lists only `$short`; `$s` alias only in depth_framework.md:38 | **MINOR STALE** — `$s` is real but not in SKILL.md |
| README says CRAFT complexity range is "7-10" with label "Full-scope" | SKILL.md:265 says label "Comprehensive" at complexity "7-10" | **STALE** — label mismatch ("Full-scope" vs "Comprehensive") |
| README §3.2 Framework Selection Matrix: RCAF complexity "1-4" | SKILL.md:259: RCAF complexity "1-4" — matches | OK |
| README §3.2: CRAFT label "Full-scope" | SKILL.md:265: "Comprehensive" | **STALE** (duplicate of above) |
| README §1 says "up to 5 cognitive phases" | DEPTH has exactly **5 phases** (not "up to"); the "up to" qualifier applies to rounds (3-10), not phases | **STALE** — misleading phrasing |
| README says "5 energy levels" | depth_framework.md defines **4** energy levels: Raw, Quick, Standard, Deep | **STALE** — count is 4, not 5 |
| README Key Statistics: "Output Formats: 3" | Verified: Markdown, JSON, YAML — correct | OK |
| README says "CLEAR Pass Threshold: 40/50 (Applied to all modes except $raw)" | Verified against SKILL.md:253 and depth_framework.md:422 | OK |
| README says "Max DEPTH Rounds: 10 (Standard modes (3 for $short, 0 for $raw))" | Verified | OK |
| README §3.1 mentions "Framework Fusion: RCAF + CoT, COSTAR + ReAct, TIDD-EC + Few-Shot" | patterns_evaluation.md:391-399 confirms these plus RACE + ToT and CRAFT + All | **PARTIALLY STALE** — README lists 3 combos but patterns_evaluation.md lists 5 |
| README omits `$deep`/`$d` from operating modes table entirely | depth_framework.md:40 documents it as a valid trigger | **STALE** — missing mode |
| README §7 troubleshooting "DEPTH rounds feel excessive" — doesn't mention `$deep` as an option for *more* depth | depth_framework.md:40 documents `$deep` for extended processing | **STALE** — incomplete guidance |
| README §9 Related Documents lists `sk-doc` at `.opencode/skills/sk-doc/` | Verified — path exists | OK |
| `framework-registry.json` schema says "RACE" long form is "Role / Action / Context / Expectation" | patterns_evaluation.md:34 says RACE = "Role, Action, Context, Execute" | **STALE** — "Expectation" vs "Execute" |