---
title: "Implementation Plan: 003 — Planner Reviewer-Focus & Spec-Drift Hint"
description: "Add two advisory-only agent-IO fields layered on child 012's envelope: reviewer_focus (attention steer for @review) and spec_drift write-back (routed to handover.md), with continuity schema unchanged."
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
    answered_questions: []
---
# Implementation Plan: 003 — Planner Reviewer-Focus & Spec-Drift Hint

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown agent/command contracts + TypeScript (one optional JSON-mode path) |
| **Framework** | OpenCode agent runtime; system-spec-kit save path |
| **Storage** | None new; drift rationale lands in `handover.md` via `/memory:save` |
| **Testing** | Manual contract walkthrough + strict spec validation; optional unit assertion on `generate-context.ts` JSON tolerance |

### Overview
Layer two advisory-only fields onto child 012's agent-IO envelope. `reviewer_focus` lets the planner/`@orchestrate` name high-risk areas that `@review` uses to prioritize reads and evidence (never to change its threshold or fabricate a finding); `spec_drift` / `update_recommended` lets `@code` emit an optional one-line drift recommendation in its RETURN body, routed to `handover.md`. The continuity schema stays unchanged; every field degrades to current behavior when absent.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (P3 of 007 proposals; 009 §2 matrix).
- [x] Success criteria measurable (advisory absence ⇒ current behavior).
- [x] Dependency on child 012 identified.

### Definition of Done
- [ ] `reviewer_focus` steers `@review` attention only; threshold unchanged; no evidence-free findings.
- [ ] `spec_drift` is an optional RETURN-body recommendation routed to `handover.md`; no spec doc auto-edited.
- [ ] Logic-Sync remains authoritative for contradictions.
- [ ] `ThinContinuityRecord` schema unchanged; `self_assessed_quality` name used (no `quality_score` collision).
- [ ] `generate-context.ts` tolerates presence/absence of the optional JSON keys.
- [ ] Docs updated (spec/plan/tasks); strict validation passes.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Advisory contract extension. Two optional fields added to existing agent-IO surfaces with graceful degradation — no new gate, no new runtime, no schema migration.

### Key Components
- **`reviewer_focus` (+ optional `self_assessed_quality`)**: emitted by the planner/`@orchestrate` dispatch path; consumed by `@review` to prioritize reads/evidence only.
- **`spec_drift` / `update_recommended` block**: optional `@code` RETURN-body recommendation (reason + `affected_spec_docs`).
- **Drift routing**: `/memory:save` directs the drift rationale into `handover.md`; `generate-context.ts` optionally carries `specDrift` / `reviewerFocus` JSON keys.

### Data Flow
Planner/`@orchestrate` attaches `reviewer_focus` on dispatch; `@review` reads it, reorders its reads/evidence toward the named areas, and applies the unchanged threshold. Independently, `@code` may append a `spec_drift` block to its §8 RETURN body (after the first-line `RETURN:`); `@orchestrate` surfaces it, and `/memory:save` records the rationale in `handover.md`. A genuine contradiction still routes through Logic-Sync and halts — `spec_drift` never intercepts it.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Included because the change touches shared agent-IO policy and the `/memory:save` persistence-adjacent path.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `.opencode/agents/orchestrate.md` | Dispatch hub; consumes agent outputs | update (add optional `reviewer_focus` dispatch field; consume on review) | `rg -n 'reviewer_focus' .opencode/agents/orchestrate.md` + walkthrough |
| `.opencode/agents/review.md` | Review gate; derives scope from target/files | update (accept `reviewer_focus`, prioritize reads; threshold unchanged) | `rg -n 'reviewer_focus' .opencode/agents/review.md`; confirm no threshold edit |
| `.opencode/agents/code.md` | Implementation RETURN contract | update (add optional `spec_drift` block in §8 body, not first-line enum) | `rg -n 'spec_drift|RETURN:' .opencode/agents/code.md` |
| `.opencode/commands/memory/save.md` | Continuity save docs | update (document drift destination = `handover.md`) | `rg -n 'spec_drift|handover.md' .opencode/commands/memory/save.md` |
| `.opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` | JSON-mode save composer | update (optional `specDrift`/`reviewerFocus` keys, tolerate absence) | `rg -n 'specDrift|reviewerFocus' .opencode/skills/system-spec-kit/scripts/memory/generate-context.ts` |
| Logic-Sync (`AGENTS.md`, `code.md`) | Hard-contradiction halt authority | unchanged (NOT a consumer) | `rg -n 'LOGIC_SYNC|Logic-Sync' AGENTS.md .opencode/agents/code.md` shows no behavioral edit |
| `ThinContinuityRecord` / continuity schema | Continuity persistence schema | unchanged (deferred) | no new raw field; schema files not in diff |

