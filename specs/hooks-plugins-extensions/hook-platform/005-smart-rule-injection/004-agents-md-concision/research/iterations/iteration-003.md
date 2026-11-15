{"timestamp":"2026-09-12T18:08:45.752Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1344,"cacheHit":false,"skillLabel":"sk-code"}
Verdict first: under the read-only test the document is close to its floor, not bloated. This pass recovers up to 18 lines (~3.5% of 502), all outside iteration 2's visible inventory: one 4-line duplication block (blast-radius bullets), one 4-line duplication block (final-state steps), one 4-line pointer dedup, one 3-line compression, two single-line entries. The large blocks (gates, five standards, restraint table, git table, §5) were re-tested against every rule's `Fires when` list and survive because their would-be carriers cannot load when nothing has fired.

## 1. DUPLICATION

**D1. AGENTS.md:164-167, the four Blast-Radius bullets (4 lines).**
Carried by `repo-rules/blast-radius.md`: §3 THE ROLLBACK SENTENCE (:84-96), §4 WHO STILL SPEAKS THE OLD CONTRACT (:100-113), §5 PERSISTENCE BOUNDARIES (:117-134), §6 INSTALLING IS A MUTATION (:138-142).
Triggering condition: blast-radius.md:33-37 fires on "Delete, overwrite, truncate, migrate, deploy, publish, send, or install", "Change a shared contract", "Touch authentication... persisted user data", "Any call that leaves this machine". REPO RULES.md:44 routes on the same actions.
Mapping: :164 ("write how to undo and wait for confirmation") = blast-radius.md:86-91. :165 (deployed servers, installed clients, caches, API consumers) = :104-110. :166 is near-verbatim of :119-134. :167 = :140-142 and prevent-overengineering.md:141-143.
Line :163 and pointer :161 stay: blast-radius §1 (:46-53) fires only on that action list, and "open non-trivial work" can be a read-only planning turn, so its carrier does not fire when it is needed. Line count recovered: 4. Risk: medium, the four bullets are the always-loaded scan for tier-3 actions.

**D2. AGENTS.md:257-260, FINAL-STATE VERIFICATION steps (4 lines).**
Carried by `evidence-and-proof.md` §9 FINAL-STATE PROOF (:160-169), item for item: :257≈:164, :258≈:165, :259≈:166, :260≈:168-169 (the rule is equal or tighter, "There is no third option").
Triggering condition: evidence-and-proof.md:34-38, "About to say 'done'... tick anything off as done... closing out a turn". REPO RULES.md:42 routes on it. Gate heading (:253), pointer (:255) and trigger (:256) remain.
Caveat: completion claims can be made on read-only turns, where the rule cannot load. The kept five standards (:239-247) cover claim hygiene but not "artifact at exact path" or "no residue in the scoped diff". If the operator wants zero loss there, keep :260's block sentence and recover 3. Precedence note: §4 sits outside the level-1 list at REPO RULES.md:24 (which names §1 and §2), and §9 is at least as strict. Recovered: 4 (3 with the caveat applied).

**D3. AGENTS.md:205-206 (2 lines).**
:206 ("Require fallbacks only for real constraints") is a near-verbatim compression of prevent-overengineering.md §4 Fallbacks (:136-139, "Add the no-install path... only when you can name the environment that needs it"). :205 ("Prefer available project tools") is carried by the same §4 Dependencies (:141-143) and blast-radius.md §6.
Triggering condition: prevent-overengineering.md:37-40 ("Adding a file, module... or dependency") plus its trigger phrases "add a dependency" (:19) and "fallback for a constraint that does not exist" (:24). REPO RULES.md:40 routes on it.
:206 is the clean cut. :205 is softer, preferring existing tools also nudges read-only design advice, take one or both. Recovered: 2 (1 if only :206).

## 2. OVER-DETAIL

**O1. AGENTS.md:276-282, "Invoking validate.sh" (5 body lines, recover 3).**
The mandate already lives in evidence-and-proof.md §2:80-81 ("Require the affirmative marker (`RESULT: PASSED`, the test count, the file listing)"), and the four traps are owned by system-spec-kit (:281-282). Proposed shorter form:

> **Require an explicit `RESULT: PASSED`** — the harness has four ways of reporting a pass it never performed; every other signal, including exit status and the absence of `FAILED`, has been wrong in both directions. The traps and their exact commands are `system-spec-kit`'s, in `references/validation/validation-rules.md`.

Drops "each has already certified a broken packet as green" and the wrap. Keeps the sentence that must hold on turns where nothing loads.

**O2. Identical "Expanded by" lines: three sets, up to 4 lines.**
:90, :389 and :480 are byte-identical (`uncertainty-and-honesty.md`). :202 and :213 are byte-identical (`prevent-overengineering.md`). :235 and :255 are byte-identical (`evidence-and-proof.md`). Keep one per set, for example:

> Expanded by [`uncertainty-and-honesty.md`](repo-rules/uncertainty-and-honesty.md).

Delete :389 and :480, delete :213, and delete :255 unless D2 passes, in which case keep :255 (it becomes the gate's only pointer) and delete :235. The other ~15 "Expanded by" lines are unique pointers, not copies, leaving them is correct, consolidating them would be a rewrite, not a dedup.

**O3. AGENTS.md:182 (1 line).**
Gate timing repeats :11. Precedence repeats :11 and :127. The router inventory repeats REPO RULES.md:3-6 and its own §1/§3/§4, all of which load at the same Gate 5 moment. "Do not re-derive them here" is addressed to maintainers and has no agent-time effect. Proposed shorter form, or deletion:

> **Repo-local rules load at Gate 5 (§2).**

## 3. MUST NOT MOVE

- **:163 stakes read.** Kept with D1. No fires-when row covers "open non-trivial work".
- **Halt Conditions, :48-56.** No rule fires on a missing target file, an Edit "string not found", a merge conflict or an unclear test/prod boundary. root-cause-and-debugging.md:34-37 fires only on failing checks, scope-discipline.md:35-39 on noticing out-of-scope defects.
- **:136, the Violation Recovery exception.** Kept at the cost of 1 line: it stops :135's "ASK Gate 3 WAIT" from contradicting :78 on the exact path where an agent is recovering from a skip.
- **:209, truth over agreement.** Near-copy of uncertainty-and-honesty.md §3 (:76-85), but it governs replies, and the replies most likely to need it are read-only turns where no rule loads.
- **:411, the two clauses.** decision-tests.md:48-51 records them as the deliberate unconditional survivors of the §8 move. communication.md §8 (:181-192) holds the full versions.
- **Four Laws, :19-28.** REPO RULES.md:24 makes them level 1. Law 1 has no expansion file. scope-discipline.md:64 relies on "Law 2". Flag, not a cut: "the bounded remediation loop" (:28, :260) has no definition anywhere ("remediation" matches only those two lines in AGENTS.md, zero matches in repo-rules/), the nearest bound is :192's "the code skill's repeated-failure limit".
- **Five standards, :239-247.** Self-declared unconditional at :239, their expansions cannot load on the turns the declaration names.
- **:204, :207, :208.** :207 is the authority prevent-overengineering.md:130 explicitly defers to. :208's closer at evidence-and-proof.md:206-209 sits under a claim-shaped trigger (:34-38) that does not fire before the change it governs. :204 plus :181's ladder gloss: the numbered duplicate was already subtracted once (decision-tests.md:117-119), the survivor is deliberately unnumbered.
- **Git Workspace Safety, :326-335.** git/PR is one of the ten refusals (decision-tests.md:95-97), this table is its routed home, and the push row's always-loaded posture is the point, with hooks as the backstop (:334-335).
- **§5, :317-363.** No rule's `Fires when` names retrieval, MCP or terminal discipline, checked all eleven. :319's "a miss is a clean no-hit" guards confabulation during read-only recovery.
- **Gate 3, :65-79.** Fires before the Gate 5 load path exists (:104 queues behind it). :66's "A read-only word next to a write trigger does not disqualify it" is the gate's own guard against failure mode 1, and :68 splits vocabulary ownership, which is why both forms stay.
- **Read-only carriers that look removable and are not:** :501 (handoff-and-questions.md:35 fires on ending "a turn, of any kind" but cannot load on read-only turns), :483-485 and :391-393 (same against uncertainty-and-honesty.md). :152-155 left untouched, iteration 2 holds the open conditional proposal there.

## 4. RANKED

1. **O2, pointer dedup, up to 4 lines, near-zero risk.** Byte-identical text, no obligation carried, one scroll of navigation cost.
2. **D3, :206 (:205 optional), 1-2 lines, low risk.** Near-verbatim carrier that fires on the add itself.
3. **O1, validate compression, 3 lines, low risk.** Mandate stays on the page, only motivation and wrap go.
4. **O3, :182, 1 line, low-medium.** Loses only the router inventory a planner would otherwise see without opening it.
5. **D1, :164-167, 4 lines, medium.** Carriership is airtight, the cost is discovery on the tier-3 scan.
6. **D2, :257-260, 4 lines, medium.** Read-only completion claims and §4 hard-block hygiene are the open judgment calls, apply with the :260 caveat if uncertain.

Total: up to 18 lines, and the honest remainder is that this document has already been through this exercise, most of its detail is the part the read-only test forbids moving. If any candidates are applied, the operator decides the O2/D2 interaction first (:235 vs :255), everything else is independent.
