---
title: "Feature Specification: Phase 10: security-and-correctness-fixes"
description: "Fix the 5 confirmed code-level defects (2 security, 3 correctness) that deep-review found in the shipped /goal plugin (verdict CONDITIONAL)."
trigger_phrases:
  - "goal plugin security fixes"
  - "mk-goal redaction fix"
  - "injection cap fix"
  - "stale verifier guard"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/032-goal-opencode-plugin/010-security-and-correctness-fixes"
    last_updated_at: "2026-07-01T10:04:51Z"
    last_updated_by: "claude-sonnet-5"
    recent_action: "Authored spec from deep-review findings DR-001/003/004-P1/005/006"
    next_safe_action: "Run /speckit:plan or /speckit:implement on this phase"
    blockers: []
    key_files:
      - ".opencode/plugins/mk-goal.js"
    session_dedup:
      fingerprint: "sha256:63d4d17242d5c1608c73f9607ea28a9713e697314581ec5aaa3f42b1a2fbb3d0"
      session_id: "scaffold-032-010"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
# Feature Specification: Phase 10: security-and-correctness-fixes

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 1 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-01 |
| **Branch** | `032-goal-opencode-plugin` |
| **Parent Spec** | ../spec.md |
| **Phase** | 10 |
| **Predecessor** | None (independent of 009, which is owned by a separate in-flight session) |
| **Successor** | 011-command-surface-normalization |
| **Handoff Criteria** | All 5 fixes land in `mk-goal.js`, the existing 6-file test suite still passes via `node --test`, freshly executed and pasted as evidence |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:phase-context -->
## Phase Context

This is the first remediation phase for the `/goal` plugin, addressing the highest-severity findings from this packet's completed deep-review audit (15 iterations, GPT-5.5, verdict CONDITIONAL — `../review_archive/2026-07-01-plugin-implementation-review/review-report.md`).

**Scope Boundary**: code-only fixes to `.opencode/plugins/mk-goal.js`. No renaming, no doc sweeps (that's phase 011), no new regression tests beyond confirming the existing suite still passes (new tests are phase 012's scope).

**Dependencies**: none — these fixes are independent of the command-rename work in phase 011.

**Deliverables**: 5 landed fixes in `mk-goal.js`, existing test suite green.

**Changelog**: refresh `../changelog/changelog-032-010-security-and-correctness-fixes.md` when this phase closes.
<!-- /ANCHOR:phase-context -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
Deep-review found 2 security defects and 3 correctness defects in the shipped `/goal` plugin, all confirmed and adversarially re-verified across the full 15-iteration review: an unredacted-secret leak path in verifier-exception handling, a narrow blacklist-only prompt-injection sanitizer, an injection block that can exceed its own configured length cap, a stale-verifier-result race that can let a replacement goal be auto-continued on discarded evidence, and a missing RICCE metadata field the plugin's own phase 007 contract requires.

### Purpose
Land all 5 fixes so `mk-goal.js`'s behavior matches its own documented contracts (phase 002/005/007 specs), with the existing test suite confirming no regression.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- DR-006 (P1, security): redact `supervisorVerifier` exception messages before persistence/injection.
- DR-005 (P1, security): harden the prompt-injection sanitizer from a blacklist to structural quoting/allowlist treatment.
- DR-001 (P1, correctness): clamp `renderGoalInjection`'s final returned block to `maxInjectionChars`.
- DR-003 (P1, correctness): signal verifier-result staleness so `maybeContinueGoal` cannot act on a replacement goal using discarded evidence.
- DR-004-P1 (P1, correctness): add the RICCE metadata field to `buildEnhancedGoalPrompt`'s `promptEnhancement` output, or formally amend phase 007's acceptance criterion.

### Out of Scope
- Command filename/namespace changes — phase 011.
- New regression tests pinning these fixes — phase 012 (this phase only confirms the *existing* suite still passes).
- `usage_limited` enum decision, fingerprint/metadata cleanup — phase 013.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|--------------|
| `.opencode/plugins/mk-goal.js` | Modify | 5 targeted fixes at the line ranges below; no new files. |

