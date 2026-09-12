# Iteration 2: claude-style-patch — STYLE.md and README classified against the repo stack

## Focus

Inventory `context/claude-style-patch-main/STYLE.md` and its `README.md` as discrete
recommendations, classify each as covered, partially covered, or genuinely new against this
repository's communication stack, give the colon rule its own treatment because it contradicts
`repo-rules/communication.md` §4, and carry the cross-source check on reader modelling from
clarity rules 1 and 2.

Path note: `context/` abbreviates
`specs/sk-communication/006-sk-communication-clarity/context/`. All other paths are repo-root
relative. `HVR` abbreviates
`.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md`.

## Actions Taken

1. Read state: `deep-research-config.json`, `deep-research-state.jsonl` (exactly one iteration
   record, so this is iteration 2), `deep-research-strategy.md` §3, §6, §9, §11 and
   `findings-registry.json` (6 key findings, 4 ruled-out directions).
2. Verified the write boundary: packet root is
   `.../001-research-communication-context/research/`; this iteration's two target files were
   absent; no reducer-owned file was scheduled for a write.
3. Read `context/claude-style-patch-main/STYLE.md` (95 lines) and `README.md` (42 lines) in full.
4. Read the three stack rule files in full in one pass (`repo-rules/communication.md`,
   `repo-rules/presenting-decisions.md`, `repo-rules/handoff-and-questions.md`) plus `HVR`
   (534 lines) before classifying, applying iteration 1's lesson that a single-surface read
   overstates the gap.
5. Ran five targeted negative checks (`grep`): `nominaliz` and `compress/telegraph` against
   HVR and the communication surfaces, `Tractatus` against `AGENTS.md` and `repo-rules/`,
   `fragment` against `AGENTS.md` and `repo-rules/`, `load-bearing` counts, and the
   `sk-code-quality` comment-hygiene surface. These produced the absence evidence behind
   findings F1 and F8.
6. Classified 34 discrete items (STYLE.md sections plus two README items). No web fetches:
   the strategy's §4 non-goals freeze the vendored copies as the input.

## Findings

### F1 — Coverage tally for STYLE.md and its README

34 discrete recommendations. 14 are covered by a named stack line, 11 are partial, 6 are
genuinely new, and 3 are conflicts with a rule the repository already has (the colon rule,
the not-X-but-Y carve-out, and the "load-bearing" word ban).
`[SOURCE: context/claude-style-patch-main/STYLE.md:1-95]`
`[SOURCE: context/claude-style-patch-main/README.md:1-42]`

### F2 — Classification table

