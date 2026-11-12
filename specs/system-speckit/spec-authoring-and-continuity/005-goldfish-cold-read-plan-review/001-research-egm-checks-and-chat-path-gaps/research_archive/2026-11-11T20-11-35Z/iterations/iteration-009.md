# Iteration 9: Compile the edit set to the byte, and test where it can be delivered

## Focus

All five strategy questions are ticked and iteration 8 closed by saying research is complete. What eight iterations had produced is a **description** of the edit set — six target lines, a byte ceiling, and a list of clauses not to write — but never the **literal replacement text**, and never a test of the one thing the text cannot survive being wrong about: whether the carrier it is written into actually delivers it.

Chosen interpretation of an ambiguous dispatch: the focus field reads `[All tracked questions are resolved]`, which is not a focus. Selected: draft the six replacement lines and the `AGENTS.md` bullet, then verify the draft against the delivery window, against the drafted predicate, and against the corpus. Deferred alternative: the residual plan-soundness gap, which three iterations have confirmed has no candidate carrier and would have produced a fourth restatement of the same sentence.

## Actions Taken

1. Read card `:110-125` for the exact current text of `:113`, the worked example (`:117-121`), and the acceptance/verify pair (`:123-124`) — taking the text, not the paraphrase eight iterations had carried.
2. Read `plan.md.tmpl:116-132` for the fill note (`:124`), the `tasks.md` ownership sentence (`:126`), and the anchor pair around them.
3. Re-derived the `AGENTS.md` delivery window **per line**: byte offset of every line's start and end against the 16,384-byte limit, classification INSIDE / PARTIAL / OUTSIDE, and the residual insertion budget for each candidate slot.
4. Ran the current verify (`^## 4`) and the drafted replacement (`^## 4\. IMPLEMENTATION PHASES`) over the tracked corpus and enumerated the class the current one passes and the drafted one rejects.
5. Ran the drafted phase predicate over the drafted example and over the current example — the self-consistency check the edit set needs before anyone writes it.
6. Measured two candidate `AGENTS.md` bullets in bytes against both candidate slots rather than against the inherited 926-byte figure.
7. Reconciled the denominator against iteration 8's filter to confirm the reported figures are the same population.

## Findings

1. **New, and it moves the recommendation's placement: the 926-byte ceiling is a property of the slot iteration 8 chose, not of the mechanism — and the topically correct slot takes a 292-byte bullet.** Re-derived per line, `AGENTS.md` line `:176` starts at byte 15,323 and is 135 bytes long, leaving 926 B after it (iteration 8's figure, reproduced). But `:176` is the *first bullet of Blast-Radius Management*, and a plan-shape rule belongs under Execution Behavior. Byte offsets for that section: `:181` starts at 15,914 and ends at 16,073, leaving **310 B**; `:182` ends at 16,215; `:183` ends at 16,356, leaving **27 B**; `:184` starts at 16,357 and ends at 16,501. Two drafted bullets were measured: 351 B of text (352 B with its newline) fits only after `:176`, while 292 B (293 B with newline) fits after `:181` with 17 B to spare. The topical placement is therefore available, and the recommendation should take it — the 926 B figure was never a budget for the rule, only for one address. [SOURCE: AGENTS.md:176] [SOURCE: AGENTS.md:181] [INFERENCE: byte offsets computed over the file's raw bytes, not line-naive character counts]

2. **New, and it is a pre-existing delivery defect the topic did not know about: the Devin carrier truncates `AGENTS.md` inside Execution Behavior today.** With the window at 16,384 B: `:181`, `:182` and `:183` are delivered whole; `:184` is delivered as its first 27 bytes and then cut mid-sentence; `:185` through `:189` are not delivered at all. The clipped set includes "Settled stays settled" (`:185`), **"Plan before acting" (`:186`)** and "Do not stop early" (`:187`). So on that carrier a writing session is already missing the bullet that tells it to plan before acting, which is the nearest existing carrier to the object of this whole research question. This is a second, independently located instance of iteration 4's doc-recorded "could not be injected due to token limits", now with a line range instead of a symptom. [SOURCE: AGENTS.md:184] [SOURCE: AGENTS.md:186] [SOURCE: AGENTS.md:189] [INFERENCE: byte offsets 16,357-16,501 for `:184` against the 16,384 B limit]

3. **New, and it quantifies a defect iteration 7 found as a single instance: the current card verify false-passes on 118 of 4,812 loose matches.** Card `:124` verifies with `rg -n '^## 4'`. Over 4,965 tracked `plan.md` files that pattern matches 4,812; the heading it is supposed to prove (`^## 4\. IMPLEMENTATION PHASES`) matches 4,694. The 118-file gap is a class of section-4 headings that are not the phases section: `## 4. TESTING STRATEGY`, `## 4. AFFECTED SURFACES`, `## 4. ROLLBACK`, `## 4. ROLLBACK STRATEGY`, `## 4. PROOF PLAN` and `## 4. Phases`. Iteration 7 named one of them (`specs/cli-orca/001-mcp-orca-cli/plan.md`); it is one of 118. The drafted replacement (`^## 4\. IMPLEMENTATION PHASES`) keeps all 4,694 true passes and drops all 118 false ones — a strictly better verify with a measured radius and no migration cost, since the 118 already fail the rule they were never meant to satisfy. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:124] [INFERENCE: 4,812 loose vs 4,694 strict over `git ls-files specs | grep plan.md`]

