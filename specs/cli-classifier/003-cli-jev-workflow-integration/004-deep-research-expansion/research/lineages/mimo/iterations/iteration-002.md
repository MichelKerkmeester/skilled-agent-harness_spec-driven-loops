# Iteration 2 — mimo-02: The criteria-lint base rate, an independent sample (question 22)

**Lineage:** `mimo` (UX and measurement lens)
**Session:** `fanout-mimo-1790457982528-yjdrdz`
**Focus Area:** `mimo-02` — The criteria-lint base rate, an independent sample (question 22)
**Angle question:** On a stratified sample of criterion lines scored by rules 4 and 5, what share fails, with what interval, and is R20's 5% stop rule the right threshold?

## Grounding opened this iteration

- `.skilled/skills/sk-doc/sk-create-goal/SKILL.md:110-126` — rules 4 and 5 sit at `:121-122` ("Use three to seven self-contained criteria", "Make each criterion checkable without opening another file"), and rule 8 at `:110` wires `check-goal.cjs` into handoff.
- `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:1-80,150-230,312-333` — the four structural checks (`CHECKS` at `:44-49`: `missing-binding-row`, `placeholder`, `criteria-count`, `parent-budget`), `getGoalSections` and `getCriterionItems` (`:207-212`, bullets `^[-*+]\s+(?:\[[ xX]\]\s*)?(.*)$`). No check tests rule 4 or rule 5.
- `.skilled/skills/system-spec-kit/references/workflows/goal-set-string-playbook.md:55-57` — the evaluator "sees only the stored string"; criteria must stay "checkable without opening anything else".
- `.skilled/commands/create/assets/create-goal-auto.yaml:215-226` — the budget-cut step's "never make one uncheckable" line and `step_check` ("Run check-goal.cjs on the packet … before handoff") into `step_6_handoff`.
- Population and sample: `goal.md` files under `specs/` excluding `z_archive`, by a `node -e` extraction (below). TX count: `node -e` over `~/.claude/projects/-Users-michelkerkmeester-MEGA-Development-Code-Environment-Public/*.jsonl`, `goal_status` attachment records, numbers and field names only. No repository module run, no `jev` call of either package, no network, no `.env` opened.

## Method (recorded so the operator can relabel)

**Population.** For each `specs/**/goal.md` outside `z_archive`, the section under the `completion` anchor or the "Completion Criteria" heading, bullets matching `check-goal.cjs`'s `getCriterionItems` pattern. Result: **1,313 criterion lines across 308 goal.md files** (31 files carry no criterion bullet). The seats' 1,375–1,387 differ by extraction method; mine counts checkbox-optional top-level bullets in that section only. By goal kind (parent has a child with `spec.md`, child has a parent `spec.md`): child 1,199, parent 106, top-level 8. By track: system-speckit 452, sk-design 231, sk-doc 219, system-deep-loop 141, system-skill-advisor 98, cli-jev 92, sk-git 44, minor tracks 26.

**Sample.** 44 lines, stratified two-way by track-group × goal kind, proportional allocation with a floor of 1 per populated cell, drawn without replacement by a seeded LCG (**seed 20260926**, `s = s*1103515245+12345 & 0x7fffffff`), rows sorted by `path:line` before drawing. Cell allocations: cli-jev child 1 / parent 1, minor child 1 / parent 1, sk-design child 5 / parent 1, sk-doc child 6 / parent 1, sk-git child 1 / parent 1, system-deep-loop child 5, system-skill-advisor child 3 / parent 1, system-speckit child 15 / top 1.

**Scoring rubric (this is where the disagreement lives).** Two binary flags per line:
- **Rule 4 fail (not self-contained):** the line contains a referring expression — pronoun, definite description ("the run report", "the threshold", "every kept file", "the condition"), or jargon — whose resolution needs text outside the line. Naming a path, command, or the packet itself ("this child") resolves locally.
- **Rule 5 fail (needs another file):** deciding pass/fail requires interpreting the content of another document (rows in `spec.md`, records whose semantics live elsewhere, "real scope", "where they changed"), as opposed to running a named command, counting named paths, or checking a stated property of a named artifact.

**Scored sample (path:line — R4/R5 — reason).** `pass` means the rule holds.

