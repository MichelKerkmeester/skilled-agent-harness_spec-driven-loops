---
title: "Plan: 057 deeper second-pass sonnet @markdown rewrite"
description: "3-phase plan: scaffold, sonnet @markdown second-pass, verify + commit."
trigger_phrases:
  - "057 plan"
  - "deeper rewrite plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-local-embeddings-foundation/057-root-readme-deeper-rewrite"
    last_updated_at: "2026-05-15T14:30:00Z"
    last_updated_by: "main_agent"
    recent_action: "Wrote 3-phase plan"
    next_safe_action: "Begin Phase 2"
    blockers: []
    key_files: ["spec.md"]
    session_dedup:
      fingerprint: "sha256:3dc0a277d8bcc48aa52d192c767512f76dfee0c6c5a37f4164d1af87f929bb05"
      session_id: "057-plan"
      parent_session_id: null
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Plan: 057 deeper second-pass rewrite

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown + YAML frontmatter; sonnet @markdown via Task tool |
| **Framework** | Phase D / 056 Pass 3 pattern, repeated with a deeper scope |
| **Storage** | n/a |
| **Testing** | sk-doc validate with HVR scoring; strict-validate on packet |

### Overview

Three phases:

1. **Scaffold** — 7 packet files; strict-validate.
2. **Second-pass rewrite** — Sonnet @markdown reads 056 raw findings (research.md + 20 iter files + edit-evidence.md) and applies anything Phase 4 missed. Writes edit-evidence-v2.md + (optionally) uncovered-findings.md.
3. **Verify + commit** — HVR validate, strict-validate, sonnet @markdown + @review parallel double-check, single commit.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] 056 packet shipped (6e330e218)
- [x] Sonnet @markdown via Task tool proven
- [x] HVR rules + sk-doc validator available
- [x] User scope clarification: deeper second-pass on raw findings

### Definition of Done
- [ ] Sonnet @markdown second-pass applied
- [ ] HVR score >= 95 (target >= 98)
- [ ] Edit-evidence-v2.md written
- [ ] Uncovered-findings.md written (if applicable)
- [ ] Strict-validate exit 0
- [ ] Sonnet @markdown + @review PASS (0 P0)
- [ ] Single primary commit on main
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Externalized state. Sonnet @markdown is the single executor. Inputs are 056's already-shipped research artifacts; outputs are scoped edits to ./README.md + this packet's evidence trail.

### Key Components

- **Sonnet dispatcher**: `Agent({ subagent_type: 'markdown', prompt: ... })` Task tool
- **Inputs (read-only by sonnet)**: ./README.md current state, 056 research/*.md and iterations/*.md, HVR rules
- **Outputs**: ./README.md edits, research/edit-evidence-v2.md, optional research/uncovered-findings.md
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Scaffold
- [x] 7 packet files created
- [ ] Strict-validate PASS

### Phase 2: Sonnet @markdown second-pass
- [ ] Compose Task-tool prompt with:
  - Pointer to ./README.md (current)
  - Pointer to 056 raw research artifacts
  - Pointer to Phase 4 edit-evidence.md (avoid duplicates)
  - HVR rules path
  - Scope contract: preserve voice, surgical edits, target HVR >= 98
- [ ] Dispatch `Agent({ subagent_type: 'markdown', prompt: ... })`
- [ ] Verify ./README.md updated + edit-evidence-v2.md written

### Phase 3: Verify + commit
- [ ] `validate_document.py ./README.md --type readme --json` returns hvr_score >= 95
- [ ] Strict-validate packet PASS
- [ ] Parallel sonnet @markdown + @review final double-check
- [ ] Patch any P0 findings
- [ ] Backfill implementation-summary.md
- [ ] Final commit: `docs(014/057): deeper second-pass rewrite of root README from 056 raw findings`
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Validator | ./README.md sk-doc compliance | `validate_document.py --type readme` |
| HVR score | ./README.md prose voice | `validate_document.py --type readme --json` |
| Strict-validate | Packet level | `validate.sh --strict` |
| Surgical-edit discipline | git diff scope | `git diff README.md` |
| Independent review | Sonnet eyes | Task tool @markdown + @review |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status |
|------------|------|--------|
| 056 packet shipped | Internal | Met |
| Sonnet @markdown via Task tool | Internal | Met |
| HVR rules + validator | Internal | Met |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: voice drift in non-drifted prose, sonnet over-edits, or HVR score regresses vs Phase 4 baseline of 94.
- **Procedure**:
  - Over-edit: revert README.md to 6e330e218 baseline, re-dispatch with tighter scope contract
  - HVR regression: investigate which rewrite broke voice; manual fix
- **Recovery baseline**: HEAD = `6e330e218`.
<!-- /ANCHOR:rollback -->
