{"timestamp":"2026-09-12T08:55:47.979Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":90,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
## Method and status

Read-only throughout; nothing edited. No shell exists on this surface, so the checker was not executed — the 249-line count is the operator's, and I corroborated it two ways: the prior research run measured the same file at `wc -l` 249 (`specs/agents/010-repo-rule-system-integration/research/synthesis.md:517`), and the checker's `lineCount()` pops exactly one trailing terminator (`check-repo-rules.cjs:54-59`), which makes the read surface's 250-line view equal 249 counted lines. Fresh full reads this iteration: `REPO RULES.md`, `prevent-overengineering.md`, `delegation-and-orchestration.md`, `decision-tests.md`, `creation-standards.md`, `check-repo-rules.cjs`, `sk-design/SKILL.md`, plus the context and design agents across runtimes and targeted greps into `sk-git`, `cli-external-orchestration`, `retrieval-conventions.md`, and the 010 refusal record.

---

## P1. Test restraint

**Verdict: refuse.** Not a new rule. The restraint half is already covered in three places; the genuinely new half (prefer improving test infrastructure, consolidate overlapping tests, reduce count while holding coverage) fails the restraint test and stays a recorded refusal. If the operator later supplies a named failure, the correct shape is a single sentence inside `prevent-overengineering.md` §4's existing Tests paragraph — a single row, not a cluster — never a file.

**Deciding test:** Test 4 (no named failure) for the new content; Test 3 part 2 (existing home) for the half already binding. The class is additionally pre-refused: "testing" is one of the ten candidates the four-part test already declined — `decision-tests.md:95-97`, confirmed at `synthesis.md:404`.

**Evidence:**
- Suppression already binds: `AGENTS.md:207` states the coverage floor, the earns-its-place bar, and the three prohibitions; `prevent-overengineering.md:40` fires on "adding a test beyond the coverage floor"; `:130-131` routes the floor and bar to §3 and applies the ladder to test code; router row `REPO RULES.md:40`.
- Deletion already routes: `REPO RULES.md:44` sends "Delete…" to `blast-radius.md`, and the floor is a hard standard no rule may waive (`AGENTS.md:207` "this rule never waives it"), so "reduce test count" cannot be an unqualified duty.
- No recorded failure exists for the new half: the prior run's full refusal table (`synthesis.md:408-461`) contains no test-restraint candidate; a grep over `repo-rules/` finds no mention of test infrastructure, consolidation, or flakiness.
- The topic-trigger trap names this exact subject: `creation-standards.md:140-141` — a rule that fires on "thinking about testing" fires never.

**Cost:** refusal ≈ zero (the preference is recorded, not enforced). A file would cost a 12th file + trigger row + index row + checker parity + phrase-uniqueness against 194 existing phrases (`creation-standards.md:74`). The paragraph option costs 1–3 lines in a 164-line file, but only becomes admissible with a named failure.

---

## P2. Context-gathering on cheaper models

**Verdict: refuse as a rule file, and as an AGENTS.md row.** The content is dispatch mechanics — "which model" — which the scope statement assigns to `AGENTS.md` §2 and the skills. Model selection already lives in exactly two places: runtime config and the six per-mode catalogs. Record the refusal.

**Deciding test:** Test 2, scope boundary — `REPO RULES.md:86` lists "which model" among the Out mechanics; `decision-tests.md:63` and `:79-80` repeat that a model-picking rule is still refused; the delegation rule's own §8 disclaims it (`delegation-and-orchestration.md:229-230`). Precedent: RRD-003's prompt is literally "which CLI executor … which thinking level", expected outcome a test-2 refusal with the Out clause quoted (`routing-refusal.md:46`, `:57`).

**What the agents already bind (so a rule cannot restate it):** read-only boundary, LEAF-only/no-nested-dispatch, canonical continuity first, query-type tool routing, output budgets and the Context Package, and anti-hallucination rules — `.cursor/agents/context.md:4`, `:9`, `:11`, `:17-18`, `:21-29`, `:38`, `:115-124`, `:263-269`, `:333-337`; the Cursor and Devin copies are byte-identical mirrors of the Claude variant (`.devin/agents/context/AGENT.md:13` still carries the `.claude/agents/*.md` canonical-path line). None of them mentions cost, tier, or a model.

**Where model choice actually lives, verified:**
- The only agent-side model binding is config: `.codex/agents/context.toml:5-7` (`sandbox_mode = "read-only"`, a model id, an effort level). No `model:`/`effort:` key exists in any `.claude/agents/*.md` or `.opencode/agents/*.md` (grep: zero).
- The catalogs: six files `cli-external-orchestration/cli-*/references/providers-and-models.md`, declared as the single source at `cli-external-orchestration/SKILL.md:196` ("dedicated single-source index of that mode's providers, model ids, personas/effort tiers, and dispatch shapes").
- The delegation rule's existing economics are lens policy, not model policy: `:66-69` (delegate-vs-do cost check) and `:131-136`/`:144-145` (a factual question survives one delegate; judgment needs diverge/ground/escalate). The cheap-work half is already architected; only the tier-selection layer is external.

**The naming problem is already solved — copy this approach:** `AGENTS.md:356` ("Read the config for the current roster; a list written here goes stale between commits"), `:360` ("Enumerate at runtime, never from a written list"), `SKILL.md:196`, and the capability-class noun with the roster deferred: "that runtime's cheapest capable dispatch model" (`specs/hooks/002-injection-bloat-reduction/010-playbook-cheapest-model/spec.md:3`, `:65`). Every one of these defers the roster; the concrete ids live in playbooks/catalogs and were operator-chosen. Why nothing may name one is recorded in the repo itself: a catalog went stale while the live picker moved on (`implementation-summary.md:105`, lesson at `:82`), and a rule would drift against `.codex/agents/context.toml:6-7` on the next roster change.

**Cost:** refusal leaves an operator taste unenforced, but the honest placement was never the rule set. A rule here would require a fifth scope widening; the fourth was itself an operator override of a research refusal (`REPO RULES.md:98-109`), so that door is the operator's to open.

---

## P3. Design fundamentals before design work

**Verdict: refuse as a rule file.** For design-agent work it already binds three times over; for non-design agents the only admissible carrier is one clause in `AGENTS.md` §2's artifact-trigger sentence (the pattern at `:104`) — and only with a named failure, which does not exist, so record the refusal. Refusal is the better result and the cheaper one.

**Deciding test:** Test 2 — "load skill X first" is skill routing; Out at `REPO RULES.md:85`. Reinforced by Test 3 part 2: the hub, the four agent variants, and `sk-code`'s surfaces already carry it.

**Evidence:**
- Agents bind the load as a first duty: `.opencode/agents/design.md:180`, `.cursor/agents/design.md:166` (byte-identical to `.claude` and `.devin` copies) — "Load the routed skill before acting". Anti-pattern at `:225`/`:211` — "Route first, then load one". A blanket "load fundamentals first" collides with the route-first ordering the agents teach.
- The hub owns the default: `sk-design/SKILL.md:3` ("starting with `sk-design-fundamentals`"), `:141-143` (`routerPolicy.defaultMode` — "a design question with no clearer owner is a values question"), `:197-199`.
- The rule would cross a deliberate split: `sk-design/SKILL.md:32-33` — implementation is `sk-code`'s, "this hub decides what they should be and never writes the component"; `sk-code/SKILL.md:34-37` (frontend/design-system surfaces), `:45` (extraction pointer to `sk-design-md-generator`).
- `AGENTS.md`'s only design surface is `:455` (extraction row), so the non-design-agent case, if ever admitted, belongs to the §2 artifact-trigger clause — not the rule set.
- No runtime gap for a rule to close: cursor and devin design agents are content-identical mirrors of the claude variant; the opencode variant binds the same two statements.

**Cost:** refusal means "any agent doing UI work" continues to mean "any agent the hub or sk-code routes"; a rule would triple-bind the design agent's first duty while adding nothing to its behavior.

---

## P4. Shortening `delegation-and-orchestration.md`

**Verdict: cuts exist and are verified, but the file is compliant today; take them when headroom is wanted.** The band explicitly allows 201–250 if the rule can say why (`rule-anatomy.md:91-92`; `assets/repo-rule-template.md:28-29`), and `README.md:165` records that at-limit rules absorbed `AGENTS.md` content. Two corrections to iteration 2's proposals, one upgrade, one exclusion.

**Budget math (verified):**
- The checker fails only above 250 (`check-repo-rules.cjs:26`, `:263` — `>` not `≥`), counting physical lines (`:54-59`). At 249, **one line of headroom: a one-line addition reaches the allowed 250; any two-line addition fails.**
- Largest in the corpus, verified by read-tool totals: delegation 250 > evidence-and-proof 211 > communication 193 > handoff 166 > prevent/scope 165 > root-cause 160 > presenting 157 > blast 155 > uncertainty 145 > skill-hub 128.
- What the count counts: 28 lines of frontmatter (`:1-28`) and 56 blank lines (grep; last at `:237`) sit inside the budget. The file carries no "why it needs the room" sentence, which the band's condition asks for.

**Cuts, with costs:**
1. `:57-64` — 8 lines (lead sentence + four-row posture table). Every row survives: scope-written-down `:97-98`; what-the-delegate-reads `:115-117`; confidence≠accuracy `:129`, `:144-145`; the new verification step §5 `:149-166`. The failure statement stays at `:71-72`. Forced side edit: `:66`'s "Before any of that" needs re-pointing (same-line edit, no net loss). Cost: the at-a-glance before/after disappears.
2. `:50-51` — 2 lines (posture gloss). Restates the bold rule at `:46-48`; unique bit is only "you own the decomposition". Cost: small.
3. `:229-230` — 2 lines (§8's third bullet). Restates `REPO RULES.md:85-89`. The misreading guard that `creation-standards.md:120-122` attributes to this file is the neighboring bullets `:224-228`, `:231-232` and survives. Cost: loses the in-file boundary reminder.

Total 12 lines → ~237, restoring ~13 lines of headroom. **Next lever if more is needed:** the frontmatter phrase block `:5-24` (20 phrases; `creation-standards.md:76-77` aims for 15–20, so five trims free 5 lines). Their checked consumer is the collision check (`check-repo-rules.cjs:238-258`); Gate 1 deliberately excludes the corpus (`retrieval-conventions.md:283`). Cost: weaker rephrasings for a future searcher.

**Not proposed, and why:**
- `:206-218` (13 lines, mostly duplicated): I verified `sk-git` already owns the substance in more depth — `references/commit-workflows.md:228`, `:234-236`, `:244-246`, `:324-369` (index snapshot, deny-pattern assertion, the recurrence incident), plus the state-based advisory checks (`sk-git/SKILL.md:12-22`) and `conventional-commit-workflows.md:20`. But the block carries two named failures ("`git add -A` is the obvious trap"; "`git commit` commits the whole index") and the only statement of the live-delegate working-tree scenario, so the brief protects it. This **corrects iteration 2**: no cross-reference needs adding to `sk-git` — the substance is already there; if the named-failure bar is ever lifted, this is the largest single block, with `:206-210` and the closing "read it first and say so" (`:218`) as the irreplaceable residue.
- Blank-line stripping (56 lines) is mechanically the cheapest move and is not recommended: it games a physical-line metric whose bands are priced by reader burden (`rule-anatomy.md:91-92`; `creation-standards.md:142-143` "Length is not the target").

---

## P5. Wider analysis

Ranked by damage prevented:

1. **Wire the corpus checker to one automatic surface.** The checker exists and runs six checks (counts/parity `:197-204`, row+link coverage `:206-236`, phrase uniqueness `:238-258`, ceiling `:260-272`, frontmatter `:274-287`, divider parity `:289-300`), but its only consumer is step 7 of the authoring workflow (`sk-create-repo-rule/SKILL.md:170`), and its own header states the environment: "no hook or workflow touches the router." Verified: zero references under `.github`; the only `.opencode` reference is that SKILL step; the repo's git hooks are sk-git's commit-state advisories, not corpus checks. Any edit outside the create-rule path can now break count parity or the one-line ceiling silently. This is item 18 of the prior run half-delivered: the tool was built, the trigger is missing.
2. **Finish the widening-canon repair with a consistency pass.** Verified status against item 5 of the prior run: `decision-tests.md:72-76` and `agents-md-integration.md:55-58` are fixed (four/fifth); `routing-refusal.md:20` was half-edited and now reads "widened its scope statement exactly four times, **both times** deliberately" — self-contradictory; `scope-boundary-halt.md:20` still says "hit this twice" and "a unilateral third widening"; `repo-rules-router-template.md:105` still says "hit this twice". This is the guard text future proposals are refused with, and scenario runs check behavior, not history text, so they cannot catch their own staleness. The half-edit is now worse than uniform staleness: adjacent surfaces disagree.
3. **Add the missing scope nouns; do not renumber.** `creation-standards.md:74` has been repaired to "the 11 files under `repo-rules/`" (194 phrases), while `:3`, `:26-27`, `:156`, `README.md:89`, `:140`, `:165`, `rule-anatomy.md:3`, and `repo-rule-template.md:104`, `:109` still say "nine"/"eight" with no scope noun. The prior run established nine is defensible as the shared set and the defect is the unstated scope (`synthesis.md:525`, `:159`); its prescription is half-executed, and the doc is now internally split.
4. **Sync `decision-tests.md` §2's In/Out quote.** `:59-63` quotes the original In/Out; the router's In (`REPO RULES.md:77-83`) now also admits "what you may claim about wiring you have changed" and "how a turn hands control back to the operator". That doc's own self-check requires a refusal to quote the boundary, not paraphrase (`:151`). A future decision run quoting the stale block would refuse a class the router admits — the failure mode that actually happened once and required an operator override (`REPO RULES.md:98-109`). Cost: one line.
5. **The one roster string in the always-loaded layer.** `AGENTS.md:118`'s worked example embeds a concrete model + effort inside a document whose own doctrine is that written rosters go stale between commits (`:356`) and that rosters are enumerated at runtime (`:360`); the repo's precedent is a catalog going stale while the live picker moved (`implementation-summary.md:105`). Small, but it is exactly the drift the P2 constraint exists to prevent.

**Checked and closed this iteration (no action):** the Gate-5 read-only question — every rule file whose trigger can fire without a write already has its binding core in the always-loaded layer (the four unconditional standards `AGENTS.md:233-239`; hub routing `:114`, `:233`; the confidence bands §2; delivery's §8 clause), so nothing needs promoting; delegation's "answer a judgment question from your own reading" trigger is covered by the same standards plus "Truth over agreement" (§3). Rule-frontmatter `trigger_phrases` are deliberately excluded from the Gate 1 index (`retrieval-conventions.md:283`) and serve the collision check — by design, not a defect.

---

### Ranked list across all five

1. **P4** — take the three verified cuts (`:57-64`, `:50-51`, `:229-230`; 12 lines) when the file is next touched; the largest-most-active rule file has exactly one line of headroom.
2. **P5.1** — wire `check-repo-rules.cjs` into one automatic surface; silent corpus drift is the only failure mode with no backstop at all.
3. **P5.2** — finish the widening-canon repair (`routing-refusal.md:20` half-edited; `scope-boundary-halt.md:20`, `repo-rules-router-template.md:105` stale).
4. **P2** — record the refusal; route the ask to runtime config and the six `providers-and-models.md` catalogs; the capability-class + deferred-roster language already exists to copy.
5. **P1** — record the refusal; the new half stays unenforced until a failure is named, and the restraint half already binds.
6. **P3** — record the refusal; `AGENTS.md` §2's artifact-trigger clause is the only admissible carrier if a failure is ever named.
7. **P5.3** — scope nouns before numbers, per the standing prescription.
8. **P5.4** — one-line In/Out sync in `decision-tests.md`.
9. **P5.5** — reword the `AGENTS.md:118` example to a placeholder.