1. `specs/cli-external-orchestration/071-cli-hermes-creation/001-deep-research/goal.md:82` — pass/pass — paths, counts and the recorded field all named.
2. `specs/cli-external-orchestration/071-cli-hermes-creation/goal.md:105` — fail/pass — "recursive strict validation" is jargon whose invocation lives outside the line.
3. `specs/cli-jev/001-cli-jev-creation/004-catalog-and-playbook/goal.md:86` — fail/pass — "the run report" is an unnamed artifact.
4. `specs/cli-jev/001-cli-jev-creation/goal.md:76` — fail/fail — "the jev contract", "pinned live", "every claim" all resolve outside the line.
5. `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/007-fidelity-and-library-research/goal.md:80` — pass/pass — one named command, one printed string.
6. `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/031-full-family-coverage/goal.md:74` — fail/fail — literal `[Another]`: unfilled template placeholder (check-goal flags it under `placeholder`, not rules 4/5).
7. `specs/sk-design/018-sk-design-parent-v2/001-sk-create-chart/goal.md:104` — fail/fail — "names real scope and a real status" needs reading `spec.md` rows and an undefined standard.
8. `specs/sk-design/019-sk-design-diagram-upgrade/010-design-md-style-reference/goal.md:88` — fail/pass — "its stock source" is unnamed; the command part is checkable.
9. `specs/sk-design/019-sk-design-diagram-upgrade/011-full-page-capture/goal.md:80` — pass/pass — paths, command and measurable height stated; the appended record text does not break the check.
10. `specs/sk-design/019-sk-design-diagram-upgrade/goal.md:114` — fail/pass — "form directory" is domain jargon defined elsewhere; the rg half is checkable.
11. `specs/sk-doc/052-routing-completeness/006-validator-and-template-debt/goal.md:62` — fail/fail — "the document validator" unnamed; "bytes are unchanged" against what baseline.
12. `specs/sk-doc/059-skill-changelog-retrofit/003-cli-jev/goal.md:61` — fail/fail — "every kept file" is a list held elsewhere.
13. `specs/sk-doc/059-skill-changelog-retrofit/003-cli-jev/goal.md:62` — fail/fail — "the cli-jev rewrites" and "every mirror `--check`" resolve outside.
14. `specs/sk-doc/059-skill-changelog-retrofit/005-mcp-code-mode/goal.md:59` — pass/pass — both artifacts named as paths; the check is a join over them.
15. `specs/sk-doc/059-skill-changelog-retrofit/010-sk-doc/goal.md:60` — fail/fail — "the shape checker" unnamed command; "every kept file" external list.
16. `specs/sk-doc/059-skill-changelog-retrofit/014-system-deep-loop/goal.md:61` — fail/fail — same "every kept file" defect as row 12.
17. `specs/sk-doc/059-skill-changelog-retrofit/goal.md:95` — fail/pass — "every rewritten changelog" is an external selection; the command is named.
18. `specs/sk-git/028-crawlable-commit-history/003-contract-and-hook/goal.md:75` — fail/pass — "the commit-msg hook test" unnamed; the second file named.
19. `specs/sk-git/028-crawlable-commit-history/goal.md:110` — fail/pass — "pre-rewrite", "the old history" need history knowledge outside the line.
20. `specs/system-deep-loop/036-deep-loop-innovation/007-executor-and-cli-hardening/010-fanout-write-containment-hardening/004-index-lock-retry/goal.md:83` — fail/fail — "The test" and "the current wrapper" both unnamed.
21. `…/005-churn-cumulative-arm/goal.md:83` — fail/fail — "The threshold" unnamed; "a documented value" points at a document.
22. `…/007-worktree-removal/goal.md:84` — fail/pass — the scenario's actors ("shared checkout", "neighbour") are defined in prose; outcomes observable.
23. `…/019-forced-depth-empty-records/goal.md:82` — fail/pass — "The gateway" is a repo concept whose definition lives outside.
24. `…/010-fanout-write-containment-hardening/goal.md:94` — pass/pass — "revert-and-fail model" names its own search term; the check is an rg.
25. `specs/system-skill-advisor/023-semantic-lane-enablement/005-verification-and-closeout/goal.md:63` — fail/fail — "every gate's number" needs a gate list held elsewhere.
26. `specs/system-skill-advisor/023-semantic-lane-enablement/goal.md:93` — fail/fail — "Five named canary prompts" and "their intended hub" are a mapping held elsewhere.
27. `specs/system-skill-advisor/025-mcp-decommission-cli-front-door/001-transport-and-consumer-inventory/goal.md:79` — fail/fail — "is listed" names no artifact; "advisor capability" undefined here.
28. `…/001-transport-and-consumer-inventory/goal.md:83` — fail/fail — "the inventory" unnamed artifact.
29. `specs/system-speckit/033-system-speckit-v4/008-template-contracts-and-acceptance-criteria/003-restore-level-upgrade-and-vocabulary-invariance/goal.md:62` — fail/fail — "the documents that level declares" is a table in another document.
30. `…/014-daemon-and-test-harness-hardening/004-live-follow-log-hygiene/goal.md:62` — fail/fail — "the condition" refers to prose elsewhere.
31. `…/017-memory-database-decommission/003-spec-memory-server-removal/goal.md:71` — fail/pass — "the env reference" and "the removed subsystem" resolve outside; rg-checkable.
32. `…/005-ripgrep-retrieval-research/goal.md:70` — fail/fail — "where they changed" needs the change record elsewhere.
33. `…/030-spec-kit-simplification-research/006-retrieval-drift-remediation/goal.md:78` — pass/pass — named command; "this child" resolves to the packet.
34. `…/007-cli-package-residue-removal/goal.md:79` — pass/pass — same shape.
35. `…/017-completion-gate-and-catalog-alignment/goal.md:78` — fail/fail — "The freshness suite proves the malformed_fingerprint class": neither actor nor proof stated checkably.
36. `…/022-doctor-signal-truth-and-conventions-precision/goal.md:77` — fail/fail — "the doctor asset", "the route", "the mirror check" all unnamed.
37. `…/032-recorded-findings-closure/007-links-scan-registry-rule/goal.md:76` — pass/pass — exact command and exit code.
38. `…/038-goal-unification/007-retirement-docs-and-verification/review/lineages/deepseek-review-3/scratch/anchor-inject/ws/specs/t/001-fixture/goal.md:17` — fail/fail — criterion is literally `done`; this is a test fixture goal inside a review scratch tree, not an operator goal (flagged for exclusion in the sensitivity row).
39. `…/011-goal-drift-remediation/goal.md:68` — fail/fail — "The plugin", "the record-store override", "the core" resolve outside.
40. `…/013-goal-chat-send-shape/goal.md:91` — pass/pass — named test command; the proved property is stated in the line.
41. `…/041-skilled-source-root-migration/001-deep-research/goal.md:60` — fail/fail — "Every blocker" is a set held in the research outputs.
42. `…/003-layout-probes/goal.md:64` — fail/fail — "pre-probe captures" and "every guarded home file" are external sets.
43. `…/007-source-root-move/goal.md:67` — fail/pass — "the move" referent external; the git checks are runnable.
44. `…/010-machine-and-consumer-cutover/goal.md:62` — fail/pass — paths and checks concrete, but "the bridge directory" is unnamed.

