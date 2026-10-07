---
title: "Implementation Summary"
description: "The track-narrowing scorer now pins what it measured and can replay a recorded run exactly, and its first repeat run shows the 017 keep did not hold: on today's 270-row corpus Jev stops on margin, with a bootstrap interval that spans zero.."
trigger_phrases:
  - "track narrowing improvements implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/002-track-narrowing-improvements"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs"
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
| **Spec Folder** | 002-track-narrowing-improvements |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The track-narrowing scorer now pins what it measured and can replay a recorded run exactly, and its first repeat run shows the 017 keep did not hold: on today's 270-row corpus Jev stops on margin, with a bootstrap interval that spans zero.

### Phase 1: track-narrowing-improvements

`score-track-narrowing.mjs` asks Jev which spec track a prompt belongs to. Its report now pins the row-set digest and the model tuple, and a second run into an `--out` directory that already holds a run is refused with exit 2. It reports a probability-aware arm with decided-subset accuracy and margin slack, a one-call arm, a shortlist arm marked unmeasured, a per-track confusion and abstention table, and a cluster-aware bootstrap interval. `--replay <calls.jsonl>` scores exactly the rows a recording holds and reports any row it has to drop.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-spec-kit/runtime/cli/retrieval/score-track-narrowing.mjs` | Modified | Pins, --out guard, probability-aware and one-call arms, per-track table, bootstrap, exact replay |
| `.skilled/skills/system-spec-kit/runtime/cli/tests/score-track-narrowing.vitest.ts` | Modified | Cases for each behavior, including a corpus with rows beyond the recording |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Luna 6 max fast built it on cli-codex. DeepSeek V4.1 Flash max reviewed it on cli-pi: no P0, a P1 that `--replay` scored today's corpus rather than the recording (K=270 M=246 against the recorded K=256 M=256), and the repeat run. A Luna fix dispatch rebuilt the replay from the recording; it hit the dispatcher's hour limit after its edits, and the session confirmed the replay and the suite. The session then ran the live repeat.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Replay the recording's own rows | A replay that rescored today's corpus could not reproduce the line it claims to replay |
| Report the shortlist arm as unmeasured | The saved calls asked full option lists, so no shortlist answer exists to score; inventing one would be a guess |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run --project cli tests/score-track-narrowing.vitest.ts` | 29 passed (baseline 26) |
| Replay of 017's recorded run `jev-live-1/out/calls.jsonl` | report K=256 M=256 A=97, 0 rows dropped: matches the recorded `verdict jev: keep K=256 M=256 A=97` |
| Live repeat, `score-track-narrowing.mjs --jev --out ~/.skilled/.labels/runs/049-002-jev-20261003` | exit 0 in 2,093 s, 852 calls: `verdict jev: stop (margin) K=270 M=270 A=106 B=82 W=80 L=56 F=48 p=0.02409`; bootstrap `accuracy_delta_95_ci=[-0.1185,0.2760] clusters=16` |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 017 keep did not repeat.** On today's corpus the baseline rose from 68 to 82 right and Jev's lead fell under the 0.10 margin; the bootstrap interval includes zero. The recorded 017 verdict stays on record and this repeat sits beside it.
2. **Shortlist arm unmeasured.** Measuring it needs a run that asks shortlists.
3. **Review P2s recorded.** The shortlist reason text is fixed, a vestigial `requalify` field remains, per-track `measured` skips unstable rows, and one bootstrap assertion is weak.
<!-- /ANCHOR:limitations -->

---


