---
title: "003 — Planner Reviewer-Focus & Spec-Drift Hint"
description: "Review attention is not steered to high-risk areas and spec/plan drift goes silent. Add two advisory-only agent-IO fields — reviewer_focus and spec_drift — that route attention without becoming gates or mutations."
trigger_phrases:
  - "027 phase 012/003"
  - "reviewer focus advisory field"
  - "spec drift write-back"
  - "self_assessed_quality hint"
  - "planner review focus drift"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/027-xce-research-based-refinement/012-gem-team-adoption/003-planner-review-focus-and-drift-hint"
    last_updated_at: "2026-06-06T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Scaffolded 003 advisory fields from 007 P3 + 009"
    next_safe_action: "Land 012 envelope, then add reviewer_focus + spec_drift"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-06-027-003-planner-focus-drift-scaffold"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "P3 of 007 sub-packet-proposals selected as L1 child 003"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: 003 — Planner Reviewer-Focus & Spec-Drift Hint

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Spec-Scaffolded |
| **Created** | 2026-06-06 |
| **Branch** | `003-planner-review-focus-and-drift-hint` |
| **Parent Packet** | `027-xce-research-based-refinement/012-gem-team-adoption` |
| **Source** | `../research/007-gem-team-adoption-matrix/sub-packet-proposals.md` Proposal P3; `../research/009-gem-team-integration-impact/research.md` iter 003 + §2 matrix |
| **Depends on** | `001-typed-agent-io-adapter` (these fields live inside 012's I/O envelope) |
| **LOC budget** | ~80-130 (advisory fields in agent/output contracts + optional JSON keys) |
<!-- /ANCHOR:metadata -->

> **Cross-phase awareness (read before implementing).** (1) The future sibling child `009-peck-verification-discipline` (peck research) edits `CLAUDE.md` Logic-Sync, on which this phase's `spec_drift` deferral depends — confirm Logic-Sync semantics are unchanged at implementation time. (2) `generate-context.ts` is touched ONLY by this phase among all 027 work — no conflict. (3) Phase `006-write-path-reconciliation` edits the `memory-save.ts` *handler* (internal diff logic), a different file/layer from this phase's `memory/save.md` command + `generate-context.ts` — no overlap, awareness only.

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Review attention is not steered to the areas most likely to harbor defects: `@review` derives scope from the target and changed files alone, with no signal from the planner about where the risk concentrates. Separately, when implementation reveals that the spec or plan should change, that drift currently goes silent — the spec-kit has Logic-Sync for hard contradictions but no lightweight recommendation channel for "this should be updated."

### Purpose
Add two advisory-only fields — `reviewer_focus` (with an optional `self_assessed_quality`) and `spec_drift` / `update_recommended` — that route review attention and surface drift into continuity, never gating execution and never mutating spec docs.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **`reviewer_focus` advisory field.** The planner / `@orchestrate` names high-risk files or areas in the dispatch path. `@review` consumes it to PRIORITIZE reads and evidence-gathering — it does NOT change the review threshold and does NOT let a focused area create a finding without normal evidence. Includes an optional `self_assessed_quality` self-rating emitted by the producing agent.
- **`spec_drift` / `update_recommended` write-back.** `@code`'s optional RETURN body carries a one-line drift reason plus `affected_spec_docs`. The drift rationale is routed via `/memory:save` into `handover.md`.
- **Optional JSON keys.** `generate-context.ts` optionally accepts `specDrift` / `reviewerFocus` keys in JSON mode and tolerates their absence.
- **Backward-compatible defaults.** Every field is optional; absence reproduces today's behavior exactly.

### Out of Scope
- Making `reviewer_focus` a gate or letting it change `@review`'s threshold - it is attention-steering only.
- Writing `spec_drift` into the `_memory.continuity` schema - L1 keeps the `ThinContinuityRecord` schema UNCHANGED; raw-field schema work (record + validator + serializer + tests + resume reader) is deferred to a later packet.
- Letting `spec_drift` bypass or soften Logic-Sync - contradictions still halt via Logic-Sync.
- Auto-editing or auto-applying drift changes to spec docs - drift is a recommendation a human/orchestrator decides on.
- Naming the self-rating `quality_score` - that name already denotes a different scale in `/memory:save`; this packet uses `self_assessed_quality`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/agents/orchestrate.md` | Modify | ADD an optional `reviewer_focus` dispatch field; consume it during output review (attention-steer only). |
| `.opencode/agents/review.md` | Modify | Accept `reviewer_focus` to prioritize reads/evidence; focused areas still require normal evidence; no threshold change. |
| `.opencode/agents/code.md` | Modify | ADD an optional `spec_drift` block in the RETURN body (NOT the first-line escalation enum). |
| `.opencode/commands/memory/save.md` | Modify | Document drift destination = `handover.md`. |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | Modify | ADD optional `specDrift` / `reviewerFocus` JSON keys; tolerate absence. |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | `reviewer_focus` is advisory only and steers attention, never the threshold. | `@review` reads/evidence are prioritized toward focused files; review threshold is unchanged; no finding is created without normal evidence. |
| REQ-002 | `spec_drift` / `update_recommended` is a RETURN-body recommendation, not a mutation. | `@code` emits an optional drift block (reason + `affected_spec_docs`) in the §8 RETURN body, never in the first-line escalation enum; no spec doc is edited automatically. |
| REQ-003 | Logic-Sync remains the authority for contradictions. | A contradiction still returns `LOGIC_SYNC` and halts; `spec_drift` does not absorb, soften, or reroute it. |
| REQ-004 | The continuity schema is unchanged for L1. | `ThinContinuityRecord` / continuity frontmatter gain no new raw fields; drift rationale lands in `handover.md` via `/memory:save`. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | Avoid the `quality_score` name collision. | The self-rating is named `self_assessed_quality`; no second bare `quality_score` with a different scale is introduced. |
| REQ-006 | `generate-context.ts` tolerates field absence. | Optional `specDrift` / `reviewerFocus` JSON keys are accepted when present and ignored when absent; existing save behavior is unchanged. |
| REQ-007 | Keep edits additive and within the five named surfaces. | No gate, validator, or governance file is changed; the advisory note degrades gracefully everywhere. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: With no `reviewer_focus` supplied, `@review` derives scope from the target/files exactly as it does today.
- **SC-002**: With no `spec_drift` supplied, the save path records `spec_drift: none`.
- **SC-003**: A spec/code contradiction still halts via Logic-Sync and is not softened or rerouted by `spec_drift`.
- **SC-004**: A supplied `reviewer_focus` prioritizes review reads/evidence without changing the threshold or fabricating a finding.
- **SC-005**: A supplied `spec_drift` rationale appears in `handover.md` after `/memory:save`, with the spec docs left unmodified.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Name collision with the existing `quality_score` field in `/memory:save`. | Med | Use `self_assessed_quality`; never introduce a second bare `quality_score` with a different scale. |
| Risk | `spec_drift` softens or reroutes a hard contradiction that Logic-Sync should own. | Med | `spec_drift` is a recommendation only; Logic-Sync stays the halt authority and is untouched by this packet. |
| Risk | Advisory fields ignored or treated as noise. | Low | Keep them optional and short; surface only on genuine high-risk focus or real drift. |
| Dependency | `001-typed-agent-io-adapter` | High | The two fields live inside 012's I/O envelope; implement 003 only after 012 lands. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- `target_files` / `affected_spec_docs` naming: align the drift field name with whatever 012's envelope settles on at implementation time.
- Confirm at implementation whether `self_assessed_quality` should carry a numeric band aligned to 012's confidence convention or stay a free-form short hint (default: short hint).
<!-- /ANCHOR:questions -->
