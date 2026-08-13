---
title: "Feature Specification: Fix DeepSeek Long-Retention Advice Consistency [specs/hooks/008-pi-caching-like-reasonix/014-fix-deepseek-compat-snippet-consistency]"
description: "The pi-cache-optimizer fork's DeepSeek compat path treats supportsLongCacheRetention as a required/missing flag — it appears in the startup warning, the copyable snippet, and the /cache-optimizer fix auto-write set — contradicting its own OpenAI-proxy path and README, which treat it as verify-first optional (a proxy that rejects prompt_cache_retention returns 400)."
trigger_phrases:
  - "deepseek long retention advice"
  - "supportsLongCacheRetention snippet fix"
  - "pi-cache-optimizer verify-first optional"
  - "deepseek compat consistency"
  - "cache-optimizer fix long retention"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "hooks/008-pi-caching-like-reasonix/014-fix-deepseek-compat-snippet-consistency"
    last_updated_at: "2026-08-13T00:00:00Z"
    last_updated_by: "spec-author"
    recent_action: "Aligned DeepSeek long-retention advice with the verify-first OpenAI-proxy pattern; 53/53 tests green"
    next_safe_action: "Optionally upstream the fix to jiangge/pi-cache-optimizer"
    blockers: []
    key_files:
      - ".pi/extensions/pi-cache-optimizer/index.ts"
      - ".pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts"
      - ".pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-13-pi-caching"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Mirrored the OpenAI-proxy required/optional split rather than inventing a new mechanism."
      - "Fix no longer auto-enables long retention; affinity + reasoning/thinking stay required and safe-fixable."
---
# Feature Specification: Fix DeepSeek Long-Retention Advice Consistency

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P2 |
| **Status** | Complete |
| **Created** | 2026-08-13 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
In the vendored `pi-cache-optimizer` fork, the DeepSeek compat path treated `supportsLongCacheRetention` as a required/missing flag: it appeared in the "merged compat lacks …" startup warning, in the copyable "Recommended DeepSeek compat snippet", and in the `/cache-optimizer fix` auto-write set. This contradicts the extension's own OpenAI-compatible proxy path and its README, which treat long retention as verify-first optional — DeepSeek prefix caching is automatic and does not need it, and a proxy that rejects the OpenAI `prompt_cache_retention` parameter returns a non-retryable 400.

### Purpose
Align the DeepSeek compat path with the existing OpenAI-proxy required/optional split so long retention is surfaced as verify-first optional advice, never recommended unconditionally, and never auto-written by `/cache-optimizer fix`.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Remove `supportsLongCacheRetention` from the DeepSeek required set, copyable snippet, and `/cache-optimizer fix` write-set.
- Add a DeepSeek optional detector + advisory mirroring `describeOptionalOpenAICompatibleProxyCompat` / `appendOptionalOpenAIProxyCompatAdviceLines`, wired into the `doctor` and `compat` renderers with the existing 400 caveat.
- Update the fix-command test to the corrected behavior and add tests locking the required-vs-optional split.
- Record the change in `CHANGES-FROM-UPSTREAM.md`.

### Out of Scope
- Changing the OpenAI-proxy path (already correct — it is the pattern being mirrored).
- The DeepSeek ownership guard, prompt-rewrite chain, or footer/stats behavior.
- Upstreaming to `jiangge/pi-cache-optimizer` (a separate maintainer decision).

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.pi/extensions/pi-cache-optimizer/index.ts` | Modify | Split long retention out of DeepSeek required/snippet/fix; add optional detector + advisory; wire into doctor/compat |
| `.pi/extensions/pi-cache-optimizer/tests/review-findings.test.ts` | Modify | Correct the fix-command assertion; add 2 split-locking tests |
| `.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md` | Modify | Provenance entry + verification counts |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Long retention is no longer required/auto-written for DeepSeek | `describeMissingDeepSeekCompat` and `buildDeepSeekCompatSuggestion` exclude `supportsLongCacheRetention`; `/cache-optimizer fix` leaves a pre-existing `false` override untouched |
| REQ-002 | Long retention is surfaced as verify-first optional | `describeOptionalDeepSeekCompat` returns it when not enabled; doctor/compat render it with the `prompt_cache_retention` 400 caveat |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | No regressions; behavior locked by tests | `npm run typecheck` clean; `npm test` green with a corrected fix-command test + 2 new split tests |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The startup warning for a DeepSeek-on-proxy channel missing only affinity reads "merged compat lacks sendSessionAffinityHeaders" and the copyable snippet omits `supportsLongCacheRetention`.
- **SC-002**: `npm test` passes (53 tests / 14 suites) and `tsc --noEmit` is clean.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Users relying on `/cache-optimizer fix` to enable long retention | Behavior change: fix no longer sets it | Intentional; long retention is verify-first, still documented as optional guidance |
| Risk | Divergence from the pinned upstream fork commit | Provenance drift | Recorded as a dated entry in `CHANGES-FROM-UPSTREAM.md` |
| Dependency | Extension test toolchain (`node --test` + `jiti`) | Verification path | Confirmed runnable; green baseline captured before changes |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Should this fix be contributed upstream to `jiangge/pi-cache-optimizer`? The DeepSeek compat advice predates the fork's ownership guard, so the inconsistency likely exists upstream too.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Parent Spec**: `../spec.md`
- **Sibling**: `../013-apply-opencode-go-cache-compat/spec.md` (the overlay that motivated inspecting this warning)
- **Provenance**: `../../../../.pi/extensions/pi-cache-optimizer/CHANGES-FROM-UPSTREAM.md`
