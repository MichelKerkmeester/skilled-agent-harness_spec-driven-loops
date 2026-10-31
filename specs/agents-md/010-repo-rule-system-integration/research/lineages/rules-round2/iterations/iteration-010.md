{"timestamp":"2026-09-12T09:39:28.177Z","runtime":"claude","status":"fail_open","freshness":"unavailable","durationMs":63,"cacheHit":false,"errorCode":"NONZERO_EXIT","errorDetails":"CLI_EXIT_64"}
# Iteration 10 — Findings

Read-only throughout; nothing edited. Fresh firsthand reads this pass: `AGENTS.md` (three ranges), `REPO RULES.md`, all of `delegation-and-orchestration.md` and `prevent-overengineering.md`, the four `sk-create-repo-rule` references' key files, `check-repo-rules.cjs` in full, `generate-trigger-index.mjs` + `lib/corpus.mjs`, `retrieval-conventions.md` coverage row, two context agents + `context.toml`, two design agents, `sk-code`/`sk-design` SKILL.md, `.github/workflows` and `.opencode/hooks` inventory.

---

## P1. Test restraint

**Verdict: already covered + refuse.** Not a file, not a section. The suppression half lives in two always-broad places; the "do more with less" half is the shipped reversal-cost ladder; the genuinely new count-reduction duty fails test 4.

**Deciding test: test 4 (restraint).** "What fails today without this rule?" — nothing concrete. The suppression content's deciding test is test 3 part 2 (existing home): `prevent-overengineering.md:40` fires on the exact trigger ("Adding a test beyond the coverage floor"), `:130-131` routes the floor/bar to `AGENTS.md` §3 and applies the ladder "to test code exactly as to the code under test", and `AGENTS.md:207` carries the floor ("this rule never waives it"), the earn-bar, and the three prohibitions — unconditionally loaded. The section fallback fails creation-standards' section test: say aloud what breaks without it (`creation-standards.md:50-51`) — nothing does; and the topic-trigger trap names this subject verbatim (`:140-141`). The class is pre-refused: "testing" is among the ten (`decision-tests.md:95-97`).

**New this pass:** the ladder already orders the "do more with less" moves — "Extend an existing function or module in place" (`prevent-overengineering.md:62`) precedes "Add a new function" (`:63`), and `:84-85` requires a real symbol + caller for any costlier move ("fewer tests" rarely has one). Count reduction cannot be an unqualified duty: the floor's non-waiver (`AGENTS.md:207`) plus deletion routing (`REPO RULES.md:44` → `blast-radius.md`) already bracket it.

**Cost:** zero. What the operator gives up is a dedicated home for a wish with no recorded failure; the re-test condition is a captured incident.

---

## P2. Context-gathering delegation on cheaper models

**Verdict: refuse — file and AGENTS.md row.** The hard requirement is satisfiable, but it cannot rescue this: the refused thing is *selection*, not naming.

**Deciding test: test 2 (scope boundary).** Out, verbatim: "the *mechanics* of agent and CLI dispatch — which agent, which command, **which model**, which flags" (`decision-tests.md:62-63`), restated "A rule about which skill, command, model or flags to pick is still refused here" (`:79-80`). The router has already walled the escalation: "Choosing between runtimes, agents, commands, models or flags stays Out" (`REPO RULES.md:103-104`), and "A fifth widening that let a rule pick between runtimes would be the dissolution this one avoids" (`:108-109`). Per the §5 routing table, a test-2 refusal's content belongs in "`AGENTS.md` §2, or the skill its router resolves" (`decision-tests.md:132`) — and the admissible posture ("is delegating cheaper than doing it", `delegation-and-orchestration.md:66-69`) is already there.

**Session constraint makes a rule file structurally unable to hold it anyway.** Context gathering is read-only work; Gate 5 "never fires" on read-only turns (`AGENTS.md:122`). The moment the executor tier is chosen is exactly such a turn — a rule file would be silent at its own decision point.

