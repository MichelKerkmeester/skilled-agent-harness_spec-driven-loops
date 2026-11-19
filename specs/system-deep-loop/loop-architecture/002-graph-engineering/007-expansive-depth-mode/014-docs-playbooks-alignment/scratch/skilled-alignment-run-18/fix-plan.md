# Fix plan

Target: HEAD; head: 32fec82b0e461fc0094cd4524db4a87636a61649

## In scope

### unowned

- [ ] X-1 P1 .vibe/agents/deep-review.toml:4 The Vibe agent profiles are stale against their canonical sources. HEAD commit 32fec82b0e4 added the sentence 'Keep the question and each scope entry within 500 characters on one line, because admissi
- [x] BAT-01 P2 -:- S5-derived-counts failed (exit 1). [handed off]
- [x] BAT-02 P2 -:- S9-command-references failed (exit 1). [handed off]

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] B2-4 P2 .skilled/skills/system-deep-loop/deep-review/references/protocol/quick-reference.md:101 The quick-reference artifact table adds frontier-nodes.jsonl but omits frontier-seed.json, the second file an expansive run writes. README.md, state-format.md and state-outputs.md all list both files,
  fix: | Frontier | `review/frontier-nodes.jsonl` | JSONL | Expansive node store (only under `--depth-mode=expansive`) | -> | Frontier | `review/frontier-nodes.jsonl` | JSONL | Expansive node store (only under `--depth-mode=expansive`) | | Fron
- [ ] B2-2 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/manual-testing-playbook.md:615 The root index summary for DRV-081 repeats the stale count of four review pivot cases. The suite has five (see B2-1).
  fix: Expected signals: The four review pivot cases pass, -> Expected signals: The five review pivot cases pass,
- [ ] B2-3 P2 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:59 DRV-076 says command 1 prints two lines. The command now prints three, because review.md's argument-hint (line 3) also names --depth-mode. The Pass rule does not depend on the count, so the verdict is
  fix: Command 1 prints two lines: the preflight `depth_mode` binding note and the flag row. -> Command 1 prints three lines: the argument hint, the preflight `depth_mode` binding note and the flag row.
- [ ] B2-1 P1 .skilled/skills/system-deep-loop/deep-review/manual-testing-playbook/convergence-and-recovery/review-pivot-gates-on-terminal-frontier.md:56 DRV-081 is pinned to a superseded test count. Command 1's filter now matches 5 cases, because the suite added 'still rejects a frontier seed whose free-text scope asks for a change' (it covers the new
- [ ] B4-1 P2 .skilled/skills/system-deep-loop/deep-review/feature-catalog/loop-lifecycle/expansive-depth-mode.md:30 The review reducer (runtime/scripts/reduce-state.cjs:33 FRONTIER_FAILED_STATUSES, reviewFrontierVisits at ~1953) now counts only evidence-bearing attempts as frontier visits: an iteration record with 
- [ ] C2-1 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:158 The Completed Runs section and the Upgrade Notes (line 249) say --extend=N takes N more iterations, but leave out the catch that README.md line 143, quick-reference.md and loop-protocol.md all state: 
- [ ] C2-2 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.12.0.0.md:30 The Upgrade line tells readers to add a custom name to review_dimensions, but does not say custom dimensions apply to single-executor runs only. A fan-out run binds review_dimensions: all in every lin

### skill:.skilled/skills/system-deep-loop

- [ ] B3-1 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/manual-testing-playbook.md:39 The overview says DLR-060 to DLR-066 map to catalog entries that carry no F-number, but DLR-066 maps to feature-catalog/fanout/fanout-run.md, which the same playbook's cross-reference table labels F02
  fix: DLR-060 to DLR-066 map to catalog entries that carry no F-number. -> DLR-060 to DLR-065 map to catalog entries that carry no F-number, and DLR-066 maps to F025.
