---
title: "Implementation Summary: Scouted Bugfix Batch 4"
description: "Batch 4 of the scouted bugfix train: 9 candidates confirmed by gpt-5.5-fast deep-dive and implemented with regression tests; 11 excluded as policy/migration/unconfirmed. Fixes: warm-tier savings metric pre-truncation capture, anchor-miss returnedTokens recompute, formatAgeString NaN guard, shadow promotion zero-delta epsilon gate, adapter-common dead ternary, check-graph-metadata last-active basename, cli-gemini/cli-codex auth pre-flight corrections, token-budget constitutional count/summary reconciliation. All 9 regression tests pass; system-spec-kit npm run build exit 0."
trigger_phrases:
  - "scouted bugfix batch 4 summary"
  - "verify-first batch-4 fix shipped"
  - "9 fixes batch 4"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/027-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/004-scouted-bugfix-batch-4"
    last_updated_at: "2026-06-03T09:00:00Z"
    last_updated_by: "claude-sonnet"
    recent_action: "Fixed 9 confirmed defects; builds exit 0; regression tests green; 11 excluded"
    next_safe_action: "No forced deploy needed for most fixes; cli-gemini/codex SKILL.md live at next dispatch"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/token-metrics.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/handlers/memory-triggers.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/formatters/search-results.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/utils/format-helpers.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-scoring.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/lib/feedback/shadow-evaluation-runtime.ts"
      - ".opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts"
      - ".opencode/skills/system-spec-kit/scripts/rules/check-graph-metadata-shape.sh"
      - ".opencode/skills/cli-gemini/SKILL.md"
      - ".opencode/skills/cli-codex/SKILL.md"
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scouted-bugfix-batch-4-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: Scouted Bugfix Batch 4

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | `system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/010-scouted-bugfix-train/004-scouted-bugfix-batch-4` |
| **Completed** | 2026-06-03 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A verify-first batch fix over the batch-4 scouted candidate pool, continuing the discipline of batches 1–3. The pipeline: scout → gpt-5.5-fast confirm → implement-and-test. Eleven candidates were excluded as out-of-scope (policy changes, migration work, or not confirmed by the deep-dive). The 9 confirmed defects were fixed by parallel implement-and-test agents on disjoint file sets, each fix proven by an added regression test. The orchestrator reviewed every diff, confirmed comment-hygiene, and confirmed the build before ship.

### 9 Fixes

| # | Target | Severity | Fix |
|---|--------|----------|-----|
| 1 | **warm-tier-savings-metric** | P1 | WARM-tier savings metric was structurally locked at ~67% because `fullContentTokens` was captured after the 150-char truncation rather than before. Fix: capture `fullContentTokens` before truncation in `token-metrics.ts`; pass through `memory-triggers.ts`; use pre-truncation count as the WARM baseline (3x kept only as fallback). |
| 2 | **anchor-miss-returnedtokens** | P1 | All-anchors-missing branch in `search-results.ts` hard-coded `returnedTokens:0` / `savingsPercent:100` despite emitting a warning string. Fix: recompute both from `estimateTokens(content)`, mirroring the partial-match branch. |
| 3 | **formatagestring-nan** | P1 | `formatAgeString` in `format-helpers.ts` returned "NaN months ago" for invalid ISO input. Fix: add `Number.isNaN(timestamp)` guard returning the "never" sentinel. |
| 4 | **shadow-promotion-gate** | P1 | Shadow promotion gate counted zero-delta uniform-signal cycles as improvements; returned uniform-0.5 map when `maxAbsoluteSignalTotal===0`. Fix: add `MIN_NDCG_IMPROVEMENT` epsilon + return empty Map when `maxAbsoluteSignalTotal===0`; `shadow-evaluation-runtime.ts` updated to consume the empty-Map guard. |
| 5 | **adapter-common-dead-branch** | P2 | Dead ternary in `adapter-common.ts` — the else branch read "BLOCKED : BLOCKED" instead of "BLOCKED : FAIL", so non-blocked spawn errors (EPIPE, ECONNRESET) were misclassified as BLOCKED. Fix: "BLOCKED : FAIL" replaces the dead branch. |
| 6 | **check-graph-metadata-shape-last-active** | P2 | `check-graph-metadata-shape.sh` spuriously emitted a WARNING when `derived.last_active_child_id` was a full packet_id rather than a bare child name. Fix: add a basename fallback existence test so the check passes when the child exists under its basename. |
| 7 | **cli-gemini-auth-preflight** | P1 | Auth pre-flight in `cli-gemini/SKILL.md` called `gemini config list`, a non-existent subcommand. Fix: replace with a filesystem probe of `~/.gemini/oauth_creds.json`. |
| 8 | **cli-codex-auth-preflight** | P1 | Auth pre-flight in `cli-codex/SKILL.md` ran `codex auth status` (unrecognized subcommand, exit 2). Fix: replace with `codex login status`. |
| 9 | **token-budget-envelope** | P1 | After the token-budget truncation pop loop in `context-server.ts`, `data.constitutionalCount` and `envelope.summary` were not recomputed, leaving them desynced from `data.results.length`. Fix: recompute `data.constitutionalCount` from survivors and rebuild `envelope.summary` so counts agree. |