**What the context agents already bind (two read firsthand, plus config):** `.opencode/agents/context.md` — read-only permission block (`:6-18`), exclusive exploration entry point, never nested delegation, never writes (`:23`), continuity-first order (`:25`), advisor hints subordinate (`:29`), LEAF-only HARD BLOCK with refused-boundary reporting (`:37-43`); `.pi/agents/context.md` — tool allowlist (`:4-8`), same doctrine (`:14`, `:16`, `:20`, `:22`). Neither carries any model/cost vocabulary. The fleet's only tier binding is the conversion config: `.codex/agents/context.toml:2` records provenance from the canonical agent file, then `:5-7` pins `sandbox_mode = "read-only"`, a concrete model id, and a reasoning-effort level. That is where an executor binding legitimately lives — and where it can be retuned without any rule.

**The language the brief asks for already exists, verified in place:** capability-class with the roster deferred — "that runtime's cheapest capable dispatch model" (`specs/hooks/002-injection-bloat-reduction/010-playbook-cheapest-model/spec.md:3`, `:65`); roster-deferral idiom — "Read the config for the current roster; a list written here goes stale between commits" (`AGENTS.md:356`) and "Enumerate at runtime, never from a written list" (`:360`); and the rule's own class-noun idiom — classes, never products (`delegation-and-orchestration.md:39`). The approach to copy is: name the work class, defer the roster to the runtime's config/catalog. A rule would still land on the Out clause.

**Cost:** zero; the operator's lever remains per-runtime config and the mode references (`cli-*` provider catalogs) — the refused thing is exactly what those surfaces own.

---

## P3. Design fundamentals before design work

**Verdict: refuse.** Nothing new to bind, and the `AGENTS.md`-row fallback over-triggers.

