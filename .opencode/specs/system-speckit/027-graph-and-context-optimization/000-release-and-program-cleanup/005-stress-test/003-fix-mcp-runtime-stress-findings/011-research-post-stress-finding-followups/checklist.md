---
title: "Verification Checklist: Post-Stress Follow-Up Research"
template_source: "SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2"
description: "P0/P1/P2 quality gates the deep-research loop must clear before research.md is treated as evidence for downstream packet authoring."
trigger_phrases:
  - "post-stress follow-up checklist"
  - "v1.0.2 follow-up checklist"
importance_tier: "important"
contextType: "checklist"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/005-stress-test/003-fix-mcp-runtime-stress-findings/011-research-post-stress-finding-followups"
    last_updated_at: "2026-04-27T18:45:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored checklist.md"
    next_safe_action: "T005 author description.json"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Verification Checklist: Post-Stress Follow-Up Research

<!-- ANCHOR:checklist -->

## P0 — Hard Blocking Gates

- [ ] **CHK-P0-001** [P0] **C-P0-001** Loop invoked via `/deep:start-research-loop:auto` (canonical command surface). Direct Task tool dispatch forbidden. **Evidence**: workflow log header in `research/deep-research-state.jsonl`.
- [ ] **CHK-P0-002** [P0] **C-P0-002** Executor config records `kind="cli-codex"`, `model="gpt-5.5"`, `reasoningEffort="high"`, `serviceTier="fast"`. **Evidence**: `research/deep-research-config.json` `executor` block.
- [ ] **CHK-P0-003** [P0] **C-P0-003** Loop completes with stop reason ∈ {`converged`, `maxIterationsReached`}; NOT `error` or `blockedStop`. **Evidence**: final record in `research/deep-research-state.jsonl`.
- [ ] **CHK-P0-004** [P0] **C-P0-004** `research/research.md` exists and is non-empty. **Evidence**: file size > 0; renders as valid markdown.
- [ ] **CHK-P0-005** [P0] **C-P0-005** research.md covers all 4 v1.0.2 follow-ups: P0 cli-copilot bypass, P1 graph fast-fail testability, P2 file-watcher debounce, opportunity CocoIndex telemetry leverage. **Evidence**: 4 distinct labeled sections present.
- [ ] **CHK-P0-006** [P0] **C-P0-006** Each follow-up section contains: (a) evidence cited, (b) root-cause hypothesis, (c) ≥2 fix candidates with trade-offs, (d) recommended approach, (e) falsifiable success criteria. **Evidence**: section structure check.
- [ ] **CHK-P0-007** [P0] **C-P0-007** No fabricated file paths in research.md. Sample-verify ≥10 distinct paths exist on disk. **Evidence**: bash grep + ls verification.

## P1 — Strong Quality Gates

- [ ] **CHK-P1-001** [P1] **C-P1-001** Light architectural touch surfaces ≥1 named seam (≤2) with one-line "why now". **Evidence**: research.md "Intelligence-System Seams" section.
- [ ] **CHK-P1-002** [P1] **C-P1-002** Cross-reference table maps recommendations back to `010` Recommendations §1-5 + relevant `003-009` remediation packets. **Evidence**: research.md cross-ref section.
- [ ] **CHK-P1-003** [P1] **C-P1-003** Each iteration delta JSONL record contains required fields: `iteration`, `newInfoRatio`, `status`, `focus`. **Evidence**: `deltas/iter-NNN.jsonl` schema check.
- [ ] **CHK-P1-004** [P1] **C-P1-004** Topic prompt (rendered into `research/prompts/iteration-001.md`) cites source-of-evidence paths. **Evidence**: grep for 010-stress-test-close-loop-measurement-rerun/findings.md in iteration-001 prompt.
- [ ] **CHK-P1-005** [P1] **C-P1-005** Parent metadata updated: 4 parent files (spec.md, description.json, graph-metadata.json, resource-map.md) all reference new child. **Evidence**: grep `011-research-post-stress-finding-followups` returns ≥1 hit per file.
- [ ] **CHK-P1-006** [P1] **C-P1-006** Convergence stop-score breakdown logged with iteration that triggered stop (rolling avg, MAD, entropy). **Evidence**: deep-research-dashboard.md final state.

## P2 — Recommended Quality Gates

- [ ] **CHK-P2-001** [P2] **C-P2-001** research/resource-map.md emitted at convergence (default behavior; not suppressed). **Evidence**: file exists.
- [ ] **CHK-P2-002** [P2] **C-P2-002** `findings-registry.json` shows ≥80% of opening questions resolved. **Evidence**: registry entropy check.
- [ ] **CHK-P2-003** [P2] **C-P2-003** Per-follow-up `newInfoRatio` averaged across iterations is balanced (no single follow-up >50% of iterations' focus). **Evidence**: aggregate `delta.focus` distribution.
- [ ] **CHK-P2-004** [P2] **C-P2-004** Iteration count is between 6 and 10 (premature convergence at <6 or hitting hard cap at 10 both flagged for review). **Evidence**: `iterations/` count.
- [ ] **CHK-P2-005** [P2] **C-P2-005** Validator passes on packet post-execution (allowing SPEC_DOC_INTEGRITY false-positives for `research/iterations/*.md` references). **Evidence**: `validate.sh --strict` output.
- [ ] **CHK-P2-006** [P2] **C-P2-006** HANDOVER-deferred §3 items 4-6 status updated from "Pending → research" to "Research converged → packet authoring next". **Evidence**: HANDOVER diff.

<!-- /ANCHOR:checklist -->
