{"timestamp":"2026-09-12T08:49:03.474Z","runtime":"claude","status":"skipped","freshness":"live","durationMs":866,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_ADVISOR_UNAVAILABLE"}
## Method and status

Read-only. Primary sources read directly: `AGENTS.md`, `REPO RULES.md`, all eleven `repo-rules/*.md`, the four `sk-create-repo-rule` references, `check-repo-rules.cjs`, three context agents and three design agents plus `sk-design/SKILL.md`, the create-command verify block, and the prior decision records (`specs/sk-doc/040-create-repo-rules/007-.../decision-record.md`, `specs/sk-doc/043-repo-rules-router-audit/implementation-summary.md`, `specs/agents/010-repo-rule-system-integration/research/synthesis.md`). No shell in this toolset, so the checker was not executed; every claim below is a file read at this revision and cited.

---

## P1. Test restraint

**Verdict: already covered for the suppression half; the remaining half is admissible only as prose inside the existing Tests item of `prevent-overengineering.md`, and even that is blocked today. As a new rule file: refuse.**

**Tests.** Test 1 passes: test writing is an action, and the trigger row already fires on it (`REPO RULES.md:40`, "add a test beyond the coverage floor"). Test 2 passes (restraint is posture, In). Test 3 part 2 decides: an existing home exists. Test 4 then decides the residual: no named failure is recorded, and that test is explicit (`decision-tests.md:113-115`).

**Evidence.**
- Suppression already binds: `AGENTS.md:207` states the coverage floor, the earns-its-place bar, and the three prohibitions ("no test per branch, no re-asserting framework or language, no mirroring the implementation"); `prevent-overengineering.md:130-131` routes the floor and bar to §3 and applies the restraint ladder to test code; `REPO RULES.md:40` routes test additions to that rule.
- The class is pre-refused: "testing" is one of the ten candidates already declined by this same four-part test (`decision-tests.md:95-97`; verified in the 010 refusal table at `synthesis.md:404`).
- The genuinely new content (prefer improving test infrastructure, consolidating overlapping tests, reducing test count with coverage kept) has no recorded failure. Across roughly forty refused candidates in the prior research run, none was a test-bloat failure (`synthesis.md:398-462`); Test 4 says an unnamed failure routes nowhere and is recorded, not written.

**Cost.** A new file duplicates a home and creates a second place to change. Two interactions to respect if the operator later overrides: `AGENTS.md:207` says the coverage floor "comes first and this rule never waives it", and `evidence-and-proof.md:69-70` requires an affirmative marker including the test count for a green run, so "reduce test count" must never be readable as weakening proof. If adopted, an operator override (precedent: the fourth widening, `REPO RULES.md:98-109`; escalation rule `SKILL.md:211`) would extend the existing Tests item, not create a file.

## P2. Context-gathering delegation on cheaper models

**Verdict: refuse as a rule file (two independent refusals). If the operator still wants it stated, the container is `AGENTS.md` (always-loaded), never `delegation-and-orchestration.md`, and the actual lever is each runtime's agent config.**

**Tests.** Test 2 decides first: model/executor selection is the "which model" family the scope statement lists as Out (`REPO RULES.md:85-89`; `decision-tests.md:62-68`; `SKILL.md:201` NEVER 2). Test 1 refuses independently: context-gathering dispatches happen on read-only turns, where Gate 5 never fires (`AGENTS.md:122`; the same reason is on record for a dispatch-time duty at `synthesis.md:439`), so a rule file would be silent exactly when the preference should govern.

**Evidence.**
- The exact class is already a recorded refusal scenario: RRD-003's prompt is "which CLI executor we should pick for research runs, and which thinking level to set", and the expected outcome is a test-2 refusal with the Out clause quoted, no new file, scope untouched (`manual-testing-playbook/rule-decision/routing-refusal.md:31-34`, `:46`, `:57`).
- What the context agents already bind, so a rule must not restate it: read-only, LEAF-only, no nested dispatch, scope lock, canonical continuity first, query-type tool routing, output budgets and the Context Package, anti-hallucination rules (`.claude/agents/context.md:9`, `:17-18`, `:21-28`, `:61`; `.pi/agents/context.md:14`, `:22`, `:26-34`). None of them mention a model or cost. The Codex variant hardcodes one concrete model id and its reasoning effort in the agent config (`.codex/agents/context.toml:5-7`), which is where a model binding legitimately lives; a rule naming any model would drift against that file on the next roster change.
- The model-agnostic language the requirement asks to copy already exists in three places. The roster-deferral idiom: "Read the config for the current roster; a list written here goes stale between commits" and "Enumerate at runtime, never from a written list" (`AGENTS.md:356`, `:360`). The single-source idiom: each CLI mode's `references/providers-and-models.md` is the dedicated single-source index of providers, model ids and dispatch shapes (`cli-external-orchestration/SKILL.md:196`). The capability-class phrasing: "that runtime's cheapest capable dispatch model" (`specs/hooks/002-injection-bloat-reduction/010-playbook-cheapest-model/spec.md:65`). Copy the approach: state the objective and defer the roster to the runtime's own catalog or config.

**Cost.** An `AGENTS.md` row costs always-loaded tokens (that file is already 10,622 tokens, `043/implementation-summary.md:73`) and still cannot change which model a runtime assigns; only config and per-mode catalogs can. A rule file would cost review attention and would never load on the turns it targets.

## P3. Design fundamentals before design work

**Verdict: refuse. No new rule; no `AGENTS.md` row needed. The obligation already binds in the agent layer and in Gate 2.**

**Tests.** Test 2 decides: loading a named skill is skill selection, which is Out (`REPO RULES.md:85-89`, `decision-tests.md:62-68`). Test 3 part 2 corroborates: the home exists and fires earlier than a rule could. Test 1 also bites for review-type design work, which is read-only; the agent files carry the instruction on every turn regardless.

**Evidence.**
- Both design agents read bind it as a first duty. "Load the routed skill before acting, and run its own verification before claiming a result" (`.opencode/agents/design.md:180`; `.claude/agents/design.md:166`; `.pi/agents/design.md:174`), with the anti-pattern "Route first, then load one" (`.opencode/agents/design.md:225` and mirrors).
- The hub owns routing and does it in two stages (`sk-design/SKILL.md:15-16`, `:41-46`), defaults an unclear design question to the fundamentals mode (`:141-143`), and points every decide request at its own scale sources; `AGENTS.md:455` already routes extraction work to `sk-design-md-generator`.
- Boundary evidence against a broader rule: the hub explicitly declares implementation out of its scope and assigns it to `sk-code` (`sk-design/SKILL.md:32-33`), and the design agent hands decided values to the code agent without dispatching it (`.opencode/agents/design.md:138`). A rule that makes every agent doing UI work load design fundamentals would sit on the wrong side of that deliberate split.

**Cost.** A rule would duplicate an instruction that four agent files already carry (a second, drift-prone source), fire later than the agent's own routing step, and add load weight for no new binding. If the operator's real concern is non-design agents implementing undecided UI, that is a routing-surface question for `AGENTS.md` §2/§10 or `sk-code`, and no failure of that kind is on record.

## P4. Shortening `delegation-and-orchestration.md`

**Verdict: cut. Three safe cuts (~12 lines) restore headroom with no obligation loss; one optional deeper cut trades coverage for six more lines. Do not touch the self-check (238-249) or the labelled failures (71-72, 122-123, 165-166, 190-191).**

**Ceiling facts.** The file is 249 counted lines; the checker fails only above 250 (`check-repo-rules.cjs:26`, `:261-263`; one trailing newline is not counted, `:54-59`), so one more line reaches the limit and a second fails it. `rule-anatomy.md:91-92` defines 201-250 as "At the limit" and its own table already lists this file at 248 (`:106`, stale by one per the 010 audit, `synthesis.md:517`).

**Cuts, with cost.**
- **57-64 (setup sentence plus the four-row posture table): ~8 lines.** Every row's obligation survives at `:97-98` (write the scope down), `:115-117` (what the delegate must read), `:129` and `:151` (confidence is not accuracy), and §5 (you own verification). Keeps the heading at 55 and the cost check at 66-69. Cost: loses the at-a-glance before/after summary, and note the 043 audit specifically repaired this table's corrupted row-four cell (`043:163-164`), so deleting it should be deliberate.
- **50-51 (the posture gloss after the binding sentence): 2 lines.** Restates the bold rule at 46-48. Cost: "you own the decomposition" is not stated elsewhere; small.
- **229-230 (§8 bullet "Not a routing document"): 2 lines.** Restates `REPO RULES.md:85-89`. Cost: removes the in-file boundary reminder; §8's required misreading guard survives in bullets 224-228 and 231-232, which is what `creation-standards.md:120-122` cites this file for.
- **Optional: mid-213 to 218 (the "Two catches" and pathspec-construction block): ~6 lines.** Keeps the obligation at 206-212, the index trap, and the `git commit -- <paths>` instruction. Cost: loses two documented commit-sweep failure modes, including the pathspec-from-index trap. Take this only if the 12 lines above are not enough; content of this class belongs to `sk-git` mechanics, and a cross-reference would need adding there if this is cut.

**Explicitly refused cuts.** Trigger phrases 5-24 (deliberately kept for matching vocabulary and the collision check, `043:203-206`); §8 bullets 224-228 (documented misreading guard); self-check 238-249; the labelled failure paragraphs; the two verbatim header blockquotes (`rule-anatomy.md:53-54`). Net: 249 to about 237 with A-C, about 231 with D.

## P5. Wider analysis

**Set-level answer first: no new rule files. The set is complete for now, and that is a defensible result, not a null one.** All four proposals above land on refusals, existing homes, or an `AGENTS.md`/config surface, and P1-P3 each collide with a class already on the ten-refusal list (testing, delegation-mechanics) or the scope boundary (`decision-tests.md:95-97`). Ranked by damage prevented, what the *system* still needs is not rules but enforcement and truth maintenance:

1. **Close the two coverage gaps in the new checker.** `check-repo-rules.cjs` checks counts, router-row link resolution, phrase uniqueness, the ceiling, frontmatter keys, and divider parity (`:302-309`), but it never compares a trigger row's action text against the rule's `Fires when` list (`:210-223` walks router rows only), and it never resolves links inside rule bodies. Both gaps are the recorded requirement set from the prior research (`synthesis.md:263`: resolve symlinks, cover root-level files, check row-versus-fires coverage) and the exact failure class that produced five silently under-covered rows (`synthesis.md:39-53`). Damage prevented: a rule whose fire has no row phrase never loads, and `REPO RULES.md:18` says a non-firing trigger is not a near miss, it is silence.
2. **Decide how the checker is run at all.** The checker is referenced in exactly one place, the authoring skill's verify step (`SKILL.md:170`), and `.github` contains zero repo-rule matches (grep verified); the 043 audit left "no automated checker was wired" as a limitation (`:265`) and asked whether it should become a gate (`:216-219`). Every invariant it now covers can drift between authoring runs. This is an operator decision (owner + trigger), not a rule.
3. **Repair the authoring references' self-description.** `rule-anatomy.md` is internally inconsistent and stale against the current eleven-file corpus: "nine shipped files" (`:3`), "the eight files... 8 of 8" (`:17-19`), "9/9" (`:47`), a "Total lines 145-224" claim its own table falsifies (`:77`), delegation tabled at 248 against 249 measured (`:106`), a cross-link count certified for nine files (`:122`). `creation-standards.md` still says "Three of eight" carry a `WHAT THIS RULE IS NOT` section where five of eleven do (`:115`, `:121-124`). Also verified: `skill-hub-routing.md:22` carries `importance_tier: normal` against ten peers at `important`, a deliberate divergence (`:31` explains it) that `rule-anatomy.md` never registers (`synthesis.md:365-373`). Damage: the contract that governs every future rule misdescribes the corpus it governs. The recorded fix direction is deletion or scope nouns, not recounting (`synthesis.md:124-163`).
4. **Gate-5 reach on the mirror runtimes is still unverified.** Codex and Cursor carry a Gate 1 pointer and no Gate 5 reach signal, and the doctor models gate-1 reach only (`synthesis.md:355-363`; not re-verified by me this pass, and it is the largest unmeasured assumption behind every "move it out of `AGENTS.md`" decision). Damage potential is high but the status is "unmeasured", not "broken".
5. **One misdirected citation, repoint while P4 touches the file.** `delegation-and-orchestration.md:203-204` says "not my code" is refused by `evidence-and-proof.md`; that file refuses acting on unconfirmed findings, while the ownership refusal lives at `AGENTS.md:185`. One line; low damage, stale-pointer class.

**Verified closed since the prior research (do not re-propose):** the federation defect is gone; both siblings now carry `presenting-decisions.md` and `handoff-and-questions.md` and their routers carry both rows (`Mobile CLI/REPO RULES.md:56-57`, `:80-81`; `Obsidian Plugin/REPO RULES.md:53-54`, `:74-75`), closing `synthesis.md:13` and `:29-37`. The five under-covered trigger rows are repaired; I checked rows `REPO RULES.md:40-50` against each file's `Fires when` and the previously missing fires and keywords are present. The refusal register now names a destination (`decision-tests.md:136-143`). No CI/hook change occurred, per the grep above.

---

## Ranked list across all five

1. **P4, do it now**: the only affirmative action, cheap, no obligation loss, restores headroom before the next edit risks a ceiling failure or a lossy cut (A+B+C; D optional).
2. **P5.1, checker coverage**: highest damage prevented, because a partial checker guards everything except the two ways a rule silently stops working.
3. **P2, refuse with the destination named**: protects the Out boundary and the read-turn gap; if stated at all, `AGENTS.md` plus runtime config, using the existing roster-deferral language (`AGENTS.md:356`, `:360`).
4. **P5.3, authoring-reference truth**: low per-edit value, affects every future rule; do alongside any next authoring pass.
5. **P1, record the refusal (suppression already covered; consolidation blocked by Test 4 absent a named failure)**.
6. **P3, refuse**: fully bound already; a rule would duplicate four agent files and collide with the decide/implement split.

Status: read-only, nothing edited; the checker was not run (no shell available), so P4's counts are read-derived and P5.1 is a code-level reading of `check-repo-rules.cjs`. What is the operator's: pick a trigger and owner for the checker, and decide whether P1's consolidation content gets an explicit override with a named failure.
