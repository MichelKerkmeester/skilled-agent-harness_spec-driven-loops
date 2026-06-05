---
title: "Implementation Plan: Deep Review of the Last 50 Commits"
description: "Plan for a read-only 20-iteration deep review of the last 50 commits across 9 research angles: parallel fan-out by angle, an adversarial verification round that downgrades over-eager candidates, then synthesis into a P0/P1/P2 findings report."
trigger_phrases:
  - "last 50 commits deep review plan"
  - "9 angle 20 iteration review"
  - "adversarial verification round"
  - "deep review convergence approach"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/016-last-50-commits-deep-review"
    last_updated_at: "2026-06-05T00:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "Authored plan for the 9-angle / 20-iteration review with an adversarial verification round"
    next_safe_action: "Owner triages the 3 P1 findings into a remediation packet"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "last-50-commits-deep-review-2026-06-05"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Review of the Last 50 Commits

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Repo code (TS/JS launchers, MCP servers, shared IPC) as ground truth |
| **Framework** | Native `@deep-review` (opus), parallel fan-out by research angle |
| **Storage** | Findings at `review/review-report.md`; iteration evidence in `review/iterations/`; no DB writes |
| **Testing** | `validate.sh --strict` on this packet; per-finding `file:line` code verification |

### Overview
A read-only review of the 50-commit range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`). Twenty iterations fan out across nine research angles, each producing candidate findings backed by direct code reads. Every candidate P1 then passes through an adversarial verification round whose explicit job is to disprove it by re-reading HEAD, so the report only keeps findings with a verified failure trace. The verdict converges to CONDITIONAL: no P0 is active, but multiple active P1s block an unconditional PASS.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented (9 angles, 50-commit range, read-only)
- [x] Success criteria measurable (verdict + counts + per-finding trace + refuted list)
- [x] Dependencies identified (native @deep-review opus, repo code at HEAD)

### Definition of Done
- [x] All acceptance criteria met (report exists with verdict, counts, traces, remediation order)
- [x] No reviewed source code edited (findings only)
- [x] Docs updated (spec/plan/tasks/implementation-summary for this packet)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

The review is a one-way comparison: code at HEAD `12de3d3a7e` (read-only) is the ground truth; nothing is modified. The pipeline is: inventory the 50-commit range (iter-1) -> parallel angle passes that read the actual source (iter-2 to iter-10) -> adversarial verification of every candidate P1 (iter-11 to iter-15) -> deepen latent items (iter-16 to iter-18) -> cross-cutting synthesis (iter-19) -> completeness critic (iter-20). The angle passes are candidate generators; the adversarial verification round is authoritative and overrides any candidate it cannot reproduce in code. The only writes land inside this packet (`spec/plan/tasks/implementation-summary` + `review/**` + metadata).
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

This packet is findings-only and edits no reviewed surface. The table records where the verified P1 defects live so the follow-on remediation packet can plan against them. No action is taken here.

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `context-server.ts:1563-1610` + `job-queue.ts:694-785` | `fatalShutdown` cleanup list has no job-queue stop; worker loop has no shutting-down/abort guard | not a consumer (review only) | F-A4-01 trace; fence absence verified iter-12 |
| `context-server.ts:1681-1692` vs `lib/runtime/shutdown-hooks.ts:129-148` | Divergent signal-handler stacks (exit 0 vs 143/130) that can race and bypass the ordered drain | not a consumer (review only) | F-X19-02 trace; subsumes F-A4-02/F-A4-03 |
| `deep-improvement/scripts/lib/mirror-sync-verify.cjs` + `mk-code-index-launcher.cjs:296-306` | Drift-verify harness aimed at agent mirrors, not runtime code forks (`processLiveness` forked) | not a consumer (review only) | F-X19-01 trace; socket-server fork already guarded, residual forks are not |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm the range `a9e9bdb0a5^..HEAD` (HEAD `12de3d3a7e`) and inventory the 50 commits (iter-1)
- [x] Define the 9 research angles (A1-A9) and seed candidate hypotheses per angle
- [x] Configure the native `@deep-review` (opus) parallel fan-out

### Phase 2: Core Implementation
- [x] Run the correctness + security + maintainability + traceability angle passes (iter-2 to iter-10), each reading actual HEAD source
- [x] Run the adversarial verification round on every candidate P1 (iter-11 to iter-15); downgrade unreproducible candidates
- [x] Deepen latent items and synthesize cross-cutting findings (iter-16 to iter-19)

### Phase 3: Verification
- [x] Run the completeness critic to close coverage gaps (iter-20)
- [x] Write `review/review-report.md` (verdict, counts, traces, refuted list, remediation order)
- [x] Run `validate.sh <folder> --strict` and reconcile this packet's completion metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Per-finding code verification | Every surviving P0/P1 cites a verified `file:line` failure trace at HEAD | Read/Grep on repo code |
| Adversarial verification | Every candidate P1 re-read at HEAD to disprove it before inclusion | @deep-review skeptic passes (iter-11 to iter-15) |
| Packet integrity | `validate.sh <folder> --strict` exits 0/1 (RESULT PASSED) | spec-kit validator |
| Read-only guarantee | No reviewed source code modified | git diff scoped to this packet |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Native `@deep-review` (opus) | Internal | Green | No parallel angle fan-out / adversarial round |
| Repo code at HEAD `12de3d3a7e` | Internal | Green | No ground truth for verification |
| `review/deep-review-state.jsonl` + `review/iterations/` | Internal | Green | No iteration evidence to cite |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The packet must be withdrawn.
- **Procedure**: Delete the `016-last-50-commits-deep-review/` folder. The work is additive and read-only on reviewed code, so no other repo state changes and no reviewed source needs reverting.
<!-- /ANCHOR:rollback -->
