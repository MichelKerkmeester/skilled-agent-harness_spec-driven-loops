---
title: "Feature Specification: Fix sk-doc + sk-code Alignment + Close 3 Remaining Deferred P2"
description: "Phase parent for the final cleanup after arc 020: close the 3 still-deferred P2 findings and run a sk-doc + sk-code alignment sweep across the files + spec docs arc 020 touched."
trigger_phrases:
  - "021 sk-doc sk-code alignment"
  - "close 3 remaining deferred p2"
  - "arc 021 sidecar cleanup"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2"
    last_updated_at: "2026-05-23T13:00:00Z"
    last_updated_by: "main-agent"
    recent_action: "Scaffold phase parent for sk-doc + sk-code alignment + 3-deferred-P2 closure"
    next_safe_action: "Dispatch cli-codex on 021/001 to identify + close the 3 remaining deferred P2 findings"
    blockers: []
    key_files:
      - ".../015-deep-research-drift-and-simplification/research/findings-registry.json"
      - ".../020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/{001..006}/checklist.md"
      - ".opencode/bin/lib/ensure-rerank-sidecar.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-2026-05-23"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Final 3 deferred P2 IDs to be verified by codex sweep before any closure action."
      - "If any of the 3 require operator sign-off (e.g. cross-consumer API change), mark DEFERRED-AGAIN with ADR."
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: phase-parent | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Feature Specification: Fix sk-doc + sk-code Alignment + Close 3 Remaining Deferred P2

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | Draft |
| **Created** | 2026-05-23 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` (009 memory-leak remediation arc) |
| **Predecessor** | `../020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/` (commit 793d9ce5d3 — closed 31 of 34 deferred-P2) |
| **Handoff Criteria** | All 3 child packets pass validate + sk-code verifier + sk-doc structure check independently |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Three follow-up gaps remain after arc 020 closed 31 of 34 deferred-P2 findings:

1. 3 of 68 P2 findings from the 015 investigation are still NOT closed — they were either deferred-again during arc 020 (per the F99 escalation criterion + halt-on-first-regression rule) or surface in scopes outside arc 020's 6 buckets.
2. Code-side sk-code drift: `ensure-rerank-sidecar.cjs` (~40 functions) and `sidecar-worker.ts` (19 internal helpers) lack JSDoc/TSDoc. CRITICAL drift on the launcher CJS; MEDIUM-HIGH on the worker TS.
3. Doc-side sk-doc drift: arc 020's 30 spec docs across 6 child packets have not been swept against `extract_structure.py`. Likely flags: H2 not ALL CAPS, empty `Evidence` rows in ADRs, residual mutable-spec-ID mentions in skill docs.

### Purpose
Close the last 3 P2 findings (or document DEFERRED-AGAIN where operator sign-off is required), bring the launcher + worker code into full sk-code alignment, and sweep arc 020's spec docs against sk-doc structure rules. End state: cumulative P2 closure 68/68 (or 65/68 + 3 ADR'd DEFERRED-AGAIN); zero `verify_alignment_drift.py` violations on touched scopes; zero `extract_structure.py` flags on touched spec docs.

> **Phase-parent note:** This spec.md is the ONLY authored document at the parent level. Detailed planning, task breakdowns, checklists, and decisions live in the child phase folders.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Systematic checklist sweep across `016/001-004`, `017/001-005`, `018/001`, `019/001-004`, `020/001-006` children to pinpoint the 3 still-deferred P2 IDs.
- Closure (or DEFERRED-AGAIN ADR) for those 3 IDs.
- JSDoc + MODULE header + section dividers added to `ensure-rerank-sidecar.cjs`; TSDoc added to `sidecar-worker.ts` internal helpers.
- sk-doc structure sweep over arc 020's 30 spec doc files.
- sk-doc evergreen-packet-ID rule check on skill-md / README / changelog files touched in the arc 020 follow-up commits.

### Out of Scope
- Re-opening already-CLOSED findings.
- Refactoring code beyond pure-documentation passes (Step 2 is doc-only).
- Adding new ADRs to closed packets (only NEW ADRs in 021's own decision-records).
- Changing the canonical anchor schemas of validate.sh (those are stable).

### Files to Change (per-phase detail in children)

| Child | Surface | Phase |
|---|---|---|
| 001 | The 3 still-deferred P2 closure (likely ensure-rerank-sidecar.cjs / ensure_rerank_sidecar.py + index.ts barrel) | First |
| 002 | `ensure-rerank-sidecar.cjs` + `sidecar-worker.ts` + their sibling vitest if fixture updates needed | Second |
| 003 | `.../020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/{001..006}/{spec,plan,tasks,checklist,decision-record,implementation-summary}.md` | Third |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

| Phase | Folder | Focus | Status |
|---|---|---|---|
| 001 | `001-identify-and-close-3-remaining-deferred-p2/` | Sweep + close the 3 remaining P2 (or DEFERRED-AGAIN ADR) | Planned |
| 002 | `002-align-rerank-sidecar-cjs-and-sidecar-worker-with-sk-code/` | JSDoc + MODULE header on ensure-rerank-sidecar.cjs; TSDoc on sidecar-worker.ts helpers | Pending 001 |
| 003 | `003-align-arc-020-spec-docs-with-sk-doc/` | sk-doc structure sweep over 30 spec docs in arc 020 | Pending 002 |

### Phase Transition Rules

- Each phase MUST pass `validate.sh --strict` + the relevant verifier (`verify_alignment_drift.py` for Step 2; `extract_structure.py` for Step 3) before the next starts.
- Halt-on-first-regression rule from arc 020 carries over for 021/001 (logic changes only).
- 021/002 + 021/003 are pure documentation passes — no logic changes.

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001 | 002 | 3 deferred P2 closed OR ADR'd DEFERRED-AGAIN; embedders + bin vitest PASS | Strict validate exit 0 |
| 002 | 003 | `verify_alignment_drift.py` exit 0 on .opencode/bin/lib AND .../mcp_server/lib/embedders | Strict validate + verifier exit 0 |
| 003 | done | `extract_structure.py` exit 0 on all 30 arc 020 spec docs | Strict validate exit 0 on 021 parent |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Which 3 P2 IDs are still deferred? Codex 021/001 dispatch produces a definitive CSV before any code edit.
- For F103/F104 (JS↔Python parity drift): which side gets ported — JS pulls from Python or vice versa? Likely Python pulls from JS since arc 020/003 already hardened the JS side.
- For zero-importer barrel exports (F106/107/108): delete or `@internal`? Default: delete unless one test consumes via barrel that can't trivially switch to direct import.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Predecessor**: `../020-fix-investigation-deferred-p2s-for-behavior-and-api-changes/spec.md` (commit 793d9ce5d3)
- **Source registry**: `../015-deep-research-drift-and-simplification/research/findings-registry.json`
- **Parent arc**: `../spec.md`
- **Recent sk-code alignment exemplars**: commits `fbb8a23cda`, `e5113fedc4`, `8dfafc7189`, `f081112aab`.
- **Memory note**: `[[project-arc-021-sk-doc-sk-code-alignment]]`
