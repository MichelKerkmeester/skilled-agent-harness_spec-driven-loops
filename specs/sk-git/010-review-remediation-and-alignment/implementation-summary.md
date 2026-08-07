---
title: "Implementation Summary: sk-git Review Remediation and sk-code Alignment"
description: "Closeout: every confirmed SOL-review finding is fixed RED-first and independently verified (session/reaper/pre-push via LUNA, the allocator race fixed by the orchestrator after two LUNA rounds), the sourceable shell aligns with sk-code, the 002 over-claims are reconciled, and the affected READMEs are refreshed; harnesses green and packet validate Errors 0."
trigger_phrases:
  - "sk-git remediation summary"
  - "worktree tooling hardening closeout"
  - "sk-git sk-code alignment closeout"
importance_tier: "critical"
contextType: "implementation"
status: "complete"
_memory:
  continuity:
    packet_pointer: "sk-git/010-review-remediation-and-alignment"
    last_updated_at: "2026-07-15T04:22:47Z"
    last_updated_by: "claude"
    recent_action: "Fixes verified; 002 reconciled; packet complete"
    next_safe_action: "Commit packet 003 (scoped)"
    blockers: []
    key_files:
      - "implementation-summary.md"
      - "spec.md"
      - "plan.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "sk-git-review-remediation"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Summary: sk-git Review Remediation and sk-code Alignment

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Packet** | `sk-git/010-review-remediation-and-alignment` |
| **Level** | 3 (multi-file safety-critical remediation + tooling alignment) |
| **Status** | Complete |
| **Updated** | 2026-07-14 |
| **Branch** | `skilled/v4.0.0.0` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

### Delivered now

- **Packet charter**: `spec.md` / `plan.md` / `tasks.md` / `checklist.md` / `decision-record.md` framing the remediation, with each confirmed SOL finding mapped to a file group and a RED-first test.
- **Finding inventory**: 2 P0 (shared-path traversal in `worktree-session.sh`; the Phase-5 doc-overclaim) + ~9 P1 + P2, each re-verified against source.

### Delivered

- **Session (`worktree-session.sh`)** — shared-path `..`/absolute rejection + canonicalized containment + `rm --`; reason `shift` so the child exec is exactly `$RUNTIME "$@"`; runtime id split from the executable path and grammar-restricted. New hermetic session test (`worktree-session.test.sh` 15/15).
- **Reaper (`worktree-reaper.sh`)** — whole-file PID-grammar marker (ambiguity → keep); exact `work/<runtime>/<slug>` pair match against the directory basename; `--reap-daemons` path-existence + PID recheck before signal. Harness 15/15.
- **Allocator + pre-push (`worktree-naming.sh`, `pre-push`)** — race-safe lock via atomic rename-steal (N stale-lock contenders → N distinct; 100/100 clean); atomic persist-or-abort; owners from version-controlled `SKILL.md` only; `0001..9999` + exact `.worktrees/<pair>` bounds; guarded sourceable strict-mode; pre-push tri-state fail-open. Harnesses 43 + 12.
- **Docs** — 002 over-claims reconciled (safety-contract rows point here; Phase-5 wording → reachability-based; 30→31); `.opencode/bin/README.md` + git-hooks README refreshed; `changelog/v1.3.1.0.md` + SKILL `version: 1.3.1.0`.

### Allocator race — resolution note

The allocator stale-lock race resisted two GPT-5.6-LUNA rounds: the first cut the collapse from ~16→2 distinct down to a single duplicate (~10-15% of runs), and its 10-run self-gate passed by luck. Independent 30-run characterization reproduced the residual race (always the `stale-lock concurrent allocs distinct` assertion). The orchestrator root-caused it to a non-mutex recovery marker (`recover.$$.$RANDOM` — a per-process unique name lets multiple contenders both `rm -rf` the lock dir) and, under operator approval, applied the final fix directly (atomic rename-steal, discard-not-reinsert). Proven with a 100-run clean determinism gate.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

1. Ran a GPT-5.6-SOL (max/fast) adversarial review of the 002 worktree tooling; verdict DO-NOT-SHIP.
2. Independently re-verified each finding against source (file:line + reproduction), and classified the Phase-5 P0 as a doc-overclaim (disputed OIDs reachable), not data loss.
3. Framed this remediation packet (Level 3) with a per-file defect map and RED-first discipline.
4. GPT-5.6-LUNA (xhigh/fast) applied the per-file fixes; the orchestrator independently re-verified each — re-running the reproductions rather than trusting self-reports, which caught a false `43/0` allocator claim — fixed the residual allocator race directly under operator approval, reconciled the 002 docs, and committed.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Where | Summary |
|----------|-------|---------|
| New sibling packet, not a 002 reopen | ADR-001 | 002 stays the ship record; 003 owns the fixes |
| Parallel per-file LUNA execution | ADR-002 | Three disjoint dispatches; orchestrator commits |
| RED-first regression discipline | ADR-003 | Reproduce → fix → keep the reproduction as a test |
| Phase-5 P0 is a doc-overclaim | ADR-004 | No data loss; reword the claim, no recovery op |
| Sourceable strict-mode alignment | ADR-005 | Guarded execution-path strict mode |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

- **Harnesses**: session 15/15, reaper 15/15, pre-push 12/12, naming 43/43; allocator 100/100 clean sequential determinism runs; `bash -n` clean on all four scripts.
- **Alignment**: sk-code OPENCODE/SHELL `verify_alignment_drift.py` — 0 findings on the four production scripts (2 pre-existing out-of-scope lib ERRORs; 2 tally-style test-harness WARNs, accepted exemption).
- **Adversarial re-verify**: each SOL reproduction encoded as a now-passing RED-first regression case.
- **Structural**: `package_skill.py --check` PASS; `validate.sh --strict` on this packet Errors 0; metadata regenerated last.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

- **Test-harness strict-mode WARNs**: the two tally-style harnesses (`worktree-naming.test.sh`, `pre-push.test.sh`) carry advisory sk-code SH-STRICT-MODE warnings — they intentionally omit `set -e` so every assertion runs and tallies, an accepted exemption (extends ADR-005's sourceable-script reasoning).
- **Two out-of-scope lib ERRORs**: the alignment scan flags `.opencode/scripts/git-hooks/lib/autostash-orphan-guard.sh` and `memory-drift-marker.sh` for missing strict mode; these are pre-existing siblings this packet does not touch (SCOPE LOCK).
<!-- /ANCHOR:limitations -->