**Evidence anchors** (from `../review_archive/2026-07-01-plugin-implementation-review/review-report.md` §3 Active Finding Registry and its cited iteration files):
- DR-006: `mk-goal.js:1057` — verifier exception handling bypasses `redactEvidence`.
- DR-005: `mk-goal.js:177` — `sanitizeInlineText`/`sanitizePromptText` blacklist.
- DR-001: `mk-goal.js:1376` — `renderGoalInjection` clamps only the prompt subsection.
- DR-003: `mk-goal.js:1588` — `maybeVerifyGoal` discards a stale result but still returns it; `session.idle` calls `maybeContinueGoal` unconditionally after.
- DR-004-P1: `mk-goal.js:290` — `buildEnhancedGoalPrompt`'s `promptEnhancement` output omits RICCE.
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Redact `supervisorVerifier` exception messages (DR-006) before they are persisted as `lastVerifierReason` or rendered in `injection_preview`/status output. | A verifier exception containing a secret-shaped string (e.g. `sk-...`) never appears unredacted in the stored goal state or in `mk_goal_status` output; route the exception message through `redactEvidence` (or an equivalent) before storage. |
| REQ-002 | Replace the blacklist-only sanitizer (DR-005) with structural quoting/allowlist treatment of user-authored objective text before it enters system context. | `sanitizeInlineText`/`sanitizePromptText` neutralize a broader instruction-override/role-label/bidi-homoglyph test set than the current fixed phrase list, without breaking legitimate objectives (existing suite stays green). |
| REQ-003 | Clamp `renderGoalInjection`'s final returned block to `maxInjectionChars` (DR-001), not just the prompt subsection. | With `maxInjectionChars` set to a small value (e.g. 220 in a manual/test invocation), the *total* rendered `[active_goal]...[/active_goal]` block length never exceeds the configured cap. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | `maybeVerifyGoal` signals staleness/goal-id mismatch explicitly (DR-003) so `maybeContinueGoal` does not act on a replacement goal using a discarded stale verifier result. | A test scenario that replaces the goal mid-verification, then triggers `session.idle`, does not produce a continuation based on the old goal's verdict. |
| REQ-005 | Add the RICCE metadata field to `promptEnhancement` (DR-004-P1), or formally amend phase 007's spec.md acceptance criterion if only structural (non-metadata) RICCE satisfaction was intended. | Either `promptEnhancement` carries a `ricce` (or equivalently named) field reflecting the structure, or `007-sk-prompt-goal-enhancement/spec.md`'s relevant acceptance criterion is edited to say so explicitly, with a one-line rationale. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: All 5 fixes (REQ-001 through REQ-005) are landed in `mk-goal.js`.
- **SC-002**: `node --check .opencode/plugins/mk-goal.js` passes and the full 6-file `mk-goal-*.test.cjs` suite passes via `node --test` (or direct `node <file>` execution matching this packet's existing convention), freshly run and pasted as evidence in `implementation-summary.md` — not cited from a prior run.
- **SC-003**: No finding from `review/review-report.md` §3 among DR-001/003/004-P1/005/006 remains reproducible against the post-fix code (spot-check each with the same reproduction steps the review iteration used).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Hardening the sanitizer (REQ-002) could over-block legitimate objectives containing benign role-label-like words. | Medium — could regress UX for edge-case objectives. | Keep the existing passing test cases green; add a manual spot-check with a few realistic objective strings before considering the fix done. |
| Risk | The staleness fix (REQ-004) touches async state-mutation code shared with the completion-supervisor and active-continuation phases (005/006). | Medium — a subtle regression could re-break auto-continuation gating. | Re-run the full existing suite (not just the state tests) after this specific change; this phase's fix must not alter any currently-passing assertion's expected behavior. |
| Dependency | None on phase 011 or 013; this phase can execute independently. | Low | N/A |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- REQ-005: does phase 007's RICCE acceptance criterion actually require a stored metadata field, or is structural satisfaction (the template's Role/Objective/Context/Method/Success/Stop sections) sufficient? Research iteration 007 flagged this as "aspirational rather than literally implemented" — resolve by reading `007-sk-prompt-goal-enhancement/spec.md`'s exact wording before choosing fix-the-code vs amend-the-doc.
<!-- /ANCHOR:questions -->
