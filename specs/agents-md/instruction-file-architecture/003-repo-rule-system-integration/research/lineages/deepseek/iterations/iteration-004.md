{"timestamp":"2026-09-11T18:54:49.342Z","runtime":"claude","status":"ok","freshness":"live","durationMs":1767,"cacheHit":false,"skillLabel":"sk-code"}
# Iteration 4 Findings (read-only)

**Method note.** All citations were opened and line-checked this run against the current tree. `AGENTS.md` is **502 lines** (read 1-502), not 501. `repo-rules/` holds **11 files and all 11 were read in full this iteration** (iterations 1-3 read five of them in full), plus `REPO RULES.md`, all four `sk-create-repo-rule/references/*` content files, the packet `SKILL.md`, the `/create:repo-rule` router and both workflow YAMLs, the `/create` command family's confidence blocks, `skill-advisor-hook.md`, `skills/README.txt`, the playbook fail-closed allowlist and `playbook-operator-contract.yml`, and the CI layer (18 workflow files enumerated, `rule-canary-sync`, `comment-hygiene`, `markdown-link-integrity`, `command-tree-parity`, `routing-registry-drift` and `playbook-operator-contract` read). Searches that ground the new findings: a grep of `.github/` for `repo-rules|REPO RULES|repo-rule` returns **zero matches**, a grep of `.github/` for `rule` returns only the rule-canary workflow and validator comments, a grep of `.opencode/scripts` returns no repo-rules or rule-canary reference, and a grep of `AGENTS.md` for `0.35` returns nothing. Items found by iterations 1-3 are not repeated. If a claim below leans on a file I did not read, it says so.

---

## Q1. Which new rules do the skills and other system surfaces actually justify?

**Result: zero new rules. Three new candidates were run through all four tests and all three failed.** The deciding facts:

**1.1 The surfaces that exist, and what each would need bound (survey, iteration-4 scope).**

| Surface | What it carries / would need | New rule earned? |
|---|---|---|
| The 11 rule files | Posture discipline, one load path via Gate 5. All 11 verified this run against their router rows (see 2.3) | No |
| `AGENTS.md` | The always-loaded framework. Two wording-level defects found (Q2, Q3), neither fixable by a rule | No |
| `REPO RULES.md` router | One falsified sentence in §4 (2.1) | No |
| `/create:repo-rule` chain (router, auto/confirm YAML, presentation) | Structurally current, assets resolve (3.4). Carries a second confidence scale (2.2) | No |
| The `/create:*` command family (~30 assets) | Needs one scale, not two (2.2) | No |
| Skill Advisor hook contract | Owns the real invocation bar, `0.8 / 0.35` (`skill-advisor-hook.md:37`, `:136`). The consumer surface understates it (3.3) | No |
| CI / checker layer | The correct owner for corpus-readable invariants. A rule cannot run a check (3.1) | No |
| Mirrors, deep-loop, spec-kit runtime | No new gap beyond iteration 3's 3.2 and 3.3; not re-opened | No |

**1.2 The Gate 5 constraint still decides most candidates.** `AGENTS.md:122` reads "Trigger: the FIRST write of the session... Read-only turns never fire it", and `decision-tests.md:32-33` states the consequence: "**A rule file loads on a trigger. Content that must bind when no trigger has fired cannot live in one.**" Two of the three new candidates (R11, R12 below) carry content that binds while routing or judging a request, which happens on read-only turns. They fail test 1 (`decision-tests.md:38-41`) before any other test is consulted.

**1.3 The new refusals.** R10 (rule-corpus checker coverage), R11 (single confidence scale), R12 (dual-threshold completeness), each mapped to a deciding test and a destination in REFUSALS. Count for the lineage: adoption's ten (`decision-tests.md:94-96`), iterations 1-3's R1-R9 (`iteration-003.md`, REFUSALS table), and this iteration's three, so 22 considered-and-declined candidates with the test recorded.

---

## Q2. Which existing rules need changing, and why?

### 2.1 The trigger-breadth claim is falsified on two surfaces, and it is load-bearing (new)

Three surfaces now disagree about how many rules fire at every turn boundary:

