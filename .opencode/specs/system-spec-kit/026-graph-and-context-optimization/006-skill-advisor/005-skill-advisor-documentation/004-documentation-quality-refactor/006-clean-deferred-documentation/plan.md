---
title: "Implementation Plan: 006-clean-deferred-documentation"
description: "Phased execution for the Tier A+B+C-subset deferred backlog closure."
trigger_phrases:
  - "006 deferred cleanup plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/006-skill-advisor/005-skill-advisor-documentation/004-documentation-quality-refactor/006-clean-deferred-documentation"
    last_updated_at: "2026-05-16T00:00:00Z"
    last_updated_by: "claude-opus-4-7-1m"
    recent_action: "Authored plan"
    next_safe_action: "Begin Tier A"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "006-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Implementation Plan: 006-clean-deferred-documentation

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + JSON config |
| **Framework** | sk-doc validation + grep verification + sed bulk-edit |
| **Storage** | n/a |
| **Testing** | `validate.sh --strict`, recursive grep gates |

### Overview
Sequential closure: Tier A small edits, Tier B re-verify, Tier C Oxford sweep, validate, refresh parent metadata.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 001 research.md ships with deferred catalog
- [x] Children 002-005 ship plus their Known Limitations enumerate the deferred items
- [x] Tier scope confirmed via user AskUserQuestion

### Definition of Done
- [ ] Oxford comma count drops to 0
- [ ] F30 + F33 changes verified
- [ ] Tier B paths confirmed
- [ ] `validate.sh --strict` passes on 006
- [ ] Parent metadata refreshed
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Surgical doc edits plus one mechanical sed sweep. No code or runtime changes.

### Key Components
- `skill-graph-extraction-plan.md` (F30 target)
- 3 playbook scenario files (F33 targets)
- INSTALL_GUIDE.md (Tier B conditional)
- All advisor `*.md` files excluding changelog (Oxford sweep target)

### Data Flow
n/a
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scaffold 006 packet
- [x] Strict-validate scaffold

### Phase 2: Core Implementation
- [ ] Tier A: F30 cross-link conversions in skill-graph-extraction-plan.md (3 edits)
- [ ] Tier A: F33 SOURCE FILES sections in 3 playbook scenarios
- [ ] Tier B: re-verify F23/F24/F44 paths; conditional INSTALL_GUIDE edit
- [ ] Tier C: bulk Oxford comma sweep via sed

### Phase 3: Verification
- [ ] Run validate.sh --strict on 006
- [ ] Re-grep Oxford comma count (expect 0)
- [ ] Re-grep F30 pattern (expect 0)
- [ ] Spot-check 5 random files for grammar after Oxford sweep
- [ ] Refresh parent metadata (graph-metadata.json + spec.md PHASE MAP)
- [ ] Update implementation-summary.md verification table
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Strict validate | 006 + parent + all siblings | `validate.sh --strict` |
| Pattern grep | Oxford, F30 plain-text | `rg`, `grep` |
| Manual spot-check | 5 random files post-sweep | Read |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| 001 research.md catalog | Internal | Green | n/a (already shipped) |
| Children 002-005 Known Limitations | Internal | Green | Source-of-truth for what was deferred |
| Sibling 001-native-recommend-happy-path.md SOURCE FILES block | Internal | Green | F33 template |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Oxford sweep introduces grammar regressions detected in spot-check
- **Procedure**: Per-file `git checkout --` to revert sweep on that file; investigate the pattern; refine regex; re-run
<!-- /ANCHOR:rollback -->
