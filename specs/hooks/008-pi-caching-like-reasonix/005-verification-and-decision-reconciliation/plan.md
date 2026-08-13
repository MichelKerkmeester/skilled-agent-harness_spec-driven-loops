---
title: "Implementation Plan: Cross-Extension Verification + Superseding Decision Record"
description: "Verify zero-overlap composition of the patched pi-cache-optimizer and deep-pi via payload diffs, confirm non-regression via an A/B baseline, and author the superseding decision record."
trigger_phrases:
  - "cache split verification plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/005-verification-and-decision-reconciliation"
    last_updated_at: "2026-08-07T11:18:45Z"
    last_updated_by: "spec-author"
    recent_action: "All 3 phases executed with live evidence"
    next_safe_action: "Close the packet"
    blockers: []
    key_files: ["plan.md", "tasks.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-07-cli-039-005"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- SPECKIT_LEVEL: 3 -->

# Implementation Plan: Cross-Extension Verification + Superseding Decision Record

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | N/A (verification + documentation phase) |
| **Framework** | Pi coding-agent, both extensions installed together |
| **Storage** | `pi-cache-optimizer-stats.json` (non-DeepSeek) + `deep-pi`'s own telemetry (DeepSeek) |
| **Testing** | Live-session verification with a payload-diff harness, both provider paths, plus a mid-session model switch |

### Overview
With the patched `pi-cache-optimizer` (phase 003) and `deep-pi` (phase 004) both installed, confirm they partition cleanly by provider with zero overlap (via real payload diffs, not stats visibility) and zero regression (via a fresh A/B baseline, not the historical 89% figure), then close the packet's decision trail with a superseding decision record grounded in the operator's materially increased DeepSeek usage.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 complete (fork active)
- [ ] Phase 004 complete (deep-pi installed, self-gating confirmed in isolation)

### Definition of Done
- [ ] Composition verification passes via payload diff, not stats visibility (REQ-001, REQ-002)
- [ ] Superseding decision record recorded, honestly grounded (REQ-003)
- [ ] Parent packet metadata reconciled (REQ-004)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Provider-partitioned extension composition, verified end-to-end.

### Key Components
- **Patched `pi-cache-optimizer`**: active for every provider except `deepseek-v4-flash`/`deepseek-v4-pro` (phase 003) — including `opencode/deepseek-v4-flash-free`, which stays with this extension
- **`deep-pi`**: active only for `deepseek-v4-flash`/`deepseek-v4-pro` (phase 004)
- **Superseding decision record**: this file's own ADR-001, the documentation artifact that closes `002-synthesis-and-decision`'s ADR-001 re-entry contract

### Data Flow
A live session selects a model → Pi resolves the provider onto `ctx.model` → exactly one of the two extensions' guarded hook groups fires (patched optimizer for everything except `deepseek-v4-flash`/`deepseek-v4-pro`; deep-pi for those two only) → the other extension's hooks return immediately without side effects. This phase's job is to observe that partition actually holds under both conditions — via a real payload diff, not stats visibility — including across a mid-session model switch, not just assume it from each phase's isolated testing.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase A: Composition Verification
- [ ] Set up a request/payload capture point (log the assembled system prompt and outbound payload per request — a temporary debug hook or proxy log, removed after this phase closes)
- [ ] With both extensions installed, run a live session on `deepseek-v4-flash` or `deepseek-v4-pro`; diff the captured payload and confirm only `deep-pi`'s mutation is present, zero `pi-cache-optimizer` mutation
- [ ] With both extensions installed, run a live non-DeepSeek session (`openai-codex/gpt-5.6-luna`) AND a session on `opencode/deepseek-v4-flash-free`; diff both payloads and confirm only `pi-cache-optimizer`'s mutation is present, zero `deep-pi` activity
- [ ] Run one session that switches from a DeepSeek-direct model to a non-DeepSeek model mid-conversation (and back); confirm the hand-off is clean with no stale-extension activity
- [ ] Capture a fresh A/B baseline (session-scoped counters on an identical scripted workload, run once before and once after) and confirm no regression — do NOT compare against the historical cumulative 89% figure

### Phase B: Decision Reconciliation
- [ ] Author `decision-record.md` (this file's own ADR-001): supersede `002-synthesis-and-decision`'s ADR-001 build-gate closure narrowly (fork-and-split + narrow adoption, not the rejected broad greenfield plugin), grounded explicitly in the operator's materially increased DeepSeek usage
- [ ] State plainly which of ADR-001's three original revisit triggers actually applies (if any) rather than forcing the claim into the closest-sounding one
- [ ] Verify `../spec.md`'s top-level METADATA Status field was already updated at phase 003 start (per parent packet re-entry); if not, fix it here as well as the Phase Documentation Map
- [ ] Update `../graph-metadata.json`: refresh `children_ids` and `derived.status`/`last_active_child_id`

### Phase C: Packet Close
- [ ] Remove the temporary payload-capture hook/proxy log added in Phase A
- [ ] Run `validate.sh --recursive --strict` on the full `008-pi-caching-like-reasonix` parent
- [ ] Confirm 0 errors before marking this phase Complete
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Payload diff | Both extensions installed, both provider paths + `opencode/deepseek-v4-flash-free` exercised, mid-session model switch | Request/payload capture harness, manual diff |
| Regression comparison | Non-DeepSeek hit rate vs. a fresh A/B baseline, not the historical 89% figure | Session-scoped counters, scripted identical workload |
| Structural | Spec-kit template/anchor compliance | `validate.sh --recursive --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `003-fork-and-guard-cache-optimizer` complete | Internal | Blocked until then | Cannot verify composition |
| `004-adopt-deep-pi-deepseek` complete | Internal | Blocked until then | Cannot verify composition |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Composition verification fails (overlap or regression found)
- **Procedure**: Do not author the superseding decision record as a clean supersession — instead record the failure as a new finding, route back to phase 003 or 004's tasks.md for the actual fix, and re-run this phase's verification once fixed. This phase never patches code directly; it only verifies and documents.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```
┌──────────────────┐     ┌───────────────────┐     ┌────────────────────────────┐
│   Phase 003       │────►│   Phase 004        │────►│   Phase 005 (this)          │
│   Fork + Guard    │     │   Adopt deep-pi    │     │   Verify + decision record  │
└──────────────────┘     └───────────────────┘     └────────────────────────────┘
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Patched `pi-cache-optimizer` (003) | None | Narrowly-guarded fork | Phase 004's safety, this phase's verification |
| `deep-pi` install (004) | Phase 003 fork active | DeepSeek-side extension | This phase's verification |
| Composition verification (this phase) | Phases 003 and 004 | Decision-record evidence | Packet close |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Phase 003 (Fork & Guard)** - blocks everything downstream - CRITICAL
2. **Phase 004 (Adopt deep-pi)** - blocks this phase's verification - CRITICAL
3. **Phase A (Composition Verification, this phase)** - blocks the decision record's Accepted status - CRITICAL

**Total Critical Path**: Sequential across all three phases; no parallel opportunity since each phase's output gates the next.

**Parallel Opportunities**:
- None. Phase B (Decision Reconciliation) can begin drafting the decision record's narrative in parallel with Phase A's live tests, but the Accepted status still waits on Phase A's results.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|-------------------|--------|
| M1 | Composition verified | REQ-001/REQ-002 pass via payload diff on live sessions, including a mid-session model switch | End of Phase A |
| M2 | Decision record recorded | Status Accepted with cited evidence, honestly grounded | End of Phase B |
| M3 | Packet closed | `validate.sh --recursive --strict` returns 0 errors on the full 039 packet | End of Phase C |
<!-- /ANCHOR:milestones -->

---

<!-- ANCHOR:ai-execution -->
## AI EXECUTION PROTOCOL

### Pre-Task Checklist
- [ ] Confirm phases 003 and 004 both show Complete status before starting T001
- [ ] Re-read the current `pi-cache-optimizer-stats.json` baseline before running the non-DeepSeek regression check

### Execution Rules

| Rule | Requirement |
|------|-------------|
| No code changes | This phase only verifies and documents; a failed check routes back to phase 003/004, never a local patch here |
| Evidence before Accepted | `decision-record.md` status stays Proposed until CHK-020/021/022 in `checklist.md` all pass |
| Real sessions only | Composition checks require live Pi sessions with an actual payload diff, not static source reads or stats-counter visibility alone |

### Status Reporting Format
Each task in `tasks.md` reports PASS/FAIL/BLOCKED with the specific evidence observed (stats values, session output), not a bare checkmark.

### Blocked Task Protocol
If T001 finds phase 003 or 004 incomplete, mark T001 `[B]`, halt all downstream tasks in this phase, and report the blocker back to the operator rather than proceeding on an unverified assumption.
<!-- /ANCHOR:ai-execution -->
