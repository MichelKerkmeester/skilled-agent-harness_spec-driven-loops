---
title: "Verification Checklist: Orchestrator Validation Parity"
description: "Level 3 checklist mapping the strict-filter fix, started-work exemption, bridge coverage, and gated rebuild to evidence-backed checks."
trigger_phrases:
  - "orchestrator parity checklist"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/001-orchestrator-validation-parity"
    last_updated_at: "2026-07-03T07:34:06Z"
    last_updated_by: "gpt-5.5-opencode"
    recent_action: "Recorded node-rule bridge follow-up evidence"
    next_safe_action: "Orchestrator verifies rebuild, bash suite, and live proofs"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fable-032-001-orchestrator-parity"
      parent_session_id: null
    completion_pct: 65
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Orchestrator Validation Parity

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist + level3-arch | v2.2 -->

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

- [x] CHK-001 [P0] Requirements documented in spec.md
  - **Evidence**: REQ-001..REQ-006 with live-code line references from the 2026-07-02 verification
- [x] CHK-002 [P0] Technical approach defined in plan.md
  - **Evidence**: plan.md architecture + dependency graph + rebuild-gated critical path
- [x] CHK-003 [P1] Decisions recorded
  - **Evidence**: decision-record.md ADR-001 (native-path fix) and ADR-002 (quiet-tree rebuild gate)

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Comment hygiene clean on all modified files
  - **Evidence**: `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh ".opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts" ".opencode/skills/system-spec-kit/mcp_server/tests/validation-orchestrator-bridge.vitest.ts"` exited 0 with no output.
- [x] CHK-011 [P1] Started-work predicate mirrors the shell heuristic exactly (anchored `- [x]` list items; legend rows ignored)
  - **Evidence**: `STARTED_WORK_ITEM_RE = /^[ \t]*[-*] \[[xX]\]/mu`; focused vitest covers not-started, real `- [x]`, checklist `- [X]`, and legend-only rows.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] REQ-001: strict-only rule executes under strict, absent under non-strict (unit-tested both directions)
  - **Evidence**: `npx vitest run tests/validation-orchestrator-bridge.vitest.ts` passed 1 file / 9 tests. The focused test now proves non-strict filtering excludes `EVIDENCE_MARKER_LINT`, strict filtering includes it, and the real compiled rule returns a well-formed `EVIDENCE_MARKER_LINT` entry.
- [x] CHK-021 [P0] REQ-002: exemption unit-tested both directions (not-started passes without summary; started still requires it)
  - **Evidence**: `validation-orchestrator-bridge.vitest.ts` uses real temp folders and asserts FILE_EXISTS pass without `implementation-summary.md` when not started, error when tasks/checklist contain completed list items, and pass for legend-only `[x]`.
- [ ] CHK-022 [P0] Full mcp_server vitest suite: 0 new failures
  - **Evidence**:
- [ ] CHK-023 [P0] REQ-005: test-validation-extended.sh fully green post-rebuild
  - **Evidence**:
- [x] CHK-024 [P1] Mutation check: break node-path resolution, confirm the unit test fails for the right reason, restore
  - **Evidence**: Temporary mutation changed the dist-validation root to a wrong directory. Focused vitest failed 2 tests for the intended reason: `resolveRegistryRuleScript('validation/evidence-marker-lint.ts')` returned `null`, and the real node-rule execution test threw `Expected evidence marker lint script to resolve`. Restored code and reran focused vitest green: 1 file / 9 tests.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-060 [P0] Class coverage: no OTHER native check demands completion docs from unstarted folders (audit docsForLevel consumers)
  - **Evidence**: `Grep docsForLevel\(` found 6 orchestrator consumers; only `validateFileExists` required missing docs unconditionally. Other consumers read existing files or skip absent content. `check-level-match.sh` already uses `_level_has_implementation_started`.
