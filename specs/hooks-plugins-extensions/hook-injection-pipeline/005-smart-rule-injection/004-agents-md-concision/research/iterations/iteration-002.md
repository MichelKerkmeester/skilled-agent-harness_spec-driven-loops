{"timestamp":"2026-09-12T18:02:45.430Z","runtime":"claude","status":"ok","freshness":"live","durationMs":953,"cacheHit":false,"skillLabel":"sk-code"}
Iteration 1 recorded no findings (headers only), so nothing below repeats it. All work is first-hand: AGENTS.md read in full (503 lines), REPO RULES.md in full, all eleven rule files read to their "Fires when" lists and relevant sections, plus `decision-tests.md`.

The test as applied per candidate: the passage's governed moment decides. Anything exercisable without a write — advice, analysis, claims, asking, close-out — binds on read-only turns, where no rule loads, so it stays. Anything whose entire governed moment is a mutation is loaded by Gate 5 at the very action via the trigger table, so it can live in its rule.

---

## 1. DUPLICATION

**F1 — blast-radius bullets, action-scoped only. `AGENTS.md:164`, `AGENTS.md:166` → `blast-radius.md` §3 (84-96), §5 (117-134). Recover 2 lines.**
Lines 164 ("Name the rollback, stop for yes — Before delete/overwrite/migrate/deploy/send, write how to undo and wait for confirmation") and 166 ("Sanitize by persistence boundary — ... do not rewrite history, branches, or reflogs until the rollback is named and the operator approves") govern only the model's own mutating acts. The rule's "Fires when" (blast-radius.md:33-34) is a verbatim match — "Delete, overwrite, truncate, migrate, deploy, publish, send, or install... Force-push, rewrite history, touch branches, tags, or reflogs" — and the REPO RULES trigger row (REPO RULES.md:44) carries the same verbs, so Gate 5 loads the rule before the action. §3 carries the rollback sentence and the stop-for-yes with more precision ("Approval does not transfer", 93-96); §5 carries the persistence inventory and the scoped-removal rule more fully than 166.
*Consciously excluded:* 163 ("Match effort to blast-radius") stays — its cheap-end calibration ("decide and move on", blast-radius.md:72-76) governs turns whose actions never match any trigger row, including read-only ones. 165 ("Name what still speaks the old contract") stays: an impact scan ("who consumes this?") is a genuine read-only deliverable, and the rule cannot load on those turns. 167 is in F2, split out because its first clause has a different carrier.

**F2 — dependency line carried twice inside AGENTS.md plus two rules. `AGENTS.md:167` + `AGENTS.md:352` → `AGENTS.md:205` (stays), `blast-radius.md` §6 (138-142), `prevent-overengineering.md` §4 Dependencies (141-143). Recover 2 lines.**
167 states "Prefer tools already available in the project" — carried verbatim by the always-loaded 205 ("**Prefer available project tools** — add a dependency only when the scoped result requires it"), which remains. 167's action clause ("Installation is a scoped mutation and must pass the same scope, approval, and verification rules") is carried by blast-radius §6 ("Same gates as any other change: in scope, is there an existing tool, what is the rollback") and by prevent-overengineering §4 ("takes the `blast-radius.md` pass too, installing mutates the environment"). 352 ("Treat dependency installation as the scoped mutation...") is then a pure third copy. Both carriers fire at the mutation: "Adding a ... dependency" (prevent-overengineering.md:37), "install" (blast-radius.md:33, REPO RULES.md:44). The preference half stays always-loaded at 205; nothing read-only is lost.

**F3 — Final-State Verification checklist. `AGENTS.md:257-260` → `evidence-and-proof.md` §9 (160-169). Recover 3 lines; keep trigger and hard status.**
Items 1-4 are §9's four checks ("verified by inspection, not by the fact that you wrote it", "from the final state", "no task-created residue", "no third option"). The rule's "Fires when" includes "About to write a completion summary, or tick anything off as done" (evidence-and-proof.md:37) — completion claims in a machine-state session mean Gate 5 fired. Proposed always-loaded remainder, keeping the block, its trigger, and a resolving pointer:

