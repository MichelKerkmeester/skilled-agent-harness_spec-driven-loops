# Iteration 004 — mimo-04: Savings arithmetic per reduction seam

- **Angle:** mimo-04 (W2, maps to C, H)
- **Lens:** UX and measurement. Every seam gets the same four columns: counted bytes/tokens,
  counted firings, counted minutes, and the error direction a wrong judgment adds.
- **Read first:** `steer.md` (unchanged since its iteration-2 review). Steering applied: re-reads
  split before pricing (Finding 2), tool counts taken from the fixed harness, citations verified
  by `grep -n` immediately before writing. `LOCAL:30-53` re-read: ~60 ms p50 per primitive,
  uncalibrated, spawn/connect cost unmeasured (`deem-local.md:50`).
- **Sibling check (W2 contract):** newest iteration of each other lineage read this iteration:
  `grok/iterations/iteration-010.md` (iteration 10), `deepseek/iterations/iteration-010.md`
  (iteration 10), `swe/iterations/iteration-006.md` (iteration 6), `glm/iterations/iteration-003.md`
  (iteration 3). Their quoted numbers below are theirs unless a count is marked mine; swe-004's
  compaction figures and grok-003's cache warning reach me through glm-03's quotation and are
  attributed that way, not as my reads.

## Finding 1 — the savings unit (pushing past glm-03 F2)

glm-03 argues context reduction saves attention and marginal cache-creation, not cost, because
fresh input is p50 2 tokens and the carry arrives via cache — their inference, and their unit is
"attention-seconds + new cache-creation bytes + cache-bust probability" (glm-03 F2). **Partly
adopted, partly contested with my counts.** Adopted: every seam below reports cache-creation and
attention, not raw token cost, and carries a cache-bust column. Contested: "nearly free" is
glm's inference about pricing, which no file I opened confirms — cache-read billing is a vendor
matter I mark UNKNOWN. My unit, per seam: (a) tool-result bytes and tokens off the carry
(counted), (b) AI passes (counted), (c) user-wait minutes (counted), (d) wrong-judgment cost in
passes (counted), (e) cache-bust risk (stated).

Constants, all counted: carried context p50 384,219 tokens (`results-mimo-01-recount.txt:10`);
6,677 human prompts per 40 days ≈ 167/day (`results-mimo-01.txt:45`); per-turn duration p50
97,798 ms ≈ 98 s, p95 1,758,105 ms (`results-mimo-04.txt:8`, from 4,575 `turn_duration` system
records); total tool-result payload 378,331,270 bytes (`results-mimo-04-buckets.txt:41`).

## Finding 2 — the re-read split (steer-mandated, changes the seam's size)

Of 1,777 re-reads (main + subagent): **1,497 carry offset/limit (partial reads), 1,076 precede a
later edit of the same file, 292 sit after a compaction boundary, and only 84 are remainder
waste candidates** (`results-mimo-04.txt:2-6`; split logic `count-re-read-split.py:60-79`). The
categories overlap; remainder means none of the three. The 30.1%/16.8% ceiling glm-03 carried is
now split: the true waste floor is **84 per 40 days ≈ 2.1/day ≈ 15/week**. Confirmed by count.
A file-relevance classifier's maximum prize is those 84 plus whatever share of the 292
post-compaction reads a better keep-rule prevents — everything else is legitimate work.

## Finding 3 — the seam table (Q1, Q2, Q3)

