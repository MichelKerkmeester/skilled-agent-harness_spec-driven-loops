---
title: "Feature Specification: Daemon Lifecycle and Test-Harness Hardening"
description: "Phase parent for four production-observed failure classes in daemon supervision and the vitest harness, each traced to a safety mechanism that exists and is correct but is never reached at runtime."
trigger_phrases:
  - "daemon test harness hardening"
  - "daemon test harness hardening"
  - "orphaned launcher respawn lock"
  - "production db isolation bypass"
  - "vitest hang containment"
  - "live-follow log growth"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-system-speckit-v4/014-daemon-and-test-harness-hardening"
    last_updated_at: "2026-08-30T09:56:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored phase parent from a live zombie sweep; four phases scoped from observed evidence"
    next_safe_action: "Plan phase 001-production-db-isolation (highest severity)"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/vitest.config.ts"
      - ".opencode/bin/system-spec-memory-launcher.cjs"
      - ".opencode/bin/lib/model-server-supervision.cjs"
      - ".opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts"
      - ".opencode/bin/git-live-follow.sh"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-30-daemon-and-test-harness-hardening"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Should the process sweep apply path be operator-confirmed or autonomous at session start?"
    answered_questions:
      - "Phased over standard: level threshold met at L3 (79/100); phase score 30/50 on the corrected scope estimate that includes wiring the unwired sweep"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

<!-- SPECKIT_LEVEL: 2 -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  FORBIDDEN content (do NOT author at phase-parent level):
    - merge/migration/consolidation narratives (consolidate*, merged from, renamed from, collapsed, X→Y, reorganization history)
    - migrated from, ported from, originally in
    - heavy docs: plan.md, tasks.md, decision-record.md, implementation-summary.md — these belong in child phase folders only
  REQUIRED content (MUST author at phase-parent level):
    - Root purpose: what problem does this entire phased decomposition solve?
    - Sub-phase list: which child phase folders exist and what each one does
    - What needs done: the high-level outcome the phases work toward
-->

# Feature Specification: Daemon Lifecycle and Test-Harness Hardening

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Complete |
| **Created** | 2026-08-30 |
| **Branch** | `skilled/v4.0.0.0` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | system-speckit/033-system-speckit-v4/014-daemon-and-test-harness-hardening |
| **Predecessor** | `035-process-reaper-classification-fix` (classification fixed; never wired to an apply path) |
| **Successor** | None |
| **Handoff Criteria** | Each phase's guard is proven reachable at runtime by a negative control, not merely present in source |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement

A live process sweep on 2026-08-30 found 13 leaked processes attributable to this repository's system skills: three wedged vitest trees holding roughly 290% CPU for 2h35m–4h12m, and one orphaned spec-memory launcher alive at `ppid 1` for 2 days 14 hours. Investigating the four distinct root causes produced one shared finding.

**In three of the four cases the safety mechanism already exists, is already correct, and is never reached at runtime.**

- `tests/_support/vitest-setup.ts` isolates the production memory database — and the root vitest config that also globs `mcp-server/tests/**` declares no `setupFiles`, so one of the two entry points loads the guard and the other does not.
- `process-memory-harness.ts` already classifies an orphaned `system-spec-memory-launcher.cjs`, and its own fixture models a `ppid 1` launcher. `ops/README.md` records that `process-sweep.ts` "never sends signals" and that "no live apply command exists". Nothing in `.opencode/hooks/`, `.opencode/command/`, or the references tree invokes it.
- `shouldAbortRelaunchOnFire()` correctly returns true for a launcher reparented to init — but is consulted only on the relaunch path, which a launcher whose child is already dead never takes.

This is why predecessor packet `035` can be Complete and correct while the exact failure mode it describes still leaked for two and a half days.

### Purpose

Close the gap between a guard existing and a guard running. Each phase ends with a negative control that reproduces its failure and proves the guard now fires — presence in source is explicitly not the acceptance bar.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Production-database isolation reachable from every vitest entry point (phase 001)
- An apply path and lifecycle trigger for the existing orphan sweep, plus launcher self-exit (phase 002)
- A runtime bound and hang diagnosis for test invocations (phase 003)
- State-change logging and rotation for the live-follow follower (phase 004)

