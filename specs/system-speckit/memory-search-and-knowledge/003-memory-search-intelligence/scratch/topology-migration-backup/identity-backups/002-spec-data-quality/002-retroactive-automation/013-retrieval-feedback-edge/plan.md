---
title: "Implementation Plan: B3 Retrieval-Learning Feedback Edge"
description: "Capture an aggregate impression signal at the result-assembly seam, split never-retrieved into a recall-gap edge versus a below-floor edge using min_rank_seen, and queue edge-tagged refinement actions report-only behind a default-off flag."
trigger_phrases:
  - "retrieval feedback edge plan"
  - "impression signal capture"
  - "recall gap detector"
  - "below floor truncation edge"
  - "refinement queue governance"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-spec-data-quality/002-retroactive-automation/013-retrieval-feedback-edge"
    last_updated_at: "2026-07-04T17:12:09.476Z"
    last_updated_by: "markdown-agent"
    recent_action: "Created PLANNED retrieval-feedback-edge plan"
    next_safe_action: "Grep the result-assembly seam before adding capture"
    blockers: []
    key_files:
      - "plan.md"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/hybrid-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/learned-feedback.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-21-plan-005-013-retrieval-feedback-edge"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: B3 Retrieval-Learning Feedback Edge

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the plan names the simplest viable approach, affected surfaces, and verification path.
- Match phases to the stated scope. Remove setup theater that does not change the outcome.
FAILURE MODES:
- Over-planning, missing rollback, and treating assumptions as dependencies.
-->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript, Node |
| **Framework** | system-spec-kit memory MCP server |
| **Storage** | SQLite memory DB, new refinement_queue table |
| **Testing** | Vitest |

### Overview
This phase adds an impression signal to the retrieval-learning loop so the system can tell a real recall gap apart from a below-floor truncation casualty. It captures an aggregate impression at the result-assembly seam in `hybrid-search.ts`, classifies a never-retrieved doc using `min_rank_seen` in a new `detect-retrieval-gaps.ts` detector, and queues edge-tagged refinement actions report-only behind the default-off `SPECKIT_RETRIEVAL_GAP_DETECT` flag. The loop never auto-applies a change.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Problem statement clear and scope documented
- [ ] Success criteria measurable
- [ ] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Seam capture plus offline detector plus governed queue, all gated by a default-off flag.

### Key Components
- **Impression capture**: An aggregate hook at the result-assembly seam in `hybrid-search.ts` that records `impression_count` and a per-doc `min_rank_seen` before `truncateByConfidence` runs.
- **Gap detector**: A new `detect-retrieval-gaps.ts` that reads captured impressions and splits a never-retrieved doc into edge (a) recall-gap versus edge (b) below-floor truncation using `min_rank_seen` as the discriminator.
- **Refinement queue**: A new `refinement_queue` table that mirrors the `learned_feedback_audit` governance columns and stores edge-tagged rows report-only.

### Data Flow
A query assembles a candidate set. With the flag on, the seam records the impression aggregate and per-doc pre-truncation rank, then truncation narrows the set as it does today. The detector later reads those impressions, classifies each never-retrieved doc by edge, and writes edge-tagged rows into the `refinement_queue`. Nothing is auto-applied. The edge-a action is registered suggest-only and the edge-b row is advisory only.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

Use this section when `research_intent=fix_bug`, when planning from a deep-review FAIL/CONDITIONAL verdict, or when any finding touches security, path handling, env precedence, schema boundaries, persistence, public responses, or shared policy.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `hybrid-search.ts` result-assembly seam | Owns the assembled result set before `truncateByConfidence` | Add aggregate capture behind the default-off flag | Test asserts capture is skipped with the flag off and `min_rank_seen` is pre-truncation with it on |
| `search-flags.ts` | Owns the default-on runtime gates for search-pipeline controls | Export the default-off `SPECKIT_RETRIEVAL_GAP_DETECT` checker the seam reads | Checker compiles and the seam reads it through the exported function |
| `flag-ceiling.vitest.ts` `ACKNOWLEDGED_UNCEILINGED_FLAGS` | The drift-guard default-off acknowledgement list | Acknowledge `SPECKIT_RETRIEVAL_GAP_DETECT` as default-off, not in `ALL_SPECKIT_FLAGS` | Drift guard passes and the token is not soaked at true in `ALL_SPECKIT_FLAGS` |
| `confidence-truncation.ts:35 DEFAULT_MIN_RESULTS` | Owns the never-cut-below-3 minimum guarantee, not a cap. The cliff-conditional confidence stage (returns 3 to 20) and the token-budget stage are what cut candidates from the returned set | Unchanged, B3 only observes what truncation cut | Grep confirms no edit to the minimum-guarantee constant |
| `learned-feedback.ts:257 recordSelection` | Owns the positive selection edge and the audit governance shape | Unchanged, the queue copies its governance not its writes | Grep confirms no new write into the existing audit path |
| `learned-triggers-schema.ts` | Owns the learned-trigger DDL | Add the `refinement_queue` table mirrored on the audit columns | Schema test asserts the four governance columns exist |
| `detect-retrieval-gaps.vitest.ts` | New tests | Create edge-discriminator and report-only tests | Vitest run is green |

