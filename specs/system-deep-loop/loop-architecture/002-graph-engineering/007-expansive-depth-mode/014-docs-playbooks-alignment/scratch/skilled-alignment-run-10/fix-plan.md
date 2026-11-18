# Fix plan

Target: HEAD; head: c10bb24f3e58dbd2fb01eb518d6e1d85da4caab7

## In scope

### skill:.skilled/skills/system-deep-loop

- [ ] E-4 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:278 The expansiveBudget comment says the ceiling 'binds for a four-dimension review from two seeds on', but the function returns 24 at one seed: 2 x 4 x (1 + 3 - 1) = 24. The test at frontier-admit-review
  fix: // review from two seeds on. Twice the node count keeps the half-budget node cap -> // review from one seed on. Twice the node count keeps the half-budget node cap
- [ ] E-1 P2 .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:229 The new Section 9 MODE PACKAGE INDEXES table states 71 deep-research scenarios and 69 deep-review scenarios. The package playbooks state 72 and 70, and the folders hold 72 and 70 scenario files. The s
  fix: | `deep-research` | 71 | 9 | ... | `deep-review` | 69 | 10 | ... -> | `deep-research` | 72 | 9 | ... | `deep-review` | 70 | 10 | ...
- [ ] A-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:3834 partitionFrontierNodes is called twice with identical arguments. budgetPartition (line 3749) is built from expandedLineages labels and frontierPartition (line 3834) from cliLineages labels, but cliLin
- [ ] E-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:111 hasScope accepts any non-empty array, while scopeEntries drops non-string and blank entries. A proposal with scope [" "], [123] or [null] therefore passes the relevance check at line 403. On a review 
- [ ] E-3 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/feature-catalog.md:29 The runtime catalog's script-entry-points group has no entry for frontier-admit.cjs, the new 938-line script with a CLI (seed, admit, close, graph, block) that deep-research.yaml and deep-review.yaml 

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] B-07 P2 .skilled/skills/system-deep-loop/deep-review/README.md:235 The README states the playbook carries 69 deterministic scenarios; the shipped corpus carries 70. The root playbook says 70 and validate-playbook-package.cjs derives 70. This change raised the count f
  fix: The playbook carries 69 deterministic scenarios across ten categories. -> The playbook carries 70 deterministic scenarios across ten categories.
- [ ] B-08 P2 .skilled/skills/system-deep-loop/deep-review/SKILL.md:238 The derived-budget prose says 'With the four canonical dimensions the ceiling of 24 binds from two seeds on'. The shipped formula binds the ceiling at the first seed: expansiveBudget({target:'review',
  fix: With the four canonical dimensions the ceiling of 24 binds from two seeds on -> With the four canonical dimensions the ceiling of 24 binds from the first seed on
- [ ] A-2 P2 .skilled/skills/system-deep-loop/deep-review/scripts/divergent-review-pivot.ts:313 The new frontier-unanswered seed embeds the node's scope path list into its focus text, and seedViolatesReadOnlyBoundary (line 174) then scans that focus for mutation verbs. A review target whose path
- [ ] B-03 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/feature-catalog.md:224 The 'Expansive depth mode' root entry freezes a two-pilot measurement and a cap-change history into current-state prose: 'Two live review pilots ran. In the first the depth-1 budget check passed but t
- [ ] B-04 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:16 The leaf repeats the same frozen two-pilot measurement and cap-change history in its OVERVIEW. Same rule as B-03.
- [ ] E-5 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:28 The prose says 'A node needs one iteration per dimension in its universe, the four canonical dimensions plus any custom name', but configuredReviewDimensionCount in frontier-admit.cjs counts only the 

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B-05 P2 .skilled/skills/system-deep-loop/deep-research/README.md:227 The README states the playbook holds 71 deterministic scenarios; the shipped corpus holds 72. The root playbook itself says 72 and validate-playbook-package.cjs derives 72, so the README is the stale 
  fix: holds 71 deterministic scenarios across 9 categories -> holds 72 deterministic scenarios across 9 categories
- [ ] B-06 P2 .skilled/skills/system-deep-loop/deep-research/README.md:265 The package-map row repeats the same stale count: 71 scenarios where the corpus holds 72. Same cause as B-05.
  fix: | 71 scenarios with expected signals and verdict rules | -> | 72 scenarios with expected signals and verdict rules |
- [ ] D-3 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:94 The new Expansive Depth Mode bullet names the inbox ("Admitted nodes land in `research/inbox.jsonl` with `origin: "frontier"`") but never names the node store `research/frontier-nodes.jsonl`, which `f
  fix: Admitted nodes land in `research/inbox.jsonl` with `origin: "frontier"`. -> Admitted nodes land in `research/inbox.jsonl` with `origin: "frontier"`, and node status lives in `research/frontier-nod
- [ ] B-01 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/feature-catalog.md:487 The 'Expansive depth mode' root entry freezes a pilot-run measurement and a criterion-amendment history into current-state catalog prose: 'Two live research pilots ran on one topic, and both failed th
- [ ] B-02 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:16 The leaf repeats the same frozen pilot measurement and criterion-amendment history in its OVERVIEW: 'Two live research pilots ran on one topic, and both failed the criterion ... The criterion was then

### unowned

- [x] BAT-01 P2 -:- S9-command-references failed (exit 1). [handed off]

## Pre-existing or outside the scope

