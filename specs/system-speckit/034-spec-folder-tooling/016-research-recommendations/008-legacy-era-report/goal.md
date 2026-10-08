---
title: "Goal: Legacy-era report and detection"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/008-legacy-era-report"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "bd2aa56c-623b-43f8-a2ef-69a13c32d626"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Legacy-era report and detection

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build a unified, read-only packet classifier that detects five pre-v4 signals with one shared classifier using explicit exclusion filtering and header alias normalization, enabling the era report to feed detection results into /doctor:update check, upgrade-legacy preflight, and the weekly corpus sweep.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | One shared packet classifier with explicit exclusion list covering research lineages, scratch, changelog, and git-ignored paths to prevent counting containment copies |
| D2 | Header alias table normalizes drifting spellings (impl-summary-core, implementation-summary-core, implementation-summary, resource-map variants) for correct document routing |
| D3 | Read-only analysis module with no mutations, fed into three entry points: /doctor:update check (layout and signal counts), upgrade-legacy preflight (frontmatter findings), weekly sweep (optional era context) |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] PacketClassifier walks a 20-packet fixture and counts every packet exactly once (exit 0 from unit test)
- [ ] Exclusion list filters research lineages, scratch, changelog, and git-ignored paths (exit 0 from four exclusion test cases)
- [ ] Layout detection returns correct v3 vs v4 classification for both layouts (exit 0 from layout test cases)
- [ ] Era report runs consistently and produces the same packet count across multiple invocations on the same input
- [ ] Header aliases normalize all implementation-summary spelling variants to canonical name (exit 0 from alias test cases)
- [ ] Five independent signal detectors work on pre-v4 fixture examples and all signals are counted (exit 0 from signal detector tests)
- [ ] Latest spec-kit CLI test suite passes with no new failures (exit 0 from npm run test -- spec-kit)

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents written | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md |
| Validation status | Pending | repair-derived and validate.sh to run |
| Goal binding in parent | Done | Parent goal.md:71 lists SH-09 | 008-legacy-era-report/goal.md |

### Deviations and findings

| Item | Note |
|------|------|
| (none yet) | (Phase is planned, not yet executed) |
<!-- /ANCHOR:log -->
