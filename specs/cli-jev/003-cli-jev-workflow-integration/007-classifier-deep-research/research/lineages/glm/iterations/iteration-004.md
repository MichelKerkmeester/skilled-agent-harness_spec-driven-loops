# Iteration 004 — glm-04: Against validator, sk-prompt and sk-design classifiers

- **Lineage:** `glm` · session `fanout-glm-1790490452777-942a1f` · 2026-09-27
- **Wave:** W3 (new skills/workflows with measured value) · **Maps to:** D, E, F · **Timestamp (research):** 2026-09-27T07:09:40Z

## Focus

Angle `glm-04` (research-angles.md:644-654): which D/E/F proposals replace a repository fact or validator verdict with a judgment; which produce a report nobody reads; which lack gold and cannot be measured before building; which are better solved by a docs/template fix; the ONE that survives, with its kill. **The W3 rule binds: every proposal carries a metric, a counted baseline and a harness, or it is recorded as unmeasured.**

## STEER

Still no `steer.md` in this lineage (verified this iteration). Refinement (research-angles.md:898) — the named targets not landed: **swe-05, swe-06, mimo-05** (swe is at 4, mimo at 2). For those, the newest landed files on their questions are grok-005 (E) and grok-006 (F) — critiqued/pushed below — plus BASE2 row 63 (not re-opened by me; their :5-9 carry it) and Planned 002/003/005/006 (hub-mentions = 0, it.2 F2, unchanged; none owns a D/E/F phase).

## Sibling check

- `grok/iterations/iteration-005.md` (the E owner, their refinement: "make the label-set count the first finding") — their label-set table: prose "7" at `SK/SKILL.md:3` and `:12`; the 7-name use-case at `:38` (RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, CRAFT); the selection matrix's 7 at `:309-315`; the router comment's 7 at `:70`; the library's 7 (`references/patterns-evaluation.md:3, :28`); **the machine registry: 5** — `rcaf, race, cidi, tidd-ec, costar` at `SK/assets/framework-registry.json:5-54`, "no `crispe` and no `craft`. Those two names exist only in the prose" (their :27). Their verdict: "A choice whose options are the matrix at `SKILL.md:309-315` can return `CRISPE` or `CRAFT`, and the registry then has no template to render… A choice over the five registry ids, plus `none`, is a closed set with a template for every non-none label. It would let a script load one registry template instead of the 36,580-byte library." Their counts: patterns file **36,580 B**, skill file **23,081 B** ("Both counts are `wc -c`" — theirs, quoted; not re-opened by me). Their honesty note: the 8 playbook files (4 CLEAR + 4 framework-selection) "are procedure checks. They are not labeled picks and not a routing-accuracy number. No hub-level selection accuracy is stated here." And: "CLEAR is a 50-point sum of five dimensions (`SK/SKILL.md:321`), threshold 40+. It is not a label set." Also theirs: the Deem 26-options cap (serve/README.md:92-94) "is not why this fails"; the `jevctl`-only `classify` (classify.md:3-17) vs the Python `jev-cli`'s `choice`+`none` (B2:402).
- `grok/iterations/iteration-006.md` (the F owner) — "No hub routing number": `D/benchmark/README.md:3, :26-27` — "no hub-level Lane C run was archived, and an empty tree is not a passing score"; `:33-41` indexes two MODE baselines (fundamentals, diagram) and "a mode baseline does not measure whether a request reaches the hub"; "This iteration does not open those mode trees and does not invent a hub score." Their counted: playbook scenario files 4 (D/) + 12 (fundamentals) + 10 (diagram) + 9 (chart) + more. Their thesis: "where the router is already that closed set in code" — the hub-router IS the closed label set.
- `mimo/iterations/iteration-002.md` (newest; their D-precision part) — their :95-97: the residue after every check passes: "structure and alignment have validators (`hvr_scan.py:15-21` says its mechanical subtotal is a floor…), **while correctness and traceability have no validator at all**"; their recurrence counts: correctness 320, traceability 337, template-alignment 38, voice 9, placeholders 8 (rollup, "noisy"); the live residue rate **62 post-pass edits/week** (Part 1); their Q3 arithmetic: at precision 0.8 → "~50 true flags and ~12 false flags per week… the classifier saves ~50 passes/week and costs ~12 wrong flags. Voice (9) and placeholders (8) do not recur enough to earn anything. Template alignment (38) is already mechanized… so a classifier there competes with a script, not with a reader." Their OWN mark: "the 'one flag = one saved pass' equation is an estimate; the confirmation is mimo-08's labeled-set run" (mimo-08: NOT LANDED). Their Q4: "**Labels exist today in review tables: severity (3 values) and dimension (4 canonical values…**" — the gold, found.
- `swe/iterations/iteration-002.md` (the D-inventory; read it.2) — their check map's residue column is the D-side question: "Whether the listed tools are the *least-authority* set — schema presence never judges the list's contents", "Whether `description` actually routes the command (trigger fit) — a length cap never reads meaning", "Whether the detected type is *right*", "Presence ≠ content: `## RULES` with wrong rules passes".
- `deepseek/iterations/iteration-010.md`, `grok/iterations/iteration-010.md`, `swe/iterations/iteration-004.md`, `mimo/iterations/iteration-002.md` — the current newest of each; nothing new for D/E/F beyond the above (deepseek-010 = the H-amendments; their 003 = the "advisory is not a gate" finding, quoted by grok-010).
- **My own eyes this iteration** (the W2/W3 agreement rule): `.skilled/skills/sk-prompt/SKILL.md:3` — "…via 7 frameworks, DEPTH thinking and CLEAR scoring" and `:38` — "RCAF, COSTAR, RACE, CIDI, TIDD-EC, CRISPE, or CRAFT frameworks with CLEAR scoring (40+/50 threshold)" — the 7-prose, confirmed. The registry-5: theirs (the file path was mistyed twice this session — recorded; the honesty cost: one number rests quoted, marked).

