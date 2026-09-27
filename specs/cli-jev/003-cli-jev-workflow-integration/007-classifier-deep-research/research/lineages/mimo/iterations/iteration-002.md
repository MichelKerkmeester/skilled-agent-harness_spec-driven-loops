# Iteration 002 — mimo-02: The judgment calls an AI still makes after validators pass

- **Angle:** mimo-02 (W1, maps to D)
- **Lens:** UX and measurement. Counts first, categories second, judgment calls named.
- **Read first:** `steer.md` exists and was read before this research (it landed after
  iteration 1). It voids iteration 1's Q2-Q4 tool counts (dedupe-by-message defect) and refutes
  "hook-injected context is unmeasurable". The steering for iterations 2-3 was followed: the
  harness was rebuilt and re-run as `count-context-baseline2.py` into a new file
  `results-mimo-01-recount.txt`, and this iteration's review-corpus pattern is bounded up front
  below. `LOCAL` read again: served 0.8B p50 ~60 ms, uncalibrated, quality unmeasured
  (`context/deem-local.md:34-44`, `:27`, `:52`). No steer conflicts with angle mimo-02.
- **Sibling check:** Independent: no round-3 sibling file read.

## Part 0 — the recount the steer demanded (its claims re-counted here, not taken on authority)

Harness v2 `count-context-baseline2.py` counts tool_use blocks across ALL records deduped by
tool_use id (`count-context-baseline2.py:74-86`), walks `<session>/subagents/*.jsonl` and
reports it apart (`:186`), and buckets attachment bytes by `attachment.type` (`:62-69`).
Output: `results-mimo-01-recount.txt` (cited `r2`).

- **STEER's defects confirmed by my recount.** Main-session Read 1,984 (STEER said 1,986) and
  Bash 58,109 against the voided 342/12,172 (`r2:21`, `r2:18`); 1,003 subagent files exist under
  `<session>/subagents/` (`r2:83`). Iteration 1's Q2-Q4 numbers are retired.
- **Corrected Q2:** tool calls per human prompt (main sessions): p50 2, p95 40, max 292, sum
  60,130 over 6,677 prompts (`r2:44-46`); subagent prompts p50 32, p95 142, sum 54,932 over
  1,156 (`r2:109-111`).
- **Corrected Q4:** re-reads are 598 of 1,984 Reads (30.1%) in main sessions (`r2:57`) and 1,168
  of 6,937 (16.8%) in subagents (`r2:119`) — the file-relevance cap is far larger than the
  voided 8.5%.
- **Hook injection is a measured surface, refuting iteration 1.** `hook_additional_context`
  attachments: 12,152,899 bytes over 19,588 events in main sessions (`r2:65`) plus 2,290,457
  over 709 in subagents (`r2:128`) = 14.4 MB in 40 days ≈ 361 KB/day of context-injected hook
  output. `hook_success` attachments carry another 546.2 MB combined (`r2:60`, `r2:123`) — hook
  stdout of which the additional context is the context-carrying part.
