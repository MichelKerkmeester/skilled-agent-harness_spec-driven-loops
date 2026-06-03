# Synthesis — HIGH-reasoning prompt-framework benchmark (MiMo × MiniMax)

**Generated**: 2026-06-02 (real-run state)
**Question**: Does the prompt-framework winner change with reasoning effort? Re-run the MiMo bake-off at `--variant high`, add MiniMax (default + high), and compare a 2×2 (model × reasoning).
**Models**:
- `xiaomi-token-plan-ams/mimo-v2.5-pro` (Xiaomi MiMo-V2.5-Pro, 1M ctx, agentic, token-efficient)
- `minimax-coding-plan/MiniMax-M2.7-highspeed` (MiniMax M2.7, highspeed tier)
**Dispatch**: `gtimeout 120 opencode run --model <model> [--variant high] --format json --dir "$WORKDIR" "<PROMPT>" </dev/null` via OpenCode CLI 1.15.13. Both models confirmed to accept `--variant high` (smoke-tested: exit 0, inline code returned, clean stderr).
**Scoring**: deterministic, self-contained (unchanged from `synthesis.md`). Primary = `assertion_pass_rate` against hidden JS suites in isolated child processes; tiebreaks = `format_adherence` (returned ONLY inline code?) and `output length` (words; lower is better). Composite = `0.70·pass + 0.20·format_adherence + 0.10·length_efficiency` (length_efficiency = leanest-avg/this-avg, so the leanest framework in each cell = 1.0).
**Frameworks**: RCAF, RACE, CIDI, TIDD-EC, COSTAR (5) × fixtures chunk, parseRange (2) = **10 real dispatches per cell**.
**Cells**: 4 = {MiMo, MiniMax} × {default, high}. MiMo/default is the preserved prior run (`results-mimo-default.json`); the other three are new.

## Dispatch outcomes (real, no fabrication)

| Cell | Model / reasoning | Succeeded | Failed | Notes |
|------|-------------------|-----------|--------|-------|
| A | MiMo / default | 10 / 10 | 0 | Preserved prior run; `cidi__chunk` had 1 retry at original capture (transient tool-only turn) |
| B | MiMo / high | 10 / 10 | 0 | No retries needed |
| C | MiniMax / default | 10 / 10 | 0 | No retries needed |
| D | MiniMax / high | 10 / 10 | 0 | `rcaf__parseRange` 1st attempt hit `gtimeout` 120 s wall (**exit 124**, empty stdout/stderr — transient hang, NOT quota/auth). Retried once per policy → succeeded in 15.7 s. Provenance recorded in `results-minimax-high.json.retry_provenance`; failed + retry raw responses archived under `runs-archive/minimax-high/`. |

**40 / 40 real dispatches scored; 1 transient timeout retried once and recovered. Zero fabricated scores. Zero quota/auth failures.**

## The 2×2 — winner per cell

| | **default reasoning** | **HIGH reasoning** |
|---|---|---|
| **MiMo-V2.5-Pro** | **COSTAR** (50.0w) | **RCAF** (51.0w) — COSTAR tied at composite 1.0000 |
| **MiniMax-M2.7** | **RACE** (51.0w) | **RACE** (47.0w) — TIDD-EC tied at composite 1.0000 |

### Verdict on the headline question

- **MiMo: the nominal winner CHANGES (COSTAR → RCAF) but it is a tie inside single-sample noise — the *operative* finding does NOT change.** At high reasoning COSTAR and RCAF both score composite **1.0000** with identical 51.0 avg words and identical 100% format; RCAF is listed first only because its `parseRange` came back at 62 words vs COSTAR's 64 (a 2-word gap = noise). COSTAR did NOT lose its lead — it merely stopped being *uniquely* lean once the rest of the field tightened. **COSTAR remains a co-winner at high reasoning.**
- **MiniMax: the winner does NOT change — RACE wins at both default and high.** At high reasoning RACE ties TIDD-EC (both composite 1.0000, both 47.0w), but RACE holds the top slot at both reasoning levels, so there is no winner change to integrate.

