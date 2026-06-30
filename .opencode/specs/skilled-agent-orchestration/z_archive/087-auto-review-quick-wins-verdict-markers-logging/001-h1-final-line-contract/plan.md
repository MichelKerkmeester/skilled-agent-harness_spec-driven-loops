---
title: "Implementation Plan: Phase 1 H-1 Final-line exact-string contract"
description: "Sequential implementation of the H-1 teaching for sk-code-review + deep-review. 5 steps, ~2-3 hours total wall-clock."
trigger_phrases:
  - "108 phase 1 plan"
  - "h1 implementation plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/087-auto-review-quick-wins-verdict-markers-logging/001-h1-final-line-contract"
    last_updated_at: "2026-05-16T07:00:00Z"
    last_updated_by: "claude-opus-4-7-108-scaffold"
    recent_action: "phase_1_plan_authored"
    next_safe_action: "wait_for_council_approval"
    blockers:
      - "Awaiting council verdict"
    key_files:
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-108-001-plan"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 1 H-1

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown (SKILL.md) + YAML (workflow assets) |
| **Framework** | OpenCode skill system + spec-kit deep-review workflow |
| **Storage** | n/a (config-only changes) |
| **Testing** | Smoke-test via 3 synthetic findings sets |

### Overview
Edit 4 files (`sk-code-review` SKILL.md, `deep-review` SKILL.md, 2 deep-review YAML synthesis assets) to add the exact-string verdict line. Verdict mapping for deep-review: PASS (no P0/P1) / CONDITIONAL (P1 present) / FAIL (P0 present).
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Council verdict APPROVE on parent packet
- [ ] sk-code-review SKILL.md target lines (302-329) verified present
- [ ] deep-review YAML files verified present at `.opencode/commands/speckit/assets/`

### Definition of Done
- [ ] All 4 files edited with verdict line
- [ ] Smoke-test parser script validates 3 verdict states
- [ ] Strict validate exit 0 on this packet + phase parent
- [ ] Commit + push
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Pattern: additive doc-edit. No code paths change; only verdict-string emission is added.

```text
sk-code-review review pass
  └─► output includes new line:
      **Review status**: [APPROVED | REQUESTED_CHANGES | COMMENTED]

deep-review iteration synthesis
  └─► findings JSONL parsed
      └─► verdict derived (PASS/CONDITIONAL/FAIL by P0/P1/P2 mapping)
          └─► appended to iteration-NNN.md as final line:
              Review verdict: [PASS/CONDITIONAL/FAIL]
```
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Edit sk-code-review SKILL.md
- Read SKILL.md lines 302-329 (Phase 4 output contract)
- Insert exact-string status line + example output block
- Note: keep existing prose for backward compatibility

### Phase B: Edit deep-review SKILL.md + YAML synthesis
- Read deep-review SKILL.md (find Output section)
- Document new final-line contract
- Edit `deep_start-review-loop_auto.yaml` synthesis step
- Edit `deep_start-review-loop_confirm.yaml` (mirror)

### Phase C: Smoke-test verdict mapping
- Create 3 synthetic findings JSONL files (no findings / P1-only / P0-present)
- Run verdict-derivation logic locally
- Confirm exact-string output matches expected

### Phase D: Validate + commit
- Strict validate this packet + parent
- Commit + push
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test | What | Pass criteria |
|------|------|---------------|
| Smoke test 1 | sample diff with no issues → sk-code-review run | Final line: `**Review status**: APPROVED` |
| Smoke test 2 | sample diff with style issues → sk-code-review run | Final line: `**Review status**: COMMENTED` |
| Smoke test 3 | sample diff with critical bug → sk-code-review run | Final line: `**Review status**: REQUESTED_CHANGES` |
| Smoke test 4 | findings JSONL with no P0/P1 → deep-review synthesis | Final line: `Review verdict: PASS` |
| Smoke test 5 | findings JSONL with P1 only → deep-review synthesis | Final line: `Review verdict: CONDITIONAL` |
| Smoke test 6 | findings JSONL with P0 present → deep-review synthesis | Final line: `Review verdict: FAIL` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dep | Purpose | Risk |
|-----|---------|------|
| `sk-code-review/SKILL.md` exists | Phase A target | Low — verified in scope |
| `deep-review` YAML assets exist | Phase B target | Low — verified in scope |
| Council APPROVAL on parent | Implementation gate | Council outcome unknown until run |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Pure additive doc edits. Rollback = `git revert <commit>` on the phase commit. No DB or runtime state changes.
<!-- /ANCHOR:rollback -->
