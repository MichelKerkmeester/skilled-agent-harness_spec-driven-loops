---
title: "Implementation Summary: Dispatch-shape coverage for devin/cursor/pi + Codex fold-in"
description: "Delivered. DISPATCH_SHAPES extended 2->6, Codex fold-in on both PreToolUse and PostToolUse adapters, severity error->block mapping — all verified by test re-run; rg -n CODEX_EXEC_SHAPE repo-wide is 0 hits."
trigger_phrases:
  - "dispatch shape coverage summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "hooks/003-goal-hooks-cross-runtime/006-dispatch-shape-coverage"
    last_updated_at: "2026-08-11T06:43:15.604Z"
    last_updated_by: "claude"
    recent_action: "Verified shipped code (both codex adapters) against spec; flipped docs to Complete"
    next_safe_action: "Consider a follow-up phase for the three missing CHECKS functions"
    blockers: []
    key_files:
      - ".opencode/hooks/dispatch/lib/dispatch-audit.mjs"
      - ".opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs"
      - ".opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs"
      - ".opencode/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "dispatch-shape-coverage-20260728"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Whether implementing the three missing CHECKS entries belongs in this phase or a follow-up remains unresolved; deliberately out of scope here (see REQ-006/REQ-007)."
    answered_questions:
      - "severity: error resolved to map to 'block', implemented as an explicit branch, tested."
      - "REQ-002/SC-002 (zero remaining CODEX_EXEC_SHAPE duplicate) fully met: both the PreToolUse and PostToolUse codex adapters read DISPATCH_SHAPES directly; rg -n \"CODEX_EXEC_SHAPE\" repo-wide is 0 hits."
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-dispatch-shape-coverage |
| **Completed** | 2026-07-29 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

