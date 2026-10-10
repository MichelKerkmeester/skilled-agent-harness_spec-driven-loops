# Iteration 006 — Correctness: sk-code-review checkers and rule canary

BINDING: target=Commits ba56b03412..5d9c970447 on main: the 37 commits of the sk-code Ponytail refinement epic, the merge 144b1d339e, then 9a74576ccc and 5d9c970447
BINDING: maxIterations=10
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness
BINDING: specFolder=specs/sk-code/011-sk-code-poinytail-based-refinement/012-post-merge-deep-review

## Dimension

correctness — sk-code-review checkers and rule canary: 637eeaeb2e, da9ded3b36, 26df6c4a8a, 4dab32444c, 3cf65c519e, eda0cb91e4. Ran check-rule-copies.js and its test from the real tree, read all three checker scripts, ran the hub canary suite live, and confirmed the known jev-transport-single defer.

## Files Reviewed

| File | What was checked | Result |
|------|------------------|--------|
| .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:1 | full source read; real-tree run; pin set vs the standards document | run exit 0; missing-string list is narrower than the rule it protects (R6-COR-002) |
| .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.test.sh:1 | executed from the repo root | 19/19 cases PASS, exit 0 |
| .skilled/skills/sk-code/sk-code-review/scripts/check-review-final-line.js:1 | source read of the final-line contract; fixture cases | no gap inside the documented contract |
| .skilled/skills/sk-code/sk-code-review/scripts/check-review-findings.js:1 | source read of numbering and Case-line checks; fixture cases | no gap inside the documented contract |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json:201 | fixture expectation for jev-transport-single | expects route/single/cli-jev; live router defers (R6-COR-001) |
| .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:52 | the defer return path | action defer with recovery [clarify, defer] |
| .skilled/bin/tests/compiled-route-admission.test.cjs:241 | live corpus pin | re-run: 86 !== 80, 28/29 tests pass, exit 1 (R3-COR-001 stays active) |
| .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:54 | the never-cuts sentence and section 3 P0 list | 8 P0 labels; 4 pinned (R6-COR-002) |
| specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/implementation-summary.md:123 | epic record of the jev red | documents it as a Known Limitation and baseline failure |

## Findings by Severity

### P0

None.

### P1

None.

### P2

1. **R6-COR-001 — The 004 hub canary jev-transport-single is red on main: the compiled router defers while the fixture expects a cli-jev single route** — .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json:201 — the fixture expects expectedAction 'route', expectedSelectionKind 'single' and expectedModes ['cli-jev'] for the prompt 'use jev choice to pick a queue' [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json:201], but the live front door answers action 'defer' with selectionKind null and an empty targets list, and the hub canary suite prints 'FAIL 004-cli-external-orchestration jev-transport-single defer - ' with 'all hubs failures 1' and exit 1. Reproduce: node specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/scratch/all-canaries.cjs (exit 1) and node .skilled/bin/compiled-route.cjs --hub cli-external-orchestration --prompt 'use jev choice to pick a queue' [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:52]. The epic's own phase 003 records it as a Known Limitation: 'The 004-cli-external-orchestration jev-transport-single canary still fails. It failed at baseline and is not an sk-code file.' [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/implementation-summary.md:123]. Provenance bounds it: git log -S 'jev-transport-single' over the fixture points to 01829ed9e4, which is not in ba56b03412..5d9c970447, so the case predates the reviewed range. The runner carries no expected-failure marker, so a consumer must grep the line out by hand (the phase goal does exactly that).
   Case: a consumer runs the 004 hub canary suite on main and reads 'all hubs failures 1'; the single failure is a known pre-existing defer, but nothing in the output marks it expected, so signal and pre-existing noise are indistinguishable.
   Finding class: instance-only (one fixture case).
   Scope proof: git log -S provenance over the fixture path (01829ed9e4, outside the range) plus a search of all-canaries consumers (only specs/sk-code/011-.../011-round-four-remediation/008-session-aware-tie-break/scratch/mirror-setup.sh references it).
   Affected surface hints: ['004-cli-external-orchestration canary fixture', 'compiled-route router defer path', 'all-canaries runner output'].
   Recommendation: fix the cli-jev transport detection or update the fixture to expect the defer; until then mark the case expected in the runner so the suite can go green without a hand-written grep.
   Claim adjudication:

   {
     "type": "correctness",
     "claim": "The 004-cli-external-orchestration canary case jev-transport-single is red at HEAD: the compiled router returns action 'defer' for the fixture prompt while the fixture expects route/single/cli-jev.",
     "evidenceRefs": [".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/fixtures/canary-cases.v1.json:201", ".skilled/bin/lib/compiled-routing/009-parent-hub-rollout/004-cli-external-orchestration/lib/router.cjs:52", "specs/sk-code/011-sk-code-poinytail-based-refinement/011-round-four-remediation/003-hub-surface-precedence/implementation-summary.md:123"],
     "counterevidenceSought": "Searched for an expected-failure marker or a tolerant consumer (only a phase scratch script references all-canaries; the phase goal greps the line out by hand); checked fixture provenance with git log -S.",
     "alternativeExplanation": "The defer is the router's designed graceful outcome for a transport that has never been admitted; the fixture may be intentionally aspirational.",
     "finalSeverity": "P2",
     "confidence": 0.95,
     "downgradeTrigger": "The fixture is updated to expect defer, the case is marked expected in the runner, or the cli-jev transport detector is added."
   }

