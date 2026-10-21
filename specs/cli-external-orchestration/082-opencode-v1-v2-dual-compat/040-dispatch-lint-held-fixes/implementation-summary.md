---
title: "Implementation Summary: Phase 40: dispatch-lint-held-fixes"
description: "All ten dispatch-hook findings 039 held are fixed with a test that fails on the pre-change engine; the main push is held because Luna's fourth and last round still found three P1s."
trigger_phrases:
  - "dispatch lint held fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/040-dispatch-lint-held-fixes"
    last_updated_at: "2026-10-21T04:55:14Z"
    last_updated_by: "template-author"
    recent_action: "Fixed all ten held findings; Luna round 4 FAIL with three P1s recorded"
    next_safe_action: "Operator decides the main push"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-040-dispatch-lint-held-fixes"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 040-dispatch-lint-held-fixes |
| **Status** | In Progress |
| **Completed** | Not yet: Luna round 4 FAIL |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The ten dispatch-hook findings 039 held for the operator are fixed in the shared engine, the preflight and audit adapters and the Pi extension. Each fix has a test that fails on the engine before it (`scratch/mutation/`).

| Finding | Fix commit(s) | Test that fails without it |
|---------|---------------|----------------------------|
| b09-hooks-dispatch-006 (P0) | 2cb94baa32 | `dispatch-audit.test.mjs` codex substitution rows |
| b09-hooks-dispatch-N01 (P0) | 7bda6731b4 | Pi `denies a wrapped dispatch`, `blocks a named wrapper dispatch that omits the stdin redirect` |
| b09-hooks-dispatch-N02 (P0) | 2cac0da1fa, 22f6b903a5 | Pi deny matrix: negated, quoted, backtick and bare-not deep-loop rows |
| b09-hooks-dispatch-012 (P1) | d5e869aaae | `permission-mode check sees claude print mode behind other flags` |
| b09-hooks-dispatch-N03 (P1) | fdc0fc8741, a207f963dd, c0805c2350, 1db655bfe5 | `resolveDispatchPackets` chain test, Codex `lints the second dispatch in a chain against its own packet`, `each repeated dispatch is held to the stdin and model checks on its own` |
| b09-hooks-dispatch-N04 (P1) | 17d2a25f4c, 92e672a7c2 | `stdin and model checks ignore flags and redirects inside a quoted prompt` |
| b09-hooks-dispatch-N05 (P1) | 72b98dd2b3, 9fb6fc7d7e, 06bfa6eb1d | 'merely contains' heredoc rows (fed to bash, after a herestring, first heredoc replaced, hyphenated word) |
| b09-hooks-dispatch-N06 (P2) | 237e6f863b | `matchDispatchShape` wrapper test |
| b09-hooks-dispatch-N07 (P2) | f006480388, 06bfa6eb1d | Codex heredoc audit test in `codex-shell-tool.test.mjs` |
| b09-hooks-dispatch-N08 (P2) | f006480388, 06bfa6eb1d | `devin/devin-dispatch-audit.test.mjs` |

The hooks README and the two dispatch playbook features describe the new behaviour (1da140c77f).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/hooks/dispatch/lib/dispatch-audit.mjs` | Modified | Resolver returns every dispatch, reads executed heredocs, audit matches what it resolves |
| `.skilled/hooks/dispatch/lib/dispatch-rule-checks.mjs` | Modified | `evaluateDispatch`; stdin, model and permission checks read each dispatch's real arguments |
| `.skilled/hooks/dispatch/{claude,codex,devin}/dispatch-preflight-lint.mjs` | Modified | Lint every dispatch against its own packet |
| `.skilled/hooks/dispatch/{codex,devin}/dispatch-audit-posttooluse.mjs` | Modified | Audit through `recordDispatch` |
| `.opencode/plugins/cli-dispatch-audit.js` | Modified | Preflight uses `evaluateDispatch` |
| `.skilled/hooks/dispatch/pi/dispatch-preflight-lint.ts` | Modified | Resolve wrapped dispatches before authorization; stricter deep-loop override |
| Tests beside each file, README, two playbook features | Modified | Coverage and docs |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek v4.1 flash (cli-pi) wrote each change from a one-change brief (`scratch/briefs/`). Every change was then mutation-checked against the commit before it, compared on the 260-command corpus and run through the suites. Luna verified read-only in four rounds (`scratch/luna/`). Round 1 found the herestring and two-heredoc defects, round 2 the same-skill repeat, ANSI-C quote and quoted-delimiter gaps, and round 3 the bare-not, pipe and hyphenated-delimiter gaps. Each was fixed and verified in the next round. Round 4 closed all of them and reported the three P1s below.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| In Pi, only a `none` inspection with one resolved packet is upgraded to `direct` | An `ambiguous` reading (`devin -p "$TASK"`, a wrapped `-p` executor) stays denied by design; the bypass was only the `none` path |
| Audit records the first packet the shared resolver names | The audit and preflight now agree on what counts as a dispatch |
| Keep the bare-`not` negation despite round 4's false deny | It fails closed; removing it reopens an authorization bypass |
| Record, not fix, the round-3 and round-4 items that are not regressions | Stop rule: four Luna rounds; each is a further shell shape the base engine also missed |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| hooks node:test | PASS 840/0 (baseline 836) |
| hooks vitest | PASS 242/0 (baseline 217) |
| plugins | PASS 481/0 (baseline 481) |
| battery unit | PASS 51/0 (baseline 51) |
| dispatch rule-checks | PASS 42/0 (baseline 38) |
| dispatch audit vitest | PASS 122/0 (baseline 114) |
| Mutation | Every new test fails on the commit before its fix (`scratch/mutation/`) |
| Corpus | 18 of 260 commands move, each one a finding names (`scratch/corpus-diff.txt`) |
| Luna round 4 | FAIL: three P1s, listed below |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **False deny after a contrast clause.** In Pi, `not opencode, use cli-devin` is now denied because the bare `not` negates the later mention. It fails closed; the user can drop the contrast clause.
2. **A pipe into a non-dispatch counts toward the stdin budget.** `printf x | pi --version; opencode run -m p/m "b"` passes the stdin check. The engine before this phase passed it too.
3. **A quoted `<<'WORD'` in prompt text is read as a heredoc.** With a matching closing line later, the dispatch between them is skipped. The base engine had this for identifier words; this phase extends it to hyphenated words.
4. **Recorded from round 3:** `<<$'WORD'` delimiters, a heredoc fed to `env bash`, and a quoted `"$(codex exec task)"` in the audit are still missed.
5. **Recorded from round 2:** the fallback resolves `unknown-wrapper devin -p task` and `devin -p "unterminated` as Devin. This is the preflight's existing fail-closed reading, which the audit now shares.
<!-- /ANCHOR:limitations -->