**Bottom line: reasoning effort does NOT flip the practical framework recommendation for either model.** It compresses the field (correctness already saturated; format adherence rises and output gets leaner), turning prior single-framework leads into multi-framework ties — but the default winners (COSTAR for MiMo, RACE for MiniMax) remain at or tied-for the top at high reasoning.

## Per-cell rankings (data-derived from `results-*.json`)

### Cell A — MiMo / default  (winner: COSTAR)

| Rank | Framework | Mean pass | Format | Avg words | Composite | chunk (p/f/w) | parseRange (p/f/w) |
|------|-----------|-----------|--------|-----------|-----------|---------------|---------------------|
| 1 | **COSTAR** | 100% | 100% | 50.0 | **1.0000** | 100/Y/38 | 100/Y/62 |
| 2 | RACE | 100% | 100% | 53.0 | 0.9943 | 100/Y/38 | 100/Y/68 |
| 3 | CIDI | 100% | 50% | 60.0 | 0.8833 | 100/Y/38 | 100/**N**/82 |
| 4 | RCAF | 100% | 50% | 71.0 | 0.8704 | 100/Y/40 | 100/**N**/102 |
| 5 | TIDD-EC | 100% | 50% | 95.5 | 0.8524 | 100/Y/40 | 100/**N**/151 |

### Cell B — MiMo / high  (winner: RCAF; COSTAR tied)

| Rank | Framework | Mean pass | Format | Avg words | Composite | chunk (p/f/w) | parseRange (p/f/w) |
|------|-----------|-----------|--------|-----------|-----------|---------------|---------------------|
| 1 | **RCAF** | 100% | 100% | 51.0 | **1.0000** | 100/Y/40 | 100/Y/62 |
| 2 | **COSTAR** | 100% | 100% | 51.0 | **1.0000** | 100/Y/38 | 100/Y/64 |
| 3 | TIDD-EC | 100% | 100% | 53.0 | 0.9962 | 100/Y/40 | 100/Y/66 |
| 4 | RACE | 100% | 100% | 58.0 | 0.9879 | 100/Y/40 | 100/Y/76 |
| 5 | CIDI | 100% | 50% | 58.0 | 0.8879 | 100/Y/40 | 100/**N**/76 |

**Shift vs Cell A:** TIDD-EC, RCAF jump from 50% → 100% format adherence; TIDD-EC's `parseRange` output collapses from **151 → 66 words** (2.3× leaner). The three frameworks that emitted a prose preamble on hard `parseRange` at default reasoning (CIDI, RCAF, TIDD-EC) — only **CIDI still does** at high. Net effect: the top of the field compresses to a 4-way near-tie (RCAF/COSTAR/TIDD-EC within 0.004 composite); COSTAR's prior unique lead becomes a co-lead.

### Cell C — MiniMax / default  (winner: RACE)

| Rank | Framework | Mean pass | Format | Avg words | Composite | chunk (p/f/w) | parseRange (p/f/w) |
|------|-----------|-----------|--------|-----------|-----------|---------------|---------------------|
| 1 | **RACE** | 100% | 100% | 51.0 | **1.0000** | 100/Y/40 | 100/Y/62 |
| 2 | COSTAR | 100% | 100% | 53.0 | 0.9962 | 100/Y/40 | 100/Y/66 |
| 3 | CIDI | 100% | 100% | 55.0 | 0.9927 | 100/Y/42 | 100/Y/68 |
| 4 | TIDD-EC | 100% | 100% | 56.5 | 0.9903 | 100/Y/42 | 100/Y/71 |
| 5 | RCAF | 100% | 100% | 64.0 | 0.9797 | 100/Y/42 | 100/Y/86 |

### Cell D — MiniMax / high  (winner: RACE; TIDD-EC tied)

| Rank | Framework | Mean pass | Format | Avg words | Composite | chunk (p/f/w) | parseRange (p/f/w) |
|------|-----------|-----------|--------|-----------|-----------|---------------|---------------------|
| 1 | **RACE** | 100% | 100% | 47.0 | **1.0000** | 100/Y/42 | 100/Y/52 |
| 2 | **TIDD-EC** | 100% | 100% | 47.0 | **1.0000** | 100/Y/42 | 100/Y/52 |
| 3 | CIDI | 100% | 100% | 49.0 | 0.9959 | 100/Y/42 | 100/Y/56 |
| 4 | RCAF | 100% | 100% | 50.0 | 0.9940 | 100/Y/42 | 100/Y/58 |
| 5 | COSTAR | 100% | 100% | 57.0 | 0.9825 | 100/Y/42 | 100/Y/72 |

