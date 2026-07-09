---
title: "Implementation Plan: Phase 007 Deep Review Remediation"
description: "Execute Packet 070 review remediation in order: planning artifacts, P0 narrative restoration, changelog symlink replacement, advisor signal tuning, deferral record, and strict validation."
trigger_phrases:
  - "070 phase 007 plan"
  - "deep review remediation plan"
  - "advisor signal tuning plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/z_archive/016-sk-deep-rename/007-deep-review-remediation"
    last_updated_at: "2026-05-05T17:10:00Z"
    last_updated_by: "cli-codex"
    recent_action: "Completed Phase 007 remediation sequence"
    next_safe_action: "Orchestrator can run advisor_rebuild via MCP"
    blockers: []
    key_files:
      - "plan.md"
      - "../review/review-report.md"
      - ".opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-2026-05-05-phase-007"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Phase 007 Deep Review Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown, JSON, POSIX symlinks |
| **Framework** | Spec Kit Level 2 phase documentation and skill advisor graph source |
| **Storage** | Git-tracked specs, JSON source, and changelog symlink directory |
| **Testing** | Targeted grep, readlink, JSON parse/assertions, strict spec validation |

### Overview
Phase 007 fixes the active review failures from Packet 070 without reopening the broader rename. The sequence mirrors the review recommendation: remediate the P0 narrative first, fix in-scope P1s, record explicit deferrals, then validate the child and parent packets.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Review report read from `../review/review-report.md`.
- [x] Approved spec folder and write set supplied by user.
- [x] Existing Phase 002/003/004 files read before editing.
- [x] Existing `skill-graph.json` read before editing.

### Definition of Done
- [x] P0 identity-rename grep returns zero rows.
- [x] Changelog symlinks point at renamed skill changelog folders.
- [x] Advisor signal JSON parses and contains requested signal additions.
- [x] P1-003 and P1-004 deferrals are recorded.
- [x] Phase 007 and parent strict validation exit 0.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Small, evidence-driven remediation packet with one bounded patch per finding class and deterministic verification after all edits.

### Key Components
- **Review evidence**: `../review/review-report.md`.
- **Narrative docs**: Phase 002/003/004 spec docs and graph metadata named by P0-004.
- **Changelog links**: `.opencode/changelog/deep-review` and `.opencode/changelog/deep-research`.
- **Advisor source**: `.opencode/skills/system-spec-kit/mcp_server/skill_advisor/scripts/skill-graph.json`.
- **Deferral record**: `decision-record.md`.

### Data Flow
The review report identifies finding surfaces. Phase 007 patches only those surfaces, then verification commands produce evidence for `tasks.md`, `checklist.md`, and `implementation-summary.md`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## 4. AFFECTED SURFACES

| Finding | Surface | Action | Verification |
|---------|---------|--------|--------------|
| P0-004 | Phase 002/003/004 docs and graph metadata | Restore `sk-deep-*` as source side in rename narratives | Targeted identity-rename grep returns zero rows |
| P1-001 | `.opencode/changelog` | Replace broken old symlinks with new symlinks | `readlink` output matches renamed folders |
| P1-002 | `skill-graph.json` | Add `deep-review` positive signals and `sk-code-review` anti-signals | Python JSON assertion prints OK |
| P1-003 | `decision-record.md` | Defer internal family bucket rename | Decision record contains rationale |
| P1-004 | `decision-record.md` | Defer pre-existing `sk-code` metadata validation issue | Decision record contains rationale |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 5. IMPLEMENTATION PHASES

### Phase 1: Planning Artifact Setup
- [x] Create Phase 007 `description.json`, `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, and `graph-metadata.json`.
- [x] Add Phase 007 to parent `graph-metadata.json` children.

### Phase 2: P0 Narrative Restoration
- [x] Patch self-rename trigger phrases and narrative lines in Phase 002/003/004.
- [x] Run targeted grep for identity-renames.

### Phase 3: P1-001 Changelog Symlinks
- [x] Remove stale `sk-deep-review` and `sk-deep-research` symlinks.
- [x] Create `deep-review` and `deep-research` symlinks to renamed skill changelog folders.
- [x] Verify `ls` and `readlink` output.

### Phase 4: P1-002 Advisor Signal Tuning
- [x] Add requested positive `deep-review` signals.
- [x] Add requested `sk-code-review` anti-signals.
- [x] Parse JSON and assert both additions exist.

### Phase 5: Deferrals and Validation
- [x] Create `decision-record.md` for P1-003 and P1-004.
- [x] Create `implementation-summary.md` with final evidence.
- [x] Run child and parent strict validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 6. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Narrative grep | Phase 002/003/004 markdown and JSON | `grep -E` |
| Symlink check | `.opencode/changelog` | `ls -la`, `readlink` |
| JSON check | `skill-graph.json` | `/usr/bin/python3 -c` |
| Spec validation | Phase 007 and parent packet | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 7. DEPENDENCIES

- Phase 006 review report exists and lists actionable P0/P1 findings.
- Phase 002/003/004 child docs and graph metadata are writable.
- `.opencode/skills/deep-review/changelog` and `.opencode/skills/deep-research/changelog` exist.
- `/usr/bin/python3` is available for JSON parse and assertion checks.
- The spec validator is available under `.opencode/skills/system-spec-kit/scripts/spec/validate.sh`.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 8. ROLLBACK PLAN

If validation fails, revert only the Phase 007 patch set that caused the failure and keep review evidence intact. Changelog symlink rollback is `rm -f deep-review deep-research` followed by recreating prior links only if the user explicitly requests the old broken aliases.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

| Phase | Dependency | Notes |
|-------|------------|-------|
| 002 | Skill folder rename | Owns source-side rename narrative fixed by P0-004 |
| 003 | OpenCode internals | Owns active `.opencode` internal reference narrative fixed by P0-004 |
| 004 | Runtime mirrors | Owns runtime mirror rename narrative fixed by P0-004 |
| 006 | Advisor and validation | Produced remediation-needed review context |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Work Item | Estimate | Reason |
|-----------|----------|--------|
| Planning artifacts | Medium | Level 2 docs plus decision record and graph metadata |
| P0 narrative cleanup | Low | Explicit files and deterministic grep verification |
| Changelog symlinks | Low | Two old links removed and two new links created |
| Advisor signal tuning | Low | Single JSON source patch plus parse/assertion check |
| Validation | Medium | Child and parent strict validation required |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

The safest rollback path is hunk-local. Narrative cleanup can be reverted in the named child docs, symlinks can be recreated from `readlink` evidence, and advisor signal changes can be removed from the JSON arrays without touching the deferred `sk-deep` family bucket.
<!-- /ANCHOR:enhanced-rollback -->
