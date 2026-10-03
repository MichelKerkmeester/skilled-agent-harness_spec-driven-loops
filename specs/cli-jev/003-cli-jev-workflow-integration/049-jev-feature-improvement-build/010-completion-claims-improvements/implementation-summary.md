---
title: "Implementation Summary"
description: "The completion sentinel now catches a real completion claim without a single false fire on the 047 rows, where the old regex caught none and fired falsely 7 times."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/010-completion-claims-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs"
      - ".skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-5-5-049"
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
| **Spec Folder** | 010-completion-claims-improvements |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The completion sentinel now catches a real completion claim without a single false fire on the 047 rows, where the old regex caught none and fired falsely 7 times. Cursor now runs the sentinel too, and the docs agree on what Pi's advisory shows the model.

### Phase 1: completion-claims-improvements

The sentinel's claim detector reads only the closing 160 characters, filters claim words used in a quoted, negated or future context, and counts `complete` as a claim word. The audit scorer refuses duplicate row and label IDs, attributes a missed claim only to a whole claim word, prints every detector arm's counts, states its pre-registered 0.70 judge threshold, gains `--holdout` and `--one-call`, and carries a cost clause in its keep rule. Cursor's `afterAgentResponse` event now runs the completion adapter, registered in `hook-registry.json` and rendered into `.cursor/hooks.json`. The completion README and the injection contract both say Pi's advisory reaches the model hidden, on the next turn.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/hooks/lib/completion-evidence-sentinel.cjs` | Modified | Closing-window anchor, context filters, `complete` |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts` | Modified | Detector boundaries, filters, Cursor wiring, Pi doc agreement |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/score-completion-claims.mjs` | Modified | Arm counts, duplicate IDs, attribution, threshold, holdout, cost, one-call arm |
| `.skilled/skills/system-spec-kit/runtime/scripts/completion-claim-audit/README.md` | Modified | Threshold, holdout, one-call and cost documented |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit.vitest.ts` | Modified | Cases for the scorer repairs |
| `.skilled/skills/system-spec-kit/runtime/tests/completion-claim-audit-fixtures/labels-happy-rows.jsonl` | Modified | Corrected positive examples |
| `.skilled/skills/system-spec-kit/runtime/cli/runtime-mirrors/hook-registry.json` | Modified | Cursor binding for the completion adapter |
| `.cursor/hooks.json` | Regenerated | Rendered from the registry |
| `.cursor/hooks/completion-evidence-response.mjs` | Created | Runtime mirror symlink to the Cursor adapter |
| `.skilled/skills/system-spec-kit/runtime/hooks/cursor/README.md` | Modified | afterAgentResponse listed as wired, delivery unverified |
| `.skilled/hooks/completion/README.md` | Modified | Pi advisory is model-visible on the next turn |
| `.skilled/hooks/injection-contract.md` | Modified | Sentinel section names Pi's next-turn advisory |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max fast built it on cli-codex over three dispatches: the first stopped at the usage limit, the second halted on an R9 scope conflict the session ruled on, the third built every item. DeepSeek V4.1 Flash max reviewed it on cli-pi and found a P0 (the Cursor wiring was hand-edited into a generated file) and a P1 (the README half of REQ-004). A Luna fix dispatch moved the wiring into the registry and wrote the README. The session reran the census offline and the mirror checks.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The Pi adapter is the truth for R9 | It sends a `display:false` message delivered next turn, so the docs were brought to it rather than the reverse |
| Wire Cursor through the hook registry | `.cursor/hooks.json` is rendered output; the registry adds the drift-marker fallback every Cursor hook carries |
| Ship the shipped arm, not the widest catcher | The `complete` arm catches 3 but keeps 7 false fires; the shipped arm catches 1 with 0, and the spec caps false fires at today's 7 |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run` on sentinel, audit and hook-adapter-path-parity suites | 175 passed (sentinel and audit baseline 46) |
| Census, `score-completion-claims.mjs --rows ~/.skilled/.labels/026-rows.jsonl --labels ~/.skilled/.labels/026-labels-047.jsonl` | exit 0: today 0 caught 7 false, complete 3/7, anchor 0/3, both 1/3, shipped 1 caught 0 false |
| `sync-hook-registrations.cjs --check` and `sync-runtime-mirrors.cjs --check` | PASS: 4 registration files match the 30-hook registry; 171 mirrors across 8 trees in sync |
| `validate_document.py` on the four changed docs | exit 0 each |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **One catch of ten.** The shipped detector catches 1 of the 10 labeled claims. The `complete` arm catches 3 but at 7 false fires, so a wider catch needs a better filter or the Jev judge, which stays off by default.
2. **Cursor delivery unverified.** `afterAgentResponse` is wired but its delivery was not probed live, as the Cursor README now says.
<!-- /ANCHOR:limitations -->

---


