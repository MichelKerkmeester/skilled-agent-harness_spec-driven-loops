---
title: "Verification Checklist: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in"
description: "Verification Date: 2026-07-29 — all P0/P1/P2 items verified clean, including a same-session fix to the codex posttooluse adapter"
trigger_phrases:
  - "dispatch shape coverage checklist"
importance_tier: "normal"
contextType: "verification"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/006-dispatch-shape-coverage"
    last_updated_at: "2026-07-29T05:31:42Z"
    last_updated_by: "claude"
    recent_action: "Verified all checklist items clean after codex posttooluse adapter fix"
    next_safe_action: "None — checklist complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dispatch-shape-coverage-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in

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

- [x] CHK-001 [P0] Requirements documented in spec.md [evidence: `spec.md` §4 REQ-001 through REQ-007, each with acceptance criteria]
- [x] CHK-002 [P0] Technical approach defined in plan.md [evidence: `plan.md` §3 Architecture + §4 Implementation Phases, all 4 phases executed]
- [x] CHK-003 [P1] Dependencies identified and available (`dispatch-audit.mjs`, `dispatch-rule-checks.mjs`, Codex adapter, 4 cli-* SKILL.md files) [evidence: all 3 core files modified and confirmed present by direct read this pass]
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] `evaluate()`'s real severity-mapping branch read and quoted verbatim before any edit. [evidence: pre-change `severity === 'block' ? 'block' : 'warn'` quoted in implementation-summary.md's pre-implementation pass, per NFR-T01]
- [x] CHK-011 [P0] Three new `DISPATCH_SHAPES` entries (devin, cursor, pi) added with word-boundary-anchored regexes matching the pattern of the existing `opencode run`/`claude -p` entries. [evidence: `dispatch-audit.mjs` `DISPATCH_SHAPES` — `/\bdevin\b[^\n;&|]*\s(-p|--print)\b/`, `/\bcursor-agent\b[^\n;&|]*\s(-p|--print)\b/`, `/\bpi\b[^\n;&|]*\s(-p|--print)\b/`, confirmed by direct read]
- [x] CHK-012 [P0] `CODEX_EXEC_SHAPE` folded into the shared registry with zero remaining local duplicate. [evidence: both the PreToolUse `dispatch-preflight-lint.mjs` and the PostToolUse `dispatch-audit-posttooluse.mjs` adapters no longer declare `CODEX_EXEC_SHAPE`/`DISPATCH_SKILLS`/`SHAPES`; both read `DISPATCH_SHAPES` directly. `rg -n "CODEX_EXEC_SHAPE"` repo-wide returns 0 hits, confirmed this pass]
- [x] CHK-013 [P0] `severity: error` -> `block`/`warn` mapping implemented as an explicit branch, not an implicit fallthrough. [evidence: `const blocking = rule.severity === 'block' || rule.severity === 'error';` then `severity: blocking ? 'block' : 'warn'`, confirmed by direct read; `node --test dispatch-rule-checks.test.mjs` 7/7 including the severity test]
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Matching/non-matching regression test pair added for the devin shape. [evidence: `dispatch-audit.test.mjs` "recognizes each external CLI print-mode dispatch and ignores non-dispatch bash"; `devin auth status` correctly resolves to null]
- [x] CHK-021 [P0] Matching/non-matching regression test pair added for the cursor shape. [evidence: same test; `cursor-agent --help` correctly resolves to null]
- [x] CHK-022 [P0] Matching/non-matching regression test pair added for the pi shape. [evidence: same test; `pi install && claude -p "x"` correctly resolves to `cli-claude-code`, not `cli-pi`, proving separator-crossing safety]
- [x] CHK-023 [P0] Matching/non-matching regression test pair added confirming the codex shape resolves from the shared registry alone. [evidence: same test; `codex exec ... -p` resolves to `cli-codex` from `DISPATCH_SHAPES` alone; `git status && ls -la` correctly resolves to null]
- [x] CHK-024 [P0] Test asserting the exact resulting `severity` field for an `error`-severity rule. [evidence: `dispatch-rule-checks.test.mjs` "severity maps error and block to a blocking violation; anything else advises" — 7/7 passing]
- [x] CHK-025 [P1] Full dispatch-family suite re-run (not only new tests); pre-existing `opencode run`/`claude -p` coverage unregressed. [evidence: `node --test dispatch-rule-checks.test.mjs` 7/7, `npx vitest run dispatch-audit.test.mjs` 81/81, `node --test` on mk-post-edit-quality + mk-deep-loop-guard + claude-task-dispatch-guard 41/41 — all re-run and green this pass]
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: this is a `cross-consumer` change (the Codex adapter's local shape and the shared registry both need to reflect the same source of truth), not an instance-only change. [evidence: confirmed by this pass's own discovery — the PreToolUse Codex adapter WAS migrated, but the PostToolUse Codex adapter was NOT, proving the cross-consumer risk this checklist item exists to catch was real]
- [x] CHK-FIX-002 [P0] Consumer inventory covers every reader of `DISPATCH_SHAPES`/`DISPATCH_SKILLS`: the shared registry itself, the Codex adapter's local composition, and any other adapter reading `DISPATCH_SHAPES` directly (e.g. the Pi preflight-lint adapter, confirmed reading `audit.DISPATCH_SHAPES`). [evidence: inventory run this pass via `rg -n "CODEX_EXEC_SHAPE"` repo-wide, 0 hits. An interim run of this same sweep found `dispatch-audit-posttooluse.mjs` (codex) still holding a local `CODEX_EXEC_SHAPE`/`SHAPES` composition the original consumer inventory had missed; that was fixed in this session and the re-run sweep is clean]
- [x] CHK-FIX-003 [P1] Matrix axes: 4 CLIs (devin, cursor, pi, codex) x match/non-match regression case each. [evidence: `dispatch-audit.test.mjs` "recognizes each external CLI print-mode dispatch and ignores non-dispatch bash" covers all 4 CLIs x match/non-match]
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets introduced (regex/branch-logic changes only). [evidence: `dispatch-audit.mjs`/`dispatch-rule-checks.mjs` confirmed by direct read — all changes are dispatch-shape regexes and a severity-mapping branch, no literal credentials/tokens]
- [x] CHK-031 [P1] `scrubSecrets`/`SECRET_PATTERNS` in `dispatch-audit.mjs` left unmodified by this phase; no new unredacted field introduced by the new shape entries. [evidence: `SECRET_PATTERNS` and `scrubSecrets` confirmed unchanged by direct read; new `DISPATCH_SHAPES` entries carry only `{ test, skill, packetPath }`, no new field shape]
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] spec.md/plan.md/tasks.md synchronized with the actual completed work once implemented. [evidence: `spec.md`/`plan.md`/`tasks.md` — Status/checkboxes/continuity fields flipped consistently across all 5 docs this pass, including the mid-session codex posttooluse-adapter fix (T013) recorded consistently in every doc that references it]
- [x] CHK-041 [P1] `implementation-summary.md` discloses the CHECKS-function gap honestly (three missing check IDs named, not implied as activated). [evidence: Known Limitations #2 names `command-v-<cli>-required`, `<cli>-self-invocation-guard`, `deep-loop-runtime-delegation` and the `if (!fn) continue` skip behavior]
- [x] CHK-042 [P2] `.opencode/hooks/dispatch/README.md` updated if the shared-registry description needs a devin/cursor/pi/codex mention. [evidence: assessed, not edited — out of this doc-only completion pass's scope (README.md is outside the 006 folder). README.md:16 already covers the new shapes generically ("`opencode run`, `claude -p`, `devin -p`, and siblings"); an itemized cursor/pi/codex mention is left as an optional future editorial pass, deferred per [P2] Optional handling.]
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No stray temp files left in the repo outside the scratchpad. [evidence: this completion pass touched only the 5 docs in `006-dispatch-shape-coverage/` plus regenerated metadata; no temp files created]
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 14 | 14/14 |
| P1 Items | 7 | 7/7 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-07-29
<!-- /ANCHOR:summary -->