Required inventories:
- Same-class producers: `rg -n 'recordSelection|learned_feedback_audit|min_rank_seen' .opencode/skills/system-spec-kit/mcp_server/lib`.
- Consumers of changed symbols: `rg -n 'refinement_queue|SPECKIT_RETRIEVAL_GAP_DETECT|truncateByConfidence' . --glob '*.ts' --glob '*.js' --glob '*.md'`.
- Matrix axes: flag off versus on, recall-gap edge versus below-floor edge, governance eligible versus shadow versus expired.
- Algorithm invariant: `min_rank_seen` MUST reflect the pre-truncation rank so edge classification stays sound.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [ ] Confirm the result-assembly seam and the floor constant by grep before any edit
- [ ] Add the `refinement_queue` DDL mirrored on the `learned_feedback_audit` columns
- [ ] Register the default-off `SPECKIT_RETRIEVAL_GAP_DETECT` checker in `search-flags.ts` and acknowledge the token in the `flag-ceiling.vitest.ts` `ACKNOWLEDGED_UNCEILINGED_FLAGS` default-off list, not `ALL_SPECKIT_FLAGS`

### Phase 2: Core Implementation
- [ ] Add aggregate impression capture recording `impression_count` and per-doc `min_rank_seen` before truncation
- [ ] Build `detect-retrieval-gaps.ts` to split never-retrieved docs into recall-gap versus below-floor edges
- [ ] Queue edge-tagged refinement rows report-only and register the edge-a action suggest-only

### Phase 3: Verification
- [ ] Assert the flag-off path is byte-for-byte unchanged
- [ ] Assert edge classification and report-only governance with Vitest
- [ ] Update spec, plan, tasks, and checklist
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | Edge discriminator on `min_rank_seen`, flag-off no-op, report-only governance | Vitest |
| Integration | Seam capture against a controlled corpus producing one edge-a and one edge-b row | Vitest |
| Manual | Spot-check the queue rows carry the advisory C2 marker | Direct read |

**CI home.** The `detect-retrieval-gaps.vitest.ts` suite is a local-reproduce command only and is not wired into any CI workflow yet, so the declared test gate is unenforced in CI until a CI-wiring phase lands.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `015-prodmode-recall-gate` | Internal | Red | Edge-b below-floor actions stay advisory until the prod-mode completeRecall@3 gate exists |
| `learned_feedback_audit` governance in `learned-feedback.ts` | Internal | Green | The queue copies this shape, so a divergence creates a second un-governed audit surface |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: Any added cost on the flag-off search path or any sign of an auto-applied action.
- **Procedure**: Unset `SPECKIT_RETRIEVAL_GAP_DETECT` to dormant the capture and detector, then revert the seam edit and drop the `refinement_queue` table.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Setup) ──────┐
                      ├──► Phase 2 (Core) ──► Phase 3 (Verify)
Phase 1.5 (Flag) ─────┘
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core, Flag |
| Flag | Setup | Core |
| Core | Setup, Flag | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | 1-2 hours |
| Core Implementation | Med | 4-6 hours |
| Verification | Med | 2-3 hours |
| **Total** | | **7-11 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [ ] `SPECKIT_RETRIEVAL_GAP_DETECT` defaults off
- [ ] Flag-off no-op test green
- [ ] Report-only mutation guard test green

### Rollback Procedure
1. Unset `SPECKIT_RETRIEVAL_GAP_DETECT` to dormant the capture and detector
2. Revert the seam edit in `hybrid-search.ts`
3. Drop the `refinement_queue` table
4. Re-run the search suite to confirm the flag-off path is restored

### Data Reversal
- **Has data migrations?** Yes, the new `refinement_queue` table
- **Reversal procedure**: Drop the `refinement_queue` table, no other table is touched
<!-- /ANCHOR:enhanced-rollback -->
