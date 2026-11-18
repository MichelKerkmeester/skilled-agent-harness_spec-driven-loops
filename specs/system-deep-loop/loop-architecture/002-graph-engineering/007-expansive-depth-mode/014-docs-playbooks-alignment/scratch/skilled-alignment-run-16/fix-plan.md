# Fix plan

Target: HEAD; head: 7a1b0ec7a1eca4f260338b90825a43db32084e6e

## In scope

### skill:.skilled/skills/system-deep-loop

- [ ] A4-1 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/stop-decision-yaml-contract.vitest.ts:437 The test 'places step_frontier_budget right after the phase_init seed step' never asserts that the budget step comes after the seed step. It slices text from the seed index to the budget index. If ste
  fix: expect(budget.length).toBeGreaterThan(0); -> expect(budget.length).toBeGreaterThan(0); expect(text.indexOf(' step_frontier_budget:\n')).toBeGreaterThan(initSeed);
- [ ] B3-1 P2 .skilled/skills/system-deep-loop/changelog/v2.1.7.0.md:38 The changelog says the golden tests keep a default run's output byte for byte, but research-depth-mode-golden.vitest.ts and review-depth-mode-golden.vitest.ts strip the expansive-only persona paragrap
  fix: The golden tests keep a default run's output byte for byte. -> The golden tests keep a default run's output byte for byte, apart from the expansive-only persona paragraph they strip f
- [ ] C3-1 P2 .skilled/skills/system-deep-loop/runtime/tests/unit/README.md:19 The line this diff rewrote adds a semicolon. sk-create-readme section 8 Human Voice Rules says 'No semicolons', and its pre-publish checks require 'HVR passes'. The base version of this README had 0 H
  fix: It is not the complete direct-file inventory; list the folder for every test file. -> It is not the complete direct-file inventory. List the folder for every test file.
