---
title: "Iteration 9 — deepseek-09: Failure modes and kill criteria on both backends"
trigger_phrases: []
---

# Iteration 9 — deepseek-09: Failure modes and kill criteria on both backends

## Focus

Angle **deepseek-09** (W4): *Failure modes and kill criteria on both backends.* Maps to question H; answers angle questions 1 to 5. W4: all own iterations and the newest sibling file of each lineage were read first (Sibling check); the shared gate contract is quoted from BASE2 section 11.

## Sibling check

- `grok/iterations/iteration-010.md` (newest): its stop lines — a Deem judgment arm stops on a flip above 0.10 or a changed `deem-ctl status` commit pair; Jev arms stop when R1 prints `kill`. Adopted as grok's and extended with the per-failure lines below.
- `mimo/iterations/iteration-001.md` (newest): its counted context baseline is the denominator any survivor's saving must cite; quoted as mimo's, not re-derived.
- `swe/iterations/iteration-002.md` (newest): its sk-doc check map names the validators the advisory family must not touch; quoted as swe's.
- `glm/iterations/iteration-001.md` (newest): its D2/D3 rule ("a verdict against a parent decision is a proposed amendment, not a drop") applies to this iteration's failure table: nothing here amends D1-D3.
- Own iterations 1 to 8: every row below inherits the evidence named there.

## Findings

**F1 (new; answers angle question 1). The two-backend failure table: what prints and what persists, per survivor.**

| Survivor | Jev failure | Printed | Persisted |
|---|---|---|---|
| R1 census + `--jev` arm (002) | exit 3 (key rejected/missing) | `jev arm skipped: no credential` before any call; mid-run stop prints `jev arm stopped` and finished rows `partial` | the census JSONL rows; no default score |
| | exit 4 (retryable transport) | one backoff retry, then the row `unmeasured` | row status only |
| | malformed answer / exit 1 | row `unmeasured` | row status only |
| | wrong package first on PATH (npm `jevctl`) | `jev arm skipped: version` + found version/path | nothing |
| Deem form (any) | refused / timeout / cold start | `deem arm skipped: server not reachable` | nothing; no retry |
| | stub backend | `deem arm skipped: stub backend` | nothing |
| | wrong model id | `deem arm skipped: unexpected model <found>` | nothing |
| | 400 validation / 413 body | script call fails: row `unmeasured` | row status only |
| | 500 backend | row `unmeasured` (one retry allowed offline) | row status only |
| Precompute pass (008) | any of the above | nothing is written; the compaction path is untouched | no cache entry |
| Advisory sibling (003) | either backend absent | `advisory skipped: no classifier backend`, exit 0 | nothing |
| Hub move (007) | none (no backend) | `parent-skill-check` failure or legacy sentinel | routing state only |

The Jev rows quote BASE2 section 11 and the exit map of `jev_cli/__init__.py:90-108`, `:290-300`, `:425-443`; the Deem rows quote iterations 1 and 4 (F1-F6), 6 (F3) and 8 (F4). No row writes a default score or verdict. [SOURCE: BASE2 section 11; `jev_cli/__init__.py:90-108`, `:290-300`, `:425-443`; iterations 1, 4, 6, 8]

**F2 (new; answers angle question 2). The one failure that could change today's behavior is a live form firing without a backend; the proof is a dead-backend fixture asserting byte-identical output and zero writes.** Only the advisor live form (not shipped; excluded by `002/spec.md:92`) and the precompute pass (must write nothing on a failed probe) execute inside a user-visible path. The test per form: run with `JS` PATH scrubbed of `jev`, Deem port closed and a stub server returning `stub`, and assert (a) the form's stdout equals the no-form output byte for byte, (b) no state/file mtime changes, (c) exit 0. That fixture is the same one iteration 1 F11 specified, extended with the write check; it is cheap and needs no weights. [SOURCE: `../002-advisor-jev-tiebreak-arm/spec.md:92`; iteration 1 F11; iteration 8 F3]

**F3 (new; answers angle question 3). Frozen contracts each survivor touches, with owners and callers.** R1: the advisor's stdout `{}` contract and the 2,500/2,200 budget (owner `system-skill-advisor` + `system-spec-kit` shim; callers `.claude/settings.json:109` and the Pi mirror) — iteration 5 F1; a live form amends `002/spec.md:92`, not the constants. Precompute: `compact-inject`'s deadline/state contract (owner `system-spec-kit`) — iteration 4 F2; the pass writes hook state only. Advisory: `check-goal.cjs`'s exports and exit codes stay untouched (owner `sk-doc`; BASE2 row 61 routes to a sibling script). Hub move: `compiled-route-guard`/`compiled-routing-flag` literals and the dispatch shape table (owners `bin`/`system-skill-advisor`/dispatch) — iteration 7 F2. No survivor edits a vendored file. [SOURCE: iteration 5 F1; iteration 4 F2; BASE2 row 61; iteration 7 F2]

**F4 (new; answers angle question 4). Kill criterion per survivor, as a printed line.**

