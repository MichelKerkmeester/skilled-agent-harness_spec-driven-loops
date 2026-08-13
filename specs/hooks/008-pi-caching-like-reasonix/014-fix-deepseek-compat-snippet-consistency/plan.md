---
title: "Implementation Plan: Fix DeepSeek Long-Retention Advice Consistency [specs/hooks/008-pi-caching-like-reasonix/014-fix-deepseek-compat-snippet-consistency]"
description: "Mirror the OpenAI-proxy required/optional compat split into the DeepSeek path so long retention is verify-first optional, verified by typecheck + the extension test suite."
trigger_phrases:
  - "deepseek compat consistency plan"
  - "long retention optional plan"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/014-fix-deepseek-compat-snippet-consistency"
    last_updated_at: "2026-08-13T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Documented the applied approach"
    next_safe_action: "None; work complete"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-13-pi-caching"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Fix DeepSeek Long-Retention Advice Consistency

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript (Pi extension) |
| **Framework** | Pi CLI extension API |
| **Storage** | none (advisory text only) |
| **Testing** | `node --test` + `jiti`; `tsc --noEmit` |

### Overview
The OpenAI-compatible proxy path already models the correct behavior: a `missing` (required) set feeding the warning/snippet/fix, and a separate `optional` set feeding a verify-first advisory. The DeepSeek path lumped `supportsLongCacheRetention` into `missing`. The fix mirrors the OpenAI split into the DeepSeek path and wires the optional advisory into the doctor/compat renderers.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Root cause traced to `describeMissingDeepSeekCompat` / `buildDeepSeekCompatSuggestion` / `appendDeepSeekCompatAdviceLines`
- [x] All consumers mapped (warning adapter, doctor, compat, fix)
- [x] Green baseline captured (51/51)

### Definition of Done
- [x] Long retention excluded from required set, snippet, and fix write-set
- [x] Optional detector + advisory added and wired into doctor/compat
- [x] typecheck clean; tests green (53/53); provenance recorded
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Required-vs-optional compat classification (mirrors the existing OpenAI-proxy pattern).

### Key Components
- **`describeMissingDeepSeekCompat`**: required flags only (affinity, reasoning, thinking).
- **`describeOptionalDeepSeekCompat`** (new): verify-first optional (`supportsLongCacheRetention`).
- **`appendOptionalDeepSeekCompatAdviceLines`** (new): optional advisory + 400 caveat.

### Data Flow
`missing` drives the warning "lacks …", the copyable snippet, and `/cache-optimizer fix`. `optional` drives only the advisory note in doctor/compat. Long retention now flows through `optional`.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `describeMissingDeepSeekCompat` | Required-flag producer | update (drop long retention) | unit test: excludes it |
| `buildDeepSeekCompatSuggestion` | Snippet + fix write-set | update (drop long retention) | unit test: `.supportsLongCacheRetention === undefined` |
| `appendDeepSeekCompatAdviceLines` | Required advisory | update (drop long-retention line) | functional: snippet omits it |
| `describeOptionalDeepSeekCompat` / `appendOptionalDeepSeekCompatAdviceLines` | new optional path | create | unit test: returns `['supportsLongCacheRetention']` |
| doctor renderer + `buildCompatDiagnosis` | advice consumers | update (wire optional) | typecheck + tests |
| adapter `warningText` / `buildDeepSeekCompatWarningText` | startup warning | unchanged signature; driven by `missing` | functional: "lacks sendSessionAffinityHeaders" |
| `buildFixSuggestion` | fix write-set | unchanged; driven by suggestion | fix-command test: `false` override survives |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Capture green baseline (typecheck + 51 tests)

### Phase 2: Core Implementation
- [x] Split long retention out of required set / snippet / advice
- [x] Add optional detector + advisory; wire into doctor + compat
- [x] Export the new detector for tests

### Phase 3: Verification
- [x] Update fix-command test; add 2 split tests
- [x] typecheck clean; 53/53 tests; functional warning check; provenance recorded
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit | required-vs-optional split | `node --test` |
| Integration | `/cache-optimizer fix` write-set | `node --test` |
| Manual | real warning text for a DeepSeek-on-proxy model | `node --import jiti/register` one-off |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Extension test toolchain | Internal | Green | No automated verification |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: A user genuinely relied on `/cache-optimizer fix` enabling long retention, or the advisory reads wrong.
- **Procedure**: `git revert` the change commit; the three edited files return to the prior behavior. No data/migration involved.
<!-- /ANCHOR:rollback -->
