---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Check whether anything shipped in the Skilled v4.0.1.0 release means AGENTS.md (repo root, which CLAUDE.md mirrors), REPO RULES.md or the rule files under .skilled/repo-rules/ need updating or refining. Source of what changed: .skilled/changelog/skilled/v4.0.1.0.md, the per-skill changelog entries it names, and git log v4.0.0.0..v4.0.1.0 (or the commit range those tags cover). For each change, ask: does a gate, law, rule, trigger-table row, path, command name, skill or mode name, script path or workflow in AGENTS.md or a repo rule now point at something renamed, removed, added or behaving differently; is there a new mandatory behavior the rules should state; is any rule now redundant with something a tool now enforces. Check every path and command the rules cite still exists. Report gaps as findings ranked by impact, each with the exact file:line in AGENTS.md or the rule file, the v4.0.1.0 change that causes it (file:line or commit), and the proposed one-line edit. Say plainly when nothing needs to change. Read-only: write only under the spec folder. Cite file:line for every finding.
- Started: 2026-11-05T20:09:09.937Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-11-05T20:09:09Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Iteration 1: inventory what v4.0.1.0 renamed, removed, retired or added, from the release note, the per-skill changelogs it names and the git range; then start checking AGENTS.md citations against it. | rules-inventory | 0.75 | 4 | complete |
| 2 | Audit every skill file, script path, command name, relative link and section anchor cited by REPO RULES.md and the 13 files under .skilled/repo-rules/ against the v4.0.1.0 tree, and close the redundancy question (Q5) for the remaining candidates. | rule-citation-integrity | 0.77 | 3 | complete |
| 3 | Close Q4: deliver one decision per remaining v4.0.1.0 addition (conversation playbook scenarios, /doctor:sk-skill, /doctor:symlink and /doctor:install, /doctor:agents-md's section manifest and repository block, the sk-code web frontend surface, the worker-session nudge removal, package_skill.py --strict ROUTER.md enforcement) and re-check the AGENTS.md:70 wording against system-skill-advisor and Gate 5's loading rule. | - | 0.72 | 5 | complete |
| 4 | Adversarial re-check of the open findings before synthesis | - | 0.70 | 5 | complete |
| 5 | Final behavior sweep: do the commands the rules cite behave as the rules say, per git log v4.0.0.16..v4.0.1.0 over the seven named gate scripts, the four named rule files' quoted targets, and the two sibling packets' deferrals | rule-behavior-delta | 0.80 | 5 | complete |

- iterationsCompleted: 5
- keyFindings: 52
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] What did v4.0.1.0 rename, remove, retire or add (skills, modes, commands, scripts, paths), per .skilled/changelog/skilled/v4.0.1.0.md, the per-skill changelogs it names and the git range?
- [x] Which paths, commands, skills, modes and scripts cited in AGENTS.md no longer exist or now point at something renamed or behaving differently?
- [x] Which paths, commands and rule files cited in REPO RULES.md and the 13 rule files under .skilled/repo-rules/ no longer exist or are stale after v4.0.1.0?
- [x] Does v4.0.1.0 add a mandatory behavior (for example ROUTER.md per skill, doctor commands, decision capture of operator answers, render checks, doc rewrite guard) that AGENTS.md or a repo rule should state?
- [x] Is any rule in AGENTS.md or the repo rules now redundant with something a v4.0.1.0 tool or hook enforces?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ▅▅▅▅▆▆▅▄▄▃▂▂▂▁▁▂▄▅▇█
- score sparkline: ▅▅▅▅▆▆▅▄▄▃▂▂▂▁▁▂▄▅▇█
- Last 3 ratios: 0.72 -> 0.70 -> 0.80
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.80
- coverageBySources: {"code":86,"other":52}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **"`system-spec-kit` SKILL.md §3" may have lost its content to the router move.** It did not; §3 keeps "Retrieval and Continuity", "Reranking" and the declared-loss sentence. (iteration 1)
- **`advisor_recommend` looked removed.** `.skilled/agents/code.md` and `.skilled/skills/README.txt` both show the verb `l`, which reads as a rename. The frozen contract settles it the other way: nine commands, each accepting snake, kebab and camel spellings, `advisor_recommend` first in the table [SOURCE: .skilled/skills/system-skill-advisor/references/runtime/cli-front-door-contract.md:47], and the built CLI contains seven occurrences. `AGENTS.md:67` is correct and `l` is a separate short id. (iteration 1)
- **`sk-create-goal`'s `references/budget-and-handoff.md` may have moved under `sk-doc`.** It sits at `.skilled/skills/sk-doc/sk-create-goal/references/budget-and-handoff.md`; `AGENTS.md:155` cites it by skill name, not by path, so the extra folder does not stale the citation. (iteration 1)
- **A doc-rewrite-guard rule is missing from `AGENTS.md`.** Rejected: `sk-doc`'s router owns the intent and Gate 2 already routes there. (iteration 1)
- **Sweeping the rule files for v4.0.1.0 impact as a first move.** Only two of thirteen files changed in the range — `communication-handoff.md` (4 lines) and `skill-hub-routing.md` (8 lines) — and both changes were themselves router-related. The rules layer is ahead of `AGENTS.md`; a rule sweep on this axis yields nothing until the rules' own internal citations are the target. (iteration 1)
- **Treating `.skilled/changelog/skilled/v4.0.1.0.md:27`'s spec-folder list as the change inventory.** It names nine packets and "smaller packets for the fixes"; the git range covers 458 commits and 33,921 paths, so the list is a pointer, not an inventory. The named-packet approach cannot substitute for the tree probe. (iteration 1)
- **`## MACHINE ROUTER` in `skill-hub-routing.md:61` is stale because real headings are numbered (`## 3. MACHINE ROUTER`).** Not stale. `package_skill.py` extracts heading titles and compares `title == 'MACHINE ROUTER'`, so the number prefix is stripped before comparison [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1174], and its diagnostics print the unnumbered form the rule uses [SOURCE: .skilled/skills/sk-doc/sk-create-skill/scripts/package_skill.py:1420]. The rule quotes the heading title, which is the stable identifier. (iteration 2)
- **`parent-skills-nested-packets.md` §1-2 did not actually carry the `routingClass` table or the `ROUTER.md` locations.** It does: table at line 132, stage-two file table at 42-55, canonical sentence at 79. (iteration 2)
- **`skill-hub-routing.md` became redundant when the routing shape became gated.** It did not, for the reason in f-iter002-003: shape is not reachability, and the rule's whole point is that distinction. (iteration 2)
- **Probing relative links with `realpath` on macOS.** It does not exist there, so the probe silently reports every link as broken. Use `os.path.exists(os.path.normpath(os.path.join(dirname, target)))` from Python instead. Recorded so a later iteration does not spend a call rediscovering it. (iteration 2)
- **The rule's §7-covers-the-surface-list citation was off by one section.** It is not; §7 is "ADDING A MODE TO AN EXISTING HUB" and holds the 11-row table [SOURCE: .skilled/skills/sk-doc/sk-create-skill/references/parent-skill/parent-skills-nested-packets.md:245]. (iteration 2)
- **`/doctor:install` and `/doctor:symlink` need a rule because they mutate a project.** No: the commands own their own plan-then-yes discipline, `blast-radius.md` governs any install, and `AGENTS.md:289` already delegates the inventory. (iteration 3)
- **`AGENTS.md:70`'s proposal is simply wrong.** No: it is substantively right and self-consistent with Gate 5 and the advisor. Only the `one line` parenthetical and the byte budget need correcting. (iteration 3)
- **A rule is needed about which lines an update may overwrite.** No: A7/A8 plus the note line own it; the gap is capacity, not ownership. (iteration 3)
- **A rule is needed for conversation playbook scenarios.** No: `sk-doc`'s `playbook-conversation` intent already routes the request, and the runner is documented by the skill that ships it [SOURCE: .skilled/skills/sk-doc/ROUTER.md:103]. (iteration 3)
- **The `§4`-before-`§3` order was introduced by the manifest.** No: identical order at `v4.0.0.16`. (iteration 3)
- **The worker-session nudge removal leaves a dangling rule.** No: zero references to a nudge in the rule layer; only an unrelated English use of the word. (iteration 3)
- **Treating "the manifest requires a rule about which lines an update may overwrite" as a single question.** It splits into ownership (settled by A7/A8) and capacity (unstated, and load-bearing). Asking it as one question would have produced either a duplicated rule or a missed budget. (iteration 3)
- **`skill-hub-routing.md:78` should name `RS-002` / `RS-004` / `RS-005`.** Rejected: mechanics in the rule, against `REPO RULES.md:98-101`. (iteration 4)
- **A `delivery prefix` line in the repository block silences A6.** False. `own` is canary stdout screened for `MISSING:` / `BLOCKED:` `[SOURCE: .skilled/commands/doctor/scripts/agents-md-check.cjs:461-463]`; document prose cannot enter it. (iteration 4)
- **A trigger-table row should route to `/doctor:agents-md` or `/doctor:install`.** Rejected: `REPO RULES.md:5-6` and `:18` make the table a rule-file router; the commands already fire rows 42, 44 and 45. (iteration 4)
- **Measuring only the variants already on the table.** Iteration 3 tested the two wordings it had and concluded about "any version". A budget question has to be answered by measuring the cheapest candidate, not the two most discussed. (iteration 4)
- **No `ROUTER.md`-naming wording fits the budget.** False at the short end: the 89-byte form lands at 16,371, 13 bytes inside. (iteration 4)
- **The canary is silent past the prefix, so A6's fallback is the only signal.** False. The canary emits its own failure containing `delivery prefix` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:428]`, printed as `MISSING:` `[SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:440]`. (iteration 4)
- **Treating iteration 3's A6 read as sufficient because it quoted the right file and line.** The citation was correct and the inference from it was inverted — the code was read as parsing the document when it parses a subprocess's stdout. For any row that shells out, the variable's provenance (`output` at `:450`) has to be established before its predicate is interpreted. Recorded because this is the second time in this packet that a correct citation carried a wrong inference. (iteration 4)
- **"A backticked token missing as a repo path is a vanished citation."** `@juicesharp/rpiv-ask-user-question` (iteration 5)
- **"The `.codex/config.toml` change staled the `communication-handoff.md` Codex row."** `fa2f8321f8` (iteration 5)
- **"The range touched a third rule-layer surface that iterations 1-4 missed."** The touch set is (iteration 5)
- **"The seven named gate scripts changed behavior in this release."** All seven return zero commits (iteration 5)
- **"The sibling packets' deferrals hand work to `AGENTS.md` or the repo rules."** Both name only (iteration 5)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