- `REPO RULES.md:80-83`: "Delivery joined the list when `AGENTS.md` §8 moved down; **it is the one rule here whose trigger is every substantive reply rather than a specific action**, and §8 keeps the two clauses that must bind even when nothing loads."
- `communication.md:37-39`: "Its trigger is deliberately **the broadest in the set**: a rule about how replies read has to load whenever a reply is being written..."
- `decision-tests.md:48-51` repeats the same framing: the communication rule "survives only because its trigger was widened to *every substantive reply*".
- Counter-evidence, same corpus: `handoff-and-questions.md:35` fires "About to end a turn, **of any kind, substantive or not**" and `REPO RULES.md:49`'s row for it says "End a turn" with no qualifier. `evidence-and-proof.md:38` fires when "You are closing out a turn" and its §10 (`:164`) says "Every substantive turn ends with an honest status."

"Broadest in the set" and "the one rule" cannot both be true while a sibling is written to fire on *every* turn, substantive or not. The observed failure is not cosmetic: these sentences are the system's own justification for why §8 keeps compressed clauses in `AGENTS.md` (`AGENTS.md:411`) and for how the read-only reach analysis works, and they under-count the rules whose binding content must survive with no load. Files affected: `REPO RULES.md` §4 (`:80-83`) and `communication.md` (`:37-39`), with `decision-tests.md:48-51` as the third copy of the framing. This is a correctness repair, not a new rule.

### 2.2 `AGENTS.md:85`'s "single scale" is contradicted by the command family's own scale (new)

`AGENTS.md:85` instructs: "judge confidence against the Confidence Thresholds below — **that table is the single scale; do not carry a second one.**" The `/create` command family carries one anyway, as boilerplate in its workflow assets. Verified by reading: `create-repo-rule-auto.yaml:33-43`, `create-repo-rule-confirm.yaml:46-70` and `create-with-human-voice-auto.yaml:33-43` all carry an identical `confidence_framework` block whose bands read "80-100% | Proceed with citable source", "40-79% | Proceed with caution, document assumptions", "0-39% | STOP - Ask clarification with A/B/C options". A grep of `.opencode/commands` shows the same block across roughly thirty assets.

Most of it is semantically compatible with `AGENTS.md:94-97`, but one item diverges operationally: `create-repo-rule-auto.yaml:73` makes the run's pre-change checklist read "Confidence >=80%? (if not: ask)", while `AGENTS.md:95` says the 40-79% band is "Proceed with caveats". A `/create:repo-rule :auto` run at 65% confidence gets contradictory instructions: proceed with caveats per the framework, ask per the workflow. Which side is wrong is an operator decision (the block may be intended as command-local state), but the letter-level violation of `AGENTS.md:85` is exact and the 80% divergence is real. Files affected: `AGENTS.md:85` (scope the sentence or accept the family) or the command assets (align the block). No rule is involved.

### 2.3 The 11 rule files: no change justified, with one new systematic check

All 11 files were read in full. The new check run this iteration: every rule file's `Fires when` list against its router trigger row. All 11 match, so the router does not misdescribe any rule's firing condition: `prevent-overengineering.md:37-40` ↔ `REPO RULES.md:40`, `scope-discipline.md:35-39` ↔ `:41`, `evidence-and-proof.md:34-38` ↔ `:42`, `delegation-and-orchestration.md:37-42` ↔ `:43`, `blast-radius.md:33-37` ↔ `:44`, `root-cause-and-debugging.md:34-37` ↔ `:45`, `uncertainty-and-honesty.md:33-37` ↔ `:46`, `communication.md:34-35` ↔ `:47`, `presenting-decisions.md:35-39` ↔ `:48`, `handoff-and-questions.md:35-39` ↔ `:49`, `skill-hub-routing.md:35-39` ↔ `:50`. Cross-checks that also hold: `communication.md:56` delegating the register distinction to `uncertainty-and-honesty.md` §6 (`:112`), `prevent-overengineering.md:102` deferring the Restraint Signals table without repeating it, `uncertainty-and-honesty.md:48-49` carrying no second copy of the Confidence Thresholds, `scope-discipline.md:106-108` not restating the hard blocker it points at. No observed failure in any rule file body. The two items above change the router or the framework prose, not rule content.

---

## Q3. Where is cross-skill or cross-system integration missing or broken?

### 3.1 NEW: the rule corpus sits outside every checker and CI gate

This iteration's largest structural finding. The rule set's integrity invariants (three-way count parity, link resolution, the claims iterations 1-3 found drifting) have no mechanical owner anywhere:

