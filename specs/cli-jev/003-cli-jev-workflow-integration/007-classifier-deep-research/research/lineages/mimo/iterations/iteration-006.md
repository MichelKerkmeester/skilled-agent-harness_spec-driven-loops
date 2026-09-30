# Iteration 006 — mimo-06: sk-design measured: routing accuracy, rubric labor and usage

- **Angle:** mimo-06 (W2, maps to F)
- **Lens:** UX and measurement. Never invent a routing number (grok-06's rule, adopted).
- **Read first:** `steer.md` unchanged. `LOCAL` unchanged. BASE2 row 52 discipline holds (no
  dollar figures).
- **Sibling check (W2 contract):** newest of each other lineage re-listed this iteration:
  `grok/iterations/iteration-010.md` (10), `deepseek/iterations/iteration-010.md` (10) — both
  read in iteration 4 and unchanged; `glm/iterations/iteration-005.md` (5, read in iteration 5);
  `swe/iterations/` newest re-listed at iteration 5's check. Named target read this iteration:
  `grok/iterations/iteration-006.md` (grok-06, the question-F angle). glm-05 rows 84-85 read in
  iteration 5.

## Finding 1 — usage per sk-design mode (Q1)

Name-mention counts over 93 main-session + 1,004 subagent transcript files in the ALL-7 window
(`count-skill-usage.py` family; this count was a numbers-only pass with the same cut-off):

| Name | Mentions (40 days) | `/design` command records |
|---|---|---|
| `sk-design-diagram` | 8,785 | 1,131 user records total for `/design` (`results-mimo-05-06-usage.txt:7`, `:16`) |
| `sk-design-chart` | 7,039 | as above |
| `sk-design-md-generator` | 4,012 | as above |
| `sk-design-fundamentals` | 884 | as above |
| `rubric` | 1,880 | — |

**Same honest bound as mimo-05:** this corpus contains the building of the sk-design track, so
mentions are dominated by development discussion. Per-mode run counts are UNKNOWN; the absolute
upper bounds are the mention counts. The relative signal is real though: diagram and chart
dominate the operator's attention, fundamentals is the quiet default. Confirmed by count.

## Finding 2 — the routing accuracy the benchmark records (Q2)

**None is archived.** My own reads this iteration: `sk-design/benchmark/reports/` is an empty
directory (my `ls`), and `sk-design/benchmark/README.md:1-21` says the retired Lane C harness
never archived a hub-level run and the tree holds "the dual reports each run wrote" — of which
zero exist. So the routing accuracy baseline is **not UNKNOWN-but-estimated; it is
not-archived-and-never-run**, with date: absent. Scenario counts are the harness size, counted
by me this iteration and matching grok-06: hub 4, fundamentals 12, diagram 10, chart 9,
md-generator 18 = **53 scenario files**.

The router itself is a keyword scorer: `hub-router.json:3-23` (default `sk-design-fundamentals`,
ambiguity delta 1, outcomes single/orderedBundle/defer/none — my read) and
`sk-design-fundamentals/SKILL.md:197-203` scores intents by keyword weight (grok-06's read). The
closed label set exists in code (`ROUTER.md:32-42`: five intents across four modes, grok-06's
read).

## Finding 3 — rubric labor per run (Q3)

UNKNOWN as a count. The rubric lives in `sk-design-fundamentals/SKILL.md:175` and `:211`
(swe-05's anchors, not reopened) and the review checklist requires file, line, criterion and fix
per finding (`references/review-checklist.md:17`, `:25` — grok-06's read). What the transcripts
can say: `rubric` appears in 1,880 message strings (Finding 1) and each turn costs p50 97,798 ms
(`results-mimo-04.txt:8`). A rubric pass is at least one full read-and-score cycle per reviewed
item; per-run turns are not separable from the corpus. The method that would measure it: mark one
week of `/design` runs and count turns per run (same method as N-mimo-05-1).

## Finding 4 — what a classifier would change for the operator (Q4)

For routing: nothing the operator can see that the keyword scorer does not already do — the
scorer returns the intent without a call, no guide is loaded to make the pick (grok-06's
argument; my count adds that diagram/chart usage dominates while the default is fundamentals,
so a misrouting tax is concentrated on the two busy modes). For rubric scoring: a classifier
could pre-flag findings, but the checklist's output shape (file, line, criterion, fix —
`review-checklist.md:17`, grok-06's read) cannot come from a `choice`; the operator would still
read the same rows. Default for any such flag: **off**, and on this evidence not built.

## Finding 5 — usage or gold enough to rank above later? (Q5)

- Gold: zero archived runs, 53 procedure-check scenarios (not labeled picks — the same shape
  problem as mimo-05's playbook files). A routing-accuracy gold would need the 53 scenarios
  labeled with intended mode (53 labels, ~2 h at mimo-02's rate — estimate) and a misroute count.
- Usage: bounded above by the mention counts; real runs UNKNOWN.
- **Verdict: the routing classifier is a drop** (N-grok-06-1, glm-05:84 — the determinism-wins
  pattern's fourth instance; agreed, with my empty-reports read and usage counts as the
  measurement evidence). **The rubric-scoring classifier is later than later** — its output shape
  is wrong, its labor is unmeasured and its usage is a bound. What ranks NOW is measurement:
  the zero-call replay in N-mimo-06-1 below.

## Per-idea records

### N-mimo-06-1 — keyword-router replay over the 53 scenarios (zero-call measurement)

| Field | Content |
|---|---|
| **Idea** | `N-mimo-06-1`: run the 53 playbook scenarios through the existing keyword scorer and print the misroute count — the routing accuracy baseline the benchmark never archived. Type: none (deterministic replay) |
| **Question** | F, H |
| **Builds on** | new; grok-06's "a hub run would confirm that, and none is archived" |
| **Value** | The operator finally reads a routing accuracy number, and every sk-design classifier verdict stops resting on hope |
| **Seam** | `hub-router.json:3-23` + the scorer at `sk-design-fundamentals/SKILL.md:197-203`; the replay is a new script beside `benchmark/` |
| **Metric, baseline, harness** | misroute rate over 53 labeled-by-scenario-dir intents; baseline: none archived (my `ls` of `benchmark/reports/`); harness = the replay script + the 53 files |
| **Savings** | none directly; it prices every question-F idea |
| **Cost, latency, privacy** | zero model calls, zero egress, seconds to run |
| **Two-backend gate** | none needed |
| **Rough LOC** | ~60-100 |
| **Verdict** | **build-now** — the smallest measurement slice in question F, and it is the harness every later F verdict needs |
| **Confidence** | counts and the empty reports dir confirmed; "53 scenarios cover real intents" is inferred — the replay's output confirms |

### N-grok-06-1 — model choice over the five intents (assessed)

| Field | Content |
|---|---|
| **Idea** | grok-06's refused `choice` over VALUES/REVIEW/CHART/FLOWCHART/EXTRACT |
| **Question** | F |
| **Builds on** | N-grok-06-1 (grok-06) |
| **Value** | none measured: the keyword scorer already answers without a call |
| **Seam** | `hub-router.json:13-18` (my read) |
| **Metric, baseline, harness** | misroute rate; baseline none (empty reports dir, my read); harness = N-mimo-06-1's replay first |
| **Savings** | none: the pick loads no guide |
| **Cost, latency, privacy** | a call per request to answer a settled question; payload egress on Jev |
| **Two-backend gate** | no switch (drop) |
| **Rough LOC** | 0 |
| **Verdict** | **drop** (agreed with grok-06 and glm-05:84; reopens only if the replay prints a misroute rate worth fixing) |
| **Confidence** | confirmed scorer shape; the kill/reopen line is the replay's number |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| `benchmark/reports/` is empty: no hub routing run ever archived, not even a stale one | new (my read) | my `ls` |
| 53 scenario files (4/12/10/9/18) counted by me, matching grok-06 | confirms grok-06 with new evidence | my `find` |
| Per-mode mention counts: diagram 8,785, chart 7,039, md-generator 4,012, fundamentals 884 | new | this file, Finding 1 |
| Rubric labor per run is uncounted; the measurement is a marked week | new (negative knowledge) | Finding 3 |
| The zero-call replay is the F question's first build-now slice | new | N-mimo-06-1 |

## Hand-off

- mimo-07 (W3) picks one measured workflow; N-mimo-06-1's replay and N-mimo-05-1's tally are the
  two candidate measurement-first workflows with real harnesses.
- mimo-09/10 must carry the two zero-call build-now slices (this replay and mimo-04's ledger)
  before any judged feature in the order.
- Synthesis: question F's classifier verdicts are drop/later; its measurement verdict is
  build-now.
