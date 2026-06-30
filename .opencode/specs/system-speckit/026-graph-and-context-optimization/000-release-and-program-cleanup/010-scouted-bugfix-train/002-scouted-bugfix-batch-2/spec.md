---
title: "Feature Specification: Scouted Bugfix Batch 2"
description: "Batch 2 of the 20 scouted deep-research targets: the remaining 15 after batch 1's 5. Fifteen parallel gpt-5.5-fast confirm deep-dives classified each headline (4 CONFIRMED, 9 partial-but-real, 2 REFUTED — the package.json hook-tests `specs/` path is fine because `specs/` is a symlink to `.opencode/specs/`, and the reconsolidation env-leak does not actually leak). Then 13 parallel implement-and-test agents fixed the confirmed + partial targets (fixing only the REAL part of each partial, never the refuted headline) across 22 files (sources + added regression tests). The orchestrator reviewed every diff; builds + tests pass."
trigger_phrases:
  - "scouted bugfix batch 2"
  - "chunking maxlength budget guard"
  - "coverage graph vacuous claim rate"
  - "vector index logical key unique"
  - "hf-local persisted dim contract"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/135-scouted-bugfix-batch-2"
    last_updated_at: "2026-06-03T07:30:00Z"
    last_updated_by: "claude-opus"
    recent_action: "15 gpt-5.5-fast confirm deep-dives: 4 confirmed, 9 partial-but-real, 2 refuted"
    next_safe_action: "Fix the 13 confirmed+partial defects with parallel implement agents, verify-first"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-2-session"
      parent_session_id: null
    completion_pct: 40
    open_questions: []
    answered_questions:
      - "User directive: fix the remaining 15 scouted targets (batch 2), verify-first; fix only the REAL part of each partial-but-real target, never the refuted headline."
---
# Feature Specification: Scouted Bugfix Batch 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-03 |
| **Branch** | `135-scouted-bugfix-batch-2` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 8-agent scout that fed batch 1 surfaced 20 high-risk deep-research targets; batch 1 fixed the top 5, leaving 15 latent code defects untriaged across chunking, the deep-loop runtime, embeddings, vector-index validation, skill-advisor, code-graph, and benchmark/runner tooling. Many of the 15 carried a loud headline that did not survive contact with the real code: some headlines were only partially correct (a genuine but lesser defect sat behind a wrong framing), and two were fully refuted — the `package.json` hook-tests `specs/` path is fine because `specs/` is a symlink to `.opencode/specs/`, and the reconsolidation env-leak does not actually leak. Acting on the headlines directly risked fixing defects that did not exist while missing the real ones.

### Purpose
Run a verify-first batch fix over the remaining 15 scouted targets: deep-dive each in parallel to confirm, partially-confirm, or refute its headline before editing, then fix only the REAL part of each confirmed/partial target — never the refuted headline — with parallel implement-and-test agents, and prove each fix with stack-appropriate verification before claiming completion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **DEEP-DIVE** each of the 15 remaining scouted targets in parallel (gpt-5.5-fast) to confirm/partially-confirm/refute the headline against the real code.
- **CLASSIFY** the 15: 4 CONFIRMED, 9 partial-but-real, 2 REFUTED (symlinked `specs/` path; non-leaking reconsolidation env).
- **FIX** the 13 confirmed + partial targets across 22 files (sources + added regression tests), fixing only the REAL part of each partial.
- **VERIFY** every fix: targeted regression test per fix; `npm run build` for the three TS MCP servers; `node --check` for the deep-loop `.cjs`.

