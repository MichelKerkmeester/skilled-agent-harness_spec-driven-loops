# Iteration 7: Falsify the enforcement half of the plan-shape rule

## Focus

All five strategy questions are ticked. Iteration 6 closed by saying research was complete and "the next step is implementation", so the only honest research left is to test the claim in that conclusion that nobody had tested: iteration 6's finding 5 asserted that "`rg` over `plan.md` can be written so it fails on a phase line with no path token or no verify clause". An assertion that a predicate *can* be written is falsifiable in one step — write it and run it. This iteration does that, on the card's own text and on the repo's real plan corpus, and then re-derives where the optional validator backstop would actually land.

Selected interpretation of an ambiguous dispatch: the prompt's focus field reads `[All tracked questions are resolved]`, which is not a focus. Chosen: the untested enforcement claim, because it is the one clause of the recommendation whose falsity would change what gets written. Deferred alternative: the residual plan-soundness gap (iteration 6's finding 5). It is recorded as a known hole with no candidate carrier and re-deriving it would produce a less precise version of the same sentence; the enforcement claim at least terminates in a verdict.

## Actions Taken

1. Read `spec-authoring-card.md:100-140` to get section 6's rule, its worked example, and its acceptance/verify pair verbatim with line numbers.
2. Read `validate.sh:1-40` and censused its functions, to test iteration 6's claim that the backstop is "one rule in `validate.sh`".
3. Listed the real `plan.md` corpus (6,098 files) and read four representative `## 4` sections at different shapes.
4. Wrote the candidate predicate (a backticked path-or-file token **and** a `Verify:`/command clause per phase line) and ran it over the card's worked example, three real packet sections and one synthetic compliant line, to measure discrimination rather than assume it.
5. Counted the corpus by heading shape (exact `## 4. IMPLEMENTATION PHASES`, other `## 4.` heading, no `## 4.` heading) with `comm` set arithmetic after a first `rg -L` count produced three mutually inconsistent totals.
6. Located the rule surface the backstop would actually touch (`runtime/cli/lib/validator-registry.json`, the `rules/check-*.sh` scripts) and checked the registry entry format against an existing rule.

## Findings

1. **New: the card's own worked example fails the proposed predicate, so the edit set is short one target.** Card `:120` reads `Setup reads the current archive count. Implementation adds `--keep <n>`. Verification checks that ten archives become three.` The predicate returns `path_or_file_token=0` (the only backticked token is a flag, not a path, file or symbol) and `verify_clause=0` (no `Verify:` and no command). That is the example teaching the plan shape, sitting three lines above `:123`, the acceptance line that would state the rule. Left unamended, the card would reject its own teaching example and the edit set would ship a self-contradicting section. Card `:120` is therefore a fourth target, not a stylistic nice-to-have. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:120] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:123] [INFERENCE: from the predicate run over the example line, reported as path_or_file_token=0 / verify_clause=0]

2. **New: today's verify is a demonstrated false-positive generator, not merely a weak one.** `rg -n '^## 4'` matches the *number* four, not the section. `specs/cli-orca/001-mcp-orca-cli/plan.md:114` is `## 4. AFFECTED SURFACES`, a table of surfaces with a verification column, and the file carries no `## 4. IMPLEMENTATION PHASES` heading at all — yet the card's verify prints one line and passes. So the recommendation's change to `:124` is load-bearing on its own: without it, the packet can claim the plan-shape rule is satisfied while its `## 4` section is a different section entirely. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:124] [SOURCE: specs/cli-orca/001-mcp-orca-cli/plan.md:114]

3. **New, and a correction to iteration 6: the backstop does not live in `validate.sh`.** `validate.sh` states in its own header that it "deliberately implements no rules of its own: a second implementation of the same rules is a second answer to the same question, and a packet's verdict must not depend on the caller", and hands every rule decision to the orchestrator. Rules are `rules/check-*.sh` scripts plus an entry in `runtime/cli/lib/validator-registry.json` carrying `rule_id`, `script_path`, `severity` and `category`, as `FILE_EXISTS` and `PLACEHOLDER_FILLED` demonstrate. A phase-anchoring backstop is therefore one **new** script under `runtime/cli/rules/` plus one registry entry — two touched paths, one of them a new file, against iteration 6's "one rule in `validate.sh`". That is the class of change the topic asks to avoid, and the cost line of the recommendation has to say so. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:5-11] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1-20] [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh]

4. **New: the retroactivity blast radius is measured, and it is not small.** Of 6,098 `plan.md` files, 4,677 (76.7%) carry `## 4. IMPLEMENTATION PHASES`, 103 carry a different `## 4.` heading, and 1,318 carry no `## 4.` heading at all. A strict phase-anchoring rule would newly fail 1,421 packets (23%) on the day it lands — and the card's own example (finding 1) is among the failures. Any backstop therefore has to be scoped to newly created packets or run non-blocking; taken unscoped it replaces one hole with a repo-wide red verdict, which is a worse trade than shipping the prose half alone. No earlier iteration had this number; it comes from the corpus, not from reasoning about the corpus. [INFERENCE: from `find specs -name plan.md` counted against `rg -l '^## 4\. IMPLEMENTATION PHASES'` and the `comm` set difference]