## Findings

### F1 — The checklist, D/E/F (answers questions 1-4)

| # | Proposal | Q1 metric+baseline+harness | Gold? | Report- nobody-reads? | Better as docs/template? | Verdict |
|---|---|---|---|---|---|---|
| 1 | **The D-residue flagger** (correctness + traceability, the post-pass judgment) | metric: precision@0.8 on the residue stream; baseline: 62/wk, 320+337 rows (mimo-002, counted); harness: the review tables' OWN labels + mimo-08's labeled-set run (the missing confirmation, theirs) | **YES — the only D/E/F gold**: severity (3) + dimension (4) sit in the review tables today (their :113) | only if built as a STANDALONE report — the design note: the flags must land IN the existing review table (F3) | NO: "correctness and traceability have no validator at all" (their :95-97) — nothing mechanical competes | **THE ONE THAT SURVIVES** |
| 2 | E-pick: a `choice` over the framework labels | metric: label-set round-trip; baseline: prose 7 (4 places) vs registry 5 (grok-005:18-27); harness: the 8 playbook files = procedure checks, NOT labeled picks (their :37-39) | NO — 0 labeled picks | — | **YES: the 7-vs-5 is a DOCS BUG** (two registry entries, or the prose drops two names) — and the pick itself is the printed matrix at :309-315: deterministic TODAY (it.3's replay-argument, third instance) | the pick: docs-fix + the matrix; no classifier |
| 3 | E-score: CLEAR (the 50-point, 5-dimension, 40+ judgment) | "It is not a label set" (their :36); the 4 CLEAR playbooks = procedure checks | NO — 0 | — | the 40+/50 threshold is the skill's OWN printed rule; a classifier would re-implement it without gold | later, behind a labeled-CLEAR set nobody has |
| 4 | F: sk-design mode routing | "no hub-level Lane C run was archived, and an empty tree is not a passing score" (their :20, quoting the benchmark README) — the mode baselines "do not measure whether a request reaches the hub" | NO — 0 (the playbook scenarios are manual, exactly the swe-05 refinement's caveat) | — | NO-NEEDED: "the router is already that closed set in code" (their :5) — the hub-router IS the deterministic picker; the 0.8B would replace working code with a 60 ms judgment + my it.1-2's provenance burden | **drop** (the router wins; the 35+ scenarios = the *later* replay-gold, IF anyone labels them) |
| 5 | F: rubric scoring (the design fundamentals' 175/211 anchors — swe-05's, not landed) | — | NO (no run archived; grok-006 did not open the mode trees — correctly) | — | — | **unmeasured** — recorded as such (the W3 rule), not verdicted |

### F2 — The counted prize nobody collects: the 59,661-byte library read (answers question 4, E; the iteration's headline)

grok-005's numbers, their :33-34: patterns-evaluation.md 36,580 B + SKILL.md 23,081 B = **59,661 B ≈ ~15,000 tokens** (arithmetic on their counts, 4-B/token, marked) that the main AI reads to ENHANCE ONE PROMPT — while the pick that precedes it is the printed 7-row matrix (:309-315) and the payoff is ONE framework's template. Their own :31-32: "A choice over the five registry ids, plus `none`… would let a script load one registry template instead of the 36,580-byte library. It does not do that today." Their proposal gates it on a classifier; the cheaper fix needs none: **after the 7-vs-5 docs-fix, the skill's own instruction — read only the SELECTED framework's section — collects the prize with zero code.** The pick is deterministic; the read is therefore optional; the 59,661 B are the E-question's only counted prize, and a DOCS line collects it. **N-glm-04-1.** (grok-005 found the numbers and the possibility; it.4 collects it the cheapest way — the push-past.)

### F3 — The one that survives, its design constraints, and its printed kill (answers question 5)

**N-glm-04-2 — the correctness/traceability residue flagger**, riding the review tables' existing labels:

- **Metric:** precision@0.8 on the 62/week post-pass stream (mimo-002's arithmetic: ~50 true, ~12 false/week); the CONFIRMATION = the labeled-set run (mimo-08's, not landed — the harness that must exist before any build).
- **Baseline:** 62/week counted; 320+337 historical rows, already labeled (their :113) — the gold is not a yet-to-write set, it is the review corpus's own history.
- **The harness:** replay any scorer — the 0.8B, the 9B, Jev, a dumber heuristic — over the LABELED rows; precision prints per scorer. **This is the third instance of this lineage's pattern** (it.1: the 002 census's second scorer; it.2: the one-word that legalizes it; it.4: the D-labels' replay): the 0.8B's D-precision costs ONE replay, not one phase — measurable NOW, buildable only if it prints.
- **The report-nobody-reads guard (Q2):** the flags must land IN the existing review table (a column beside severity/dimension), or they are row-38-adjacent waste. A NEW report = the failure mode this question exists to catch.
- **The printed kill:** `precision < 0.8 on the labeled rows, or true-flags/week < the reader-cost of the 12 false ones — either prints, the flagger dies` (mimo-002's equation, now gated instead of assumed).
- **Two-backend gate:** its own switch; scorers compared head-to-head on the SAME labeled rows (Jev: keyed, 3 s-class, egress; Deem: the ALL-4+deepseek-01 health check + the readlink-provenance of it.2-F4; neither → the review table runs exactly as today, no column); malformed answer → the row unflagged, the review unaffected (BASE2 C5's semantics).
- **Rough LOC:** 0-20 (the review-table column + the scorer call) — the reviewers' workflow owns the seam, theirs-quoted; not opened by me, marked.

### F4 — What does NOT survive, and why that is the finding (questions 1-4, the negatives)

E-score and F-routing fail the W3 test **identically**: 0 gold, no archived run, "an empty tree is not a passing score" — they are UNMEASURABLE-BEFORE-BUILDING (Q3), which in this repository's own rules means they would be built on hope and *then* measured, the exact inversion of Q1/Q2 (digest :54-59). The cheaper fixes: E-pick = the docs+matrix (F2); F = none needed (the hub-router already IS the closed set — their :5, my it.3's replay-argument where the determinism shipped FIRST); the D-alignment category = already hvr_scan's (a classifier there "competes with a script, not with a reader" — their :109-111); voice/placeholders = under the threshold (9/8/week vs the 1%-of-carry test — it.3 F4's clause, different unit, same conclusion).

## Questions Answered

- **D/E/F1 (which replace a fact/verdict with a judgment):** legitimately, only the D-residue's correctness/traceability — the two categories with "no validator at all" (their :95-97). E-pick and F-routing replace DETERMINISTIC code (the printed matrix; the hub-router) — the classifier there is a regression dressed as intelligence. Alignment/voice/placeholders: the script/the threshold/already-mechanized.
- **D/E/F2 (report-nobody-reads / no-gold / better-as-docs):** gold — only D has it (the review tables), and it changes everything: the proposal is MEASURABLE-BEFORE-BUILDING; E/F are not, therefore they would be hope-first. The 7-vs-5 = a docs bug wearing a strategy costume. The report-guard: the D-flags must land in the review table, not beside it.

## Questions Remaining

- H1/H2: the round-3 drop list (from 73), the smallest program, the decline-first list (glm-05, next — the cap).
- D (residual): mimo-08's labeled-set run (not landed) — the precision-0.8 confirmation; its printout is the flagger's birth certificate, whoever runs it.

## Next Focus

`glm-05: What not to build, round 3` (W4, research-angles.md:756-768): read ALL FOUR of my iterations + the newest of every sibling (re-verify: swe-005+, mimo-003+, deepseek-011+ may have landed), then What-Not-To-Build in BASE1 (rows 1-43) and BASE2 (rows 44-72) — the drop list IN THE SYNTHESIS TABLE FORMAT, numbered from 73 (the refinement, research-angles.md:900): `| # | Idea | Reason | Checklist question or red flag | Evidence | Lineage(s) |`. Then: which baseline drops the flip set reopens WRONGLY; the smallest program that remains; its kill criterion; what the operator should decline FIRST. The refinement's other claw: the glm-all Q7/Q9/Q10/Q12 readings — final round.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence or restated | Evidence |
|---|---|---|
| The 59,661-byte E-prize is collected by a DOCS line (read only the selected section), not a classifier — the pick is the printed matrix, deterministic today | **new** (grok-005 found the numbers and proposed a gated `choice`; it.4 collects it the cheapest way — the third determinism-wins instance) | grok-005:29-34, :31-32; my own :3+38 read; their 36,580+23,081 (theirs, quoted) |
| The D-residue is the ONLY D/E/F proposal measurable-before-building, because the gold already exists — the review tables' severity+dimension labels | **new** (mimo-002:113 found the labels; it.4 frames the consequence: the 0.8B's D-precision = one replay, not one phase — the third pattern instance) | their :95-113; my it.1-2's gates |
| E-score and F-routing: 0 gold, 0 archived runs, unmeasurable-before-building → they are hope-first inversions of the checklist | **confirms grok-005/006 with the checklist framing** (their honesty, named as Q3 failures) | their :36-39; their :20-22 |
| F's hub-router already IS the closed label set — the 0.8B there = working code → 60 ms + provenance burden | **confirms with new evidence** (grok-006:5's thesis, joined, the it.1-2 burden named) | their :5, :20 |