> All 9 fixes shipped with an added or updated regression test. The 11 excluded candidates (policy changes, migration work, or unconfirmed by deep-dive) were left entirely untouched.

### Files Changed

| File Group | Action | Purpose |
|------------|--------|---------|
| `token-metrics.ts` + `memory-triggers.ts` + `modularization.vitest.ts` | Modified | Pre-truncation `fullContentTokens` capture; WARM baseline fix |
| `search-results.ts` + `anchor-prefix-matching.vitest.ts` | Modified | Anchor-miss branch accurate metric recompute |
| `format-helpers.ts` + `search-results-format.vitest.ts` | Modified | `formatAgeString` NaN guard → "never" sentinel |
| `shadow-scoring.ts` + `shadow-evaluation-runtime.ts` + `shadow-scoring-holdout.vitest.ts` | Modified | Zero-delta epsilon gate + empty Map on zero-signal |
| `adapter-common.ts` + `matrix-adapter-common.vitest.ts` | Modified | Dead ternary → FAIL classification for non-blocked errors |
| `check-graph-metadata-shape.sh` + `check-graph-metadata-shape-last-active-child.sh` | Modified / Added | Basename fallback existence test; no spurious WARNING |
| `cli-gemini/SKILL.md` | Modified | Filesystem probe for auth pre-flight |
| `cli-codex/SKILL.md` | Modified | `codex login status` for auth pre-flight |
| `context-server.ts` + `token-budget-constitutional-sync.vitest.ts` | Modified / Added | Post-pop-loop count/summary reconciliation |

Total: **~18 files** (9 source fixes + their regression tests) across 9 disjoint targets, scope-locked to confirmed defects.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fan-out / fan-in pipeline with a confirm gate, continuing the discipline of batches 1–3. The confirm stage dispatched gpt-5.5-fast passes that read the real code and classified each candidate CONFIRMED or EXCLUDED. Eleven candidates did not survive contact with the real code (policy boundaries, migration-only scope, or headline not confirmed by deep-dive); none were edited. The implement stage ran 9 agents on disjoint file sets so parallel writes never collided, each fixing only its confirmed defect and proving it with an added regression test. The orchestrator reviewed every diff, confirmed comment-hygiene, and confirmed the system-spec-kit build before ship.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Capture `fullContentTokens` before the 150-char truncation | The truncation is a display artifact; the WARM-tier savings baseline must reflect the actual pre-truncation content size, not the artificially reduced post-truncation size. |
| Recompute anchor-miss metrics from `estimateTokens(content)` | Hardcoding `returnedTokens:0` / `savingsPercent:100` produced misleading output for any content that reached the all-anchors-missing branch; the partial-match branch already did this correctly. |
| `MIN_NDCG_IMPROVEMENT` epsilon over strict `===0` check | Floating-point accumulation can produce near-zero totals that are not exactly 0; an epsilon guard is more robust and still correctly rejects uniform no-signal cycles. |
| Return empty Map (not uniform-0.5) on zero signal | A uniform-0.5 map looks like valid NDCG data to the evaluation runtime and can trigger false promotion; an empty Map signals "no data" unambiguously. |
| Filesystem probe for cli-gemini auth pre-flight | `gemini config list` does not exist as a subcommand; a filesystem probe of the oauth credentials file is direct, stable, and does not require the CLI to implement any auth-status command. |
| `codex login status` for cli-codex auth pre-flight | `codex auth status` emits an unrecognized-subcommand error (exit 2); `codex login status` is the documented and working form. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| 9 candidates confirmed by deep-dive before any edit | PASS — 9 CONFIRMED; 11 EXCLUDED (policy/migration/unconfirmed) |
| 11 excluded candidates not acted on | PASS — all 11 left unedited |
| Each of the 9 fixes has a passing regression test | PASS — added/updated regression test passes for each fix |
| Comment-hygiene | PASS — no spec-path / packet-id tracking artifacts in any edited source |
| Build | PASS — system-spec-kit mcp_server `npm run build` exit 0 |
| Scope leak | PASS — edits land only in the confirmed-defect files (sources + added regression tests) |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Some fixes need a deploy to take effect.** After commit, the mk-spec-memory daemon should be recycled so the `token-metrics.ts`, `search-results.ts`, `format-helpers.ts`, `shadow-scoring.ts`, `context-server.ts`, and `adapter-common.ts` fixes take effect in the running daemon. `check-graph-metadata-shape.sh` and the two SKILL.md files do not need a daemon recycle; SKILL.md changes are live at next CLI dispatch.
2. **11 excluded candidates stay excluded.** Policy changes, migration work, and unconfirmed headlines are out of scope for this batch. A future batch may revisit if requirements or code change.

### Downstream

The corrected warm-tier metric, anchor-miss formatter, age-string guard, shadow promotion gate, adapter error classification, graph-metadata shape check, CLI auth pre-flights, and token-budget reconciliation are consumed by their respective subsystems. After the orchestrator daemon recycle, the mcp_server fixes are live. The SKILL.md pre-flight fixes are live immediately at next CLI dispatch.
<!-- /ANCHOR:limitations -->
