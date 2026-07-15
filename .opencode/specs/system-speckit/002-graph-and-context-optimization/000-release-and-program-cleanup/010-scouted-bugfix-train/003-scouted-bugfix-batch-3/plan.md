---
title: "Implementation Plan: Scouted Bugfix Batch 3"
description: "Verify-first batch fix over the fresh 20 scouted candidates (second scout): 20 parallel gpt-5.5-fast confirm deep-dives classified each headline (7 CONFIRMED, 9 partial-but-real, 4 REFUTED — gemini-compact already calls sanitizeRecoveredPayload internally; 3 code-graph regex lastIndex claims — the while-exec loop resets correctly). 1 partial excluded from auto-fix (council scoreVerdictProgression — product-decision boundary). 12 implement-and-test agents fixed the rest across 23 files (sources + added regression tests), fixing only the real part of each partial. Spans code-graph stress tests, deep-loop convergence, devin compact-recovery, install scripts, mk-spec-memory launcher, shell version guards, vector-index retention, memory-search community gating, agent docs, and AI-council skill assets; every fix has a regression test; system-spec-kit npm run build exit 0; deep-loop node --check OK."
trigger_phrases:
  - "scouted bugfix batch 3 plan"
  - "verify-first second-scout fix workflow"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/003-scouted-bugfix-batch-3"
    last_updated_at: "2026-06-03T08:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "20 deep-dives done; 12 implement agents fixed 23 files; builds + regression tests green"
    next_safe_action: "Generate metadata, validate --strict, reconcile completion"
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
# Implementation Plan: Scouted Bugfix Batch 3

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Surface** | Mixed: TypeScript (system-spec-kit, system-code-graph, cli-devin) + deep-loop `.cjs` + shell scripts + markdown agent docs |
| **Executor** | 20 parallel `gpt-5.5-fast` confirm deep-dives + 12 disjoint-file implement-and-test agents |
| **Parallelism** | 20 deep-dives in parallel, then 12 implement agents on disjoint files (23 files = sources + tests, no overlap) |
| **Ground truth** | The real source code (deep-dive against actual loop resets, lock lifecycle, compact prime TTL, community gating logic, retention cascade); vitest config; live asset filenames |

### Overview
A verify-first pipeline continuing from batches 1 and 2. A second scout surfaced a fresh 20 targets across previously-untouched subsystems. DEEP-DIVE runs 20 parallel `gpt-5.5-fast` passes that confirm, partially-confirm, or refute each headline against the real code — classifying 7 CONFIRMED, 9 partial-but-real, and 4 REFUTED. Of the 9 partials, 1 (council `scoreVerdictProgression`) is excluded from auto-fix because the proposed change alters stop-policy, a product decision that requires deliberate sign-off. IMPLEMENT runs 12 parallel agents on disjoint file sets, each fixing only the REAL part of its target (never the refuted headline) and proving it with an added regression test. The orchestrator then reviews every diff, confirms comment-hygiene, and confirms builds + `node --check` before ship. The first fix-workflow attempt failed (Opus 0-token blip); succeeded on Sonnet retry.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Fresh 20 targets from the second scout assigned for deep-dive
- [x] Each headline assigned a deep-dive owner (confirm/partial/refute before any edit)
- [x] Disjoint file partition defined so the 12 implement agents never collide

### Definition of Done
- [x] 20 deep-dives done; 7 CONFIRMED, 9 partial-but-real, 4 REFUTED with code evidence
- [x] 1 partial excluded (council `scoreVerdictProgression`) on product-decision boundary; flagged not fixed
- [x] 12 confirmed + partial defects fixed across 23 files (disjoint agents), only the REAL part of each partial
- [x] Every fix has an added regression test that passes; comment-hygiene clean
- [x] system-spec-kit `npm run build` exit 0; deep-loop `.cjs` `node --check` OK; 45 stress tests pass; no repo pollution
- [x] description.json + graph-metadata.json present; validate --strict 0
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Fan-out / fan-in with a verify gate. The 20 fresh targets flow through deep-dive (confirm/partial/refute) and then implement (disjoint files), so no edit is made on an unverified or refuted headline and no two agents touch the same file.

### Key Components
- **DEEP-DIVE (20x gpt-5.5-fast)**: confirm/partially-confirm/refute each headline against the real code; emit CONFIRMED / partial-but-real / REFUTED + the real defect.
- **EXCLUDE gate**: council `scoreVerdictProgression` partial flagged on product-decision boundary; excluded from implement stage.
- **IMPLEMENT (12x disjoint agents)**: fix only the REAL part of each confirmed/partial target; prove with an added regression test.
- **REVIEW (orchestrator)**: read every diff, confirm comment-hygiene, confirm builds + `node --check`, then ship.
- **Reference contracts**: vitest `os.tmpdir()` pattern; POSIX rename-before-delete for lock reclaim; Node semver three-part compare; compact prime TTL + semantic-validate lifecycle.