| Survivor | Kill line | Measured, not estimated |
|---|---|---|
| R1 arm | `verdict: kill` (sign test favors the scorer); `baseline mismatch: comparison void` | yes — its own JSONL |
| Advisor live form | `kill: latency` (connect+call p95 > remaining budget), `kill: cold <n>%` | yes |
| Precompute pass | `kill: stale cache` (unused more often than used), `kill: cold <n>%` | yes — pass log |
| Criterion-quality advisory | `kill: accuracy` (below the pre-registered precision floor) | yes — held-out labels |
| Deem as a backend | `deem arm skipped: ...` on every call for a whole run, or the `deem-ctl` commit pair changes between measurements | yes — health + status |
| Hub move | `parent-skill-check: failed` or a legacy-sentinel stage replay | yes |

Deem's own kill lines are grok-010's (flip above 0.10; commit-pair change) plus the accuracy floor; the hub's are iteration 7 F5's checks. [SOURCE: iteration 4 N-deepseek-04-1; iteration 8 F5; iteration 7 F5; `grok/iterations/iteration-010.md`; iteration 6 F3]

**F5 (new; answers angle question 5). When the two backends disagree on the same judgment, nothing averages and nothing fails over.** Rule: a feature runs the backend it prefers (iteration 1 F10: Deem for payload-bearing/cheap judgments, Jev for typed/gold-calibrated ones); if both are run deliberately (a comparison), each answer is kept with its backend and commit/provider recorded (iteration 2 N-deepseek-02-3), and the disagreement count is a data row in the comparison design (mimo-03), never a trigger to switch. Mid-run failover is forbidden because it would silently change the judging model under one result row — the same class of error as a default score. With neither backend, the form prints its skip line and behaves exactly as today. [SOURCE: iteration 1 F10; iteration 2 N-deepseek-02-3; iteration 6 N-deepseek-06-2; BASE2 section 11]

**F6 (new; a restated bound). No survivor in this lineage is build-now on judgment quality.** Every model-bearing recommendation is `next` or `later` pending a counted census and a labeled accuracy set; the build-now items are zero-call or structural (the AC_COVERAGE existence check, the hub move, the gate text, the failure table). This matches grok-010's one-phase conclusion and glm-001's Q1 reading, quoted, not contested. [SOURCE: `grok/iterations/iteration-010.md`; `glm/iterations/iteration-001.md`; iterations 3, 5, 7, 8]

## Per-Idea Records

### N-deepseek-09-1: The two-backend failure table as phase text

- **Idea:** Freeze F1's table and F5's disagreement rule into 002/003/005/006 so every arm handles both backends identically and none writes a default.
- **Question:** H.
- **Builds on:** F1-F5; BASE2 section 11 (Jev half, extended).
- **Value:** The operator reads one failure vocabulary; the synthesis can rank phases on it.
- **Seam:** The four phase specs' requirement sections; no code.
- **Metric, baseline, harness:** Metric: a dead-backend run changes no byte and no mtime (F2's fixture); baseline: today's behavior has no arms.
- **Savings:** None directly; it prevents wrong-model runs and hidden defaults.
- **Cost, latency, privacy:** None.
- **Two-backend gate:** This is its failure half.
- **Rough LOC:** 0 (text).
- **Verdict:** **build-now as phase text.**
- **Confidence:** Confirmed from the cited code and recorded probes.

### N-deepseek-09-2: The no-behavior-change fixture

- **Idea:** Ship F2's test with the first form that touches a live path: paths without `jev`, port closed, stub server; assert byte-identical output, zero writes, exit 0.
- **Question:** H.
- **Builds on:** F2; iteration 1 F11.
- **Value:** Makes "with neither backend, exactly today" a checkable fact rather than a sentence.
- **Seam:** The first arm's test directory; fixtures are local stubs.
- **Metric, baseline, harness:** The fixture itself; no weights, no network.
- **Savings:** None; it bounds risk.
- **Cost, latency, privacy:** Milliseconds; loopback.
- **Two-backend gate:** The fixture is the gate's proof.
- **Rough LOC:** 60-100.
- **Verdict:** **build-now with the first live-path form.**
- **Confidence:** Confirmed from the failure table.

### Dropped: automatic failover between backends

- **Idea:** When one backend is unavailable or disagrees, silently use the other.
- **Reason:** F5: it changes the judging model under a result row and hides disagreement; each form prints its skip line instead. Dropped.
- **Confidence:** Confirmed from the no-default rule.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| The combined two-backend failure table per survivor | **new** (BASE2 has the Jev half only) | F1 |
| The no-behavior-change test extended with a zero-writes assertion | new | F2 |
| Frozen contracts and owners per survivor | new (iteration 5/7 lines) | F3 |
| Four printed kill lines plus Deem's own | new | F4 |
| Backend disagreement: no average, no failover | new (rule) | F5; BASE2 §11 |
| Every model-bearing survivor is next/later | restates with new evidence | F6 |
| Jev gate and skip lines | restated | BASE2 section 11 |

## Hand-off

- deepseek-10: N-deepseek-09-1 is the text every phase amendment carries; N-deepseek-09-2 ships with 002's first arm.
- Synthesis: F1 and F4 are the lineage's answer to question H's failure and kill half; the disagreement rule belongs in the answer-shape section.
