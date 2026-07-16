---
title: "Implementation Summary: Scouted Bugfix Batch 2"
description: "Batch 2 of the 20 scouted targets (the remaining 15 after batch 1's 5). Fifteen parallel gpt-5.5-fast confirm deep-dives classified each headline: 4 CONFIRMED, 9 partial-but-real, 2 REFUTED (the package.json hook-tests `specs/` path is fine because `specs/` is a symlink to `.opencode/specs/`; the reconsolidation env-leak does not actually leak). Thirteen parallel implement-and-test agents fixed the confirmed + partial targets across 22 files (sources + added regression tests), fixing only the REAL part of each partial. The orchestrator reviewed every diff; comment-hygiene clean; system-spec-kit + skill-advisor + code-graph builds exit 0; deep-loop `.cjs` node --check OK; each fix's regression test passes."
trigger_phrases:
  - "scouted bugfix batch 2 summary"
  - "verify-first partial-but-real batch fix shipped"
  - "13 fixes 22 files"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/002-scouted-bugfix-batch-2"
    last_updated_at: "2026-06-03T07:32:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Fixed 13 confirmed+partial defects across 22 files; builds exit 0; regression tests green"
    next_safe_action: "Generate metadata, validate --strict, reconcile; orchestrator recycles daemons"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/lib/embeddings/auto-select.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-schema.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/fanout-run.cjs"
      - ".opencode/skills/system-skill-advisor/mcp_server/lib/scoring/semantic-shadow.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-2-session"
      parent_session_id: null
    completion_pct: 92
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Scouted Bugfix Batch 2

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/135-scouted-bugfix-batch-2` |
| **Completed** | 2026-06-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A verify-first batch fix over the remaining 15 of the 20 scouted targets (batch 1 fixed the top 5), run as a deep-dive → implement pipeline that refused to edit on an unverified or refuted headline:

1. **DEEP-DIVE** — 15 parallel `gpt-5.5-fast` confirm deep-dives read the real code and classified each headline: **4 CONFIRMED**, **9 partial-but-real** (a genuine lesser defect behind a wrong framing), and **2 REFUTED**. The two refuted: the `package.json` hook-tests `specs/` path is fine because `specs/` is a symlink to `.opencode/specs/`, and the reconsolidation env-leak does not actually leak — neither was edited.
2. **IMPLEMENT** — 13 parallel implement-and-test agents on **disjoint files** fixed the confirmed + partial targets across **22 files** (sources + added regression tests), fixing only the **REAL part** of each partial (never the refuted headline). The orchestrator reviewed every diff and confirmed builds + tests.

### 13 Fixes

| # | Target | Severity | Fix |
|---|--------|----------|-----|
| 1 | `chunking.ts` | P2 | Added a `maxLength<=0` guard + a `remainingBudget<=0` break on the critical-section loop; replaced the non-Unicode-safe `substring` truncation with a code-point-safe slice (no broken surrogate pairs). |
| 2 | `coverage-graph-signals.ts` (deep-loop) | P1 | `claimVerificationRate` returned 0 when there were no CLAIM nodes → a perpetual CONTINUE on early-stage graphs. Now returns a vacuous-pass 1.0, matching `p0ResolutionRate`. |
| 3 | `fanout-run.cjs` (deep-loop) | P1 | Updated the stale cli-gemini fallback model `gemini-2.5-pro` → `gemini-3.1-pro-preview`. |
| 4 | `fanout-merge.cjs` (deep-loop) | P2 | The merge dropped per-lineage `resolvedQuestions` / `resolvedFindings`. Added a `resolvedQuestionsById` Map mirroring the existing `openQuestionsById`. |
| 5 | `spec-doc-health.ts` | P2 | Added a local `isPhaseParent()` detector so phase parents no longer get false health errors on absent plan/tasks/checklist (advisory-only annotation). |
| 6 | `rrf-fusion.ts` | P2 | Brought the two-list `fuseResults` normalization into parity with `fuseResultsMulti`. |
| 7 | `auto-select.ts` | P2 | The hf-local persisted dim was always 768; now mirrors HfLocalProvider's own contract (canonical=768, custom=0, so the provider's first-embed drift hook resolves the true dim). Dropped the legacy `HF_LOCAL_MODEL` env alias so the persisted model name matches what the provider loads. (Skipped gpt-5.5's cloud-fallback magic-number refactor as a behavior-neutral no-op.) |
| 8 | `semantic-shadow.ts` (skill-advisor) | P2 | Flipped the raw `LaneMatch.shadowOnly` true→false to match lane liveness (fusion already recomputes from `isLiveScorerLane`; provably inert for all public scoring — removes a raw-API two-value contract). |
| 9 | `vector-index-schema.ts` | P1 | Added `idx_memory_logical_key_active_unique` to REQUIRED_INDEXES validation (the v28 active-row unique index was unvalidated). |
| 10 | `readiness-marker.ts` (code-graph) | P2 | Resolved the marker base dir via a workspace-root helper mirroring `core/config.ts` instead of `process.cwd()`. |
| 11 | `dispatch-minimax.cjs` (benchmark) | P2 | Made `--agent` conditional (dropped the unconditional stale `--agent general`). |
| 12 | `test-opencode-plugins.ts` runner | P2 | Updated the stale plugin import `spec-kit-skill-advisor.js` → `mk-skill-advisor.js`. |

> 13 implement agents ran; 12 distinct source fixes above plus their added regression tests bring the total to **22 files** (sources + tests). The 9 partials contributed the lesser-but-real defects; the refuted headline behind each was not acted on.

### Files Changed

| File Group | Action | Purpose |
|------------|--------|---------|
| `chunking.ts` + regression test | Modified | `maxLength<=0` guard + `remainingBudget<=0` break + code-point-safe truncation |
| `coverage-graph-signals.ts` + regression test | Modified | vacuous-pass 1.0 for claimVerificationRate (no CLAIM nodes) |
| `fanout-run.cjs`, `fanout-merge.cjs` + regression tests | Modified | gemini fallback model; resolvedQuestionsById Map |
| `spec-doc-health.ts`, `rrf-fusion.ts`, `auto-select.ts` + regression tests | Modified | phase-parent detection; two-list fusion parity; hf-local dim contract + drop env alias |
| `semantic-shadow.ts`, `vector-index-schema.ts`, `readiness-marker.ts` + regression tests | Modified | shadowOnly liveness; unique-index validation; workspace-root marker base |
| `dispatch-minimax.cjs`, `test-opencode-plugins.ts` + regression tests | Modified | conditional `--agent`; mk-skill-advisor.js import |

Total: **22 files** (13 sources + their added regression tests) across 13 disjoint targets, scope-locked to the confirmed + partial defects.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fan-out / fan-in pipeline with a verify gate, continuing batch 1's discipline. The deep-dive stage dispatched 15 parallel gpt-5.5-fast passes that read the real code and classified each headline CONFIRMED, partial-but-real, or REFUTED — the gate that stopped the 2 refuted headlines (the symlinked `specs/` hook-tests path and the non-leaking reconsolidation env) from becoming wrong edits, and that isolated the REAL lesser defect inside each of the 9 partials. The implement stage ran 13 agents on disjoint file sets so parallel writes never collided, each fixing only its confirmed/REAL defect and proving it with an added regression test. The orchestrator then reviewed every diff, confirmed comment-hygiene, and confirmed the three MCP builds + deep-loop `node --check` before ship.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deep-dive to confirm/partial/refute each headline before editing | Many of the 15 headlines were loud but wrong; the deep-dive refuted 2 outright and found that 9 were only partially correct — acting on the headlines directly would have fixed non-existent defects and missed the real ones. |
| Fix only the REAL part of each partial, not the refuted headline | Verify-first discipline: each partial had a genuine lesser defect worth fixing, but its loud framing was wrong; only the real defect shipped. |
| Skip gpt-5.5's cloud-fallback magic-number refactor in auto-select | It was a behavior-neutral no-op; shipping it would add churn without changing behavior, against scope-lock. |
| Flip semantic-shadow `shadowOnly` true→false rather than rework the lane API | Fusion already recomputes liveness from `isLiveScorerLane`, so the raw value is inert for all public scoring; the flip removes a misleading two-value contract without touching scoring behavior. |
| Drop the legacy `HF_LOCAL_MODEL` env alias in auto-select | So the persisted model name matches what HfLocalProvider actually loads, keeping the persisted dim contract (canonical=768, custom=0) honest. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-dive confirm/partial/refute of all 15 headlines | PASS — 4 CONFIRMED, 9 partial-but-real, 2 REFUTED with code evidence |
| 2 REFUTED headlines not acted on | PASS — symlinked `specs/` hook-tests path and non-leaking reconsolidation env left unedited |
| Each of the 13 fixes | PASS — added regression test passes; only the REAL part of each partial fixed |
| Comment-hygiene | PASS — no spec-path / packet-id tracking artifacts in any edited source |
| Builds | PASS — system-spec-kit + skill-advisor + code-graph mcp_server `npm run build` exit 0 |
| Deep-loop `.cjs` | PASS — `node --check` OK (fanout-run, fanout-merge, dispatch-minimax) |
| Scope leak | PASS — edits land only in the 22 confirmed/partial-defect files (sources + added regression tests) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fixes need a deploy to take effect.** The orchestrator must recycle the mk-spec-memory daemon (shared/ + migration changes) after commit; skill-advisor + code-graph dist were built and deploy on their next restart (they run under a parallel session); the deep-loop `.cjs`/`.ts` run via the consuming toolchain (no build); the benchmark + runner docs need no deploy.
2. **The 2 refuted headlines stay refuted.** The hook-tests `specs/` path is correct (it is a symlink to `.opencode/specs/`) and the reconsolidation env-leak does not leak; no edit was made and none is owed.
3. **Batch complete.** Batch 2 closes the remaining 15 of the original 20-target scout; no further scouted targets remain from that scout.

### Downstream

The corrected chunking, deep-loop signals/merge, embedding selection, vector-index validation, skill-advisor scoring, code-graph readiness, and benchmark/runner behavior are consumed by their respective toolchains; after the orchestrator recycle and the skill-advisor / code-graph dist restart, the fixes are live. No downstream packet depends on this batch directly.
<!-- /ANCHOR:limitations -->
</content>