**Shift vs Cell C:** every framework gets leaner at high reasoning (avg 51→47 for RACE; the whole field 47–57 vs 51–64). RACE holds #1; TIDD-EC climbs 4th → tied-1st (its dense guardrails cost nothing on MiniMax once output tightens). COSTAR is the only framework that gets *relatively* worse for MiniMax at high (53 → 57 words, 2nd → 5th) — the inverse of its MiMo behaviour.

## Headline analysis

1. **Correctness saturates at 100% in all 4 cells (40/40 scored dispatches, every captured response = 100% hidden-assertion pass).** Exactly as predicted for frontier models on tractable pure-function fixtures. **The ranking is entirely format/length-driven at every reasoning level** — no framework separated any model on raw correctness.

2. **HIGH reasoning improves format adherence and shortens output — it does not reorder the practical winner.** The mechanism: at default reasoning, the discriminator was whether a framework let a "Looking at this task, I need to…" preamble through on the harder `parseRange` fixture. At high reasoning the model reasons silently and emits cleaner final output, so the format penalty that separated frameworks at default largely **disappears**:
   - **MiMo**: format-adherent frameworks go from 2/5 → 4/5 (only CIDI still breaks format). TIDD-EC's worst-case output drops 151 → 66 words.
   - **MiniMax**: already 5/5 format-adherent at default; high reasoning just makes everything leaner (field-wide ~10% fewer words).

3. **MiMo: does the winner change? Nominally yes (COSTAR → RCAF), practically no.** COSTAR was the default winner; at high it is **tied at composite 1.0000 with RCAF** (both 51.0w, both 100% format). The 1-slot reorder is driven by a 2-word `parseRange` difference — inside single-sample noise. **COSTAR holds as a co-winner at high; the integration default does not need to change** (see recommendation).

4. **MiniMax: the winner does NOT change.** RACE wins at default (51.0w) and at high (47.0w, tied with TIDD-EC). Stable across reasoning effort.

5. **Cross-rig caveat for MiniMax — this differs from 120/003.** The 7-fixture `120/003` MiniMax bake-off found **TIDD-EC** winning; on THIS 2-fixture rig MiniMax's winner is **RACE** (TIDD-EC is mid-pack at default, tied-1st only at high). The divergence is expected and honest: (a) different fixture set (2 vs 7), (b) correctness saturates here so TIDD-EC's guardrail advantage (its edge on harder/edge-case-dense tasks) has nothing to bite on, and (c) different scoring composite weights. **TIDD-EC's value shows up on harder fixtures; on these two tractable ones it is undifferentiated on correctness and merely costs a few extra words at default.** Treat the 120/003 7-fixture result as the more authoritative MiniMax recommendation; this rig's MiniMax cells exist to test the *reasoning-effort* axis, not to re-derive MiniMax's canonical framework.

6. **The MiMo ≠ MiniMax divergence from `synthesis.md` still holds at default, and softens at high.** At default, MiMo's bottom-3 (CIDI/RCAF/TIDD-EC) broke format while MiniMax's did not — MiMo is more preamble-prone under guardrail-heavy framing. At high reasoning both models converge toward "all frameworks clean and lean," so the framework choice matters *less* at high than at default for both models.

## Recommendation — does the cli-opencode MiMo integration (currently COSTAR) need to change for high reasoning?

**No.** COSTAR remains correct as the MiMo default:
- At **default** reasoning COSTAR is the **sole** winner (composite 1.0000, leanest at 50w).
- At **high** reasoning COSTAR is a **co-winner** (composite 1.0000, tied with RCAF at 51w, 100% format) — it did not lose, the field merely compressed around it.
- The nominal high-reasoning #1 (RCAF) beats COSTAR by 2 words on one fixture — pure single-sample noise, not a real reversal. RACE (the existing documented fallback) stays strong at both MiMo reasoning levels too.