### Data Flow
Fresh 20 scouted targets → DEEP-DIVE (confirm/partial/refute) → 7 confirmed + 9 partial + 4 refuted → EXCLUDE gate (1 partial excluded) → IMPLEMENT (disjoint files, REAL part only) → 12 fixes / 23 files → REVIEW (diffs + hygiene + builds + node --check) → ship.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| code-graph stress tests: `scan-stress.vitest.ts` + 2 sibling tests (P2) | `mkdtempSync(process.cwd())` guarded only by macOS-only `process.chdir('/private/tmp')` in vitest.config.ts → repo-pollution risk on Linux/CI | Replace with `os.tmpdir()`; remove config chdir; scan-stress test uses scoped beforeEach/afterEach chdir+restore | 45 stress tests pass; no repo pollution; regression test passes |
| `convergence.cjs` (P1, deep-loop) | `--persist-snapshot` without `--round-id` coalesced to `__latest__` → silently overwrote all prior snapshots | Throw `INPUT_VALIDATION` (exit 3) when `--persist-snapshot` set without `--round-id` | Regression test passes; `node --check` OK |
| `session-start.ts` (P1, devin) | `handleCompact` returned a static fallback only (couldn't recover) | Mirror Claude's compact recovery: readCompactPrime → TTL-check → semantic-validate → Recovered Context sections → clearCompactPrime on success; static fallback only on cache-miss/expiry/validation-fail | Regression test passes; system-spec-kit build exit 0 |
| `install-all.sh` (P1) | `MCP_SCRIPTS` array had wrong entry name for mk-spec-memory | Correct to the on-disk script name | Regression test passes |
| `mcp-code-mode/install.sh`, `mcp-chrome-devtools/install.sh` (P1) | Failed when run directly (CWD assumption) | Derive paths robustly | Regression test passes |
| `mk-spec-memory-launcher.cjs` (P1) | Stale bootstrap-lock reclaim used non-atomic rmSync (could delete a live successor's fresh lock) | Claims-via-rename before delete (TOCTOU-safe: successor's fresh lockDir is a new inode the rename can't touch; losing racer gets ENOENT → retry) | Regression test passes; `node --check` OK |
| `_utils.sh` `check_node_version` (P2) | Integer-only compare accepted wrong semver minors (e.g. `20.10` vs required `20.11`) | Full semver compare | Regression test passes |
| `vector-index-mutations.ts` (P2) | Retention sweep left orphan `auto_entities`/`memory_entities` rows | Cascade cleanup | Regression test passes; system-spec-kit build exit 0 |
| `memory-search.ts` (P1) | Community-search fired on EVERY `retrievalLevel='global'` call (always-on) with hard-coded score 0.45 | Gate on `<3` weak results (shared with auto) + score derived from community match quality (ranked secondary; verified no hard floor drops them) | Regression test passes; system-spec-kit build exit 0 |
| `.claude/agents/deep-research.md`, `.gemini/agents/deep-research.md` (P1) | Stale findings-registry filename | Correct to the live name | Regression test passes |
| `deep-ai-council/SKILL.md`, `loop_protocol.md` (P2) | Referenced deleted `prompt_pack_round.md.tmpl` | Correct to the live asset name | Regression test passes |
| `checkpoint-v2-contention-stress.vitest.ts` + 2 sibling tests (P2) | Hardcoded schema v29 (prod is v30); omitted v30 enrichment columns | Update fixture to v30 with the columns; keep soak coverage | Regression test passes; system-spec-kit build exit 0 |

Confirm-deep-dive census:
- 20 parallel deep-dives over the fresh scouted targets: 7 CONFIRMED, 9 partial-but-real, 4 REFUTED.
- 4 REFUTED: gemini-compact already calls `sanitizeRecoveredPayload` internally; 3 code-graph regex `lastIndex` claims where the while-exec loop resets correctly. None were edited.
- 1 partial EXCLUDED: council `scoreVerdictProgression` — its proposed fix changes stop-policy (product decision); flagged not fixed.
- The 8 remaining partials were fixed for the REAL lesser defect only; the refuted headline of each was not acted on.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Deep-dive — confirm/partial/refute (done)
- [x] 20 parallel gpt-5.5-fast confirm deep-dives against the real code
- [x] Classified 7 CONFIRMED, 9 partial-but-real, 4 REFUTED
- [x] 1 partial excluded on product-decision boundary (council `scoreVerdictProgression`)

### Phase 2: Implement + verify (done)
- [x] 12 parallel disjoint-file implement agents fix the confirmed + partial defects (23 files, REAL part only)
- [x] code-graph stress (P2): `os.tmpdir()` + removed config chdir + scoped beforeEach/afterEach chdir+restore; 45 tests pass; no repo pollution
- [x] convergence.cjs (P1): `INPUT_VALIDATION` exit 3 on `--persist-snapshot` without `--round-id`
- [x] session-start.ts (P1): `handleCompact` mirrors Claude compact recovery (readCompactPrime → TTL-check → semantic-validate → clearCompactPrime on success; static fallback on cache-miss/expiry/validation-fail)
- [x] install-all.sh (P1): corrected MCP_SCRIPTS entry name for mk-spec-memory
- [x] mcp-code-mode + mcp-chrome-devtools install.sh (P1): robust path derivation (no CWD assumption)
- [x] mk-spec-memory-launcher.cjs (P1): claims-via-rename before delete (TOCTOU-safe lock reclaim)
- [x] _utils.sh check_node_version (P2): full semver compare
- [x] vector-index-mutations.ts (P2): cascade cleanup of orphan auto_entities/memory_entities rows
- [x] memory-search.ts (P1): community-search gated on `<3` weak results + score from match quality
- [x] .claude/agents + .gemini/agents deep-research.md (P1): live findings-registry filename
- [x] deep-ai-council SKILL.md + loop_protocol.md (P2): live asset name (not deleted tmpl)
- [x] checkpoint-v2-contention-stress.vitest.ts + 2 sibling tests (P2): v30 fixture with enrichment columns
- [x] Orchestrator reviewed every diff; comment-hygiene clean; builds + `node --check` OK; Sonnet retry succeeded after Opus 0-token blip

### Phase 3: Ship
- [x] description.json + graph-metadata.json
- [x] validate --strict → 0
- [x] reconcile completion metadata
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Confirm/partial/refute deep-dive | each headline vs the real code | gpt-5.5-fast parallel passes |
| Per-fix regression test | each of the 12 fixes | added regression test (Vitest for TS; deep-loop harness for `.cjs`; shell assert for `_utils.sh`) |
| Stress test suite | code-graph scan-stress (45 tests) | Vitest; verified no repo pollution on Linux/CI |
| TS typecheck + build | system-spec-kit mcp_server | `tsc` typecheck, `npm run build` (exit 0) |
| `node --check` | deep-loop `.cjs` (convergence, launcher) | `node --check` OK |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- vitest's `os.tmpdir()` is the canonical temp-dir reference; the removed `process.chdir('/private/tmp')` in vitest.config.ts was a macOS-only hack, not portable.
- compact prime TTL + semantic-validate lifecycle in cli-devin is the reference for the `handleCompact` fix; `clearCompactPrime` is called only on validated recovery success.
- POSIX rename atomicity is the reference for the launcher lock reclaim fix; a rename to an existing name is atomic on POSIX filesystems, so a winning racer's fresh lockDir (new inode) is not clobbered.
- Deploy depends on the orchestrator recycling the mk-spec-memory daemon (memory-search + retention daemon code); launcher `.cjs` deploys on next launcher restart; install scripts, docs, stress tests, and the devin hook (loads on next devin session) need no forced deploy.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Targeted code change across 23 files; rollback is a clean revert of those files.

- **Revert**: restore the 23 edited files (12 sources + their added regression tests) to pre-fix state.
- **Deploy**: a revert also requires re-recycling the mk-spec-memory daemon to drop the memory-search + retention fixes; the launcher `.cjs` reverts on the next launcher restart; install scripts, docs, stress tests, and the devin hook need no build action on revert.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Deep-dive) ──► Phase 2 (Implement) ──► Phase 3 (Ship)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Deep-dive | Fresh 20 targets (from the second scout) | Implement |
| Implement | Deep-dive (confirmed + partial defects, exclude gate applied) | Ship |
| Ship | Implement (builds + tests green) | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Deep-dive (20 parallel confirm/partial/refute) | Med | ~2.5 hours |
| Implement + verify (12 disjoint agents, 23 files) | High | ~3.5 hours |
| Ship (review, metadata, validate, reconcile) | Low | ~0.5 hour |
| **Total** | | **~6.5 hours** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] No data migration involved (code-behavior fixes only; v30 schema was already live)
- [x] No feature flag required (defect fixes, not new behavior toggles)
- [x] Scope-locked to the 23 confirmed/partial-defect files (no adjacent cleanup; refuted headlines untouched; excluded partial untouched)

### Rollback Procedure
1. Restore the 23 edited files from version control.
2. Re-recycle the mk-spec-memory daemon to drop the memory-search + retention fixes; the launcher `.cjs` drops its fix on the next launcher restart.
3. Install scripts, docs, stress tests, and the devin hook need no build action on revert.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A — behavior fixes only; no persisted-data change.
<!-- /ANCHOR:enhanced-rollback -->