### Out of Scope
- Reducing the 12.9 GB `context-index.sqlite` or its equally sized `.bak` sibling — real, but a separate storage concern
- Changing what `process-sweep.ts` classifies; `035` settled classification and this packet does not revisit it
- The six `<defunct>` entries owned by the Figma agent — not repository-owned
- Retuning any test that is merely failing; only hangs are in scope

### Files to Change
Summary of aggregate file scope. Per-phase detail lives in each child plan.

| File Path | Change Type | Phase | Description |
|-----------|-------------|-------|-------------|
| `.opencode/skills/system-spec-kit/vitest.config.ts` | Modify | 001 | Share `setupFiles` or remove the second entry point |
| `.opencode/skills/system-spec-kit/shared/paths` resolver | Modify | 001 | Fail closed when a test run resolves the production database dir |
| `.opencode/bin/system-spec-memory-launcher.cjs` | Modify | 002 | Exit on stdin close; evaluate the orphan predicate on the existing heartbeat |
| `.opencode/bin/lib/model-server-supervision.cjs` | Modify | 002 | Make respawn-lock staleness orphan-aware, not pid-liveness-only |
| `.opencode/skills/system-spec-kit/scripts/ops/process-sweep.ts` | Modify | 002 | Add the guarded apply path the README records as absent |
| `.opencode/hooks/` session lifecycle | Create | 002 | Invoke the sweep so classification can act |
| Test invocation scripts | Modify | 003 | Bound runtime; enable hanging-process diagnosis |
| `.opencode/bin/git-live-follow.sh` | Modify | 004 | Log on state change; cap the log |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:phase-map -->
## PHASE DOCUMENTATION MAP

> This spec uses phased decomposition. Each phase is an independently executable child spec folder. All implementation details (plan, tasks, checklist, decisions, continuity) live inside the phase children.

| Phase | Folder | Focus | Status |
|-------|--------|-------|--------|
| 1 | 001-production-db-isolation/ | Make the production-DB guard unbypassable from any vitest entry point | Complete |
| 2 | 002-orphan-daemon-reaping/ | Give the existing orphan classification an apply path and a trigger | Complete |
| 3 | 003-test-hang-containment/ | Bound a hung run and make it name its own open handle | Complete |
| 4 | 004-live-follow-log-hygiene/ | Log on state change and cap follower log growth | Complete |

### Phase Transition Rules

- Each phase MUST pass `validate.sh` independently before the next phase begins
- Parent spec tracks aggregate progress via this map
- Use `/speckit:resume [parent-folder]/[NNN-phase]/` to resume a specific phase
- Run `validate.sh --recursive` on parent to validate all phases as integrated unit

### Phase Handoff Criteria

| From | To | Criteria | Verification |
|------|-----|----------|--------------|
| 001-production-db-isolation | 002-orphan-daemon-reaping | A test run started from any entry point cannot resolve the production database dir | Negative control: run from `scripts/` against the pre-fix config and observe the guard fire |
| 002-orphan-daemon-reaping | 003-test-hang-containment | An orphaned launcher is terminated, and its respawn lock reclaimed, without operator action | Negative control: orphan a launcher, confirm reaping and lock release |
| 003-test-hang-containment | 004-live-follow-log-hygiene | A hung suite terminates within its bound and reports the retaining handle | Negative control: a test with a deliberate open handle |
| 004-live-follow-log-hygiene | — | A sustained divergence produces one log entry per state change, and the log cannot grow unbounded | Hold a divergence across many poll intervals and count emitted lines |
<!-- /ANCHOR:phase-map -->

---

<!-- ANCHOR:questions -->
## 4. OPEN QUESTIONS

- Should the phase 002 sweep apply path terminate autonomously at session start, or emit a plan for operator confirmation? The README's "non-destructive" framing is deliberate and reversing it needs an explicit decision.
- Does the phase 001 fail-closed guard belong in the path resolver for all callers, or only under a test-environment condition? Resolver-wide is stronger but has a wider blast radius.
- Phase 003 has no confirmed open handle yet. The hang is reproducible in aggregate but its cause is unproven, so the phase is scoped to containment plus diagnosis rather than a named fix.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Phase children**: See sub-folders `[0-9][0-9][0-9]-*/` for per-phase spec.md, plan.md, tasks.md
- **Parent Spec**: See `../spec.md`
- **Graph Metadata**: See `graph-metadata.json` for `derived.last_active_child_id` pointer
- **Predecessor**: `../035-process-reaper-classification-fix/spec.md` — fixed the classification this packet wires to an apply path
