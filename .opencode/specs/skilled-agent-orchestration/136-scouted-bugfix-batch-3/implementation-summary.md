---
title: "Implementation Summary: Scouted Bugfix Batch 3"
description: "Batch 3 of the scouted targets (fresh 20 from the second scout). Twenty parallel gpt-5.5-fast confirm deep-dives classified each headline: 7 CONFIRMED, 9 partial-but-real, 4 REFUTED (gemini-compact already calls sanitizeRecoveredPayload internally; 3 code-graph regex lastIndex claims — the while-exec loop resets correctly). 1 partial EXCLUDED from auto-fix (council scoreVerdictProgression — its fix would change stop-policy, a product decision; flagged not fixed). Twelve parallel implement-and-test agents fixed the rest across 23 files (sources + added regression tests), fixing only the REAL part of each partial. Every diff reviewed (incl. the launcher TOCTOU pattern + memory-search no-over-suppression check); comment-hygiene clean; system-spec-kit mcp_server npm run build exit 0; launcher + convergence .cjs node --check OK; each fix's added regression test passes. The first fix-workflow attempt failed (Opus 0-token blip); succeeded on Sonnet retry."
trigger_phrases:
  - "scouted bugfix batch 3 summary"
  - "verify-first second-scout batch fix shipped"
  - "12 fixes 23 files"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "skilled-agent-orchestration/136-scouted-bugfix-batch-3"
    last_updated_at: "2026-06-03T08:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Fixed 12 confirmed+partial defects across 23 files; builds exit 0; regression tests green"
    next_safe_action: "Recycle mk-spec-memory daemon; launcher .cjs on next restart; other artifacts no forced deploy"
    blockers: []
    key_files:
      - ".opencode/skills/system-code-graph/mcp_server/src/handlers/__tests__/scan-stress.vitest.ts"
      - ".opencode/skills/deep-loop-runtime/scripts/convergence.cjs"
      - ".opencode/skills/cli-devin/src/session-start.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/src/launcher/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/search/memory-search.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/storage/vector-index-mutations.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-3-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Scouted Bugfix Batch 3

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `skilled-agent-orchestration/136-scouted-bugfix-batch-3` |
| **Completed** | 2026-06-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A verify-first batch fix over a fresh 20 scouted targets from the second scout (batches 1 and 2 covered the first 25), run as a deep-dive → implement pipeline that refused to edit on an unverified or refuted headline:

1. **DEEP-DIVE** — 20 parallel `gpt-5.5-fast` confirm deep-dives read the real code and classified each headline: **7 CONFIRMED**, **9 partial-but-real** (a genuine lesser defect behind a wrong framing), and **4 REFUTED**. The four refuted: gemini-compact already calls `sanitizeRecoveredPayload` internally; 3 code-graph regex `lastIndex` claims where the while-exec loop resets correctly — none were edited. One partial (council `scoreVerdictProgression`) was **excluded** from auto-fix: its proposed change alters stop-policy, a product decision requiring deliberate sign-off; it was flagged but not patched.
2. **IMPLEMENT** — 12 parallel implement-and-test agents on **disjoint files** fixed the confirmed + partial targets across **23 files** (sources + added regression tests), fixing only the **REAL part** of each partial (never the refuted headline). The orchestrator reviewed every diff and confirmed builds + tests. The first fix-workflow attempt failed (Opus 0-token blip); succeeded on Sonnet retry.

### 12 Fixes

