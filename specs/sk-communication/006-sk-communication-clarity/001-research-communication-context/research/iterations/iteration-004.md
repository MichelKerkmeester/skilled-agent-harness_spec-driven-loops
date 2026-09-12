# Iteration 4: Cross-source synthesis — merged candidates, contradiction resolutions, owning-surface map, measurement scope

## Focus

Stop inventorying and synthesize. The three sources are fully inventoried (81 classified rows across
iterations 1-3); this iteration:

1. merges the three inventories into one candidate list keyed by the *failure each candidate prevents*,
   not by source, and reports the merge count and the collapse;
2. resolves the contradiction set on one page — the exact point of disagreement, the repo rule that
   wins, and the qualifier that would make each source clause adoptable;
3. assigns one owning surface per surviving candidate, under the length-ceiling constraint on
   `repo-rules/communication.md` and the blocked `sk-communication`-as-rule-owner direction;
4. answers the measurement question — harness and release gate: phase 002 or phase 005.

No ambiguity in the dispatch focus; the one counting discrepancy is recorded in Edge Cases.

Short forms used below: `cN` = rule N of `context/clarity.md`; `S:N` = line N of
`context/claude-style-patch-main/STYLE.md` (with `README:N` for its README); `A:N` = classified row N
of the `i-have-adhd-main` inventory table in `iterations/iteration-003.md`. `HVR` abbreviates
`.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`.

## Actions Taken

1. Read runtime state — `deep-research-config.json`, `deep-research-state.jsonl` (3 iteration records,
   so this is iteration 4), `deep-research-strategy.md` (§3, §9, §11), `findings-registry.json`.
   Confirmed hard-block invariants: `convergenceMode: "off"`, `progressiveSynthesis: true`,
   `lineageMode: "new"`.
2. Verified the packet write boundary: packet root is
   `.../001-research-communication-context/research/`; `iterations/iteration-004.md` and
   `deltas/iter-004.jsonl` do not exist; no reducer-owned file scheduled for a write.
3. Re-read the three iteration narratives in full and used their anchored classification rows as the
   merge input, instead of re-reading the vendored sources — read-budget freshness; the sources are
   frozen and every row already carries a source anchor plus a repo anchor.
4. Confirmed the accepted gateway record schema from the last accepted iteration record
   (`deltas/iter-003.jsonl` line 1): the record carries the `runId`/`lineageId` stable-identity pair
   that iteration 1's first gateway attempt was refused for omitting.
5. Read the phase-level authority for the measurement question: the parent `spec.md` phase map and
   `005-verification-and-rollout/spec.md` (scope, dependencies, deliverables, file table).
