---
title: "Feature Specification: Phase 007 Deep Review Remediation"
description: "Remediate Packet 070 deep review findings by restoring source-side sk-deep-* rename narratives, replacing stale changelog symlinks, tuning advisor review-loop routing, and documenting approved deferrals."
trigger_phrases:
  - "070 phase 007"
  - "deep review remediation"
  - "sk-deep-review to deep-review"
  - "sk-deep-research to deep-research"
  - "iterative review loop"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/031-sk-deep-rename/007-deep-review-remediation"
    last_updated_at: "2026-05-05T17:10:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Initialized Phase 007 remediation artifacts"
    next_safe_action: "Apply P0/P1 remediation patches and run strict validation"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "graph-metadata.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-007"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Feature Specification: Phase 007 Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-05-05 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `070-sk-deep-rename` |
| **Phase** | 007 of 007 |
| **Handoff Criteria** | P0 narrative self-renames are fixed, changelog symlinks point at renamed skill folders, advisor graph signals distinguish iterative deep review from single-pass code review, approved deferrals are recorded, and child/parent strict validation pass |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The Packet 070 deep review failed because child phase documentation still contains over-replaced identity-renames such as `deep-review to deep-review`. The same review also found broken changelog symlinks and an advisor routing ambiguity where iterative review-loop prompts can prefer `sk-code-review` over `deep-review`.

### Purpose
Phase 007 remediates the active P0 and in-scope P1 findings without broadening into deferred graph-family or unrelated `sk-code` metadata work.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Author Phase 007 Level 2 remediation artifacts.
- Restore historical source-side rename narrative in approved Phase 002, 003, and 004 child docs and metadata.
- Replace stale `.opencode/changelog/sk-deep-*` symlinks with `.opencode/changelog/deep-*` symlinks.
- Add positive `deep-review` signals and `sk-code-review` anti-signals for iterative review-loop prompts.
- Document approved deferrals for P1-003 and P1-004 in `decision-record.md`.
- Update parent `graph-metadata.json` child list to include Phase 007.
- Run targeted grep, symlink, JSON, and strict spec validation checks.

### Out of Scope
- Renaming the internal `sk-deep` family bucket in `skill-graph.json`.
- Fixing `.opencode/skills/sk-code/graph-metadata.json` entity kind validation.
- Editing runtime mirrors, archives, databases, or any files outside the approved write set.
- Running advisor rebuild; the orchestrator owns the MCP rebuild after this JSON source patch.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/007-deep-review-remediation/spec.md` | Create | Phase 007 scope and requirements |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/007-deep-review-remediation/plan.md` | Create | Remediation execution plan |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/007-deep-review-remediation/tasks.md` | Create/Update | Finding-level task ledger |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/007-deep-review-remediation/checklist.md` | Create/Update | Level 2 verification checklist |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/007-deep-review-remediation/decision-record.md` | Create | Deferral decisions for P1-003 and P1-004 |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/007-deep-review-remediation/implementation-summary.md` | Create | Final remediation summary |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/007-deep-review-remediation/graph-metadata.json` | Create | Canonical graph metadata |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/graph-metadata.json` | Update | Add Phase 007 child ID |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/002-skill-folder-rename/{spec.md,plan.md,tasks.md,implementation-summary.md,graph-metadata.json}` | Update | P0 narrative restoration |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/003-opencode-internals/{spec.md,graph-metadata.json}` | Update | P0 narrative restoration |
| `specs/skilled-agent-orchestration/z_archive/056-sk-deep-rename/004-runtime-mirrors/{spec.md,graph-metadata.json}` | Update | P0 narrative restoration |
| `.opencode/changelog/` | Update | Replace stale symlinks |
| `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json` | Update | Advisor signal tuning |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Restore source-side rename narrative | Grep for `deep-review to deep-review` and `deep-research to deep-research` under phases 002/003/004 returns zero rows |
| REQ-002 | Keep remediation scoped | Git diff touches only approved files and `.opencode/changelog` symlink entries |
| REQ-003 | Validate spec artifacts | Phase 007 and parent strict validation exit 0 |

### P1 - Required or Deferred

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Replace stale changelog symlinks | `deep-review` and `deep-research` symlinks point to renamed skill changelog folders; old `sk-deep-*` symlinks are absent |
| REQ-005 | Tune advisor routing source | `skill-graph.json` parses and includes requested positive/anti-signal strings |
| REQ-006 | Record deferral decisions | `decision-record.md` documents P1-003 and P1-004 with rationale and future cleanup path |
| REQ-007 | Preserve existing graph source shape | Signal additions do not rename the `sk-deep` family bucket or rebuild generated databases |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: P0 self-rename grep returns zero rows across Phase 002, 003, and 004 markdown and JSON files.
- **SC-002**: `.opencode/changelog/deep-review` and `.opencode/changelog/deep-research` resolve to renamed skill changelog paths.
- **SC-003**: JSON assertion confirms `iterative review loop` exists in both `signals.deep-review` and `anti_signals.sk-code-review`.
- **SC-004**: `decision-record.md` captures P1-003 and P1-004 as deferred, not silently ignored.
- **SC-005**: Phase 007 and parent packet strict validation both exit 0.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Overcorrecting legitimate new-name requirements | Medium | Patch only self-rename and old-identifier narrative contexts |
| Risk | Symlink creation leaves old aliases | Medium | Remove `sk-deep-*` symlinks before creating `deep-*` links |
| Risk | Advisor JSON source is dirty before this phase | Medium | Read current JSON and add only requested signal strings |
| Dependency | Orchestrator advisor rebuild | Medium | Leave rebuild to orchestrator after JSON source patch |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

No open questions. P1-003 and P1-004 are approved deferrals for this phase.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- **Scope Safety**: No edits outside the approved write set.
- **Traceability**: Each review finding maps to one task and one verification item.
- **Data Integrity**: JSON files parse after patching.
- **Searchability**: Phase metadata keeps both old source names and new target names where useful.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- Path-style narratives should say `sk-deep-review/` to `deep-review/`, not `deep-review/` to `deep-review/`.
- New canonical-state requirements can legitimately mention only `deep-review` and `deep-research`; those are not P0 narrative defects.
- The internal `sk-deep` family bucket is intentionally left unchanged by this phase.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Axis | Rating | Reason |
|------|--------|--------|
| File Count | Medium | Multiple spec docs plus one JSON graph source and symlink entries |
| Behavioral Risk | Low | No runtime behavior changes; advisor source signal tuning only |
| Verification Risk | Low | Requested checks are deterministic grep, readlink, JSON parse, and strict validation |
| Coordination Risk | Medium | Advisor rebuild is intentionally delegated to orchestrator after this phase |
<!-- /ANCHOR:complexity -->
