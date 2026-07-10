---
title: "Feature Specification: Eval Benchmark Fidelity Remediation"
description: "Remediation scope for P1-1 forceAllChannels and P1-3 trigger-ablation no-op in the flag-eval driver."
trigger_phrases:
  - "028 eval benchmark fidelity remediation"
  - "forceAllChannels flag eval fix"
  - "trigger ablation no-op fix"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/003-review-remediation/001-eval-benchmark-fidelity"
    last_updated_at: "2026-06-19T00:00:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Created PENDING eval-benchmark-fidelity remediation scaffold"
    next_safe_action: "Fix the flag-eval driver routing before re-running the benchmark"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-19-028-006-001-eval-benchmark-fidelity"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions:
      - "This phase defines remediation scope only."
      - "The fix and benchmark re-run are executed by a separate seat."
---

<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Eval Benchmark Fidelity Remediation

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Executed (100% complete 2026-06-20 - see implementation-summary.md) |
| **Created** | 2026-06-19 |
| **Parent Spec** | ../spec.md |
| **Parent Packet** | `system-spec-kit/028-memory-search-intelligence/004-review-remediation` |
| **Phase** | 001 of 004 |
| **Predecessor** | None |
| **Successor** | ../002-memory-schema-and-concurrency/spec.md |
| **Source Review** | `../../archive/review-report.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The per-flag retrieval benchmark feeds the criterion-4 flip decision, but its driver measures every flag on a non-representative all-channels path, and its trigger-channel ablation is a complete no-op. Both defects are 028's own eval code, in scope, confirmed real against source. This is the only release-blocking finding class in the review: a flag can read baseline-neutral in the harness while changing real default behavior, so the benchmark evidence cannot be trusted until the driver routes the way production does.

### Purpose
Fix the flag-eval driver so it exercises the real default routing path and so each channel ablation actually disables its channel, then re-run the criterion-4 per-flag benchmark and update `benchmark-status.md`. The re-run supersedes the prior criterion-4 measurement. This phase defines that remediation scope, objective and verification steps only. A separate seat executes the fix.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- P1-1: the flag-eval driver hardcodes `forceAllChannels: true`, bypassing default query routing.
- P1-3: the trigger-channel ablation is a no-op, so its Recall@20 delta is pure noise.
- Re-running the criterion-4 per-flag benchmark on the corrected driver.
- Updating `benchmark-status.md` with the re-measured per-flag deltas and a note that the re-run supersedes the prior measurement.

### Out of Scope
- Changing production routing code (`hybrid-search.ts`, `query-router.ts`, `query-classifier.ts`). The fix is to the eval driver, not the runtime.
- The eval-harness P2 cluster (coverage guards, `ALL_CHANNELS` omissions, dropped diagnostic snapshots). Those are triaged in phase 004.
- The concurrent session's files and packet 030.

### Cited Findings

| ID | Location | Finding (quoted from review-report.md) |
|----|----------|----------------------------------------|
| P1-1 | `scripts/evals/run-retrieval-flag-eval.mjs:355` | "`search()` sets `forceAllChannels: true`. Production routing uses `routeQuery()` unless `forceAllChannels` is set (`hybrid-search.ts:1394-1396`), so simple and default production queries get measured with graph, degree and summary-capable channels forcibly active ... the per-flag off vs on delta this driver feeds into the criterion-4 flip decision ... is measured on a non-representative all-channels path." |
| P1-3 | `scripts/evals/run-retrieval-flag-eval.mjs:371` | "Trigger-channel ablation is a complete no-op, so its Recall@20 delta is pure noise. The channel-ablation-fn tries to disable the `trigger` channel by passing `triggerPhrases: []` (`line 371`), but `exactTriggerSearch` is called unconditionally at `hybrid-search.ts:1504` with no `activeChannels.has('trigger')` guard ... `exactTriggerSearch` (`783-826`) ignores `options.triggerPhrases` entirely." |

### Fix Intent (quoted)

- P1-1: route benchmark queries through the real default path. The driver must let `routeQuery()` choose `routeResult.channels` rather than forcing `activeChannels` to ALL channels, so a default simple/moderate query measures on `[vector,fts]` / `[vector,fts,bm25]` as production does, and `SPECKIT_CARDINALITY_PENALTY` (which "only damps the degree channel") is measured on a path that actually carries the degree lane.
- P1-3: gate the trigger channel correctly. Per the report, "any release decision attributing recall to the trigger channel rests on noise". The ablation must genuinely disable the trigger lane (an `activeChannels.has('trigger')` guard at the `exactTriggerSearch` call site, with `trigger` represented in the channel set), so the trigger row's delta, pValue and queriesChannelHelped/Hurt become meaningful.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scripts/evals/run-retrieval-flag-eval.mjs` | Modify later | Use real default routing. Gate the trigger channel correctly |
| `mcp_server/lib/search/hybrid-search.ts` | Investigate later | The `exactTriggerSearch` call site at `1504` lacks the `activeChannels.has('trigger')` guard the other channels have |
| `benchmark-status.md` (028 root) | Modify later | Re-measured per-flag deltas. Note the re-run supersedes the prior criterion-4 measurement |
| `spec.md` | Create | Defines remediation scope and acceptance criteria |
| `plan.md` | Create | Defines fix approach and verification route |
| `tasks.md` | Create | Keeps all remediation work PENDING |
| `checklist.md` | Create | Keeps all verification items PENDING |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Driver routes via the real default path | `run-retrieval-flag-eval.mjs` no longer hardcodes `forceAllChannels: true` for the per-flag pass. Default queries measure on the channels `routeQuery()` selects |
| REQ-002 | Trigger ablation actually disables the trigger lane | A trigger-ablated pass produces a different trigger result than baseline. The trigger row delta is no longer identical-by-construction |
| REQ-003 | Criterion-4 benchmark re-run on the corrected driver | A fresh per-flag run is captured and its output recorded |
| REQ-004 | `benchmark-status.md` updated and prior measurement superseded | The doc reflects the new per-flag deltas and states the re-run supersedes the prior criterion-4 measurement |

