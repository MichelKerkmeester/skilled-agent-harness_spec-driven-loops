# Iteration 10: Final — the price list for the per-turn carrier, and the delivered ranking

## Focus

Final iteration of a ten-iteration run whose five tracked questions are answered. The remaining
obligation is the topic's own deliverable: **rank the five candidate mechanisms and recommend one,
with the smallest set of changes to existing files.** Nine iterations compiled an edit set and
measured it to the byte; this iteration does the one thing none of them did — it asks what the
per-turn carrier *costs something else* when it is written, rather than what it costs in bytes.

The narrow question: iteration 9 chose to insert a ~292-byte bullet after `AGENTS.md:181` on the
strength of a 310-byte residual budget. A residual is only headroom if nothing else lives beyond it.
On the one carrier that truncates the file, everything beyond the cut already lives there.

## Actions Taken

1. Computed byte offsets for every `AGENTS.md` line from `:176` to `:189` against the documented
   16,384-byte per-file cut, and classified each line INSIDE / PARTIAL / OUTSIDE.
2. Built an eviction model: for an insertion of N bytes at position P, re-classified every following
   line to see which delivered lines fall past the cut — i.e. priced the insertion in *evicted rules*
   instead of in residual bytes.
3. Re-derived the bracket boundaries (27 / 168 / 310) that divide insertions into three eviction
   classes, and placed four candidate drafts into them.
4. Verified the 16,384-byte bound at its source rather than inheriting it, and checked whether any
   other runtime documents a per-file rule budget.
5. Searched for an independent carrier of the two clauses the insertion would evict, to test whether
   the eviction is offset anywhere else in the tree.
6. Read `ROUTER.md`'s resource maps and the orchestrate dispatch contract for whether a dispatched
   child with no operator present reaches the authoring card — the last unclosed half of Q4.
7. Consolidated the ranked table from the measured axes accumulated across iterations 1–9 plus this
   iteration's eviction axis.

## Findings

1. **New, and it reverses the placement: the 310-byte residual after `:181` is not headroom, it is
   the delivery tail, so an insertion of N bytes evicts N bytes of already-delivered rules.** Byte
   offsets: `:181` 15,914–16,073; `:182` 16,074–16,215; `:183` 16,216–16,356; `:184` 16,357–16,501
   but delivered only as its first 27 bytes. The delivered window fills exactly at `:183`'s last byte.
   Model the insertion of iteration 9's draft at 284–293 B after `:181`: `:182` survives as its first
   17–18 bytes (a mid-word fragment), `:183` and everything below it vanish. The insertion does not
   add 293 bytes of instruction; it **exchanges** 293 bytes of existing instruction for 293 bytes of
   new instruction. [SOURCE: AGENTS.md:182] [SOURCE: AGENTS.md:183] [SOURCE: AGENTS.md:184]
   [INFERENCE: byte offsets over the file's raw bytes; the mid-line cut is inferred from a byte bound
   stated as a file-size limit]