| # | Target | Severity | Fix |
|---|--------|----------|-----|
| 1 | code-graph stress tests: `scan-stress.vitest.ts` + 2 sibling tests | P2 | Three stress tests used `mkdtempSync(process.cwd())` guarded only by a macOS-only `process.chdir('/private/tmp')` in `vitest.config.ts` — repo-pollution risk on Linux/CI. Now use `os.tmpdir()`; removed the config chdir; the scan-stress test (whose handler requires rootDir within cwd) uses a scoped beforeEach/afterEach chdir+restore. 45 stress tests pass, no repo pollution. |
| 2 | `convergence.cjs` (deep-loop) | P1 | `--persist-snapshot` without `--round-id` coalesced roundId to `__latest__` and silently overwrote all prior snapshots. Now throws `INPUT_VALIDATION` (exit 3) when `--persist-snapshot` is set without `--round-id`. |
| 3 | `session-start.ts` (devin) | P1 | `handleCompact` returned a static fallback (couldn't recover). Now mirrors Claude's compact recovery: readCompactPrime → TTL-check → semantic-validate → Recovered Context sections → clearCompactPrime on success; static fallback only on cache-miss/expiry/validation-fail. |
| 4 | `install-all.sh` | P1 | `MCP_SCRIPTS` array had a wrong entry name for mk-spec-memory → corrected to the on-disk script name. |
| 5 | `mcp-code-mode/install.sh`, `mcp-chrome-devtools/install.sh` | P1 | Failed when run directly (CWD assumption) → derive paths robustly. |
| 6 | `mk-spec-memory-launcher.cjs` | P1 | Stale bootstrap-lock reclaim used a non-atomic `rmSync` (could delete a live successor's fresh lock). Now claims-via-rename before delete (TOCTOU-safe: a successor's fresh lockDir is a new inode the rename can't touch; losing racer gets ENOENT → retry). |
| 7 | `_utils.sh` `check_node_version` | P2 | Integer-only compare accepted wrong semver minors (e.g. `20.10` vs required `20.11`). Now full semver compare. |
| 8 | `vector-index-mutations.ts` | P2 | Retention sweep left orphan `auto_entities`/`memory_entities` rows → cascade the cleanup. |
| 9 | `memory-search.ts` | P1 | Community-search fired on EVERY `retrievalLevel='global'` call (always-on) with a hard-coded score 0.45. Now gated on `<3` weak results (shared with auto) + score derived from community match quality (ranked secondary; verified no hard floor drops them). |
| 10 | `.claude/agents/deep-research.md`, `.gemini/agents/deep-research.md` | P1 | Stale findings-registry filename → corrected to the live name. |
| 11 | `deep-ai-council/SKILL.md`, `loop_protocol.md` | P2 | Referenced a deleted `prompt_pack_round.md.tmpl` → corrected to the live asset name. |
| 12 | `checkpoint-v2-contention-stress.vitest.ts` + 2 sibling tests | P2 | Hardcoded schema v29 (prod is v30) and omitted the v30 enrichment columns → updated the fixture to v30 with the columns, kept the soak coverage. |

> 12 implement agents ran; 12 distinct source fixes above plus their added regression tests bring the total to **23 files** (sources + tests). The 8 confirmed/partial targets contributed the lesser-but-real defects; the refuted headline behind each was not acted on. The 1 excluded partial (council `scoreVerdictProgression`) is flagged for a deliberate product-decision review.

### Files Changed

| File Group | Action | Purpose |
|------------|--------|---------|
| code-graph stress: `scan-stress.vitest.ts` + 2 sibling tests + vitest.config.ts | Modified | `os.tmpdir()` + remove config chdir + scoped chdir+restore; no repo pollution |
| `convergence.cjs` + regression test | Modified | `INPUT_VALIDATION` exit 3 on missing `--round-id` with `--persist-snapshot` |
| `session-start.ts` + regression test | Modified | Full compact recovery lifecycle (readCompactPrime → validate → sections → clearCompactPrime) |
| `install-all.sh`, `mcp-code-mode/install.sh`, `mcp-chrome-devtools/install.sh` + regression tests | Modified | Corrected MCP_SCRIPTS entry; robust path derivation |
| `mk-spec-memory-launcher.cjs` + regression test | Modified | TOCTOU-safe lock reclaim via rename before delete |
| `_utils.sh` + regression test | Modified | Full semver compare for `check_node_version` |
| `vector-index-mutations.ts` + regression test | Modified | Orphan row cascade in retention sweep |
| `memory-search.ts` + regression test | Modified | Community-search gating + quality-derived score |
| `.claude/agents/deep-research.md`, `.gemini/agents/deep-research.md` + regression test | Modified | Live findings-registry filename |
| `deep-ai-council/SKILL.md`, `loop_protocol.md` + regression test | Modified | Live asset name (not deleted tmpl) |
| `checkpoint-v2-contention-stress.vitest.ts` + 2 sibling tests | Modified | v30 schema fixture with enrichment columns |

Total: **23 files** (12 sources + their added regression tests) across 12 disjoint targets, scope-locked to the confirmed + partial defects.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fan-out / fan-in pipeline with a verify gate, continuing batch 1's and batch 2's discipline. The deep-dive stage dispatched 20 parallel `gpt-5.5-fast` passes that read the real code and classified each headline CONFIRMED, partial-but-real, or REFUTED — the gate that stopped the 4 refuted headlines from becoming wrong edits, that isolated the REAL lesser defect inside each of the 9 partials, and that identified the 1 excluded partial on a product-decision boundary. The implement stage ran 12 agents on disjoint file sets so parallel writes never collided, each fixing only its confirmed/REAL defect and proving it with an added regression test. The orchestrator then reviewed every diff (including the launcher TOCTOU pattern and the memory-search no-over-suppression check), confirmed comment-hygiene, and confirmed the system-spec-kit build + deep-loop `node --check` before ship. The first fix-workflow attempt failed due to an Opus 0-token blip; the Sonnet retry succeeded.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Deep-dive to confirm/partial/refute each headline before editing | Many of the 20 headlines were loud but wrong; 4 were fully refuted and 9 were only partially correct — acting on the headlines directly would have fixed non-existent defects and missed the real ones. |
| Exclude council `scoreVerdictProgression` partial rather than auto-fix | Its proposed fix alters stop-policy; this is a product decision that requires deliberate sign-off, not a scout-driven defect patch. Flagged for review. |
| Fix only the REAL part of each partial, not the refuted headline | Verify-first discipline: each partial had a genuine lesser defect worth fixing, but its loud framing was wrong; only the real defect shipped. |
| TOCTOU-safe lock reclaim via rename before delete | A non-atomic `rmSync` could delete a live successor's freshly-created lockDir. POSIX rename to the target is atomic and cannot clobber a different inode; the losing racer sees ENOENT and retries cleanly. |
| Gate community-search on `<3` weak results + quality-derived score | Always-on community search with a hard-coded 0.45 score over-suppressed results on global retrievals; the gate and quality-derived score let strong results pass through without a secondary community pass, while weak-result sets still benefit from community amplification. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Deep-dive confirm/partial/refute of all 20 headlines | PASS — 7 CONFIRMED, 9 partial-but-real, 4 REFUTED with code evidence |
| 4 REFUTED headlines not acted on | PASS — gemini-compact internal call and 3 code-graph regex lastIndex claims left unedited |
| 1 partial excluded on product-decision boundary | PASS — council `scoreVerdictProgression` flagged, not patched |
| Each of the 12 fixes | PASS — added regression test passes; only the REAL part of each partial fixed |
| Comment-hygiene | PASS — no spec-path / packet-id tracking artifacts in any edited source |
| Build | PASS — system-spec-kit mcp_server `npm run build` exit 0 |
| Deep-loop `.cjs` | PASS — `node --check` OK (convergence, mk-spec-memory-launcher) |
| Stress tests | PASS — 45 stress tests pass; no repo pollution on Linux/CI |
| Scope leak | PASS — edits land only in the 23 confirmed/partial-defect files (sources + added regression tests) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fixes need a deploy to take effect.** The orchestrator must recycle the mk-spec-memory daemon (memory-search + retention daemon code) after commit; the launcher `.cjs` deploys on the next launcher restart; install scripts, docs, stress tests, and the devin hook (loads on next devin session) need no forced deploy.
2. **The 4 refuted headlines stay refuted.** Gemini-compact's `sanitizeRecoveredPayload` call is already internal; the 3 code-graph regex `lastIndex` claims are correct (the while-exec loop resets). No edits were made and none are owed.
3. **council `scoreVerdictProgression` is flagged, not fixed.** The partial is real but its proposed fix changes stop-policy. A deliberate product-decision review is required before it can ship.

### Downstream

The corrected code-graph stress tooling, deep-loop convergence guardrail, devin compact-recovery hook, install scripts, launcher lock safety, shell version guard, vector-index retention cascade, memory-search community gating, agent doc filenames, and AI-council asset references are consumed by their respective toolchains; after the orchestrator daemon recycle and the launcher restart, the fixes are live. No downstream packet depends on this batch directly.
<!-- /ANCHOR:limitations -->
