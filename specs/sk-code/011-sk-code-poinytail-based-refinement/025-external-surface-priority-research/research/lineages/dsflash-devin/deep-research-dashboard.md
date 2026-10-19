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
- Topic: How should Skilled treat the sk-code surfaces for external repository users? The v4.0.0.4 release note entry "One Surface Order Everywhere" (.skilled/changelog/skilled/v4.0.0.4.md) says every sk-code file that ranks the code surfaces lists OpenCode, then Obsidian, then Webflow; a prompt matching two surfaces lists them in that order; on a keyword tie the session's current surface can lead via `compiled-route.cjs --surface-hint`. The operator says this is wrong for external users: sk-code-obsidian and sk-code-webflow are the operator's personal surfaces and serve only as examples, which an external user deletes and replaces with an sk-code surface for their own project, so the doctor and everything else in Skilled should assume they are gone. sk-code-skilled is the one native surface and, for users other than the operator, should have the LOWEST priority: a user's own non-native surface outranks it. sk-code-review, sk-code-quality and the shared/ layer are stack-agnostic and serve every user. Answer with path:line or command evidence: (1) every place that encodes the surface order or treats obsidian or webflow as installed: sk-code hub-router.json tieBreak, mode-registry.json, SKILL.md, ROUTER.md, shared/references (stack-detection.md), the compiled-routing manifest and runtime (.skilled/bin/compiled-route.cjs, .skilled/bin/lib/compiled-routing/), canary fixtures, the skill advisor (graph metadata, scorer boosts, batteries), the doctor commands and checks (.skilled/commands/doctor/), install guides, READMEs and the v4.0.0.4 note; (2) what breaks today when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy outside the worktree (doctor checks, compiled-route-guard, route sync, canaries, advisor, package and parent-skill checks), and what happens when they add their own surface packet; (3) how a user-added surface should outrank sk-code-skilled: a priority or rank field in mode-registry.json, a native or fallback flag on opencode, a tieBreak derived when the manifest is minted, the --surface-hint path, or something else, compared on cost and risk with one recommendation; (4) how the operator's own repository keeps its current order with obsidian and webflow present while the shipped default assumes they are gone: configuration versus data, example versus shipped; (5) doctor and documentation changes that tell external users obsidian and webflow are examples to delete or replace, and how to scaffold their own surface (sk-doc create-skill, parent-skill mode packets); (6) ideas to reject, with reasons. Every recommendation must pass .skilled/repo-rules/prevent-overengineering.md: name the cheaper move and why it fails.
- Started: 2026-10-12T16:28:06.444Z
- Status: INITIALIZED
- Iteration: 10 of 10
- Session ID: dr-025-dsflash-devin-2026-10-12T16:28:06.444Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Q1 part 1: inventory of surface-order encodings and installed-surface assumptions inside the sk-code hub (hub-router.json, mode-registry.json, SKILL.md, ROUTER.md, README.md, shared/, leaf-manifest.json, graph-metadata.json, surface packet heads) | - | 0.90 | 25 | complete |
| 2 | Q1 part 2 (compiled-routing slice): how the sk-code manifest is minted; where tieBreak and the surface order come from; --surface-hint/surfaceHint; freshness; compiled manifest data; route sync; canary fixtures and tests - ORDER and PRESENCE lines; order data vs code | compiled-routing | 0.91 | 17 | complete |
| 3 | Q1 part 3 - outside the hub: advisor graph/scorer/corpora, doctor parent-skill checks, git hooks, root README, .skilled/README.md absence | surface-order-inventory | 0.96 | 0 | complete |
| 4 | Q2 part 1, observed breakage: throwaway-copy deletion of sk-code-obsidian and sk-code-webflow — guard, compiled-route prompts, parent-skill check, package gate, route sync, canary tests, advisor | surface-priority | 0.90 | 9 | complete |
| 5 | Q2 part 2: an external user adds their own surface (sk-code-myapp) in a throwaway copy - scaffold, register, re-mint, and route priority vs sk-code-skilled | - | 0.88 | 9 | complete |
| 6 | Q3: compare the options for letting a user surface outrank sk-code-skilled (rank field, native flag, derived tieBreak, --surface-hint, other) and name the cheapest move that works | surface-priority | 0.85 | 6 | complete |
| 7 | Q4: operator order versus shipped default — what /doctor:update ships, how it treats a user-modified hub registry/router/manifest (align, apply, rollback, record-base, compat), generated versus hand-written, whether order is derivable from the installed set | surface-priority | 0.90 | 9 | complete |
| 8 | Q5: doctor and documentation changes — where the docs/doctor tell external users obsidian and webflow are examples to delete or replace, and where the scaffold path for a new surface is documented; smallest wording/check changes with exact file:line | docs-and-doctor | 0.95 | 8 | complete |
| 9 | Q6 + synthesis: ideas to reject with reasons; ranked recommendations R1-R5 and implementation phases, each tied to path:line evidence and the prevent-overengineering climbing sentence; folds in the last Q1 slice (ROUTER.md 265-618). | synthesis | 0.68 | 6 | insight |
| 10 | Adversarial re-verification: re-open every ORDER, PRESENCE, BREAK and DOC finding and every recommendation recorded in iterations 1-9, re-read each cited line, rerun each decisive command in a throwaway copy, drop or correct anything that does not hold | - | 0.10 | 15 | complete |

