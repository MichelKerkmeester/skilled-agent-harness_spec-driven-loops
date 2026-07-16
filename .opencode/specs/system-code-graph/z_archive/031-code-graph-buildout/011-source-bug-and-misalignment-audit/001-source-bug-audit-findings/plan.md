---
title: "Implementation Plan: Code Graph Source Audit Remediation [system-spec-kit/026-graph-and-context-optimization/004-code-graph/011-source-bug-and-misalignment-audit/plan]"
description: "Remediation plan for the 37 confirmed system-code-graph audit findings: sequencing P1 correctness/contract fixes ahead of P2 doc/cleanup drift, with per-cluster grouping and verification commands."
trigger_phrases:
  - "code graph audit remediation plan"
  - "system-code-graph fix plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-code-graph/031-code-graph-buildout/011-source-bug-and-misalignment-audit/001-source-bug-audit-findings"
    last_updated_at: "2026-05-29T08:05:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Drafted remediation sequencing for 37 findings"
    next_safe_action: "Open scoped fix packets for the P1 batch"
    blockers: []
    key_files:
      - "review-report.md"
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Code Graph Source Audit Remediation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

This packet's deliverable is the audit itself (`review-report.md`, 37 verified findings). This plan sequences the remediation so it can be executed as scoped follow-on work. The order is: (1) correctness/data-integrity bugs, (2) documented-contract breaches, (3) doc/code drift cleanup. Fixes are intentionally **not** applied in this packet — each batch is a separate, independently verifiable change against a live MCP server.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

- Each fix batch runs the package vitest suite (`mcp_server/tests/**`) before/after.
- `bash .opencode/skills/system-code-graph/...` build (`tsc`) clean after any source change.
- No fix widens scope beyond its finding's cited file(s).
- Doc-only fixes verified by re-reading the cited line.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

Findings cluster into seven areas, each mapping to a small, isolatable change surface:

| Cluster | Primary files | Nature |
|---------|---------------|--------|
| Concurrency / IPC | `lib/owner-lease.ts`, `mcp_server/index.ts`, `lib/working-set-tracker.ts` | lease CAS, shutdown re-entrancy, serialize round-trip |
| Diff line-math | `lib/diff-parser.ts`, `handlers/detect-changes.ts` | pre/post-image coordinate space, comment accuracy |
| Recovery / apply | `lib/apply-orchestrator.ts` | confirm-gate, rollback-failure status, dry-run target |
| Parser lifecycle | `lib/tree-sitter-parser.ts`, `lib/parser-skip-list.ts` | WASM `Tree.delete()`, quarantine gating, metric labels |
| Readiness / scan | `handlers/scan.ts`, `lib/ensure-ready.ts` | freshness gating, read-path DB mutation, candidate manifest, git timeout |
| DB / SQL | `lib/code-graph-db.ts` | `removeFile` transaction, per-file orphan sweep |
| Doc / code drift | `feature_catalog/**`, `manual_testing_playbook/**`, `references/**`, `README.md`, `INSTALL_GUIDE.md` | tool counts, stale file/line refs, version drift |
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

- **Code (behavioral):** CG-001..CG-010 family (P1 bugs/contracts) — require tests + build verification.
- **Docs (non-behavioral):** the 8-vs-11 tool-count family and stale-reference findings — single source-of-truth pass recommended over per-file edits.
- **Tests:** add coverage for the owner-lease reclaim race and `removeFile` transaction (currently untested per verification notes).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

1. **P1 correctness batch** — CG-005 (WASM `Tree.delete()`), CG-003 (`removeFile` transaction), CG-006 (failed-scan freshness), CG-008 (read-path DB mutation), CG-007 (candidate-manifest source). Each with a regression test.
2. **P1 contract batch** — CG-001 (status read-only/marker), CG-002 (schema enforcement), CG-009 (recovery confirm-gate), CG-010 (rollback-failure status), CG-004 (feature-catalog tool count).
3. **P2 cleanup batch** — concurrency hardening (lease CAS, shutdown guard, working-set serialize), diff-comment accuracy, parser quarantine/metrics, per-file orphan sweep, and the doc-drift family (tool counts, stale refs, version sync).
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

- Run `mcp_server/tests/**` (vitest) per batch; add tests for the two untested races (owner-lease reclaim, `removeFile` atomicity).
- For doc fixes, grep-verify counts/paths against the real schema array and filesystem.
- No live scan/apply needed for verification; unit + type-check suffice.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- `review-report.md` (this packet) is the authoritative input for all fix batches.
- Fix batches are independent of each other and can proceed in parallel except where they touch the same file (status.ts: CG-001; ensure-ready.ts: CG-007/CG-008).
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This packet creates documentation only — nothing to roll back. Each follow-on fix batch is a separate commit and is independently revertable.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

- Phase 1 (correctness) before Phase 3 cleanup where files overlap (parser-lifecycle, ensure-ready).
- Phase 2 contract fixes are independent; CG-002 (schema enforcement) is the largest single change.
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Batch | Findings | Rough effort |
|-------|----------|--------------|
| P1 correctness | 5 | M (each small + a test) |
| P1 contract | 5 | M (CG-002 schema layer is the largest) |
| P2 cleanup | 27 | S–M (mostly doc edits + a few small code changes) |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

Not applicable to the audit packet. For follow-on fix packets: commit per cluster, keep doc-only and code changes in separate commits so a doc revert never reverts a behavioral fix.
<!-- /ANCHOR:enhanced-rollback -->