| Seam | Counted size | Counted firings | Minutes/week | Wrong-judgment cost | Cache-bust risk |
|---|---|---|---|---|---|
| Compaction keep/drop (phase 005's deletion arm) | post-compaction recovery reads 292/40d (`results-mimo-04.txt:4`); boundaries 217 main (`results-mimo-01.txt:60`) / 226 incl. subagent (swe-004's count, via glm-03) | 5.7 boundaries/day | ~83 min AI time (51 recovery reads × 98 s) + up to 68 min user wait at swe-004's p50 104 s/boundary (their cite of `005/spec.md:60`; the wait is only saved if boundaries shorten — estimate) | a wrong drop causes the recovery reads it was meant to prevent: at p=0.7, ~12 wrong drops/week ≈ 20 min added | low: operates inside the compaction, which already rewrites the carry |
| Skill/reference load reduction (deterministic stage-2 replay, N-glm-03-1) | 36,015,038 bytes of tool results: Read 11,660,172 (`results-mimo-04-buckets.txt:49`) + Bash loads 24,354,866 (`:56`) = 9.5% of 378.3 MB (`:41`) | 8,413 loads/40d ≈ 210/day (recount mention counts) | ~3.5 min of tool-time bytes alone; the real prize is the model's re-scoring of 617-1,641-line leaves (swe-003's count, via glm-03) | none: deterministic replay has no judgment | none if the replay shortens the same tool result that already lands (stays cache-neutral by construction) |
| Re-read avoidance | remainder 84/40d (`results-mimo-04.txt:6`) ≈ 1.4 MB at the 17 KB average Read result (mine, 154,015,180/8,921) | 2.1/day | ~2 min AI time | a wrong flag hides a needed re-read: at p=0.7, ~2 wrong flags/day | none for a note; high for a Read-time filter (grok-003's warning via glm-03: filtering can bust the prompt cache) |
| Hook-output retention cap (N-glm-03-2's cheaper fix) | stored hook stdout 546.2 MB/40d (`results-mimo-01-recount.txt:65`, `:154`) + `hook_additional_context` 14.4 MB/40d ≈ 2.5 MB/week actually in context (`:69`, `:160`) | continuous (490 hook events/day) | 0 (storage policy) | none | none |
| Tool-output pruning | 378.3 MB/40d total (`results-mimo-04-buckets.txt:41`), 28.6% of measured context bytes (`results-mimo-01.txt:66`) | every tool call (60,130/40d) | unknown until firing rule exists | at p=0.7, 3 of 10 prunes wrong, each risking a recovery read | **stated, not measured**: grok-003's read of the vendor README says filtering can invalidate the prompt cache and a saved prune survives errors |
| Retrieval reranking | UNKNOWN: no miss/misrank count exists (glm-03 agrees) | UNKNOWN | UNKNOWN | — | — |

Token translation: 36.0 MB ≈ 9M tokens and 2.5 MB/week ≈ 625K tokens at 4 bytes/token (marked:
no file I opened records byte and token counts of one payload; every token figure here is
derived, every byte figure counted).

## Finding 4 — rank and the precision-0.7 flip (Q4)

Ranked by net counted saving, mimo lens (minutes first):

1. **Skill/reference stage-2 replay** — 9.5% of tool-result bytes plus every leaf re-scoring,
   zero judgment, zero new surface (glm-03 F3.1, priced here with my counts).
2. **Compaction keep/drop arm** — the only seam with measured user-wait minutes (68/week,
   swe-004's number) and counted recovery passes (51/week, mine). Agrees with swe-004 and glm-03
   F5; agreement is cross-read, and the counts I price are mine.
3. **Hook-output retention cap** — 546 MB of stored output, no model, no context effect beyond
   the 2.5 MB/week additional context.
4. **Tool-output pruning** — largest byte surface, but its firing rate and cache-bust rate are
   both unmeasured, so its net sign is unknown.
5. **Re-read avoidance** — 15/week; loses to a zero-call session ledger at any precision.

**Which rank flips at precision 0.7:** seams 4 and 5 flip below every zero-call fix — at p=0.7
wrong prunes and wrong flags buy back recovery passes on the p50 98 s turn, and both fire at
high volume. Seam 2 keeps its rank only under the printed keep-rule (flip ≤ 0.10, R1's rule as
grok-10 and deepseek-10 both carry); below that its wrong drops are exactly the recovery reads
it was built to prevent. Seam 1 has no precision parameter.

## Finding 5 — what the operator sees (Q5)

| Seam | The line | Default | Off switch |
|---|---|---|---|
| Stage-2 replay | `route: stage-2 replay (deterministic)` only with `--verbose`; silent otherwise | ON (no model, no gate) | the router's existing `router_state` flag |
| Compaction arm | one line per boundary: `compaction: dropped N items (keep-rule)` / `kept all` | OFF until a backend passes its gate and the keep rule prints `keep` | `--keep-rule off` restores today's compaction |
| Re-read ledger | `already-read: <path>` note in the subagent prompt | ON (zero-call) | session-note toggle |
| Hook retention cap | `doctor` shows stored hook bytes | ON as a retention policy | retention config |
| Tool-output pruning | `tool-output: pruned N KB` per pruned result | OFF behind its own switch | `--output-prune off` |

With neither backend every gated seam prints nothing and behaves exactly as today (two-backend
gate, parent D1); the zero-call seams (replay, ledger, cap) need no gate and say so.

## Per-idea records

### N-mimo-04-1 — compaction keep/drop arm (priced; idea is the phase-005 amendment, R19's arm)

| Field | Content |
|---|---|
| **Idea** | keep/drop judgment per compaction item; type `choice`. Builds on BASE2 R19's census and swe-004's deletion-arm amendment |
| **Question** | C, H |
| **Builds on** | BASE2 R19; swe-004 (via glm-03); my recovery counts |
| **Value** | Compaction stops destroying context the author still needs; the operator re-reads less after every boundary |
| **Seam** | phase 005's harness amendment (offline pass; no live PreCompact form exists — deepseek-008 F6, via glm-03) |
| **Metric, baseline, harness** | post-compaction recovery reads per boundary; baseline 292/40d ÷ 226 ≈ 1.3 (`results-mimo-04.txt:4`); harness = `count-re-read-split.py` re-run |
| **Savings** | up to 51 recovery passes/week ≈ 83 min AI time (counted base, savings estimate) |
| **Cost, latency, privacy** | one `choice` per item, Deem ~60 ms local (`deem-local.md:36-38`); the pass is offline so Jev's latency and egress both fit; spawn/connect unmeasured (`deem-local.md:50`) |
| **Two-backend gate** | own switch `--keep-rule`; Deem health probe per deepseek-10 F2's text (adopted); Jev D5 checks; prefer Deem (document text stays local); with neither: today's compaction |
| **Rough LOC** | ~150-250 as a 005 amendment |
| **Verdict** | **next** — biggest counted minutes seam, but it needs the mimo-03 comparison's accuracy line first; its keep rule stays printed (flip ≤ 0.10) |
| **Confidence** | counts confirmed; savings share estimated; 104 s wait is swe-004's cite, not reopened |

### N-mimo-04-2 — re-read ledger instead of a re-read classifier

| Field | Content |
|---|---|
| **Idea** | `N-mimo-04-2`: a zero-call "already-read" ledger in session prompts replaces any classifier on this seam. Type: none (not a judgment) |
| **Question** | C |
| **Builds on** | my split (84 remainder); glm-03 F3.3's cheaper-fix direction |
| **Value** | The 84 waste re-reads disappear without a model call or a cache risk |
| **Seam** | subagent prompt composition (the mechanics already carry session facts) |
| **Metric, baseline, harness** | remainder re-reads per 40d; baseline 84 (`results-mimo-04.txt:6`); harness = `count-re-read-split.py` |
| **Savings** | ~15 reads/week ≈ 2 min AI time (counted) |
| **Cost, latency, privacy** | zero calls, zero egress |
| **Two-backend gate** | none needed: no classifier runs; with either or neither backend behavior is the same |
| **Rough LOC** | ~30-60 prompt-side |
| **Verdict** | **build-now as a zero-call fix**; the classifier variant is **dropped** — it loses at every precision |
| **Confidence** | counts confirmed |

### N-mimo-04-3 — hook-output retention cap

| Field | Content |
|---|---|
| **Idea** | retention cap/TTL on stored hook stdout (546.2 MB/40d). Type: none |
| **Question** | C |
| **Builds on** | glm-03 F3.2; my hook-surface counts |
| **Value** | storage and reread-surface hygiene; the operator's `doctor` prints one number |
| **Seam** | the hook result store the harness already writes |
| **Metric, baseline, harness** | stored hook bytes; baseline 546.2 MB/40d (`results-mimo-01-recount.txt:65`, `:154`); harness = `count-context-baseline2.py` |
| **Savings** | storage; context effect limited to the 2.5 MB/week additional context (counted) |
| **Cost, latency, privacy** | none; retention also shrinks the transcript-privacy surface |
| **Two-backend gate** | none needed |
| **Rough LOC** | ~40-80 config-side |
| **Verdict** | **later** — real but not context-critical; do it when the harness touches retention anyway |
| **Confidence** | counts confirmed |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Re-reads split: 84 remainder waste, 1,497 partial, 1,076 edit-preceding, 292 post-compaction | new | `results-mimo-04.txt:2-6` |
| Skill/reference loads are 36,015,038 of 378,331,270 tool-result bytes (9.5%) over 8,413 loads | new (the bucket glm-03 demanded) | `results-mimo-04-buckets.txt:41`, `:49`, `:56` |
| Per-turn duration p50 97,798 ms, p95 1,758,105 ms | new | `results-mimo-04.txt:8` |
| Zero-call fixes beat classifiers on re-reads and skill loads at every precision | new (agrees with glm-03 F3, priced by my counts) | this file, Finding 4 |
| Precision-0.7 flip lands on the high-volume call seams, not on the compaction arm's keep rule | new | Finding 4 |
| Cache-read billing is UNKNOWN to this corpus; glm-03's "nearly free" stays their inference | new (negative knowledge) | Finding 1 |

## Hand-off

- mimo-05 starts from BASE2 rows 63 and 52 per its refinement, and prices sk-prompt per run at
  the p50 98 s turn and the p50 384,219 carry.
- mimo-06 needs the same unit (bytes + passes + minutes + cache-bust column).
- The synthesis should rank seams by this table and carry the zero-call-first finding: on two of
  five measurable seams the answer is "no classifier".
- If a later iteration re-runs any count, it adds a new results file (steer's rule).
