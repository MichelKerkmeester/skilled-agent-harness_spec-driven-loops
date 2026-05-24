---
title: "Implementation Plan: full strict evergreen-citation sweep across the deep-* skills"
description: "Skill-by-skill rewrite of transient packet/arc/phase citations to present-tense form, keeping ADR/REQ anchors, with per-skill alignment + test verification and a comprehensive closing re-grep."
trigger_phrases:
  - "full strict evergreen sweep plan"
  - "010 evergreen sweep plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/131-deep-skill-evolution/000-release-cleanup/010-evergreen-citation-sweep-across-deep-skills"
    last_updated_at: "2026-05-24T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "plan-authored"
    next_safe_action: "sweep-skill-by-skill-then-regrep"
    blockers: []
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000010002"
      session_id: "131-000-010-evergreen-sweep"
      parent_session_id: "131-000-010-evergreen-sweep"
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!-- SPECKIT_LEVEL: 1 -->

# Implementation Plan: full strict evergreen-citation sweep across the deep-* skills

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surfaces** | 5 deep-* skills: markdown runtime docs (README/SKILL/references/feature_catalog/playbook) + `.cjs` code comments + `.vitest.ts` test comments |
| **Routing** | `sk-doc` for markdown; `sk-code` (OPENCODE) for `.cjs`/`.ts` comment edits |
| **Approach** | Skill-by-skill; native Edit (editorial judgment per citation, not find-replace); closing comprehensive re-grep |

### Overview

Rewrite each transient citation to present-tense form: keep the durable anchor (ADR name, REQ semantics, behavior description), drop the mutable `Packet NNN/NNN/NNN` / `arc NNN` / `phase NNN` prefix. Verify per skill with `node --check`, vitest where present, and alignment-drift, then a single comprehensive re-grep across all 5 skills to confirm 0 remaining hits.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Done

- [ ] Comprehensive re-grep returns 0 transient citations in non-exempt files
- [ ] `node --check` clean on every touched `.cjs`
- [ ] vitest suites (deep-loop-runtime, deep-agent-improvement, deep-review) still green
- [ ] alignment-drift PASS on each touched skill
- [ ] 010 strict validate exit 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

No architectural change. Doc + comment text only. ADR decisions, REQ semantics, and runtime behavior are unchanged; only the way they are referenced becomes evergreen.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Sweep + Verify

- [ ] deep-loop-runtime (~23 citations: README, SKILL, feature_catalog, lib/deep-loop/README, tests)
- [ ] deep-research (~4: SKILL, reduce-state.cjs)
- [ ] deep-review (~15: README, references, reduce-state.cjs, playbook)
- [ ] deep-ai-council (~5: references, playbook)
- [ ] deep-agent-improvement (~7: mutation-coverage.cjs, reduce-state.cjs, playbook)
- [ ] Per-skill: `node --check` touched `.cjs`, alignment-drift, vitest where present
- [ ] Comprehensive closing re-grep (0 hits); fill summary; strict validate; commit
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | Tool |
|------|------|
| Citation removal | `rg -niE "arc NNN\|packet NNN\|phase NNN\|NNN/NNN/NNN"` (non-exempt) = 0 |
| Comment-only safety | `node --check` per touched `.cjs`; vitest run per skill with a suite |
| Code alignment | `verify_alignment_drift.py --root <skill>` per touched skill |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Status | Impact if Blocked |
|------------|--------|-------------------|
| repo-root vitest v4 | Green | suite re-run |
| Node.js 18+ | Green | node --check |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Per-file `git checkout HEAD -- <path>`. Pure text edits; no data, migration, or flag. Each skill's edits are independent.
<!-- /ANCHOR:rollback -->
