---
title: "Tasks: Extraction data fixes (stop feeding the AI fake or missing data) [template:level_2/tasks.md]"
description: "Fix the extraction bugs that hand the WRITE phase fabricated defaults or empty fields, which it then writes about as if real. Covers the focus-consistent default, interaction capture off by default, dead a11y-async code, clustering/variant/component/shadow/contrast/motion corrections, the coverage-election pre-gate, and the un-audited detector modules."
trigger_phrases:
  - "extraction data fixes"
  - "focus consistent bug"
  - "interaction capture default"
  - "coverage election pre-gate"
  - "clustering accuracy"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/152-sk-design-md-generator/002-extraction-data-fixes"
    last_updated_at: "2026-06-22T00:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Scaffolded phase 002 from research Phase 1"
    next_safe_action: "Capture baseline then implement T001 focus+interaction fix"
    blockers: []
    key_files:
      - ".opencode/skills/sk-design-md-generator/tool/scripts/validate.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "session-152-002"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "Phase scope derived from research/research.md (50-iteration deep-research loop)"
---
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->
# Tasks: Extraction data fixes (stop feeding the AI fake or missing data)

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

- [ ] T002 (P0 extraction fixes) [P] Replace focus-indicator empty-return with `{captured:false}` + update all consumers (regression test: empty focus → not consistent)
- [ ] T003 (P0 extraction fixes) Flip interaction default ON; add `--fast-no-interaction`; fix findInteraction component key (test: hover diff attaches)
- [ ] T004 (P0 extraction fixes) [P] Wire `extractA11yAsync` per-page with cssAnalyses; delete dead a11y duplicate (test: 5 a11y fields populate)
- [ ] T005 (P0 extraction fixes) Add coverage-election pre-gate `pagesCoverage<0.3→L3`; fix per-page frequency; KEEP deltaE<3 (test: anobel 0 wrongful merges, #646464 excluded)
- [ ] T006 (P1 clustering/classification quality) [P] classifyVariant: remove default-to-Primary; add Outline/Tertiary/Link branches; OKLCH-hue Destructive check
- [ ] T007 (P1 clustering/classification quality) [P] Generalize component geometric thresholds (Badge/Card)
- [ ] T008 (P1 clustering/classification quality) Delete classifyShadow inline duplicate; single exported source
- [ ] T009 (P1 clustering/classification quality) Touch-target/min-font visibility guards (skip hidden/1px)
- [ ] T010 (P1 clustering/classification quality) Merge motion across all cssAnalyses (not page 0 only)
- [ ] T011 (P1 clustering/classification quality) Lift contrast-pair cap; swap §9 source to DOM-derived pairs
- [ ] T012 (Detector-module audit) [P] Audit icon-detect / framework-detect / dark-mode-detect for default-fabrication; return honest absent
- [ ] T013 (Detector-module audit) Add regression tests for each detector's empty-input behavior

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Capture baseline (tool tests + anobel/gold-standard snapshots) BEFORE changes
- [ ] T015 Re-extract anobel + 4 gold-standard; diff token counts + section coverage; review deltas
- [ ] T016 `validate.sh --strict` + `package_skill.py --check`

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
- Research: `../research/research.md` §6 (Phase 1) + §2.1
- Parent: `../spec.md` (Phase Documentation Map)
<!-- /ANCHOR:cross-refs -->

---