- [ ] C4-3 P2 .skilled/skills/system-deep-loop/runtime/scripts/README.md:51 The new frontier-admit.cjs row lists seed, admit, prune and close, but the CLI ships six commands. graph (projects the store to graph events), block (renders the FRONTIER prompt block) and budget (wri
  fix: | `frontier-admit.cjs` | Seeds, admits, prunes and closes nodes in the append-only frontier node store of an expansive r -> | `frontier-admit.cjs` | Seeds, admits, prunes and closes nodes in the append-only frontier node store of an expansive r
- [ ] A1-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:508 isRevisionRangeToken reads any token with '..' between two non-dot, non-slash characters as a git revision range, so a file-list review target whose path holds '..' inside a name (for example docs/not
- [ ] A2-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1240 deriveDimension now walks the configured custom dimension names (buildDimensionUniverse) with a bare substring test over free text (iteration focus + finding title + description). A short custom name 
- [ ] A3-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:380 writeLineageFrontierStore writes frontier-nodes.jsonl first and uses its existence as the 'already seeded' marker, then appends the research inbox in a second call. If the inbox append throws (ENOSPC,
- [ ] C3-1 P2 .skilled/skills/system-deep-loop/README.md:86 The hub README gained a sentence on --depth-mode=expansive but says nothing about the other capability this scope added to both loops: --extend=N / --extend-minutes=M, which reopen a finished single-e
- [ ] C4-1 P2 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:265 A behavior change that hits default runs is in no changelog. The review graph upsert now adds one FINDING node and one EVIDENCE_FOR edge for each finding that has a path:line ref (deriveReviewFindingE

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B1-2 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:169 The SKILL.md state-file list names three expansive-run files but leaves out research/frontier-graph-events.json. That file is written on every expansive iteration by step_frontier_graph_upsert, and RE
  fix: plus `frontier-nodes.jsonl`, `frontier-seed.json` and `frontier-focus.txt` on an expansive run. -> plus `frontier-nodes.jsonl`, `frontier-seed.json`, `frontier-focus.txt` and `frontier-graph-events.json` on an expansive
- [ ] B1-3 P2 .skilled/skills/system-deep-loop/deep-research/references/guides/quick-reference.md:109 The quick-reference state-file table adds Frontier, Frontier seed and Frontier focus rows but no row for research/frontier-graph-events.json, which every expansive iteration writes. This is the same g
  fix: | Frontier focus | `research/frontier-focus.txt` | Text | One-line focus the block step reads before each expansive disp -> | Frontier focus | `research/frontier-focus.txt` | Text | One-line focus the block step reads before each expansive disp
- [ ] B1-1 P2 .skilled/skills/system-deep-loop/deep-research/manual-testing-playbook/entry-points-and-modes/expansive-depth-flag-and-default-identity.md:59 DR-068 Expected says Command 1 (rg -n -- '--depth-mode' .skilled/commands/deep/research.md) prints two lines, but it prints three. The same diff added [--depth-mode=default|expansive] to the command's
  fix: Command 1 prints two lines: the preflight `depth_mode` binding note and the flag row. -> Command 1 prints three lines: the argument-hint, the preflight `depth_mode` binding note and the flag row.
- [ ] C1-4 P2 .skilled/skills/system-deep-loop/deep-research/README.md:211 The README FAQ describes --extend=N without its single-executor limit. deep-research.yaml step_reject_extend_with_fanout (line 331) refuses --extend on a fan-out config. The root README (line 255), qu
  fix: snapshots the prior synthesis and appends an `extended` event. -> snapshots the prior synthesis and appends an `extended` event. A fan-out config refuses it, because `--extend` extends a
- [ ] X-2 P2 .skilled/skills/system-deep-loop/deep-research/feature-catalog/convergence/expansive-depth-mode.md:42 This is the research-side counterpart of B4-1, which covered only the review entry. The range adds FRONTIER_FAILED_STATUSES to deep-research/scripts/reduce-state.cjs (line 2486, absent at base 21c4b32

## Pre-existing or outside the scope

### skill:.skilled/skills/system-deep-loop

- [ ] B3-2 P2 .skilled/skills/system-deep-loop/runtime/tests/fixtures/README.md:24 This diff adds two fixture folders, golden-research-default/ and golden-review-default/. They hold the byte-for-byte default-run baselines that research-depth-mode-golden.vitest.ts and review-depth-mo (unchanged in range)

### unowned

- [x] C4-2 P2 .skilled/changelog/skilled/v4.1.0.0.md:237 No open root release note describes what this scope adds. The newest root entry is v4.1.0.0, and a v4.1.0.0 tag already exists that is not an ancestor of HEAD. Under sk-create-changelog SKILL.md secti (unchanged in range) [handed off]