## Estimates

| Reading | Violations | Share | Wilson 95% |
|---|---|---|---|
| Rule 4 strict (referent resolution) | 35/44 | 79.5% | 65.5%–88.8% |
| Rule 5 strict (delegation to another document) | 23/44 | 52.3% | 37.9%–66.2% |
| Either rule, strict | 35/44 | 79.5% | 65.5%–88.8% |
| Lenient (only unresolvable referents fail R4) | 20/44 | 45.5% | 31.7%–59.9% |

Against the two prior estimates: 1.5% (seat-002's strict regex, 21 of 1,387) and about 28% (seat-003's one-lens reading, 7 of 25). My strict estimate is above both; my lenient reading brackets 28% inside its interval. **The method difference, named:** the regex counts lexical patterns ("as described in", explicit file references), while almost every violation I found is *referential* — a definite description ("the run report", "every kept file", "the condition", "the threshold") whose antecedent lives in packet prose. A lexical proxy structurally misses that class; a one-lens sample absorbs it into whatever tolerance the judge happens to have. The three numbers are not three estimates of one quantity; they are three failure definitions. D5 cannot close on more samples — it closes on a labeling protocol that fixes the rubric first.

## What a violating criterion costs (question 3, numbers only)

Native `goal_status` records under `TX/`, counted by walking `attachment` objects with `type: "goal_status"` (field names: `condition,durationMs,failed,iterations,met,reason,sentinel,tokens,type`):

