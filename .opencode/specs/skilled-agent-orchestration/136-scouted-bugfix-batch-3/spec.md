---
title: "Feature Specification: Scouted Bugfix Batch 3"
description: "Batch 3 of the scouted deep-research targets: a second fresh 20. Twenty parallel gpt-5.5-fast confirm deep-dives classified each headline (7 CONFIRMED, 9 partial-but-real, 4 REFUTED — gemini-compact already calls sanitizeRecoveredPayload internally; 3 code-graph regex lastIndex claims — the while-exec loop resets correctly). 1 partial EXCLUDED from auto-fix (council scoreVerdictProgression — its fix would change stop-policy, a product decision; flagged not fixed). 12 implement-and-test agents fixed the rest (only the real part of each partial); every diff reviewed."
trigger_phrases:
  - "scouted bugfix batch 3"
  - "code-graph stress tmpdir pollution"
  - "convergence persist-snapshot round-id"
  - "devin compact recovery"
  - "mk-spec-memory launcher toctou"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/136-scouted-bugfix-batch-3"
    last_updated_at: "2026-06-03T08:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "20 deep-dives: 7 confirmed, 9 partial-but-real, 4 refuted; 1 partial excluded"
    next_safe_action: "All 12 fixes shipped; validate --strict and reconcile completion metadata"
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
    answered_questions:
      - "User directive: fix the second fresh 20 scouted targets (batch 3), verify-first; fix only the REAL part of each partial; do not auto-fix the council scoreVerdictProgression partial (product decision, flagged not fixed)."
---
# Feature Specification: Scouted Bugfix Batch 3

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
| **Branch** | `136-scouted-bugfix-batch-3` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
A second scout surfaced a fresh 20 high-risk targets across previously-untouched subsystems: code-graph stress tests, the deep-loop convergence script, the devin compact-recovery hook, install scripts, the mk-spec-memory launcher, shell version guards, vector-index retention sweeps, memory-search community gating, agent finding-registry filenames, and AI-council skill asset references. Many of the 20 headlines did not survive contact with the real code: 4 were fully refuted (gemini-compact already calls `sanitizeRecoveredPayload` internally; 3 code-graph regex `lastIndex` claims — the while-exec loop resets correctly). Of the 9 partial-but-real targets, 1 (council `scoreVerdictProgression`) was excluded from auto-fix because its proposed change would alter stop-policy, a product decision that requires deliberate sign-off rather than a scout-driven patch.

### Purpose
Run a verify-first batch fix over the fresh 20 scouted targets: deep-dive each in parallel to confirm, partially-confirm, or refute its headline before editing, then fix only the REAL part of each confirmed/partial target — never the refuted headline — with parallel implement-and-test agents, and prove each fix with stack-appropriate verification before claiming completion.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **DEEP-DIVE** each of the 20 fresh scouted targets in parallel (gpt-5.5-fast) to confirm/partially-confirm/refute the headline against the real code.
- **CLASSIFY** the 20: 7 CONFIRMED, 9 partial-but-real, 4 REFUTED (gemini-compact `sanitizeRecoveredPayload` already called internally; 3 code-graph regex `lastIndex` claims where the while-exec loop resets correctly).
- **EXCLUDE** 1 partial from auto-fix (council `scoreVerdictProgression` — the proposed fix changes stop-policy; flagged as a product decision, not patched).
- **FIX** the remaining 12 confirmed + partial targets across 23 files (sources + added regression tests), fixing only the REAL part of each partial.
- **VERIFY** every fix: targeted regression test per fix; `npm run build` for the affected TS MCP servers; `node --check` for the deep-loop `.cjs`; `npm run build` exit 0 for system-spec-kit.

