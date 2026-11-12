# Iteration 6: Test the edit set's one unfalsifiable clause against the chat path

## Focus

The tracked question list is fully ticked and iteration 5 closed with "the remaining work is implementation". Implementation is out of scope for a research agent, so this iteration took the narrowest research question still standing in iteration 5's own edit set: its `AGENTS.md` clause was **two** obligations — a plan a second reader can follow, *and* "a review verdict on that plan is recorded before the first implementation edit". Iteration 5 verified the plan-shape half byte-exactly and never asked who produces the verdict, or where it is written down.

That is the focus: does the chat path have a plan-review surface, and if it does not, what happens to the edit set. Nothing else was re-derived; the carrier arithmetic and the runtime matrix are inherited and are only re-checked for reproduction (finding 2).

Selected interpretation of an ambiguous dispatch: the prompt's focus field reads `[All tracked questions are resolved]`, which is not a focus. Chosen: the unfalsifiable clause, because it is the only claim in the packet that no cited artifact has ever tested. Deferred alternative: re-auditing the two runtimes iteration 4 left open (`.dsh`, `.devin` `AGENTS.md` delivery) — iteration 4 and 5 both closed it, and re-opening a closed instance spends the iteration confirming a count already taken.

## Actions Taken

1. Read `AGENTS.md:168-192` to confirm the target line and its section context are exactly what iteration 5 described.
2. Read `spec-authoring-card.md:105-135` to confirm all three card targets (section 6's rule, the acceptance/verify pair, the worked example the verify passes on).
3. Grepped the deep-review command and skill for every `verdict` occurrence, then read `deep-review/SKILL.md:179-222` for the verdict contract and the clause that says what the check proves.
4. Grepped `sk-code/sk-code-review` for a plan-review surface and any findings-artifact path; grepped `system-spec-kit/references/` and its `SKILL.md` for "plan review", "cold read" and "second reader".
5. Dumped the plan template's headings and grepped the card and template for `review|approv`.
6. Re-derived the byte offsets of `AGENTS.md:174-190` with an independent whole-file accumulator, to test whether iteration 5's inherited numbers reproduce.

## Findings

1. **All three edit-set targets exist and say what iteration 5 reported — so the correction below is a correction to the *second* clause, not to a misread line.** `AGENTS.md:176` is the stakes-read bullet, the one opening obligation that precedes the first edit in the delivered prefix. Card `:113` states the three-phase rule and, as written, binds every packet with no level qualifier. Card `:123-124` is the acceptance/verify pair whose verify is `rg -n '^## 4' <packet folder>/plan.md` printing one line — which passes on the card's own worked example at `:117-121`, where the three phase lines are `Setup reads the current archive count. Implementation adds \`--keep <n>\`. Verification checks that ten archives become three.` No path, no symbol, no command; the verify still succeeds. [SOURCE: AGENTS.md:176] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:113] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:124] [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:120]

2. **Iteration 5's carrier arithmetic reproduces; the delivered/absent status is unchanged and one end-offset differs by a byte.** An independent accumulator over the whole file puts line 176 at bytes 15,324–15,457 and line 186 at 18,688, against the 16,384-byte rule-file cut, and `wc -c` matches the accumulator's total (27,372). Iteration 5 recorded line 176 ending at 15,458 and line 183 at 16,357, which is the same window read with an inclusive end offset. The margin claim survives: ~926 bytes of headroom remain after line 176 on the six runtimes that receive `AGENTS.md`. [SOURCE: AGENTS.md:176] [SOURCE: .devin/SYNC.md:93] [INFERENCE: from the accumulator's per-line offsets and the 16,384-byte limit recorded in `.devin/SYNC.md:93`]

3. **New: the chat path has no plan-review surface at all.** A case-insensitive search for "plan review", "cold read" and "second reader" across `.skilled/skills/system-spec-kit/references/` and its `SKILL.md` returns zero hits. The plan template carries no review or approval section — its headings run Summary, Quality Gates, Architecture, Fix Addendum, Implementation Phases, Testing Strategy, Dependencies, Rollback Plan, then the L2/L3 phase sections. Its two `review` occurrences are a fix-addendum trigger keyed to "a deep-review FAIL/CONDITIONAL verdict" and a "Per Phase: Review meeting notes" stub. So the card can state a plan's shape and its verify, and nothing in the delivered packet says who reads the plan or where that reading is recorded. [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:104] [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:371] [SOURCE: .skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:123]

4. **New: the one verdict producer in the repo is the deep-review loop, and its verdict line is explicitly a self-report, not a check.** The contract fixes one final line per iteration (`Review verdict: PASS|CONDITIONAL|FAIL`) and then states its own limit: "the post-dispatch verifier validates the *shape* of this line, and nothing more. It does not read findings, so a `PASS` written above active P1 findings satisfies it, and no parser here makes the line true", followed by "treat the final line as the leaf's self-report and the registry as the record." A verdict therefore only means something when a findings registry backs it, and producing either one requires the `/deep:review` loop — a typed command, which is the exact dependency this research exists to remove. [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:196] [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:216] [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:220]

5. **The verdict clause in iteration 5's edit set is unimplementable on the chat path and is replaced; the consequence is that M1 and M4 stop being two mechanisms.** Replacement for the `AGENTS.md:176` clause: at Level 2+ on a spec-backed change, each of the plan's three phase lines names a repo-relative path or symbol and the command that proves the phase done; under `AI_SESSION_CHILD=1`, record and continue. What is dropped is only "a review verdict on that plan is recorded before the first implementation edit". What survives is the half that is decidable: `rg` over `plan.md` can be written so it fails on a phase line with no path token or no verify clause, which is precisely the pair card `:123-124` should hold and does not. That makes M1 and M4 one rule with two carriers — the `AGENTS.md` line states it before the first edit, the validator rule enforces it at closure — rather than two independently ranked mechanisms, and it retires iteration 5's "the pair is not redundancy" argument along with the redundancy it was defending against. It also removes a regression the clause would have introduced: an unfalsifiable verdict demand is a checkpoint, a checkpoint waits for a user, and the topic's premise is a session with no command and a child with no user. [SOURCE: .skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:123] [SOURCE: AGENTS.md:176] [SOURCE: .skilled/skills/system-deep-loop/deep-review/SKILL.md:218]

Residual, stated rather than papered over: the decidable shape proves a stranger can locate each step and run its proof. It does not prove the plan is sound. The chat path has no carrier for soundness, this iteration does not invent one, and the honest form of the recommendation names that hole instead of writing a verdict line no artifact can recompute.

## Questions Answered

All five strategy key questions were ticked before this iteration, so `answeredQuestions` is recorded empty. This iteration closed a question the strategy never listed and iteration 5 raised by writing it: who produces the "review verdict", and on what surface. Its answer is the negative (findings 3 and 4), and the edit set is corrected rather than the ranking.

## Questions Remaining

None tracked. Two items remain, and neither is a research question:

- **Implementation constraint (from finding 5):** the recommendation is now one rule in four line replacements across two existing files — `AGENTS.md:176`, card `:113`, card `:123-124` — plus, if the backstop is taken, one rule in `validate.sh`. Whoever writes them must not carry the verdict clause forward.
- **Residual coverage gap (from finding 5):** plan soundness has no chat-path carrier. Any future mechanism that claims to cover it must name the artifact a third party could recompute, or it re-creates the hole it claims to close.

## Ruled Out

- **Treating the deep-review verdict line as a truth-bearing artifact to anchor on.** Its own contract says the check is shape-only and the registry is the record (finding 4), so a chat-path rule requiring "a recorded verdict" would have been the card's unanchored verify in a new costume: satisfiable by writing the line.
- **Adding a review or approval section to `plan.md.tmpl` as the chat-path carrier.** It needs a new template section plus a new validator rule to mean anything, it still leaves the verdict unfalsifiable, and it re-introduces a reviewer step into a session the topic says has no operator typing anything. The decidable shape check reaches the checkable half with amended existing lines.
- **Claiming "no review surface exists anywhere in the repo".** False as stated and therefore not claimed: `.skilled/commands/deep/review.md` is a review surface. The scoped claim in finding 3 is about the packet-shaped chat path — the references, the SKILL entry point and the two templates a writing session actually loads.

## Dead Ends

- **A plan-review verdict as a chat-path carrier.** Structurally dead: the only producer is a command loop, and the artifact it emits is a self-report by its own contract. This is the last of the three places iteration 1's hole could have been closed by prose about review; with the YAML gates (iteration 1), the validator rules (iteration 3) and now the verdict surface (this iteration) all checked, the prose-plus-decidable-shape edit set is the whole of what remains.

## Edge Cases

- **Ambiguous input:** the dispatch focus is `[All tracked questions are resolved]`, not a task. Chosen: the one untested claim in the previous iteration's recommendation, with the deferred alternative recorded in Focus. Not escalated — a fan-out lineage has no operator to ask.
- **Contradictory evidence:** none new. The `.devin/README.md` versus `.devin/SYNC.md:93` delivery-versus-truncation pair is inherited resolved and was not re-opened.
- **Missing dependencies:** none. Every surface needed for findings 3 and 4 is present and readable.
- **Partial success:** none material. The one self-correction is finding 2's end-offset convention, caught by comparing the accumulator's total against `wc -c` before writing the number; no finding rests on the byte that differs.

## Sources Consulted

- `AGENTS.md:168-192` (line 176 and its section context), `:174-190` (per-line byte offsets, whole-file accumulator checked against `wc -c`)
- `.skilled/skills/system-spec-kit/references/workflows/spec-authoring-card.md:105-135` (section 6 rule, worked example, acceptance/verify pair)
- `.skilled/skills/system-deep-loop/deep-review/SKILL.md:179-222` (verdict table, final-line contract, what the check proves)
- `.skilled/commands/deep/review.md` (verdict mentions, review command surface)
- `.skilled/skills/system-spec-kit/templates/core/plan.md.tmpl:26-236` (heading inventory), `:104`, `:371` (only `review` occurrences)
- `.skilled/skills/system-spec-kit/SKILL.md`, `.skilled/skills/system-spec-kit/references/` (zero hits for "plan review", "cold read", "second reader")
- `.skilled/skills/sk-code/sk-code-review/SKILL.md`, `ROUTER.md` (no plan-review or findings-artifact surface)
- `iteration-005.md` (edit set and carrier arithmetic, inherited and re-tested), `findings-registry.json` (accumulated evidence)

## Assessment

- New information ratio: 0.80 — five findings: two fully new (the absent plan-review surface; the verdict contract's shape-only limit), three partially new (the verbatim re-verification of the edit targets, the reproduced carrier arithmetic, and the replacement-plus-collapse, which is a new claim built on the two new ones and on iteration 5's ranking). (2 + 0.5×3) / 5 = 0.70, plus the 0.10 simplicity bonus, claimed because finding 5 resolves an internal contradiction and reduces a two-mechanism recommendation to one rule with two carriers without adding a mechanism. No cap reached.
- Questions addressed: who produces the review verdict and on what surface; whether the recommendation's edit set survives contact with the chat path.
- Questions answered: that one, and nothing newly ticked — all five strategy questions were already marked answered.

## Reflection

- **What worked and why:** asking "who writes it down" of a single clause was enough to break the recommendation open. The clause had passed four iterations because it *sounds* like a check — a verdict is a verdict. Reading the producer rather than the word turned it into a question with a file-level answer, and the answer was that the only producer is the command loop the research exists to replace. The general lesson: an obligation in an edit set is a claim about a producer, so it should be validated by locating the producer, not by validating the obligation's wording.
- **What did not work and why:** the first pass treated `[All tracked questions are resolved]` as an instruction to synthesise, which is what a convergence-shaped prompt invites. Synthesis would have re-stated iteration 5 at a lower information ratio; it was abandoned once the dispatch's own next-focus line ("the remaining work is implementation") showed the honest move was to test the recommendation rather than restate it. Caught by reading the focus field against what a research agent may actually do, not by a tool failure.
- **What I would do differently:** run this producer check on every clause of a recommendation the moment the clause is written, not one iteration after the recommendation is declared complete. Four iterations of correct measurement sat behind one unmeasured sentence, and the sentence was the part a user would have built.

## Next Focus

Research is complete and the recommendation is now stable in the only sense that matters: every clause names a producer that exists on the chat path. The next step is implementation, in a separate follow-up outside this loop: apply the four line replacements (finding 5, superseding iteration 5's finding 6) and, if the backstop is taken, add the phase-anchoring rule to `validate.sh`. The two constraints to carry are finding 2's ~900-byte ceiling on the `AGENTS.md:176` addition and finding 5's prohibition on reinstating the verdict clause.

## SCOPE VIOLATIONS

- `research/research.md` still does not exist although `deep-research-config.json` sets `progressiveSynthesis: true`. The dispatch's allowed-write list names only `iterations/iteration-006.md`, `deltas/iter-006.jsonl` and the append gateway's own writes, and the strategy's boundaries call `research/research.md` "workflow-owned canonical synthesis output". Recorded rather than executed, as in iteration 5.