6. Checked the benchmark surface by listing: `.opencode/skills/sk-communication/benchmark/` contains
   `README.md` and `reports/advisor-routing-smoke-2026-08-12.json` only — a measurement surface that
   measures advisor routing, not reply quality (confirms iteration 3's F-mech-3 read).

## Findings

### F1 — Merged candidate list: 47 candidate rows collapse to 29 failure-keyed candidates

Across the three sources, 81 rows were classified: 18 clarity rules, 34 STYLE.md/README items, 29
ADHD rows. Of these, **34 are covered** by a named stack line and produce no candidate; **47 are
candidate-or-decision rows**. Of the 47, three (the colon rule `S:25-29`, not-X-but-Y `S:39`, and the
"load-bearing" word ban `S:69`) resolve as pure decisions — they are resolved in F2, not carried as
candidates. The remaining 44 rows merge into **29 distinct candidates**, keyed by the failure each
candidate prevents: **15 duplicate rows collapse**, a 34% reduction against the merged set.

The merged list:

| # | Candidate — the failure it prevents | Merged rows | Owning surface |
|---|---|---|---|
| 1 | Reader triage before drafting — a reply addressed to a reader nobody modeled; drafting before the takeaway is fixed | c1, c2, c3; S:15 | `repo-rules/presenting-decisions.md` §1/§3 |
| 2 | Borrowability test — prose anyone could have written, with no sourcing diagnosis | c4 | HVR §4 + pre-publish checklist (`HVR:225-234`, `:449-515`) |
| 3 | Explicit sentence relation — juxtaposition fakes a logical link the writer never stated | c10 | `communication.md` §2 (split bundle) |
| 4 | Sequential progression — locally atomic paragraphs that carry nobody forward | c15; S:49 | `communication.md` §2 (split bundle) |
| 5 | First-line contract — payload, not label: an opener that announces, labels, fragments, or sets up | c14; S:33, S:35, S:37; A:1 | `communication.md` §6 (split bundle) |
| 6 | Mechanism visibility — a model whose moving parts are never named | S:9 | `communication.md` §2 (split bundle) |
| 7 | Concise ≠ compressed — brevity that deletes necessary connective tissue or turns telegraphic | S:11 | `communication.md` (split bundle) |
| 8 | Nominalization → verb; stacked compression — abstract nouns hiding actions, metaphor piled on nominalization | S:19, S:43 | HVR §4 |
| 9 | Etymological word test — Latinate abstraction where a plain word holds precision | S:21 | HVR §1 (plain words) |
| 10 | Literal over figurative in replies — idioms the reader must decode | A:15 | HVR §1 (wording standard) |
| 11 | Editing lane for durable prose — rewrite-as-smoothing; no lane owns cut-and-reorder | c17 | none today — lane decision (nearest: HVR checklist) |
| 12 | Numbered step path — multi-step work the reader cannot track; unbounded steps | A:2 | `communication.md` §5/§6 (split bundle) |
| 13 | State restatement cadence — reader must re-orient every turn | A:5 | `repo-rules/handoff-and-questions.md` |
| 14 | Concrete time estimates — silent duration expectations | A:6 | `repo-rules/presenting-decisions.md` §4 |
| 15 | Two-line sufficiency + closing-deletion test — outcome hidden mid-reply; farewell closers | A:12, A:16 (+A:10 residual) | `communication.md` pre-send block (split bundle) |
| 16 | Visible-item cap with completeness safeguard — a list that buries item six; a cap that hides it | A:9 | `communication.md` (split bundle) |
| 17 | Tangent suppression, offer once at end — a second issue hijacking the reply | A:4 | `communication.md` (split bundle) |
| 18 | Closing contract — one concrete next action; completed work visible and demonstrable | A:3, A:7 | `repo-rules/handoff-and-questions.md` |
| 19 | Error-report shape, qualified — an unconfirmed cause asserted as definitive | A:8 | `repo-rules/evidence-and-proof.md` as a qualifier (conflict resolution C-1) |
| 20 | Reader-model rationale layer — rules with no stated why | A:23 | `communication.md` rationale note (split bundle) |
| 21 | Resident style payload / decay countermeasure — rules decay across a long session; read-only turns load nothing | A:24, A:25; S:1; README:34-35 | gap statement only — `specs/hooks/022-smart-rule-injection` owns the decision (strategy §4 non-goal) |
| 22 | Reply-quality eval harness — no measurement of whether a rule changes a reply | A:27 | `.opencode/skills/sk-communication/benchmark/`; scope settled in F4 |
| 23 | Reply-quality release gate — a style change buys brevity with accuracy | A:28 | same folder + gate wiring; scope settled in F4 |
| 24 | Runtime mirror verification — mirror drift; load-layer breakage | A:26, A:29 | doctor surface + CI; currently unverified, deferred |
| 25 | Comment present-state / no-archaeology — comments narrating their own history | S:31 (`S:91-93`) | `sk-code-quality` checklist asset (deferred verification, F8) |
| 26 | Document scan test / headers as labels — a document that cannot be scanned | S:30 (`S:79-81`) | HVR document half |
| 27 | Worked exemplar paragraph — style described but never demonstrated | S:29 (`S:73-77`) | HVR §2 |
| 28 | Reply hierarchy numbering — complex hierarchies flattened into unreadable prose | S:21 (`S:51`) | none today — lowest value; defer |
| 29 | Rule-file shape: example + repair — a rule that names a habit without showing the fix | README:16-18 | repo-rule template contract, not a communication rule |

The collapse is real, and the three-way example is F1's headline: **clarity c14's positive
first-sentence test, STYLE's opener bans (`S:33`, `S:35`, `S:37`), and ADHD row A:1's action-first
rule are four statements of one gap** — the first line must carry payload and must not announce,
label, or set up. They merge into candidate 5. Other multi-source collapses: candidate 1 (c1-c3 +
S:15), candidate 4 (c15 + S:49), candidate 21 (A:24, A:25, S:1, README:34-35), candidate 24
(A:26 + A:29).

**Arithmetic check:** 81 rows = 34 covered + 47 candidate/decision rows; 47 − 3 pure decisions = 44
rows → 29 candidates, so 15 duplicate rows were collapsed. Surface totals: `communication.md` split
bundle 10 assignments; HVR 6; `presenting-decisions.md` 2; `handoff-and-questions.md` 2;
`benchmark/` 2; `evidence-and-proof.md` 1; `sk-code-quality` 1; no surface today 5 (candidates 11,
21, 24, 28 — plus 24's doctor/CI is the unverified one).

`[SOURCE: research/iterations/iteration-001.md F2, F11]`
`[SOURCE: research/iterations/iteration-002.md F2, F7, F9]`
`[SOURCE: research/iterations/iteration-003.md F-inventory, F-mech-3, F-mech-4]`

### F2 — Contradiction page: four named conflicts, three still open, each with a decision shape

Iteration 2 named three conflicts and iteration 3 one; the dispatch named three in total. The honest
reconciliation: four conflict candidates were named across the run; one (not-X-but-Y) is already
closed by the repo's stricter side, and three remain open decisions. For each: the exact point of
disagreement, the repo rule that wins, and the qualifier that would make the source clause adoptable.

| # | Conflict | Exact point of disagreement | Repo rule that wins | Qualifier that would make the source clause adoptable | Status |
|---|---|---|---|---|---|
| C-1 | A:8 cause-then-fix vs the evidence rules | May a reply *name* a single cause when several remain consistent with the evidence? Source says name it; repo says mark it inferred or say UNKNOWN. | `AGENTS.md` §4 ("Finding = hypothesis … until something you ran confirms them") and §10 ("Never fabricate — use UNKNOWN when uncertain") — corroborated by the source's own eval (`evals/RESULTS.md:88-99`, `partial-success` −0.63 mean, mechanism named) | Keep the cause-then-fix *order*, but make the cause's epistemic status explicit: "Suspect (unconfirmed): … / Next check: …" when no run confirms the cause. Verified causes keep the original shape. A confirmed cause is a finding, not an assertion. | Open — repo wins in principle; qualifier drafted, phase 002 records it |
| C-2 | `S:25-29` colon rule vs `communication.md:104-106` + `HVR:114` | May a colon introduce a non-list clause? Repo offers colon as the em-dash replacement and its own rule prose uses label-then-payload (`communication.md:113`, `AGENTS.md:144`); source requires two sentences or a `because/so/but/and` join. | Status quo repo rule — no change without an amendment decision; both sides are internally consistent. Adoption would amend `communication.md:104-106` and the `HVR:114` table row and flag the rule files' house style. | Scope the ban to reply prose meant to be read once, and explicitly grandfather the rule files' label-then-list documentation pattern. Without that carve-out the ban collides with the repo's own documentation convention. | Open — operator decision (unchanged from iteration 2) |
| C-3 | `S:39` not-X-but-Y permission vs `HVR:140-145` | May a genuinely competing contrast ever take the antithesis shape? | `HVR:140-145` — the repo's absolute ban is the stricter side; STYLE's permission is the weaker side. | None needed. Repo status quo stands; iteration 2 already recommended no change. | Closed — repo wins |
| C-4 | `S:69` "load-bearing" ban vs `AGENTS.md:144`, `AGENTS.md:243`, `handoff-and-questions.md:39` (four occurrences across `AGENTS.md` and `repo-rules/`) | Does a word ban reach framework vocabulary that loads into every turn? | The root doc binds: a style source cannot ban `AGENTS.md`'s own core term for evidence-carrying claims. | Scope the ban to user-facing reply prose and exempt repo-owned framework wording; rename only if the operator prefers. The phrasing is doing load-bearing work — it names the claim class the evidence rules govern. | Open — scope decision |

One check the page makes visible: C-2 and C-4 are *scope* questions (reply prose vs documents/framework
prose), and C-1 is an *epistemic* question. Only C-1 has a mechanical resolution that can be adopted
without an operator choice; C-2 and C-4 need a written decision either way, and both are cheap to
state in phase 002's decision record.

`[SOURCE: research/iterations/iteration-002.md F3, F5, F7]`
`[SOURCE: research/iterations/iteration-003.md F-conflict-1]`
`[SOURCE: specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/RESULTS.md:88-99]`

### F3 — Owning-surface map under the two standing constraints

The constraints hold as recorded: `repo-rules/communication.md` records its own length ceiling and
the earlier split decision (`communication.md:49-51`), and `sk-communication` stays blocked as a rule
owner (display-only lane, `SKILL.md:18-20`, `:57`). Applying them:

- **`communication.md` absorbs 10 of 29 candidates** — the single largest allocation. A split is no
  longer a contingent prerequisite; it is the default first step of phase 003. The natural seam the
  merge exposes: §2 (sentence and paragraph mechanics — candidates 3, 4, 6, 7) against §6 (reply
  shape — candidates 5, 12, 15, 16, 17), with candidate 20's rationale note following the reply-shape
  half. This is a routing finding for the plan, not a content gap.
- **The `sk-communication` block is not breached.** No wording rule is assigned to the skill.
  Candidates 22 and 23 point at its `benchmark/` subfolder, which is a measurement surface that
  already holds a dated report (`reports/advisor-routing-smoke-2026-08-12.json`), not a rule surface —
  the same distinction iteration 3's F-mech-3 drew. The skill's own rule stays intact: it carries no
  rubric and points at the standard.
- **Two-authority split persists.** Six candidates land on HVR (the wording standard), and two of
  those (9, 10) are reply-facing, so their adoption flows through `communication.md:116-126`'s
  voice-half delegation. Adoption planning must move both surfaces together or the rule will load for
  documents and not for replies.
- **No new root-doc clause.** `AGENTS.md` §8's two-clause floor is deliberate (strategy §12); the 29
  candidates distribute across rule files, the standard and the benchmark folder without needing the
  root doc.
- **Candidates with no surface today: 11 (editing lane), 21 (gap statement only), 24 (unverified),
  28 (lowest value).** These are the honest residuum; none should be forced onto an existing file
  just to give it a home.

`[SOURCE: repo-rules/communication.md:49-51, :116-126]`
`[SOURCE: .opencode/skills/sk-communication/SKILL.md:18-20, :57]`
`[SOURCE: research/iterations/iteration-002.md F9]`

### F4 — Measurement question: harness and gate belong to phase 005; the baseline must precede phases 003/004

This question now has documented authority rather than inference. The parent phase map defines phase
2 as "Adopt or reject each recommendation, and name its owning document" and phase 5 as "Measure the
change, then mirror it across runtimes" (`006-sk-communication-clarity/spec.md:147`, `:150`). Phase
005's own spec already specifies the deliverable:

- "A reply-scoring harness under the skill's existing benchmark folder, with fixed cases and a blind
  rubric" (`005-verification-and-rollout/spec.md:87`).
- "A release gate stated in terms of what this repository can actually observe" (`:89`), with
  `.opencode/skills/sk-communication/benchmark/` listed as a **Create** target (`:104`), and the
  current state named: "Nothing in this repository measures whether a communication rule changes a
  reply" (`:67`).
- Phase 005's out-of-scope list already excludes what the source's harness does beyond its target
  cases: a blind human study, and scoring anything beyond the cases the adopted rules target
  (`:96-97`).

So the scope answer is: **phase 005 owns the harness and the gate; phase 002's obligation is the
adopt/reject verdict for candidates 22-23 with the benchmark folder as their one owning surface.**
Two constraints must travel with that handoff:

1. **Gate strictness is a phase-002 decision, not a 005 implementation detail.** The source's own
   gate failed a release that improved every dimension (weighted 4.045 → 4.473) because its
   "no blocking findings" rule is absolute while its neighbours are comparative — 7 baseline
   blockers to 3 candidate blockers still fails (`evals/RESULTS.md:38-51`). Phase 005's wording
   ("stated in terms of what this repository can actually observe") already bars importing that
   absolute rule unmodified; the strictness rule belongs in the decision record so 005 designs
   against a stated constraint.
2. **The baseline cannot wait for phase 005.** Phase 005's own dependency reads: "A baseline captured
   before those phases, or the measurement has no before" (`005-verification-and-rollout/spec.md:48`)
   — those phases are 003 (root doc and repo rules) and 004 (sk-communication upgrade). If the
   baseline arm is built only in 005, the before-state is gone. Phase 002 should record this
   sequencing item (baseline capture scheduled before or alongside phases 003-004 landing), or 005's
   measurement is impossible by construction. No prior iteration had noticed this dependency; it is
   the one genuinely new external-evidence finding of this iteration.

`[SOURCE: specs/sk-communication/006-sk-communication-clarity/spec.md:147, :150, :164]`
`[SOURCE: specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/spec.md:42-51, :67, :87-89, :96-97, :104]`
`[SOURCE: specs/sk-communication/006-sk-communication-clarity/context/i-have-adhd-main/evals/RESULTS.md:38-51]`
`[INFERENCE: the benchmark directory listing (`README.md`, `reports/advisor-routing-smoke-2026-08-12.json`) shows a measurement surface sized for routing checks, not reply scoring — consistent with iteration 3's read of `benchmark/README.md` §1]`

### F5 — The merge changes what phase 002's closure gate will see

Phase 002's stated closure hypothesis is that "every recommendation carries an adopt or reject verdict
and, if adopted, exactly one owning document", checked by `decision-record.md` row count against the
recommendation count (parent `spec.md:164`). This iteration supplies the recommendation count phase
002 must use: **29 merged candidates + 3 pure conflict decisions + 1 closed conflict (C-3) = 33
decision rows**, not the 81 classified rows and not 47. If phase 002 carries source-keyed rows, the
collapse reappears as duplicate assignments — exactly the drift risk phase 002's own risk row names
("Placing one recommendation in two documents … the allocation table is the single assignment",
`002-synthesis-and-decisions/spec.md:150`).

`[SOURCE: specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/spec.md:42, :150]`
`[INFERENCE: derived from F1's merge arithmetic]`

## Ruled Out

- Re-reading the three vendored sources to "re-derive" the merge: the three iteration narratives carry
  every classified row with a source anchor and a repo anchor, so a reread would spend budget without
  new evidence. [SOURCE: research/iterations/iteration-001.md, :002.md, :003.md]
- Treating the 34 covered rows as merge inputs: covered rows are closed; only candidate rows (47)
  enter the merge. This is what keeps the merged count honest. [SOURCE: F1 arithmetic above]
- Retrying any strategy §9 BLOCKED direction. None was approached; the two standing blocked items
  (`sk-communication` as rule owner; single-surface undercount) were used as constraints, not
  revisited. [SOURCE: research/deep-research-strategy.md §9-§10]

## Dead Ends

- No new dead ends worth reducer promotion. The synthesis confirmed the two standing constraints and
  added no new blocked direction. The merge itself is deterministic given the inventories.
- Note for the reducer: candidates 11, 21, 24 and 28 have no home surface today. That is a finding
  about the stack's routing shape, not a failed approach — do not promote to Exhausted Approaches.

## Edge Cases

- **Ambiguous input (resolved).** The dispatch says "the three contradictions on one page — F-conflict-1
  here plus iteration 2's two"; the record shows four named conflict candidates (colon, not-X-but-Y,
  load-bearing, rule 8). Interpretation taken: report all four, and mark the three that remain *open*
  (colon, load-bearing, rule 8's qualifier) versus the one already closed by the repo's stricter side
  (not-X-but-Y) — which matches the dispatch's count of three as the open set. Deferred alternative:
  none; the count discrepancy is reconciled in F2 rather than silently aligned.
- **Contradictory evidence (pre-existing, not this iteration's).** The state log's last record before
  this iteration is a `containment_violation` event (iteration 3) listing out-of-scope dirty files in
  `specs/hooks/022-smart-rule-injection/**` and a modified `loop-protocol.md`, with all entries
  preserved and a patch written to `containment-out-of-scope/`. It is a workspace condition, not a
  finding; this iteration authored none of those changes and wrote only to its two artifact paths.
- **Missing dependencies.** None blocking. The deferred `sk-code-quality` comment-checklist read
  (candidate 25) and the doctor mirror check (candidate 24) remain deferred by dispatch decision; both
  are single-file verifications that do not block synthesis.
- **Partial success.** None for this iteration's own actions. The one schema hazard — the gateway's
  required `runId`/`lineageId` pair — was pre-empted by reading the last accepted record.

## SCOPE VIOLATIONS

None. Every write stayed inside the allowed list (`research/iterations/iteration-004.md`,
`research/deltas/iter-004.jsonl`, and the append gateway's own writes). `research/research.md` was
left untouched again: `progressiveSynthesis` is `true`, but the prompt pack's allowed-write list
excludes it and the strategy declares it workflow-owned (discrepancy already recorded in iteration 3's
edge cases; unchanged this iteration).

## Sources Consulted

- `research/deep-research-config.json`, `research/deep-research-state.jsonl` (3 iteration records),
  `research/deep-research-strategy.md` §3, §4, §9-§13, `research/findings-registry.json`
- `research/iterations/iteration-001.md` F1-F12, `iteration-002.md` F1-F9, `iteration-003.md`
  F-inventory, F-conflict-1..3, F-mech-1..5 (re-read in full for the merge)
- `research/deltas/iter-003.jsonl` line 1 (accepted record schema, `runId`/`lineageId` pair)
- `specs/sk-communication/006-sk-communication-clarity/spec.md:147, :150, :163-166`
- `specs/sk-communication/006-sk-communication-clarity/002-synthesis-and-decisions/spec.md:42, :150`
- `specs/sk-communication/006-sk-communication-clarity/005-verification-and-rollout/spec.md:2-6,
  :42-51, :67, :87-89, :96-97, :104, :107`
- `.opencode/skills/sk-communication/benchmark/` directory listing (`README.md`,
  `reports/advisor-routing-smoke-2026-08-12.json`)
- Underlying anchors were consumed via the iteration narratives, not re-read: `AGENTS.md:144, :153-154,
  :243, :399, :482`; `repo-rules/communication.md:49-51, :72-97, :104-126, :132-199`;
  `repo-rules/presenting-decisions.md:36, :50-55, :65-125`; `repo-rules/handoff-and-questions.md:39,
  :43-53, :70, :86, :101-116`; `HVR:29, :73-76, :93, :114, :140-145, :174-187, :277-285, :304,
  :318, :427, :449-515`; `.opencode/skills/sk-communication/SKILL.md:18-20, :57`

## Assessment

- **New information ratio: 0.72.** Five findings: F1 (merged 29-candidate list — new structure over
  known rows), F2 (resolution page with qualifiers drafted for C-1/C-4), F3 (owning-surface map with
  constraint accounting), F4 (phase 005 spec authority + the baseline-sequencing dependency), F5
  (closure-gate count). F4 is fully new external evidence (phase specs never read before) and F5
  derives from F1. Counting conservatively — F1, F2, F3 partly new at 0.5 each, F4 fully new at 1.0 —
  gives (1.0 + 0.5×3)/4 = 0.625, plus the +0.10 synthesis bonus for collapsing 47 rows into one
  failure-keyed model and moving three contradictions to decision-ready state = **0.72**.
- **Questions addressed:** all five.
- **Questions answered:** Q1 cross-source (81 rows classified; 34 covered with citations; coverage is
  complete for all three sources). Q2 cross-source (29 candidates each carrying the failure it
  prevents). Q3 (four conflicts resolved on one page; three remain open decisions with drafted
  qualifiers; one closed). Q4 (owning-surface map for all 29 under the ceiling and blocked-owner
  constraints). Q5 carried into F4's scope settlement (harness/gate = phase 005; baseline sequencing
  constraint surfaced).

## Reflection

- **What worked and why:** treating the three iteration narratives as the merge's data source rather
  than re-reading the vendored corpus. Every row already carried both anchors, so the merge operated
  on structured evidence and the entire budget went to the synthesis questions. The second thing that
  worked: reading the phase specs for the measurement question. It converted an opinion question
  ("where does this belong?") into a documented scope fact, and it surfaced a sequencing dependency
  (baseline before phases 003/004 land) that neither the strategy nor iterations 1-3 had noticed. The
  cause is structural: scope questions are answered by the artifact's own owner document, not by
  argument.
- **What did not work and why:** the first pass at the merge double-counted rows — conflict rows were
  being carried both as candidates and as decisions, which inflated the count. The fix was to separate
  the 47 candidate-or-decision rows into 44 candidate rows + 3 pure decisions, and to state the
  arithmetic explicitly so the count is auditable. A second friction: the dispatch's "three
  contradictions" against the record's four named candidates. Resolved by reporting all four and
  marking the open set of three, rather than silently aligning with either number.
- **What I would do differently:** run the closure-gate check (F5) *before* finalizing the candidate
  count, since phase 002's check compares a decision-record row count to the recommendation count —
  the count is an interface, and it should be derived from the consuming gate's definition rather
  than from the sources' row structure. Next iteration should do exactly that: test the 29 + 4 count
  against phase 002's gate wording before phase 002 starts.

## Questions Answered

- Key question 1 (covered vs new, cross-source): answered — 81 classified rows, 34 covered by named
  lines, coverage complete across `clarity.md`, `claude-style-patch-main`, and `i-have-adhd-main`.
- Key question 2 (genuinely new, failure prevented): answered — 29 merged candidates, each keyed to
  the failure no current rule names.
- Key question 3 (contradictions): answered — four named conflict candidates, one closed by the
  repo's stricter side, three open decisions each with the winning repo rule and an adoptable
  qualifier drafted.
- Key question 4 (owning surface): answered — one surface per candidate, under the `communication.md`
  ceiling (10 candidates → split bundle) and the blocked `sk-communication` rule-owner direction.
- Key question 5 (mechanism half): answered in iteration 3 and settled here for scope — harness and
  gate are phase 005 deliverables per its own spec; baseline capture is a pre-003/004 constraint.

## Questions Remaining

- The deferred `sk-code-quality` comment-checklist read (candidate 25; F8 from iteration 2) — still
  open, deliberately deferred again.
- Whether the doctor runtime-mirror surface performs a byte-compare or a load smoke test, and whether
  it runs in CI (candidate 24; F-mech-5) — still open.
- `research/research.md` config-vs-strategy discrepancy — still open (iteration 3 edge case).
- New: which phase schedules the baseline capture for the reply-quality harness (phase 002's record
  or phase 003/004 entry) — raised by F4; belongs to the reducer/operator, not this agent.

## Next Focus

Iteration 5 should verify the synthesis against its two consumers, not extend it:

1. Test the merged count (29 candidates + 3 open decisions + 1 closed) against phase 002's closure
   gate wording (parent `spec.md:164`, `002-synthesis-and-decisions/spec.md:150`) and report any
   count mismatch as an interface defect.
2. Close the two cheap deferred verifications if budget allows: the `sk-code-quality`
   comment-checklist asset (candidate 25) and `doctor-runtime-mirrors.yaml` (candidate 24).
3. Do not re-open the merge or the conflict resolutions unless new evidence invalidates an anchor.

## Recommended Next Focus

Iteration 5: cross-check the 29-candidate map against phase 002's "exactly one owning document"
closure gate, then spend the remaining budget on the two single-file verifications. With all five key
questions answered cross-source, iterations 6-10 should either verify specific anchors cited by the
map (spot checks, not rereads) or hold budget; further source reading is now negative-value work.