### Out of Scope
- Batches 1 and 2 targets (fixed in `134-scouted-bugfix-batch-1` and `135-scouted-bugfix-batch-2`).
- The 4 REFUTED headlines — NOT acted on: gemini-compact's `sanitizeRecoveredPayload` internal call; the 3 code-graph regex `lastIndex` while-exec loop reset claims.
- The refuted headline of each partial target — only the REAL lesser defect behind it is fixed.
- The council `scoreVerdictProgression` partial — excluded (product-decision boundary; flagged not fixed).
- Deploy/daemon recycle itself: mk-spec-memory daemon recycled by orchestrator (memory-search + retention daemon code); the launcher `.cjs` deploys on next launcher restart; install scripts, docs, stress tests, and the devin hook need no forced deploy.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `scan-stress.vitest.ts` + 2 sibling stress tests (+ fixture) | Modify | Replace `mkdtempSync(process.cwd())` with `os.tmpdir()`; remove macOS-only `process.chdir('/private/tmp')` from `vitest.config.ts`; scope beforeEach/afterEach chdir+restore for the handler requiring rootDir within cwd |
| `convergence.cjs` (deep-loop) | Modify | `--persist-snapshot` without `--round-id` now throws `INPUT_VALIDATION` (exit 3) instead of silently coalescing to `__latest__` |
| `session-start.ts` (devin) | Modify | `handleCompact` mirrors Claude's compact recovery (readCompactPrime → TTL-check → semantic-validate → Recovered Context sections → clearCompactPrime on success); static fallback only on cache-miss/expiry/validation-fail |
| `install-all.sh` | Modify | Correct wrong entry name for mk-spec-memory in `MCP_SCRIPTS` array |
| `mcp-code-mode/install.sh`, `mcp-chrome-devtools/install.sh` | Modify | Derive paths robustly (not via CWD assumption) so scripts run when invoked directly |
| `mk-spec-memory-launcher.cjs` | Modify | Stale bootstrap-lock reclaim uses claims-via-rename before delete (TOCTOU-safe; losing racer gets ENOENT → retry) |
| `_utils.sh` `check_node_version` | Modify | Full semver compare (not integer-only) so `20.10` vs required `20.11` is rejected correctly |
| `vector-index-mutations.ts` (+ test) | Modify | Retention sweep cascades cleanup to orphan `auto_entities`/`memory_entities` rows |
| `memory-search.ts` (+ test) | Modify | Community-search gated on `<3` weak results (shared with auto) + score derived from community match quality; not always-on with hard-coded 0.45 |
| `.claude/agents/deep-research.md`, `.gemini/agents/deep-research.md` | Modify | Correct stale findings-registry filename to the live name |
| `deep-ai-council/SKILL.md`, `loop_protocol.md` | Modify | Correct reference from deleted `prompt_pack_round.md.tmpl` to the live asset name |
| `checkpoint-v2-contention-stress.vitest.ts` + 2 sibling tests | Modify | Update hardcoded schema v29 → v30 with the enrichment columns; keep soak coverage |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Each headline is confirmed/partially-confirmed/refuted before any edit | 20 parallel gpt-5.5-fast deep-dives; each target classified CONFIRMED / partial-but-real / REFUTED with code evidence |
| REQ-002 | Refuted headlines are NOT acted on | The 4 REFUTED targets get no edit |
| REQ-003 | Only the REAL part of each partial target is fixed | The 9 partials: 8 fixed for the genuine lesser defect only; 1 excluded (product-decision boundary); refuted headline of each not acted on |
| REQ-004 | Every fix is verified with stack-appropriate checks | Per-fix regression test passes; affected TS servers `npm run build` exit 0; deep-loop `.cjs` `node --check` OK |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-005 | The P1 fixes land correctly | convergence exit 3 on missing `--round-id`; devin `handleCompact` recovers from compact prime; launcher lock reclaim is TOCTOU-safe |
| REQ-006 | The 12 fixes ship across 23 files with disjoint writes | 12 parallel implement-and-test agents; sources + added regression tests; orchestrator reviewed every diff; comment-hygiene clean |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 20 targets deep-dived; 7 CONFIRMED, 9 partial-but-real (1 excluded, 8 fixed), 4 REFUTED with code evidence; only the REAL part of each confirmed/partial target fixed (12 fixes / 23 files).
- **SC-002**: Every fix proven by its added regression test; comment-hygiene clean (no spec-path / packet-id artifacts in edited source).
- **SC-003**: system-spec-kit `npm run build` exit 0; deep-loop `.cjs` `node --check` OK; 45 stress tests pass with no repo pollution; `validate.sh --strict` Errors 0 for this packet.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Acting on a loud-but-wrong headline | Fix a non-existent defect, miss the real one | Verify-first deep-dive classified each target; only the REAL part of confirmed/partial targets was fixed |
| Risk | Treating a partial headline as fully correct | Scope leak into refuted framing | Each partial fix is scope-locked to the genuine lesser defect; the refuted headline is not acted on |
| Risk | Auto-fixing a product-decision boundary | Unintended stop-policy change | council `scoreVerdictProgression` partial excluded; flagged for deliberate sign-off |
| Risk | A "fix" could change behavior beyond the defect | Silent regression | Each fix is scope-limited; each has an added regression test; first fix-workflow attempt failed (Opus 0-token blip), succeeded on Sonnet retry |
| Risk | 12 parallel implement agents touching overlapping files | Conflicting edits / lost writes | Disjoint file sets per agent (23 files = sources + tests, no overlap) |
| Dependency | vitest.config.ts chdir guard was macOS-only | Stress test repo-pollution on Linux/CI | Replaced with `os.tmpdir()` + scoped beforeEach/afterEach chdir+restore for the handler requiring rootDir within cwd |
| Dependency | mk-spec-memory daemon recycle | memory-search + retention fixes inert until recycle | Recycle after commit; launcher `.cjs` deploys on next launcher restart; install scripts + docs + stress tests + devin hook need no forced deploy |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## 7. L2: NON-FUNCTIONAL REQUIREMENTS