- [ ] A1-1 P1 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:739 closeNode guards only pruned-to-live moves and keeps 'active' in CLOSE_STATUSES, so a node closed as exhausted, answered, blocked or abstained can be revived as active, despite its docstring promise t
- [ ] A2-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:1 The diff changes the file mode from 100755 to 100644 while the script keeps its '#!/usr/bin/env node' shebang. Its CLI siblings query.cjs, status.cjs and loop-lock.cjs stay 100755. Every workflow call
- [ ] A3-1 P2 .skilled/skills/system-deep-loop/runtime/lib/deep-loop/divergent-pivot.ts:471 preflightFailure (line 749) no longer refuses on remaining iterations, yet normalizeConfig still accepts, validates and persists antiConvergence.divergent.minRemainingIterations, and the 'insufficient
- [ ] CRIT-3 P2 .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1 A2-2 reported the 100755 to 100644 mode change on upsert.cjs only. Commit ab7312fe467 made the same change to convergence.cjs, which keeps its '#!/usr/bin/env node' shebang. Its CLI siblings query.cjs
- [ ] C3-2 P2 .skilled/skills/system-deep-loop/changelog/v2.1.7.0.md:20 The entry uses the compact shape (summary, bullet glance list, Upgrade) for 11 changes. changelog-template.md section 5 requires the expanded format at 10 or more changes: a glance table with a Sectio
- [ ] C3-3 P2 .skilled/skills/system-deep-loop/changelog/v2.1.0.0.md:21 Every glance bullet opens with bold text. changelog-template.md section 4 Structure: 'No bold text outside a folded block's summary header. No bold lead-in bullets.' The SKILL.md section 9 structural 
- [ ] C3-4 P2 .skilled/skills/system-deep-loop/changelog/v2.1.1.0.md:21 Every glance bullet opens with bold text, which changelog-template.md section 4 forbids ('No bold lead-in bullets'). Rewrite the bullets as plain sentences, as v2.1.3.0 to v2.1.6.0 do.
- [ ] C3-5 P2 .skilled/skills/system-deep-loop/changelog/v2.1.2.0.md:21 Every glance bullet opens with bold text, which changelog-template.md section 4 forbids ('No bold lead-in bullets'). Rewrite the bullets as plain sentences.
- [ ] C4-2 P2 .skilled/skills/system-deep-loop/changelog/v2.1.7.0.md:28 fanout-run.cjs now exports DEEP_LOOP_COVERAGE_DB_DIR to graph-db/ inside every fan-out lineage (commit d68f9261a5c). Commit d68f9261a5c says this also changes default fan-out runs of both loop types: 

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B1-1 P1 .skilled/skills/system-deep-loop/deep-research/references/convergence/convergence.md:158 This diff rewrote the Quality Gate row, but the row still lists 'no single weak-source dominance' as a rule that must pass. The runtime never evaluates that guard: convergence.cjs:907 hardcodes single
  fix: | Quality Gate | Source diversity, focus alignment, and no single weak-source dominance pass | `CONTINUE` with `qualityG -> | Quality Gate | Source diversity and focus alignment pass; the reserved single-weak-source entry reports `notEvaluated`
- [ ] B1-2 P2 .skilled/skills/system-deep-loop/deep-research/README.md:123 This diff rewrote the line, but it still says the legal-stop gates check 'that one weak source does not carry a finding'. That guard is hardcoded notEvaluated (convergence.cjs:907), and quality-guards
  fix: that sources are diverse and that one weak source does not carry a finding. -> that sources are diverse and that answered questions stay within the key questions.
- [ ] B1-3 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:213 Rule 12 says the 'no single-weak-source' check must pass before STOP. The shipped guard is never evaluated (convergence.cjs:907) and always counts as passed. SKILL.md therefore describes a check that 
  fix: Source diversity, focus alignment, and no single-weak-source checks must pass before STOP can trigger -> Source diversity and focus alignment checks must pass before STOP can trigger; the reserved single-weak-source entry rep
- [ ] B1-4 P2 .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:135 The quick reference loads first on every invocation. It lists no-single-weak-source as a quality guard that must pass, but the runtime reports that guard as notEvaluated (convergence.cjs:907). This co
  fix: Quality guards (source diversity, focus alignment, no single-weak-source) must pass before STOP. -> Quality guards (source diversity, focus alignment) must pass before STOP; the reserved single-weak-source entry reports 
- [ ] A2-1 P1 .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2664 On an expansive research run, a frontier node closed as exhausted with reason budget makes its question resolved (line 2684). The write-back then marks it '- [x]' in the strategy key questions, lists 
- [ ] B1-5 P2 .skilled/skills/system-deep-loop/deep-research/references/state/state-format.md:83 reduce-state.cjs now writes a per-question `frontierStatus` field into findings-registry.json (lines 1422 and 2706) when a frontier node closes a question. When the question has no iteration evidence,

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] C2-1 P1 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:129 The entry fails the changelog shape gate. One bullet holds a 24-word sentence, over the 22-word ceiling. sk-create-changelog SKILL.md section 9 says an exit 1 from check_changelog_shape.py blocks the 
  fix: - The iteration cap, consecutive failures, stuck recovery, pause, the max-duration stop, the off setting, the max-iterat -> - The iteration cap, consecutive failures, stuck recovery, pause and the max-duration stop still decide first. So do the
- [ ] B2-1 P2 .skilled/skills/system-deep-loop/deep-review/references/convergence/convergence.md:115 The Divergent Pivot Contract gives a closed list of five candidate sources, but the changed divergent-review-pivot.ts now seeds a sixth, 'frontier-unanswered', for each frontier node an expansive run 
  fix: Candidate sources are persisted unswept dimensions, search debt, producer-consumer gaps, negative-test gaps, and traceab -> Candidate sources are persisted unswept dimensions, search debt, producer-consumer gaps, negative-test gaps, traceabilit
- [ ] B2-2 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:120 The release note says a sub-target answers once 'every configured dimension' has evidence. The reducer's per-node universe always starts from the four canonical dimensions and only adds custom names (
  fix: - A sub-target answers once every configured dimension has evidence behind it. -> - A sub-target answers once every dimension in its universe, the four canonical ones plus each custom name, has evidence
- [ ] CRIT-2 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/severity-system/divergent-convergence-mode.md:22 The catalog entry for the divergent review pivot lists five candidate sources. The in-range divergent-review-pivot.ts adds a sixth, 'frontier-unanswered' (line 325), which an expansive run seeds for e
  fix: Candidate sources include unswept dimensions, search debt, producer-consumer paths, negative-test gaps, and traceability -> Candidate sources include unswept dimensions, search debt, producer-consumer paths, negative-test gaps, traceability gap
- [ ] C2-2 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:100 An Oxford comma sits in a three-item series (caps..., caps..., and caps...). SKILL.md section 8 rule 5 bans Oxford commas. hvr_scan flags it as a candidate. The other candidates it flags (lines 58, 63
  fix: - Fan-out caps each parent at six children, caps the root at eight on a review, and caps the total count. -> - Fan-out caps each parent at six children, caps the root at eight on a review and caps the total count.
- [ ] C2-3 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:179 The How It Was Checked table says the review command reference holds 1 --depth-mode match, the flag row. Commit 0c6b0c6a900 later added the setup line review.md:41, so the command the entry names (lin
  fix: | Count of `--depth-mode` in the review command reference | 0 matches at the baseline commit | 1 match, the flag row | -> | Count of `--depth-mode` in the review command reference | 0 matches at the baseline commit | 2 matches, the setup line
- [ ] C2-4 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md:22 The three glance bullets (lines 22-24) open with bold lead-ins. assets/changelog-template.md line 209 says the folded summary header is the one place bold text appears. Line 34 names bold lead-in bull
  fix: - **A review below its floor continues.** A stop candidate below `minIterations` returns `CONTINUE` with reason `minIter -> - A review below its floor continues. A stop candidate below `minIterations` returns `CONTINUE` with reason `minIteratio
- [ ] C2-5 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/state-management/focus-hijack-guard.md:24 The catalog understates the Next Focus rule. Line 24 says an uncovered dimension outranks a leaf nextFocus 'that names no dimension'. Lines 3 and 16, and the index entry feature-catalog.md:352, say th
- [ ] C4-5 P2 .skilled/skills/system-deep-loop/deep-review/README.md:166 The README gives the expansive caps as 'maxDepth 3, maxChildrenPerNode 6' with no exception. But frontier-admit.cjs:61 sets ROOT_CHILDREN_FLOOR = { research: 6, review: 8 }, and readCaps (frontier-adm

### agent:deep-research

- [ ] CRIT-1 P2 .skilled/agents/deep-research.md:181 Cross-lane gap. The agent body says 'The orchestrator flags single-weak-source answers during convergence quality checks.' convergence.cjs:907 hard-codes singleWeakSource to notEvaluated, which counts
  fix: The orchestrator flags single-weak-source answers during convergence quality checks. -> The source diversity guard blocks a stop while an answered question rests on one source.

### unowned

- [x] BAT-01 P2 -:- S5-derived-counts failed (exit 1). [handed off]
- [x] BAT-02 P2 -:- S9-command-references failed (exit 1). [handed off]

### skill:.skilled/skills/system-spec-kit

- [ ] C3-6 P2 .skilled/skills/system-spec-kit/changelog/v2.13.5.0.md:21 Every glance bullet opens with bold text, which changelog-template.md section 4 forbids ('No bold lead-in bullets'). Rewrite the bullets as plain sentences.

## Pre-existing or outside the scope

### unowned

- [x] C4-1 P1 .skilled/changelog/skilled/v4.1.0.0.md:237 No root release-notes entry describes the user-visible capabilities this scope adds: --depth-mode=expansive with its frontier node store (frontier-admit.cjs, the convergence.cjs frontierOpen veto and  (unchanged in range) [handed off]

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B1-6 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/manual-testing-playbook.md:963 The root H2 sections are out of sequence: '## 14. FAN-OUT', then '## 16. INTRA ROUTING RECALL' (963), then '## 15. AUTOMATED TEST CROSS-REFERENCE' (1076), then a second '## 15. FEATURE CATALOG CROSS-R (pre-existing (critic))

### skill:.skilled/skills/system-deep-loop

- [ ] C4-4 P2 .skilled/skills/system-deep-loop/runtime/tests/fixtures/README.md:24 This scope adds the fixture folders golden-research-default/ and golden-review-default/. research-depth-mode-golden.vitest.ts:29 and review-depth-mode-golden.vitest.ts:31 read them, and running with G (unchanged in range)
  fix: ├── event-envelope-producers.ts └── ... -> fixtures/ ├── authorized-ledger-fixtures.ts ├── authorized-ledger-test-helper.ts ├── authorized-ledger-worker.ts ├── eve

