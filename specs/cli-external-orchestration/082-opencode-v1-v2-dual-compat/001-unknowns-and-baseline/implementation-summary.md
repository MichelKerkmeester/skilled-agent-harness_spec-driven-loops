---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "unknowns and baseline implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/082-opencode-v1-v2-dual-compat/001-unknowns-and-baseline"
    last_updated_at: "2026-10-18T12:45:01Z"
    last_updated_by: "template-author"
    recent_action: "Closed phase 1 with findings and baseline"
    next_safe_action: "Start phase 2 from baseline.json"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-001-unknowns-and-baseline"
      parent_session_id: null
    completion_pct: 0
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
| **Spec Folder** | 001-unknowns-and-baseline |
| **Status** | Complete |
| **Completed** | 2026-10-18 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase settled the eleven open questions and recorded where every plugin stands on each OpenCode version before any code changed. All 16 plugins load on v1 1.19.3. None loads on v2 2.0.32, because v2 rejects a default export that is a plain function.

### Phase 1: unknowns-and-baseline

The probes ran on DeepSeek V4.1 Flash through cli-devin, and the orchestrator reran the claims the build depends on. Two research assumptions did not hold. v1 1.19.3 logs no plugin line, so the v1 load check is now a harness that calls each plugin's v1 entry. A worktree inside a checkout also makes v2 load the parent checkout's plugins, so every v2 count filters by path.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `findings.md` | Created | One verdict per question Q1 to Q11, with its command, its capture and nine decision changes for the parent. |
| `baseline.json` | Created | Load state of each plugin on v1 and v2, and the suite pass and fail counts. |
| `scratch/v1-harness.mjs` | Created | Loads each plugin the way v1 does, for this baseline and later phases. |
| `scratch/` captures | Created | The command output every verdict cites. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Two DeepSeek dispatches ran the probes in parallel. The first baseline dispatch stopped after reading and wrote nothing, so it was re-dispatched with explicit commands and a rule that every message makes a tool call. The orchestrator ran the suite baselines, the v1 oracle probes and the harness itself. GPT-6 Luna reviewed the findings against the captures, read only, and asked for two evidence fixes and five narrower claims. The orchestrator reran Q7 with the real zod output and recorded the private-server run with provenance, then narrowed the five claims.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The v1 load check is a harness plus `debug config` discovery plus private-serve tool ids | v1 1.19.3 logs no plugin line at INFO or DEBUG level, so the research's log oracle does not exist |
| v2 counts filter `/api/plugin` by source path | A worktree inside a checkout also loads the parent checkout's 16 plugins |
| A private `opencode2 serve` is the check server | It reports the same plugin state as the shared service and never touches it |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Strict validation of this folder with `validate.sh --strict` | `RESULT: PASSED`, 0 errors, 0 warnings |
| Verdict reruns by the orchestrator (T023) | Rerun for Q3, Q7, Q11 and decision changes 1 to 3. The other verdicts were checked against their captures by the Luna review, not rerun. |
| Cross-family review (T022) | Luna review: 2 P1 and 5 P2 findings, all addressed in findings.md |
| Scope check (T025) | No path from this phase outside the folder, except the sk-vision build artifact |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Live event delivery is unproven.** `session.idle` and `session.compacted` delivery stays unknown, because a model-free run ends in `session.execution.failed`. Phase 3 proves it with one short real-model run each.
2. **Hook-only plugins have no host-level v1 check.** v1 offers no oracle for the 13 plugins that register only hooks, so their v1 check is the harness.
3. **Q1 stays unknown.** Whether `allowed-tools` restricts anything needs a real model run on each version.
<!-- /ANCHOR:limitations -->

---

