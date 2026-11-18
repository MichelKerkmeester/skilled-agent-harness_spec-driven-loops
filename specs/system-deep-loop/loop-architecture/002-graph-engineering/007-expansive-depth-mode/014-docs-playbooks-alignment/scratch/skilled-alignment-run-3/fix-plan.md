# Fix plan

Target: HEAD; head: 65eb3c029d0c2c0a29dcfcc0039d7343692c2d83

## In scope

### skill:.skilled/skills/system-deep-loop

- [ ] D-02 P1 .skilled/skills/system-deep-loop/hub-router.json:32 Stage two cannot resolve the feature's vocabulary. `vocabularyClasses` has no expansive-depth or frontier phrase, so `compiled-route --hub system-deep-loop` returns `defer` for a research-specific fea
- [ ] D-01 P1 .skilled/skills/system-deep-loop/mode-registry.json:48 The new expansive-depth frontier has no advisor reach. Probes authored from the feature before reading advisor metadata (probes-pre-metadata.md #2 and #5) fail: 'Investigate iteratively why the parser
- [ ] C-01 P2 .skilled/skills/system-deep-loop/changelog/v2.1.0.0.md:25 The entry fails the shape gate that sk-create-changelog section 9 requires before writing: line 25 holds a 23-word sentence over the 22-word ceiling, and the entry averages 10.1 words a sentence again
- [ ] C-02 P2 .skilled/skills/system-deep-loop/changelog/v2.1.1.0.md:15 The entry fails the shape gate: its prose averages 10.5 words a sentence against the 10-word ceiling in sk-create-changelog section 9. Shorten the opening paragraph and the glance bullets until the ga

### root:README.md

- [ ] C-05 P2 README.md:253 The root README section that covers the deep loops does not reflect the capabilities this scope added. It describes the loops, their stop rules and their fan-out, but names none of `--depth-mode=expan

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] C-03 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.15.16.0.md:16 The entry fails the shape gate: its prose averages 11.1 words a sentence against the 10-word ceiling in sk-create-changelog section 9. The opening paragraph at line 16 is the longest, so split it and 

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] C-04 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.11.18.0.md:16 The entry fails the shape gate: line 16 holds a 23-word sentence over the 22-word ceiling, and the entry averages 12.1 words a sentence against a ceiling of 10. Split the opening paragraph and shorten

### unowned

- [ ] BAT-01 P2 -:- S9-command-references failed (exit 1).

### command:deep

- [ ] D-03 P2 .skilled/commands/deep/assets/compiled/deep-research.contract.markdown:162 The new `depth_mode` flag is described in the PRE-BOUND schema (line 190) and the Default Resolution Table (line 215), but the `:auto` Tier-1 persist shape at line 162 still lists `antiConvergence.con

## Pre-existing or outside the scope

### unowned

- [ ] D-04 P2 .skilled/commands/scripts/validate-command-references.cjs:131 The S9-command-references battery row fails on a runtime data path, not on a broken deep command reference. `.skilled/commands/speckit/assets/speckit-resume.yaml:104` names `.skilled/skills/system-spe (unchanged in range)