- **757 records**; `met` false 695, true 62.
- **610 carry a `reason` string**; reason length p50 830 characters, max 2,221.
- **280 of 610 reasons (45.9%) mention criterion, verifiable, checkable, observable or self-contained wording.** This is a lexical mention count, an upper bound on attribution. BASE's seat-reported 31 of 576 blames the criterion *as the cause*; my regex counts any mention. Both numbers stand, and the gap between them (5.4% vs 45.9%) is the same method gap as the base rate: the cost side of R20 is also undefined until attribution is scored by a stated rule.

## Per-idea records

### Idea 1: `R20` — the goal-criteria lint (lexical first, `noul` Jev arm later)

| Field | Record |
|---|---|
| **Idea** | `R20`: a zero-call lexical lint of goal criteria against rules 4 and 5, later optionally two `noul` Jev questions per criterion (Python `jev-cli` 0.6.2). |
| **Builds on** | BASE R20; round-2 question 22; council disagreement D5. |
| **Value** | The operator's decision is whether a criterion will survive the evaluator that "sees only the stored string" (`goal-set-string-playbook.md:55`). Today no machine check tests rules 4 and 5 at all (`check-goal.cjs:44-49` checks binding rows, placeholders, count, budget only), and my sample says a strict reading flags most criteria. |
| **Seam** | `.skilled/skills/sk-doc/sk-create-goal/scripts/check-goal.cjs:207-212` (`getCriterionItems`) is the parser a lint can copy; `:44-49` is the untouched exit-code surface. Rules at `SKILL.md:121-122`. Opened this iteration. |
| **Metric, baseline, harness** | Per-rule precision and recall against operator labels; the labels are the harness. Baseline: the zero-call lint itself. Base rate by this sample: 45.5%–79.5% depending on rubric. |
| **Cost, latency, privacy** | Lint: zero calls. Jev arm: about 600 offline calls per BASE. Committed repository text only. |
| **Key gate and no-key behavior (D5)** | As BASE R20: separate script, own `--jev` flag, skip line `jev arm skipped: <check>`, `check-goal.cjs` output and exit codes byte-identical. Nothing in this iteration changes it. |
| **Rough LOC** | BASE estimate 120–200 LOC stands; the referential rules my sample implies need a small antecedent resolver or explicit allowlists, +0–40 LOC, UNKNOWN until the rubric is fixed. |
| **Verdict** | **build-now for the lexical lint plus labels** (the slice is zero-call and my interval says the problem is not rare), **next for the Jev arm**. The 5% stop rule does not fire under any semantic rubric (below), so the slice is safe to build. |
| **Confidence** | Confirmed: the parser, the missing checks, the sample and its scoring under my rubric. Disputed: the base rate itself — my score is one model family (mimo), and the rubric is mine. The operator's labels decide. |

### Idea 2: `N-mimo-02-1` — a two-stage labeling protocol before any base rate is quoted (no Jev call)

| Field | Record |
|---|---|
| **Idea** | Stage 1: the operator adopts a written rubric (mine above, or seat-003's, or a third). Stage 2: ~100 stratified labels scored under that rubric. Until stage 1, no percentage from any lens is quoted as "the" base rate. |
| **Builds on** | D5 and the method gap this iteration measured (1.5% / 28% / 45.5%–79.5%). |
| **Value** | It turns D5 from a disagreement between models into a decision the operator can make in ten minutes, and it fixes the lint's operating point before code exists. The label file schema (swe-04's block) then records `rule4`, `rule5` and `rubric_version` per row. |
| **Seam** | Label file beside the proposed lint script; schema owned by swe-04's slice. No code seam. |
| **Metric, baseline, harness** | Inter-rater agreement on 20 relabeled rows (this sample is the relabelable set); target: operator-vs-lint agreement per rule. |
| **Cost, latency, privacy** | Operator minutes only; nothing leaves the machine. |
| **Key gate and no-key behavior (D5)** | Not a call path. |
| **Rough LOC** | Zero code; one schema row per label. |
| **Verdict** | **build-now (protocol text).** Every downstream number, including R20's stop rule, is undefined without it. |
| **Confidence** | Confirmed: the three methods measure different things (evidenced by the spread). |

### Idea 3: `N-mimo-02-2` — lint placement and defaults in `/create:goal` (UX)

