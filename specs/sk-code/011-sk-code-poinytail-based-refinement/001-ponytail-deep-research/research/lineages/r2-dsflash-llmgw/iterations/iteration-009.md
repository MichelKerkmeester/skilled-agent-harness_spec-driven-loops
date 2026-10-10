# Iteration 009

## Focus
Original proposals Ponytail inspires but does not contain, for the round-two targets, plus the full rejection ledger for candidate transfers.

## Actions Taken
- Assembled the round-two finding set from iterations 1-8 and derived proposals that go beyond Ponytail's text.
- Tested each proposal against round one's original-ideas list so nothing already carried is presented as new.
- Checked each proposal against an existing home or mechanism in the repo so none invents a parallel system.
- Collected every rejected transfer from the earlier iterations into one ledger with its reason.

## Findings
1. **A `no-signal` tag for `ceiling:` markers whose trigger names no measurable quantity. NEW original idea.** Ponytail's debt ledger tags a marker with `no-trigger` when it names no upgrade path, because those rot silently [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-debt/SKILL.md:36]. The repo's convention requires a trigger, but a trigger can be unmeasurable in this repo (Ponytail's own example, "if throughput matters", names no observable). Extend the proposed debt report: flag markers whose upgrade path names a metric, environment, or event the repo does not already measure or watch, with a `no-signal` tag beside `no-trigger`. Difference from Ponytail: it checks whether a trigger exists; this checks whether the trigger can ever fire here. Target: the new debt report in sk-code-quality. Priority P2.
2. **Extend citation resolution to agent and rule docs. NEW original idea.** Round one's D3 was a stale claim inside a playbook; the repo's `validate.sh` already resolves `[SOURCE: path:line]` tags but only inside spec folders [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md:88]. `.skilled/agents/*` and `.skilled/repo-rules/*` cite file:line throughout and are never sweep-checked. Proposal: a bounded lint that resolves every path:line citation in those trees and warns on miss, with no spec-folder involvement. Difference from Ponytail: Ponytail's check-versions anchors a version pair; this anchors doc claims to source lines across the whole instruction surface. Target: a doctor-side lint. Priority P2.
3. **One authored agent source per dialect, generated copies elsewhere. NEW original idea.** Three byte-identical copies of the OpenCode-dialect agent body exist today (`.skilled/agents`, `.opencode/agents`, `.hermes/agents`) with no equality check (iteration 3). Ponytail's adapter rule keeps one source and thin adapters [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md:45]; the repo already generates `.cursor` symlinks and `.devin` copies from `.claude`. Proposal: declare `.skilled/agents` the authored OpenCode-dialect source and generate `.opencode/agents` and `.hermes/agents` from it in the existing sync pipeline, retiring the hand-copied pair. Difference from Ponytail: its runtimes pull the same skill files; this repo's copies exist because hosts expect their own tree, which generation already solves for four other hosts. Target: the runtime-mirrors sync. Priority P1.
4. **A review-output contract fixture for the reproducing-case field. NEW original idea.** Once the review finding format gains a trigger/case field (iteration 7 finding 3), nothing proves future reviews carry it. Proposal: a small fixture review (one or two findings) checked by a parser that fails when a finding row omits its case field; it grades the contract deterministically, the way the canary corpus grades routing. Difference from Ponytail: it states the rule in prose; the repo's house style is to prove contracts with deterministic fixtures. Target: sk-code-review tests. Priority P2.
5. **A vocabulary-parity check across the four routing surfaces. NEW original idea.** `hub-router.json` classes, `mode-registry.json` aliases, `description.json` keywords and the canary corpus are four surfaces carrying one routing vocabulary, and nothing verifies they agree — iteration 6 found a term present in none of them (a gap they share) but the same blind spot can hide a term added to one and forgotten in three. Proposal: a check modeled on the doctor's version parity — for each mode, every alias asserted by the canary corpus must resolve in the registries, and every registry alias must be classifiable — failing with the missing surface named. Difference from Ponytail: Ponytail's check-versions anchors agreement to an outside reference because its copies drifted together; this anchors vocabulary agreement to the canary corpus, which is the outside reference the repo already runs. Target: `parent-skill-check.cjs` or the compiled-routing gate. Priority P1.

## Rejection Ledger
| Rejected transfer | Reason | Source |
|---|---|---|
| Session-global `lite/full/ultra` intensity | Flattens the two routing axes; rejected twice by round one | round one research.md:168 |
| Persona sentence ("lazy senior developer") | Adds no enforceable behavior to contract-style definitions | iteration 1 |
| Renaming `ceiling:` to Ponytail's `shortcut:` | Churn; the token is deliberately brand-neutral, the harvest report is the transferable part | iteration 2 |
| Porting Ponytail's numbered ladder into repo rules | The rules deliberately use reversal cost and delegate rungs to the code skill | iteration 4 |
| Ponytail's one-small-test reflex | Weaker than the P1 coverage floor | round one research.md:148 |
| "Build nothing" as a default answer | Would narrow the ask; scope discipline blocks it | iteration 4 |
| At-most-20-findings cap for review | Trades completeness; disclosure half already served by `Not checked:` | iteration 7 |
| A second plain-English contract in the review mode | Repo-wide communication rules own prose; duplication drifts | iteration 7 |
| Per-host verified-version records | Deferred by round one; doctor and CI prove freshness structurally | iteration 3 |
| Separate Obsidian probe battery | Graph, canary and playbook now carry Obsidian | iteration 8 |
| A separate restraint-routing harness | The canary corpus is the harness; add a case, not a system | iteration 6 |
| Reviving Ponytail's session-state hook | No consumer; the repo's hooks are event-scoped | round one research.md:230 |

## Questions Answered
- Which original ideas does Ponytail inspire for the agent definitions, repository rules and root docs, and which candidate transfers should be rejected with a reason?

Five original proposals and twelve reasoned rejections. Round one's original-idea set is checked against these; none duplicates it.

## Questions Remaining
- Which round-two findings are NEW, ALREADY-COVERED or ALREADY-ADOPTED, and at what priority?

## Ruled Out
Recorded in the rejection ledger above; each row was raised and dismissed with its evidence in the iteration that examined it.

## Dead Ends
- Two candidate proposals died as duplicates of round one's set: behavior checks for sk-code's rules against a no-skill control (round one original idea 4) and no-unmeasured-savings claims (round one original idea 8).

## Edge Cases
- Ambiguous input: "original" is read as not present in Ponytail, not present in round one, and not already implemented in the targets.
- Contradictory evidence: none.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/skills/ponytail-debt/SKILL.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/docs/agent-portability.md
- specs/sk-code/011-sk-code-poinytail-based-refinement/context/scripts/check-versions.js
- specs/sk-code/011-sk-code-poinytail-based-refinement/001-ponytail-deep-research/research/research.md
- iterations/iteration-001.md through iteration-008.md (this lineage)

## Assessment
- New information ratio: 1.0 (5 findings, all original proposals; each checked against round one's set and current targets)
- Questions addressed: key question 8 (original ideas and rejections)
- Questions answered: key question 8

## Reflection
- What worked and why: deriving proposals from the round-two finding set kept them grounded — each names a real gap found this run rather than a speculative improvement.
- What did not work and why: two proposals had to be dropped as duplicates of round one's set; the check against that list is what caught them.
- What I would do differently: draft the rejection ledger alongside the findings in every iteration, not at the end; the reasons are already written at the point of rejection.

## Recommended Next Focus
Final verification: re-check every artifact and count, then prepare the synthesis inputs.
