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
- Topic: mcp-browser-use hub: answer KQ1-KQ8 in spec.md (capability, lane rule, hub contract, blast radius, naming, macOS verification, security, Aside overlap)
- Started: 2026-11-21T08:29:48.000Z
- Status: INITIALIZED
- Iteration: 12 of 12
- Session ID: 2026-11-21T08:29:48.000Z
- Parent Session: 2026-11-21T08:29:48.000Z
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | KQ1: build the capability matrix. Read the local mcp-chrome-devtools and mcp-aside-devtools packets under `.skilled/skills/mcp-tooling/`, then read Bladebro upstream (https://github.com/dondai44423/bladebro, or `gh api repos/dondai44423/bladebro/...`) and pin the version and read date. | - | 1.00 | 9 | complete |
| 2 | KQ2: draft one CLI-versus-Code-Mode lane rule per mode (Bladebro, Chrome DevTools, Aside) using the detection commands already captured in the packets — `command -v bladebro` / `bladebro doctor`, `command -v bdg` / `bdg status`, `command -v aside` / `aside --version` — with each mode's fallback trigger and the source lines just read. | - | 1.00 | 7 | complete |
| 3 | KQ3: read mcp-tooling's SKILL.md, ROUTER.md, mode-registry.json, hub-router.json and leaf-manifest.json, then propose the mcp-browser-use contract shapes (routingClass and packetKind per mode) checked against mcp-tooling's files | hub-contract | 0.94 | 9 | complete |
| 4 | KQ4: enumerate the full blast radius — grep the repository for `mcp-chrome-devtools` and `mcp-aside-devtools` and split every hit into hand-edit, regenerate and leave-as-history, validating the leaf carry-over assumed... | blast-radius | 0.94 | 9 | complete |
| 5 | KQ5 naming decision. The hand-edit list above is expressed in current mode ids, so the folder / `workflowMode` / `packetSkillName` choice determines which of those literal occurrences are renamed versus merely relocated — answering KQ5 first makes the KQ4 edit list executable. | naming | 0.90 | 7 | complete |
| 6 | KQ6: produce the macOS verification step list for Bladebro — install through a live agent-browser and real-browser probe, each step with expected output and rollback. | - | 0.88 | 8 | complete |
| 7 | KQ7: turn the constraints captured here into security findings the 004 safety rules can quote — signed-in profiles (profile/account consent, attach to leave caller-owned browsers open), stealth and site terms of service, and the npm binary supply chain, each with a mitigation the 004 safety rules can quote. | security | 0.73 | 4 | complete |
| 8 | KQ8: decide yes or no on Bladebro taking over Aside's deterministic signed-in work, with the deciding cases — compare Bladebro's agentic run plans and rb consent/stealth constraints (R-SEC-1/R-SEC-2) against Aside's deterministic repl, single-writer-per-account rule and MFA/approval gates; then state the 004 scope consequence. | aside-overlap | 0.70 | 5 | complete |
| 9 | KQ1 closure: reconcile why the fully-answered capability matrix is still open (exact-match answeredQuestions text), re-record KQ1 with the exact strategy text, and finalize the research.md synthesis | - | 0.60 | 4 | insight |
| 10 | Final closure verification: confirm iteration 9's KQ1 re-record propagated across all four reducer surfaces and finalize research.md status to iteration 10 of 10 | - | 0.33 | 3 | insight |
| 11 | List every file outside .skilled/skills/mcp-tooling that names mcp-chrome-devtools or mcp-aside-devtools (rg -l, excluding changelog and benchmark/reports), and classify each: rewrite path / rewrite mode name / historical, leave. | - | 0.62 | 8 | complete |
| 12 | Does the Chrome DevTools mode really offer Lighthouse? Its hub router lists it but its feature catalog has no entry; settle it from the files and the chrome-devtools-mcp / bdg upstream docs. | - | 0.85 | 7 | complete |

- iterationsCompleted: 12
- keyFindings: 59
- openQuestions: 0
- resolvedQuestions: 10

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 10/10
- [x] KQ1: What can Bladebro, Chrome DevTools (bdg plus chrome-devtools-mcp) and Aside each do, and where does each stop? Answer as a cited capability matrix over page model, actions, console/network logs, HAR, heap/perf trace, Lighthouse, raw CDP, iframes, signed-in profiles and stealth.
- [x] KQ2: When does each mode use its CLI and when its MCP server through Code Mode? Answer as one lane rule per mode with the detection command and the fallback trigger.
- [x] KQ3: What hub contract does mcp-browser-use need? Answer with proposed mode-registry.json, hub-router.json and leaf-manifest.json shapes, the advisor routingClass and packetKind per mode, each checked against mcp-tooling's files.
- [x] KQ4: What is the full blast radius of moving mcp-chrome-devtools and mcp-aside-devtools out of mcp-tooling? Answer with every file inside and outside mcp-tooling that names them, split into hand-edit, regenerate and leave-as-history.
- [x] KQ5: Do the modes keep the mcp- prefix inside the new hub? Answer with one naming decision giving the folder, workflowMode and packetSkillName for each of the three modes.
- [x] KQ6: How is Bladebro verified on macOS? Answer with a step list from install through a live agent-browser and real-browser probe, each step with its expected output and its rollback.
- [x] KQ7: What are the security risks of Bladebro and the browser modes? Answer with findings on signed-in profiles, stealth and site terms of service, and the npm binary supply chain, each with a mitigation the 004 safety rules can quote.
- [x] KQ8: Should Bladebro take over Aside's deterministic signed-in work? Answer yes or no with the cases that decide it.
- [x] List every file outside .skilled/skills/mcp-tooling that names mcp-chrome-devtools or mcp-aside-devtools (rg -l, excluding changelog and benchmark/reports), and classify each: rewrite path / rewrite mode name / historical, leave.
- [x] Does the Chrome DevTools mode really offer Lighthouse? Its hub router lists it but its feature catalog has no entry; settle it from the files and the chrome-devtools-mcp / bdg upstream docs.

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ████▇▇▇▇▇▆▆▅▅▄▄▂▂▄▅▆
- score sparkline: ████▇▇▇▇▇▆▆▅▅▄▄▂▂▄▅▆
- Last 3 ratios: 0.33 -> 0.62 -> 0.85
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.85
- coverageBySources: {"api.github.com":5,"code":100,"github.com":3,"other":42,"raw.githubusercontent.com":18}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- Broad web search for Bladebro capability facts: unnecessary once the official README and `docs/tools.md` were reachable. (iteration 1)
- Live `bladebro` probes: the binary is absent from PATH and installation is an explicit non-goal; KQ6 owns live verification. (iteration 1)
- No new directions ruled out this iteration. The two iteration-1 BLOCKED directions (broad Bladebro web search; live `bladebro` probes) were not retried. (iteration 2)
- Giving any mode a non-`metadata` routingClass: rejected because it would add per-mode projection maps to 005's scope for no benefit under hub-membership routing. (iteration 3)
- Hand-writing `leaf-manifest.json`: rejected by mcp-tooling's "never hand-edit" rule; it must be regenerated (blocked until 004 authors the Bladebro packet). (iteration 3)
- Importing `mcp-tooling`'s `extensions.transport-axis` block: rejected because all three new modes are workflow-state-changing, directly answering 002's open question. (iteration 3)
- Editing runtime mirrors under `.claude`, `.opencode` or `.pi`: rejected after `ls -l` showed them to be symlinks into `.skilled/skills`. (iteration 4)
- Hand-writing the new hub's `leaf-manifest.json`: already BLOCKED in strategy and now independently confirmed by `SKILL.md:111`; not retried. (iteration 4)
- No new dead end. Candidates for reducer promotion: none; the three ruled-out items above are classification choices specific to KQ4, not exhausted research directions. (iteration 4)
- Treating the raw 400-match grep as the edit list: rejected because most hits are changelog/benchmark/spec-history records; it would inflate the hand-edit set by an order of magnitude. (iteration 4)
- Dropping the `mcp-` prefix from workflow mode ids: rejected because the canonical create-skill-parent rule is `folder == packetSkillName == [hub-prefix]-<mode>` and dropping it would rename every literal mode id in the KQ4 hand-edit set for no contract benefit. (iteration 5)
- Hybrid bare folder + prefixed `packetSkillName` with `grandfatheredFolderMismatch:true`: rejected because the flag is defined as a preserved *legacy* mismatch, `parent-skill-check.cjs:595-597` soft-fails a stale `true` flag, and iteration 3 fixed folder == name as the invariant. (iteration 5)
- None. Both alternatives produced a decisive finding rather than eliminating a path. Candidates for reducer promotion: the two ruled-out options above are classification choices specific to KQ5, not exhausted research directions. (iteration 5)
- Broad web search for Bladebro facts: still BLOCKED from iteration 1; the official docs were directly reachable via the docs index. (iteration 6)
- Running any live `bladebro` probe or installing the binary: the iteration-1 BLOCKED "live `bladebro` probes" direction and the charter/install non-goal still apply [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]. The plan is authored from pinned upstream docs, not executed. (iteration 6)
- Broad web search for Bladebro facts: BLOCKED since iteration 1; specific known URLs were fetched instead. (iteration 7)
- Live `bladebro` probes or installing the binary: BLOCKED since iteration 1; install is a 006 operator stop-for-yes and a charter non-goal [SOURCE: specs/mcp/mcp-browser-use/001-mcp-browser-use-hub/001-research/spec.md:98-100]. (iteration 7)
- Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried (no upstream fetch needed). (iteration 8)
- Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — closure uses only local state evidence. (iteration 9)
- Broad web search for Bladebro facts: BLOCKED since iteration 1; not retried — terminal verification uses only local state evidence. (iteration 10)
- No new dead end. Candidates for reducer promotion: none; the two ruled-out items are scope/classification choices specific to this question, not exhausted research directions. (iteration 11)
- Re-running KQ4's whole-repository inventory: rejected because the question is a strict subset and iteration 4 already holds the cluster inventory; only the outside-hub form split was new. (iteration 11)
- Treating bare mode-id occurrences as path rewrites: rejected after line-level inspection showed cli-orca and advisor fixtures use ids as route labels, not paths, and KQ5 keeps the ids stable. (iteration 11)

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
