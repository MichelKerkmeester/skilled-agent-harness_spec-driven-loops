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
- Topic: How should Skilled's vendored-copy overlay and re-pin support be improved so external repo users like Barter can adopt it? Skilled side (read in /Users/michelkerkmeester/worktrees/public/324-overlay-repin-barter-parity): .skilled/commands/doctor/overlay.md, .skilled/commands/doctor/scripts/overlay-engine.cjs and its tests, .skilled/skills/system-skilled-doctor/ (SKILL.md, README.md, references/overlays.md), .skilled/hooks/overlay-guard/, README.md section 5, doctor install/helper/setup. Barter side (read-only, /Users/michelkerkmeester/MEGA/Development/Skilled/barter/ai-speckit): skilled/barter-overlays/ (README.md runbook, overlay-manifest.json, replay.cjs, sync.cjs, sync-state.json), skilled/.skilled/hooks/overlay-sync/, README.md. Known gaps to verify and extend: Barter has no .skilled-overlays.json so /doctor:overlay status exits 2; with the setting the engine refuses barter-overlays/sk-code/sk-code-frontend/references/barter-design-tokens.md for missing protectedPaths; engine DEFAULT_RUNTIME_FOLDERS omits .dsh; no repin.exclude for .opencode/scripts; no fork-drifted state; no post-repin regenerate steps (dsh skill links, runtime mirrors, hook registrations, trigger index, advisor graph); root-file traps (AGENTS.md, REPO RULES.md); docs only advertise linking. Deliver: ranked engine changes, Barter manifest migration steps, and doc/advertising changes, each with file:line evidence.
- Started: 2026-11-07T21:42:10Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-pi-max-1794087510790-zecq2g
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Skilled-side overlay engine contract (manifest, status, protectedPaths, repin roots) | skilled-engine | 1.00 | 8 | complete |
| 2 | Barter-side reality: barter-overlays manifest, replay/sync forks, state, hooks | barter-migration | 1.00 | 9 | complete |
| 3 | Post-re-pin regeneration coverage: dsh links, runtime mirrors, hook registrations, trigger index, advisor graph | regeneration | 1.00 | 8 | complete |
| 4 | Root-file traps, cross-runtime wiring, and the doc discovery path | adoption-traps | 1.00 | 8 | complete |
| 5 | Ranked engine changes, Barter manifest migration steps, and doc/advertising changes | synthesis | 0.65 | 9 | complete |

