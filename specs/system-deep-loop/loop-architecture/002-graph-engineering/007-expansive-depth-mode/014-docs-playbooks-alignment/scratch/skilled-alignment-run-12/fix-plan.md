# Fix plan

Target: HEAD; head: 4a96a5da1e631332db0b02ffcb6452c92a253bf0

## In scope

### unowned

- [ ] BAT-01 P0 -:- S7-skill-graph-freshness failed (exit 1).
- [x] BAT-02 P2 -:- S9-command-references failed (exit 1). [handed off]

### skill:.skilled/skills/system-deep-loop

- [ ] B-1 P1 .skilled/skills/system-deep-loop/runtime/feature-catalog/script-entry-points/frontier-admit-script.md:66 The frontier-admit catalog entry still gives the old review per-node cost: the count of the config's reviewDimensions entries, or four when the list is empty or 'all'. Commit 954345ac43f changed seedB
  fix: For review it is the count of the config's `reviewDimensions` entries, and four when the list is empty or `all`. -> For review it is the dimension count the reducer requires before it marks a node answered: the four canonical dimensions
- [ ] A-1 P1 .skilled/skills/system-deep-loop/runtime/scripts/upsert.cjs:386 When a review iteration reuses a finding id an earlier iteration stored for a different finding (other file and title), deriveReviewFindingEvidence correctly derives a separate node finding:<id>#<iter
- [ ] A-2 P1 .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:355 normalizeTargetPath strips only a leading './' and trailing slashes, and never resolves '..' segments. So scopeInsideReviewTarget (line 406) admits a proposal scoped 'src/app/../../lib/x.ts' under a f
- [ ] D-1 P1 .skilled/skills/system-deep-loop/graph-metadata.json:73 Commit 30ac5b51f95 added five intent_signals to graph-metadata.json at positions 30-34 ("depth-capped frontier", "follow-up question frontier", "frontier of follow-up questions", "review target", "thi

### spec:specs/system-deep-loop/loop-architecture

- [x] E-2 P2 specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/014-docs-playbooks-alignment/scratch/skilled-alignment-run-12/scope.json:1 The scope map was built in first-parent mode, so it leaves out files that reached HEAD through the integration merges. `git diff --name-only <mergeBase> HEAD` lists 228 changed files that scope.json d [handed off]

### skill:.skilled/skills/system-deep-loop/deep-review

- [ ] E-1 P2 .skilled/skills/system-deep-loop/deep-review/assets/review-mode-contract.yaml:508 This change made completed-continue a live review lineage mode. It removed `status: deferred` from that entry in lifecycleModes (lines 201-202, reopened through --extend=N), and deep-review/references
  fix: description: "Ensure lifecycle mode docs and workflow branches agree on the three supported modes: new, resume, and rest -> description: "Ensure lifecycle mode docs and workflow branches agree on the four supported modes: new, resume, restart, 
- [ ] C-3 P2 .skilled/skills/system-deep-loop/deep-review/changelog/v1.13.0.0.md:133 The changelog for the release that ships review expansive depth does not describe the seed-derived default budget. Commits f7d5fb9cbf8 and 954345ac43f changed the defaulted --max-iterations of an expa

### skill:.skilled/skills/system-deep-loop/deep-research

- [ ] C-2 P2 .skilled/skills/system-deep-loop/deep-research/changelog/v1.16.0.0.md:141 The changelog for the release that ships research expansive depth does not describe the seed-derived default budget. Commit f7d5fb9cbf8 ('size a defaulted expansive budget from the seed') changed what

## Pre-existing or outside the scope

### unowned

- [x] C-1 P2 .skilled/changelog/skilled/v4.1.0.0.md:237 The open root release notes do not cover what this scope adds to the deep loops. v4.1.0.0.md is the newest file under .skilled/changelog/skilled/. Its tag sits on main's HEAD, and main keeps adding po (unchanged in range) [handed off]