| # | Source | Item | Status | Covering line, or what remains unnamed |
|---|---|---|---|---|
| 1 | STYLE.md:3 | Binding, with a re-check when the material turns long or dense | PARTIAL | Mechanically re-loads per action via Gate 5 (`AGENTS.md` §2), so the vigilance-based re-check is replaced by a structural trigger. The decay observation and its countermeasure are new evidence (README:34-35). |
| 2 | STYLE.md:7,9 | Straightforward sentences, short declaratives as the default | COVERED | `repo-rules/communication.md:72`; `HVR:79` |
| 3 | STYLE.md:9 | Aim for conceptual grip: a cleaner model, moving parts named, the mechanism shown | PARTIAL | The negative side is covered (`communication.md:73-74`, `:97`: the reader stops decoding). The positive instruction to name the mechanism is unnamed. |
| 4 | STYLE.md:11 | Concise, not compressed or telegraphic; aphorisms are not explanations | PARTIAL | The omit-side is covered (`communication.md:190-192`; `HVR:69`). No compression rule exists anywhere (`grep` for `compress`, `telegraph`, `telescop` over `repo-rules/` and HVR returned nothing). |
| 5 | STYLE.md:15 | Fix the job before drafting, and what to leave out | PARTIAL | Cut-filler is covered (`communication.md:150-158`). The pre-drafting step is unnamed. Pairs with clarity rule 3 (iteration 1, partial). |
| 6 | STYLE.md:19 | Subject as noun, action as verb, straight line to the object | COVERED | `communication.md:72` |
| 7 | STYLE.md:19 | Convert abstract nominalizations into verbs | NEW | No `nominaliz` hit in HVR or `sk-communication`. The stack names one idea per sentence and simple words; the nominalization move itself is unnamed. |
| 8 | STYLE.md:21 | Anglo-Saxon over Latinate when precision holds | PARTIAL | Direction covered by `HVR:73-76` ("Use common words. If a simpler word exists, use it"). The etymological test is a sharper operationalization that no line states. |
| 9 | STYLE.md:23 | Clear antecedents; pronouns have readable provenance | COVERED | `HVR:441-442` (`it` needs a clear antecedent; `this` takes a noun); checklist item `HVR:509`. |
| 10 | STYLE.md:25-29 | The colon rule | CONFLICT | `repo-rules/communication.md:104-106` and `HVR:114` offer the colon as the em-dash replacement. Full treatment in F3. |
| 11 | STYLE.md:33 | No signaling phrases; start with the point | COVERED | `HVR:174-187` setup-language list; phrase blockers `HVR:393-397`; `communication.md:153` |
| 12 | STYLE.md:33 | Delete the label half, or turn it into its own sentence | PARTIAL | Same gap as F3's second half. The stack bans openers and setup phrases, not intra-sentence label-then-payload joins. |
| 13 | STYLE.md:35 | No verbless fragments as sentences or paragraph openers | NEW | `grep` for `fragment` over `AGENTS.md` and `repo-rules/` hits only `communication.md:81` ("fragment a single argument"), unrelated. No fragment rule exists; the repaired merge is unnamed. |
| 14 | STYLE.md:39 | No depth-signaling ("the real issue underneath") | COVERED | `HVR:304` significance inflation; `HVR:318` meta-commentary; `HVR:396` ("The real question is"). |
| 15 | STYLE.md:39 | Not-X-but-Y only for genuinely competing explanations | CONFLICT | `HVR:140-145` bans the construction outright (see F5). |
| 16 | STYLE.md:37 | The unifying diagnosis: a label before the payload is narrating your own discourse plan | NEW | Nearest line `communication.md:158` ("announcing a tool call the reader can see the result of") is one narrow instance, not the principle. |
| 17 | STYLE.md:41-43 | Stacked compression: metaphor plus nominalization packed adjacent | PARTIAL | Analogy half covered (`HVR:189-198` one analogy per concept, placement after the fact; `HVR:200-223` banned metaphors). The adjacency diagnosis and its nominalization ingredient are unnamed. |
| 18 | STYLE.md:47 | Bullets for parallelism, paragraphs for causality and sequence | COVERED | `communication.md:79-82` states the near-identical rule ("the list format implies the items are independent"). |
| 19 | STYLE.md:49 | Functional transitions; each section answers an implied reader question | PARTIAL | Transition discipline exists from the other side (`HVR:429` penalizes however/furthermore on third use). The implied-question ordering model is unnamed. Pairs with clarity rule 15. |
| 20 | STYLE.md:51 | Bold and italics only when genuinely additive | COVERED | `HVR:117` (asterisk emphasis never in output); `HVR:471`. |
| 21 | STYLE.md:51 | Tractatus numbering for complex hierarchies | NEW | No `Tractatus` hit in `AGENTS.md`, `repo-rules/` or `sk-communication`. The repo's numbering rules (`HVR:474-476`) are document-half, excluded from replies by `communication.md:121-126`, so a reply numbering scheme has no home today. |
| 22 | STYLE.md:55 | Keep the answer's shape proportional to the task | COVERED | `communication.md:132-137` |
| 23 | STYLE.md:57 | End when the content ends; no resolving closer; cut a last sentence that adds nothing | COVERED | `HVR:277-285` generic positive conclusions; `communication.md:154` restated summaries. |
| 24 | STYLE.md:59,68 | Questions only when essential; never engagement-bait endings | COVERED | `presenting-decisions.md:96` ("A question that would not change what you do is not a clarifying question, it is a delay"); `handoff-and-questions.md:101-116`; `HVR:435`. |
| 25 | STYLE.md:63 | Corrections direct, unabashed and specific | COVERED | `AGENTS.md:209` ("Truth over agreement — correct user misconceptions with evidence; never agree for conversational flow"). |
| 26 | STYLE.md:67 | Natural color and playfulness welcome | COVERED | `HVR:324` and `HVR:510-511` (sterile writing still reads as AI; personality required). |
| 27 | STYLE.md:69 | Do not say "honestly" | COVERED | `HVR:427` lists "honestly" as filler. |
| 28 | STYLE.md:69 | Do not say "load-bearing" or "crux" | CONFLICT | `load-bearing` is framework vocabulary used 4 times across `AGENTS.md` and `repo-rules/` (see F5). |
| 29 | STYLE.md:73-77 | A worked exemplar paragraph as the style target | NEW | HVR carries wrong/right micro-examples (`HVR:79-81`), but no stack surface carries a single holistic exemplar. Technique, not a rule. |
| 30 | STYLE.md:79-81 | Documents: scannable in 30 seconds, headers as labels, nesting must earn itself | PARTIAL | Document structure exists (`HVR:287-300`, `HVR:473-489`; tables `HVR:147-154`). "Headers are labels, not sentences" and the 30-second test are unnamed. |
| 31 | STYLE.md:83-89 | Code comments: concise, present-state, no archaeology, no comment tics | PARTIAL | `AGENTS.md:44` bans ephemeral labels in comments and keeps the durable WHY; `sk-code-quality` runs comment hygiene per file (`.opencode/skills/sk-code/SKILL.md:27`). The present-state/no-archaeology half was not verified against `sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md` this iteration (read budget). |
| 32 | STYLE.md:91-93 | Explain the options before the decision is requested | COVERED | `handoff-and-questions.md:101-113` (nameable alternatives, recommendation attached); `presenting-decisions.md:65-69`. |
| 33 | README:16-18 | Rule shape: name the habit, show an example, give the rewrite (a ban beats a stated preference) | PARTIAL | HVR already uses the shape (`HVR:79-81`, `:140-145`). Repo rule files use rule plus failure-prevented plus self-check (`communication.md:114`, `:150-161`), so the example-and-repair ingredient is absent there. |
| 34 | README:34-35 | Compliance decays on long threads; a direct "hew closely to the response style" nudge helps before long prose | NEW (evidence) | No repo equivalent. This is mechanism-half evidence; designing the injection mechanism is a strategy §4 non-goal (an active packet at `specs/hooks/022-smart-rule-injection` owns it). |

