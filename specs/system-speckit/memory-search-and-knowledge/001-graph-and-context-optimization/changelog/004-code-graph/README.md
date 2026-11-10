---
title: "Code Graph Phase Changelogs"
description: "Index of phase-level changelogs for the 026/007 code-graph track. Each entry tells the story of what was broken before the phase, what shipped, and what changed for users in plain terms."
trigger_phrases:
  - "code graph changelog"
  - "code graph history"
  - "phase changelog index"
importance_tier: "normal"
contextType: "implementation"
---

# Code Graph Phase Changelogs

Twenty-five phases shipped between 2026-04-09 and 2026-05-06 that together hardened the code-graph system from "could be wiped by a bad scan and silently dropped 60-80% of symbols in production" to "crashes 0.72% of files in broad-scope mode and recovers cleanly from scope changes."

The code-graph is the SQLite-backed index of every symbol (functions, classes, variables, imports) and the edges between them (calls, exports, imports, etc.) that the MCP server uses to answer queries like "what calls this function" or "give me the outline of this file."

## Phases (chronological)

| Phase | Date | Title | One-line story |
|-------|------|-------|----------------|
| 001 | 2026-04-09 | [Code Graph Upgrades](./changelog-001-code-graph-upgrades.md) | Five additive upgrade lanes: detector provenance, bounded blast radius, edge evidence, hot-file breadcrumbs, and a frozen regression floor. |
| 002 | 2026-04-25 | [Self-Contained Package Migration](./changelog-002-code-graph-self-contained-package.md) | Behavior-preserving migration moved 34 files into a single mcp_server/code-graph/ package. All 308 tests pass. |
| 003 | 2026-04-23 | [Context and Scan Scope Remediation](./changelog-004-002-fix-stale-highlights-and-scan-scope.md) | Stale graphs now show highlights. Default scan scope excludes noise and honors .gitignore. Two absorbed sub-phases shipped. |
| 004/R028 | 2026-04-21 | [Hook Improvement Investigation Pt-01](./changelog-004-001-mcp-shared-dependency-startup-fix.md) | 10-iteration deep-research first wave. Found 7 findings (1 P0: subtree-root scans delete out-of-scope rows silently). |
| 004/R013b | 2026-04-22 | [Hook Improvement Investigation Pt-02](./changelog-004-002-fix-stale-highlights-and-scan-scope.md) | 10-iteration deep-research second wave. Found 6 findings (3 P1, 3 P2) around contract leakage boundaries. |
| 004/R013c | 2026-04-22 | [Zero-Calls Root-Cause Investigation](./changelog-004-003-code-graph-workspace-root-fix.md) | 3-iteration targeted investigation. Zero-edge result traced to resolveSubject() picking re-export wrappers over implementations. |
| 004/R030 | 2026-04-22 | [Gap Investigation Pt-01](./changelog-004-research-030-code-graph-gap-investigation-pt-01.md) | 4-iteration doc-coverage audit. Found 13 missed documentation surfaces (9 P1, 4 P2). |
| 004 | 2026-04-24 | [Hook Improvement Implementation](./changelog-003-code-graph-context-and-scan-scope.md) | Eight streams shipped from the research findings: CALLS resolution, blocked-read contracts, CocoIndex fidelity, startup payload parity, and more. |
| 005/R015 | 2026-04-23 | [Advisor Refinement Deep Research](./changelog-005-001-code-graph-advisor-refinement.md) | 20-iteration deep-research sweep. Produced 35 findings across advisor daemon, shim, confidence calibration, and cross-packet contracts. |
| 005 | 2026-04-25 | [Code Graph and Skill Advisor Refinement](./changelog-004-research-013-code-graph-hook-improvements-pt-02.md) | 10 PRs across 5 fix-up batches (B1-B5) plus F35 calibration bench. All 35 findings closed. |
| 005/V015 | 2026-04-24 | [Advisor Refinement Deep Review](./changelog-005-001-code-graph-advisor-refinement.md) | 7-iteration review cycle validated the B1-B5 implementation. 7 findings addressed in batch B6. |
| 006 | 2026-04-25 | [Doctor Command](./changelog-007-001-doctor-diagnostic-command-phase-a.md) | Phase A diagnostic-only /doctor:code-graph shipped. Phase B gated on research packet 007. |
| 007 | 2026-04-25 | [Resilience Research](./changelog-006-code-graph-doctor-command.md) | Produced the verification battery, staleness model, recovery playbook, and exclude-rule confidence tiers for /doctor:code-graph Phase B. |
| 008 | 2026-04-25 | [Backend Resilience](./changelog-005-review-015-code-graph-advisor-refinement-pt-01.md) | 15 tasks across 5 backend streams. Deep-review found 5 P0 + 12 P1. Audit found 1 P0 + 10 P1. All closed. Tests at 99.8%. |
| 009 | 2026-05-02 | [End-user scope by default](./changelog-004-004-end-user-scope-default-and-opt-in.md) | Default scans now index your code only. Framework internals are opt-in. |
| 010 | 2026-05-02 | [Fix-Iteration Quality Meta-Research](./changelog-010-fix-iteration-quality-meta-research.md) | Why LEAF-agent fixes accumulate gaps. Eight process-improvement rounds (R1-R8). P1 dropped from 6 to 0. |
| 011 | 2026-05-03 | [Parser path fix from dist](./changelog-011-broader-scope-excludes.md) | The parser was silently failing in production and dropping 60-80% of symbols. Now it loads correctly from the compiled output. |
| 012/001 | 2026-05-05 | [Real-World Usefulness Test Execution](./changelog-012-001-execution.md) | Sandbox-based trials across code-graph, hooks, advisor, Gate 3, and runtime smoke. Produced deferred remediation cell mapping. |
| 012/002 | 2026-05-05 | [Native Rerun of Deferred Cells](./changelog-012-002-native-rerun.md) | Native re-execution confirmed parser crash. Code-graph downgraded to OVERHEAD pending fix. Advisor and hooks upgraded to READY. |
| 012/003 | 2026-05-06 | [Deep Research Issues](./changelog-012-003-deep-research-issues.md) | 10-iteration sweep classified 88 findings. Reclassified parser crash from P1 to P0. Produced remediation backlog. |
| 012/004 | 2026-05-06 | [Index can no longer be wiped](./changelog-012-004-remediation.md) | A scan that returned zero nodes used to overwrite a populated 56k-node graph. Now zero-node scans are rejected. |
| 012/005 | 2026-05-06 | [Scope changes need explicit consent](./changelog-012-005-scope-guard.md) | Scoping a smaller scan over a larger index used to silently shrink it. Now scope changes require an explicit flag. |
| 012/006 | 2026-05-06 | [Cluster A to E polish](./changelog-012-006-cluster-a-to-e.md) | Five medium-priority findings closed, including diagnostics surfacing, auto-rescan policy, and a verify endpoint that pointed at a non-existent path. |
| 012/007 | 2026-05-06 | [Tree-sitter parser resilience](./changelog-012-007-tree-sitter-parser-resilience.md) | Broad-scope scans crashed on 17.5% of files. After a 7-iteration deep research and a skip-list fix, the rate dropped to 0.72%. |
| 012 | 2026-05-06 | [Real-World Usefulness Test (Parent)](./changelog-012-real-world-usefulness-test.md) | Phase parent rollup for the 7-child usefulness campaign. Summary of scope, children, and cross-cutting verdict. |

