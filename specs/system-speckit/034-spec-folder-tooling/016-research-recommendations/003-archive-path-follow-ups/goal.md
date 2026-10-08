---
title: "Goal: Archive path follow-ups"
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
    packet_pointer: "system-speckit/034-spec-folder-tooling/016-research-recommendations/003-archive-path-follow-ups"
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
# Goal: Archive path follow-ups

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Confirm tool agreement on archive current-location semantics with a round-trip validator test.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Current-location semantics already implemented by Phase 15: recorded paths are derived facts, and git history keeps provenance. |
| D2 | Tools already agree: repair-derived does not freeze archives, heal-spec-docs skips archives, migrate-generated-json walks and re-derives them, upgrade-legacy repairs them. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Build-dependent:
- [ ] Fixture test archives a packet, restores it, validates: `npx vitest run tests/archive-track.vitest.ts` shows test passing
- [ ] Heal-spec-docs.cjs: `grep -n "z_archive" .skilled/skills/system-spec-kit/runtime/cli/spec/heal-spec-docs.cjs` lists z_archive in SKIP_DIRS (line 40) with documentation comment

Confirmation (already in place from phase 015):
- [ ] Repair-derived.cjs: `grep -A5 "FROZEN_TREES" .skilled/skills/system-spec-kit/runtime/cli/spec/repair-derived.cjs` shows `['node_modules', '.git', 'scratch']` only
- [ ] Migrate-generated-json.ts: `grep -n "z_archive\|archive" .skilled/skills/system-spec-kit/runtime/cli/graph/migrate-generated-json.ts` shows walk and re-derive (lines 25-27, 72-74)
- [ ] Upgrade-legacy.mjs: `grep -n "repairArchived" .skilled/skills/system-spec-kit/runtime/cli/spec/upgrade-legacy.mjs` shows repair function (lines 419-429)
- [ ] README-repair-derived.md: Section 6 documents archive scope under current-location (lines 127-144)
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
| Fixture test added | Pending | New test case in archive-track.vitest.ts |
| Tool audit completed | Pending | Grep for archive policy mentions in all four tools |
| Documentation alignment | Pending | README-repair-derived.md section 6 updated |
| Suite validation | Pending | npm test passes with 0 failures |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | Planning phase, awaiting implementation |

<!-- /ANCHOR:log -->
