# Research synthesis — mimo lineage (UX and measurement)

Deep research round 3, lineage `mimo` (cli-pi, `mimo-v2.6-pro` high), session
`fanout-mimo-1790490452777-942a1f`. Ten iterations, angles `mimo-01` to `mimo-10`, waves W1-W4,
forced to the cap under `stopPolicy: max-iterations`. This file is the synthesis of every
iteration in `iterations/` and their deltas in `deltas/`; where a claim rests on a sibling or a
baseline it says whose it is. All result files cited live in this lineage directory.

**Stop reason: maxIterationsReached (10/10).** Convergence telemetry (self-reported
newInfoRatio): 1.0, 1.0, 1.0, 0.85, 0.8, 0.75, 0.8, 0.9, 0.8, 0.8 — mean 0.87, above the 0.05
threshold throughout; `convergenceMode: off`, and per the stop policy no early synthesis was
taken.

**Answer-shape note:** every row below marks **confirmed** (a count or code I opened) or
**inferred** (with what would confirm it). No dollar figures appear anywhere (BASE2 row 52,
`research.md:802`). The Python `jev-cli` 0.6.2 and the npm `jevctl` 0.2.3 are kept apart. All
Deem vendor figures are labeled; `context/deem-local.md` supplies the measured 0.8B speed and
memory only, never quality.

---

## 1. The measuring stick (question C/H input)

**Every context-reduction claim in round 3 is measured against carried context per assistant
turn: p50 384,219 / p95 887,519 cache-read tokens over 66,498 unique messages** (confirmed;
`results-mimo-01-recount.txt:10`, dedupe by `message.id`, cut-off `2026-09-27T06:22Z`). Fresh
input is p50 2 tokens; per-turn duration is p50 97,798 ms (confirmed; `results-mimo-04.txt:8`).
The savings unit is: tool-result bytes + AI passes + user-wait minutes + wrong-judgment cost +
a cache-bust column (glm-03's contest adopted in part; their "cache is nearly free" stays their
inference — cache-read billing is UNKNOWN to this corpus).

Harnesses (all in this lineage, rerunnable): `count-context-baseline.py` (v1, superseded),
`count-context-baseline2.py` (tool_use by id, subagents, attachment buckets),
`count-validator-residue.py` (v1, upper bound), `count-validator-residue2.py` (strict),
`count-re-read-split.py`, `count-output-buckets.py`, `count-skill-usage.py`. Results:
`results-mimo-01.txt`, `results-mimo-01-recount.txt`, `results-mimo-02.txt`,
`results-mimo-03-power.txt`, `results-mimo-04.txt`, `results-mimo-04-buckets.txt`,
`results-mimo-05-06-usage.txt`, `results-mimo-08.txt`.

## 2. The counted baseline (question C)

| Surface | Counted size (40 days) | Status |
|---|---|---|
| Carried context per turn | p50 384,219 / p95 887,519 cache-read tokens | confirmed |
| Tool-result payload | 378,331,270 B total; Bash 217.9 MB, Read 154.0 MB | confirmed |
| Skill/reference loads | 36,015,038 B over 8,413 loads (Read 11.7 MB + Bash loads 24.4 MB) = 9.5% of tool results | confirmed |
| Hook injection | `hook_additional_context` 14.4 MB; `hook_success` stdout 546.2 MB stored | confirmed |
| Attachments overall | 71.3% of measured context bytes is attachment payloads | confirmed (v1) |
| Re-reads | 1,777 total → 1,497 partial, 1,076 edit-preceding, 292 post-compaction, **84 remainder waste** | confirmed |
| Compaction | 217 `compact_boundary` records main corpus (swe-004 counts 226 incl. subagent) | confirmed/quoted |
| Human prompts | 6,677 per 40 days ≈ 167/day | confirmed |

Two corrections stand over my own early work, both steered: the v1 tool counts were void
(dedupe defect — recounted), and "hook-injected context is unmeasurable" was refuted (it is
recorded as `attachment.type=hook_additional_context`). The lead's review of iterations 1-2
caught both; the recounts are mine.

## 3. Where a classifier cuts work — the seam verdicts (questions C, D, E, F)

Ranked by counted net saving (iteration 4, Finding 4):

1. **Skill/reference stage-2 deterministic replay** (N-glm-03-1, priced here): 6.3 MB/week of
   tool-result bytes plus every leaf re-scoring, zero judgment, zero new surface. **No
   classifier is needed.** Verdict: build-now as a zero-call fix.
