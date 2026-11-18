# Fix plan

Target: HEAD; head: 7799a67f677576d07a9f1082fb3db8d9b6efbaa4

## In scope

### skill:.skilled/skills/system-deep-loop

- [x] A-1 P1 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:386 Case: a review run reuses a finding id for a different finding in a later iteration. Iteration 1 stores F1 (src/a.cjs, 'Leak in a'); iteration 2 stores F1 (src/b.cjs, 'Race in b'), which deriveReviewF [handed off]
- [ ] A-3 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:330 Case: an iteration delta carries a frontier_proposal whose parentId names a node the store already marked pruned (the leaf's focus lags one step behind the close step, or a resubmitted proposal row na
- [x] D-3 P2 .skilled/skills/system-deep-loop/hub-router.json:37 Two review aliases are broad enough to steal other skills' prompts. 'findings stop changing' gives system-deep-loop the top-1 at score 0.549, confidence 0.82, against sk-code 0.097 and mcp-tooling 0.0 [handed off]
- [x] D-4 P2 .skilled/skills/system-deep-loop/hub-router.json:33 The new expansive-depth feature contributes no stage-one vocabulary. 'expansive', 'frontier', 'depth mode' and 'sub-target' are absent from research-aliases, mode-registry aliases, the hub ROUTER.md R [handed off]

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B-S4-01 P1 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:57 DR-070's Expected block says command 1 prints 14 lines, but that command returns 15 matches. An operator running the scenario exactly as written sees an evidence count the scenario contract contradict
  fix: Command 1 prints 14 lines. -> Command 1 prints 15 lines.
- [x] C-02 P1 .skilled/skills/system-deep-loop/deep-research/README.md:127 The new '--depth-mode=expansive' paragraph joins two independent clauses with a semicolon. Same rule as C-01 (sk-create-readme section 8 semicolon ban, section 7 'HVR passes'). Column 968, in the sent [handed off]
  fix: works its seeds only; raise `--max-iterations`, as the pilots did at 16, to reach depths 2 and 3. -> works its seeds only. Raise `--max-iterations`, as the pilots did at 16, to reach depths 2 and 3.
- [ ] B-S2-01 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:125 The release note says a Next Focus tie goes to a node with no covering finding. The reducer's tie-break after depth is the fewest visits (reduce-state.cjs:2493), and the skill and loop protocol both s
  fix: - Ties go to a node with no covering finding. -> - Ties go to the least visited node.
- [x] A-2 P1 .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2535 Case: cap 10, F-1-001 (depth 1) open with 4 visits, F-2-002 (depth 2) open with 4 visits. The first reduce leaves depth 1 open, so carry is 0 and depth 2's allotted share is 3.5 < 4 spent, which close [handed off]
- [x] A-4 P2 .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2684 Case: a frontier node seeded at iteration 0 (frontier-admit seed always writes iteration 0) is closed by applyFrontierBudget's band sweep at iteration 9. The question has no resolution record and no s [handed off]
- [ ] B-S3-03 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/divergent-convergence-mode.md:22 The entry lists the excluded stop reasons correctly but never mentions the terminal-frontier gate the research workflow now applies under --depth-mode=expansive: the pivot is eligible only once regist
- [x] D-1 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:30 The packet's Keyword triggers list advertises activation the hub cannot route. Four of the eight terms (autonomous research, multi-round research, deep investigation, comprehensive research) are absen [handed off]

### root:README.md

- [ ] C-01 P1 README.md:255 The new deep-loop paragraph puts a semicolon in the sentence that introduces custom review dimensions. sk-create-readme section 8 lists 'No semicolons. Split the sentence or use "and".' under HUMAN VO
  fix: four defaults; a fan-out review lineage always reviews the four. -> four defaults, and a fan-out review lineage always reviews the four.

### skill:.skilled/skills/system-deep-loop/deep-review

- [x] C-03 P1 .skilled/skills/system-deep-loop/deep-review/README.md:158 The new '--depth-mode=expansive' paragraph carries the same semicolon join. Same rule as C-01 and C-02. Column 1361. The file had 0 hard blockers on main and has 1 here. [handed off]
  fix: works its seeds only; raise `--max-iterations`, as the pilots did at 16, to reach depths 2 and 3. -> works its seeds only. Raise `--max-iterations`, as the pilots did at 16, to reach depths 2 and 3.
- [ ] B-S3-01 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:16 The current-state entry says 'One live review pilot ran' and records only the first pilot's failure (six depth-1 nodes, cap 6 pruned the seventh, three of six lineages on maxIterationsReached). The br
- [ ] B-S3-02 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md:24 The entry's do-not-pivot list omits maxDurationReached, which the review workflow's eligibility contract excludes (deep-review.yaml:1375), and the entry never mentions the new terminal-frontier gate (
- [ ] B-S3-04 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:40 The entry's Fan-Out section stops at the merged frontier and the partition guard. The same change keeps each review lineage's coverage graph local by exporting DEEP_LOOP_COVERAGE_DB_DIR to {lineage}/g

### unowned

- [x] BAT-01 P2 -:- S9-command-references failed (exit 1). [handed off]

## Pre-existing or outside the scope

### unowned

- [x] D-5 P2 .skilled/commands/scripts/validate-command-references.cjs:134 The S9-command-references row fails on a runtime-state path the validator should exempt, not on a command defect. .skilled/commands/speckit/assets/speckit-resume.yaml:104 names .skilled/skills/system- (unchanged in range) [handed off]
  fix: if (/^\.skilled\/skills\/system-deep-loop\/runtime\/database\/[^/]+\.sqlite$/.test(token)) continue; -> if (/^\.skilled\/skills\/system-deep-loop\/runtime\/database\/[^/]+\.sqlite$/.test(token)) continue; if (/^\.skilled\/sk
- [x] D-2 P1 .skilled/skills/sk-doc/sk-create-skill/scripts/ci-hub-vocabulary-source.cjs:169 The triggers leg cannot see a bullet-list Keyword triggers block. triggerItems() scans only lines containing the literal 'Keyword triggers:' prefix, so the eight backticked items on the following line (unchanged in range) [handed off]