## SCOPE VIOLATIONS

None. Reads only outside the lineage; writes: this file, `deltas/iter-004.jsonl`, the state record, and the lineage's reducer-owned state files.

## Hand-off

- **glm-05** (the cap): the drop list inherits FOUR through-lines, all printed: (1) the 0.8B's only roles are second-scorer-on-existing-gold (002's census; the D-review labels), never a pioneer; (2) determinism-wins-where-it-exists (the matrix, the hub-router, the stage-2 replay) — the model's graveyard is other people's shipped code; (3) the F2 cache/attention unit (it.3) governs every "savings" column; (4) provenance-or-quiet (it.1-2): anything that trusts the 0.8B inherits the readlink+status pair and the printed kill.
- The quoted-not-opened debt, carried to the synthesis's citation check: the registry's 5 (grok-005:26-27), the 36,580/23,081 (their :33-34), BASE2 row 63, 005's spec.md:60 (via swe-004), the survey of 005's harness internals (swe-004's, theirs) — each marked in its row above; one open each, none verdict-changing.
- The W3-unmeasured list (the synthesis must repeat it): F's rubric scoring (no run), F's hub accuracy (no archived run), mimo-08's labeled-set (not landed) — the flagger's birth certificate.
- If the lead's steer lands before the synthesis: the 7-vs-5's registry-5 is THIS LINEAGE's one quoted-not-opened number — thirty seconds of `jq` retires the debt; the verdict does not move.
