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
- Topic: Audit whether the CI red-check repair work on main is fully and correctly documented. Commits in scope: 190b103dd8 (history-locator test state dir), 509c2d707c (snake_case guard exempts research_archive), 8da131af09 (OpenCode version battery names a v1 command by its frontmatter name), 95f704cfc0 (19 workflows skip the onnxruntime CUDA download), cdd3c27db4 (leaf-aliases regen), 9932b52352 (mcp-tooling drops the isolated chrome routing phrase), 67fc950028 (sk-code drift guard skips TS module header on compiler-emitted .d.ts), a65d573299 (track roots count a numbered folder as a packet only with spec.md), b8d66a38f7 (gitignore coverage-graph-db), 478cdec696 (links repointed after the specs/hooks -> specs/hooks-plugins-extensions track rename). For each change find every doc that describes the touched behavior (skill SKILL.md, READMEs, references, feature catalogs, manual testing playbooks, skill changelogs, the release notes .skilled/changelog/skilled/v4.0.2.0.md, root README.md, INSTALL-SKILLED.md, AGENTS.md/CLAUDE.md) and report what is missing, stale or misaligned, with file:line. Also sweep for remaining stale references to specs/hooks/ and SETUP.md. Known already: no changelog entries for these fixes; track-root-children-lists.md §2 and runtime/cli/spec/README.md rows lack the spec.md rule; filesystem-naming-convention.md §3 omits research_archive; session-relaunch README lines 25-30 link the old hooks path; system-skilled-doctor changelog v1.1.1.0 names SETUP.md. Find anything beyond these. Read-only outside the spec folder; never open any .env file or anything under barter/.
- Started: 2026-11-08T16:26:02.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: 2026-11-08T16:26:02.000Z
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Iteration 1: Q1 and Q5 groundwork - run git show --stat on all ten commits, map each commit to the doc surfaces that describe its behavior, then audit the system-spec-kit track-roots and history-locator docs. | - | 0.85 | 8 | complete |
| 2 | Depth pass on the two carried-forward policy edges: the sk-code TypeScript style guide versus the compiler-emitted .d.ts guard exemption, and whether v4.0.2.0 should be amended or a new release entry written; plus classification of the remaining specs/hooks/ references into live goal state and frozen history. | - | 0.75 | 0 | complete |
| 3 | Re-verify Q1 (system-spec-kit track-root and history-locator doc alignment) and Q3 (system-skilled-doctor and mcp-tooling doc alignment) beyond iteration 1's line detail, then answer both with the strategy's exact question text. | - | 0.40 | 5 | complete |
| 4 | Resolve carried-forward branches: ten-commit ancestry vs tag v4.0.2.0, leaf-aliases count verification, track-root packet-wording policy edge | - | 0.65 | 3 | complete |
| 5 | Final consolidation: last-mile sweep for live specs/hooks/ and SETUP.md references plus one ordered remediation register | - | 0.27 | 3 | insight |

- iterationsCompleted: 5
- keyFindings: 31
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Q1: Are the system-spec-kit changes (a65d573299 track roots count a numbered folder as a packet only with spec.md; 190b103dd8 history-locator test state dir) reflected in every doc that describes the touched behavior, beyond track-root-children-lists.md section 2 and runtime/cli/spec/README.md?
- [x] Q2: Are the guard changes (509c2d707c sk-doc snake_case guard exempts research_archive; 67fc950028 sk-code drift guard skips the TS module header on compiler-emitted .d.ts) reflected in their skills references, READMEs, feature catalogs and playbooks, beyond filesystem-naming-convention.md section 3?
- [x] Q3: Are the system-skilled-doctor and mcp-tooling changes (8da131af09 OpenCode version battery names a v1 command by its frontmatter name; cdd3c27db4 leaf-aliases regen; 9932b52352 mcp-tooling drops the isolated chrome routing phrase) reflected in SKILL.md, references, routing docs, feature catalogs and playbooks?
- [x] Q4: Are the CI and repo-hygiene changes (95f704cfc0 19 workflows skip the onnxruntime CUDA download; b8d66a38f7 gitignore coverage-graph-db) reflected in workflow docs, doctor:ci docs, INSTALL-SKILLED.md, root README.md, AGENTS.md/CLAUDE.md and the v4.0.2.0 release notes?
- [x] Q5: Which references to specs/hooks/ and SETUP.md remain stale after 478cdec696, beyond the session-relaunch README lines 25-30 and the system-skilled-doctor changelog v1.1.1.0, and do any skill changelogs or .skilled/changelog/skilled/v4.0.2.0.md record these ten fixes?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▇▆▅▄▃▃▄▄▅▅▅▄▃▂▁
- score sparkline: ██▇▇▇▇▆▅▄▃▃▄▄▅▅▅▄▃▂▁
- Last 3 ratios: 0.40 -> 0.65 -> 0.27
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.27
- coverageBySources: {"code":84,"other":24}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Re-reporting the five Known Context items without new line detail; each was re-checked and only the added surfaces (lib README, §5, folder-structure line, wide stale set) are reported as new. (iteration 1)
- Repointing `specs/hooks/` inside changelogs: `filesystem-naming-convention.md` §5 freezes changelog and archived history as the record of prior names. (iteration 1)
- Searching `system-skilled-doctor` for battery/leaf-alias prose: the skill's docs never describe either, so nothing can be stale. (iteration 1)
- Searching for an onnxruntime/CUDA statement in workflow standards: none exists in any Markdown or workflow asset, so there is no stale claim to correct, only an undocumented change. (iteration 1)
- Treating 190b103dd8 as documentation-relevant: the commit is test-only and changes no user-visible behavior. (iteration 1)
- Extending v4.0.2.0 in place as if it were an untagged open release: the tag exists, and the playbook's pass/fail explicitly fails a run that extends an entry whose tag exists. (iteration 2)
- Re-sweeping `.skilled/skills/system-skilled-doctor` for battery or leaf-alias prose: iteration 1 already established that neither is described there, so nothing can be stale. (iteration 2)
- Treating every `specs/` hit as a repoint target: most are completed packet transcripts frozen by the naming convention. (iteration 2)
- None new. The full mcp-tooling sweep found no surviving routing phrase to remove. (iteration 3)
- Re-reporting the five Known Context items without new line detail (exhausted, iteration 1). (iteration 3)
- Re-sweeping `system-skilled-doctor` for battery or leaf-alias prose (exhausted, iterations 1-2; the skill never describes either). (iteration 3)
- Reading every "isolated" hit in mcp-tooling as stale routing prose: the remaining hits are the `--isolated=true` flag and Aside's isolation-gap documentation, not aliases. (iteration 3)
- Treating every `specs/` or changelog hit as a repoint target (frozen history, iteration 2). (iteration 3)

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
