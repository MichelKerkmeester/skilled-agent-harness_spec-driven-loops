---
title: "Phase 1: Final-line exact-string contract (H-1) for sk-code-review + deep-review"
description: "Replace free-form review verdicts with machine-parseable exact strings. sk-code-review emits 'Review status: [APPROVED | REQUESTED_CHANGES | COMMENTED]'; deep-review emits 'Review verdict: [PASS/CONDITIONAL/FAIL]' as final line of each iteration output. Enables CI gate integration."
trigger_phrases:
  - "h1 final-line contract"
  - "exact-string review verdict"
  - "machine-parseable review output"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/z_archive/087-auto-review-quick-wins-verdict-markers-logging/001-h1-final-line-contract"
    last_updated_at: "2026-05-16T07:00:00Z"
    last_updated_by: "claude-opus-4-7-108-scaffold"
    recent_action: "phase_1_spec_scaffolded_awaiting_council_review"
    next_safe_action: "wait_for_council_approval_then_implement"
    blockers:
      - "Awaiting deep-ai-council verdict in parent ai-council/council-report.md"
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-05-16-108-001-scaffold"
      parent_session_id: null
    completion_pct: 5
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: H-1 Final-line exact-string contract

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
| **Source teaching** | H-1 from `106/research/review-report.md` §5.4 |

> **Historical record:** This archived specification retains its original council-gated status; the implementation summary records the completed phase and its deferred live-pipeline validation.

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Our review skills (sk-code-review, deep-review) emit free-form verdicts that are unreliable to parse via regex or NLP. sk-code-review SKILL.md:308 produces "APPROVE / REQUEST_CHANGES / COMMENT" in prose; deep-review SKILL.md:367-372 produces "FAIL/CONDITIONAL/PASS" embedded in synthesis text. CI bots, PR status checks, and automation scripts cannot reliably extract review status without ad-hoc regex that breaks on prose variation.

### Purpose
Adopt the upstream auto-review pattern: end every review output with exactly one of a small set of canonical strings, making verdict extraction trivial (string match, no regex). Provides machine-parseable verdict for downstream automation.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Edit `sk-code-review` SKILL.md Phase 4 output contract (lines 302-329) to add exact-string status line in **PLAIN TEXT** (no Markdown bold): `Review status: APPROVED` (or `REQUESTED_CHANGES` or `COMMENTED`). Council §10.4 directive — plain text simpler to parse than `**Review status**: ...` bold form.
- Edit `deep-review` YAML synthesis step (`deep_start-review-loop_auto.yaml` + `deep_start-review-loop_confirm.yaml`) to emit `Review verdict: PASS` (or `CONDITIONAL` or `FAIL`) in plain text as the final line of `iteration-NNN.md`
- Map verdict logic for deep-review: PASS if no P0/P1 findings, CONDITIONAL if P1 present, FAIL if P0 present
- Add a brief example output block to each skill's SKILL.md showing the new plain-text final-line shape

### Final-line exact strings (canonical — DO NOT vary):
- sk-code-review: exactly `Review status: APPROVED` / `Review status: REQUESTED_CHANGES` / `Review status: COMMENTED`
- deep-review: exactly `Review verdict: PASS` / `Review verdict: CONDITIONAL` / `Review verdict: FAIL`

### Out of Scope
- Migrating downstream consumers (PR bots, CI checks) to parse the new format — that's a follow-on packet
- H-2/H-3 implementations (separate phases)
- Changes to deep-research SKILL.md (no equivalent verdict concept — it produces findings, not verdicts)

### Files to Change

| File | Change Type | Description |
|------|-------------|-------------|
| `.opencode/skills/sk-code-review/SKILL.md` | Modify | Add exact-string status line at Phase 4 output contract |
| `.opencode/commands/deep/assets/deep_start-review-loop_auto.yaml` | Modify | Add verdict-derivation step + emit final line |
| `.opencode/commands/deep/assets/deep_start-review-loop_confirm.yaml` | Modify | Same as auto |
| `.opencode/skills/deep-review/SKILL.md` | Modify | Document final-line contract in §Output |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance |
|----|-------------|------------|
| REQ-001 | sk-code-review emits `Review status: [APPROVED | REQUESTED_CHANGES | COMMENTED]` as final line | Manual test against 3 sample diffs (clean / minor issues / blocking issues) |
| REQ-002 | deep-review emits `Review verdict: [PASS/CONDITIONAL/FAIL]` as final line of every iteration-NNN.md | Synthesis step parses findings JSONL and emits correct verdict |
| REQ-003 | Verdict mapping rule: PASS (no P0/P1) / CONDITIONAL (P1 present) / FAIL (P0 present) | Test fixture with 3 synthetic findings sets |
| REQ-004 | Exact string match works with simple CI gate parser script (no regex) | Smoke-test parser distinguishes all 3 states correctly |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: sk-code-review SKILL.md updated with exact-string status line; ≥ 1 example output block.
- **SC-002**: deep-review YAML files updated with verdict-emission step; verdict alignment tested with 3 synthetic findings sets.
- **SC-003**: Smoke-test CI gate parser script (`bash` one-liner: `tail -1 <output> | grep -E '^(\*\*Review status\*\*|Review verdict):'`) passes for all 3 states.
- **SC-004**: Strict validate exit 0 on this packet and on phase parent.
- **SC-005**: Backward compatibility — existing review output still parseable by current consumers (additive change).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Risk | Impact | Mitigation |
|------|------|--------|-----------|
| Risk | Verdict mapping doesn't account for P2-only findings | Misclassification | Explicit rule: P2-only → PASS (P2 is informational); document in SKILL.md |
| Risk | Existing consumers parse SKILL.md prose for verdict, now confused by new line | Auto-tooling breakage | Additive change — old prose stays, new line appended; consumers migrate when ready |
| Risk | deep-review iterations with malformed findings JSONL | Verdict line missing | YAML synthesis step has fallback: emit `Review verdict: UNKNOWN — findings JSONL malformed` |
| Dependency | sk-code-review SKILL.md must exist | Cannot implement | Verified at start |
| Dependency | deep-review YAML files exist | Cannot implement | Verified at start |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

1. **Q1**: ~~Markdown bold vs plain text?~~ ✅ RESOLVED by council §10.4 — plain text (`Review status: APPROVED`).
2. **Q2**: ~~Per-iteration vs per-packet verdict?~~ ✅ RESOLVED by council §6 — per-iteration final line (matches existing iteration-NNN.md output contract).
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:iteration-plan -->
## 8. ITERATION PLAN

| # | Step | Owner |
|---|------|-------|
| 1 | Edit `sk-code-review` SKILL.md §Phase 4 output (add exact-string line + example) | Main agent |
| 2 | Edit `deep-review` SKILL.md §Output (document verdict-line contract) | Main agent |
| 3 | Edit `deep_start-review-loop_auto.yaml` synthesis step (add verdict derivation + emit final line) | Main agent |
| 4 | Edit `deep_start-review-loop_confirm.yaml` (mirror auto) | Main agent |
| 5 | Smoke-test verdict line with 3 synthetic findings sets | Main agent |
| 6 | Strict validate this packet + phase parent | Main agent |
| 7 | Commit + push | Main agent |
<!-- /ANCHOR:iteration-plan -->
