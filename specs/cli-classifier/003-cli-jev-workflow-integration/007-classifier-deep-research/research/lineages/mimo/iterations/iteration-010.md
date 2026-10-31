# Iteration 010 — mimo-10: Kill criteria as printed numbers

- **Angle:** mimo-10 (W4, maps to H)
- **Lens:** UX and measurement. A kill criterion is a printed number with a printed threshold, or
  it is not a kill criterion.
- **Read first:** `steer.md` unchanged. `LOCAL` re-read: warm p50 ~60 ms, p95 62.8-78.5 ms per
  primitive, RSS 814 MB, physical footprint 3,368 MB, ~10 s start-to-healthy
  (`deem-local.md:34-44`), uncalibrated (`:27`), quality unmeasured (`:52`).
- **Sibling check (W4 contract):** all own iterations 1-9 read; newest of each sibling unchanged
  (grok-010, deepseek-010, swe-010, glm-005, all read). No new sibling file.

## Finding 1 — Deem's own kill lines (Q1)

| Line | Printed form | Threshold | Source of the threshold |
|---|---|---|---|
| health | `deem health: backend=<b> model=<id> commit=<pair>` | kill if `backend` parses as `stub`, or `model != deem-0.8-v1`, or the commit pair changes between calls | ALL-4's rule (the orchestrator's), `deem-local.md:55-70`; the model pin is deepseek-01's (theirs) |
| latency | `deem p95: <X> ms` | kill above **2,500 ms** (the advisor hook deadline) and above **3,000 ms** for any PreCompact-adjacent form | the deadlines that ruled rounds 1-2's live forms (`deem-local.md:49-50`) |
| memory | `deem footprint: <X> MB (baseline 3,368)` | kill above **2× baseline = 6,736 MB** | **proposed**, not measured-derived: no operator ceiling exists; the baseline is `deem-local.md:41-43` |
| agreement | `deem-vs-jev gap: <X> points, flip <Y>` | kill above **10 points** gap or **0.10** flip | mimo-03's pre-registered deciding line (iteration 3); flip rule from R1's keep rule (BASE2 `research.md:233`) |

The memory line is the only proposed threshold; everything else is either measured baseline or a
deadline the operator's hooks already impose.

## Finding 2 — one kill line per survivor (Q2) and its one-line report (Q3)

| Survivor | The line it prints | Kill when |
|---|---|---|
| 002 census (swe-10) | `baseline mismatch: comparison void` / `no headroom` / `underpowered` | already in their code: mismatch voids, 0 movable stops, 1-4 skips the arm |
| sk-design replay (N-mimo-06-1) | `misroutes: <n>/53` | `misroutes = 0` kills every F classifier idea (nothing to fix) |
| Stage-2 replay (N-glm-03-1) | `route: stage-2 replay, diverged <n>/<m>` | `divergence > 5%` (**proposed**) — the replay stops being a drop-in |
| Read-ledger (N-mimo-04-2) | `reread remainder: <n>` | `remainder = 0` deletes the ledger (baseline 84/40d, `results-mimo-04.txt:6`) |
| Hook cap (N-mimo-04-3) | `hook store: <X> MB after TTL` | no model verdict; delete the policy when the operator stops asking |
| Comparison (N-mimo-03-1) | `Deem non-inferior: PASS / INCONCLUSIVE` | the pre-registered line (gap ≤ 10, flip ≤ 0.10) |
| Cite-drift (N-mimo-08-1) | `cite-scan: checked <n> drifted <n>` | `precision < 0.8` OR `drift < 1/100` OR `agreement < 0.8` → `kill` |
| Compaction arm (N-mimo-04-1) | `keep-rule: flip <Y>, recovery reads <n>` | `flip > 0.10` OR recovery reads not below the 292/40d baseline (`results-mimo-04.txt:4`) |
| sk-prompt pick (N-grok-05-1) | `framework pick: <id> | none` | `none` on > 50% of rows (grok-05's kill, theirs) |
| Deem judgment arms (any) | `backend=<b> commit=<pair> used` | any Finding-1 line firing |

## Finding 3 — evaluable today with zero calls (Q4)

Already evaluated (counts exist): the read-ledger remainder line (84, counted), the strict
residue line (0 of 2,435 — `results-mimo-08.txt:4-5`), the hook-store bytes (546.2 MB baseline,
counted), the misroute count once the replay runs (zero calls). Evaluable at build time with zero
model calls: every census line, the divergence line (replay vs recorded picks). **Needs the
billed run or labels:** the agreement gap (289×2 calls), cite-drift precision (40 labels), the
compaction flip line (needs the accuracy line first). The operator can therefore kill half the
program today without a single model call.

## Finding 4 — where a round-2 kill line changes (Q5)

BASE2 section 9's kill-line family (`research.md:446+`, its read) changes under two backends in
three ways, all adopting deepseek-10's amendments (theirs): every printed line gains its
per-backend skip form (`jev arm skipped: …` / `deem arm skipped: …`, F2); 002's latency record
splits into the spawn-included Jev row and the connect+call Deem row (F3); and R19's arm's
fallback bar becomes the Deem skip rate — a cold pass writing nothing counts as a fallback, not a
failure (F3). One line is entirely new in round 3: the **agreement gap** between backends —
round 2 had one backend and no such number.

## Per-idea record

### N-mimo-10-1 — the printed-kill-lines contract

| Field | Content |
|---|---|
| **Idea** | `N-mimo-10-1`: every survivor's kill criterion is a string in its script's output and a row in its phase spec, printed before any build (BASE2's rule, extended). Type: none |
| **Question** | H |
| **Builds on** | BASE2 section 9's kill family; my Findings 1-2 |
| **Value** | The operator reads one number per survivor and stops a feature by reading, not by deciding |
| **Seam** | each survivor's report line (their scripts' `main()`) |
| **Metric, baseline, harness** | kill lines printed / kill lines defined; baseline: round 2 printed one family (theirs); harness = each script's output fixture |
| **Savings** | none; it is the discipline the savings claims hang on |
| **Cost, latency, privacy** | zero calls for the printing |
| **Two-backend gate** | the lines print `skipped` per backend under D1's gate; with neither, the zero-call lines still print |
| **Rough LOC** | ~5-10 per survivor's report line |
| **Verdict** | **build-now as contract text** in each phase spec |
| **Confidence** | thresholds confirmed except the memory (proposed) and divergence (proposed) lines — both marked |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| Deem's kill lines as printed numbers: health/latency/memory/agreement with their thresholds | new | Finding 1 |
| One kill line + one report line per survivor, ten survivors | new | Finding 2 |
| Half the program's kill lines are evaluable today with zero calls | new | Finding 3 |
| Round-2's kill family gains skip forms and split latency rows; the agreement-gap line is new to round 3 | new | Finding 4 |
| Two thresholds (memory 2× baseline, replay divergence 5%) are proposed, not measured | new (negative knowledge) | Findings 1-2 |

## Hand-off

- The synthesis's H answer is complete: order (iteration 9), savings (iteration 9 Finding 3),
  kill lines (this iteration).
- The two proposed thresholds are the only judgment calls in the kill table; a synthesis that
  adopts them marks them proposed.
