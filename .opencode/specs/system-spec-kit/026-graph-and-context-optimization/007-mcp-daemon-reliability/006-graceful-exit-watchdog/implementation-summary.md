---
title: "Implementation Summary: Launcher RSS-ceiling watchdog + graceful-exit supervision (F1′)"
description: "Implementation pending. This packet is the implementation-ready, Opus-verified spec for an RSS-ceiling watchdog with graceful-exit recovery, crash-loop-guarded supervision, and a child-pid lease."
trigger_phrases:
  - "launcher watchdog summary F1 pending"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/007-mcp-daemon-reliability/006-graceful-exit-watchdog"
    last_updated_at: "2026-05-28T21:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Spec/plan/tasks authored + Opus-verified; implementation deferred to live session"
    next_safe_action: "Confirm REQ-008 then implement T002-T005 + tests"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000614"
      session_id: "007-006-impl-summary"
      parent_session_id: null
    completion_pct: 50
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 006-graceful-exit-watchdog |
| **Completed** | Pending (spec ready; implementation deferred) |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is specified and adversarially verified, not yet implemented. When built, it gives the launcher a memory ceiling and a recovery path: instead of growing until the OS OOM-kills it (with no restart), the daemon recycles itself cleanly before the kernel acts.

### RSS watchdog + graceful-exit supervision (planned)

A periodic sampler will roll up the daemon's process-tree RSS — crucially including the **forked sidecar grandchild**, where the model actually lives under the default `auto` policy. On a sustained `SPECKIT_CONTEXT_SERVER_MAX_RSS_MB` breach the launcher SIGTERMs the child (with a grace longer than the daemon's own 5s shutdown deadline) and then **exits cleanly** so the host runtime relaunches a fresh launcher — a clean MCP re-initialize. It deliberately does NOT respawn the daemon in place: the adversarial pass showed re-piping stdio bytes cannot restore the per-Server MCP `initialize` session, so that would hang the client. Unexpected child exits are handled by a crash-loop-guarded supervisor with backoff, and the daemon child pid is recorded in the lease (the precondition for phase 007).

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| (none yet) | Pending | See spec.md §3 for the planned edit set |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Deferred to a live-daemon session: the RSS-breach recovery hinges on an unresolved host contract (does the runtime relaunch the launcher on clean exit 0? — REQ-008), and the guards need tests with an injectable ps runner plus live OOM/recycle observation. The design was produced by an Opus pass and adversarially verified by a second; the verdict corrected the child-pid-lease framing (it is a NET-NEW additive field, not a port of mk-code-index's separate owner-lease) and flagged the host-relaunch dependency, both now encoded (REQ-005, REQ-008).
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Graceful self-exit on breach, not transparent respawn | Re-piping stdio bytes cannot restore the MCP `initialize` session; clean exit + host relaunch re-initializes correctly |
| Sample the process TREE, not just the daemon child | Under default `auto` the dominant RSS is in the forked sidecar grandchild |
| `childPid` is a new additive lease field | The cited mk-code-index "precedent" is a separate owner-lease mechanism mk-spec-memory lacks; adding a field to the existing JSON is simpler and reader-safe |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Opus design + adversarial verification | PASS (verdict: ready=false until childPid-precedent corrected + host-relaunch confirmed + test seam added — now encoded) |
| Planned test commands (when implemented) | `vitest` tree-RSS roll-up + crash-loop + EPERM-as-unknown tests; `bash .../validate.sh --strict` on this packet |
| Implementation + tests | Pending (live-daemon session) |
| Host relaunch-on-exit-0 contract (REQ-008) | Unconfirmed — gates default-on breach-self-exit |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Not implemented** — spec/plan/tasks only. Confirm REQ-008, then implement T002-T005 + tests.
2. **RSS-breach self-exit is unsafe to enable by default** until the host relaunch contract is confirmed (else it reduces availability). Ships default-off.
<!-- /ANCHOR:limitations -->