4. **New: iteration 8's "1 of 4,915" numerator is an artifact of an over-strict predicate — the rule as drafted has ~31 existing instances, not 1.** Ran the predicate that the drafted rule text actually states — inside the phases section, a line holding a backticked token and a `Verify:` clause naming a backticked command — over the 4,965-file corpus: **37** plans pass at least one line and **31** pass all three. Iteration 8's variant demanded a `Verify:` command of a specific shape and returned 1. The withdrawal conclusion survives on the corrected number — 31 of 4,965 is 0.62%, and a rule failing 99.4% of the corpus on landing is still the migration project iteration 8 refused — but the figure that carried the decision was wrong by a factor of 31, in the same direction and by the same mechanism as the denominator error iteration 8 corrected. This time the error sat in the numerator, where nobody looked. [INFERENCE: predicate run over `git ls-files specs` filtered to `plan.md`]

5. **New: the drafted edit set compiles — the drafted example satisfies the drafted predicate 3 of 3, while the current example satisfies it 0 of 1.** The current `:120` body is one line of prose with a legitimate `--keep <n>` backtick and no `Verify:` clause, so it scores zero under its own rule; the drafted three-line example scores three. Byte measurements for the rest of the set, taken as written: card `:113` 271 B → 352 B (+81); card `:123` 224 B as drafted; card `:124` 64 B → 88 B (+24); template `:124` 255 B as drafted; template `:126` 203 B as drafted. Only the `AGENTS.md` bullet is resident every turn, at 293 B including its newline — roughly 73 tokens at 4 B/token, against the 2,048-character per-turn hook ceiling iteration 2 measured and the 60-93 KB command workflows the topic excludes. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:120] [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:124] [INFERENCE: byte counts over the drafted strings]

6. **Partially new, and it is a cross-reference obligation, not a size one: card `:113`'s sentence "That is the plan template's phases fill note" binds the two files to state one rule twice.** That sentence makes the card's rule and the template's fill note the same obligation in two places, so amending one without the other does not merely leave a stale reference — it breaks a claim each file makes about the other. The fill note's GOOD example ("Setup counts the archives. Implementation adds `--keep`. Verification counts 3.") fails the drafted rule for the same reason card `:120` does, and the fill note is the text an authoring session reads at scaffold time. Prior iterations named template `:124` as an instruction to amend; what this iteration adds is that its **example** is a second counter-example surface inside the same line, and that the card's cross-reference sentence is what makes leaving it impossible. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:113] [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:124]

7. **Partially new: iteration 8's corpus figures reproduce under its own filter, and the apparent 2-file drift is a filter difference.** Iteration 8 reported 4,915 plans and 4,692 heading-positive. Under the narrow filter (`*/plan.md` or `plan.md`) this iteration gets exactly 4,915 and 4,692. Under the wider filter (`*plan.md`, which also catches `phase-plan.md`, `implementation-plan.md` and similar) it gets 4,965 and 4,694. The 50-file and 2-heading difference is the filter, not a corpus change, so no earlier finding needs revision — and the cited figures in findings 3, 4 and 5 use the wide denominator and are labelled with it. [INFERENCE: two filter definitions over the same `git ls-files specs` output]

## Questions Answered

Empty, and deliberately so. All five strategy key questions were ticked before this iteration, so `answeredQuestions` is `[]` rather than a re-tick of an already-ticked box. What was answered are three questions the loop never listed and that the edit set could not be shipped without: whether the replacement text survives its own predicate, whether the verify it proposes discriminates, and whether the carrier it is written into delivers it at all.

## Questions Remaining

None tracked. The carried implementation constraints now read:

- **Implementation constraint (placement corrected):** the `AGENTS.md` bullet goes after `:181`, not `:176`, because the Execution Behavior slot leaves 310 B and a 293-byte bullet including its newline fits; `:176`'s 926 B sits in Blast-Radius Management and was a slot artifact.
- **Implementation constraint (size):** the bullet may not exceed 309 B of text — 17 B of headroom over the 292-byte draft, so any added clause forces the wrong section.
- **Implementation constraint (text):** the drafted six lines in Next Focus are the measured text; card `:113` 271 → 352 B, card `:124` 64 → 88 B.
- **Carried, unchanged:** no review-verdict clause (iteration 6); the verify names `IMPLEMENTATION PHASES`, never the number `4` (iteration 7); no level qualifier and no validator backstop (iteration 8).
- **New, unowned:** `AGENTS.md` is already truncated at `:184` on the Devin carrier, so `:186`'s "Plan before acting" does not arrive there. This edit set does not fix it and no candidate mechanism priced it.
- **Residual coverage gap (unchanged, four iterations):** plan soundness has no chat-path carrier. The decidable shape proves a stranger can locate each step and run its proof; it does not prove the plan is sound.

## Ruled Out

- **Keeping the bullet at `:176` because 926 B is the number that was inherited.** The 926 B is a property of one address, not of the rule. The Execution Behavior slot takes a 292-byte draft with 17 B of headroom, so the choice between "the right section with a smaller budget" and "the wrong section with a larger one" resolves to the right section — the budget only binds if the text is written at the size of iteration 8's 351-byte draft rather than the 292-byte one.
- **Adding a shape-count command to card `:124` so the verify proves the acceptance rather than locating it.** Measured: 31 of 4,965 plans have three compliant phase lines, so this verify would fail on 99.4% of the corpus. That is the same new-obligation-as-rule problem that withdrew the validator backstop in iteration 8, arriving this time on the verify line instead of in the registry. The verify stays a locator; the acceptance carries the obligation.
- **Placing the bullet after `:183` or later.** `:183` ends at byte 16,356, leaving 27 B — not a slot. `:184` and everything after it starts at or beyond 16,357, where residual budget is negative. This also explains finding 2: the section is not merely crowded, it is already cut.

## Dead Ends

- **Re-deriving the by-level corpus cross-tab.** Iteration 8 answered it (96.6 / 96.2 / 93.4 / 90.6% heading presence) and the level qualifier is withdrawn; a second derivation would confirm a withdrawn clause.
- **Treating the drafted example's file names as real paths to test.** `progress.sh` and `progress.test.sh` are illustrative in the same way the current example's "ten archives become three" is illustrative; the commands in the drafted example are shape demonstrations, and card `:107` already establishes the pattern of a real command against `<packet folder>` elsewhere in the same file.

## Edge Cases

- **Ambiguous input:** the dispatch focus is `[All tracked questions are resolved]`, not a task. Chosen: compile and test the edit set, with the deferred alternative recorded in Focus. Not escalated — a fan-out lineage has no operator.
- **Contradictory evidence:** finding 4 contradicts iteration 8's numerator. Both figures are preserved with their predicates and their derivations, and the resolution is stated: iteration 8's predicate was stricter than the rule it claimed to test. No verdict changes.
- **Missing dependencies:** `resource-map.md` is absent, as every prior iteration recorded; the coverage gate is skipped by the loop and no finding depends on it.
- **Partial success:** findings 6 and 7 are re-statements and reconciliations rather than new measurements, and are scored as partially new. The new measurements (findings 1, 2, 3, 4, 5) all resolve to a number or a placement.

## Sources Consulted

- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:110-125` — rule (`:113`), example (`:117-121`), acceptance (`:123`), verify (`:124`)
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:116-132` — phases anchor (`:122-127`), fill note (`:124`), `tasks.md` ownership sentence (`:126`)
- `AGENTS.md` — full-file byte offsets: total 27,372 B; `:176` 15,323-15,457 (135 B); `:181` 15,914-16,073 (159 B); `:182` 16,074-16,215; `:183` 16,216-16,356; `:184` 16,357-16,501 (PARTIAL); `:185` 16,502-16,887; `:186` 16,888-17,006; `:189` 17,440-17,630
- Corpus: `git ls-files specs` → 4,965 `plan.md` (wide filter), 4,915 (narrow filter); loose `^## 4` = 4,812; strict heading = 4,694 (wide) / 4,692 (narrow); loose-only class sampled: `## 4. TESTING STRATEGY` (2), `## 4. AFFECTED SURFACES` (2), `## 4. ROLLBACK` / `## 4. ROLLBACK STRATEGY` (2), `## 4. PROOF PLAN`, `## 4. Phases`
- Predicate runs: drafted example 3/3 compliant, current example 0/1; corpus with ≥1 compliant phase line = 37, with ≥3 = 31
- Byte counts: drafted `AGENTS.md` bullets 352 B and 293 B incl newline; card `:113` 271 → 352 B; card `:123` 224 B; card `:124` 64 → 88 B; template `:124` 255 B; template `:126` 203 B
- `iteration-008.md` findings 3, 4 and 6 (the numerator, the denominator and the edit set under test), `iteration-007.md` (the single false positive), strategy §3, §6, §9, §11A