- A grep of `.github/` for `repo-rules`, `REPO RULES` and `repo-rule` returns **zero matches** across all 18 workflows. The only rule-related CI is `rule-canary-sync.yml`, and its canary (`check-rule-copies.js:33-70`) locks exactly two things: review-status vocabulary in five `sk-code-review` files, and the Iron Law concepts in `workflow-verify.md`, `CLAUDE.md` and `AGENTS.md`. It does not read `repo-rules/`, `REPO RULES.md` or rule counts.
- The link guard is scoped away from the corpus: `check-markdown-links.cjs:23-24` fixes `ROOTS` to `.opencode/skills`, `.opencode/commands`, `.opencode/agents` (plus mirrored trees), and `:85` collects only `p.endsWith('.md')`. So the 34 `AGENTS.md` links into `repo-rules/`, the 11 routed-from back-links, the 14 in-set cross-links, `REPO RULES.md`'s rows, and even the root `AGENTS.md` itself are outside the walk. A `.txt` file such as `skills/README.txt` is doubly invisible (outside-type), which is how its broken `sk-design-md-generator/README.md` link (`:61`, iteration 3's finding) survives a "markdown link integrity" gate.
- No local hook covers it either: the only relevant pre-commit block is `gate:comment-hygiene` (`git-hooks/pre-commit:44-79`, grep-verified), and a grep of `.opencode/scripts` finds no `repo-rules` reference.
- The parity check exists only as a recipe and a workflow step that run when a human or the command runs them: `create-repo-rule-auto.yaml:200-204` verifies "trigger rows, index rows and rule files are the same count" and "every link resolves" inside the command, and `repo-rule.md:60` describes that step. Nothing runs it otherwise.

Contrast, to show the harness can do this and already does where it matters: the playbook layer has a fail-closed fleet gate whose rationale is exactly "a root that is not scanned cannot fail, so absence is indistinguishable from success" (`playbook-failclosed-allowlist.txt:5-11`), and the packet's playbook is enrolled (`:46`, `.opencode/skills/sk-doc/sk-create-repo-rule/manual-testing-playbook`). The rule corpus has no equivalent enrollment. The observed failure is the drift class iterations 1-3 recorded: falsified counts in `rule-anatomy.md`, `creation-standards.md`, the packet README, the playbook, the changelog, `retrieval-conventions.md`, `.devin/SYNC.md` and `skills/README.txt`. Those are prose counts, but the corpus-level invariants around them are equally ungated. Owner: the checker layer (extend the guard's roots and file-type handling, or add a checksum-style parity check), not a rule.

### 3.2 NEW: `AGENTS.md:455` contradicts Gate 5's composition doctrine

The quick-reference row reads "Repo-local rules | Gate 5 → `REPO RULES.md` | match the action in the trigger table → **load the one** `repo-rules/*.md` it names". Gate 5 three screen-heights earlier says "LOAD **every** rule file it names, and follow them. **Two triggers fire → load both**; three or four firing at once is the normal case, not an edge case" (`AGENTS.md:125`), and the router repeats it: "**Every trigger that fires is loaded, not just the first.** They compose" (`REPO RULES.md:15-17`). A reader following the §10 row would load a single rule where three fire. Small blast radius, exact contradiction, one-row fix.

### 3.3 NEW: Gate 2 states half the threshold the maintained advisor gates on

`AGENTS.md:103` reads "Confidence ≥ 0.8 → MUST invoke skill | < 0.8 → general approach", and `:110` repeats the one-dimensional bar: "when the advisor confidence is ≥ 0.8, you MUST invoke the recommended skill". The maintained contract is a pair: `skill-advisor-hook.md:37` "Default confidence/uncertainty pair is `0.8 / 0.35` unless overridden", `:136` the same, and `skills/README.txt:80` states it as a gate: "**Two thresholds gate invocation**: confidence at or above 0.8 and uncertainty at or below 0.35". The pair recurs across the advisor documentation (grep shows the 0.35 uncertainty threshold in the validation reference, the CLI fallback implementation, the plugin bridge docs and the manual-testing playbook scenarios). `AGENTS.md` contains no occurrence of `0.35` (grep). The hook's own brief format carries both numbers, so the live path is covered. The gap is the always-loaded definition: a manual or degraded-path check that applies only the stated bar can invoke a skill the advisor's gate would have rejected. Whether `AGENTS.md` should state the pair or record why the confidence half suffices is an operator decision (an `AGENTS.md` §2 edit beyond a pointer escalates per `SKILL.md:209-210`). Evidence is sufficient to report the mismatch, insufficient to decide which side is authoritative.

### 3.4 Verified-clean additions this run (so the broken list is meaningful)

