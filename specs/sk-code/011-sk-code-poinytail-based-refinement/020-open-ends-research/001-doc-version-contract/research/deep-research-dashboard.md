---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Why does node .skilled/skills/sk-doc/scripts/frontmatter-version.mjs verify --skill <name> exit 1 on every skill it checks (rule, derivation, or missing enforcement), what should a per-doc version mean for an external author, what is the smallest doc-version contract that stays green by construction, and should the per-doc version exist at all
- Started: 2026-10-11T16:23:33.000Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-001-doc-version-contract-2026-10-11T16:23:33.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1: Why does verify fail: the rule, the derivation, or the fact that nothing enforces it? | doc-version-contract | 1.00 | 7 | complete |
| 2 | Q5: Which hooks, generators or CI steps write or check a doc version today, if any? | doc-version-enforcement | 0.93 | 6 | complete |
| 3 | Q5 consolidation: source-verify the package-time validator leg, test whether any hook/workflow invokes the validators, correct the duplicate-engine claim, and close the version-writer/checker inventory | doc-version-enforcement | 0.60 | 5 | complete |
| 4 | Q5 consolidation pass 2: source-verify the CI wiring of the frontmatter coverage guard and the sk-doc script-test workflow (which invokes the engine in gate/apply), re-verify that no automated surface runs verify/apply, and close the Q5 inventory with both CI legs cited | doc-version-enforcement | 0.70 | 5 | complete |
| 5 | Q3: What is the smallest contract that stays green by construction? (dispatch Q5 focus text is the stale iteration-1 carry note; Q5 answered and re-run blocked; Q2/Q4 deferred) | doc-version-contract | 0.60 | 5 | complete |
| 6 | Q4: Should the per-doc version exist at all? | doc-version-contract | 0.85 | 6 | complete |
| 7 | Q2: What should doc versions mean for an external author? | doc-version-contract | 0.96 | 7 | complete |
| 8 | Verify remaining evidence gaps: adversarial execution of the gate-green claim, the hook enforcement wiring, and the packager/engine changelog divergence | consolidation-verification | 0.75 | 6 | complete |
| 9 | Broaden: verify remaining evidence gaps — fleet-wide gate execution, hook entry-point execution, verify breadth on unmeasured skills, and enforced-vs-checked scope consistency | consolidation-broadening | 0.75 | 5 | complete |
| 10 | Broaden: verify remaining evidence gaps - fleet-wide verify breadth (9 previously unmeasured skill dirs), the gate removal precondition, and the final decision-record consolidation | doc-version-contract | 0.85 | 5 | complete |

