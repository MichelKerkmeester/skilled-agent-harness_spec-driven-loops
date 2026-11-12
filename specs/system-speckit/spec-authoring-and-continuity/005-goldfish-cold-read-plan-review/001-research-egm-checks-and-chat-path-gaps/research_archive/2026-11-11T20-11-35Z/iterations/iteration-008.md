# Iteration 8: Test the two clauses the edit set never earned — the level qualifier and the backstop

## Focus

All five strategy questions are ticked and iteration 7 closed by saying research was complete. Two clauses of the resulting edit set had never been tested, and both were inheritances from earlier iterations rather than measurements:

1. **The level qualifier.** Iteration 2's finding 12 asserted the plan-shape rule "must carry a level qualifier or it raises Level 1 cost". Nobody checked whether Level 1 even has the artifact the rule governs.
2. **The retroactivity radius that justified withdrawing the backstop.** Iteration 7 measured 23% of the corpus failing a strict phase rule and made that the reason the optional validator rule is a "deliberate exception". One number carried a whole architectural decision.

Both are one-step tests, and either one falsifying would shrink the edit set. Selected interpretation of an ambiguous dispatch: the focus field reads `[All tracked questions are resolved]`, which is not a focus. Chosen: test both clauses, because each terminates in a number that either keeps or drops a target. Deferred alternative: the residual plan-soundness gap, which three iterations have now confirmed has no candidate carrier and would produce a less precise restatement of the same sentence.

## Actions Taken

1. Read the full section 6 region of the authoring card (`:96-143`) to take the exact current text of the rule (`:113`), the worked example (`:120`) and the acceptance/verify pair (`:123-124`) rather than the paraphrase the earlier iterations carried.
2. Read `AGENTS.md:140-190` and re-derived the Devin delivery window arithmetically: bytes before `:176`, `:176`'s own length, and the residual budget for a bullet placed after it.
3. Read `folder-structure.md:126-175` to settle whether `plan.md` is a Level 1 document, then read `create.sh:305-330` for the template-composition statement.
4. Read `plan.md.tmpl:118-150` to see whether `## 4. IMPLEMENTATION PHASES` sits inside a level guard, and located the guard construct elsewhere in the same file for contrast.
5. Cross-tabulated heading presence against packet level over the corpus twice, by two structurally different derivations: `os.walk` over the working tree (6,098 files) and `git ls-files` (4,915 files), joining each `plan.md` to the nearest `description.json`'s `level`.
6. Sampled 400 of the 1,183 files that differ between the two derivations through `git check-ignore --stdin` to establish *why* they differ, instead of asserting it.
7. Wrote the strict phase predicate and ran it over the tracked corpus to measure existing adoption, then over a draft of the amended card example to confirm the amended text would pass its own check.

## Findings

1. **New: the level qualifier protects nothing, because the phases section is level-independent.** `plan.md.tmpl` uses `<!-- IF level:... -->` guards extensively (`:1`, `:4`, `:7`, `:10`, `:13`, `:16`, `:97`, `:203`, `:286`), and `## 4. IMPLEMENTATION PHASES` at `:123` sits between the `<!-- ANCHOR:phases -->` marker at `:122` and its close at `:127` with **no** guard — while `## 5. TESTING STRATEGY` at `:132` is guarded twice in the same file, at `:135` for level 1 and `:138` for levels 2, 3 and 3+. The corpus agrees: heading presence is 96.6% at Level 1 (1,667 of 1,725), 96.2% at Level 2 (2,380 of 2,474), 93.4% at Level 3 (596 of 638) and 90.6% at Level 3+ (29 of 32). `create.sh` states the reason in its own help text: "Core templates (~270 LOC) are shared across all levels." So a qualifier would exempt only the ~3.4% of Level-1 packets *missing* the heading, while the template forces the heading on every new Level-1 packet regardless. Iteration 2's finding 12 required the qualifier; the requirement is withdrawn. [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:122-127] [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:132-144] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:322-324] [INFERENCE: from the tracked-corpus cross-tab of heading presence against `description.json` `level`]

2. **New: `plan.md` is a Level 1 document, so the rule is in Level 1's scope by contract anyway.** `folder-structure.md` lists `plan.md` under Level 1's Required Files, directly after `spec.md` and before `tasks.md`. A rule about the plan's shape cannot be "a Level 2 and above" rule while the plan exists at Level 1, and the same document lists only `acceptance-criteria.md` as the file that Level 1 omits. [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:129-138] [SOURCE: .skilled/skills/system-spec-kit/references/structure/folder-structure.md:144-154]