## How to read these

Each phase changelog follows the canonical nested-changelog template at `.opencode/skills/system-spec-kit/templates/changelog/phase.md`. The phase parent (012) follows the root template at `changelog/root.md`. Sections are:

- **Summary**: what changed and why it matters, in plain language
- **Added**: new capabilities or surfaces
- **Changed**: behavior changes to existing features
- **Fixed**: bugs closed
- **Verification**: how we proved the change works
- **Files Changed**: source paths with one-line descriptions
- **Follow-Ups**: known deferred items

Research-only and review-only phases mark Added/Changed/Fixed as "None" and fill Verification with artifact paths.

Voice rules per `.opencode/skills/sk-doc/references/global/hvr_rules.md` apply throughout. Technical jargon includes a parenthetical definition on first use.

## Where to find the full story

- Per-phase spec folders live under `026/007/` and `026/007/012/` for the test-track sub-phases.
- Deep-research output for each research sub-phase lives at `<phase>/research.md`.
- Implementation summaries with detailed file changes live at `<phase>/implementation-summary.md`.

## Authoring conventions

- File names: `changelog-<phase>-<short-name>.md`
- One file per shipped phase, regardless of commit count
- Phase parents use `changelog/root.md` template. All other phases use `changelog/phase.md`.
- Multi-commit phases collapse into one entry with all commits listed in Files Changed
- HVR rules are non-negotiable: no em-dashes, no semicolons in narrative prose
