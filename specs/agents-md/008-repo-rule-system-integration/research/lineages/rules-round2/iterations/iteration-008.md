{"timestamp":"2026-09-12T09:29:46.180Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":70,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
# Iteration 8 — findings

New surfaces this iteration: the meta-reference docs read in full against the live corpus, both hub machine files, the complete six-agent inventories for `context` and `design`, the dispatch contract's field list, and a first-hand line-by-line re-read of the 249-line target. Prior iterations' findings are cited only where re-verified, corrected, or load-bearing for a new conclusion.

---

## P1. Test restraint

**Verdict: already covered (suppression) + refuse (residual). No new rule; no new section on today's record.**

**Deciding tests:** Test 3 part 2 — existing home, and the routing table settles the shape: "A new section inside the rule that already owns it" (`decision-tests.md:91`, `:133`) — for the suppression half; **Test 4** (restraint) for the residual: "what fails today without this rule? Nothing concrete → refuse" (`decision-tests.md:111-115`).

**Evidence (all first-hand this run):**
- Owner and content both exist: `REPO RULES.md:40` routes "add a test beyond the coverage floor" to `prevent-overengineering.md`; that rule fires on the same phrase (`prevent-overengineering.md:40`) and its §4 Tests paragraph (`:130-131`) routes the floor/bar to `AGENTS.md` §3 and applies the ladder "to test code exactly as to the code under test"; `AGENTS.md:207` carries the floor, the earn-bar, and the three prohibitions, with "this rule never waives it."
- The section fallback also fails: `creation-standards.md:50-51` — "read the section and say aloud what breaks without it. If you cannot, the section is a topic rather than a rule, and it goes." And the topic-trigger trap names this exact subject: "A rule that fires on 'thinking about testing' fires never" (`creation-standards.md:140-141`).
- Count reduction cannot be an unqualified duty at all: rule files are level 3 and "None relaxes a HARD BLOCK" (`REPO RULES.md:24-32`), while the floor's non-waiver is `AGENTS.md:207`. "Reduce tests while keeping coverage" therefore only ever restates the floor.
- "Do more with less" is the shipped ladder: `prevent-overengineering.md:60-66`; "Extend an existing function or module in place" (`:62`) precedes "Add a new function" (`:63`), and `:130-131` applies that order to test code. The earn-bar itself ("failing for one real reason no current test catches", `AGENTS.md:207`) already forces the consolidate-before-add question.
- Pre-refused upstream: "testing" is one of the ten the four-part test must still refuse (`decision-tests.md:95-97`); a new rule file for it is out of bounds with the failed condition named (`iteration-005.md:195-197`).

**Cost if written anyway:** a level-3 rule (or section) that either restates always-loaded text or collides with a non-waivable floor, and that — being a licence to do less — would itself require a misreading guard (`creation-standards.md:127-128`). The mechanically correct fallback stays a section in `prevent-overengineering.md` §4 Tests, admissible only after a real failure is recorded (`decision-tests.md:135`).

---

## P2. Context-gathering on cheaper models

**Verdict: refuse. Not a rule file, not an AGENTS.md row.** Tier *selection* is Out; the tier's legitimate home is runtime agent config + per-mode catalogs.

**Deciding tests:** **Test 2 (scope boundary)** — `REPO RULES.md:85-89` Out = "the *mechanics* of agent and CLI dispatch: which agent, which command, which model, which flags"; `:103-104` "Choosing between runtimes, agents, commands, models or flags stays Out, unchanged"; `decision-tests.md:62-63`, `:67` ("Routing → refuse"). **Test 1 independently** — context gathering happens on turns that may write nothing, and rules load only at the first write (`AGENTS.md:122`; `decision-tests.md:38`); on exactly those turns, no rule file loads and the router row would fire only later. **Test 4** for any recast "posture" form: no named failure exists for the over-tier class.

**Evidence:**
- The naming problem is already solved; the idioms to copy exist — but note *why they work*: `AGENTS.md:356` ("Read the config for the current roster; a list written here goes stale between commits"), `AGENTS.md:360` ("Enumerate at runtime, never from a written list"), and the corpus's own class-noun idiom `delegation-and-orchestration.md:39` ("a CLI executor, a sub-agent, a fan-out lineage, a deep loop" — classes, never products). The in-spec precedent "that runtime's cheapest capable dispatch model" names the class and defers the roster; it lives in a spec, not a rule, for the same reason.
- What the context agents already bind (fresh reads): `.opencode/agents/context.md:6-18` read-only permission block (read/grep/glob/list allow; write/edit/bash/task/webfetch/patch deny), `:23` exclusive entry point for exploration + never nested delegation + never writes, `:25` continuity order, `:29` advisor hints never override, `:31` routing rule, `:37-43` LEAF-only HARD BLOCK; `.pi/agents/context.md:4-8` tool allowlist, `:14`, `:16`, `:22`, `:26-34` the same doctrine. Neither mentions model, tier, or cost.
- Fleet inventory (new): a grep for `model|effort|cost|cheap|reasoning` across all six context agent files hits **exactly one place** — `.codex/agents/context.toml:6-7` (a concrete model id plus an effort setting). The only tier binding in the fleet is a conversion artifact, i.e. precisely the layer a rule would drift against on the next roster change.
- The dispatch contract omits tier by design: `agent-io-contract.md:45` (`task_type`), `:136` (`complexity: low | medium | high`), `:53` ("Receivers treat these fields as routing hints… the agent definition and runtime safety rules win"). There is no cost/tier field to key on; complexity is a work attribute, never a model pick.
- The corpus's cost vocabulary is delegation-decision and reversal cost, never executor selection: `delegation-and-orchestration.md:18`, `:66-69`, `:224-226`, `:247`; `prevent-overengineering.md:55-66`; `blast-radius.md:18`, `:62`, `:79`, `:154`.

**Cost if written anyway:** a second, guaranteed-stale roster; a trigger collision with the delegation file's existing "cheaper to just do it" find surface (`:18`); and silence on the read-only turns it targets. If enforced, the honest route is the operator escalation the routing-refusal playbook names — widening the scope statement is an operator decision, never a workaround.

---

## P3. Design fundamentals first

**Verdict: refuse. Rule, AGENTS.md row, and section all fail; the existing routing is strictly broader.**

**Deciding tests:** **Test 2** — "skill routing, workflow selection" is Out (`REPO RULES.md:85-86`; `decision-tests.md:62-63, :67`). **Test 1** — the load must bind while *reading* (a UI review or audit is read-heavy), but rule files are write-gated (`AGENTS.md:122`); test 1's answer routes such content to `AGENTS.md` (`decision-tests.md:38-40`) — where it is still routing and still dies at test 2. The routing carve-out (`REPO RULES.md:91-96`) admits only *verifying wiring you changed*; it does not admit selection, so the proposal cannot shelter under it.

**Evidence:**
- All six design agents already bind the load as an ALWAYS: "Decide measure-versus-decide before loading a skill" + "Load the routed skill before acting" at `.claude/.cursor/.devin:165-166`, `.codex:169-170`, `.pi:173-174`, `.opencode:179-180`; and the anti-pattern row "Loading a skill before routing … Route first, then load one" at `.claude/.cursor/.devin:211`, `.codex:215`, `.pi:219`, `.opencode:225`. (Cursor and devin were verified by direct read — my earlier grep missed them on path shape, not drift.) A "load fundamentals first" rule instructs the refused order; the anti-pattern's named failure — "the loaded skill biases the answer toward its own job" — is exactly the preload risk.
- The hub already does the wish as its default: `sk-design/SKILL.md:3` ("starting with `sk-design-fundamentals`"); `:141-143` `defaultMode` because "a design question with no clearer owner is a values question"; `hub-router.json:5`, and `:59-98` — the fundamentals vocabulary classes are already "padding / spacing / type scale / contrast … design review / ux laws / accessibility contrast". A rule restating them creates a second, non-authoritative router for the same words. Hub rule 2 refuses whole-tree preloads ("Load what the mode's own router resolves, not the whole tree", `:198`), and `:15-16` — the hub "carries no procedure of its own."
- Even within fundamentals, content loads situationally, not as a block: `.pi/agents/design.md:114-124` gates each reference by condition ("Nothing exists yet", "A vague complaint about existing UI", "Reviewing UI code"); `sk-design-fundamentals/SKILL.md:23` scopes itself to UI "built, fixed, or reviewed"; `:51-53` routes extraction and application logic out.
- The boundary is deliberate both ways: implementation → `sk-code` (`sk-design/SKILL.md:32-33`), canvas requests direct (`:34-35`), so a blanket "UI work → fundamentals" over-triggers on charts/diagrams and misses the decks/print surfaces the hub actually owns (`:22-25`).

**Cost / interaction:** it would fight the agents' ordering rather than complement them (load-before-route versus their explicit route-first), duplicate the hub's default and vocabulary, and reach strictly fewer turns than the Gate 2 advisor vocabulary already does — which fires on read-only turns, where a rule cannot.

---

## P4. Shortening `delegation-and-orchestration.md`

**Verdict: subtract; no content added. Recommended 16-line set → 233 counted; two further candidates available if wanted.**

**Budget (re-verified first-hand):** display is 250 rows with `:250` empty; `check-repo-rules.cjs:26` sets `LINE_LIMIT = 250` and `:54-58` pops exactly one trailing empty line → counted **249**, fails only above 250. One line of slack: any two-line addition breaks the checker.

**Confirmed cuts (range / Δ / cost):**
- `:37-38` — **−1**. Drops the history clause ("this file used to fire only after it"). Cost: none to obligations.
- `:50-51` — **−2**. Posture gloss restating the binding sentence. Cost: "you own the decomposition" phrasing (carried in substance by `:97-98` and `:115-117`).
- `:57-64` — **−8**. Setup sentence + four-row posture table. Re-verified survivor correction: row 3's "confidence tells you nothing about its accuracy" has **no** body twin — `:129` says hypothesis, `:144-145` says same-opinion — its residue is `:151-153` plus the protected failure `:165-166` and always-loaded `AGENTS.md:245`. Cost: the at-a-glance summary; largest single block, take it deliberately.
- `:86-88` — condense 3→1, **−2**. The contract-read is always-loaded (`AGENTS.md:492`, Dispatch Rules); the condense must keep the sentence self-check `:238` traces to (`creation-standards.md:106`).
- `:129` — **−1**. Restates `AGENTS.md:245`; §5 restates at `:151-153`.
- `:229-230` — **−2**. Restates `REPO RULES.md:85-89`; §8's misreading guard survives in bullets 1, 2 and 4.

**New this iteration:**
- `:144-145` — **−2** (confirmed from iter 7, cost validated): removes the only explicit refusal of same-model double-runs; §4's heading plus "ask a second model family" (`:138-139`) carry it. Take only if 233 is not enough.
- `:101-106` — condense 6→4, **−2** (new): keep the obligation, "stops forever and reports success", and "Put the answer in the prompt. Give the decision, not permission to skip it"; compress the env-var mechanism to one clause. Cost: the waiver-true-not-observable / environment trap is stated nowhere else — last resort.
- Compress-only, if ever needed: `:151-153` 3→2 (−1, no clause lost); `:224-226` 3→2 (−1, cosmetic); `:185-186` (−2, §6 loses its motivation sentence; not taken at 233).

**Protected (line-by-line re-verified):** `:32-33` header, `:44-48` binding sentence, `:66-69` cost check, `:71-72` / `:122-123` / `:165-166` / `:190-191` labelled failures, `:74-78` disclosure + falsifier, `:93-96` freeze, `:99-100`, `:112-113` (§3's only statement of the mechanism — reviewed, keep), `:131-142`, `:155-163`, `:168-176`, `:197-204`, `:206-218` (two named failures), `:236-249` all 11 self-check items. Structural check: `creation-standards.md:102-104` asserts 9 sections / 11 items — verified true today and unchanged by every cut. Frontmatter lever stays closed: 28 lines, 20 trigger phrases at the top of the 16–20 band (`creation-standards.md:76-77`).

---

## P5. Wider analysis

**Verdict: the rule set is complete against P1–P3; P4 is subtraction-only. Two concrete defects surfaced — both doc-vs-artifact drift in the skill layer, neither a new rule.** Ranked by damage prevented:

1. **Meta-reference drift against the corpus they govern (highest damage).** `rule-anatomy.md:3` "nine shipped files", `:17` "the eight files under `repo-rules/`", `:150` "All eight files", `:155` "194 phrases across the 11 files"; `creation-standards.md:26` "nine shipped rules", `:115` "Three of eight carry a `WHAT THIS RULE IS NOT` section", `:124` "The five rules without one", `:138-139` "four sideways links across eight files", `:142-143` "three of eight sit comfortably under 160 lines", `:155-156` "Every test here passes on all nine shipped rules." Actual corpus: **11 files** (ls); **5 of 11** carry `WHAT THIS RULE IS NOT` — `presenting-decisions.md:136`, `prevent-overengineering.md:147`, `communication.md:171`, `handoff-and-questions.md:144`, `delegation-and-orchestration.md:222`. So "three of eight" is wrong on count and on membership: the two newest licence-to-do-less rules carry the guard the doc says only three rules have. The docs' central guarantees are stated over a snapshot that excludes the last rules, and "194 phrases across the 11 files" is *this repository's* count inside a reference that ships to other repos. No checker covers it: `check-repo-rules.cjs` checks files/router/phrases/structure (comment `:5-9`; collision check `:248-256`) and never reads these references (grep: zero hits). Fix class: de-number the references (state invariants — "no collisions", "all shipped rules pass these tests, checked per review" — not counts), or move corpus facts into the checker's output (it already prints `phrases=… collisions=0`). Damage prevented: every future rule decision, including P1–P4, judged against a phantom baseline; adopters elsewhere reading these numbers as normative.
2. **sk-design hub prose vs its own machine router.** `sk-design/SKILL.md:138` "return single or ambiguous according to `hub-router.json` `routerPolicy.outcomes`" and `:143` "Outcomes are `single`, `ambiguous` or `none`" — but `hub-router.json:13-18` defines `single | orderedBundle | defer | none`; there is no `ambiguous` key. A reader implementing the pseudocode follows a vocabulary the machine file does not define. One-line alignment fix; small damage, but it is the hub's own outcome path.

**Completeness defense:** audited this iteration — corpus + router, `decision-tests` + `creation-standards` + `rule-anatomy`, all six context agents, all six design agents, the dispatch contract, the sk-design hub (SKILL, hub-router, fundamentals mode), the 040 hand-off. Exactly two defects surfaced; every other candidate remains inside the 040 out-of-bounds list (`iteration-005.md:195-199`) or the router's Out clause. No third evidenced need exists; a new rule today would fail test 4 by construction.

---

## Ranked list across all five

1. **P4 — subtraction (16 lines, optional −4 to −6 more).** Restores headroom on the corpus's largest file before the next edit fails the checker; editorial cost only; touches no self-check item and no named failure.
2. **P5.1 — de-number the meta-references.** Protects the baseline every future rule decision is measured against; doc-internal fix; the stale "194 across 11 files" is also wrong for every other repo the skill ships to.
3. **P1 — refuse and record.** Prevents a level-3 rule colliding with a non-waivable floor or restating always-loaded text; the section fallback remains admissible only after a recorded failure.
4. **P2 — refuse.** Prevents roster drift and an explicit Out breach; if insisted, operator escalation of the scope statement, not a draft.
5. **P3 — refuse.** Prevents a second design router and the preload order the design agents' anti-pattern table refuses; existing routing is strictly broader (it fires on read-only turns).
6. **P5.2 — align the hub's outcome keys.** One-line prose fix; low damage today.
