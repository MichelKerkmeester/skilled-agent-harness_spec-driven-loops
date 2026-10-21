---
title: "Implementation Summary"
description: "Leftover test runners, monitors, searches and executor workers no longer hide until memory runs short: /doctor:setup now counts them in one line, and a guarded reap stops them only when the operator confirms."
trigger_phrases:
  - "orphan process check implementation summary"
importance_tier: "normal"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/049-doctor-audit-followups/032-orphan-process-check"
    last_updated_at: "2026-10-21T13:00:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Shipped the orphan scan, the guarded reap and the doctor line; proved it on a live orphan"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files:
      - ".skilled/commands/doctor/scripts/orphan-process-check.cjs"
      - ".skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-032-orphan-process-check"
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
| **Spec Folder** | 032-orphan-process-check |
| **Completed** | 2026-10-21 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Helper processes that outlive their session are now visible. On 2026-10-21 a cleanup by hand found 22 of them holding about 315 MB, and nothing in the doctor commands had listed them.

### Phase 32: orphan-process-check

`orphan-process-check.cjs` reads the process table once and lists your processes that have parent PID 1 and are older than 60 minutes, when they match a known helper: `node --test`, vitest, `tail -f`, a recursive `grep` or `rg`, a session-relaunch test helper, a `pi`, `codex exec` or `devin -p` worker, or an advisor launcher, model server or `git-live-follow` whose checkout no longer exists. Daemons whose paths still exist, `opencode serve`, the Codex app server, shells, editors and apps are never listed. (Phase 033 later lists a model server with parent PID 1 even when its checkout exists, because its launcher has died.) `/doctor:setup` shows the line `--summary` prints: the count, the size and the command that lists them. `--reap` lists; it signals only with `--yes`, re-reads each process's command, age and owner first, sends SIGTERM and never SIGKILL. Every `ps` call runs in the C locale, so the check reads the same on any system language.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.skilled/commands/doctor/scripts/orphan-process-check.cjs` | Created | Scan, classify, `--json`, `--summary`, guarded `--reap` |
| `.skilled/commands/doctor/scripts/tests/orphan-process-check.test.cjs` | Created | 15 fixture and reap-guard tests |
| `.skilled/commands/doctor/scripts/tests/doctor-setup-orphan-line.test.cjs` | Created | Contract test for the doctor step and line |
| `.skilled/commands/doctor/assets/doctor-setup.yaml` | Modified | Informational orphan step |
| `.skilled/commands/doctor/assets/doctor-setup-presentation.txt` | Modified | The orphan line |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

GPT-6 Luna at max effort built the script, the tests and the doctor assets in worktree 189; its sandbox blocked `ps`, so the orchestrator ran every live check. The tests pass on fixture rows for each helper kind. On this machine a deliberately orphaned `tail -F /dev/null` was listed as `tail-monitor`; `--reap` without `--yes` left it running and `--reap --yes` killed it. The default scan then listed none, in 0.13 s.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| A representative fixture instead of the 2026-10-21 table (ADR-001) | That table was never saved as raw `ps` output |
| `/doctor:setup` reports and the operator reaps (ADR-002) | A health report should not stop processes |
| One 60-minute threshold with `--min-age-min` | A per-kind threshold adds settings no case has needed yet |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check orphan-process-check.cjs` | PASS |
| `node --test` on the two new test files | PASS, 16 of 16 |
| Mutation check: disable the age guard, then the uid guard | Each fails one test |
| Doctor suite (`node --test .skilled/commands/doctor/scripts/tests/*.test.cjs`) | PASS, 422 of 422 (406 before plus 16) |
| Live orphan: detect, `--reap` without `--yes`, `--reap --yes` | PASS: listed, left running, killed; killed again under `LC_ALL=fr_FR.UTF-8` |
| Fresh DeepSeek v4.1 Flash review | CONDITIONAL, 4 P1 and 7 P2; P1s fixed, P2s fixed or recorded below |
| Default scan on this machine | `orphans: none`, 0.13 s |
| Drift guards | PASS, warnings pre-existing |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Pattern-based.** A helper kind not in the classifier is never listed; add it with a fixture row.
2. **One user only.** Another user's orphans are out of scope by design.
3. **Relative script paths.** A launcher or model server started with a relative script path cannot be tied to a checkout from its command line, so it is never reported as stale.
4. **Children of a reaped worker.** Only listed processes are signalled. A worker's child that matches no helper kind is reparented to PID 1 after the reap and stays unlisted.
5. **A sub-millisecond signal window.** The command, age and owner are re-read just before SIGTERM, but a PID recycled between that read and the signal would receive it. Node on macOS offers no way to close that window.
<!-- /ANCHOR:limitations -->

---