### F3 — The colon rule is a real conflict, and the repository teaches the banned pattern by example

STYLE.md forbids any colon followed by a clause except a literal list of three or more
(`STYLE.md:27`) and forbids label-then-payload and clause-leading-to-colon joins (`STYLE.md:29`).
The repository does the opposite in two places. `repo-rules/communication.md:104` tells the
writer to replace an em dash with "a comma, a full stop or a colon, whichever the sentence
actually wanted", and `:106` names "a list that belongs after a colon" as a legitimate case.
`HVR:114` repeats the same replacement table: em dash → "Comma, full stop or colon". So the
exact point of disagreement is whether a colon may introduce a non-list clause. The repo offers
it as a permitted replacement; STYLE requires two sentences or a `because/so/but/and` join.

The conflict is not abstract, because the repository's own rule prose uses the banned shape.
`repo-rules/communication.md:113` reads "**The failure this prevents:** dashes read as authored
voice to a human and as a tell to a reader who has seen a lot of generated text" — a left side
naming what the right side does, which is exactly `STYLE.md:29`'s first ban.
`AGENTS.md:144` uses the same construction ("... communicate on any non-trivial task: keep every
load-bearing claim legible..."). Adoption of the colon rule would therefore require amending
`communication.md:104-106` and the `HVR:114` table row, and would flag the house style of both
rule files as violations. Resolution status: unresolved and operator-facing. Both rules are
internally consistent; they disagree about the colon-as-connector, not about lists.
`[SOURCE: repo-rules/communication.md:104-106]` `[SOURCE: HVR:114]`
`[SOURCE: repo-rules/communication.md:113]` `[SOURCE: AGENTS.md:144]`

### F4 — Cross-source check: STYLE.md does not carry the pre-drafting reader model, so the clarity owning-surface recommendation does not strengthen here

Clarity rules 1-2 (iteration 1, F3) name choosing a specific reader and inventorying what the
reader knows against what they need, both before drafting. STYLE.md constrains the reader's
experience but never names audience selection or a knowledge inventory: its reader-facing lines
are all in-flight (`STYLE.md:9` cleaner model on arrival, `:11` enough steps for the user to
climb, `:23` antecedents the reader should not have to investigate, `:43` never leave a reader
inside a metaphor, `:93` explain options before the decision). Reading that list as a reader
model would be an inference, not a citation. Result: the two-source signal the iteration prompt
asked about does not materialize for reader selection, and the `presenting-decisions.md`
owning-surface recommendation for clarity 1-2 stays single-source until the ADHD source is read.
What does strengthen is a different pair of signals, recorded in F5 and F6 below.
`[SOURCE: context/clarity.md:37]` `[SOURCE: context/clarity.md:47]`
`[SOURCE: context/claude-style-patch-main/STYLE.md:9-11]`

### F5 — Two further conflicts and one two-source signal

- **Not-X-but-Y.** `STYLE.md:39` says not to use the antithesis as a rhythmic habit and permits
  it when the contrast is genuinely competing. `HVR:140-145` bans the construction and its
  variants outright ("Never use this construction or variants ... Lead with the stronger point").
  Conflict on exactly one point: whether a genuine contrast may ever take that shape. The
  repository is the stricter side; adopting STYLE would relax `HVR:140`.
  `[SOURCE: HVR:140-145]` `[SOURCE: context/claude-style-patch-main/STYLE.md:39]`
- **"Load-bearing".** `STYLE.md:69` bans the word. The repository uses it as core vocabulary for
  evidence-carrying claims: `AGENTS.md:144` ("keep every load-bearing claim legible"),
  `AGENTS.md:243` ("A load-bearing claim carries its evidence"), `repo-rules/handoff-and-questions.md:39`
  ("this rule earns its load"). Four occurrences across `AGENTS.md` and `repo-rules/`. A domain
  split is available (STYLE targets reply prose; the phrase lives in framework prose), but the
  phrase sits in text that loads into every turn, so the conflict needs a decision rather than a
  gloss. `[SOURCE: AGENTS.md:243]` `[SOURCE: repo-rules/handoff-and-questions.md:39]`
- **Pre-drafting intent becomes a two-source signal.** `STYLE.md:15` fixes what the response is
  doing and what to leave out before drafting; clarity rule 3 (iteration 1, partial) decides the
  takeaway before drafting. Neither has a named home. This is the strongest adoption candidate
  this iteration, and it lands beside `presenting-decisions.md` §1, where iteration 1 already
  placed the clarity rule 3 boundary note.
  `[SOURCE: context/claude-style-patch-main/STYLE.md:15]`

### F6 — Sequential progression also becomes a two-source signal

`STYLE.md:49` gives sections an ordering job: each answers an implied reader question.
Clarity rule 15 (iteration 1, F6) requires each paragraph to earn the next. Both name
sequential dependency; the stack names only local independence (`communication.md:76`, the
atomic-paragraph rule). Two independent sources now point at the same unnamed axis, which
strengthens the case that the progression rule is a real gap rather than one author's taste.
`[SOURCE: context/claude-style-patch-main/STYLE.md:49]`

### F7 — Owning-surface recommendations for this source's candidates

- Pre-drafting intent (`STYLE.md:15` plus clarity rule 3): `presenting-decisions.md` §1, as a
  pre-drafting boundary note. Iteration 1 recommended the same file for clarity rules 1-3.
- Label-before-payload principle (`STYLE.md:37`) with the fold repair (`STYLE.md:33`):
  `communication.md` §6, but the file is at its ceiling (`communication.md:49-51`), so a split
  precedes any append. The same constraint already applies to clarity rules 10 and 15.
- Nominalization and stacked compression (`STYLE.md:19`, `:43`): HVR §4, beside the analogy
  rules. This is the only candidate here with no reply-versus-document ambiguity.
- Fragment ban (`STYLE.md:35`): `communication.md` §6 beside the empty-opener entry. Note the
  tension: the repo's own "Clipped — act, don't narrate" register (`AGENTS.md:153`) tolerates
  terse constructions, so adoption should scope the ban to openers and labels, which is what
  STYLE.md itself does (fragments stay legal inside parentheses or after a dash).
- Colon rule: an amendment decision against `communication.md:104-106` and `HVR:114`, not a
  silent merge (F3).
- "Not-X-but-Y" carve-out: no change recommended; keeping `HVR:140`'s absolute ban is the
  status quo and STYLE.md's permission is the weaker side.
- Tractatus numbering (`STYLE.md:51`): no existing surface. The reply-side formatting lane does
  not exist, and the document lanes are excluded from replies by design (`communication.md:121-126`).
- Exemplar paragraph (`STYLE.md:73-77`): HVR §2, as a worked target beside the micro-examples.
- Rule shape from README (`README.md:16-18`): a template-level question for the repo-rule file
  contract, not a communication rule. HVR already demonstrates the shape.
  `[SOURCE: repo-rules/communication.md:49-51]` `[SOURCE: repo-rules/communication.md:121-126]`

### F8 — The comments half is partial and one check was deferred

STYLE.md's comment section has two halves. The label-hygiene half is covered by `AGENTS.md:44`
plus `sk-code-quality`'s per-file comment check (`sk-code/SKILL.md:27`). The present-state,
no-archaeology half, and the application of the prose tics to comments (`STYLE.md:89`), have no
verified owner: HVR's scope is documents (`HVR:29`), `communication.md` governs replies, and the
`sk-code-quality` checklist asset
(`sk-code-quality/assets/code-quality-checklist/overview-header-and-comments.md`) was not read
this iteration under the tool budget. Recorded as residual uncertainty, not as a finding of
absence. The narrowest reread to close it is that one asset file.
`[SOURCE: AGENTS.md:44]` `[SOURCE: .opencode/skills/sk-code/SKILL.md:27]` `[SOURCE: HVR:29]`

### F9 — Six candidates converge on `communication.md` while it is at its ceiling

Rows 4, 12, 13, 16, 19 and the residual of row 21 all want `communication.md` §2 or §6. The file
already recorded that it hit a length ceiling and split decision-shape content out
(`communication.md:49-51`). Any adoption phase therefore starts with a split decision for this
file, and that decision now has two independent sources behind it (clarity rules 10, 15 and
17; STYLE.md rows 4, 12, 13, 16, 19). This is a routing finding for the phase's plan, not a
content gap. `[SOURCE: repo-rules/communication.md:49-51]`

## Ruled Out

- STYLE.md as a second source for a pre-drafting reader model: its reader constraints are
  in-flight only (`STYLE.md:9`, `:11`, `:23`, `:43`, `:93`); no audience-selection or
  knowledge-inventory step appears. `[SOURCE: context/claude-style-patch-main/STYLE.md:9-11]`
- The README install and license sections as communication recommendations: they are
  distribution metadata (`README.md:20-30`, `:39-41`). The adoptable README content is the rule
  shape (`:16-18`) and the long-thread decay evidence (`:34-35`).
- The depth-signaling ban and the "honestly" ban as new: covered by `HVR:304`, `HVR:318`,
  `HVR:396` and `HVR:427`.
- The comment-tic half as covered by HVR: HVR's scope is documents (`HVR:29`), so it cannot
  cover code comments; but the `sk-code-quality` comment checklist was not read, so this is
  "unverified owner", not "no owner".

## Dead Ends

- No new dead ends to promote. The `sk-communication` display-only boundary and the
  single-surface undercount trap from iteration 1 were re-confirmed this iteration
  (`communication.md:116-126`) and remain the two standing constraints.

## Edge Cases

- Ambiguous input: none. The strategy's §11 focus names the source and the method.
- Contradictory evidence: three conflicts (F3 colon; F5 not-X-but-Y; F5 "load-bearing"). One is
  by design on the repo side (HVR's absolute antithesis ban is stricter than STYLE's permission),
  one needs an operator decision (colon), and one needs a scope decision (whether the word ban
  reaches framework vocabulary). None is silently merged.
- Missing dependencies: the `sk-code-quality` comment-checklist asset was not read under the
  tool budget; only row 31's second half is affected. Recorded above with the closing reread.
- Partial success: none. All planned reads completed; the negative checks used `grep` and are
  cited where they ground a "no rule exists" claim.

## SCOPE VIOLATIONS

None. Every write stayed inside the allowed list (`research/iterations/iteration-002.md`,
`research/deltas/iter-002.jsonl`, and the gateway's own writes into the run directory).
`progressiveSynthesis` is `true`, but the prompt pack's allowed-write list excludes
`research/research.md` and the strategy declares it workflow-owned, so it was left untouched for
the workflow reducer, same as iteration 1.

## Sources Consulted

- `specs/sk-communication/006-sk-communication-clarity/context/claude-style-patch-main/STYLE.md:1-95`
- `specs/sk-communication/006-sk-communication-clarity/context/claude-style-patch-main/README.md:1-42`
- `specs/sk-communication/006-sk-communication-clarity/context/clarity.md:37-50`
- `repo-rules/communication.md:1-202`
- `repo-rules/presenting-decisions.md:1-156`
- `repo-rules/handoff-and-questions.md:1-165`
- `AGENTS.md:44`, `:144`, `:153-154`, `:209`, `:243`
- `.opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md:29`, `:69-96`,
  `:109-127`, `:140-145`, `:147-198`, `:200-223`, `:277-300`, `:304-324`, `:393-397`, `:427-445`,
  `:471-512`
- `.opencode/skills/sk-code/SKILL.md:27`
- `grep` negative checks: `nominaliz`, `compress|telegraph|telescop`, `Tractatus`, `fragment`,
  `load-bearing` over `AGENTS.md`, `repo-rules/`, HVR and `sk-communication`

## Assessment

- New information ratio: 0.43 — of 34 items, 6 are fully new (nominalization, fragment ban,
  the label-before-payload principle, Tractatus numbering, the exemplar technique, the
  long-thread decay evidence), 3 are conflicts that count as new (colon, not-X-but-Y,
  "load-bearing"), and 11 are partially new, so `(6 + 3 + 0.5 x 11) / 34 = 0.43`.
- Questions addressed: key questions 1, 2, 3 and 4 for the `claude-style-patch` share;
  key question 3 now has three named conflict points with exact citations.
- Questions answered: none fully. Coverage is source-complete only after `i-have-adhd-main`.

## Reflection

- What worked and why: reading the source and all three stack rule files plus HVR before the
  first classification, as iteration 1's lesson prescribed. This time there were no false "new"
  verdicts from a single-surface read; the 14 covered rows all cite a line that closes them.
  The five negative `grep` checks were the cheapest evidence in the iteration: they convert
  "I did not see a rule" into "no rule contains this term", which is the difference between an
  inference and a citation for a NEW verdict.
- What did not work and why: row 31's comment half is under-evidenced. I confirmed that
  `sk-code-quality` owns a comment checklist and stopped at the folder listing, so the
  present-state half is a deferred verification rather than a finding. The cause is budget
  arithmetic, not source availability; one `Read` of the checklist asset would close it.
- What I would do differently: budget the checklist asset into the next iteration that touches
  the code-comment surface, and keep the conflict rows separate from the coverage rows when
  computing the ratio so a conflict is never counted as coverage of the rule it disagrees with.

## Questions Answered

- None fully. Key questions 1, 2, 3 and 4 are answered for the `claude-style-patch` share only.
  Key question 3 gained three cited conflict points for this source (F3, F5).
  `[SOURCE: research/deep-research-strategy.md section 3]`

## Questions Remaining

- `i-have-adhd-main` remains uninventoried, including the mechanism half: session-start hook,
  runtime mirrors, eval harness and release gate (key question 5).
- Cross-source synthesis across clarity.md and STYLE.md is now largely in place (two two-source
  signals: pre-drafting intent, sequential progression) but the final owning-surface map waits
  for the third source.
- The deferred `sk-code-quality` comment-checklist read (F8).

## Next Focus

Iteration 3 inventories `context/i-have-adhd-main` (SKILL.md, hooks, runtime manifests, evals)
with the same covered / partial / new classification, plus the mechanism-half question keyed to
the session-start hook, runtime mirrors, eval harness and release gate by path.

## Recommended Next Focus

Iteration 3: read `i-have-adhd-main/skills/i-have-adhd/SKILL.md` and its `agents/` folder first,
then `hooks/always-on.mjs` with `hooks/hooks.json`, then `extensions/`, `opencode.json` and
`evals/` (including `RESULTS.md` and `rubric.md`). Carry two checks forward: whether the ADHD
source carries a pre-drafting reader model (the open cross-source question from F4), and whether
its mechanism half has any counterpart in this repository's hook, agent-manifest or eval
surfaces. Close the F8 comment-checklist reread only if the iteration stays under budget.
