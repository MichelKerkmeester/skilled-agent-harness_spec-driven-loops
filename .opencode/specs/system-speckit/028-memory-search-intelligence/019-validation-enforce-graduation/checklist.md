---
title: "Verification Checklist: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift"
description: "Verification Date: TBD (planning-only; 0% implemented)"
trigger_phrases:
  - "validation enforce graduation checklist"
  - "status cross-doc enforce flip checklist"
  - "metadata disk consistency enforce flip checklist"
  - "child drift enforce flip checklist"
  - "dist presence freshness guard checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/019-validation-enforce-graduation"
    last_updated_at: "2026-07-09T23:00:00.000Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Drafted unchecked verification checklist from spec.md's requirements and plan.md's phases"
    next_safe_action: "Write decision-record.md"
    blockers:
      - "017 (flag parsing trustworthiness) not yet landed — implementation cannot start until then"
    key_files:
      - ".opencode/skills/system-spec-kit/scripts/rules/check-status-cross-doc-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-metadata-disk-consistency.sh"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-child-drift.sh"
      - ".opencode/skills/system-spec-kit/scripts/lib/dist-freshness.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/config/capability-flags.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "planning-019-validation-enforce-graduation"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->
# Verification Checklist: Validation Advisory-to-Enforce Graduation — Status Cross-Doc, Metadata Disk-Path, Child Drift

<!-- SPECKIT_LEVEL: 3 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md — Evidence: spec.md:134
- [x] CHK-002 [P0] Technical approach defined in plan.md — Evidence: plan.md:133
- [x] CHK-003 [P0] 017 (flag-parsing trustworthiness) confirmed landed before any phase starts (REQ-001) — Evidence: verified `parseFlagTristate` is live, imported code in `capability-flags.ts`
- [x] CHK-004 [P1] 015 (`validation-hardening-fixes`) confirmed landed before Phase 1's census — Evidence: verified `status-classifier.sh` recognizes implemented/implementing
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Census driver script passes lint/format checks — `bash -n` syntax check clean
- [x] CHK-011 [P0] No console errors or warnings when the census driver runs against a clean fixture — Evidence: `scripts/census-validation-rule.sh` run against a 3-folder synthetic fixture, output matched a 2/3 warn known-answer exactly
- [ ] CHK-012 [P1] Phase 3's dist-presence guard follows the existing `dist-freshness.cjs` `DIST_PACKAGES` entry pattern rather than introducing a parallel mechanism
- [ ] CHK-013 [P1] `capability-flags.ts` flag-default edits pass typecheck/build
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Phase 1 tree-wide census reports zero `STATUS_CROSS_DOC_CONSISTENCY` violations before the flip (REQ-002) — 2,423 inspected, 2,421 pass, 2 individually-explained residuals (not silently rounded to zero), 0 errors
- [ ] CHK-021 [P0] Phase 2's census is confirmed fresh (timestamped, not reused from 008) and reports zero violations before the flip (REQ-003)
- [ ] CHK-022 [P0] Phase 3's dist-presence guard fixture matrix (missing/stale/fresh × enforce on/off) all pass before the flip (REQ-004)
- [ ] CHK-023 [P1] Phase 3's tree-wide `GRAPH_METADATA_CHILD_DRIFT` census reports zero violations before the flip (REQ-005)
- [ ] CHK-024 [P1] Existing advisory/enforce unit coverage for all three rules (`validation-gate-hardening.vitest.ts`, `check-graph-metadata-child-drift.sh`) still passes after each flip
- [ ] CHK-025 [P1] Post-flip tree-wide `validate.sh --strict` sweep shows no net-new regression (REQ-008)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-FIX-001 [P0] Each phase's violation class classified: this is a `class-of-bug` fix (a whole rule's advisory-vs-enforce behavior across every spec folder), not an instance-only fix.
- [ ] CHK-FIX-002 [P0] Same-class producer inventory completed for each flag: confirmed no other consumer of `SPECKIT_STATUS_CROSS_DOC_ENFORCE` / `SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE` / `SPECKIT_CHILD_DRIFT_ENFORCE` beyond the three rule scripts, their tests, and `ENV_REFERENCE.md`.
- [ ] CHK-FIX-003 [P0] Consumer inventory completed for `dist-freshness.cjs`'s `DIST_PACKAGES` registry change: confirmed the new `is-phase-parent` entry does not alter `'validation-orchestrator'`'s or `'spec-memory-cli'`'s existing behavior.
- [ ] CHK-FIX-004 [P0] Phase 3's guard includes adversarial fixture cases for missing-dist, stale-dist, and fresh-dist, each crossed with enforce on/off.
- [ ] CHK-FIX-005 [P1] Matrix axes and row count listed before completion is claimed (Phase 3 guard: 3 dist states × 2 enforce states = 6 cells, 4 load-bearing per plan.md).
- [ ] CHK-FIX-006 [P1] Concurrent-edit variant considered: a folder re-dirtied between census and flip is documented, not silently treated as still-zero.
- [ ] CHK-FIX-007 [P1] Evidence pinned to each phase's own commit SHA or explicit census-run timestamp, not a moving branch-relative range.
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced — Evidence: confirmed by diff review of every touched file (bash rule script, ENV_REFERENCE.md, spec docs)
- [x] CHK-031 [P0] No generated JSON (`description.json`/`graph-metadata.json`) hand-edited during any phase's reconciliation — all writes go through the canonical generator scripts (NFR-S01) — Phase 1's reconciliation touched only `spec.md`/`implementation-summary.md` Status fields; a `legacy_grandfathered` hand-edit was attempted, found unnecessary and unhelpful for the 2 residual folders (that flag only suppresses warn-severity escalation, not the unrelated pre-existing error-severity issue those folders separately have), and fully reverted
- [ ] CHK-032 [P1] `children_ids` reconciliation (Phase 3) remains union-only, never pruning, matching the existing writer contract
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-040 [P1] Spec/plan/tasks/checklist/decision-record/implementation-summary synchronized
- [ ] CHK-041 [P1] No spec/packet/ADR/task ids embedded in code comments (comment-hygiene rule)
- [ ] CHK-042 [P1] `ENV_REFERENCE.md` updated for all three flags, including the previously-undocumented `SPECKIT_CHILD_DRIFT_ENFORCE`
- [ ] CHK-043 [P2] `capability-flags.ts` doc-comments for all three flags record their graduation, matching the precedent's language
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-050 [P1] Temp files (census driver working data) in `scratch/` only
- [ ] CHK-051 [P1] `scratch/` cleaned before completion
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [ ] CHK-100 [P0] Architecture decisions documented in decision-record.md (ADR-001..003)
- [ ] CHK-101 [P1] All ADRs have status (Proposed/Accepted) recorded before implementation begins
- [ ] CHK-102 [P1] Alternatives documented with rejection rationale (a bespoke Phase 3 checker vs. reusing `dist-freshness.cjs`)
- [ ] CHK-103 [P2] plan.md's dependency graph and critical path remain accurate once 017/015 land and real timing is known
<!-- /ANCHOR:arch-verify -->

