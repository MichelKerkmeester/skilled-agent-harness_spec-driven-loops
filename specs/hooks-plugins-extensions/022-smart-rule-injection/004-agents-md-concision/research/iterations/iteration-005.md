{"timestamp":"2026-09-12T18:20:40.784Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":59,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
**Verdict first:** the duplication surface is close to exhausted, and what remains is concentrated in the anchor layer rather than in content. Recoverable with proof: **3 lines and about 18 words out of 502 content lines**, plus one dangling-reference repair. I read AGENTS.md in full (the reader reports 503 lines, the last blank), REPO RULES.md, all eleven rule files, and `decision-tests.md`.

## 1. DUPLICATION

**D1. `AGENTS.md:213` against `AGENTS.md:202`.** Both lines carry the same content hash `07b57784`, which proves they are byte identical: `> Expanded by [`prevent-overengineering.md`](repo-rules/prevent-overengineering.md).` Carrier: `repo-rules/prevent-overengineering.md`, whose `Fires when` list (:35-40) covers "adding a file, module, class, interface, abstraction, config option, feature flag, layer, or dependency", and REPO RULES.md:40 routes the same set. Its §2 THE PRE-WRITE PASS (:89-98) and §3 (:102-104) are what the pointers point at, and §3:104 says the table "binds and is not repeated here". Recovered: **1 line** at no risk, since the surviving string is identical, 11 lines up, in the same §3 run. The file keeps two other anchors for that rule (:175 "the pre-write pass", :202), so no load path changes.

**D2. `AGENTS.md:255` against `AGENTS.md:235`.** Same content hash `78d59c42`, byte identical: `> Expanded by [`evidence-and-proof.md`](repo-rules/evidence-and-proof.md).` Carrier: `repo-rules/evidence-and-proof.md`, `Fires when` (:32-38) includes "About to say 'done', 'complete', 'works'..." and "About to write a completion summary". That is exactly the moment the FINAL-STATE VERIFICATION block at :253 fires, and §9 FINAL-STATE PROOF (:160-169) is its expansion. Recovered: **1 line**. :235 survives at the head of the same §4, and :249 is a second, content-bearing pointer to that file.

Measured across the whole document: 16 `Expanded by` lines and 4 inline pointers. Exactly three duplicate groups exist. The third is in §3 below, and it is deliberately not cut.

## 2. OVER-DETAIL

**O1. `AGENTS.md:110`, first clause.** Proposed shorter form of the sentence: "Skills are on-demand domain expertise invoked through Gate 2 (§2). Invoking a skill means reading its `SKILL.md` and the resources ITS router resolves for the task at hand, then following those instructions to completion." The deleted clause, "when the advisor confidence is ≥ 0.8, you MUST invoke the recommended skill", is a second copy of `AGENTS.md:103`, seven lines above in the same section: "Confidence ≥ 0.8 → MUST invoke skill". Recovered: about 12 words.

**O2. `AGENTS.md:132`, final clause.** Proposed shorter form: "Consolidate multiple questions into a SINGLE prompt before any analysis or tool calls, never split across messages. **Bypass phrases:** "skip context" / "fresh start" / "skip memory" / [skip] for memory loading." The deleted clause, "Level 1 tasks skip completion verification", is carried at `AGENTS.md:274`: "Skip: Level 1 tasks (checklist.md is optional at every level)." Recovered: 6 words.

**O3. `AGENTS.md:28` and `:260`, the term "bounded remediation loop".** This is a reference repair, not a length cut. Proposed lines:

> :28 "Law 4 blocks forward progress and completion while a check is failing. A failing check may be repaired, but the hard stop remains until the authoritative gate passes."
> :260 "4. If any check fails, keep the completion claim blocked, repair it, or report the blocker with evidence."

Proof that the term resolves to nothing: a repository-wide search returns it in AGENTS.md at :28 and :260, zero times in `repo-rules/`, and otherwise only in git metadata, spec packets and benchmark reports. The obligation it names is carried by `repo-rules/evidence-and-proof.md` §9:168-169, "Any failing check keeps the completion claim blocked. Repair, or report the blocker with its evidence." The retry bound exists and is real: `.opencode/skills/sk-code/shared/references/workflow-debug.md:100`, "Never continue automatic retries after three failed fixes for the same symptom." An older revision had a third line that defined the term, still visible in `.git/lost-found/other/4879630a...:295` ("diagnosis and repair are the permitted bounded remediation loop"). The definition was dropped and both references stayed. Also notice that :28 says "in Section 3" while the older copy said "Section 4", so the pointer has already been renumbered once without being resolved.

**O4. `AGENTS.md:63`.** Proposed shorter form: delete the heading and let :61 carry it. :61 already reads "**⚠️ BEFORE using ANY tool (except Gate Actions: the trigger index lookup, `.opencode/bin/skill-advisor.cjs`), you MUST pass all applicable gates below.**" :63 restates it as "### 🔒 PRE-EXECUTION GATES (Pass before ANY tool use)". The hashes differ (`450d14c4` against `c535f7e7`), so this is a restatement, not a byte twin. Recovered: **1 line**. Nothing else in the file references the label. Risk is low but not zero: the label groups the gate cluster, and I rank it last for that reason.

## 3. MUST NOT MOVE

**M1. `AGENTS.md:276-282`, "Invoking validate.sh".** A surface no earlier iteration examined. Its substance is carried by `evidence-and-proof.md` §2:80-81 ("Verify by content, not exit code. Require the affirmative marker (`RESULT: PASSED`...)") and §3:87-99. Refused on failure mode 1: claims are also made on turns that write nothing, and a review that reports a packet's state never fires Gate 5, so deleting :279-280 would make the affirmative-marker requirement go quiet exactly there.

**M2. "That load is a Read, not a Gate Action, so on a file-modification request it queues behind Gate 3 like any other tool call."** This sentence appears verbatim at :104 and :126. Refused: each copy sits where a reader is about to run a load (a skill route, a rule file) before asking Gate 3, and the sentence is what stops an eager load from skipping a HARD gate. One copy per point of use, kept.

**M3. `AGENTS.md:181`, "Concluding 'unnecessary' never licenses a cut; implement the frozen scope AND raise the amendment in the same response."** A verbatim twin of `prevent-overengineering.md` §5:151-152. Refused on failure mode 2: that rule's `Fires when` (:35-40) is addition-shaped, so an agent who concludes a requested part is unnecessary without adding anything matches no row, the rule never loads, and §5's guard is never seen.

**M4. `AGENTS.md:185`, the ownership bullet.** `root-cause-and-debugging.md` §6:129-133 carries it more fully, and :37 names "pre-existing" in its trigger, so the carrier looks perfect. It is not. That rule's trigger is failure-shaped (:34 "Anything fails"), while :185 also governs a defect noticed while reading, with nothing red yet. That case matches no row and is routine on read-only turns.

**M5. `AGENTS.md:90`, `:389`, `:480`, three byte-identical pointers to `uncertainty-and-honesty.md` (hash `84eed8c1`).** Refused as a cut, and this is the test that separates them from D1 and D2: they sit in three sections roughly 300 lines apart, and two of those sections (:483-485, :391-393) bind on read-only turns. Cross-section re-anchors are the load path. Same-section twins are duplicates.

**M6. `AGENTS.md:101`, the local-scorer sentence.** A second copy of skill-advisor mechanics, carried at `.opencode/skills/system-skill-advisor/README.md:42`, `hooks/skill-advisor-hook.md:135` and `:147`, and `INSTALL-GUIDE.md:239`. Refused on failure mode 2: those load only through :100's "See", while the CLI is a Gate Action that runs before any gate, and this line is what makes the brief's `Advisor: stale` interpretable at that moment.

**M7. `AGENTS.md:407`, the presenting-decisions summary.** It restates that rule's §1 to §5 and overlaps :500. Refused on failure mode 1: recommendations are presented in replies, replies happen on read-only turns, and `presenting-decisions.md` cannot load there.

**M8. `AGENTS.md:300-307`, the Self-Check.** Every item resolves to an earlier line (:301 to Gate 3 at :66, :302 and :303 to Gate 2 at :103-104, :304 to Gate 5 at :125, :305 to :289, :306 to Law 2 at :24, :307 to :267), and unlike every other gate it declares no output line. Refused: it is the only surface that assembles those obligations before an action on a read-only turn, where no rule file loads. This is judgment, and what would change it is evidence that the checklist never actually runs.

**Flag, not a cut.** :192 defers the retry bound to "the code skill's repeated-failure limit". The number is real, but a reader of :192 alone cannot reach it, and two neighbours set other bounds (:86, three investigation iterations, :399, two failed attempts).

## 4. RANKED

1. **D1** (`:213`): 1 line, zero risk. Byte-identical twin in the same section. Delete.
2. **D2** (`:255`): 1 line, zero risk. Same test, same section. Delete.
3. **O1** (`:110`): about 12 words, near-zero risk. The surviving twin is seven lines up in the same section.
4. **O2** (`:132`): 6 words, near-zero risk. The surviving copy at :274 is the more precise one.
5. **O3** (`:28`, `:260`): no lines, two dangling references resolved. Medium-low risk, since the wording changes while the permission and the hard stop stay.
6. **O4** (`:63`): 1 line, low risk. Last because it removes a structural label rather than a statement.

Nothing else survived the test. The remaining duplicates in this file are re-anchors that carry obligations onto read-only turns, and cutting those would buy a couple of lines at the cost of a silently weakened gate. On density, I have no recommendation: the remaining detail is either a single copy that binds, or a section whose expansion lives in a file that cannot load without it.
