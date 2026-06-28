---
title: "Implementation Plan: Phase 8: validate-sweep-changelog-reindex [template:level_1/plan.md]"
description: "Final completion sweep for spec 130: validate all phases recursively, confirm duplication guard GREEN, verify data<->prose round-trip for 8 model profiles, write changelogs, reindex skill advisor."
trigger_phrases:
  - "130 phase 8 plan"
  - "validate sweep plan"
  - "prompt knowledge layering phase 8"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/130-prompt-knowledge-layering/008-validate-sweep-changelog-reindex"
    last_updated_at: "2026-06-02T18:30:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Plan complete"
    next_safe_action: "None — phase complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "008-validate-sweep-changelog-reindex-complete"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 8: validate-sweep-changelog-reindex

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Bash, Python 3, JSON |
| **Framework** | spec-kit validate.sh, check-prompt-quality-card-sync.sh, skill_graph_compiler.py |
| **Storage** | None (file-system checks only) |
| **Testing** | validate.sh --strict (exit 0 = pass), duplication guard (exit 0 = pass) |

### Overview
Phase 8 is a pure verification and documentation sweep — no new skill content is authored here. The plan runs in three ordered stages: (1) setup and scoping, (2) executing the three machine checks (recursive validate, duplication guard, data-to-prose round-trip), and (3) writing the phase-008 completion docs and refreshing the skill-advisor index. All three checks must exit 0 before docs are marked complete.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [x] All acceptance criteria met
- [x] Tests passing (validate.sh --strict exits 0; duplication guard exits 0)
- [x] Docs updated (spec/plan/tasks/implementation-summary all populated)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verification sweep — no new architecture introduced.

### Key Components
- **validate.sh**: spec-kit validator; recursive mode checks all child phase folders
- **check-prompt-quality-card-sync.sh**: duplication guard for framework and CLEAR tables across 5 cli-* cards
- **model-profiles.json + profile .md files**: data-to-prose round-trip target

### Data Flow
`validate.sh` reads spec-folder docs -> shell exits 0 or 2. `check-prompt-quality-card-sync.sh` greps 5 cli-* card files -> exits 0 if none inline forbidden tables. Round-trip check: `model-profiles.json[*].recommended_frameworks.profile_ref` -> `os.path.exists()` on the target `.md` file.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `sk-prompt/assets/model-profiles.json` | Data source — `recommended_frameworks` for 8 active models | Unchanged in this phase; read-only verification | `python3` field-presence check |
| `sk-prompt-models/references/models/*.md` | Prose profiles — round-trip targets | Unchanged in this phase; read-only verification | `os.path.exists()` for all 8 paths |
| `cli-*/assets/prompt_quality_card.md` (5 files) | Executor cards — must NOT inline framework or CLEAR tables | Unchanged in this phase; read-only verification | `check-prompt-quality-card-sync.sh` |
| `system-skill-advisor/mcp_server/scripts/skill-graph.json` | Advisor routing index | Reindex target | `skill_graph_compiler.py` run; mtime updated |
| `008-validate-sweep-changelog-reindex/` spec docs | Phase completion record | Populated (this phase) | `validate.sh --strict` exits 0 |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm prior phases have existing (non-template) implementation-summary.md files
- [x] Identify touched skill files to scope changelog entries
- [x] Confirm sync-checker script path and coverage

### Phase 2: Core Implementation
- [x] Run `validate.sh --strict` on 008 child — exit 0
- [x] Run `check-prompt-quality-card-sync.sh` — guard GREEN, exit 0
- [x] Verify `recommended_frameworks` field on all 8 active models in model-profiles.json
- [x] Verify all 8 `profile_ref` paths resolve to existing `.md` files

### Phase 3: Verification
- [x] Populate phase-008 spec-folder completion docs (this file + spec.md + tasks.md + implementation-summary.md)
- [x] Set `derived.status` to "complete" in graph-metadata.json
- [x] Run final `validate.sh --strict` on 008 child — confirm exit 0
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Structural | Spec-folder doc completeness | validate.sh --strict |
| Duplication guard | Framework + CLEAR table not inlined in cli-* cards | check-prompt-quality-card-sync.sh |
| Round-trip | JSON profile_ref resolves to existing .md | Python os.path.exists() |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 001-007 complete | Internal | Green | Phase 8 cannot validate what was not built |
| validate.sh (spec-kit scripts) | Internal | Green | Cannot confirm spec-folder health without it |
| check-prompt-quality-card-sync.sh | Internal | Green | Duplication guard unavailable without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any P0 check returns non-0 (validate.sh or duplication guard fails)
- **Procedure**: Do not mark phase complete. Report the failing check output. Root-cause in the responsible prior phase (001-007) and re-run that phase's fix before re-running phase 008 sweep.
<!-- /ANCHOR:rollback -->

---

<!--
CORE TEMPLATE (~90 lines)
- Essential technical planning
- Simple phase structure
- Add L2/L3 addendums for complexity
-->