> #### FINAL-STATE VERIFICATION [HARD] BLOCK
> Expanded by [`evidence-and-proof.md`](repo-rules/evidence-and-proof.md) §9.
> Trigger: Before claiming a machine-state task is done or that its output works.
> Run §9's four checks — artifacts at exact path and format, proof plan and authoritative gate rerun from the final state, scoped diff clean — and keep the claim blocked on any failure: repair, or report the blocker with evidence.

Disclosure: this is the only candidate touching a `[HARD] BLOCK`. If the operator wants the four checks verbatim-visible at every claim the way §1's Four Laws are, keep 257-260 and take the remaining five lines only. Line 262 and the COMPLETION VERIFICATION RULE stay either way.

**F4 (conditional) — the register definitions. `AGENTS.md:153` + `AGENTS.md:155` are near-verbatim second copies of `uncertainty-and-honesty.md` §6.**
Compare: "While working: clipped. Act rather than narrate. Open with the result..." (uncertainty-and-honesty.md:117-120) and "At a boundary: dense... verdict first, then the receipts. Reason about the problem, not about yourself" (122-123) against 153 and 155. The copy to delete is genuinely a choice, and only one variant is safe:
- **Safe, zero-risk variant (recommended): delete the twins in `uncertainty-and-honesty.md` §6**, leaving AGENTS.md untouched. That is a rule-file edit, outside this review's remit, but it is the actual redundancy: AGENTS.md is the always-loaded carrier.
- **AGENTS-side cut (2 lines) only if `communication.md` §1 first absorbs the two definitions.** The carrier test passes only on that condition: `communication.md` "Fires when: About to write any substantive reply..." (35-37) and §8's load command (AGENTS.md:405, "Load it before communicating... Load it before answering") reach every reply, including read-only turns. Today communication.md §1 (57-66) names the owners but does not carry the definitions, so an AGENTS-side cut without that edit would go quiet on read-only turns — the exact failure `decision-tests.md:48-51` records ("A total move needs a total trigger, or the content goes quiet"). Replacement shape for 152-155:

> **Two registers, defined in [`communication.md`](repo-rules/communication.md) §1:** while working, clipped; at a boundary, dense.
> - *Before a multi-step stretch:* Post the intended path first, as a short numbered list of what you will do and what the reader should expect at each checkpoint. Then work. Clipped means not narrating each step, never starting without saying where you are going.

Line 154 stays regardless (its definition lives in presenting-decisions.md:35-39, which fires on multi-step stretches and complex answers — moments that occur on read-only turns, where that rule cannot load).

---

## 2. OVER-DETAIL

**O1 — `AGENTS.md:28`, dangling pointer.** "A failing check may enter the bounded remediation loop in Section 3" — no bounded remediation loop exists anywhere in §3 of AGENTS.md; the only two mentions of the phrase in the document are 28 and 260, and no definition survives (grep over AGENTS.md and repo-rules returns nothing defining it; older copies in `.git/lost-found` show a definition bullet once existed). Proposed resolving form, not a shortening for its own sake:

> Law 4 blocks forward progress and completion while a check is failing. Diagnosis and repair are the permitted bounded remediation loop — see `repo-rules/root-cause-and-debugging.md` §3 and `AGENTS.md:192` for the retry limit — but the hard stop remains until the authoritative gate passes.

**O2 — `AGENTS.md:101`, Gate 2 option B.** The last three sentences are architecture rationale, not obligation: "The CLI is the advisor's single front door, and the hook brief itself resolves through it... It starts the daemon when needed. The Python local scorer... renders that as `Advisor: stale`." Proposed shorter form (the degraded-brief read is the one operational clause and is kept):

> B) Direct call: run `node .opencode/bin/skill-advisor.cjs advisor_recommend --json '{"prompt":"[request]"}' --format json` when no hook brief is present, when scripting a check, or when diagnosing hook behavior. A degraded answer renders as `Advisor: stale`; treat it as such.