### Out of Scope
- Batch 1's 5 targets (already fixed in `134-scouted-bugfix-batch-1`).
- The 2 REFUTED headlines — NOT acted on: the hook-tests `specs/` path (symlink to `.opencode/specs/`) and the reconsolidation env-leak (does not leak).
- The refuted headline of each partial target — only the REAL lesser defect behind it is fixed.
- gpt-5.5's cloud-fallback magic-number refactor in `auto-select.ts` — SKIPPED as a behavior-neutral no-op.
- Deploy/daemon recycle itself: the orchestrator recycles the mk-spec-memory daemon (shared/ + migration changes); skill-advisor + code-graph dist deploy on their next restart.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `chunking.ts` (+ test) | Modify | `maxLength<=0` guard + `remainingBudget<=0` break on the critical-section loop + code-point-safe truncation |
| `coverage-graph-signals.ts` (+ test) | Modify | claimVerificationRate vacuous-pass 1.0 with no CLAIM nodes (was 0 → perpetual CONTINUE) |
| `fanout-run.cjs`, `fanout-merge.cjs` (+ tests) | Modify | stale gemini fallback model; merge drops per-lineage resolvedQuestions/resolvedFindings |
| `spec-doc-health.ts`, `rrf-fusion.ts`, `auto-select.ts` (+ tests) | Modify | phase-parent false health errors; two-list fusion normalization; hf-local persisted dim |
| `semantic-shadow.ts`, `vector-index-schema.ts`, `readiness-marker.ts` (+ tests) | Modify | shadowOnly liveness; missing unique-index validation; workspace-root marker base |
| `dispatch-minimax.cjs`, `test-opencode-plugins.ts` (+ tests) | Modify | conditional `--agent`; stale plugin import name |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each headline is confirmed/partially-confirmed/refuted before any edit | 15 parallel gpt-5.5-fast deep-dives; each target classified CONFIRMED / partial-but-real / REFUTED with code evidence |
| REQ-002 | Refuted headlines are NOT acted on | The 2 REFUTED targets (symlinked `specs/` path; non-leaking reconsolidation env) get no edit |
| REQ-003 | Only the REAL part of each partial target is fixed | The 9 partials are fixed for the genuine lesser defect only; the refuted headline of each is not acted on; no scope leak |
| REQ-004 | Every fix is verified with stack-appropriate checks | per-fix regression test passes; TS servers `npm run build` exit 0; deep-loop `.cjs` `node --check` OK |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The P1 deep-loop / vector-index fixes land correctly | coverage-graph vacuous-pass stops perpetual CONTINUE on early graphs; fanout-run uses the current gemini fallback model; vector-index validates the v28 active-row unique index |
| REQ-006 | The 13 fixes ship across 22 files with disjoint writes | 13 parallel implement-and-test agents; sources + added regression tests; orchestrator reviewed every diff; comment-hygiene clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 15 targets deep-dived; 4 CONFIRMED, 9 partial-but-real, 2 REFUTED with code evidence; only the REAL part of each confirmed/partial target fixed (13 fixes / 22 files).
- **SC-002**: Every fix proven by its added regression test; comment-hygiene clean (no spec-path / packet-id artifacts in edited source).
- **SC-003**: system-spec-kit + skill-advisor + code-graph mcp_server `npm run build` exit 0; deep-loop `.cjs` `node --check` OK; `validate.sh --strict` Errors 0 for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Acting on a loud-but-wrong headline | Fix a non-existent defect, miss the real one | Verify-first deep-dive classified each target; only the REAL part of confirmed/partial targets was fixed |
| Risk | Treating a partial headline as fully correct | Scope leak into refuted framing | Each partial fix is scope-locked to the genuine lesser defect; the refuted headline is not acted on |
| Risk | A "fix" could change behavior beyond the defect | Silent regression | Each fix is provably scope-limited (e.g. vacuous-pass mirrors p0ResolutionRate; shadowOnly flip is inert for all public scoring); each has an added regression test |
| Risk | 13 parallel implement agents touching overlapping files | Conflicting edits / lost writes | Disjoint file sets per agent (22 files = sources + tests, no overlap) |
| Dependency | HfLocalProvider's own dim contract (canonical=768, custom=0) | — | auto-select mirrors the provider's first-embed drift hook instead of hardcoding 768 |
| Dependency | Orchestrator daemon recycle (mk-spec-memory shared/ + migration) | Fixes inert until recycle | Recycle after commit; skill-advisor + code-graph dist deploy on their next restart; deep-loop `.cjs`/`.ts` run via the consuming toolchain (no build) |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: `chunking.ts` guards `maxLength<=0` and breaks on `remainingBudget<=0` so the critical-section loop cannot spin or emit empty chunks; truncation is code-point-safe (no broken surrogate pairs from a raw `substring`).
- **NFR-C02**: `coverage-graph-signals.ts` returns a vacuous-pass 1.0 for claimVerificationRate when there are no CLAIM nodes, mirroring p0ResolutionRate, so an early-stage graph no longer drives a perpetual CONTINUE.
- **NFR-C03**: `vector-index-schema.ts` validates `idx_memory_logical_key_active_unique` in REQUIRED_INDEXES so the v28 active-row unique index can no longer be silently absent.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

- `chunking.ts` called with `maxLength<=0` or a budget that reaches 0 mid-loop → guard + break prevents a spin / empty-chunk emission; a multi-byte grapheme at a truncation boundary is preserved (code-point-safe slice, not a raw `substring`).
- A deep-loop graph with no CLAIM nodes yet → claimVerificationRate is 1.0 (vacuous-pass), so the loop is not forced to CONTINUE forever before any claim exists.
- A fanout merge across lineages → per-lineage `resolvedQuestions` / `resolvedFindings` are preserved via a `resolvedQuestionsById` Map mirroring `openQuestionsById` (previously dropped).
- A spec-doc-health scan over a phase parent → the local `isPhaseParent()` detector suppresses false health errors on absent plan/tasks/checklist (advisory-only annotation).
- An `hf-local` embedding provider with a custom model → persisted dim is 0 (custom) / 768 (canonical) mirroring HfLocalProvider's contract, so the provider's first-embed drift hook resolves the true dim instead of a hardcoded 768; the legacy `HF_LOCAL_MODEL` env alias is dropped so the persisted model name matches what the provider loads.
- A code-graph readiness-marker resolved from an unexpected CWD → the base dir resolves via a workspace-root helper (mirroring `core/config.ts`) instead of `process.cwd()`.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 22 files (13 sources + added regression tests) across 13 disjoint targets in 6 subsystems |
| Risk | 14/25 | Correctness/concurrency-class fixes; verify-first to avoid acting on partial/refuted headlines |
| Research | 14/20 | 15 parallel confirm deep-dives (4 confirmed, 9 partial, 2 refuted), 13 parallel implement-and-test |
| **Total** | **46/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Scope (the remaining 15 of 20 scouted targets), method (verify-first: confirm/partial/refute before fix; fix only the REAL part of each partial), and the 2 refuted headlines are confirmed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
</content>
</invoke>
