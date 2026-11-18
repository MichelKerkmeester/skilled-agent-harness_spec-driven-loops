---
title: "Implementation Summary"
description: "Built 2026-11-18: the Python local scorer strips a pasted earlier reply at the entry of analyze_request exactly as the native rule does on 23 shared fixture rows, rr-paste-208 left the ledger and four parity pins rose by one."
trigger_phrases:
  - "python scorer strip parity implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/host-integrations/003-pi-skill-orchestrator-based-research-refinement/016-pi-context-decisions-based-research-refinement/007-python-scorer-strip-parity"
    last_updated_at: "2026-11-18T18:40:00Z"
    last_updated_by: "claude-opus-5-5"
    recent_action: "Built and verified the Python strip port"
    next_safe_action: "Build phase 008, the handler scored-prompt consumers"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "20078428-5166-43d7-85ac-a68d9210f82f"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.4 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 007-python-scorer-strip-parity |
| **Completed** | 2026-11-18 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The Python scorer the CLI falls back to now drops a pasted earlier reply the same way the native scorer does. The phase 002 probe routes `sk-code` first on the force-local path, where it routed `sk-doc` first before.

### Phase 7: python-scorer-strip-parity

`strip_leading_pasted_reply` sits above `analyze_request` and runs as its first statement after the empty check, so the CLI fallback, validation and the ledger capture all reach it through `analyze_prompt`. Marker rule: last-marker, the rule phase 006 shipped. The whitespace set is JavaScript's `\s` and `trim` set written as ASCII `\u` escapes, and matching uses `re.IGNORECASE` with `re.ASCII`. `analyze_batch` now trims with the same set, which the refutation pass showed was needed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `runtime/scripts/skill_advisor.py` | Modified | The strip function, its call in `analyze_request`, and the JavaScript trim set in `analyze_batch` |
| `runtime/tests/python/test_skill_advisor.py` | Modified | `test_pasted_reply_strip_parity`: the 23 shared rows, the entry check and two batch-trim assertions |
| `runtime/tests/fixtures/pasted-reply-strip-cases.json` | Modified | Six parity rows appended, 23 in all |
| `runtime/tests/fixtures/README.md` | Modified | The fixture row names the Python reader |
| `runtime/tests/parity/fixtures/local-native-approved-divergences.json` | Modified by its capture script | `rr-paste-208` resolved, 73 entries to 72 |
| `runtime/tests/parity/python-ts-parity.vitest.ts` | Modified | `pythonCorrect` 113 to 114, `tsAlsoCorrect` 108 to 109, one history comment |
| `runtime/tests/legacy/advisor-corpus-parity.vitest.ts` | Modified | `pythonCorrect` 117 to 118, `hookPreservedPythonCorrect` 112 to 113, one history comment |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna `xhigh` `fast` leaves through cli-codex wrote the fixture rows, the Python test, the port, an escape fix that kept the whitespace set ASCII, both pin moves, the batch-trim test and the batch-trim fix, one file each. The conductor ran every baseline, red run, build, ledger capture, parity run and probe. The second pin in each suite only shows after the first one moves, so both were measured in a throwaway run with all four pins raised, then reverted before the leaves set them.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Strip at the entry of `analyze_request` | Every Python caller reaches it, including the CLI fallback, validation and the ledger capture, which mirrors the native scorer's entry at `lib/scorer/fusion.ts:1277` |
| Spell out JavaScript's whitespace set and use `re.ASCII` | A direct Python copy of the rule differed from JavaScript on five of six parity rows, measured 2026-11-18 |
| Fix the batch trim instead of recording it as a limit | The refutation input routed `sk-code` in Python batch mode and `sk-doc` natively. One line closes it, and no corpus prompt carries the five affected characters, so no measured number moves |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Baselines | `PY` pass=89, `PARITY` 9 files 65/65, `LOCAL` `sk-doc` first |
| Red run, T006 | `POLICY` 29/29; `PY` 24 failures, the 23 `STRIP-` rows plus the entry check |
| After the port | `PY` pass=113 fail=0; `LOCAL` lists `sk-code`, `command-speckit-save`, `system-spec-kit` |
| Parity red, T009 | Only the four pins and the ratchet's `rr-paste-208`: received 114, 109, 118 and 113, each pin plus 1 |
| Ledger | Capture `--write` resolved `rr-paste-208` only, 72 entries; ratchet 9/9; a later dry run printed all three lists empty |
| Gates after the pins | `tests/parity`, the corpus suite and `tests/handlers/advisor-validate.vitest.ts`: 10 files, 75 of 75 |
| Batch trim | Red at pass=113 fail=2, green at pass=115 fail=0 |
| Comment hygiene | `rg` printed nothing |
| Refutation pass (Luna `xhigh`, read-only) | REFUTED with one finding, confirmed and fixed: `analyze_batch` trimmed with `str.strip()`, which drops U+001C to U+001F and U+0085, so a U+001C-led pasted reply was stripped in batch mode and kept natively. The `--stdin` path, validation and the capture call `analyze_prompt` on the raw prompt and already matched. The direct helper matched TypeScript on all 23 rows and 15 constructed probes |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Fixed by phase 008. The degraded path read the raw prompt for typed commands.** `degradedRecommendations` checked the raw prompt for a command row's bare command. Phase 008 strips it first (`runtime/skill-advisor-cli.ts:1490`), so the check at `:1498` reads the task; the call site is now `:1588`.
<!-- /ANCHOR:limitations -->

---
