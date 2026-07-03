---
title: "Spec 156 Changelog Index"
description: "Program-level index of all packet-local changelogs for spec 156 (agent-loops-improved), organized under eleven phases that ran from reference research through deep-loop implementation to a research-backlog remediation track, a documentation truth audit, and a follow-up remediation phase. Each phase links to its top rollup."
trigger_phrases:
  - "156 changelog index"
  - "156 changelog history"
  - "agent loops improved changelogs"
importance_tier: "normal"
contextType: "implementation"
---

# Spec 156 Changelog Index

Spec 156 (agent-loops-improved) mined two reference loop codebases for improvement seams and then shipped them as a phased deep-loop program. Phase 001 produced the ranked backlog. Phases 002 through 008 implemented the loop-system work: deep-loop-runtime resilience and convergence hardening, deep-loop-workflows guardrails, a speckit autopilot lifecycle, an advisor routing projection, UX and observability surfaces, hermetic test isolation and a record-replay harness, and a remediation track that audited and fixed the shipped state. Phase 009 closed the loop on the packet itself: a deep-research fan-out mined the packet for its own remaining gaps and this phase shipped the resulting 11-child backlog, tooling bug fixes, claimed-versus-actual drift closure and infrastructure hardening, ending with a fix for the two most severe bugs the research runtime surfaced in its own completion and hang-handling logic. Phase 010 closed the loop on the packet's public face: a genuine 10-iteration deep-review checked the root README against everything shipped and this phase fixed every confirmed gap. Phase 011 closes the 4 items phase 009's own changelog explicitly deferred; all 7 children shipped, ending with the sliding-window convergence mode on 2026-07-02. The changelog mirrors the spec tree: one directory per phase, with phase changelogs named `changelog-<phase>-<leaf>-<short-name>.md` and one per-phase rollup named `changelog-<phase>-root.md`. The packet root rollup is [changelog-156-root.md](./changelog-156-root.md) in this directory. The chronological view of the same work lives in [`../timeline.md`](../timeline.md) and the before-and-after narrative in [`../before-vs-after.md`](../before-vs-after.md).

## Phases

| Phase | Leaf changelogs | Top rollup |
|-------|-----------------|------------|
| 001 reference research | 0 | [changelog-001-root.md](./001-reference-research/changelog-001-root.md) |
| 002 deep loop runtime | 18 | [changelog-002-root.md](./002-deep-loop-runtime/changelog-002-root.md) |
| 003 deep loop workflows | 12 | [changelog-003-root.md](./003-deep-loop-workflows/changelog-003-root.md) |
| 004 system spec kit | 1 | [changelog-004-root.md](./004-system-spec-kit/changelog-004-root.md) |
| 005 skill interconnection | 1 | [changelog-005-root.md](./005-skill-interconnection/changelog-005-root.md) |
| 006 ux observability automation | 6 | [changelog-006-root.md](./006-ux-observability-automation/changelog-006-root.md) |
| 007 testing | 2 | [changelog-007-root.md](./007-testing/changelog-007-root.md) |
| 008 loop systems remediation | 6 | [changelog-008-root.md](./008-loop-systems-remediation/changelog-008-root.md) |
| 009 research backlog remediation | 11 | [changelog-009-root.md](./009-research-backlog-remediation/changelog-009-root.md) |
| 010 documentation truth audit | 0 | [changelog-010-root.md](./010-documentation-truth-audit/changelog-010-root.md) |
| 011 follow-up remediation | 7 | [changelog-011-root.md](./011-followup-remediation/changelog-011-root.md) |

## How to read these

Each phase's top rollup is its phase parent's Included Phases table, listing every child phase with its status and a one-line summary, plus a Before vs After section framing what the phase changed. Each leaf changelog follows the canonical template: Summary, Added, Changed, Fixed, Verification, Files Changed and Follow-Ups. The deep-loop-runtime phase carries the most leaves at eighteen and the deep-loop-workflows phase is next at twelve, because the program weighted the runtime and workflow layers heaviest. Phase 009 is next at eleven, the research-backlog remediation track that closed the loop on the packet's own remaining gaps. Phase 011 is next at seven, closing the follow-ups phase 009 itself deferred, including the sliding-window convergence mode. Phase 001 and phase 010 are both childless. Phase 001 is research only, the reference-mining pass that produced the ranked improvement backlog the later phases drew from. Phase 010 is the documentation-truth audit, a single dispatched review plus its own fix pass, not decomposed into children since the fix set was small enough for one phase. All eleven phases shipped in full.

## Conventions

- File names use the pattern `changelog-<phase>-<leaf>-<short-name>.md`. Per-phase rollups use the `-root.md` suffix and the packet rollup is `changelog-156-root.md`. Numbers reflect the current eleven-phase spec-tree position.
- One changelog per shipped phase. Multi-candidate phases collapse their candidates into one entry.
- Voice rules are non-negotiable: no em-dashes, no semicolons in narrative, no Oxford commas.
- The directory layout mirrors `028-memory-search-intelligence/changelog/` (one directory per phase, one rollup per phase).
