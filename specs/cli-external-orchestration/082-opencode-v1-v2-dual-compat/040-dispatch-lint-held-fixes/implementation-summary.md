---
title: "Implementation Summary: Phase 40: dispatch-lint-held-fixes"
description: "All ten dispatch-hook findings 039 held are fixed, each with a test that fails on the pre-change engine; ten Luna rounds hardened the Pi authorization, and its remaining known gaps are recorded."
trigger_phrases:
  - "dispatch lint held fixes implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/040-dispatch-lint-held-fixes"
    last_updated_at: "2026-10-21T04:55:14Z"
    last_updated_by: "template-author"
    recent_action: "Round 10 closed both reproduced round-9 items; shipped with one recorded known gap"
    next_safe_action: "None; known gaps recorded"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-040-dispatch-lint-held-fixes"
      parent_session_id: null
    completion_pct: 100
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
| **Status** | Complete |
| **Completed** | 2026-10-21 |
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
| b09-hooks-dispatch-N02 (P0) | 2cac0da1fa, 22f6b903a5, 2c352bae5a, d3c7237d8e, 14818954f9, 01e5e6c73a, 8042946e3c, 5ec42348e8, 80ef0a3adf, 1889eb0dcd, b4da9c1e63, 6ff94ffe21 | Pi deny matrix: negated, quoted, backtick and bare-not deep-loop rows |
| b09-hooks-dispatch-012 (P1) | d5e869aaae | `permission-mode check sees claude print mode behind other flags` |
| b09-hooks-dispatch-N03 (P1) | fdc0fc8741, a207f963dd, c0805c2350, 1db655bfe5, e0f84f529b | `resolveDispatchPackets` chain test, Codex `lints the second dispatch in a chain against its own packet`, `each repeated dispatch is held to the stdin and model checks on its own` |
| b09-hooks-dispatch-N04 (P1) | 17d2a25f4c, 92e672a7c2 | `stdin and model checks ignore flags and redirects inside a quoted prompt` |
| b09-hooks-dispatch-N05 (P1) | 72b98dd2b3, 9fb6fc7d7e, 06bfa6eb1d, 0bde6b4df6 | 'merely contains' heredoc rows (fed to bash, after a herestring, first heredoc replaced, hyphenated word) |
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

DeepSeek v4.1 flash (cli-pi) wrote each change from a one-change brief (`scratch/briefs/`). Every change was then mutation-checked against the commit before it, compared on the 260-command corpus and run through the suites. Luna verified read-only in ten rounds (`scratch/luna/`). Round 1 found the herestring and two-heredoc defects, round 2 the same-skill repeat, ANSI-C quote and quoted-delimiter gaps, and round 3 the bare-not, pipe and hyphenated-delimiter gaps. Each was fixed and verified in the next round. Round 4 closed all of them and reported three P1s. The operator approved a fifth round limited to those three: 2c352bae5a scopes a Pi negation to its clause, e0f84f529b counts only pipes that feed a dispatch, and 0bde6b4df6 reads a `<<` inside quotes as text. Round 5 closed all three and found that a comma ended a negation. The operator approved a sixth round for that item: d3c7237d8e carries a negation across a parenthetical comma, with sixteen new deny-matrix phrasings that each fail on the engine before it. Round 6 closed it and found a negated list with imperatives and modal negations still authorizing. The operator approved a seventh round: 14818954f9 carries a negation across and/or lists, adds modal negations, refusal verbs and curly apostrophes, and denies exclusion phrases before the mention and refusals after it, with a 54-deny, 13-allow phrasing table whose deny rows each fail on the original base or the pre-round head. Round 7 closed both and found three more phrasing gaps. The user then chose a sentence-wide refusal policy as the final, eighth round: 01e5e6c73a replaces the layered reading with one rule (a sentence naming the executor authorizes only when it carries no negation or refusal word; `not <other>, use <executor>` and `not <other> but <executor>` excepted). Round 8 closed the three round-7 items and found five P1s the base engine also has. The user approved a ninth round for all five: 8042946e3c widens the refusal verbs and ends a sentence only at `.`/`!`/`?` before whitespace and a capital, bac669ee6d exports the registry's `executorSkill`, 5ec42348e8 compares reset-form executors through it, 80ef0a3adf reads curly quotes and nested substitutions, and 1889eb0dcd adds refusal nouns and a next-sentence retraction. Round 9 closed all five and found two more that reproduce. The user approved a tenth round and then shipping: b4da9c1e63 lets a next-sentence refusal of the same executor, under any alias, revoke the authorization, and 6ff94ffe21 tracks quote and escape state in the substitution depth scan. Round 10 closed both and found one more gap, which shipped recorded; phase 051 later fixed it at `e477e8974e`, `47a4db2498` and `7c739849a7`.
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
| Pi authorization refuses any sentence with a negation or refusal word | The user's policy after seven rounds of word lists: a fail-closed false deny is P2, so the operator writes the request as its own sentence |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| hooks node:test | PASS 840/0 (baseline 836) |
| hooks vitest | PASS 401/0 (baseline 217) |
| plugins | PASS 481/0 (baseline 481) |
| battery unit | PASS 51/0 (baseline 51) |
| dispatch rule-checks | PASS 42/0 (baseline 38) |
| dispatch audit vitest | PASS 124/0 (baseline 114) |
| Mutation | Every new test fails on the commit before its fix (`scratch/mutation/`) |
| Corpus | 18 of 260 commands move, each one a finding names (`scratch/corpus-diff.txt`) |
| Luna round 10 | FAIL: one P1, shipped as a recorded known gap; the base engine lets it through too |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Policy P2: fail-closed false denies.** A positive request with a negation or refusal word in its sentence, such as `use cli-devin, it is not forbidden`, is denied by the user's policy. The operator writes the request as its own sentence. The hooks README records this.
2. **Closed by phase 051:** the round-10 gap, where `` $(echo "`printf ")"`" cli-devin) `` authorized cli-devin, is fixed at `e477e8974e`, `47a4db2498`, `7c739849a7` and phase 051's final commit, which also checks a `/deep:` executor value's own position. One context-stack scanner reads the operator's text the way a POSIX shell quotes it, with and without comments and with curly quotes read both ways, and an unclosed context or nesting past 32 denies.
3. **Recorded from phase 051's reviews (P2 false denies and P3 notes, no leak):** `please use devin` denies because the override search reads only the canonical `cli-devin`; `use cli-devin. never use codex.` denies because a lower-case word does not start a sentence; a quote character or a refusal word inside a top-level `#` comment denies; `$(( '2' ))` arithmetic that dash rejects is allowed with a plain mention after it; a mention inside a top-level `#` comment authorizes, by design; `/deep:review --executor devin` denies because deep-loop values must be `cli-*`.
4. **Recorded:** the Pi phrasing rounds 4 to 10 each found phrasings the word set or the quote and expansion scan misses; a word list cannot be complete.
5. **Recorded from round 3:** `<<$'WORD'` delimiters, a heredoc fed to `env bash`, and a quoted `"$(codex exec task)"` in the audit are still missed.
6. **Recorded from round 2:** the fallback resolves `unknown-wrapper devin -p task` and `devin -p "unterminated` as Devin. This is the preflight's existing fail-closed reading, which the audit now shares.
<!-- /ANCHOR:limitations -->