- **Skill loads are mostly Bash, not Read** (STEER's third point, confirmed): Bash mentions of
  `SKILL.md` 3,175 (load-command subset 2,451), `references` 2,557 (2,017), `ROUTER.md` 369
  (237) in main sessions (`r2:79-81`); subagents 2,211/1,433, 1,855/1,292, 326/212
  (`r2:142-144`). Iteration 1's "ROUTER.md never read" is retired to "never Read via the Read
  tool (1 main + 5 subagent, `r2:52`, `r2:114`); loaded through Bash hundreds of times".
- Drifted-cite note: the results label `passing_runs_followed_by_md_edit_within_5_assistant_records`
  in `results-mimo-02.txt:8` understates its own code window, which is 6 assistant records
  (`count-validator-residue.py:76-85`).

## Part 1 — method (bounded patterns, stated up front)

- **Transcripts:** every Bash tool_use whose command matches
  `validate\.sh|check-goal\.cjs|hvr_scan\.py|validate_document|extract_structure`
  (`count-validator-residue.py:24`, `:76`); pass = the matching tool_result carries no error
  (`:97-103`); window = the next 6 assistant records in the same file (`:76-85`); an edit is a
  Write/Edit tool_use with a `.md` file_path (`:88-95`). Command names, pass flags and counts
  only.
- **Review corpus:** every `*.md` under `specs/` whose directory path contains `/review/` or
  `/ai-council/`, excluding `/context/` (vendored) and `/scratch/` (fixtures — BASE2 row 70
  showed scratch fixtures corrupting a count; mimo-02's row-38 sample must exclude them)
  (`count-validator-residue.py:118-131`). Rows are counted structurally: a table row whose
  second cell is a `P0`-`P2` severity (`:25`, `:133`), **not** a phrase walk (BASE2 row 50's
  dead end: 0 usable rows in 3,271 files under a phrase walk, BASE2 says `research.md:800`).

## Findings

### 1. Validator-pass-then-edit residue (Q1)

Counted over 93 main-session plus 1,003 subagent transcripts in the ALL-7 window
(`count-validator-residue.py:72-73`): **8,364 validator runs** (validate.sh 5,992, hvr_scan.py
1,139, other 1,099, check-goal.cjs 134) in 465 transcript files; **8,251 passed** (98.6%);
**354 passing runs were followed by a markdown edit within 6 assistant records**
(`results-mimo-02.txt:2-10`). Confirmed by count.

Method limits, stated: "the same file" is approximated by "any `.md` edit in the window" because
`validate.sh` validates a folder, not a file; and a passing run inside a subagent counts even
though the edit may serve a different parent task. Both approximations inflate, not deflate,
the 354.

**Rate:** 354 residue events per 40 days ≈ **8.9/day ≈ 62/week** (window from `r2:4`). This is
the first counted answer to "what does a pass still cost": the operator's AI re-opens documents
that just passed about 9 times a day.

### 2. Findings on documents that passed validation, by category (Q2)

The bounded corpus holds 5,830 review and ai-council markdown files and **2,075 findings rows
carrying a P0-P2 severity cell**: P0 69, P1 1,001, P2 1,005 (`results-mimo-02.txt:12-16`).
Confirms BASE2 R22's premise (R22: "about 50 labeled passages exist and an author names the
decision it would change", BASE2 `research.md:1012`) — the labels exist in far greater numbers
than 50, in review tables.

By dimension (structural cell, canonical vocabulary): **traceability 337, correctness 320,
maintainability 261, security 82** (`results-mimo-02.txt:17-20`). Those four are exactly 1,000
rows; the remaining 1,075 rows come from tables with other shapes where the second cell is a
severity but the third is a title, so the category rollup (`results-mimo-02.txt` tail:
scope 388, factual-drift 366, template-alignment 38, voice 9, placeholders 8) is **noisy and
marked inferred**; the fix is to match only the five-column canonical shape, which the harness
does not yet do (method stated at `count-validator-residue.py:25`).

Mapping to mimo-02's five categories from the reliable rows, inferred: factual drift ≈
correctness (320), scope ≈ traceability (337), template alignment and voice and placeholders
recur far less often in dimension vocabulary (rollup 38/9/8, noisy). This is the residue an AI
still judges after every template check passes: **structure and alignment have validators
(`hvr_scan.py:15-21` says its mechanical subtotal is a floor and structural and voice findings
"need a reader"), while correctness and traceability have no validator at all.**

### 3. Which categories earn a classifier at precision 0.8 (Q3, arithmetic)

Both top categories clear the bar on recurrence alone: correctness 320 and traceability 337
rows over the corpus lifetime, against a live residue rate of 62 post-pass edits per week
(Part 1). At precision 0.8, a flagger on that stream yields ~50 true flags and ~12 false flags
per week (0.8 × 62, 0.2 × 62). If each true flag replaces one reread pass — the pass the
operator's AI makes anyway in those 354 windows — the classifier saves ~50 passes/week and
costs ~12 wrong flags. Voice (9) and placeholders (8) do not recur enough to earn anything.
Template alignment (38) is already mechanized (`hvr_scan.py:1-21`), so a classifier there
competes with a script, not with a reader. Marked: the "one flag = one saved pass" equation is
an estimate; the confirmation is mimo-08's labeled-set run.

### 4. Labels today, labels to write (Q4)

Labels exist today in review tables: severity (3 values) and dimension (4 canonical values,
`results-mimo-02.txt:17-20`) — i.e. **the operator already writes category labels on findings;
what is missing is labels on passing documents** ("passed and still needed a reread" has no
label anywhere). A precision estimate on that question needs new labels drawn from the 354
residue events and matched controls: BASE2 R22's bar is "about 50 labeled passages" (BASE2
`research.md:1012`); at 50 positives + 50 negatives the operator writes 100 labels. At, say, 2
minutes each that is about 3.5 hours (estimate; mimo-08 designs the real draw).

### 5. What the operator sees today (Q5)

A green validator output and nothing else: the 354 residue edits leave no trace in any surface
counted here (no record type marks "edited after pass"). The author's judgment is invisible
until a review finds it (2,075 rows) or the AI re-reads. Confirmed by absence: no transcript
record type among the 21 counted (`r2:5-6` area, `results-mimo-01.txt:9`) marks it.

## Per-idea record

### N-mimo-02-1 — validator-residue flagger ("this doc passed but looks like it needs a reread")

| Field | Content |
|---|---|
| **Idea** | `N-mimo-02-1`: a classifier reads a just-passed document and flags residual judgment calls. Type: `choice` (needs-reread / clean) |
| **Question** | D |
| **Builds on** | BASE2 R22 (about 50 labeled passages) and row 70's lesson; new counted rate |
| **Value** | The author sees "passed but flagged" at validation time instead of at review time; for whom: every author running `validate.sh` (5,992 runs/40 days, `results-mimo-02.txt:3`) |
| **Seam** | The validator pass output path; in-repo hook seam is the PostToolUse block at `.claude/settings.json:41` and the Stop hooks at the Stop block; validators run under `validate.sh` (5,992 runs counted) |
| **Metric, baseline, harness** | Post-pass residue events per week; baseline 62 (354/40 days, `results-mimo-02.txt:8`); harness = `count-validator-residue.py` re-run per feature |
| **Savings** | ~50 passes/week at precision 0.8 (estimate, Part 3); each is one AI reread pass ≈ 1 turn |
| **Cost, latency, privacy** | One `choice` per passed document, deadline: validator command timeout is not hook-bound (runs in Bash), so even Jev fits; Deem ~60 ms local (`deem-local.md:36-38`); Jev sends the document off the machine — for drafts that is the privacy question |
| **Two-backend gate** | Own switch `classifier.validatorResidue`. Jev: `command -v jev` + `jev 0.6.2` + `jev auth status --provider <p>` exit 0. Deem: `GET /health` parsing `backend`, refusing `stub` (ALL-4). Prefer Deem: draft text should not leave the machine. With neither: exactly today's green output |
| **Rough LOC** | ~100-150: one command wrapper plus flag rendering |
| **Verdict** | **next** — the residue rate is counted and large (62/week), the labels partially exist, and the missing precision figure is one mimo-08 labeled set away |
| **Confidence** | Counts confirmed; the pass-saved equation and precision 0.8 are inferred — mimo-08's set confirms them |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| 8,364 validator runs, 8,251 passing, 354 followed by a .md edit in 6 records (62/week) | new | `results-mimo-02.txt:2-10` |
| 2,075 severity-bearing findings rows in 5,830 bounded review files: P0 69 / P1 1,001 / P2 1,005 | new | `results-mimo-02.txt:12-16` |
| Canonical dimensions: traceability 337, correctness 320, maintainability 261, security 82 | new | `results-mimo-02.txt:17-20` |
| Severity and dimension labels exist; "passed-and-needed-reread" has no label | new | `results-mimo-02.txt:12-20` |
| Hook injection is a recorded surface: 14.4 MB `hook_additional_context` in 40 days | new (refutes my iteration 1) | `r2:65`, `r2:128` |
| Re-read share is 30.1% main / 16.8% subagent, not 8.5% | new (corrects my iteration 1) | `r2:57`, `r2:119` |
| Phrase walks undercount; structural severity-row counting finds 2,075 rows | confirms BASE2 row 50's dead end with new evidence | BASE2 `research.md:800` |
| R22's "about 50 labels" understates existing severity labels but its bar holds for the missing label | confirms BASE2 R22 with new evidence | BASE2 `research.md:1012` |

## Hand-off

- mimo-03: reuse the window method; its comparison design needs the label count arithmetic
  (100 labels ≈ 3.5 h) as the calibration-cost input.
- Tighten part 2 to the five-column canonical row shape and rerun before any category number
  reaches mimo-04 savings.
- Extend the tool-output bucketing the steer asked for (bytes per Read path class) before
  mimo-04 prices skill loads.
- mimo-08 must design the drawn sample from the 354 residue events, excluding /scratch/
  fixtures (BASE2 row 70).
- Keep carrying the Q1 baseline (p50 384,219 / p95 887,519, `r2:15`).