- The `/create:repo-rule` chain resolves end to end: `repo-rule.md:23-28` names four owned assets, all exist; `create-repo-rule-auto.yaml:23-31` names `SKILL.md`, the four references and two templates, all exist; both YAMLs consistently bind the four tests and the router rows (`auto:161-166`, `auto:200-204`).
- The packet's playbook is inside the operator-scenario fleet gate (`playbook-failclosed-allowlist.txt:46`; `playbook-operator-contract.yml:39-93` asserts discovery and runs the validator with `--strict`).
- Comment hygiene has two mechanical layers behind the `AGENTS.md:44-46` block: the pre-commit gate (`git-hooks/pre-commit:44-79`) and the PR gate (`comment-hygiene.yml:14-43`, which even names the standard at `:41`). The Iron Law line (`AGENTS.md:13`) satisfies its canary by inspection (lowercased line carries "completion claim" and "verification", the two concepts required by `check-rule-copies.js:70`).
- Carried from iteration 3 and not re-litigated: the drifted `AGENTS.md §N` citations in skills/agents/commands, the unverified Gate 5 reach on mirror surfaces, and the Python-scorer role contradiction.

---

## Q4. Which parts of AGENTS.md can be cut, compressed, or relocated?

**Result: no additional removal is supported by this iteration's evidence.** Iteration 3's compression of `:112-114` remains the only live cut, and it is not re-opened. What is new is the ledger for the blocks iteration 3 did not evaluate, each judged by the always-loaded test (`decision-tests.md:38-41`): must it bind on a turn where no trigger fires, and does any receiving surface load at that moment.

| Block | Verdict | Deciding load-timing fact |
|---|---|---|
| Preamble, Multi-Repository Architecture `:7-13` | Keep (compressible in principle, declined) | The Repo-Local Layer paragraph is the announcement that a repo-local layer exists before any gate is read. Its precedence sentences overlap `:127` and `REPO RULES.md:22-32`, but each copy has a distinct role (announcement, Gate 5 mechanics, ladder). No named failure justifies the edit. |
| Iron Law `:13` | Keep | CI-locked: `check-rule-copies.js:65-70` lists `AGENTS.md` in `IRON_LAW_FILES` and `rule-canary-sync.yml:24-29` fails the PR if the line drifts or disappears. Moving it would fail the canary by design. |
| PLAN-WORKFLOW LOCK `:30-42` | Keep | Binds at the moment of deviation from a plan, which can occur with no trigger. `AGENTS.md:193` routes the same failure mode. |
| Comment Hygiene `:44-46` | Keep | Binds at write time, and its rank matters: `REPO RULES.md:24` puts `AGENTS.md` §1 hard blockers at level 1 while rule files sit at level 3. Demoting it into a rule would downgrade the stated override rank. The two CI layers (`comment-hygiene.yml`, pre-commit) are post-hoc, not a substitute. |
| Halt Conditions `:48-55` | Keep | Mid-task triggers (missing file, merge conflict, unclear boundary) fire in read-only work too. |
| Gate 3 option list `:65-79` | Keep | `:68` makes the human-readable list the authority for runtimes that do not call `gate-3-classifier.ts`. The fallback case is exactly the case no other surface can supply. |
| Gate 4 tiebreakers `:116-119` | Keep | Trigger-phrase routing is evaluated on read turns; the deep-loop packets cannot self-trigger. |
| Skill Routing Reference intro `:110` | Keep | Defines what "invoking a skill" means. Skill loading happens in read-only research, so removal would let whole-bundle ingestion return with nothing to stop it. |
| MEMORY SAVE and GOAL POSTURE `:284-298` | Keep | Design-excluded from the rule set: spec-folder mechanics are Out (`REPO RULES.md:85-86`), and the goal rule's own trigger is "on every turn" (`:293`), which fails test 1 by construction. |
| `§9` Template & Validation paragraph `:440` | Keep | Pointer circularity: moving it into the contract it points at means you can only find it after loading the contract. Dispatched agents also need it before spec-kit loads. |
| Execution Behavior and Blast-Radius bullets `:159-197` | Keep | These are the read-turn carriers for rules that only load on write turns, the same near-miss logic recorded at `decision-tests.md:48-51`. |
| §4 completion and freshness items `:264-274` | Keep | Gate content; claims are made at turn boundaries, and the freshness flags have no other always-loaded home. |

