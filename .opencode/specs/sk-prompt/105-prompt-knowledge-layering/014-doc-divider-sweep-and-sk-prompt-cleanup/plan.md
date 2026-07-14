---
title: "Implementation Plan: doc-divider-sweep-and-sk-prompt-cleanup"
description: "Deterministic fence-aware divider insertion across the 5 cli skills' reference/asset docs, plus surgical removal of stale card references from sk-prompt SKILL.md, verified by content-skeleton diff and an adversarial per-skill workflow audit."
trigger_phrases:
  - "divider sweep plan"
  - "fence-aware divider insertion"
  - "sk-prompt card scrub"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/105-prompt-knowledge-layering/014-doc-divider-sweep-and-sk-prompt-cleanup"
    last_updated_at: "2026-06-03T12:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Dividers applied + verified; sk-prompt SKILL.md scrubbed"
    next_safe_action: "Validate then commit phase 014"
    blockers: []
    key_files:
      - ".opencode/skills/sk-prompt/SKILL.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "e02c3e95-f865-4fec-8ff8-0a7907486924"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: doc-divider-sweep-and-sk-prompt-cleanup

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
| **Testing** | Deterministic Python scout + content-skeleton diff + adversarial workflow audit + `validate.sh --strict` |

### Overview
Insert the sk-doc `---` divider before every non-first H2 across the 5 cli skills' reference/asset
docs using a fence-aware deterministic script, then scrub the four stale `cli_prompt_quality_card.md`
references left in `sk-prompt/SKILL.md` after the phase-013 relocation. Edits are proven safe by a
content-skeleton diff (only blank/`---` lines may be added) and double-checked by a per-skill
adversarial workflow.
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
- [x] Verification passing (scout 0 gaps, skeleton diff clean, workflow PASS, validate --strict exit 0)
- [x] Docs updated (spec/plan/tasks/implementation-summary)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Deterministic transform plus adversarial verification.

### Key Components
- **divider_fix.py**: fence-aware insertion of `---` before non-first H2s; dry-run and apply modes.
- **divider_scout.py**: counts gaps per file (H2s lacking a preceding `---`); the 0-gap acceptance check.
- **content-skeleton diff**: strips blank and `---`-only lines, then diffs each swept file against HEAD; empty output proves no content line changed.
- **verify-cli-dividers workflow**: 5 agents, one per cli skill, adversarially re-audit divider placement.

### Data Flow
Scout finds gaps, fixer inserts dividers bottom-up, scout re-confirms 0 gaps, skeleton diff confirms content untouched, workflow confirms placement semantics.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Scout the 5 cli skills for H2 divider gaps (25 files, 188 gaps)
- [x] Confirm the sk-doc divider rule against the canonical card and template_rules.json

### Phase 2: Core Implementation
- [x] Dry-run the fence-aware fixer and audit all 188 insertion points
- [x] Apply the fixer to the swept files
- [x] Scrub the 4 stale card references from sk-prompt/SKILL.md; renumber §8/§9; bump version 2.1.1.0

### Phase 3: Verification
- [x] Re-scout: 0 gaps
- [x] Content-skeleton diff: clean for the 22 pure-divider files; 3 entangled WIP files isolated
- [x] Adversarial workflow audit: PASS for all 5 skills
- [x] `validate.sh --recursive --strict` exit 0; card-sync guard green
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Deterministic | Divider gap count | `divider_scout.py` |
| Deterministic | Content preservation | content-skeleton diff vs HEAD |
| Adversarial | Divider placement semantics | `verify-cli-dividers` workflow (5 agents) |
| Structural | Spec-folder + doc templates | `validate.sh --recursive --strict`, card-sync guard |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| sk-doc divider rule | Internal | Green | Defines the target structure |
| Workflow tool | Internal | Green | Adversarial verification fan-out |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Workflow audit FAIL, skeleton diff shows content change, or validate --strict non-zero.
- **Procedure**: `git checkout -- <file>` reverts a swept file to HEAD; the fixer is idempotent and re-runnable.
<!-- /ANCHOR:rollback -->
