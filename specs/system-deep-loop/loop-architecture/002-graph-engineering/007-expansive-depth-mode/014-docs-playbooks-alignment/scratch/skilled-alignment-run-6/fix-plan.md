# Fix plan

Target: HEAD; head: cee8682a6c9ef068533304435765dac7aad72702

## In scope

### skill:.skilled/skills/system-deep-loop

- [ ] A5 P2 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:197 The comment block on lines 197-202 describes the finding-to-evidence derivation (each finding with a path:line ref becomes a FINDING node plus an EVIDENCE_FOR edge to the FILE node) but sits above rea
  fix: // The iteration's own findings are the source of review evidence: each finding with // a `path:line` ref becomes a FIND -> function readJsonlRows(filePath, label, required) {
- [ ] C-01 P2 .skilled/skills/system-deep-loop/changelog/v2.1.6.0.md:22 The glance bullet tells the reader that research accepts `--claude-config-dir`, but that flag is internal to `dispatch-iteration.cjs` and is rendered by the workflow only when `config.executor.configD
  fix: - Research accepts `--claude-config-dir` on `cli-claude-code` runs. -> - Research honors `--config-dir=PATH` on `cli-claude-code` runs.
- [x] A1 P1 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:239 readCaps derives maxFrontierNodes as floor(maxIterations/2), a value below the depth-1 seed the same function admits: the shipped configs give 5 (research, maxIterations 10) and 3 (review, maxIteratio [handed off]
- [ ] A2 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:200 readNodeStore turns a read failure into an empty store: `catch { return nodes; }` has no comment and no log, unlike the sibling JSONL reader in upsert.cjs which throws for a required source. Case: fro
- [ ] A3 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:329 A proposal that carries evidence and scope but no `question` is pruned with reason 'dedupe': dedupeKey returns '' for a non-string, and checkProposal returns 'dedupe' for an empty key before any field
- [x] A4 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:188 The id-prefix strip `^[a-z]{1,2}[-\s]?\d+(?:[-\s]\d+)*\s*:\s*` also removes an ordinary 1-2 letter word followed by a number and a colon, which the comment on lines 183-185 says stays part of the ques [handed off]
- [x] D-1 P2 .skilled/skills/system-deep-loop/hub-router.json:37 The review class is the only owner of the convergence phrase `findings stop changing`, so a research-framed request that uses it resolves to the review loop in one silent step, with no clarify and no  [handed off]
- [x] D-2 P2 .skilled/skills/system-deep-loop/hub-router.json:32 The new expansive-depth feature contributes no routing vocabulary at any stage: `expansive`, `frontier`, `sub-target` and `depth mode` occur zero times in SKILL.md's keyword line, description.json's k [handed off]

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B-01 P1 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-soft-stop.md:54 The Expected block pins vitest summary counts that the committed suite no longer produces, so the stated Pass rule ("Commands 1 and 2 exit 0 with the expected counts", line 65) can never be met and a 
  fix: `Tests 28 passed | 64 skipped (92)` -> `Tests 28 passed | 85 skipped (113)`
- [ ] B-02 P1 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md:54 Both pinned vitest counts in the Expected block are stale, so the count-dependent Pass rule at line 65 fails on a green suite. Command 2's summary and command 3's summary both need restating.
  fix: `Tests 4 passed | 30 skipped (34)` -> `Tests 4 passed | 46 skipped (50)`
- [ ] B-03 P1 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:55 All three pinned vitest counts in the Expected block are stale, and the same `Tests 1 passed | 23 skipped (24)` string is used for both command 3 and command 4. The Pass rule at line 66 requires "the 
  fix: `Tests 7 passed | 17 skipped (24)` -> `Tests 7 passed | 20 skipped (27)`
- [ ] B-04 P1 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-picks-shallowest-open-node.md:54 The same stale vitest count is printed for both command 1 and command 2. The suite total moved from 51 to 53, so the Expected signals disagree with the shipped tests.
  fix: `Tests 1 passed | 50 skipped (51)` -> `Tests 1 passed | 52 skipped (53)`
- [ ] B-05 P1 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md:56 Commands 1 to 3 carry stale counts (fanout-run.vitest grew from 208 to 210 tests); command 4 is correct. The Pass rule at line 67 requires all four commands to exit 0 "with the expected counts", so th
  fix: `Tests 2 passed | 206 skipped (208)` -> `Tests 2 passed | 208 skipped (210)`
- [x] B-13 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:9 This root playbook carries the EXECUTION POLICY block but not the results-storage contract the standard requires in section 4, and it has no `benchmark/reports/` home for a run. The hub root (line 9)  [rebutted]
- [x] D-3 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:30 The Keyword triggers list advertises activation the router cannot deliver, and the hub SKILL.md section 2 says this list is checked against vocabularyClasses while nothing enforces it. `comprehensive  [handed off]

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] B-06 P1 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/initialization-and-state-setup/expansive-seed-writes-depth-one-nodes.md:54 Both pinned vitest counts are stale and the workflow line number is off by one, so three of the scenario's stated expected signals are wrong. Line numbers and suite totals are pinned to the tree the s
  fix: `Tests 1 passed | 22 skipped (23)` -> `Tests 1 passed | 24 skipped (25)`
