---
title: "Implementation Summary"
description: "The doctor orphan check now lists a model server whose launcher died, the most expensive orphan at about 470 MB, even when its checkout still exists."
trigger_phrases:
  - "orphan check unsupervised model server implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/033-orphan-check-unsupervised-model-server"
    last_updated_at: "2026-10-21T14:17:19Z"
    last_updated_by: "orchestrator"
    recent_action: "Shipped the unsupervised model server kind and the review fixes"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/orphan-process-check.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-033-orphan-check-unsupervised-model-server"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 033-orphan-check-unsupervised-model-server |
| **Completed** | 2026-10-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A model server is always a child of its launcher, so one with parent PID 1 has lost its launcher. The orphan check used to list such a server only when its checkout was gone, which hid the most expensive orphan.

### Phase 33: orphan-check-unsupervised-model-server

A node process running `hf-model-server.cjs` among the scan's parent-PID-1 rows is now `unsupervised-model-server` when its checkout exists or cannot be resolved, and `stale-model-server` when the checkout is gone. Advisor launchers and `git-live-follow` keep their rules. The script path is read up to the first script-shaped token, so checkout paths with spaces and node flags before the script are handled. The kind column now sizes itself to the longest kind.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/orphan-process-check.cjs` | Modified | The new kind, the script-path gate, the column width |
| `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs` | Modified | Model server fixtures and a column test |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modified | Do not reap a model server kept on purpose |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna at max effort built the kind. A fresh DeepSeek v4.1 Flash review returned CONDITIONAL: the first gate read the script from the second whitespace token, so a checkout path with a space was missed and lost its old `stale-model-server` report. Luna replaced the gate and widened the column; the orchestrator ran the four shapes by hand, removed the branch and saw two tests fail, and listed a real orphaned model server live.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Parent PID 1 alone marks a model server unsupervised | Its launcher is its parent; the scan only sees parent-PID-1 rows |
| No code check for `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` | It would need the launcher's environment; the doctor note says not to reap such a server |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Orphan and doctor-line tests | PASS, 17 of 17 |
| Doctor suite | PASS, 423 of 423 |
| Mutation: remove the unsupervised branch | Two tests fail |
| Live: real orphaned model server | Listed as `unsupervised-model-server`, 567 MB |
| Fresh DeepSeek v4.1 Flash review | CONDITIONAL; the P1 and four P2s fixed |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **A model server kept on purpose is listed too.** With `SPECKIT_HF_MODEL_SERVER_ORPHAN_REAP=0` a healthy server can sit at parent PID 1; the doctor note says not to reap it.
<!-- /ANCHOR:limitations -->

---


