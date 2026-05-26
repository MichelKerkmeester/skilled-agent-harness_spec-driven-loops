---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "The rerank sidecar launcher now forwards the approved reaper knobs, and the skill docs explain normal cleanup without operator guesswork."
trigger_phrases:
  - "rerank reaper env handoff"
  - "sidecar operator runbook"
  - "reaper integration smoke"
importance_tier: "important"
contextType: "handover"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/013-embedder-testing-and-architecture/009-memory-leak-remediation/019-fix-rerank-sidecar-accumulation-with-three-layer-reaper/004-implement-env-knobs-and-skill-docs"
    last_updated_at: "2026-05-23T08:00:00Z"
    last_updated_by: "codex"
    recent_action: "completed-rerank-reaper-env-docs"
    next_safe_action: "commit-or-review-diff"
    blockers: []
    key_files:
      - ".opencode/skills/system-rerank-sidecar/scripts/start.sh"
      - ".opencode/skills/system-rerank-sidecar/SKILL.md"
      - ".opencode/skills/system-rerank-sidecar/README.md"
    session_dedup:
      fingerprint: "sha256:0100050040000000000000000000000000000000000000000000000000000000"
      session_id: "010-005-004-rerank-reaper-env-docs"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "No commit requested; handoff includes suggested commit message only."
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 004-implement-env-knobs-and-skill-docs |
| **Completed** | 2026-05-23 |
| **Level** | 2 |
| **Status** | Complete |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The rerank sidecar launcher now forwards the approved reaper controls through the same scrubbed env boundary that protects the process from unrelated parent-shell state. Operators and future agents can now read the skill docs and understand that owner-death self-exit, idle timeout, and launcher pre-flight reap are the normal cleanup path.

### Launcher Env Knobs

`start.sh` now explicitly allowlists:

- `RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS`
- `RERANK_SIDECAR_REAPER_DISABLE`
- `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`
- `RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS`

The implementation reuses the existing `add_env_if_set` loop and keeps `exec env -i "${env_args[@]}"`, so unrelated env remains rejected at the process boundary.

### Operator And Skill Docs

`SKILL.md` now documents the three cleanup layers, the 45-second heartbeat, the 30-minute idle timeout, lifecycle telemetry, and `RERANK_SIDECAR_REAPER_DISABLE=1` for manual debugging. `README.md` adds operator-facing lifecycle guidance, an env table, telemetry override example, manual debug instructions, and a troubleshooting row for stale sidecars.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-rerank-sidecar/scripts/start.sh` | Modified | Added explicit reaper env knobs and knob comments. |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | Modified | Added reaper lifecycle/env docs and removed phase-history language. |
| `.opencode/skills/system-rerank-sidecar/README.md` | Modified | Added operator lifecycle, env, telemetry, debug, and troubleshooting docs. |
| `.opencode/specs/.../004-implement-env-knobs-and-skill-docs/` | Modified | Filled Level 2 packet docs, checklist, and handoff. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The work stayed inside the requested leaf scope. I read the predecessor reaper ADRs, confirmed the implementation packet's telemetry env name refinement to `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`, patched only the approved target files, and used static checks plus strict SpecKit validation to catch format drift.

### Integration Smoke Procedure

Manual post-merge runbook:

1. Spawn the sidecar via the launcher.
2. Note the sidecar PID and port from the ledger.
3. Kill the launcher's parent shell.
4. Wait `heartbeat_seconds + slack`, about 60 seconds with the default 45-second heartbeat.
5. Verify the sidecar PID no longer exists with `ps -p <pid>`.
6. Verify the telemetry JSONL contains a `reap` event with reason `all-owners-dead`.

Default telemetry path: `~/Library/Logs/spec-kit/sidecar-reaper.jsonl`. Override with `RERANK_SIDECAR_REAPER_TELEMETRY_PATH` before launch.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Add only four explicit reaper keys to `start.sh`. | This preserves the existing env-leak fix and avoids blanket parent-shell pass-through. |
| Use `RERANK_SIDECAR_REAPER_TELEMETRY_PATH`. | The completed app packet refined the earlier log-path name to separate lifecycle telemetry from request logs. |
| Document `RERANK_SIDECAR_REAPER_DISABLE=1` as manual debug only. | Normal operation should rely on owner-death cleanup, idle timeout, and pre-flight reap. |
| Remove phase-history language from modified public docs. | README and SKILL should describe current operator behavior, not packet history. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `bash -n .opencode/skills/system-rerank-sidecar/scripts/start.sh` | PASS |
| `wc -l .opencode/skills/system-rerank-sidecar/SKILL.md` | PASS, 340 LOC |
| `rg -n "RERANK_SIDECAR_REAPER_HEARTBEAT_SECONDS|RERANK_SIDECAR_REAPER_DISABLE|RERANK_SIDECAR_REAPER_TELEMETRY_PATH|RERANK_SIDECAR_IDLE_TIMEOUT_SECONDS" ...` | PASS, all four keys documented and forwarded |
| `timeout 8 bash .opencode/skills/system-rerank-sidecar/scripts/start.sh --help 2>&1 || true` | PASS for requested smoke wrapper; uvicorn started, hit sandbox bind error on `127.0.0.1:8765`, then shut down cleanly |
| `python3 .opencode/skills/sk-code/assets/scripts/verify_alignment_drift.py --root .opencode/skills/system-rerank-sidecar` | PASS |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <packet> --strict` | PASS after docs were filled |
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh <arc-005-parent> --strict` | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Integration smoke is a manual post-merge runbook.** The current sandbox blocks the local port bind during `start.sh --help`, so the owner-death telemetry check is documented for an operator environment with launcher access.
2. **No source behavior changed.** This packet wires shell env forwarding and docs only; app and launcher reaper behavior remains owned by completed implementation packets.

## Commit Handoff

Suggested commit:

```bash
git commit -m "docs(010/005/004): rerank reaper env knobs + SKILL.md + README.md + integration smoke runbook"
```

Expected stdout:

```text
PACKET-010-005-004 DONE: env+docs+smoke, strict-validate PASS (packet + arc parent), EXIT=0
```
<!-- /ANCHOR:limitations -->
