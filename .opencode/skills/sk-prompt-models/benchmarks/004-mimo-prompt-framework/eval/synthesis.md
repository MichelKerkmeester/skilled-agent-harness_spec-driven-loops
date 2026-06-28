# Synthesis — MiMo-V2.5-Pro prompt-framework benchmark

**Generated**: 2026-06-01 (real-run state)
**Target model**: `xiaomi-token-plan-ams/mimo-v2.5-pro` (Xiaomi MiMo-V2.5-Pro, 1M ctx, agentic, token-efficient; SWE-bench Pro 57.2) via cli-opencode (OpenCode CLI 1.15.13)
**Dispatch**: `gtimeout 120 opencode run --model xiaomi-token-plan-ams/mimo-v2.5-pro --format json --dir "$WORKDIR" "<PROMPT>" </dev/null` (NO `--agent` — 1.15.13 rejects/falls back on `--agent general`)
**Scoring**: deterministic, self-contained. Primary = `assertion_pass_rate` against hidden JS test suites run in isolated child processes; tiebreaks = `format_adherence` (returned ONLY inline code?) and `output length` (words; MiMo is token-efficient → lower is better).
**Combos**: 5 frameworks × 2 fixtures = 10, one real dispatch each. **Succeeded: 10 / 10** (cidi__chunk needed 1 retry — see Caveats).
**Rig**: leaner self-contained port of `120/003` (MiniMax bake-off) — framework variants + deterministic scorer + synthesis.

## Final ranking

Assertion-pass saturated at 100% for every framework (frontier model on tractable fixtures), so the ranking is driven by the tiebreaks. Composite = `0.70·pass + 0.20·format_adherence + 0.10·length_efficiency` (length_efficiency normalized: leanest avg = 1.0).

| Rank | Framework | Long form | Pre-plan density | Mean pass | Format-adherent | Avg words | Composite |
|------|-----------|-----------|------------------|-----------|-----------------|-----------|-----------|
| 1 | **COSTAR** | Context/Objective/Style/Tone/Audience/Response | medium | 100% | **100%** | **50** | **1.0000** |
| 2 | RACE | Role/Action/Context/Expectation | lean | 100% | **100%** | 53 | 0.9934 |
| 3 | CIDI | Context/Instructions/Details/Input | medium | 100% | 50% | 60 | 0.8780 |
| 4 | RCAF | Role/Context/Action/Format | lean | 100% | 50% | 71 | 0.8538 |
| 5 | TIDD-EC | Task/Instructions/Do's/Don'ts/Examples/Context | dense | 100% | 50% | 96 | 0.8000 |

Per-fixture detail (pass% / format / words):

| Framework | chunk | parseRange |
|-----------|-------|------------|
| COSTAR | 100% / Y / 38 | 100% / Y / 62 |
| RACE | 100% / Y / 38 | 100% / Y / 68 |
| CIDI | 100% / Y / 38 | 100% / **N** / 82 |
| RCAF | 100% / Y / 40 | 100% / **N** / 102 |
| TIDD-EC | 100% / Y / 40 | 100% / **N** / 151 |

## Winner

**COSTAR framework + medium ("lean-to-medium") pre-planning**, composite **1.0000** — narrowly ahead of RACE (0.9934). Both are statistically tied on correctness and format; COSTAR edges it on output length (50 vs 53 words avg).

- **Format axis** (the decider): COSTAR and RACE were the ONLY frameworks at 100% inline-format adherence. The bottom three (CIDI/RCAF/TIDD-EC) each emitted a prose preamble on the harder `parseRange` fixture ("Looking at this task, I need to…", "Key considerations:") around otherwise-correct code.
- **Length axis**: lean framings (COSTAR 50, RACE 53) are markedly more token-efficient than guardrail-heavy TIDD-EC (96). On the hard fixture the spread is stark: COSTAR 62 words vs TIDD-EC 151 (2.4×).
- **Correctness axis**: undifferentiated — all five extracted to functionally correct code (100% of hidden assertions passed in every captured response).