2. **New, and it is the price list: three eviction brackets, and only the smallest is free.** An
   insertion after `:181` of at most 27 B evicts nothing live (it consumes only `:184`'s already-broken
   27-byte fragment); 28–168 B evicts `:183` whole ("Produce the smallest complete result early",
   140 B); 169–310 B evicts `:183` **and** `:182` ("Follow the brief's intent, not just its letter …
   The undocumented deviation is the sin"). A re-derived draft of the planned rule — shape plus the
   child-dispatch clause — is 283 B of text, 284 B with its newline, and lands in the worst bracket.
   A shape-only draft is 154 B and lands in the middle bracket. [SOURCE: AGENTS.md:182]
   [SOURCE: AGENTS.md:183] [INFERENCE: 27 + 141 = 168 and 168 + 142 = 310 bracket boundaries]

3. **New, and it corrects iteration 9's arithmetic reading: the "17 B to spare" number is evidence of
   eviction, not of slack.** Iteration 9 measured the draft as fitting after `:181` "with 17 B to
   spare". Seventeen bytes is exactly what remains of `:182` once a 293-byte insertion shifts it: the
   insertion did not leave slack, it cut a delivered rule to a fragment. The measured sizes in that
   iteration (271→352 B on card `:113`, 64→88 B on card `:124`, 224 B and 255 B and 203 B on the
   others) are unaffected — none of those files is size-bounded — so the correction is confined to the
   one target whose delivery is bounded, and to the one target the recommendation was about.
   [SOURCE: AGENTS.md:181] [INFERENCE: residual 16,384 − 16,074 − 293 = 17 B, which is the delivered
   prefix of `:182`]

4. **New, and it answers the placement question in the opposite direction: the only zero-eviction
   placement is in the region already outside the cut.** `:186` ("**Plan before acting** on multi-step
   work: name the files, the tools and the observable check before the first edit.") starts at byte
   16,888 — 504 B past the limit, so it is not delivered on that carrier today. Extending it to carry
   the phase shape therefore evicts nothing on the carrier that truncates, and is delivered in full on
   the six runtimes that do not. It is also the existing line nearest the object of the question, so
   the change converts a rule rather than adding a bullet. [SOURCE: AGENTS.md:186]
   [SOURCE: .devin/SYNC.md:93] [INFERENCE: 16,888 > 16,384 from the same offset table]

5. **New, and it rules out the offsetting argument: the two clauses the insertion would evict have no
   independent carrier.** A tree-wide phrase search for both evicted sentences returns only copies of
   `AGENTS.md` itself — barter overlay backups, a repin-run backup set and a doctor output snapshot —
   and nothing under `.skilled/repo-rules/` restates either clause. So on the truncating carrier the
   trade is strictly negative: two live behavioural rules out, one unenforced shape rule in.
   [INFERENCE: phrase search over `**/*.md`, excluding node_modules, specs and research_archive;
   every hit was a copy of `AGENTS.md`]

6. **New, and it closes Q4's carried half: the card is intent-gated, not operator-gated, so a
   dispatched child with no user present does reach it.** `ROUTER.md:39` lists
   `references/workflows/spec-authoring-card.md` in the IMPLEMENT resource map (and `:37` in PLAN),
   `.skilled/agents/orchestrate.md:465` makes a prior Read from the card a precondition for a
   spec-folder write under a Template Bypass rule, and `.skilled/commands/speckit/implement.md:92`
   states that the writing session follows the card. None of the three conditions on an operator
   being present. The residual risk is intent mis-routing — a child whose request does not match a
   PLAN/IMPLEMENT trigger never loads it — which is a routing property, not a dispatch one.
   [SOURCE: .skilled/skills/system-spec-kit/ROUTER.md:39]
   [SOURCE: .skilled/agents/orchestrate.md:465]
   [SOURCE: .skilled/commands/speckit/implement.md:92]

7. **Partially new: the delivered ranking, on the four axes the run measured.** Cost is marginal bytes
   (and, new this iteration, marginal evicted bytes); arrival is which of the seven runtimes receives
   the text; enforcement is whether anything fails when the rule is broken; change set is lines in
   existing files. Mechanisms are ordered by arrival per unit of marginal cost, since the topic's
   problem is a session that never sees the command's instructions.

| # | Mechanism | Marginal cost | Arrival | Enforcement | Verdict |
|---|---|---|---|---|---|
| 1 | Amended card + template lines (two existing files) | +81 B, +24 B, and three lines rewritten in place; **0 evicted** (read by tool, no size bound) | every runtime that routes PLAN or IMPLEMENT | prose; the template's `FILL` marker is validator-visible | **Take it — primary carrier** |
| 2 | Amended existing `AGENTS.md` line (`:186`) | one line extended; **0 evicted** on the truncating carrier, +0 B elsewhere | 6 of 7 runtimes in full; 0 bytes on the 7th | prose only | **Take it — one amended line, not a new bullet** |
| 3 | Inserted new `AGENTS.md` bullet after `:181` | 283–293 B, **which evicts `:182` + `:183`** on the truncating carrier | 7 of 7 runtimes, net of two rules removed on the 7th | prose only | Rejected this iteration on finding 5 |
| 4 | Hook that injects the relevant step | new hook concern; ≤2,048 chars/turn ceiling, 91 chars observed | 6 adapters, contract-named | context only — it returns `{}` on failure and cannot block | Rejected: last resort in the frozen order, and the contract declines authority for its own text |
| 5 | Validator rule / backstop | new rule + registry entry | only when `validate.sh` runs | real | Withdrawn earlier: 0.62% corpus adoption |
| 6 | Session invoking the command itself | 60,098 B (implement) / 93,496 B (complete) assets | only when the advisor fires and confidence ≥ 0.8 | full | Rejected: this *is* the command path; the topic's session types nothing |

   Ranked top-down as carriers: **1 > 2 > 3 > 4 > 5 > 6.** Mechanism 1 wins on arrival-per-cost
   because a file read by a tool call is not subject to the rule-file budget that both bounds and
   prices the contenders. Mechanism 2 is the cheap per-turn addition and is now a line amendment
   rather than an insertion, which is what makes it free. Mechanism 3 is the same rule as 2 at
   three digits of extra cost and two evicted rules; it was the recommendation last iteration and is
   withdrawn. [INFERENCE: synthesized from findings 1–6 and the measured figures carried in the
   strategy's key findings]

8. **New quantification, not a new defect: 40% of `AGENTS.md` never reaches the truncating carrier.**
   The file is 27,372 B against the 16,384-byte limit, so 10,988 B — everything from `:184` onward,
   including "Settled stays settled", "Plan before acting", "Do not stop early" and "Do not ask
   permission to continue an already-approved, in-scope step" — is delivered to none of those
   sessions. `.devin/SYNC.md:93` states the limit as fixed and advises keeping hard rules in the first
   16 KB; no other runtime in the tree documents a per-file rule budget. This is why the
   recommendation's primary carrier is the card: the card is opened by a Read, and iteration 5 already
   ruled out treating a tool-read file as truncated by this budget. [SOURCE: AGENTS.md:189]
   [SOURCE: .devin/SYNC.md:93] [SOURCE: .devin/README.md:92] [INFERENCE: 27,372 − 16,384 = 10,988 B,
   40.1% of the file]

## The Recommendation

Amend seven lines across three existing files. No new file, no new hook, no new command, no new
validator rule, no new bullet.

1. **Card `:113`** — the rule sentence gains the decidable shape: each phase line names the file it
   changes in backticks and ends with `Verify:` and the command that proves it. 271 → 352 B.
   Keep the "That is the plan template's phases fill note" sentence only with target 5.
2. **Card `:120`** — three compliant example lines replace the one non-compliant line. The current
   example scores 0/1 under the rule it illustrates; the drafted one scores 3/3.
3. **Card `:123`** — acceptance restates the shape rather than "three phases in one line each".
4. **Card `:124`** — verify becomes `rg -n '^## 4\. IMPLEMENTATION PHASES' <packet folder>/plan.md`.
   Keeps all 4,694 true passes, drops the 118-file false-pass class, costs nothing at migration.
5. **Template `:124`** — the fill note teaches path-plus-proof, and its GOOD example is replaced, or
   the scaffolded file ships a counter-example directly under the rule.
6. **Template `:126`** — the `tasks.md` ownership sentence is qualified so the scaffolded file stops
   telling every new packet that the phases belong to `tasks.md`.
7. **`AGENTS.md` `:186`** — extend the existing "Plan before acting" line with the phase shape. One
   line, zero eviction, delivered on the six runtimes that do not truncate at 16,384 B. Not a new
   bullet after `:181`, which is the same rule at the cost of two delivered rules on the seventh.

The child-dispatch clause — a dispatched child records a deviation and continues — moves into the
card text (target 1), where it has no size bound, instead of into the `AGENTS.md` line, where it costs
the entire 168-byte bracket. That is a change from iteration 9's draft, forced by finding 2.

## Ruled Out

- **Placing the bullet after `:181` at 283–293 B.** Not ruled out of scope: ruled out on price. It
  buys arrival on one carrier by evicting two rules from that same carrier (findings 1–3, 5).
- **Compressing the rule into the ≤ 27 B bracket.** The bracket is free but 27 bytes cannot express a
  shape predicate plus its proof command; a fit at that size would be a label, not a rule.
- **Treating the residual budget after `:183` (28 B) as a candidate.** Falls inside the same
  accounting: 28 B evicts `:183` whole, so it is the middle bracket, not a slot.
- **Offsetting the eviction by pointing at a duplicate carrier under `.skilled/repo-rules/`.** Checked;
  no duplicate exists (finding 5).
- **Restoring the level qualifier in `AGENTS.md` rather than in the card.** Same bracket accounting,
  and the qualifier was withdrawn in iteration 8 as dead text; it belongs nowhere.

## Dead Ends

- **Pricing an insertion by residual bytes.** Residual bytes past the cut are live instruction, so the
  metric inverts the sign of the cost. Any future proposal touching a size-bounded rule file should be
  priced in evicted lines, not in spare bytes. Candidate for strategy "Exhausted Approaches".
- **Assuming a fix to the `AGENTS.md` truncation belongs to this recommendation.** It does not: the
  file is 40% over the limit, and closing that is a repo-level restructure of the file, not a
  mechanism choice. Left as an out-of-scope defect with its exact range recorded.

## Edge Cases

- **Ambiguous input:** none. The final iteration's focus follows from Q5's last unclosed clause (the
  single recommendation), which the carried list names explicitly.
- **Contradictory evidence:** resolved rather than carried. Iteration 9 finding 1 and this iteration's
  findings 1–3 disagree on what a residual budget means; both byte tables are reproducible and agree
  on the numbers, so the disagreement is interpretive and this iteration's model explains the
  iteration-9 figure (17 B as a fragment) rather than disputing it. Recorded as a superseding
  measurement, not a conflict.
- **Missing dependencies:** `research/research.md` does not exist although `progressiveSynthesis` is
  true; the dispatch's write list does not include it, and the strategy calls it workflow-owned. Left
  unrun, as in iterations 5–9, and recorded under SCOPE VIOLATIONS.
- **Partial success:** none. All seven actions completed; two phrase searches and one byte pass were
  run in memory over files on disk and printed to stdout, with no mutation of any researched path.

## Sources Consulted

- `AGENTS.md:176-189` (byte offset table, eviction model, `:186` placement, 27,372 B total)
- `.devin/SYNC.md:93` (16,384-byte fixed per-file rule limit; "could not be injected due to token limits")
- `.devin/README.md:92` ("Devin reads each rule file up to 16,384 bytes")
- `.skilled/skills/system-spec-kit/ROUTER.md:37,39` (PLAN and IMPLEMENT resource maps name the card)
- `.skilled/agents/orchestrate.md:465` (Template Bypass: a spec-folder write without a prior card Read is rejected)
- `.skilled/commands/speckit/implement.md:92` (the writing session follows the card)
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:113,120,123,124`
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:124,126`
- Phrase search for the two evicted clauses (copies of `AGENTS.md` only, plus barter backups)

## Assessment

- New information ratio: 0.92
- Questions addressed: Q5 (the single recommendation and its ranking), Q4 (child-dispatch half)
- Questions answered: both of the above. Q1–Q3 were answered in earlier iterations.

## Reflection

- **What worked and why:** asking "what does this insertion displace?" instead of "does this insertion
  fit?" inverted the placement decision for the price of one byte-offset pass. The earlier question
  had a comfortable answer for nine iterations because the residual was read as capacity; on a
  truncated file the residual is the last live instruction, so capacity and cost are the same bytes.
  Measuring a known number under a different interpretation is what produced the result, not new data.
- **What did not work and why:** iterations 7–9 each re-derived the size of the change and never the
  size of the file's remainder. Sizes were measured with increasing precision while the model
  relabelled the same 310 bytes as available when they were already spent. Precision on the wrong
  quantity reads as rigor and produced a placement that costs more than it buys.
- **What I would do differently:** for any edit to a file that is delivered under a documented size
  bound, compute the delivered/undelivered boundary first, before drafting text. Had that line been in
  iteration 1's measurement set, placements 3 through 9 would have been scored against eviction from
  the start, and the recommendation would have arrived at the amended `:186` line several iterations
  earlier.

## Recommended Next Focus

None. All five tracked questions are answered and the recommendation is literal: seven amended lines
across three existing files, with the two clauses that iteration 9 would have evicted kept in place.
Two things are recorded for whoever implements it, not for another iteration:

1. **Do not reinstate anything withdrawn:** the review-verdict clause (iteration 6), the numeric
   level qualifier and the validator backstop (iteration 8), the shape-count verify and the 292-byte
   inserted bullet (iterations 9 and 10). The verify names `IMPLEMENTATION PHASES`, never the number
   `4` (iteration 7).
2. **The truncation stays unowned:** `AGENTS.md` exceeds the per-file rule budget by 10,988 B, so the
   seventh carrier loses 40% of the file regardless of this edit set. That is a repo-level defect, it
   is priced by no candidate mechanism, and any future work on the chat path should treat the card as
   the only guaranteed carrier on that runtime.

## SCOPE VIOLATIONS

- `research/research.md` still does not exist although `deep-research-config.json` sets
  `progressiveSynthesis: true`. The dispatch's allowed-write list names only
  `iterations/iteration-010.md`, `deltas/iter-010.jsonl` and the append gateway's own writes, and the
  strategy calls `research/research.md` "workflow-owned canonical synthesis output". Recorded rather
  than executed, as in iterations 5 through 9.
- No mutation was attempted against any researched path. `AGENTS.md`, the card, the template, the
  runtime docs and the dispatch contract were read or measured only; byte offsets, the eviction
  simulation and the draft sizes were computed in memory over content already on disk and printed to
  stdout. The single-record gateway event file is written to `/tmp`, outside the repository.
