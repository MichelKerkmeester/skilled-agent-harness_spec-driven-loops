---
title: "Implementation Summary"
description: "Not started. The packet is a Draft, and no file for this phase has changed yet."
trigger_phrases:
  - "builtin runner implementation summary"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-code/015-quality-agnostic-gate/002-builtin-runner"
    last_updated_at: "2026-10-25T23:21:48Z"
    last_updated_by: "scaffold"
    recent_action: "Recorded the pre-implementation state"
    next_safe_action: "Land 001-honest-checker, then run the Setup tasks in tasks.md"
    blockers: ["001-honest-checker has not landed"]
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-builtin-runner"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.3 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 002-builtin-runner |
| **Status** | Draft |
| **Completed** | Not completed. The packet is a Draft |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Not started. No runner file exists yet, and Phase 1 has not landed, so this phase cannot begin its build.

### Phase 2: builtin-runner

The planned change is one Node runner, `quality-gate.cjs`, with a spawn module, declared hub checklists and the two proofs in `goal.md` section 3. The runner gives each change one verdict with an exit code, the state of each enforcement layer, the checklists that apply and an envelope. It runs built-in checks only, and it writes nothing to disk. Nothing has been built, so no user-visible behavior has changed.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| None yet | Not started | The planned file list is in `spec.md` section 3. Each row there is pending |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not delivered. The order of work is in `plan.md` section 4, and the tasks are in `tasks.md`. This section is written at close, after the goal criteria and the strict validator pass on the branch head.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Node runner over the Python hygiene engine (ADR-001) | The framework already runs Node. The engine that blocks stays one checker, so the gate and CI cannot disagree |
| Changed lines block, and touched-file findings block only with a whole-file layer (ADR-003) | A commit should fail on what it adds. The layers that scan whole files already fail on old comments |
| Five exit codes with a fixed precedence, and no pass value (ADR-004) | Exit 1 must not hide a usage error, and no output may read as a pass |
| `--config` waits for Phase 3 (ADR-010) | The config layer carries the trust boundary, so it lands with its own tests |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| The seven criteria in `goal.md` section 3 | Not run. Implementation has not started |
| Self-run on `check-comment-hygiene.sh` (AC-027) | Not run |
| Foreign smoke test on a temporary Go repository (AC-028) | Not run |
| Hub validators on `sk-code` (AC-029) | Not run |
| Strict validation of this folder (AC-031) | Not run. It runs at close, as task T043 |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Phase 1 has not landed.** This phase cannot pass F01 or F02, or the hygiene part of F03 to F05, until it does. The workaround is to wait, because the runner needs Phase 1's `--json` output.
2. **The version numbers follow Phase 1.** Phase 1 takes the packet to 1.5.0.0 and the hub to 3.1.0.0, so this phase takes the next minor of each. A different Phase 1 landing moves both targets with it.
3. **The dist adapter has no end-to-end fixture in this phase.** Phase 3 adds the first declared generated path, and its fixture belongs there.
4. **No repository config.** `--config` is rejected with exit 3 until Phase 3 (ADR-010). Repositories get the floor and the built-in checks only.
<!-- /ANCHOR:limitations -->

---