**Recommended pre-planning density: LEAN / MEDIUM.** Do NOT use dense/guardrail-heavy pre-planning for MiMo — it is counterproductive (TIDD-EC's dense Do's/Don'ts/Examples scaffold produced the longest, most preamble-prone output and ranked last).

## Key findings (and divergence from MiniMax / SWE-1.6)

1. **MiMo-V2.5-Pro favors LEAN, output/audience-framed prompts — the OPPOSITE of MiniMax.** COSTAR and RACE win; the guardrail-heavy **TIDD-EC that WON for MiniMax (120/003) came DEAD LAST for MiMo.** MiMo is already disciplined on scope/correctness, so explicit Do's/Don'ts/Examples add no correctness and instead inflate output and trigger explanatory prose that breaks the "code only" contract.
2. **The discriminator for MiMo is format adherence, not correctness.** MiMo solved every fixture correctly regardless of framework (it is frontier-class). What varies is whether it returns ONLY the code: COSTAR's `Style: "no preamble"` + `Audience: "an automated suite"` and RACE's compressed `Execute` framing suppress the think-out-loud preamble that CIDI/RCAF/TIDD-EC let through on harder tasks.
3. **MiMo is token-efficient, and lean prompts amplify that.** Avg output ranged 50 (COSTAR) → 96 (TIDD-EC) words; the heavier the prompt scaffold, the longer the response. For an AI-driving-AI loop where MiMo's output is parsed downstream, the lean winners are both cheaper and lower-risk.
4. **CIDI's process framing nudges MiMo toward agentic tool-use.** On `chunk`, CIDI intermittently caused MiMo to `write` the function to a file (tool call) and emit no inline text (~22% of observed dispatches, see Caveats). The role/output-first frameworks (RACE/COSTAR/RCAF/TIDD-EC) kept it returning code inline. This is a CIDI-specific reliability tax on top of its verbosity.

## Scoring diagnostics

- **assertion_pass_rate** (primary): isolated one-process-per-test execution with a per-case hard timeout; deep-equality vs hidden expected outputs. Hidden cases beyond the prompt's stated examples guard against overfitting. All frameworks: 100%.
- **format_adherent**: tolerates a single markdown fence (MiMo fences code even when told not to); fails only on substantive prose OUTSIDE the function body. The 50%-adherent frameworks all failed on `parseRange` via prose preamble, never on `chunk`.
- **length_efficiency**: word count of the full assistant message, normalized across the 5 frameworks.

## Caveats (honest scope)

- **Single sample per (framework × fixture).** Margins between COSTAR (1.0000) and RACE (0.9934) are inside single-sample noise — treat them as a **tie**; COSTAR is preferred on the length tiebreak and its explicit "no preamble" Style instruction. The COSTAR-vs-RACE choice is low-stakes (both lean, both 100% format).
- **cidi__chunk transient + tool-divergence.** The 1st dispatch in the primary run returned empty inline text (exit 0, no error) because MiMo took a **tool-only `write`-to-file turn**. Across 9 observed cidi__chunk dispatches: **7/9 returned correct inline code (100% pass), 2/9 emitted no text part (~22% empty-inline)**. The recorded `cidi__chunk` entry is the first successful retry; CIDI's score already reflects its `parseRange` preamble penalty, and this file flags the inline-return instability separately (see `results.json.cidi_chunk_flake`).
- **Assertion-pass saturation.** Both fixtures are deterministic pure functions tractable for a frontier model; correctness did not separate the frameworks. The benchmark therefore measures **format discipline + token efficiency under each framing**, which IS the operative question for an AI-driving-AI dispatch loop. A harder/multi-file fixture set would be needed to separate frameworks on raw correctness.
- **No grader-model / LLM-judge step.** Scoring is fully deterministic (assertion + regex format check), so there is no grader-fallback ambiguity — but also no qualitative-quality dimension beyond pass/format/length.
- **Two fixtures only** (chunk, parseRange) — scoped smaller than 120/003's 7 fixtures, by design.

## Reproducibility

- **Re-run all 10 combos**: `node eval/run-mimo-bench.cjs --model xiaomi-token-plan-ams/mimo-v2.5-pro --timeout 120`
- **Cheap smoke (free sibling)**: `node eval/run-mimo-bench.cjs --model opencode/mimo-v2.5-free --frameworks rcaf --fixtures chunk`
- **Re-run close top-2**: `node eval/run-mimo-bench.cjs --frameworks costar,race --repeat 3`
- **Quantify CIDI flake**: `node eval/run-mimo-bench.cjs --frameworks cidi --fixtures chunk --repeat 4`
- Raw per-dispatch responses (prompt + assistant text + exit + timing): `eval/runs/<framework>__<fixture>.json`. Per-combo scores: `eval/results.json`. Framework scaffolds: `eval/frameworks.cjs`. Fixtures + hidden suites: `eval/fixtures.cjs`.
- Avg successful dispatch latency: ~18s (range 4.6–40.9s) on the pro model.

## Integration recommendation (for the user to apply to cli-opencode)

Apply to the **cli-opencode / MiMo** dispatch path:
- `cli-opencode/assets/prompt_templates.md` — add a MiMo-V2.5-Pro section using the **COSTAR** scaffold (Context / Objective / Style="precise, no preamble" / Tone / Audience="automated/downstream consumer" / Response) with **lean-to-medium** pre-planning. **RACE** is the equally-valid fallback (statistical tie). Explicitly note: do NOT use TIDD-EC / dense guardrail framing for MiMo (it ranked last).
- `cli-opencode/assets/prompt_quality_card.md` — mark **COSTAR** as the empirical default for `xiaomi-token-plan-ams/mimo-v2.5-pro`; **RACE** as fallback. Record the divergence: MiMo ≠ MiniMax (MiniMax → TIDD-EC+dense; MiMo → COSTAR/RACE+lean).
- `sk-prompt-models/references/pattern-index.md` — add a MiMo prompt-framework row → cli-opencode canonical location, with the COSTAR/RACE-lean finding.
- `sk-prompt/assets/model-profiles.json` — MiMo strengths note: "responds best to lean, output/audience-framed prompts (COSTAR/RACE); already scope/correctness-disciplined — guardrail-heavy framing is counterproductive and inflates output; avoid CIDI process-framing (intermittent tool-only file-writes instead of inline code)."
- Key one-liner for the template: **MiMo is frontier-correct already — frame for format + brevity, not for guardrails.**