3. **New, and it withdraws the backstop half of the recommendation: the strict phase predicate is a new obligation, not the enforcement of existing practice.** Ran the predicate iteration 7 wrote — three lines inside `## 4. IMPLEMENTATION PHASES`, each holding a backticked token and a `Verify:` clause with a command — over 4,915 git-tracked `plan.md` files. Result: **1 passes.** Loosened to "at least three body lines under the heading" the figure is 68.3% (3,359), and "the section names Setup, Implementation and Verification somewhere" is 66.0% (3,242). So the corpus writes *some* phase prose two thirds of the time and the path-plus-proof shape essentially never. A validator rule for that shape would fail 4,914 packets on the day it landed — which is not a scoping problem that a creation-date cutoff fixes, it is a rule whose subject has no existing instances to enforce. Iteration 7's dead-end ("requiring the phase predicate at every documentation level converts a prose fix into a migration project") is superseded: the reason is stronger than migration cost, it is that the obligation is new, and a new obligation belongs in the prose that teaches it and nowhere else yet. The optional new script plus registry entry is withdrawn from the recommendation. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:13-25] [INFERENCE: from the predicate run and the two loosened variants over `git ls-files specs`]

4. **New, and a correction of iteration 7's most load-bearing number: the retroactivity radius was inflated ~5× by a denominator that included gitignored files.** Iteration 7 reported 4,677 of 6,098 = 76.7%. Tracked denominators give 4,692 of 4,915 = 95.5%, i.e. 223 packets missing the heading, 4.5% not 23%. The two numerators agree to within 15 files; the denominators differ by 1,183 — which is exactly the population `find` sees and `rg -l` does not, because `rg` honours `.gitignore`. Sampling 400 of those 1,183 through `git check-ignore --stdin` returned 400 ignored out of 400. **Contradictory evidence, resolved in favour of the tracked denominator** (4,915 files, 95.5%): the rule a validator would apply runs in CI over tracked files, and iteration 7's figure was a tracked numerator over a working-tree denominator. The discarded number is preserved here rather than deleted, because it shipped a conclusion for one iteration. [INFERENCE: from `git ls-files specs` (4,915) against the `os.walk` population (6,098), differenced and sampled through `git check-ignore`]

5. **New: the card and the plan template contradict each other about where the phases live, and the template wins because it is in the file.** Card `:113` says the plan "names its three phases, Setup, Implementation and Verification, one line each, under `## 4. IMPLEMENTATION PHASES`". Template `:126`, in the body of that same section, says "Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state." A packet author reading the scaffolded file is told the phases are `tasks.md`'s business; the card, which is a reference the session may or may not have open, says they are the plan's. Finding 3's 0.02% adoption is what that contradiction produces. **This is why the edit set has to reach the template**: amending the card alone would leave the artifact every packet is actually generated from saying the opposite. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:113] [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:126]

