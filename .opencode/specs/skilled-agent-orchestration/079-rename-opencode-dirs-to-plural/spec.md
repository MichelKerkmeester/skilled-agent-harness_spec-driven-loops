---
title: "Feature Specification: 096 - opencode plural-rename + post-rename review/remediation cycle"
description: "Phase parent umbrella for the entire opencode rename + 3 deep-review iterations + 3 remediation packets + 1 cli-opencode executor add. 8 phases tracking the full quality cycle from rename through release-readiness."
trigger_phrases:
  - "096 umbrella"
  - "opencode plural rename cycle"
  - "post-rename review remediation"
  - "skilled-agent-orchestration release cycle"
importance_tier: "high"
contextType: "infrastructure-quality"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural"
    last_updated_at: "2026-05-08T01:30:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Restructured 097-103 into 096 phase children (002-008); original 096 content moved to phase 001"
    next_safe_action: "Update child parent_id + packet_pointer references; update track graph-metadata; validate"
    blockers: []
    key_files:
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/001-rename-opencode-dirs/"
      - ".opencode/specs/skilled-agent-orchestration/z_archive/079-rename-opencode-dirs-to-plural/008-remediation/"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-4-7-2026-05-08"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: 096 - opencode plural-rename + post-rename review/remediation cycle

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | phase-parent (umbrella) |
| **Status** | Complete |
| **Created** | 2026-05-07 |
| **Restructured** | 2026-05-08 (merged 097-103 in as phases 002-008) |
| **Branch** | `main` |
| **Sub-phases** | 8 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. ROOT PURPOSE

Track the complete opencode plural-directory rename cycle and the cascading post-rename quality work it triggered. What started as a 1-commit bulk rename grew into 8 phases of progressively deeper review and remediation:

1. The original rename (Phase 001) shipped 11k file changes / 670k occurrences across 4 sub-phases (skills, agents, commands, symlinks).
2. The first deep-review (Phase 002) audited the rename and surfaced 22 active findings — verdict FAIL.
3. The first remediation (Phase 003) resolved all 22 findings across 7 sub-phases.
4. The second deep-review (Phase 004) confirmed the verdict-flip but surfaced 13 NEW P1s introduced by the remediation itself.
5. The second remediation (Phase 005) resolved all 13 of those P1s.
6. A new feature add (Phase 006) wired cli-opencode as a 5th deep-loop executor.
7. The third deep-review (Phase 007) confirmed the second verdict-flip but surfaced 2 P1 regressions in the executor add.
8. The third remediation (Phase 008) resolved 5 of 6 findings (1 cosmetic deferred).

The cycle is the canonical illustration of how iterative deep-review + remediation surface progressively-shallower issues and converge on release-readiness.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SUB-PHASE CONTROL FILE

| Phase | Title | Type | Findings Status |
|-------|-------|------|-----------------|
| **001** | rename-opencode-dirs-to-plural | feature (4 sub-phases inside) | Shipped — 670k occurrences across skills/agents/commands/symlinks |
| **002** | track-review (deep-review #1) | review | 1 P0 + 12 P1 + 9 P2 = 22 findings — verdict FAIL |
| **003** | 097-remediation | remediation (7 sub-phases inside) | 22/22 resolved |
| **004** | track-rereview (deep-review #2) | review | 0 P0 + 13 P1 + 6 P2 = 19 findings — verdict FAIL |
| **005** | 099-remediation | remediation | 13/13 resolved (P1-026 reducer fix included) |
| **006** | cli-opencode-executor | feature (5th deep-loop executor) | Shipped |
| **007** | track-rereview-2 (deep-review #3) | review | 0 P0 + 2 P1 + 4 P2 = 6 findings — verdict CONDITIONAL |
| **008** | 101-remediation | remediation | 5/6 resolved (P2-032 cosmetic deferred) |

Out of scope:
- Future deep-review #4 (would empirically confirm verdict-flip CONDITIONAL → PASS)
- Native advisor bridge stale-state issue (observability concern, separate)
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. PARENT-LEVEL SUCCESS CRITERIA

| ID | Requirement | Evidence path |
|----|-------------|---------------|
| REQ-001 | All 8 sub-phases reach `status: complete` | `00N-*/graph-metadata.json` |
| REQ-002 | `validate.sh --strict 096-rename-opencode-dirs-to-plural` exits 0 (recursive) | run output |
| REQ-003 | All P0 findings closed across review cycles | 0 P0 across 3 deep-reviews |
| REQ-004 | All in-scope P1 findings closed across remediation cycles | 22 + 13 + 5 = 40 P1s resolved |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. PARENT EXIT CRITERIA

- All 8 child phases marked `status: complete`.
- `bash validate.sh ... 096-rename-opencode-dirs-to-plural --strict` exit 0 recursively.
- 40 P1+P0 findings closed; 1 P2 cosmetic deferred (P2-032).
- Track release-ready pending optional deep-review #4 confirmation.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. PARENT-LEVEL RISKS

| Type | Item | Mitigation |
|------|------|------------|
| Risk | Nested phase parents (003, 008 nest deeper) | validate.sh handles nesting; tested |
| Risk | Cross-phase references after restructure | All packet_pointer/parent_id updated in restructure |
| Risk | Future deep-review #4 surfaces new regressions | Track is iterative-by-design; new packet would extend the cycle |
<!-- /ANCHOR:risks -->

---

## RELATED DOCUMENTS

- **Phase children**: `00N-<title>/spec.md` for each sub-phase
- **Track parent**: `../` (`skilled-agent-orchestration`)
- **Cycle origin**: 001 (the bulk rename that triggered the entire cycle)
- **Latest state**: 008 (most recent remediation)