5. **Partially new: enforcement already leaks where it exists, which is evidence against assuming the backstop works.** `PLACEHOLDER_FILLED` is registered as an `error`-severity `authored_template` rule, and 63 `plan.md` files still carry a raw `<!-- FILL` stub — `specs/system-skilled-doctor/003-removed-folder-classification/plan.md` keeps section 4's stub, FILL instruction and all, including the `GOOD:`/`WEAK:` examples it was meant to replace. Either those packets are never validated on write or the rule does not treat an HTML-comment stub as a placeholder. The cause is unverified, so neither branch is claimed; what is established is that "templates plus `validate.sh` carry the enforcement" is not a safe premise for a rule that only exists as a rule. [SOURCE: .skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:13-25] [SOURCE: specs/system-skilled-doctor/003-removed-folder-classification/plan.md:5]

6. **The recommendation's cost line is now: four targets, five amended lines, one optional new rule.** Card `:113` (level qualifier plus the decidable obligation), card `:120` (worked example brought into compliance), card `:123-124` (acceptance and verify matched to the amended rule, the verify naming the heading rather than the number), `AGENTS.md:176` (the pre-first-edit obligation, inside the ~926-byte headroom iterations 5 and 6 measured), and — only if finding 4's scoping is accepted — the new rule script plus registry entry. M1 and M4 remain one rule with two carriers, but the carrier arithmetic reads "four existing-target edits, one optional new file" and the optional half is now visibly the expensive half. [SOURCE: AGENTS.md:176] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:113]

## Questions Answered

Empty, and deliberately so. All five strategy key questions were ticked before this iteration, so `answeredQuestions` is recorded as `[]` rather than re-ticking an already-ticked box. This iteration answered a question the strategy never listed and iteration 6 asserted without testing: whether the predicate the rule depends on exists, discriminates, and can be enforced where the recommendation said it could.

## Questions Remaining

None tracked. Three items remain, none of them a research question:

- **Implementation constraint (findings 1, 4, 6):** the edit set is four targets across two existing files, plus one optional new rule whose scoping must be decided first. Whoever writes it must amend card `:120` alongside `:113` and `:123-124`, or the section contradicts itself.
- **Implementation constraint (iteration 6, carried):** the `AGENTS.md:176` addition must stay inside ~926 bytes and must not reinstate the verdict clause.
- **Residual coverage gap (iteration 6, carried):** plan soundness has no chat-path carrier. The decidable-shape rule proves a stranger can locate each step and run its proof; it does not prove the plan is sound, and nothing in this iteration narrows that.

## Ruled Out

- **Making the backstop an inline rule inside `validate.sh`.** `validate.sh:5-11` forecloses it in its own words, and the architecture it describes is the reason the rule registry exists: a second implementation would let a packet's verdict depend on which caller asked. Recorded as a correction to iteration 6 rather than implemented around.
- **Treating `PLACEHOLDER_FILLED` as proof that templates enforce their own shape.** The 63 surviving stubs are direct counter-evidence at the surface the backstop would join (finding 5). Not escalated into a claim about cause, because the cause was not investigated and is not needed to withdraw the premise.
- **Requiring the phase predicate at every documentation level.** Tightening a rule that 23% of the existing corpus fails, with no soundness coverage added, would convert a low-cost prose fix into a migration project. Deferred to finding 4's scoping decision.

## Dead Ends

- **A predicate that passes on the card's own example for free.** The first candidate — "the three phase lines exist and are one line each" — is exactly what the current verify already approximates, and it passes on `:120`, on the FILL stub and on `## 4. AFFECTED SURFACES`. It measures the count, not the shape, so it inherits the false positive in finding 2. Rejected rather than tuned, since tuning it towards "has backticks" would still pass `--keep <n>`.

## Edge Cases

- **Ambiguous input:** the dispatch focus is `[All tracked questions are resolved]`, not a task. Chosen: the untested enforcement claim, with the deferred alternative (the soundness gap) recorded in Focus. Not escalated — a fan-out lineage has no operator to answer.
- **Contradictory evidence:** none new. The card's text against the card's example (finding 1) is an internal contradiction in a target file, resolved in favour of amending the example because the rule is the thing the research recommends and the example is the artifact that teaches it.
- **Missing dependency:** my first corpus count used `rg -L` through `xargs` and produced three totals that could not all be true (4,677 + 5,992 > 6,098). Re-derived with sorted file lists and `comm`, which reproduce exactly. No finding rests on the discarded numbers; finding 4's percentages come from the recomputation.
- **Partial success:** finding 5's cause is unverified and is labelled partial rather than promoted to a claim about the validator. Everything else in the iteration resolves to a verdict.