**Deciding tests: test 2 (routing — which skill loads when is the skills' to own) and test 1 (a design review is a read-only turn, so a rule file is silent there while the advisor + agent ALWAYS are not).**

**The load-first duty is already an agent-contract ALWAYS, verified on two surfaces this pass:** `.opencode/agents/design.md:179-180` — "Decide measure-versus-decide before loading a skill" then "Load the routed skill before acting"; anti-pattern `:225` names the preload failure ("Route first, then load one", because "the loaded skill biases the answer toward its own job"). `.pi/agents/design.md:173-174`, `:219` — same. A "fundamentals first" rule imposes the order the anti-pattern table exists to refuse.

**Hub side verified:** `sk-design/SKILL.md:3` ("starting with `sk-design-fundamentals`"), `:141` (`defaultMode` is fundamentals — "a design question with no clearer owner is a values question"), `:33` (the hub "decides what they should be and never writes the component").

**New this pass — the write path already has a design-evidence lane, on the other side of a deliberate split.** `AGENTS.md:104` (artifact trigger) routes the first code write through `sk-code`; `sk-code/SKILL.md:30-37` bundles read-only surface evidence — `sk-code-webflow` carries "Frontend evidence: CSS/HTML/JS standards… browser debug/verify", the mobile-cli and obsidian surfaces carry design-system evidence — and `:69` shows surfaces bundle alongside the mode by intent. A "load fundamentals before UI work" rule would sit on the wrong side of `sk-design`'s own boundary (`:33`) and duplicate a lane `sk-code` already routes. The only design pointer on the code side is extraction-first (`sk-code/SKILL.md:45` → `sk-design-md-generator`), which `AGENTS.md:455` already carries.

**Cost:** zero. What a rule would buy is a third, narrower mechanism (write-gated) competing with two wider ones (agent ALWAYS; Gate 2/artifact trigger).

---

## P4. Shortening `delegation-and-orchestration.md`

**Verdict: edit — the cut set below; 16 lines safe, up to 22 more with named costs.** Budget re-verified firsthand: 249 counted lines (display 250, trailing empty popped, `check-repo-rules.cjs:54-59`), ceiling fails only above 250 (`:26`, `:263`) — two-line additions are the real hazard.

**New this pass — full self-check traceability (`creation-standards.md:106-107` requires each item trace to its generating sentence).** Eleven items map to body sentences: `:238`↔`:86-88`; `:239`↔`:97-100`+`:115-117`; `:240`↔`:119-120`; `:241`↔`:89-91`; `:242`↔`:138-142`; `:243-244`↔`:155-156`; `:245`↔`:157`; `:246`↔`:186-188`; `:247`↔`:66-69`; `:248`↔`:168-172`; `:249`↔`:174-176`. **No proposed cut removes a generating sentence except `:86-88`, which is a condense that must keep the sentence `:238` traces to.** No cut touches a `---` divider or a `## N.` heading, so the checker's divider parity (`:289-300`) and the "9 sections / 11 items" measurement (`creation-standards.md:102-104`) survive. No cut is a self-check item or a named failure; protected: `:32-33`, `:46-48`, `:66-69`, `:71-72`, `:74-78`, `:89-91`, `:93-96`, `:122-123`, `:165-166`, `:168-176`, `:190-191`, `:206-218`, `:236-249`.

**Cut list with costs:**

| Range | Lines | Cost |
|---|---|---|
| `:37-38` | −1 (reflow) | Drops the "used to fire only after it" history clause; the decide-whether trigger survives as the bullet's first clause and the `·` router row (`REPO RULES.md:43`) |
| `:50-51` | −2 | The posture gloss; "you own the decomposition" survives in substance at `:97-98`/`:115-117` |
| `:57-64` | −8 | Setup sentence + 4-row posture table. Row-1/2 obligations live at `:97-98`/`:115-117`, row 4 at §5, row 3's residue is `:151-153` + protected `:165-166` + `AGENTS.md:245` (contents known-miscited — `:129` is "hypothesis", `:144-145` is "same opinion twice"); take deliberately (the 043 audit repaired row 4) |
| `:86-88` | condense 3→1, −2 | Loses the inline `cli-X/SKILL.md` path ("This file does not repeat them"); the pointer is always-loaded (`AGENTS.md:488`, `:492`) |
| `:129` | −1 | §4's opening frame; restated at `:151-153` and `AGENTS.md:245` |
| `:229-230` | −2 | The in-file boundary reminder; `REPO RULES.md:85-89` owns it; §8's misreading guard survives in bullets 1, 2, 4 (`creation-standards.md:120-122` cites §8 for that guard) |

**Total −16 → 233.** Optional, each with a named cost: `:151-153` compress −1 (none); `:224-226` compress −1 (cosmetic); `:144-145` −2 (removes the only explicit refusal of same-model double-runs); `:185-186` −2 (§6 loses its one-sentence reason). Remaining `:206-218` stays — named failures at `:213-214`/`:215-217` and the only live-delegate working-tree scenario. Blank-stripping and frontmatter trims rejected: they game a reader-priced band (`creation-standards.md:142-143`), and the phrase block is already corpus-maximal (`:5-24`).

---

## P5. Wider analysis — what else the system needs

Ranked by damage prevented. **Confirmation first:** the iteration-004 `REPO RULES.md:43` separator defect is repaired in the current file (read now: `·` present before "Decide"); all in-rule links in the corpus resolve today (every sibling target present; the two non-sibling targets exist: `hvr-rules.md`, `parent-skills-nested-packets.md`).

1. **Wire the corpus checker into an automated surface — verified still unwired, and the near-miss lane excludes the corpus.** `check-repo-rules.cjs` is the "one report" that keeps files, router rows, phrases and structure in agreement (`:5-9`; six checks, `:302-309`), but: no `.opencode/hooks` file references it (grep: no matches), no `.github/workflows` file references it (grep: no matches), and `markdown-link-integrity.yml` both triggers only on `paths:` under skills/commands/agents (`:6-13`) and runs a guard that walks "the skills/commands/agents docs" (`:34-35`) — repo-rules is outside both its trigger scope and its walk. The only invocation surface found is the create-path verify step (`sk-create-repo-rule/SKILL.md:170`, manual). Damage prevented: silent drift of the one corpus whose failure mode is "a rule that silently never loads." (Advances the lineage's recorded P5.1 with the workflow-scoping evidence.)

2. **Refresh the meta-docs' corpus inventories — measured drift, and it changes a reviewer's precedent.** The corpus is 11 files; `creation-standards.md:26`/`:156` say "nine shipped rules", `:115`/`:124`/`:142-143` say "eight"; `retrieval-conventions.md:283` says "The nine rule documents" (a new instance this pass). Worse than counts: the §5 misreading-guard table (`:115-122`) names 3 carriers, but 5 files now carry a `WHAT THIS RULE IS NOT` section (`prevent-overengineering.md:147`, `communication.md:171`, `delegation-and-orchestration.md:222`, `presenting-decisions.md:136`, `handoff-and-questions.md:144`), so "The five rules without one" (`:124`) is now six; and §1's "Two rules state it outright" with a `The failure this prevents:` line (`:36-37`) is contradicted — 7 of 11 files carry it (presenting `:60`/`:112`, handoff `:63`/`:91`/`:115`, blast `:78`, scope `:151`, communication ×6, skill-hub `:62`/`:77`/`:93`, delegation ×4). No checker reads these docs (`check-repo-rules.cjs:166-195` reads only the router and `repo-rules/`), so nothing will catch it. Damage prevented: the admittance standard misdescribes its own precedent for test 5.

3. **Close the checker's two coverage gaps** — (a) it never compares a router row's action text against the rule's `Fires when` list, and (b) it resolves only router-row links (`:207-236`), never links inside rule bodies; no other lane walks `repo-rules/` (item 1). All body links resolve today, so the gap is latent, not live. Damage prevented: a renamed/deleted target inside a rule sends an agent to a dead path with a green checker. (Same family as the recorded 002 gap; fresh scoping evidence added.)

4. **Defend, do not amend: repo-rules exclusion from Gate 1 retrieval, and the absence of a twelfth rule.** `retrieval-conventions.md:283` records the decision — rules are loaded at Gate 5, not surfaced as context candidates, and the phrases' checked consumer is only the collision check. That decision is coherent with the brief's own constraint: rule files are obligations, not context. And every class the three proposals wanted either already has an owner (P1, P3), is Out by boundary (P2), or is answered by the two mechanisms that *do* bind across read-only turns — the four unconditional verification standards (`AGENTS.md:239-246`, "These four bind unconditionally, including on a read-only turn where Gate 5 never fires") and §8's load instruction for the every-reply rule (`:404-410`). No twelfth rule is warranted; the needs found are maintenance of the existing corpus.

---

## Ranked list across all five

1. **P4 — act.** Concrete, verified edit set: 249 → 233 (safe 16) restores ~17 lines of headroom; traceability and invariant checks pass. Highest damage prevented per unit of effort.
2. **P5 — act (item 1 first, then 2, then 3).** Wiring the checker and refreshing the meta-doc inventories are the only live defects found; neither needs a decision test because neither is a rule.
3. **P2 — refuse, standing.** Protects the scope boundary's fifth-widening guard (`REPO RULES.md:108-109`); the wish's lever is per-runtime config, where the binding already lives.
4. **P3 — refuse, standing.** Protects the design/code hub split and the route-first ordering; content already binds as an agent ALWAYS plus the hub default.
5. **P1 — refuse, standing.** Protects the corpus's own restraint test; suppression is already loaded unconditionally and the ladder already orders the "do more with less" moves.

Nothing is blocked on further research; P4 and P5 items 1–2 are the operator's to schedule, and all three refusals are recorded with their tests.