2. **Compaction keep/drop arm** (phase-005 amendment; N-mimo-04-1): up to 51 recovery passes/week
   (292/40d counted) plus up to 68 user-wait min/week (swe-004's 104 s/boundary, their cite).
   The only judged seam with measured minutes. Verdict: next, behind the accuracy line and its
   printed keep rule (flip ≤ 0.10).
3. **Hook-output retention cap** (N-glm-03-2's cheaper fix, priced here): 546.2 MB stored;
   context side 2.5 MB/week. Verdict: later (policy work).
4. **Tool-output pruning**: largest byte surface (378 MB/40d) but firing rate and cache-bust
   probability both unmeasured (grok-003's warning, theirs). Verdict: later.
5. **Re-read avoidance**: 84/40d waste; a zero-call session ledger (N-mimo-04-2) beats every
   classifier at every precision. Ledger: build-now; classifier: **drop**.

**Question D's surprise (iteration 8):** the strict post-pass residue — the AI editing a document
that just passed its own validator in the same folder — is **0 of 2,435 passing invocations**
(confirmed; `results-mimo-08.txt:4-5`). The round-3-early "354 residue events" retires as a
voided upper bound. The real validator residue with a sampling frame is **citation drift** (456
`file:line` cites — swe-06's count; `AC_COVERAGE` checks presence, not support — deepseek-03's
finding). Its workflow (N-mimo-08-1: 40 labels ≈ 80 min, precision ≥ 0.8 pre-registered, printed
stop rule) is the cheapest judged option in the packet. Category counts from review tables
(P0 69 / P1 1,001 / P2 1,005 over 5,830 files; traceability 337, correctness 320) are confirmed
counts but are review findings, not passed-document residue (the lead's defect call on
iteration 2 stands).

**Questions E and F (iterations 5-6):** both are mostly negative knowledge with counted bounds.
sk-prompt usage ≤ 22 `/prompt:improve` records/week (build conflation; 2 direct launches in 40
days), per-run loads 59,661 B, zero gold files, 7-vs-5 registry split (my read confirms
grok-05). sk-design's benchmark tree is empty (my read): no routing run was ever archived; 53
scenario files exist (4/12/10/9/18, my count). Verdicts: the sk-prompt framework pick is
**later** (a docs line collects the same bytes free — glm-05:82), CLEAR scoring **drop**
(glm-05:83), sk-design routing classifier **drop** (determinism wins; N-grok-06-1 and
glm-05:84, agreed), and the **zero-call router replay (N-mimo-06-1) is build-now** — the
misroute count question F has never had.

## 4. Deem against Jev: the comparison (question A)

289 labeled rows host a zero-new-label comparison: `labeled-prompts.jsonl` 195 (gold
`skill_correct`; Gate-3 slice 127/68 at F1 0.9843 — at most 4 movable errors, BASE1's count),
`holdout-prompts.jsonl` 70, `ambiguity-prompts.jsonl` 24 (confirmed, `wc -l`). Pre-registered in
iteration 3:

- **The one deciding line:** `Deem non-inferior: PASS iff gold-accuracy gap to Jev is at most 10
  points on decided rows (exact one-sided sign test, alpha 0.05) AND backend flip rate <= 0.10;
  otherwise INCONCLUSIVE: underpowered for tighter margins (5 points needs ~431 labeled rows per
  arm).` Power arithmetic confirmed (`results-mimo-03-power.txt:2-17`): the combined set needs a
  true win rate 0.58-0.66 at 80% power; the ambiguity set alone needs 0.76-0.97 and is too small.
- **Calibration first:** 50-row content-hash split, 5-bin ECE (10-bin needs 200 rows —
  unmeasurable here). The 0.8B is uncalibrated at temperature 1.0 (`deem-local.md:27`).
- **Fairness checklist** with code pins: option caps (`deem_server.py:533-540`), raw vs rescaled
  confidence, the `criteria`/`options` field gap (`JEVSRC:364-393` vs `deem_server.py:535-543`),
  constant state length, and the model commit pinned (`8cbabbb`, `deem-local.md:20`) with abort
  on change (`deem-ctl update` switches `models/current`, `deem-local.md:55-70`).

**Deem's own kill lines** (iteration 10): health (parse `backend`, refuse `stub`, model pin,
commit pair), p95 above 2,500/3,000 ms, footprint above 2× the measured 3,368 MB baseline
(proposed threshold), agreement gap above 10 points or flip above 0.10. Warm latency (~60 ms
p50) sits inside every hook deadline that ruled out round-1/2 live forms (`deem-local.md:49-50`),
but hook spawn/connect cost remains unmeasured (`deem-local.md:50`).

## 5. The operator's two-backend contract (question G/A)

- **Typed today:** `deem-ctl start|stop|status|update --check|update` (rollback built into
  update's exit-3 restore, `deem-local.md:55-70`); Jev: `command -v jev`, `jev --version`,
  `jev auth status --provider <p>`. **"Which backend and commit did feature X use" has no
  surface** (confirmed by absence) — N-mimo-07-1's `/doctor:classifier` fills it, verdict
  **next** (it lands with the hub phase).
- **Status prints on demand, not per session** (a session line would print ~4,700×/week).
- **Switch defaults:** gated features off; zero-call fixes on; no thresholds before calibration;
  with neither backend, behavior exactly as today (parent D1).
- **Labor:** zero-call slices survive a 0-minute operator; the first judged feature is 80 min;
  each later judged feature is 3.5-5 h of labeling.

## 6. The order and the savings (question H)

1. Free numbers: the 002 census slice (swe-10's first PR — its report prints the power line),
   the sk-design replay, the read-ledger, the hook cap. 0 operator minutes.
2. Zero-call routing: the stage-2 replay after a ~30 min pinning review.
3. The comparison: zero-call slice now; billed 289×2 on the operator's Jev yes (Deem-vs-gold
   without a key).
4. First judged feature: cite-drift (80 min labels), past its printed stop rule.
5. The compaction arm behind step 3's accuracy line, keep rule printed (flip ≤ 0.10).
6. Later/drop: sk-prompt pick (later), sk-design routing (drop), CLEAR (drop), tool-output
   pruning (later), validator-residue flagger (**drop — its population is empty**),
   re-read classifier (drop), MCP-shaped Deem tools (drop — grok-03/glm-05:79).

Weekly savings from counts: replay ~6.3 MB tool bytes + 210 loads/day; ledger 15 re-reads; hook
cap 2.5 MB context; compaction up to 51 passes + 68 wait-min; cite-drift UNMEASURED in passes
(its harness is a marked week). Kill lines: one printed string per survivor (iteration 10,
Finding 2), half of them evaluable today with zero calls. Two thresholds (memory 2× baseline,
replay divergence 5%) are **proposed**, not measured-derived.

## 7. What not to build (mimo lens)

| # | Idea | Reason | Evidence |
|---|---|---|---|
| M1 | Re-read classifier | population floor 84/40d; a zero-call ledger wins at any precision | `results-mimo-04.txt:6` |
| M2 | Validator-residue flagger on post-pass edits | strict population is 0/2,435 | `results-mimo-08.txt:4-5` |
| M3 | CLEAR-score classifier | 50-point weighted sum, no labels | grok-05, glm-05:83 |
| M4 | sk-design routing classifier | keyword scorer already is the closed set; no archived miss rate | glm-05:84, my empty-reports read |
| M5 | Framework-pick classifier before a docs line | the docs fix collects the same 59,661 B free | glm-05:82, my wc |
| M6 | Any threshold on raw Deem probabilities | uncalibrated temperature 1.0 | `deem-local.md:27` |
| M7 | Dollar-based cost claims | vendor claims only | BASE2 row 52 |

## 8. Containment and independence

This lineage wrote only inside `research/lineages/mimo/`. No `jev` call of either package, no
Deem server call, no network call, no git write, no validator or test run (ALL-6 honored: all
validator baselines come from counting on record or are marked UNKNOWN). Wave-1 iterations
(1-3) read no sibling file; waves 2-4 named every sibling file read in their Sibling check
sections. Wave-1 agreements with siblings are recorded as corroboration only in the synthesis's
inputs; post-wave-1 agreements are marked cross-read. The lead's `steer.md` was read first at
every iteration after it landed, its corrections applied and re-counted as my own evidence, and
its two voided claims retired explicitly.

## 9. Convergence report

- Stop reason: **maxIterationsReached**, total iterations 10, questions covered A-H at the
  lens's depth (A: comparison design + Deem lines; C: baseline + seams; D: residue + labels;
  E: usage/gold bounds; F: routing ground; G: operator contract; H: order + savings + kills;
  B: flip-set reasoning reached this lineage through siblings — grok-10/glm-05's "the 60 ms
  flips nothing alone" is quoted theirs, and my unit work supports it).
- Average newInfoRatio 0.87 (trend flat above threshold).
- Every iteration carries a New against baseline table and a Hand-off; all ten deltas are in
  `deltas/`.