| Field | Record |
|---|---|
| **Idea** | The lexical lint prints inside the criteria step, immediately after criteria are authored and before `step_check` at handoff (`create-goal-auto.yaml:215-221`), one line per failing criterion (`path:line`, rule, the referent that failed). Default: lexical lint ON, advisory (never changes `check-goal.cjs` exit codes); Jev arm OFF behind `--jev`. |
| **Builds on** | BASE R20's placement question ("where would the lint print") and `create-goal-auto.yaml:221`. |
| **Value** | The operator sees the failure while the criterion is still being written, not after the packet is closed; the fix is a reword, not a re-plan. Printing at handoff (today's only check) means rewriting a finished goal. |
| **Seam** | `.skilled/commands/create/assets/create-goal-auto.yaml:215-226` — the budget step already says "Never remove a criterion or make one uncheckable"; the lint is that sentence's machine check. Opened this iteration. |
| **Metric, baseline, harness** | Share of lint findings fixed before handoff; baseline UNKNOWN (no lint exists). |
| **Cost, latency, privacy** | Zero calls; local print only. |
| **Key gate and no-key behavior (D5)** | The lexical lint needs no key; with the gate failing the Jev arm prints `jev arm skipped: <check>` and the lexical findings print unchanged. |
| **Rough LOC** | Report formatting inside the lint script; 10–20 LOC. |
| **Verdict** | **build-now with the lint slice.** It is the UX half of the same file. |
| **Confidence** | Inferred from the yaml's step order (opened): that earlier printing yields fixes; what would confirm: one session of use. |

## Ruled out this iteration

- Running `check-goal.cjs` on any packet: the contract forbids running repository modules; its four checks were read instead.
- Quoting my 79.5% as the base rate without the rubric caveat: it is one lens under one rubric, and rows 6 and 38 show the population itself carries fixture and placeholder debris.
- Attributing TX `reason` text: contents were never copied; the 280 count is a regex over `reason` strings, numbers only, per contract rule 9.
- A second independent lens on the same sample: one lineage is one opinion (delegation doctrine); swe-04's rules-with-examples pass is the second lens by design.

## New against baseline

| Claim | new, contests BASE, confirms BASE with new evidence, or restated | Evidence |
|---|---|---|
| The base rate is method-dominated: three failure definitions give 1.5% (regex), 28% (one-lens) and 45.5%–79.5% (referential rubric, Wilson intervals above) | new, contests the framing of D5 as a two-estimate disagreement | the scored sample above; `check-goal.cjs:207-212` parser |
| Nearly every sampled violation is referential (definite description with an external antecedent), a class lexical proxies cannot see | new | sample rows 2, 3, 11, 12, 20, 21, 25–30 and others |
| No machine check tests rules 4 or 5 today: `check-goal.cjs` runs four structural checks only | confirms BASE with new evidence | `check-goal.cjs:44-49` reopened |
| Native `goal_status` cost numbers: 757 records, 610 with reasons, 280 mentioning criterion wording (45.9%), `met` false 695/757; BASE's 31 of 576 is attribution, mine is mention | new (BASE carried only the seat's 31/576) | TX walk, numbers only |
| R20's 5% stop rule cannot fire under any semantic rubric: even the lenient interval's floor is 31.7% | contests BASE R20's stop rule as rubric-blind | the interval table |
| The population itself needs hygiene: at least one criterion is a literal `[Another]` placeholder and one goal.md is a review-scratch fixture ("done") | new | sample rows 6 and 38 |
| The evaluator "sees only the stored string" and criteria must be checkable "without opening anything else" | restated | `goal-set-string-playbook.md:55-57` reopened |

## Sibling check

Independent: no round-2 sibling file read.

## Hand-off

- swe-04: take this sample as the label set's first 44 rows; my rubric rows (`rule4`, `rule5`, `rubric_version`) should be the schema, and the lint rules must handle the referential class (rows 2, 3, 12, 20, 21) or they will re-land at 1.5%.
- mimo-05: the operator labor line for R20 is roughly 100 labels (stage 2) plus 10 minutes rubric choice (stage 1); the TX cost count feeds the value side.
- Whoever writes the D5 row in the synthesis: quote the spread (1.5% / 28% / 45.5–79.5%) as one finding, not three estimates.
- The 5% stop rule needs a rubric-qualified replacement in 006's proposed spec; propose: stop only if the *labeled* rate under the adopted rubric is under 5% with the interval's floor under 5%.