### P1 - Required

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | No regression to default-off byte-identity | The corrected driver does not alter runtime behavior. Only measurement changes |
| REQ-006 | Flip decision re-evaluated | The criterion-4 flip verdict is re-derived from the corrected deltas, not the prior all-channels deltas |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- The flag-eval driver measures the default-routing path, so `SPECKIT_CARDINALITY_PENALTY` and the other per-flag deltas reflect production behavior.
- The trigger-channel ablation produces a meaningful, non-noise delta.
- The criterion-4 per-flag benchmark is re-run and `benchmark-status.md` records the new deltas with an explicit supersession note.
- `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh .opencode/specs/system-spec-kit/028-memory-search-intelligence/004-review-remediation/001-eval-benchmark-fidelity --strict` exits 0 after the fix.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | The corrected routing flips a flag verdict | A previously baseline-neutral flag may now move recall | Re-derive the criterion-4 verdict from the new deltas. Document any flip |
| Risk | Embedder availability during the re-run | A degraded vector lane yields confidently-reported deltas (see phase 004 eval-correctness P2) | Assert embedding coverage before trusting the re-run numbers |
| Dependency | Aligned golden set | The benchmark needs the criterion-4 golden set | Reuse the existing aligned golden set captured for the prior run |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

- The driver change is measurement-only and must not alter any production routing path.
- The benchmark re-run must be reproducible from a recorded command and inputs.
- Default-off byte-identity for the runtime is preserved.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

- A flag that touches only the degree or summary lane can read neutral on the all-channels path but move on the default path. The re-run must surface this.
- If `routeQuery()` selects different channels per query complexity, the per-flag aggregate must account for the channel mix, not a single forced set.
- The trigger lane tokenizes the raw query and matches the `trigger_phrases` DB column, so disabling it requires a call-site guard, not just an empty `triggerPhrases` option.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Rating | Notes |
|-----------|--------|-------|
| File count | Small | One driver file plus a benchmark-status doc, plus one runtime investigation |
| Risk | Medium | Corrected measurement can change the release flip decision |
| Verification | Medium | Requires a benchmark re-run plus coverage assertion |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Does correcting the routing change any criterion-4 flag verdict, and if so, which flag and in which direction? This is answered by the re-run, not the scaffold.
<!-- /ANCHOR:questions -->
