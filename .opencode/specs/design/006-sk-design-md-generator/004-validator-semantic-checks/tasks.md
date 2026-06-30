---
title: "Tasks: Validator semantic checks (make the checker see prose) [template:level_2/tasks.md]"
description: "Extend validate.ts beyond hex/section-header checks so it can detect prose fabrication: a section-coverage report, a prose-discipline check, non-color stability gating, source-sentinel provenance, and a values-vs-claims score split."
trigger_phrases:
  - "validator prose checks"
  - "section coverage report"
  - "non-color stability gating"
  - "source sentinel provenance"
  - "dual score split"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "design/006-sk-design-md-generator/004-validator-semantic-checks"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 004 from research Phase 3"
    next_safe_action: "Implement checkSectionCoverage first (mechanical hallucination detector)"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-004"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Validator semantic checks (make the checker see prose)

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

No completion claim without the `validate.ts`/`vitest` regression evidence named in the task.
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Capture baseline (tool tests + anobel/gold-standard extraction snapshots) BEFORE any change

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T002 (Mechanical detector + score) Implement checkSectionCoverage (section→field map, isEmpty, inventionRisk) + SectionCoverageReport type
- [ ] T003 (Mechanical detector + score) Split score into valuesScore + claimsScore; update printResult + exit logic
- [ ] T004 (Mechanical detector + score) Tests: OLD anobel stub flagged; corrected anobel clean
- [ ] T005 (Guarded prose checks) [P] Prose-discipline check (banned adjectives, numeric-anchor suppression, WARNING-tier)
- [ ] T006 (Guarded prose checks) [P] Source-sentinel provenance (parse markers, resolve path, WARNING-tier)
- [ ] T007 (Guarded prose checks) Extend checkStabilityGating to shadows/gradients/components/radii/typography
- [ ] T008 (Guarded prose checks) False-positive guard tests for each

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T009 vitest for every new check
- [ ] T010 Run against OLD stub + corrected anobel + gold-standard examples
- [ ] T011 validate.sh --strict

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

All P0 tasks `[x]` with regression evidence; anobel + gold-standard re-extraction deltas reviewed; `validate.sh --strict` + `package_skill.py --check` green; the two known hallucinations no longer have fabricated backing data.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- Spec: `spec.md` | Plan: `plan.md` | Checklist: `checklist.md`
- Research: `../research/research.md` §6 (Phase 3) + §2.3
- Parent: `../spec.md` (Phase Documentation Map)
<!-- /ANCHOR:cross-refs -->

---