- [x] CHK-061 [P1] No other strict-semantics divergence remains between the registry bridge and shell path (registry audit: every strict_only rule accounted for)
  - **Evidence**: Registry audit found the remaining `validation/*.ts` strict entries split into native `GENERATED_METADATA_INTEGRITY` / `GENERATED_METADATA_DRIFT` entries already emitted before registry dispatch, plus `CONTINUITY_FRESHNESS` / `EVIDENCE_MARKER_LINT`, which now resolve to `scripts/dist/validation/*.js` and execute through the node bridge under strict.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P1] Path-traversal guard in resolveRegistryRuleScript still enforced and now unit-pinned
  - **Evidence**: Focused vitest asserts shell traversal payloads and validation traversal/nested payloads return `null`, while `validation/evidence-marker-lint.ts` resolves only to `scripts/dist/validation/evidence-marker-lint.js`.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] implementation-summary.md written with real evidence
  - **Evidence**: `implementation-summary.md` authored with focused test results, mutation observation, quality checks, and an Orchestrator verification pending section.
- [x] CHK-041 [P1] tasks.md marked accurately including the [B] gate task's real clearance
  - **Evidence**: T001-T006, T011, and T012 checked; T007, T008 [B], T009, and T010 remain unchecked for orchestrator-owned verification.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] Only orchestrator.ts + new test file + this spec folder modified
  - **Evidence**: `git status --porcelain -- .opencode/skills/system-spec-kit/mcp_server/lib/validation/orchestrator.ts .opencode/skills/system-spec-kit/mcp_server/tests/validation-orchestrator-bridge.vitest.ts .opencode/specs/system-speckit/028-memory-search-intelligence/015-deep-review-followup-hardening/001-orchestrator-validation-parity` showed only the allowed code/test paths and this spec folder.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:arch-verify -->
## L3: Architecture Verification

- [x] CHK-100 [P0] Implementation matches ADR-001 (native fix, no shell rerouting)
  - **Evidence**: `orchestrator.ts` changes stay in native registry filtering and `validateFileExists`; no shell rerouting or registry schema changes added.
- [ ] CHK-101 [P0] Rebuild followed ADR-002 (quiet tree confirmed or operator approval recorded, edit-to-rebuild window minutes)
  - **Evidence**:

<!-- /ANCHOR:arch-verify -->
---

<!-- ANCHOR:perf-verify -->
## L3: Performance Verification

- [x] CHK-110 [P2] Non-strict validate.sh runtime unchanged (strict-only rules not executed outside strict)
  - **Evidence**: Focused filter test expects non-strict registry eligibility to equal `['BASE_RULE']`, proving the node strict-only entry remains absent when `strict=false`.

<!-- /ANCHOR:perf-verify -->
---

<!-- ANCHOR:deploy-ready -->
## L3: Deployment Readiness

- [ ] CHK-120 [P0] dist-freshness check-all clean after the single rebuild
  - **Evidence**:
- [ ] CHK-121 [P0] Packet 030 child 007 known FILE_EXISTS error cleared (live validate.sh run)
  - **Evidence**:

<!-- /ANCHOR:deploy-ready -->
---

<!-- ANCHOR:compliance-verify -->
## L3+: Compliance Verification

- [x] CHK-130 [P2] No regulatory or data-privacy surface
  - **Evidence**: Internal validation tooling; N/A by construction

<!-- /ANCHOR:compliance-verify -->
---

<!-- ANCHOR:docs-verify -->
## L3+: Documentation Verification

- [x] CHK-140 [P1] All five docs agree on final state; no contradictory completion claims
  - **Evidence**: `spec.md` Status is In Progress; tasks/checklist/implementation-summary leave T007-T010 and orchestrator sign-off pending.

<!-- /ANCHOR:docs-verify -->
---

<!-- ANCHOR:sign-off -->
## L3+: Sign-Off

- [ ] CHK-150 [P0] Orchestrator (Claude) independently re-verified implementer claims with real command output
  - **Evidence**:

<!-- /ANCHOR:sign-off -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 7/13 |
| P1 Items | 9 | 9/9 |
| P2 Items | 2 | 2/2 |

**Verification Date**: 2026-07-03T07:34:06Z
**Verified By**: gpt-5.5-opencode focused implementer
**ADRs**: 2 documented (decision-record.md), both Accepted

<!-- /ANCHOR:summary -->