Required inventories:
- Same-class producers: `rg -n 'reviewer_focus|spec_drift|update_recommended|self_assessed_quality' .opencode/agents .opencode/commands .opencode/skills/system-spec-kit`.
- Consumers of changed symbols: `rg -n 'reviewer_focus|spec_drift|specDrift|reviewerFocus' . --glob '*.md' --glob '*.ts'`.
- Collision guard: `rg -n 'quality_score' .opencode/commands/memory/save.md` to confirm `self_assessed_quality` does not clash.
- Advisory invariant: every field is optional; absence MUST reproduce current behavior, and Logic-Sync MUST remain the sole contradiction-halt path.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm child 012's agent-IO envelope is landed and read its `advisory` field group.
- [ ] Re-read the five target surfaces and the current Logic-Sync wording.
- [ ] Confirm the existing `quality_score` usage in the save path to lock the `self_assessed_quality` name.

### Phase 2: Core Implementation
- [ ] Add the optional `reviewer_focus` (+ `self_assessed_quality`) dispatch field to `orchestrate.md` and consume it on output review.
- [ ] Update `review.md` to accept `reviewer_focus` for read/evidence prioritization, leaving the threshold and evidence requirement intact.
- [ ] Add the optional `spec_drift` / `update_recommended` block to `code.md`'s §8 RETURN body (never the first-line enum).
- [ ] Document the drift destination (`handover.md`) in `commands/memory/save.md`.
- [ ] Add optional `specDrift` / `reviewerFocus` JSON keys to `generate-context.ts` with absence tolerated.

### Phase 3: Verification
- [ ] Walk through: no `reviewer_focus` ⇒ `@review` derives scope from target/files (SC-001).
- [ ] Walk through: no `spec_drift` ⇒ save records `spec_drift: none` (SC-002).
- [ ] Walk through: a contradiction still halts via Logic-Sync, unsoftened (SC-003).
- [ ] Confirm `self_assessed_quality` introduces no `quality_score` collision; continuity schema unchanged.
- [ ] Run strict spec validation for this packet.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Contract walkthrough | Advisory degradation paths (absent fields ⇒ current behavior) | Manual read of agent contracts |
| Unit (optional) | `generate-context.ts` tolerates presence/absence of optional keys | Project TS test runner |
| Manual | Logic-Sync contradiction still halts; drift rationale lands in `handover.md` | Dry-run dispatch + `/memory:save` |
| Documentation | Spec folder contract | `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <folder> --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `001-typed-agent-io-adapter` | Internal | Required | The two fields live inside 012's envelope; 003 cannot land first. |
| Logic-Sync authority (`AGENTS.md`) | Internal | Available, unchanged | Must stay the sole contradiction-halt path. |
| `/memory:save` + `generate-context.ts` | Internal | Available | Drift routing target; optional JSON keys. |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A focused-attention change is observed to alter `@review`'s threshold, or `spec_drift` is seen softening a contradiction that Logic-Sync should own.
- **Procedure**: Revert the additive edits in the five named surfaces; because every field is optional and advisory, removal returns the system to current behavior with no data migration.
<!-- /ANCHOR:rollback -->
