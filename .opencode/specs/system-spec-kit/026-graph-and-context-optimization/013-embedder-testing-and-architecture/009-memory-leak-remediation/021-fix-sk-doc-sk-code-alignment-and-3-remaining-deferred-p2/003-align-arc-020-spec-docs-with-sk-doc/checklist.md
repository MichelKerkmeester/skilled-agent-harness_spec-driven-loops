---
title: "Checklist: Arc 020 Spec Docs sk-doc Alignment"
description: "Verification checklist for the final arc 021 sk-doc sweep over arc 020 docs and selected skill surfaces."
trigger_phrases:
  - "021 003 checklist"
  - "arc 020 sk-doc sweep checklist"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/021-fix-sk-doc-sk-code-alignment-and-3-remaining-deferred-p2/003-align-arc-020-spec-docs-with-sk-doc"
    last_updated_at: "2026-05-23T14:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed sk-doc sweep checklist evidence"
    next_safe_action: "Review and commit documentation-only packet if desired"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0210030210030210030210030210030210030210030210030210030210030210"
      session_id: "021-003-sk-doc-arc-020-spec-sweep"
      parent_session_id: null
    completion_pct: 100
---
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
# Checklist: Arc 020 Spec Docs sk-doc Alignment

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:protocol -->
## VERIFICATION PROTOCOL

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## PRE-IMPLEMENTATION

- [x] CHK-001 [P0] Requirements documented in `spec.md`
- [x] CHK-002 [P0] Technical approach defined in `plan.md`
- [x] CHK-003 [P0] Scaffold strict validation passes before drift fixes; evidence: `validate.sh <spec-folder> --strict --verbose` exit 0, errors 0, warnings 0
- [x] CHK-004 [P0] User pre-approved branch `main`, Level 2 folder, no commit, and constrained documentation scope
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## CODE QUALITY

- [x] CHK-010 [P0] Arc 020 child docs checked for H2 ALL CAPS compliance; evidence: scanner found 24 docs with H2-case drift and 0 remaining violations after fixes
- [x] CHK-011 [P0] Arc 020 decision records checked for empty ADR `Evidence` rows; evidence: scanner found 0 empty evidence rows
- [x] CHK-012 [P0] Arc 020 docs checked for empty continuity `last_updated_at`, `recent_action`, and `next_safe_action`; evidence: scanner found 0 empty required fields
- [x] CHK-013 [P0] Arc 020 citations reviewed for genuinely stale or misleading mutable packet references; evidence: no runtime-evergreen violation applied to packet-history citations
- [x] CHK-014 [P0] Runtime skill docs checked for current-state mutable packet-ID violations; evidence: grep found 0 matches for `013-`, `009-`, `016-`, `020-`, or `021-` in the two rerank sidecar docs
- [x] CHK-015 [P0] Five doctor scripts checked for bash shebang, strict mode, and `COMPONENT:` header; evidence: all five have `#!/usr/bin/env bash`, `set -euo pipefail`, and `# COMPONENT: ... DOCTOR`
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## TESTING

- [x] CHK-020 [P0] `scratch/sk-doc-sweep-tally.csv` written with all audited arc 020 child docs; evidence: 36 rows, 24 `h2-case` fixes, 12 `none`
- [x] CHK-021 [P0] Strict validation passes for all six arc 020 child packets; evidence: each child `validate.sh --strict` exited 0
- [x] CHK-022 [P0] Strict validation passes for this 021/003 packet; evidence: final `validate.sh <spec-folder> --strict` exited 0
- [x] CHK-023 [P0] Strict validation passes for the arc 021 parent; evidence: final `validate.sh <arc-021-parent> --strict` exited 0
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## FIX COMPLETENESS

- [x] CHK-FIX-001 [P0] Actual arc 020 doc drift is fixed or deferred by ADR; evidence: 24 H2-case drift docs fixed, no deferrals
- [x] CHK-FIX-002 [P0] Actual skill-surface drift is fixed or recorded as not present; evidence: 0 evergreen-rule violations and 0 doctor-header violations found
- [x] CHK-FIX-003 [P0] ADR records sweep results and alternatives; evidence: ADR-001 accepted
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## SECURITY

- [x] CHK-030 [P0] No secrets, tokens, raw payloads, or new sensitive runtime values are introduced
- [x] CHK-031 [P1] Handoff absolute paths are limited to requested local working-tree paths
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## DOCUMENTATION

- [x] CHK-040 [P1] Spec/plan/tasks synchronized
- [x] CHK-041 [P1] `decision-record.md` includes at least one ADR
- [x] CHK-042 [P1] `implementation-summary.md` includes status, verification, and commit handoff
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## FILE ORGANIZATION

- [x] CHK-050 [P1] No files outside approved documentation scope are modified
- [x] CHK-051 [P1] No git commit or branch mutation performed
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## VERIFICATION SUMMARY

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 20 | 20/20 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-05-23
<!-- /ANCHOR:summary -->
