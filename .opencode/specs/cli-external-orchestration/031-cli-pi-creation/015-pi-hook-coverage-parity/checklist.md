---
title: "Verification Checklist: Pi hook coverage parity"
description: "Verification checklist for the pi-hook-coverage-parity phase."
trigger_phrases: ["pi hook coverage parity checklist"]
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/031-cli-pi-creation/015-pi-hook-coverage-parity"
    last_updated_at: "2026-07-27T20:30:34Z"
    last_updated_by: "claude-code"
    recent_action: "All items verified with real evidence, GLM-5.2 reviewed"
    next_safe_action: "None -- phase complete"
    blockers: []
    key_files: ["implementation-summary.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "cli-pi-creation-hook-coverage"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Verification Checklist: Pi hook coverage parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

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

- [x] CHK-001 [P0] Pi's real Extension API confirmed directly from the installed package, not a prior summary
  - **Evidence**: full Read of `dist/core/extensions/types.d.ts`, confirmed 33-event `ExtensionAPI.on()` surface
- [x] CHK-002 [P1] Every missing devin/cursor hook's real source read before classifying it
  - **Evidence**: full Read/Bash-cat calls on all 10 hook scripts (devin + cursor + their underlying `claude/` targets)
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] Every new `.pi/extensions/*.ts` file has a MODULE header and TSDoc on its default export, matching the existing 6 files' convention
  - **Evidence**: `head -3` on all 6 new files shows the header; each `export default function` has a one-line TSDoc comment
- [x] CHK-011 [P0] No `any` type in any new file's public surface
  - **Evidence**: `grep -n ": any\|<any>\|as any"` across all 6 new files -- 0 matches
- [x] CHK-012 [P0] Output-shape handling matches each dist hook's real behavior, not an assumed-uniform contract
  - **Evidence**: isolated spawn test of `session-prime.js` returned plain text (not JSON), while `user-prompt-submit.js` returned a `hookSpecificOutput` JSON envelope -- the initial implementation wrongly assumed both were JSON; caught by the spawn test and fixed in `session-start-context.ts` before commit
- [x] CHK-013 [P0] `prompt-advisor.ts` does not regress `spec-gate-classify.ts`'s existing Gate-3 question on the same `input` event
  - **Evidence**: direct read of `runner.js`'s `emitInput()` confirms transforms chain additively (`currentText` accumulates across handlers), not last-writer-wins
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] A live Pi session starts with 0 extension-load errors after every new file was added
  - **Evidence**: `pi --offline --approve -p "list your available tools"` exit 0, re-run 3 times across the build, no extension-load error in output each time
- [x] CHK-021 [P1] `.pi/extensions/README.md` passes `validate_document.py` with 0 issues
  - **Evidence**: `VALID, 0 issues`
- [x] CHK-022 [P1] GLM-5.2 independent review completed, findings addressed
  - **Evidence**: full review dispatched via `devin -p --model glm-5.2`; verdict recorded in `implementation-summary.md`
- [x] CHK-023 [P0] Whole-packet `validate.sh --recursive --strict` returns `Errors: 0, Warnings: 0`
  - **Evidence**: parent + all 15 phase folders re-validated after this phase's docs were authored
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] The output-shape bug found during spawn testing was fixed, not left as a silent no-op
  - **Evidence**: `session-start-context.ts` diff shows `extractAdditionalContext()` removed in favor of the raw stdout text, with a comment explaining why
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No secrets/tokens/credentials introduced in any new file
  - **Evidence**: `grep -riE "sk-ant|sk-proj|api[_-]?key\s*[:=]\s*['\"][a-z0-9]"` across all 6 new files -- 0 matches
- [x] CHK-031 [P0] `session-start-advisories.ts`'s `ctx.exec()` calls use fixed, non-user-controlled command/arg arrays, no shell interpolation of external input
  - **Evidence**: `CHECKS` array is a hardcoded literal; `ctx.exec(check.command, check.args, ...)` passes args as an array, not a shell string
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] `.pi/extensions/README.md`'s new §3A CONFIRMED NON-GAPS documents both non-gaps with real evidence, not a bare "deferred" label
  - **Evidence**: each row cites the specific shared core/event the non-gap's need is already met by
- [x] CHK-041 [P1] No em dash or semicolon in `README.md` prose (HVR), verified manually since the automated validator has a known blind spot for both
  - **Evidence**: `grep -n "—"` and a code-fence-excluding semicolon scan -- 1 semicolon found in a self-authored table row, fixed
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] `git status --porcelain` scoped to exactly `.pi/extensions/` plus this phase's own docs
  - **Evidence**: no unrelated file touched (concurrent-session deletions elsewhere in the tree left untouched, per scope lock)
- [x] CHK-051 [P1] `scratch/` left empty
  - **Evidence**: only `.gitkeep`
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 9 | 9/9 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-27. All items verified with real evidence, independently re-run where possible.
<!-- /ANCHOR:summary -->

---

## RELATED DOCUMENTS
- `spec.md`, `plan.md`, `tasks.md`
