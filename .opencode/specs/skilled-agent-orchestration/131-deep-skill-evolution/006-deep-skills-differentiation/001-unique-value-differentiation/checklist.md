---
title: "Checklist: Deep Skills Unique-Value Differentiation Analysis"
description: "Verification gates for the 10-iter deep-research differentiation packet."
trigger_phrases:
  - "deep skills checklist"
importance_tier: "important"
contextType: "research"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation"
    last_updated_at: "2026-05-23T06:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Author checklist.md"
    next_safe_action: "Dispatch deep-research iter-001"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

# Checklist: Deep Skills Unique-Value Differentiation Analysis

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify + level3-arch | v2.2 -->

## Gates

- [ ] G1: `research/deep-research-config.json` records executor cli-devin / model swe-1.6 / permission dangerous / dimensions ≥ 6
- [ ] G2: ≥ 10 iter files OR convergence-before-10 with `research/deep-research-state.jsonl` `converged=true`
- [ ] G3: `research/findings-registry.json` ≥ 25 distinct fingerprints
- [ ] G4: `research/research.md` includes §contract-surfaces, §overlap-inventory, §fixture-routing, §strategy-options, §recommendation, §parity-invariants
- [ ] G5: `decision-record.md` records ≥ 3 ADRs including 1 routing-rule ADR + 1 parity-invariant ADR
- [ ] G6: `implementation-summary.md` Status=Completed, completion_pct=100, evidence cited
- [ ] G7: `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/skilled-agent-orchestration/131-deep-skill-evolution/006-deep-skills-differentiation/001-unique-value-differentiation --strict` exit 0
- [ ] G8: No zombie daemons after run (`ps aux | grep "devin|codex|deep-research"` clean)

## Requirements Coverage

- [ ] REQ-001 — convergence or iter-010 reached + ≥ 3 ADRs (evidence: research/research.md + decision-record.md)
- [ ] REQ-002 — routing rule with ≥ 3 fixtures (evidence: decision-record.md routing-rule ADR)
- [ ] REQ-003 — overlap inventory ≥ 6 points (evidence: research.md §overlap-inventory)
- [ ] REQ-004 — parity invariants ≥ 2 (evidence: decision-record.md parity-invariant ADR)

## Success Criteria

- [ ] SC-001 — 10 iters complete OR converged early
- [ ] SC-002 — explicit verdict in decision-record.md
- [ ] SC-003 — ≥ 6 fixture prompts annotated
- [ ] SC-004 — strict validate exit 0