- iterationsCompleted: 5
- keyFindings: 42
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Which overlay-engine changes are required so a vendored repo whose overlay folder is `barter-overlays` can run status, apply and repin without an unexplained exit 2 or a whole-run abort on a protected path?
- [x] Q2: What do Barter's `barter-overlays` runbook, `overlay-manifest.json`, `replay.cjs`, `sync.cjs` and `sync-state.json` do that the Skilled engine does not, and what is the concrete migration path onto the engine's manifest and state schema?
- [x] Q3: Which runtime surfaces must be re-pinned or regenerated after a re-pin (dsh skill links, runtime mirrors, hook registrations, trigger index, advisor graph), and how should the engine express them?
- [x] Q4: Which root-file and cross-runtime traps (`AGENTS.md`, `REPO RULES.md`, `.opencode/scripts`, fork-drifted files) must the engine handle before an external repo can adopt it safely?
- [x] Q5: Which documentation and advertising changes are needed so adoption is discoverable and correctly described, and how should all proposed changes be ranked by impact and risk?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███████████████▇▅▄▂▁
- score sparkline: ███████████████▇▅▄▂▁
- Last 3 ratios: 1.00 -> 1.00 -> 0.65
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.65
- coverageBySources: {"code":32,"other":26}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Looking for a "setting file missing" diagnostic: none exists, so an operator sees a manifest-path error instead of a settings error, which explains the confusing exit 2 in the brief. (iteration 1)
- Looking for an engine-level default regeneration list: there is none; the only default is the runtime folder list, which is the `.dsh` gap in finding 4. (iteration 1)
- Reading the engine's usage header as the contract: the header documents exit codes per command but not the `.skilled-overlays.json` fallback or the protected-path throw, and both were only visible in the function bodies (lines 375-379, 1688-1703). (iteration 1)
- Running `overlay-engine.cjs status` against this repo to observe the failure: the engine writes nothing in status mode, but a run would still need the repo's own setting and manifest, and the finding is fully derivable from the branches; the command was not run to keep the write surface clean. (iteration 1)
- Treating the brief's gap list as authoritative: finding 6 directly contradicts it, so the brief was demoted to hypotheses and re-verified item by item. (iteration 1)
- Assuming the manifest would need rewriting from scratch: 130 entries, 19 layout links, 9 regenerate steps and 10 verify steps already match the engine's schema; only `outsideCertificate`, `upstreamSource` and the missing `pin.checkout` reader are engine-side gaps. (iteration 2)
- Looking for `protectedPaths` in Barter's manifest to explain the design-tokens refusal: it is absent everywhere, so the refusal comes from the engine's name heuristic, not from a malformed entry. (iteration 2)
- Searching for a `repin` implementation inside Barter: none, by design; the runbook is the implementation. (iteration 2)
- Treating Barter's scripts as an unrelated bespoke implementation: the shared preamble and function names make that untenable, and it changes the recommendation from "replace Barter's tool" to "upstream its deltas". (iteration 2)
- Assuming the advisor graph can be treated like the others: the rebuild has no read-only freshness mode, so it must be a regenerate step plus a separate report-only gate, and that asymmetry has to be documented rather than papered over. (iteration 3)
- Assuming the engine needs a new regeneration mechanism: three of the five surfaces (dsh links, runtime mirrors, trigger index) are expressible with manifest entries the engine already supports. (iteration 3)
- Looking for an advisor freshness JSON contract: `skill-graph-freshness.cjs` prints a panel, not a `fresh` field, so the `fresh-true` expectation cannot be reused there. (iteration 3)
- Looking for an engine-level "post-repin hook": none; `regenerate` runs inside `applyUnderLock` after the copy, which is the post-repin point, so no new hook is needed. (iteration 3)
- Trusting the repin workflow's stage invariant: the engine's stage branch contradicts it, so the workflow text needs the correction, not just the engine. (iteration 3)
- Expecting `.opencode/scripts` and `.dsh` to be engine features: both are manifest configuration plus defaults, and only the defaults need to change. (iteration 4)
- Expecting the docs to be silent about overlays: root README section 5 and the reference are thorough, so the fix is routing and adoption guidance rather than writing the feature up from scratch. (iteration 4)
- Expecting the engine to need a root-file copy rule: the exclusion is deliberate and correct for a re-pin; the gap is the missing report line and the missing precedence rule, not the exclusion. (iteration 4)
- Looking for a documented precedence between `/doctor:agents-md` and the overlay engine over `AGENTS.md`: none exists. (iteration 4)
- Searching `update.md`, `symlink.md`, `runtime-mirrors.md` and `env.md` for overlay mentions: zero in each, which confirms the discovery gap is route-level rather than a single missing sentence. (iteration 4)
- Adopting Barter's extension allowlist: it trades an explicit per-path declaration for a name heuristic, which is the wrong direction for a secret-file guard. (iteration 5)
- Looking for a single migration document that already covers an existing hand-rolled overlay folder: none exists in the doctor skill or the command docs, which is why D2 is a real deliverable rather than a reorganisation. (iteration 5)
- Looking for a test that would catch a missing `.dsh` default: the engine tests do not enumerate the default list, only the doctor mirror contract does. (iteration 5)
- Prioritising the Barter fork's two extra states above the smaller fixes: they are the most expensive changes and the least blocking, and a repo can adopt the engine without them. (iteration 5)
- Treating the `.dsh` default as a documentation-only change: the repin tests assert exact copy counts, so it is a code + test change with a doc note. (iteration 5)

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
