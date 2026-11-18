# Fix plan

Target: HEAD; head: a2382a3f063312cd0534aa8b858212bf5a0c6d34

## In scope

### skill:.skilled/skills/system-deep-loop

- [ ] B-3 P2 .skilled/skills/system-deep-loop/feature-catalog/deep-loop-mode-classification/depth-mode-flag.md:16 The hub entry gives one defaulted-budget formula, min(24, max(loop default, 2 x c x (S + maxDepth - 1))) with c for review = the four canonical dimensions plus any custom name, and the next sentence a
  fix: with c 1 for research and, for review, the four canonical dimensions plus any custom name, each counted once. A run or f -> with c 1 for research and, for review, the four canonical dimensions plus any custom name, each counted once. A fan-out 
- [ ] X-2 P2 .skilled/skills/system-deep-loop/runtime/scripts/README.md:48 This scope adds a new CLI entry point, runtime/scripts/frontier-admit.cjs, which seeds, admits, prunes and closes nodes in the frontier node store. The Files table in the scripts folder README has no 
  fix: | `fanout-salvage.cjs` | Recovers missing iteration artifacts from captured subprocess output. | -> | `fanout-salvage.cjs` | Recovers missing iteration artifacts from captured subprocess output. | | `frontier-admit.cjs` 
- [ ] A-1 P1 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:407 The review target containment check compares scope paths against the raw reviewTarget text. A files target written as a glob is in contract: deep-review.yaml lines 793-797 say 'Expand glob patterns fr
- [ ] B-2 P2 .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/upsert-script.md:35 This is an omission, not a false statement. Commit cec5a403eb3 changed how upsert.cjs maps a reused review finding id. The iteration's own derived findings now register in knownFindings before the sto

### unowned

- [x] X-1 P2 .skilled/commands/assets/local-skilled-alignment/resolve-scope.cjs:90 The scope was built in the default first-parent mode, which keeps only first-parent, non-merge commits so that changes from merging the base back in stay out. On this branch every one of the 17 first- [handed off]
- [x] BAT-01 P2 -:- S5-derived-counts failed (exit 1). [handed off]
- [x] BAT-02 P2 -:- S9-command-references failed (exit 1). [handed off]
- [x] X-3 P2 .skilled/commands/speckit/assets/speckit-resume.yaml:104 No lane explains the S9-command-references battery failure. It is pre-existing and a checker false positive, not a gap in this scope. speckit-resume.yaml did not change in range, and line 104 names th [handed off]

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] B-4 P2 .skilled/skills/system-deep-loop/deep-review/SKILL.md:238 sk-create-skill ALWAYS rule 5 says to keep SKILL.md within the Size Limits table (3000 recommended words), and rule 6 says to move long guidance into references/. The deep-review SKILL.md was already 

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] B-5 P2 .skilled/skills/system-deep-loop/deep-research/SKILL.md:93 The deep-research SKILL.md went over the 3000-word recommended limit during this program: 2613 words at base 21c4b325b5a, 3059 now by the packager's count, which now warns. That breaks ALWAYS rules 5 

## Pre-existing or outside the scope

### skill:.skilled/skills/system-deep-loop

- [ ] B-1 P2 .skilled/skills/system-deep-loop/runtime/manual-testing-playbook/script-entry-points/upsert-script.md:15 Triggered by the S4 scope file runtime/scripts/upsert.cjs. This program added a review finding evidence capability to upsert.cjs: the --state-log, --delta-dir and --iteration inputs, deriveReviewFindi (unchanged in range)

### skill:.skilled/skills/system-skill-advisor

- [x] C-1 P2 .skilled/skills/system-skill-advisor/README.md:141 Battery S5-derived-counts fails on this line. The cause is a checker limit, not a wrong claim: 'its two sidecar files under runtime/database/' is a true count (skill-graph.sqlite-shm and skill-graph.s (pre-existing (critic)) [handed off]
  fix: delete the `skill-graph.sqlite` database and its two sidecar files under `runtime/database/` -> delete the `skill-graph.sqlite` database and its `-shm` and `-wal` sidecar files under `runtime/database/`

### unowned

- [x] C-2 P2 .skilled/changelog/skilled/v4.1.0.0.md:237 The newest root release notes do not describe the capabilities this scope adds, which the lens requires. The Deep Loop section never names --depth-mode=expansive, --extend=N or --extend-minutes, the r (unchanged in range) [handed off]

