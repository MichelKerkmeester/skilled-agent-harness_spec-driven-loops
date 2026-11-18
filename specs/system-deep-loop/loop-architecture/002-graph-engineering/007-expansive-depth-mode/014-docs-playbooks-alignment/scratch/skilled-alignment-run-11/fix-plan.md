# Fix plan

Target: HEAD; head: 7177cee3b503016c1ec844fb6f75f3352d177247

## In scope

### skill:.skilled/skills/system-deep-loop

- [x] A-1 P1 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:262 readCaps derives maxFrontierNodes from the configured maxIterations (lines 262-264) while seedBudget derives it from the seed-sized budget (line 323). The comment at line 259 states the two agree; the [rebutted]
- [ ] D-03 P1 .skilled/skills/system-deep-loop/hub-router.json:32 The new feature `--depth-mode=expansive` added no router vocabulary. `hub-router.json` `vocabularyClasses` (line 32) and `graph-metadata.json` `intent_signals` carry no `expansive`, `depth mode`, `fro
- [ ] A-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:475 admitProposals builds the node id from nodes.size + 1. readNodeStore deliberately skips a torn line ('A torn or hand-edited line must not hide the rows after it'), so the map holds fewer entries than 
- [x] B-2 P2 .skilled/skills/system-deep-loop/manual-testing-playbook/manual-testing-playbook.md:217 Section 8 SCENARIO DIRECTORY omits the `write-containment/` category and `WC-001`, so its census reads "Total scenarios: 11 / Categories: 4" while Section 6 CATEGORY INDEX lists 12 scenario IDs across [handed off]

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B-1 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:16 Doubled comma in the OVERVIEW sentence: "...budget and cycle checks, in that order,, and holds a convergence stop while frontier nodes stay open." The stray comma is a typo in a shipped catalog leaf t
  fix: in that order,, and holds -> in that order, and holds
- [x] D-01 P1 .skilled/skills/system-deep-loop/deep-research/SKILL.md:34 The packet advertises eight `Keyword triggers:` terms (lines 30-39) and five are absent from `hub-router.json` `vocabularyClasses.research-aliases`: `autonomous research` (34), `iterative research` (3 [handed off]

### skill:.skilled/skills/system-deep-loop/deep-review

- [x] D-02 P1 .skilled/skills/system-deep-loop/deep-review/SKILL.md:76 The packet advertises twelve trigger terms and six are absent from `hub-router.json` `vocabularyClasses.review-aliases`: `spec folder review`, `quality audit`, `find misalignments`, `verify cross-refe [handed off]
- [ ] B-3 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:806 Section 14 is titled "FEATURE CATALOG CROSS-REFERENCE INDEX" but contains only a scenario index; the file holds zero references to `feature-catalog`, so the deep-review feature catalog (which gained f
- [ ] C-01 P2 .skilled/skills/system-deep-loop/deep-review/README.md:159 The README calls `--depth-mode=expansive` 'the one stop-path change that grows work instead of ending it', but the paragraph two lines above describes the review min-iterations floor, which also holds
- [ ] C-02 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:116 The v1.13.0.0 entry never names the `frontier_drained` stop candidate, the release's new stop path: a drained frontier lets an expansive review stop before its cap. The same release's README, SKILL.md

### unowned

- [ ] PRB-01 P1 -:- Probe P02 "Enable expansive depth mode on this research run" expected system-deep-loop/research; top-1 was cli-external-orchestration.
- [ ] PRB-02 P1 -:- Probe P03 "Seed a depth-capped frontier of follow-up questions for this research run" expected system-deep-loop/research; top-1 was cli-external-orchestration.
- [ ] PRB-03 P1 -:- Probe P05 "Expand the review target into sub-targets to depth 3" expected system-deep-loop/review; top-1 was sk-code/sk-code-review.
- [x] E-1 P2 .skilled/changelog/skilled/v4.1.0.0.md:25 The scope adds four user-visible capabilities -- `--depth-mode=expansive`, `--extend=N` with `--extend-minutes=M`, custom review dimensions and the review min-iterations floor -- and no root release-n [handed off]
- [x] BAT-01 P2 -:- S9-command-references failed (exit 1). [handed off]

### command:deep

- [ ] D-04 P2 .skilled/commands/deep/assets/deep-research-presentation.txt:70 The `maxIterations` row of the Default Resolution Table reads `with S the depth-1 nodes the seed admitted and c 1`, which is a truncated clause. The research budget formula is `2 * perNode * nodes` wi
  fix: with S the depth-1 nodes the seed admitted and c 1; any other source is kept as given -> with S the depth-1 nodes the seed admitted and c = 1; any other source is kept as given

## Pre-existing or outside the scope

