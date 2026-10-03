---
title: "Implementation Summary"
description: "A deep-research fan-out now runs through the faults 048 hit without manual repair."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-jev/003-cli-jev-workflow-integration/049-jev-feature-improvement-build/012-fanout-runner-and-prompt-fixes"
    last_updated_at: "2026-10-03T12:00:00Z"
    last_updated_by: "claude-opus-5-5-049"
    recent_action: "Built, reviewed and verified the phase"
    next_safe_action: "None. The phase is Complete"
    blockers: []
    key_files:
      - ".skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs"
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
| **Spec Folder** | 012-fanout-runner-and-prompt-fixes |
| **Completed** | 2026-10-03 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A deep-research fan-out now runs through the faults 048 hit without manual repair. The merge keeps every finding a lineage writes, a lineage stopped by a gateway projection refusal fails once instead of retrying six times, and every lineage gets its directory as an absolute path.

### Phase 1: fanout-runner-and-prompt-fixes

`fanout-merge.cjs` reads a delta finding's text from `claim` and `summary` as well, and warns with the file and row when a finding has no readable text. The iteration prompt pack tells a lineage to put finding text in `label`, to record a contradiction and keep going because no operator is present, and to write at the exact lineage path it is given. On a projection refresh failure, `append-mode-event.cjs` writes a record to `gateway-refusals.jsonl` in the run directory. When a lineage fails, `fanout-run.cjs` reads a record from that attempt and `cli-guards.cjs` classifies the failure as a fatal `projection_refusal`, while a failure without one still retries as `salvage_miss`. The runner resolves the lineage directory to an absolute path for the prompt and the native command, and the pool's failure rollup now counts `artifact_miss`.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs` | Modified | Read `claim` and `summary`, warn on unreadable rows |
| `.skilled/skills/system-deep-loop/deep-research/assets/prompt-pack-iteration.md.tmpl` | Modified | Label field, contradiction rule, verbatim lineage-path rule |
| `.skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs` | Modified | Refusal record in the run directory on a projection failure |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` | Modified | Read the attempt's refusal record, absolute lineage directory for prompt and native command |
| `.skilled/skills/system-deep-loop/runtime/scripts/lib/cli-guards.cjs` | Modified | Fatal `projection_refusal` class |
| `.skilled/skills/system-deep-loop/runtime/scripts/fanout-pool.cjs` | Modified | Rollup counts `projection_refusal` and `artifact_miss` |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-merge.vitest.ts` | Modified | `claim` rows and the unreadable-row warning |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/prompt-pack.vitest.ts` | Modified | Render assertions for the three instructions |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/append-mode-event-cli.vitest.ts` | Modified | One refusal record on a projection failure, none on success |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-run.vitest.ts` | Modified | One attempt on a refusal record, salvage retry without one, absolute native path |
| `.skilled/skills/system-deep-loop/runtime/tests/unit/fanout-pool.vitest.ts` | Modified | Refusal class and rollup |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

DeepSeek V4.1 Flash max built the merge and prompt parts on cli-pi, and a Luna 6 max fast review on cli-codex moved the absolute path into the runner. Luna built the runner part, keeping clear of the 040 session's uncommitted lines in `fanout-run.cjs`. A DeepSeek review found a P1: the refusal check read an error object a real lineage failure never carries, so the 048 fault would still retry. Luna moved the signal to a refusal record the gateway writes in the lineage directory, and a DeepSeek re-review traced the real path end to end and found no P0 or P1.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Carry the refusal on disk | The refusal happens inside the lineage subprocess, so only a file in the lineage directory reaches the runner; the gateway's stdout and exit code stay unchanged |
| Edit beside the 040 change, not after it | 040's uncommitted edit touches only the Pi model allowlist and command builder, so both changes merge cleanly |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `npx vitest run` on fanout-run, fanout-pool, cli-guards-writer-lock, append-mode-event-cli, fanout-merge, prompt-pack and deep-research-run-open | 309 passed |
| Re-merge of 048/008 from the original delta rows | 53 findings and closeout exit 0; HEAD merge 26 findings, closeout exit 2 |
| DeepSeek re-review | No P0 or P1; the refusal record lands where the runner reads it and earlier attempts' records are ignored |
| `validate.sh --strict` | RESULT: PASSED |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Review P2s recorded.** Detection is per attempt, so a lineage that continued past a refusal and later failed for another reason is still marked fatal. The attempt window rests on wall-clock order with no test for a late write from an orphaned gateway.
2. **Two load-sensitive tests predate this work.** `resumes a future checkpoint` and `lets the --containment-mode flag override` fail under a load average near 20 at HEAD and with these edits alike.
3. **Containment advisories stay noisy.** They cannot attribute a write on a shared checkout to its process.
<!-- /ANCHOR:limitations -->

---


