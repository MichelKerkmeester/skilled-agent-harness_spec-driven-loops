# Iteration 001 — Re-verify: Comment-Hygiene Violations (Round-1 F-002)

**Focus:** Re-grep the live YAML files for ephemeral finding-ID markers. Round 1 found 6.
**Angle:** Re-verification against current files (state may have moved).

## Findings

Re-grep of `.opencode/commands/deep/assets/*.yaml` for the `F-\d+-[A-Z]\d+-\d+` / `<!-- F-` pattern returns **6 live matches, identical line numbers to round 1**:

- `deep_research_auto.yaml:301` — `# <!-- F-010-B5-04 -->`
- `deep_research_auto.yaml:319` — `# <!-- F-010-B5-04 -->`
- `deep_research_auto.yaml:1099` — `# <!-- F-010-B5-02 -->`
- `deep_review_auto.yaml:395` — `# <!-- F-010-B5-04 -->`
- `deep_review_auto.yaml:408` — `# <!-- F-010-B5-04 -->`
- `deep_review_auto.yaml:988` — `# <!-- F-010-B5-03 -->`

**Verdict: STILL LIVE — unfixed since round 1.** Notably, 009/003-runtime-hygiene-fixes was scaffolded to address this (phase-map lists it "Not Started") but has not shipped. The 009 phase acknowledges comment-hygiene cleanup as Tier 0 child 003 scope but it remains unimplemented.

## Evidence
[SOURCE: deep_research_auto.yaml:301,319,1099]
[SOURCE: deep_review_auto.yaml:395,408,988]

## Ruled Out
Not fixed by 009/001 (which only touched fanout-merge.cjs). Not fixed by 009/002 (timeout, not started). Only 009/003 covers it and it is Not Started.

## newInfoRatio: 0.6 (re-confirmed live, but no new markers beyond the 6; novelty = verified persistence + identified which 009 child owns the fix)
