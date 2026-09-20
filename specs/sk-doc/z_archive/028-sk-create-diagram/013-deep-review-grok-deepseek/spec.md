---
title: "Feature Specification: sk-create-diagram deep review (Grok 4.6 + deepseek-v4-flash)"
description: "10-iteration fan-out deep review of skill:sk-create-diagram — 5 iterations on Grok 4.6 via cli-cursor, 5 on deepseek-v4-flash via opencode-go, merged strongest-restriction."
trigger_phrases:
  - "diagram deep review grok deepseek"
  - "sk-create-diagram review CONDITIONAL"
importance_tier: "important"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "sk-doc/028-sk-create-diagram/013-deep-review-grok-deepseek"
    last_updated_at: "2026-08-13T05:55:33.000Z"
    last_updated_by: "claude"
    recent_action: "Review complete, merged CONDITIONAL verdict, findings remediated in phase 014"
    next_safe_action: "None — findings resolved in phase 014"
    blockers: []
    key_files:
      - "review/review-report.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-create-diagram-fork"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "First attempt halted at preflight (a second, mirrored cli-cursor model allowlist in fanout-run.cjs was missing the Grok 4.6 tiers) — fixed in packet cli-external-orchestration/043's second pass, then relaunched clean."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: sk-create-diagram deep review (Grok 4.6 + deepseek-v4-flash)

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-08-12 |
| **Branch** | `sk-doc/0145-sk-create-diagram` |
| **Parent Spec** | `../spec.md` |
| **Phase** | 13 of 15 |
| **Predecessor** | `../012-flowchart-capability-merge/spec.md` |
| **Successor** | `../014-review-remediation/spec.md` |
| **Handoff Criteria** | Merged review verdict recorded; every finding either fixed in phase 014 or explicitly deferred |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## PHASE CONTEXT

**Scope Boundary**: Run the review loop and gather results only. No content fixes in this phase — findings are remediated separately in phase 014.

**Dependencies**: Phase 012's completed flowchart merge is the review target.

**Deliverables**: `review/review-report.md` (merged, 10 sections), `review/deep-review-findings-registry.json` (merged), 2 per-lineage sub-packets (5 iterations each), `review/fanout-attribution.md`.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

Every prior phase in this packet was orchestrator-verified against real files, but never run through an independent, adversarial multi-model review.

### Purpose

Run `/deep:review:auto` on `skill:sk-create-diagram` with a 2-executor fan-out (5 iterations Grok 4.6 via cli-cursor, 5 iterations deepseek-v4-flash via opencode-go), early convergence allowed, merged via strongest-restriction, to surface anything the orchestrator's own verification passes missed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope

- Dispatch the fan-out loop via `cli-opencode --command deep/review`.
- Independently confirm the merged verdict and at least the headline finding against real files before trusting it.

### Out of Scope

- Fixing any finding — that is phase 014's scope.
- Re-running phases 001-012's own validation gates.

### Aggregate File Scope

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `013-deep-review-grok-deepseek/review/` | Create | Harness-generated review state, per-lineage sub-packets, and the merged report |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Both lineages run to completion (converge or hit max iterations) and merge into one verdict. | `review-report.md` exists with a merged verdict and per-lineage attribution. |
| REQ-002 | The merged verdict's headline finding is independently re-verified, not trusted from the report alone. | Real filesystem check against the specific claim. |
| REQ-003 | Every dispatchable executor model is confirmed live before the fan-out launches. | `cursor-grok-4.6-high` and `opencode-go/deepseek-v4-flash` both pass preflight, or the halt reason is named and fixed before retry. |
| REQ-004 | Findings are merged via strongest-restriction across lineages, not averaged or dropped. | Merge rule stated in `review-report.md`; a CONDITIONAL from either lineage yields a CONDITIONAL merged verdict. |
| REQ-005 | This phase makes no content fixes of its own. | `git status --short` for this phase shows only the harness-generated `review/` tree, no source-code edits. |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-006 | The full finding registry (not just the headline finding) is preserved for phase 014's remediation. | `deep-review-findings-registry.json` present with every P0/P1/P2 finding, source lineage, and file reference. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `review-report.md` produced with a merged verdict and full finding registry.
- **SC-002**: Headline finding independently confirmed real before acting on it.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A dispatched executor's model may be blocked by a stale enforced allowlist. | Medium (realized) | First attempt halted correctly rather than degrading silently; the real blocker (a second, mirrored allowlist in `fanout-run.cjs`) was fixed before relaunching. |
| Dependency | Packet `cli-external-orchestration/043`'s allowlist fix | High | Confirmed both TS canonical and JS-mirror allowlists accept `cursor-grok-4.6-high` before relaunching. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- Merged report: `review/review-report.md`
- Packet root: `../spec.md`
- Remediation: `../014-review-remediation/spec.md`