**O3 — `AGENTS.md:114`, hub routing paragraph.** The class taxonomy is mechanics and is carried by the two files it names. Proposed shorter form:

> **A parent hub projects one advisor identity; its modes route in two stages.** The hub's `graph-metadata.json`, `hub-router.json`, and `ROUTER.md` pick the mode; check the mode's routing class before assuming which stage applies. **Never report a mode as routed because a registry entry exists — check both stages, against the hub you actually changed.** Classes and mechanics: `parent-skills-nested-packets.md`; claims: [`skill-hub-routing.md`](repo-rules/skill-hub-routing.md).

O2 and O3 recover no whole lines; they cut roughly 60 words from two always-loaded lines. Not worth doing alone, worth folding into any edit of those lines.

---

## 3. MUST NOT MOVE

Considered and rejected, with the deciding citation:

- **Gates §2 in full (61-136), and Gate 3 especially (65-79).** Gate 3 fires before the Gate 5 load can even run — line 104 says the routing load "queues behind Gate 3" — so content that shapes the gate's own question cannot live behind it.
- **PLAN-WORKFLOW LOCK (30-42).** `scope-discipline.md:106-108` states it deliberately does not restate the protocol: "a hard blocker copied into a tier-3 document reads as though an operator instruction could outrank it. Read it there." The AGENTS.md copy is the only copy of the steps.
- **VIOLATION RECOVERY (134-136).** Documented refusal: `decision-tests.md:43-46` records relocating it was refused because "its trigger fires exactly when the trigger-loaded path may already be broken."
- **Confidence Thresholds (92-97).** `uncertainty-and-honesty.md:48-49`: "The scale is the Confidence Thresholds table in `AGENTS.md` §2 and there is exactly one of it; this file carries no second copy."
- **Restraint Signals table (217-225).** `prevent-overengineering.md:104`: "Its Restraint Signals table binds and is not repeated here." Its vocabulary ("flexible", "might need") occurs during planning, which is routinely read-only.
- **The five Verification Standards (243-247).** Line 239 self-declares: "These five bind unconditionally, including on a read-only turn where Gate 5 never fires and no rule file loads." Even the rows with full rule expansions cannot rely on those expansions loading.
- **Ownership bullets (185, 187, 188) and the close-out bullet (501).** Four rule files point back at these lines as the binding copy: `handoff-and-questions.md:52` ("`AGENTS.md` §10 ... already require an honest status"), `:109-110` ("`AGENTS.md` §3 already refuses 'should I continue?'"), `:150` ("`AGENTS.md` §3 refuses partial work framed as a checkpoint"), `scope-discipline.md:123` ("`AGENTS.md` §3 Ownership & Completion binds"). Cutting them breaks resolvable references. Failure-dodging ("pre-existing") also happens in the close-out of read-only review turns.
- **Documentation & Honesty table (483-485), Logic-Sync (391-393), Escalation (399).** Uncertainty, contradictions between doc and code, and sub-threshold confidence all arise while reading and analyzing — read-only moments. `uncertainty-and-honesty.md`'s trigger is "You do not know, and a plausible answer is available", but Gate 5 cannot load it on those turns.
- **Git Workspace Safety table (326-335), including the push row 333.** `decision-tests.md:95-97` records git/PR among ten candidates the repo already refused as a rule; the table is their routed home. The push row overlaps `blast-radius.md:93-96` by design — the always-loaded copy carries the allowlist posture, and hooks are the backstop (334-335). Reviewed as a candidate, kept.
- **§9 routing tables (427-436) and §10 Dispatch Rules (493-494).** Routing and dispatch mechanics are Out of the rule set's scope by the router's own boundary (`REPO RULES.md:85-89`; `decision-tests.md:62-67`). No rule may carry them; scoping them to a rule would be the fifth widening the repo has refused.
- **MEMORY SAVE RULE (284-290), spec-folder §6 (367-381), GOAL POSTURE RULE (292-298).** Memory and spec-folder are refused candidates (`decision-tests.md:95-97`); Goal Posture's trigger is "on every turn" (293). §6's pointer table already delegates all mechanics to system-spec-kit.
- **Execution-behavior bullets 178-181, 185-186, 191-192, 195-196.** 179 is the sharpest failure-mode-2 case: its carrier (`evidence-and-proof.md` §8) loads on report/claim triggers (`evidence-and-proof.md:34-38`), not at implementation start — the proof plan would arrive after the moment it governs. `root-cause-and-debugging.md:86-88` explicitly declines to set the retry count ("set outside this file"), so 192's pointer ("the code skill's repeated-failure limit — its count governs a debugging loop, not Section 7's") is unique to AGENTS.md. 191's first four steps (reproduce, read the error, locate the producer, trace consumers) are fully excisable read-only, which is how diagnosis-only turns run.
- **Self-Check (300-307).** Binds "before ANY tool-using response" — read-only turns included; its skill-routing and scope-drift items apply there.
- **§5 tools/MCP/search/terminal (311-363).** Govern read-only activity directly (searches, MCP reads), and none of the eleven rule files' trigger sets touches tool search, MCP, or terminal discipline — there is no carrier to move to.
- **Quick Reference table (443-474) as a whole.** Rows like "Claim completion" and "Goal state" are in-document second copies, but the table's own preamble (448) sets it as an entry-point index; only two rows are proposed (F7), the rest serve task-to-section lookup that no other single place provides.