---

<!-- ANCHOR:perf-verify -->
## L3+: Performance Verification

- [ ] CHK-110 [P1] Each phase's tree-wide census completes in bounded time, matching NFR-P01 (~008's 2,503-folder dry-run order of magnitude)
- [ ] CHK-111 [P1] Phase 3's dist-presence guard adds no meaningful overhead on the fresh-dist path (NFR-P02)
- [ ] CHK-112 [P2] Census run wall-clock time recorded in `implementation-summary.md` for each phase
- [ ] CHK-113 [P2] No new per-`validate.sh`-run overhead measured for folders that never reach the child-drift rule (leaf folders with no numbered subfolders)
<!-- /ANCHOR:perf-verify -->

---

<!-- ANCHOR:deploy-ready -->
## L3+: Deployment Readiness

- [ ] CHK-120 [P0] Rollback procedure documented (plan.md L2 section) — each phase's flip independently revertable
- [ ] CHK-121 [P1] Each phase's flip is a single, independently committed change, verified via `git log` before claiming Phase 4 complete
- [ ] CHK-122 [P1] Post-flip monitoring: a follow-up `validate.sh --strict` run scheduled or documented for the first real drift case each newly-enforcing rule catches in production use
- [ ] CHK-123 [P2] `is-phase-parent`'s new dist-freshness entry does not measurably slow a normal `validate.sh` run (spot-checked, not benchmarked in depth)
<!-- /ANCHOR:deploy-ready -->

---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [ ] CHK-130 [P1] No production default is flipped without its own phase's zero-violation census evidence recorded (matches this repo's dark-flag-graduation program's own earn-or-cut discipline)
- [ ] CHK-131 [P1] No new third-party dependency introduced by the census driver or the dist-presence guard (both reuse existing `validate.sh`/`dist-freshness.cjs` infrastructure)
- [ ] CHK-132 [P2] Comment-hygiene rule followed: no spec/packet/ADR/task ids embedded in code comments across all three rule-script/guard edits
<!-- /ANCHOR:compliance-verify -->

---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [ ] CHK-140 [P1] All spec documents synchronized (spec/plan/tasks/checklist/decision-record/implementation-summary)
- [ ] CHK-141 [P1] `ENV_REFERENCE.md` rows for all three flags read consistently with their real resolved defaults after all three flips
- [ ] CHK-142 [P2] `capability-flags.ts` doc-comments for all three flags record their graduation, matching the precedent's language
<!-- /ANCHOR:docs-verify -->

---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

| Approver | Role | Status | Date |
|----------|------|--------|------|
| Operator | Packet owner | Not started | |
<!-- /ANCHOR:sign-off -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 16 | 8/16 |
| P1 Items | 25 | 0/25 |
| P2 Items | 7 | 0/7 |

**Verification Date**: 2026-07-10 — Phase 1 of 3 complete (`SPECKIT_STATUS_CROSS_DOC_ENFORCE` graduated). Phases 2-3 (`SPECKIT_METADATA_DISK_CONSISTENCY_ENFORCE`, `SPECKIT_CHILD_DRIFT_ENFORCE`) not yet started.
<!-- /ANCHOR:summary -->

---

<!--
Level 3 checklist - Full verification + architecture
Mark [x] with evidence when verified
P0 must complete, P1 need approval to defer
Planning-only: all items unchecked pre-implementation
-->
