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
- Topic: What further hook refinements, upgrades, or additions should the cli-devin and cli-cursor CLI hook adapter layers get, now that Devin's hooks are confirmed to fire live (corrected .devin/hooks.v1.json nested schema -- no top-level version/hooks wrapper, each event is an array of {matcher, hooks:[{type,command,timeout}]} -- 6 of 8 lifecycle events observed firing with real payloads: SessionStart, UserPromptSubmit, PreToolUse, PostToolUse, Stop, SessionEnd; PermissionRequest and PostCompaction did not occur in that session) and Cursor's hook layer is independently built and wired via .cursor/hooks.json? Investigate: (1) coverage gaps against the full Claude/Codex hook inventory for both runtimes; (2) hardening opportunities now that live Devin payloads are observable -- e.g. whether the previously-tolerant field-name fallbacks in task-dispatch-guard.cjs/spec-gate-enforce.mjs/mcp-route-guard.cjs (written when tool_input shapes were unconfirmed) can now be tightened to the confirmed real shapes without losing safety; (3) whether PermissionRequest and PostCompaction not firing in the one observed session is expected (event genuinely didn't occur) or worth a further live-verification pass, and how to design that follow-up test; (4) mcp-route-guard.cjs's dormancy status for both Devin and Cursor now that MCP servers may be independently registrable per-runtime; (5) any Devin or Cursor CLI feature shipped since the original research (docs.devin.ai, docs.cursor.com or equivalent) that these two packets haven't accounted for yet; (6) concrete opportunities to reduce duplication between the two packets' hook adapters now that both are structurally very similar (same 4-runtime hook-directory pattern, same fail-open contract, same guard-core wrapping). Ground every finding in the CURRENT on-disk state of both packets (read .opencode/specs/cli-external-orchestration/029-cli-devin-revival/hook-testing-results.md, .opencode/specs/cli-external-orchestration/029-cli-devin-revival/008-devin-hook-parity/implementation-summary.md, .opencode/specs/cli-external-orchestration/029-cli-devin-revival/011-hook-truth-and-runtime-readmes/implementation-summary.md, .opencode/specs/cli-external-orchestration/029-cli-devin-revival/012-devin-hook-hardening/implementation-summary.md, and the equivalent Cursor packet docs under .opencode/specs/cli-external-orchestration/030-cli-cursor-creation/009-cursor-hooks-lifecycle/ and 010-hook-code-style-cross-runtime/) rather than re-deriving already-settled facts from scratch. The Cursor packet was JUST reorganized (phases 009-015 consolidated into a 009-cursor-hooks-lifecycle/ phase-parent with 6 children, 016-018 renumbered to 011-013) -- use the current folder structure, not any older numbering.
- Started: 2026-07-27T04:08:21.000Z
- Status: INITIALIZED
- Iteration: 5 of 5
- Session ID: research-cli-hook-adapters-2026-07-27
- Parent Session: research-devin-mcp-host-2026-07-24
- Lifecycle Mode: restart
- Generation: 2
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Q1 coverage gaps for cli-devin and cli-cursor against current Claude lifecycle wiring and Codex guard parity | - | 0.88 | 0 | complete |
| undefined | Q2 whether confirmed Devin payloads justify tightening field fallbacks without reducing fail-open safety | - | 0.76 | 0 | complete |
| undefined | Q2 alias precedence and fail-open safety after confirmed Devin payloads | - | 0.54 | 0 | insight |
| undefined | Q2 verified alias-retirement boundaries and resolver hardening order | - | 0.38 | 0 | insight |
| undefined | Q2 fail-open boundary correction for Devin field fallback tightening | - | 0.46 | 0 | insight |

- iterationsCompleted: 5
- keyFindings: 33
- openQuestions: 6
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/6
- [ ] Q1: What coverage gaps exist for cli-devin and cli-cursor against the full Claude/Codex hook inventory (8 lifecycle events)? [legacy-import]
- [ ] Q2: Given now-confirmed live Devin payload shapes, can the tolerant field-name fallbacks in `task-dispatch-guard.cjs`, `spec-gate-enforce.mjs`, and `mcp-route-guard.cjs` be tightened to the confirmed real shapes without losing fail-open safety? [legacy-import]
- [ ] Q3: Is PermissionRequest/PostCompaction non-firing in the one observed Devin session expected (event genuinely did not occur) or does it warrant a further live-verification pass -- and how should that follow-up test be designed? [legacy-import]
- [ ] Q4: What is `mcp-route-guard.cjs`'s dormancy status for both Devin and Cursor now that MCP servers may be independently registrable per runtime? [legacy-import]
- [ ] Q5: What Devin or Cursor CLI features have shipped since the original research (docs.devin.ai / docs.cursor.com) that these two packets have not yet accounted for? [legacy-import]
- [ ] Q6: What concrete duplication-reduction opportunities exist between the cli-devin and cli-cursor hook adapters given their structurally similar 4-runtime hook-directory pattern, fail-open contract, and guard-core wrapping? [legacy-import]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 6
- [ ] Q1: What coverage gaps exist for cli-devin and cli-cursor against the full Claude/Codex hook inventory (8 lifecycle events)?
- [ ] Q2: Given now-confirmed live Devin payload shapes, can the tolerant field-name fallbacks in `task-dispatch-guard.cjs`, `spec-gate-enforce.mjs`, and `mcp-route-guard.cjs` be tightened to the confirmed real shapes without losing fail-open safety?
- [ ] Q3: Is PermissionRequest/PostCompaction non-firing in the one observed Devin session expected (event genuinely did not occur) or does it warrant a further live-verification pass -- and how should that follow-up test be designed?
- [ ] Q4: What is `mcp-route-guard.cjs`'s dormancy status for both Devin and Cursor now that MCP servers may be independently registrable per runtime?
- [ ] Q5: What Devin or Cursor CLI features have shipped since the original research (docs.devin.ai / docs.cursor.com) that these two packets have not yet accounted for?
- [ ] Q6: What concrete duplication-reduction opportunities exist between the cli-devin and cli-cursor hook adapters given their structurally similar 4-runtime hook-directory pattern, fail-open contract, and guard-core wrapping?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██▇▇▇▆▆▅▄▄▃▃▂▂▁▁▁▂▂▂
- score sparkline: ██▇▇▇▆▆▅▄▄▃▃▂▂▁▁▁▂▂▂
- Last 3 ratios: 0.54 -> 0.38 -> 0.46
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.46
- coverageBySources: {}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

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
Q2: Whether confirmed Devin payloads justify tightening field fallbacks without reducing fail-open safety.

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
- graphConvergenceScore: 0.48
- graphDecision: STOP_BLOCKED
- Blocker: unnamed-blocker (blocking): count=1, description=Source diversity (0.00) is below the blocking threshold (1.5). STOP is blocked until diverse sources cover key questions., type=source_diversity_guard
- Blocker: unnamed-blocker (blocking): count=1, description=Evidence depth (1.00) is below the blocking threshold (1.5). STOP is blocked until question->finding->source chains are deeper., type=evidence_depth_guard
- Blocker: unnamed-blocker (blocking): count=1, description=1 claim(s) remain unverified, type=unverified_claims

<!-- /ANCHOR:graph-convergence -->
