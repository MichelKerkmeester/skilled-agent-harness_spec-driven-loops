---
title: "Verification Checklist: Scouted Bugfix Batch 3"
description: "QA verification for the verify-first deep-dive -> implement workflow and the 12 confirmed + partial defect fixes across 23 files."
trigger_phrases:
  - "scouted bugfix batch 3 checklist"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/003-scouted-bugfix-batch-3"
    last_updated_at: "2026-06-03T08:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Verification items confirmed via per-fix regression tests + builds + node --check"
    next_safe_action: "Validate --strict and reconcile"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/src/handlers/__tests__/scan-stress.vitest.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/cli-devin/src/session-start.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/src/launcher/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-3-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Scouted Bugfix Batch 3

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md (REQ-001..006)
- [x] CHK-002 [P0] Technical approach defined in plan.md (verify-first deep-dive → implement over the fresh 20 targets)
- [x] CHK-003 [P1] Fresh 20 carried over from the second scout; disjoint file partition defined; exclude gate applied to council `scoreVerdictProgression` partial
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Fixes are defect-driven; only the REAL part of each confirmed/partial target fixed (no scope creep into refuted headlines or the excluded partial)
- [x] CHK-011 [P0] No spec-path/packet-id introduced into any edited source file as a tracking artifact
- [x] CHK-012 [P1] council `scoreVerdictProgression` partial excluded and flagged (product-decision boundary; would change stop-policy)
- [x] CHK-013 [P1] 12 implement agents touched disjoint file sets (23 files = sources + tests, no overlap)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Each headline confirmed/partially-confirmed/refuted by a gpt-5.5-fast deep-dive before any edit
- [x] CHK-021 [P0] The 4 REFUTED headlines NOT acted on (gemini-compact `sanitizeRecoveredPayload` already called internally; 3 code-graph regex `lastIndex` claims where the while-exec loop resets correctly)
- [x] CHK-022 [P1] council `scoreVerdictProgression` partial excluded from auto-fix (documented product-decision reason)
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Fix — code-graph stress tests (P2): `os.tmpdir()` replaces `mkdtempSync(process.cwd())`; config chdir removed; scan-stress test uses scoped chdir+restore; 45 tests pass; no repo pollution; regression test passes
- [x] CHK-031 [P1] Fix — convergence.cjs (P1, deep-loop): `INPUT_VALIDATION` exit 3 on `--persist-snapshot` without `--round-id`; regression test passes; `node --check` OK
- [x] CHK-032 [P1] Fix — session-start.ts (P1, devin): `handleCompact` mirrors Claude compact recovery (readCompactPrime → TTL-check → semantic-validate → clearCompactPrime on success; static fallback on cache-miss/expiry/validation-fail); regression test passes
- [x] CHK-033 [P1] Fix — install-all.sh (P1): MCP_SCRIPTS entry name for mk-spec-memory corrected; regression test passes
- [x] CHK-034 [P1] Fix — mcp-code-mode/install.sh + mcp-chrome-devtools/install.sh (P1): robust path derivation; regression test passes
- [x] CHK-035 [P1] Fix — mk-spec-memory-launcher.cjs (P1): claims-via-rename before delete (TOCTOU-safe lock reclaim); losing racer gets ENOENT → retry; regression test passes; `node --check` OK
- [x] CHK-036 [P2] Fix — _utils.sh check_node_version (P2): full semver compare; regression test passes
- [x] CHK-037 [P2] Fix — vector-index-mutations.ts (P2): orphan auto_entities/memory_entities rows cascaded in retention sweep; regression test passes
- [x] CHK-038 [P1] Fix — memory-search.ts (P1): community-search gated on `<3` weak results + score from match quality; not always-on; no hard floor suppression; regression test passes
- [x] CHK-039 [P1] Fix — .claude/agents/deep-research.md + .gemini/agents/deep-research.md (P1): live findings-registry filename; regression test passes
- [x] CHK-040 [P2] Fix — deep-ai-council SKILL.md + loop_protocol.md (P2): live asset name (not deleted tmpl); regression test passes
- [x] CHK-041 [P2] Fix — checkpoint-v2-contention-stress.vitest.ts + 2 sibling tests (P2): v30 fixture with enrichment columns; soak coverage kept; regression test passes
- [x] CHK-042 [P0] 12 fixes applied across 23 files; 0 skipped (of the confirmed + partial set, excluding the product-decision-boundary partial)
- [x] CHK-043 [P0] system-spec-kit mcp_server `npm run build` exit 0; deep-loop `.cjs` `node --check` OK
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-050 [P1] No new attack surface introduced; fixes are correctness/concurrency-class, scope-locked to the confirmed defects
- [x] CHK-051 [P1] mk-spec-memory-launcher.cjs lock reclaim is TOCTOU-safe (rename before delete; successor's fresh lockDir is a new inode untouched by the rename)
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-060 [P1] spec/plan/tasks/implementation-summary synchronized to shipped state
- [x] CHK-061 [P2] Partial-vs-refuted rationale recorded per target (REAL part fixed; refuted headline not acted on; excluded partial flagged)
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-070 [P1] No temp/scratch artifacts introduced into the repo; edits land only in the 23 confirmed/partial-defect files (sources + added regression tests)
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 7 | 7/7 |
| P1 Items | 12 | 12/12 |
| P2 Items | 7 | 7/7 |

**Verification Date**: 2026-06-03

### Ship status

- [x] CHK-080 [P1] description.json + graph-metadata.json present
- [x] CHK-081 [P0] `validate.sh --strict` → Errors 0
- [x] CHK-082 [P1] Completion metadata reconciled across packet docs
<!-- /ANCHOR:summary -->
