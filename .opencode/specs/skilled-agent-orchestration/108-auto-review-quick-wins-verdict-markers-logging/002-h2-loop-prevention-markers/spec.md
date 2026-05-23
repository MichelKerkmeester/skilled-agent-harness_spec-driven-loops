---
title: "Phase 2: Loop-prevention header markers (H-2) + Anti-repetition rule (H-4)"
description: "Add 'CODE-REVIEW' / 'DEEP-REVIEW' / 'DEEP-RESEARCH' header markers at the RENDERED-PROMPT BOUNDARY (prompt_pack templates + dispatcher prompt-assembly), NOT in reference markdown files (would corrupt YAML frontmatter). Plus add the H-4 anti-repetition rule ('Do not implement fixes during review') to all 3 review prompts. Promoted from Phase 4 to MVP per council §5.2 because source ranks H-4 HIGH-impact LOW-cost."
trigger_phrases:
  - "h2 loop-prevention markers"
  - "review marker header"
  - "review-of-review defense"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/108-auto-review-quick-wins-verdict-markers-logging/002-h2-loop-prevention-markers"
    last_updated_at: "2026-05-16T07:00:00Z"
    last_updated_by: "claude-opus-4-7-108-scaffold"
    recent_action: "phase_2_spec_scaffolded_awaiting_council"
    next_safe_action: "await_council"
    blockers:
      - "Awaiting council verdict in parent ai-council/"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-108-002-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: H-2 Loop-prevention header markers

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Planned — gated on council approval |
| **Created** | 2026-05-16 |
| **Branch** | `main` |
| **Phase Parent** | `108-auto-review-quick-wins-verdict-markers-logging` |
| **Source teaching** | H-2 from `106/research/review-report.md` §5.4 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our review/research skills (sk-code-review, deep-review, deep-research) lack a runtime guard against review-of-review recursion. If a malformed iteration ever causes `deep-review` to dispatch another `deep-review` (e.g. via a shell command misconfiguration), or `sk-code-review` to be invoked on its own output, the result is wasted compute and potentially infinite loops. Current defense is contract-only ("this skill is LEAF") — no runtime check.

### Purpose
Adopt the upstream auto-review pattern of injecting a unique header marker at the top of each review prompt + having dispatchers scan for the marker on the LAST iteration's input before dispatching the NEXT iteration. If marker found → skip with "nested loop detected" error. Layer-1 of a 3-layer combinator (markers → session-set → dedup); layers 2-3 are out of scope for this phase.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

**H-2 — Marker headers (RENDERED-PROMPT BOUNDARY only)**:
- Add `DEEP-REVIEW\n\n` header at the TOP of `deep-review` `prompt_pack_iteration.md.tmpl` (rendered template, not a reference resource)
- Add `DEEP-RESEARCH\n\n` header at the TOP of `deep-research` `prompt_pack_iteration.md.tmpl`
- For `sk-code-review`: marker injection happens at the DISPATCHER prompt-assembly layer (wherever sk-code-review prompts are assembled into the final user-facing prompt), NOT prepended above the YAML frontmatter of reference files like `references/code_quality_checklist.md` (which would corrupt MD parsing). Council §10.5 directive.
- Update `deep_start-review-loop_auto.yaml` + `deep_start-research-loop_auto.yaml` dispatcher to scan first 5 lines of the previous iteration's rendered prompt for marker; skip dispatch + emit "nested loop detected" error if found
- Use first-line-of-rendered-prompt anchor match (`^MARKER` regex), not contains-check, to avoid false positives

**H-4 — Anti-repetition rule (promoted from Phase 4 to MVP)**:
- Add exactly one line to each of the 3 review prompts (sk-code-review SKILL.md Phase 3 rules section, deep-review prompt_pack_iteration.md.tmpl, deep-research prompt_pack_iteration.md.tmpl): `Do not implement fixes during review. Report findings only; implementation is a separate follow-up step.`
- Justification: source 106 ranks H-4 HIGH-impact LOW-cost (~30 min total); council §5.2 + §7 unanimously recommend MVP promotion.

### Out of Scope
- Layers 2 (session-set) + 3 (dedup map) — those require child-session model which our LEAF skills don't have
- Migrating downstream tooling that consumes our prompts (they should simply ignore the marker line)
- H-1/H-3 implementations (separate phases)

### Files to Change

| File | Change Type | Description |
|------|-------------|-------------|
| `.opencode/skills/sk-code-review/references/*.md` (review templates) | Modify | Add `CODE-REVIEW\n\n` as first 2 lines |
| `.opencode/skills/deep-review/SKILL.md` (or template file) | Modify | Add `DEEP-REVIEW\n\n` header |
| `.opencode/skills/deep-research/SKILL.md` (or template file) | Modify | Add `DEEP-RESEARCH\n\n` header |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Add dispatcher marker-scan step |
| `.opencode/commands/deep/assets/deep_start-research-loop_auto.yaml` | Modify | Add dispatcher marker-scan step |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | Each review prompt template emits its specific marker as the first line | grep first line of rendered prompt → matches marker |
| REQ-002 | Dispatcher scans first 5 lines of previous iteration's prompt for marker | Test: inject marker → dispatcher skips with error |
| REQ-003 | Marker scan uses anchor match (`^MARKER`), not contains-check | False-positive test: a comment containing "CODE-REVIEW" in body does NOT trigger skip |
| REQ-004 | Skip emits a clear error string operator can grep for | Error matches `nested .* loop detected` |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: 3 marker headers added to 3 skills' prompt templates.
- **SC-002**: 2 dispatchers updated with marker-scan step (deep-review + deep-research).
- **SC-003**: False-positive test: prompt body with "CODE-REVIEW" substring does NOT trigger skip.
- **SC-004**: True-positive test: previous iteration prompt with `CODE-REVIEW\n\n` as first line DOES trigger skip.
- **SC-005**: Strict validate exit 0 on this packet + phase parent.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | False positives from contains-check | Skipped legitimate reviews | Use first-line-of-prompt anchor match (`head -1 \| grep '^CODE-REVIEW'`) |
| Risk | Marker collides with legitimate prompt content | Operator confusion | Use distinct uppercase phrases unlikely in normal prose |
| Risk | Dispatcher integration breaks existing deep-review/deep-research workflows | Loop dispatch fails | Add marker-scan as opt-out via env var (e.g. `DEEP_LOOP_SKIP_MARKER_CHECK=1`) |
| Dependency | Phase 1 (H-1) doesn't depend on Phase 2 | Independent | Can implement in any order or parallel |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: Should the marker include a packet ID (e.g. `CODE-REVIEW:108`) to allow nested reviews of DIFFERENT packets? Council to advise.
2. **Q2**: Should sk-code-review have its OWN dispatcher scan (it's not iterative)? Council to advise.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

| # | Step |
|---|------|
| 1 | Add `CODE-REVIEW\n\n` to sk-code-review review templates (≥1 file, possibly multiple) |
| 2 | Add `DEEP-REVIEW\n\n` header to deep-review prompt template |
| 3 | Add `DEEP-RESEARCH\n\n` header to deep-research prompt template |
| 4 | Modify deep-review YAML dispatcher to scan first-line marker before dispatching iteration N+1 |
| 5 | Modify deep-research YAML dispatcher (mirror) |
| 6 | True/false-positive tests + strict validate + commit |
<!-- /ANCHOR:iteration-plan -->
