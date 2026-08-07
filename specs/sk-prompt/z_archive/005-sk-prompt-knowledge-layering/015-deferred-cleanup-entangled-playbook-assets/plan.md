---
title: "Implementation Plan: deferred-cleanup-entangled-playbook-assets"
description: "Verify-then-land the 3 entangled cli docs, repoint the sk-prompt playbook card paths to the hub, and remove the asset leading divider, with content-skeleton and grep verification."
trigger_phrases:
  - "deferred cleanup plan"
  - "entangled landing plan"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/005-sk-prompt-knowledge-layering/015-deferred-cleanup-entangled-playbook-assets"
    last_updated_at: "2026-06-03T13:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Entangled docs landed; playbook repointed; asset dividers removed"
    next_safe_action: "Validate then commit phase 015"
    blockers: []
    key_files:
      - ".opencode/skills/cli-devin/references/cli_reference.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: deferred-cleanup-entangled-playbook-assets

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown documentation (sk-doc templates) |
| **Framework** | None |
| **Storage** | None |
| **Testing** | Content-skeleton diff, path-resolution grep, first-H2 check, `validate.sh --strict` |

### Overview
Verify each entangled doc's content edit against the authoritative source before landing it, then
apply two deterministic mechanical passes: repoint the playbook card paths to the hub, and remove
the asset leading divider. Verification is grep plus content-skeleton diff plus the strict divider
scout.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Each entangled edit reviewed against an authoritative source
- [x] Exact path-replacement strings identified
- [x] Asset leading-divider rule confirmed from the asset template

### Definition of Done
- [x] All acceptance criteria met
- [x] Verification passing (skeleton diff, grep, first-H2 check, strict scout, validate --strict)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Verify-then-land plus deterministic mechanical cleanup.

### Key Components
- **cli-devin README cross-check**: confirms Devin has 2 permission modes, proving the typo dedup is correct.
- **sed path repoint**: two exact-string replacements across the playbook tree.
- **asset_lead_rm.py**: removes the leading `---` before section 1 in the 6 asset docs.
- **content-skeleton diff + strict scout**: prove no content lost and between-H2 dividers intact.

### Data Flow
Review entangled edits, land them, repoint playbook paths, remove asset leading dividers, verify everything deterministically.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Cross-check the cli-devin permission-mode count against the README (2 modes confirmed)
- [x] Verify the quota-fallback repoint target path exists and the old does not
- [x] Enumerate the 9 dangling playbook card paths and the 6 asset leading dividers

### Phase 2: Core Implementation
- [x] Add the version-drift wording fix to cli-devin/cli_reference.md (2-mode)
- [x] Repoint the 9 playbook card paths to the hub
- [x] Remove the leading `---` from the 6 asset docs
- [x] Version bumps + changelogs for the 6 affected skills

### Phase 3: Verification
- [x] Content-skeleton diff on the 3 entangled docs shows only intended content edits
- [x] grep: 0 old card paths in the playbook; both hub paths resolve
- [x] first-H2 check: 6 assets carry no leading `---`; strict scout +0
- [x] `validate.sh --recursive --strict` exit 0; card-sync guard green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deterministic | Entangled content safety | content-skeleton diff vs HEAD |
| Deterministic | Playbook path resolution | grep + `ls` resolve check |
| Deterministic | Asset leading divider | `first_h2_check.py` + strict scout |
| Structural | Spec-folder + guard | `validate.sh --recursive --strict`, card-sync guard |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| cli-devin README (mode count) | Internal | Green | Source of truth for the permission-mode fix |
| Phase 013 card relocation | Internal | Green | Defines the hub card path the playbook repoints to |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: skeleton diff shows unintended content change, a playbook path fails to resolve, or validate --strict non-zero.
- **Procedure**: `git checkout -- <file>` reverts a file to HEAD; each pass is idempotent and re-runnable.
<!-- /ANCHOR:rollback -->