One Q4-relevant repair is a wording item rather than a cut: `:455`'s "the one" contradicts the compose doctrine (3.2). One insufficiency carried forward: whether every mirror runtime loads the root `AGENTS.md` natively remains unverified for Codex and Cursor (iteration 3's 3.2). Any future relocation out of `AGENTS.md` still has to state which runtimes' reach it assumes.

---

## RANKED RECOMMENDATIONS

One ordered list across Q1-Q4. Items 1-5 are corrections inside existing owners, not new rules. Items 2-5 collectively repair the "loader-bearing statements that disagree with the surfaces they describe" class this iteration found.

1. **Extend mechanical coverage to the rule corpus.** Evidence: `.github` grep returns zero `repo-rules` matches, `check-markdown-links.cjs:23-24` and `:85` exclude the corpus and non-`.md` files, `.opencode/scripts` hooks carry no such gate, while the playbook fleet already demonstrates the fail-closed pattern (`playbook-failclosed-allowlist.txt:5-11`, `:46`). Files affected: the link guard's roots and/or a new CI check, plus optionally the packet's parity recipe. Decision tests: refused as a rule (R10); owner is the checker layer, which is where recommendation 1 lands.
2. **Correct the trigger-breadth statements.** Evidence: `REPO RULES.md:80-83` and `communication.md:37-39` against `handoff-and-questions.md:35`, `evidence-and-proof.md:38` and `:164`, with `decision-tests.md:48-51` carrying the same stale framing. Files affected: `REPO RULES.md` §4, `communication.md`, optionally `decision-tests.md`. Decision tests: correctness repair, not a rule; the read-turn reach argument depends on the corrected count.
3. **Reconcile Gate 2's stated bar with the advisor's pair.** Evidence: `AGENTS.md:103`, `:110` against `skill-advisor-hook.md:37`, `:136` and `skills/README.txt:80`, with `AGENTS.md` containing no `0.35`. Files affected: `AGENTS.md` §2 (operator escalation required for anything beyond a pointer). Decision tests: refused as a rule (R12, test 1).
4. **Resolve the duplicated confidence scale.** Evidence: `AGENTS.md:85`'s "do not carry a second one" against the `confidence_framework` block in `create-repo-rule-auto.yaml:33-43`, `create-repo-rule-confirm.yaml:46-70`, `create-with-human-voice-auto.yaml:33-43`, and the sharpest divergence, `auto.yaml:73` against `AGENTS.md:95`. Files affected: `AGENTS.md:85` (scope the sentence) or the command family (align the block). Decision tests: refused as a rule (R11, test 1).
5. **Fix the quick-reference row's "the one".** Evidence: `AGENTS.md:455` against `AGENTS.md:125` and `REPO RULES.md:15-17`. Files affected: `AGENTS.md:455` only.
6. **Record refusals R10-R12** per the standing convention (`decision-tests.md:136-138`, `agents-md-integration.md:107-108`) so the same three candidates are not re-proposed.

---

## REFUSALS

Every proposal considered and declined this iteration, with the deciding test and where the content belongs instead (`decision-tests.md:128-134`).

| # | Proposal | Test failed | Where the content belongs |
|---|---|---|---|
| R10 | Rule-corpus checker coverage (a rule requiring invariant checks for the rule set) | Test 3 part 1, a single row rather than a trigger-shaped cluster, plus restraint: a rule cannot run a check, and no per-turn failure exists to bind | The checker layer: the link guard's root set, or a CI parity check modeled on `playbook-operator-contract.yml` |
| R11 | Single confidence scale, as a rule binding the command assets | Test 1: confidence judgment binds on read-only request handling, so the content cannot move behind a trigger | `AGENTS.md` §2's single-scale sentence (`:85`) as the owner, with the command family aligned |
| R12 | Dual-threshold completeness, as a rule | Test 1: Gate 2 fires on every non-trivial request including read-only turns | `AGENTS.md` §2's Gate 2 definition (`:103`, `:110`), via operator escalation for the `AGENTS.md` edit |
| P4 | Compress the preamble's Repo-Local Layer paragraph (`:7-13`) | Restraint-equivalent: no named failure today, and each precedence copy has a distinct role | Keep in `AGENTS.md`. The mechanics it restates are lower, but nothing fails without the edit |

Carried refusals, not re-run: the ten adoption refusals (`decision-tests.md:94-96`), iterations 1-3's R1-R9, and the recorded test-1 refusals of any read-only-binding content. The two look-alike blocks (`prevent-overengineering.md:100-102`, `uncertainty-and-honesty.md:48-49`) were re-verified as sole copies and not proposed for removal.