### Correctness
- **NFR-C01**: `convergence.cjs` throws `INPUT_VALIDATION` (exit 3) when `--persist-snapshot` is set without `--round-id`, so prior snapshots cannot be silently overwritten by a coalesced `__latest__` key.
- **NFR-C02**: `mk-spec-memory-launcher.cjs` bootstrap-lock reclaim uses claims-via-rename before delete; a successor's fresh lockDir is a new inode the rename cannot touch; a losing racer gets ENOENT and retries — TOCTOU-safe.
- **NFR-C03**: `_utils.sh` `check_node_version` performs a full three-part semver compare so a Node version like `20.10` is correctly rejected when the minimum is `20.11`.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## 8. L2: EDGE CASES

- `convergence.cjs` invoked with `--persist-snapshot` and no `--round-id` → `INPUT_VALIDATION` error (exit 3); prior snapshots are never touched.
- `session-start.ts` `handleCompact` called when compact prime is missing, expired, or fails semantic validation → static fallback returned; `clearCompactPrime` only called on a validated successful recovery.
- `mk-spec-memory-launcher.cjs` stale lock reclaim: a successor has already written a fresh lockDir with a new inode → the rename move leaves the successor's lock untouched; the losing racer gets ENOENT and retries.
- `check_node_version` called with `20.10` against a minimum of `20.11` → correctly rejected by the full semver compare (integer-only compare accepted this incorrectly before).
- Code-graph stress test run on Linux/CI (no macOS `/private/tmp`) → `os.tmpdir()` used; no repo-pollution; the scan-stress handler test uses scoped chdir+restore rather than the removed config-level chdir.
- `memory-search.ts` community-search fired on a call with `>=3` strong results → gating suppresses the community pass; score derived from match quality rather than hard-coded 0.45.
- Retention sweep in `vector-index-mutations.ts` over entries whose `auto_entities`/`memory_entities` rows were not yet cleaned → cascade now removes orphans in the same sweep transaction.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## 9. L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 23 files (12 sources + added regression tests) across 12 disjoint targets in 8 subsystems |
| Risk | 15/25 | Correctness/concurrency-class fixes; 1 partial excluded on product-decision boundary; first attempt failed (0-token blip) |
| Research | 14/20 | 20 parallel confirm deep-dives (7 confirmed, 9 partial, 4 refuted), 12 parallel implement-and-test |
| **Total** | **47/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. Scope (the fresh 20 scouted targets), method (verify-first: confirm/partial/refute before fix; fix only the REAL part of each partial), the 4 refuted headlines, and the 1 excluded partial (product-decision boundary) are all confirmed.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Verification Checklist**: See `checklist.md`
- **Implementation Summary**: See `implementation-summary.md`