## Assessment

- New information ratio: 0.86 — seven findings: five fully new (the slot-specific budget and the feasible topical placement; the existing devin truncation at `:184`; the 118-file false-pass class; the 31-instance numerator correction; the compiled edit set with its measurements) and two partially new (the cross-reference obligation on the fill note's example; the denominator reconciliation). (5 + 0.5 × 2) / 7 = 0.857 → 0.86. No simplicity bonus: the recommendation keeps the same six targets and gains a placement correction rather than losing an obligation.
- Questions addressed: whether the edit set can be written as specified; whether it can be delivered where it is written; whether its self-check discriminates.
- Questions answered: none of the five strategy key questions — all were ticked before this iteration — so `answeredQuestions` is `[]`.

## Reflection

- **What worked and why:** writing the actual text forced three numbers that reading could not produce. The placement finding exists only because the budget was recomputed per line instead of inherited as a total; the false-pass class exists only because the drafted verify was run against the whole corpus instead of against the one file iteration 7 happened to check; and the numerator correction exists only because the drafted rule text was treated as the predicate instead of trusting the earlier predicate's shape. The common cause is the same one this run has now recorded four times: an inherited figure is an untested claim, and the test is cheap whenever the figure names a slot, a pattern or a predicate that can be re-evaluated directly.
- **What did not work and why:** the first loose-match regex I wrote (`^## 4($|[^0-9.\w])`) returned zero matches over 4,915 files, which reads as "the card's verify never matches anything". It was wrong: the character class excluded the `.` that every real heading contains. The corrected pattern produced 4,812. That is the second time in two iterations that a first-derivation bug produced a plausible number — the previous one produced a plausible *wrong* number (6,098), this one a plausible *impossible* one (0) — and both were caught only by running a second, differently-shaped derivation alongside. A zero and an outlier deserve the same suspicion.
- **What I would do differently:** the byte-offset pass should have come before the draft, not after. I wrote a 351-byte bullet against a 926-byte number that was measured from the wrong address, and only then discovered a 310-byte slot in the right section. Measuring the insertion sites first would have sized the text to the constraint instead of resizing the text to a constraint inherited from a different site.

## Next Focus

Research is complete and the deliverable is now literal. **Do not build a mechanism. Amend six lines across three existing files that a writing session already reads, one of them at a different address than the last two iterations said.**

The compiled set, with the drafted text and its measurements:

1. **`AGENTS.md`, insert after `:181`** (Execution Behavior, first slot), ≤ 309 B of text: 292 B drafted. Not after `:176`: that slot is 926 B but sits in Blast-Radius Management, and the topical slot takes the same bullet at 292 B. No review-verdict clause; it states that a dispatched child records a deviation and continues.
2. **Card `:113`**: the rule gains the decidable shape — each phase line names the file it changes in backticks and ends with `Verify:` and the command that proves it. Keep the "That is the plan template's phases fill note" sentence only if target 5 is taken with it. 271 → 352 B.
3. **Card `:120`**: three compliant lines replacing the one non-compliant line; drafted text scores 3/3 where the current scores 0/1.
4. **Card `:123-124`**: acceptance restates the shape; verify becomes `rg -n '^## 4\. IMPLEMENTATION PHASES'`, which drops the 118-file false-pass class and keeps 4,694 passes. No shape-count command — it would fail on 99.4% of the corpus.
5. **Template `:124`**: the fill note teaches path-plus-proof **and its GOOD example must be replaced**, or the scaffolded file carries a counter-example directly under the rule.
6. **Template `:126`**: the `tasks.md` ownership sentence qualified so the scaffolded file stops telling every new packet that the phases belong to `tasks.md`.

Carried, unclosed: plan soundness still has no chat-path carrier, and nothing in this iteration narrows it. Newly recorded, out of scope for this recommendation: `AGENTS.md` is already truncated at `:184` on the Devin carrier, so "Plan before acting" does not reach a session there — a defect the mechanism ranking did not price and no line in this edit set fixes.

## SCOPE VIOLATIONS

- `research/research.md` still does not exist although `deep-research-config.json` sets `progressiveSynthesis: true`. The dispatch's allowed-write list names only `iterations/iteration-009.md`, `deltas/iter-009.jsonl` and the append gateway's own writes, and the strategy's boundaries call `research/research.md` "workflow-owned canonical synthesis output". Recorded rather than executed, as in iterations 5 through 8.
- No mutation was attempted against any researched path. `AGENTS.md`, the card, the template, the corpus and the drafted strings were read or measured only; the predicate, the regex and the byte-offset passes were computed in memory over content already on disk and printed to stdout. The single-record gateway event file is written to `/tmp`, outside the repository.