**No integration change is warranted.** If anything, the high-reasoning data *strengthens* the existing guidance for MiMo: "frame for format + brevity, not guardrails" holds, and the cost of a sub-optimal framework choice shrinks at high reasoning (the whole field gets clean). The user integrates any winner change into cli-opencode themselves; this benchmark's finding is **no change needed**.

**Secondary note (not for the MiMo path):** for MiniMax, this 2-fixture rig says RACE; the 7-fixture 120/003 rig says TIDD-EC. Do not overwrite the 120/003 MiniMax recommendation from this smaller rig — these MiniMax cells were run to answer the reasoning-effort question (answer: RACE is stable across effort here; TIDD-EC ties it only at high), not to re-pick MiniMax's canonical framework.

## Caveats (honest scope — carried from `synthesis.md`)

- **Single sample per (model × reasoning × framework × fixture).** All composite gaps inside ~0.02 — and especially the COSTAR↔RCAF (MiMo/high) and RACE↔TIDD-EC (MiniMax/high) ties — are **within single-sample noise**. Treat co-leaders as statistically tied; the lean winners (COSTAR/RACE) are preferred on stability across cells, not on a decisive margin.
- **Two fixtures only** (chunk, parseRange), both deterministic pure functions tractable for frontier models → **correctness saturates at 100% and cannot separate frameworks**. This rig measures format discipline + token efficiency under each framing, which is the operative axis for an AI-driving-AI dispatch loop, but a harder/multi-file fixture set would be needed to separate frameworks on raw correctness (and is where TIDD-EC's guardrails would plausibly pay off — cf. 120/003).
- **Deterministic scoring only** (assertion + regex format check) — no LLM-judge / qualitative dimension beyond pass/format/length.
- **`--variant high` semantics** are whatever OpenCode 1.15.13 maps that flag to for each provider; both were confirmed accepted (exit 0, inline code) but the exact reasoning-token budget per provider is not introspected here.
- **One transient timeout** (MiniMax/high `rcaf__parseRange`, exit 124 at the 120 s wall) was retried once and recovered; both the failed and successful raw responses are archived for audit. No scores were fabricated or imputed.

## Artifacts (all under this `eval/` folder)

- **Per-cell scored results**: `results-mimo-default.json` (preserved prior run), `results-mimo-high.json`, `results-minimax-default.json`, `results-minimax-high.json` (with `retry_provenance`).
- **Retry detail**: `results-minimax-high-retry.json` (single-combo recovery run).
- **Raw per-dispatch responses (prompt + assistant text + exit + timing)**, archived per cell so they are not clobbered by tag-reuse across runs: `runs-archive/{mimo-default,mimo-high,minimax-default,minimax-high}/`. The MiniMax/high failure is preserved as `rcaf__parseRange.FAILED-exit124.json` alongside the `rcaf__parseRange.RETRY-ok.json` recovery.
- **Live `runs/`** holds the most-recent run's raw responses (currently the MiniMax/high retry for the rcaf__parseRange tag).
- **Harness**: `run-mimo-bench.cjs` (now supports `--variant` and `--out`). Frameworks: `frameworks.cjs`. Fixtures + hidden suites: `fixtures.cjs`.

## Reproducibility

- MiMo high:     `node run-mimo-bench.cjs --model xiaomi-token-plan-ams/mimo-v2.5-pro --variant high --out results-mimo-high.json --timeout 120`
- MiniMax default: `node run-mimo-bench.cjs --model minimax-coding-plan/MiniMax-M2.7-highspeed --out results-minimax-default.json --timeout 120`
- MiniMax high:  `node run-mimo-bench.cjs --model minimax-coding-plan/MiniMax-M2.7-highspeed --variant high --out results-minimax-high.json --timeout 120`
- MiMo default (preserved):  see `results-mimo-default.json` (re-run: drop `--variant`, `--out results-mimo-default.json`).
- Single-combo retry pattern: add `--frameworks rcaf --fixtures parseRange --out <tmp>.json`.