2. **R6-COR-002 — The never-cut pin set in check-rule-copies.js covers four of the eight P0 categories it exists to protect** — .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:83 — the standards-document invariant pins '**Input validation**', '**No silent failures**', '**No hardcoded secrets**' and '**Accessibility**' plus the phrases 'never cuts a P0 item' and 'anything the user asked for' [SOURCE: .skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:83], while section 3 defines eight P0 categories [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:78] through [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:85], and the pinned sentence itself says restraint never cuts a P0 item in section 3 [SOURCE: .skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:54]. The four unpinned labels — Initialization safety, No commented-out code, Naming convention adherence, No ephemeral-artifact pointers in comments — cannot fail the canary: grep -c for each against check-rule-copies.js returns 0 (the strings do not occur in the checker).
   Case: an editor rewords or deletes '**No commented-out code**' (or any of the other three unpinned labels) in section 3; check-rule-copies.js still exits 0, so the standard the restraint ladder may never cut has silently shrunk.
   Finding class: class-of-bug (any of the four unpinned labels can be dropped the same way).
   Scope proof: direct read of section 3's eight labels and of the canary's six pinned strings, plus the grep counts of 0 for each unpinned label in the checker.
   Affected surface hints: ['check-rule-copies.js EXACT_INVARIANTS', 'code-quality-standards.md section 3 P0 categories', 'check-rule-copies.test.sh tamper cases'].
   Recommendation: extend the pin list to all eight section 3 labels, or state in the canary comment that only the four named examples are protected.
   Claim adjudication:

   {
     "type": "correctness",
     "claim": "check-rule-copies.js pins four of the eight section 3 P0 labels; the other four can be reworded or deleted while the canary still exits 0, although the pinned sentence says restraint never cuts a P0 item in section 3.",
     "evidenceRefs": [".skilled/skills/sk-code/sk-code-review/scripts/check-rule-copies.js:83", ".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:54", ".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:78", ".skilled/skills/sk-code/shared/references/universal/code-quality-standards.md:85"],
     "counterevidenceSought": "Checked whether the four unpinned labels are asserted anywhere in the canary or its test (grep count 0 each); considered that the two pinned phrases may be the intended minimal scope.",
     "alternativeExplanation": "The pin deliberately covers only the four items named in the line-54 examples plus the two phrases; the other section 3 items are protected by other checks or editors.",
     "finalSeverity": "P2",
     "confidence": 0.85,
     "downgradeTrigger": "A note in the canary or the standards document declaring the pin intentionally covers only the four named examples."
   }

## Confirmed-Clean Surfaces

- check-rule-copies.js at HEAD: OK line and exit 0 — 'all rule invariants present (7 exact-string file(s) + 2 Iron Law file(s) + 21 delivery-prefix anchor(s) + 2 example output(s))'.
- check-rule-copies.test.sh at HEAD: 'All rule-canary test cases passed', exit 0, 19 named PASS cases including the final-line, findings, vocabulary-drift, floor-label and example-tamper shapes.
- check-review-final-line.js and check-review-findings.js: direct source read; the documented contract (exact status line, one blank line, one Not checked line, skip-status whole-output, numbering across severity groups, Case lines) is implemented as documented and covered by the fixture cases.
- Hub canary suite: 001-sk-code 18/0, 002-system-deep-loop 9/0, 003-mcp-tooling 14/0, 007-sk-doc 22/0, 008-cli-classifier 8/0, 009-sk-design 8/0; the single failure is the pre-existing R6-COR-001.

## Active-Finding Recheck

- R3-COR-001 (admission pin) re-run live at HEAD: 28/29 pass, the one failure is 'Expected values to be strictly equal: 86 !== 80' at compiled-route-admission.test.cjs:241 (exit 1). Remains active; no new finding raised.
- All eight prior open findings remain P2; none reopened.

## Traceability Checks

- Core spec_code: partial — the phase 003 record for this slice confirms the jev Known Limitation against the live runner; the phase 010/011 spec-vs-code walk remains iteration 8's scope.
- Core checklist_evidence: not exercised this iteration.
- Overlay (skill_agent, agent_cross_runtime, feature_catalog_code, playbook_capability): not exercised this iteration.

## Edge Cases

1. Scope boundary: the 004 fixture and compiled-route-admission.test.cjs are not lines in review/scope-files.txt (275 files), but the orchestrator-assigned focus names 'the hub canaries' and the jev case explicitly; both are reported as directed focus evidence, not as scope-broadened findings.
2. Environment: 'timeout' does not exist on macOS; the first admission attempt exited 127 without running the suite. The rerun without it is the evidence recorded.
3. Delivery-prefix headroom: '#### Blast-Radius Management' ends at byte 16341 against the 16384-byte cut (43 bytes). The canary enforces this by design; recorded as a tight-boundary observation, not a finding.
4. Pre-existing vs epic-introduced: the jev red predates the reviewed range (R6-COR-001 scope proof); the admission pin (R3-COR-001) is the separately registered active red.

## Ruled Out

- Review-output checker contract holes (final-line, findings, rule-copies): no hole found inside the documented contract; the suites pass 19/19 and the source read matched the README contract.
- 'This epic introduced the jev canary red': refuted by fixture provenance (01829ed9e4 outside ba56b03412..5d9c970447) and the phase 003 Known Limitation.

## Verdict

Two new P2 findings; no P0 or P1 raised, and no prior P0/P1 is active. Verdict: PASS with advisories.

## Next Focus

Dimension: maintainability. Focus area: sk-code-opencode drift guards and doc-claim checks (817ff5b2a7, d2701afc3b, e9ecf8bb5f, 07189a66f8, 0da902346a) per the iteration focus plan row 7. Known item to confirm or refute: manifest tests 26 pass 16 fail (cli-classifier closure, fixed-routing count 7 vs 6).

Review verdict: PASS