6. **Partially new: the final edit set is six amended lines across three existing files, zero new files, and the delivery arithmetic re-confirms itself.** `AGENTS.md` is 27,372 bytes; the 16,384-byte injection window ends 1,061 bytes past the start of `:176`, and `:176` itself occupies 135 bytes, so a bullet inserted after it has 926 bytes — the same figure iterations 5 and 6 carried, now derived independently from byte offsets rather than inherited. The draft bullet measures 291 bytes, a third of the budget. The six lines are: card `:113` (the decidable shape, no level qualifier), card `:120` (the worked example brought into compliance — it currently fails the predicate with zero matches, per finding 3's run), card `:123-124` (acceptance matched to the amended rule; verify naming `IMPLEMENTATION PHASES` rather than the number `4`), template `:124` (the fill note teaches path-plus-proof, not just "name the three phases"), template `:126` (the `tasks.md` ownership clause qualified so it stops contradicting `:124` and the card), and the `AGENTS.md` bullet. Two targets dropped since iteration 7: the level qualifier clause and the new validator script with its registry entry. [SOURCE: AGENTS.md:176] [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:124] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:120]

## Questions Answered

Empty, and deliberately so. All five strategy key questions were ticked before this iteration, so `answeredQuestions` is `[]` rather than re-ticking a ticked box. This iteration answered two questions the strategy never listed and that the prior seven iterations had each inherited rather than tested: whether the plan-shape rule needs a level qualifier, and whether the measured retroactivity radius justifies the only new file the recommendation still contemplated. Both answer no.

## Questions Remaining

None tracked, and the count of carried implementation constraints has gone **down** for the first time in this run:

- **Implementation constraint (final):** six amended lines across three existing files — card `:113`, `:120`, `:123-124`; template `:124`, `:126`; one `AGENTS.md` bullet after `:176` within 926 bytes. No new file, no new hook, no new rule, no new command.
- **Withdrawn this iteration:** the level qualifier (finding 1), and the optional validator script plus registry entry (finding 3). Neither should be written. Whoever implements must not reinstate either.
- **Carried, unchanged:** the `AGENTS.md` bullet must not reinstate a review-verdict clause (iteration 6).
- **Carried, unchanged:** the verify at card `:124` must name the heading, not the number `4`, or it passes on `specs/cli-orca/001-mcp-orca-cli/plan.md:114`, a plan with no phases section at all (iteration 7).
- **Residual coverage gap (unchanged, three iterations):** plan soundness has no chat-path carrier. The decidable-shape rule proves a stranger can locate each step and run its proof; it does not prove the plan is sound. Nothing in this iteration narrows that, and finding 3 makes it worse in one respect: a plan can now be *shaped* correctly and still be wrong, which is a more comfortable failure mode than the current one but not a solved one.

## Ruled Out

- **Keeping the level qualifier out of caution.** It reads as the safe choice, but the phases section is unguarded in the template at every level and Level 1 requires `plan.md`, so the clause would exempt a packet class that already carries the heading 96.6% of the time. A clause that changes nothing on the scaffolded path is dead text in a section whose problem is that it already says too much and disagrees with itself.
- **Taking the backstop with a creation-date cutoff, following `AC_CLOSURE`'s dated-scoping precedent.** `folder-structure.md:156` shows the mechanism exists and works. Rejected on finding 3 rather than on cost: a dated cutoff suits a rule whose subject is universally present and newly required, and the path-plus-proof line is present in 1 of 4,915 packets, so the cutoff would police a behaviour nothing has ever produced while the prose that would produce it is the thing being shipped.
- **Fixing the card alone and leaving the template's `tasks.md` ownership clause in place.** Finding 5's contradiction is bidirectional; amending one side leaves the scaffolded file instructing the opposite of the reference. The template edit is not a nice-to-have, it is the half that reaches sessions which never open the card.

## Dead Ends

- **The strict predicate as a rule.** 1 of 4,915. Recorded as finding 3 rather than as a defective predicate — the predicate does discriminate (it returns 3 on the amended example, 0 on the current `:120`), which is what a rule needs and a corpus does not have.
- **`description.json`'s `level` as a reliable corpus join key.** It works for 4,915 tracked packets, but 38 carry `unset` and 6 have no description at all; those 44 sit at 47.4% and 33.3% heading presence. Not a defect worth chasing — the join is strong on the population that matters — but a future corpus measurement should report the unjoined residue instead of folding it into the denominator, which is the same error finding 4 corrects.

## Edge Cases

- **Ambiguous input:** the dispatch focus is `[All tracked questions are resolved]`, not a task. Chosen: the two untested clauses of the edit set, with the deferred alternative (the soundness gap) recorded in Focus. Not escalated; a fan-out lineage has no operator to answer.
- **Contradictory evidence:** finding 4 is one, and it is the first time in this run that a prior iteration's *number* rather than its interpretation is contradicted. Both readings are preserved with their derivations, and the resolution is stated with its reason (CI runs over tracked files). No earlier finding rested on the 76.7% figure except the backstop's withdrawal, which now rests on finding 3 instead — a reason that survives the correction.
- **Missing dependencies:** none. `resource-map.md` is absent, as every prior iteration recorded; the coverage gate is skipped by the loop and no finding depends on it.
- **Partial success:** finding 6's 926-byte figure is a re-derivation, not a new measurement, so it is labelled partially new. Every other finding resolves to a verdict that changes the edit set.

## Sources Consulted

- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:96-143` — section 5's `plan.md` bullet (`:98`), section 6's rule (`:113`), worked example (`:120`), acceptance/verify pair (`:123-124`)
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:118-150` — the unguarded `phases` anchor (`:122-127`), its fill note (`:124`), the `tasks.md` ownership sentence (`:126`), the guarded testing section (`:132-144`)
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:1-16`, `:97`, `:203`, `:286` — the `<!-- IF level:... -->` guard construct and its uses
- `.skilled/skills/system-spec-kit/references/structure/folder-structure.md:126-175` — Level 1 required files including `plan.md` (`:135`), the Level 2/3 lists, the `AC_CLOSURE` dated-scoping precedent (`:156`)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/create.sh:305-330` — the level ladder and "Core templates (~270 LOC) are shared across all levels"
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:13-25` — what a backstop would have had to join
- `AGENTS.md:140-190` — the completion gate's `Skip: Level 1` line (`:144`), the blast-radius section and `:176`, the execution-behaviour bullets (`:181-189`)
- Corpus derivation A: `git ls-files specs` → 4,915 `plan.md`; heading presence 4,692 (95.5%); by level 1/2/3/3+ = 96.6 / 96.2 / 93.4 / 90.6%
- Corpus derivation B: `os.walk` over `specs` → 6,098 `plan.md`; heading presence 5,821; 1,183 files in A∖B, 400 of 400 sampled are `git check-ignore`d
- Predicate run: strict (backtick + `Verify:` × 3 in section 4) = 1/4,915; loose (≥3 body lines) = 3,359 (68.3%); phase words present = 3,242 (66.0%)
- `iteration-007.md` (the 76.7% figure under test and the edit set it produced), `iteration-002.md` finding 12 (the level qualifier under test), strategy §3, §6, §9, §11A

## Assessment

- New information ratio: 0.92 — six findings: five fully new (the level-independence of the phases section and its corpus distribution; `plan.md`'s presence at Level 1; the strict predicate's 1-in-4,915 adoption; the corrected retroactivity radius; the card/template contradiction) and one partially new (the six-line edit set with its re-derived delivery arithmetic, which is bookkeeping over the five). (5 + 0.5) / 6 = 0.917 → 0.92. No simplicity bonus claimed, although the iteration removes two targets from the recommendation: the simplification is a consequence of the new measurements rather than of synthesis over existing evidence, and claiming both would price one result twice.
- Questions addressed: whether the plan-shape rule needs a level qualifier; whether the measured retroactivity radius justifies the recommendation's one remaining new file.
- Questions answered: both — no to each — and neither is a strategy key question, all five of which were already ticked, so `answeredQuestions` is `[]`.

## Reflection

- **What worked and why:** both clauses fell to a single measurement each, and both were inherited rather than derived. The reason is visible in the shape of the failures: the level qualifier came from *reasoning about levels* (iteration 2 read the level ladder and inferred a cost) and the retroactivity radius came from *one count over the wrong population* (iteration 7 used `find` for the denominator and `rg` for the numerator, which are two different universes). Neither was ever re-derived by a second, structurally different method — and the moment each was, both changed. The general rule this run has now established three times: a clause inherited from an earlier iteration is an untested claim wearing the clothes of an established one.
- **What did not work and why:** the first cross-tab I ran used `os.walk` and produced 6,098 files, which reproduced iteration 7's denominator exactly — the same wrong number, arrived at independently. It was caught only because I ran the `git ls-files` derivation alongside it and the two disagreed by 1,183. Had I run either alone, I would have confirmed whichever error I happened to re-derive. This is iteration 7's own lesson (a count needs a second structurally different derivation) failing to transfer forward because it was recorded as a reflection rather than applied to the *inherited* numbers.
- **What I would do differently:** the two clauses I tested this iteration were both assumptions hiding inside a conclusion, and I found them by reading my own edit set and asking which of its words had a source. That pass should be the first action of any iteration that inherits an edit set, not the eighth — it costs one read of the recommendation and it located the two most consequential corrections in the run.

## Next Focus

Research is complete and the recommendation is now smaller than it was two iterations ago. The deliverable is one sentence: **do not build a mechanism — amend six lines across three files that a writing session already reads**, with the level qualifier dropped and the validator backstop dropped, each for a measured reason.

The implementation, outside this loop:

1. `AGENTS.md` after `:176`: one bullet, 291 bytes against a 926-byte ceiling. No review-verdict clause.
2. Card `:113`: add the decidable shape — each phase line names its path in backticks and ends with `Verify:` and the command that proves it. No level qualifier: the section is unguarded at every level and Level 1 requires `plan.md`.
3. Card `:120`: the worked example must satisfy the amended rule. It currently returns zero matches against it, and a rule taught by a counter-example is worse than no rule.
4. Card `:123-124`: acceptance restates the amended obligation; verify names `IMPLEMENTATION PHASES`, never the number `4`.
5. Template `:124`: the fill note teaches path-plus-proof, since that note is what an authoring session actually reads at scaffold time.
6. Template `:126`: qualify or drop the `tasks.md` ownership sentence. Left as is, the scaffolded file tells every new packet the opposite of what the card and the fill note say — which is the measured cause of the 1-in-4,915 adoption this iteration found.

Carried, unclosed: plan soundness still has no chat-path carrier, and nothing here narrows it.

## SCOPE VIOLATIONS

- `research/research.md` still does not exist although `deep-research-config.json` sets `progressiveSynthesis: true`. The dispatch's allowed-write list names only `iterations/iteration-008.md`, `deltas/iter-008.jsonl` and the append gateway's own writes, and the strategy's boundaries call `research/research.md` "workflow-owned canonical synthesis output". Recorded rather than executed, as in iterations 5, 6 and 7.
- No mutation was attempted against any researched path. The card, the template, `AGENTS.md`, `create.sh`, `folder-structure.md`, the validator registry and both corpus derivations were read only; the predicate and the two cross-tabs were computed in memory over content already on disk and printed to stdout. The single-record gateway event file is written to `/tmp`, outside the repository.
