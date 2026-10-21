---
title: "Implementation Summary"
description: "The advisor launcher stays a separate process: it is the only thing that stops the model server and clears the leases when the advisor server crashes, and that is worth more than the 50 MB a merge would save."
trigger_phrases:
  - "lighter advisor launcher implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-skill-advisor/037-advisor-daemon-memory/002-lighter-advisor-launcher"
    last_updated_at: "2026-10-21T14:30:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Measured, mapped the launcher, recorded the no-go"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/bin/system-skill-advisor-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-002-lighter-advisor-launcher"
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
| **Spec Folder** | 002-lighter-advisor-launcher |
| **Completed** | 2026-10-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

No code changed. This phase answered whether each checkout could run one advisor process instead of two, and the answer is no, for now.

### Phase 2: lighter-advisor-launcher

A launcher measures 53 to 57 MB and a bare Node process 47 to 50 MB, so the only real saving was removing the launcher process, about 50 MB per checkout. The launcher's map showed why it stays: when the advisor server exits, including after a SIGKILL or an out-of-memory crash, the launcher stops the model server and clears the leases (`.skilled/bin/system-skill-advisor-launcher.cjs:1436`). In one combined process that cleanup dies with the crash, and the model server keeps about 470 MB loaded with no owner. The review also found that today a launcher that dies already leaves its model server loaded with no owner. The decision record names two changes that would remove the reason for the no-go; the cheaper one, reaping an orphaned model server when the next supervisor starts, would fix that existing leak too.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `decision-record.md` (this folder) | Created | The measurements, the launcher job map, the no-go and the two reopen paths |
| `spec.md`, `tasks.md`, `acceptance-criteria.md` (this folder) | Modified | Closed on the no-go |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The orchestrator measured the processes live. GPT-6 Luna at max effort, in a read-only sandbox, mapped every launcher job, recovery path and caller with file:line. Its first dispatch returned nothing usable, because the inlined persona forbade the shell that Codex reads files with; the second, with an explicit tool mapping, produced the map. The orchestrator then checked the deciding lines itself: the child `exit` handler at `system-skill-advisor-launcher.cjs:1436`, and that `hf-model-server.cjs` never checks its parent.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| No-go on merging the launcher into the advisor server (ADR-001) | A crash of the single process would leave the model server loaded with no owner |
| Build criteria superseded (ADR-002) | They only apply after a go |
| Two reopen paths are named, not built | Each changes model-server ownership and needs its own phase |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Live RSS: launchers, advisor servers, bare Node | 53 to 57 MB, 66 to 103 MB, 47 to 50 MB |
| Deciding lines checked by the orchestrator | `system-skill-advisor-launcher.cjs:1436` cleans up on child exit; `hf-model-server.cjs` has no parent check |
| Code changed | None |
| Fresh DeepSeek v4.1 Flash review | Decision upheld; four record fixes (crash paths, the cheaper reopen path, the job map, completion metadata) and four minor ones, all applied |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The 50 MB per checkout stays.** Each checkout that runs an advisor keeps two Node processes.
2. **The recommendation is one model's map.** The orchestrator checked the deciding lines, not every line of the map.
<!-- /ANCHOR:limitations -->

---