`DISPATCH_SHAPES` in `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` grew from 2 to 6 entries. Added `cli-codex` (`/\bcodex\s+exec\b[^\n;&|]*\s(-p|--print)\b/`), `cli-devin` (`/\bdevin\b[^\n;&|]*\s(-p|--print)\b/`), `cli-cursor` (`/\bcursor-agent\b[^\n;&|]*\s(-p|--print)\b/`), `cli-pi` (`/\bpi\b[^\n;&|]*\s(-p|--print)\b/`). The intervening-flag class is `[^\n;&|]*` — it allows flags between the binary and print flag (e.g. pi's required `--offline`), but not across a shell separator (`&&`/`;`/`|`): a `-p` after a separator belongs to the next command, not the dispatch being audited.

`.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` (the PreToolUse Codex adapter) had its local `CODEX_EXEC_SHAPE` constant and the `DISPATCH_SKILLS = [...DISPATCH_SHAPES, CODEX_EXEC_SHAPE]` composition removed; it now reads the shared `DISPATCH_SHAPES` directly. Its PostToolUse sibling, `.opencode/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs`, carried the same pattern (a local `CODEX_EXEC_SHAPE` + `SHAPES = [...DISPATCH_SHAPES, CODEX_EXEC_SHAPE]` composition) and was fixed the same way in this session once found — it now also reads `DISPATCH_SHAPES` directly, with no local shape duplicate remaining anywhere in the repo (`rg -n "CODEX_EXEC_SHAPE"` — 0 hits).

`.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs`'s `evaluate()` severity-mapping branch is resolved: `const blocking = rule.severity === 'block' || rule.severity === 'error';` then `severity: blocking ? 'block' : 'warn'` — `severity: 'error'` now maps to `'block'` (was silently `'warn'`), alongside the pre-existing `'block'`. This is future-proofing with no current runtime effect: the error-severity rules on cli-codex/devin/cursor/pi reference check functions (`command-v-<cli>-required`, `<cli>-self-invocation-guard`, `deep-loop-runtime-delegation`) that are NOT registered in `CHECKS`, so `evaluate()`'s `if (!fn) continue` guard skips them regardless of severity (see Known Limitations #2).

### `DISPATCH_SHAPES` extension

Three new entries mirroring the existing `{ test, skill, packetPath }` shape, plus the Codex entry moved in from its adapter-local location. Verified: `npx vitest run dispatch-audit.test.mjs` 81/81 passing, including a per-CLI recognition test.

### Severity-mapping resolution

`evaluate()` previously mapped `severity === 'block' ? 'block' : 'warn'` (quoted verbatim pre-change, per NFR-T01), so a `severity: error` hard rule — the only severity value declared by `cli-devin`/`cli-cursor`/`cli-pi`/`cli-codex` — silently fell into `warn`. The mapping is now an explicit branch, tested by `dispatch-rule-checks.test.mjs`'s "severity maps error and block to a blocking violation; anything else advises" (proves error->block, block->block, warn->warn, bare->warn via a throwaway registered check).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/hooks/dispatch/lib/dispatch-audit.mjs` | Modified | Added 3 new shape entries + folded in the Codex shape (2->6 total). |
| `.opencode/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | Explicit `error`->`block` severity-mapping branch. |
| `.opencode/hooks/dispatch/codex/dispatch-preflight-lint.mjs` | Modified | Removed `CODEX_EXEC_SHAPE`/`DISPATCH_SKILLS`, reads `DISPATCH_SHAPES` directly. |
| `.opencode/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs` | Modified | Removed `CODEX_EXEC_SHAPE`/`SHAPES`, reads `DISPATCH_SHAPES` directly (fixed mid-session after an interim `rg` sweep found this file was missed by the original consumer inventory). |
| `.opencode/hooks/dispatch/lib/dispatch-audit.test.mjs`, `dispatch-rule-checks.test.mjs` | Modified | Regression tests per new shape + severity-mapping test. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Implemented directly against `skilled/v4.0.0.0` (parent packet's operator choice, no worktree). The three new `DISPATCH_SHAPES` entries and the Codex fold-in were added to `dispatch-audit.mjs` and the codex `dispatch-preflight-lint.mjs` respectively; the severity-mapping branch was added to `evaluate()` in `dispatch-rule-checks.mjs`. Regression tests were added per new shape (match + non-match pairs, including shell-separator-crossing safety) plus a severity-mapping test, then the full dispatch-family suite was re-run to confirm no regression on the pre-existing `opencode run`/`claude -p` coverage. Two integration smokes (a `devin -p ...` payload through the Claude preflight adapter, a `codex exec -p` payload through the Codex adapter) were also run and both exit 0 cleanly this pass. A repo-wide `rg -n "CODEX_EXEC_SHAPE"` sweep run during completion-doc verification found a second local duplicate in the PostToolUse `dispatch-audit-posttooluse.mjs` adapter (missed by the original In-Scope file list); it was fixed the same way as the PreToolUse adapter in the same session, and the sweep re-confirmed 0 hits repo-wide.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Scope this phase to shape-matching + severity-mapping only, not the three missing `CHECKS` function implementations. | A direct read of `evaluate()`'s `if (!fn) continue` guard shows shape-matching alone does not cause any check to actually run until `command-v-<cli>-required`/`<cli>-self-invocation-guard`/`deep-loop-runtime-delegation` exist in `CHECKS` — none do, confirmed again post-implementation. Scoping this phase narrowly and disclosing the gap avoids an overclaimed completion. |
| Fold Codex's shape into the shared registry on BOTH the PreToolUse and PostToolUse adapters, not just the one this phase's In-Scope text originally named. | An interim `rg -n "CODEX_EXEC_SHAPE"` sweep during this completion-doc pass found `dispatch-audit-posttooluse.mjs` (PostToolUse) still carried its own local `CODEX_EXEC_SHAPE`/`SHAPES` duplicate — the original consumer inventory (spec.md's In Scope list) had missed it. Fixed the same way as `dispatch-preflight-lint.mjs` in the same session so REQ-002/SC-002's "zero hits repo-wide" claim is actually true, not just true for the one named file. |
| `severity: error` maps to `block`, not `warn`. | `error` is the strictly stronger of the two severities all four cli-* skills' hard_rules currently use; treating it as advisory-only would silently under-enforce a rule its author explicitly marked as a hard blocker once the referenced check functions exist. |
| Treat this phase as functionally independent of phases 001-005. | It touches an unrelated hook concern (`dispatch/`, not `goal/`) with no shared state or import; ordered 006 for packet narrative only. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test dispatch-rule-checks.test.mjs` | 7/7 passing, incl. new severity-mapping test |
| `npx vitest run dispatch-audit.test.mjs` | 81/81 passing (2 test files), incl. per-CLI recognition + negative-case tests |
| `node --test` on mk-post-edit-quality + mk-deep-loop-guard + claude-task-dispatch-guard (regression) | 41/41 passing |
| Integration smoke: `devin -p ...` payload through Claude preflight adapter | Exit 0 (approve; rules present but check functions unregistered) |
| Integration smoke: `codex exec -p ...` payload through Codex preflight adapter | Exit 0 (dispatch recognized, approve) |
| Codex fold-in, zero remaining local duplicate (`rg -n "CODEX_EXEC_SHAPE"` repo-wide) | 0 hits. An interim run mid-pass found a hit in `dispatch-audit-posttooluse.mjs:40,45`; fixed same session, re-run confirms clean. |
| `validate.sh --strict` on this spec folder (child) | Run this pass — see report footer |
| `validate.sh --strict` on parent packet folder | Run this pass — see report footer |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shape coverage makes devin/cursor/pi/codex dispatches AUDITED and RECOGNIZED, but does NOT activate meaningful hard-rule enforcement for them.** Their declared `hard_rules:` are skill-invocation guards (availability probe, self-invocation ancestry, runtime-delegation) that are not command-string-evaluable and whose check functions are intentionally not implemented in the dispatch preflight layer. This matches the spec's original Out-of-Scope framing — it is not a regression, it is the honest boundary of what shape-matching alone can deliver.
2. **The three referenced `CHECKS` functions remain unimplemented.** `command-v-devin-required`, `devin-self-invocation-guard`, `command-v-cursor-agent-required`, `cursor-self-invocation-guard`, `command-v-pi-required`, `pi-self-invocation-guard`, and `deep-loop-runtime-delegation` (shared check ID across all four `cli-*` skills) do not exist in `CHECKS`, confirmed via direct read of `dispatch-rule-checks.mjs` (still only 5 entries: `stdin-redirect-required`, `no-bare-agent-general`, `command-flag-for-slash-prompt`, `share-requires-confirmation`, `non-interactive-permission-mode-risk`). Shape-matching (this phase's actual deliverable) makes `readHardRules()` find these rules and pass them to `evaluate()`, but `evaluate()`'s `if (!fn) continue` guard means they are silently skipped, not violated, until those check functions are implemented — explicitly out of scope here (REQ-006/REQ-007), left for a follow-up phase.
3. **Severity-mapping decision implemented: `error` -> `block`.** Resolved and tested; not a limitation, kept here only to close out the item this phase's Open Questions previously tracked.
4. **A second Codex-shape duplicate was found and fixed mid-session.** An interim `rg -n "CODEX_EXEC_SHAPE"` sweep (T013) during this completion-doc verification pass found `.opencode/hooks/dispatch/codex/dispatch-audit-posttooluse.mjs` (the PostToolUse audit-trail sibling of the PreToolUse `dispatch-preflight-lint.mjs` adapter) still declared its own local `CODEX_EXEC_SHAPE`/`SHAPES` composition, with a regex that had also drifted from the canonical `DISPATCH_SHAPES` `cli-codex` entry (missing the `;&|` shell-separator exclusion). This file was not in this phase's original spec.md "In Scope" list, so the initial implementation pass missed it. It was fixed in the same session — the adapter now reads `DISPATCH_SHAPES` directly, matching `dispatch-preflight-lint.mjs` — and verified: `rg -n "CODEX_EXEC_SHAPE"` repo-wide is 0 hits, `node --test dispatch-rule-checks.test.mjs` 7/7, `npx vitest run dispatch-audit.test.mjs` 81/81 still green post-fix. REQ-002/SC-002 are now fully met, not just for the originally-named file.
<!-- /ANCHOR:limitations -->
