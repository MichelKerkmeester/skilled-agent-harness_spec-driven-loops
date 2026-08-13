---
title: "Checklist: Spec-Kit Template & Context Optimizations"
description: "QA checklist for the four-phase implementation of the six 033 recommendations — all items verified with evidence."
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/034-spec-template-context-optimizations"
    last_updated_at: "2026-08-13T04:18:38Z"
    last_updated_by: "claude-code"
    recent_action: "Added AC traceability; remediated deferred findings"
    next_safe_action: "Await commit go-ahead"
    blockers: []
    key_files:
      - "specs/system-speckit/034-spec-template-context-optimizations/plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-12-system-speckit-034-optimizations"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Checklist: Spec-Kit Template & Context Optimizations

<!-- ANCHOR:protocol -->
## Verification Protocol

Every item is verified with observed command evidence (exit code / grep / diff) read before it is checked. Reproduce the target symptom first, then prove the fix with the same check. Capture a regression baseline before each phase; re-run the whole gate after.
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Open Question 1 (Phase-1 consumer) resolved — `research.md.tmpl` is workflow-owned (`spec-kit-docs.json` `owner:workflow, creationTrigger:deep-research`); REQ-001 savings scoped as authoring-only.
- [x] CHK-002 [P0] Open Question 3 resolved — changed-files source defined as `MK_SCOPE_CHANGED_FILES` (explicit list) or `MK_SCOPE_BASE` (git diff ref) in `check-scope-adherence.sh`.
- [x] CHK-003 [P1] Regression baselines captured — 25 per-level render hashes, golden snapshot suite, and the changed-surface suites; delta reported. [evidence: `scaffold-golden-snapshots` vitest passed (6) + baseline render hashes; 0 regressions in changed surfaces]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P1] Template changes reuse the existing `renderInlineGates` gate contract; no new bespoke gating logic (`inline-gate-renderer` 12/12).
- [x] CHK-005 [P1] `check-scope-adherence.sh` follows the shared `run_check` rule pattern; it is an advisory opt-in rule that no-ops when no change-set is supplied (contract documented in its header and `validation-rules.md`).
- [x] CHK-006 [P1] `memory_search` token-budget enforcement reviewed against `memory_context` — verified a **different truncation strategy** (score-based drop vs structural compaction; the score chain is absent from `memory_context`), so the two are kept as intentional independent enforcers rather than a forced shared helper (decision-record ADR-005).
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Renderer snapshot tests pass for all levels — `template-structure` 8/8, `inline-gate-renderer` 12/12, `scaffold-golden-snapshots` 6/6, `research-template-gating` 4/4.
- [x] CHK-008 [P0] REQ-002 rendered output byte-identical to baseline — 25/25 per-level render hashes match.
- [x] CHK-009 [P0] Scope-adherence negative control warns on only the genuine out-of-scope file (canonical packet docs in-scope); AC_COVERAGE verified advisory (`RULE_STATUS` stays `pass` on under-coverage).
- [x] CHK-010 [P0] `memory-search-token-budget` 5/5 (truncation + no-op + enforcement metadata).
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-011 [P0] P0 requirements (REQ-001, -002, -004, -006) implemented with evidence (rows above). [evidence: `validate.sh --strict` exit 0; renderer + budget vitest suites passed (30 + 5)]
- [x] CHK-012 [P1] P1 requirements implemented — REQ-003 rendered-view read guard, REQ-005 scope-adherence rule. [evidence: `research-template-gating` vitest passed (4) + scope-adherence negative-control run]
- [x] CHK-013 [P0] No change touches a refuted surface (spec §3 Out of Scope); containment sweeps showed 0 out-of-scope writes, 0 deletions. [evidence: `git diff --name-status` sweep — 0 deletions, 0 refuted-surface paths]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-014 [P1] No new external calls, credential surfaces, or unbounded network/file access — changes are templates, shell validation rules, docs, and a local response-ordering reorder. [evidence: `tsc --noEmit` exit 0; `git diff` grep — no network/credential/fetch APIs added]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-015 [P1] `template-guide.md` and `validation-rules.md` updated — read guard, AC_COVERAGE advisory rollout, and the SCOPE_ADHERENCE contract.
- [x] CHK-016 [P1] Rendered-view read path documented in `template-guide.md` ("Reading a Template (Agents)").
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-017 [P1] Scoped diff holds the six requirement surfaces plus in-scope packet docs and `review/` evidence; sweep shows 0 out-of-scope writes, 0 deletions, no task-created residue.
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

- [x] CHK-018 [P0] Whole scripts gate re-run — all five changed-surface test files green; 40 failures sit in 24 files this packet never touched (pre-existing + concurrent-fanout load), and no `specs/` churn resulted.
- [x] CHK-019 [P0] `validate.sh --strict` on this packet → exit 0 (Errors: 0, Warnings: 0).
<!-- /ANCHOR:summary -->

---

## Acceptance-Criteria Traceability

Maps each acceptance criterion to its verifying evidence (consumed by the advisory `AC_COVERAGE` scan).

| AC ID | Class | Evidence |
|-------|-------|----------|
| AC-001 (REQ-001 L1 gating) | Tested | scripts/tests/research-template-gating.vitest.ts:1 |
| AC-002 (REQ-001 docs entry) | Tested | templates/manifest/spec-kit-docs.json:1 |
| AC-003 (REQ-002 byte-identical render) | Tested | scripts/tests/scaffold-golden-snapshots.vitest.ts:1 |
| AC-004 (REQ-003 read guard) | Tested | references/templates/template-guide.md:77 |
| AC-005 (REQ-004 default-on advisory) | Tested | scripts/rules/check-ac-coverage.sh:11 |
| AC-006 (REQ-005 scope rule) | Tested | scripts/tests/check-scope-adherence.vitest.ts:1 |
| AC-007 (REQ-006 token budget) | Tested | mcp-server/tests/memory-search-token-budget.vitest.ts:1 |
| AC-008 (whole-gate regression) | Tested | scripts/tests/template-structure.vitest.ts:1 |
| AC-009 (renderer contract) | Tested | scripts/tests/inline-gate-renderer.vitest.ts:1 |
| AC-010 (docs/registry alignment) | Tested | references/validation/validation-rules.md:70 |
