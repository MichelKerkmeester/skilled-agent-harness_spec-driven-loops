# Iteration 005 — mimo-05: sk-prompt measured: usage, cost and gold

- **Angle:** mimo-05 (W2, maps to E)
- **Lens:** UX and measurement. The refinement binds: start from BASE2 rows 63 and 52, new
  ground is invocations per week and the context cost per run.
- **Read first:** `steer.md` unchanged. `LOCAL` re-read (unchanged). BASE2 row 52 (this
  iteration's read, `research.md:802`): **no dollar figure appears anywhere in this iteration** —
  every price is a vendor claim; savings are tokens, passes and minutes only. BASE2 row 63
  (`research.md:813`): Jev is dropped inside `/prompt:improve` because the command has no labels.
- **Sibling check (W2 contract):** newest of each other lineage: `grok/iterations/iteration-010.md`
  (10, read in iteration 4), `deepseek/iterations/iteration-010.md` (10, read in iteration 4),
  `glm/iterations/iteration-005.md` (5, NEW — read this iteration), `swe/iterations/iteration-008.md`
  (8, new since iteration 4; its angle is the two-backend probe, not sk-prompt — recorded as read
  at listing level, content not reopened here because nothing in it bears on question E; if the
  synthesis needs its probe contract it reads it directly). Named target read: `grok-005` (below).

## Finding 1 — how often the operator runs sk-prompt (Q1)

Counted by `count-skill-usage.py` over 93 main-session and 1,004 subagent transcript files in the
ALL-7 window (output `results-mimo-05-06-usage.txt`, cited `u`), command names only:

| Signal | main | subagent | Meaning |
|---|---|---|---|
| `/prompt:improve` in user records | 42 records / 56 mentions (`u:3`) | 86 / 144 (`u:12`) | upper bound on invocations |
| `/prompt:improve` in Bash commands | 14 (`u:3`) | 5 (`u:12`) | mostly discussion commands |
| `prompt-improver` mentions | 757 in 350 records (`u:5`) | 685 in 313 (`u:14`) | agent-name mentions |
| `sk-prompt` mentions | 5,378 in 1,494 records (`u:6`) | 5,197 in 1,070 (`u:15`) | dominated by building the skill |
| Skill-tool invocations naming the family | 2 (`u:3-6`) | 0 (`u:12-15`) | direct launches |
| `TEXT_ENHANCE` mentions | 30 in 6 records (`u:9`) | 110 in 17 (`u:18`) | the routing mode in question |

**The honest number is a bound, not a count.** `/prompt:improve` appears in 128 user records
(200 mentions) over 40 days ≈ **22 records/week upper bound**, and this corpus contains the
development of the sk-prompt track itself, where every mention is build discussion, not a run.
Direct launches through the Skill tool: 2 in 40 days (`u:6`). Confirmed by count; "which records
are runs" is UNKNOWN — the confirmation is a one-day marked run log.

## Finding 2 — what a run costs the main AI (Q2)

From the transcripts (counts, method stated):

- **Context:** a sk-prompt run at minimum loads `SKILL.md` (23,081 B) plus
  `patterns-evaluation.md` (36,580 B) = 59,661 B ≈ 15K tokens (4 B/token, marked) — my own
  `wc -c` this iteration, matching grok-05's counts. That is ~3.9% of the p50 384,219 carry
  (`results-mimo-01-recount.txt:10`).
- **Passes:** the run is a multi-turn procedure (framework pick then rewrite then CLEAR).
  Per-run turn counts are not separable from this corpus (Finding 1's conflation); at the
  measured p50 97,798 ms per turn (`results-mimo-04.txt:8`) each turn the run costs is ~98 s of
  AI time.
- **The cost per week:** upper bound 22 runs × 15K tokens ≈ 330K tokens/week of skill loads
  (estimate on a bound). The corpus cannot do better.

## Finding 3 — which step a classifier takes over (Q3)

Read grok-05 in full and glm-05 rows 82-83. Both drop a classifier here: the framework pick is a
printed 7-row matrix (`SKILL.md:309-315`, grok-05's read) and CLEAR is a 50-point weighted sum,
not a label set (`SKILL.md:321`, grok-05's read). My counts now add the usage side, and I agree,
with my own evidence:

- **The registry is 5 ids** (`framework-registry.json` holds exactly `rcaf`, `race`, `cidi`,
  `tidd-ec`, `costar` — my own read this iteration) while the prose teaches 7 (grok-05's count).
  A classifier over 7 labels cannot render 2 of them; a classifier over 5 contradicts the prose.
- **The prize is 59,661 B per qualifying run** (my `wc -c`), collected at zero cost by glm-05's
  docs fix ("read only the selected section", glm-05 row 82). At the ≤22 runs/week upper bound
  that is ≤330K tokens/week — and the docs fix collects the same bytes with no model, no labels
  and no registry mismatch.
- **What the operator still reads** after either fix: the selected framework's section and their
  own prompt. A classifier changes which file is opened; it does not change what must be read.

## Finding 4 — what gold exists (Q4)

My own check this iteration: `find .skilled/skills/sk-prompt -name "*label*" -o -name "*gold*"`
returns **zero files**; `benchmark/reports/` holds one router-mode run and a compiled-routing
folder (file routing, not framework picks — grok-05 warned against exactly this conflation);
`.skilled/commands/prompt/` holds `improve.md` (the command) and assets. Row 63's "has no labels"
is confirmed by absence. grok-05 adds: 4 CLEAR + 4 framework-selection playbook scenario files
are procedure checks, not labeled picks (their read).

**Labels a precision estimate would need:** for a 5-way pick plus `none`, roughly 20-30 labeled
requests per class ≈ **120-150 labels** (my mimo-03 sizing arithmetic adapted: a 5-class pick
needs per-class support, not 50/50 splits). At the mimo-02 labor estimate (~2 min/label) that is
**4-5 hours of operator labeling** before any precision number exists (estimate).

## Finding 5 — does the saving rank above later? (Q5, arithmetic)

Saving ceiling: ≤330K tokens/week (Finding 2, on the invocation bound) or the same bytes via a
docs change at zero cost. Cost to get there: 120-150 labels (4-5 h), a registry reconciliation
(7→5 or 5→7 — grok-05's precondition), and a gated classifier with its two-backend switch.
Against the other seams priced in iteration 4 (skill-load replay 6.3 MB/week counted; compaction
arm 51 recovery passes/week counted), **sk-prompt's ceiling is smaller than a seam already
ranked below the top two, and its cheaper fix is a one-line docs change.** Verdict arithmetic:
labels 4-5 h + build ~100 LOC to save ≤330K tokens/week that a docs line saves free → **later**,
matching grok-05 and glm-05:82-83. This is cross-read agreement; the usage bound and the wc are
my counts.

## Per-idea records

### N-mimo-05-1 — the sk-prompt usage and cost census (zero-call)

| Field | Content |
|---|---|
| **Idea** | `N-mimo-05-1`: a marked one-week run log for sk-prompt and `/prompt:improve` that turns this bound into a count. Type: `noul` (is this record a run?) — or zero-call if the operator self-logs |
| **Question** | E, H |
| **Builds on** | this iteration's bound (128 records/week upper limit... 128 records/40d) |
| **Value** | Every later sk-prompt verdict stops resting on a bound |
| **Seam** | none in code: a log line beside `/prompt:improve` in `improve.md`'s flow |
| **Metric, baseline, harness** | runs/week; baseline UNKNOWN bounded by 22 records/week (`u:3`, `u:12`); harness = `count-skill-usage.py` re-run over a marked week |
| **Savings** | none itself; it prices Finding 5's ceiling |
| **Cost, latency, privacy** | zero calls; the log stores names and counts |
| **Two-backend gate** | none needed |
| **Rough LOC** | ~10-20 (a log line) or 0 (operator tally) |
| **Verdict** | **next** — one week of tally before any sk-prompt build decision; everything else here is `later`/`drop` |
| **Confidence** | bounds confirmed; the run share is UNKNOWN with the named method |

### N-grok-05-1 — framework-pick choice (assessed here with my pricing)

| Field | Content |
|---|---|
| **Idea** | grok-05's offline `choice` over the five registry ids + `none`; type `choice` |
| **Question** | E |
| **Builds on** | N-grok-05-1 (grok-05); priced here |
| **Value** | ≤330K tokens/week of skippable library loads (upper bound) |
| **Seam** | `SK/assets/framework-registry.json:5-54` (grok-05's read; my read confirms 5 ids) |
| **Metric, baseline, harness** | pick agreement with operator labels; baseline: zero labels exist (my `find` this iteration) |
| **Savings** | ≤59,661 B per qualifying run; ≤330K tokens/week ceiling (bound) |
| **Cost, latency, privacy** | one `choice`, Deem ~60 ms local; the user's prompt is the payload — Deem-preferred (grok-05's gate, adopted) |
| **Two-backend gate** | as grok-05 wrote it: own switch, default off; neither → library loads as today |
| **Rough LOC** | grok-05's census script, unsized |
| **Verdict** | **later** (agreed with grok-05 and glm-05:82; my usage bound is the new evidence) |
| **Confidence** | counts confirmed; the run share UNKNOWN |

## New against baseline

| Claim | Status | Evidence |
|---|---|---|
| sk-prompt usage is bounded at ≤22 `/prompt:improve` records/week with 2 direct Skill launches in 40 days | new | `u:3`, `u:6`, `u:12` |
| A sk-prompt run loads 59,661 B of skill text ≈ 3.9% of the p50 carry | new (my `wc -c`) | this file, Finding 2 |
| Zero gold files exist under sk-prompt; benchmark reports are file-routing, not picks | new (confirms row 63 by absence) | my `find`/`ls`, BASE2 `research.md:813` |
| 120-150 labels (4-5 h) needed for any precision figure | new (sizing) | Finding 4 |
| The registry holds 5 ids while prose teaches 7 | confirms grok-05 with new evidence | my read of `framework-registry.json` |
| No dollar figure is asserted anywhere in this iteration | confirms BASE2 row 52 discipline | BASE2 `research.md:802` |

## Hand-off

- mimo-06 uses the same harness output (`u:7-8`, `u:16-17` for `/design` and `sk-design` counts)
  and must separate build-discussion from runs the same honest way.
- mimo-07 may use Finding 1's method (names-only counting) for operator-facing usage.
- Synthesis: sk-prompt is `later` on a bound, `drop` for CLEAR (glm-05:83), and the docs fix is
  the zero-cost alternative to N-grok-05-1.