## Sources Consulted

- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:100-140` — section 6 rule, worked example (`:120`), acceptance/verify pair (`:123-124`)
- `.skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh:1-40`, function census at `:41-523` — front-end contract, "no rules of its own"
- `.skilled/skills/system-spec-kit/runtime/cli/lib/validator-registry.json:1-30` — `rule_id` / `script_path` / `severity` / `category` shape, `FILE_EXISTS`, `PLACEHOLDER_FILLED`
- `.skilled/skills/system-spec-kit/runtime/cli/rules/check-placeholders.sh` — rule script location (found by path search)
- `specs/cli-orca/001-mcp-orca-cli/plan.md:114` — `## 4. AFFECTED SURFACES`, no phases heading
- `specs/system-skilled-doctor/003-removed-folder-classification/plan.md:5` — surviving `<!-- FILL` stub
- `specs/sk-prompt/010-sk-prompt-improvements/plan.md`, `specs/other/002-local-skilled-alignment-upgrades/plan.md` — prose-only phase lines, pointer-only phase lines
- `AGENTS.md:170-182` — the `:176` stakes-read bullet inside the ~926-byte headroom
- Corpus: `find specs -name plan.md` (6,098) against `rg -l '^## 4\. IMPLEMENTATION PHASES'` (4,677) and `rg -l '^## 4\. '` (4,780), differenced with `comm`
- `iteration-006.md` (the claim under test and the edit set it produced), strategy §3, §6, §9, §11A

## Assessment

- New information ratio: 0.83 — six findings: four fully new (the card example failing its own rule; the verify's demonstrated false positive; the backstop's real carrier; the measured retroactivity radius), two partially new (the enforcement leak at `PLACEHOLDER_FILLED`; the recomposed cost line, which is bookkeeping over the four new ones). (4 + 0.5×2) / 6 = 0.83. No simplicity bonus claimed: the corpus constraint *adds* a target and a scoping decision, so the model is more constrained, not cleaner.
- Questions addressed: whether the predicate the rule depends on exists, discriminates, and can be enforced where iteration 6 said.
- Questions answered: that one — and it is not a strategy key question, all five of which were already ticked, so `answeredQuestions` is `[]`.

## Reflection

- **What worked and why:** writing the predicate and running it took three commands and broke a recommendation that had survived five iterations of increasingly careful measurement. The reason is structural: the recommendation's weak points were never in its measurements, they were in its *verbs of possibility* — "can be written", "would enforce". A possibility claim has a one-step test, and the cost of running it is always smaller than the cost of the iteration spent reasoning about it. Run the possibility claim the moment it is written.
- **What did not work and why:** the first corpus count trusted `rg -L` through `xargs` and produced totals that exceeded the population. That failure was caught only because two separate counts were taken and their sum was impossible — a single count would have shipped a wrong percentage with full confidence. The general rule this iteration earns: a count over a large corpus needs a second, structurally different derivation before it becomes a number in a finding, exactly as a byte offset needed `wc -c` in iteration 6.
- **What I would do differently:** test the card's own worked example against any new rule *before* proposing the rule. The example is the cheapest available proxy for the corpus, it was two lines away from the rule text, and it would have shown the false positive in finding 2 before the recommendation reached three targets instead of four.

## Next Focus

Research is complete. Every clause of the recommendation names a producer that exists, and the enforcement half now names a carrier that exists on the correct architecture — with an explicit price. The next step is implementation, outside this loop: amend card `:113`, `:120` and `:123-124`, amend `AGENTS.md:176` within the byte ceiling, and decide the backstop's scoping before writing any rule. Two things to carry: the phase rule must be taught by the example it is shipped beside, and the backstop is a new file, so taking it is a deliberate exception to the topic's small-change preference, not a free add-on.

Also carried: the verify at card `:124` must name the heading `IMPLEMENTATION PHASES`, not the number `4`; the `specs/cli-orca/001` packet proves the number form passes on a plan with no phases at all.

## SCOPE VIOLATIONS

- `research/research.md` still does not exist although `deep-research-config.json` sets `progressiveSynthesis: true`. The dispatch's allowed-write list names only `iterations/iteration-007.md`, `deltas/iter-007.jsonl` and the append gateway's own writes, and the strategy's boundaries call `research/research.md` "workflow-owned canonical synthesis output". Recorded rather than executed, as in iterations 5 and 6.
- No mutation was attempted against any researched path. `validate.sh`, the card, `AGENTS.md`, the registry and the corpus were read only; the predicate was run as a read-only `rg` over content already on disk, and the two corpus-count files were written to `/tmp`, outside the repository entirely.
