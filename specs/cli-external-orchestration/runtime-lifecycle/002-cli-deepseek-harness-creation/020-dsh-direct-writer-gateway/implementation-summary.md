---
title: "Implementation Summary"
description: "Planned, not started. The packet will route the dispatch failure row, the receipt write failure row and the post-dispatch executor audit through the append gateway, so they survive a ledger-backed state log's refresh."
trigger_phrases:
  - "dsh direct writer gateway implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/020-dsh-direct-writer-gateway"
    last_updated_at: "2026-11-14T22:20:26Z"
    last_updated_by: "template-author"
    recent_action: "Planned the packet"
    next_safe_action: "Answer the open questions in spec.md section 7, then start T001"
    blockers: []
    key_files:
      - "spec.md"
      - "plan.md"
      - "tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-020-dsh-direct-writer-gateway"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 020-dsh-direct-writer-gateway |
| **Completed** | 2026-11-15 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A failed dispatch, a lost receipt and the post-dispatch executor record now survive a state log refresh in review and research. The CLI entrypoints no longer crash on a non-blocking stdin, and every deep loop save writes continuity. The release is `system-deep-loop` v1.6.28.0.

### Phase 20: dsh-direct-writer-gateway

A deep review or deep research run whose state log sits beside a ledger loses a failed dispatch, a lost receipt and the post-dispatch executor record at the next refresh. You chose to route all three through the append gateway, the way phase 019 routed the pre-dispatch executor row.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/lib/deep-loop/executor-audit.ts` | Modified | Session id on the runner input, the failure row helper, both failure writers and the audit's ledger branch |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Modified | The review gateway takes the two failure rows |
| The five research schema, projection and reducer files named in `spec.md` section 3 | Modified | Two new research stems carried field for field |
| `.skilled/commands/deep/assets/` review, research and AI Council workflows, auto and confirm | Modified | Session id on every audited call, the audit call and the full-auto save |
| `.skilled/commands/deep/assets/compiled/` three contracts | Regenerated | They pin each workflow's digest |
| `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs`, `upsert.cjs`, `status.cjs`, `query.cjs`, `convergence.cjs` | Modified | Stdin is read only for `upsert --events -`, retrying on EAGAIN |
| `.skilled/skills/system-deep-loop/deep-research/feature-catalog/loop-lifecycle/memory-save.md` | Modified | The save command and its fields |
| Three test files modified and two created, named in `spec.md` section 3 | Modified, Created | Survival, round-trip, census, stdin and save tests |
| `.skilled/skills/system-deep-loop/changelog/v1.6.28.0.md` and four version fields | Created, Modified | The release |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The plan's count script found all 43 search texts on origin/main `23f6583b89` and applied them, and the E15 script added the session id to 16 runner calls. The two faults from the 019 live review were added to the scope on 2026-11-14 and fixed at their source: the shared bootstrap pattern in four entrypoints, and the save step in six workflows. Each new test was run against the old code first and failed there.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Review reuses `deep_review.iteration_recorded` | Its schema and projection already carry any record whole |
| Research gets two new stems | No existing research stem carries the reason, the detail and the marker |
| The audit lands on the opening row | An append-only ledger cannot carry an edit to a row it already holds |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Named suites | PASS. `85 passed (85)` up from 78, and `62 passed (62)` up from 60 |
| Fail first | PASS. The survival file printed `6 failed \| 4 passed (10)` on the old sources, the stdin file 2 of 3 failed and the save file 10 of 10 failed |
| Receipt, dispatch failure and reducer tests | PASS. `55 passed (55)` |
| Stem census and append checks | PASS. `"registered":88`, `"reserved":65`, and every check `"ok":true` |
| Contract drift and typecheck | PASS. `[CONTRACT DRIFT] OK commands=3`, typecheck exit 0 |
| Full deep-loop suite | PASS. `Tests  2929 passed \| 8 skipped (2937)` in 176 files, the planned 2916 plus the 13 stdin and save tests |
| Trial saves | The old payload with `--full-auto` wrote no continuity. The payload with the four fields wrote it to `implementation-summary.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Three other writers still lose their rows.** `verification_degraded`, `containment_violation` and `containment_contested` write straight into the state log too. They wait for a later phase.
2. **`upsert --events -` waits for its input.** A caller that passes `-` and never closes stdin keeps the command waiting, as any reader of stdin does.
<!-- /ANCHOR:limitations -->

---