- [ ] B-07 P1 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-admission-prunes-with-reasons.md:55 Both pinned vitest counts are stale; frontier-admit-review.vitest grew from 23 to 25 tests. The Pass rule at line 68 requires commands 1 and 2 to exit 0 "with the expected counts".
  fix: `Tests 7 passed | 16 skipped (23)` -> `Tests 7 passed | 18 skipped (25)`
- [ ] B-08 P1 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:54 Command 2's pinned count is stale (stop-decision-yaml-contract.vitest grew from 34 to 50 tests); command 1's count is correct. The Pass rule at line 65 requires both commands to exit 0 "with the expec
  fix: `Tests 1 passed | 33 skipped (34)` -> `Tests 1 passed | 49 skipped (50)`
- [ ] B-09 P1 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/iteration-execution-and-state-discipline/frontier-focus-and-node-dimension-coverage.md:54 Command 2's pinned count is stale; command 1's is correct. The Pass rule at line 65 requires both commands to exit 0 "with the expected counts", so the scenario fails a green suite as written.
  fix: `Tests 1 passed | 33 skipped (34)` -> `Tests 1 passed | 49 skipped (50)`
- [ ] B-10 P1 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/fanout/fanout-frontier-partition-round-robin.md:55 Command 1's pinned count is stale (fanout-run.vitest grew from 208 to 210 tests); command 2's count is correct. The Pass rule at line 66 requires both commands to exit 0 "with the expected counts".
  fix: `Tests 4 passed | 204 skipped (208)` -> `Tests 4 passed | 206 skipped (210)`
- [ ] B-11 P1 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/frontier-open-veto-holds-review-stop.md:53 The single pinned vitest count is stale; stop-decision.vitest grew from 92 to 113 tests. The expected signals, and therefore the scenario's verdict, no longer match the shipped suite.
  fix: `Tests 9 passed | 83 skipped | 83 skipped (92)` -> `Tests 9 passed | 104 skipped (113)`
- [ ] B-12 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:383 The root summary's Prompt field disagrees with the scenario contract it summarizes (iteration-execution-and-state-discipline/graph-events-review.md:32), which the standard forbids: "Do not ship unsync
- [x] B-14 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:9 Same gap as B-13 on the review root playbook: the EXECUTION POLICY block is present but the section 4 results-storage contract and its `MANUAL_PLAYBOOK_RESULT_PERSISTENCE_CONTRACT` marker are absent,  [rebutted]

### unowned

- [x] BAT-01 P2 -:- S9-command-references failed (exit 1). [handed off]

## Pre-existing or outside the scope

### unowned

- [x] D-4 P2 .skilled/commands/speckit/assets/speckit-resume.yaml:104 Confirmed cause of the failed S9-command-references row, and it is not a defect in any /deep:* command file. The validator requires every literal repo-relative token to exist on disk, and this line na (unchanged in range) [handed off]

