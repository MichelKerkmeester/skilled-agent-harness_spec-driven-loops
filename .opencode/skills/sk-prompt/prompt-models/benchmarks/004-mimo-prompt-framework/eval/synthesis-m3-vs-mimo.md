# Synthesis — HIGH-reasoning prompt-framework benchmark (MiniMax-M3 × MiMo-V2.5-Pro)

**Generated**: 2026-06-02 (real-run state)
**Question**: With `minimax-coding-plan/MiniMax-M3` now live (plain M3, not the `-highspeed` variant), does the prompt-framework winner change for MiniMax at high reasoning vs the prior M2.7-era findings? And does M3-era MiMo still confirm COSTAR? Re-run the proven 126/004 bake-off rig at `--variant high` for both models and compare on the same 2-fixture rig.
**Models** (both confirmed live, opencode 1.15.13, 2026-06-02, `--variant high` accepted — pre-flight probes returned a clean text part + `step-finish/stop`, empty stderr; MiMo probe showed `reasoning:41` tokens, confirming the high variant engages reasoning):
- `minimax-coding-plan/MiniMax-M3` — MiniMax M3, **plain M3** (NOT `MiniMax-M2.7-highspeed`, NOT `MiniMax-M3-highspeed`). This is the model the user reports is now available.
- `xiaomi-token-plan-ams/mimo-v2.5-pro` — Xiaomi MiMo-V2.5-Pro (1M ctx, agentic, token-efficient).
**Dispatch**: `gtimeout 120 opencode run --model <model> --variant high --format json --dir "$WORKDIR" "<PROMPT>"` via OpenCode CLI 1.15.13 (the rig's standing contract). Real dispatches only — failures record exit code + stderr, never fabricated scores.
**Scoring** (unchanged from `synthesis.md` / `synthesis-high-reasoning.md`): primary = `assertion_pass_rate` against hidden JS suites in isolated child processes; tiebreaks = `format_adherence` (returned ONLY inline code, no prose/fence?) and `output length` (words; lower is better). Composite = `0.70·pass + 0.20·format_adherence + 0.10·length_efficiency`, where `length_efficiency = leanest_avg_words_in_cell / this_avg_words` (so the leanest framework in each cell = 1.0).
**Frameworks**: RCAF, RACE, CIDI, TIDD-EC, COSTAR (5) × fixtures `chunk`, `parseRange` (2) = **10 real dispatches per model**.

---

## Dispatch outcomes (real, no fabrication)

| Cell | Model / reasoning | Succeeded | Failed | Wall (sum) | Per-dispatch min/max | Notes |
|------|-------------------|-----------|--------|-----------|----------------------|-------|
| **M3** | MiniMax-M3 / high | **10 / 10** | 0 (after 1 retry) | 244.8 s | 7.1 / 87.8 s | `rcaf__chunk` **first attempt failed** with empty assistant text at **exit 0** (6.0 s, empty stderr — a transient empty/tool-only turn, **NOT** quota/auth/timeout). Retried once per policy → recovered in 12.1 s (100% pass, format-adherent, 40 words). Failure preserved at `runs/rcaf__chunk.M3-FAILED-empty-exit0.json`; recovery recorded in `results-minimax-m3-high.json.retry_provenance` + `results-minimax-m3-high-rcafchunk-retry.json`. |
| **MiMo** | MiMo-V2.5-Pro / high | **10 / 10** | 0 | 160.5 s | 5.4 / 47.0 s | No retries needed. Clean run. |

**20 / 20 real dispatches scored. 1 transient empty-turn (exit 0) retried once and recovered. Zero fabricated scores. Zero quota/auth failures.**

---

## Per-model framework ranking (data-derived from `results-*.json`)

### MiniMax-M3 / HIGH  — winner: **COSTAR**

| Rank | Framework | Mean pass | Format | Avg words | Composite | chunk (p/f/w) | parseRange (p/f/w) |
|------|-----------|-----------|--------|-----------|-----------|---------------|---------------------|
| 1 | **COSTAR** | 100% | 100% | 47.5 | **1.0000** | 100/Y/38 | 100/Y/57 |
| 2 | RCAF | 100% | 100% | 53.0 | 0.9896 | 100/Y/40 | 100/Y/66 |
| 3 | RACE | 100% | 100% | 53.0 | 0.9896 | 100/Y/38 | 100/Y/68 |
| 4 | CIDI | 100% | 100% | 55.5 | 0.9856 | 100/Y/38 | 100/Y/73 |
| 5 | TIDD-EC | 100% | 100% | 58.0 | 0.9819 | 100/Y/38 | 100/Y/78 |

**Read:** correctness saturates (100% across all 5 frameworks) and — notably — **all 5 frameworks are 100% format-adherent on M3 at high reasoning** (no prose leakage anywhere, even on the harder `parseRange`). With pass and format tied across the board, the ranking is **purely length-driven**, and **COSTAR is the leanest** (47.5 avg words, sole composite 1.0000). RCAF and RACE tie for 2nd. The whole field is within 0.018 composite — a tight, length-only spread.

### MiMo-V2.5-Pro / HIGH  — winner: **COSTAR**

| Rank | Framework | Mean pass | Format | Avg words | Composite | chunk (p/f/w) | parseRange (p/f/w) |
|------|-----------|-----------|--------|-----------|-----------|---------------|---------------------|
| 1 | **COSTAR** | 100% | 100% | 53.0 | **1.0000** | 100/Y/38 | 100/Y/68 |
| 2 | RCAF | 100% | **50%** | 56.5 | 0.8938 | 100/Y/44 | 100/**N**/69 |
| 3 | TIDD-EC | 100% | **50%** | 79.5 | 0.8667 | 100/Y/40 | 100/**N**/119 |
| 4 | RACE | 100% | **50%** | 101.0 | 0.8525 | 100/Y/38 | 100/**N**/164 |
| 5 | CIDI | 100% | **50%** | 114.0 | 0.8465 | 100/Y/40 | 100/**N**/188 |

**Read:** correctness saturates (100% everywhere), but **COSTAR is the ONLY framework that holds 100% format adherence** — every other framework leaked an explanatory preamble on the harder `parseRange` fixture (50% format = clean on `chunk`, broke on `parseRange`). This is a **decisive, sole COSTAR win** (composite 1.0000; next-best RCAF at 0.8938, a 0.106 gap — well outside single-sample noise on the format axis). COSTAR is also the leanest (53.0 words). The guardrail-heavy/process-heavy frameworks (TIDD-EC, RACE, CIDI) inflate output 1.5×–2.2× and leak prose — the same MiMo failure mode the prior synthesis documented, but more pronounced in this run.

---

## Does MiniMax-M3 change the framework recommendation?

**On THIS 2-fixture high-reasoning rig, M3's winner is COSTAR** — which is a *different* nominal winner from the prior M2.7-era runs on the same rig:

| Rig / model | Winner | Source |
|-------------|--------|--------|
| 120/003, 7-fixture, M2.7 (authoritative MiniMax rec) | **TIDD-EC + dense** | `120/.../003-.../eval-loop/synthesis.md` |
| 126/004, 2-fixture, M2.7-highspeed / high | **RACE** (TIDD-EC tied at composite 1.0000) | `synthesis-high-reasoning.md` |
| 126/004, 2-fixture, **MiniMax-M3 / high** (this run) | **COSTAR** (sole 1.0000; RCAF/RACE tied 2nd at 0.9896) | this synthesis |

**Does it shift the recommendation? On this small rig the nominal winner moved (RACE → COSTAR for M2.7-highspeed → M3), but the move is NOT decision-grade and MUST NOT overwrite the authoritative 120/003 TIDD-EC recommendation.** Reasons:

1. **2-fixture saturation.** Both fixtures are tractable pure functions; M3 solves every one under every framework (100% pass) AND keeps 100% format under every framework. With pass and format both pinned at the ceiling, the ranking collapses to a **pure word-count tiebreak** — COSTAR wins by being 5–10 words leaner than RCAF/RACE. A 5-word margin on a single sample is **inside noise**; it is not evidence that COSTAR's framing is structurally better for M3 on real (harder, edge-case-dense, multi-file) work.
2. **TIDD-EC's guardrails have nothing to bite on here.** On M3 at high reasoning, TIDD-EC is 100% format-adherent and merely the most verbose (58 words) — so it ranks last on this rig *only* on length. The 120/003 7-fixture rig is exactly where TIDD-EC's edge-case guardrails earn their keep; this rig cannot reproduce that signal because correctness never separates.
3. **The whole M3 field is within 0.018 composite.** Unlike the MiMo cell (where COSTAR's win is a real 0.106 format-driven separation), the M3 cell has no framework structurally failing — it is a near-flat field where COSTAR edges ahead on brevity alone.

**Verdict for MiniMax-M3:** *On this rig, M3 favors COSTAR, but treat that as "format already saturates on M3, so frame for brevity" — NOT as a replacement for the 7-fixture TIDD-EC+dense recommendation.* The authoritative 120/003 MiniMax rec (TIDD-EC + dense) stands; M3 should inherit it until re-benchmarked on the harder/tiered fixtures (the 127 framework). This rig's M3 cell answers the *reasoning-effort + model-version* axis (M3 keeps everything clean at high; the field compresses even further than M2.7-highspeed did), not MiniMax's canonical framework.

---

## Does MiMo confirm COSTAR?

**Yes — emphatically.** The cli-opencode integration currently sets MiMo → **COSTAR + lean** (RACE fallback). On M3-era MiMo-V2.5-Pro at high reasoning, **COSTAR is the sole winner** (composite 1.0000) and is the **only** framework that holds the code-only contract — every other framework (RCAF, TIDD-EC, RACE, CIDI) leaked prose on `parseRange`. This is a *stronger* COSTAR result than the prior `synthesis-high-reasoning.md` MiMo/high cell, where COSTAR merely co-won with RCAF (both 100% format, both 51w). Here COSTAR stands alone on the format axis with a decisive 0.106 composite margin.

**The MiMo → COSTAR + lean integration default is confirmed correct and, if anything, reinforced.** The documented MiMo guidance — "frame for format + brevity, NOT guardrails; TIDD-EC/dense ranks last; RACE is the statistical-tie fallback" — holds: TIDD-EC inflated output 1.5× and leaked prose; RACE, while documented as the fallback, broke format here (164 words on `parseRange`) and would only be a safe fallback at default reasoning, not this high-reasoning run. The lean, audience-framed COSTAR scaffold (`Style: no preamble`, `Audience: automated suite`) is what suppresses MiMo's preamble habit. **No MiMo integration change needed; COSTAR is the right default.**

---

## Cross-model: MiniMax-M3 vs MiMo-V2.5-Pro on the same rig

| Axis | MiniMax-M3 / high | MiMo-V2.5-Pro / high |
|------|-------------------|----------------------|
| Winner | COSTAR (composite 1.0000) | COSTAR (composite 1.0000) |
| Win margin | Tight (field within 0.018; length-only) | Decisive (0.106 gap; format-driven) |
| Correctness | 100% all frameworks | 100% all frameworks |
| Format adherence | **5/5 frameworks 100%** (nothing leaks) | **1/5 frameworks 100%** (only COSTAR; the rest leak prose on `parseRange`) |
| Leanest avg words | 47.5 (COSTAR) | 53.0 (COSTAR) |
| Verbosity spread | 47.5–58.0 (tight) | 53.0–114.0 (wide; CIDI 2.2× COSTAR) |
| Total wall (10 dispatches) | 244.8 s | 160.5 s |

**Key cross-model finding:** **both models agree COSTAR is the high-reasoning winner on this rig, but for opposite reasons.** M3 keeps *every* framework format-clean, so COSTAR wins only on brevity (a soft, noise-level edge). MiMo lets most frameworks leak prose, so COSTAR wins on *format discipline* (a hard, structural edge). M3 is the more format-robust model here (no framework breaks it); MiMo is more framing-sensitive (needs the lean audience-aware COSTAR scaffold to stay clean). This mirrors and extends the prior synthesis's "MiMo is more preamble-prone under non-lean framing" observation — and on this run M3 is *less* preamble-prone than the M2.7-highspeed cell was (M2.7-highspeed had CIDI still breaking format; M3 has nothing breaking).

---

## Caveats (honest scope)

- **Single sample per (model × framework × fixture).** 10 dispatches per model, one each. Every composite gap inside the M3 cell (≤0.018) and the RCAF/RACE 2nd-place tie are **within single-sample noise**. The MiMo COSTAR win (0.106 margin, format-driven) is the only separation large enough to read as structural rather than noise.
- **Two tractable fixtures only** (`chunk`, `parseRange`), both deterministic pure functions → **correctness saturates at 100%** and cannot separate frameworks on either model. This rig measures **format discipline + token efficiency**, which is the operative axis for an AI-driving-AI dispatch loop, but it CANNOT surface where guardrail-heavy framing (TIDD-EC) pays off on harder, edge-case-dense, or multi-file tasks. **This is precisely the known limitation the 127 framework's tiered fixtures are designed to fix.**
- **Saturation makes the ranking format/length-driven, not correctness-driven** — for M3, length-only (everything is format-clean); for MiMo, format-then-length (most frameworks leak). Do not read these single-rig winners as model-wide framework verdicts on real work.
- **Deterministic scoring only** (assertion + regex format check) — no LLM-judge / qualitative dimension.
- **`--variant high` semantics** are whatever opencode 1.15.13 maps the flag to per provider; both models confirmed it accepted (clean exits, valid event stream; MiMo showed reasoning tokens), but the exact per-provider reasoning-token budget is not introspected here.
- **One transient empty-turn** (M3 `rcaf__chunk`, exit 0, empty text, 6 s) was retried once and recovered; both the failed and successful raw responses are preserved. No scores were fabricated or imputed.
- **This rig does NOT supersede the authoritative recs.** 120/003 (7-fixture) is authoritative for MiniMax (TIDD-EC + dense); `synthesis.md` / `synthesis-high-reasoning.md` (this 2-fixture rig) is the basis for the MiMo COSTAR default. This M3 cell is a model-version + reasoning-effort probe, not a re-derivation of MiniMax's canonical framework.

---

## Integration note (recommendation only — docs NOT edited)

**Current documented state** (`cli-opencode/references/cli_reference.md`, `SKILL.md`):
- `minimax-coding-plan/MiniMax-M3-highspeed` is recorded as the **account-asserted DEFAULT** MiniMax dispatch (cli_reference.md model table + decision matrix).
- `minimax-coding-plan/MiniMax-M2.7-highspeed` is recorded as the **confirmed-live fallback**.
- MiniMax `--variant` behavior is documented as **"unverified — omitted by default; confirm against the MiniMax API before relying on it."**
- MiniMax framework contract: **TIDD-EC + dense** (120/003, 7-fixture), "carried forward to M3 until re-benchmarked."

**New live ground truth from this run** (opencode 1.15.13, 2026-06-02):
- **Plain `minimax-coding-plan/MiniMax-M3` is confirmed LIVE** — 10/10 real dispatches succeeded (9 first-pass + 1 transient-empty retried), clean JSON event streams, zero quota/auth failures.
- **`--variant high` is confirmed ACCEPTED for MiniMax-M3** — every dispatch ran under `--variant high` with clean exits; the pre-flight probe returned a valid text part + `step-finish/stop`. This contradicts the current "unverified" note for the MiniMax `--variant` row.

**Recommendation (for the user to apply — I did NOT edit any docs):**
1. **Record plain `minimax-coding-plan/MiniMax-M3` as confirmed-live** in the cli_reference.md model table — promote it from the (currently absent) plain-M3 entry to a "confirmed live (126/004, 2026-06-02)" row, alongside or in place of the account-asserted `MiniMax-M3-highspeed` default. The docs currently only list the `-highspeed` variants; plain `MiniMax-M3` is now empirically the responsive, dispatchable id.
2. **Update the MiniMax `--variant` row** from "unverified — omitted by default" to "**`--variant high` confirmed accepted for `MiniMax-M3` on opencode 1.15.13 (126/004); standing high default applies**." This removes a stale "unverified" caveat now contradicted by 20 clean dispatches.
3. **Do NOT change the MiniMax framework contract.** Keep **TIDD-EC + dense** (120/003, 7-fixture, authoritative). This rig's COSTAR-for-M3 result is saturation-driven (format already clean on M3; ranking is brevity-only) and is **not** decision-grade evidence to flip the framework. Re-benchmark on the 127 tiered fixtures before touching the framework rec.
4. **Do NOT change the MiMo framework contract.** **COSTAR + lean** is confirmed (decisive sole win this run); keep it.

These are recommendations only — the user applies any doc change to cli-opencode themselves.

---

## Artifacts (all under this `eval/` folder)

- **Per-model scored results**: `results-minimax-m3-high.json` (10/10, with `retry_provenance` for the recovered `rcaf__chunk`), `results-mimo-v25pro-high.json` (10/10, clean).
- **Retry detail**: `results-minimax-m3-high-rcafchunk-retry.json` (single-combo recovery run).
- **Preserved failure**: `runs/rcaf__chunk.M3-FAILED-empty-exit0.json` (the empty-text exit-0 first attempt).
- **Raw per-dispatch responses** (prompt + assistant text + exit + timing), archived per model so tag-reuse across runs does not clobber them: `runs-archive/minimax-m3-high/`, `runs-archive/mimo-v25pro-high/`. Live `runs/` holds the most-recent run's raw responses.
- **Harness**: `run-mimo-bench.cjs` (`--model` / `--variant` / `--out`). Frameworks: `frameworks.cjs`. Fixtures + hidden suites: `fixtures.cjs`. Extraction + format check: `extract.cjs`. Isolated test runner: `runtests.cjs` / `runner-child.cjs`.
- **Prior syntheses** (context): `synthesis.md` (default-reasoning MiMo, 5-framework origin), `synthesis-high-reasoning.md` (M2.7-highspeed × MiMo, 2×2 reasoning).

## Reproducibility

- MiniMax-M3 high:  `node run-mimo-bench.cjs --model minimax-coding-plan/MiniMax-M3 --variant high --out results-minimax-m3-high.json --timeout 120`
- MiMo-V2.5-Pro high: `node run-mimo-bench.cjs --model xiaomi-token-plan-ams/mimo-v2.5-pro --variant high --out results-mimo-v25pro-high.json --timeout 120`
- Single-combo retry pattern (used for `rcaf__chunk`): add `--frameworks rcaf --fixtures chunk --out <tmp>.json`.
- Run FROM this `eval/` directory (the rig resolves `--out`, `runs/`, fixtures, and frameworks relative to its own dir).
