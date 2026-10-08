---
title: "Goal: Phase 6 evidence-gated-provenance"
description: "Make template version stamping evidence-gated so no document receives a version stamp without exact anchor signature match proof."
trigger_phrases:
  - "phase 6 evidence gated provenance goal"
  - "packet goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/006-evidence-gated-provenance"
    last_updated_at: "2026-10-08T12:00:00Z"
    last_updated_by: "claude"
    recent_action: "Authored the planning documents"
    next_safe_action: "Build against the completion criteria"
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
# Goal: Phase 6 evidence-gated-provenance

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make provenance stamping evidence-gated: retire `--auto-upgrade`, and let heal-spec-docs stamp a template header only on an exact match against the anchor set rendered for the document's level, so no document receives invented history.

### Decisions

Frozen choices, decided 2026-10-08 by the operator. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `check-template-staleness.sh --auto-upgrade` is retired. For one release the flag prints "removed, use upgrade-legacy" and exits 2 |
| D2 | The dead `quality-audit.sh --fix` branch is removed or pointed at upgrade-legacy |
| D3 | heal-spec-docs stamps only on exact equality with the anchor set rendered for the document's level |
| D4 | No marker or comment is added to unknown-provenance documents |
| D5 | Built in wave 2 by DeepSeek V4.1 Flash max through cli-pi on the OpenCode Go route: `SYSTEM_SPEC_GATE_ENFORCE=0 AI_SESSION_CHILD=1 PI_BLACKHOLE_PASSIVE=true pi -p "<brief>" --model opencode-go/deepseek-v4.1-flash --thinking max --mode text --offline </dev/null`. One task from tasks.md per brief, in task order, and the diff is checked before the next brief |
| D6 | Reviewed read-only by Luna max fast through cli-codex with `--sandbox read-only`. The builder applies a finding only after confirming it in the code, for at most two rounds |
| D7 | The builder writes only the files in spec.md Files to Change, its tests and this folder. The orchestrator reverts any other write |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] A Vitest case runs `check-template-staleness.sh --auto-upgrade` on a fixture and sees "removed, use upgrade-legacy", exit code 2 and an unchanged file
- [ ] A Vitest case shows heal-spec-docs stamps an exact level match and refuses a superset and a subset, exit code 0
- [ ] `rg -n "auto-upgrade" .skilled/skills/system-spec-kit/runtime/cli/spec/quality-audit.sh` finds nothing
- [ ] MIGRATION.md states the never-invent-history rule, verified by grep
- [ ] `validate.sh --strict` on this packet prints RESULT: PASSED

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Planning documents written | Done | spec.md, plan.md, tasks.md, acceptance-criteria.md, implementation-summary.md all completed |
| Repair-derived and goal checks | Done | Both passed after goal.md creation |

### Deviations and findings

| Item | Note |
|------|------|
| Auto-upgrade decided | 2026-10-08, the operator chose to retire the flag. Restricting it was considered because outside scripts might pass it, and rejected because with no version bump the flag has nothing left to write. The one-release loud failure covers outside callers |
| Unknown-provenance marker decided | 2026-10-08, the operator chose no marker, because adding one is the rewrite MIGRATION.md forbids |
| Level-aware comparison | The healer's fixed signatures list only Level 1 spec anchors, so the exact comparison uses the level's rendered anchor set |
<!-- /ANCHOR:log -->

---