- iterationsCompleted: 10
- keyFindings: 4
- openQuestions: 0
- resolvedQuestions: 6

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 6/6
- [x] Q1: Where is the surface order (opencode, obsidian, webflow) encoded, and where are sk-code-obsidian and sk-code-webflow treated as installed?
- [x] Q2: What breaks when an external user deletes sk-code-obsidian and sk-code-webflow, observed in a throwaway copy, and what happens when they add their own surface?
- [x] Q3: How should a user-added surface outrank sk-code-skilled (registry priority field, native or fallback flag, tieBreak derived at mint time, --surface-hint, other), and which option is cheapest at acceptable risk?
- [x] Q4: How does the operator repository keep its current order while the shipped default assumes the examples are gone (configuration versus data, example versus shipped)?
- [x] Q5: Which doctor and documentation changes tell external users the two surfaces are examples, and how do they scaffold their own surface?
- [x] Q6: Which ideas should be rejected, and why?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ███████▇▇▇▇▇▇███▇▅▃▁
- score sparkline: ███████▇▇▇▇▇▇███▇▅▃▁
- Last 3 ratios: 0.95 -> 0.68 -> 0.10
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.10
- coverageBySources: {"code":100,"other":85}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Broad repo-wide order grep before reading the named hub files: the bare-basename glob matched nested packet READMEs first and the 70-hit cap exhausted before the hub-root files; targeted reads were cheaper. (Evidence: grep result counts and file paths in Actions Taken item 4.) (iteration 1)
- None definitively eliminated. The BREAK-class observation (deleting the two packets in a throwaway copy) was intentionally not attempted: this iteration's focus is the static hub inventory; the deletion experiment is Q2's focus. No throwaway copy was created. (iteration 1)
- Treating `mode-registry.json:19` `surfaces` array as the ranking: it is a declaration list; the rank lives in `hub-router.json:7` tieBreak plus the `stack-detection.md:39` precedence. Conflating them would misstate the v4.0.0.4 claim's accuracy. (iteration 1)
- Expecting the compiled manifest to encode the surface order — it stores policy identity only (row 7). (iteration 2)
- Reading `004-compiler-n1-shadow/compiler/order.cjs` as the surface rank — it is a UTF-16 string comparator (row 5). (iteration 2)
- Running the deletion experiment now — Q2's focus; not attempted, same call as iteration 1. (iteration 2)
- Searching the compiled-routing runtime for a hardcoded surface order: none exists. The order enters as data (hub tieBreak) and leaves as data; only the comparator and the hint reorder are code (rows 1–3, 5). (iteration 2)
- `.skilled/README.md` as a documentation surface — the path does not exist (row 10). (iteration 3)
- None newly eliminated beyond the above; the deletion experiment remains Q2's focus and was again not attempted. (iteration 3)
- Reading the advisor as a surface ranker — it has no surface ids and its surfaceHint is a pass-through to `compiled-route.cjs` (rows 4–5). (iteration 3)
- Treating the advisor's `webflow cms` disambiguation as surface-order evidence — it routes to mcp-code-mode and penalizes sk-code (row 3). (iteration 3)
- `--surface-hint` as the tie fix: same legacy stub under a stale manifest. (iteration 5)
- Docs-only registration instructions (hand-edit registry + router): observed to break routing entirely without a working mint. (iteration 5)
- The mint path cannot be judged inside a `specs`-excluded copy; candidate for the reducer: "re-mint verification requires a full-tree copy" (not promoted to exhausted — one more angle remains). (iteration 5)
- Treating the sync failure as deletion-caused: it fails for all seven hubs with the examples present in the authored inputs. (iteration 5)
- Confirmation, not re-entry: `--surface-hint` as the default tie fix stays blocked (strategy §9); the new evidence (matched-only test :79-83, opt-in pass-through) confirms it cannot be the shipped default. (iteration 6)
- Docs-only insertion convention (insert before `sk-code-skilled` in `tieBreak` + `routerSignals`): two lists must agree and have already drifted in a sibling hub; insertion position is unenforced; stale-manifest stub on hand edit (carried). (iteration 6)
- Hardcoded native-last rule in the shared compiler or runtime: forces the operator's order to change; the Q4 split is data. (iteration 6)
- None newly eliminated. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (named for next focus). (iteration 6)
- Deriving surface order from the installed packet set inside `/doctor:update`: the engine's unit universe is tree+base paths and it computes file status, not routing order. (iteration 7)
- None newly eliminated beyond the ruled-out rows. The full-tree re-mint observation remains the one open angle for the A/C prerequisite (carried from iterations 5–6; not attempted this run — wall clock). (iteration 7)
- Treating `/doctor:update` as an operator/external split mechanism: its decisions are per-checkout and uniform; no example-unit class and no operator-specific layer exist. (iteration 7)
- Checker-only downgrade of absent example surfaces: no example marker exists in the engine (iteration 7) and a blanket WARN would silence 3c. (iteration 8)
- Docs-only example markers as the whole fix: leaves the shipped data referencing the examples, so the carried delete-path failures stand. (iteration 8)
- None newly eliminated; the full-tree re-mint observation remains the one open angle for the Q3 prerequisite (carried, not attempted — wall clock). (iteration 8)
- README-only wording: `SKILL.md:40` is the pointer target every other doc defers to; a README-only edit leaves the hub contract unmarked. (iteration 8)
- Nine ideas rejected with reasons in the Q6 table; see the delta's `ruled_out` rows (config file, plugin system, flag, operator-repo removal, docs-only convention, hint-as-default, installed-set derivation, checker-only downgrade, examples schema). (iteration 9)
- None newly eliminated this iteration; the full-tree re-mint observation remains the one open angle (Phase 0, carried). (iteration 9)
- None newly eliminated. The full-tree re-mint observation remains the one open angle (Phase 0, carried from iterations 5-9). (iteration 10)
- Re-asking whether the parent-skill-check failure is deletion-caused: settled directly — exit 0 at baseline with packets present, exit 1 with 113 failures after deletion. (iteration 10)
- Re-reading the canary fixture :117-140 line range: path confirmed; the range remains carried (time budget). (iteration 10)
- Re-running the addition half (five new FAILs, 113 → 118): the scaffold + re-mint cycle would exceed the wall clock. Carried, not re-observed (iteration-005.md:24). (iteration 10)

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