---

## 4. RANKED — lines recovered per unit of risk

1. **F1** — `AGENTS.md:164` + `:166` → blast-radius §3/§5. 2 lines. Risk low: verb-for-verb trigger match, mutation-only governance, no read-only exposure. Highest confidence.
2. **F2** — `AGENTS.md:167` + `:352` → `:205` (stays) + blast-radius §6 + prevent-overengineering §4. 2 lines. Risk low: an always-loaded copy of the preference clause remains at 205, so nothing depends on a rule load for the design-time half.
3. **F3** — `AGENTS.md:257-260` → evidence-and-proof §9, compressed pointer retained. 3 lines. Risk medium: it touches a `[HARD] BLOCK`; the block, trigger, and hard status stay in the always-loaded document; only the checklist text moves.
4. **F4** — register twins. Preferred form: delete `uncertainty-and-honesty.md` §6's copies (0 AGENTS.md lines, but it is the real de-duplication). AGENTS-side cut of `:153` + `:155` (2 lines) only after `communication.md` §1 absorbs the definitions; skip it otherwise.
5. **O1** — `AGENTS.md:28` dangling reference repair. 0 lines, fixes a pointer that currently resolves to nothing; near-zero risk.
6. **O2/O3** — `AGENTS.md:101` and `:114` word reductions. 0 lines, ~60 words; low risk; fold in only when those lines are edited anyway.
7. **F7 (optional, lowest confidence)** — Quick Reference rows `469` ("Goal state", an exact 3-of-5 restatement of the Goal Posture Rule at 292-298) and `468` ("Claim completion", a third copy of the validate.sh sequence in §4). 2 lines. Index rows conventionally repeat their targets, so treat as taste, not defect.

**Totals.** Certain recovery: 7 lines (F1+F2+F3). Full list: 13 including conditional and optional items — roughly 1.5-2.5% of a 503-line document.

**Verdict, stated plainly:** the operator's instinct that it "could be more concisely written" is largely already spent. The document is a deliberately compressed always-loaded shell: `prevent-overengineering` §3, `uncertainty-and-honesty` §1, `scope-discipline` §5/§7, `handoff-and-questions` §1/§4/§6, and `decision-tests.md`'s ten recorded refusals each show the duplication being pruned and the remaining duplication being *by design* — rules pointing back up at AGENTS.md so content exists exactly once at the always-loaded level. The genuine remaining cuts are exactly the passages whose governed moment is a mutation (F1, F2) plus one completion checklist (F3). Prose-level density is what is left, and shrinking it below its current single-copy state would mean either letting content go quiet on read-only turns or widening rule triggers the way `communication.md` was widened — an operator decision, not an edit.