- iterationsCompleted: 10
- keyFindings: 64
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Why does verify fail: the rule, the derivation, or the fact that nothing enforces it?
- [x] Q2: What should doc versions mean for an external author?
- [x] Q3: What is the smallest contract that stays green by construction?
- [x] Q4: Should the per-doc version exist at all?
- [x] Q5: Which hooks, generators or CI steps write or check a doc version today, if any?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▇▄▂▂▂▂▁▂▄▆▇▇▅▄▄▄▅▅
- score sparkline: █▇▇▄▂▂▂▂▁▂▄▆▇▇▅▄▄▄▅▅
- Last 3 ratios: 0.75 -> 0.75 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"code":37,"other":107}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- "Make `verify` quiet by reconciling the fleet" — explicitly discouraged: the sweep rewrites every in-scope document, buries real changes in noise, and is undone by its own commit [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:135]. Candidate for reducer promotion to Exhausted Approaches; any recommendation that amounts to "run `apply --update` everywhere and commit" is a dead end. (iteration 1)
- "Nothing enforces it" as an accidental oversight — the gate/verify separation and the "What nothing enforces" section are explicit in the standard, so this is a stated boundary, not a gap someone forgot. (iteration 1)
- `verify` exit 1 as an engine bug — the engine's comparison matches its documented rule, and the spot-check arithmetic supports the derivation. (iteration 1)
- The numstat edit counter as silently broken — 28 path-commits resolve to an expected `W=26`, consistent with zero-line/rename commits being discarded as documented. (iteration 1)
- **An automated writer hiding in hooks/CI.** Searched `.github/`, `.skilled/hooks/`, `.opencode/scripts/git-hooks/` for `frontmatter-version`/`check-frontmatter-versions` callers: none exist; every match is documentation, tests, or the engine itself. (iteration 2)
- **The CI coverage guard as a version checker.** Its header contract lists five fields and `version` is not among them [SOURCE: .opencode/skills/system-skill-advisor/runtime/scripts/check-skill-doc-frontmatter.sh:7-8]. (iteration 2)
- **The engine's `.mjs` tests as a wired CI check.** The CI harness globs `test_*.py` only; the `.mjs` suite is unreferenced by any workflow. (iteration 2)
- None newly eliminated. The iteration-1 dead ends (fleet reconcile via `apply --update`; "nothing enforces it" as oversight; engine bug; broken numstat counter) all remain outside this focus and were not retried. (iteration 2)
- **Package-time validators as an automated enforcement surface.** Nothing under `.opencode/scripts/git-hooks/`, `.skilled/hooks/` or `.github/workflows/` references `package_skill.py`/`quick_validate.py`; they are command-run only. (iteration 3)
- **The engine pair as two drift-prone copies.** `readlink` resolves `scripts/frontmatter-version.mjs` to `../shared/scripts/frontmatter-version.mjs`; one physical file, one update surface. (iteration 3)
- None newly eliminated. All iteration 1-2 dead ends remain BLOCKED and were not retried. (iteration 3)
- **CI script tests as a doc-version check.** The suite runs the engine against fixtures in gate/apply modes [SOURCE: .opencode/skills/sk-doc/scripts/tests/test_validation_switch.py:183]; it never inspects real repository documents, so it cannot fail on a stored version and does not close the enforcement gap. (iteration 4)
- **Re-running the Q5 inventory as fresh ground.** Iteration 3 already consolidated Q5; this pass's value was adversarial re-verification plus the two uncited CI wiring surfaces. Repeating the inventory itself would add no new evidence. (iteration 4)
- None newly eliminated for the Q5 focus. The iteration-2 `.mjs`-suite claim is refined, not reversed: `test-frontmatter-version.mjs` remains unrun by any workflow, while a sibling Python test does invoke the engine in CI. (iteration 4)
- **Re-running the Q5 inventory as fresh ground.** Q5 was consolidated and adversarially re-verified in iterations 3-4; re-running it is BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:144-147]. (iteration 5)
- **Stored git-derived W with a better reconciliation workflow.** Any commit that changes the file's numstat count makes the stored value stale by definition [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104]; the two-pass amend flow amortizes the ceremony per commit but never removes it [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:106-113]. (iteration 5)
- **Wiring verify into CI to force fleet reconciliation.** Re-enters the explicitly documented fleet-sweep dead end [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136] and adds a pipeline where the smallest contract calls for a deletion. (iteration 5)
- Git-derived precision as a stored invariant: structurally non-convergent. New elimination candidate for the reducer to promote to strategy "Exhausted Approaches". (iteration 5)
- **Enforced per-doc era parity:** would flag 574 docs today; going green requires the fleet-wide sweep the standard explicitly discourages [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136]. (iteration 6)
- **Status-quo retention of the asserted 4-part per-doc version:** non-convergent by construction — writing `W` changes `W` [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:98-104] — and measured today at 713 mismatches, 80.5% era staleness (Actions §3). (iteration 6)
- New elimination candidate for the reducer: **"Retain the per-doc field asserting era parity"** — its measured cost equals the discouraged reconciliation [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:131-136]. (iteration 6)
- None of iterations 1-5's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212]. (iteration 6)
- **An external meaning for `W` or `Z`.** `W` needs repository git history that cannot travel in the package [SOURCE: .skilled/skills/sk-doc/shared/scripts/frontmatter-version.mjs:70-101]; `Z` has no producer or consumer by design [SOURCE: .skilled/skills/sk-doc/sk-create-frontmatter/references/frontmatter-versioning.md:50]. (iteration 7)
- **Re-searching for an in-repo definition of "external author".** Iteration 5's search of sk-doc and system-spec-kit returned no definition [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-005.md:29]; iteration 6 recommended the surface-enumeration path instead [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-006.md:79], and that path closed the question this iteration. (iteration 7)
- No new elimination candidate beyond the two above; the divergence in Finding 3 is a fix-phase item, not a dead end. (iteration 7)
- None of iterations 1-6's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:120-212]. (iteration 7)
- **Re-deriving the 713 / 574 classification.** That measurement belongs to iteration 6's scope and its arithmetic was not challenged by new evidence; the useful new check was the scope denominator (Finding 2), which held. (iteration 8)
- **Treating the changelog divergence as a live failure.** Measured: 68/68 entries versioned (Finding 5); the divergence is a coverage gap for the fix phase, not a current flag. (iteration 8)
- New elimination candidate for the reducer: **"the gate silently stops enforcing after one edit per skill"** — dedupe is per checking row label (`frontmatter:<skillName>`) within a session [SOURCE: .skilled/hooks/post-edit-quality/lib/post-edit-router.cjs:210], but each edit to an in-scope doc recomputes scope, so a regression introduced by a different file in a later edit session still fires on the next such edit. Not a dead end; recorded as an operational caveat for the fix phase. (iteration 8)
- None of iterations 1-7's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:127-258]. (iteration 8)
- **Live edit probe of the post-edit hook.** Would mutate a read-only researched file, outside the research boundary; executing the router-pinned wrapper is the strongest permissible strengthening step. (iteration 9)
- **Re-running gate/verify on the three already-measured skills.** Covered by iteration 8 (gate) and iteration 1 (verify); this pass extended breadth to previously unmeasured skills instead. (iteration 9)
- No new elimination candidate: the underscore-form scope asymmetry is latent (0 instances) and recorded as a fix-phase caveat, not eliminated. (iteration 9)
- None of iterations 1-8's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:128-280]. (iteration 9)
- **A live fixture probe of the FAIL:missing branch** (a scratch skill tree under `/tmp` fed to `gate --skills-root`). Rejected: it would create files outside the allowed-write list; the direct code citation at :408-410 is sufficient and the branch is unambiguous. (iteration 10)
- **Re-running the fleet gate.** Already executed green across 14/14 dirs in iterations 8-9 [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/iterations/iteration-009.md:19]; this pass extended verify breadth instead. (iteration 10)
- No new elimination candidate. The validation-switch escape hatch is an operational caveat, not a dead end. (iteration 10)
- None of iterations 1-9's dead ends were retried; all remain BLOCKED [SOURCE: specs/sk-code/011-sk-code-poinytail-based-refinement/020-open-ends-research/001-doc-version-contract/research/deep-research-strategy.md:131-302]. (iteration 10)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
